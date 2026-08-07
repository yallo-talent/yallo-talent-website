#!/usr/bin/env node
/**
 * render-pdf-pages — rasterise a PDF's pages to PNGs so they can be LOOKED AT.
 *
 *   node scripts/render-pdf-pages.mjs [pdfPath] [outDir]
 *
 * WHY THIS EXISTS. context-round21-scope.md §2.3: "Verify the rendered output
 * by reading actual pages as images, not by trusting the generator's exit
 * code." Every existing check on the document is structural — byte length, a
 * text fingerprint, a heading count — and all three were green on the output
 * Sumeet rejected as "a print of the web page". A generator cannot tell you it
 * produced an ugly document. Only the pixels can.
 *
 * pdf.js renders inside Chromium, which is already a devDependency for the
 * browser gates, so this needs no native canvas build and no second rendering
 * engine with its own opinion about type.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PDF = resolve(
  ROOT,
  process.argv[2] ?? "public/downloads/yallo-talent-corridor-research.pdf",
);
const OUT = resolve(ROOT, process.argv[3] ?? "docs/status/pdf-pages");
const SCALE = Number(process.env.PDF_SCALE ?? 1.6);

const PDFJS = resolve(ROOT, "node_modules/pdfjs-dist/build/pdf.mjs");
const WORKER = resolve(ROOT, "node_modules/pdfjs-dist/build/pdf.worker.mjs");

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.setContent("<body style='margin:0'></body>");

  const data = [...readFileSync(PDF)];
  const libSrc = readFileSync(PDFJS, "utf8");
  const workerSrc = readFileSync(WORKER, "utf8");

  const pages = await page.evaluate(
    async ({ data, libSrc, workerSrc, scale }) => {
      /* Both bundles are self-contained ESM, so a blob URL is enough to import
         them without a server and without file:// origin rules. */
      const lib = await import(
        URL.createObjectURL(new Blob([libSrc], { type: "text/javascript" }))
      );
      lib.GlobalWorkerOptions.workerSrc = URL.createObjectURL(
        new Blob([workerSrc], { type: "text/javascript" }),
      );

      const doc = await lib.getDocument({ data: new Uint8Array(data) }).promise;
      const out = [];
      for (let n = 1; n <= doc.numPages; n++) {
        const p = await doc.getPage(n);
        const viewport = p.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        await p.render({
          canvasContext: canvas.getContext("2d"),
          viewport,
          background: "#ffffff",
        }).promise;
        out.push(canvas.toDataURL("image/png"));
      }
      return out;
    },
    { data, libSrc, workerSrc, scale: SCALE },
  );

  pages.forEach((dataUrl, i) => {
    const file = resolve(OUT, `page-${String(i + 1).padStart(2, "0")}.png`);
    writeFileSync(file, Buffer.from(dataUrl.split(",")[1], "base64"));
  });

  console.log(`Rendered ${pages.length} page(s) of ${PDF}\n  into ${OUT}`);
} finally {
  await browser.close();
}
