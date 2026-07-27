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

const SHOW_AT = 0.4;

export function StickyBriefCTA() {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setVisible(v > SHOW_AT && v < 0.98);
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
