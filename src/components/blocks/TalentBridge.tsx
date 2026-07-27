"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import styles from "./TalentBridge.module.css";

/**
 * Dubai/GCC skyline at sunset — sets the "region we deliver into"
 * frame for the parallax scroll. High-quality Unsplash asset;
 * next/image will re-optimise and blur-placeholder at build time.
 */
const PARALLAX_IMAGE =
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1900&q=80";

export function TalentBridge() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Background parallax — slower than scroll (bg drifts opposite of viewport)
  const bgY = useTransform(scrollYProgress, [0, 1], ["-18%", "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);
  const orbY = useTransform(scrollYProgress, [0, 1], ["12%", "-12%"]);
  // Subtle scale-out as content leaves — cinematic
  const bgScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1.12, 1.05, 1.12],
  );

  return (
    <section
      id="talent-bridge"
      ref={sectionRef}
      className={styles.section}
      aria-label="Talent bridge CTA"
    >
      {/* Parallax image layer */}
      <motion.div
        className={styles.bg}
        style={{ y: bgY, scale: bgScale }}
        aria-hidden="true"
      >
        <Image
          src={PARALLAX_IMAGE}
          alt=""
          fill
          sizes="100vw"
          className={styles.bgImage}
          quality={85}
        />
      </motion.div>

      {/* Depth-mid orbs — drift opposite the bg for parallax depth */}
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

      {/* Legibility overlay (darkens + tints image) */}
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />

      {/* Content */}
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
