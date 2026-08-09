#!/usr/bin/env node
/**
 * The discovery surfaces must name exactly the rows that are published.
 *
 * Round 25b §0.3: after the flip to database-served content, `sitemap.xml` and
 * `llms.txt` are generated from a query rather than from a directory listing.
 * A route that is in the sitemap and not published is a 404 offered to a
 * crawler; a published row missing from the sitemap is content nobody can find.
 * Counting is not enough — this compares the slug SETS, because two wrong
 * counts can agree.
 *
 * Run: DATABASE_URL=postgres://... node scripts/check-published-counts.mjs [base-url]
 * Exit 0 only when both surfaces name exactly the published slugs.
 */

import { neon } from "@neondatabase/serverless";

const BASE = process.argv[2] ?? "https://yallo.co";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set.");
  process.exit(2);
}
const sql = neon(url);

/**
 * Slugs a text surface links to DIRECTLY under one route prefix.
 *
 * THE NEGATIVE LOOKAHEAD IS LOAD-BEARING, and it was missing. Without it,
 * `/insights/platform/sap` matched as an article slug called "platform": the
 * pattern stopped at the second slash and reported a taxonomy segment as a
 * published article. It went unnoticed because zero articles are published and
 * the old three-article threshold meant zero taxonomy landings existed, so both
 * sets were empty and agreed. Round 25c gives every taxonomy value a landing
 * page, which would have turned a latent bug into three phantom "published"
 * slugs on every run.
 */
function slugsIn(text, prefix) {
  const out = new Set();
  const pattern = new RegExp(`${prefix}/([a-z0-9-]+)(?![a-z0-9\\-/])`, "g");
  for (const m of text.matchAll(pattern)) {
    out.add(m[1]);
  }
  return out;
}

/** Every `/insights/{kind}/{slug}` a surface names. */
function taxonomyLandingsIn(text) {
  const out = new Set();
  const pattern =
    /\/insights\/(industry|platform|capabilities)\/([a-z0-9-]+)(?![a-z0-9\-/])/g;
  for (const m of text.matchAll(pattern)) out.add(`${m[1]}/${m[2]}`);
  return out;
}

async function fetchText(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`${BASE}${path} answered HTTP ${res.status}`);
  return res.text();
}

const failures = [];

function compare(surface, prefix, found, expected) {
  const missing = [...expected].filter((s) => !found.has(s)).sort();
  const extra = [...found].filter((s) => !expected.has(s)).sort();
  if (missing.length === 0 && extra.length === 0) {
    console.log(`  OK   ${surface} ${prefix}: ${expected.size} slug(s), set-identical to published rows`);
    return;
  }
  failures.push(surface + prefix);
  console.log(`  FAIL ${surface} ${prefix}`);
  if (missing.length) console.log(`      published but absent: ${missing.join(", ")}`);
  if (extra.length) console.log(`      present but not published: ${extra.join(", ")}`);
}

const [articles, caseStudies] = await Promise.all([
  sql`select slug from articles where status = 'published'`,
  sql`select slug from case_studies where status = 'published'`,
]);
const expectArticles = new Set(articles.map((r) => r.slug));
const expectStudies = new Set(caseStudies.map((r) => r.slug));

console.log(`Published rows: ${expectArticles.size} article(s), ${expectStudies.size} case study/studies.`);
console.log(`Checking ${BASE}\n`);

const sitemap = await fetchText("/sitemap.xml");
const llms = await fetchText("/llms.txt");

compare("sitemap.xml", "/case-studies", slugsIn(sitemap, "/case-studies"), expectStudies);
compare("sitemap.xml", "/insights", slugsIn(sitemap, "/insights"), expectArticles);
compare("llms.txt", "/case-studies", slugsIn(llms, "/case-studies"), expectStudies);
compare("llms.txt", "/insights", slugsIn(llms, "/insights"), expectArticles);

/**
 * The taxonomy landings, round 25c.
 *
 * All twenty-one routes exist whatever is published — canon A5 calls them real
 * landing pages, and one that appears and vanishes with the publishing state is
 * a filtered view with a threshold. What the discovery surfaces may name is the
 * subset with at least one published article behind it: a landing page with
 * nothing to read is a thin page, and twenty-one of them is a thin-content
 * problem rather than twenty-one search surfaces.
 */
const taggedValues = new Set();
/* Three explicit queries rather than one with the column name interpolated.
   A column name is not a parameter, and building it by string concatenation is
   the shape that becomes an injection the day the list stops being a literal. */
for (const r of await sql`select distinct unnest(industry) as value from articles where status = 'published'`) {
  taggedValues.add(`industry/${r.value}`);
}
for (const r of await sql`select distinct unnest(platform) as value from articles where status = 'published'`) {
  taggedValues.add(`platform/${r.value}`);
}
for (const r of await sql`select distinct unnest(discipline) as value from articles where status = 'published'`) {
  taggedValues.add(`capabilities/${r.value}`);
}
compare(
  "sitemap.xml",
  " taxonomy landings",
  taxonomyLandingsIn(sitemap),
  taggedValues,
);
compare(
  "llms.txt",
  " taxonomy landings",
  taxonomyLandingsIn(llms),
  taggedValues,
);

if (failures.length) {
  console.error(`\n${failures.length} surface(s) disagree with the published rows.`);
  process.exit(1);
}
console.log("\nBoth discovery surfaces name exactly the published rows.");
