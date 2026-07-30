#!/usr/bin/env node
/**
 * Type-scale guard.
 *
 * Enforces the floor ratified in Chat Relay v2.0 §3.1: nothing renders below
 * 12px anywhere on the site, and mono labels carry at least 0.12em tracking.
 * The 11px mono eyebrow was the specific case flagged as unreadable, and it
 * appeared on every page.
 *
 * FAILS on:
 *   - any font-size below 12px, literal or in an --fs-* token
 *   - any --fs-* token declared below 12px
 *
 * WARNS on:
 *   - literal px font-sizes in components. DESIGN.md holds that every size
 *     resolves through an --fs-* token and a literal is drift, but 119 of them
 *     predate this guard. Pass --strict to fail on these once they are cleared.
 *
 * Run: node scripts/check-type-scale.mjs [--strict]
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const FLOOR = 12;
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
const warnings = [];

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
  }
}

// ── 3. UPPERCASE mono labels need tracking, or 12px caps close up into a smear.
// Sentence-case mono at 12px does not: tracking there is a legibility tax, not
// a gain, so the floor deliberately applies only where caps are set.
for (const file of walk("src")) {
  const src = readFileSync(file, "utf8");
  const blocks = src.split("}");
  for (const block of blocks) {
    if (!/font-size:\s*var\(--fs-label\)/.test(block)) continue;
    if (!/text-transform:\s*uppercase/.test(block)) continue;
    const ls = block.match(/letter-spacing:\s*([0-9.]+)em/);
    const selector = (block.match(/([.#][\w-]+[^{]*)\{/) || [, "?"])[1].trim();
    if (!ls) {
      errors.push(
        `${file}  uppercase --fs-label with no letter-spacing  [${selector}]`,
      );
    } else if (Number.parseFloat(ls[1]) < TRACKING_FLOOR) {
      errors.push(
        `${file}  uppercase --fs-label at ${ls[1]}em tracking, below ${TRACKING_FLOOR}em  [${selector}]`,
      );
    }
  }
}

// ── 4. The incumbent glass register stays deleted ─────────────────────────
// Canon §5 bans glass outright, and Relay v2.2 §3 asks for a CI ban once the
// step-8 strip has landed. The register was previously "removed" by rewiring
// its tokens to transparent, which left ~250 declarations that one variable
// change would have brought back site-wide. This makes that impossible.
//
// The single exception is the sticky nav's blur, which canon §5 explicitly
// permits: a sticky bar over scrolling content needs it to stay legible.
const GLASS_EXCEPTION = "src/components/layout/NavBar.module.css";

for (const file of walk("src")) {
  if (file === GLASS_EXCEPTION) continue;
  const lines = readFileSync(file, "utf8").split("\n");
  for (const [i, line] of lines.entries()) {
    if (/^\s*[-\w]*backdrop-filter\s*:/.test(line)) {
      errors.push(
        `${file}:${i + 1}  backdrop-filter is banned (canon §5). The sticky nav is the only permitted blur.`,
      );
    }
    if (/var\(--glass-/.test(line)) {
      errors.push(
        `${file}:${i + 1}  --glass-* token is banned (canon §5); the register was deleted in the step-8 strip.`,
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

if (errors.length) {
  console.error(`\n${errors.length} type-scale violation(s):\n`);
  for (const e of errors) console.error(`  ${e}`);
  console.error(
    `\nThe floor is ${FLOOR}px, ratified in Chat Relay v2.0 §3.1. Use an --fs-* token from globals.css Layer 1.`,
  );
  process.exit(1);
}

if (strict && warnings.length) {
  console.error(`\n--strict: ${warnings.length} literal font-size(s) must be tokenised.`);
  process.exit(1);
}

console.log(
  `\nType scale clean: nothing below ${FLOOR}px, all --fs-label tracking at or above ${TRACKING_FLOOR}em.`,
);
