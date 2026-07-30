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
 * No divider. There was a hairline rule between the wordmark and TALENT, doing
 * the separating that spacing and contrast should do — and a rule at this scale
 * is a fifth element competing with four petals, a serif and a mono caps run.
 * The separation is now optical and comes from three things at once: the gap
 * before TALENT is wider than the gap after the mark, TALENT's 0.3em tracking
 * opens its own space, and it sits a step down in size and weight against
 * `--fg-muted` while the wordmark holds the accent. Read left to right the
 * emphasis falls mark, name, qualifier — which is the hierarchy the words have.
 *
 * Identical in both places, with no size prop. An earlier version let the footer
 * run larger, but "identical header, footer and favicon derivations" is the
 * actual instruction, and a second size is a second thing to keep in step.
 */
export function Lockup({ className }: { className?: string }) {
  return (
    <span className={`${styles.lockup} ${className ?? ""}`}>
      <YalloFlower size={36} className={styles.mark} />
      <span className={styles.text}>
        <span className={styles.wordmark}>Yallo</span>
        <span className={styles.suffix}>Talent</span>
      </span>
    </span>
  );
}
