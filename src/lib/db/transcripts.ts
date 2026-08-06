import { TRANSCRIPT_RETENTION_DAYS } from "@/lib/assistant/retention";
import type { AssistantMessage } from "@/lib/assistant/schema";
import { sql } from "./client";

/**
 * Re-exported, not re-declared. The window is owned by
 * `src/lib/assistant/retention.json` so that the purge, the privacy notice
 * and the in-panel disclosure cannot disagree — context-round15-scope.md
 * §2.1. Existing importers keep working through this name.
 */
export { TRANSCRIPT_RETENTION_DAYS };

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
