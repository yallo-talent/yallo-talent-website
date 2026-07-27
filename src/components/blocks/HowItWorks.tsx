"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./HowItWorks.module.css";

interface Step {
  n: string;
  title: string;
  copy: string;
  tag?: string;
  icon: React.ReactNode;
}

const steps: Step[] = [
  {
    n: "01",
    title: "Brief & calibrate",
    copy: "A focused working session to pin down the role, the stack and what good looks like for your programme.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    n: "02",
    title: "Architect-led screening",
    copy: "Candidates screened by specialists who have run the work — assessed for depth, fit and delivery risk, not just keywords.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35M8.5 11h5M11 8.5v5" />
      </svg>
    ),
  },
  {
    n: "03",
    title: "Shortlist delivered",
    copy: "A calibrated shortlist lands in your inbox within 72 hours — matched to your programme, not the job description.",
    tag: "72 hours",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    n: "04",
    title: "Interview & place",
    copy: "You interview fits, not filler. We handle offer, onboarding or EOR — permanent, contract or subcontracted.",
    tag: "2:1 ratio",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

const statsBar: { value: string; label: string }[] = [
  { value: "72h", label: "from brief to shortlist" },
  { value: "2:1", label: "CV-to-interview ratio" },
  { value: "UK · ME · India", label: "active delivery markets" },
  { value: "Perm · Contract · EOR", label: "engagement models" },
];

export function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.18 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="how"
      ref={ref}
      className={`${styles.section} ${inView ? styles.in : ""}`}
    >
      <div className={`${styles.orb} ${styles.orbA}`} aria-hidden="true" />
      <div className={`${styles.orb} ${styles.orbB}`} aria-hidden="true" />
      <div className={`${styles.orb} ${styles.orbC}`} aria-hidden="true" />
      <div className={styles.texture} aria-hidden="true" />

      <div className={styles.wrap}>
        <header className={styles.hd}>
          <div className={styles.eye}>
            <span className={styles.dot} aria-hidden="true" />
            How it works
          </div>
          <h2 className={styles.h}>
            From brief to shortlist <em className={styles.em}>in 72 hours.</em>
          </h2>
          <p className={styles.lede}>
            No CVs until we understand your programme. A screen run by people
            who have built enterprise tech — not keyword-matched it.
          </p>
        </header>

        <div className={styles.timeline}>
          {steps.map((step) => (
            <article
              key={step.n}
              className={styles.card}
              data-n={step.n}
              style={
                { "--yw-n": `"${step.n}"` } as React.CSSProperties & {
                  "--yw-n": string;
                }
              }
            >
              <div className={styles.ico}>{step.icon}</div>
              <h3 className={styles.cardTitle}>{step.title}</h3>
              <p className={styles.cardCopy}>{step.copy}</p>
              {step.tag && <span className={styles.tag}>{step.tag}</span>}
            </article>
          ))}
          <div className={styles.connector} aria-hidden="true">
            <div className={styles.connectorFill} />
          </div>
        </div>

        <div className={styles.statBar}>
          {statsBar.map((stat) => (
            <div key={stat.label} className={styles.statItem}>
              <strong className={styles.statValue}>{stat.value}</strong>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
