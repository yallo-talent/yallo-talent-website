"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import styles from "./Metrics.module.css";

export interface MetricStat {
  target: number;
  suffix?: string;
  label: string;
  source: string;
}

function StatCell({
  target,
  suffix,
  label,
  delay,
}: MetricStat & { delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState<number>(target);

  useEffect(() => {
    if (!inView) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(target);
      return;
    }
    setDisplay(0);
    const controls = animate(0, target, {
      duration: 1.4,
      delay,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
      onComplete: () => setDisplay(target),
    });
    return () => controls.stop();
  }, [inView, target, delay]);

  return (
    <div ref={ref} className={styles.stat}>
      <div className={styles.numRow}>
        <span className={styles.num}>{display}</span>
        {suffix && <span className={styles.sfx}>{suffix}</span>}
      </div>
      <div className={styles.rule} />
      <p className={styles.lbl}>{label}</p>
    </div>
  );
}

export function Metrics({ stats }: { stats: MetricStat[] }) {
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
