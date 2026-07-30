import styles from "./Home.module.css";

/**
 * The two-column section head — eyebrow, headline left, supporting sentence
 * right, bottom-aligned. It repeats on every section and is the strongest
 * rhythm in the system, so it lives in one place.
 */
export function SectionHead({
  eyebrow,
  heading,
  lede,
  id,
}: {
  eyebrow: string;
  heading: string;
  lede?: string;
  /** Anchors the H2 for in-page links and aria-labelledby. */
  id?: string;
}) {
  return (
    <>
      <p className="eyebrow">{eyebrow}</p>
      <div className={styles.head}>
        <h2 id={id}>{heading}</h2>
        {lede ? <p className={styles.headLede}>{lede}</p> : null}
      </div>
    </>
  );
}
