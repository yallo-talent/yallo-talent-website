#!/usr/bin/env node
/**
 * WCAG 2.2 contrast verification for both themes.
 *
 * Reads the candidate token table below, computes every foreground/background
 * pair the design system actually renders, and fails the process if any pair
 * misses its required ratio. Run before any commit that touches colour:
 *
 *   node scripts/check-contrast.mjs          # table + exit code
 *   node scripts/check-contrast.mjs --md     # markdown table for the report
 *
 * Requirements applied (WCAG 2.2 AA):
 *   text-sm   4.5:1   body copy, mono labels, anything under 18.66px/700
 *   text-lg   3.0:1   headings at or above 24px, or 18.66px bold
 *   ui        3.0:1   component boundaries, focus rings, graphical marks (1.4.11)
 *   dec       n/a     purely decorative — records the ratio, asserts nothing
 *
 * `dec` is not a loophole. A token may only be classified decorative when it
 * carries no information a user could need: the gold petal fills and the
 * hairline dividers. The moment a divider becomes the sole boundary of a
 * control, or a fill encodes a value, it must use the `-strong` / functional
 * token and be reclassified `ui` here.
 */

const srgb = (c) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};

const luminance = (hex) => {
  const h = hex.replace("#", "");
  const n = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const [r, g, b] = [0, 2, 4].map((i) => Number.parseInt(n.slice(i, i + 2), 16));
  return 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
};

const ratio = (a, b) => {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};

// ---------------------------------------------------------------------------
// Token candidates. Keep in lockstep with globals.css Layer 1.
// ---------------------------------------------------------------------------

const LIGHT = {
  // grounds
  paper: "#eae9e4",
  "paper-2": "#f4f3f0",
  "paper-3": "#e3e1d9",
  // ink
  ink: "#16171a",
  "ink-2": "#3a3c42",
  "ink-3": "#5c5e66",
  // brand
  gold: "#d4a843",
  "gold-deep": "#9d7818",
  "gold-ink": "#7b5d13",
  rule: "#cdcbc3",
  "rule-strong": "#807e76",
  // functional — mark (graphical) and text (label) grades
  "signal-mark": "#c2410c",
  "signal-text": "#a83a09",
  "info-mark": "#1d6fa5",
  "info-text": "#17557f",
  "positive-mark": "#2f7d46",
  "positive-text": "#26643a",
  "category-mark": "#9d3f7a",
  "category-text": "#82305f",
};

const DARK = {
  dk: "#0c0d10",
  "dk-2": "#151820",
  "dk-3": "#1f2330",
  "dk-line": "#2e333d",
  "dk-line-strong": "#6b7280",
  "dk-txt": "#f0efec",
  "dk-txt-2": "#b9bdc6",
  "dk-txt-3": "#9298a3",
  gold: "#d4a843",
  "signal-mark": "#ff8455",
  "signal-text": "#ff9a72",
  "info-mark": "#4aa8e8",
  "info-text": "#6ebcf0",
  "positive-mark": "#57b478",
  "positive-text": "#7fc796",
  "category-mark": "#cf7fb4",
  "category-text": "#dc9ac6",
};

// Grounds each foreground is permitted to sit on.
const LIGHT_GROUNDS = ["paper", "paper-2", "paper-3"];
const DARK_GROUNDS = ["dk", "dk-2", "dk-3"];

/** [theme, foreground, requirement, note] */
const PAIRS = [
  // ---- light theme ----
  ["light", "ink", "text-sm", "body copy, headings"],
  ["light", "ink-2", "text-sm", "section lede, secondary copy"],
  ["light", "ink-3", "text-sm", "captions, entity strip roles"],
  ["light", "gold-ink", "text-sm", "eyebrow mono labels (11px)"],
  ["light", "gold-deep", "text-lg", "large numerals, italic emphasis in H1"],
  ["light", "gold-deep", "ui", "underlines, focus ring, 1.5px rules"],
  ["light", "gold", "dec", "petal fills and dots — decorative only on light"],
  ["light", "rule", "dec", "hairline dividers between rows"],
  ["light", "rule-strong", "ui", "control boundaries, card state borders"],
  ["light", "signal-mark", "ui", "scarcity dot / bar fill"],
  ["light", "signal-text", "text-sm", "'hard to fill' label"],
  ["light", "info-mark", "ui", "availability series"],
  ["light", "info-text", "text-sm", "in-region status label"],
  ["light", "positive-mark", "ui", "renewal / filled-seat mark"],
  ["light", "positive-text", "text-sm", "renewal label"],
  ["light", "category-mark", "ui", "fourth series mark"],
  ["light", "category-text", "text-sm", "fourth series label"],
  // ---- dark theme ----
  ["dark", "dk-txt", "text-sm", "body copy, headings"],
  ["dark", "dk-txt-2", "text-sm", "secondary copy, device labels"],
  ["dark", "dk-txt-3", "text-sm", "mono meta, screened-out rows"],
  ["dark", "gold", "text-sm", "eyebrow, numerals, emphasis"],
  ["dark", "gold", "ui", "petal fills, borders, bars"],
  ["dark", "dk-line", "dec", "hairline dividers between rows"],
  ["dark", "dk-line-strong", "ui", "control boundaries, card state borders"],
  ["dark", "signal-mark", "ui", "scarcity dot / bar fill"],
  ["dark", "signal-text", "text-sm", "'hard to fill' label"],
  ["dark", "info-mark", "ui", "availability series"],
  ["dark", "info-text", "text-sm", "in-region status label"],
  ["dark", "positive-mark", "ui", "renewal / filled-seat mark"],
  ["dark", "positive-text", "text-sm", "renewal label"],
  ["dark", "category-mark", "ui", "fourth series mark"],
  ["dark", "category-text", "text-sm", "fourth series label"],
];

const MIN = { "text-sm": 4.5, "text-lg": 3, ui: 3, dec: 0 };

const rows = [];
let failures = 0;

for (const [theme, fg, req, note] of PAIRS) {
  const tokens = theme === "light" ? LIGHT : DARK;
  const grounds = theme === "light" ? LIGHT_GROUNDS : DARK_GROUNDS;
  const fgHex = tokens[fg];
  if (!fgHex) throw new Error(`unknown token ${theme}.${fg}`);

  let worst = Number.POSITIVE_INFINITY;
  let worstGround = "";
  for (const g of grounds) {
    const r = ratio(fgHex, tokens[g]);
    if (r < worst) {
      worst = r;
      worstGround = g;
    }
  }

  const need = MIN[req];
  const pass = worst >= need;
  if (!pass) failures++;
  rows.push({
    theme,
    token: fg,
    hex: fgHex,
    ground: worstGround,
    ratio: worst,
    need,
    pass,
    note,
  });
}

const md = process.argv.includes("--md");

if (md) {
  console.log("| Theme | Token | Hex | Worst ground | Ratio | Required | Pass | Used for |");
  console.log("|---|---|---|---|---|---|---|---|");
  for (const r of rows) {
    console.log(
      `| ${r.theme} | \`--${r.token}\` | \`${r.hex}\` | \`--${r.ground}\` | ${r.ratio.toFixed(2)}:1 | ${r.need}:1 | ${r.pass ? "✅" : "❌"} | ${r.note} |`,
    );
  }
} else {
  for (const r of rows) {
    const mark = r.pass ? "PASS" : "FAIL";
    console.log(
      `${mark}  ${r.theme.padEnd(5)} --${r.token.padEnd(15)} ${r.hex}  on --${r.ground.padEnd(8)} ${r.ratio.toFixed(2)}:1 (need ${r.need}:1)`,
    );
  }
}

console.error(
  failures === 0
    ? `\n${rows.length} pairs checked, all pass WCAG 2.2 AA.`
    : `\n${failures} of ${rows.length} pairs FAIL WCAG 2.2 AA.`,
);

process.exit(failures === 0 ? 0 : 1);
