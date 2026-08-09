import "server-only";
import type { Signed } from "@/lib/admin/guard";
import { sql } from "@/lib/db/client";
import type { ContentType } from "@/lib/db/content-write";

/**
 * Reading `content_revisions`, which is what replaces git history under canon
 * A1 and is the reason "no git copy" is safe.
 *
 * READS ONLY. Restoring is a WRITE and lives in `content-write.ts` with every
 * other write, inside the transaction that also records the revision the
 * restore itself creates. A restore that did not write a revision would be the
 * one edit in the system with no history, which is precisely the edit somebody
 * later needs to undo.
 *
 * THE BODY IS NOT FETCHED FOR THE LIST. A revision row carries a whole document
 * and every save writes one, so a piece worked on for a morning has hundreds.
 * The list needs a date, an author and a size; the body is fetched for the one
 * revision a person actually opens.
 */

export interface RevisionSummary {
  id: string;
  title: string;
  summary: string;
  authorName: string;
  createdAt: string;
  /** Characters of stored JSON. A cheap, honest "how much was there". */
  bytes: number;
}

export async function revisionsFor(
  type: ContentType,
  contentId: string,
  limit = 50,
): Promise<RevisionSummary[]> {
  const rows = (await sql()`
    select id, title, summary, author_name, created_at,
           length(body::text) as bytes
      from content_revisions
     where content_type = ${type} and content_id = ${contentId}
     order by created_at desc
     limit ${limit}`) as Record<string, unknown>[];
  return rows.map((r) => ({
    id: String(r.id),
    title: String(r.title ?? ""),
    summary: String(r.summary ?? ""),
    authorName: String(r.author_name ?? ""),
    createdAt: new Date(r.created_at as string).toISOString(),
    bytes: Number(r.bytes ?? 0),
  }));
}

export interface Revision extends RevisionSummary {
  body: { type: "doc"; content?: unknown[] };
}

/**
 * One revision, WITH its subject checked.
 *
 * The type and id are required rather than looked up from the revision row,
 * because a revision id arrives from a URL and a caller that fetched by id
 * alone would let a person holding one pane's guard read a revision belonging
 * to the other. `content_revisions` has no foreign key by design, so nothing
 * else enforces this.
 */
export async function revisionById(
  type: ContentType,
  contentId: string,
  revisionId: string,
): Promise<Revision | null> {
  const rows = (await sql()`
    select id, title, summary, body, author_name, created_at,
           length(body::text) as bytes
      from content_revisions
     where id = ${revisionId}
       and content_type = ${type}
       and content_id = ${contentId}
     limit 1`) as Record<string, unknown>[];
  const r = rows[0];
  if (!r) return null;
  return {
    id: String(r.id),
    title: String(r.title ?? ""),
    summary: String(r.summary ?? ""),
    authorName: String(r.author_name ?? ""),
    createdAt: new Date(r.created_at as string).toISOString(),
    bytes: Number(r.bytes ?? 0),
    body: r.body as { type: "doc"; content?: unknown[] },
  };
}

/** Who a restore is recorded as, for the audit row the write leaves. */
export type Restorer = Signed;
