"use client";

import { useId, useState } from "react";
import { gapCopy, personas } from "@/data/home/personas";
import styles from "./Home.module.css";
import { SectionHead } from "./SectionHead";

/**
 * The five-persona index. Content is verbatim from the previous build.
 *
 * Hover and focus both switch the panel, matching the interaction the previous
 * TheProblem.tsx established; arrow keys move between tabs per the ARIA tabs
 * pattern, and the panel is polite-live so a screen reader hears the swap.
 */
export function TheGap() {
  const [active, setActive] = useState(0);
  const persona = personas[active];
  const baseId = useId();
  if (!persona) return null;

  const move = (delta: number) => {
    const next = (active + delta + personas.length) % personas.length;
    setActive(next);
    document.getElementById(`${baseId}-tab-${next}`)?.focus();
  };

  return (
    <section className={`${styles.section} ${styles.g1}`} id="gap">
      <div className={styles.wrap}>
        <SectionHead
          eyebrow={gapCopy.eyebrow}
          heading={gapCopy.heading}
          lede={gapCopy.lede}
          id="gap-heading"
        />

        <div className={styles.gap}>
          <div
            className={styles.personaIndex}
            role="tablist"
            aria-label={gapCopy.indexLabel}
            aria-orientation="vertical"
          >
            {personas.map((p, i) => (
              <button
                key={p.role}
                type="button"
                role="tab"
                id={`${baseId}-tab-${i}`}
                aria-selected={i === active}
                aria-controls={`${baseId}-panel`}
                tabIndex={i === active ? 0 : -1}
                className={styles.personaTab}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown" || e.key === "ArrowRight") {
                    e.preventDefault();
                    move(1);
                  }
                  if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
                    e.preventDefault();
                    move(-1);
                  }
                }}
              >
                <span className={styles.personaRole}>{p.role}</span>
                <span className={styles.personaCue}>{p.cue}</span>
              </button>
            ))}
          </div>

          <div
            className={styles.personaPanel}
            role="tabpanel"
            id={`${baseId}-panel`}
            aria-labelledby={`${baseId}-tab-${active}`}
            aria-live="polite"
            tabIndex={-1}
          >
            <span className={styles.panelPetal} aria-hidden="true" />
            <p className={styles.panelLabel}>
              {persona.role} · {gapCopy.panelLabel}
            </p>
            <h3>{persona.headline}</h3>

            <div className={styles.quotes}>
              {persona.quotes.map((q) => (
                <blockquote key={q}>{q}</blockquote>
              ))}
            </div>

            <div className={styles.personaStat}>
              <span className={styles.personaStatValue}>{persona.value}</span>
              <p className={styles.personaStatClaim}>
                {persona.claim}
                <cite className={styles.personaStatSource}>
                  Source: {persona.source}
                </cite>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
