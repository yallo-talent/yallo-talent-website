"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_THEME, THEME_STORAGE_KEY, type Theme } from "@/config/theme";
import styles from "./ThemeToggle.module.css";

/**
 * ROUND 10. The old version held the theme in `useState`, seeded it from a
 * mount effect, and carried a second `mounted` flag purely so the first render
 * could match the server. That is the react-hooks/set-state-in-effect pattern
 * in its textbook form, and the flag was the tell: two pieces of state
 * describing one fact that already existed outside React.
 *
 * It already exists on <html>. The pre-paint script in src/config/theme.ts
 * resolves stored choice, then `prefers-color-scheme`, then the build default,
 * and stamps `data-theme` before first paint. So the attribute is the single
 * source of truth and this component is a view of it — which is precisely what
 * useSyncExternalStore is for. The mount effect goes, the `mounted` flag goes,
 * and the accessible name is correct from the first client render instead of
 * reading "Toggle theme" until an effect has run.
 *
 * ROUND 14: mounted twice in NavBar — the header actions row (desktop
 * only past 1024px) and the mobile drawer (round14-scope.md §3(b)). Two
 * instances of the same external-store subscription, never out of sync
 * with each other because both read the one `data-theme` attribute.
 * Rounds 10-13 left this unmounted as a deliberate open question — canon §2
 * ("light is the default register") reads as a default, not a ban on
 * switching, and light and dark have been peers in globals.css since round
 * 10 (src/config/theme.ts), each independently AA. The open question was
 * whether the site gets a user-facing switch at all, not whether dark was
 * ready; round 14 answers it by mounting rather than re-deferring.
 */
function subscribe(onChange: () => void): () => void {
  /* The attribute is written by three parties: the pre-paint script, this
     component's own toggle, and nothing else. A MutationObserver covers all of
     them without needing any of them to know this component exists. */
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });

  /* The OS preference still wins while the visitor has made no stored choice,
     so a mid-session OS switch has to repaint. Guarded on storage so an
     explicit choice is never overridden. */
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onMedia = () => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    } catch {
      // private mode: treat as no stored choice
    }
    if (stored === "light" || stored === "dark") return;
    document.documentElement.setAttribute(
      "data-theme",
      media.matches ? "dark" : "light",
    );
  };
  media.addEventListener("change", onMedia);

  return () => {
    observer.disconnect();
    media.removeEventListener("change", onMedia);
  };
}

function getSnapshot(): Theme {
  const attr = document.documentElement.getAttribute("data-theme");
  return attr === "dark" || attr === "light" ? attr : DEFAULT_THEME;
}

/* The server has no <html> to read and no visitor to read it for. React uses
   this for the hydration render, then reconciles against getSnapshot without a
   mismatch warning, which is what replaced the `mounted` flag. */
function getServerSnapshot(): Theme {
  return DEFAULT_THEME;
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isDark = theme === "dark";

  const toggle = () => {
    const next: Theme = isDark ? "light" : "dark";
    /* Write to the external system and let the observer bring the value back.
       One direction, so the attribute and the button can never disagree. */
    document.documentElement.setAttribute("data-theme", next);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // ignore quota / private-mode errors
    }
  };

  return (
    <button
      type="button"
      className={styles.toggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      aria-pressed={isDark}
      onClick={toggle}
      suppressHydrationWarning
    >
      <span className={styles.icon} aria-hidden="true">
        {isDark ? <MoonIcon /> : <SunIcon />}
      </span>
    </button>
  );
}

function SunIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
