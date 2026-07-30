import Link from "next/link";
import { commitmentColumns, commitmentCopy } from "@/data/home/commitment";
import styles from "./Home.module.css";
import { ArrowGlyph, TickGlyph } from "./icons";
import { SectionHead } from "./SectionHead";

/**
 * Real contractual terms, and nothing beyond them.
 *
 * Unique in the benchmarked category: every competitor converts to a
 * consultation with no published terms at all. No rates or fee percentages —
 * those live only inside the gated Blueprint.
 */
export function Commitment() {
  return (
    <section className={`${styles.section} ${styles.g1}`} id="commitment">
      <div className={styles.wrap}>
        <SectionHead
          eyebrow={commitmentCopy.eyebrow}
          heading={commitmentCopy.heading}
          lede={commitmentCopy.lede}
          id="commitment-heading"
        />

        <div className={styles.commitment}>
          {commitmentColumns.map((col) => (
            <div key={col.kind} className={styles.vow}>
              <span className={styles.panelPetal} aria-hidden="true" />
              <p className={styles.vowKind}>{col.kind}</p>
              <h3>{col.heading}</h3>

              <p className={styles.vowBadge}>
                <span className={styles.vowBadgeValue}>{col.badge.value}</span>
                <span className={styles.vowBadgeLabel}>{col.badge.label}</span>
              </p>

              <ul className={styles.vowTerms}>
                {col.terms.map((t) => (
                  <li key={t}>
                    <TickGlyph />
                    {t}
                  </li>
                ))}
              </ul>

              <p className={styles.vowFoot}>
                <Link className={styles.btnSecondary} href={col.cta.href}>
                  {col.cta.label}
                  <ArrowGlyph />
                </Link>
              </p>
            </div>
          ))}
        </div>

        <p className={styles.commitmentNote}>{commitmentCopy.note}</p>
      </div>
    </section>
  );
}
