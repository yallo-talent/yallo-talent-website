#!/usr/bin/env node
/**
 * WCAG 2.2 SC 1.4.10 Reflow: no horizontal scrolling at a 320px-equivalent
 * viewport. Canon's performance gate names 360px, so that is what this asserts,
 * across every built route in both registers.
 *
 * capture-home.mjs already asserted this — for the homepage only, 1 of ~20
 * routes. That gap was not theoretical: a `.panelPetal` positioned at
 * `right: -34px` on an element flush to the content wrap pushed `/ai-talent` to
 * 374px in both themes, and nothing in CI could see it.
 *
 * Elements inside a horizontal scroller are expected to extend past the
 * viewport — that is what a scroller is — so this asserts on
 * `documentElement.scrollWidth`, which is the thing a user actually has to
 * scroll, rather than on individual element rects.
 *
 * Requires a server on PORT (default 3000).
 *
 *   node scripts/check-reflow.mjs [--width 360]
 */
import { chromium } from "@playwright/test";

const arg = (n, d) => {
  const i = process.argv.indexOf(`--${n}`);
  return i > -1 ? process.argv[i + 1] : d;
};

const PORT = process.env.PORT ?? "3000";
const BASE = process.env.CAPTURE_BASE ?? `http://localhost:${PORT}`;
const WIDTH = Number.parseInt(arg("width", "360"), 10);

const ROUTES = [
  "/",
  "/brief",
  "/contract",
  "/permanent",
  "/eor",
  "/managed-delivery",
  "/industries",
  "/industries/retail",
  "/industries/retail/customer-experience",
  "/capabilities/data-analytics",
  "/platforms/microsoft",
  "/case-studies",
  "/about",
  "/why-yallo",
  "/leadership",
  "/terms",
  "/privacy",
  "/ai-talent",
  "/jobs",
  "/insights",
];

const browser = await chromium.launch();
const failures = [];

for (const theme of ["light", "dark"]) {
  const ctx = await browser.newContext({
    viewport: { width: WIDTH, height: 800 },
    colorScheme: theme,
  });
  await ctx.addInitScript((t) => {
    try {
      localStorage.setItem("yallo-theme", t);
    } catch {}
  }, theme);

  for (const route of ROUTES) {
    const page = await ctx.newPage();
    try {
      await page.goto(BASE + route, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });
      await page.waitForTimeout(250);

      const m = await page.evaluate(() => ({
        scroll: document.documentElement.scrollWidth,
        inner: window.innerWidth,
        // Name the widest offender so the failure is actionable rather than a
        // number to go hunting for.
        worst: (() => {
          let best = { sel: "", right: 0 };
          for (const el of document.querySelectorAll("*")) {
            const r = el.getBoundingClientRect();
            // Skip anything inside a horizontal scroller: it is meant to overflow.
            let p = el.parentElement;
            let scroller = false;
            while (p) {
              const ox = getComputedStyle(p).overflowX;
              if (ox === "auto" || ox === "scroll") {
                scroller = true;
                break;
              }
              p = p.parentElement;
            }
            if (scroller) continue;
            if (r.right > best.right) {
              best = {
                sel: `${el.tagName}.${(el.className || "").toString().split(/\s+/)[0]}`,
                right: Math.round(r.right),
              };
            }
          }
          return best;
        })(),
      }));

      if (m.scroll > m.inner + 1) {
        failures.push(
          `${route} ${theme}: scrollWidth ${m.scroll} > ${m.inner} — widest is ${m.worst.sel} at right=${m.worst.right}`,
        );
      }
    } catch (e) {
      failures.push(`${route} ${theme}: ${e.message.split("\n")[0]}`);
    }
    await page.close();
  }
  await ctx.close();
}

await browser.close();

if (failures.length) {
  console.error(`\n${failures.length} reflow failure(s) at ${WIDTH}px:`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log(
  `\nNo horizontal overflow: ${ROUTES.length} routes x 2 themes at ${WIDTH}px.`,
);
