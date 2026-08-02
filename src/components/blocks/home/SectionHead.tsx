import type { ReactNode } from "react";
import styles from "./Home.module.css";

/**
 * The two-column section head — eyebrow, headline left, supporting sentence
 * (or an action, for sections that need one instead) right, bottom-aligned.
 * It repeats on every section and is the strongest rhythm in the system, so
 * it lives in one place.
 */
export function SectionHead({
  eyebrow,
  heading,
  lede,
  action,
  id,
}: {
  eyebrow: string;
  heading: string;
  lede?: string;
  /** Right column, in place of `lede`, for a section that needs a link instead. */
  action?: ReactNode;
  /** Anchors the H2 for in-page links and aria-labelledby. */
  id?: string;
}) {
  return (
    <>
      <p className="eyebrow">{eyebrow}</p>
      <div className={styles.head}>
        <h2 id={id}>{heading}</h2>
        {lede ? <p className={styles.headLede}>{lede}</p> : null}
        {action}
      </div>
    </>
  );
}
