"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./WhatWeDo.module.css";

type Hue = "orange" | "blue" | "teal" | "violet";

interface Pillar {
  key: string;
  kick: string;
  promise: string;
  how: string;
  forr: [string, string, string];
  stat: { n: string; l: string };
  more: string;
  href: string;
  hue: Hue;
  image: string;
  imageAlt: string;
}

const pillars: Pillar[] = [
  {
    key: "Contract Workforce",
    kick: "For interim capacity",
    promise: "Interim specialists, on your programme in 72 hours.",
    how: "Get contract talent when your delivery has a gap or a peak. Architect-screened to the same bar as permanent, so you review fits — not filler.",
    forr: [
      "Your programme surges",
      "Fixed-term delivery gaps",
      "Specialist skills you don't hold",
    ],
    stat: { n: "72h", l: "brief to shortlist" },
    more: "See how Contract works",
    href: "/contract",
    hue: "orange",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Programme team collaborating in a working session",
  },
  {
    key: "Permanent Hiring",
    kick: "For long-term capability",
    promise: "Specialists placed to stay on your team.",
    how: "For the roles that matter most to your programme long-term. Same 72-hour turnaround, same architect-led screening — for the permanent bench you're building.",
    forr: [
      "Programme-critical roles",
      "Leadership & architecture",
      "Long-term team capability",
    ],
    stat: { n: "2:1", l: "CV-to-interview ratio" },
    more: "See how Permanent works",
    href: "/permanent",
    hue: "blue",
    image:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Business professional in a leadership setting",
  },
  {
    key: "Employer of Record",
    kick: "For risk you don't want to hold",
    promise: "You choose the person. We carry the employment.",
    how: "Found the hire yourself? We take on the UAE visa or India payroll — you direct the work, we hold the compliance. Move fast without the entity setup.",
    forr: [
      "Your own found hires",
      "UAE visa & sponsorship",
      "India payroll cover",
    ],
    stat: { n: "2", l: "regions · UAE & India" },
    more: "Set up an EOR arrangement",
    href: "/eor",
    hue: "teal",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Signing a business agreement",
  },
  {
    key: "Managed Delivery",
    kick: "For outcomes you need owned",
    promise: "Scoped delivery, we own the outcome.",
    how: "Hand us a defined workstream and we run it end-to-end — accountable for the result, not just staffed against it. Yallo carries the delivery risk.",
    forr: [
      "Defined work packages",
      "Outcome accountability",
      "Managed capacity",
    ],
    stat: { n: "End-to-end", l: "scoped to the work" },
    more: "Scope a delivery package",
    href: "/managed-delivery",
    hue: "violet",
    image:
      "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Delivery team reviewing a scope of work",
  },
];

const hueStyle = (hue: Hue): React.CSSProperties =>
  ({
    "--sector-accent": `var(--hue-${hue}-500)`,
    "--sector-accent-08": `var(--hue-${hue}-08)`,
    "--sector-accent-20": `var(--hue-${hue}-20)`,
    "--sector-accent-35": `var(--hue-${hue}-35)`,
  }) as React.CSSProperties;

export function WhatWeDo() {
  const [active, setActive] = useState(0);
  const pillar = pillars[active];
  if (!pillar) return null;

  return (
    <section id="what-we-do" className={styles.section}>
      <div className={styles.wrap}>
        <header className={styles.head}>
          <span className={styles.eyebrow}>What you get</span>
          <h2 className={styles.h}>Four ways to bring in specialists.</h2>
          <p className={styles.lede}>
            Pick the engagement model that matches how you want to hold the risk
            — permanent, contract, EOR or fully managed delivery.
          </p>
        </header>

        <div
          className={styles.tabs}
          role="tablist"
          aria-label="Engagement models"
        >
          {pillars.map((p, i) => {
            const isOn = i === active;
            return (
              <button
                key={p.key}
                type="button"
                role="tab"
                aria-selected={isOn}
                className={`${styles.tab} ${isOn ? styles.tabOn : ""}`}
                style={hueStyle(p.hue)}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
              >
                <span className={styles.tabKey}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={styles.tabTitle}>{p.key}</span>
              </button>
            );
          })}
        </div>

        <article
          className={styles.panel}
          role="tabpanel"
          key={active}
          style={hueStyle(pillar.hue)}
        >
          <div className={styles.panelImage}>
            <Image
              src={pillar.image}
              alt={pillar.imageAlt}
              fill
              sizes="(max-width: 900px) 88vw, 440px"
              className={styles.panelImageImg}
            />
            <div className={styles.panelImageTint} aria-hidden="true" />
            <div className={styles.panelImageOverlay} aria-hidden="true" />
            <div className={styles.panelStat}>
              <span className={styles.panelStatN}>{pillar.stat.n}</span>
              <span className={styles.panelStatL}>{pillar.stat.l}</span>
            </div>
          </div>

          <div className={styles.panelBody}>
            <div className={styles.panelKick}>{pillar.kick}</div>
            <div className={styles.panelPromise}>{pillar.promise}</div>
            <p className={styles.panelHow}>{pillar.how}</p>
            <div className={styles.forLabel}>Right for</div>
            <div className={styles.chips}>
              {pillar.forr.map((f) => (
                <span key={f} className={styles.chip}>
                  {f}
                </span>
              ))}
            </div>
            <div className={styles.foot}>
              <Link href={pillar.href} className={styles.more}>
                {pillar.more}
                <span className={styles.arr} aria-hidden="true">
                  →
                </span>
              </Link>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
