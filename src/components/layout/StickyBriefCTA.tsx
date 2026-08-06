"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { STICKY_BRIEF_CTA_LABEL } from "./floating-affordances";
import styles from "./StickyBriefCTA.module.css";

/* An ABSOLUTE scroll distance, not a fraction of the page.
   scrollYProgress > 0.4 sounds reasonable and behaves badly: the trigger point
   moves with document height, so on the homepage it fires around 4,300px and on
   a 9,588px platform page at 390px it fires at 3,955px — leaving roughly 3,800px
   of scroll with no conversion affordance at all, because the hero CTA has been
   gone since about 830px. Measured on both.
   1,100px is just past the hero on every template at every width, so the prompt
   appears when the reader loses the first one and not a screen later. */
const SHOW_AFTER_PX = 1100;
/* Suppressed across the whole closing quarter, not just the last 4%.
   0.96 was measured too late: on the retail L1 the prompt still covered a live
   "Cloud & Infrastructure" read-next chip at scrollY 6248 of 7739 — progress
   0.807 — reducing it to ZERO clickable area, and that row is the only way off
   the page other than this form. The last fifth of every L1 is the closing ask
   plus that row, which is precisely where a floating repeat of the same ask
   earns least and costs most. */
const HIDE_NEAR_END = 0.78;

export function StickyBriefCTA() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    /* Both conditions are derived from the SAME y, and that is the fix rather
       than a tidy-up. This used to read scrollYProgress.get() inside the scrollY
       handler — two separate motion values updated by the same scroll frame with
       no ordering guarantee between them, so the progress read could be one
       frame stale. The visible symptom is at the foot of the page: a fast scroll
       or a jump to the end fires the handler with the final y while progress
       still holds the previous value, HIDE_NEAR_END does not trip, and the
       prompt appears on top of the closing ask it exists to avoid duplicating.
       Deriving progress from y makes the two impossible to disagree. */
    const max =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const progress = max > 0 ? y / max : 0;
    setVisible(y > SHOW_AFTER_PX && progress < HIDE_NEAR_END);
  });

  /* Escape dismisses it. A critique found the undersized close button was the
     ONLY way out of a panel covering 13.7% of a phone viewport, which is a
     dependency on a single small target rather than a choice. Bound only while
     the prompt is showing, so it never competes with the nav drawer's own
     Escape handler. */
  useEffect(() => {
    if (!visible || dismissed) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDismissed(true);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [visible, dismissed]);

  const shouldShow = visible && !dismissed;

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          className={styles.cta}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          role="complementary"
          /* §2.2: the one place this label is written is
             ./floating-affordances.ts, because AssistantLauncher's collision
             observer and check-cta-collision.mjs both depend on it. */
          aria-label={STICKY_BRIEF_CTA_LABEL}
        >
          <div className={styles.inner}>
            <div className={styles.text}>
              <span className={styles.eyebrow}>72h shortlists</span>
              <span className={styles.lede}>Need a contractor?</span>
            </div>
            <Link href="/brief" className={styles.button}>
              Send a brief
              <span aria-hidden="true">→</span>
            </Link>
            <button
              type="button"
              className={styles.close}
              aria-label="Dismiss brief prompt"
              onClick={() => setDismissed(true)}
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
