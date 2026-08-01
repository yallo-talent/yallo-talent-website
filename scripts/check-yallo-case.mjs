/**
 * check-yallo-case — "Yallo" is never set in capitals (canon §2), enforced on the
 * RENDERED page.
 *
 * WHY A BROWSER IS NEEDED, and this is the whole point of the gate. Sumeet reported
 * capitalised "YALLO" in the interface. Grepping the repo for "YALLO" found exactly
 * one hit, in a JSX comment, and nothing user-facing. The word was capitalised
 * nowhere in the source.
 *
 * The cause was `text-transform: uppercase`. The design system sets eyebrow and
 * small-label classes in caps, the copy in them said "Yallo family", "Why Yallo for
 * Data & Analytics", "The Yallo operating rhythm", and the browser did the rest. The
 * footer instance rendered on every page on the site. No static check can see this,
 * because the source string is correct and the defect is produced at paint time.
 *
 * So this gate asks the browser. It walks every element on a representative page
 * set, reads the COMPUTED text-transform, and fails on any element whose own text
 * contains "Yallo" while being transformed to capitals. It also catches literal
 * capitals in aria-label, title and alt, which is the other route to the same
 * outcome.
 *
 * Scope is the word Yallo only. The ratified logo lockup's "TALENT" is unaffected,
 * and every other uppercase eyebrow on the site is fine — the rule is about one
 * word, not about the treatment.
 *
 * Usage: pnpm check:yallo-case [baseUrl]
 */

import { chromium } from "@playwright/test";

const BASE = process.argv[2] ?? "http://localhost:3100";

/* One page per template, plus the two hubs. The footer appears on all of them,
   which is how the every-page instance was caught. */
const PAGES = [
  "/",
  "/ai-talent",
  "/ai-talent/llm-engineer",
  "/capabilities",
  "/capabilities/data-analytics",
  "/capabilities/cybersecurity",
  "/capabilities/data-analytics/data-engineering",
  "/industries/retail",
  "/platforms/sap",
  "/jobs",
  "/brief",
  "/contract",
  "/eor",
  "/about",
  "/intelligence/programme-staffing-blueprint",
];

const browser = await chromium.launch();
const failures = [];
let checked = 0;

for (const path of PAGES) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const res = await page
    .goto(BASE + path, { waitUntil: "networkidle" })
    .catch(() => null);
  if (!res?.ok()) {
    failures.push(
      `${path}  did not load (HTTP ${res?.status() ?? "no response"})`,
    );
    await page.close();
    continue;
  }
  checked += 1;

  const found = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll("*")) {
      const tt = getComputedStyle(el).textTransform;
      if (tt !== "uppercase" && tt !== "full-width") continue;
      /* Own text nodes only. Reading textContent would report a container for its
         children's text and produce one failure per ancestor. */
      const own = [...el.childNodes]
        .filter((n) => n.nodeType === 3)
        .map((n) => n.textContent)
        .join("")
        .trim();
      if (!own || !/yallo/i.test(own)) continue;
      out.push({
        where: `<${el.tagName.toLowerCase()}> .${String(el.className || "")
          .split(/\s+/)
          .map((c) => c.split("__").pop())
          .join(".")}`,
        text: own.slice(0, 80),
        cause: `text-transform: ${tt}`,
      });
    }
    for (const el of document.querySelectorAll("[aria-label],[title],img[alt]")) {
      for (const attr of ["aria-label", "title", "alt"]) {
        const v = el.getAttribute(attr);
        if (v && /\bYALLO\b/.test(v)) {
          out.push({
            where: `<${el.tagName.toLowerCase()}> [${attr}]`,
            text: v.slice(0, 80),
            cause: "literal capitals",
          });
        }
      }
    }
    return out;
  });

  for (const f of found) {
    failures.push(
      `${path}  ${f.where}\n      renders "${f.text}" in capitals (${f.cause})\n` +
        `      Canon §2: capital Y only. Reword so "Yallo" does not sit in an uppercase slot.`,
    );
  }
  await page.close();
}

await browser.close();

if (failures.length > 0) {
  console.error(
    `\ncheck-yallo-case FAILED with ${failures.length} problem(s):\n`,
  );
  for (const f of failures) console.error(`  ${f}\n`);
  process.exit(1);
}

console.log(
  `"Yallo" correctly cased on every element across ${checked} pages.`,
);
