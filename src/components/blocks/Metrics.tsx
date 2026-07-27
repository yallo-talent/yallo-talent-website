"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useEffect, useRef } from "react";
import styles from "./Metrics.module.css";

interface Stat {
  target: number;
  suffix?: string;
  label: string;
}

const stats: Stat[] = [
  { target: 72, suffix: "hrs", label: "Brief to shortlist" },
  { target: 2, suffix: ":1", label: "CV-to-interview ratio" },
  { target: 3, label: "Delivery regions" },
  { target: 6, suffix: "+", label: "Platform ecosystems" },
];

function StatCell({ target, suffix, label, delay }: Stat & { delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const count = useMotionValue(0);
  const display = useTransform(count, (v) => Math.round(v).toString());

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, target, {
      duration: 1.4,
      delay,
      ease: "easeOut",
    });
    return () => controls.stop();
  }, [inView, target, delay, count]);

  return (
    <div ref={ref} className={styles.stat}>
      <div className={styles.numRow}>
        <motion.span className={styles.num}>{display}</motion.span>
        {suffix && <span className={styles.sfx}>{suffix}</span>}
      </div>
      <div className={styles.rule} />
      <p className={styles.lbl}>{label}</p>
    </div>
  );
}

export function Metrics() {
  return (
    <section id="metrics" className={styles.section}>
      <div className={styles.breathe} aria-hidden="true" />
      <div className={styles.wrap}>
        <header className={styles.hd}>
          <div className={styles.eye}>
            <span className={styles.eyeDot} aria-hidden="true" />
            Measured, not marketed
          </div>
          <h2 className={styles.h}>The numbers behind the shortlist.</h2>
          <p className={styles.sub}>
            Not marketing claims. The screening bar, the delivery reach, the
            engagement mix — the actual shape of the work.
          </p>
        </header>

        <div className={styles.grid}>
          {stats.map((s, i) => (
            <StatCell key={s.label} {...s} delay={i * 0.12} />
          ))}
        </div>
      </div>
    </section>
  );
}
