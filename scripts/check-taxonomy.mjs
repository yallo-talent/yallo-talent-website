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
   Rule 2c. A cross-link to a discipline must carry that discipline's label.

   The fifth copy. Cross-link entries are written as an href beside a hand-typed
   label, in `related` arrays and in chip rails, so renaming a discipline in the
   index leaves every one of them saying the old name. Renaming Cybersecurity to
   "Cybersecurity & Risk" found seven: four sector pages, one capability page, the
   platform narrative bands and a hardcoded rail in HubLandingSections.

   This checks the pairing rather than any particular name, so it holds for the
   next rename too.

   NORMALISED, and narrow on purpose for the second time in this file. The first
   draft demanded an exact string match and immediately flagged ten chips in the
   platform narrative bands, which are written in sentence case with "and" rather
   than title case with an ampersand: "Integration and middleware", "AI talent".
   That is a consistent house style in a rail of prose-adjacent chips, not drift,
   and a lint that forces one session's copy style onto another's is overreach.

   So the comparison ignores case, ampersands and spacing, and asserts only the
   thing that is a defect under any style: that the label names the SAME
   DISCIPLINE the href points at. It still catches the real fault it was written
   for, a link to data-analytics labelled "Data and AI", which is the retired desk
   name resolving into the discipline taxonomy all over again. */
const normalise = (s) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]/g, "");
/* --------------------------------------------------------------------------- */
const indexLabelBySlug = new Map();
{
  const block = readFileSync(join("src", "data", "l1", "index.ts"), "utf8");
  const cap = block.slice(block.indexOf("export const capabilitiesIndex"));
  const re = /slug:\s*"([a-z-]+)"[\s\S]{0,400}?label:\s*"([^"]+)"/g;
  let m = re.exec(cap);
  while (m) {
    if (!indexLabelBySlug.has(m[1])) indexLabelBySlug.set(m[1], m[2]);
    m = re.exec(cap);
  }
}

for (const file of allFiles) {
  if (file.startsWith("scripts")) continue;
  const src = readFileSync(file, "utf8");
  const re =
    /href:\s*[`"]\/capabilities\/([a-z-]+)[`"],\s*\n\s*label:\s*"([^"]+)"/g;
  let m = re.exec(src);
  while (m) {
    const expected = indexLabelBySlug.get(m[1]);
    if (expected && normalise(m[2]) !== normalise(expected)) {
      const line = src.slice(0, m.index).split("\n").length;
      failures.push(
        `${file}:${line}  cross-link to "${m[1]}" names "${m[2]}" but the href points at "${expected}".\n` +
          `      A label typed beside an href does not move when the discipline is renamed.`,
      );
    }
    m = re.exec(src);
  }
}
notes.push(`${indexLabelBySlug.size} discipline labels cross-checked.`);

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

/* ---------------------------------------------------------------------------
   Rule 5. Nothing writes a sector label. The SECTOR taxonomy derives.

   The sixth hand-copied taxonomy of the round was the "where we deploy" rail,
   and it managed to be wrong three ways at once: a different order from the mega
   menu, "Public Sector" where the menu says "Government & Public Sector", and
   the singular "Life Science" where the menu says the plural. One cause. Rule 2
   above already does this for disciplines; sectors needed the same.

   What is asserted: outside the index, no file writes a sector's display label
   as a literal. Order is not checked because it can no longer be expressed —
   every surface renders `sectorNavEntries()` or `deriveSectorRail()`, and
   neither takes an order.

   The `short` forms ("Retail", "Banking") are NOT sector labels and are not
   checked: they are the breadcrumb and sidebar register, minted by
   `taxonomyLabels` from the same index.
   --------------------------------------------------------------------------- */
{
  const idxSrc = readFileSync(join("src", "data", "l1", "index.ts"), "utf8");
  const indBlock = idxSrc.slice(
    idxSrc.indexOf("export const industriesIndex"),
    idxSrc.indexOf("export const platformsIndex"),
  );
  const sectorLabels = [
    ...indBlock.matchAll(/label:\s*"([^"]+)"\s*as TaxonomyLabel/g),
  ].map((m) => m[1]);

  /* Files allowed to name a sector, each with its reason. Data files that
     AUTHOR per-sector prose are not on this list and do not need to be: the
     rule matches a label in a `label:`/`name:` position, which is the
     taxonomy-copy shape, not prose that happens to mention retail. */
  const SECTOR_LABEL_ALLOWED = [
    ["src/data/l1/index.ts", "the index itself, the single source"],
    ["src/lib/sectors.ts", "the derivation, which names none of them"],
    ["scripts/", "the rules that document the rule"],
  ];

  /* RENDERING code fails. DATA files are reported by name and do not fail yet,
     and that split is deliberate rather than a softened rule.

     Every rendering surface now derives, so a label sitting in a data file is
     already inert — `deriveSectorRail` overwrites `name` from the index before
     it paints, and the rail cannot disagree with the menu whatever the data
     says. What is left in src/data is dead copy to be swept, and the sweep
     belongs to the session that owns those files and is mid-way through adding
     the seventh sector to them. Failing on it here would hand that session a
     red gate for work this one is not allowed to do.

     Promote to a failure once the sweep lands. The list below is the handover. */
  const dataCopies = [];
  for (const file of allFiles) {
    if (SECTOR_LABEL_ALLOWED.some(([p]) => file.startsWith(p))) continue;
    const lines = readFileSync(file, "utf8").split("\n");
    lines.forEach((line, i) => {
      if (isComment(line)) return;
      for (const label of sectorLabels) {
        /* A label in a label:/name:/title: position is a copy of the taxonomy.
           The same words inside a sentence are prose and are left alone. */
        if (
          new RegExp(
            `\\b(label|name|title|short)\\s*:\\s*"${label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`,
          ).test(line)
        ) {
          const hit =
            `${file}:${i + 1}  writes the sector label "${label}".\n` +
            `      Sector labels and order derive from industriesIndex, via sectorNavEntries()\n` +
            `      or deriveSectorRail(). A label typed here does not move when the index does,\n` +
            `      which is how the rail came to disagree with the mega menu three ways at once.\n` +
            `      ${line.trim().slice(0, 90)}`;
          if (file.startsWith("src/data/")) dataCopies.push(`${file}:${i + 1}`);
          else failures.push(hit);
        }
      }
    });
  }
  notes.push(`${sectorLabels.length} sector labels, none written in rendering code.`);
  if (dataCopies.length) {
    const byFile = new Map();
    for (const c of dataCopies) {
      const f = c.slice(0, c.lastIndexOf(":"));
      byFile.set(f, (byFile.get(f) ?? 0) + 1);
    }
    console.log(
      `\n${dataCopies.length} inert sector label(s) still written into src/data, across ${byFile.size} file(s).\n` +
        "Not a failure: every rendering surface derives, so these no longer reach a page.\n" +
        "They are dead copy for the data session to sweep, after which this becomes a failure.\n" +
        [...byFile]
          .sort((a, b) => b[1] - a[1])
          .map(([f, n]) => `  ${n.toString().padStart(2)}  ${f}`)
          .join("\n"),
    );
  }
}

/* --------------------------------------------------------------------------- */
if (failures.length > 0) {
  console.error(`\ncheck-taxonomy FAILED with ${failures.length} problem(s):\n`);
  for (const f of failures) console.error(`  ${f}\n`);
  process.exit(1);
}

console.log(
  `Taxonomy clean across ${allFiles.length} files. ${notes.join(" ")}`,
);
