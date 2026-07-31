"use client";

import { useState } from "react";
import styles from "./Home.module.css";

/**
 * The rail's interactive shell — and it exists to keep LogoRail on the server.
 *
 * R7 requires a real pause control: the rail carries client marks, which are
 * information rather than decoration, and it drifts on a 64s loop, so it is
 * auto-advancing content under SC 2.2.2 at Level A. `.railViewport:hover` worked
 * and served a mouse only — the viewport holds no focusable elements, so a
 * keyboard user had no route and a touch user none at all.
 *
 * The state has to live in a client component, but `getConsentedClients` reads
 * the consent file at build time and is server-only. Making LogoRail a client
 * component broke the build outright. So the split is deliberate: the marks stay
 * server-rendered and arrive as children, and only the viewport and its control
 * are client-side.
 *
 * Canon §5 now reads "pause on hover PLUS a control". The button states its own
 * state in words rather than relying on an icon.
 */
export function RailViewport({
  children,
  caption,
}: {
  children: React.ReactNode;
  caption: string;
}) {
  const [paused, setPaused] = useState(false);

  return (
    <>
      <div className={styles.railViewport} data-paused={paused || undefined}>
        <ul className={styles.railTrack}>{children}</ul>
      </div>
      <div className={styles.wrap}>
        <p className={styles.railCaption}>{caption}</p>
        <button
          type="button"
          className={styles.railPause}
          onClick={() => setPaused((v) => !v)}
          aria-pressed={paused}
        >
          {paused ? "Resume the client rail" : "Pause the client rail"}
        </button>
      </div>
    </>
  );
}
