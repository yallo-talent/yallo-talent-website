#!/usr/bin/env node
/**
 * build-research-pdf — prints the gated synthesis PDF FROM the site's own
 * print surface.
 *
 *   node scripts/build-research-pdf.mjs [baseUrl]
 *
 * Source: /intelligence/research/corridor/print, which renders the same
 *         src/data/research modules the public pages render.
 * Output: public/downloads/yallo-talent-corridor-research.pdf
 *
 * WHY NOT AUTHOR THE PDF. context-round16-scope.md §2.3: "Generate the PDF
 * from the same content source as the page, not by hand. A hand-made PDF is a
 * second copy of every figure, and this build's signature defect is the
 * second copy." A hand-made document also goes stale silently — nothing fails
 * when the extract changes and the file does not.
 *
 * WHY PLAYWRIGHT. It is already a devDependency for the browser gates, so the
 * generated document costs no new runtime dependency and no new rendering
 * engine with its own opinion about the type scale. The PDF is literally the
 * page.
 *
 * MUST RUN AGAINST `next start`, not `next dev`: dev serves unbundled modules
 * and unminified CSS, and the fonts arrive on a different schedule, so a dev
 * print produces a document that does not match the site.
 */
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import {
  EXTRACT_PRINT_TEXT,
  fingerprintPrintText,
  MANIFEST_PATH,
  serialiseManifest,
} from "./research-pdf-manifest.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = resolve(ROOT, "public/downloads/yallo-talent-corridor-research.pdf");
const MANIFEST = resolve(ROOT, MANIFEST_PATH);
const BASE = process.env.BASE_URL ?? process.argv[2] ?? "http://localhost:3115";
const PATH = "/intelligence/research/corridor/print";

/** The running title goes into a raw HTML template, so it is escaped there. */
function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function main() {
  mkdirSync(dirname(OUT), { recursive: true });

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    const res = await page.goto(`${BASE}${PATH}`, { waitUntil: "networkidle" });

    if (!res || !res.ok()) {
      throw new Error(
        `${PATH} returned ${res ? res.status() : "no response"} on ${BASE}. ` +
          "Is `pnpm start` serving a current build on that port?",
      );
    }

    /* The document is light regardless of the viewer's theme. A PDF has no
       theme to follow, and a dark one prints as a solid black page. */
    await page.emulateMedia({ media: "print", colorScheme: "light" });

    /* Assert the content actually rendered before writing a file. A print
       route that renders an empty shell still produces a valid, blank PDF,
       and a blank PDF is exactly the kind of artefact that ships unnoticed
       because it exists and has a plausible size. */
    const headings = await page.locator("h2").count();
    const text = (await page.locator("body").innerText()).trim();
    if (headings < 5 || text.length < 2000) {
      throw new Error(
        `Print surface looks empty: ${headings} h2 headings, ${text.length} characters. Refusing to write a blank PDF.`,
      );
    }

    /* Not the innerText above: innerText reflects layout, so it would move with
       a width change that changed no content. The shared extractor also strips
       <script>, which on a Next.js page carries the build id and chunk hashes.
       See scripts/research-pdf-manifest.mjs. */
    const printText = await page.evaluate(EXTRACT_PRINT_TEXT);

    /* RUNNING FURNITURE, in the page margin where prose cannot reach it.
       context-round21-scope.md §2.1 requires the piece title, the page number
       and yallo.co on each page, and requires that the previous output's
       page-number-jammed-into-prose artefacts be impossible by construction.
       Chromium composites these templates into the margin box, so the only way
       they can collide with the text is if the margin is too small to hold
       them — hence the 18mm bottom against ~9pt of furniture.

       The templates are raw HTML handed to Chromium's PDF compositor, which
       loads neither the page's stylesheet nor its fonts. They therefore carry
       literal values rather than tokens: there is no cascade here to inherit
       from. Kept to the document's own greys and faces by hand, in this one
       place.

       The title is READ OFF THE RENDERED PAGE rather than written here. It is
       the same string the cover prints because it is literally that string, so
       the furniture cannot come to disagree with the document it belongs to. */
    const runningTitle = (await page.locator("h1").first().innerText()).trim();
    const footerFont =
      "font-family:'IBM Plex Mono',ui-monospace,SFMono-Regular,Menlo,monospace";
    await page.pdf({
      path: OUT,
      format: "A4",
      printBackground: true,
      margin: { top: "18mm", bottom: "18mm", left: "16mm", right: "16mm" },
      displayHeaderFooter: true,
      headerTemplate: "<span></span>",
      footerTemplate:
        `<div style="width:100%;${footerFont};font-size:8px;color:#5d5d60;` +
        'padding:0 16mm;display:flex;justify-content:space-between;align-items:baseline;gap:12px;">' +
        `<span style="flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(
          runningTitle,
        )}</span>` +
        '<span style="flex:none;letter-spacing:0.1em;">yallo.co</span>' +
        '<span style="flex:none;min-width:2em;text-align:right;" class="pageNumber"></span>' +
        "</div>",
    });

    /* The manifest is written from THIS run, so it can only ever describe the
       PDF just printed and the content it was printed from. check:research-pdf
       compares both links; a figure that moves without this script running
       fails CI instead of leaving the document quietly a version behind. */
    const bytes = readFileSync(OUT);
    const manifest = {
      note:
        "Generated by scripts/build-research-pdf.mjs. Do not edit by hand — " +
        "run `pnpm research:pdf` against a production server. " +
        "scripts/check-research-pdf.mjs asserts this against both the PDF and " +
        "the print surface.",
      source: PATH,
      pdf: "public/downloads/yallo-talent-corridor-research.pdf",
      pdfBytes: bytes.length,
      pdfSha256: createHash("sha256").update(bytes).digest("hex"),
      headings,
      ...fingerprintPrintText(printText),
    };
    writeFileSync(MANIFEST, serialiseManifest(manifest), "utf8");

    console.log(
      `Wrote ${OUT} from ${BASE}${PATH} — ${headings} sections, ${text.length} characters.\n` +
        `Wrote ${MANIFEST_PATH} — pdf ${manifest.pdfBytes} bytes, text fingerprint ${manifest.textFingerprint.slice(0, 12)}…`,
    );
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error("build-research-pdf failed:", err.message);
  process.exit(1);
});
