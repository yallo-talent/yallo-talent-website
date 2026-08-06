/**
 * The contract between the committed research PDF and the pages that produced it.
 *
 * THE DEFECT THIS CLOSES, round 17 §2.1 and the eleventh instance of this
 * build's signature shape. The PDF is generated from the site's own print
 * surface, so it holds no typed figures — but it is COMMITTED rather than built.
 * Change one value in the extract and every page moves while the PDF stays as it
 * was, until somebody remembers to run `pnpm research:pdf` by hand. Nothing
 * failed. `check:research-dataset` proves the dataset agrees with its source; no
 * gate compared the document.
 *
 * WHY A MANIFEST RATHER THAN A BYTE DIFF. A Chromium PDF is not reproducible: it
 * carries a creation timestamp and its object stream is not stable run to run, so
 * regenerating and comparing bytes fails every time and teaches everyone to
 * ignore the gate. Reading the text back out of the PDF would mean a PDF parser,
 * and there is none in this dependency tree.
 *
 * So the comparison is on CONTENT, in two links that must both hold:
 *
 *   manifest <-> content   `textFingerprint` is a hash of the print surface's
 *                          text, whitespace-collapsed so it is independent of
 *                          layout, line breaks and pagination.
 *   manifest <-> artefact  `pdfSha256` and `pdfBytes` describe the file on disk.
 *
 * `build-research-pdf.mjs` is the only writer, and it writes both links at once
 * from the same run that produced the PDF. So the manifest cannot describe a PDF
 * that is not there, and it cannot describe content the PDF was not printed
 * from. Editing it by hand to silence the gate takes deliberately faking a
 * SHA-256, which is a different act from forgetting to run a script.
 */
import { createHash } from "node:crypto";

/** Repo-relative. Deliberately NOT under public/ — a gated asset's provenance is
    not itself a published file. */
export const MANIFEST_PATH = "content/research-pdf.manifest.json";

/**
 * Extracted in the page, by both the generator and the gate, so the two cannot
 * fingerprint different things.
 *
 * `textContent` rather than `innerText`, because innerText reflects layout: it
 * inserts breaks at block boundaries and respects visibility, so identical
 * content at a different width would fingerprint differently.
 *
 * SCRIPT, STYLE, NOSCRIPT and TEMPLATE come out first, and that is not
 * tidiness. `body.textContent` includes the text inside <script> — which on a
 * Next.js page is the whole RSC hydration payload, carrying the build id and the
 * chunk hashes. Fingerprinting that produces a gate that fails on every rebuild
 * whether or not one word of content moved, and a gate that always fails is a
 * gate everyone learns to skip.
 */
/* An immediately-invoked expression, not a function literal: Playwright treats a
   STRING passed to page.evaluate as an expression to evaluate, so a bare
   `() => {…}` evaluates to the function itself and the caller gets no text. */
export const EXTRACT_PRINT_TEXT = `(() => {
  const clone = document.body.cloneNode(true);
  for (const el of clone.querySelectorAll("script, style, noscript, template")) {
    el.remove();
  }
  return clone.textContent ?? "";
})()`;

export function normalisePrintText(raw) {
  return raw.replace(/\s+/g, " ").trim();
}

export function fingerprintPrintText(raw) {
  const text = normalisePrintText(raw);
  return {
    textFingerprint: createHash("sha256").update(text, "utf8").digest("hex"),
    textLength: text.length,
  };
}

/** 2-space JSON with a trailing newline: the shape a formatter would leave, so a
    pre-commit hook cannot rewrite a generated file into permanent gate failure. */
export function serialiseManifest(manifest) {
  return `${JSON.stringify(manifest, null, 2)}\n`;
}
