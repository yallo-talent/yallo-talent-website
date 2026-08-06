"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, useSyncExternalStore } from "react";
import {
  ASSISTANT_LAUNCHER_ID,
  FOOTER_SELECTOR,
  STICKY_BRIEF_CTA_SELECTOR,
} from "@/components/layout/floating-affordances";
import { ASSISTANT_ENABLED } from "@/lib/assistant/flag";
import styles from "./AssistantLauncher.module.css";
import { AssistantPanel } from "./AssistantPanel";

/* round14-scope.md §2.4: measured with both mounted in one viewport for the
   first time (A's layout.tsx seam had not landed before), the two overlap by
   54x44px at 360 — the fab's mobile circle (bottom:84/left:12) sits inside
   StickyBriefCTA's mobile panel (bottom:12, left/right:12). The ruling is
   that the launcher yields: hidden while StickyBriefCTA is visible at mobile
   widths.

   This watches the DOM for StickyBriefCTA's own rendered presence rather
   than re-deriving its SHOW_AFTER_PX/HIDE_NEAR_END thresholds here — a copied
   threshold is exactly the defect class this codebase keeps hitting (a
   second source of truth that drifts from the first), and "never move,
   resize or restyle StickyBriefCTA" is easiest to honour by not touching its
   file at all. Same technique ThemeToggle.tsx already uses for an external
   DOM signal: useSyncExternalStore over a MutationObserver, no cooperation
   required from the thing being watched.

   ROUND 15, §2.2: the selector is no longer typed here. It was
   `'[aria-label="Contact CTA"]'`, a literal with no connection to the JSX
   that produces the label — rename the label and this observer matches
   nothing, silently, and the 54x44px overlap returns with no gate to catch
   it. Both sides now read
   src/components/layout/floating-affordances.ts, and
   scripts/check-cta-collision.mjs asserts the outcome rather than trusting
   the wiring. */
const MOBILE_QUERY = "(max-width: 640px)";

function subscribeStickyCtaCollision(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.body, { childList: true, subtree: true });
  const media = window.matchMedia(MOBILE_QUERY);
  media.addEventListener("change", onChange);
  return () => {
    observer.disconnect();
    media.removeEventListener("change", onChange);
  };
}

function getStickyCtaCollisionSnapshot(): boolean {
  return (
    window.matchMedia(MOBILE_QUERY).matches &&
    document.querySelector(STICKY_BRIEF_CTA_SELECTOR) !== null
  );
}

function getServerStickyCtaCollisionSnapshot(): boolean {
  return false;
}

/* ── The footer yield, round 16 ────────────────────────────────────────────
   R-A1 turned the assistant on, and that made a second collision real that
   the flag had been hiding. Measured at 1280: the fab sits exactly on the
   footer's "Terms" link, and `elementFromPoint` at the link's centre returns
   the fab, so the link is unreachable by pointer — WCAG 2.2 SC 2.4.11.
   `check-interaction` caught it on /leadership and on the new synthesis page;
   it is on every page carrying this footer.

   The yield above is mobile-only and keyed to StickyBriefCTA, so it never
   applied. This is the same idiom with a different partner and no width
   condition, because the collision has none.

   IntersectionObserver rather than a scroll handler: the question is "is the
   footer on screen", which is exactly what it answers, and it does not run
   work on every scroll frame. The observer is created inside `subscribe` so
   it is torn down with the subscription, and the snapshot is a plain boolean
   ref read — useSyncExternalStore requires getSnapshot to be cheap and
   stable, and computing a rect inside it would return a new value on every
   call and loop. */
let footerVisible = false;

function subscribeFooterCollision(onChange: () => void): () => void {
  const footer = document.querySelector(FOOTER_SELECTOR);
  if (!footer) {
    /* No footer on this page: nothing to yield to, and the launcher must not
       silently disappear because a selector missed. */
    footerVisible = false;
    return () => {};
  }
  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (!entry) return;
      const next = entry.isIntersecting;
      if (next !== footerVisible) {
        footerVisible = next;
        onChange();
      }
    },
    { threshold: 0 },
  );
  observer.observe(footer);
  return () => {
    observer.disconnect();
    footerVisible = false;
  };
}

function getFooterCollisionSnapshot(): boolean {
  return footerVisible;
}

function getServerFooterCollisionSnapshot(): boolean {
  return false;
}

/**
 * The deferred island's mount point. Flag off by default (context-round13-
 * chatbot.md §3: "ships dark") — the check happens here too, in addition to
 * wherever this is dynamically imported from, so this component is safe to
 * mount directly during development or review before that import lands.
 *
 * Both a named and a default export: the seam this composes against
 * (context-round13-scope.md §3.2 item 2) is A's to write, and its exact
 * import shape had not landed as of this session, so both forms are offered
 * rather than guessed at.
 */
export function AssistantLauncher() {
  const [open, setOpen] = useState(false);
  const yieldToStickyCta = useSyncExternalStore(
    subscribeStickyCtaCollision,
    getStickyCtaCollisionSnapshot,
    getServerStickyCtaCollisionSnapshot,
  );
  const yieldToFooter = useSyncExternalStore(
    subscribeFooterCollision,
    getFooterCollisionSnapshot,
    getServerFooterCollisionSnapshot,
  );

  /* The panel is exempt from the footer yield: if a visitor has the assistant
     OPEN and scrolls to the bottom, tearing the conversation off the screen
     would be a far worse failure than the overlap this avoids. The yield
     applies to the resting fab, which is the thing that covers the link. */
  if (!ASSISTANT_ENABLED || yieldToStickyCta) return null;
  if (yieldToFooter && !open) return null;

  return (
    <>
      <button
        type="button"
        /* A stable handle for check-cta-collision.mjs. Not the accessible
           name, which toggles with panel state and would match in one state
           and not the other. */
        id={ASSISTANT_LAUNCHER_ID}
        className={styles.fab}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="assistant-panel"
        onClick={() => setOpen((v) => !v)}
      >
        <span aria-hidden="true" className={styles.icon}>
          {open ? "×" : "?"}
        </span>
        <span className={styles.label}>
          {open ? "Close assistant" : "Ask Yallo Talent"}
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            key="assistant-panel-wrap"
            /* "%" is relative to the panel's OWN width, not the viewport —
               deliberately, so this one value reads right at both sizes
               .panel resolves to: a full self-width slide-in for the
               desktop full-height drawer, and the same proportionate slide
               for the mobile small popup, with no separate breakpoint
               logic here. A 24px nudge read fine on the old small popup
               but looked like the desktop drawer was simply appearing —
               its full height exists from frame one regardless (only x/
               opacity animate), so the slide needed real, visible travel
               to read as an entrance rather than a materialisation. */
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <AssistantPanel onClose={() => setOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AssistantLauncher;
