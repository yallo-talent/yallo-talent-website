#!/usr/bin/env node
/**
 * check:crawlers — can the retrieval layer actually reach yallo.co?
 *
 * WHY THIS RUNS TODAY, AGAINST THE LIVE SITE. From 15 September 2026 Cloudflare
 * evaluates multi-purpose crawlers under ALL of their behaviours, so a zone
 * blocking the Training category also blocks Googlebot, Applebot and BingBot —
 * including via the legacy one-click "Block AI Bots" toggle. The live WordPress
 * site sits behind the same Cloudflare zone as the future site, so the posture
 * is measurable now rather than after cutover, and if the toggle is on the fix
 * is one click with no build dependency.
 *
 * Nobody can answer this from the repository and nobody should have to remember
 * it: a zone setting can be changed by anyone at any time, and it is invisible
 * to every other gate on this project. Hence a gate, run on a cadence.
 *
 * TWO FAILURE MODES THIS IS BUILT AROUND, both of which a naive check misses:
 *
 *   1. A CLOUDFLARE CHALLENGE RETURNS 200. An interstitial is a successful
 *      response carrying a page that is not the page. So this asserts on a
 *      known string in the BODY and on the `cf-mitigated` header, and treats a
 *      200 without the marker as a block.
 *   2. THE PLACEHOLDER MAY NOT BE BEHIND CLOUDFLARE AT ALL, in which case
 *      robots.ts is the only control there. So the placeholder host is probed
 *      too and its CDN reported either way.
 *
 *   node scripts/check-crawler-access.mjs
 *   node scripts/check-crawler-access.mjs --json    # dated artefact
 */
import { readFileSync } from "node:fs";

/**
 * The crawler set, from the same file src/app/robots.ts writes its policy from.
 *
 * One list, because a robots policy that names a crawler this never tests is a
 * policy nobody has checked, and a probe testing a crawler robots.txt does not
 * name measures something the site never claimed.
 *
 * The CATEGORY drives what fails: per the round 7 ruling, a Search or Agent
 * member that cannot reach the production host is a failure, and Training is
 * reported rather than failed. Not indifference to Training — the ratified
 * posture allows all three — but blocking Training is caught here through its
 * effect on Googlebot, which is the part that costs Yallo traffic.
 *
 * The control is appended last: it identifies the probe honestly and separates
 * "this host blocks crawlers" from "this host is not serving".
 */
const families = JSON.parse(
  readFileSync(
    new URL("../src/lib/crawler-families.json", import.meta.url),
    "utf8",
  ),
);
const CRAWLERS = [...families.crawlers, families.control];

/**
 * A marker that appears in the real page and not in an interstitial.
 *
 * Deliberately something structural rather than a phrase from the copy, so a
 * content edit does not read as a crawler block.
 */
/**
 * PROBE_PRODUCTION_URL overrides the production target.
 *
 * The cadence this gate is written for is "once now, once before cutover, once
 * immediately after, then in CI against production", and the host changes at
 * cutover. It is also how the gate is watched to fail: point it at a host that
 * genuinely refuses one user-agent and confirm it names that one.
 */
const HOSTS = [
  {
    name: "production",
    url: process.env.PROBE_PRODUCTION_URL ?? "https://yallo.co/",
    marker: /wp-content|<title>[^<]*Yallo/i,
    /* The production host is what the ruling gates on. */
    gated: true,
  },
  {
    name: "placeholder",
    url: "https://talent.yallo.co/",
    marker: /wp-content|<title>/i,
    /* Reported, not gated: the placeholder is deliberately not indexable, and
       robots.ts is the control there. What matters is whether it sits behind
       Cloudflare at all, which the CDN column answers. */
    gated: false,
  },
];

/** Cloudflare interstitials, in the forms they actually ship. */
const CHALLENGE = [
  /just a moment/i,
  /attention required/i,
  /cf[-_]chl/i,
  /enable javascript and cookies to continue/i,
  /__cf_chl/i,
  /cf-browser-verification/i,
];

const JSON_OUT = process.argv.includes("--json");
const results = [];

async function probe(host, crawler) {
  const started = Date.now();
  try {
    const res = await fetch(host.url, {
      headers: {
        "user-agent": crawler.ua,
        accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(30_000),
    });
    const body = await res.text();
    const challenge =
      res.headers.get("cf-mitigated") === "challenge" ||
      CHALLENGE.some((re) => re.test(body));
    return {
      host: host.name,
      url: res.url,
      token: crawler.token,
      category: crawler.category,
      status: res.status,
      bytes: body.length,
      cdn: res.headers.get("server") ?? "",
      cfRay: Boolean(res.headers.get("cf-ray")),
      cfMitigated: res.headers.get("cf-mitigated") ?? "",
      challenge,
      /* The real page, not merely a 200. */
      served: res.ok && !challenge && host.marker.test(body),
      ms: Date.now() - started,
    };
  } catch (err) {
    return {
      host: host.name,
      url: host.url,
      token: crawler.token,
      category: crawler.category,
      status: 0,
      bytes: 0,
      cdn: "",
      cfRay: false,
      cfMitigated: "",
      challenge: false,
      served: false,
      error: String(err instanceof Error ? err.message : err),
      ms: Date.now() - started,
    };
  }
}

/**
 * ONE RETRY, and the retry REPORTS ITSELF.
 *
 * Round 17: three runs of this gate against the live zone, and one of them
 * refused ChatGPT-User alone while the other two served all fifteen. That is a
 * transient at the CDN, not a posture change — but with no retry it fails a
 * CUTOVER gate on a single lost request, and a cutover gate that goes red for no
 * reason is one somebody starts rerunning until it is green, which is the same
 * thing as not having it.
 *
 * A blind retry would be worse than none: it would hide a genuinely intermittent
 * block, which is exactly what a partially-configured zone looks like. So the
 * second attempt is recorded on the result and printed, and the run says which
 * crawlers needed one. Two refusals in a row still fails.
 */
for (const host of HOSTS) {
  for (const crawler of CRAWLERS) {
    let result = await probe(host, crawler);
    /* Only the GATED host is retried. The placeholder is not serving to anyone
       right now, so retrying its fifteen probes adds thirty seconds to a gate and
       proves nothing the control user-agent has not already said. */
    if (host.gated && !result.served) {
      await new Promise((r) => setTimeout(r, 2_000));
      const second = await probe(host, crawler);
      result = second.served
        ? { ...second, retried: true, firstStatus: result.status }
        : { ...second, retried: true, firstStatus: result.status, bothFailed: true };
    }
    results.push(result);
    /* One request per user-agent, spaced. This is a probe, not a load test. */
    await new Promise((r) => setTimeout(r, 250));
  }
}

const retried = results.filter((r) => r.retried && r.served);
if (retried.length > 0) {
  console.log(
    `\n  ${retried.length} probe(s) needed a second attempt and then succeeded:\n` +
      retried
        .map(
          (r) =>
            `    ${r.host} / ${r.token}: first attempt ${r.firstStatus || "no response"}, retry served`,
        )
        .join("\n") +
      "\n  Reported rather than hidden: an intermittent refusal is what a\n" +
      "  partially-configured zone looks like, and it is worth watching across runs.",
  );
}

if (JSON_OUT) {
  console.log(
    JSON.stringify({ probedAt: new Date().toISOString(), results }, null, 2),
  );
  process.exit(0);
}

/* The matrix is printed whether it passes or fails: the posture is a dated
   artefact, not a pass/fail bit. */
let failed = false;
for (const host of HOSTS) {
  const rows = results.filter((r) => r.host === host.name);
  const cdn = rows.find((r) => r.cdn)?.cdn || "unknown";
  const behindCloudflare = rows.some((r) => r.cfRay);
  /* The control decides whether anything else on this host means anything. If
     the honestly-identified probe is refused the same way every crawler is,
     the host is not serving the page to ANYONE and the result says nothing
     about crawler policy. Without this the placeholder's plain 404 reads as
     fifteen crawler blocks, which is the opposite of what it is. */
  const control = rows.find((r) => r.category === "control");
  const hostServing = Boolean(control?.served);
  console.log(
    `\n${host.name} — ${host.url}  [cdn: ${cdn}${behindCloudflare ? ", cf-ray present" : ", NO cf-ray"}]${host.gated ? "" : "  (reported, not gated)"}`,
  );
  if (!hostServing) {
    console.log(
      `  The control user-agent was also refused (${control?.status ?? "no response"}), so this host is not serving the page to anyone. ` +
        "Nothing below is a statement about crawler policy.",
    );
  }
  console.log(
    `  ${"user-agent".padEnd(20)}${"cat".padEnd(10)}${"status".padStart(7)}${"bytes".padStart(9)}  served  note`,
  );
  for (const r of rows) {
    const note = r.error
      ? `error: ${r.error}`
      : r.challenge
        ? `CHALLENGE${r.cfMitigated ? ` (cf-mitigated: ${r.cfMitigated})` : ""}`
        : r.served
          ? ""
          : r.status === 200
            ? "200 but the page marker is absent"
            : "";
    const gates =
      host.gated &&
      hostServing &&
      (r.category === "search" || r.category === "agent");
    const bad = !r.served && hostServing;
    if (gates && !r.served) failed = true;
    console.log(
      `  ${(bad ? "!" : " ") + r.token.padEnd(19)}${r.category.padEnd(10)}${String(r.status).padStart(7)}${String(r.bytes).padStart(9)}  ${r.served ? "yes   " : "NO    "}  ${note}`,
    );
  }
  if (host.gated && !hostServing) {
    failed = true;
    console.error(
      "  The production host must serve its own page. Either the site is down or the marker no longer matches.",
    );
  }
  const training = hostServing
    ? rows.filter((r) => r.category === "training" && !r.served)
    : [];
  if (training.length) {
    console.log(
      `  [warn] ${training.length} Training-family crawler(s) not served: ${training.map((r) => r.token).join(", ")}. ` +
        "Reported rather than failed, but from 15 Sep 2026 a Training block on this zone takes Googlebot with it.",
    );
  }
  if (host.gated && !behindCloudflare) {
    console.log(
      "  [warn] no cf-ray on any response — this host may not be behind Cloudflare, in which case robots.ts is the only control.",
    );
  }
}

if (failed) {
  console.error(
    "\ncheck:crawlers FAILED — a Search or Agent crawler cannot reach the production host.",
  );
  process.exit(1);
}
console.log("\ncheck:crawlers passed.");
