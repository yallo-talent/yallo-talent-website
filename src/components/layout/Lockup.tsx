import styles from "./Lockup.module.css";
import { YalloFlower } from "./YalloFlower";

/**
 * The lockup: flower mark, "Yallo" wordmark, "TALENT" to the RIGHT of it.
 *
 * ONE component, so header and footer cannot drift. They previously each carried
 * their own markup and their own `.brand*` rules in two stylesheets — identical
 * by coincidence rather than by construction, and canon §5 asks for one lockup
 * across header, footer and the favicon derivations.
 *
 * A divider, deliberately. R15 removed the original hairline on the argument
 * that spacing and contrast should do the separating; round 2 measured what
 * that actually produced and found the opposite fault — TALENT rendered wider
 * than the brand it qualifies, detached from it, and in a second colour. Empty
 * space cannot both separate and bind, so the eye read a logo with a stray word
 * beside it. Variant G restores a short gold rule, which does both jobs at
 * once. Read left to right the emphasis still falls mark, name, qualifier.
 *
 * This is a reversal of an R15 decision, not a regression: see the G block in
 * Lockup.module.css for the diagnosis it answers.
 *
 * Identical in both places, with no size prop. An earlier version let the footer
 * run larger, but "identical header, footer and favicon derivations" is the
 * actual instruction, and a second size is a second thing to keep in step.
 */
export function Lockup({
  className,
  variant,
}: {
  className?: string;
  /**
   * R15 alternate. Omit for the shipped treatment, which is G (ruled). a/b/c/d
   * are the round-1 alignment studies; e/f/g are round 2 and address the real
   * fault — TALENT out-measuring the brand it qualifies. See the CSS for the
   * numbers.
   */
  variant?: "a" | "b" | "c" | "d" | "e" | "f" | "g";
}) {
  return (
    <span
      className={`${styles.lockup} ${className ?? ""}`}
      data-lockup={variant}
    >
      <YalloFlower size={36} className={styles.mark} />
      <span className={styles.text}>
        <span className={styles.wordmark}>Yallo</span>
        {/* A real space, and it is load-bearing for WCAG 2.5.3.
            The gap between the wordmark and the qualifier was CSS only, so the
            lockup's textContent read "YalloTalent" with nothing between the
            words. The header brand link takes its accessible name from
            aria-label="Yallo Talent home", and Label in Name asks that the name
            contain the visible label: "yallotalent" is not inside "yallo talent
            home", so the Phase 8 Lighthouse run failed
            label-content-name-mismatch on every one of the eight routes
            measured. Measured, not inferred - textContent "YalloTalent" against
            an aria-label of "Yallo Talent home".
            .text is display:flex, so a whitespace-only node is not a flex item
            and the painted lockup does not move; the measured width is 137.55px
            either way. The repo's own axe gate never caught this because
            label-content-name-mismatch is an axe experimental rule and the gate
            does not run experimental rules. */}{" "}
        <span className={styles.suffix}>Talent</span>
      </span>
    </span>
  );
}
