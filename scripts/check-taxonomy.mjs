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
import { parse as parseYaml } from "yaml";

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

/**
 * Which lines of a file sit inside a comment, tracked as a block rather than
 * guessed per line.
 *
 * `isComment` above tests one line in isolation, so it sees a block comment only
 * where the continuation line happens to begin with `*`. Prose wrapped inside a
 * `/* ... *\/` block does not, and a wrapped line that opens with a quoted term
 * looks exactly like a copied label. That produced a false failure the moment
 * rule 6 was tightened: a comment in HubLandingSections explaining that the rail
 * used to say "Cybersecurity & Risk" was read as a surface saying it.
 *
 * Fixed here rather than with an allow-list entry, deliberately. Round 4 quieted
 * a rule with an `ALLOWED_LINES` entry that also exempted the real JSX line
 * beside it, because the comment and the defect were the same string. Teaching
 * the scanner where comments actually end exempts no code at all.
 */
function commentMask(src) {
  const lines = src.split("\n");
  const mask = new Array(lines.length).fill(false);
  let inBlock = false;
  lines.forEach((line, i) => {
    if (inBlock) {
      mask[i] = true;
      if (line.includes("*/")) inBlock = false;
      return;
    }
    const opens = line.lastIndexOf("/*");
    const closesAfter = opens !== -1 && line.indexOf("*/", opens) === -1;
    if (closesAfter) {
      inBlock = true;
      /* The opening line counts as a comment only when nothing precedes the
         marker; `const x = 1; /* note` still has code on it. */
      mask[i] = line.slice(0, opens).trim() === "";
    } else {
      mask[i] = isComment(line);
    }
  });
  return mask;
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
   Rule 4a2. Every sector that renders `data-identity` has an identity row.

   Reported by Sumeet on 8 August 2026 and then measured: `/industries/education`
   declared `data-identity="education"` and globals.css answered nothing, so
   `--id` resolved EMPTY and the page fell back to the positional six-hue rhythm
   that the identity block exists to replace. Three hues across its sections
   (indigo, teal, plum) where every other industry carries one. Silent, because
   an unresolved custom property is not an error anywhere: not in the build, not
   in TypeScript, not in any gate. It renders, in the wrong colours.

   This is the same omission /ai-talent had one taxonomy along, which is why it
   is checked rather than fixed and forgotten. Four sites have to exist for a
   slug to hold one hue, and the fault is any one of them missing:

     --id-<slug>-l / -d          the token pair
     [data-identity="<slug>"]    the light rule and the dark rule
     ... .band-dark              the permanently-dark override

   Derived from `sectorRegistry`, which is the canonical list, so adding a
   sector adds its assertions.
   --------------------------------------------------------------------------- */
const globalsSrc = readFileSync(join("src", "app", "globals.css"), "utf8");
const registrySectorSrc = readFileSync(
  join("src", "data", "l1", "registry.ts"),
  "utf8",
);
const sectorBlock = registrySectorSrc.slice(
  registrySectorSrc.indexOf("export const sectorRegistry"),
);
const sectorSlugs = [
  ...sectorBlock.matchAll(/^\s{2}([a-z][a-z-]*):\s*\w+Data,/gm),
].map((m) => m[1]);

if (sectorSlugs.length === 0) {
  failures.push(
    "scripts/check-taxonomy.mjs  parsed zero sectors out of src/data/l1/registry.ts.\n" +
      "      The shape it reads has moved. A gate that enumerates nothing passes for the wrong reason.",
  );
}

for (const slug of sectorSlugs) {
  const required = [
    [`--id-${slug}-l:`, "light token"],
    [`--id-${slug}-d:`, "dark token"],
    [`:root[data-theme] [data-identity="${slug}"] {`, "light identity rule"],
    [
      `:root[data-theme="dark"] [data-identity="${slug}"] {`,
      "dark identity rule",
    ],
    [`[data-identity="${slug}"].band-dark`, "band-dark override"],
  ];
  const missing = required
    .filter(([needle]) => !globalsSrc.includes(needle))
    .map(([, label]) => label);
  if (missing.length > 0) {
    failures.push(
      `src/app/globals.css  sector "${slug}" is missing its ${missing.join(", ")}.\n` +
        `      /industries/${slug} sets data-identity="${slug}"; with any of these absent --id resolves\n` +
        `      empty and the page falls back to a different hue per section instead of one.`,
    );
  }
}
notes.push(`${sectorSlugs.length} sectors, each pinned to one identity hue.`);

/* ---------------------------------------------------------------------------
   Rule 4b. A case-study slug in scripts/ must come from order.yaml, not a
   hand-typed literal.

   Round 7's carry-over 1 was order.yaml itself naming four retired studies.
   Round 8 found the same fault one layer down: check-rendered-type.mjs and
   check-yallo-case.mjs each hand-copied one live slug as their "one page per
   template" sample. Retire that study and both gates 404 on the wrong thing
   instead of checking what they exist to check. Fixed by deriving the sample
   from order.yaml (scripts/lib/case-study-sample.mjs); this rule is what stops
   the next one from being typed back in by hand.
   --------------------------------------------------------------------------- */
const orderYamlSlugs = parseYaml(
  readFileSync(
    join("content", "case-studies", "order.yaml"),
    "utf8",
  ),
).order;

const SCRIPTS_ALLOWED = [
  "scripts/lib/case-study-sample.mjs", // the one place a slug is read, not typed
  "scripts/check-case-study-excerpts.mjs", // walks content/case-studies itself, names none
  // A one-time port register from the legacy WordPress export, source slug to
  // canonical slug. It names every study because that IS its job, not a
  // gate's "one representative sample" that could silently drift.
  "scripts/extract-case-studies.mjs",
];

const scriptFiles = readdirSync("scripts").flatMap((entry) => {
  const p = join("scripts", entry);
  if (statSync(p).isDirectory()) return [];
  return entry.endsWith(".mjs") ? [p] : [];
});

for (const file of scriptFiles) {
  if (SCRIPTS_ALLOWED.includes(file)) continue;
  const src = readFileSync(file, "utf8");
  const lines = src.split("\n");
  for (const slug of orderYamlSlugs) {
    lines.forEach((line, i) => {
      if (line.includes(slug)) {
        failures.push(
          `${file}:${i + 1}  hand-copies case-study slug "${slug}". Import sampleCaseStudySlug() from scripts/lib/case-study-sample.mjs instead — a slug typed here outlives the study it names.`,
        );
      }
    });
  }
}

/* ---------------------------------------------------------------------------
   Rules 5, 6 and 7. Nothing writes a taxonomy label. ALL THREE taxonomies derive.

   Rule 5 (sectors) came first, from the sixth hand-copied taxonomy of round 4:
   the "where we deploy" rail, wrong three ways at once — a different order from
   the mega menu, "Public Sector" where the menu says "Government & Public
   Sector", and the singular "Life Science" where the menu says the plural.

   Rules 6 (platforms) and 7 (disciplines) generalise it, per
   context-round5-rulings.md §5. The conclusion there is not that sectors were
   unusually bad; it is that ANY taxonomy rendered from a hand-written list will
   drift, and sectors were merely the one that had been looked at. That was
   correct. Round 5 found six live copies of the platform set and five of them
   were missing Informatica, ratified on 1 August, including the JSON-LD every
   crawler reads and the CV form's platform list. One had also transposed
   Microsoft and Salesforce against canon §3's order.

   What is asserted, per taxonomy: outside the index and the derivation, no file
   writes that taxonomy's display label as a literal in a `label:`/`name:`/
   `title:`/`short:` position. Order is not checked because it can no longer be
   expressed — every surface renders a derivation, and none of them takes an
   order.

   The `short` forms ("Retail", "Banking", "Cloud") are NOT labels and are not
   checked: they are the breadcrumb and sidebar register, minted by
   `taxonomyLabels` from the same index.

   ONE TAXONOMY AT A TIME, AND THAT IS THE POINT. Canon §3 runs two taxonomies
   that share labels — the six specialist DESKS also contain a "Data & Analytics"
   and a "Cloud & Infrastructure" — which is how relay v6.0's desk rename crossed
   into the discipline taxonomy. Rules 1 and 2 above guard that crossing. These
   rules only ever compare a label against the index it came from.
   --------------------------------------------------------------------------- */
{
  const idxSrc = readFileSync(join("src", "data", "l1", "index.ts"), "utf8");
  const bounds = (from, to) =>
    idxSrc.slice(
      idxSrc.indexOf(from),
      to === null ? undefined : idxSrc.indexOf(to),
    );
  const labelsIn = (block) =>
    [...block.matchAll(/label:\s*"([^"]+)"\s*as TaxonomyLabel/g)].map(
      (m) => m[1],
    );

  /* Files allowed to name a taxonomy, each with its reason. Data files that
     AUTHOR per-domain prose are not on these lists and do not need to be: the
     rule matches a label in a `label:`/`name:` position, which is the
     taxonomy-copy shape, not prose that happens to mention retail or SAP. */
  const COMMON_ALLOWED = [
    ["src/data/l1/index.ts", "the index itself, the single source"],
    ["scripts/", "the rules that document the rule"],
  ];

  const TAXONOMIES = [
    {
      rule: 5,
      noun: "sector",
      /* Promoted in round 6. See the note above the loop. */
      hardInData: true,
      labels: labelsIn(
        bounds("export const industriesIndex", "export const platformsIndex"),
      ),
      derivation: "industriesIndex, via sectorNavEntries() or deriveSectorRail()",
      allowed: [
        ...COMMON_ALLOWED,
        ["src/lib/sectors.ts", "the derivation, which names none of them"],
      ],
    },
    {
      rule: 6,
      noun: "platform",
      labels: labelsIn(
        bounds("export const platformsIndex", "export const capabilitiesIndex"),
      ),
      derivation:
        "platformsIndex, via platformNavEntries(), derivePlatformList() or vendorSlugMap()",
      allowed: [
        ...COMMON_ALLOWED,
        ["src/lib/platforms.ts", "the derivation, which names none of them"],
      ],
    },
    {
      rule: 7,
      noun: "discipline",
      labels: labelsIn(bounds("export const capabilitiesIndex", null)),
      derivation:
        "capabilitiesIndex, via capabilityNavEntries() or deriveCapabilityList()",
      allowed: [
        ...COMMON_ALLOWED,
        ["src/lib/capabilities.ts", "the derivation, which names none of them"],
        [
          "src/data/capabilities/index.ts",
          "capabilityNavEntries, the discipline derivation, which names none of them",
        ],
      ],
    },
  ];

  /* RENDERING code fails everywhere. DATA files fail ONCE THEIR SWEEP HAS
     LANDED, and until then they are reported by name. The split is deliberate
     rather than a softened rule: the sweep belongs to the session that owns
     src/data, and failing before it lands hands that session a red gate for
     work this one is not allowed to do.

     `hardInData` is that promotion, per taxonomy. Sectors carry it from round 6
     (context-round6-rulings.md §3.5): session B swept all 76 in round 5 and the
     count is zero, so the rule closes behind the sweep and a sector label typed
     back into a data file now fails the build. Verified the way the standing
     rule requires — by typing one back in and watching it go red, because a
     gate is not trusted until it has failed on its own case. Rule 6's first
     draft was green and could never have fired on either defect it was written
     for, which is the reason that rule exists.

     Platforms and disciplines stay reporting: 70 and 49 copies are still live
     in src/data and their sweep is session B's round 6 work. Promote each the
     round after its count reaches zero.

     WHAT THE REPORT DOES AND DOES NOT CLAIM. It lists labels written in a data
     file. It does not certify that each one is unreachable. Round 5 checked that
     claim rather than repeating it, and it did not hold: three of the platform
     lists flagged here were live, not inert — the AI estate bridge, the
     Blueprint archetype desks, and `PlatformCoverage.name`, which is the
     platform's own H1, <title> and every "Also in X" rail and was being taken
     from whichever sector tool card the walk reached first. Each is derived now.
     The remaining entries are reported for the data sweep; a surface added later
     that reads one of them straight is caught by the rendering half of this rule
     only if the label is written in the rendering file, so the report is a
     handover list and not a proof of inertness.

     Promote each to a failure once its sweep lands. */
  for (const tax of TAXONOMIES) {
    const dataCopies = [];
    for (const file of allFiles) {
      if (tax.allowed.some(([p]) => file.startsWith(p))) continue;
      const src = readFileSync(file, "utf8");
      const lines = src.split("\n");
      const comments = commentMask(src);
      /* THE OTHER TAXONOMY, and it is the one canon §3 warns about by name.
         `SPECIALIST_DESKS` is the six specialist desks that carry the screening
         proof — Architecture, Software Development, Cloud & Infrastructure,
         Packaged Software, Data & AI, Agile & DevOps. Two of those names are
         also discipline labels, legitimately and permanently: the desks are a
         different axis, not a copy of this one. Applying a discipline rule to
         them is the same mistake in the opposite direction from relay v6.0's,
         which renamed the desk and took the discipline with it.
         Scoped to the declaration, not to the file. L1PageShell is a large
         rendering file and a genuine discipline copy elsewhere in it must still
         fail — verified by putting one there and watching it. */
      let inDeskArray = false;
      lines.forEach((line, i) => {
        if (/const SPECIALIST_DESKS\s*=\s*\[/.test(line)) inDeskArray = true;
        else if (inDeskArray && /^\s*\]/.test(line)) inDeskArray = false;
        if (inDeskArray) return;
        if (comments[i]) return;
        for (const label of tax.labels) {
          const q = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          /* TWO shapes, and the second exists because the first missed the very
             defect this rule was written for.

             (a) A label in a label:/name:/title:/short: position. The same words
                 inside a sentence are prose and are left alone.

             (b) A label as a bare ARRAY ELEMENT. The first draft of rule 6
                 checked only (a), was green, and was then tested the way the
                 brief requires — by typing a platform label back into rendering
                 code and watching it fail. It did not fail. Both real copies it
                 was written to catch, the JSON-LD `PLATFORMS` list and the CV
                 form's `interestOptions`, are bare arrays of quoted names with
                 no key in front of them, so a keyed-position rule could never
                 have seen either. A rule that cannot fail on its own motivating
                 case is not a rule.

             The element test is deliberately tight: the quoted string must equal
             the label exactly, open after `[`, `,` or line-leading whitespace,
             and close before `,` or `]`. That admits `["SAP", "Oracle"]` and one
             name per line, and excludes `=== "SAP"`, `case "SAP":`, a call
             argument, and any sentence that merely contains the word. */
          const keyed = new RegExp(
            `\\b(label|name|title|short)\\s*:\\s*"${q}"`,
          );
          const element = new RegExp(`(^\\s*|[[,]\\s*)"${q}"\\s*[,\\]]`);
          if (keyed.test(line) || element.test(line)) {
            const hit =
              `${file}:${i + 1}  writes the ${tax.noun} label "${label}".\n` +
              `      ${tax.noun[0].toUpperCase()}${tax.noun.slice(1)} labels and order derive from ${tax.derivation}.\n` +
              `      A label typed here does not move when the index does, which is how five\n` +
              `      copies of the platform set never heard that Informatica had been ratified.\n` +
              `      ${line.trim().slice(0, 90)}`;
            if (file.startsWith("src/data/") && !tax.hardInData)
              dataCopies.push(`${file}:${i + 1}`);
            else failures.push(hit);
          }
        }
      });
    }
    notes.push(
      `${tax.labels.length} ${tax.noun} labels, none written in ${
        tax.hardInData ? "rendering code or data" : "rendering code"
      }.`,
    );
    if (dataCopies.length) {
      const byFile = new Map();
      for (const c of dataCopies) {
        const f = c.slice(0, c.lastIndexOf(":"));
        byFile.set(f, (byFile.get(f) ?? 0) + 1);
      }
      console.log(
        `\n${dataCopies.length} inert ${tax.noun} label(s) still written into src/data, across ${byFile.size} file(s).\n` +
          "Not a failure: every rendering surface derives, so these no longer reach a page.\n" +
          "They are dead copy for the data session to sweep, after which this becomes a failure.\n" +
          [...byFile]
            .sort((a, b) => b[1] - a[1])
            .map(([f, n]) => `  ${n.toString().padStart(2)}  ${f}`)
            .join("\n"),
      );
    }
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
