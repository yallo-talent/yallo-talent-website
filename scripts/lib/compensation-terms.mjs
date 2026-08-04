/**
 * Compensation-language ban for nav-card promises (check-nav-promise.mjs).
 *
 * NOT wired into check-terminology.mjs's sitewide sweep: "day rate", "rate
 * card" and "salary" are legitimate, already-published vocabulary elsewhere
 * on the site — the contract page's "day rate on your invoice, margin
 * disclosed" describes a billing model, EOR's page describes managing an
 * employee's salary, Workday and SAP role names include "Compensation
 * Analyst". R1 bans a rate, fee or salary *figure*, not the word, and a
 * sitewide word-ban was tried and produced 19 false positives across
 * copy that was correct as published.
 *
 * A nav card is different: it is a short promise pointing at a destination,
 * with none of that legitimate context, and the LTI/Blueprint evidence base
 * holds no compensation data of any kind (context-round14-research.md §1) —
 * so no nav card can honestly promise any of these terms, on any route.
 */
export const COMPENSATION_BANNED_TERMS = [
  [/\bcompensation\b/i, "compensation"],
  [/\bsalar(?:y|ies)\b/i, "salary"],
  [/\bday.?rate\b/i, "day rate"],
  [/\bpay.?rate\b/i, "pay rate"],
  [/\brate card\b/i, "rate card"],
  [/\bavailability signal/i, "availability signal"],
];
