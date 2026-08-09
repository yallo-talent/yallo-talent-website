/* The animated email signature banner: three ratified variants, cross-faded,
   encoded as one GIF. Derived from the same render path as the PNGs, so the
   banners cannot drift apart.

   Frame 1 is light-72h-shortlist and is load-bearing. Older desktop Outlook,
   and anyone with animation disabled, shows frame 1 and nothing else, so for
   that audience frame 1 *is* the signature. Every check below treats it as a
   fidelity requirement rather than a nice-to-have.

   Encoder: sharp (libvips + cgif), already a dependency of the site. No new
   runtime dependency, and its inter-frame and local-palette controls are the
   two levers that decide whether the file fits the budget.

   Usage, from this directory (fonts first: bash setup.sh):
     node signature-gif.mjs            # build and write the ratified config
     node signature-gif.mjs --search   # sweep the encoder grid and report
*/
import { writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import sharp from "sharp";
import { variants, renderVariant } from "./signature-banners.mjs";

/* Sequence and timing, from the ratified context. Holds 3.5-4s, each fade
   400-600ms in 6-8 intermediate frames, loop roughly 12-14s. */
const SEQUENCE = ["light-72h-shortlist", "light-ai-talent", "dark-corridor"];
const HOLD_MS = 3700;
const FADE_MS = 480;

/* GIF carries no partial alpha, and the card's rounded corner is antialiased
   against nothing. Binary transparency would jag that corner in every client,
   so the frames are composited on the same white the signature block sits on.
   Reversible: this constant is the whole decision. */
const MATTE = { r: 255, g: 255, b: 255 };

const outPath = new URL("../../public/images/email/signature-animated.gif", import.meta.url).pathname;

/** Render one variant at `zoom` and flatten it onto the matte, as RGB bytes. */
async function frameOf(name, zoom) {
  const png = renderVariant(variants[name], zoom).asPng();
  return sharp(png).flatten({ background: MATTE }).raw().toBuffer({ resolveWithObject: true });
}

/** Straight sRGB blend, which is what a client's own cross-fade would do. */
function blend(a, b, t) {
  const out = Buffer.allocUnsafe(a.length);
  for (let i = 0; i < a.length; i++) out[i] = Math.round(a[i] * (1 - t) + b[i] * t);
  return out;
}

/**
 * Build the frame strip and its delays. Frame 1 is the first hold, unblended
 * and byte-for-byte the render of light-72h-shortlist.
 */
async function buildFrames(zoom, fadeSteps) {
  const stills = [];
  for (const name of SEQUENCE) stills.push(await frameOf(name, zoom));
  const { width, height } = stills[0].info;

  const frames = [];
  const delays = [];
  const fadeDelay = Math.round(FADE_MS / fadeSteps / 10) * 10;
  for (let i = 0; i < stills.length; i++) {
    frames.push(stills[i].data);
    delays.push(HOLD_MS);
    const next = stills[(i + 1) % stills.length].data;
    for (let s = 1; s <= fadeSteps; s++) {
      frames.push(blend(stills[i].data, next, s / (fadeSteps + 1)));
      delays.push(fadeDelay);
    }
  }
  return { frames, delays, width, height, channels: stills[0].info.channels };
}

async function encode({ frames, delays, width, height, channels }, opts) {
  const strip = Buffer.concat(frames);
  return sharp(strip, { raw: { width, height: height * frames.length, channels, pageHeight: height } })
    .gif({ delay: delays, loop: 0, effort: 10, ...opts })
    .toBuffer();
}

/* A pixel this far out of place is at the edge of being seen on a flat panel;
   below it, nothing reads as a step. */
const VISIBLE_DELTA = 6;

/**
 * Compare two RGB buffers. Returns the mean-square error, the worst single
 * channel, and the share of pixels that miss by a visible amount.
 *
 * That last figure is the one that matters for banding, and it is why the
 * first two are not enough on their own. This art is flat panels and type:
 * RMSE is diluted to nothing by the flat majority, and max delta is pinned by
 * a handful of antialiased glyph edges that no reader will ever resolve.
 * Banding is a population property - many neighbouring pixels quantising the
 * same wrong way - so it is counted, not averaged.
 */
function compare(a, b) {
  let sum = 0;
  let max = 0;
  let visible = 0;
  for (let p = 0; p < a.length; p += 3) {
    let worst = 0;
    for (let c = 0; c < 3; c++) {
      const d = a[p + c] - b[p + c];
      sum += d * d;
      if (Math.abs(d) > worst) worst = Math.abs(d);
    }
    if (worst > max) max = worst;
    if (worst > VISIBLE_DELTA) visible += 1;
  }
  return { rmse: Math.sqrt(sum / a.length), max, visiblePct: (visible / (a.length / 3)) * 100 };
}

/**
 * Decode every composed frame of the GIF back to raw RGB. Decoded whole
 * rather than page by page: sharp's extract is page-relative on an animated
 * input, so it silently only ever addresses the first frame.
 */
async function decodeFrames(gif, width, height, count) {
  const { data, info } = await sharp(gif, { animated: true }).raw().toBuffer({ resolveWithObject: true });
  const px = width * height;
  const out = [];
  for (let f = 0; f < count; f++) {
    const rgb = Buffer.allocUnsafe(px * 3);
    for (let p = 0; p < px; p++) {
      const s = (f * px + p) * info.channels;
      rgb[p * 3] = data[s];
      rgb[p * 3 + 1] = data[s + 1];
      rgb[p * 3 + 2] = data[s + 2];
    }
    out.push(rgb);
  }
  return out;
}

/**
 * Measure what the objective function actually constrains: frame-1 fidelity
 * against the source render, and quantisation error across the fade frames,
 * which is what banding is. Both are measured on the decoded GIF, never on
 * the input, because the palette is applied by the encoder.
 */
async function measure(gif, built) {
  const { frames, width, height } = built;
  const got = await decodeFrames(gif, width, height, frames.length);
  const first = compare(frames[0], got[0]);

  const segment = frames.length / SEQUENCE.length;
  let mean = 0;
  let worstPct = 0;
  let max = 0;
  let n = 0;
  for (let i = 0; i < frames.length; i++) {
    if (i % segment === 0) continue; // a hold, not a fade
    const e = compare(frames[i], got[i]);
    mean += e.visiblePct;
    n += 1;
    if (e.visiblePct > worstPct) worstPct = e.visiblePct;
    if (e.max > max) max = e.max;
  }
  return { frame1: first, fadeMeanPct: mean / n, fadeWorstPct: worstPct, fadeMax: max, frames: frames.length };
}

/* Thresholds.

   Frame 1 is exact or it is not shipped. A whole-frame RMSE is the wrong
   instrument for it: this art is mostly flat, so a few badly quantised pixels
   move the mean almost not at all while being plainly visible. The measured
   grid showed a 2x config passing an RMSE bar at 1.41 while its worst pixel
   was 36 out. So frame 1 is held to a max channel delta of zero, which a
   256-colour local palette reaches on this art anyway.

   Fade banding is held on the share of visibly wrong pixels per fade frame,
   for the reason given on `compare`. One percent is the mild ceiling: below
   it the misses are scattered glyph edges, above it they start to gather
   into the contours that read as banding. */
const BUDGET_BYTES = 300 * 1024;
const FRAME1_MAX_DELTA = 0;
const FADE_VISIBLE_PCT_MAX = 1.0;

const kb = (n) => (n / 1024).toFixed(1);

export async function attempt(zoom, fadeSteps, opts) {
  const built = await buildFrames(zoom, fadeSteps);
  const gif = await encode(built, opts);
  const m = await measure(gif, built);
  return {
    zoom, fadeSteps, opts, gif, built,
    bytes: gif.length,
    ...m,
    ok: gif.length <= BUDGET_BYTES && m.frame1.max <= FRAME1_MAX_DELTA && m.fadeWorstPct <= FADE_VISIBLE_PCT_MAX,
  };
}

export const row = (r) =>
  `${r.zoom}x steps=${r.fadeSteps} col=${r.opts.colours ?? 256} dith=${r.opts.dither ?? 1} ifme=${r.opts.interFrameMaxError ?? 0}` +
  ` -> ${kb(r.bytes)}KB f1max=${r.frame1.max} fadevis=${r.fadeMeanPct.toFixed(3)}%/${r.fadeWorstPct.toFixed(3)}% fademax=${r.fadeMax} ${r.ok ? "OK" : "--"}`;

async function search() {
  const grid = [];
  for (const zoom of [2, 1])
    for (const fadeSteps of [6, 8])
      for (const colours of [256, 128])
        for (const interPaletteMaxError of [0, 3])
          for (const interFrameMaxError of [0, 8, 10, 12, 16, 32])
            grid.push({ zoom, fadeSteps, opts: { colours, dither: 0, interFrameMaxError, interPaletteMaxError } });

  const results = [];
  for (const g of grid) {
    const r = await attempt(g.zoom, g.fadeSteps, g.opts);
    results.push(r);
    console.log(row(r));
  }
  for (const zoom of [2, 1]) {
    const passing = results.filter((r) => r.ok && r.zoom === zoom).sort((a, b) => a.bytes - b.bytes);
    console.log(`\nsmallest passing at ${zoom}x: ${passing.length ? row(passing[0]) : "none"}`);
  }
}

/* The chosen build: the smallest config the sweep found that satisfies every
   constraint. Read off --search, not picked by hand.

   1x, because 2x cannot be had. At 1200x340 the smallest encoding with an
   exact frame 1 and intact fades measures 425KB, and every 2x config that
   does fit 300KB pays for it in frame 1 or in the fades. The ruling settles
   that trade in advance: the static-fallback audience only ever sees frame 1,
   so frame 1 outranks retina sharpness.

   interPaletteMaxError: 0 is what makes the fades hold up. On the encoder's
   default the mid-fade frames inherit a neighbour's palette and the worst one
   misses on 7.3% of its pixels; a fresh palette per frame takes that to 0.2%
   and costs 3KB. That one parameter is worth more here than dithering and
   colour count together, both of which this art is flat enough to ignore.

   interFrameMaxError sits at 10 because 12 falls off a cliff, 0.2% to 5.3%.
   Being one step from a cliff is safe only because it is measured on every
   build: `main` exits non-zero if any constraint breaks, so a future copy
   change that tips the encoder over fails loudly rather than shipping soft. */
export const CHOSEN = {
  zoom: 1,
  fadeSteps: 6,
  opts: { colours: 256, dither: 0, interFrameMaxError: 10, interPaletteMaxError: 0 },
};

async function main() {
  if (process.argv.includes("--search")) return search();
  const r = await attempt(CHOSEN.zoom, CHOSEN.fadeSteps, CHOSEN.opts);
  writeFileSync(outPath, r.gif);
  console.log(row(r));
  console.log(`wrote ${outPath}`);
  console.log(`measured ${r.bytes} bytes (${kb(r.bytes)}KB), ${r.built.width}x${r.built.height}, ${r.frames} frames`);
  if (!r.ok) {
    console.error("FAILS the objective function above");
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
