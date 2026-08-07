#!/usr/bin/env node
/**
 * build-metrics — turns content/metrics.yaml into a CLIENT-SAFE typed module, so
 * no published figure is ever typed by hand.
 *
 *   node scripts/build-metrics.mjs           write it
 *   node scripts/build-metrics.mjs --check   fail if the committed copy drifted
 *
 * Source:  content/metrics.yaml
 * Output:  src/data/metrics.generated.ts   (generated, committed, never edited)
 *
 * WHY THIS EXISTS, round 19 §5.1. `src/data/metrics.ts` already reads the YAML,
 * validates it with zod and exposes `publishedFigure()`. It reads it with
 * `node:fs`, which makes it server-only, and `src/data/home/hero.ts` and
 * `engage.ts` feed client components. So those two typed the figures instead:
 * "72h" and "2:1" in hero's footer strip, "72h" and "50+" on the engagement
 * cards. Four first-party claims the quarterly refresh could not reach.
 *
 * That is the same defect round 17 found in src/data/platforms/why.ts and
 * src/app/ai-talent/page.tsx, and the same one the L1 `stats` tuples had before
 * they were removed. Adding `publishedFigure` did not end it, because the reason
 * these two files were not converted was never forgetfulness: it was that they
 * COULD not be. A generated module has no `node:fs` in it, so it can.
 *
 * WHY GENERATED AND COMMITTED RATHER THAN READ AT RUNTIME. The same reason
 * build-research-dataset.mjs is, whose shape this follows: a module that read
 * the YAML at request time is a server module again, and the whole point is to
 * reach the client. `--check` is what keeps the committed copy honest, and it is
 * the gate CI runs.
 *
 * WHY THE ZOD SCHEMA STILL LIVES IN src/data/metrics.ts. It validates the shape
 * the site depends on at import time. This generator validates the same fields
 * before emitting anything, so a malformed YAML fails here, at generation, which
 * is earlier and louder. Two checks of one file, not two copies of it: nothing
 * below restates a VALUE, only the shape it must have.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = resolve(ROOT, "content/metrics.yaml");
const OUT = resolve(ROOT, "src/data/metrics.generated.ts");
/** The import specifier callers use, named once so the guidance cannot go stale. */
const generatedImport = "@/data/metrics.generated";

/* The pre-commit hook runs `biome check --write` over the staged set, so a
   generated file that is not already biome-formatted is rewritten on its way
   into every commit — and then a byte-comparison gate fails forever against its
   own output. Formatting here means the generator and the formatter agree, and
   --check compares like with like. */
function biomeFormat(source) {
  return execFileSync(
    "pnpm",
    ["exec", "biome", "format", "--stdin-file-path=metrics.generated.ts"],
    { input: source, encoding: "utf8", cwd: ROOT },
  );
}

const lit = (v) => JSON.stringify(String(v));

/** `+` and `%` are two of the four suffixes and both are regex metacharacters. */
const escapeRe = (v) => v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Comments out, string contents intact, line numbers preserved. Same technique
 * and the same reason as check-terminology.mjs's: a hit reported at the wrong
 * line sends the reader to unrelated code, and the docstrings in
 * src/data/metrics.ts and src/data/home/hero.ts legitimately quote the very
 * literals this sweep bans, because they record where those literals used to be.
 */
function stripComments(src) {
  let out = "";
  let i = 0;
  let quote = "";
  while (i < src.length) {
    const ch = src[i];
    const nx = src[i + 1];
    if (quote === "") {
      if (ch === "/" && nx === "/") {
        while (i < src.length && src[i] !== "\n") {
          out += " ";
          i++;
        }
        continue;
      }
      if (ch === "/" && nx === "*") {
        out += "  ";
        i += 2;
        while (i < src.length && !(src[i] === "*" && src[i + 1] === "/")) {
          out += src[i] === "\n" ? "\n" : " ";
          i++;
        }
        out += "  ";
        i += 2;
        continue;
      }
      if (ch === '"' || ch === "'" || ch === "`") quote = ch;
    } else if (ch === "\\") {
      out += src[i] + (src[i + 1] ?? "");
      i += 2;
      continue;
    } else if (ch === quote) {
      quote = "";
    }
    out += ch;
    i++;
  }
  return out;
}

function walk(dir, files) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path, files);
    else if (/\.tsx?$/.test(entry.name)) files.push(path);
  }
  return files;
}

/**
 * THE CLASS GUARD, round 19 §5.1. Every one of these figures typed as a string
 * literal in src/ is a first-party claim the quarterly refresh cannot reach.
 *
 * The build has found this defect three times in three rounds and fixed the
 * instances each time: round 17 in src/data/platforms/why.ts and
 * src/app/ai-talent/page.tsx, §5.1 in src/data/home/hero.ts and engage.ts, and
 * this round's own measurement in src/app/why-yallo/page.tsx,
 * src/data/services/contract.tsx and permanent.tsx — six more that §5.1 called
 * "last known". Instances, three times. This is the class.
 *
 * SCOPED TO A WHOLE STRING LITERAL, deliberately. `"72h"` on its own is a
 * structured field feeding a card or a stat. "shortlisted in 72 hours" inside a
 * sentence is published prose, and rewriting published prose is a copy decision
 * that belongs to Sumeet (R-A9), not to a lint. Prose occurrences are reported
 * as advisory below so they stay visible without being silently converted.
 *
 * The values are derived from the YAML, never listed here. A gate holding its
 * own copy of the figures is the defect it exists to catch.
 */
function sweepTypedFigures(metrics) {
  const values = metrics.map((m) => `${m.target}${m.suffix}`);
  const src = resolve(ROOT, "src");
  const generatedRel = relative(ROOT, OUT);
  const typed = [];
  const prose = [];

  for (const file of walk(src, [])) {
    const rel = relative(ROOT, file);
    if (rel === generatedRel) continue;
    const code = stripComments(readFileSync(file, "utf8"));
    code.split("\n").forEach((line, i) => {
      for (const value of values) {
        /* Not preceded by a digit: the persona statistic "250+" contains "50+"
           and is a third-party figure with its own visible source, nothing to do
           with these four. */
        if (!new RegExp(`(?<![0-9])${escapeRe(value)}`).test(line)) continue;
        const text = line.trim().slice(0, 90);
        /* The value as a WHOLE string literal, in any of the three quote
           styles. `+` and `%` are regex metacharacters and two of the four
           suffixes, so the escape is load-bearing: unescaped, `50+` matched
           `"500"` in a font-weight array on the first run of this sweep. */
        const whole = new RegExp(`(["'\`])${escapeRe(value)}\\1`);
        if (whole.test(line)) typed.push({ rel, line: i + 1, value, text });
        else prose.push({ rel, line: i + 1, value, text });
      }
    });
  }
  return { typed, prose };
}

function main() {
  const doc = parseYaml(readFileSync(SOURCE, "utf8"));

  const asAt =
    doc?.asAt instanceof Date ? doc.asAt.toISOString().slice(0, 10) : doc?.asAt;
  if (typeof asAt !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(asAt)) {
    console.error(`${SOURCE}: asAt must be YYYY-MM-DD, got ${JSON.stringify(asAt)}.`);
    process.exit(1);
  }
  if (!Array.isArray(doc?.metrics) || doc.metrics.length === 0) {
    console.error(`${SOURCE}: no metrics array to generate from.`);
    process.exit(1);
  }

  const metrics = doc.metrics.map((m, i) => {
    for (const field of ["label", "definition", "source"]) {
      if (typeof m?.[field] !== "string" || m[field].trim() === "") {
        console.error(`${SOURCE}: metrics[${i}].${field} must be a non-empty string.`);
        process.exit(1);
      }
    }
    if (typeof m.target !== "number" || !Number.isFinite(m.target)) {
      console.error(`${SOURCE}: metrics[${i}].target must be a number.`);
      process.exit(1);
    }
    return {
      target: m.target,
      suffix: m.suffix === undefined ? "" : String(m.suffix),
      label: m.label,
      definition: m.definition,
      source: m.source,
    };
  });

  const labels = metrics.map((m) => m.label);
  const duplicated = labels.filter((l, i) => labels.indexOf(l) !== i);
  if (duplicated.length > 0) {
    console.error(
      `${SOURCE}: duplicate metric label(s) ${[...new Set(duplicated)].map(lit).join(", ")}.\n` +
        "The label is the lookup key every surface reads a figure by, so two metrics\n" +
        "sharing one would make which figure a page publishes depend on array order.",
    );
    process.exit(1);
  }

  const body = `/**
 * GENERATED FILE — do not edit. Written by scripts/build-metrics.mjs from
 * content/metrics.yaml, which is the source of truth for all four published
 * figures. Change the YAML and run \`pnpm metrics\`; \`pnpm check:metrics\`
 * fails if this file and the YAML have drifted apart.
 *
 * WHY THIS EXISTS ALONGSIDE src/data/metrics.ts. That module reads the YAML
 * with node:fs, which makes it server-only. Everything a CLIENT component
 * reaches has to read its figures from here, or it types them by hand, which is
 * what src/data/home/hero.ts and engage.ts did until round 19 §5.1.
 *
 * As at ${asAt}. Refreshed quarterly; see content/metrics.yaml.
 */

export interface PublishedMetric {
  readonly target: number;
  readonly suffix: string;
  readonly label: MetricLabel;
  readonly definition: string;
  readonly source: string;
}

/** The labels content/metrics.yaml publishes. A typo is a compile error. */
export type MetricLabel =
${labels.map((l) => `  | ${lit(l)}`).join("\n")};

export const METRICS_AS_AT = ${lit(asAt)};

export const publishedMetrics: readonly PublishedMetric[] = [
${metrics
  .map(
    (m) => `  {
    target: ${m.target},
    suffix: ${lit(m.suffix)},
    label: ${lit(m.label)},
    definition: ${lit(m.definition)},
    source: ${lit(m.source)},
  },`,
  )
  .join("\n")}
];

/**
 * One published figure, formatted, by its label — the client-safe counterpart
 * of \`publishedFigure()\` in src/data/metrics.ts, and deliberately the same
 * lookup key so the two cannot answer differently.
 *
 * The parameter is typed to the union above, so an unknown label cannot compile
 * rather than throwing at request time. Retained as a runtime throw as well:
 * this module is generated, and a caller reaching it through a widened string
 * would otherwise get \`undefined\` rendered into a card where a number was
 * promised.
 */
export function metricValue(label: MetricLabel): string {
  const hit = publishedMetrics.find((m) => m.label === label);
  if (!hit) {
    throw new Error(
      \`metricValue("\${label}"): content/metrics.yaml publishes no metric with that label.\`,
    );
  }
  return \`\${hit.target}\${hit.suffix}\`;
}
`;

  const formatted = biomeFormat(body);
  const rel = relative(ROOT, OUT);

  /* --check is the gate: regenerate in memory and compare. It fails when the
     committed module and the YAML have drifted apart, which is the only way the
     generated-and-committed arrangement can go wrong. */
  if (process.argv.includes("--check")) {
    const current = existsSync(OUT) ? readFileSync(OUT, "utf8") : null;
    if (current === null) {
      console.error(`${rel} does not exist. Run \`pnpm metrics\`.`);
      process.exit(1);
    }
    if (current !== formatted) {
      console.error(
        `${rel} is out of date with content/metrics.yaml.\nRun \`pnpm metrics\` and commit the result.`,
      );
      process.exit(1);
    }

    const { typed, prose } = sweepTypedFigures(metrics);
    if (typed.length > 0) {
      console.error(
        `\ncheck:metrics FAILED — ${typed.length} published figure(s) typed as a string literal in src/:\n`,
      );
      for (const t of typed) {
        console.error(`  ${t.rel}:${t.line}  ${lit(t.value)}\n      ${t.text}`);
      }
      console.error(
        "\n  Each of these is a first-party claim content/metrics.yaml cannot reach, so\n" +
          "  the quarterly refresh moves the number and leaves this one behind. Import\n" +
          `  \`metricValue\` from ${generatedImport} and look the figure up by its\n` +
          "  canonical label; a renamed metric then fails the build rather than shipping\n" +
          "  a stale figure.\n",
      );
      process.exit(1);
    }

    console.log(
      `${rel} is current with content/metrics.yaml — ${metrics.length} figures, as at ${asAt}.\n` +
        `  no published figure typed as a string literal anywhere in src/`,
    );
    if (prose.length > 0) {
      console.log(
        `\n  ${prose.length} occurrence(s) of a published figure inside PROSE. Not a failure:\n` +
          "  rewriting published copy is Sumeet's decision, not a lint's (R-A9). Listed so\n" +
          "  they stay visible at the quarterly refresh, when each has to be read by hand:",
      );
      for (const p of prose) console.log(`    ${p.rel}:${p.line}  ${p.text}`);
    }
    return;
  }

  writeFileSync(OUT, formatted);
  console.log(
    `Wrote ${rel} — ${metrics.length} figures (${labels.join(", ")}), as at ${asAt}.`,
  );
}

main();
