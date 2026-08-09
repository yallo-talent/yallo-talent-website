#!/usr/bin/env node
/**
 * The one-way import: `content/insights/**` and `content/case-studies/**` into
 * the database, per round 25 §2 and canon A1.
 *
 * IT MOVES WHAT EXISTS AND NOTHING ELSE. No value is improved, normalised,
 * back-filled or invented on the way through. Several imported rows therefore
 * carry taxonomy values that are not in the live indexes ("hiring", "delivery",
 * "data-ai") and categories that are not in the design's fixed list. That is
 * correct: all 21 articles arrive unpublished and stay unpublished, and the
 * publish action is where those values have to become real. An import that
 * "tidied" them would be an import that authored content.
 *
 * IDEMPOTENT, BY SLUG. Re-running updates the row rather than duplicating it,
 * so a verification failure can be fixed and the import re-run without a manual
 * clean-up step that would itself need verifying. `--dry-run` writes nothing.
 *
 * IT WRITES ONE REVISION PER ROW. The revision record is what replaces git
 * history for these two types, so the imported state has to be the first entry
 * in it rather than a state with no history at all.
 *
 * Usage:
 *   node --env-file=.env.local scripts/import-content.mjs [--dry-run]
 */

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { Pool } from "@neondatabase/serverless";
import matter from "gray-matter";
import { parse as parseYaml } from "yaml";
import { markdownToTiptap } from "../src/lib/tiptap/from-markdown.mjs";
import { readingTimeMinutes, wordCount } from "../src/lib/tiptap/text.mjs";

const DRY = process.argv.includes("--dry-run");
const ROOT = join(process.cwd(), "content");
const INSIGHTS = join(ROOT, "insights");
const STUDIES = join(ROOT, "case-studies");

const notes = [];
const report = (slug) => (note) => notes.push(`${slug}: ${note}`);

function readAll(dir) {
  return readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .sort()
    .map((f) => {
      const slug = f.replace(/\.mdx$/, "");
      const { data, content } = matter(readFileSync(join(dir, f), "utf8"));
      return { slug, frontmatter: data, body: content };
    });
}

/** Frontmatter dates parse as Date; the column wants a timestamptz or null. */
function toDate(value) {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    return new Date(value).toISOString();
  }
  return null;
}

const arr = (v) => (Array.isArray(v) ? v.map(String) : v == null ? [] : [String(v)]);

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set.");
    process.exit(1);
  }
  const pool = new Pool({ connectionString: url });

  const order = parseYaml(readFileSync(join(STUDIES, "order.yaml"), "utf8")).order ?? [];

  const insights = readAll(INSIGHTS);
  const studies = readAll(STUDIES);

  console.log(`${insights.length} article(s), ${studies.length} case study/studies to import.`);

  let wrote = 0;

  for (const { slug, frontmatter: fm, body } of insights) {
    const doc = markdownToTiptap(body, report(slug));
    /* published: false on every one of them today, and they stay that way. */
    const status = fm.published === true ? "published" : "draft";
    const date = toDate(fm.date);
    const computed = readingTimeMinutes(doc);
    if (fm.readingTimeMinutes && fm.readingTimeMinutes !== computed) {
      report(slug)(
        `reading time ${fm.readingTimeMinutes} in frontmatter, ${computed} computed — computed wins, design §4`,
      );
    }
    if (DRY) continue;
    const res = await pool.query(
      `insert into articles
         (slug, title, summary, category, body, status, industry, platform, discipline,
          sources, reading_time_minutes, word_count, published_at, first_published_at, created_at)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14, coalesce($13, now()))
       on conflict (lower(slug)) do update set
         title = excluded.title, summary = excluded.summary, category = excluded.category,
         body = excluded.body, status = excluded.status,
         industry = excluded.industry, platform = excluded.platform,
         discipline = excluded.discipline, sources = excluded.sources,
         reading_time_minutes = excluded.reading_time_minutes,
         word_count = excluded.word_count, updated_at = now()
       returning id`,
      [
        slug,
        String(fm.title ?? ""),
        String(fm.summary ?? ""),
        String(fm.category ?? ""),
        JSON.stringify(doc),
        status,
        arr(fm.industry),
        arr(fm.platform),
        arr(fm.discipline),
        JSON.stringify(fm.sources ?? []),
        computed,
        wordCount(doc),
        status === "published" ? date : null,
        status === "published" ? date : null,
      ],
    );
    await pool.query(
      `insert into content_revisions (content_type, content_id, title, summary, body, author_name)
       values ('article', $1, $2, $3, $4, 'Imported from content/insights')`,
      [res.rows[0].id, String(fm.title ?? ""), String(fm.summary ?? ""), JSON.stringify(doc)],
    );
    wrote++;
  }

  for (const { slug, frontmatter: fm, body } of studies) {
    const doc = markdownToTiptap(body, report(slug));
    const status = fm.published === false ? "draft" : "published";
    const date = toDate(fm.date);
    /* order.yaml decides the order, and it must survive the import exactly.
       A slug not named there appends behind those named, which is what
       src/lib/case-study-order.ts already does with the same rule. */
    const idx = order.indexOf(slug);
    const position = idx === -1 ? 1000 + studies.findIndex((s) => s.slug === slug) : idx;
    if (DRY) continue;
    const res = await pool.query(
      `insert into case_studies
         (slug, title, summary, category, body, status, industry, platform, discipline,
          sources, client, client_public, platform_label, engagement, region, deck, source_url,
          card_title, excerpt, outcome, metrics, position,
          reading_time_minutes, word_count, published_at, first_published_at)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$25)
       on conflict (lower(slug)) do update set
         title = excluded.title, summary = excluded.summary, category = excluded.category,
         body = excluded.body, status = excluded.status, sources = excluded.sources,
         client = excluded.client, client_public = excluded.client_public,
         platform_label = excluded.platform_label, engagement = excluded.engagement,
         region = excluded.region, deck = excluded.deck, source_url = excluded.source_url,
         card_title = excluded.card_title, excerpt = excluded.excerpt,
         outcome = excluded.outcome, metrics = excluded.metrics, position = excluded.position,
         reading_time_minutes = excluded.reading_time_minutes,
         word_count = excluded.word_count, updated_at = now()
       returning id`,
      [
        slug,
        String(fm.title ?? ""),
        String(fm.summary ?? ""),
        String(fm.category ?? ""),
        JSON.stringify(doc),
        status,
        arr(fm.industry),
        [],
        arr(fm.discipline),
        JSON.stringify(fm.sources ?? []),
        String(fm.client ?? ""),
        fm.clientPublic === true,
        fm.platform == null ? null : String(fm.platform),
        fm.engagement == null ? null : String(fm.engagement),
        fm.region == null ? null : String(fm.region),
        fm.deck == null ? null : String(fm.deck),
        fm.sourceUrl == null ? null : String(fm.sourceUrl),
        fm.cardTitle == null ? null : String(fm.cardTitle),
        fm.excerpt == null ? null : String(fm.excerpt),
        fm.outcome == null ? null : String(fm.outcome),
        JSON.stringify(fm.metrics ?? []),
        position,
        readingTimeMinutes(doc),
        wordCount(doc),
        date,
      ],
    );
    await pool.query(
      `insert into content_revisions (content_type, content_id, title, summary, body, author_name)
       values ('case_study', $1, $2, $3, $4, 'Imported from content/case-studies')`,
      [res.rows[0].id, String(fm.title ?? ""), String(fm.summary ?? ""), JSON.stringify(doc)],
    );
    wrote++;
  }

  await pool.end();
  console.log(DRY ? "Dry run: nothing written." : `Wrote ${wrote} row(s).`);
  if (notes.length) {
    console.log(`\n${notes.length} conversion note(s):`);
    for (const n of notes) console.log(`  ${n}`);
  } else {
    console.log("\nNo conversion notes: nothing was flattened, dropped or recomputed.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
