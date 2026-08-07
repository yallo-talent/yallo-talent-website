#!/usr/bin/env node
/**
 * check:research-pdf — the committed PDF still agrees with the pages that
 * produced it.
 *
 * WHY, round 17 §2.1. The PDF is generated from the site's own print surface, so
 * it holds no typed figures — and it is COMMITTED rather than built, so changing
 * one value in the extract moves every page and leaves the document exactly as
 * it was until somebody remembers `pnpm research:pdf`. Nothing failed.
 * `check:research-dataset` proves the dataset agrees with its source; nothing
 * compared the document. Eleventh instance of a second copy no gate compares —
 * and the one asset a stranger is asked for an email address in exchange for.
 *
 * WHAT IT ASSERTS, three things, all of which must hold together:
 *
 *   1. The PDF on disk is the one the manifest describes (size and SHA-256).
 *      A manifest cannot vouch for a file that has since been replaced.
 *   2. The print surface's text still fingerprints to what the manifest recorded.
 *      This is the drift check: a moved figure changes the text, the hash and
 *      therefore this gate.
 *   3. The surface still renders enough to be a document at all — the same floor
 *      the generator refuses to write below, so a print route that has broken
 *      cannot pass by matching a fingerprint taken when it was already broken.
 *
 * WHY NOT A BYTE DIFF of a regenerated PDF: Chromium's output is not
 * reproducible (creation timestamp, unstable object stream), so byte comparison
 * fails every run and trains everyone to ignore it.
 *
 *   node scripts/check-research-pdf.mjs [baseUrl]
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import {
  EXTRACT_PRINT_TEXT,
  fingerprintPrintText,
  MANIFEST_PATH,
} from "./research-pdf-manifest.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const BASE = process.env.BASE_URL ?? process.argv[2] ?? "http://localhost:3115";
const REGENERATE = "  Fix: `pnpm research:pdf` against a production server, then commit both files.";

function fail(lines) {
  console.error(`\ncheck:research-pdf FAILED\n`);
  for (const l of lines) console.error(`  ${l}`);
  console.error(`\n${REGENERATE}\n`);
  process.exit(1);
}

let manifest;
try {
  manifest = JSON.parse(readFileSync(resolve(ROOT, MANIFEST_PATH), "utf8"));
} catch {
  fail([
    `No manifest at ${MANIFEST_PATH}.`,
    "The committed PDF has nothing binding it to the content it was printed from,",
    "which is the whole defect this gate exists to close.",
  ]);
}

for (const key of ["pdf", "pdfBytes", "pdfSha256", "textFingerprint", "source"]) {
  if (manifest[key] === undefined) {
    fail([`${MANIFEST_PATH} is missing \`${key}\`.`]);
  }
}

/* ------------------------------------------- 1. the artefact on disk matches */

let bytes;
try {
  bytes = readFileSync(resolve(ROOT, manifest.pdf));
} catch {
  fail([
    `${manifest.pdf} does not exist, but the manifest describes it.`,
    "The gated download would 404 for every visitor who completed the form.",
  ]);
}

const sha = createHash("sha256").update(bytes).digest("hex");
if (bytes.length !== manifest.pdfBytes || sha !== manifest.pdfSha256) {
  fail([
    `${manifest.pdf} is not the file the manifest describes.`,
    `  manifest: ${manifest.pdfBytes} bytes, sha256 ${manifest.pdfSha256}`,
    `  on disk:  ${bytes.length} bytes, sha256 ${sha}`,
    "Either the PDF was replaced without regenerating the manifest, or the",
    "manifest was regenerated without committing the PDF beside it.",
  ]);
}

/* ------------------------------------- 2 and 3. the content still matches it */

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  const res = await page
    .goto(`${BASE}${manifest.source}`, { waitUntil: "networkidle" })
    .catch(() => null);

  if (!res?.ok()) {
    fail([
      `${manifest.source} returned ${res ? res.status() : "no response"} on ${BASE}.`,
      "This gate needs a production server on that base URL — `next start`, not",
      "`next dev`: dev serves unbundled modules and different CSS, so its text",
      "is not the text the document was printed from.",
    ]);
  }

  const headings = await page.locator("h2").count();
  const printText = await page.evaluate(EXTRACT_PRINT_TEXT);
  const { textFingerprint, textLength } = fingerprintPrintText(printText);

  if (headings < 5 || textLength < 2000) {
    fail([
      `The print surface has ${headings} h2 heading(s) and ${textLength} characters.`,
      "Below the floor build-research-pdf.mjs refuses to print, so whatever the",
      "fingerprint says, this surface cannot currently produce the document.",
    ]);
  }

  /* THE DOCUMENT CONTAINS NO SITE CHROME — round 21 §2.1.
     What shipped before this round had the navigation bar and the "Start a
     brief" button printed on its cover, the assistant launcher floating over
     the title, and its last two pages given over to the footer's link columns.
     Every check above was green on it, because none of them looks at what is
     on the page as opposed to how much of it there is.

     The print surface removes chrome structurally (`body > *:not(main)`), so
     this asserts the outcome of that rule rather than restating the rule: if a
     future layout component lands somewhere the selector does not reach, the
     count stops being zero and this fails. */
  const chrome = await page.evaluate(() => {
    const visible = (el) => {
      const s = getComputedStyle(el);
      return s.display !== "none" && s.visibility !== "hidden";
    };
    return [...document.body.children]
      .filter((el) => el.tagName !== "MAIN" && visible(el))
      .map((el) => `${el.tagName.toLowerCase()}: ${el.textContent.slice(0, 60)}`);
  });

  if (chrome.length > 0) {
    fail([
      `The print surface is rendering ${chrome.length} piece(s) of site chrome:`,
      ...chrome.map((c) => `  ${c}`),
      "",
      "A document is not a screenshot of a web page. Nothing outside <main>",
      "belongs in the printed PDF — not the nav, not the assistant launcher,",
      "not the footer's link columns, all three of which shipped before round 21.",
    ]);
  }

  if (textFingerprint !== manifest.textFingerprint) {
    fail([
      "The print surface no longer matches the committed PDF.",
      `  manifest: ${manifest.textFingerprint} (${manifest.textLength} chars)`,
      `  rendered: ${textFingerprint} (${textLength} chars)`,
      "",
      "The pages have moved and the document has not. Every figure on the site",
      "now disagrees with the one asset a stranger gave an email address for.",
    ]);
  }

  console.log(
    `\ncheck:research-pdf passed\n` +
      `  ${manifest.pdf} — ${bytes.length} bytes, sha256 ${sha.slice(0, 12)}…\n` +
      `  printed from ${manifest.source} — ${headings} sections, ${textLength} characters\n` +
      `  text fingerprint ${textFingerprint.slice(0, 12)}… matches the manifest\n`,
  );
} finally {
  await browser.close();
}
