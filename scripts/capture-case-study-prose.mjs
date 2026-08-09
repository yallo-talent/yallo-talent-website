#!/usr/bin/env node
/**
 * Capture the rendered prose of every published case study to a JSON file.
 *
 * Round 25b §0: merging round 25 flips production from MDX files to
 * database-served content. The only honest proof that the flip changed nothing
 * a reader can see is a byte comparison of the same words before and after, so
 * this runs the verify-import extraction against one origin and stores the
 * result. `compare-case-study-prose.mjs` reads two such files.
 *
 * Usage:
 *   node scripts/capture-case-study-prose.mjs <base-url> <out.json> [slug...]
 * Exit 0 only when every slug rendered.
 */

import { writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";
import { prose, slugsFromIndex } from "./lib/case-study-prose.mjs";

const base = process.argv[2];
const out = process.argv[3];
if (!base || !out) {
  console.error("usage: capture-case-study-prose.mjs <base-url> <out.json> [slug...]");
  process.exit(2);
}

const slugs = process.argv.slice(4);
if (slugs.length === 0) slugs.push(...(await slugsFromIndex(base)));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const studies = {};
let failures = 0;
for (const slug of slugs) {
  const p = await prose(page, base, slug);
  if (p.error) {
    console.error(`  FAIL ${slug}: ${p.error}`);
    failures++;
    continue;
  }
  studies[slug] = p;
  console.log(`  ok   ${slug}  ${p.bodies.length} movement(s), ${p.bodies.join("").length} chars`);
}
await browser.close();

if (failures) {
  console.error(`\n${failures} study/studies did not render. Nothing written.`);
  process.exit(1);
}

writeFileSync(out, `${JSON.stringify({ base, studies }, null, 2)}\n`);
console.log(`\nCaptured ${Object.keys(studies).length} studies from ${base} to ${out}`);
