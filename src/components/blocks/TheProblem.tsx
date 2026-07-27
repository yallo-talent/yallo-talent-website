"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./TheProblem.module.css";

interface Persona {
  role: string;
  cue: string;
  headline: string;
  chat: [string, string, string];
  num: string;
  txt: string;
  src: string;
}

const personas: Persona[] = [
  {
    role: "CHRO",
    cue: "The hard roles stay open",
    headline: "The roles you need most are the ones you can't fill.",
    chat: [
      "Every tech and digital seat takes months to fill — and the best people are gone in days.",
      "We keep raising the offer and still lose candidates to faster movers.",
      "My recruiters are buried, and the hardest roles just stay open.",
    ],
    num: "72%",
    txt: "of employers can't find the skilled talent they need — with AI, IT and data roles now the hardest to fill.",
    src: "Source: ManpowerGroup Talent Shortage Survey, 2026",
  },
  {
    role: "CIO",
    cue: "Delivery slips on open seats",
    headline: "Every open seat is a roadmap slipping.",
    chat: [
      "A programme stalls for months while we wait on two or three specialist hires.",
      "Agencies send me volume — I need people who can actually deliver.",
      "By the time the seat is filled, the delivery date has already moved.",
    ],
    num: "~63 days",
    txt: "median time to fill a role today — and specialist tech roles routinely run longer, dragging every milestone behind them.",
    src: "Source: Employ Recruiting Benchmarks Report, 2026",
  },
  {
    role: "Head of Talent",
    cue: "Buried in CVs, not fit",
    headline: "Drowning in CVs, starving for fit.",
    chat: [
      "Two hundred applications a role, and maybe five worth a call.",
      "I spend more time filtering noise than talking to real candidates.",
      "The good ones drop off before I've even finished screening.",
    ],
    num: "250+",
    txt: "applications land on the average corporate opening, yet only four to six are worth interviewing.",
    src: "Source: SHRM",
  },
  {
    role: "Delivery Director",
    cue: "Can't staff fast enough",
    headline: "You win the work faster than you can staff it.",
    chat: [
      "We've signed the programme — now I need a team on the ground, fast.",
      "Contractor churn keeps resetting delivery every few months.",
      "Half the budget sits benched, waiting on the right specialists.",
    ],
    num: "95%",
    txt: "of UAE employers now hire tech talent from abroad because senior specialists can't be found locally; 83% have turned to offshoring.",
    src: "Source: UAE Ministry of Economy, 2024",
  },
  {
    role: "CFO",
    cue: "Empty seats bleed budget",
    headline: "Empty seats and bad hires quietly bleed the budget.",
    chat: [
      "Every vacant month is delivery we've paid for and aren't getting.",
      "Contractor day rates keep climbing and I can't see the value.",
      "One wrong senior hire, and we pay for it long after they've gone.",
    ],
    num: "up to 30%",
    txt: "of first-year salary is the cost of a single bad hire — and replacing a senior specialist can reach two times salary.",
    src: "Source: U.S. Department of Labor; SHRM",
  },
];

export function TheProblem() {
  const [active, setActive] = useState(0);
  const persona = personas[active];
  if (!persona) return null;

  return (
    <section id="problem" className={styles.section}>
      <div className={styles.bg} aria-hidden="true" />
      <div className={styles.scan} aria-hidden="true" />

      <div className={styles.wrap}>
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowDot} aria-hidden="true" />
          The Problem
        </div>

        <div className={styles.grid}>
          <div className={styles.left}>
            <h2 className={styles.h}>
              Find the seat at the table that's yours.
            </h2>

            <div
              className={styles.list}
              role="tablist"
              aria-label="Choose your role"
            >
              {personas.map((p, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={p.role}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`${styles.row} ${isActive ? styles.rowOn : ""}`}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                  >
                    <span className={styles.num}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={styles.title}>{p.role}</span>
                    <span className={styles.sub}>{p.cue}</span>
                  </button>
                );
              })}
            </div>

            <div className={styles.foot}>
              <span className={styles.cue}>
                <span className={styles.cueChev} aria-hidden="true">
                  ›
                </span>
                sound like your week?
              </span>
              <Link href="/#brief" className={styles.btn}>
                Send us a brief
                <span className={styles.arr} aria-hidden="true">
                  →
                </span>
              </Link>
            </div>
          </div>

          <div className={styles.right} role="tabpanel" aria-live="polite">
            <div className={styles.tag}>
              <span className={styles.tagDot} aria-hidden="true" />
              <span>{persona.role}</span>
              <span className={styles.tagDivider}>·</span>
              <span>in their words</span>
            </div>
            <h3 className={styles.hl}>{persona.headline}</h3>
            <div className={styles.chat} key={active}>
              {persona.chat.map((c, idx) => (
                <div
                  key={c}
                  className={`${styles.bub} ${idx % 2 ? styles.bubOut : styles.bubIn}`}
                >
                  {c}
                </div>
              ))}
            </div>
            <div className={styles.stat}>
              <span className={styles.numBig}>{persona.num}</span>
              <span className={styles.statTxt}>{persona.txt}</span>
              <span className={styles.statSrc}>{persona.src}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
