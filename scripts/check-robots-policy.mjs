#!/usr/bin/env node
/**
 * check:robots — the robots.txt a build actually emits, asserted line for line.
 *
 * WHY THIS EXISTS. `robots.ts` branches on `isProductionHost`, which is
 * `NEXT_PUBLIC_SITE_URL === productionUrl`, and that variable is inlined at
 * BUILD time. Every local build and every preview therefore exercises only the
 * blanket-disallow branch. Until round 17 the production branch had been read
 * in review and never once executed: the `/downloads/` disallow that keeps the
 * gated research PDF out of the index was a claim about source code, not a
 * measured configuration. A crawler directive nobody has run is not a
 * configuration.
 *
 * WHAT IT ASSERTS. Both branches, from the same two JSON files robots.ts reads,
 * so there is no second copy of the policy for the two to drift apart on:
 *
 *   production branch  — `*` and every named crawler carry `Allow: /` plus
 *                        EVERY disallowed path, and a `Sitemap:` line points at
 *                        the production origin.
 *   every other host   — `*` and every named crawler carry `Disallow: /`, no
 *                        `Allow:` line survives anywhere, and there is no
 *                        `Sitemap:` line to advertise a host that must not be
 *                        indexed.
 *
 * WHICH BRANCH IS EXPECTED comes from the gate's own `NEXT_PUBLIC_SITE_URL`,
 * the same variable the build consumed. Run it with the environment the build
 * ran with. A mismatch between the two is precisely the failure being guarded:
 * a production build that emitted the placeholder's lockdown, or a preview that
 * emitted the production allow-list, both fail here and say which.
 *
 * WHERE THE OUTPUT COMES FROM, in order:
 *   1. a base URL, if one is given   — `node scripts/check-robots-policy.mjs http://localhost:3115`
 *   2. otherwise the built artefact  — `.next/server/app/robots.txt.body`
 *
 * Both are real output. The artefact is what the build wrote and is what CI can
 * assert without starting a server; the URL form is what proves a running
 * server serves it.
 *
 *   NEXT_PUBLIC_SITE_URL=https://yallo.co pnpm build && pnpm check:robots
 */
import { readFileSync } from "node:fs";

const families = JSON.parse(
  readFileSync(
    new URL("../src/lib/crawler-families.json", import.meta.url),
    "utf8",
  ),
);
const policy = JSON.parse(
  readFileSync(new URL("../src/lib/robots-policy.json", import.meta.url), "utf8"),
);

const TOKENS = ["*", ...families.crawlers.map((c) => c.token)];
const DIST = process.env.NEXT_DIST_DIR ?? ".next";
const BASE =
  process.argv.find((a) => a.startsWith("http")) ?? process.env.BASE_URL ?? null;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
const expectProduction = siteUrl === policy.productionUrl;

/* ---------------------------------------------------------------- the output */

let text;
let origin;
if (BASE) {
  origin = `${BASE}/robots.txt`;
  const res = await fetch(origin).catch(() => null);
  if (!res?.ok) {
    console.error(
      `\ncheck:robots FAILED — could not read ${origin}` +
        `${res ? ` (HTTP ${res.status})` : ""}.\n` +
        `  Start the server on that port, or drop the URL argument to assert\n` +
        `  the built artefact instead.\n`,
    );
    process.exit(1);
  }
  text = await res.text();
} else {
  origin = `${DIST}/server/app/robots.txt.body`;
  try {
    text = readFileSync(new URL(`../${origin}`, import.meta.url), "utf8");
  } catch {
    console.error(
      `\ncheck:robots FAILED — no built robots.txt at ${origin}.\n` +
        `  robots.txt is emitted by \`next build\`. Build first, or pass a base URL.\n`,
    );
    process.exit(1);
  }
}

/* ------------------------------------------------------------------- parsing */

/**
 * robots.txt into groups keyed by user-agent token.
 *
 * Deliberately a parse rather than a substring search. `Disallow: /` and
 * `Disallow: /api/` both contain the string "Disallow: /", so a grep-shaped
 * check cannot tell a blanket lockdown from a path exclusion — which is the
 * one distinction this gate exists to make.
 */
function parse(src) {
  const groups = new Map();
  let current = [];
  for (const raw of src.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const [field, ...rest] = line.split(":");
    const key = field.trim().toLowerCase();
    const value = rest.join(":").trim();
    if (key === "user-agent") {
      current = groups.get(value) ?? [];
      groups.set(value, current);
      continue;
    }
    current.push({ key, value });
  }
  return groups;
}

const groups = parse(text);
const sitemaps = [...text.matchAll(/^\s*sitemap\s*:\s*(\S+)/gim)].map(
  (m) => m[1],
);
const failures = [];

/* ---------------------------------------------------------------- assertions */

for (const token of TOKENS) {
  const rules = groups.get(token);
  if (!rules) {
    failures.push(
      `${token} has no group in robots.txt.\n` +
        `      Every crawler in src/lib/crawler-families.json is named by policy,\n` +
        `      because a crawler reading only its own token may not honour \`*\`.`,
    );
    continue;
  }
  const allow = rules.filter((r) => r.key === "allow").map((r) => r.value);
  const disallow = rules.filter((r) => r.key === "disallow").map((r) => r.value);

  if (expectProduction) {
    if (!allow.includes("/")) {
      failures.push(
        `${token} is missing \`Allow: /\`.\n` +
          `      NEXT_PUBLIC_SITE_URL is ${siteUrl}, so this build is production\n` +
          `      and the site must be crawlable.`,
      );
    }
    for (const path of policy.disallow) {
      if (!disallow.includes(path)) {
        failures.push(
          `${token} does not disallow ${path}.\n` +
            `      src/lib/robots-policy.json lists it. ${
              path === "/downloads/"
                ? "That directory holds the gated research PDF; indexing it routes\n      search traffic past the capture form straight to the file."
                : "The policy is the source; the emitted file is what crawlers read."
            }`,
        );
      }
    }
    if (disallow.includes("/")) {
      failures.push(
        `${token} carries a blanket \`Disallow: /\` in a production build.\n` +
          `      This would delist the entire site.`,
      );
    }
  } else {
    if (!disallow.includes("/")) {
      failures.push(
        `${token} is missing the blanket \`Disallow: /\`.\n` +
          `      NEXT_PUBLIC_SITE_URL is ${siteUrl || "(unset)"}, which is not the\n` +
          `      production origin, so this host must not be indexable at all.`,
      );
    }
    if (allow.length > 0) {
      failures.push(
        `${token} carries \`Allow: ${allow.join(", ")}\` on a non-production host.\n` +
          `      A permitted path on the placeholder or a preview is an indexable\n` +
          `      duplicate of the production site.`,
      );
    }
  }
}

const expectedSitemap = expectProduction
  ? [`${policy.productionUrl}/sitemap.xml`]
  : [];
if (JSON.stringify(sitemaps) !== JSON.stringify(expectedSitemap)) {
  failures.push(
    expectProduction
      ? `Sitemap line is ${sitemaps.length ? sitemaps.join(", ") : "absent"}, expected ${expectedSitemap[0]}.`
      : `Sitemap line present (${sitemaps.join(", ")}) on a non-production host.\n` +
          `      A host that disallows everything must not advertise a route list.`,
  );
}

/* ------------------------------------------------------------------- verdict */

if (failures.length > 0) {
  console.error(
    `\ncheck:robots FAILED with ${failures.length} problem(s) in ${origin}\n` +
      `  branch asserted: ${expectProduction ? "production" : "non-production"} (NEXT_PUBLIC_SITE_URL=${siteUrl || "unset"})\n`,
  );
  for (const f of failures) console.error(`  ${f}\n`);
  process.exit(1);
}

console.log(
  `\ncheck:robots passed — ${origin}\n` +
    `  branch: ${expectProduction ? "production" : "non-production"} (NEXT_PUBLIC_SITE_URL=${siteUrl || "unset"})\n` +
    `  ${TOKENS.length} user-agent group(s) asserted: ${TOKENS.join(", ")}\n` +
    (expectProduction
      ? `  each with Allow: / and ${policy.disallow.length} disallowed path(s): ${policy.disallow.join(", ")}\n` +
        `  sitemap: ${sitemaps[0]}\n`
      : `  each with a blanket Disallow: / and no Allow: line, no sitemap advertised\n`),
);
