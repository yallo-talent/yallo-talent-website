#!/usr/bin/env node
/**
 * check-redirects — every legacy URL reaches its target in exactly one hop.
 *
 *   node scripts/check-redirects.mjs [baseUrl]
 *
 * WHAT THIS GATE IS FOR. Game plan §7 is the migration's redirect table: the
 * URLs the WordPress yallo.co published, and where each one lands on the new
 * tree. It is the last cutover blocker, and it is the kind of work that looks
 * finished long before it is — a `redirects()` entry that exists is not an
 * entry that answers, and until round 21 nothing had ever asked the server.
 *
 * When it was finally asked, two defects came out at once, both of them
 * class-wide rather than one-off:
 *
 *   1. EVERY legacy URL in its published form took two hops. WordPress served
 *      everything with a trailing slash and Next normalised the slash with its
 *      own 308 before consulting the map, so `/about-us/` went to `/about-us`
 *      and only then to `/about`. A chain costs retrieval eligibility with the
 *      real-time crawlers, which is most of why the map exists.
 *   2. `permanent: true` emits 308, and both game plan §7 and round 21 §5 call
 *      for 301.
 *
 * So this gate asserts the three things that were wrong: the status is 301, the
 * destination is the FINAL URL, and the response after it is not another
 * redirect. It probes each entry twice, bare and trailing-slash, because the
 * trailing-slash form is the one that was actually published.
 *
 * Both this gate and `src/middleware.ts` read `src/data/redirects.mjs`. That is
 * the point: a gate with its own copy of the table proves only that the copy
 * agrees with itself.
 *
 * WHAT THIS GATE THEREFORE DOES NOT PROVE, stated plainly because it was
 * measured. Editing a destination in the table moves the expectation and the
 * behaviour together, so this gate stays green — it tests the MECHANISM (does
 * the server apply the table, in one hop, with the right status), not the
 * EDITORIAL question (is `/about-us` supposed to go to `/about`). That second
 * question is answered by review against game plan §7, and the only honest
 * alternative would be a second copy of the map, which is the defect this
 * design removes. Its red-proof is accordingly a broken mechanism, not a broken
 * row: comment the legacy branch out of the middleware and all 295 probes fail.
 *
 * What it does catch beyond the mechanism: a destination that does not resolve.
 * A mistyped target passes the hop assertions and then fails on a 404, which is
 * the most likely way a row goes wrong in practice.
 *
 * SEPARATE FROM check-no-redirect-hops, which asks the mirror-image question —
 * that no INTERNAL link points at a redirecting URL. Run both: this one proves
 * the legacy estate arrives, that one proves the live estate does not detour.
 */
import { DOUBLE_SLASH_DEFECT, redirectProbes } from "../src/data/redirects.mjs";

const BASE = process.env.BASE_URL ?? process.argv[2] ?? "http://localhost:3115";
const CONCURRENCY = 8;

async function mapLimit(items, limit, fn) {
  let i = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) await fn(items[i++]);
  });
  await Promise.all(workers);
}

const probes = redirectProbes();
const failures = [];

/**
 * A destination that leaves this application entirely.
 *
 * Round 28a introduced the first ones: /join-us and /join-yallo now land on the
 * job board, which is a different system on a different host. Before that every
 * entry in the table was a path this application serves, and the gate was built
 * on that assumption throughout.
 */
function isOffSite(to) {
  return /^https?:\/\//.test(to);
}

/**
 * What a Location header points at, compared like for like with the entry.
 *
 * PATHNAME FOR AN INTERNAL TARGET, THE WHOLE URL FOR AN OFF-SITE ONE. This used
 * to reduce every Location to a pathname, which is right while every
 * destination is a path and silently wrong the moment one is not:
 * `https://www.yallo.co/jobs` reduced to `/jobs`, which matched no entry, and
 * the gate reported a redirect pointing somewhere it was not. The comparison has
 * to be made in the same units the table is written in.
 */
function landedFor(location, to) {
  if (!location) return null;
  try {
    const url = new URL(location, BASE);
    return isOffSite(to) ? url.toString() : url.pathname;
  } catch {
    return location;
  }
}

/** Kept for the declared-exception walk below, which is internal by definition. */
function locationPath(location) {
  return landedFor(location, "/");
}

await mapLimit(probes, CONCURRENCY, async ({ from, to, why }) => {
  const res = await fetch(`${BASE}${from}`, { redirect: "manual" }).catch(
    (err) => ({ error: err }),
  );

  if (!res || res.error) {
    failures.push(`${from}\n      no response from ${BASE}. ${why}`);
    return;
  }

  if (res.status !== 301) {
    failures.push(
      `${from}\n      answered ${res.status}, expected 301 -> ${to}.\n` +
        `      ${why}`,
    );
    return;
  }

  const landed = landedFor(res.headers.get("location"), to);
  if (landed !== to) {
    failures.push(
      `${from}\n      301s to ${landed}, expected ${to}.\n      ${why}`,
    );
    return;
  }

  /* AN OFF-SITE DESTINATION IS ASSERTED, NOT FOLLOWED, and the line is drawn
     deliberately rather than for convenience. Everything below this point asks
     "and does that page exist", by fetching it. For a host this repository does
     not control, that question makes the gate's verdict depend on a third
     party's uptime: the board being slow, rate-limiting CI's egress or briefly
     down would fail a pull request that changed nothing. Worse, it would fail
     intermittently, which is how a gate earns a reputation for flaking and gets
     skipped.

     What is still asserted, and it is the part this repository owns: the
     redirect exists, answers 301, and names EXACTLY the URL the table names,
     character for character including host and scheme. What is given up is
     reachability of a system somebody else operates, which no gate in this
     repository can honestly promise. */
  if (isOffSite(to)) return;

  /* The one-hop assertion. A 301 to a URL that itself redirects is a chain,
     and the map's job is to name the final destination. The same response also
     answers the other question worth asking of a destination: does it exist? A
     mistyped target 301s perfectly well and then 404s. */
  const next = await fetch(`${BASE}${landed}`, { redirect: "manual" }).catch(
    () => null,
  );
  if (!next) return;
  if (next.status >= 300 && next.status < 400) {
    failures.push(
      `${from}\n      301s to ${landed}, which itself answers ${next.status} -> ` +
        `${locationPath(next.headers.get("location"))}.\n` +
        `      That is two hops. Point the entry at the final URL.`,
    );
    return;
  }
  if (!next.ok) {
    failures.push(
      `${from}\n      301s to ${landed}, which answers ${next.status}. A legacy ` +
        `URL must land on a page that exists.\n      ${why}`,
    );
  }
});

/* ---------------------------------------------------------------------------
   The declared exception. Walked, not skipped: a gate that quietly drops the
   one URL it cannot satisfy is worse than no gate. This asserts the chain is no
   longer than declared and terminates on the right page.
   --------------------------------------------------------------------------- */
const { from, to, maxHops, why } = DOUBLE_SLASH_DEFECT;
let at = from;
const chain = [from];
for (let hop = 0; hop < maxHops + 1; hop++) {
  const res = await fetch(`${BASE}${at}`, { redirect: "manual" }).catch(() => null);
  if (!res) break;
  if (res.status < 300 || res.status >= 400) break;
  at = locationPath(res.headers.get("location"));
  chain.push(at);
}
const hops = chain.length - 1;
if (at !== to || hops > maxHops) {
  failures.push(
    `${from}\n      resolved as ${chain.join(" -> ")} (${hops} hop(s)), expected ` +
      `at most ${maxHops} ending at ${to}.\n      ${why}`,
  );
}

if (failures.length > 0) {
  console.error(`\ncheck-redirects FAILED with ${failures.length} problem(s):\n`);
  for (const f of failures.sort()) console.error(`  ${f}\n`);
  process.exit(1);
}

console.log(
  `\nEvery legacy URL resolves in one 301 hop: ${probes.length} probe(s) across ` +
    `the game plan §7 map, each checked bare and in its published trailing-slash form.`,
);
console.log(
  `\nOne declared exception, walked and within its limit:\n  ${chain.join(" -> ")}` +
    `\n  ${why}\n  Collapsing this to one hop needs an edge rule at cutover, not app code.`,
);
