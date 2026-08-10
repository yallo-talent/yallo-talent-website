import "server-only";
import type { FunnelState } from "@/lib/admin/funnel";
import type { Signed } from "@/lib/admin/guard";
import { sql } from "./client";

/**
 * The funnel sidecar's reads and its one write.
 *
 * `submissions` STAYS APPEND-ONLY. Round 26 §5 forbids a schema change to it,
 * and this module never issues one: every statement below touches
 * `submission_funnel` or reads `submissions`. The capture backstop keeps the
 * property that makes it a backstop — written once, in the path of the capture,
 * and never contended with by anything a salesperson clicks.
 *
 * AN ABSENT SIDECAR ROW MEANS NEW. Every submission starts in New, and inserting
 * a row per capture would put a second write in the path the backstop exists to
 * protect. The read left-joins and defaults; the write upserts.
 *
 * NOTHING HERE DELETES. Lost is a state, not a deletion, and round 17 §3's rule
 * that this tree has no delete path is unchanged.
 */

export interface FunnelRow {
  submissionId: string;
  state: FunnelState;
  ownerEmail: string | null;
  note: string | null;
  updatedAt: string | null;
  updatedBy: string | null;
}

export async function readFunnel(): Promise<Map<string, FunnelRow>> {
  const client = sql();
  const rows = (await client`
    select submission_id, state, owner_email, note, updated_at, updated_by
    from submission_funnel
  `) as Array<Record<string, unknown>>;
  const out = new Map<string, FunnelRow>();
  for (const r of rows) {
    const id = String(r.submission_id);
    out.set(id, {
      submissionId: id,
      state: String(r.state) as FunnelState,
      ownerEmail: r.owner_email === null ? null : String(r.owner_email),
      note: r.note === null ? null : String(r.note),
      updatedAt:
        r.updated_at === null
          ? null
          : new Date(r.updated_at as string).toISOString(),
      updatedBy: r.updated_by === null ? null : String(r.updated_by),
    });
  }
  return out;
}

/**
 * Move a lead, assign it, or note it.
 *
 * ONE UPSERT, NOT AN INSERT AND AN UPDATE. The row may or may not exist, and a
 * caller that had to know which would be a caller that gets it wrong the first
 * time two people open the same lead.
 *
 * ONLY THE FIELDS SUPPLIED ARE WRITTEN. `coalesce` on the excluded value keeps
 * the stored one when a caller passes nothing, so assigning an owner does not
 * reset a note and moving a state does not clear an owner. The one exception is
 * an owner deliberately cleared, which arrives as an empty string and is stored
 * as null.
 */
export async function setFunnel(
  submissionId: string,
  patch: { state?: FunnelState; ownerEmail?: string | null; note?: string },
  actor: Signed,
): Promise<void> {
  const client = sql();
  const owner =
    patch.ownerEmail === undefined
      ? null
      : patch.ownerEmail === ""
        ? ""
        : patch.ownerEmail;
  await client`
    insert into submission_funnel
      (submission_id, state, owner_email, note, updated_at, updated_by)
    values
      (${submissionId}::uuid,
       ${patch.state ?? "new"},
       ${owner === "" ? null : owner},
       ${patch.note ?? null},
       now(),
       ${actor.email})
    on conflict (submission_id) do update set
      state = coalesce(${patch.state ?? null}, submission_funnel.state),
      /* An empty string is "clear it", a null is "leave it". Collapsing the two
         would make unassigning impossible through the same control that
         assigns. */
      owner_email = case
        when ${owner === ""} then null
        when ${owner === null} then submission_funnel.owner_email
        else ${owner}
      end,
      note = coalesce(${patch.note ?? null}, submission_funnel.note),
      updated_at = now(),
      updated_by = ${actor.email}
  `;
  /* The existing audit table, not a second one. "Who marked that lead lost" is
     the same question as "who published that article", and one place to look is
     the whole value of an audit trail. */
  await client`
    insert into content_audit
      (content_type, content_id, action, actor_email, actor_role, detail)
    values ('submission', ${submissionId}::uuid, 'funnel', ${actor.email},
            ${actor.role}, ${JSON.stringify(patch)}::jsonb)
  `;
}

/**
 * Every conversation that produced a brief, keyed by transcript id.
 *
 * THE LINK BOTH WAYS — cockpit-v3 §11. A brief carrying a `transcriptId` already
 * showed it as a bare string; this is the other direction, so a conversation can
 * say which brief came out of it. One query rather than one per row: the
 * conversations pane renders a list, and a lookup per line is a query per line.
 */
export async function briefsByTranscript(): Promise<
  Map<string, { id: string; createdAt: string }>
> {
  const client = sql();
  const rows = (await client`
    select id, transcript_ref, created_at
    from submissions
    where transcript_ref is not null
    order by created_at asc
  `) as Array<Record<string, unknown>>;
  const out = new Map<string, { id: string; createdAt: string }>();
  for (const r of rows) {
    /* First brief wins. A conversation that produced two is a conversation
       somebody submitted twice, and the first is the one the reply went to. */
    const ref = String(r.transcript_ref);
    if (out.has(ref)) continue;
    out.set(ref, {
      id: String(r.id),
      createdAt: new Date(r.created_at as string).toISOString(),
    });
  }
  return out;
}

/**
 * Conversations and briefs by the page they started on.
 *
 * COMPUTED IN POSTGRES rather than by pulling every transcript. The question is
 * a count per path, and the transcripts are the largest rows in the database.
 *
 * IT REPORTS WHAT IS RECORDED AND NOTHING MORE. `origin_path` was added by round
 * 21 and the rows before it carry null; those are counted as their own line
 * rather than folded into a page, and the pane names the date from which the
 * data exists. Inferring a page backwards from a referrer that was never stored
 * would be inventing a number.
 */
export interface OriginRow {
  path: string | null;
  conversations: number;
  briefs: number;
}

export async function originRollup(): Promise<OriginRow[]> {
  const client = sql();
  const rows = (await client`
    select t.origin_path as path,
           count(distinct t.transcript_id)::int as conversations,
           count(distinct s.id)::int as briefs
      from assistant_transcripts t
      left join submissions s on s.transcript_ref = t.transcript_id
     group by t.origin_path
     order by count(distinct t.transcript_id) desc
  `) as Array<Record<string, unknown>>;
  return rows.map((r) => ({
    path: r.path === null ? null : String(r.path),
    conversations: Number(r.conversations ?? 0),
    briefs: Number(r.briefs ?? 0),
  }));
}
