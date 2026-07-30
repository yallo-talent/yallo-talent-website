"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./WhyRail.module.css";

/**
 * The four-point why rail that opens every platform page.
 *
 * Native cards in a scroll-snap track — not a carousel library, and not a hero
 * carousel (canon §5 bans both). All four are in the DOM and reachable by
 * keyboard and by swipe at every width; the auto-advance only moves the scroll
 * position of a list that is already fully present, so nothing is hidden from a
 * crawler or a reader without JS.
 *
 * Auto-advance pauses on hover and on focus-within, stops permanently on any
 * manual interaction, and never starts under `prefers-reduced-motion`. Height is
 * fixed by the grid, so advancing cannot shift layout — zero CLS.
 */

export interface WhyPoint {
  /** Mono kicker: the claim in three or four words. */
  kicker: string;
  title: string;
  body: string;
  /** Optional measured value. Canon §6 metrics only, and it must carry a source
      in the data or it does not render. */
  figure?: { value: string; label: string };
}

export function WhyRail({ points }: { points: WhyPoint[] }) {
  const track = useRef<HTMLUListElement>(null);
  const [paused, setPaused] = useState(false);
  const [stopped, setStopped] = useState(false);

  useEffect(() => {
    if (stopped) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = track.current;
    if (!el) return;
    // Only auto-advance when the track actually overflows; at desktop widths
    // all four are visible and advancing would be motion for its own sake.
    if (el.scrollWidth <= el.clientWidth + 8) return;

    const id = setInterval(() => {
      if (paused) return;
      const card = el.querySelector("li");
      const step = card ? card.getBoundingClientRect().width + 16 : 320;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
      el.scrollBy({ left: atEnd ? -el.scrollLeft : step, behavior: "smooth" });
    }, 5200);
    return () => clearInterval(id);
  }, [paused, stopped]);

  return (
    <ul
      ref={track}
      className={styles.track}
      /* Below 900px this track scrolls, and SC 2.1.1 requires a scrollable
         container to be keyboard operable. The cards' own links are reachable,
         but the container itself must take focus so arrow keys can scroll it. */
      // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable container must be focusable to be keyboard scrollable; the rule does not model overflow
      tabIndex={0}
      aria-label="Why Yallo, four points"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      // Any deliberate scroll or drag ends the auto-advance for good: once the
      // reader has taken control, taking it back is rude.
      onPointerDown={() => setStopped(true)}
      onKeyDown={() => setStopped(true)}
      onWheel={() => setStopped(true)}
    >
      {points.map((p) => (
        <li key={p.title} className={styles.card}>
          <p className={styles.kicker}>{p.kicker}</p>
          <h3 className={styles.title}>{p.title}</h3>
          <p className={styles.body}>{p.body}</p>
          {p.figure ? (
            <p className={styles.figure}>
              <span className={styles.figureValue}>{p.figure.value}</span>
              <span className={styles.figureLabel}>{p.figure.label}</span>
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
