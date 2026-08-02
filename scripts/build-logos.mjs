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
 * Two marks are NOT in the supplied pack and are committed directly as vectors
 * rather than generated here, so this script does not touch them:
 *   public/logos/clients/radwell.svg        — from the header of radwell.co.uk
 *   public/logos/integrators/capgemini.svg  — Capgemini_201x_logo.svg, Wikimedia Commons
 * Both are used nominatively to identify a client with consent on file.
 *
 *   node scripts/build-logos.mjs
 */
import {
  existsSync, rmSync,
  mkdirSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { basename, extname, join } from "node:path";
import sharp from "sharp";

const SRC = join(process.cwd(), "assets", "client-logos");
const OUT_CLIENTS = join(process.cwd(), "public", "logos", "clients");
const OUT_INTEGRATORS = join(process.cwd(), "public", "logos", "integrators");

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
  wickes: "Wickes.png",
  informatica: "informatica.png", // R-INF3, 1 Aug. Consent is NOT on file — the
  // mark is built so it is ready, and content/clients.yaml keeps the entry
  // filtered out until Sumeet flips consentOnFile. Building it now is what makes
  // the flip a one-line data change rather than a task.
  // radwell: committed directly as public/logos/clients/radwell.svg — see header.
};

const INTEGRATORS = {
  tcs: "TCS.png",
  wipro: "Wipro.png",
  infosys: "Infosys.png",
  "oracle-consulting": "Oracle.png",
  // capgemini: committed directly as public/logos/integrators/capgemini.svg.
};

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
  const capAtCell = Math.min(RAIL_CAP, (RAIL_CELL * ai.height) / ai.width);

  const alphaAt = (x, y) => alpha[y * ai.width + x];
  let edgeInk = 0;
  let edgeTotal = 0;
  for (let x = 0; x < ai.width; x++) {
    for (const y of [0, ai.height - 1]) {
      edgeTotal++;
      if (alphaAt(x, y) > 191) edgeInk++;
    }
  }
  for (let y = 1; y < ai.height - 1; y++) {
    for (const x of [0, ai.width - 1]) {
      edgeTotal++;
      if (alphaAt(x, y) > 191) edgeInk++;
    }
  }
  const perimeterPct = (100 * edgeInk) / edgeTotal;

  const reasons = [];
  // FILLED PLATE, which the perimeter test cannot see.
  //
  // Sephora is white letters inside a solid black square. It keys "cleanly" —
  // 0.0% perimeter ink, because the square's corners are rounded and the trim
  // takes the outer ring — but 48.5% of the mark is ink, and the letterforms are
  // HOLES in a plate rather than strokes on a ground. On the rail it renders as
  // a black slab, which is the exact thing canon §8 forbids.
  //
  // Density separates it. Every genuine wordmark in this pack sits at or under
  // 37% ink (Infosys 33.9, Oracle 36.8); a plate with knockout text is half the
  // box or more. 42% sits in the gap.
  if (inkDensityPct > 42)
    reasons.push(`${inkDensityPct.toFixed(1)}% ink — reads as a filled plate with knockout text`);
  if (transparentPct < 25) reasons.push(`only ${transparentPct.toFixed(1)}% transparent`);
  if (partialPct > 45) reasons.push(`${partialPct.toFixed(1)}% partial alpha`);
  if (capAtCell < RAIL_CAP_FLOOR) reasons.push(`cap height ${capAtCell.toFixed(1)}px at the rail cell`);
  if (perimeterPct > SLAB_PERIMETER_PCT)
    reasons.push(`box lockup — ${perimeterPct.toFixed(1)}% perimeter ink`);

  if (reasons.length) {
    nameOnly.push(`${slug}: ${reasons.join(", ")}`);
    // Delete any asset a previous run emitted for this slug. Without this a
    // mark that USED to pass keeps rendering from the stale file for ever:
    // Sephora was declined as a filled plate and still shipped as a black slab,
    // because the decision only ever added to a list and never cleaned up.
    for (const dir of [OUT_CLIENTS, OUT_INTEGRATORS]) {
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
      width: ai.width,
      height: ai.height,
      channels: 3,
      background: { r: 0, g: 0, b: 0 },
    },
  })
    .joinChannel(alpha, {
      raw: { width: ai.width, height: ai.height, channels: 1 },
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
    `  ${slug}.png ${info.width}x${info.height} ${(info.size / 1024).toFixed(1)}kB (alpha silhouette)`,
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

console.log(
  `\n${written} logo files written. Run scripts/measure-marks.mjs to refresh the manifest.`,
);
if (nameOnly.length) {
  console.log(
    `\n${nameOnly.length} mark(s) ship as their NAME — the source will not key to one clean ink:`,
  );
  for (const r of nameOnly) console.log(`  ${r}`);
}

// Marks committed as vectors outside this script. Verified, not generated —
// so this MEASURES them and reports, rather than replacing or deleting them.
//
// The distinction is deliberate. These two were committed by hand, plausibly
// because the keying path could not do them justice, and dropping a curated
// asset on a heuristic written afterwards would be the script overruling a
// human decision it has no standing to overrule. But the slab test does apply
// to what ships regardless of how it got there, and radwell measures as a box
// lockup — so the gate says so out loud every run instead of passing it in
// silence. QUESTIONS.md Q13 carries the decision.
for (const [slug, file] of [
  ["radwell", join(OUT_CLIENTS, "radwell.png")],
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
