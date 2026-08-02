#!/usr/bin/env node
/**
 * Measures every mark that ships, and writes public/logos/manifest.json.
 *
 * WHY THIS IS A SEPARATE PASS FROM build-logos.mjs
 *
 * build-logos.mjs GENERATES the client and integrator silhouettes from the
 * supplied pack. It used to write the manifest too, and it could only ever
 * describe what it generated — so the seven platform vectors, which are
 * committed by hand and never pass through it, had no measurements at all. The
 * homepage platform axis therefore rendered them at a flat max-height with no
 * normalisation of any kind, which is one of the three surfaces canon §5 now
 * covers.
 *
 * So measurement moves here and reads what is actually in public/logos,
 * whatever produced it. Generation stays there. One measured fact per mark, one
 * place that measures.
 *
 * WHAT IS MEASURED, AND WHY IT IS NOT `dh`
 *
 * The old manifest carried `dh`, a display height in CSS px. That was wrong in
 * kind, not just in value: a display height is a property of a SURFACE, and
 * there are three surfaces at three different box sizes. One number could not
 * serve them, so two of the three surfaces ignored it.
 *
 * This writes only measured facts about the asset — image box, ink bounding
 * box, ink fraction. src/lib/mark-scale.ts derives the per-surface display
 * height from them. Measurement here, derivation there, no hand-written scale
 * anywhere.
 *
 *   node scripts/measure-marks.mjs           # write the manifest
 *   node scripts/measure-marks.mjs --report  # print the table, write nothing
 */
import { existsSync, readdirSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const LOGO_ROOT = join(ROOT, "public", "logos");

/** The three directories whose contents render as marks. */
const FAMILIES = ["clients", "integrators", "platforms"];

/** Vectors rasterise here before measurement. High enough that a hairline
 *  stroke is several pixels wide, so ink area is not quantisation noise. */
const RASTER_DENSITY = 600;
const RASTER_HEIGHT = 512;

/** Alpha at or above this counts as ink. Matches build-logos.mjs, which uses
 *  the same cut when it reports inkFrac, so the two agree on what ink is. */
const INK_ALPHA = 96;

/**
 * Measures one mark file.
 *
 * Returns the image box, the bounding box of its non-transparent pixels, and
 * the ink fraction of the image box. The ink fraction is taken over the IMAGE
 * box rather than the ink box deliberately: a surface renders the image box, so
 * `renderedBoxArea * ink` is the rendered ink area. Padding inside the file is
 * then visible as a gap between the two boxes, which is exactly the asset
 * defect canon §5 says to report rather than scale away.
 */
export async function measureMark(file) {
  const isVector = extname(file).toLowerCase() === ".svg";
  const pipeline = isVector
    ? sharp(file, { density: RASTER_DENSITY }).resize({
        height: RASTER_HEIGHT,
        fit: "inside",
        withoutEnlargement: false,
      })
    : sharp(file);

  const { data, info } = await pipeline
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width: w, height: h, channels } = info;
  let inkPixels = 0;
  let minX = w;
  let minY = h;
  let maxX = -1;
  let maxY = -1;
  /* An opaque asset has no ground to key, so every pixel reads as ink and the
     ink box is the whole file. That is not a measurement failure, it is the
     asset being a plate — recorded here and reported by the caller. */
  let opaquePixels = 0;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const a = data[(y * w + x) * channels + (channels - 1)];
      if (a > 250) opaquePixels++;
      if (a < INK_ALPHA) continue;
      inkPixels++;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }

  if (maxX < 0) {
    return { w, h, ink: 0, bw: 0, bh: 0, pad: 1, empty: true };
  }

  const bw = maxX - minX + 1;
  const bh = maxY - minY + 1;
  return {
    w,
    h,
    /** Ink as a fraction of the image box. Drives every derived scale. */
    ink: +(inkPixels / (w * h)).toFixed(4),
    /** The non-transparent bounding box, in image px. */
    bw,
    bh,
    /** Share of the image box carrying no ink box at all — file padding. */
    pad: +(1 - (bw * bh) / (w * h)).toFixed(4),
    /** A file with no transparency cannot be keyed to one ink. */
    plate: opaquePixels / (w * h) > 0.98,
  };
}

/** slug for a file, matching the `logo` paths in content/clients.yaml. */
function slugOf(file) {
  return file.replace(/\.[a-z0-9]+$/i, "");
}

async function main() {
  const reportOnly = process.argv.includes("--report");
  const manifest = {};
  const notes = [];

  for (const family of FAMILIES) {
    const dir = join(LOGO_ROOT, family);
    if (!existsSync(dir)) continue;
    const files = readdirSync(dir)
      .filter((f) => /\.(png|jpe?g|svg|webp)$/i.test(f))
      .sort();
    for (const file of files) {
      const m = await measureMark(join(dir, file));
      const slug = slugOf(file);
      if (m.empty) {
        notes.push(`${family}/${file}: no non-transparent pixels at all`);
        continue;
      }
      if (m.plate) {
        notes.push(
          `${family}/${file}: opaque, no alpha to key — renders as a plate, not a mark`,
        );
      }
      if (m.pad > 0.12) {
        notes.push(
          `${family}/${file}: ${(m.pad * 100).toFixed(1)}% of the file is padding around the ink box`,
        );
      }
      manifest[slug] = { family, ...m };
      delete manifest[slug].empty;
    }
  }

  const rows = Object.entries(manifest);
  console.log(
    `${"slug".padEnd(22)}${"family".padEnd(13)}${"box".padStart(11)}${"aspect".padStart(8)}${"ink".padStart(8)}${"pad".padStart(7)}`,
  );
  for (const [slug, m] of rows) {
    console.log(
      slug.padEnd(22) +
        m.family.padEnd(13) +
        `${m.w}x${m.h}`.padStart(11) +
        (m.w / m.h).toFixed(2).padStart(8) +
        m.ink.toFixed(4).padStart(8) +
        `${(m.pad * 100).toFixed(1)}%`.padStart(7),
    );
  }
  console.log(`\n${rows.length} marks measured.`);
  if (notes.length) {
    console.log(`\n${notes.length} asset note(s) — reported, never scaled away:`);
    for (const n of notes) console.log(`  ${n}`);
  }

  if (reportOnly) {
    console.log("\n--report: manifest.json not written.");
    return;
  }
  writeFileSync(
    join(LOGO_ROOT, "manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
  console.log("\npublic/logos/manifest.json written.");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await main();
}
