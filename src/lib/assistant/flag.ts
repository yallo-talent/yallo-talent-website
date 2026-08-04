/**
 * The assistant's kill switch. Ships dark per context-round13-chatbot.md §3:
 * "Flag off. It ships dark and opens after Sumeet reads 50 to 100 real
 * conversations." Same strict-equality-against-a-constant pattern as
 * src/config/theme.ts, so the default cannot be flipped by an unset or
 * misspelled env var.
 */
export const ASSISTANT_ENABLED: boolean =
  process.env.NEXT_PUBLIC_ASSISTANT_ENABLED === "true";
