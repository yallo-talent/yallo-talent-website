#!/usr/bin/env node
/**
 * build-research-dataset — turns the LinkedIn Talent Insights extract into a
 * typed module, so no figure in the research family is ever typed by hand.
 *
 *   node scripts/build-research-dataset.mjs
 *
 * Source:  docs/lti-reports/lti-combined-2026-08-02.csv
 * Output:  src/data/research/dataset.ts   (generated, committed, never edited)
 *
 * WHY GENERATE RATHER THAN AUTHOR. context-round16-scope.md §2.3 forbids a
 * hand-made PDF because it would be "a second copy of every figure, and this
 * build's signature defect is the second copy". The same argument applies one
 * level down: a hand-typed figure in a page is a second copy of the extract.
 * Round 16 verified three figures in the drafted conclusions against this CSV
 * and two of them did not survive, so this is not a theoretical concern.
 *
 * WHY COMMITTED RATHER THAN READ AT RUNTIME. `docs/` is not bundled into a
 * deployment, so a module that read the CSV at request time would work
 * locally and fail in production. `check:research-dataset` re-runs this and
 * fails if the committed output has drifted from the CSV.
 *
 * A NOTE ON "THE GULF". Several conclusions compare the Gulf against the UK.
 * The extract has no Gulf column, so the comparison has to be constructed,
 * and the two constructions disagree:
 *
 *   pooled  = (Saudi count + UAE count) / (Saudi baseline + UAE baseline)
 *   mean    = (Saudi ratio + UAE ratio) / 2
 *
 * The drafted conclusions use `mean` throughout — verified against SAP
 * Integration (+4.3pp), Oracle Fusion (+6.5pp), GCP (+6.9pp) and Salesforce
 * Marketing Cloud (-13.7pp), each of which reproduces under `mean` and not
 * under `pooled`. Both are emitted so a page can state which it used, and the
 * methodology note says so. Unstated, this is exactly the kind of assumption
 * that later reads as an error.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = resolve(ROOT, "docs/lti-reports/lti-combined-2026-08-02.csv");
const OUT = resolve(ROOT, "src/data/research/dataset.ts");

/** The extract date, carried on every published figure. Canon requires it. */
const AS_AT = "2026-08-02";

/**
 * The same date as running prose. Derived from AS_AT rather than typed beside
 * it, so the two cannot disagree — an ISO date and a written date maintained
 * separately is a second copy of the one fact this whole family is dated by.
 */
const AS_AT_DISPLAY = new Date(`${AS_AT}T00:00:00Z`).toLocaleDateString(
  "en-GB",
  { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" },
);

/**
 * The same date to the month, for the attribution line a reader sees under a
 * heading. Direct instruction, chat, round 17: a day-precision extract date read
 * as spurious accuracy on a supply-side snapshot. Derived from AS_AT like the
 * full display date, so the two cannot disagree and neither is typed.
 */
const AS_AT_MONTH = new Date(`${AS_AT}T00:00:00Z`).toLocaleDateString("en-GB", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const BASELINE_LABEL = "BASELINE (denominator)";

function parseCsv(text) {
  const [headerLine, ...lines] = text.trim().split("\n");
  const headers = headerLine.split(",");
  return lines
    .filter((l) => l.trim())
    .map((line) => {
      /* No quoted fields in this extract — asserted below rather than assumed. */
      if (line.includes('"')) {
        throw new Error(`Quoted field in extract, parser is too naive: ${line}`);
      }
      const cells = line.split(",");
      if (cells.length !== headers.length) {
        throw new Error(`Ragged row (${cells.length} of ${headers.length}): ${line}`);
      }
      return Object.fromEntries(headers.map((h, i) => [h, cells[i]]));
    });
}

/**
 * Run the repository's own formatter over generated source.
 *
 * `biome format --stdin-file-path` reads stdin and writes the formatted text
 * to stdout, so the generator never has to guess at line widths or trailing
 * commas — it asks the tool that will otherwise rewrite the file anyway.
 */
function biomeFormat(source) {
  return execFileSync(
    "pnpm",
    ["exec", "biome", "format", "--stdin-file-path=dataset.ts"],
    { input: source, encoding: "utf8", cwd: ROOT },
  );
}

const num = (v) => {
  const n = Number(v);
  if (!Number.isFinite(n)) throw new Error(`Not a number: ${v}`);
  return n;
};

/** Percentage point difference, rounded the way the conclusions round. */
const pp = (a, b) => Math.round((a - b) * 10) / 10;

function main() {
  const rows = parseCsv(readFileSync(SOURCE, "utf8"));

  /** family name -> { baseline, skills[] } */
  const families = new Map();

  for (const row of rows) {
    const family = row.Platform;
    const label = row["Role/skill"];
    const entry = {
      label,
      uk: num(row.UK),
      saudi: num(row["Saudi Arabia"]),
      uae: num(row.UAE),
      combined: num(row["Combined total"]),
      baselineTotal: num(row["Baseline total"]),
      ratioCombined: num(row["Ratio % (combined)"]),
      ratioUk: num(row["UK ratio %"]),
      ratioSaudi: num(row["Saudi ratio %"]),
      ratioUae: num(row["UAE ratio %"]),
    };
    if (!families.has(family)) families.set(family, { baseline: null, skills: [] });
    if (label === BASELINE_LABEL) families.get(family).baseline = entry;
    else families.get(family).skills.push(entry);
  }

  for (const [name, f] of families) {
    if (!f.baseline) throw new Error(`Family ${name} has no baseline row.`);
  }

  const out = [...families.entries()].map(([name, f]) => {
    const b = f.baseline;
    const gulfCount = b.saudi + b.uae;
    return {
      family: name,
      baseline: {
        uk: b.uk,
        saudi: b.saudi,
        uae: b.uae,
        combined: b.combined,
      },
      /* What share of this family's professionals sit in the Gulf. A share of
         real headcounts, so pooled is the only sensible construction here. */
      gulfShareOfPool: Math.round((gulfCount / b.combined) * 1000) / 10,
      skills: f.skills.map((s) => {
        const gulfPooled =
          Math.round(((s.saudi + s.uae) / gulfCount) * 10000) / 100;
        const gulfMean = Math.round(((s.ratioSaudi + s.ratioUae) / 2) * 100) / 100;
        return {
          label: s.label,
          uk: s.uk,
          saudi: s.saudi,
          uae: s.uae,
          combined: s.combined,
          ratioCombined: s.ratioCombined,
          ratioUk: s.ratioUk,
          ratioSaudi: s.ratioSaudi,
          ratioUae: s.ratioUae,
          gulfMean,
          gulfPooled,
          gulfVsUkMean: pp(gulfMean, s.ratioUk),
          gulfVsUkPooled: pp(gulfPooled, s.ratioUk),
        };
      }),
    };
  });

  /* Cross-family facts a page would otherwise assert from memory. Derived, so
     "the highest ratio in the dataset" cannot drift into being false — which
     is precisely what it had done. */
  const allSkills = out.flatMap((f) => f.skills.map((s) => ({ ...s, family: f.family })));
  const highestRatio = allSkills.reduce((a, s) => (s.ratioCombined > a.ratioCombined ? s : a));
  const smallestNamedSkill = allSkills.reduce((a, s) => (s.combined < a.combined ? s : a));

  const banner = `/**
 * GENERATED FILE — DO NOT EDIT.
 *
 * Produced by scripts/build-research-dataset.mjs from
 * docs/lti-reports/lti-combined-2026-08-02.csv.
 * Regenerate with \`pnpm research:dataset\`; \`pnpm check:research-dataset\`
 * fails if this file and the extract have drifted apart.
 *
 * Every figure the research family publishes resolves through this module.
 * Nothing downstream types a number.
 */`;

  const body = `${banner}

/** The extract date, ISO. For machine-readable contexts only. */
export const LTI_AS_AT = ${JSON.stringify(AS_AT)};

/** The extract date as prose. Use this anywhere a reader sees it. */
export const LTI_AS_AT_DISPLAY = ${JSON.stringify(AS_AT_DISPLAY)};

/** The extract date to the month. The attribution line a reader sees. */
export const LTI_AS_AT_MONTH = ${JSON.stringify(AS_AT_MONTH)};

/** How the source is attributed wherever a figure appears. */
export const LTI_SOURCE = "LinkedIn Talent Insights";

export interface ResearchSkill {
  label: string;
  uk: number;
  saudi: number;
  uae: number;
  combined: number;
  /** Share of the family baseline declaring this skill, all three markets. */
  ratioCombined: number;
  ratioUk: number;
  ratioSaudi: number;
  ratioUae: number;
  /** Unweighted mean of the Saudi and UAE ratios. See the generator's note. */
  gulfMean: number;
  /** (Saudi + UAE counts) / (Saudi + UAE baselines). */
  gulfPooled: number;
  /** gulfMean minus the UK ratio, in percentage points. */
  gulfVsUkMean: number;
  gulfVsUkPooled: number;
}

export interface ResearchFamily {
  family: string;
  baseline: { uk: number; saudi: number; uae: number; combined: number };
  /** Share of the family's professionals located in the Gulf. Pooled. */
  gulfShareOfPool: number;
  skills: ResearchSkill[];
}

export const ltiFamilies: ResearchFamily[] = ${JSON.stringify(out, null, 2)};

/** Lookup by the extract's own family name. */
export function ltiFamily(name: string): ResearchFamily {
  const found = ltiFamilies.find((f) => f.family === name);
  if (!found) throw new Error(\`No LTI family named \${name}\`);
  return found;
}

/** A named skill inside a family, by the extract's own label. */
export function ltiSkill(family: string, label: string): ResearchSkill {
  const found = ltiFamily(family).skills.find((s) => s.label === label);
  if (!found) throw new Error(\`No skill \${label} in \${family}\`);
  return found;
}

/**
 * Derived superlatives. A page that wants to say "the highest" asks for it
 * rather than asserting it: the drafted conclusion called Azure DevOps
 * Services at 48.7% "the highest ratio in the dataset" when ${highestRatio.family}
 * ${highestRatio.label} is ${highestRatio.ratioCombined}%.
 */
export const ltiHighestRatio = {
  family: ${JSON.stringify(highestRatio.family)},
  label: ${JSON.stringify(highestRatio.label)},
  ratio: ${highestRatio.ratioCombined},
};

/** The smallest named skill anywhere in the extract, by combined headcount. */
export const ltiSmallestNamedSkill = {
  family: ${JSON.stringify(smallestNamedSkill.family)},
  label: ${JSON.stringify(smallestNamedSkill.label)},
  combined: ${smallestNamedSkill.combined},
};
`;

  /* Emit what biome would emit.
     The pre-commit hook runs `biome check --write` over the staged set, so a
     generated file that is not already biome-formatted is rewritten on its
     way into every commit — and then a byte-comparison gate fails forever
     against its own output. Formatting here means the generator and the
     formatter agree, and --check compares like with like. */
  const formatted = biomeFormat(body);

  /* --check is the gate: regenerate in memory and compare. It fails when the
     committed module and the extract have drifted apart, which is the only
     way the generated-and-committed arrangement can go wrong. */
  if (process.argv.includes("--check")) {
    const current = existsSync(OUT) ? readFileSync(OUT, "utf8") : null;
    if (current === null) {
      console.error(`${OUT} does not exist. Run \`pnpm research:dataset\`.`);
      process.exit(1);
    }
    if (current !== formatted) {
      console.error(
        `${OUT} is out of date with ${SOURCE}.\nRun \`pnpm research:dataset\` and commit the result.`,
      );
      process.exit(1);
    }
    console.log(
      `Research dataset is current with the extract — ${out.length} families, ${allSkills.length} named skills, as at ${AS_AT}.`,
    );
    return;
  }

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, formatted);
  console.log(
    `Wrote ${OUT} — ${out.length} families, ${allSkills.length} named skills, as at ${AS_AT}.`,
  );
  console.log(
    `  highest ratio anywhere: ${highestRatio.family} ${highestRatio.label} ${highestRatio.ratioCombined}%`,
  );
  console.log(
    `  smallest named skill:   ${smallestNamedSkill.family} ${smallestNamedSkill.label} ${smallestNamedSkill.combined}`,
  );
}

main();
