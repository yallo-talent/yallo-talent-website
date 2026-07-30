#!/usr/bin/env node
/**
 * Guards canon §5: `prefers-reduced-motion` honoured for EVERY animation.
 *
 * Two layers, because each catches what the other cannot.
 *
 * 1. STATIC. Framer Motion defaults to `reducedMotion: "never"`, and a
 *    JS-driven inline transform cannot be overridden by the global
 *    `@media (prefers-reduced-motion: reduce)` block in globals.css — no
 *    stylesheet rule beats an inline style. So any file importing
 *    `framer-motion` must be covered by a `MotionConfig reducedMotion="user"`.
 *    We assert the provider exists and is mounted in the root layout; without
 *    it the runtime check below is the only thing standing between a
 *    motion-sensitive visitor and three animating sections.
 *
 * 2. RUNTIME. Scrolls each animated element into view and samples its computed
 *    transform every frame, counting how many DISTINCT offsets it passes
 *    through.
 *
 *    Counting distinct values, not peak offset. These animations are
 *    `initial={{ y: 16 }} whileInView={{ y: 0 }}`, so a card below the fold
 *    rests at y=16 until it is scrolled to — a static offset, not an animation,
 *    and an earlier version of this guard failed on exactly that, reporting
 *    16px in both passes. What reduced motion must suppress is the TWEEN: with
 *    motion allowed the element passes through many intermediate offsets; under
 *    reduced motion Framer sets the target immediately, so it passes through at
 *    most one.
 *
 *    A control pass with motion allowed confirms the assertion can actually
 *    fail — without it, a page that never animates would "pass" and prove
 *    nothing.
 *
 * Requires a server on PORT (default 3000).
 *
 *   node scripts/check-motion.mjs
 */
import { readFileSync } from "node:fs";
import { globSync } from "node:fs";
import { chromium } from "@playwright/test";

const PORT = process.env.PORT ?? "3000";
const BASE = `http://localhost:${PORT}`;

/** Routes carrying Framer entrance animations. */
const ROUTES = ["/industries/retail", "/capabilities/data-analytics", "/contract"];

/** Wrappers the animations are applied to. */
const SELECTORS = [
  '[class*="expCardWrap"]',
  '[class*="pillarWrap"]',
  '[class*="segPanel"]',
  '[class*="benefitCard"]',
  '[class*="processStep"]',
];

const failures = [];

// --- 1. Static: every framer-motion consumer must be under the provider ----
{
  const consumers = globSync("src/**/*.{ts,tsx}").filter((f) =>
    /from "framer-motion"/.test(readFileSync(f, "utf8")),
  );
  const provider = consumers.find((f) => /reducedMotion="user"/.test(readFileSync(f, "utf8")));
  if (!provider) {
    failures.push(
      'no MotionConfig reducedMotion="user" anywhere in src/ — Framer defaults to "never", so every animation ignores the user preference',
    );
  } else {
    const layout = readFileSync("src/app/layout.tsx", "utf8");
    // `<MotionProvider`, not the bare identifier: an unmounted provider leaves
    // its import line behind, and matching the identifier alone reported
    // "mounted" during an injection test where the JSX had been removed.
    if (!/<MotionProvider[\s>]/.test(layout)) {
      failures.push(
        `${provider} declares reducedMotion="user" but src/app/layout.tsx does not mount it, so it covers nothing`,
      );
    }
  }
  console.log(
    `static: ${consumers.length} framer-motion consumer(s), provider ${provider ? "present and mounted" : "MISSING"}`,
  );
}

// --- 2. Runtime: transforms must not animate under reduced motion ----------
const browser = await chromium.launch();

for (const route of ROUTES) {
  const seen = {};
  for (const rm of ["reduce", "no-preference"]) {
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 900 },
      reducedMotion: rm,
    });
    const page = await ctx.newPage();
    await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 60000 });

    const result = await page.evaluate(async (sels) => {
      const targets = [...document.querySelectorAll(sels.join(", "))];
      if (!targets.length) return { found: false };

      const offset = (el) => {
        const t = getComputedStyle(el).transform;
        if (!t || t === "none") return 0;
        const m = new DOMMatrixReadOnly(t);
        return Math.max(Math.abs(m.m41), Math.abs(m.m42));
      };

      // Every match, not just the first: the first one is often already in view
      // on load, so it never tweens and the control pass reads as "no motion",
      // which would make the reduced-motion assertion vacuous.
      let worst = { steps: 0, cls: "" };
      for (const target of targets) {
        const samples = [];
        target.scrollIntoView({ block: "center", behavior: "instant" });
        await new Promise((resolve) => {
          let frames = 0;
          const tick = () => {
            samples.push(+offset(target).toFixed(2));
            if (++frames > 45) return resolve();
            requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
        // Distinct non-zero offsets: the intermediate states of a tween.
        const steps = new Set(samples.filter((v) => v > 0.5)).size;
        if (steps > worst.steps) {
          worst = { steps, cls: target.className.toString().split(/\s+/)[0] };
        }
      }
      return { found: true, ...worst };
    }, SELECTORS);

    if (!result.found) {
      failures.push(`${route}: none of the animated selectors matched — update this script`);
      await ctx.close();
      continue;
    }
    seen[rm] = result;
    await ctx.close();
  }

  const reduced = seen.reduce;
  const control = seen["no-preference"];
  if (!reduced || !control) continue;
  console.log(
    `${route}: reduced ${reduced.steps} intermediate offset(s) · control ${control.steps}`,
  );

  // One non-zero sample is the pre-viewport resting offset caught on the first
  // frame; a tween shows many.
  if (reduced.steps > 1) {
    failures.push(
      `${route}: transform tweened through ${reduced.steps} offsets under prefers-reduced-motion`,
    );
  }
  if (control.steps <= 1) {
    failures.push(
      `${route}: control pass saw no tween either, so the reduced-motion assertion proves nothing — check the selectors in this script still match`,
    );
  }
}

await browser.close();

if (failures.length) {
  console.error(`\n${failures.length} failure(s):`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log("\nReduced motion is honoured on every animated route.");
