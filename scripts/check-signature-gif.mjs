#!/usr/bin/env node
/**
 * The committed signature GIF is the one the generator produces — v36 open item
 * 4, accepted as round 26 §4.1.
 *
 * WHAT DRIFT LOOKS LIKE AND WHY IT MATTERS. The animated signature is a binary
 * in `public/`, produced from `scripts/brand/signature-banners.mjs` and the
 * ratified encoder constants in `signature-gif.mjs`. Nothing connects the two
 * except somebody remembering to re-run the build. A copy change, a colour
 * change or an encoder-constant change therefore ships as a source edit with a
 * stale binary beside it, and the signature in everybody's email keeps saying
 * what it used to say. Nobody notices, because the file renders perfectly.
 *
 * IT COMPARES PIXELS, NOT BYTES, AND THAT IS A CORRECTION. The first version of
 * this gate compared the encoded file byte for byte, on the reasoning that the
 * encoder is deterministic over the same inputs. It is — on ONE MACHINE. It
 * passed on macOS and failed in CI on Linux with the same length, the same
 * dimensions, the same frame count, and a first difference at BYTE 16: inside
 * the global colour table. libvips quantises a palette slightly differently
 * between platform builds, so two encoders can emit the same picture through a
 * different table. A byte comparison would have red-blocked every pull request
 * from a machine unlike the one that last built the file, which is a gate that
 * reports the toolchain rather than the asset.
 *
 * So it decodes both — the rebuild and the committed file — and compares the
 * DECODED FRAMES. That is the thing the gate actually cares about: what a
 * recipient sees. A palette permutation is invisible to it; a changed word, a
 * changed colour or a changed fade is not, because either moves thousands of
 * pixels.
 *
 * THE TOLERANCE IS FOR QUANTISATION, NOT FOR CONTENT. A pixel may differ by a
 * couple of levels because it was assigned a neighbouring palette entry.
 * Nothing legitimate moves a pixel further than that, and nothing legitimate
 * moves MANY pixels at all, so both limits are asserted: how far any pixel may
 * move, and how many may move at all.
 *
 * IT NEEDS THE FONTS, and it fails rather than skipping without them. The
 * renderer draws with pinned instances that `scripts/brand/setup.sh` produces;
 * without them there is nothing to compare, and a gate that reports clean
 * because it could not build is a green tick over an unmeasured asset — the
 * exact shape this repository has filed against twice.
 *
 * IT ALSO ASSERTS THE ENCODER'S OWN OBJECTIVE FUNCTION still holds, which the
 * generator already computes: frame 1 fidelity, the size budget and the
 * inter-frame error ceiling. `signature-gif.mjs` sits one step from a cliff on
 * `interFrameMaxError` by design, and its own comment says that is safe only
 * because it is measured on every build. This is what makes that true.
 *
 * Usage:
 *   bash scripts/brand/setup.sh          # once, fetches and pins the fonts
 *   node scripts/check-signature-gif.mjs
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const COMMITTED = join(ROOT, "public/images/email/signature-animated.gif");
const FONT_DIR = join(ROOT, "scripts/brand/fonts");

const REQUIRED_FONTS = [
  "Newsreader-600.ttf",
  "Newsreader-500.ttf",
  "Inter-450.ttf",
  "Inter-550.ttf",
  "PlexMono-Regular.ttf",
  "PlexMono-Medium.ttf",
];

function fail(message, detail) {
  console.error(`\ncheck:signature-gif FAILED\n\n  ${message}`);
  if (detail) console.error(`\n  ${detail}`);
  console.error("");
  process.exit(1);
}

const missing = REQUIRED_FONTS.filter((f) => !existsSync(join(FONT_DIR, f)));
if (missing.length > 0) {
  fail(
    `the pinned fonts are not present, so the GIF was never rebuilt and nothing was compared.`,
    `Missing: ${missing.join(", ")}\n  Run: bash scripts/brand/setup.sh\n\n  ` +
      "This is a failure rather than a skip. A gate that reports clean because\n  " +
      "it could not build is a green tick over an unmeasured asset.",
  );
}

if (!existsSync(COMMITTED)) {
  fail(
    "public/images/email/signature-animated.gif is not committed, so there is nothing to compare a rebuild against.",
  );
}

const { CHOSEN, attempt } = await import("./brand/signature-gif.mjs");

const committed = readFileSync(COMMITTED);
const rebuilt = await attempt(CHOSEN.zoom, CHOSEN.fadeSteps, CHOSEN.opts);

console.log(
  `  rebuilt ${rebuilt.bytes} bytes, ${rebuilt.built.width}x${rebuilt.built.height}, ${rebuilt.frames} frames`,
);
console.log(`  committed ${committed.byteLength} bytes`);

/* The encoder's own objective function, which the generator already evaluates.
   It is one step from a cliff on interFrameMaxError by design, and that is only
   safe if something measures it. */
if (!rebuilt.ok) {
  fail(
    "the rebuild does not satisfy the encoder's objective function.",
    "The ratified constants in scripts/brand/signature-gif.mjs no longer produce\n  " +
      "an acceptable file. Run `node scripts/brand/signature-gif.mjs --search`\n  " +
      "and re-ratify, rather than loosening the objective.",
  );
}

/* Structure first: a rebuild that produced a different NUMBER of frames, or a
   different size, is drift no pixel comparison should have to discover. */
const decode = async (buffer, what) => {
  const out = await sharp(buffer, { animated: true })
    .raw()
    .toBuffer({ resolveWithObject: true });
  if (!out.info.pages) fail(`${what} decoded to no frames at all.`);
  return out;
};

const a = await decode(rebuilt.gif, "the rebuild");
const b = await decode(committed, "the committed GIF");

if (a.info.pages !== b.info.pages) {
  fail(
    `the committed GIF has ${b.info.pages} frames and a rebuild has ${a.info.pages}.`,
    "Run `node scripts/brand/signature-gif.mjs` and commit the result.",
  );
}
if (a.info.width !== b.info.width || a.info.height !== b.info.height) {
  fail(
    `the committed GIF is ${b.info.width}x${b.info.height} per frame strip and a rebuild is ${a.info.width}x${a.info.height}.`,
    "Run `node scripts/brand/signature-gif.mjs` and commit the result.",
  );
}
if (a.data.length !== b.data.length) {
  fail("the two decoded pixel buffers are different lengths, which the checks above should have caught.");
}

/* WHICH OF THESE TWO IS ACTUALLY DOING THE WORK, said plainly rather than
   implied. The per-channel delta is the discriminator: a changed word, a
   changed colour or a changed fade moves pixels by TENS or HUNDREDS of levels,
   and a palette permutation moves them by one or two. The control measured it —
   changing "72 hours" to "48 hours" in frame 1 produced a worst delta of 220
   against this limit of 8. The fraction is a backstop against a systematic
   small shift across the whole image, and it is loose on purpose: the
   cross-platform quantisation magnitude is unmeasured on Linux, and a limit
   guessed too tight is how this gate red-blocked a pull request the first time.
   Every run PRINTS both numbers, so the first green CI run measures the real
   Linux figure and the fraction can be tightened against it rather than
   against a guess. */
const MAX_CHANNEL_DELTA = 8;
const MAX_MOVED_FRACTION = 0.02;


let worst = 0;
let moved = 0;
let worstAt = -1;
for (let i = 0; i < a.data.length; i++) {
  const delta = Math.abs(a.data[i] - b.data[i]);
  if (delta === 0) continue;
  moved++;
  if (delta > worst) {
    worst = delta;
    worstAt = i;
  }
}
const fraction = moved / a.data.length;

console.log(
  `  ${a.info.pages} frames compared as pixels: ${(fraction * 100).toFixed(3)}% of channels differ, worst by ${worst}`,
);

if (worst > MAX_CHANNEL_DELTA || fraction > MAX_MOVED_FRACTION) {
  const frameHeight = a.info.height / a.info.pages;
  const pixel = Math.floor(worstAt / a.info.channels);
  const frame = Math.floor(Math.floor(pixel / a.info.width) / frameHeight);
  fail(
    `the committed GIF and a rebuild do not show the same thing: ${(fraction * 100).toFixed(3)}% of channels differ (limit ${MAX_MOVED_FRACTION * 100}%), worst by ${worst} levels (limit ${MAX_CHANNEL_DELTA}), first worst in frame ${frame}.`,
    "The source changed without the binary being rebuilt. Run\n  " +
      "`node scripts/brand/signature-gif.mjs` and commit the result.",
  );
}

console.log(
  "\nThe committed signature GIF shows what a rebuild shows, and the rebuild satisfies the ratified objective.",
);
