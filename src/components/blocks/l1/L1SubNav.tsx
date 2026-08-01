"use client";

import { useEffect, useState } from "react";
import styles from "./L1PageShell.module.css";

/**
 * The sticky in-page section bar.
 *
 * Extracted from L1PageShell so the platform L1 can use the SAME component
 * rather than a copy of it. It was private to that file, which is why the
 * platform template — bespoke on Home.module.css — had no section bar at all
 * while every sector and capability page had one.
 *
 * Styles stay in L1PageShell.module.css: the bar is part of that shell's
 * grammar, and splitting the CSS would let the two drift.
 */
export function L1SubNav({
  items,
}: {
  items: { id: string; label: string }[];
}) {
  const [active, setActive] = useState<string>(items[0]?.id ?? "");
  useEffect(() => {
    if (typeof window === "undefined") return;
    const observers: IntersectionObserver[] = [];
    for (const item of items) {
      const el = document.getElementById(item.id);
      if (!el) continue;
      const obs = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) setActive(item.id);
          }
        },
        { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
      );
      obs.observe(el);
      observers.push(obs);
    }
    return () => {
      for (const o of observers) o.disconnect();
    };
  }, [items]);

  return (
    <nav className={styles.subNav} aria-label="Page sections">
      <div className={styles.subNavInner}>
        <ul className={styles.subNavList}>
          {items.map((it) => (
            <li key={it.id} className={styles.subNavItem}>
              <a
                href={`#${it.id}`}
                className={`${styles.subNavLink} ${active === it.id ? styles.subNavLinkActive : ""}`}
              >
                {it.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
