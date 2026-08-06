"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, useSyncExternalStore } from "react";
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
   required from the thing being watched. */
const MOBILE_QUERY = "(max-width: 640px)";
const STICKY_CTA_SELECTOR = '[aria-label="Contact CTA"]';

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
    document.querySelector(STICKY_CTA_SELECTOR) !== null
  );
}

function getServerStickyCtaCollisionSnapshot(): boolean {
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

  if (!ASSISTANT_ENABLED || yieldToStickyCta) return null;

  return (
    <>
      <button
        type="button"
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
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <AssistantPanel onClose={() => setOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AssistantLauncher;
