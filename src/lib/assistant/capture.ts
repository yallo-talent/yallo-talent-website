import type { AssistantBriefPayload } from "@/lib/assistant/schema";
import type { BriefFormValues } from "@/lib/schemas";

/**
 * One capture path, never a second brief shape (§4.2). This posts to the
 * existing `/api/brief` endpoint — session A's territory, never edited here
 * — with exactly the fields `briefFormSchema` already accepts.
 *
 * `source` and `transcriptId` are included on the wire but `/api/brief`'s
 * current zod schema has no field for either, so they are silently stripped
 * on arrival (zod's default `strip` behaviour) rather than rejected. This is
 * the fallback path described in this round's goal: A's first commit was
 * expected to extend the shared schema with a `source` discriminator and a
 * transcript reference before this landed, and it had not. The brief still
 * sends and still emails correctly today; only the source/transcript
 * attribution is lost until A extends the schema. Logged in
 * docs/relay/v21-B.md as an open item, not silently accepted as final.
 */
export async function submitAssistantBrief(
  origin: string,
  payload: AssistantBriefPayload,
): Promise<{ ok: boolean; error?: string }> {
  const { source, transcriptId, ...briefFields } = payload;
  const wireBody: BriefFormValues & { source: string; transcriptId: string } = {
    ...briefFields,
    source,
    transcriptId,
  };

  const res = await fetch(`${origin}/api/brief`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(wireBody),
  });

  const body = (await res.json()) as { ok: boolean; error?: string };
  if (!res.ok || !body.ok) {
    return { ok: false, error: body.error ?? "The brief could not be sent." };
  }
  return { ok: true };
}
