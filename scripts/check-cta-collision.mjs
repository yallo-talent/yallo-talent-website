#!/usr/bin/env node
/**
 * check-cta-collision — context-round15-scope.md §2.2.
 *
 * The two fixed-position affordances, StickyBriefCTA and the assistant
 * launcher, must never occupy the same pixels. Round 14 measured a 54x44px
 * overlap at 360px and fixed it by having the launcher yield while
 * StickyBriefCTA is in the DOM. That fix is a `MutationObserver` matching an
 * accessible name — correct, and until now completely unguarded: rename the
 * label and the observer matches nothing, the launcher stops yielding, and
 * the overlap returns with no failing check anywhere.
 *
 * So this asserts the OUTCOME, not the wiring. It scrolls far enough to bring
 * StickyBriefCTA genuinely live (past its own SHOW_AFTER_PX, and below
 * HIDE_NEAR_END) and then measures real bounding boxes.
 *
 * Both selectors are READ from src/components/layout/floating-affordances.ts
 * rather than typed here. A gate that hard-codes the string it exists to
 * protect is a third copy of the same value, and would keep passing against
 * a name the site no longer renders — which is precisely the failure it is
 * meant to catch.
 *
 * Requires NEXT_PUBLIC_ASSISTANT_ENABLED=true on the server under test: with
 * the flag off the launcher renders nowhere and a "no overlap" result would
 * be vacuously true. This fails loudly in that case rather than reporting
 * green, for the same reason check-assistant-a11y.mjs does.
 *
 *   NEXT_PUBLIC_ASSISTANT_ENABLED=true node scripts/check-cta-collision.mjs [baseUrl]
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const BASE = process.env.BASE_URL ?? process.argv[2] ?? "http://localhost:3100";

/* One live URL per rendering unit is deliberately NOT the sample here. The
   property under test is a property of the fixed layer in layout.tsx, which
   is identical on every route; what varies is document height, and the only
   thing that matters is that the page is tall enough for StickyBriefCTA to
   appear at all. These three are the tallest templates the site has. */
/* /intelligence/research/oracle added round 16: a new long-scrolling
   template, so the assistant launcher and the sticky brief CTA meet on it
   exactly as they do on the three originals. */
const ROUTES = [
  "/",
  "/industries/retail",
  "/platforms/sap",
  "/intelligence/research/oracle",
];

/* StickyBriefCTA.tsx's own thresholds, restated as the SCROLL TARGET rather
   than as a copy of its logic: this gate does not decide when the prompt
   shows, it scrolls until the prompt is actually there and fails if it never
   arrives. 1400 clears SHOW_AFTER_PX (1100) with room; the assertion below
   is on observed presence, not on this number being right. */
const SCROLL_TO_PX = 1400;

const MOBILE = { width: 360, height: 780 };
const DESKTOP = { width: 1280, height: 900 };

/* ------------------------------------------------- selectors, read once -- */

const sourcePath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "src",
  "components",
  "layout",
  "floating-affordances.ts",
);
const source = readFileSync(sourcePath, "utf8");

function readConst(name) {
  const m = source.match(new RegExp(`${name}\\s*=\\s*"([^"]+)"`));
  if (!m) {
    console.error(
      `Could not read ${name} from ${sourcePath}. This gate derives its selectors from that file; if the constant was renamed, rename it here too rather than inlining the value.`,
    );
    process.exit(1);
  }
  return m[1];
}

const CTA_SELECTOR = `[aria-label="${readConst("STICKY_BRIEF_CTA_LABEL")}"]`;
const LAUNCHER_SELECTOR = `#${readConst("ASSISTANT_LAUNCHER_ID")}`;

/* ------------------------------------------------------------- helpers --- */

const overlap = (a, b) => {
  if (!a || !b) return 0;
  const w = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x);
  const h = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);
  return w > 0 && h > 0 ? Math.round(w) * Math.round(h) : 0;
};

/** Rect only if the element is present AND actually painted. */
async function visibleBox(page, selector) {
  const el = await page.$(selector);
  if (!el) return null;
  if (!(await el.isVisible())) return null;
  return el.boundingBox();
}

const failures = [];
const notes = [];

async function measure(page, route, viewport) {
  await page.setViewportSize(viewport);
  await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });

  /* The launcher is a deferred island: it is imported dynamically and mounts
     after hydration, so a rect taken too early is a rect of nothing. Wait for
     the flag's effect to be observable before deciding anything. */
  await page.waitForTimeout(400);

  await page.evaluate((y) => window.scrollTo(0, y), SCROLL_TO_PX);
  /* StickyBriefCTA animates in over 0.25s, and the launcher's own
     MutationObserver reacts to that arrival — both have to settle before the
     boxes mean anything. */
  await page.waitForTimeout(900);

  const cta = await visibleBox(page, CTA_SELECTOR);
  const launcher = await visibleBox(page, LAUNCHER_SELECTOR);
  const label = `${route} @ ${viewport.width}`;

  if (!cta) {
    failures.push(
      `${label}: StickyBriefCTA is not visible after scrolling to ${SCROLL_TO_PX}px — this gate cannot assert anything about a collision it never brought about. Either the prompt's thresholds moved or the page is too short for this check.`,
    );
    return;
  }

  return { label, cta, launcher, viewport };
}

/* ---------------------------------------------------------------- run ---- */

const browser = await chromium.launch();
const page = await browser.newPage();

/* The flag check comes first and is its own failure. A launcher that renders
   nowhere makes every overlap assertion below trivially true. */
await page.setViewportSize(DESKTOP);
await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
await page.waitForTimeout(600);
if (!(await page.$(LAUNCHER_SELECTOR))) {
  console.error(
    `The assistant launcher (${LAUNCHER_SELECTOR}) is not on the page at ${BASE}.\n` +
      "Run this against a server built with NEXT_PUBLIC_ASSISTANT_ENABLED=true.\n" +
      "Refusing to report a green collision check against a surface that does not render.",
  );
  await browser.close();
  process.exit(1);
}

for (const route of ROUTES) {
  /* MOBILE, the case §2.2 rules on. The launcher is expected to yield
     entirely; if it does not, its box must still miss the prompt's. Either
     outcome is acceptable — what is not acceptable is overlap. */
  const m = await measure(page, route, MOBILE);
  if (m) {
    if (!m.launcher) {
      notes.push(`${m.label}: launcher yielded to StickyBriefCTA (no overlap possible)`);
    } else {
      const px = overlap(m.cta, m.launcher);
      if (px > 0) {
        failures.push(
          `${m.label}: launcher and StickyBriefCTA overlap by ${px}px² — launcher ${JSON.stringify(m.launcher)}, prompt ${JSON.stringify(m.cta)}`,
        );
      } else {
        notes.push(`${m.label}: both visible, no overlap`);
      }
    }
  }

  /* DESKTOP, the control. Both are expected to be visible in opposite
     corners. If the launcher vanished here too, the "yield" is firing at a
     width it should not, which is a different defect the mobile assertion
     alone would report as a pass. */
  const d = await measure(page, route, DESKTOP);
  if (d) {
    if (!d.launcher) {
      failures.push(
        `${d.label}: launcher is absent at desktop width — the mobile yield is firing where it should not, and every mobile "no overlap" result above is vacuous.`,
      );
    } else {
      const px = overlap(d.cta, d.launcher);
      if (px > 0) {
        failures.push(
          `${d.label}: launcher and StickyBriefCTA overlap by ${px}px² — launcher ${JSON.stringify(d.launcher)}, prompt ${JSON.stringify(d.cta)}`,
        );
      } else {
        notes.push(`${d.label}: both visible in opposite corners, no overlap`);
      }
    }
  }
}

await browser.close();

for (const n of notes) console.log(`  ${n}`);

if (failures.length) {
  console.error(`\n${failures.length} collision failure(s):`);
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}

console.log(
  `\nNo overlap between StickyBriefCTA and the assistant launcher across ${ROUTES.length} route(s) at 360 and 1280.`,
);
