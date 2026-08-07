import type { AssistantMessage } from "@/lib/assistant/schema";
import { sql } from "@/lib/db/client";

/**
 * Every read the cockpit performs. Read only, by construction rather than by
 * convention — there is no update or delete statement in this file, and round 17
 * §3 forbids one: the scheduled purge owns transcript deletion and a second
 * deletion path would race it.
 *
 * This replaces `pnpm db:read-submissions` as the thing consulted when Resend has
 * failed. That script stays: a shell an operator already has is the right tool
 * when the cockpit itself is what is broken.
 */

export interface BriefRow {
  id: string;
  endpoint: string;
  payload: Record<string, unknown>;
  originSource: string | null;
  transcriptRef: string | null;
  referrer: string | null;
  deliveryStatus: Record<
    string,
    { delivered?: boolean; error?: string } | undefined
  >;
  createdAt: string;
}

export async function readBriefs(limit = 100): Promise<BriefRow[]> {
  const client = sql();
  /* Cast at the boundary, the same way src/lib/db/submissions.ts does: the neon
     driver's return type is a union covering array-mode and full-result mode, and
     the tagged-template form always yields rows. */
  const rows = (await client`
    select id, endpoint, payload, origin_source, transcript_ref, referrer,
           delivery_status, created_at
    from submissions
    order by created_at desc
    limit ${limit}
  `) as Array<Record<string, unknown>>;
  return rows.map((r) => ({
    id: String(r.id),
    endpoint: String(r.endpoint),
    payload: (r.payload ?? {}) as Record<string, unknown>,
    originSource: r.origin_source === null ? null : String(r.origin_source),
    transcriptRef: r.transcript_ref === null ? null : String(r.transcript_ref),
    referrer: r.referrer === null ? null : String(r.referrer),
    deliveryStatus: (r.delivery_status ?? {}) as BriefRow["deliveryStatus"],
    createdAt: new Date(r.created_at as string).toISOString(),
  }));
}

export interface ConversationRow {
  transcriptId: string;
  messages: AssistantMessage[];
  turns: number;
  createdAt: string;
}

/**
 * One line per conversation, for the list view. Round 20 §3.1.
 *
 * DETERMINISTIC, FROM STORED FIELDS. No model call, no summarisation, no new
 * cost: the "summary line" is the visitor's own opening question, quoted. A
 * generated summary of a conversation is a new derived personal-data artefact
 * and §3.1 ruled it out; this is the same words the visitor typed, which the
 * detail view already shows in full.
 *
 * WHY THIS IS NOT `readConversations()` WITH FEWER FIELDS. That function pulls
 * every message of every conversation to count them. The list needs a count and
 * one string, so both are computed in Postgres and the transcripts stay in the
 * database until somebody opens one.
 *
 * PAGE OF ORIGIN IS PARTIAL, AND SAYS SO. §3.1 lists it as a summary field and a
 * filter, and `assistant_transcripts` has no column for it — the table is
 * `transcript_id`, `messages`, `created_at` and nothing else, and the panel
 * sends no path. The only origin the database holds is on `submissions`, so it
 * exists exactly for the conversations that produced a brief and is null for the
 * rest. Reported as null rather than guessed at, and the pane renders the
 * difference rather than showing a blank that reads as "the homepage". Closing
 * the gap means a migration plus a new field captured from every visitor's
 * browser, which changes what this site records about people who never submit
 * anything — Sumeet's call, not a lens's, and it is in the relay.
 */
export interface ConversationSummary {
  transcriptId: string;
  createdAt: string;
  turns: number;
  /** The visitor's first message, verbatim. Null if they never sent one. */
  opening: string | null;
  hasBrief: boolean;
  /** Path of origin where a brief recorded one; null otherwise. Never inferred. */
  originPath: string | null;
}

export async function readConversationSummaries(
  limit = 500,
): Promise<ConversationSummary[]> {
  const client = sql();
  /* On the coalesce below, and it is not the obvious order: `referrer` comes
     FIRST. `origin_source` is the capture discriminator and its value is
     "assistant" — a channel, not a page — while `referrer` holds the URL the
     visitor was actually on. The other order renders "assistant" under a column
     headed Page of origin, which is a wrong answer rather than a missing one.

     Written here rather than inside the query, because a comment containing a
     backtick inside a tagged template literal closes the literal. That is how
     this file was briefly unparseable, and it is worth one note. */
  const rows = (await client`
    select distinct on (t.transcript_id)
           t.transcript_id,
           t.created_at,
           jsonb_array_length(t.messages) as turns,
           (
             select m ->> 'content'
             from jsonb_array_elements(t.messages) m
             where m ->> 'role' = 'user'
             limit 1
           ) as opening,
           s.id is not null as has_brief,
           coalesce(s.referrer, s.origin_source) as origin
    from assistant_transcripts t
    left join lateral (
      select id, origin_source, referrer
      from submissions
      where transcript_ref = t.transcript_id
      order by created_at asc
      limit 1
    ) s on true
    order by t.transcript_id, t.created_at desc
  `) as Array<Record<string, unknown>>;

  return (
    rows
      .map((r) => ({
        transcriptId: String(r.transcript_id),
        createdAt: new Date(r.created_at as string).toISOString(),
        turns: Number(r.turns ?? 0),
        opening:
          r.opening === null || r.opening === undefined
            ? null
            : String(r.opening),
        hasBrief: r.has_brief === true,
        originPath: toPath(r.origin),
      }))
      /* Ordered in JS because `distinct on` forces its own ORDER BY — the same
       reason readConversations() does, and the same row counts. */
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit)
  );
}

/**
 * A referrer or origin marker reduced to a path.
 *
 * `submissions.referrer` is a full URL and `origin_source` is a short marker, so
 * this normalises whichever is present to something a filter can group on. A
 * value that parses as neither is returned as written rather than dropped: the
 * pane is for reading what the database holds, not for tidying it.
 */
function toPath(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const raw = String(value).trim();
  if (raw === "") return null;
  try {
    return new URL(raw).pathname;
  } catch {
    return raw;
  }
}

/** One conversation, in full. The detail view behind the list. */
export async function readConversation(
  transcriptId: string,
): Promise<ConversationRow | null> {
  const client = sql();
  const rows = (await client`
    select transcript_id, messages, created_at
    from assistant_transcripts
    where transcript_id = ${transcriptId}
    order by created_at desc
    limit 1
  `) as Array<Record<string, unknown>>;
  const r = rows[0];
  if (!r) return null;
  const messages = (r.messages ?? []) as AssistantMessage[];
  return {
    transcriptId: String(r.transcript_id),
    messages,
    turns: messages.length,
    createdAt: new Date(r.created_at as string).toISOString(),
  };
}

/**
 * The NEWEST snapshot per `transcriptId`, which is the complete conversation.
 *
 * The table is append-only and each row carries the whole running conversation as
 * of that turn, so older rows for the same id are earlier snapshots. Listing them
 * all would show the same conversation once per turn — which is how a table
 * designed to be append-only reads as a duplicate-ridden log if you query it the
 * obvious way. `distinct on` is Postgres-specific and deliberate.
 */
export async function readConversations(
  limit = 100,
): Promise<ConversationRow[]> {
  const client = sql();
  const rows = (await client`
    select distinct on (transcript_id)
           transcript_id, messages, created_at
    from assistant_transcripts
    order by transcript_id, created_at desc
  `) as Array<Record<string, unknown>>;
  return (
    rows
      .map((r) => {
        const messages = (r.messages ?? []) as AssistantMessage[];
        return {
          transcriptId: String(r.transcript_id),
          messages,
          turns: messages.length,
          createdAt: new Date(r.created_at as string).toISOString(),
        };
      })
      /* Ordered in JS because `distinct on` forces its own ORDER BY. Sorting in
       SQL would need a subquery for no gain at this row count. */
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit)
  );
}
