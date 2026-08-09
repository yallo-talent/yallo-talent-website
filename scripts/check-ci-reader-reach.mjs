#!/usr/bin/env node
/**
 * The credential this job holds must be the read-only one.
 *
 * R-25b.1 swapped the `full` job's `DATABASE_URL` to `ci_reader`. A swap is a
 * one-time act and secrets are edited by people, so without this the estate
 * quietly returns to CI holding production write access and nothing says so.
 * This asserts the property rather than the provenance: it does not care what
 * the role is called, it cares that the connection can read content, cannot
 * write it, and cannot see the tables holding password hashes, leads or
 * conversations.
 *
 * BOTH DIRECTIONS. A gate that only checks the writes fail passes on a
 * connection string that is broken outright. So the read must succeed first.
 *
 * Run: DATABASE_URL=postgres://... node scripts/check-ci-reader-reach.mjs
 */

import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set, so the CI credential's reach was never measured.");
  process.exit(1);
}
const sql = neon(url);

const who = await sql`select current_user`;
console.log(`Connected as ${who[0].current_user}.\n`);

const failures = [];

/** Must succeed: a credential that cannot read content makes every gate vacuous. */
for (const table of ["articles", "case_studies", "content_redirects"]) {
  try {
    await sql.query(`select count(*) from public.${table}`);
    console.log(`  OK      can read ${table}`);
  } catch (e) {
    failures.push(`cannot read ${table}: ${e.message}`);
    console.log(`  FAIL    cannot read ${table}: ${e.message}`);
  }
}

/**
 * Must be refused: every write, on the tables it can read.
 *
 * EVERY PROBE MATCHES ZERO ROWS, and that is not a detail. Postgres checks the
 * table privilege when it plans the statement, before any row is considered, so
 * a `where false` insert still raises 42501 for a role without INSERT — while
 * writing nothing at all for a role that has it. The first version of this used
 * a real `values` insert, which meant the only way to watch the gate go red was
 * to insert a row into production `articles`. A gate whose red-proof damages
 * production is a gate nobody proves.
 */
const writes = [
  [
    "insert into articles",
    "insert into public.articles (slug, title) select 'ci-reach-probe', 'probe' where false",
  ],
  ["update case_studies", "update public.case_studies set title = title where false"],
  ["delete from articles", "delete from public.articles where false"],
];
for (const [label, statement] of writes) {
  try {
    await sql.query(statement);
    failures.push(`${label} was PERMITTED`);
    console.log(`  FAIL    ${label} was permitted — this credential can write production content`);
  } catch (e) {
    console.log(`  OK      ${label} refused (${e.code ?? "error"})`);
  }
}

/** Must be refused: the tables holding hashes, leads and conversations. */
for (const table of ["users", "submissions", "assistant_transcripts"]) {
  try {
    await sql.query(`select count(*) from public.${table}`);
    failures.push(`can read ${table}`);
    console.log(`  FAIL    can read ${table} — hashes, leads or conversations are in CI's reach`);
  } catch (e) {
    console.log(`  OK      cannot read ${table} (${e.code ?? "error"})`);
  }
}

if (failures.length) {
  console.error(
    `\n${failures.length} assertion(s) failed. The CI credential is not the read-only role R-25b.1 requires:\n  ${failures.join("\n  ")}\n\nRe-run scripts/db-grant-ci-reader.mjs and reset the DATABASE_URL_CI_READER secret.`,
  );
  process.exit(1);
}
console.log("\nThe CI credential reads content, writes nothing, and cannot see users, submissions or transcripts.");
