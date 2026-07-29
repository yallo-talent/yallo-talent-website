"use client";

import { animate, motion, useInView } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./CaseStudies.module.css";

type Hue = "blue" | "green" | "orange" | "teal" | "violet" | "rose";

interface CaseStudy {
  slug: string;
  hue: Hue;
  metric: string;
  metricAnimateTo?: number;
  metricSuffix?: string;
  meta: [string, string, string];
  tags: [string, string];
  title: string;
  desc: string;
  logo: string;
  quickStats: { n: string; l: string }[];
}

const cases: CaseStudy[] = [
  {
    slug: "gcc-bank-sap-72h",
    hue: "blue",
    metric: "72h",
    metricAnimateTo: 72,
    metricSuffix: "h",
    meta: ["PERMANENT", "BANKING", "GCC"],
    tags: ["SAP", "Core Banking"],
    title: "Three SAP specialists, shortlisted in 72 hours",
    desc: "A GCC bank needed a core-banking programme staffed at pace. We calibrated the brief and returned an architect-screened shortlist within 72 hours — the team moved two candidates to offer.",
    logo: "TR",
    quickStats: [
      { n: "3", l: "shortlisted" },
      { n: "2", l: "to offer" },
      { n: "1", l: "week to placement" },
    ],
  },
  {
    slug: "uae-manufacturing-2to1",
    hue: "orange",
    metric: "2:1",
    meta: ["CONTRACT", "MANUFACTURING", "UAE"],
    tags: ["Blue Yonder", "Delivery"],
    title: "A delivery team staffed against a hard deadline",
    desc: "A manufacturing group had a fixed go-live and a gap in its delivery team. A calibrated contract shortlist — a 2:1 CV-to-interview ratio — put the right specialists on the programme in days, not weeks.",
    logo: "MG",
    quickStats: [
      { n: "5", l: "roles filled" },
      { n: "10d", l: "avg time-to-start" },
      { n: "0", l: "re-hires needed" },
    ],
  },
];

const hueStyle = (hue: Hue): React.CSSProperties =>
  ({
    "--sector-accent": `var(--hue-${hue}-500)`,
    "--sector-accent-08": `var(--hue-${hue}-08)`,
    "--sector-accent-20": `var(--hue-${hue}-20)`,
    "--sector-accent-35": `var(--hue-${hue}-35)`,
  }) as React.CSSProperties;

export function CaseStudies() {
  return (
    <section id="case-studies" className={styles.section}>
      <div className={styles.mesh} aria-hidden="true" />
      <div className={styles.orbA} aria-hidden="true" />
      <div className={styles.orbB} aria-hidden="true" />

      <div className={styles.wrap}>
        <header className={styles.hd}>
          <div className={styles.eye}>
            <span className={styles.eyeDot} aria-hidden="true" />
            Case Studies
          </div>
          <h2 className={styles.h}>Programmes like yours, shipped on time.</h2>
          <p className={styles.sub}>
            Enterprise teams across banking, manufacturing and beyond have
            closed their talent gaps with Yallo. See how.
          </p>
        </header>

        <div className={styles.grid}>
          {cases.map((c) => (
            <CaseCard key={c.slug} study={c} />
          ))}
        </div>

        <div className={styles.footer}>
          <Link href="/case-studies" className={styles.cta}>
            See all case studies
            <span className={styles.ctaArr} aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function CaseCard({ study }: { study: CaseStudy }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.article
      ref={ref}
      className={styles.card}
      style={hueStyle(study.hue)}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <div className={styles.artFrame} aria-hidden="true">
        <svg
          viewBox="0 0 200 200"
          className={styles.artSvg}
          role="presentation"
        >
          <defs>
            <radialGradient id={`cs-${study.slug}`} cx="30%" cy="20%" r="80%">
              <stop offset="0%" stopColor="var(--sector-accent-35)" />
              <stop offset="55%" stopColor="var(--sector-accent-08)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <rect width="200" height="200" fill={`url(#cs-${study.slug})`} />
          <g stroke="var(--sector-accent)" strokeWidth="0.5" opacity="0.35">
            <circle cx="100" cy="100" r="30" fill="none" />
            <circle cx="100" cy="100" r="55" fill="none" />
            <circle cx="100" cy="100" r="80" fill="none" />
            <line x1="100" y1="0" x2="100" y2="200" />
            <line x1="0" y1="100" x2="200" y2="100" />
          </g>
        </svg>
      </div>
      <div className={styles.artOverlay} aria-hidden="true" />

      <div className={styles.body}>
        <div className={styles.top}>
          <div className={styles.logoBadge}>{study.logo}</div>
          <div className={styles.meta}>
            {study.meta.map((m, i) => (
              <span key={m}>
                {m}
                {i < study.meta.length - 1 && (
                  <span className={styles.metaDivider}>·</span>
                )}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.metricRow}>
          {study.metricAnimateTo !== undefined ? (
            <AnimatedMetric
              target={study.metricAnimateTo}
              suffix={study.metricSuffix ?? ""}
              inView={inView}
            />
          ) : (
            <span className={styles.metricStatic}>{study.metric}</span>
          )}
          <div className={styles.tags}>
            {study.tags.map((t) => (
              <span key={t} className={styles.tag}>
                {t}
              </span>
            ))}
          </div>
        </div>

        <h3 className={styles.title}>{study.title}</h3>
        <p className={styles.desc}>{study.desc}</p>

        <div className={styles.quickStats}>
          {study.quickStats.map((qs) => (
            <div key={qs.l} className={styles.quickStat}>
              <span className={styles.quickN}>{qs.n}</span>
              <span className={styles.quickL}>{qs.l}</span>
            </div>
          ))}
        </div>

        <Link href={`/case-studies/${study.slug}`} className={styles.link}>
          Read the story
          <span className={styles.linkArr} aria-hidden="true">
            →
          </span>
        </Link>
      </div>
    </motion.article>
  );
}

function AnimatedMetric({
  target,
  suffix,
  inView,
}: {
  target: number;
  suffix: string;
  inView: boolean;
}) {
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
      duration: 1.2,
      delay: 0.2,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
      onComplete: () => setDisplay(target),
    });
    return () => controls.stop();
  }, [inView, target]);

  return (
    <span className={styles.metric}>
      <span className={styles.metricN}>{display}</span>
      {suffix && <span className={styles.metricSfx}>{suffix}</span>}
    </span>
  );
}
