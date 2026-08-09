import "server-only";
import { Pool } from "@neondatabase/serverless";
import { revalidatePath, updateTag } from "next/cache";
import type { Signed } from "@/lib/admin/guard";
import { taxonomyLandingPath } from "@/lib/content-seo";
import { CONTENT_TAGS } from "@/lib/db/content";
import { normaliseHeadings } from "@/lib/tiptap/schema.mjs";
import { readingTimeMinutes, wordCount } from "@/lib/tiptap/text.mjs";

/**
 * Every write to `articles` and `case_studies`, and the revalidation that makes
 * it visible.
 *
 * ONE TRANSACTION, THEN REVALIDATION. Design §3: a publish writes the row and
 * calls on-demand revalidation for the article route, the index, the taxonomy
 * surfaces, the homepage rail, the sitemap and `llms.txt`. The write is one
 * transaction so a publish that fails halfway leaves no half-published row, and
 * the revalidation is AFTER the commit rather than inside it: invalidating a
 * cache for a write that then rolls back would serve a page that never existed.
 *
 * A POOL, NOT THE `neon()` HTTP CLIENT. `src/lib/db/client.ts` is the HTTP
 * driver, which cannot hold a transaction across statements — every call is its
 * own round trip. Reads use it and are right to. A publish writes the content
 * row, a revision row and an audit row, and those three either all land or none
 * do, so this module opens a pooled connection and uses a real BEGIN.
 *
 * EVERY WRITE LEAVES A REVISION AND AN AUDIT ROW. The revision record is what
 * replaces git history under canon A1, so a save that skipped it would be a save
 * with no history at all; the audit row is design §10, required rather than
 * deferred, because with four roles "who published that" must have an answer.
 *
 * NOTHING HERE DELETES. `archived` is the terminal status. There is no delete
 * path in this module and no caller can construct one.
 */

export type ContentType = "article" | "case_study";

const TABLE: Record<ContentType, string> = {
  article: "articles",
  case_study: "case_studies",
};

const ROUTE: Record<ContentType, string> = {
  article: "/insights",
  case_study: "/case-studies",
};

function pool(): Pool {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set.");
  return new Pool({ connectionString: url });
}

/**
 * The surfaces a change to one piece can reach.
 *
 * DELIBERATELY WIDER THAN THE PIECE. A published article changes its own route,
 * the index, every taxonomy archive it is tagged with, the sitemap, `llms.txt`
 * and — for a case study — the homepage rail. Revalidating only the piece is how
 * an index goes stale while the article itself looks fine, which is the failure
 * nobody notices until a reader does.
 */
function revalidateFor(type: ContentType, slug: string, taxonomy: string[][]) {
  /* `updateTag`, not `revalidateTag`. Next 16 splits the two: revalidateTag
     expires a tag against a cache-life profile, and updateTag gives
     read-your-own-writes semantics inside a Server Action. A publisher who
     clicks Publish and is shown the old page has been told their publish did
     not work, so this is the one that matches what the button promises. */
  updateTag(
    type === "article" ? CONTENT_TAGS.articles : CONTENT_TAGS.caseStudies,
  );
  revalidatePath(`${ROUTE[type]}/${slug}`);
  revalidatePath(ROUTE[type]);
  revalidatePath("/sitemap.xml");
  revalidatePath("/llms.txt");
  if (type === "case_study") revalidatePath("/");
  /* The PUBLIC segment, not the internal kind. The third pillar is `discipline`
     in the column and `capabilities` in the URL, so revalidating by kind would
     have refreshed a path that does not exist and left the live one stale. */
  const kinds = ["industry", "platform", "discipline"] as const;
  kinds.forEach((kind, i) => {
    for (const value of taxonomy[i] ?? []) {
      revalidatePath(taxonomyLandingPath(kind, value));
    }
  });
}

export interface SaveInput {
  type: ContentType;
  id?: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  body: unknown;
  industry: string[];
  platform: string[];
  discipline: string[];
  sources: unknown;
  metaTitle: string | null;
  metaDescription: string | null;
  /* The other half of design §6's first-class SEO fields. Same null-versus-
     empty-string contract as the two above: null means "derive it". */
  canonicalUrl: string | null;
  ogImageUrl: string | null;
}

/**
 * Save a draft. NEVER BLOCKED by the publish rules.
 *
 * Canon A2 is explicit that saving a draft is never blocked and publishing is.
 * A writer mid-sentence must not be arguing with a validator, and a draft with a
 * half-written figure is a draft rather than a broken page.
 */
export async function saveDraft(
  input: SaveInput,
  actor: Signed,
): Promise<string> {
  const db = pool();
  try {
    const client = await db.connect();
    try {
      await client.query("begin");
      const table = TABLE[input.type];
      const body = normaliseHeadings(input.body);
      const reading = readingTimeMinutes(body);
      const words = wordCount(body);
      const values = [
        input.slug,
        input.title,
        input.summary,
        input.category,
        JSON.stringify(body),
        input.industry,
        input.platform,
        input.discipline,
        JSON.stringify(input.sources ?? []),
        input.metaTitle,
        input.metaDescription,
        input.canonicalUrl,
        input.ogImageUrl,
        reading,
        words,
      ];
      let id = input.id;
      if (id) {
        await client.query(
          `update ${table} set slug=$1, title=$2, summary=$3, category=$4, body=$5,
             industry=$6, platform=$7, discipline=$8, sources=$9,
             meta_title=$10, meta_description=$11,
             canonical_url=$12, og_image_url=$13,
             reading_time_minutes=$14, word_count=$15,
             updated_at=now(), updated_by=null
           where id=$16`,
          [...values, id],
        );
      } else {
        const res = await client.query(
          `insert into ${table}
             (slug, title, summary, category, body, industry, platform, discipline,
              sources, meta_title, meta_description, canonical_url, og_image_url,
              reading_time_minutes, word_count, status)
           values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,'draft')
           returning id`,
          values,
        );
        id = String(res.rows[0].id);
      }
      await client.query(
        `insert into content_revisions
           (content_type, content_id, title, summary, body, author_name)
         values ($1,$2,$3,$4,$5,$6)`,
        [
          input.type,
          id,
          input.title,
          input.summary,
          JSON.stringify(body),
          actor.name || actor.email,
        ],
      );
      await client.query(
        `insert into content_audit (content_type, content_id, action, actor_email, actor_role)
         values ($1,$2,'save',$3,$4)`,
        [input.type, id, actor.email, actor.role],
      );
      await client.query("commit");
      return id as string;
    } catch (err) {
      await client.query("rollback");
      throw err;
    } finally {
      client.release();
    }
  } finally {
    await db.end();
  }
}

/**
 * Save only the body, which is what autosave does every few seconds.
 *
 * SEPARATE FROM `saveDraft` BECAUSE IT MUST NOT TOUCH ANYTHING ELSE. The
 * editor holds the body; the metadata form holds the title, the summary and
 * the taxonomy. An autosave that wrote the whole row would race the person
 * typing in the other form and win, silently reverting whatever they had not
 * yet submitted. So this writes one column, plus the two that are COMPUTED
 * from it and must never disagree with it.
 *
 * IT STILL WRITES A REVISION. That is the whole promise of "no work is ever
 * lost": if an autosave left no revision, the history would record only the
 * saves somebody remembered to make by hand.
 */
export async function saveBody(
  type: ContentType,
  id: string,
  rawBody: unknown,
  actor: Signed,
): Promise<{ words: number; minutes: number }> {
  /* THE ONE PLACE EVERY BODY PASSES THROUGH. See `normaliseHeadings` for what
     it fixes and why the editor's own default is not enough on its own. */
  const body = normaliseHeadings(rawBody);
  const words = wordCount(body);
  const minutes = readingTimeMinutes(body);
  const db = pool();
  try {
    const client = await db.connect();
    try {
      await client.query("begin");
      const table = TABLE[type];
      const res = await client.query(
        `update ${table}
            set body = $1, word_count = $2, reading_time_minutes = $3,
                updated_at = now()
          where id = $4
        returning title, summary, status, slug, industry, platform, discipline`,
        [JSON.stringify(body), words, minutes, id],
      );
      if (res.rowCount === 0) throw new Error("No such piece.");
      const row = res.rows[0];
      await client.query(
        `insert into content_revisions
           (content_type, content_id, title, summary, body, author_name)
         values ($1,$2,$3,$4,$5,$6)`,
        [
          type,
          id,
          row.title,
          row.summary,
          JSON.stringify(body),
          actor.name || actor.email,
        ],
      );
      await client.query("commit");
      /* A PUBLISHED piece that is edited is a LIVE page that is edited, so the
         reader-facing surfaces have to follow it. A draft reaches no reader,
         and revalidating on every autosave of one would be a cache stampede
         for nobody's benefit. */
      if (row.status === "published") {
        revalidateFor(type, String(row.slug), [
          row.industry ?? [],
          row.platform ?? [],
          row.discipline ?? [],
        ]);
      }
      return { words, minutes };
    } catch (err) {
      await client.query("rollback");
      throw err;
    } finally {
      client.release();
    }
  } finally {
    await db.end();
  }
}

/**
 * Restore a revision's body onto the live row.
 *
 * THE RESTORE IS ITSELF A REVISION. The body being replaced is written to
 * `content_revisions` by the same insert every save makes, so restoring is
 * undoable by restoring again. A restore that overwrote without recording
 * would be the one destructive act in a schema whose first principle is that
 * nothing is ever hard deleted.
 */
export async function restoreRevision(
  type: ContentType,
  id: string,
  revisionId: string,
  actor: Signed,
): Promise<void> {
  const db = pool();
  try {
    const client = await db.connect();
    try {
      await client.query("begin");
      const table = TABLE[type];
      /* The revision is re-read INSIDE the transaction and matched on its
         subject. A revision id arrives from a form, and one fetched by id
         alone would let a person restore another piece's body onto this row. */
      const rev = await client.query(
        `select body from content_revisions
          where id = $1 and content_type = $2 and content_id = $3`,
        [revisionId, type, id],
      );
      if (rev.rowCount === 0)
        throw new Error("No such revision for this piece.");
      const body = rev.rows[0].body;
      const words = wordCount(body);
      const minutes = readingTimeMinutes(body);
      const res = await client.query(
        `update ${table}
            set body = $1, word_count = $2, reading_time_minutes = $3,
                updated_at = now()
          where id = $4
        returning title, summary, status, slug, industry, platform, discipline`,
        [JSON.stringify(body), words, minutes, id],
      );
      if (res.rowCount === 0) throw new Error("No such piece.");
      const row = res.rows[0];
      await client.query(
        `insert into content_revisions
           (content_type, content_id, title, summary, body, author_name)
         values ($1,$2,$3,$4,$5,$6)`,
        [
          type,
          id,
          row.title,
          row.summary,
          JSON.stringify(body),
          actor.name || actor.email,
        ],
      );
      await client.query(
        `insert into content_audit (content_type, content_id, action, actor_email, actor_role, detail)
         values ($1,$2,'restore',$3,$4,$5)`,
        [type, id, actor.email, actor.role, JSON.stringify({ revisionId })],
      );
      await client.query("commit");
      if (row.status === "published") {
        revalidateFor(type, String(row.slug), [
          row.industry ?? [],
          row.platform ?? [],
          row.discipline ?? [],
        ]);
      }
    } catch (err) {
      await client.query("rollback");
      throw err;
    } finally {
      client.release();
    }
  } finally {
    await db.end();
  }
}

/** Move a row's status, write the revision-adjacent audit row, revalidate. */
export async function setStatus(
  type: ContentType,
  id: string,
  status: "draft" | "published" | "archived",
  actor: Signed,
): Promise<{ slug: string }> {
  const db = pool();
  try {
    const client = await db.connect();
    try {
      await client.query("begin");
      const table = TABLE[type];
      const res = await client.query(
        `update ${table}
            set status = $1,
                published_at = case when $1 = 'published' then coalesce(published_at, now()) else published_at end,
                first_published_at = case when $1 = 'published' then coalesce(first_published_at, now()) else first_published_at end,
                updated_at = now()
          where id = $2
        returning slug, industry, platform, discipline`,
        [status, id],
      );
      if (res.rowCount === 0) throw new Error("No such row.");
      await client.query(
        `insert into content_audit (content_type, content_id, action, actor_email, actor_role, detail)
         values ($1,$2,$3,$4,$5,$6)`,
        [type, id, status, actor.email, actor.role, JSON.stringify({ status })],
      );
      await client.query("commit");
      const row = res.rows[0];
      revalidateFor(type, String(row.slug), [
        row.industry ?? [],
        row.platform ?? [],
        row.discipline ?? [],
      ]);
      return { slug: String(row.slug) };
    } catch (err) {
      await client.query("rollback");
      throw err;
    } finally {
      client.release();
    }
  } finally {
    await db.end();
  }
}

/**
 * Change a published piece's slug, writing the redirect in the same
 * transaction — design §6's "slug editable before first publish, frozen after,
 * with an automatic redirect row written if it ever changes".
 *
 * THE FREEZE AND THE REDIRECT ARE ONE MECHANISM, NOT TWO. The ordinary fields
 * form cannot move a slug once `first_published_at` is set — `saveDraft` is
 * given the stored slug instead — so the only way a published URL moves is
 * through here, and the only way through here writes the redirect. A freeze
 * with a second unguarded write path is not a freeze, and a redirect that a
 * caller has to remember to write is a redirect that will be forgotten once.
 *
 * ONE TRANSACTION. A slug that moved without its redirect is a live URL that
 * 404s, and the window between two statements is exactly long enough for a
 * crawler to find it. The old path is written to `content_redirects` and the
 * row is updated together, or neither happens.
 *
 * A SLUG THAT COMES BACK CLEANS UP AFTER ITSELF. Moving a to b then b back to a
 * would otherwise leave a → b pointing at a page that is now at a: a loop. The
 * delete of any row pointing AT the new path runs inside the same transaction,
 * and it is the one delete in this module — of a redirect, never of content.
 */
export async function changeSlug(
  type: ContentType,
  id: string,
  nextSlug: string,
  actor: Signed,
): Promise<{ from: string; to: string }> {
  const db = pool();
  try {
    const client = await db.connect();
    try {
      await client.query("begin");
      const table = TABLE[type];
      const current = await client.query(
        `select slug, first_published_at from ${table} where id = $1`,
        [id],
      );
      if (current.rowCount === 0) throw new Error("No such piece.");
      const oldSlug = String(current.rows[0].slug);
      if (oldSlug === nextSlug) {
        await client.query("rollback");
        return {
          from: `${ROUTE[type]}/${oldSlug}`,
          to: `${ROUTE[type]}/${oldSlug}`,
        };
      }
      const res = await client.query(
        `update ${table} set slug = $1, updated_at = now() where id = $2
         returning industry, platform, discipline`,
        [nextSlug, id],
      );
      const fromPath = `${ROUTE[type]}/${oldSlug}`;
      const toPath = `${ROUTE[type]}/${nextSlug}`;

      /* Only a piece that has published has a URL anybody could have. A slug
         moved before first publish leaves no redirect, because there is
         nothing out there pointing at the old one. */
      if (current.rows[0].first_published_at) {
        await client.query("delete from content_redirects where to_path = $1", [
          toPath,
        ]);
        /* An earlier redirect INTO the old path now has a stale target, so it
           is repointed rather than left to two-hop. */
        await client.query(
          "update content_redirects set to_path = $1 where to_path = $2",
          [toPath, fromPath],
        );
        await client.query(
          `insert into content_redirects (from_path, to_path) values ($1,$2)
           on conflict (from_path) do update set to_path = excluded.to_path`,
          [fromPath, toPath],
        );
      }
      await client.query(
        `insert into content_audit (content_type, content_id, action, actor_email, actor_role, detail)
         values ($1,$2,'slug',$3,$4,$5)`,
        [
          type,
          id,
          actor.email,
          actor.role,
          JSON.stringify({ from: fromPath, to: toPath }),
        ],
      );
      await client.query("commit");
      const row = res.rows[0];
      updateTag(CONTENT_TAGS.redirects);
      revalidatePath(fromPath);
      revalidateFor(type, nextSlug, [
        row.industry ?? [],
        row.platform ?? [],
        row.discipline ?? [],
      ]);
      return { from: fromPath, to: toPath };
    } catch (err) {
      await client.query("rollback");
      throw err;
    } finally {
      client.release();
    }
  } finally {
    await db.end();
  }
}

/**
 * The case-study order, written in one transaction.
 *
 * ONE SAVE, NOT ONE PER ROW. Design §8. A reorder that wrote nine rows in nine
 * requests can be interrupted between the third and the fourth, and the rail
 * then renders an order nobody chose. The positions are rewritten from the
 * supplied sequence rather than swapped pairwise, so the result cannot depend on
 * what the positions were before.
 */
export async function reorderCaseStudies(
  slugsInOrder: string[],
  actor: Signed,
): Promise<void> {
  const db = pool();
  try {
    const client = await db.connect();
    try {
      await client.query("begin");
      for (let i = 0; i < slugsInOrder.length; i++) {
        await client.query(
          "update case_studies set position=$1, updated_at=now() where slug=$2",
          [i, slugsInOrder[i]],
        );
      }
      await client.query(
        `insert into content_audit (content_type, action, actor_email, actor_role, detail)
         values ('case_study','reorder',$1,$2,$3)`,
        [actor.email, actor.role, JSON.stringify({ order: slugsInOrder })],
      );
      await client.query("commit");
    } catch (err) {
      await client.query("rollback");
      throw err;
    } finally {
      client.release();
    }
  } finally {
    await db.end();
  }
  updateTag(CONTENT_TAGS.caseStudies);
  revalidatePath("/case-studies");
  revalidatePath("/");
}
