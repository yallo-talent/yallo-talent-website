#!/usr/bin/env node
// Deletes assistant_transcripts rows older than the stated retention
// window (src/lib/assistant/retention.json). Run on a schedule — see
// .github/workflows/purge-transcripts.yml — never on a request path.
// Requires DATABASE_URL in the environment:
//   DATABASE_URL=postgres://... pnpm db:purge-transcripts
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";

// READ, not re-typed. This was "kept equal to src/lib/db/transcripts.ts by
// hand", which is the copied-value defect this repository has now found nine
// times — and the one place it is least affordable, because the copy that
// drifts here does not render something wrong, it deletes the wrong rows.
// A plain Node script cannot import a `.ts` module through the `@/` alias,
// so the number lives in JSON that both sides read, the same arrangement
// src/lib/mark-surfaces.json already uses across this boundary.
const RETENTION_DAYS = JSON.parse(
  readFileSync(
    path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      "..",
      "src",
      "lib",
      "assistant",
      "retention.json",
    ),
    "utf8",
  ),
).transcriptRetentionDays;

if (!Number.isFinite(RETENTION_DAYS) || RETENTION_DAYS <= 0) {
  // Refuse rather than fall back. A missing or malformed window would make
  // the interval below `now() - null`, and a delete with a null predicate is
  // the failure mode that must never run unattended.
  console.error(
    `Refusing to purge: retention.json gave an unusable window (${RETENTION_DAYS}).`,
  );
  process.exit(1);
}

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
