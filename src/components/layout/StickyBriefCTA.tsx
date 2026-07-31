"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import Link from "next/link";
import { useState } from "react";
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
/* Still suppressed near the foot, where the page has its own closing ask. */
const HIDE_NEAR_END = 0.96;

export function StickyBriefCTA() {
  const { scrollY, scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    setVisible(y > SHOW_AFTER_PX && scrollYProgress.get() < HIDE_NEAR_END);
  });

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
          aria-label="Contact CTA"
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
