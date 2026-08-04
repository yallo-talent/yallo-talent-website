import type { AssistantMessage } from "@/lib/assistant/schema";
import { sql } from "./client";

/** Stated in context-round14-scope.md §2.1: transcripts persist for 12 months. */
export const TRANSCRIPT_RETENTION_DAYS = 365;

/**
 * Inserts one snapshot of the conversation so far. Never updates an
 * existing row — the table is append-only by construction, so the newest
 * row for a given `transcriptId` is read as the current transcript.
 */
export async function recordTranscriptTurn(
  transcriptId: string,
  messages: AssistantMessage[],
): Promise<void> {
  const client = sql();
  await client`
    insert into assistant_transcripts (transcript_id, messages)
    values (${transcriptId}, ${JSON.stringify(messages)}::jsonb)
  `;
}

/**
 * Deletes rows older than the retention window. Returns the count removed
 * so the calling script can report it. Run on a schedule (see
 * scripts/purge-assistant-transcripts.mjs) — never on a request path.
 */
export async function purgeExpiredTranscripts(): Promise<number> {
  const client = sql();
  const deleted = (await client`
    delete from assistant_transcripts
    where created_at < now() - interval '1 day' * ${TRANSCRIPT_RETENTION_DAYS}
    returning id
  `) as Array<{ id: string }>;
  return deleted.length;
}
