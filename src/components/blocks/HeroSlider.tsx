"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
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
    ctaHref: "/brief",
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

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1400&q=80";

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

          <div className={styles.trustRow}>
            <div className={styles.trustAvatars} aria-hidden="true">
              <span
                className={styles.trustAvatar}
                style={{ background: "var(--hue-blue-500)" }}
              >
                SG
              </span>
              <span
                className={styles.trustAvatar}
                style={{ background: "var(--hue-rose-500)" }}
              >
                AK
              </span>
              <span
                className={styles.trustAvatar}
                style={{ background: "var(--hue-teal-500)" }}
              >
                RM
              </span>
              <span
                className={styles.trustAvatar}
                style={{ background: "var(--accent)", color: "var(--ink-950)" }}
              >
                12+
              </span>
            </div>
            <p className={styles.trustText}>
              Architect team led by operators from{" "}
              <strong>Richemont · Landmark · Alshaya EMEA</strong>
            </p>
          </div>
        </div>

        <HeroVisual />
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
    </section>
  );
}

function HeroVisual() {
  return (
    <motion.div
      className={styles.visual}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1], delay: 0.2 }}
    >
      <div className={styles.visualFrame}>
        <Image
          src={HERO_IMAGE}
          alt="Enterprise team collaborating on a delivery programme"
          fill
          priority
          sizes="(max-width: 900px) 92vw, 520px"
          className={styles.visualImg}
        />
        <div className={styles.visualOverlay} aria-hidden="true" />
        <div className={styles.visualGrain} aria-hidden="true" />

        {/* Floating stat card top */}
        <motion.div
          className={`${styles.floatCard} ${styles.floatCardTop}`}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className={styles.floatIcon} aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              role="presentation"
            >
              <title>Clock</title>
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div className={styles.floatText}>
            <div className={styles.floatNum}>72h</div>
            <div className={styles.floatLabel}>brief to shortlist</div>
          </div>
        </motion.div>

        {/* Floating candidate row */}
        <motion.div
          className={`${styles.floatCard} ${styles.floatCardBottom}`}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className={styles.floatHeader}>
            <span className={styles.floatDot} aria-hidden="true" />
            Active bench
          </div>
          <div className={styles.floatCandidates}>
            <span className={styles.floatCand}>
              <span
                className={styles.floatCandDot}
                style={{ background: "var(--hue-blue-500)" }}
                aria-hidden="true"
              />
              SAP FICO Lead · Dubai
            </span>
            <span className={styles.floatCand}>
              <span
                className={styles.floatCandDot}
                style={{ background: "var(--hue-teal-500)" }}
                aria-hidden="true"
              />
              Oracle EPM · Bengaluru
            </span>
            <span className={styles.floatCand}>
              <span
                className={styles.floatCandDot}
                style={{ background: "var(--hue-orange-500)" }}
                aria-hidden="true"
              />
              Blue Yonder WMS · London
            </span>
          </div>
        </motion.div>

        {/* Corner geometric marker */}
        <div className={styles.visualCorner} aria-hidden="true" />
      </div>
    </motion.div>
  );
}
