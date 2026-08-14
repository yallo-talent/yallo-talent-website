import Link from "next/link";
import { jobSeekersLink } from "@/components/layout/nav-config";
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
              {/* A plain <a> carrying the shared anchor props, not next/link:
                  the board is a different system on a different host, so this
                  leaves the site and says so. The label is still the data
                  file's; only the address moved out of it. */}
              {/* href restated from the object the spread came from. A spread is
                  opaque to biome, so without it the anchor reads as a generic
                  element and aria-label reads as unsupported on it. Same
                  accommodation as the mobile drawer's Jobs anchor. */}
              <a
                {...jobSeekersLink.anchorProps}
                href={jobSeekersLink.anchorProps.href}
                className={styles.jobsLink}
                /* NOT the shared "Jobs, opens in a new tab": SC 2.5.3 wants the
                   accessible name to contain the visible label, and this link's
                   visible label is its own sentence. */
                aria-label={`${closeCopy.jobsCta.label}, opens in a new tab`}
              >
                {closeCopy.jobsCta.label}
              </a>
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
