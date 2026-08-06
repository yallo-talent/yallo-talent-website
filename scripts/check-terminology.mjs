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

  // --- A1: the screening claim is specialist-led, not architect-led --------
  // Canon amendment A1 (30 Jul). The claim is about depth, not one job title,
  // and "architect-led" narrowed it to a single grade while the six desks in §3
  // span far more. Deliberately narrow patterns: these match the CLAIM only.
  // Real job titles ("Solution Architect · SAP"), the Architecture desk, the
  // "Architects" role family in roles.ts, and "architecture" describing a system
  // are genuine collisions and must never be rewritten — see ARCHITECT_ALLOWED.
  [/\barchitect-screened\b/g, "specialist-screened"],
  [/\bArchitect-screened\b/g, "Specialist-screened"],
  [/\barchitect-led\b/g, "specialist-led"],
  [/\bArchitect-led\b/g, "Specialist-led"],
  [/\barchitect-vetted\b/g, "specialist-vetted"],
  [/\bArchitect-vetted\b/g, "Specialist-vetted"],
  [/\barchitect-tier\b/g, "specialist-tier"],
  [/\barchitect team\b/g, "specialist team"],
  [/\bArchitect team\b/g, "Specialist team"],

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
  [
    "technology-landscape",
    "substring of a real case-study URL slug (the Alshaya multi-vendor consolidation study) — a route, not prose, and not renamable to satisfy this lint",
  ],
];

/**
 * The 72-hour claim. Canon §6 publishes exactly one: brief to SHORTLIST,
 * defined as three screened candidates from a complete brief. It does not
 * publish 72 hours to a contractor on the programme, and the two are not the
 * same promise — deployment runs through calibration, interview, offer,
 * notice, visa and onboarding, which canon §7 itself puts at two to four
 * weeks. The published one is what a buyer holds us to.
 *
 * `L2PageShell` hardcoded the deployed variant into the L2 hero, so the
 * over-claim was live on every L2 on the site while roughly ninety other
 * occurrences said shortlisted correctly. That is why this is a lint and not a
 * one-off fix: the phrase is everywhere, and one wrong verb among ninety right
 * ones is invisible to review.
 *
 * Do not add a failing phrase to ALLOWED_LINES to quiet this file's own
 * comments. That was tried while writing it and the exemption matched the real
 * JSX line too, because the comment and the defect were the same string. The
 * comments here are worded to avoid the construction instead.
 *
 * Detection is the CONSTRUCTION, not the phrase. A delivery verb that lands a
 * person somewhere, within the same sentence as a 72-hour figure, with no
 * mention of a shortlist to qualify it. Sentence scope matters: "a specialist
 * is placed without regulated-industry screening. Yallo's shortlist is in your
 * inbox in 72h" carries both a verb and a figure and is correct, because they
 * are in different sentences. So does "a shortlist calibrated to your
 * programme, inside 72 hours", which the shortlist exemption clears.
 */
const CLAIM_DELIVERY_VERB =
  /\b(deployed|deploys?|placed?|places|delivered|onboarded|mobilised|started|starts|hired|working|in post|on ?-?site|on your [a-z ]{0,20}(programme|project|team|desk))\b/i;
const CLAIM_FIGURE = /\b(in|inside|within|to)\s*72\s*-?\s*(h\b|hours?\b)/i;
const CLAIM_QUALIFIED = /shortlist/i;

/**
 * Sentence split for the claim check. Splits on full stops, and on the middot
 * and em dash the copy uses as sentence-equivalent separators in eyebrows and
 * SEO titles.
 */
function sentences(line) {
  return line.split(/[.!?·—]|\|/);
}

/**
 * Occurrences where the construction is correct despite matching. Each needs a
 * reason, same discipline as ABSTRACTION_ALLOWED.
 */
const CLAIM_ALLOWED = [
  [
    "2–4 weeks to onboard",
    "canon §7's real onboarding term, which is the claim this lint protects",
  ],
];

/**
 * The scarcity work's own licence position (Blueprint v2, 2 Aug 2026): rank,
 * do not republish. No LinkedIn Talent Insights attribution, pool size or
 * percentage reaches these files — see
 * docs/design/context-programme-staffing-blueprint-v2.md §1 and §5. Scoped to
 * the files this exercise actually touches rather than the whole site,
 * because "LinkedIn" is a legitimate word elsewhere (a candidate's own
 * LinkedIn URL on the CV upload form) and a blind sitewide ban would flag it.
 */
const SCARCITY_SCOPE_FILES = new Set(["src/data/l1/types.ts"]);
const SCARCITY_SCOPE_DIRS = [
  "src/data/blueprint/",
  "src/data/platforms/",
  "src/data/capabilities/",
  "src/data/ai-talent/",
];
function inScarcityScope(file) {
  return SCARCITY_SCOPE_FILES.has(file) || SCARCITY_SCOPE_DIRS.some((d) => file.startsWith(d));
}

const SCARCITY_BANNED_TERMS = [/linkedin/i, /talent insights/i];

/**
 * Platform and role names this scarcity exercise ranks. Deliberately the
 * exact vocabulary the evidence file's tables use — SAP/Oracle/Salesforce
 * roles, the hyperscalers, and the two named data-platform products — not a
 * generic word list, because "Security" or "Integration" bare would trip on
 * ordinary copy across the whole site. A percentage beside one of these,
 * inside the files this rule scopes to, is exactly the citable-figure defect
 * the licence position exists to stop.
 */
const SCARCITY_ROLE_TOKENS = [
  "SAP",
  "Oracle",
  "Salesforce",
  "GCP",
  "Azure",
  "AWS",
  "Snowflake",
  "Databricks",
  "Workday",
  "Blue Yonder",
  "DevOps",
  "Security",
  "Integration",
  "Payroll",
  "Financials",
  "Fusion",
  "DX",
  "Commerce Cloud",
  "Service Cloud",
  "Marketing Cloud",
  "Data migration",
  "E-Business Suite",
  "Bedrock",
  "Vertex AI",
  "Azure AI Foundry",
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
  "CLAIM_DELIVERY_VERB",
  "CLAIM_ALLOWED",
  "the claim this lint protects",
  /* system-prompt.ts's own forbidden-vocabulary instruction to the model
     names every banned term to tell it never to write one — the model-
     facing analogue of this file's own docstring, which is exempt the
     same way by sitting outside ROOTS. */
  'never write "GCC" to mean the Gulf',
  'never "KSA" (write Saudi Arabia)',
  "the pillar is Managed Delivery",
  'never "UK · ME · India" framing',
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

    // The 72-hour claim. Sentence-scoped, because a delivery verb and a
    // 72-hour figure in two different sentences on one line is not a claim.
    for (const s of sentences(line)) {
      if (!CLAIM_FIGURE.test(s)) continue;
      if (CLAIM_QUALIFIED.test(s)) continue;
      if (!CLAIM_DELIVERY_VERB.test(s)) continue;
      if (CLAIM_ALLOWED.some(([phrase]) => s.includes(phrase))) continue;
      remaining.push({
        file,
        line: i + 1,
        label: "72h over-claim: canon §6 publishes 72 hours to shortlist",
        text: s.trim().slice(0, 100),
      });
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

    // Blueprint v2 scarcity licence position, scoped to the files this
    // exercise touches — see SCARCITY_SCOPE_DIRS above.
    if (inScarcityScope(file)) {
      for (const re of SCARCITY_BANNED_TERMS) {
        if (re.test(line)) {
          remaining.push({
            file,
            line: i + 1,
            label: `scarcity licence: ${re.source} — rank, do not republish`,
            text: line.trim().slice(0, 100),
          });
        }
      }
      if (line.includes("%")) {
        const hit = SCARCITY_ROLE_TOKENS.find((t) =>
          new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(line),
        );
        if (hit) {
          remaining.push({
            file,
            line: i + 1,
            label: `scarcity licence: percentage beside "${hit}" — ordinal band only, no figure`,
            text: line.trim().slice(0, 100),
          });
        }
      }
    }
  });
}

/* ─────────────────────── COPY-SCOPED RULES, round 18 ─────────────────────── */

/**
 * The banned-vocabulary rules that apply to COPY rather than to source.
 *
 * WHY A SECOND MECHANISM AND NOT MORE ENTRIES IN `RULES`. Round 18 §2.1 found
 * "operator" rendering in an H2 and em dashes in three more lines on /why-yallo
 * while this gate reported exit 0 across 282 files. The diagnosis was not a
 * coverage gap — the file was being read — it was that neither rule existed here
 * at all, and that the two cannot be enforced the way the existing rules are.
 *
 * Everything above scans RAW SOURCE LINES, which is correct for "GCC" and
 * "Bangalore": a wrong geography in a comment is still wrong, and the prose
 * ALLOWED_LINES list exists to keep this file's own documentation from tripping
 * it. An em dash in a comment is not a defect. Measured at the time this was
 * written: 1384 em dashes in the trees this gate reads, 271 of them in copy. A
 * source-level ban would have meant rewriting a thousand comments, and the
 * pressure to then narrow the rule until the run looked small is exactly what
 * §2.1 forbids. Scoping to copy is not narrowing the rule. A comment was never
 * copy.
 *
 * The rules themselves live in src/lib/copy-rules.json, with the provenance of
 * each recorded beside it, so the list and the enforcement cannot disagree and a
 * later round can see where a rule came from.
 *
 * REPORT ONLY, never --fix. An em dash resolves to a comma, a colon, a full stop
 * or a restructured sentence depending on the clause, and "operator" resolves to
 * a specialist formulation that has to say something true. Both need a writer.
 */
const COPY_RULES_PATH = "src/lib/copy-rules.json";
const copyRuleFile = JSON.parse(
  readFileSync(new URL(`../${COPY_RULES_PATH}`, import.meta.url), "utf8"),
);

const COPY_RULES = copyRuleFile.copyRules.map((r) => ({
  ...r,
  re:
    r.kind === "regex"
      ? new RegExp(r.pattern, "gi")
      : new RegExp(r.pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
}));

/** file -> Set of rule ids permitted there, each with a recorded reason. */
const COPY_ALLOW = new Map();
for (const a of copyRuleFile.allow) {
  if (!COPY_ALLOW.has(a.file)) COPY_ALLOW.set(a.file, new Set());
  COPY_ALLOW.get(a.file).add(a.id);
}

/**
 * Comments out, string contents intact, LINE STRUCTURE PRESERVED.
 *
 * Every removed character becomes a space and every newline survives, so a hit's
 * line number is the line number in the real file. A naive strip that collapsed
 * the file would have reported the right defect at the wrong place, which is
 * worse than not reporting it — it sends the reader to unrelated code.
 */
function stripComments(src) {
  let out = "";
  let i = 0;
  const n = src.length;
  let quote = "";
  while (i < n) {
    const ch = src[i];
    const nx = src[i + 1];
    if (quote === "") {
      if (ch === "/" && nx === "/") {
        while (i < n && src[i] !== "\n") {
          out += " ";
          i++;
        }
        continue;
      }
      if (ch === "/" && nx === "*") {
        out += "  ";
        i += 2;
        while (i < n && !(src[i] === "*" && src[i + 1] === "/")) {
          out += src[i] === "\n" ? "\n" : " ";
          i++;
        }
        out += "  ";
        i += 2;
        continue;
      }
      if (ch === '"' || ch === "'" || ch === "`") {
        quote = ch;
        out += ch;
        i++;
        continue;
      }
      out += ch;
      i++;
      continue;
    }
    if (ch === "\\") {
      out += ch + (src[i + 1] ?? "");
      i += 2;
      continue;
    }
    if (ch === quote) {
      quote = "";
      out += ch;
      i++;
      continue;
    }
    out += ch;
    i++;
  }
  return out;
}

/**
 * The segments of a line that can reach a rendered page.
 *
 * For TS and TSX that is string and template literal CONTENTS plus JSX text
 * nodes — the two ways a character gets from this repository onto a page. For
 * MDX and YAML the line is copy already, minus its own comment syntax. CSS is
 * excluded entirely: it carries no prose except `content:`, and every `content:`
 * in this codebase is a decorative glyph.
 */
/**
 * A DIAGNOSTIC IS NOT COPY, and this is the one exclusion about the KIND of
 * string rather than the kind of file.
 *
 * `src/instrumentation.ts` prints a startup banner to a developer's terminal and
 * `throw new Error("ANTHROPIC_API_KEY is not set …")` is read by whoever broke
 * the deployment. Neither reaches a visitor, and rewriting them to satisfy a
 * house-style rule about prose would make the diagnostics worse at the only job
 * they have. Detected from the code PRECEDING the string rather than per file: a
 * file that logs is usually also a file that renders, so excluding the whole file
 * would hide real copy inside it.
 *
 * The window is generous because these calls wrap across lines — the four
 * instrumentation.ts hits that survived the first version of this were arguments
 * to a `line(...)` helper four lines below a `console.warn`.
 */
const DIAGNOSTIC_CALL = /(?:console\.\w+|new \w*Error)\s*\([^)]{0,400}$/;

/**
 * Every span of a comment-stripped file that can reach a rendered page, with the
 * offset it starts at.
 *
 * WHOLE FILE, NOT LINE BY LINE, and that is the fix for the defect this round
 * opened with. The first version scanned each line and matched JSX text with
 * `>text<`, which requires the tag and the text on ONE line. The H2 that started
 * round 18 —
 *
 *     <h2 className={styles.sectionH}>
 *       Operators who ran the programmes you're running.
 *     </h2>
 *
 * — puts the text on its own line, so the gate written to catch it did not.
 * Template literals and wrapped diagnostic calls span lines for the same reason.
 * Offsets are mapped back to line numbers afterwards, so a hit still points at
 * the real line.
 */
function copySpans(file, body) {
  const ext = extname(file);
  if (ext === ".mdx" || ext === ".yaml" || ext === ".yml") {
    const spans = [];
    let offset = 0;
    for (const line of body.split("\n")) {
      const comment = ext === ".mdx" ? "<!--" : "#";
      if (!line.trimStart().startsWith(comment)) {
        spans.push({ text: line, at: offset });
      }
      offset += line.length + 1;
    }
    return spans;
  }
  if (ext !== ".ts" && ext !== ".tsx") return [];

  const spans = [];
  /* String and template literal contents. `s` flag so a template literal that
     wraps is one span rather than a series of unparseable fragments. */
  for (const m of body.matchAll(
    /"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'|`((?:[^`\\]|\\.)*)`/g,
  )) {
    const text = m[1] ?? m[2] ?? m[3] ?? "";
    if (text === "") continue;
    if (DIAGNOSTIC_CALL.test(body.slice(Math.max(0, m.index - 400), m.index))) {
      continue;
    }
    spans.push({ text, at: m.index });
  }
  /* JSX text nodes, across lines. Braces excluded so an expression is not read as
     prose; the literal inside it is caught by the pass above. */
  for (const m of body.matchAll(/>([^<>{}]+)</g)) {
    if (m[1].trim() === "") continue;
    /* Past the leading whitespace, so the reported line is the line the TEXT is
       on rather than the line the opening tag is on. JSX puts them one apart. */
    const lead = m[1].length - m[1].trimStart().length;
    spans.push({ text: m[1], at: m.index + 1 + lead });
  }
  return spans;
}

const OUT_OF_SCOPE_DIRS = copyRuleFile.outOfScope.dirs;
const informational = [];

for (const file of files) {
  const ext = extname(file);
  if (ext === ".css") continue;
  const raw = readFileSync(file, "utf8");
  const body = ext === ".ts" || ext === ".tsx" ? stripComments(raw) : raw;

  /* offset -> line number, built once per file. */
  const lineStarts = [0];
  for (let i = 0; i < body.length; i++) {
    if (body[i] === "\n") lineStarts.push(i + 1);
  }
  const lineAt = (offset) => {
    let lo = 0;
    let hi = lineStarts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (lineStarts[mid] <= offset) lo = mid;
      else hi = mid - 1;
    }
    return lo + 1;
  };

  const allowed = COPY_ALLOW.get(file) ?? new Set();
  const outOfScope = OUT_OF_SCOPE_DIRS.some((d) => file.startsWith(d));

  for (const span of copySpans(file, body)) {
    for (const rule of COPY_RULES) {
      if (allowed.has(rule.id)) continue;
      rule.re.lastIndex = 0;
      if (!rule.re.test(span.text)) continue;
      const hit = {
        file,
        line: lineAt(span.at),
        label: `copy: ${rule.label}`,
        text: span.text.replace(/\s+/g, " ").trim().slice(0, 100),
      };
      if (outOfScope) informational.push(hit);
      else remaining.push(hit);
    }
  }
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

if (informational.length) {
  console.log(
    `\n${informational.length} copy-rule occurrence(s) in ${OUT_OF_SCOPE_DIRS.join(", ")} — REPORTED, NOT FAILED:\n` +
      `  ${copyRuleFile.outOfScope.why.join("\n  ")}\n`,
  );
  const byFile = new Map();
  for (const h of informational) byFile.set(h.file, (byFile.get(h.file) ?? 0) + 1);
  for (const [f, n] of [...byFile].sort((a, b) => b[1] - a[1])) {
    console.log(`     ${String(n).padStart(3)}  ${f}`);
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
