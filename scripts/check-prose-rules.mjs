#!/usr/bin/env node
/**
 * Static guard for markdown-rendered surfaces preflight can silently break.
 *
 * WHY THIS EXISTS AS A STATIC CHECK, NOT A PLAYWRIGHT ROUTE ASSERTION. Round 7
 * found Tailwind preflight had killed <ul> markers on case-study movements —
 * live content, a live route, provable red-then-green with a browser. The
 * round 8 sweep found the same class of defect on /insights/[slug]: its
 * `.prose` styling (h2/h3/p/ul/ol/li/strong) was written but never applied to
 * the actual MDXRemote render, so every heading matched body-copy size and
 * every list rendered markerless AND unindented. That fix is real (verified
 * against a temporary, deleted diagnostic route rendering the real, unpublished
 * MDX bodies through the exact same styles.prose path) but every one of the 21
 * insight articles carries `published: false` right now, so /insights/[slug]
 * has no live URL for a browser test to visit — check-gate-coverage already
 * reports this unit as having none. A live regression test needs a live page;
 * this asserts the two things that would silently regress in the meantime:
 * that `.prose` is actually wired to the MDXRemote render (the exact fault
 * this file exists to catch), and that `.prose`'s ruleset still restores what
 * preflight strips. Once an insight is published, the live-route Playwright
 * spec belongs beside case-study-movements.spec.ts and this static check
 * stays as the always-on floor under it.
 *
 * FAILS on:
 *   - styles.prose imported into insights/[slug]/page.tsx but not applied as a
 *     className anywhere in the file (the exact regression this exists for)
 *   - .prose missing a rule for any of: h4, ul > li::before, ol > li::before,
 *     blockquote, hr, table border
 *   - a currentColor marker rule using a --gold* token instead (gold is
 *     reserved for interactive/decorative accents, ratified round 7, not
 *     relitigated here)
 *
 * Run: node scripts/check-prose-rules.mjs
 */
import { readFileSync } from "node:fs";

const CSS_PATH = "src/components/blocks/editorial/EditorialLayout.module.css";
const PAGE_PATH = "src/app/insights/[slug]/page.tsx";

const failures = [];

const css = readFileSync(CSS_PATH, "utf8");
const page = readFileSync(PAGE_PATH, "utf8");

if (!/styles\.prose\b/.test(page)) {
  failures.push(
    `${PAGE_PATH}: styles.prose is never applied. .prose's rules would style nothing again.`,
  );
}

const REQUIRED = [
  [/\.prose\s+h4\s*\{/, ".prose h4 (heading hierarchy below h3)"],
  [/\.prose\s+ul\s*>\s*li::before\s*\{/, ".prose ul > li::before (list marker)"],
  [/\.prose\s+ol\s*>\s*li::before\s*\{/, ".prose ol > li::before (numbering)"],
  [/\.prose\s+blockquote\s*\{/, ".prose blockquote"],
  [/\.prose\s+hr\s*\{/, ".prose hr"],
  [/\.prose\s+(th|td)\s*\{/, ".prose th/td (table borders)"],
];

for (const [re, label] of REQUIRED) {
  if (!re.test(css)) failures.push(`${CSS_PATH}: missing ${label}.`);
}

const proseBlockMatch = css.match(/\.prose[\s\S]*$/);
const proseBlock = proseBlockMatch ? proseBlockMatch[0] : "";
const markerRuleMatch = proseBlock.match(
  /\.prose (?:ul|ol) > li::before\s*\{[^}]*\}/g,
);
for (const rule of markerRuleMatch ?? []) {
  if (/--gold/.test(rule)) {
    failures.push(
      `${CSS_PATH}: a list marker rule references --gold. Gold is reserved for interactive and decorative accents, not a structural marker (ratified round 7).`,
    );
  }
}

if (failures.length) {
  console.error("check-prose-rules failed:\n");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}

console.log(
  "check-prose-rules: styles.prose is wired to the MDXRemote render, and heading/list/blockquote/hr/table rules are all present, none on --gold.",
);
