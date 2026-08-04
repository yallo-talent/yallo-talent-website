#!/usr/bin/env node
// Applies pending .sql files from src/lib/db/migrations, tracked by name in
// a _migrations table. Requires DATABASE_URL in the environment:
//   DATABASE_URL=postgres://... pnpm db:migrate
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Pool } from "@neondatabase/serverless";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(
  __dirname,
  "..",
  "src",
  "lib",
  "db",
  "migrations",
);

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set.");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: url });
  await pool.query(`
    create table if not exists _migrations (
      name text primary key,
      applied_at timestamptz not null default now()
    );
  `);

  const appliedRows = await pool.query("select name from _migrations");
  const applied = new Set(appliedRows.rows.map((r) => r.name));

  const files = (await readdir(migrationsDir))
    .filter((f) => f.endsWith(".sql"))
    .sort();

  let ran = 0;
  for (const file of files) {
    if (applied.has(file)) continue;
    const text = await readFile(path.join(migrationsDir, file), "utf8");
    console.log(`Applying ${file}...`);
    await pool.query(text);
    await pool.query("insert into _migrations (name) values ($1)", [file]);
    ran += 1;
  }

  await pool.end();
  console.log(ran === 0 ? "No pending migrations." : `Applied ${ran} migration(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
