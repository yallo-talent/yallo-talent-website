"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import styles from "./TalentBridge.module.css";

export function TalentBridge() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Background parallax — slower than viewport (~ 40% of scroll speed)
  const bgY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  // Content moves at ~1x (normal scroll) — parallax comes from bg being slower
  const contentY = useTransform(scrollYProgress, [0, 1], ["-2%", "2%"]);
  // Foreground shapes drift the other way for depth
  const orbY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  return (
    <section
      id="talent-bridge"
      ref={sectionRef}
      className={styles.section}
      aria-label="Talent bridge CTA"
    >
      {/* Parallax background — will be swapped for real photography */}
      <motion.div className={styles.bg} style={{ y: bgY }} aria-hidden="true">
        <div className={styles.bgImage} />
        <div className={styles.bgGrid} />
        <svg
          viewBox="0 0 1600 900"
          className={styles.bgArt}
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="tb-glow-a" cx="20%" cy="30%" r="55%">
              <stop
                offset="0%"
                stopColor="var(--hue-blue-500)"
                stopOpacity="0.55"
              />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <radialGradient id="tb-glow-b" cx="85%" cy="70%" r="55%">
              <stop
                offset="0%"
                stopColor="var(--yellow-500)"
                stopOpacity="0.45"
              />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <radialGradient id="tb-glow-c" cx="50%" cy="10%" r="30%">
              <stop
                offset="0%"
                stopColor="var(--hue-rose-500)"
                stopOpacity="0.35"
              />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <rect width="1600" height="900" fill="url(#tb-glow-a)" />
          <rect width="1600" height="900" fill="url(#tb-glow-b)" />
          <rect width="1600" height="900" fill="url(#tb-glow-c)" />

          {/* Constellation grid — decorative "network" pattern */}
          <g stroke="var(--wa15)" strokeWidth="0.5" opacity="0.35" fill="none">
            <path d="M 100 200 L 400 350 L 700 180 L 1050 400 L 1400 250" />
            <path d="M 200 700 L 500 550 L 800 720 L 1150 500 L 1500 680" />
            <path d="M 300 100 L 300 850" strokeDasharray="4 8" />
            <path d="M 900 60 L 900 840" strokeDasharray="4 8" />
            <path d="M 1300 100 L 1300 800" strokeDasharray="4 8" />
          </g>
          <g fill="var(--wa25)">
            <circle cx="100" cy="200" r="3" />
            <circle cx="400" cy="350" r="4" />
            <circle cx="700" cy="180" r="3" />
            <circle cx="1050" cy="400" r="5" />
            <circle cx="1400" cy="250" r="3" />
            <circle cx="200" cy="700" r="3" />
            <circle cx="500" cy="550" r="4" />
            <circle cx="800" cy="720" r="3" />
            <circle cx="1150" cy="500" r="5" />
            <circle cx="1500" cy="680" r="3" />
          </g>
        </svg>
      </motion.div>

      {/* Depth-mid orbs (drift opposite the bg for parallax depth) */}
      <motion.div
        className={`${styles.orb} ${styles.orbA}`}
        style={{ y: orbY }}
        aria-hidden="true"
      />
      <motion.div
        className={`${styles.orb} ${styles.orbB}`}
        style={{ y: orbY }}
        aria-hidden="true"
      />

      {/* Legibility overlay above bg, below content */}
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />

      {/* Content — sits on top */}
      <motion.div className={styles.wrap} style={{ y: contentY }}>
        <div className={styles.eye}>
          <span className={styles.eyeDot} aria-hidden="true" />
          Talent bridge · 72-hour guarantee
        </div>
        <h2 className={styles.h}>
          At <span className={styles.brandName}>Yallo</span>, we help IT leaders
          get top tech talent{" "}
          <span className={styles.emphasis}>within 72 hours.</span>
        </h2>
        <p className={styles.sub}>
          Reach out to bridge your talent gaps today. Architect-led screening,
          calibrated to your programme — across UK, Middle East and India.
        </p>

        <div className={styles.actions}>
          <Link href="/brief" className={styles.ctaPrimary}>
            Bridge my talent gap
            <span aria-hidden="true">→</span>
          </Link>
          <Link href="/contract" className={styles.ctaGhost}>
            Know more
          </Link>
        </div>

        <div className={styles.pills}>
          <span className={styles.pill}>
            <span className={styles.pillNum}>72h</span>
            <span className={styles.pillLabel}>to shortlist</span>
          </span>
          <span className={styles.pill}>
            <span className={styles.pillNum}>2:1</span>
            <span className={styles.pillLabel}>CV-to-interview</span>
          </span>
          <span className={styles.pill}>
            <span className={styles.pillNum}>3</span>
            <span className={styles.pillLabel}>delivery regions</span>
          </span>
        </div>
      </motion.div>
    </section>
  );
}
