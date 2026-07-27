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

const clientStrip = [
  "SAP",
  "Oracle",
  "Microsoft",
  "Salesforce",
  "Blue Yonder",
  "Workday",
  "ServiceNow",
  "AWS",
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

      <div className={styles.clientStrip}>
        <span className={styles.clientLabel}>Trusted across</span>
        <div className={styles.clientTrack}>
          {[...clientStrip, ...clientStrip].map((c, i) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: duplicate list for seamless marquee
              key={`${c}-${i}`}
              className={styles.clientItem}
              aria-hidden={i >= clientStrip.length ? "true" : undefined}
            >
              {c}
            </span>
          ))}
        </div>
      </div>

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

        <HeroGraphic />
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

/**
 * Right-side animated constellation — represents the shortlist mesh:
 * a central "brief" node with radiating candidate nodes and connectors.
 */
function HeroGraphic() {
  const nodes = [
    { cx: 220, cy: 220, r: 40, hue: "blue" as const, delay: 0 },
    { cx: 80, cy: 90, r: 14, hue: "teal" as const, delay: 0.2 },
    { cx: 340, cy: 70, r: 18, hue: "orange" as const, delay: 0.4 },
    { cx: 380, cy: 260, r: 12, hue: "violet" as const, delay: 0.6 },
    { cx: 60, cy: 320, r: 20, hue: "rose" as const, delay: 0.8 },
    { cx: 300, cy: 380, r: 15, hue: "green" as const, delay: 1.0 },
    { cx: 150, cy: 380, r: 10, hue: "blue" as const, delay: 1.2 },
  ];
  const hueVar = (h: string) => `var(--hue-${h}-500)`;

  return (
    <motion.div
      className={styles.graphic}
      aria-hidden="true"
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1], delay: 0.2 }}
    >
      <svg
        viewBox="0 0 440 440"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.graphicSvg}
        role="img"
        aria-label="Yallo shortlist mesh — one brief, many specialists"
      >
        <title>Yallo shortlist mesh</title>
        <defs>
          <radialGradient id="hero-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--yellow-400)" />
            <stop
              offset="70%"
              stopColor="var(--yellow-500)"
              stopOpacity="0.5"
            />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* Concentric orbit rings */}
        <g className={styles.orbits} opacity="0.15">
          <circle cx="220" cy="220" r="90" fill="none" stroke="var(--wa25)" />
          <circle cx="220" cy="220" r="150" fill="none" stroke="var(--wa15)" />
          <circle cx="220" cy="220" r="200" fill="none" stroke="var(--wa08)" />
        </g>

        {/* Connectors radiating from center to each node */}
        <g className={styles.connectors}>
          {nodes.slice(1).map((n) => (
            <motion.line
              key={`c-${n.cx}-${n.cy}`}
              x1={220}
              y1={220}
              x2={n.cx}
              y2={n.cy}
              stroke={hueVar(n.hue)}
              strokeWidth="0.8"
              strokeOpacity="0.35"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.5 }}
              transition={{
                duration: 0.7,
                ease: "easeOut",
                delay: 0.4 + n.delay,
              }}
            />
          ))}
        </g>

        {/* Nodes */}
        {nodes.map((n, i) => (
          <motion.g
            key={`n-${n.cx}-${n.cy}`}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
              delay: 0.3 + n.delay,
            }}
          >
            {i === 0 && (
              <circle
                cx={n.cx}
                cy={n.cy}
                r={n.r * 2.4}
                fill="url(#hero-core)"
              />
            )}
            <circle
              cx={n.cx}
              cy={n.cy}
              r={n.r}
              fill={hueVar(n.hue)}
              fillOpacity={i === 0 ? "0.4" : "0.85"}
              stroke={hueVar(n.hue)}
              strokeWidth={i === 0 ? "2" : "1"}
            />
            {i === 0 && (
              <motion.circle
                cx={n.cx}
                cy={n.cy}
                r={n.r}
                fill="none"
                stroke="var(--yellow-500)"
                strokeWidth="1.5"
                initial={{ scale: 1, opacity: 0.4 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{
                  duration: 2.4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeOut",
                }}
                style={{ transformOrigin: `${n.cx}px ${n.cy}px` }}
              />
            )}
          </motion.g>
        ))}

        {/* Center label */}
        <text
          x="220"
          y="226"
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize="10"
          letterSpacing="2"
          fill="var(--ink-950)"
          fontWeight="700"
        >
          BRIEF
        </text>
      </svg>
    </motion.div>
  );
}
