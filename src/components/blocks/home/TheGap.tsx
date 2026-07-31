"use client";

import { useEffect, useId, useRef, useState } from "react";
import { gapCopy, personas } from "@/data/home/personas";
import styles from "./Home.module.css";
import { SectionHead } from "./SectionHead";

/**
 * The five-persona index. Content is verbatim from the previous build.
 *
 * Hover switches the panel on pointer devices, WITH INTENT. Raw hover was
 * removed in an earlier round for a good reason — a cursor merely crossing the
 * index changed the panel unasked — so it returns behind two conditions rather
 * than as it was:
 *
 *   · a 130ms dwell before committing, so passing through costs nothing and
 *     pausing on a row reads as a choice;
 *   · `(hover: hover) and (pointer: fine)` only, so a touch device never
 *     commits on the synthetic hover a tap emits.
 *
 * Click, focus and arrow keys are untouched and commit immediately. Focus commit
 * is the WAI-ARIA automatic-activation pattern for a tablist with a roving
 * tabindex; the panel is polite-live so a screen reader hears the swap.
 */
export function TheGap() {
  const [active, setActive] = useState(0);
  const persona = personas[active];
  const baseId = useId();

  /* Pointer capability, resolved after mount. Read at event time rather than
     stored in state so a mouse arriving at a hybrid device works without a
     re-render, and so SSR never has to guess. */
  const finePointer = useRef(false);
  const dwell = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    finePointer.current = mq.matches;
    const onChange = (e: MediaQueryListEvent) => {
      finePointer.current = e.matches;
    };
    mq.addEventListener("change", onChange);
    return () => {
      mq.removeEventListener("change", onChange);
      if (dwell.current) clearTimeout(dwell.current);
    };
  }, []);

  const hoverIn = (i: number) => {
    if (!finePointer.current) return;
    if (dwell.current) clearTimeout(dwell.current);
    dwell.current = setTimeout(() => setActive(i), 130);
  };
  const hoverOut = () => {
    if (dwell.current) clearTimeout(dwell.current);
  };

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
                onClick={() => {
                  hoverOut();
                  setActive(i);
                }}
                /* Hover commits after a dwell, and only on a fine pointer — see
                   the component note. Click, focus and keys commit at once. */
                onMouseEnter={() => hoverIn(i)}
                onMouseLeave={hoverOut}
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
