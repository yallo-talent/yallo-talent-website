#!/usr/bin/env node
// Ops read path for the write-only `submissions` backstop —
// context-round14-scope.md §2.6: the table has no read path, so nobody can
// tell which leads did not arrive at the exact moment that matters (Resend
// down). Least-overclaiming fix: a script an operator runs from a shell
// they already have DATABASE_URL access to. No admin route, no
// authentication surface, no new page — who may read lead data stays a
// decision Sumeet takes explicitly, not one this script makes for him.
//
//   DATABASE_URL=postgres://... pnpm db:read-submissions [--limit 20] [--endpoint brief|cv]
import { neon } from "@neondatabase/serverless";

const arg = (n, d) => {
  const i = process.argv.indexOf(`--${n}`);
  return i > -1 ? process.argv[i + 1] : d;
};

const limit = Number.parseInt(arg("limit", "20"), 10);
const endpoint = arg("endpoint", null);

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set.");
    process.exit(1);
  }
  if (endpoint && !["brief", "cv"].includes(endpoint)) {
    console.error('--endpoint must be "brief" or "cv".');
    process.exit(1);
  }

  const sql = neon(url);
  const rows = endpoint
    ? await sql`
        select id, endpoint, payload, origin_source, referrer, delivery_status, created_at
        from submissions
        where endpoint = ${endpoint}
        order by created_at desc
        limit ${limit}
      `
    : await sql`
        select id, endpoint, payload, origin_source, referrer, delivery_status, created_at
        from submissions
        order by created_at desc
        limit ${limit}
      `;

  if (rows.length === 0) {
    console.log("No submissions found.");
    return;
  }

  for (const row of rows) {
    const who = row.payload?.email ?? row.payload?.name ?? "(no name/email in payload)";
    const company = row.payload?.company ? ` · ${row.payload.company}` : "";
    const delivery = Object.entries(row.delivery_status ?? {})
      .map(([channel, outcome]) => `${channel}: ${outcome.delivered ? "delivered" : `FAILED (${outcome.error ?? "unknown"})`}`)
      .join(", ") || "no delivery attempt recorded";

    console.log(
      `${new Date(row.created_at).toISOString()}  ${row.endpoint.padEnd(6)} ${who}${company}\n` +
        `  id: ${row.id}  source: ${row.origin_source ?? "—"}  referrer: ${row.referrer ?? "—"}\n` +
        `  delivery: ${delivery}\n`,
    );
  }

  console.log(`${rows.length} row(s)${endpoint ? ` (endpoint: ${endpoint})` : ""}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
