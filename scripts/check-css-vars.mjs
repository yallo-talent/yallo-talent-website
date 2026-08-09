#!/usr/bin/env node
/**
 * Every custom property a stylesheet READS must be one some stylesheet WRITES.
 *
 * WHY THIS IS WORTH A GATE. `var(--fs-section-h)` sat in the article body
 * template referring to a token that is defined nowhere on the estate. An
 * undefined custom property does not fall back to the cascade — the
 * declaration becomes invalid at computed-value time, and an inherited
 * property like `font-size` then resolves to INHERIT. So every section heading
 * in a published article was rendering at body size, with no rule anywhere
 * saying so and no gate failing. It survived because there are no published
 * articles yet: the defect was waiting for the first one.
 *
 * IT IS A TYPO CLASS, NOT AN INSTANCE. A renamed token, a token that never
 * shipped, a token misspelled once — all three produce silence rather than an
 * error, in a system whose whole type ramp and colour system are tokens. Every
 * other gate on this estate judges rendered output; this one judges the
 * stylesheet, because the rendered symptom is "text is the wrong size", which
 * is what a person notices last.
 *
 * FALLBACKS ARE FINE. `var(--x, 12px)` is a deliberate default, not a broken
 * reference, so it is not reported.
 *
 * Run: node scripts/check-css-vars.mjs
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOTS = ["src"];

/** Properties supplied by something other than a stylesheet. */
const EXTERNAL = new Set([
  /* next/font writes these onto the document element at runtime. */
  "--font-newsreader",
  "--font-newsreader-italic",
  "--font-inter",
  "--font-plex-mono",
]);

function cssFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) out.push(...cssFiles(path));
    else if (entry.endsWith(".css")) out.push(path);
  }
  return out;
}

const files = ROOTS.flatMap((r) => cssFiles(r));

/** Everything defined anywhere: `--name:` at the start of a declaration. */
const defined = new Set(EXTERNAL);
for (const file of files) {
  const css = readFileSync(file, "utf8");
  for (const m of css.matchAll(/(--[a-zA-Z0-9-]+)\s*:/g)) defined.add(m[1]);
}

/* Inline styles can set a custom property too, and a component that does is
   the definition for the rule that reads it. */
function tsxFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) out.push(...tsxFiles(path));
    else if (entry.endsWith(".tsx") || entry.endsWith(".ts")) out.push(path);
  }
  return out;
}
for (const file of ROOTS.flatMap((r) => tsxFiles(r))) {
  const src = readFileSync(file, "utf8");
  for (const m of src.matchAll(/["'`](--[a-zA-Z0-9-]+)["'`]\s*:/g)) {
    defined.add(m[1]);
  }
}

/**
 * Comments are prose, and prose names tokens that were REMOVED on purpose.
 *
 * The first run of this reported `var(--markH)` inside a comment explaining why
 * `--markH` no longer exists, which is the scanner reading the note that says
 * the fix landed. Replacing a comment with same-length blanks keeps every line
 * and column number true, so a real finding still points at the right place.
 */
function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, (m) =>
    m.replace(/[^\n]/g, " "),
  );
}

const missing = [];
for (const file of files) {
  const lines = stripComments(readFileSync(file, "utf8")).split("\n");
  lines.forEach((line, i) => {
    /* Only a reference with NO fallback. The comma form is a deliberate
       default and cannot be the silent failure this gate is about. */
    for (const m of line.matchAll(/var\(\s*(--[a-zA-Z0-9-]+)\s*\)/g)) {
      if (!defined.has(m[1])) {
        missing.push({ file, line: i + 1, name: m[1], text: line.trim() });
      }
    }
  });
}

console.log(
  `Checked ${files.length} stylesheet(s); ${defined.size} custom propert(ies) are defined somewhere.`,
);

if (missing.length > 0) {
  console.error(
    `\n${missing.length} reference(s) to a custom property nothing defines:`,
  );
  for (const m of missing) {
    console.error(`  ${m.file}:${m.line}  ${m.name}\n      ${m.text}`);
  }
  console.error(
    "\nAn undefined custom property does not fall back to the cascade. The\n" +
      "declaration is invalid at computed-value time, so an inherited property\n" +
      "resolves to inherit and the surface renders at whatever it inherited —\n" +
      "silently. Define the token, or reference the one that exists.",
  );
  process.exit(1);
}
console.log("Every custom property read by a stylesheet is defined by one.");
