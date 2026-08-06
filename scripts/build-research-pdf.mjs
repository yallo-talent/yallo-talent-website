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
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = resolve(ROOT, "public/downloads/yallo-talent-corridor-research.pdf");
const BASE = process.env.BASE_URL ?? process.argv[2] ?? "http://localhost:3115";
const PATH = "/intelligence/research/corridor/print";

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

    await page.pdf({
      path: OUT,
      format: "A4",
      printBackground: true,
      margin: { top: "18mm", bottom: "18mm", left: "16mm", right: "16mm" },
      displayHeaderFooter: true,
      headerTemplate: "<span></span>",
      footerTemplate:
        '<div style="width:100%;font-size:8px;color:#666;padding:0 16mm;display:flex;justify-content:space-between;">' +
        "<span>Yallo Talent · yallo.co</span>" +
        '<span class="pageNumber"></span>' +
        "</div>",
    });

    console.log(
      `Wrote ${OUT} from ${BASE}${PATH} — ${headings} sections, ${text.length} characters.`,
    );
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error("build-research-pdf failed:", err.message);
  process.exit(1);
});
