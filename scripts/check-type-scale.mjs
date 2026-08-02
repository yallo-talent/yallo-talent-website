#!/usr/bin/env node
/**
 * Type-scale guard.
 *
 * Enforces the floor ratified in canon amendment A4 (30 Jul): nothing renders
 * below 13px anywhere on the site, and mono labels carry at least 0.12em
 * tracking. Supersedes the 12px floor of Chat Relay v2.0 §3.1 — that floor was
 * met and then became the resting size of load-bearing content.
 * The 11px mono eyebrow was the specific case flagged as unreadable, and it
 * appeared on every page.
 *
 * FAILS on:
 *   - any font-size below 13px, literal or in an --fs-* token
 *   - any --fs-* token declared below 13px
 *
 * WARNS on:
 *   - literal px font-sizes in components. DESIGN.md holds that every size
 *     resolves through an --fs-* token and a literal is drift, but 119 of them
 *     predate this guard. Pass --strict to fail on these once they are cleared.
 *     CLEARED 30 Jul 2026 — all 26 remaining literals across the eight shells
 *     were resolved through the ramp, so CI now runs --strict and a new literal
 *     font-size fails the build rather than joining a warning list nobody reads.
 *
 * Run: node scripts/check-type-scale.mjs [--strict]
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const FLOOR = 13;
const TRACKING_FLOOR = 0.12;
const strict = process.argv.includes("--strict");

const TOKENS = "src/app/globals.css";

/** Every .css and .tsx file under src, so nothing hides in a component. */
function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(css|tsx)$/.test(p)) out.push(p);
  }
  return out;
}

const errors = [];
/** Same class twice in one module, sharing no property. Reported, not failed. */
const duplicateAdditive = [];
/** Same class twice, both setting the same property. The later wins. Fails. */
const duplicateCollisions = [];
const warnings = [];

/**
 * The properties two same-named top-level blocks both set, with each value.
 * Reads from a selector line to its closing brace by brace depth, so nested
 * at-rules and pseudo blocks inside either one are included as written.
 */
function collidingProps(lines, startA, startB) {
  const body = (start) => {
    const out = [];
    let depth = 0;
    let began = false;
    for (let i = start - 1; i < lines.length; i++) {
      out.push(lines[i]);
      for (const ch of lines[i]) {
        if (ch === "{") {
          depth += 1;
          began = true;
        } else if (ch === "}") depth -= 1;
      }
      if (began && depth === 0) break;
    }
    return out.join("\n");
  };
  const declared = (text) => {
    const map = new Map();
    for (const m of text.matchAll(/^\s*([a-z-]+)\s*:\s*([^;]+);/gm))
      if (!map.has(m[1])) map.set(m[1], m[2].trim());
    return map;
  };
  const a = declared(body(startA));
  const b = declared(body(startB));
  const out = [];
  for (const [prop, va] of a)
    if (b.has(prop)) out.push({ prop, a: va, b: b.get(prop) });
  return out;
}

// ── 1. The ramp itself may not declare a step below the floor ──────────────
const tokenSrc = readFileSync(TOKENS, "utf8");
for (const [i, line] of tokenSrc.split("\n").entries()) {
  const m = line.match(/^\s*(--fs-[a-z0-9-]+):\s*([0-9.]+)px/);
  if (m && Number.parseFloat(m[2]) < FLOOR) {
    errors.push(
      `${TOKENS}:${i + 1}  ${m[1]} is ${m[2]}px, below the ${FLOOR}px floor`,
    );
  }
}

// ── 2. No literal font-size below the floor, anywhere ─────────────────────
for (const file of walk("src")) {
  const lines = readFileSync(file, "utf8").split("\n");
  let selector = "";

  for (const [i, line] of lines.entries()) {
    if (line.includes("{") && !line.trim().startsWith("@")) {
      const s = line.slice(0, line.indexOf("{")).trim();
      if (s) selector = s;
    }

    // JSX inline styles: `fontSize: 10` is a px value React writes out, and it
    // used to slip straight past this guard — four sub-12px values were living
    // in .tsx style objects while CSS was clean.
    const jsx = line.match(/fontSize:\s*([0-9.]+)\s*[,}]/);
    if (jsx) {
      const px = Number.parseFloat(jsx[1]);
      if (px < FLOOR) {
        errors.push(
          `${file}:${i + 1}  inline fontSize ${px} is below the ${FLOOR}px floor  [${selector}]`,
        );
      } else {
        warnings.push(
          `${file}:${i + 1}  inline fontSize ${px} is off-token  [${selector}]`,
        );
      }
    }

    const size = line.match(/font-size:\s*([0-9.]+)px/);
    if (size) {
      const px = Number.parseFloat(size[1]);
      if (px < FLOOR) {
        errors.push(
          `${file}:${i + 1}  font-size ${px}px is below the ${FLOOR}px floor  [${selector}]`,
        );
      } else if (file !== TOKENS) {
        warnings.push(`${file}:${i + 1}  literal font-size ${px}px is off-token  [${selector}]`);
      }
    }

    // A clamp's lower endpoint is what actually renders on a small screen.
    const clamp = line.match(/font-size:\s*clamp\(\s*([0-9.]+)px/);
    if (clamp && Number.parseFloat(clamp[1]) < FLOOR) {
      errors.push(
        `${file}:${i + 1}  clamp floor ${clamp[1]}px is below the ${FLOOR}px floor  [${selector}]`,
      );
    }

    // Canon §5: every font-size resolves through one of the 13 ramp roles, so
    // anything that is not a var(--fs-*) is drift regardless of its shape.
    //
    // This catch-all exists because the two checks above are both anchored
    // patterns and BOTH missed the real drift. `/font-size:\s*([0-9.]+)px/`
    // needs a digit straight after the colon, so it never saw a clamp() at all;
    // the clamp check above only ever tested the floor. Twenty-six literal
    // clamp() font-sizes across eight shells therefore sat in this repo while
    // this guard reported "Type scale clean" — including a page H1 and eleven
    // section headings. Matching on the absence of a token instead of on the
    // presence of a known-bad shape is the only formulation that cannot be
    // outflanked by a value written a new way.
    const decl = line.match(/font-size:\s*([^;]+);/);
    if (decl && file !== TOKENS && !decl[1].includes("var(--fs-")) {
      warnings.push(
        `${file}:${i + 1}  font-size "${decl[1].trim()}" does not resolve through the ramp  [${selector}]`,
      );
    }
  }
}

// ── 3. UPPERCASE mono labels need tracking, or 12px caps close up into a smear.
// Sentence-case mono at 12px does not: tracking there is a legibility tax, not
// a gain, so the floor deliberately applies only where caps are set.
for (const file of walk("src")) {
  const src = readFileSync(file, "utf8");
  const blocks = src.split("}");
  for (const block of blocks) {
    // A4 governs "mono labels 13px", which is BOTH 13px roles — --fs-label and
    // --fs-data. Checking only --fs-label is how .statL shipped uppercase mono
    // at 0.06em: the four canon §6 metric labels, half the required tracking,
    // and green. R1 leans on this tracking to justify exempting the 13/14/15px
    // roles from the 1.125 ratio, so an untracked 13px cap undercuts the ratio
    // rule's own reasoning as well as A4.
    if (!/font-size:\s*var\(--fs-(label|data)\)/.test(block)) continue;
    if (!/text-transform:\s*uppercase/.test(block)) continue;
    const ls = block.match(/letter-spacing:\s*([0-9.]+)em/);
    const selector = (block.match(/([.#][\w-]+[^{]*)\{/) || [, "?"])[1].trim();
    if (!ls) {
      errors.push(
        `${file}  uppercase 13px mono with no letter-spacing  [${selector}]`,
      );
    } else if (Number.parseFloat(ls[1]) < TRACKING_FLOOR) {
      errors.push(
        `${file}  uppercase 13px mono at ${ls[1]}em tracking, below ${TRACKING_FLOOR}em  [${selector}]`,
      );
    }
  }
}

// ── 3b. Rendered adjacency (R1) ───────────────────────────────────────────
//
// The floor check above is necessary and was never sufficient. R1 ratifies a
// 1.125 minimum ratio between adjacent ramp steps from --fs-body-sm upward, and
// nothing enforced it — a critique caught .statN rendering at 58.88px against
// every .h2 at 54.00px, a 1.09 ratio and a visible hierarchy inversion, while
// this guard reported clean.
//
// The cause is structural rather than a typo, which is why it needs a guard:
// --fs-numeral is clamp(38px, 4.6vw, 62px) and --fs-headline is
// clamp(32px, 4.4vw, 54px). Their MAXIMA are correctly ordered, so reading the
// tokens tells you nothing is wrong. But headline reaches its cap at 1227px
// while numeral keeps growing to 1348px, so between those widths a third
// display step exists that the source never declares. Evaluating the clamps
// across a width sweep is the only way to see it.
const RAMP_ORDER = [
  "--fs-display",
  "--fs-headline",
  "--fs-numeral",
  "--fs-title",
  "--fs-subtitle",
  "--fs-body",
  "--fs-body-sm",
];
const ADJACENCY_FLOOR = 15.5; // R1: the rule applies from --fs-body-sm upward.
const RATIO = 1.125;
const SWEEP = [390, 768, 1024, 1227, 1280, 1348, 1440, 1680, 1920];

/** clamp(min, preferred-vw, max) evaluated at a viewport width. */
function evalSize(decl, width) {
  const clamp = decl.match(
    /clamp\(\s*([\d.]+)px\s*,\s*([\d.]+)vw\s*,\s*([\d.]+)px\s*\)/,
  );
  if (clamp) {
    const [, min, vw, max] = clamp.map(Number);
    return Math.min(Math.max(min, (vw * width) / 100), max);
  }
  const fixed = decl.match(/^\s*([\d.]+)px\s*$/);
  return fixed ? Number(fixed[1]) : null;
}

{
  const src = readFileSync(TOKENS, "utf8").replace(/\s+/g, " ");
  const declared = new Map();
  for (const role of RAMP_ORDER) {
    const m = src.match(
      new RegExp(`${role}:\\s*(clamp\\([^)]*\\)|[\\d.]+px)`),
    );
    if (m) declared.set(role, m[1]);
  }

  for (const width of SWEEP) {
    // Roles that land on the SAME size are ONE step, not two adjacent ones, so
    // they collapse before the ratio is applied. Without this the guard reports
    // a 1.000 "violation" wherever two roles deliberately share a step — which
    // --fs-display and --fs-numeral do at the mobile floor by design.
    const distinct = [];
    for (const role of RAMP_ORDER) {
      const v = evalSize(declared.get(role) ?? "", width);
      if (v === null || v < ADJACENCY_FLOOR) continue;
      const last = distinct.at(-1);
      if (last && Math.abs(last[1] - v) < 0.01) last[0] += ` / ${role}`;
      else distinct.push([role, v]);
    }
    const sizes = distinct;
    for (let i = 1; i < sizes.length; i++) {
      const [prevRole, prev] = sizes[i - 1];
      const [role, cur] = sizes[i];
      if (cur > prev + 0.01) {
        errors.push(
          `ramp order inverted at ${width}px: ${role} (${cur.toFixed(2)}px) is LARGER than ${prevRole} (${prev.toFixed(2)}px)`,
        );
      } else if (prev / cur < RATIO - 0.001) {
        errors.push(
          `ramp adjacency at ${width}px: ${prevRole} (${prev.toFixed(2)}px) over ${role} (${cur.toFixed(2)}px) is ${(prev / cur).toFixed(3)}, below R1's ${RATIO}`,
        );
      }
    }
  }
}

// ── 3c. A5: a hover lift must be PAIRED with a non-motion cue ─────────────
//
// Canon A5 permits hover elevation as an interaction state and requires it be
// paired with a border or ground shift. The reason is not decoration: the
// reduced-motion reset in globals.css zeroes every transition and transform, so
// a hover rule that changes ONLY a transform leaves users who set that
// preference with no affordance whatsoever. A critique measured exactly that on
// the homepage's two primary CTAs — the whole hover state was a 1-2px nudge
// with motion on, and nothing at all with it off.
//
// Only CONTROL-like selectors are judged. Panels, image wrappers and media
// surfaces legitimately move on hover without being clickable, and holding them
// to a control's rule would produce noise that teaches everyone to ignore this.
/* Not just transforms. `gap` slipped through and it is the same defect: twelve
   secondary CTAs had `.btnSecondary:hover { gap: 12px }` as their ONLY hover
   declaration — a 4px reflow of a trailing arrow, no colour, border, ground or
   underline — and under reduced motion it degrades to an instant jump rather
   than a state. A layout nudge is not a visual cue, so the set covers anything
   that only moves or resizes something. */
const MOTION_ONLY =
  /^(transform|translate|scale|rotate|gap|row-gap|column-gap|margin|margin-[a-z]+|padding|padding-[a-z]+|top|left|right|bottom|inset|letter-spacing|width|height)$/;
const CONTROL = /(btn|cta|button|link|card|chip|pill|tab|trigger|row|item)/i;

{
  for (const file of walk("src").filter((f) => f.endsWith(".css"))) {
    const src = readFileSync(file, "utf8");
    for (const m of src.matchAll(/([^{}]*):hover[^{}]*\{([^}]*)\}/g)) {
      const selector = m[1].trim().split("\n").pop().trim().split(",").pop().trim();
      if (!CONTROL.test(selector)) continue;
      const props = [...m[2].matchAll(/(^|;)\s*([a-z-]+)\s*:/g)].map((d) => d[2]);
      if (props.length === 0) continue;
      if (props.every((d) => MOTION_ONLY.test(d))) {
        errors.push(
          `${file}  ${selector}:hover changes only ${props.join(", ")} — A5 requires a non-motion cue alongside the lift`,
        );
      }
    }
  }
}

// ── 4. Glass: ALLOW-LIST enforcement, not a ban ───────────────────────────
// Canon amendment A3 (30 Jul) reverses the step-8 strip and sanctions glass —
// but as one token-governed utility on five named surfaces, not as a register
// anyone can reach for. So this guard changed from banning `backdrop-filter` to
// enforcing that allow-list, which is a STRICTER contract than the ban it
// replaces: the ban had one blanket file exception, and this has none.
//
// Two rules:
//   1. `backdrop-filter` may be declared in exactly ONE place — the .glass
//      utility in globals.css. A component authoring its own blur fails, because
//      then the tokens, the AA pairing and the reduced-transparency fallback are
//      no longer guaranteed by anything.
//   2. The .glass class may only be APPLIED on an allow-listed surface. Canon
//      §5 lists five and the list is exhaustive.
const GLASS_OWNER = "src/app/globals.css";

/** Canon A3's five surfaces. Matched against the file that applies `glass`. */
const GLASS_ALLOWED = [
  "src/components/layout/NavBar.module.css", // nav on scroll, and the mega panel
  "src/components/layout/NavBar.tsx",
  "src/components/layout/StickyBriefCTA.module.css", // sticky brief CTA
  "src/components/layout/StickyBriefCTA.tsx",
  "src/components/blocks/home/Instrument.tsx", // hero instrument
  "src/components/blocks/home/Home.module.css", // hero instrument, four-ways media
];

/**
 * Blank out comment bodies while preserving line numbering.
 *
 * The glass check below matches source patterns like `composes: glass`, and a
 * comment explaining WHY a rule exists naturally quotes those patterns — this
 * guard flagged globals.css for a comment describing the very collision it was
 * added to prevent. A guard that reports its own documentation trains people to
 * ignore it.
 */
const stripComments = (src) =>
  src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/(^|[^:])\/\/.*$/gm, (m) => m.replace(/[^\n]/g, " "));

for (const file of walk("src")) {
  const lines = stripComments(readFileSync(file, "utf8")).split("\n");
  for (const [i, line] of lines.entries()) {
    if (/^\s*[-\w]*backdrop-filter\s*:/.test(line) && file !== GLASS_OWNER) {
      errors.push(
        `${file}:${i + 1}  backdrop-filter may only be declared by the .glass utility in ${GLASS_OWNER} (canon A3). Apply .glass instead of authoring a blur.`,
      );
    }
    // Applying the utility, in CSS composition or in a className.
    const applies =
      /composes:\s*glass\b/.test(line) ||
      /className=\{?["'`][^"'`]*\bglass\b/.test(line) ||
      /\bstyles\.glass\b/.test(line);
    if (applies && !GLASS_ALLOWED.includes(file)) {
      errors.push(
        `${file}:${i + 1}  .glass is applied on a surface canon A3 does not allow-list. The five permitted surfaces are the nav on scroll, the mega panel, the hero instrument, the sticky brief CTA and the four-ways media panel.`,
      );
    }
  }
}

// ── report ────────────────────────────────────────────────────────────────
if (warnings.length) {
  console.log(
    `\n${warnings.length} literal/tracking warning(s) — pre-existing drift, not failing:`,
  );
  for (const w of warnings.slice(0, 12)) console.log(`  ${w}`);
  if (warnings.length > 12) console.log(`  … and ${warnings.length - 12} more`);
}

// ── 4b. An allow-listed translucent surface must USE the utility ───────────
//
// The A3 check below polices `backdrop-filter` declarations, and that turned out
// to be the wrong half of the rule. The sticky brief CTA — an allow-listed glass
// surface — authored `color-mix(in oklab, var(--surface) 92%, transparent)` with
// no backdrop-filter at all, so the guard never fired while the surface got
// neither the blur nor A3's prefers-reduced-transparency fallback.
//
// That was an SC 1.4.3 failure, not a missing effect. The effective backdrop of a
// position:fixed panel is the content SCROLLING BENEATH IT, so at 8%
// transmission the label fell from 5.05:1 to 1.53:1 against body text passing
// behind it. Five critique passes hand-composed every one of axe's contrast
// abstentions and could not see it, because composing an ancestor chain cannot
// reach a backdrop that is not an ancestor.
//
// So the rule becomes: if a file on the allow-list makes a surface translucent,
// that surface must compose the utility, which carries the blur and the fallback.
// One level of nesting matters: the real value is
// `color-mix(in oklab, var(--surface) 92%, transparent)`, and `[^)]*` stops at
// the `)` of `var(--surface)` — so my first version of this pattern never
// matched, and the guard passed over the very defect it was written for. I only
// found that by re-injecting the defect and watching it stay green, which is the
// check every guard in this repo now gets.
const TRANSLUCENT =
  /(color-mix\((?:[^()]|\([^()]*\))*\btransparent\b|rgba?\([^)]*,\s*0?\.\d+\s*\)|\/\s*0?\.\d+\s*\))/;

{
  for (const file of GLASS_ALLOWED) {
    let src;
    try {
      src = readFileSync(file, "utf8");
    } catch {
      continue;
    }
    const bare = stripComments(src);
    for (const m of bare.matchAll(/([^{}]*)\{([^}]*)\}/g)) {
      const body = m[2];
      if (!/^\s*background(-color)?\s*:/m.test(body)) continue;
      if (!TRANSLUCENT.test(body)) continue;
      // The utility itself, and anything composing it, is compliant.
      if (/composes:\s*glass/.test(body)) continue;
      // A gradient wash or an ambient tint is not a glass surface.
      if (/gradient|var\(--amb|var\(--wa|var\(--sector-accent/.test(body)) continue;
      const selector = m[1].trim().split("\n").pop().trim();
      errors.push(
        `${file}  ${selector} is translucent without composing .glass — A3 requires the utility, which carries the blur and the reduced-transparency fallback`,
      );
    }
  }
}

/* ── One class, one declaration, per CSS module ────────────────────────────
 *
 * Home.module.css is ~3,000 lines shared by every home block, plus the pages
 * that borrow its section furniture. Nothing stopped a new component from
 * appending a class name an existing one already owned, and because a CSS
 * module scopes by FILE and not by component, the later rule simply won on
 * equal specificity from further down the cascade.
 *
 * That is not hypothetical. The Blueprint's phase rail declared `.phaseName`,
 * which the homepage instrument had owned since it was built. The homepage
 * pipeline repainted to --text on --dk-2 — 1.00:1, two serious axe violations
 * on the busiest page on the site — and it also silently killed the
 * .phaseActive and .phaseDone states that key off the same class. Nothing in
 * the authoring of either component was wrong; the collision was invisible in
 * both files.
 *
 * TRIAGED 2 August 2026, and the guard now makes the distinction it could not.
 * It used to report all twelve at one severity, on the grounds that it could not
 * tell a deliberate second block from a real collision. It can: read both blocks
 * and compare the PROPERTIES they set. Two blocks that share no property are
 * additive and harmless — the later one adds `resize` to a textarea, or
 * `pointer-events` to a close button — and no amount of reading the file makes
 * them a bug. Two blocks that set the same property at the same specificity are
 * a collision, and the later one silently wins.
 *
 * Of the twelve on this branch, eleven were additive and one was real:
 * Home.module.css `.moduleLink` declared `display: inline-flex` and then
 * `display: flex` eighteen lines later, so the first was dead the day it was
 * written. Merged into one block.
 *
 * A collision now FAILS. An additive duplicate is reported, because it is still
 * worth seeing — a class in two places is harder to read even when it is
 * correct — but it does not make the build red, and a gate that goes red on
 * things that are not wrong is a gate people learn to skip.
 *
 * A duplicate top-level class in one module is therefore reported here. State
 * and variant selectors (.a:hover, .a .b, .a.b, .a::before) are not duplicates
 * and are not flagged — only the same bare class opening a second block.
 *
 * Legitimate re-declaration inside a media query is also untouched, because
 * this only reads selectors at brace depth zero.
 * ------------------------------------------------------------------------ */
for (const file of walk("src").filter((f) => f.endsWith(".module.css"))) {
  const src = readFileSync(file, "utf8");
  const lines = src.split("\n");
  const seen = new Map();
  let depth = 0;
  let lineNo = 0;
  for (const raw of lines) {
    lineNo += 1;
    const line = raw.trim();
    if (depth === 0) {
      /* SOLO declarations only: `.name {` on its own line. A class that
         appears in a grouped base rule (".a,\n.b {") and again in its own
         block is the normal shared-base-plus-override pattern and is not a
         collision, so grouped selectors are skipped entirely. */
      const m = /^\.([A-Za-z][A-Za-z0-9_-]*)\s*\{\s*$/.exec(line);
      if (m) {
        const name = m[1];
        if (seen.has(name)) {
          const first = seen.get(name);
          const clash = collidingProps(lines, first.line, lineNo);
          const where = `${file}  .${name} declared at line ${first.line} and again at ${lineNo}`;
          if (clash.length)
            duplicateCollisions.push(
              `${where}\n      both set ${clash.map((c) => `${c.prop} (${c.a} then ${c.b})`).join(", ")}`,
            );
          else duplicateAdditive.push(where);
        } else {
          seen.set(name, { line: lineNo });
        }
      }
    }
    depth += (line.match(/\{/g) ?? []).length;
    depth -= (line.match(/\}/g) ?? []).length;
    if (depth < 0) depth = 0;
  }
}

if (errors.length) {
  console.error(`\n${errors.length} type-scale violation(s):\n`);
  for (const e of errors) console.error(`  ${e}`);
  console.error(
    `\nThe floor is ${FLOOR}px, ratified in canon amendment A4. Use an --fs-* token from globals.css Layer 1.`,
  );
  process.exit(1);
}

if (strict && warnings.length) {
  console.error(`\n--strict: ${warnings.length} literal font-size(s) must be tokenised.`);
  process.exit(1);
}

if (duplicateAdditive.length) {
  console.log(
    `\n${duplicateAdditive.length} additive duplicate class declaration(s) — same class, two top-level blocks, no property in common. Harmless, and still worth reading in one place:`,
  );
  for (const d of duplicateAdditive) console.log(`  ${d}`);
}

if (duplicateCollisions.length) {
  console.error(
    `\n${duplicateCollisions.length} colliding duplicate class declaration(s) — a CSS module scopes by FILE, so at equal specificity the later block silently wins and the earlier one is dead:`,
  );
  for (const d of duplicateCollisions) console.error(`  ${d}`);
  console.error(
    "\nMerge the two blocks, keeping the value that ships. Do not resolve this by\n" +
      "raising specificity: the two rules are the same component, not an override.",
  );
  process.exit(1);
}

console.log(
  `\nType scale clean: nothing below ${FLOOR}px, all 13px mono tracking at or above ${TRACKING_FLOOR}em.`,
);
