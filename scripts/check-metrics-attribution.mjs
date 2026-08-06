#!/usr/bin/env node
/**
 * check:metrics-attribution — no page publishes the four figures unattributed,
 * and no attribution names a record or a date the source file no longer holds.
 *
 * WHY. Round 17 §2.2 ruled one compact dated attribution line beneath the
 * metrics block: canon requires a visible source, the game plan requires an
 * explicit "as at" date, and the Phase 1 benchmark's central finding was that
 * every firm in this category publishes claims nobody can attribute. A dated
 * first-party number is the one proof asset the competitors do not have. Four
 * repeated "Yallo internal record" labels would have been worse than none; one
 * dated line is the differentiator.
 *
 * WHAT IT ASSERTS, all of it derived from content/metrics.yaml — no expected
 * string is written here, because a gate holding its own copy of the line is the
 * defect it exists to catch:
 *
 *   1. COVERAGE. Every page in /sitemap.xml that publishes the block carries an
 *      attribution line. Three of the four templates are protected by a required
 *      prop and the compiler; a NEW template rendering the figures its own way is
 *      invisible to tsc, and "the rule held, the list of surfaces did not" is
 *      this build's oldest failure shape.
 *   2. AGREEMENT. Every such page carries the SAME line. Two surfaces attributing
 *      the same four numbers differently is worse than one attributing none.
 *   3. PROVENANCE. The line names each record's kind — delivery, shortlist,
 *      placement, programme — read out of the `source` fields, and carries the
 *      day, month and year of `asAt`. This is what catches the refresh that moves
 *      a value or renames a record and leaves the visible attribution behind.
 *
 * Server HTML, deliberately: a source line that only appears after hydration is
 * not there for the crawler the attribution exists to convince.
 *
 *   node scripts/check-metrics-attribution.mjs [baseUrl]
 */
import { readFileSync } from "node:fs";
import { load as loadHtml } from "cheerio";
import { parse as parseYaml } from "yaml";

const BASE = process.env.BASE_URL ?? process.argv[2] ?? "http://localhost:3100";
const CONCURRENCY = 8;

const doc = parseYaml(
  readFileSync(new URL("../content/metrics.yaml", import.meta.url), "utf8"),
);
const asAt =
  doc.asAt instanceof Date ? doc.asAt.toISOString().slice(0, 10) : doc.asAt;
const sources = doc.metrics.map((m) => String(m.source));

/**
 * How a page is recognised as publishing the block: its metric LABELS, not its
 * values. "50" and "2" appear in unrelated copy all over the site; "Programmes
 * staffed" appears where the block is. Two of four is the threshold, so a page
 * quoting one label in prose is not mistaken for the block.
 */
const LABELS = doc.metrics.map((m) => String(m.label));

/**
 * The record kinds, out of the `source` strings rather than named here.
 * `Yallo internal delivery record, Q1–Q2 2026` -> `delivery`.
 */
const KINDS = [
  ...new Set(
    sources
      .map((s) => /^.+? ([a-z-]+) (?:record|register)s?\b/i.exec(s)?.[1])
      .filter(Boolean)
      .map((k) => k.toLowerCase()),
  ),
];

/** The owner every source shares — the line has to open with it. */
const OWNER = (() => {
  const words = sources.map((s) => s.split(/\s+/));
  const shared = [];
  for (let i = 0; i < words[0].length; i++) {
    const w = words[0][i];
    if (!words.every((ws) => ws[i] === w)) break;
    shared.push(w);
  }
  return shared.join(" ");
})();

/**
 * The date's three parts, checked independently of how the line formats them.
 * Asserting a formatted string would put this gate's own copy of the date format
 * beside the composer's, which is the duplication being avoided everywhere else
 * in this file.
 */
const date = new Date(`${asAt}T00:00:00Z`);
const DATE_PARTS = [
  String(date.getUTCDate()),
  date.toLocaleDateString("en-GB", { month: "long", timeZone: "UTC" }),
  String(date.getUTCFullYear()),
];

if (KINDS.length === 0 || OWNER === "" || Number.isNaN(date.getTime())) {
  console.error(
    "\ncheck:metrics-attribution FAILED — content/metrics.yaml gives this gate\n" +
      "  nothing to assert against. Every `source` must read\n" +
      "  `<owner> <kind> <record|register>[, <period>]`, all four must share one\n" +
      "  owner, and `asAt` must be a real date. See src/lib/metrics-attribution.ts.\n",
  );
  process.exit(1);
}

async function mapLimit(items, limit, fn) {
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (i < items.length) await fn(items[i++]);
    }),
  );
}

let routes = [];
try {
  const xml = await fetch(`${BASE}/sitemap.xml`).then((r) => r.text());
  routes = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (m) => new URL(m[1]).pathname.replace(/\/$/, "") || "/",
  );
} catch {
  console.error(
    `\ncheck:metrics-attribution FAILED — could not read ${BASE}/sitemap.xml.\n` +
      "  Start the server first, or pass its base URL.\n",
  );
  process.exit(1);
}

const failures = [];
/** Rendered attribution line -> the pages carrying it. */
const lines = new Map();

await mapLimit(routes, CONCURRENCY, async (path) => {
  const html = await fetch(`${BASE}${path}`)
    .then((r) => (r.ok ? r.text() : null))
    .catch(() => null);
  if (!html) return;
  const hits = LABELS.filter((l) => html.includes(l));
  if (hits.length < 2) return;

  const $ = loadHtml(html);
  /* The line is a <p> opening with the shared owner. Matched on its text, not on
     a CSS-module class name: those are hashed per build and three templates
     style it with three different class names. */
  const candidates = $("p")
    .toArray()
    .map((el) => $(el).text().trim())
    .filter((t) => t.startsWith(OWNER) && /\bas at\b/i.test(t));

  if (candidates.length === 0) {
    failures.push(
      `${path} publishes ${hits.length} of the four metrics and carries no attribution line.\n` +
        `      Expected a paragraph opening "${OWNER}" and naming an "as at" date.\n` +
        `      Import \`metricsAttribution\` from @/data/metrics and render it beneath\n` +
        `      the block. Round 17 §2.2: not four labels, and not silence.`,
    );
    return;
  }

  const line = candidates[0];
  const missingKind = KINDS.filter(
    (k) => !new RegExp(`\\b${k}\\b`, "i").test(line),
  );
  const missingDate = DATE_PARTS.filter((p) => !line.includes(p));

  if (missingKind.length > 0) {
    failures.push(
      `${path}'s attribution does not name ${missingKind.join(", ")}.\n` +
        `      content/metrics.yaml sources that record. Rendered: "${line}"`,
    );
  }
  if (missingDate.length > 0) {
    failures.push(
      `${path}'s attribution is not dated ${asAt} (missing ${missingDate.join(", ")}).\n` +
        `      A first-party figure without its real pull date is the claim the\n` +
        `      Phase 1 benchmark found everyone else making. Rendered: "${line}"`,
    );
  }

  lines.set(line, [...(lines.get(line) ?? []), path]);
});

if (lines.size > 1) {
  const variants = [...lines]
    .map(([line, paths]) => `"${line}"\n        on ${paths.length} page(s), e.g. ${paths.sort()[0]}`)
    .join("\n      ");
  failures.push(
    `The metrics block is attributed ${lines.size} different ways across the site.\n` +
      `      One block, one line — all of them compose from the same file, so a\n` +
      `      divergence means a template writes its own.\n      ${variants}`,
  );
}

if (failures.length > 0) {
  console.error(
    `\ncheck:metrics-attribution FAILED with ${failures.length} problem(s):\n`,
  );
  for (const f of failures.sort()) console.error(`  ${f}\n`);
  process.exit(1);
}

const total = [...lines.values()].reduce((n, ps) => n + ps.length, 0);
if (total === 0) {
  console.error(
    "\ncheck:metrics-attribution FAILED — no page in the sitemap publishes the\n" +
      "  metrics block. Either the block is gone from the whole site, or this gate\n" +
      "  has gone blind and would pass whatever happened next.\n",
  );
  process.exit(1);
}

console.log(
  `\nEvery page publishing the metrics block carries one dated attribution: ${total} page(s).\n` +
    `  "${[...lines.keys()][0]}"\n` +
    `  records asserted: ${KINDS.join(", ")} · dated ${DATE_PARTS.join(" ")}\n`,
);
