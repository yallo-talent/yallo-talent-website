import Link from "next/link";
import { deskLinksFor, relatedByTaxonomy } from "@/lib/content-seo";
import type { ArticleRow } from "@/lib/db/content";
import styles from "./EditorialLayout.module.css";

/**
 * The two automatic rails design §6 asks every published piece to carry: links
 * to the desks its taxonomy names, and other pieces sharing that taxonomy.
 *
 * ONE COMPONENT FOR BOTH CONTENT TYPES. Articles relate to articles and case
 * studies to case studies — a rail that mixed the two would send a reader from
 * a piece of thinking to a piece of proof with no signal that the register
 * changed — so the caller supplies its own candidate set and its own route
 * prefix, and everything else is identical. Two copies of this would be two
 * places for the derivation to drift.
 *
 * NOTHING IS AUTHORED AND NOTHING IS STORED. Both rails are computed from the
 * taxonomy values already on the row, so a desk renamed in its index is renamed
 * everywhere it appears and a piece retagged moves rails without anyone editing
 * a link. That is the difference between an automatic rail and a `related`
 * field somebody has to remember to keep true.
 *
 * AN EMPTY RAIL RENDERS NOTHING, not a heading over a void — the same rule the
 * testimonial slot and the insights library follow. A piece can legitimately be
 * the only one carrying its tags, and on a site with one published article that
 * is the normal case rather than the edge one.
 */
export interface ContentRailsProps {
  row: ArticleRow;
  /** Published rows of the SAME type, the subject included; it filters itself. */
  candidates: readonly ArticleRow[];
  /** `/insights` or `/case-studies` — where a related piece's link points. */
  subjectPathPrefix: string;
  hubHref: string;
}

export function ContentRails({
  row,
  candidates,
  subjectPathPrefix,
}: ContentRailsProps) {
  const desks = deskLinksFor(row);
  const related = relatedByTaxonomy(row, candidates);
  if (desks.length === 0 && related.length === 0) return null;

  return (
    <section className={`${styles.section} ${styles.sectionAlt}`}>
      <div className={styles.wrap}>
        <div className={styles.sectionInner}>
          {desks.length > 0 && (
            <>
              <span className={styles.sectionEyebrow}>The desks behind it</span>
              <h2 className={styles.sectionH}>
                Who we screen for this{" "}
                <span className={styles.emphasis}>work.</span>
              </h2>
              <div className={styles.cardGrid3}>
                {desks.map((desk) => (
                  <Link
                    className={styles.card}
                    href={desk.href}
                    key={desk.href}
                  >
                    <h3 className={styles.cardTitle}>{desk.label}</h3>
                    <p className={styles.cardCopy}>{desk.tagline}</p>
                  </Link>
                ))}
              </div>
            </>
          )}

          {related.length > 0 && (
            <>
              <span className={styles.sectionEyebrow}>Read next</span>
              <div className={styles.cardGrid3}>
                {related.map((other) => (
                  <Link
                    className={styles.card}
                    href={`${subjectPathPrefix}/${other.slug}`}
                    key={other.id}
                  >
                    <span className={styles.sectionEyebrow}>
                      {other.category} · {Math.max(1, other.readingTimeMinutes)}{" "}
                      min read
                    </span>
                    <h3 className={styles.cardTitle}>{other.title}</h3>
                    <p className={styles.cardCopy}>{other.summary}</p>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
