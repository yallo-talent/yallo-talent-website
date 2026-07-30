#!/usr/bin/env node
/**
 * Captures the homepage in both themes at desktop and mobile, plus a
 * reduced-motion pass, and asserts the things that must be true in the served
 * HTML rather than after hydration.
 *
 * Requires the dev or production server to be running on PORT (default 3000).
 *
 *   node scripts/capture-home.mjs
 *
 * Output goes to test-results/visual/.
 */
import { mkdirSync } from "node:fs";
import { chromium } from "@playwright/test";

const PORT = process.env.PORT ?? "3000";
const BASE = `http://localhost:${PORT}`;
const OUT = "test-results/visual";

mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
  { name: "desktop", width: 1280, height: 900 },
  { name: "mobile", width: 360, height: 780 },
];

const browser = await chromium.launch();
const failures = [];

for (const theme of ["light", "dark"]) {
  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      colorScheme: theme,
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();

    // Set the stored preference before first paint so the init script picks it
    // up and we test the real code path rather than forcing an attribute.
    await page.addInitScript(
      (t) => window.localStorage.setItem("yallo-theme", t),
      theme,
    );

    await page.goto(BASE, { waitUntil: "load" });

    const resolved = await page.getAttribute("html", "data-theme");
    if (resolved !== theme) {
      failures.push(`theme resolution: expected ${theme}, got ${resolved}`);
    }

    // Settle the count-up and any entrance transitions.
    await page.waitForTimeout(1600);

    // A full-page screenshot does not trigger lazy-loaded images, and
    // next/image runs its own IntersectionObserver, so the page has to be
    // scrolled through and then actually waited on. Without this the logo tiles
    // capture as empty boxes and look like broken assets.
    await page.evaluate(async () => {
      const step = Math.floor(window.innerHeight * 0.8);
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 150)));
      }
      window.scrollTo(0, 0);
    });

    // Images inside a horizontally translated track are excluded from the
    // COMPLETENESS requirement: vertical scrolling never reveals them, so their
    // lazy loading correctly does not fire. Demanding they load would be
    // asserting that the marquee is NOT lazy.
    //
    // Two such tracks: the case rail (later slides), and the client rail's
    // aria-hidden duplicate half, which exists only to make the loop seamless.
    // Every URL in that duplicate also appears in the FIRST, eager, non-hidden
    // half, which is still asserted — so coverage is unchanged: a broken mark
    // still fails. Making the duplicate eager instead pushed 36 images in front
    // of the `load` event and timed the reduced-motion navigation out at 30s.
    //
    // The decode check below deliberately stays universal: `complete` with
    // naturalWidth 0 is a failure wherever it sits, deferred or not.
    const RAIL = [
      '[aria-label="Published case studies"] img',
      '[aria-label="Clients and integrators"] [aria-hidden="true"] img',
    ].join(", ");
    await page
      .waitForFunction(
        (sel) => {
          const deferred = new Set(document.querySelectorAll(sel));
          return [...document.images]
            .filter((i) => !deferred.has(i))
            .every((i) => i.complete);
        },
        RAIL,
        { timeout: 20000 },
      )
      .catch(() => {
        failures.push(`images never finished loading at ${theme}/${vp.name}`);
      });
    await page.waitForTimeout(300);

    // A decode failure is always a failure, wherever the image sits. The first
    // pass of this script only checked naturalWidth on already-complete images
    // and so passed while every vendor mark rendered blank.
    const bad = await page.evaluate((sel) => {
      const deferred = new Set(document.querySelectorAll(sel));
      return [...document.images]
        .filter((i) => (i.complete && i.naturalWidth === 0) || (!deferred.has(i) && !i.complete))
        .map((i) => `${i.getAttribute("src")} (complete=${i.complete}, nw=${i.naturalWidth})`);
    }, RAIL);
    if (bad.length) {
      failures.push(`unrendered images at ${theme}/${vp.name}: ${bad.join("; ")}`);
    }

    await page.screenshot({
      path: `${OUT}/home-${theme}-${vp.name}.png`,
      fullPage: true,
    });

    // Horizontal overflow is a hard failure at every width.
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    if (overflow) {
      const w = await page.evaluate(() => ({
        scroll: document.documentElement.scrollWidth,
        inner: window.innerWidth,
      }));
      failures.push(
        `horizontal overflow at ${theme}/${vp.name}: ${w.scroll} > ${w.inner}`,
      );
    }

    console.log(`captured ${theme}/${vp.name}`);
    await context.close();
  }
}

// --- Assertions on the served markup, before any hydration ----------------
{
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    javaScriptEnabled: false,
  });
  const page = await context.newPage();
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  // React 19 SSR emits `<!-- -->` between adjacent text expressions, so a
  // value like {50}{"+"} serialises as `50<!-- -->+`. Strip those markers
  // before matching or the assertion tests React's serialiser, not our markup.
  const html = (await page.content()).replace(/<!--\s*-->/g, "");

  // B4: real metric values must be in the markup, not zeros.
  for (const v of ["72h", "2:1", "80%", "50+"]) {
    if (!html.includes(v)) failures.push(`metric "${v}" missing from served HTML`);
  }
  // The old defect rendered "0hrs" / "0" into the markup.
  if (/>0(hrs|h|%)</.test(html)) {
    failures.push("a zero metric value is present in the served HTML");
  }
  // Banned terminology must never reach the homepage.
  for (const term of ["GCC", "KSA", "subcontract", "Bangalore", "unsplash"]) {
    if (new RegExp(term, "i").test(html)) {
      failures.push(`banned term "${term}" present in served HTML`);
    }
  }
  // No fabricated testimonial.
  if (/\[SLOT\]|Lorem ipsum/i.test(html)) {
    failures.push("placeholder text present in served HTML");
  }
  console.log("checked server-rendered markup with JS disabled");
  await context.close();
}

// --- Reduced motion: the count must not start from zero -------------------
{
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(BASE, { waitUntil: "load" });
  await page.locator("#metrics").waitFor({ state: "attached" });
  await page.locator("#metrics").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  const shown = await page.locator("#metrics dd").first().innerText();
  if (!shown.startsWith("72")) {
    failures.push(`reduced motion animated the count: showed "${shown}"`);
  }
  await page.screenshot({ path: `${OUT}/home-reduced-motion.png` });
  console.log("checked prefers-reduced-motion");
  await context.close();
}

await browser.close();

if (failures.length) {
  console.error(`\n${failures.length} failure(s):`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log("\nAll visual and markup assertions passed.");
