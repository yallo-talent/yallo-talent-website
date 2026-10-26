---
paths:
  - "src/lib/db/migrations/**"
  - "scripts/db-*"
  - "src/lib/db/**"
---
# Database migrations (R-27.3(a))

Moved verbatim from `AGENTS.md` § Ground rules on 26 Oct 2026; the one-line form stays in `AGENTS.md` § 8, rule 2.

- **The deploy runs no migrations. `pnpm db:migrate` runs against the production database BEFORE any migration merges** (R-27.3(a)). Nothing in the App Platform spec applies a `.sql` file, so a merged migration that nobody ran by hand is a schema the code expects and the database does not have, and the first request that needs it is where you find out.
- The order is therefore: write the migration, apply it out of band, verify its `_migrations` row, and only then open the pull request.
- Every migration is written to survive being applied twice (`if not exists`, `add column if not exists`), because the same file is applied by hand against production and again by `db:migrate` on a fresh database.
- `0008_transcript_origin_index.sql` is the first migration to travel this path and is the worked example.
- **Open item, carried:** a pre-deploy job in the app spec that would make this mechanical rather than remembered. Dropped from round 27 for time, not decided against.
