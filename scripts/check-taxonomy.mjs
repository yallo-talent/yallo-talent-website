/**
 * check-taxonomy — stops one taxonomy's names resolving into another's.
 *
 * WHY THIS EXISTS. Canon §3 runs two taxonomies that share labels: the specialist
 * DESKS and the cross-cutting DISCIPLINES both contain a "Data & Analytics" and a
 * "Cloud & Infrastructure". Relay v6.0 renamed the desk from Data & Analytics to
 * Data & AI, the rename was applied by string match rather than by taxonomy, and it
 * took the DISCIPLINE with it. The Data & Analytics capability page then rendered as
 * "Data & AI" thirteen times, including in its own <title>.
 *
 * A string edit would have fixed that instance. This is the class: any surface that
 * keeps its own copy of taxonomy labels will drift from the taxonomy, because
 * renaming the source of truth does not rename a copy. So the rules below assert
 * that (1) desk names do not appear in discipline data, and (2) nothing outside the
 * index re-declares a label map.
 *
 * It also carries the retirement-orphan and Yallo-capitalisation rules from the same
 * review, both of which are the same shape of fault: a string that outlived the
 * thing it described.
 *
 * Static only, so it runs in the pre-commit hook. The rendered half of the Yallo
 * rule needs a browser and lives in check-yallo-case.mjs, because the capital
 * letters are produced by text-transform and no grep can see them.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const failures = [];
const notes = [];

/* ---------------------------------------------------------------------------
   Rule 1. Desk names must not resolve into the discipline taxonomy.

   "Data & AI" is the ratified DESK name and is correct on the platform side and on
   the homepage product-family chips. It is wrong as a discipline label. The
   discipline taxonomy is capabilitiesIndex plus the files under
   src/data/capabilities, so those are the only places checked.
   --------------------------------------------------------------------------- */
const DESK_ONLY_NAMES = [
  ["Data & AI", "the specialist desk; the discipline is Data & Analytics"],
  ["Digital & DevOps", "a retired desk name; the discipline is DevOps & Platform Engineering"],
  ["Emerging Technologies", "a retired discipline (canon §3); its slug 301s to /ai-talent"],
  ["Emerging Tech", "same retirement"],
];

/* Strings orphaned by the emerging-technologies retirement. D1: this description
   was still attached to Testing & Quality Engineering, so that desk advertised
   blockchain and quantum talent.
 *
 * NARROW ON PURPOSE, and the first draft of this rule proves why. It banned
 * "digital twin" as a bare substring and immediately failed on
 * "Digital Twin for Cities Consultant" in government.ts and the "Digital Twin &
 * IIoT" sub-desk in manufacturing.ts — both real, both published, neither an
 * orphan. A digital twin is genuine manufacturing and smart-city vocabulary; what
 * was retired is the specific TAGLINE. So the rule matches the phrase, and
 * "quantum-adjacent" survives as a standalone term because nothing else in the
 * repo has any reason to say it. This is the same occurrence-by-occurrence
 * discipline check-terminology.mjs already applies to banned abstractions, for the
 * same reason: a mechanical sweep renames real things. */
const RETIRED_STRINGS = [
  ["quantum-adjacent", "the retired emerging-technologies description"],
  [
    "digital twin and quantum",
    "the retired emerging-technologies tagline, verbatim",
  ],
  [
    "Blockchain, IoT",
    "the opening of the retired emerging-technologies tagline",
  ],
];

/** Files whose job is to document these rules, so they may name them. */
const RULE_FILES = [
  "scripts/check-taxonomy.mjs",
  "scripts/check-terminology.mjs",
  "docs/",
];

/** A line that is a comment is documentation, not rendered copy. */
function isComment(line) {
  const t = line.trim();
  return (
    t.startsWith("{/*") ||
    t.startsWith("//") ||
    t.startsWith("*") ||
    t.startsWith("/*") ||
    t.startsWith("/**")
  );
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry.startsWith(".next")) continue;
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|tsx|mjs|css)$/.test(entry)) out.push(p);
  }
  return out;
}

const allFiles = walk("src");

/* The discipline surfaces: capability data, the capability routes, and the
   taxonomy index itself. */
const disciplineFiles = allFiles.filter(
  (f) =>
    f.startsWith("src/data/capabilities/") ||
    f.startsWith("src/app/capabilities/") ||
    f === join("src", "data", "l1", "index.ts"),
);

for (const file of disciplineFiles) {
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    if (isComment(line)) return;
    for (const [name, why] of DESK_ONLY_NAMES) {
      if (line.includes(name)) {
        failures.push(
          `${file}:${i + 1}  "${name}" is ${why}.\n      ${line.trim().slice(0, 100)}`,
        );
      }
    }
  });
}

/* Retired strings: banned everywhere in src, not only in the discipline files. */
for (const file of allFiles) {
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    if (isComment(line)) return;
    for (const [s, why] of RETIRED_STRINGS) {
      if (line.toLowerCase().includes(s)) {
        failures.push(`${file}:${i + 1}  "${s}" is ${why}.`);
      }
    }
  });
}

/* ---------------------------------------------------------------------------
   Rule 2. Only the index may declare a taxonomy label map.

   L2PageShell held `platformLabels` and `capabilityLabels`, and the second carried
   both of the wrong strings above. `taxonomyLabels()` in src/data/l1/index.ts is
   the source of truth and covers all three families.
   --------------------------------------------------------------------------- */
const LABEL_MAP_SHAPE =
  /const\s+(platformLabels|capabilityLabels|industryLabels|sectorLabels|disciplineLabels)\s*[:=]/;

for (const file of allFiles) {
  if (file === join("src", "data", "l1", "index.ts")) continue;
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    if (isComment(line)) return;
    const m = LABEL_MAP_SHAPE.exec(line);
    if (m) {
      failures.push(
        `${file}:${i + 1}  re-declares a taxonomy label map (${m[1]}).\n` +
          `      Use taxonomyLabels() from @/data/l1/index — a copy of the taxonomy always drifts from it.`,
      );
    }
  });
}

/* ---------------------------------------------------------------------------
   Rule 2b. Navigation and menu files must not hardcode capability routes.

   The third copy, and the one that actually reached Sumeet. The nav mega panel
   held the whole discipline taxonomy by hand — seven labels and seven
   `published` flags — so seeding the four planned desks updated the hub and left
   the menu marking four live pages "Desk in build", under the retired label
   "Artificial Intelligence". Rule 2 did not catch it because a nav column is an
   inline array, not a `const xLabels =` map, which is exactly the kind of gap
   that lets the same fault return in a new shape.

   The Capabilities column is now derived from `capabilityNavEntries`. This keeps
   it that way.
   --------------------------------------------------------------------------- */
const NAV_FILES = allFiles.filter((f) => /nav|menu|header/i.test(f));
for (const file of NAV_FILES) {
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    if (isComment(line)) return;
    if (/["'`]\/capabilities\/[a-z-]+["'`]/.test(line)) {
      failures.push(
        `${file}:${i + 1}  hardcodes a capability route in a navigation file.\n` +
          `      Derive the column from capabilityNavEntries(capabilitiesIndex) instead — a hand-written\n` +
          `      copy of the taxonomy is what left the menu advertising "Desk in build" on live pages.\n` +
          `      ${line.trim().slice(0, 90)}`,
      );
    }
  });
}
notes.push(`${NAV_FILES.length} nav file(s) free of hardcoded capability routes.`);

/* ---------------------------------------------------------------------------
   Rule 3. "Yallo" is never set in capitals (canon §2).

   Static half: the literal string, which is how it reaches alt text, aria-labels,
   page titles and metadata. The rendered half is text-transform and needs a
   browser; see check-yallo-case.mjs. Scope is the word Yallo only — the ratified
   logo lockup's "TALENT" is unaffected, and so is any other uppercase word.
   --------------------------------------------------------------------------- */
for (const file of allFiles) {
  if (RULE_FILES.some((r) => file.startsWith(r))) continue;
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    if (isComment(line)) return;
    if (/\bYALLO\b/.test(line)) {
      failures.push(
        `${file}:${i + 1}  "YALLO" in capitals. Canon §2: capital Y only.\n      ${line.trim().slice(0, 100)}`,
      );
    }
  });
}

/* ---------------------------------------------------------------------------
   Rule 4. Every discipline in the index has a route or is declared planned.

   The capabilities hub derives its heading count from the index, so an entry with
   neither a page nor a planned marker would be counted in the heading and then
   render as nothing.
   --------------------------------------------------------------------------- */
const indexSrc = readFileSync(join("src", "data", "l1", "index.ts"), "utf8");
const capBlock = indexSrc.slice(
  indexSrc.indexOf("export const capabilitiesIndex"),
);
const indexSlugs = [...capBlock.matchAll(/slug:\s*"([a-z-]+)"/g)].map(
  (m) => m[1],
);
const registrySrc = readFileSync(
  join("src", "data", "capabilities", "index.ts"),
  "utf8",
);
const registryBlock = registrySrc.slice(
  registrySrc.indexOf("capabilityRegistry"),
  registrySrc.indexOf("PLANNED_CAPABILITIES"),
);
const plannedBlock = registrySrc.slice(
  registrySrc.indexOf("PLANNED_CAPABILITIES"),
);

for (const slug of indexSlugs) {
  const registered =
    registryBlock.includes(`"${slug}"`) ||
    new RegExp(`\\b${slug.replace(/-/g, "")}\\b`).test(registryBlock) ||
    registryBlock.includes(`${slug}:`);
  const planned = plannedBlock.includes(`"${slug}"`);
  const hasOwnRoute = capBlock.includes(`href: "/${slug}"`);
  if (!registered && !planned && !hasOwnRoute) {
    failures.push(
      `src/data/l1/index.ts  discipline "${slug}" has no page, no explicit href and is not in PLANNED_CAPABILITIES.\n` +
        `      The hub counts it in its heading, so it would be advertised and render nothing.`,
    );
  }
}
notes.push(`${indexSlugs.length} disciplines in the index, all resolvable.`);

/* --------------------------------------------------------------------------- */
if (failures.length > 0) {
  console.error(`\ncheck-taxonomy FAILED with ${failures.length} problem(s):\n`);
  for (const f of failures) console.error(`  ${f}\n`);
  process.exit(1);
}

console.log(
  `Taxonomy clean across ${allFiles.length} files. ${notes.join(" ")}`,
);
