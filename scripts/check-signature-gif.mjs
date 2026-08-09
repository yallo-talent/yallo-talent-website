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
 * SO THE GATE REBUILDS IT AND COMPARES THE BYTES. Not a size check, not a
 * dimension check: the encoder is deterministic over the same inputs, so the
 * only comparison that catches a one-word copy change is the whole file.
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

if (rebuilt.gif.byteLength !== committed.byteLength) {
  fail(
    `the committed GIF is ${committed.byteLength} bytes and a rebuild is ${rebuilt.gif.byteLength}.`,
    "Something in scripts/brand/ changed without the binary being rebuilt, or the\n  " +
      "binary was edited by hand. Run `node scripts/brand/signature-gif.mjs` and\n  " +
      "commit the result.",
  );
}

if (!rebuilt.gif.equals(committed)) {
  /* Same length, different bytes: the most interesting failure, and the one a
     size check would miss entirely. */
  let firstDiff = -1;
  for (let i = 0; i < committed.byteLength; i++) {
    if (rebuilt.gif[i] !== committed[i]) {
      firstDiff = i;
      break;
    }
  }
  fail(
    `the committed GIF and a rebuild are the same length and differ from byte ${firstDiff}.`,
    "The source changed without the binary being rebuilt. Run\n  " +
      "`node scripts/brand/signature-gif.mjs` and commit the result.",
  );
}

console.log(
  "\nThe committed signature GIF is byte-identical to a rebuild, and the rebuild satisfies the ratified objective.",
);
