/**
 * The contract between the two fixed-position surfaces that can occupy the
 * same corner of a phone viewport: StickyBriefCTA and the assistant launcher.
 *
 * ROUND 15, §2.2, and the eighth instance of this repository's signature
 * defect. `AssistantLauncher.tsx` found StickyBriefCTA by typing out the
 * literal `[aria-label="Contact CTA"]`, while `StickyBriefCTA.tsx` typed the
 * same words into its own JSX. Nothing connected them. Renaming that label
 * for any reason — clearer copy, localisation, an accessibility review —
 * would have left the `MutationObserver` matching nothing, silently: the
 * launcher would stop yielding, the two would overlap by 54x44px at 360px
 * again, and no gate would have noticed. The value was not wrong; it was
 * unowned.
 *
 * So both identifiers live here, each surface reads its own from this file,
 * and `scripts/check-cta-collision.mjs` reads BOTH from this file too rather
 * than hard-coding a third and fourth copy into the gate that exists to catch
 * exactly this. Rename either constant and the components, the observer and
 * the gate all move together.
 *
 * Why an accessible name is load-bearing at all: the launcher deliberately
 * watches StickyBriefCTA's rendered DOM presence rather than copying its
 * SHOW_AFTER_PX / HIDE_NEAR_END thresholds, which was the right call and is
 * ruled accepted (§1.1). Watching something means naming it. This is that
 * name, owned in one place.
 */

/**
 * StickyBriefCTA's accessible name. It is a `role="complementary"` landmark,
 * so this is a real, published accessible name a screen reader announces —
 * not a test hook. Changing it changes what a visitor hears, which is exactly
 * why the observer must not be the only thing depending on it silently.
 */
export const STICKY_BRIEF_CTA_LABEL = "Contact CTA";

/** Derived, so even the selector syntax is never retyped. */
export const STICKY_BRIEF_CTA_SELECTOR = `[aria-label="${STICKY_BRIEF_CTA_LABEL}"]`;

/**
 * The launcher's own handle. An `id` rather than an accessible name, because
 * the launcher's name is its visible label ("Ask Yallo Talent" / "Close
 * assistant") and that text toggles with panel state — a selector keyed to it
 * would match in one state and not the other. An id is stable across both.
 */
export const ASSISTANT_LAUNCHER_ID = "assistant-launcher";

/** Derived, same reason as above. */
export const ASSISTANT_LAUNCHER_SELECTOR = `#${ASSISTANT_LAUNCHER_ID}`;

/**
 * The site footer's handle — the THIRD surface in this contract, added in
 * round 16 because turning the assistant on (R-A1) made a second collision
 * real that the flag had been hiding.
 *
 * Measured at 1280 with the flag on: the launcher's fab sits exactly on top
 * of the footer's "Terms" link. `document.elementFromPoint` at the link's
 * centre returns the fab's label span, so the link is not merely overlapped
 * but entirely unreachable by pointer — WCAG 2.2 SC 2.4.11. It is on every
 * page that has this footer, not the two `check-interaction` happens to
 * enumerate; those two are where it was seen.
 *
 * The existing yield is mobile-only and keyed to StickyBriefCTA, so it never
 * applied here. Same idiom, different partner: the launcher stands down while
 * the footer is on screen, at every width. Nothing about the footer changes,
 * which keeps the round-15 rule that a floating surface yields rather than
 * making the thing underneath move.
 */
export const FOOTER_ID = "site-footer";

/** Derived, same reason as above. */
export const FOOTER_SELECTOR = `#${FOOTER_ID}`;
