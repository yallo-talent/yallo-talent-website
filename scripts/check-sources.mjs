#!/usr/bin/env node
/**
 * Canon §6 as a nightly sweep: no PUBLISHED article or case study carries a
 * figure that no `sources` entry accounts for.
 *
 * ROUND 25 REPOINTED THIS AT THE DATABASE, AND IT DID NOT RETIRE. Canon A1 moved
 * these two content types out of `content/**`, so the corpus this gate walked no
 * longer exists. That is a reason to change where it looks, not a reason to
 * delete it: A2 puts the same rule in the publish action, and design §7 asks for
 * a nightly re-validation of everything published because publish-time
 * enforcement only ever sees the moment of publishing. A figure can become
 * unsourced afterwards — a source row edited away, a body restored from an older
 * revision — and nothing at publish time can see that.
 *
 * ONE DETECTOR, STILL. `src/lib/unsourced-figures.mjs` is shared with
 * `src/lib/admin/content-validation.ts`, so the sweep and the refusal cannot
 * disagree about what a figure is. Round 24 extracted it for exactly this
 * reason and round 25 §5 restates the rule.
 *
 * THE SELF-TEST IS THE POINT WHEN THE CORPUS IS CLEAN. With every article
 * unpublished and nine case studies that carry no unsourced figures, the bare
 * gate is a trivial pass — it would report green having checked nothing that
 * could fail. `--selftest` writes a row that MUST fail, asserts it does, and
 * removes it, so a detector that has gone blind cannot pass by finding nothing.
 * The fixture is a database row rather than a file now; it is inserted, read
 * back through the same scan the real corpus goes through, and deleted on every
 * exit path including a signal.
 *
 * WITHOUT DATABASE_URL it reports that it did not run and exits non-zero rather
 * than passing. A gate that cannot reach its subject has not checked it, and
 * "no connection string" is a CI configuration defect rather than a clean run.
 *
 * Usage:
 *   node scripts/check-sources.mjs [--selftest]
 */
import { Pool } from "@neondatabase/serverless";
import { unsourcedFigures } from "../src/lib/unsourced-figures.mjs";
import { docToText } from "../src/lib/tiptap/text.mjs";

const FIXTURE_SLUG = "__check-sources-fixture";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error(
    "check:sources DID NOT RUN: DATABASE_URL is not set.\n" +
      "  Articles and case studies live in the database since canon A1, so this gate\n" +
      "  has nothing to read without a connection string. Reporting a non-run rather\n" +
      "  than a pass: a gate that checked nothing has not checked anything.",
  );
  process.exit(1);
}

const pool = new Pool({ connectionString: url });

async function removeFixture() {
  try {
    await pool.query("delete from articles where slug = $1", [FIXTURE_SLUG]);
  } catch {
    /* Nothing to clean, or the connection is already gone. */
  }
}

/** Every published row of both types, with its body reduced to prose. */
async function scan() {
  const failures = [];
  let published = 0;
  let drafts = 0;

  for (const [table, kind] of [
    ["articles", "article"],
    ["case_studies", "case study"],
  ]) {
    const all = await pool.query(`select slug, status, body, sources from ${table}`);
    for (const row of all.rows) {
      if (row.status !== "published") {
        drafts += 1;
        continue;
      }
      published += 1;
      const figures = unsourcedFigures(docToText(row.body), row.sources ?? []);
      if (figures.length) failures.push({ file: `${kind} ${row.slug}`, figures });
    }
  }

  return { failures, published, drafts };
}

async function runSelfTest() {
  /* A published row carrying two figures no `sources` entry accounts for, and
     one that is accounted for, so the fixture proves the gate discriminates
     rather than merely flagging any body with digits in it. */
  const body = {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Yallo sends 2:1 CVs per interview. An unsourced 63% and an unsourced 1,400 both appear in this sentence, and neither has a matching sources entry.",
          },
        ],
      },
    ],
  };
  await pool.query(
    `insert into articles (slug, title, summary, body, status, sources)
     values ($1, 'Gate fixture, deleted by the gate that wrote it', 'Fixture', $2, 'published', $3)
     on conflict (lower(slug)) do update set body = excluded.body, status = 'published'`,
    [
      FIXTURE_SLUG,
      JSON.stringify(body),
      JSON.stringify([{ claim: "2:1 CVs per interview", source: "content/metrics.yaml" }]),
    ],
  );

  const { failures } = await scan();
  const hit = failures.find((f) => f.file === `article ${FIXTURE_SLUG}`);
  await removeFixture();

  if (!hit) {
    console.error(
      "SELFTEST FAILED: the fixture carries two unsourced figures and the gate passed it.",
    );
    process.exit(1);
  }
  const missing = ["63%", "1,400"].filter((f) => !hit.figures.includes(f));
  if (missing.length) {
    console.error(
      `SELFTEST FAILED: the gate flagged ${JSON.stringify(hit.figures)} and missed ${missing.join(", ")}.`,
    );
    process.exit(1);
  }
  if (hit.figures.includes("2:1") || hit.figures.includes("2")) {
    console.error(
      `SELFTEST FAILED: the sourced figure was flagged too — ${JSON.stringify(hit.figures)}.`,
    );
    process.exit(1);
  }
  console.log(
    `Self-test passed: the fixture failed on ${hit.figures.join(", ")}, the sourced figure was not flagged, and the fixture row is deleted.`,
  );
}

/* Teardown on every exit path. A gate that leaves a published row behind when it
   is killed is a gate that publishes content, which this round forbids. */
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, async () => {
    await removeFixture();
    process.exit(signal === "SIGINT" ? 130 : 143);
  });
}
process.on("uncaughtException", async (error) => {
  await removeFixture();
  console.error(error);
  process.exit(1);
});

if (process.argv.includes("--selftest")) await runSelfTest();

const { failures, published, drafts } = await scan();
await removeFixture();
await pool.end();

if (failures.length) {
  console.error(
    "Published content carrying a figure with no matching `sources` entry.",
  );
  console.error(
    "Canon §6: no figure appears anywhere without a source. Add the source, or take the figure out.\n",
  );
  for (const { file, figures } of failures) {
    console.error(`  ${file}`);
    for (const figure of figures) console.error(`      ${figure}`);
  }
  process.exit(1);
}

console.log(
  `Sources clean: ${published} published piece(s) checked, ${drafts} draft(s) exempt.`,
);
