"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./WhatWeDo.module.css";

interface Pillar {
  key: string;
  kick: string;
  promise: string;
  how: string;
  forr: [string, string, string];
  stat: { n: string; l: string };
  more: string;
  href: string;
}

const pillars: Pillar[] = [
  {
    key: "Permanent",
    kick: "Permanent placement",
    promise: "Specialists, placed to stay.",
    how: "Architect-screened permanent hires for enterprise IT — a brief-to-shortlist in 72 hours, and a 2:1 CV-to-interview ratio so your team reviews fits, not filler.",
    forr: [
      "Programme-critical roles",
      "Leadership & architecture",
      "Long-term capability",
    ],
    stat: { n: "72h", l: "brief to shortlist" },
    more: "Brief us on a permanent role",
    href: "/permanent",
  },
  {
    key: "Contractors",
    kick: "Contract & interim",
    promise: "Interim skills, deployed fast.",
    how: "Contract and interim specialists for programme peaks, delivery gaps and fixed-term work — mobilised quickly, screened to the same architect-led bar as our permanent bench.",
    forr: ["Programme surges", "Fixed-term delivery", "Specialist gaps"],
    stat: { n: "2:1", l: "CV-to-interview" },
    more: "Cover a delivery gap",
    href: "/contract",
  },
  {
    key: "EOR",
    kick: "Employer of Record",
    promise: "You choose. We employ them.",
    how: "Found your own hire? We take on the employment — UAE visa sponsorship or India payroll on a service fee. You direct the work, we carry the compliance.",
    forr: ["Your own hires", "Visa & sponsorship", "Payroll in India"],
    stat: { n: "2", l: "regions · UAE & India" },
    more: "Set up an EOR arrangement",
    href: "/eor",
  },
  {
    key: "Subcontracting",
    kick: "Scoped delivery",
    promise: "Scoped delivery, outcome-owned.",
    how: "Hand us a defined slice of delivery and we run it — not just staffed, but owned to an agreed outcome, with our specialists accountable for the result.",
    forr: [
      "Defined work packages",
      "Outcome accountability",
      "Managed capacity",
    ],
    stat: { n: "End-to-end", l: "scoped to the work" },
    more: "Scope a delivery package",
    href: "/managed-delivery",
  },
];

export function WhatWeDo() {
  const [active, setActive] = useState(0);
  const pillar = pillars[active];
  if (!pillar) return null;

  return (
    <section id="what-we-do" className={styles.section}>
      <div className={styles.wrap}>
        <header className={styles.head}>
          <span className={styles.eyebrow}>what we do</span>
          <h2 className={styles.h}>Four ways we place talent.</h2>
          <p className={styles.lede}>
            One focus — the right tech specialists for enterprise. Four ways to
            bring them in, depending on how you need to hold the risk.
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

        <article className={styles.panel} role="tabpanel" key={active}>
          <div className={styles.panelKick}>{pillar.kick}</div>
          <div className={styles.panelPromise}>{pillar.promise}</div>
          <p className={styles.panelHow}>{pillar.how}</p>
          <div className={styles.forLabel}>Best for</div>
          <div className={styles.chips}>
            {pillar.forr.map((f) => (
              <span key={f} className={styles.chip}>
                {f}
              </span>
            ))}
          </div>
          <div className={styles.foot}>
            <div className={styles.stat}>
              <span className={styles.statN}>{pillar.stat.n}</span>
              <span className={styles.statL}>{pillar.stat.l}</span>
            </div>
            <Link href={pillar.href} className={styles.more}>
              {pillar.more}
              <span className={styles.arr} aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
