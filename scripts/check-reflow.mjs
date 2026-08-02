#!/usr/bin/env node
/**
 * WCAG 2.2 SC 1.4.10 Reflow: no horizontal scrolling at a 320px-equivalent
 * viewport. BOTH 320 and 360 are asserted now, and 320 is the one that matters:
 * SC 1.4.10 is specified at 320 CSS px, because that is 1280px at 400% zoom.
 * This gate previously asserted 360 alone, citing canon's performance gate — and
 * a frozen critique pass found 40px of horizontal scroll at 320 on every route in
 * both registers, un-gated by construction for as long as the gate existed. The
 * contributors were the header's action cluster and, for the last 7px, an
 * unwrappable "Launching" row in the FOOTER. Both fixed; both now guarded.
 * Canon's 360 is kept as well, since a wider assertion catches different things,
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
/* SC 1.4.10's own width first. A --width argument still overrides, for probing. */
const WIDTHS = arg("width", "")
  ? [Number.parseInt(arg("width", "320"), 10)]
  : [320, 360];

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
  /* Added 2 Aug by check-gate-coverage: no enumerating guard visited either
     unit. A case study is the longest single prose column on the site and the
     blueprint index carries a card grid, so both are reflow-relevant. */
  "/intelligence",
  "/case-studies/oracle-hyperion-financial-management-hfm-implementation",
];

const browser = await chromium.launch();
const failures = [];

for (const WIDTH of WIDTHS) {
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
      failures.push(`${route} @${WIDTH} ${theme}: ${e.message.split("\n")[0]}`);
    }
    await page.close();
  }
  await ctx.close();
}
}

await browser.close();

if (failures.length) {
  console.error(`\n${failures.length} reflow failure(s):`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log(
  `\nNo horizontal overflow: ${ROUTES.length} routes x 2 themes at ${WIDTHS.join(" and ")}px — SC 1.4.10 asserted at its own 320.`,
);
