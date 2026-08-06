#!/usr/bin/env node
/**
 * check:orbs — the blurred-orb ban, enforced.
 *
 * WHY THIS EXISTS, and it is the whole argument for it. DESIGN.md bans blurred
 * orbs twice, in terms that leave no room: "There is no shadow vocabulary, no
 * glass, no backdrop blur, and no orbs — the incumbent build's
 * blurred-orb-and-glass register is an explicit anti-reference", and "Don't
 * introduce glass, backdrop blur (outside the sticky nav), blurred orbs".
 *
 * Round 8 wrote a comment claiming two of them had been DELETED from
 * EditorialLayout.module.css. Only `.heroBg`'s own declaration had been touched;
 * `.heroBgA` and `.heroBgB` kept their full styling and kept rendering on the six
 * pages that shell serves. Round 14 found that and neutralised them. Round 18
 * found `.sectionAlt::before` in THE SAME FILE, one section further down, still
 * painting the same two ellipses, plus six more across four other files.
 *
 * Three times, in eight rounds, on a rule with no gate. A rule enforced by
 * nothing gets re-added, and this file is the proof rather than the assertion.
 *
 * ─────────────────────────── WHAT COUNTS AS AN ORB ───────────────────────────
 *
 * The measurement, not a judgement, and it has to separate the banned technique
 * from the one canon §5 explicitly SANCTIONS. Both are radial gradients, so the
 * test cannot be "radial-gradient".
 *
 *   THE AMBIENT WASH, sanctioned. globals.css `.amb-wash::before`:
 *       radial-gradient(180% 150% at 8% 112%, …)
 *   Sized LARGER than its own box, so it resolves to a broad directional tint
 *   across a whole band. Canon §5: "ambient per-section only, per-branch banned",
 *   "this lives on bands and panel edges".
 *
 *   AN ORB, banned. EditorialLayout `.sectionAlt::before`:
 *       radial-gradient(ellipse 50% 40% at 20% 30%, var(--…), transparent 55%)
 *   An explicit `ellipse` or `circle` keyword, dimensions SMALLER than the box,
 *   positioned at a point, fading to transparent partway. That paints a discrete
 *   soft blob with edges — a shape sitting on the surface, which is exactly the
 *   register being banned, and it is what "looks horrible" means when a reader
 *   reports it.
 *
 * So the signature is: a shape keyword, with at least one sub-100% dimension.
 * `filter: blur()` on a decorative layer is caught too, since a blurred div is
 * the other way to build the same thing. The sticky nav's backdrop-filter is the
 * one blur DESIGN.md permits and is not matched.
 *
 * ────────────────────────────────── SCOPE ───────────────────────────────────
 *
 * Every .css file under src/, discovered rather than listed. A neutralised rule
 * (`display: none`) passes: round 14's fix is a legitimate resolution, and this
 * gate must not demand that a dead rule also be deleted. It reports them so the
 * count of things kept alive only by `display: none` stays visible.
 *
 *   node scripts/check-orbs.mjs
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";

const ROOT = "src";
const files = [];
const walk = (dir) => {
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith(".") || entry === "node_modules") continue;
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p);
    else if (extname(p) === ".css") files.push(p);
  }
};
walk(ROOT);

/**
 * A radial-gradient with a shape keyword and a sub-100% dimension.
 *
 * The dimension test is what keeps two legitimate things out of this.
 *
 * The AMBIENT WASH carries no shape keyword and both its dimensions exceed the
 * box (`180% 150%`), so it is a tint rather than an object.
 *
 * A DOT is sized in px. `radial-gradient(circle at 12.5% 50%, var(--accent-mark)
 * 0 2.5px, transparent 2.5px)` draws the four 2.5px step markers on the flow
 * connector under prefers-reduced-motion — the thing that says where the steps
 * are when the travelling highlight is switched off. The first version of this
 * gate flagged all four, because a circle with no percentage extent read as
 * "unbounded". So an orb must be sized as a PROPORTION of its box: that is what
 * makes it scale with the surface and read as a shape laid over it.
 */
const ORB_GRADIENT = /radial-gradient\(\s*(?:ellipse|circle)\b([^,)]*)/gi;

/** A blurred decorative layer, the other way to build the same shape. */
const DECORATIVE_BLUR = /filter:\s*blur\(\s*([0-9.]+)(px|rem|em)\s*\)/gi;

const failures = [];
const neutralised = [];

for (const file of files) {
  const src = readFileSync(file, "utf8");

  /**
   * Selectors this file hides ANYWHERE, not just in the block being read.
   *
   * `.orbA, .orbB { display: none }` sits seven lines above `.orbA { …
   * radial-gradient … }`, which re-declares the background and never mentions
   * display. The `display: none` still wins, so the orb does not render — but a
   * block-local check calls the second rule live and reports a defect that is not
   * one. Round 18: the first version of this gate did exactly that on four rules
   * across two files, which is how it was caught.
   */
  const hiddenSelectors = new Set();
  for (const h of src.matchAll(/([^{}]*)\{([^{}]*display:\s*none[^{}]*)\}/g)) {
    for (const sel of h[1].split(",")) {
      const cleaned = sel.replace(/\/\*[\s\S]*?\*\//g, "").trim();
      if (cleaned) hiddenSelectors.add(cleaned.split(/\s+/).pop());
    }
  }
  /* Rules as selector + declaration block. Good enough for a stylesheet with no
     nested at-rule bodies carrying gradients, which this one does not have. */
  for (const m of src.matchAll(/([^{}]*)\{([^{}]*)\}/g)) {
    /* Comments out first, then the last selector fragment: `m[1]` runs from the
       previous closing brace, so it carries any comment sitting between rules. */
    const selector = m[1]
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .split(/[\n;]/)
      .filter((x) => x.trim())
      .pop()
      ?.trim()
      .replace(/\s+/g, " ") ?? "(unknown)";
    const decls = m[2];
    const line = src.slice(0, m.index).split("\n").length;

    const hidden =
      /display:\s*none/.test(decls) ||
      selector.split(",").some((sel) => hiddenSelectors.has(sel.trim().split(/\s+/).pop()));
    /* A gradient used as a MASK shapes something else; it paints no colour. */
    const maskOnly =
      /mask-image|mask:/.test(decls) &&
      !/background(?:-image|-color)?:\s*[^;]*radial-gradient/.test(decls);
    if (maskOnly) continue;

    const orbs = [];
    ORB_GRADIENT.lastIndex = 0;
    for (const g of decls.matchAll(ORB_GRADIENT)) {
      const dims = (g[1] ?? "").split(/\bat\b/)[0];
      const numbers = [...dims.matchAll(/([0-9.]+)%/g)].map((d) => Number(d[1]));
      if (numbers.length > 0 && numbers.some((n) => n < 100)) {
        orbs.push(`radial-gradient(${(g[1] ?? "").trim().slice(0, 40)}…)`);
      }
    }
    DECORATIVE_BLUR.lastIndex = 0;
    for (const b of decls.matchAll(DECORATIVE_BLUR)) {
      /* A large blur on a positioned decorative layer is an orb by another
         route. Small blurs are used for legitimate softening elsewhere. */
      if (Number(b[1]) >= 20 && /position:\s*absolute/.test(decls)) {
        orbs.push(`filter: blur(${b[1]}${b[2]})`);
      }
    }
    if (orbs.length === 0) continue;

    const entry = { file, line, selector, orbs };
    if (hidden) neutralised.push(entry);
    else failures.push(entry);
  }
}

if (neutralised.length > 0) {
  console.log(
    `\n${neutralised.length} orb rule(s) alive only through \`display: none\` — reported, not failed:\n`,
  );
  for (const n of neutralised) {
    console.log(`  ${n.file}:${n.line}  ${n.selector}`);
  }
}

if (failures.length > 0) {
  const total = failures.reduce((n, f) => n + f.orbs.length, 0);
  console.error(
    `\ncheck:orbs FAILED — ${total} blurred orb(s) in ${failures.length} rule(s) across ` +
      `${new Set(failures.map((f) => f.file)).size} file(s):\n`,
  );
  for (const f of failures) {
    console.error(`  ${f.file}:${f.line}  ${f.selector}`);
    for (const o of f.orbs) console.error(`      ${o}`);
  }
  console.error(
    "\n  DESIGN.md: \"no orbs — the incumbent build's blurred-orb-and-glass\n" +
      '  register is an explicit anti-reference", and "Don\'t introduce … blurred orbs".\n' +
      "\n  REMOVE them. Round 18 §2.2 forbids reducing the opacity or hiding them\n" +
      "  conditionally, and this is the third time the rule has been re-added.\n" +
      "\n  The sanctioned alternative is the ambient wash: one gradient sized LARGER\n" +
      "  than its box, so it reads as a tint on a band rather than a shape on it.\n" +
      "  See globals.css .amb-wash::before and canon §5.\n",
  );
  process.exit(1);
}

console.log(
  `\ncheck:orbs passed — no blurred orb in ${files.length} stylesheet(s) under ${ROOT}/.\n` +
    `  The ambient wash is unaffected: a gradient sized larger than its own box is\n` +
    "  a band tint, which canon §5 sanctions, and is not what this gate matches.\n",
);
