#!/usr/bin/env node
/**
 * Byte-compare two prose captures.
 *
 * Round 25b §0.3: the pre-merge capture against MDX-served production and the
 * post-merge capture against database-served production must be identical. A
 * study present in one file and absent from the other is a failure, not a skip.
 *
 * Usage:
 *   node scripts/compare-case-study-prose.mjs <before.json> <after.json>
 * Exit 0 only when every study matches on every slot.
 */

import { readFileSync } from "node:fs";

const [, , beforePath, afterPath] = process.argv;
if (!beforePath || !afterPath) {
  console.error("usage: compare-case-study-prose.mjs <before.json> <after.json>");
  process.exit(2);
}

const before = JSON.parse(readFileSync(beforePath, "utf8"));
const after = JSON.parse(readFileSync(afterPath, "utf8"));

function diff(name, a, b) {
  if (Array.isArray(a) || Array.isArray(b)) {
    const A = a ?? [];
    const B = b ?? [];
    if (A.length !== B.length) return [`${name}: ${A.length} before, ${B.length} after`];
    const out = [];
    for (let i = 0; i < A.length; i++) {
      if (A[i] !== B[i]) {
        out.push(
          `${name}[${i}] differs\n      before: ${JSON.stringify(A[i])}\n      after:  ${JSON.stringify(B[i])}`,
        );
      }
    }
    return out;
  }
  return a === b ? [] : [`${name}: ${JSON.stringify(a)} vs ${JSON.stringify(b)}`];
}

const slugs = [...new Set([...Object.keys(before.studies), ...Object.keys(after.studies)])].sort();
console.log(`Comparing ${slugs.length} case study/studies.`);
console.log(`  before ${before.base} (${beforePath})`);
console.log(`  after  ${after.base} (${afterPath})\n`);

let failures = 0;
let chars = 0;
for (const slug of slugs) {
  const a = before.studies[slug];
  const b = after.studies[slug];
  if (!a || !b) {
    console.log(`  FAIL ${slug}: present ${a ? "before only" : "after only"}`);
    failures++;
    continue;
  }
  const problems = [
    ...diff("h1", a.h1, b.h1),
    ...diff("labels", a.labels, b.labels),
    ...diff("subheads", a.subheads, b.subheads),
    ...diff("bodies", a.bodies, b.bodies),
  ];
  const size = a.bodies.join("").length;
  chars += size;
  if (problems.length === 0) {
    console.log(`  OK   ${slug}  ${a.bodies.length} movement(s), ${size} chars byte-identical`);
  } else {
    failures++;
    console.log(`  FAIL ${slug}`);
    for (const p of problems) console.log(`      ${p}`);
  }
}

if (failures) {
  console.error(`\n${failures} case study/studies changed across the merge.`);
  process.exit(1);
}
console.log(
  `\nProduction serves byte-identical prose before and after the flip: ${slugs.length} studies, ${chars} characters compared.`,
);
