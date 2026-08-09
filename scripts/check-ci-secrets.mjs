#!/usr/bin/env node
/**
 * Every CI step that WRITES to the database holds the writing secret, and no
 * other step does.
 *
 * WHY THIS EXISTS. R-25b.1 swapped the `full` job's job-level `DATABASE_URL`
 * to a read-only role. Three separate steps in that job genuinely write, and
 * they were found ONE CI RUN AT A TIME: the sources self-test, then the
 * cockpit isolation gate, then the cockpit render gate. Each fix was correct
 * and each was an instance. Three instances of one mistake is a missing rule,
 * so this is the rule.
 *
 * IT DERIVES THE WRITING SCRIPTS RATHER THAN LISTING THEM. A hand-written list
 * is the thing that failed three times. Any script under `scripts/` that
 * contains a write statement, or that shells out to `admin-fixture-user.mjs`,
 * is a writer — so a new gate that writes is covered the day it is added
 * rather than the day CI happens to fail on it.
 *
 * THE ONE EXCEPTION IS DOCUMENTED AND NARROW. `check-ci-reader-reach.mjs`
 * contains write statements ON PURPOSE: they are probes that must be REFUSED,
 * and handing it the writing secret would make it assert the opposite of what
 * it is for. It is named here, with that reason, rather than filtered by a
 * pattern that might one day catch something else.
 *
 * Run: node scripts/check-ci-secrets.mjs
 */

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const WORKFLOW = ".github/workflows/ci.yml";
const SCRIPTS = "scripts";

/** The writing secret, as it must appear at step level. */
const WRITING = "${{ secrets.DATABASE_URL }}";

/**
 * Contains write statements deliberately, and must NOT hold the writing
 * secret: its whole assertion is that the credential it is given cannot write.
 */
const REFUSED_WRITER = "check-ci-reader-reach.mjs";

/**
 * This file, which matches its own detector.
 *
 * The patterns it searches for are written in its own source, so the first run
 * classified the scanner as a writer and would have demanded a production
 * write credential for a script that opens no connection at all. Same shape as
 * a linter reading its own rule text as a violation.
 */
const SELF = "check-ci-secrets.mjs";

/** Scripts that write, derived from what they contain. */
const writers = new Set();
for (const name of readdirSync(SCRIPTS)) {
  if (!name.endsWith(".mjs")) continue;
  if (name === REFUSED_WRITER || name === SELF) continue;
  const src = readFileSync(join(SCRIPTS, name), "utf8");
  const writesSql = /\b(insert\s+into|delete\s+from|update\s+\w+\s+set)\b/i.test(src);
  const usesFixtureAccounts =
    name !== "admin-fixture-user.mjs" && src.includes("admin-fixture-user.mjs");
  if (writesSql || usesFixtureAccounts) writers.add(name);
}

/**
 * Split the workflow into steps, keeping each step's own text.
 *
 * A YAML parser would be tidier and is not worth a dependency here: steps are
 * a flat list at a known indentation in this file, and the question asked of
 * each one is "does its text mention this script, and does its text set this
 * secret". Nothing about that needs a document model.
 */
const yaml = readFileSync(WORKFLOW, "utf8");
const lines = yaml.split("\n");
const steps = [];
let current = null;
for (const line of lines) {
  if (/^\s{6}- (name|uses|run):/.test(line)) {
    if (current) steps.push(current);
    current = { start: lines.indexOf(line), text: line };
  } else if (current) {
    current.text += `\n${line}`;
    /* A blank line at step indentation ends nothing in YAML; the next step
       marker does. So steps accumulate until the next one starts. */
  }
}
if (current) steps.push(current);

const problems = [];
let covered = 0;

for (const step of steps) {
  const name = (step.text.match(/- name: (.+)/) ?? [, "(unnamed)"])[1].trim();
  const runsWriter = [...writers].some((w) => step.text.includes(w));
  const hasWritingSecret = step.text.includes(`DATABASE_URL: ${WRITING}`);

  if (runsWriter && !hasWritingSecret) {
    problems.push(
      `"${name}" runs a script that writes to the database and does not set DATABASE_URL at step level.\n` +
        "      Add:  env:\n              DATABASE_URL: ${{ secrets.DATABASE_URL }}",
    );
  }
  if (runsWriter && hasWritingSecret) covered++;
  if (!runsWriter && hasWritingSecret) {
    problems.push(
      `"${name}" holds the WRITING secret and runs nothing that writes. The read-only role is the default for a reason.`,
    );
  }
  if (step.text.includes(REFUSED_WRITER) && hasWritingSecret) {
    problems.push(
      `"${name}" runs ${REFUSED_WRITER} with the writing secret, which inverts the only thing that gate asserts.`,
    );
  }
}

console.log(
  `${writers.size} script(s) write to the database: ${[...writers].sort().join(", ")}`,
);
console.log(`${steps.length} step(s) in ${WORKFLOW}; ${covered} carry the writing secret correctly.`);

if (problems.length > 0) {
  console.error(`\n${problems.length} problem(s):`);
  for (const p of problems) console.error(`  ${p}`);
  console.error(
    "\nR-25b.1: the job-level credential is read-only. A step that writes says so\n" +
      "for itself, and a step that does not write must not be handed the ability.",
  );
  process.exit(1);
}
console.log("Every writing step holds the writing secret, and only those steps do.");
