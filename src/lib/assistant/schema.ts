import { z } from "zod";
import { briefFormSchema } from "@/lib/schemas";

/**
 * The conversation shape the chat API accepts and returns. Kept minimal —
 * role plus text — because the corpus and the forbidden list live in the
 * system prompt, not in per-message metadata.
 */
export const assistantMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
});

export type AssistantMessage = z.infer<typeof assistantMessageSchema>;

export const assistantChatRequestSchema = z.object({
  messages: z.array(assistantMessageSchema).min(1).max(40),
  transcriptId: z.string().min(1),
});

export type AssistantChatRequest = z.infer<typeof assistantChatRequestSchema>;

/**
 * The brief payload the assistant assembles from a conversation. §4.2:
 * "reuses briefFormSchema... extended with a source discriminator and a
 * transcript reference. One capture path, not two."
 *
 * A's first commit was expected to land this exact extension on the shared
 * schema (context-round13-scope.md §3.2 item 3) so both /brief and the
 * assistant emit one payload shape. It had not landed as of this session
 * (feat/round13-foundations and feat/round13-assistant shared one HEAD), so
 * this composes the extension locally with `.extend()` — briefFormSchema
 * itself is untouched — rather than wait. See docs/relay/v21-B.md for the
 * open item this leaves for A: extending the real schema means source and
 * transcriptRef survive all the way to the durable capture layer, which they
 * cannot yet, because that layer does not exist either.
 */
export const assistantBriefPayloadSchema = briefFormSchema.extend({
  source: z.literal("assistant"),
  transcriptId: z.string().min(1),
});

export type AssistantBriefPayload = z.infer<typeof assistantBriefPayloadSchema>;
