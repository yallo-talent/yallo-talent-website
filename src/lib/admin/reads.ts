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
