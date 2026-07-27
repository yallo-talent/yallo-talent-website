"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./HeroSlider.module.css";

interface HeroSlide {
  eyebrow: string;
  title: string;
  emphasis: string;
  copy: string;
  ctaLabel: string;
  ctaHref: string;
  variant: 1 | 2 | 3 | 4 | 5;
  animation: "ken-burns-1" | "ken-burns-2";
}

const slides: HeroSlide[] = [
  {
    eyebrow: "Contract Workforce · UK · ME · India",
    title: "Enterprise programmes need",
    emphasis: "architect-screened contractors.",
    copy: "Shortlists in 72 hours. SAP, Oracle, Microsoft, Salesforce, Blue Yonder, Workday.",
    ctaLabel: "Request a contractor",
    ctaHref: "/#brief",
    variant: 1,
    animation: "ken-burns-1",
  },
  {
    eyebrow: "Permanent Hiring",
    title: "For roles you need to hold",
    emphasis: "for the long term.",
    copy: "Architect-vetted permanent talent. Same rigour as our contract shortlists — different engagement.",
    ctaLabel: "Discuss a permanent hire",
    ctaHref: "/permanent",
    variant: 2,
    animation: "ken-burns-2",
  },
  {
    eyebrow: "EOR · UAE + India",
    title: "Employer of Record",
    emphasis: "compliance you don't have to hold.",
    copy: "UAE visa sponsorship and India payroll cover. Move fast, stay compliant.",
    ctaLabel: "Explore EOR",
    ctaHref: "/eor",
    variant: 3,
    animation: "ken-burns-1",
  },
  {
    eyebrow: "Managed Delivery",
    title: "Scope-defined,",
    emphasis: "outcome-owned.",
    copy: "Yallo holds the delivery risk. For workstreams where you need the outcome, not just the hands.",
    ctaLabel: "See Managed Delivery",
    ctaHref: "/managed-delivery",
    variant: 4,
    animation: "ken-burns-2",
  },
  {
    eyebrow: "Architect-led screening",
    title: "Every shortlist reviewed by",
    emphasis: "senior programme leaders.",
    copy: "The same operators who ran enterprise programmes at Richemont, Landmark, Alshaya EMEA.",
    ctaLabel: "See how it works",
    ctaHref: "/#how",
    variant: 5,
    animation: "ken-burns-1",
  },
];

const AUTO_ADVANCE_MS = 6000;

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = window.setTimeout(() => {
      setIndex((index + 1) % slides.length);
    }, AUTO_ADVANCE_MS);
    return () => window.clearTimeout(timer);
  }, [paused, index]);

  const active = slides[index];
  if (!active) return null;

  return (
    <section
      className={styles.hero}
      aria-roledescription="carousel"
      aria-label="Yallo Talent introduction"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="sync">
        <motion.div
          key={index}
          className={styles.slide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
          aria-hidden="true"
        >
          <div
            className={`${styles.image} ${styles[active.animation]} ${styles[`variant${active.variant}`]}`}
          />
          <div className={styles.overlay} />
          <div className={styles.dotGrid} />
        </motion.div>
      </AnimatePresence>

      <div className={styles.content}>
        <div className={styles.contentInner}>
          <span className="eyebrow">{active.eyebrow}</span>
          <h1 className={styles.title}>
            {active.title}
            <br />
            <span className={styles.emphasis}>{active.emphasis}</span>
          </h1>
          <p className={styles.copy}>{active.copy}</p>
          <div className={styles.ctas}>
            <Link href={active.ctaHref} className={styles.ctaPrimary}>
              {active.ctaLabel}
              <span aria-hidden="true">→</span>
            </Link>
            <Link href="/#how" className={styles.ctaGhost}>
              How it works
            </Link>
          </div>
        </div>

        <div
          className={styles.controls}
          role="tablist"
          aria-label="Carousel navigation"
        >
          {slides.map((slide, i) => (
            <button
              key={slide.eyebrow}
              type="button"
              className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
              aria-label={`Go to slide ${i + 1}: ${slide.eyebrow}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
