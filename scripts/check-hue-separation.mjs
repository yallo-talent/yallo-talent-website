#!/usr/bin/env node
/**
 * Identity-hue separation, measured on the painted wash rather than the token.
 *
 * WHY THIS EXISTS. Round 3 reported six hue pairs as too close, from a pass
 * that was not committed and cannot be re-run. Its numbers (claret/plum 0.75,
 * an approved band of 2.55 to 4.87) do not reproduce under any compositing
 * model, alpha or delta-E formula I could fit to them — I tried 504
 * combinations. What DOES reproduce is the finding: the same six pairs come out
 * worst here, in near-identical order. So the conclusion stood and the
 * measurement did not, which is the exact failure this file removes.
 *
 * WHAT IT MEASURES. An identity hue is never seen as a swatch. It is seen as
 * `.amb-wash`, which paints it at `--amb-alpha` over `--ground` — 20% on light,
 * 30% on dark, per R11. Comparing raw hexes therefore measures something the
 * page never renders: on declared values claret and plum sit 17 apart, and on
 * the painted wash they sit 2.29 apart. This composites first, then measures.
 *
 * The composite is src-over in gamma-encoded sRGB, which is what a browser
 * does. Verified rather than assumed: painting each hue onto a canvas over
 * #e9e9e8 in the running app returns the same bytes this arithmetic does, and
 * a linear-light composite returns different ones.
 *
 * A pair's separation is the WORSE of its two themes. Dark separates roughly
 * twice as well as light throughout, so light is what binds.
 *
 * Peak alpha is the generous reading: the wash is a gradient that decays to
 * transparent, so most of a band sits below the alpha measured here and
 * separates less. A pair that fails at peak fails everywhere.
 *
 *   node scripts/check-hue-separation.mjs           report and exit code
 *   node scripts/check-hue-separation.mjs --json    machine-readable
 *
 * Every value is read from globals.css. Nothing is duplicated here.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CSS = readFileSync(join(ROOT, "src/app/globals.css"), "utf8");

/* ---------------------------------------------------------------- tokens -- */

function token(name) {
  const m = CSS.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!m) throw new Error(`token --${name} not found in globals.css`);
  return m[1];
}

function alpha(theme) {
  // Two declarations of --amb-alpha per theme (root and the nested overrides);
  // they agree, so the first in each block is authoritative.
  const block = theme === "light" ? /:root,\s*:root\[data-theme="light"\]/ : /:root\[data-theme="dark"\]/;
  const i = CSS.search(block);
  const m = CSS.slice(i).match(/--amb-alpha:\s*(\d+)%/);
  if (!m) throw new Error(`--amb-alpha not found for ${theme}`);
  return Number(m[1]) / 100;
}

const HUES = [...CSS.matchAll(/--amb-([a-z]+)-l:\s*(#[0-9a-fA-F]{6})/g)].map(
  (m) => m[1],
);

/**
 * The four hues R4 approved and round 3 froze. Their worst pair sets the floor:
 * a new hue has to separate at least as well as the approved palette's own
 * weakest pair, or it is measurably harder to tell apart than anything shipped.
 */
const FROZEN = ["indigo", "teal", "plum", "violet"];

/* ---------------------------------------------------------------- colour -- */

const hex = (h) =>
  [0, 2, 4].map((i) => parseInt(h.replace("#", "").slice(i, i + 2), 16) / 255);

const srgbToLin = (c) =>
  c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;

function toLab(rgb) {
  const [R, G, B] = rgb.map(srgbToLin);
  const wp = [0.95047, 1.0, 1.08883];
  const [X, Y, Z] = [
    0.4124564 * R + 0.3575761 * G + 0.1804375 * B,
    0.2126729 * R + 0.7151522 * G + 0.072175 * B,
    0.0193339 * R + 0.119192 * G + 0.9503041 * B,
  ].map((v, i) => v / wp[i]);
  const f = (t) => (t > 216 / 24389 ? Math.cbrt(t) : (841 / 108) * t + 4 / 29);
  const [fx, fy, fz] = [f(X), f(Y), f(Z)];
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

/** CIEDE2000. */
function deltaE(lab1, lab2) {
  const [L1, a1, b1] = lab1;
  const [L2, a2, b2] = lab2;
  const Cbar = (Math.hypot(a1, b1) + Math.hypot(a2, b2)) / 2;
  const G = 0.5 * (1 - Math.sqrt(Cbar ** 7 / (Cbar ** 7 + 25 ** 7)));
  const a1p = (1 + G) * a1;
  const a2p = (1 + G) * a2;
  const C1p = Math.hypot(a1p, b1);
  const C2p = Math.hypot(a2p, b2);
  const ang = (ap, bp) => {
    if (ap === 0 && bp === 0) return 0;
    const d = (Math.atan2(bp, ap) * 180) / Math.PI;
    return d < 0 ? d + 360 : d;
  };
  const h1p = ang(a1p, b1);
  const h2p = ang(a2p, b2);
  const dLp = L2 - L1;
  const dCp = C2p - C1p;
  let dhp = 0;
  if (C1p * C2p !== 0) {
    dhp = h2p - h1p;
    if (dhp > 180) dhp -= 360;
    else if (dhp < -180) dhp += 360;
  }
  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin((dhp * Math.PI) / 360);
  const Lbp = (L1 + L2) / 2;
  const Cbp = (C1p + C2p) / 2;
  let hbp;
  if (C1p * C2p === 0) hbp = h1p + h2p;
  else {
    hbp = h1p + h2p;
    if (Math.abs(h1p - h2p) > 180) hbp += hbp < 360 ? 360 : -360;
    hbp /= 2;
  }
  const T =
    1 -
    0.17 * Math.cos(((hbp - 30) * Math.PI) / 180) +
    0.24 * Math.cos((2 * hbp * Math.PI) / 180) +
    0.32 * Math.cos(((3 * hbp + 6) * Math.PI) / 180) -
    0.2 * Math.cos(((4 * hbp - 63) * Math.PI) / 180);
  const Rt =
    -Math.sin((60 * Math.exp(-(((hbp - 275) / 25) ** 2)) * Math.PI) / 180) *
    2 *
    Math.sqrt(Cbp ** 7 / (Cbp ** 7 + 25 ** 7));
  const Sl = 1 + (0.015 * (Lbp - 50) ** 2) / Math.sqrt(20 + (Lbp - 50) ** 2);
  const Sc = 1 + 0.045 * Cbp;
  const Sh = 1 + 0.015 * Cbp * T;
  return Math.sqrt(
    (dLp / Sl) ** 2 +
      (dCp / Sc) ** 2 +
      (dHp / Sh) ** 2 +
      Rt * (dCp / Sc) * (dHp / Sh),
  );
}

/** src-over, gamma space. Matches the browser; see the header. */
const over = (fg, bg, a) => fg.map((c, i) => a * c + (1 - a) * bg[i]);

/* --------------------------------------------------------------- measure -- */

const THEMES = {
  light: { ground: hex(token("paper")), a: alpha("light") },
  dark: { ground: hex(token("dk")), a: alpha("dark") },
};

const painted = {};
for (const h of HUES) {
  painted[h] = {
    light: toLab(over(hex(token(`amb-${h}-l`)), THEMES.light.ground, THEMES.light.a)),
    dark: toLab(over(hex(token(`amb-${h}-d`)), THEMES.dark.ground, THEMES.dark.a)),
  };
}

const pairs = [];
for (let i = 0; i < HUES.length; i++)
  for (let j = i + 1; j < HUES.length; j++) {
    const [a, b] = [HUES[i], HUES[j]];
    const light = deltaE(painted[a].light, painted[b].light);
    const dark = deltaE(painted[a].dark, painted[b].dark);
    pairs.push({
      a, b, light, dark,
      min: Math.min(light, dark),
      approved: FROZEN.includes(a) && FROZEN.includes(b),
    });
  }
pairs.sort((x, y) => x.min - y.min);

/** Each wash against its own bare ground: does the page read as coloured? */
const presence = HUES.map((h) => ({
  hue: h,
  light: deltaE(painted[h].light, toLab(THEMES.light.ground)),
  dark: deltaE(painted[h].dark, toLab(THEMES.dark.ground)),
}));

const approved = pairs.filter((p) => p.approved);
const floor = Math.min(...approved.map((p) => p.min));
const below = pairs.filter((p) => !p.approved && p.min < floor);

/* THE GOVERNING CRITERION, ratified 2 Aug 2026. Separation from BARE GROUND,
   not pairwise, and this is the thing the file now fails on.

   The pairwise floor was set by analogy with the approved four, without asking
   whether a reader ever sees two identity hues at once. They do not: the
   palette assigns hues so that no two members of one taxonomy share, precisely
   because a visitor is inside one family at a time. A delta-E between two
   colours nobody can compare measures a comparison that never happens. The
   only set that met the pairwise floor met it by withdrawing two hues and
   making two platforms share one, which breaks the rule the floor existed to
   protect. That is what settled it.

   Ground distance is what R4 actually asks: does each page read as having its
   own colour. The floor is derived the same self-calibrating way the pairwise
   one was, from the weakest of the four frozen hues, so it cannot drift into an
   arbitrary constant and cannot be met by removing a hue. */
const groundFloor = Math.min(
  ...presence
    .filter((p) => FROZEN.includes(p.hue))
    .map((p) => Math.min(p.light, p.dark)),
);
const groundFailures = presence.filter(
  (p) => Math.min(p.light, p.dark) < groundFloor,
);

if (process.argv.includes("--json")) {
  console.log(
    JSON.stringify({ floor, groundFloor, pairs, presence }, null, 2),
  );
  process.exit(groundFailures.length === 0 ? 0 : 1);
}

const f = (n, w = 6) => n.toFixed(2).padStart(w);

console.log(
  `Identity-hue separation · ${HUES.length} hues · painted at ${THEMES.light.a * 100}% on ${token("paper")}, ${THEMES.dark.a * 100}% on ${token("dk")}\n`,
);
console.log("  pair                     light    dark     min");
for (const p of pairs)
  console.log(
    `  ${`${p.a}/${p.b}`.padEnd(24)}${f(p.light)}  ${f(p.dark)}  ${f(p.min)}` +
      (p.approved ? "   approved" : p.min < floor ? "   BELOW FLOOR" : ""),
  );

console.log(
  `\n  floor ${floor.toFixed(2)}, set by the worst approved pair (${approved[0].a}/${approved[0].b}).`,
);
console.log(
  `  approved band ${floor.toFixed(2)} to ${Math.max(...approved.map((p) => p.min)).toFixed(2)}.  whole-family minimum ${pairs[0].min.toFixed(2)}.`,
);

if (below.length) {
  console.log(
    `\n  ${below.length} pair(s) below the pairwise floor: ${below.map((p) => `${p.a}/${p.b}`).join(", ")}.`,
  );
  console.log(
    "  Measured and reported, never a gate. Ratified 2 Aug 2026: identity hues are\n" +
      "  assigned so no two members of a taxonomy share, so a reader is inside one\n" +
      "  family at a time and never sees two side by side. The pairwise number is\n" +
      "  kept so drift stays visible; it does not fail. See DESIGN.md R4a.",
  );
}

console.log(
  "\n  THE GATE — each wash against its own bare ground (does the page read as\n" +
    "  having its own colour). Worse theme binds.\n",
);
console.log("  hue                      light    dark     worse");
for (const p of presence) {
  const worse = Math.min(p.light, p.dark);
  console.log(
    `  ${p.hue.padEnd(24)}${f(p.light)}  ${f(p.dark)}  ${f(worse)}` +
      (FROZEN.includes(p.hue) ? "   approved" : "") +
      (worse < groundFloor ? "   BELOW FLOOR" : ""),
  );
}
console.log(
  `\n  ground floor ${groundFloor.toFixed(2)}, set by the weakest approved hue.`,
);

if (groundFailures.length) {
  console.error(
    `\n  ${groundFailures.length} hue(s) below the ground floor: ${groundFailures
      .map((p) => p.hue)
      .join(", ")}. A hue that does not separate from bare ground gives its page\n` +
      "  no colour of its own, which is the whole of R4.",
  );
  process.exit(1);
}

console.log(
  `\n  ${HUES.length} hues, all clear the ground floor. Pairwise minimum ${pairs[0].min.toFixed(2)}, reported only.`,
);
process.exit(0);
