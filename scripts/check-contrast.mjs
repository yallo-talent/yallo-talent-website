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

import { readFileSync } from "node:fs";

// ---------------------------------------------------------------------------
// Token candidates. Keep in lockstep with globals.css Layer 1.
// ---------------------------------------------------------------------------

/* READ FROM globals.css, not from a copy of it.
 *
 * These two tables used to be hardcoded here, and that made this gate capable of
 * passing while the real palette failed — it was validating a duplicate that
 * could drift from Layer 1 without anything noticing. R11's neutralisation of the
 * base is exactly the change that exposed it: fourteen tokens moved in
 * globals.css and this gate reported the OLD values and the OLD ratios, all
 * green.
 *
 * A guard that reads a copy of the thing it guards is not guarding it. Layer 1 is
 * the single source of truth, so the tables are derived from it and a missing
 * token is a hard failure rather than a silent stale value.
 */
const TOKENS = "src/app/globals.css";
const layer1 = readFileSync(TOKENS, "utf8");

/** Resolve `--name` from Layer 1, following one level of `var()` indirection. */
function token(name) {
  const direct = layer1.match(
    new RegExp(`^\\s+--${name}:\\s*(#[0-9a-fA-F]{3,8})`, "m"),
  );
  if (direct) return direct[1];
  const alias = layer1.match(
    new RegExp(`^\\s+--${name}:\\s*var\\(\\s*--([a-z0-9-]+)`, "m"),
  );
  if (alias) return token(alias[1]);
  throw new Error(
    `check-contrast: --${name} not found in ${TOKENS}. The gate reads Layer 1 directly; add the token or correct the name.`,
  );
}

const LIGHT = {
  paper: token("paper"),
  "paper-2": token("paper-2"),
  "paper-3": token("paper-3"),
  ink: token("ink"),
  "ink-2": token("ink-2"),
  "ink-3": token("ink-3"),
  gold: token("gold"),
  "gold-deep": token("gold-deep"),
  "gold-ink": token("gold-ink"),
  rule: token("rule"),
  "rule-strong": token("rule-strong"),
  "signal-mark": token("fn-signal-mark-l"),
  "signal-text": token("fn-signal-text-l"),
  "info-mark": token("fn-info-mark-l"),
  "info-text": token("fn-info-text-l"),
  "positive-mark": token("fn-positive-mark-l"),
  "positive-text": token("fn-positive-text-l"),
  "category-mark": token("fn-category-mark-l"),
  "category-text": token("fn-category-text-l"),
};

const DARK = {
  dk: token("dk"),
  "dk-2": token("dk-2"),
  "dk-3": token("dk-3"),
  "dk-line": token("dk-line"),
  "dk-line-strong": token("dk-line-strong"),
  "dk-txt": token("dk-txt"),
  "dk-txt-2": token("dk-txt-2"),
  "dk-txt-3": token("dk-txt-3"),
  gold: token("gold"),
  "signal-mark": token("fn-signal-mark-d"),
  "signal-text": token("fn-signal-text-d"),
  "info-mark": token("fn-info-mark-d"),
  "info-text": token("fn-info-text-d"),
  "positive-mark": token("fn-positive-mark-d"),
  "positive-text": token("fn-positive-text-d"),
  "category-mark": token("fn-category-mark-d"),
  "category-text": token("fn-category-text-d"),
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

// ---------------------------------------------------------------------------
// Composites. The pairs above are token-on-token, and that is the narrower
// half of the problem: a token can clear 4.5:1 against every ground it is
// listed against and still fail the reader, because what is actually behind it
// is the ground WITH the ambient wash over it.
//
// That is not hypothetical. --ink-3 measured 4.94:1 on bare paper and 4.02:1
// with claret over it; --dk-txt-3 measured 5.29:1 on bare --dk and 3.70:1 with
// teal over --dk-2. Body copy, under the AA gate, on most long pages, and this
// gate reported all-green throughout because it was reading the token table.
// A gate blind to the likeliest failure is the defect behind the defect.
//
// The model: `.amb-wash::before` paints color-mix(in oklab, HUE var(--amb-alpha),
// transparent) over the host's background, so the worst case a reader meets is
// the hue at FULL --amb-alpha composited on the ground. Both values are read
// from Layer 1 rather than restated here, for the same reason the token tables
// are.
// ---------------------------------------------------------------------------

/** Composite `hue` at `alpha` (0..1) over `ground`, both #rrggbb. */
function composite(hueHex, alpha, groundHex) {
  const px = (h) => {
    const s = h.replace("#", "");
    return [0, 2, 4].map((i) => Number.parseInt(s.slice(i, i + 2), 16));
  };
  const [h, g] = [px(hueHex), px(groundHex)];
  return `#${h
    .map((c, i) => Math.round(c * alpha + g[i] * (1 - alpha)))
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("")}`;
}

/** Read `--amb-alpha` from a named Layer 1 block, as a 0..1 fraction. */
function ambAlpha(selector) {
  const block = layer1.match(
    new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{([^}]*)\\}`),
  );
  if (!block) {
    throw new Error(`check-contrast: no block for ${selector} in ${TOKENS}.`);
  }
  const m = block[1].match(/--amb-alpha:\s*([0-9.]+)%/);
  if (!m) {
    throw new Error(
      `check-contrast: --amb-alpha not found in ${selector}. The composite check reads it from Layer 1; do not restate it here.`,
    );
  }
  return Number(m[1]) / 100;
}

/**
 * The seven identity hues, per theme. Named rather than derived from the
 * --id-* map on purpose: --id-* aliases these, so an eighth hue has to be added
 * here to be measured, and a hue nothing measures is the round 3 failure.
 */
const HUE_NAMES = [
  "plum",
  "violet",
  "teal",
  "harbour",
  "indigo",
  "claret",
  "mulberry",
];

/**
 * Grounds a wash can sit on, per theme.
 *
 * MEASURED, not assumed: every `.amb-wash` element across nine pages in both
 * themes resolves to --paper, --paper-2, --dk or --dk-2. `--ground-3` hosts no
 * wash today, so it is reported rather than gated — pessimising the token for a
 * ground nothing uses would cost real hierarchy on dark, where every step of
 * --dk-txt-3-wash closes the gap to --dk-txt-2. The `.g3` assertion below is
 * what stops that staying true by luck.
 */
const WASH_GROUNDS = {
  light: { gated: ["paper", "paper-2"], reported: ["paper-3"] },
  dark: { gated: ["dk", "dk-2"], reported: ["dk-3"] },
};

/** [theme, foreground token, requirement, note] over the composite. */
const COMPOSITE_PAIRS = [
  ["light", "ink", "text-sm", "body copy over the wash"],
  ["light", "ink-2", "text-sm", "secondary copy over the wash"],
  ["light", "ink-3-wash", "text-sm", "subtle copy over the wash"],
  ["dark", "dk-txt", "text-sm", "body copy over the wash"],
  ["dark", "dk-txt-2", "text-sm", "secondary copy over the wash"],
  ["dark", "dk-txt-3-wash", "text-sm", "subtle copy over the wash"],
];

const ALPHA = {
  light: ambAlpha(':root[data-theme="light"]'),
  dark: ambAlpha(':root[data-theme="dark"]'),
};
const HUES = {
  light: Object.fromEntries(
    HUE_NAMES.map((n) => [n, token(`amb-${n}-l`)]),
  ),
  dark: Object.fromEntries(HUE_NAMES.map((n) => [n, token(`amb-${n}-d`)])),
};

const compositeRows = [];
let compositeFailures = 0;

for (const [theme, fg, req, note] of COMPOSITE_PAIRS) {
  const fgHex = token(fg);
  const need = MIN[req];
  for (const scope of ["gated", "reported"]) {
    let worst = Number.POSITIVE_INFINITY;
    let where = "";
    let bg = "";
    for (const groundName of WASH_GROUNDS[theme][scope]) {
      const groundHex = token(groundName);
      for (const [hueName, hueHex] of Object.entries(HUES[theme])) {
        const over = composite(hueHex, ALPHA[theme], groundHex);
        const r = ratio(fgHex, over);
        if (r < worst) {
          worst = r;
          where = `${hueName} on --${groundName}`;
          bg = over;
        }
      }
    }
    const pass = worst >= need;
    if (scope === "gated" && !pass) compositeFailures++;
    compositeRows.push({
      theme,
      token: fg,
      hex: fgHex,
      where,
      bg,
      ratio: worst,
      need,
      pass,
      scope,
      note,
    });
  }
}

/**
 * The wash must not reach --ground-3, because the gated grounds above stop
 * short of it. An enumerating list that nobody rechecks is how `/ai-talent`
 * shipped six classes under the type floor, so this asserts the enumeration
 * instead of trusting it.
 */
const g3Violations = [];
{
  const { readdirSync, statSync } = await import("node:fs");
  const walkSrc = (dir, out = []) => {
    for (const name of readdirSync(dir)) {
      if (name === "node_modules" || name.startsWith(".")) continue;
      const p = `${dir}/${name}`;
      if (statSync(p).isDirectory()) walkSrc(p, out);
      else if (/\.(tsx|css)$/.test(p)) out.push(p);
    }
    return out;
  };
  for (const file of walkSrc("src")) {
    readFileSync(file, "utf8")
      .split("\n")
      .forEach((line, i) => {
        if (!line.includes("amb-wash")) return;
        if (!/\bg3\b|ground-3|surface-raised/.test(line)) return;
        g3Violations.push({ file, line: i + 1, text: line.trim().slice(0, 90) });
      });
  }
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

// --- composites -------------------------------------------------------------
if (md) {
  console.log(
    "\n| Theme | Token | Hex | Worst composite | Ratio | Required | Pass | Scope |",
  );
  console.log("|---|---|---|---|---|---|---|---|");
  for (const r of compositeRows) {
    console.log(
      `| ${r.theme} | \`--${r.token}\` | \`${r.hex}\` | ${r.where} → \`${r.bg}\` | ${r.ratio.toFixed(2)}:1 | ${r.need}:1 | ${r.pass ? "✅" : "❌"} | ${r.scope} |`,
    );
  }
} else {
  console.log(
    `\nComposites — text over the ambient wash at full --amb-alpha (light ${(ALPHA.light * 100).toFixed(0)}%, dark ${(ALPHA.dark * 100).toFixed(0)}%), ${HUE_NAMES.length} hues:`,
  );
  for (const r of compositeRows) {
    const mark = r.scope === "reported" ? "note" : r.pass ? "PASS" : "FAIL";
    console.log(
      `${mark}  ${r.theme.padEnd(5)} --${r.token.padEnd(15)} ${r.hex}  on ${r.where.padEnd(22)} ${r.bg}  ${r.ratio.toFixed(2)}:1 (need ${r.need}:1)`,
    );
  }
}

if (g3Violations.length) {
  console.error(
    `\n${g3Violations.length} .amb-wash on a --ground-3 surface. The composite gate above only covers the two grounds a wash was measured on; extend WASH_GROUNDS and re-tune --ink-3-wash / --dk-txt-3-wash before shipping this:`,
  );
  for (const v of g3Violations) {
    console.error(`  ${v.file}:${v.line}  ${v.text}`);
  }
}

const total = failures + compositeFailures + g3Violations.length;

console.error(
  total === 0
    ? `\n${rows.length} token pairs and ${compositeRows.filter((r) => r.scope === "gated").length} composites checked, all pass WCAG 2.2 AA.`
    : `\n${failures} token pair(s) and ${compositeFailures} composite(s) FAIL WCAG 2.2 AA${g3Violations.length ? `, and ${g3Violations.length} wash(es) sit on an unmeasured ground` : ""}.`,
);

process.exit(total === 0 ? 0 : 1);
