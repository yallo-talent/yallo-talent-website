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
  dwell: 12000, // hold the completed state, then loop
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

    const loop = () => {
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
      at(T.dwell, loop);
    };

    // First pass starts after a beat, so the settled state is what paints.
    at(1400, loop);

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
            —
          </div>
        </div>
      </div>

      <div className={styles.instrumentFoot}>
        {instrument.footer.map((f) => (
          <div key={f.label}>
            <div className={styles.footValue}>{f.value}</div>
            <div className={styles.footLabel}>{f.label}</div>
          </div>
        ))}
      </div>
    </figure>
  );
}
