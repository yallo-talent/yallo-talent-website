#!/usr/bin/env node
/**
 * Guards the canon §7 terminology rules, and can apply them.
 *
 *   node scripts/check-terminology.mjs         # report and exit non-zero on any hit
 *   node scripts/check-terminology.mjs --fix   # apply every mechanical replacement
 *
 * This runs in CI so the sweep cannot silently regress. Terms are banned for
 * commercial reasons, not stylistic ones:
 *
 *   "GCC"          collides with Global Capability Centre, which is what it
 *                  means in Yallo's own India business — and the site cites
 *                  Global Capability Centre data. Ambiguous in the worst place.
 *   "KSA"          not used in public copy; name Saudi Arabia.
 *   "subcontract"  pillar four is Managed Delivery. The white-label-behind-an-SI
 *                  mode is real but is not published.
 *   "Bangalore"    Bengaluru.
 *   "UK · ME · India"  implies three co-equal markets. Middle East leads.
 *
 * Some replacements need judgement and cannot be mechanical; those are listed as
 * MANUAL and reported with their file so a human resolves them once.
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";

const FIX = process.argv.includes("--fix");
const ROOTS = ["src", "content"];
const EXTS = new Set([".ts", ".tsx", ".css", ".mdx", ".yaml", ".yml"]);

/**
 * Mechanical replacements. Ordered: longer, more specific patterns first so a
 * general rule cannot eat a phrase a specific rule handles better.
 */
const RULES = [
  // --- geography framing ---------------------------------------------------
  [/\bUK · ME · India\b/g, "Middle East · Europe · India"],
  [/\bUK, ME and India\b/g, "the Middle East, Europe and India"],
  [/\bUK and ME\b/g, "the Middle East and Europe"],
  [/\bUK · ME\b/g, "Middle East · Europe"],
  [/\bUK, ME,? India\b/g, "Middle East, Europe, India"],
  [/\bacross UK, ME and India\b/g, "across the Middle East, Europe and India"],
  [/\bacross UK, ME, India\b/g, "across the Middle East, Europe and India"],

  // --- Saudi Arabia --------------------------------------------------------
  [/\bRiyadh, KSA\b/g, "Riyadh, Saudi Arabia"],
  [/\bUAE \+ KSA\b/g, "UAE and Saudi Arabia"],
  [/\bUAE and KSA\b/g, "UAE and Saudi Arabia"],
  [/\bUAE or KSA\b/g, "UAE or Saudi Arabia"],
  [/\bUK, UAE, KSA, India\b/g, "the UK, UAE, Saudi Arabia and India"],
  [/\bKSA\b/g, "Saudi Arabia"],

  // --- pillar four ---------------------------------------------------------
  [/Contract · EOR · Subcontract/g, "Contract · EOR · Managed Delivery"],
  [/\bSubcontracting\b/g, "Managed Delivery"],
  [/\bsubcontracting\b/g, "managed delivery"],
  [/\bSubcontract\b/g, "Managed Delivery"],
  [/\bsubcontracted\b/g, "delivered under Managed Delivery"],

  // --- other ---------------------------------------------------------------
  [/\bBangalore\b/g, "Bengaluru"],
  [/Launching soon/g, "Live at saasinator.ai"],
  [/\bJob seekers\b/g, "Jobs"],
];

/**
 * "GCC" is the one term that cannot be swept mechanically: in some places it
 * means the Gulf (replace with Middle East) and in others it genuinely means
 * Global Capability Centre (expand it). Each occurrence is resolved explicitly.
 */
const GCC_RESOLUTIONS = [
  [
    "GCC stand-up capability",
    "Global Capability Centre stand-up capability",
    "means Global Capability Centre here — the India delivery-centre motion",
  ],
  [
    "GCC engineering-centre stand-up",
    "Global Capability Centre stand-up",
    "means Global Capability Centre here",
  ],
  ["GCC enterprises", "Middle East enterprises", "means the Gulf"],
  ["the GCC's biggest enterprises", "the region's biggest enterprises", "means the Gulf"],
  ["GCC bank", "Middle East bank", "means the Gulf"],
  ["GCC engineering centre", "Global Capability Centre", "means Global Capability Centre"],
  ["across the GCC", "across the Middle East", "means the Gulf"],
  ["in the GCC", "in the Middle East", "means the Gulf"],
];

/**
 * Banned abstractions, ratified in Chat Relay v2.0 §3.2. These are banned
 * "wherever they appear as filler" — which is why every one of them needs the
 * occurrence-by-occurrence method below rather than a blind replace.
 *
 * SCOPE: src/ only, ruled in Relay v2.2 §2. content/ bodies are ported verbatim
 * and the whole legacy insight family is out of scope for this build.
 *
 * NOT banned, and deliberately absent from this list: phase, gate, go-live,
 * cutover, mobilisation, hypercare, brief, shortlist. That is the buyer's own
 * working vocabulary — a programme director says "we are at the design gate"
 * every week, and removing it would make the site sound like an outsider.
 *
 * "shape" as a verb is banned by the relay but is not mechanically detectable
 * without false positives ("team shape", "the shape of the programme"), so it is
 * left to review rather than guessed at here.
 */
const ABSTRACTIONS = [
  "hold the risk",
  "pipeline to insight",
  "delivery cadence",
  "where the process lives",
  "run and reliability",
  "seamless",
  "robust",
  "unlock",
  "leverage",
  "journey",
  "landscape",
  "tailored",
  "best-in-class",
  "world-class",
  "cutting-edge",
  "empower",
  "streamline",
  "holistic",
  "ecosystem",
];

/**
 * Occurrences where a banned abstraction is load-bearing rather than filler.
 * This is the same problem as "GCC", and Relay v2.2 §1 ratified this
 * occurrence-by-occurrence method as the standing pattern for every banned-terms
 * sweep: a mechanical sweep here would rename a Salesforce product and rewrite
 * SAP's own vocabulary.
 *
 * Each entry needs a reason. An entry without one is drift.
 */
const ABSTRACTION_ALLOWED = [
  ["Journey Builder", "Salesforce Marketing Cloud product name — not ours to rename"],
  ["Digital Journey Consultant", "a real role name Yallo places"],
  ["SAP landscape", "SAP's own word for a system environment"],
  ["SAP landscapes", "SAP's own word for a system environment"],
  ["shopper journey", "standard retail CX vocabulary, and the buyer's own"],
  ["Brand-to-basket journeys", "standard retail vocabulary for the channel path"],
  ["segmentation, journeys and cross-channel", "standard CRM/CDP vocabulary"],
  ["highest-leverage function", "specific and measurable, not filler"],
  ["intelligent ecosystems", "part of a real published article title — a title is a fact"],
  ["tailored to your specific situation", "legal wording on the terms page"],
  ["platform ecosystem", "the one literal use of 'ecosystem' canon permits"],
];

/**
 * Lines that legitimately contain a banned term: the rules that document the
 * ban, and this file. Matched as substrings of the line.
 */
const ALLOWED_LINES = [
  "Never the word",
  "never appears in",
  "never appear in public copy",
  "canon §7",
  "banned",
  "GCC_RESOLUTIONS",
  "collides with Global Capability Centre",
  "check-terminology",
  "means Global Capability Centre",
  "means the Gulf",
  "ABSTRACTIONS",
  "ABSTRACTION_ALLOWED",
  "not ours to rename",
  "own word for a system environment",
  "not filler",
  "a title is a fact",
  "legal wording on the terms page",
  "canon permits",
  "the buyer's own",
  "vocabulary for the channel path",
  "CRM/CDP vocabulary",
  "a real role name Yallo places",
];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name.startsWith(".")) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (EXTS.has(extname(p))) out.push(p);
  }
  return out;
}

const files = ROOTS.flatMap((r) => walk(r));
const applied = [];
const remaining = [];

for (const file of files) {
  const before = readFileSync(file, "utf8");

  // Line by line, and skip protected lines BEFORE replacing rather than
  // auditing afterwards. Getting this the wrong way round rewrote the very
  // comment that documents the ban into nonsense.
  const after = before
    .split("\n")
    .map((line) => {
      if (ALLOWED_LINES.some((a) => line.includes(a))) return line;
      let out = line;
      for (const [from, to, why] of GCC_RESOLUTIONS) {
        if (out.includes(from)) {
          applied.push({ file, change: `"${from}" -> "${to}"`, why });
          out = out.split(from).join(to);
        }
      }
      for (const [re, to] of RULES) {
        out = out.replace(re, (m) => {
          applied.push({ file, change: `"${m}" -> "${to}"` });
          return to;
        });
      }
      return out;
    })
    .join("\n");

  if (FIX && after !== before) writeFileSync(file, after);

  // Report anything still outstanding, ignoring lines that document the ban.
  const source = FIX ? after : before;
  source.split("\n").forEach((line, i) => {
    if (ALLOWED_LINES.some((a) => line.includes(a))) return;
    for (const [term, label] of [
      [/\bGCC\b/, "GCC"],
      [/\bKSA\b/, "KSA"],
      [/\bsubcontract/i, "subcontract"],
      [/\bBangalore\b/, "Bangalore"],
      [/UK · ME/, "UK · ME"],
    ]) {
      if (term.test(line)) {
        remaining.push({ file, line: i + 1, label, text: line.trim().slice(0, 100) });
      }
    }

    // Banned abstractions, src/ only. Allow-listed occurrences are removed from
    // the line before matching, so a permitted phrase cannot mask a real hit
    // elsewhere on the same line.
    if (!file.startsWith("src/")) return;
    let scrubbed = line;
    for (const [phrase] of ABSTRACTION_ALLOWED) {
      // Case-insensitive: the same phrase appears sentence-cased in a blurb and
      // lower-cased mid-sentence, and both are the same permitted occurrence.
      scrubbed = scrubbed.replace(
        new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"),
        "",
      );
    }
    for (const abstraction of ABSTRACTIONS) {
      if (new RegExp(`\\b${abstraction}`, "i").test(scrubbed)) {
        remaining.push({
          file,
          line: i + 1,
          label: `abstraction: ${abstraction}`,
          text: line.trim().slice(0, 100),
        });
      }
    }
  });
}

if (applied.length) {
  console.log(`${FIX ? "Applied" : "Would apply"} ${applied.length} replacement(s):\n`);
  const byFile = new Map();
  for (const a of applied) {
    if (!byFile.has(a.file)) byFile.set(a.file, []);
    byFile.get(a.file).push(a);
  }
  for (const [file, items] of byFile) {
    console.log(`  ${file}`);
    for (const it of items) {
      console.log(`      ${it.change}${it.why ? `   (${it.why})` : ""}`);
    }
  }
}

if (remaining.length) {
  console.error(`\n${remaining.length} occurrence(s) need a human decision:\n`);
  for (const r of remaining) {
    console.error(`  ${r.file}:${r.line}  [${r.label}]  ${r.text}`);
  }
  process.exit(1);
}

console.log(
  applied.length
    ? `\nNo banned terminology remains in ${files.length} files.`
    : `No banned terminology in ${files.length} files.`,
);
