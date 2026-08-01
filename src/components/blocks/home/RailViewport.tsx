"use client";

import { useState } from "react";
import styles from "./Home.module.css";

/**
 * The client rail — a continuous drift, with a discreet pause.
 *
 * Sumeet asked for the loop back and for the old control gone. Those are only
 * in conflict if "gone" means absent: moving content that runs for more than
 * five seconds needs a pause mechanism under SC 2.2.2 at Level A, and hover
 * alone serves a mouse — a keyboard user has no route and a touch user none.
 * The objection was to the look of a full-width "Pause the client rail" button
 * sitting under the marks, not to the mechanism.
 *
 * So the control is now a single glyph pinned to the rail's trailing edge. It
 * is transparent until the rail is hovered or the control is focused, always in
 * the tab order, and always has an accessible name. The rail also pauses on
 * hover and on focus-within, and `prefers-reduced-motion` stops it outright.
 */
export function RailViewport({ children }: { children: React.ReactNode }) {
  const [paused, setPaused] = useState(false);

  return (
    <div className={styles.railViewport} data-paused={paused || undefined}>
      <ul className={styles.railTrack}>{children}</ul>
      <button
        type="button"
        className={styles.railPause}
        onClick={() => setPaused((v) => !v)}
        aria-pressed={paused}
        aria-label={paused ? "Resume the client rail" : "Pause the client rail"}
      >
        <span aria-hidden="true">{paused ? "▶" : "❙❙"}</span>
      </button>
    </div>
  );
}
