"use client";

import { useEffect, useState } from "react";
import { instrument } from "@/data/home/hero";
import styles from "./Home.module.css";
import { TickGlyph } from "./icons";

/**
 * The hero instrument — the one lifted element in the system, now running as a
 * live screening process rather than a still of one.
 *
 * The SERVER renders the canonical completed state (real values, phase 03
 * active, bars at true width), so a crawler, a reader without JS and a reader
 * with reduced motion all see the finished shortlist — never zeros, never an
 * empty panel. After hydration, and only when motion is permitted, the loop
 * replays the screen: candidates score in one by one, the screened-out counter
 * counts up, the shortlist phase completes, then a long dwell before a soft
 * reset. Text stays the LCP element: this is DOM, not imagery, and it paints
 * after the H1.
 *
 * Illustrative, labelled as such, and contains no real candidate data.
 */

/** Stage timeline (ms since loop start). */
const T = {
  reset: 0, // bars collapse, phase 04 back to pending
  candA: 700,
  candB: 1900,
  candC: 3100,
  shortlist: 4600, // phase 04 flips done, ticks land
  // R7: no dwell and no loop. The reveal runs ONCE and rests at 'done'.
} as const;

type Stage = "settled" | "reset" | "a" | "b" | "c" | "done";

export function Instrument() {
  // "settled" is the server state: everything at final width, no animation.
  const [stage, setStage] = useState<Stage>("settled");
  const [outCount, setOutCount] = useState(17);
  // Canon §5: an auto-advancing element pauses on hover. The candidate rows are
  // readable content, and resetting them under a reader mid-scan is the exact
  // failure that rule exists to prevent.
  const [held, setHeld] = useState(false);

  useEffect(() => {
    if (held) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let alive = true;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => {
      timers.push(
        setTimeout(() => {
          if (alive) fn();
        }, ms),
      );
    };

    const run = () => {
      if (!alive) return;
      at(T.reset, () => {
        setStage("reset");
        setOutCount(9);
      });
      at(T.candA, () => {
        setStage("a");
        setOutCount(12);
      });
      at(T.candB, () => {
        setStage("b");
        setOutCount(15);
      });
      at(T.candC, () => {
        setStage("c");
        setOutCount(17);
      });
      at(T.shortlist, () => setStage("done"));
      /* R7: nothing re-arms. This used to `at(T.dwell, loop)` and restart every
         12s, which made the panel auto-advancing content under SC 2.2.2 (Level A)
         with hover as its only pause — no mechanism for keyboard or touch. The
         ruling is to stop the loop rather than add a control: the reveal plays
         once on entry, rests at "done", and 2.2.2 no longer applies because
         nothing moves after that. The demonstration is unchanged for anyone who
         sees it; only the third and fourth repeats are gone. */
    };

    // One pass, after a beat, so the settled state is what paints first.
    at(1400, run);

    return () => {
      alive = false;
      for (const t of timers) clearTimeout(t);
    };
  }, [held]);

  const reached = (s: Stage): boolean => {
    if (stage === "settled" || stage === "done") return true;
    const order: Stage[] = ["reset", "a", "b", "c"];
    const want: Record<string, number> = { a: 1, b: 2, c: 3 };
    const idx = order.indexOf(stage);
    return idx >= (want[s] ?? 99);
  };

  const shortlistDone = stage === "settled" || stage === "done";

  return (
    /* The pause-on-focus declared below CANNOT FIRE, and it is logged rather
       than patched. onFocusCapture/onBlurCapture are here, but the figure has no
       focusable descendant and no tabindex, so focus never lands inside it — a
       declared behaviour that changes nothing, the same class as a hover rule
       that re-declares its resting value.

       It matters for SC 2.2.2 (Pause, Stop, Hide, Level A): this panel rewrites
       three rows every ~12s and hover is its only pause, which serves a mouse
       and nothing else. I tried tabIndex={0} on the figure and reverted it —
       biome objects correctly that a non-interactive element in the tab order
       confuses more than it helps, and a focusable figure that only pauses is a
       weak mechanism. The criterion wants a CONTROL, and adding a visible
       pause button to the hero is a design decision. QUESTIONS.md Q18. */
    <figure
      className={styles.instrument}
      aria-label={instrument.label}
      data-stage={stage}
      data-held={held || undefined}
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocusCapture={() => setHeld(true)}
      onBlurCapture={() => setHeld(false)}
    >
      <span className={styles.sweep} aria-hidden="true" />

      <div className={styles.instrumentTop}>
        <span className={styles.live} aria-hidden="true" />
        <span>{instrument.status}</span>
        <span className={styles.requisition}>{instrument.requisition}</span>
      </div>

      <ol className={styles.phases}>
        {instrument.phases.map((p) => {
          const done = p.state === "done" || (p.key === "04" && shortlistDone);
          const active =
            (p.key === "03" && !shortlistDone) ||
            (p.key === "04" && shortlistDone);
          return (
            <li
              key={p.key}
              className={[
                styles.phase,
                active ? styles.phaseActive : "",
                done ? styles.phaseDone : "",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-current={active ? "step" : undefined}
            >
              {done ? (
                <span className={styles.phaseTick} aria-hidden="true">
                  <TickGlyph />
                </span>
              ) : null}
              <span className={styles.phaseKey}>{p.key}</span>
              <span className={styles.phaseName}>{p.name}</span>
            </li>
          );
        })}
      </ol>

      <div className={styles.candidates}>
        {instrument.candidates.map((c, i) => {
          const on = reached((["a", "b", "c"] as const)[i] ?? "c");
          return (
            <div
              key={c.name}
              className={`${styles.candidate}${on ? "" : ` ${styles.candidatePending}`}`}
            >
              <div>
                <div className={styles.candidateName}>{c.name}</div>
                <div className={styles.candidateMeta}>{c.meta}</div>
              </div>
              <div className={styles.bar}>
                <span
                  className={styles.barFill}
                  style={{ width: on ? `${c.score}%` : "4%" }}
                />
              </div>
              <div className={styles.candidateScore}>{on ? c.score : "·"}</div>
            </div>
          );
        })}
        <div className={`${styles.candidate} ${styles.screenedOut}`}>
          <div>
            <div className={styles.candidateName}>{outCount} screened out</div>
            <div className={styles.candidateMeta}>
              {instrument.screenedOut.meta}
            </div>
          </div>
          <div />
          <div className={styles.screenedOutScore} aria-hidden="true">
            :
          </div>
        </div>
      </div>

      {/* THE METRICS ROW IS GONE, and it is the single biggest thing crowding
          the hero. Measured at 1440: 40 discrete text nodes in an 817px hero,
          and this row carried three of the densest.

          It was also the most redundant. "72h to shortlist" restates the promise
          the headline and the lede have both already made — the panel's own
          tracker is literally counting to it. "2:1 CVs per interview" and "80%
          renewed" are corporate proof, and proof belongs in the proof section
          where a reader has earned it, not competing with the first thing they
          see. Nothing is lost from the page; the numbers live on in Commitment
          and the evidence band.

          Sumeet's brief said the hero is striking but crowded. This takes a whole
          band out of the instrument rather than shaving padding, which is the
          difference between the panel breathing and the panel being squeezed. */}
    </figure>
  );
}
