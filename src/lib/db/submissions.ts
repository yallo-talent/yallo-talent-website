import { sql } from "./client";

/**
 * "research" is the capture table's third consumer, per round 14's brief §5:
 * no second form, no second store, no second delivery path. The table's
 * `endpoint` column is free text and already indexed, so this needs no
 * migration — only that the union stops excluding the new value.
 */
export type SubmissionEndpoint = "brief" | "cv" | "research";

export interface RecordSubmissionInput {
  endpoint: SubmissionEndpoint;
  payload: unknown;
  originSource?: string | null;
  transcriptRef?: string | null;
  referrer?: string | null;
  campaign?: Record<string, string> | null;
}

export interface DeliveryOutcome {
  delivered: boolean;
  error?: string;
}

/** Row exists before any downstream is attempted — see client.ts's comment. */
export async function recordSubmission(
  input: RecordSubmissionInput,
): Promise<string> {
  const client = sql();
  const rows = (await client`
    insert into submissions
      (endpoint, payload, origin_source, transcript_ref, referrer, campaign)
    values
      (
        ${input.endpoint},
        ${JSON.stringify(input.payload)}::jsonb,
        ${input.originSource ?? null},
        ${input.transcriptRef ?? null},
        ${input.referrer ?? null},
        ${input.campaign ? JSON.stringify(input.campaign) : null}::jsonb
      )
    returning id
  `) as Array<{ id: string }>;
  const id = rows[0]?.id;
  if (!id) throw new Error("Submission insert returned no id.");
  return id;
}

export async function recordDelivery(
  id: string,
  channel: string,
  outcome: DeliveryOutcome,
): Promise<void> {
  const client = sql();
  const entry = JSON.stringify({
    [channel]: { ...outcome, at: new Date().toISOString() },
  });
  await client`
    update submissions
    set delivery_status = delivery_status || ${entry}::jsonb
    where id = ${id}
  `;
}
