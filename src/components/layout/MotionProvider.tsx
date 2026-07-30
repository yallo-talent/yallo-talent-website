"use client";

import { MotionConfig } from "framer-motion";

/**
 * Honours `prefers-reduced-motion` for every Framer Motion animation on the
 * site — canon §5, "for every animation".
 *
 * Framer Motion's default is `reducedMotion: "never"`, so until this existed
 * the entrance animations in L1PageShell, ServicePageShell, NavBar and
 * StickyBriefCTA ran regardless of the user's setting. The global
 * `@media (prefers-reduced-motion: reduce)` block in globals.css cannot reach
 * them: Framer writes inline transforms from JS, and no stylesheet rule
 * overrides an inline style. `"user"` makes Motion read the media query itself
 * and drop transform and layout animations while keeping opacity, which is the
 * behaviour the spec asks for.
 *
 * Wraps the whole tree rather than each consumer so a new `motion.*` anywhere
 * inherits it — the failure mode here is silent, and a per-component opt-in
 * would reintroduce it on the next component someone adds.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
