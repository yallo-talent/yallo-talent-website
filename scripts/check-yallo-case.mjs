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
 * ROUND 7: it now also fails on the literal string in rendered text. Reading only
 * computed text-transform left a hole exactly the width of the opposite defect —
 * case study bodies carrying "YALLO partnered with" and "YALLO's Role" passed the
 * gate, because nothing was transforming them. The rendered result is the same
 * word in capitals either way, and the rule is about the rendered result.
 *
 * Scope is the word Yallo only. The ratified logo lockup's "TALENT" is unaffected,
 * and every other uppercase eyebrow on the site is fine — the rule is about one
 * word, not about the treatment.
 *
 * Usage: pnpm check:yallo-case [baseUrl]
 */

import { chromium } from "@playwright/test";
import { sampleCaseStudySlug } from "./lib/case-study-sample.mjs";
import { fetchPublishedPaths } from "./lib/published-paths.mjs";

/**
 * Base URL: `BASE_URL` first, then `argv[2]`, then the default.
 *
 * Round 4 ran this against a dev server on another port and read seventeen
 * "did not load" lines as seventeen content failures. Neither half was: the gate
 * took its URL only from `argv[2]`, so `BASE_URL=... pnpm check:yallo-case` was
 * silently ignored and every request went to 3100, where nothing was listening.
 * `BASE_URL` is what the rest of the rendered gates read, so this one reads it
 * too and the positional argument stays as the override.
 */
const BASE = process.env.BASE_URL ?? process.argv[2] ?? "http://localhost:3100";

/**
 * Every published route, not a hand list. round13-scope.md §1.4 / §4.4: this
 * gate missed /why-yallo the same way it once missed /leadership — a new
 * page joins the site by being added to `publishedPaths()`, and a gate that
 * doesn't read that function has to be remembered separately, which is the
 * defect class this repository keeps finding.
 *
 * check-motion and check-marks stay on their own hand-picked route sets —
 * both are scoped by their own rule to a route PROPERTY (carries a Framer
 * animation; carries a client mark) that most published routes do not have,
 * so an exhaustive set would spend most of its runtime asserting nothing.
 * This gate has no such property: any rendered page can carry "Yallo" in the
 * wrong case, which is what makes an exhaustive route set the correct scope
 * for it specifically, per round13-scope.md §1.4.
 */
const PAGES = await fetchPublishedPaths(BASE);
/* case-study-sample.mjs's own selection remains the one place that name is
   chosen — publishedPagePaths() already lists every case-study slug that
   exists, so sampleCaseStudySlug() only has to prove it agrees, not enumerate
   a second time. */
if (!PAGES.some((p) => p.startsWith("/case-studies/"))) {
  PAGES.push(`/case-studies/${sampleCaseStudySlug()}`);
}

const browser = await chromium.launch();
const failures = [];
let checked = 0;
/** Internal href -> one page that links to it. Deduped across the whole run. */
const linkSources = new Map();

for (const path of PAGES) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  /* `domcontentloaded`, not `networkidle`.
     What this gate reads is computed `text-transform`, which is settled once the
     stylesheets are applied; it never needed a quiet network. `networkidle`
     waits for 500ms of no requests, which a dev server's HMR socket and chunk
     stream never give it, so under `next dev` the gate timed out on every page
     and reported it as a load failure. Waiting for a condition the page cannot
     reach is a gate defect, not a page defect.
     `page.waitForFunction` on document.fonts covers the one real asynchrony:
     a web font swapping in cannot change text-transform, but it can change
     which element is laid out, and the query below walks the live DOM. */
  const res = await page
    .goto(BASE + path, { waitUntil: "domcontentloaded" })
    .catch(() => null);
  if (res?.ok()) {
    await page
      .waitForFunction(() => document.fonts.status === "loaded", null, {
        timeout: 5000,
      })
      .catch(() => null);
  }
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
    /* Elements whose text nodes are not rendered text. <script> matters most:
       Next's RSC payload is a text node inside one, it contains a data copy of
       every string on the page, and matching it reports a defect that no reader
       can see while saying nothing about what the page renders. */
    const NOT_RENDERED = new Set([
      "SCRIPT",
      "STYLE",
      "NOSCRIPT",
      "TEMPLATE",
      "TITLE",
    ]);
    for (const el of document.querySelectorAll("*")) {
      if (NOT_RENDERED.has(el.tagName)) continue;
      /* Own text nodes only. Reading textContent would report a container for its
         children's text and produce one failure per ancestor. */
      const own = [...el.childNodes]
        .filter((n) => n.nodeType === 3)
        .map((n) => n.textContent)
        .join("")
        .trim();
      if (!own || !/yallo/i.test(own)) continue;
      const where = `<${el.tagName.toLowerCase()}> .${String(el.className || "")
        .split(/\s+/)
        .map((c) => c.split("__").pop())
        .join(".")}`;

      const tt = getComputedStyle(el).textTransform;
      if (tt === "uppercase" || tt === "full-width") {
        out.push({ where, text: own.slice(0, 80), cause: `text-transform: ${tt}` });
        continue;
      }

      /* THE OTHER HALF OF THE RULE, and the half this gate was blind to.
         It only ever read computed text-transform, because canon §2's incident
         was capitals produced at paint time. Case study bodies now carry the
         literal string — "YALLO partnered with", "YALLO's Role" — which no
         paint-time check can see, because nothing is transforming them. The
         rendered result is identical and the rule is about the rendered result,
         so the gate reads the text as well as the style. Case-sensitive and
         word-bounded: "Yallo" is correct and must not be reported. */
      if (/\bYALLO\b/.test(own)) {
        out.push({
          where,
          text: own.slice(0, 80),
          cause: "literal capitals in the source text",
        });
      }
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
    /* Two defects, two fixes. A paint-time capital is correct copy in the wrong
       slot; a literal capital is the copy itself and is corrected where it is
       written. Telling an author to reword a heading that only needs its casing
       fixed sends them to the stylesheet for a content problem. */
    const remedy = f.cause.startsWith("literal")
      ? `Canon §2: capital Y only. Correct the source text to "Yallo".`
      : `Canon §2: capital Y only. Reword so "Yallo" does not sit in an uppercase slot.`;
    failures.push(
      `${path}  ${f.where}\n      renders "${f.text}" in capitals (${f.cause})\n      ${remedy}`,
    );
  }

  /* Collect internal hrefs for the dead-link assertion below. */
  for (const href of await page.evaluate(() =>
    [...document.querySelectorAll("a[href]")]
      .map((a) => a.getAttribute("href"))
      .filter((h) => h && h.startsWith("/")),
  )) {
    const clean = href.split("#")[0].split("?")[0];
    if (!clean) continue;
    if (!linkSources.has(clean)) linkSources.set(clean, path);
  }

  await page.close();
}

/**
 * No rendered link points at a route that does not exist.
 *
 * The ruling names the specific shape: a card carrying no `tools` must not emit
 * an href to a route that does not exist. A function with no tools has no L2
 * route — `routeExists` has encoded that for both sectors and capabilities since
 * round 3 — so a card that skips the check ships a 404 into the page. Education's
 * `institutional-back-office` is the live example of doing it correctly: it
 * carries no tools, so it routes to /platforms/oracle rather than to its own
 * absent L2.
 *
 * Asserted over every internal link rather than only over expertise cards,
 * because the failure is the dead href and the card is only where this instance
 * came from. Round 4 crawled the homepage's 41 links by hand and found the
 * Education link dead; doing it by hand is what makes it a once-per-round check
 * instead of a gate.
 *
 * Each URL is requested once however many pages link to it, and the reporting
 * names one page that does, so the fix has somewhere to start.
 */
for (const [href, from] of linkSources) {
  const status = await fetch(BASE + href, { redirect: "follow" })
    .then((r) => r.status)
    .catch(() => 0);
  if (status === 404 || status === 0) {
    failures.push(
      `${from}  links to ${href}, which returns ${status === 0 ? "no response" : status}.\n` +
        `      A card with no tools has no L2 route. Point it at a page that exists,\n` +
        `      or render it as non-interactive text — never as a link to nothing.`,
    );
  }
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
  `"Yallo" correctly cased on every element across ${checked} pages, ` +
    `and ${linkSources.size} distinct internal links all resolve.`,
);
