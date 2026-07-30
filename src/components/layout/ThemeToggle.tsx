"use client";

import { useEffect, useState } from "react";
import { DEFAULT_THEME, THEME_STORAGE_KEY, type Theme } from "@/config/theme";
import styles from "./ThemeToggle.module.css";

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

/**
 * Mirrors the pre-paint script in src/config/theme.ts: stored choice wins,
 * then the OS preference, then the build-time default.
 */
function readInitialTheme(): Theme {
  if (typeof window === "undefined") return DEFAULT_THEME;
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
  if (stored === "light" || stored === "dark") return stored;
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
  if (window.matchMedia("(prefers-color-scheme: light)").matches) return "light";
  return DEFAULT_THEME;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(readInitialTheme());
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // ignore quota / private-mode errors
    }
  };

  const isDark = theme === "dark";
  const label = mounted
    ? `Switch to ${isDark ? "light" : "dark"} theme`
    : "Toggle theme";

  return (
    <button
      type="button"
      className={styles.toggle}
      aria-label={label}
      aria-pressed={isDark}
      onClick={toggle}
      suppressHydrationWarning
    >
      <span className={styles.icon} aria-hidden="true">
        {mounted && isDark ? <MoonIcon /> : <SunIcon />}
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
