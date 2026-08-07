import retention from "./retention.json";

/**
 * The assistant's transcript retention, and every sentence that describes it,
 * from one number.
 *
 * ROUND 15, and the reason this file exists. Round 14's two sessions could
 * each see only half of this. One corrected `/privacy` and the launcher
 * disclosure to say conversations are not saved, true on its branch. The
 * other built `assistant_transcripts` with a 365-day purge, true on its.
 * Merged, the copy denied a store that exists — and a privacy page that
 * misdescribes retention is a false statement to a visitor about their own
 * data, whichever direction it drifts. context-round15-scope.md §2.1.
 *
 * So the period is declared once and the prose is derived from it. Changing
 * the retention window is a one-number edit that moves the purge, the privacy
 * notice and the in-panel disclosure together; there is no second sentence
 * left to forget. The number lives in `retention.json` rather than here
 * because `scripts/purge-assistant-transcripts.mjs` runs as plain Node
 * outside the path-aliased build and cannot import a `.ts` module — the same
 * constraint, and the same solution, as `src/lib/mark-surfaces.json`.
 *
 * Deliberately carries no database import. `AssistantPanel.tsx` is a client
 * component and pulls this in for its disclosure line; routing it through
 * `src/lib/db/transcripts.ts` would drag the Neon client into the browser
 * bundle for the sake of one integer.
 */
export const TRANSCRIPT_RETENTION_DAYS = retention.transcriptRetentionDays;

/**
 * Days is what the purge enforces; months is what a visitor reads. 30.437 is
 * the mean Gregorian month, so 365 resolves to 12 and any future window lands
 * on the month a person would actually name.
 */
const months = Math.round(TRANSCRIPT_RETENTION_DAYS / 30.437);

/** "12 months", singular-safe. */
export const retentionPeriod = months === 1 ? "1 month" : `${months} months`;

/**
 * The full sentence `/privacy` publishes. The store is unconditional in
 * `src/app/api/assistant/chat/route.ts` — every turn is recorded whenever the
 * assistant can reply at all — so this states recording as a fact, not a
 * possibility.
 *
 * ROUND 21 §4 ADDS THE PAGE OF ORIGIN, and names it here because this is the
 * sentence a visitor reads about what a recorded conversation contains. The
 * capture is a pathname on this site and nothing else — no query string, no
 * external referrer — and it lives and dies with the transcript under the same
 * window stated in the rest of this sentence, so there is nothing further to
 * disclose about how long it is kept. LOGGED FOR SUMEET'S VETO per R-A9: this
 * is published copy on a legal page, shipped under the ruling rather than
 * waiting on him, and it is named in relay v29 so he can strike it.
 */
export const assistantRetentionSentence = `Conversations are recorded, including the page on our site where the conversation started, and kept for ${retentionPeriod}, then deleted.`;

/**
 * The launcher panel's own one-line disclosure. Short by necessity: the rule
 * that renders it is `white-space: nowrap` with an ellipsis
 * (`AssistantPanel.module.css`), because the close button was measured
 * disappearing behind the panel's `overflow: hidden` at 360px when this line
 * was allowed to wrap. Same fact as the sentence above, in the space
 * available, with `/privacy` carrying the rest.
 */
export const assistantDisclosureLine = `Kept ${retentionPeriod}.`;
