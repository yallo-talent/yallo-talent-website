#!/usr/bin/env node
/**
 * Create and maintain `ci_reader`: the role CI connects as.
 *
 * R-25b.1. Until now the `full` CI job held the production connection string,
 * which is a role that can write every content table. Nothing in CI wants to
 * write; the isolation and sources gates read. A leaked workflow log or a
 * compromised action therefore had production write access for no benefit at
 * all. This creates a role with `CONNECT` and `SELECT` and nothing else, so the
 * worst a CI credential can do is read rows that are already published.
 *
 * WHY NOT `pg_read_all_data`, AND WHY NOT `GRANT SELECT ON ALL TABLES`. Both
 * are one line, and both hand CI the `users` table, which is where the password
 * hashes are, plus `submissions` and `assistant_transcripts`, which are lead
 * and conversation data from real people. R-25b.1's purpose is to bound what a
 * leaked CI credential is worth, and a credential that reads every hash on the
 * estate is not bounded. So the grant is enumerated: the content tables the
 * public build prerenders from, and nothing else. A new table is invisible to
 * CI until somebody adds it here on purpose, which is a loud, safe failure.
 *
 * WHY NOT TEMP, AND WHAT STILL WRITES. Two CI steps genuinely write and both
 * keep the writing secret at STEP level, which is R-25b.1's own carve-out
 * applied to both members of its class: check:sources' self-test inserts a row
 * that must fail validation and deletes it, and check-admin-isolation's
 * role-reach half creates a fixture account per role and removes it. Everything
 * else in the job — the build, every browser gate — reads. This role gets no
 * `TEMP`, so a job that tries to stage anything fails rather than half-working.
 *
 * THE PASSWORD IS NEVER PRINTED. `--apply` generates it here and, with
 * `--emit-url`, writes the finished connection string to a 0600 file for
 * `gh secret set` to read on stdin. Nothing echoes it to a terminal, a shell
 * history or a session transcript, so the only copies are the file the caller
 * deletes and the encrypted secret.
 *
 * Reversible: `drop owned by ci_reader; drop role ci_reader;`
 *
 * Run with the OWNER connection string:
 *   node --env-file=.env.local scripts/db-grant-ci-reader.mjs --inspect
 *   node --env-file=.env.local scripts/db-grant-ci-reader.mjs --apply --emit-url /path/to/url
 */

import { randomBytes } from "node:crypto";
import { writeFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

const ROLE = "ci_reader";

/**
 * The tables the public build reads while it prerenders, and nothing else.
 * `users`, `submissions` and `assistant_transcripts` are deliberately absent:
 * hashes, leads and conversations are not CI's business.
 */
const READABLE = [
  "articles",
  "case_studies",
  "content_revisions",
  "content_redirects",
  "content_audit",
  "media_assets",
  "_migrations",
];
const mode = process.argv.includes("--apply") ? "apply" : "inspect";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set.");
  process.exit(2);
}
const sql = neon(url);
const parsed = new URL(url);

const who = await sql`select current_user, current_database()`;
const db = who[0].current_database;
console.log(`host     ${parsed.host}`);
console.log(`database ${db}`);
console.log(`as       ${who[0].current_user}\n`);

if (mode === "apply") {
  const emitIndex = process.argv.indexOf("--emit-url");
  const emitPath = emitIndex > -1 ? process.argv[emitIndex + 1] : null;
  const password = randomBytes(24).toString("base64url");
  /* Tagged-template interpolation is a bound parameter, and neither CREATE ROLE
     nor GRANT accepts one; a DO block accepts no parameters either, which is
     what the first attempt at this discovered. So the password is interpolated,
     and the assertion below is what makes that safe rather than a habit:
     base64url is [A-Za-z0-9_-], which contains no quote, backslash or
     semicolon, so there is nothing in it that can end the literal. If the
     generator ever changes alphabet this stops rather than building an
     injectable statement. */
  if (!/^[A-Za-z0-9_-]{24,}$/.test(password)) {
    console.error("Generated password left the base64url alphabet. Refusing to interpolate it.");
    process.exit(1);
  }
  const already = await sql`select 1 from pg_roles where rolname = ${ROLE}`;
  await sql.query(
    already.length
      ? `alter role ${ROLE} with login password '${password}'`
      : `create role ${ROLE} login password '${password}'`,
  );

  /* NO `alter role ... nosuperuser nocreatedb nobypassrls` HERE. Those three
     attributes may only be changed by a superuser, and Neon's `neondb_owner`
     is not one, so the statement fails with 42501 and leaves the role created
     but ungranted. It is also unnecessary: CREATE ROLE defaults every one of
     them to off. Asserting them below is strictly better than setting them,
     because the assertion also catches somebody granting them later. */
  await sql.query(`revoke all on database ${db} from ${ROLE}`);
  await sql.query(`grant connect on database ${db} to ${ROLE}`);
  await sql.query(`revoke all on schema public from ${ROLE}`);
  await sql.query(`grant usage on schema public to ${ROLE}`);
  await sql.query(`revoke all on all tables in schema public from ${ROLE}`);
  await sql.query(`revoke all on all sequences in schema public from ${ROLE}`);
  /* No `alter default privileges`: a table created after this runs must be
     added to READABLE deliberately, not inherited into CI's reach by accident. */
  for (const table of READABLE) {
    await sql.query(`grant select on table public.${table} to ${ROLE}`);
  }
  console.log(`Applied. ${ROLE} has CONNECT and SELECT and nothing else.\n`);

  if (emitPath) {
    const out = new URL(url);
    out.username = ROLE;
    out.password = password;
    writeFileSync(emitPath, out.toString(), { mode: 0o600 });
    console.log(`Connection string written to ${emitPath} (mode 0600). Delete it after use.\n`);
  }
}

const exists = await sql`select rolname, rolcanlogin, rolsuper, rolcreaterole, rolcreatedb, rolbypassrls
                         from pg_roles where rolname = ${ROLE}`;
if (exists.length === 0) {
  console.log(`${ROLE} does not exist.`);
  process.exit(mode === "apply" ? 1 : 0);
}
console.log(`${ROLE} attributes:`, exists[0]);

const forbidden = ["rolsuper", "rolcreaterole", "rolcreatedb", "rolbypassrls"].filter(
  (a) => exists[0][a],
);
if (forbidden.length) {
  console.error(`\n${ROLE} carries attributes it must not have: ${forbidden.join(", ")}`);
  process.exit(1);
}
if (!exists[0].rolcanlogin) {
  console.error(`\n${ROLE} cannot log in, so CI cannot use it.`);
  process.exit(1);
}

const privs = await sql`
  select table_name, string_agg(distinct privilege_type, ',' order by privilege_type) as granted
  from information_schema.table_privileges
  where grantee = ${ROLE} and table_schema = 'public'
  group by table_name order by table_name`;
console.log(`\n${ROLE} table privileges in public:`);
for (const r of privs) console.log(`  ${r.table_name.padEnd(24)} ${r.granted}`);

const nonSelect = privs.filter((r) => r.granted !== "SELECT");
if (nonSelect.length) {
  console.error(
    `\n${nonSelect.length} table(s) grant more than SELECT: ${nonSelect.map((r) => r.table_name).join(", ")}`,
  );
  process.exit(1);
}

/* The negative half, and it is the half that matters. A grant list that is
   right today drifts silently; a table holding hashes or lead data appearing
   in CI's reach must fail loudly. Every table in the schema that is not on
   READABLE must be absent from the grant list. */
const granted = new Set(privs.map((r) => r.table_name));
const all = await sql`select table_name from information_schema.tables
                      where table_schema = 'public' and table_type = 'BASE TABLE'`;
const leaked = all.map((r) => r.table_name).filter((t) => granted.has(t) && !READABLE.includes(t));
if (leaked.length) {
  console.error(`\n${ROLE} can read tables it must not: ${leaked.sort().join(", ")}`);
  process.exit(1);
}
const outOfReach = all
  .map((r) => r.table_name)
  .filter((t) => !READABLE.includes(t))
  .sort();
console.log(`\nOut of reach, asserted: ${outOfReach.join(", ") || "(none)"}`);
console.log(`Every grant is SELECT only, across ${privs.length} table(s).`);
