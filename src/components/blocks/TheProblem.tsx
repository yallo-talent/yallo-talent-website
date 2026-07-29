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
    role: "Head of TA",
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
    role: "PMO Director",
    cue: "Every open seat is red",
    headline: "Every red seat is a red programme.",
    chat: [
      "Half my status pack is 'awaiting hire' — leadership sees red before delivery does.",
      "Recruitment says four weeks, but by week six the sprint has already slipped twice.",
      "By the time the seat is filled, the mitigation plan has become the plan.",
    ],
    num: "~63 days",
    txt: "median time to fill a role today — and specialist tech roles routinely run longer, dragging every milestone behind them.",
    src: "Source: Employ Recruiting Benchmarks Report, 2026",
  },
  {
    role: "VP Engineering",
    cue: "Backlog stalls on specialists",
    headline: "The backlog isn't the problem — the bench is.",
    chat: [
      "I've got the roadmap. What I don't have is two senior specialists who can actually ship it.",
      "Contract agencies send me profiles. I need people who've built this at scale.",
      "I'm three weeks into shortlisting and the sprint window is closing.",
    ],
    num: "72%",
    txt: "of employers can't find the skilled talent they need — with AI, IT and data roles now the hardest to fill.",
    src: "Source: ManpowerGroup Talent Shortage Survey, 2026",
  },
  {
    role: "Practice Lead",
    cue: "Bench is thin at the top",
    headline: "Certified isn't the same as delivered.",
    chat: [
      "Ninety percent of the CVs look right on paper — five percent have actually shipped this platform.",
      "I end up screening every candidate myself because generalist recruiters can't tell the difference.",
      "The good ones aren't on the market — they're already placed on someone else's programme.",
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
              <Link href="/brief" className={styles.btn}>
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
