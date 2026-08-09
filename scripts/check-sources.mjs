#!/usr/bin/env node
/**
 * check-sources — canon §6's "no figure without a source", as a build gate.
 *
 *   node scripts/check-sources.mjs             # the real corpus
 *   node scripts/check-sources.mjs --selftest  # red-prove, then the corpus
 *
 * WHAT IT ASSERTS. Every figure in the BODY of a PUBLISHED insight has a
 * matching entry in that article's `sources` frontmatter. Canon §6: "No figure
 * appears anywhere without a source." Round 23 introduced the rule at the
 * Articles pane; round 24 §4 makes it a rule the build holds, so an article
 * that reaches `content/insights/` by any route — a hand edit, a merge, a
 * future import — is held to it too.
 *
 * DRAFTS ARE EXEMT BY DESIGN, and the exemption is not a softening. An
 * unpublished article renders on no route, so an unsourced figure in one is
 * private working text; failing it would make the gate fire on every article
 * the moment somebody starts writing, which is how authors learn to route
 * around a gate. The rule bites at exactly the moment the figure becomes
 * public: `published: true`.
 *
 * ONE DETECTOR, NOT TWO. The matching logic is `src/lib/unsourced-figures.mjs`,
 * imported here and by `src/lib/admin/article-draft.ts`. Round 24 §4 is
 * explicit about this: a second implementation would drift, and the drift would
 * be silent — the pane green on an article this gate would fail, or the reverse.
 *
 * MEASURED ON THIS TREE, 9 August 2026: all 21 insights are `published: false`,
 * so the gate passes over 0 published articles. That is a trivial pass and the
 * relay says so; the fixture below is what proves the gate can fail.
 *
 * THE FIXTURE IS A REAL FILE, AND IT DELETES ITSELF. `--selftest` writes one
 * `.mdx` into `content/insights/`, asserts the gate fails on it, and removes
 * it. A real file rather than an in-memory object because the reading, the
 * frontmatter parse and the published filter are as capable of being wrong as
 * the detector is, and an in-memory fixture proves none of them. It is never
 * committed: teardown runs on the normal path, on a throw, and on SIGINT and
 * SIGTERM, so a killed run does not leave article content behind — which round
 * 23 forbade and round 24 forbids again.
 */

import { existsSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";
import { unsourcedFigures } from "../src/lib/unsourced-figures.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = join(ROOT, "content", "insights");

/** Frontmatter and body, without pulling gray-matter in for a two-line split. */
function readArticle(path) {
  const raw = readFileSync(path, "utf8");
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return null;
  let frontmatter;
  try {
    frontmatter = parseYaml(match[1]);
  } catch (error) {
    return { error: `frontmatter does not parse: ${error.message}` };
  }
  return { frontmatter: frontmatter ?? {}, body: match[2] ?? "" };
}

/**
 * @returns {{ failures: Array<{file: string, figures: string[]}>, published: number, drafts: number, unparsed: string[] }}
 */
function scan() {
  const failures = [];
  const unparsed = [];
  let published = 0;
  let drafts = 0;

  for (const file of readdirSync(DIR).sort()) {
    if (!file.endsWith(".mdx")) continue;
    const article = readArticle(join(DIR, file));
    if (!article) {
      unparsed.push(`${file}: no frontmatter block`);
      continue;
    }
    if (article.error) {
      unparsed.push(`${file}: ${article.error}`);
      continue;
    }
    /* The manifest treats "not false" as published, and so does this: an
       article with no `published` key at all is a published article, because
       that is what the route layer would do with it. */
    if (article.frontmatter.published === false) {
      drafts += 1;
      continue;
    }
    published += 1;
    const figures = unsourcedFigures(article.body, article.frontmatter.sources);
    if (figures.length) failures.push({ file, figures });
  }

  return { failures, published, drafts, unparsed };
}

const FIXTURE = join(DIR, "__check-sources-fixture.mdx");

function removeFixture() {
  if (existsSync(FIXTURE)) unlinkSync(FIXTURE);
}

function runSelfTest() {
  /* A published article carrying two figures no `sources` entry accounts for,
     and one that is accounted for, so the fixture proves the gate discriminates
     rather than merely flagging any article with digits in it. */
  const fixture = `---
title: Gate fixture, deleted by the gate that wrote it
slug: __check-sources-fixture
date: 2026-08-09
summary: >-
  Fixture for scripts/check-sources.mjs. Written and removed inside one run.
category: Screening
author: Yallo Talent
readingTimeMinutes: 1
published: true
sources:
  - claim: 2:1 CVs per interview
    source: content/metrics.yaml
---

Yallo sends 2:1 CVs per interview. An unsourced 63% and an unsourced 1,400
both appear in this sentence, and neither has a matching sources entry.
`;
  writeFileSync(FIXTURE, fixture, "utf8");

  const { failures } = scan();
  const hit = failures.find((f) => f.file === "__check-sources-fixture.mdx");
  removeFixture();

  if (!hit) {
    console.error(
      "SELFTEST FAILED: the fixture carries two unsourced figures and the gate passed it.",
    );
    process.exit(1);
  }
  const missing = ["63%", "1,400"].filter((f) => !hit.figures.includes(f));
  if (missing.length) {
    console.error(
      `SELFTEST FAILED: the gate flagged ${JSON.stringify(hit.figures)} and missed ${missing.join(", ")}.`,
    );
    process.exit(1);
  }
  if (hit.figures.includes("2:1") || hit.figures.includes("2")) {
    console.error(
      `SELFTEST FAILED: the sourced figure was flagged too — ${JSON.stringify(hit.figures)}.`,
    );
    process.exit(1);
  }
  console.log(
    `Self-test passed: the fixture failed on ${hit.figures.join(", ")}, the sourced figure was not flagged, and the fixture is removed.`,
  );
}

/* Teardown on every exit path. A gate that leaves an article behind when it is
   killed is a gate that writes article content, which this round forbids. */
process.on("SIGINT", () => {
  removeFixture();
  process.exit(130);
});
process.on("SIGTERM", () => {
  removeFixture();
  process.exit(143);
});
process.on("uncaughtException", (error) => {
  removeFixture();
  console.error(error);
  process.exit(1);
});

if (process.argv.includes("--selftest")) runSelfTest();

const { failures, published, drafts, unparsed } = scan();
removeFixture();

if (unparsed.length) {
  console.error("Insight files that could not be read:");
  for (const line of unparsed) console.error(`  ${line}`);
  process.exit(1);
}

if (failures.length) {
  console.error(
    "Published insights carrying a figure with no matching `sources` entry.",
  );
  console.error(
    "Canon §6: no figure appears anywhere without a source. Add the source, or take the figure out.\n",
  );
  for (const { file, figures } of failures) {
    console.error(`  ${file}`);
    for (const figure of figures) console.error(`      ${figure}`);
  }
  process.exit(1);
}

console.log(
  `Sources clean: ${published} published insight(s) checked, ${drafts} draft(s) exempt.`,
);
