import Link from "next/link";
import { closeCopy } from "@/data/home/intelligence";
import styles from "./Home.module.css";
import { ArrowGlyph } from "./icons";

/**
 * The close. Programme-shaped, not vacancy-shaped.
 *
 * Permanently dark rather than theme-following: it is the page's terminal
 * surface and reads as the back cover of the dossier. This does not count
 * against the Two Band Rule because it is not an inverted *band* inside the
 * flow — it is the end of the document.
 *
 * The one quiet punchout to /jobs lives here, and nowhere in the buyer path
 * above it.
 */
export function Close() {
  return (
    <section
      className={styles.close}
      id="start"
      aria-labelledby="close-heading"
    >
      <span className={styles.closePetal} aria-hidden="true" />
      <div className={styles.wrap}>
        <div className={styles.closeGrid}>
          <div>
            <p className={styles.closeEyebrow}>{closeCopy.eyebrow}</p>
            <h2 id="close-heading">
              {closeCopy.headline.lead} <em>{closeCopy.headline.emphasis}</em>
            </h2>
            <p className={styles.closeLede}>{closeCopy.lede}</p>
            <div className={styles.ctaRow}>
              <Link
                className={styles.btnPrimary}
                href={closeCopy.primaryCta.href}
              >
                {closeCopy.primaryCta.label}
                <ArrowGlyph />
              </Link>
              <Link className={styles.jobsLink} href={closeCopy.jobsCta.href}>
                {closeCopy.jobsCta.label}
              </Link>
            </div>
          </div>

          <div className={styles.brief}>
            <p className={styles.briefTitle}>{closeCopy.checklistTitle}</p>
            <ol className={styles.briefList}>
              {closeCopy.checklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
            <p className={styles.briefFoot}>
              <Link className={styles.btnPrimary} href={closeCopy.send.href}>
                {closeCopy.send.label}
                <ArrowGlyph />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
