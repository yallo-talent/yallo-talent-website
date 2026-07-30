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
import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { basename, extname, join } from "node:path";
import sharp from "sharp";

const SRC = join(process.cwd(), "assets", "client-logos");
const OUT_CLIENTS = join(process.cwd(), "public", "logos", "clients");
const OUT_INTEGRATORS = join(process.cwd(), "public", "logos", "integrators");

const RENDER_HEIGHT = 56;
const SCALE = 2;

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

async function convert(slug, file, outDir) {
  const src = join(SRC, file);
  if (!existsSync(src)) {
    missing.push(`${slug} (expected "${file}")`);
    return;
  }
  mkdirSync(outDir, { recursive: true });

  if (extname(file).toLowerCase() === ".svg") {
    copyFileSync(src, join(outDir, `${slug}.svg`));
    console.log(`  ${slug}.svg (vector, copied)`);
    written++;
    return;
  }

  const out = join(outDir, `${slug}.png`);
  const info = await sharp(src)
    // Trim the surrounding flat colour so every mark occupies its tile evenly.
    .trim({ threshold: 12 })
    // Flatten onto white: the pack mixes transparency with opaque JPEG, and the
    // tiles they render into are white, so this makes them consistent.
    .flatten({ background: "#ffffff" })
    .resize({
      height: RENDER_HEIGHT * SCALE,
      width: RENDER_HEIGHT * SCALE * 4,
      fit: "inside",
      withoutEnlargement: false,
    })
    .png({ compressionLevel: 9, palette: true })
    .toFile(out);

  console.log(`  ${slug}.png ${info.width}x${info.height} ${(info.size / 1024).toFixed(1)}kB`);
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

console.log(`\n${written} logo files written.`);

// Marks committed as vectors outside this script. Verified, not generated.
for (const [slug, file] of [
  ["radwell", join(OUT_CLIENTS, "radwell.svg")],
  ["capgemini", join(OUT_INTEGRATORS, "capgemini.svg")],
]) {
  if (!existsSync(file)) {
    missing.push(`${slug} (expected committed vector at ${file})`);
  } else {
    console.log(`  ${slug}: committed vector present`);
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
