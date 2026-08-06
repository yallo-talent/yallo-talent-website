#!/usr/bin/env node
/**
 * Converts the supplied client logo pack into web assets.
 *
 * Source files are a mix of transparent PNG, opaque JPEG and one SVG, at wildly
 * different crops and resolutions. The homepage renders them inside small
 * neutral tiles, so every raster is trimmed to its ink, flattened onto white
 * and emitted at 2x the rendered height (56px -> 112px). SVG is copied through
 * untouched because it needs no raster treatment.
 *
 * Only the names carrying consent in content/clients.yaml are converted. The
 * rest of the pack is deliberately not shipped — they are not current trading
 * relationships.
 *
 * ONE mark is not in the supplied pack and is committed directly rather than
 * generated here, so this script does not touch it:
 *   public/logos/integrators/capgemini.png  — Capgemini_201x_logo.svg, Wikimedia Commons
 * It is used nominatively to identify a client with consent on file.
 *
 * ROUND 17, AND THIS COMMENT WAS WRONG FOR THREE ROUNDS. It said Radwell was
 * absent from the supplied pack and committed by hand, and round 16 §2.6 went
 * further with "radwell.png IS NOT IN THE REPOSITORY". Both false.
 * `assets/client-logos/Radwell.png` had been in the pack the whole time; what was
 * missing was the BUILT file, because the slug sat commented out of CLIENTS below
 * so this script never converted it. Every downstream conclusion inherited the
 * error: `hasLogoAsset()` dropped the row, the rail comment listed Radwell as
 * unkeyable, and round 17 §2.4 retired the yaml row on the stated grounds that the
 * asset did not exist.
 *
 * The lesson worth keeping: "the asset is absent" had been checked against
 * public/logos/clients/, which is this script's OUTPUT. Absence there means the
 * build did not run, not that the source is missing.
 *
 *   node scripts/build-logos.mjs
 */
import {
  existsSync, rmSync,
  mkdirSync,
  readdirSync,
} from "node:fs";
import { basename, extname, join } from "node:path";
import sharp from "sharp";

const SRC = join(process.cwd(), "assets", "client-logos");
const OUT_CLIENTS = join(process.cwd(), "public", "logos", "clients");
const OUT_INTEGRATORS = join(process.cwd(), "public", "logos", "integrators");
const OUT_PLATFORMS = join(process.cwd(), "public", "logos", "platforms");

/* These four MUST track .logo and .logo img in Home.module.css. They were left
   behind when the rail was enlarged — cell 156 -> 208, cap 26 -> 37 — and a
   stale cell is not a cosmetic drift: RAIL_CELL and RAIL_CAP decide which
   clients ship as a keyed silhouette and which fall back to a typeset name, so
   the pack was being chosen by geometry the page no longer uses. Marks that
   were correctly rejected as illegible at a 26px cap can be legible at 37px. */
const RENDER_HEIGHT = 112; // ORDER 6 round 2 cell height; SCALE covers retina
const SCALE = 2;

/** The rail's uniform cell, so the legibility gate below matches what ships. */
const RAIL_CELL = 300;
const RAIL_CAP = 68;
const RAIL_CAP_FLOOR = 15;
/** Above this share of perimeter ink the mark is a box, not a letterform. */
const SLAB_PERIMETER_PCT = 15;

/** slug -> source filename. Source misspellings are corrected in the slug. */
const CLIENTS = {
  alshaya: "alshaya-vector.svg",
  "landmark-group": "LMG Horizontal.jpeg",
  "majid-al-futtaim": "MAF Horizontal.png",
  "al-tayer": "Al Tayer.jpeg",
  "al-futtaim": "Al Futtaim Sqaure.jpeg", // source misspells "Square"
  "chalhoub-group": "Chalhoub Sqaure.jpeg", // source misspells "Square"
  "al-othaim-markets": "Al Othaim Markets.png",
  sephora: "Sephora.png",
  richemont: "Richemont.jpeg",
  "marks-and-spencer": "M&S.jpeg",
  "panda-retail": "Panda.png",
  /* Wickes-new.png, Sumeet's replacement, round 17. Both his files are the same
     shield-with-knockout-text lockup and both now key, but this one is the
     cleaner source: 244x148 and opaque, against 1044x504 with a translucent
     shield edge whose antialiasing the keyer has to erode away. */
  wickes: "Wickes-new.png",
  radwell: "Radwell.png",
  informatica: "informatica.png", // R-INF3, 1 Aug. Consent is NOT on file — the
  // mark is built so it is ready, and content/clients.yaml keeps the entry
  // filtered out until Sumeet flips consentOnFile. Building it now is what makes
  // the flip a one-line data change rather than a task.
};

const INTEGRATORS = {
  tcs: "TCS.png",
  wipro: "Wipro.png",
  infosys: "Infosys.png",
  "oracle-consulting": "Oracle.png",
  // capgemini: committed directly as public/logos/integrators/capgemini.png.
};

/**
 * Round 14. The seven platform vectors this script otherwise never touches
 * (see the header) are five committed SVGs, one hand-drawn RoleGlyph-style
 * fallback, and Blue Yonder — a raster that shipped as an opaque plate with
 * no real alpha, so src/data/home/place.ts declined it and fell back to the
 * name. A real source arrived (BlueYonder-icon.jpeg — the comment said
 * BlueYonder.png until round 16, while the map below has always read the
 * -icon.jpeg; both files exist in assets/client-logos/, so the wrong name
 * named a real file and nothing failed). It goes through the SAME
 * keying gate as every client mark rather than a hand-rolled second pass:
 * the gate exists precisely to catch "looks fine, keys to a box" before it
 * ships, and there is no reason a platform asset should skip the check a
 * client asset cannot.
 *
 * The gate's RAIL_CELL/RAIL_CAP constants are calibrated for the rail, not
 * the platform axis's smaller 26px inkCap (src/lib/mark-surfaces.json) — a
 * mark that fails here would fail smaller too, but a pass here is not by
 * itself proof of axis legibility. `pnpm run marks:measure -- --report`
 * after this is what actually confirms the axis tolerance.
 */
const PLATFORMS = {
  /* Icon-only sources, deliberately not the icon+wordmark lockups above —
     Sumeet's correction: the axis shows a clean mark for every platform
     (Oracle's ring, Workday's circle), and a wordmark baked into the source
     file reads as illegible type at a 34px ink cap, not as a mark. */
  "blue-yonder": "BlueYonder-icon.jpeg",
  "informatica-icon": "Informatica-icon.png",
};

/**
 * The legibility assessment, as a function of an alpha buffer.
 *
 * Extracted from `convert` so the SAME judgement can be applied to two
 * candidates: the default single-threshold key, and the polarity key below when
 * the first is declined. A gate that can only see one candidate cannot choose.
 */
function assessAlpha(alpha, w, h) {
  let tp = 0;
  let mid = 0;
  let solid = 0;
  for (const a of alpha) {
    if (a < 8) tp++;
    else if (a <= 247) mid++;
    if (a > 191) solid++;
  }
  const inkDensityPct = (100 * solid) / alpha.length;
  const transparentPct = (100 * tp) / alpha.length;
  const partialPct = (100 * mid) / alpha.length;
  const capAtCell = Math.min(RAIL_CAP, (RAIL_CELL * h) / w);

  const at = (x, y) => alpha[y * w + x];
  let edgeInk = 0;
  let edgeTotal = 0;
  for (let x = 0; x < w; x++) {
    for (const y of [0, h - 1]) {
      edgeTotal++;
      if (at(x, y) > 191) edgeInk++;
    }
  }
  for (let y = 1; y < h - 1; y++) {
    for (const x of [0, w - 1]) {
      edgeTotal++;
      if (at(x, y) > 191) edgeInk++;
    }
  }
  const perimeterPct = (100 * edgeInk) / edgeTotal;

  const reasons = [];

  /* DENSITY ALONE CANNOT TELL A PLATE FROM A BOLD WORDMARK, so it no longer tries.
     
     The threshold was calibrated when every wordmark in the pack sat at or under
     37% ink and the only dense thing was Sephora's placeholder plate at 48.5%. A
     heavy sans wordmark breaks that: Wickes measures 45-66% depending on the crop,
     with no plate anywhere in it, and would be refused for being bold.
     
     What actually separates them is STRUCTURE. A plate with knockout text is ONE
     ink component and the letters are holes inside it. A wordmark is several
     components, one per letter or letter group, and no single one dominates. So
     density is now only a symptom, and the diagnosis is whether the ink is one
     body: the largest component holding 80% or more of the ink is a plate, and
     anything more distributed is type. Sephora's plate is 100% one component;
     Wickes's wordmark spreads across six with the largest near a quarter. */
  const inkMask = new Uint8Array(w * h);
  for (let i = 0; i < alpha.length; i++) inkMask[i] = alpha[i] > 191 ? 1 : 0;
  const inkComponents = components(inkMask, w, h).sort((a, b) => b.area - a.area);
  const inkPixels = inkComponents.reduce((n, c) => n + c.area, 0);
  const dominance = inkPixels > 0 ? inkComponents[0].area / inkPixels : 0;

  if (inkDensityPct > 42 && dominance >= 0.8)
    reasons.push(
      `${inkDensityPct.toFixed(1)}% ink in one body (${(100 * dominance).toFixed(0)}% of it) — reads as a filled plate with knockout text`,
    );
  if (transparentPct < 25)
    reasons.push(`only ${transparentPct.toFixed(1)}% transparent`);
  if (partialPct > 45) reasons.push(`${partialPct.toFixed(1)}% partial alpha`);
  if (capAtCell < RAIL_CAP_FLOOR)
    reasons.push(`cap height ${capAtCell.toFixed(1)}px at the rail cell`);
  /* The perimeter test is gated on the same structural evidence, and for the same
     reason. It asks "does the ink run along the frame", which is true of a box
     lockup and ALSO true of any bold wordmark trimmed to its own ink: the letters
     define the bounding box, so they touch it. Wickes measured 44.6% perimeter as
     a clean six-letter wordmark with no plate in it at all, while Radwell's
     lighter serif measured 0.0% — the difference was stroke weight, not structure.
     
     A box lockup's perimeter ink is ONE component tracing the frame. A wordmark's
     is many short runs from separate letters. Dominance already measures exactly
     that, so both plate tests now share it: they fire only when the ink is one
     body. A genuine plate is one body and still fails both. */
  if (perimeterPct > SLAB_PERIMETER_PCT && dominance >= 0.8)
    reasons.push(
      `box lockup — ${perimeterPct.toFixed(1)}% perimeter ink in one body`,
    );
  return { reasons, inkDensityPct, dominance };
}

/** Connected components of a binary mask, with bounding boxes and pixel lists. */
function components(mask, w, h) {
  const seen = new Uint8Array(w * h);
  const stack = new Int32Array(w * h);
  const out = [];
  for (let s = 0; s < w * h; s++) {
    if (!mask[s] || seen[s]) continue;
    let sp = 0;
    stack[sp++] = s;
    seen[s] = 1;
    let area = 0;
    let x0 = w;
    let y0 = h;
    let x1 = -1;
    let y1 = -1;
    const px = [];
    while (sp) {
      const p = stack[--sp];
      const x = p % w;
      const y = (p - x) / w;
      area++;
      px.push(p);
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const np = ny * w + nx;
        if (mask[np] && !seen[np]) {
          seen[np] = 1;
          stack[sp++] = np;
        }
      }
    }
    out.push({ area, x0, y0, x1, y1, px });
  }
  return out;
}

/**
 * A POLARITY-AWARE key, for sources whose letterforms are defined by two colours
 * rather than one.
 *
 * WHY THE DEFAULT CANNOT DO THESE. Otsu picks ONE global threshold, which is
 * exactly right for ink-on-ground and structurally wrong for a reversed-out
 * composite. Radwell is the case that named it: a blue field, a white panel inset
 * into it, the "R" in blue INSIDE the panel and "ADWELL" in white on the field.
 * No single threshold keeps both — one polarity always keys as ground — so the
 * default emitted a solid black square with the wordmark half knocked out of it.
 * Wickes is the same shape without the panel: white letters on a blue shield,
 * where the shield is what a single threshold silhouettes.
 *
 * HOW, all measured from the file rather than configured:
 *   1. The FIELD is the modal opaque colour — the plate the artwork sits on.
 *   2. A PANEL is the largest connected near-white region, by bounding box, and
 *      only when it is solid (>55% fill) and substantial (>4% of the image).
 *      Solidity is what tells a panel from a letter: a white rectangle with an R
 *      knocked out of it fills 86% of its box; a "W" fills about half.
 *   3. Ink is then polarity-dependent — dark inside the panel, light outside it.
 *      Inside, the cut is deep (luminance < 120) because the panel's own
 *      antialiased edge would otherwise key as a hairline down the mark. Radwell's
 *      R is saturated brand blue at luminance 86, well clear of it.
 *
 * Two guards, both learned by watching this go wrong:
 *   - Pixels within 2px of a translucent pixel are ignored, or the plate's alpha
 *     boundary keys as a thin outline of the plate.
 *   - Any ink component that TRACES the plate's outline — bounding box over 60% of
 *     the plate at under 30% fill — is dropped. That removes Wickes's shield while
 *     keeping its letters, stated as a rule rather than a special case: the
 *     outline of a plate is the plate, not the mark.
 *
 * Returns null when it finds nothing usable, so the caller keeps the default.
 */
async function keyPolarity(src, targetHeight) {
  /* Trimmed on the ALPHA edge and deliberately NOT flattened: flattening onto
     white destroys the transparent-outside information this needs, and would make
     the area outside a shield read as light ink.
     
     AND NOT RESIZED YET. Every decision below is morphological — a 2px erosion, a
     connected-component solidity, a ring whose fill distinguishes it from a
     letter — and those are properties of the artwork at ITS resolution, not of a
     224px thumbnail. Measured: masking after the downscale left Wickes's shield
     ring merged into the letterforms at 51.8% ink, because at 224px the ring is
     two antialiased pixels wide and no longer a component of its own. The alpha is
     resized at the end instead. */
  const { data, info } = await sharp(src, { density: 300 })
    .trim()
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width: w, height: h, channels: c } = info;
  const at = (x, y) => {
    const i = (y * w + x) * c;
    return [data[i], data[i + 1], data[i + 2], data[i + 3]];
  };
  const lum = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

  const opaque = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) opaque[i] = data[i * c + 3] > 200 ? 1 : 0;

  let px0 = w;
  let py0 = h;
  let px1 = -1;
  let py1 = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!opaque[y * w + x]) continue;
      if (x < px0) px0 = x;
      if (x > px1) px1 = x;
      if (y < py0) py0 = y;
      if (y > py1) py1 = y;
    }
  }
  if (px1 < 0) return null;
  const plateArea = (px1 - px0 + 1) * (py1 - py0 + 1);

  const interior = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!opaque[y * w + x]) continue;
      let ok = 1;
      for (let dy = -2; dy <= 2 && ok; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= w || ny >= h || !opaque[ny * w + nx]) {
            ok = 0;
            break;
          }
        }
      }
      interior[y * w + x] = ok;
    }
  }

  const counts = new Map();
  for (let i = 0; i < w * h; i++) {
    if (!interior[i]) continue;
    const o = i * c;
    const k =
      ((data[o] >> 4) << 8) | ((data[o + 1] >> 4) << 4) | (data[o + 2] >> 4);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  if (counts.size === 0) return null;
  let modal = 0;
  let modalN = -1;
  for (const [k, n] of counts) {
    if (n > modalN) {
      modalN = n;
      modal = k;
    }
  }
  const fr = ((modal >> 8) & 15) * 17;
  const fg = ((modal >> 4) & 15) * 17;
  const fb = (modal & 15) * 17;
  const isField = (r, g, b) =>
    Math.abs(r - fr) < 56 && Math.abs(g - fg) < 56 && Math.abs(b - fb) < 56;

  const light = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!interior[y * w + x]) continue;
      const [r, g, b] = at(x, y);
      light[y * w + x] = lum(r, g, b) > 200 && !isField(r, g, b) ? 1 : 0;
    }
  }

  let panel = null;
  const biggest = components(light, w, h).sort((a, b) => b.area - a.area)[0];
  if (biggest) {
    const bw = biggest.x1 - biggest.x0 + 1;
    const bh = biggest.y1 - biggest.y0 + 1;
    const solidity = biggest.area / (bw * bh);
    const share = (bw * bh) / (w * h);
    if (solidity > 0.55 && share > 0.04 && bw > 12 && bh > 12) {
      panel = {
        x0: biggest.x0,
        y0: biggest.y0,
        x1: biggest.x1,
        y1: biggest.y1,
      };
    }
  }
  const inPanel = (x, y) =>
    panel !== null &&
    x >= panel.x0 &&
    x <= panel.x1 &&
    y >= panel.y0 &&
    y <= panel.y1;

  /* WHAT IS OUTSIDE THE ARTWORK, found by reachability rather than by colour.
     
     A plate is not always rectangular, and an opaque source keeps its background
     in the corners that the trim cannot reach. Wickes's shield comes to a point,
     so the white below that point survives the trim and — being light, and not the
     field colour — keyed as ink: the mark shipped as the wordmark plus a solid
     chevron. The measurements were clean, because a chevron is a legitimate second
     component of ordinary size; only looking at the pixels showed it.
     
     So the outside is whatever is REACHABLE from the frame without crossing the
     plate. Letters sit inside the plate and are never reachable, so they survive;
     background survives nothing. Colour-independent, which is the point: it works
     for a white surround, a dark one, or a transparent one.
     
     RUN AFTER PANEL DETECTION, WITH THE PANEL AS A WALL. Radwell's trim crops
     tight enough that its white panel touches the frame, so a flood run before
     the panel was known swallowed the panel and the "R" inside it, and the mark
     silently fell back to the default key's black square. A detected panel is
     part of the artwork by definition, so it stops the flood. */
  const outside = new Uint8Array(w * h);
  {
    const stack = [];
    const push = (x, y) => {
      const p = y * w + x;
      if (outside[p]) return;
      const o = p * c;
      if (inPanel(x, y)) return;
      const translucent = data[o + 3] <= 200;
      if (!translucent && isField(data[o], data[o + 1], data[o + 2])) return;
      outside[p] = 1;
      stack.push(p);
    };
    for (let x = 0; x < w; x++) {
      push(x, 0);
      push(x, h - 1);
    }
    for (let y = 0; y < h; y++) {
      push(0, y);
      push(w - 1, y);
    }
    while (stack.length) {
      const p = stack.pop();
      const x = p % w;
      const y = (p - x) / w;
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        push(nx, ny);
      }
    }
  }


  const mask = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!interior[y * w + x] || outside[y * w + x]) continue;
      const [r, g, b] = at(x, y);
      const L = lum(r, g, b);
      if (inPanel(x, y)) {
        if (L < 120) mask[y * w + x] = 1;
      } else if (L > 200 && !isField(r, g, b)) {
        mask[y * w + x] = 1;
      }
    }
  }

  let droppedOutlines = 0;
  for (const comp of components(mask, w, h)) {
    const bw = comp.x1 - comp.x0 + 1;
    const bh = comp.y1 - comp.y0 + 1;
    const bbox = bw * bh;
    if (bbox > 0.6 * plateArea && comp.area / bbox < 0.3) {
      for (const p of comp.px) mask[p] = 0;
      droppedOutlines++;
    }
  }

  let inkPixels = 0;
  for (let i = 0; i < w * h; i++) if (mask[i]) inkPixels++;
  if (inkPixels === 0) return null;

  /* Trimmed again: dropping the panel and the plate outline leaves a wide
     transparent margin, and the mark must occupy its own bounding box for the
     cap-height test and the rail cell to mean anything. */
  const rgba = Buffer.alloc(w * h * 4);
  for (let i = 0; i < w * h; i++) rgba[i * 4 + 3] = mask[i] ? 255 : 0;
  const trimmed = await sharp(rgba, {
    raw: { width: w, height: h, channels: 4 },
  })
    .trim()
    /* Down to the rail's render height only now that the morphology is done. */
    .resize({
      height: targetHeight,
      width: targetHeight * 6,
      fit: "inside",
      withoutEnlargement: false,
    })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const tw = trimmed.info.width;
  const th = trimmed.info.height;
  const alpha = Buffer.alloc(tw * th);
  for (let i = 0; i < tw * th; i++) alpha[i] = trimmed.data[i * 4 + 3];

  return {
    alpha,
    width: tw,
    height: th,
    panel: panel !== null,
    droppedOutlines,
  };
}

const missing = [];
let written = 0;
/** Marks that failed the legibility gate and ship as their name instead. */
const nameOnly = [];

async function convert(slug, file, outDir) {
  const src = join(SRC, file);
  if (!existsSync(src)) {
    missing.push(`${slug} (expected "${file}")`);
    return;
  }
  mkdirSync(outDir, { recursive: true });

  // SVG is NOT copied through. It used to be — "a vector needs no raster
  // treatment" — and that reasoning was wrong in the way that matters: the
  // treatment the rail needs is not rasterisation, it is KEYING. Measured, the
  // three vectors shipped at mean chroma 103, 184 and 175 against 0.0 for every
  // keyed raster, so Alshaya rendered brand blue, Capgemini orange on dark, and
  // Radwell a solid plate that inverted to a gold-orange block — a non-brand
  // element reading as gold in a rail canon §8 requires to be uniform
  // monochrome. Vectors go through the same gate as everything else; the only
  // difference is they rasterise at 3x for crispness first.

  const out = join(outDir, `${slug}.png`);

  // A TRUE-ALPHA SILHOUETTE, not a flattened tile.
  //
  // The pack is 15 opaque rasters (PNG colour-type 3 and JPEG, no alpha) with
  // baked white or, on a few, baked dark backgrounds. The previous version
  // flattened everything onto white, which meant the only way to show them on
  // the site's paper and charcoal grounds was a CSS filter plus a per-theme
  // mix-blend-mode — and a blend mode against a baked background cannot give one
  // tone at one opacity. It left visible boxes on any mark whose own background
  // was off-white or dark (QUESTIONS.md Q4).
  //
  // So the background is keyed out here instead, at build time, where it belongs:
  // greyscale, normalise, invert, and use the result as the ALPHA of a solid
  // black image. Ink becomes opaque, background becomes transparent, and the
  // rail can then paint the mark in a single ink token per theme with no blend
  // mode at all.
  //
  // `normalise` before `negate` matters: several sources are low-contrast scans
  // where the "white" is around #f2f2f2, and without it the background keyed out
  // to alpha 13 rather than 0 and left a faint plate.
  const pre = sharp(src, { density: 300 })
    // Trim the surrounding flat colour so every mark occupies its cell evenly.
    .trim({ threshold: 12 })
    // Flatten first: this normalises the mix of transparent PNG and opaque JPEG
    // to one known background before it is keyed out.
    .flatten({ background: "#ffffff" })
    .resize({
      height: RENDER_HEIGHT * SCALE,
      width: RENDER_HEIGHT * SCALE * 6,
      fit: "inside",
      withoutEnlargement: false,
    });

  // Polarity is detected, not assumed. Half this pack is dark ink on a light
  // ground and half is light ink on a dark or coloured ground, and a single
  // greyscale-then-invert keys out the wrong half: measured, marks-and-spencer
  // came out 96.5% PARTIAL alpha and only 0.1% transparent, because inverting a
  // white-on-dark mark makes the background opaque and the ink vanish.
  //
  // So the border ring is sampled to find the actual background luminance, and
  // the alpha is taken as the DISTANCE from it. That works for either polarity
  // and for the coloured grounds too. The linear ramp afterwards pushes the
  // result towards binary: several sources are low-contrast scans where the
  // ground sits around #f2f2f2, and without it the ground keyed to alpha ~13 and
  // left a faint visible plate behind the mark.
  const grey = await pre.clone().greyscale().normalise().raw()
    .toBuffer({ resolveWithObject: true });
  const { data: g, info: ai } = grey;

  // Otsu's method, not a border sample. A border ring mean assumes the ground is
  // flat and still present after the trim; measured, that left six of fifteen
  // marks at under 6% transparent with 60-85% of pixels stuck at partial alpha,
  // because their grounds are gradients or brand colours and the trim had
  // already eaten the flat edge on some.
  //
  // Otsu finds the threshold that best separates the image into two luminance
  // classes, which is exactly the ink/ground split. The border ring is then used
  // only to decide WHICH class is the ground, so either polarity works. Alpha is
  // the pixel's position between the two class means, so antialiased edges stay
  // soft instead of being binarised into jaggies.
  const hist = new Array(256).fill(0);
  for (const v of g) hist[v]++;
  const total = g.length;
  let sumAll = 0;
  for (let v = 0; v < 256; v++) sumAll += v * hist[v];
  let wB = 0;
  let sumB = 0;
  let best = -1;
  let t = 127;
  for (let v = 0; v < 256; v++) {
    wB += hist[v];
    if (wB === 0) continue;
    const wF = total - wB;
    if (wF === 0) break;
    sumB += v * hist[v];
    const mB = sumB / wB;
    const mF = (sumAll - sumB) / wF;
    const between = wB * wF * (mB - mF) * (mB - mF);
    if (between > best) {
      best = between;
      t = v;
    }
  }
  // Class means either side of the threshold.
  let n0 = 0;
  let s0 = 0;
  let n1 = 0;
  let s1 = 0;
  for (let v = 0; v < 256; v++) {
    if (v <= t) {
      n0 += hist[v];
      s0 += v * hist[v];
    } else {
      n1 += hist[v];
      s1 += v * hist[v];
    }
  }
  const m0 = n0 ? s0 / n0 : 0;
  const m1 = n1 ? s1 / n1 : 255;

  // Which class is the ground: whichever side the border ring sits on.
  let bsum = 0;
  let bn = 0;
  for (let y = 0; y < ai.height; y++) {
    for (let x = 0; x < ai.width; x++) {
      if (x >= 2 && y >= 2 && x < ai.width - 2 && y < ai.height - 2) continue;
      bsum += g[y * ai.width + x];
      bn++;
    }
  }
  const borderMean = bn ? bsum / bn : 255;
  const groundIsBright = Math.abs(borderMean - m1) < Math.abs(borderMean - m0);
  const bg = groundIsBright ? m1 : m0;
  const range = Math.abs(m1 - m0) || 1;

  // A DEAD ZONE around the ground, because a class MEAN is not a class EDGE.
  //
  // This was the whole reason six marks "would not key". Oracle is red on white:
  // Otsu split it perfectly, ground class mean 247, ink mean 24. But true white
  // is 255, so every ground pixel came out |255-247|/223 = 0.036 -> alpha 9,
  // and the clarity test counts transparent as alpha < 8. Nine. The ground was
  // being keyed to within one point of invisible and then failed for it, and the
  // gate reported "only 2.0% transparent" on an image that is 73% clean white.
  // Al Othaim, Landmark, Chalhoub and Sephora all failed the same way.
  //
  // The ground occupies a spread, not a value — scans, JPEG ringing and
  // antialiasing put it a few points either side of its mean. So the bottom
  // slice of the distance ramp collapses to fully transparent, and the rest is
  // rescaled across what remains. Ink is untouched: at 12% of the class
  // separation the zone is far below any real letterform stroke.
  const DEAD = 0.12;
  const alpha = Buffer.allocUnsafe(g.length);
  for (let k = 0; k < g.length; k++) {
    const d = Math.abs(g[k] - bg) / range;
    const keyed = d <= DEAD ? 0 : (d - DEAD) / (1 - DEAD);
    alpha[k] = Math.round(Math.max(0, Math.min(1, keyed)) * 255);
  }

  // LEGIBILITY GATE, measured, not judged by eye.
  //
  // Otsu keys eleven of the fifteen cleanly. The rest are multi-tone sources —
  // gradients and several brand colours in one mark — where a two-class split
  // necessarily leaves most pixels at partial alpha, so the silhouette would
  // render as a soft grey smear rather than one ink. Chasing those with more
  // clever keying means guessing at artwork we do not have.
  //
  // Canon §8 and the rail brief both say the same thing: a mark that cannot read
  // at rail height renders as its NAME, never as a padded box and never redrawn.
  // So this refuses to emit an asset it cannot vouch for, and content/clients.yaml
  // keeps the name — src/lib/clients.ts already renders a wordmark for any
  // consented client with no logo file, so the fallback path is the existing one.
  //
  // Three independent tests:
  //   clarity  — a clean silhouette is mostly transparent with solid ink. Under
  //              25% transparent, or over 45% of pixels stuck mid-alpha, means
  //              the ground did not separate.
  //   capHeight — at the rail's RAIL_CELL a mark this wide is scaled to fit
  //              width, so its ink height falls out of the aspect ratio. Below
  //              15px it is a line, not a mark.
  //   slab     — a BOX LOCKUP keys to its box, not its letterform. Silhouetting
  //              one gives a solid rectangle: black on light, and on the dark
  //              rail a near-white card, which canon §8 forbids outright. Two
  //              marks were shipping that way and the clarity test cannot see
  //              it, because a filled box IS a clean two-class key.
  //
  //              Ink density alone does not separate them either: Infosys is a
  //              legitimate wordmark at 31.8% ink, ABOVE Radwell's 34.9% box.
  //              PERIMETER ink does. A box runs its ink along the outer frame;
  //              a wordmark's letters float inside the trimmed bounding box and
  //              touch the edge only in places. Measured across the whole pack:
  //              the two boxes are 25.0% and 30.5%, every real wordmark is at or
  //              under 5.0%. The threshold sits in a gap five times wider than
  //              the spread it has to resolve.
  // The default key, assessed. The metrics and their thresholds live in
  // assessAlpha() so the same judgement can be applied to a second candidate.
  let chosen = { alpha, width: ai.width, height: ai.height };
  let { reasons } = assessAlpha(alpha, ai.width, ai.height);
  let via = "";

  // THE POLARITY KEY IS TRIED FOR EVERY MARK, and adopted on evidence.
  //
  // It was first written to run only when the default key was DECLINED, which
  // seemed conservative and missed the case that prompted it. Radwell's default
  // key passes every test — 31.9% ink, 0.0% perimeter, cap 68 — and is a solid
  // black square with the wordmark half knocked out of it. The slab test assumes a
  // plate runs its ink along the PERIMETER; Radwell's panel occupies the left
  // third, so no edge of the trimmed box is filled and the measurement is clean
  // while the mark is not. A gate that cannot see a defect cannot be the trigger
  // for fixing it.
  //
  // So adoption rests on POSITIVE EVIDENCE that the source is a reversed-out
  // composite, which is what keyPolarity actually reports: an inset near-white
  // PANEL, or an ink component tracing the plate's own outline. Neither occurs in
  // an ordinary ink-on-ground mark — a white ground is the field and produces no
  // light component at all — so the evidence is specific rather than a heuristic
  // about quality.
  //
  // Adopted when EITHER
  //   the polarity key found composite evidence and its result passes the gate, OR
  //   the default was declined and the polarity result passes.
  // In both cases the same gate judges the candidate, so nothing ships that the
  // default path would have refused, and a mark the polarity key cannot improve
  // keeps whatever the default produced.
  const alt = await keyPolarity(src, RENDER_HEIGHT * SCALE).catch((err) => {
    /* Reported, not swallowed. A silent catch here cost two debugging cycles:
       a thrown error and "this source is not a composite" are the same outcome
       to the caller and must not look the same to the reader. */
    console.log(`  ${slug}: polarity key errored — ${err.message}`);
    return null;
  });
  if (alt) {
    const second = assessAlpha(alt.alpha, alt.width, alt.height);
    const composite = alt.panel || alt.droppedOutlines > 0;
    if (second.reasons.length === 0 && (composite || reasons.length > 0)) {
      chosen = alt;
      reasons = [];
      const notes = [
        alt.panel ? "inset panel" : null,
        alt.droppedOutlines ? `${alt.droppedOutlines} plate outline dropped` : null,
      ].filter(Boolean);
      via = ` (polarity key${notes.length ? `: ${notes.join(", ")}` : ""})`;
    } else if (second.reasons.length > 0 && reasons.length > 0) {
      /* Reported, never a silent fallthrough. Both keys were tried and both were
         refused, which is a fact about the ASSET and the only thing that tells
         you whether a replacement source would help. */
      console.log(
        `  ${slug}: polarity key also declined — ${second.reasons.join(", ")}`,
      );
    }
  }

  if (reasons.length) {
    nameOnly.push(`${slug}: ${reasons.join(", ")}`);
    // Delete any asset a previous run emitted for this slug. Without this a
    // mark that USED to pass keeps rendering from the stale file for ever:
    // Sephora was declined as a filled plate and still shipped as a black slab,
    // because the decision only ever added to a list and never cleaned up.
    for (const dir of [OUT_CLIENTS, OUT_INTEGRATORS, OUT_PLATFORMS]) {
      const stale = join(dir, `${slug}.png`);
      if (existsSync(stale)) {
        rmSync(stale, { force: true });
        console.log(`  ${slug}: removed stale ${stale}`);
      }
    }
    console.log(`  ${slug}: NAME ONLY — ${reasons.join(", ")}`);
    return;
  }

  // Solid black RGB with that alpha. Black is arbitrary: the rail masks the
  // silhouette and paints it in a theme ink token, so only the alpha is read.
  const info = await sharp({
    create: {
      width: chosen.width,
      height: chosen.height,
      channels: 3,
      background: { r: 0, g: 0, b: 0 },
    },
  })
    .joinChannel(chosen.alpha, {
      raw: { width: chosen.width, height: chosen.height, channels: 1 },
    })
    .png({ compressionLevel: 9 })
    .toFile(out);

  // NO DISPLAY HEIGHT IS WRITTEN HERE ANY MORE.
  //
  // This used to solve one `dh` per mark against a hand-chosen TARGET_AREA of
  // 1150px², clamped to 20-46px, and write it to the manifest. Two things were
  // wrong with that and the manifest showed both:
  //
  //   - NINE of fifteen marks sat pinned at the 46px ceiling, so for those nine
  //     the clamp was the operative rule and the normalisation never ran.
  //     Rendered ink area still spanned 6.07x across the rail.
  //   - A display height is a property of a SURFACE, and there are three at
  //     three box sizes. One number could not serve them, so the case cards and
  //     the platform axis ignored it and used a flat max-height instead.
  //
  // Measurement now belongs to scripts/measure-marks.mjs, which reads what is
  // actually in public/logos — including the seven platform vectors this script
  // never touches — and derivation belongs to src/lib/mark-scale.ts. This
  // script generates assets. Run `pnpm logos` to do both in order.
  console.log(
    `  ${slug}.png ${info.width}x${info.height} ${(info.size / 1024).toFixed(1)}kB (alpha silhouette)${via}`,
  );
  written++;
}

console.log("clients:");
for (const [slug, file] of Object.entries(CLIENTS)) {
  await convert(slug, file, OUT_CLIENTS);
}

console.log("integrators:");
for (const [slug, file] of Object.entries(INTEGRATORS)) {
  await convert(slug, file, OUT_INTEGRATORS);
}

console.log("platforms:");
for (const [slug, file] of Object.entries(PLATFORMS)) {
  await convert(slug, file, OUT_PLATFORMS);
}

console.log(
  `\n${written} logo files written. Run scripts/measure-marks.mjs to refresh the manifest.`,
);
if (nameOnly.length) {
  console.log(
    `\n${nameOnly.length} mark(s) ship as their NAME — the source will not key to one clean ink:`,
  );
  for (const r of nameOnly) console.log(`  ${r}`);
}

// Marks committed outside this script. Verified, not generated — so this
// MEASURES them and reports, rather than replacing or deleting them.
//
// Capgemini was committed by hand, plausibly because the keying path could not do
// it justice, and dropping a curated asset on a heuristic written afterwards
// would be the script overruling a human decision it has no standing to
// overrule. The slab test applies to what ships regardless of how it got there,
// so the gate says so out loud every run rather than passing it in silence.
// QUESTIONS.md Q13 carries the decision.
//
// Radwell used to be in this list. It is generated now — its source was always in
// the pack — so the main gate above measures it like everything else.
for (const [slug, file] of [
  ["capgemini", join(OUT_INTEGRATORS, "capgemini.png")],
]) {
  if (!existsSync(file)) {
    missing.push(`${slug} (expected committed vector at ${file})`);
    continue;
  }
  const { data, info } = await sharp(file)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const at = (x, y) => data[(y * info.width + x) * 4 + 3];
  let ink = 0;
  let total = 0;
  for (let x = 0; x < info.width; x++) {
    for (const y of [0, info.height - 1]) {
      total++;
      if (at(x, y) > 191) ink++;
    }
  }
  for (let y = 1; y < info.height - 1; y++) {
    for (const x of [0, info.width - 1]) {
      total++;
      if (at(x, y) > 191) ink++;
    }
  }
  const perimeterPct = (100 * ink) / total;
  if (perimeterPct > SLAB_PERIMETER_PCT) {
    // A refusal, not a warning. It warned for weeks and shipped anyway, and
    // Radwell has been rendering as a black slab on the rail the whole time —
    // precisely what canon §8 forbids. A committed vector earns no exemption
    // from the test; being hand-supplied says nothing about whether it reads.
    rmSync(file, { force: true });
    nameOnly.push(
      `${slug}: box lockup — ${perimeterPct.toFixed(1)}% perimeter ink (committed vector, declined)`,
    );
    console.log(
      `  ${slug}: NAME ONLY — committed vector is a box lockup at ${perimeterPct.toFixed(1)}% perimeter ink`,
    );
  } else {
    console.log(
      `  ${slug}: committed vector present, ${perimeterPct.toFixed(1)}% perimeter ink`,
    );
  }
}

if (missing.length) {
  console.error(`\nMissing logo sources: ${missing.join(", ")}`);
  process.exit(1);
}

// Report anything in the pack we deliberately did not ship.
const shipped = new Set([...Object.values(CLIENTS), ...Object.values(INTEGRATORS)]);
const unshipped = readdirSync(SRC).filter(
  (f) => !shipped.has(f) && /\.(png|jpe?g|svg)$/i.test(f),
);
console.log(
  `\n${unshipped.length} files in the pack intentionally not shipped (not current trading relationships).`,
);
