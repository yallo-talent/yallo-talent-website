"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Renders the real value on the server, then counts up to it after hydration.
 *
 * The previous implementation initialised a motion value at 0 and rendered it
 * directly, so the server-rendered HTML contained "0" and the true figure only
 * appeared once a JS-enabled client scrolled it into view. That put "0hrs Brief
 * to Shortlist" in front of crawlers across three successive builds.
 *
 * Two rules here:
 *  - `target` is the initial state, so markup is correct with JS disabled.
 *  - The animation is skipped entirely under prefers-reduced-motion. CSS alone
 *    cannot stop a JS-driven count, so it is checked here.
 */
export function MetricValue({
  target,
  suffix,
}: {
  target: number;
  suffix: string;
}) {
  const [value, setValue] = useState(target);
  const ref = useRef<HTMLSpanElement>(null);
  const played = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || played.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting || played.current) return;
        played.current = true;
        observer.disconnect();

        const duration = 1100;
        const start = performance.now();
        setValue(0);

        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          // easeOutCubic — settles rather than stopping dead
          const eased = 1 - (1 - t) ** 3;
          setValue(Math.round(target * eased));
          if (t < 1) requestAnimationFrame(tick);
          else setValue(target);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}
