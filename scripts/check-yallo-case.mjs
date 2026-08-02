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
  /* Added 2 Aug by check-gate-coverage: no enumerating guard visited either
     unit. Case studies are the surface most likely to carry a client's own
     capitalisation of Yallo, so the omission mattered most here. */
  "/intelligence",
  "/case-studies/oracle-hyperion-financial-management-hfm-implementation",
  /* Added 2 Aug for the dead-link assertion. The template is the same as
     /industries/retail, so template coverage was already satisfied and
     check-gate-coverage was right not to complain — but the assertion below is
     about DATA, not about a template, and Education is the sector carrying the
     one card that deliberately routes off its own axis because it has no tools.
     The page the rule was written for has to be a page the rule visits. */
  "/industries/education",
];

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
