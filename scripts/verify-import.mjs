#!/usr/bin/env node
/**
 * The import is verified by RENDERING, not by counting rows.
 *
 * Round 25 §2: every published case study must render byte-comparable prose to
 * what production serves today, and any divergence stops the import rather than
 * being accepted. So this opens both pages — the local build reading the
 * database, and https://yallo.co reading the MDX files — pulls the prose out of
 * the same three template slots on each, and compares the bytes.
 *
 * WHY THE RENDERED PROSE AND NOT THE SOURCE. A markdown-to-TipTap converter can
 * be perfectly faithful and still change the page: list tightness alone moves
 * every list from one newline between items to two. Comparing documents would
 * have passed that; comparing what a reader copies off the page does not.
 *
 * WHY THE MOVEMENT SLOTS AND NOT `main`. The rest of the page carries the
 * client rail, the related studies and the brief CTA, all of which legitimately
 * differ between two builds. The movements are the study's own words.
 *
 * Usage:
 *   node scripts/verify-import.mjs http://localhost:3115 [https://yallo.co]
 * Exit 0 only when every published study matches on every slot.
 */

import { chromium } from "@playwright/test";
import { prose, slugsFromIndex } from "./lib/case-study-prose.mjs";

const LOCAL = process.argv[2] ?? "http://localhost:3115";
const PROD = process.argv[3] ?? "https://yallo.co";

function diff(name, a, b) {
  if (Array.isArray(a) || Array.isArray(b)) {
    const A = a ?? [];
    const B = b ?? [];
    if (A.length !== B.length) {
      return [`${name}: ${A.length} on production, ${B.length} locally`];
    }
    const out = [];
    for (let i = 0; i < A.length; i++) {
      if (A[i] !== B[i]) {
        out.push(
          `${name}[${i}] differs\n      production: ${JSON.stringify(A[i])}\n      local:      ${JSON.stringify(B[i])}`,
        );
      }
    }
    return out;
  }
  return a === b ? [] : [`${name}: ${JSON.stringify(a)} vs ${JSON.stringify(b)}`];
}

const slugs = process.argv.slice(4);
if (slugs.length === 0) {
  /* Taken from the local index rather than typed here: the point is to check
     every study the new build publishes, including one the order file does not
     name. */
  slugs.push(...(await slugsFromIndex(LOCAL)));
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

let failures = 0;
let chars = 0;
console.log(`Comparing ${slugs.length} published case study/studies.`);
console.log(`  production ${PROD}\n  local      ${LOCAL}\n`);

for (const slug of slugs) {
  const p = await prose(page, PROD, slug);
  const l = await prose(page, LOCAL, slug);
  if (p.error || l.error) {
    console.log(`FAIL ${slug}: production ${p.error ?? "ok"}, local ${l.error ?? "ok"}`);
    failures++;
    continue;
  }
  const problems = [
    ...diff("h1", p.h1, l.h1),
    ...diff("labels", p.labels, l.labels),
    ...diff("subheads", p.subheads, l.subheads),
    ...diff("bodies", p.bodies, l.bodies),
  ];
  const size = p.bodies.join("").length;
  chars += size;
  if (problems.length === 0) {
    console.log(
      `  OK   ${slug}  ${p.bodies.length} movement(s), ${size} chars byte-identical`,
    );
  } else {
    failures++;
    console.log(`  FAIL ${slug}`);
    for (const pr of problems) console.log(`      ${pr}`);
  }
}

await browser.close();

if (failures) {
  console.error(
    `\n${failures} case study/studies diverge. THE IMPORT IS NOT ACCEPTED — round 25 §2 stops here rather than retiring content/**.`,
  );
  process.exit(1);
}
console.log(
  `\nEvery published case study renders byte-identical prose to production: ${slugs.length} studies, ${chars} characters compared.`,
);
