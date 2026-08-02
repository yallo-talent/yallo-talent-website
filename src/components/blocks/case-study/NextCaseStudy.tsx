import Link from "next/link";
import styles from "./CaseStudyDetail.module.css";

/** Block 6. One next case study, from the ordered set. Not a grid. */
export function NextCaseStudy({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  return (
    <section className={styles.nextSection}>
      <div className={styles.wrap}>
        <span className={styles.nextEyebrow}>Next case study</span>
        <Link href={`/case-studies/${slug}`} className={styles.nextCard}>
          <h2 className={styles.nextTitle}>{title}</h2>
          <span className={styles.nextLink} aria-hidden="true">
            Read it →
          </span>
        </Link>
      </div>
    </section>
  );
}
