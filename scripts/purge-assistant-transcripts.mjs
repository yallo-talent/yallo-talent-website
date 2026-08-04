#!/usr/bin/env node
// Deletes assistant_transcripts rows older than the stated retention
// window (12 months, src/lib/db/transcripts.ts). Run on a schedule — see
// .github/workflows/purge-transcripts.yml — never on a request path.
// Requires DATABASE_URL in the environment:
//   DATABASE_URL=postgres://... pnpm db:purge-transcripts
import { neon } from "@neondatabase/serverless";

// Kept equal to src/lib/db/transcripts.ts's TRANSCRIPT_RETENTION_DAYS by
// hand — this script runs as plain Node outside the Next.js path-aliased
// build, the same reason db-migrate.mjs re-implements its own connection
// rather than importing src/lib/db/client.ts.
const RETENTION_DAYS = 365;

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set.");
    process.exit(1);
  }

  const sql = neon(url);
  const deleted = await sql`
    delete from assistant_transcripts
    where created_at < now() - interval '1 day' * ${RETENTION_DAYS}
    returning id
  `;

  console.log(
    deleted.length === 0
      ? "No transcripts past retention."
      : `Purged ${deleted.length} transcript row(s) older than ${RETENTION_DAYS} days.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
