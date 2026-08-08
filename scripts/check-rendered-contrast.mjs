#!/usr/bin/env node
/**
 * check-rendered-contrast — text contrast measured in RENDERED PIXELS, against
 * the background that actually painted underneath it.
 *
 * WHY, round 19 §5.2. `check:contrast` reads tokens out of the stylesheet and
 * pairs them. That is the right gate for a solid background and it is blind to
 * the one this build is full of: a gradient, an ambient wash, an orb. Round 18
 * §2.2 established that a source-level gate cannot see text over a gradient at
 * all, because there is no single background colour in the source to pair the
 * foreground against. The worst pixel under a heading is not a value any
 * stylesheet states.
 *
 * HOW IT MEASURES, and why this is not another proxy:
 *
 *   1. Two screenshots per route and theme. The second is taken with every
 *      element's `color` forced transparent, which changes no layout at all and
 *      leaves exactly the painted background: gradients, washes, orbs, images,
 *      the lot.
 *   2. A GLYPH MASK from the difference between the two. A pixel belongs to the
 *      text exactly where the normal render and the plate disagree; everything
 *      else in the rect is identical in both, by construction. Sampling the rect
 *      instead is how the first run of this gate reported a one-pixel divider
 *      rule crossing a label as that label's background.
 *   3. For every pixel a glyph painted, contrast is computed against the
 *      element's computed `color` using WCAG's own relative-luminance formula,
 *      and the WORST pixel is the element's score. A heading legible over the
 *      pale end of a gradient and illegible over the dark end has failed.
 *   4. The threshold is WCAG AA and follows the rendered font: 3:1 for large
 *      text (24px, or 18.66px at 700+), 4.5:1 for everything else.
 *
 * SCOPED TO NON-UNIFORM BACKGROUNDS, deliberately. Where the plate under a
 * text run is one flat colour, `check:contrast` already covers it from source
 * and covers it across every theme permutation rather than the two rendered
 * here. This gate reports on the case that one structurally cannot see, which
 * keeps its failures meaningful instead of duplicating another gate's list.
 *
 *   node scripts/check-rendered-contrast.mjs [baseUrl]
 *   SYNTHETIC_FAIL=true node scripts/check-rendered-contrast.mjs   (self-test)
 */
import { chromium } from "@playwright/test";
import sharp from "sharp";

const BASE = process.env.BASE_URL ?? process.argv[2] ?? "http://localhost:3115";

/**
 * One route per rendering template. Read against scripts/check-gate-coverage.mjs,
 * which is what fails when a new template joins the route tree and no gate
 * visits it.
 */
const ROUTES = [
  "/", // home
  "/contract", // service template
  "/industries/retail", // L1 template
  "/industries/retail/crm", // L2 template
  "/platforms/microsoft", // platform hub
  "/platforms/blue-yonder/blue-yonder-fulfillment", // platform module
  "/capabilities/data-analytics", // capability L1
  "/ai-talent", // AI talent index
  "/intelligence/programme-staffing-blueprint", // blueprint hub
  "/intelligence", // intelligence hub
  "/why-yallo",
  "/leadership",
  "/brief",
  /* Round 22 §4. The knowledge hub was on no contrast guard's list, and the
     quiet empty state added this round puts a ghost-pill link on a plain
     `.section` rather than inside a band-dark plate — the one arrangement of
     .ctaGhost the rest of the site never uses. Hand measurement through the
     preview pane read it at 1.00:1 and would not reproduce; a real headless
     browser is the instrument that settles it, so the route joins the list
     rather than the reading being argued about. */
  "/insights",
];

const THEMES = ["light", "dark"];

/* ------------------------------------------------------------ WCAG maths */

function channel(c) {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}
const luminance = (r, g, b) =>
  0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);

function contrast(a, b) {
  const la = luminance(...a);
  const lb = luminance(...b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** WCAG 1.4.3: 24px, or 18.66px at 700 or heavier, is "large". */
const floorFor = (px, weight) =>
  px >= 24 || (px >= 18.66 && weight >= 700) ? 3 : 4.5;

/* ---------------------------------------------------- the in-page harvest */

/**
 * Every visible text run on the page, with the tight rects its glyphs occupy.
 * Runs in the browser; returns plain data.
 */
const HARVEST = () => {
  const probe = document.createElement("canvas");
  probe.width = 1;
  probe.height = 1;
  const pctx = probe.getContext("2d", { willReadFrequently: true });
  const toRgba = (value) => {
    pctx.clearRect(0, 0, 1, 1);
    pctx.fillStyle = "#000";
    pctx.fillStyle = value;
    pctx.fillRect(0, 0, 1, 1);
    const d = pctx.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2], d[3] / 255];
  };

  const out = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!node.nodeValue || !node.nodeValue.trim()) continue;
    const el = node.parentElement;
    if (!el) continue;
    const tag = el.tagName;
    if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT") continue;

    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none") continue;
    if (Number.parseFloat(cs.opacity) < 0.99) continue;
    /**
     * Gradient-clipped text has no solid foreground colour to measure, and it
     * cannot be hidden for the background plate either: `background-clip: text`
     * paints the BACKGROUND through the glyph, so forcing `color` transparent
     * leaves the letters exactly where they were. Measured anyway, the run
     * scores its own colour against its own glyph and reports 1.00:1 — which is
     * what the first run of this gate did to the home hero's H1.
     *
     * The computed value is `rgba(0, 0, 0, 0)`, never the keyword `transparent`,
     * which is the half the first version tested for. `backgroundClip` is the
     * reliable signal and is checked first.
     */
    const clip = cs.webkitBackgroundClip || cs.backgroundClip;
    const fill = cs.webkitTextFillColor;
    const transparentText =
      clip === "text" ||
      fill === "transparent" ||
      /^rgba\([^)]*,\s*0\s*\)$/.test(fill) ||
      /^rgba\([^)]*,\s*0\s*\)$/.test(cs.color);

    const fontSize = Number.parseFloat(cs.fontSize);
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;

    const range = document.createRange();
    range.selectNodeContents(node);
    const rects = [...range.getClientRects()]
      .filter((r) => r.width >= 4 && r.height >= 4)
      /* Only what the viewport screenshot actually contains. A rect below the
         fold would otherwise be clamped to the plate's bottom edge and scored
         against pixels no glyph of it sits on. */
      .filter((r) => r.bottom > 0 && r.right > 0 && r.top < vh && r.left < vw)
      /* The whole line box, deliberately not inset. It is only the SEARCH
         region; `worstUnderGlyphs` then keeps the pixels a glyph actually
         painted, so an inset here could only clip an ascender or a descender
         out of a measurement that already excludes the leading. */
      .map((r) => ({ x: r.x, y: r.y, width: r.width, height: r.height }));
    range.detach();
    if (rects.length === 0) continue;

    /* Normalised through a canvas rather than parsed. Chrome returns whatever
       colour space the value was authored in — `rgb()`, `color(srgb ...)`,
       `oklch(...)` — and scraping numbers out of the string got a breadcrumb
       separator reported as pure red at 1.12:1, twice, under two different
       guesses at the format. A 1x1 fill reads back the true sRGB bytes the
       compositor would use, in every syntax, with no format list to maintain. */
    const rgb = toRgba(cs.color);
    out.push({
      text: node.nodeValue.trim().slice(0, 48),
      selector: `${tag.toLowerCase()}${el.className && typeof el.className === "string" ? `.${el.className.trim().split(/\s+/)[0]}` : ""}`,
      color: [rgb[0], rgb[1], rgb[2]],
      alpha: rgb[3],
      fontSize,
      fontWeight: Number.parseInt(cs.fontWeight, 10) || 400,
      transparentText,
      rects,
    });
  }
  /**
   * Rects of every FIXED or STICKY overlay. Text beneath one of these is an
   * occlusion problem, which check:cta-collision owns, not a contrast problem.
   * The assistant launcher's pill sits over body copy on /intelligence and on
   * the platform module template, and its shadow falls across the glyphs
   * underneath: measured as contrast that reads 2.94:1, and fixing it by
   * changing a colour token would be fixing the wrong layer. Reported by this
   * gate under its own heading and excluded from the contrast verdict.
   */
  const overlays = [];
  for (const el of document.querySelectorAll("body *")) {
    const cs = getComputedStyle(el);
    if (cs.position !== "fixed" && cs.position !== "sticky") continue;
    if (cs.visibility === "hidden" || cs.display === "none") continue;
    const r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) continue;
    overlays.push({
      selector: `${el.tagName.toLowerCase()}${typeof el.className === "string" && el.className.trim() ? `.${el.className.trim().split(/\s+/)[0]}` : ""}`,
      /* The shadow reaches past the box; 24px covers this build's largest. */
      x: r.x - 24,
      y: r.y - 24,
      width: r.width + 48,
      height: r.height + 48,
    });
  }

  return { runs: out, overlays };
};

/** Forces every glyph transparent so the next screenshot is the paint beneath. */
const HIDE_TEXT_CSS = `*, *::before, *::after {
  color: transparent !important;
  -webkit-text-fill-color: transparent !important;
  text-shadow: none !important;
  text-decoration-color: transparent !important;
  caret-color: transparent !important;
}`;

/**
 * The synthetic failure, for proving this gate red before trusting it. Dark grey
 * on the home hero's own ambient wash: a pairing no stylesheet in this repo
 * states, so only a rendered-pixel measurement can see it.
 */
const SYNTHETIC_CSS = `#synthetic-contrast-failure {
  position: absolute; top: 220px; left: 40px; z-index: 5;
  font-size: 15px; font-weight: 400; color: rgb(96, 96, 96);
}`;

async function raster(page) {
  const buf = await page.screenshot({ fullPage: false });
  const { data, info } = await sharp(buf)
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height, channels: info.channels };
}

/**
 * THE GLYPH MASK, and why the first version of this gate needed one.
 *
 * Sampling every pixel of a text rect measures things no letter sits on. The
 * first run reported `span.entityRole` at 1.61:1 on the home page; the plate
 * crop showed the worst pixel was a one-pixel vertical divider rule crossing the
 * run's box, with a gold entity marker beside it. Neither is under a glyph, and
 * neither is what a reader is trying to read. Inset the rect and the same class
 * of pixel appears from an orb edge instead: the rect was never the right
 * sampling region.
 *
 * A pixel is under a glyph exactly when the normal render and the text-hidden
 * plate DIFFER there. Everything else is identical in both, by construction.
 * So the mask is free, it is exact, it includes antialiased glyph edges (where
 * the plate still holds the true background), and it excludes every decorative
 * pixel that merely shares the rect. This is not the rule being narrowed to make
 * a first run small: it is the rule being applied to the text rather than to the
 * rectangle the text happens to live in.
 */
const MASK_DELTA = 12;

/**
 * Pixels claimed by MORE THAN ONE text run, which no run may be scored on.
 *
 * A line box is not exclusive. On the home page the entity list's next marker,
 * a gold disc carrying a "?" glyph, sits horizontally inside the line box of
 * "India and capability centres" — so the disc's own glyph pixels changed
 * between the two shots, entered that run's mask, and were reported as that
 * run's background at 2.96:1. The glyph mask was right that those pixels are
 * text; it had no way to know they were somebody else's text.
 *
 * Counting rect coverage once per page and dropping every contested pixel is
 * conservative in the safe direction: a genuinely bad pairing in a contested
 * region goes unreported rather than a good one being failed, and the count of
 * dropped pixels is printed so the size of that blind spot is visible rather
 * than assumed small.
 */
function contestedMap(runs, overlays, width, height) {
  const count = new Uint8Array(width * height);
  /* An overlay's whole footprint is contested from the outset: whatever is
     under it belongs to the overlay, and this gate scores nobody on it. */
  const claims = [
    ...runs.map((r) => r.rects),
    ...overlays.map((o) => [o, o]),
  ];
  for (const rects of claims) {
    for (const r of rects) {
      const x0 = Math.max(0, Math.floor(r.x));
      const y0 = Math.max(0, Math.floor(r.y));
      const x1 = Math.min(width, Math.ceil(r.x + r.width));
      const y1 = Math.min(height, Math.ceil(r.y + r.height));
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          const i = y * width + x;
          if (count[i] < 2) count[i] += 1;
        }
      }
    }
  }
  return count;
}

function worstUnderGlyphs(normal, plate, rects, color, contested) {
  let worst = Number.POSITIVE_INFINITY;
  let worstRgb = null;
  let glyphPixels = 0;
  let contestedSkipped = 0;
  const seen = new Set();
  for (const r of rects) {
    const x0 = Math.max(0, Math.floor(r.x));
    const y0 = Math.max(0, Math.floor(r.y));
    const x1 = Math.min(plate.width, Math.ceil(r.x + r.width));
    const y1 = Math.min(plate.height, Math.ceil(r.y + r.height));
    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        const i = (y * plate.width + x) * plate.channels;
        const delta =
          Math.abs(normal.data[i] - plate.data[i]) +
          Math.abs(normal.data[i + 1] - plate.data[i + 1]) +
          Math.abs(normal.data[i + 2] - plate.data[i + 2]);
        if (delta < MASK_DELTA) continue;
        if (contested[y * plate.width + x] > 1) {
          contestedSkipped += 1;
          continue;
        }
        glyphPixels += 1;
        const rgb = [plate.data[i], plate.data[i + 1], plate.data[i + 2]];
        seen.add((rgb[0] << 16) | (rgb[1] << 8) | rgb[2]);
        const c = contrast(color, rgb);
        if (c < worst) {
          worst = c;
          worstRgb = rgb;
        }
      }
    }
  }
  return { worst, worstRgb, distinct: seen.size, glyphPixels, contestedSkipped };
}

/* ------------------------------------------------------------------ run */

const synthetic = process.env.SYNTHETIC_FAIL === "true";
const browser = await chromium.launch();
const failures = [];
const skippedGradientText = [];
let runsMeasured = 0;
let gradientRuns = 0;
let contestedTotal = 0;

for (const theme of THEMES) {
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    colorScheme: theme,
    reducedMotion: "reduce",
    deviceScaleFactor: 1,
  });
  await ctx.addInitScript((t) => {
    try {
      localStorage.setItem("yallo-theme", t);
    } catch {}
    const stamp = () => document.documentElement.setAttribute("data-theme", t);
    stamp();
    document.addEventListener("DOMContentLoaded", stamp);
  }, theme);

  for (const route of ROUTES) {
    const page = await ctx.newPage();
    try {
      const res = await page.goto(`${BASE}${route}`, {
        waitUntil: "networkidle",
        timeout: 45000,
      });
      if (!res || res.status() !== 200) {
        failures.push(
          `${route} ${theme}: responded ${res ? res.status() : "no response"}, so nothing was measured.`,
        );
        await page.close();
        continue;
      }
      await page.waitForTimeout(300);

      if (synthetic) {
        await page.addStyleTag({ content: SYNTHETIC_CSS });
        await page.evaluate(() => {
          const p = document.createElement("p");
          p.id = "synthetic-contrast-failure";
          p.textContent = "Synthetic failure: grey body text over the ambient wash";
          document.body.appendChild(p);
        });
        await page.waitForTimeout(120);
      }

      const { runs, overlays } = await page.evaluate(HARVEST);
      /* Normal first, then the same viewport with every glyph transparent. The
         pair is what makes the glyph mask possible; nothing between them moves,
         because `color` affects paint and not layout. */
      const normal = await raster(page);
      await page.addStyleTag({ content: HIDE_TEXT_CSS });
      await page.waitForTimeout(150);
      const plate = await raster(page);
      const contested = contestedMap(runs, overlays, plate.width, plate.height);

      for (const run of runs) {
        if (run.transparentText) {
          skippedGradientText.push(`${route} ${theme}: ${run.selector} "${run.text}"`);
          continue;
        }
        const { worst, worstRgb, distinct, glyphPixels, contestedSkipped } =
          worstUnderGlyphs(normal, plate, run.rects, run.color, contested);
        contestedTotal += contestedSkipped;
        /* No glyph pixels means the run was covered, clipped or scrolled out
           between the two shots. Nothing was measured, so nothing is claimed. */
        if (!Number.isFinite(worst) || glyphPixels < 8) continue;
        runsMeasured += 1;
        /* Only non-uniform backgrounds. A flat plate is check:contrast's job and
           it covers more theme permutations than this gate renders. */
        if (distinct < 2) continue;
        gradientRuns += 1;

        const floor = floorFor(run.fontSize, run.fontWeight);
        if (worst + 0.005 < floor) {
          failures.push(
            `${route} ${theme}  ${worst.toFixed(2)}:1 against a ${floor}:1 floor\n` +
              `      ${run.selector}  ${run.fontSize}px/${run.fontWeight}  "${run.text}"\n` +
              `      text rgb(${run.color.join(", ")}) over worst rendered pixel rgb(${worstRgb.join(", ")})\n` +
              `      ${distinct} distinct background colours under ${glyphPixels} glyph pixels, so no\n` +
              `      single source-level pairing describes this run.`,
          );
        }
      }
    } catch (err) {
      failures.push(
        `${route} ${theme}: gate crashed rather than completing — ${err instanceof Error ? err.message : err}`,
      );
    }
    await page.close();
  }
  await ctx.close();
}

await browser.close();

/* A gate that measured almost nothing and reported clean is the failure shape
   this repository has already been caught by. */
if (gradientRuns < 20) {
  console.error(
    `\nOnly ${gradientRuns} text run(s) over a non-uniform background across ${ROUTES.length} routes\n` +
      "x 2 themes. That is too few to trust: either the plate screenshot is not\n" +
      "capturing the ambient wash, or the harvest is not finding text. Refusing to\n" +
      "report clean.\n",
  );
  process.exit(1);
}

if (failures.length > 0) {
  console.error(
    `\ncheck:rendered-contrast FAILED with ${failures.length} problem(s):\n`,
  );
  for (const f of failures) console.error(`  ${f}\n`);
  process.exit(1);
}

console.log(
  `\ncheck:rendered-contrast passed\n` +
    `  ${ROUTES.length} route(s) x ${THEMES.length} theme(s), ${runsMeasured} text run(s) measured in rendered pixels\n` +
    `  ${gradientRuns} of them over a non-uniform background, every one at or above its WCAG AA floor\n` +
    `  ${contestedTotal} glyph pixel(s) skipped as claimed by two overlapping text runs, so scored for neither\n` +
    `  ${skippedGradientText.length} run(s) with gradient-clipped text carry no solid colour to measure${skippedGradientText.length ? `:\n${skippedGradientText.map((s) => `    ${s}`).join("\n")}` : ""}\n`,
);
