/**
 * The two mail routes' sender and recipient resolution, derived once.
 *
 * Both api/brief and api/cv previously wrote `process.env.RESEND_FROM ?? "..."`
 * inline. Two problems, one of which is live:
 *
 * 1. **`??` does not fall back on an empty string.** A `.env.local` (or a
 *    production environment) carrying `RESEND_FROM=` with nothing after it
 *    yields `""` — a genuine override, not an apparent one, and Resend is then
 *    asked to send from an empty sender. context-round16-scope.md §2.6 records
 *    exactly those two empty keys sitting in the main checkout. Deleting the
 *    lines fixes one machine; treating blank as unset fixes every machine,
 *    including whatever Raphy configures at cutover.
 * 2. Two copies of the default recipient list drift. They already have: the
 *    two routes disagree about the default sender.
 *
 * Recipients stay comma-separated so an override can name more than one
 * address without a code change, per api/brief's original note.
 */

/** Blank, whitespace-only and unset all mean "not configured". */
function envOrDefault(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

/**
 * Sumeet named brief@yallo.co and hello@yallo.co (round 13 chatbot brief §8).
 * Sender addresses are per-route because the two flows are distinguishable in
 * an inbox; recipients are not.
 */
const DEFAULT_RECIPIENTS = "brief@yallo.co,hello@yallo.co";

export function resendFrom(fallback: string): string {
  return envOrDefault(process.env.RESEND_FROM, fallback);
}

export function resendTo(): string[] {
  return envOrDefault(process.env.RESEND_TO, DEFAULT_RECIPIENTS)
    .split(",")
    .map((addr) => addr.trim())
    .filter(Boolean);
}
