import { orderedCaseStudies } from "@/lib/case-study-order";
import { getAllCaseStudies } from "@/lib/content";
import styles from "../../Admin.module.css";

/**
 * Pane 3, Case studies. READ in this round; create and reorder are the write
 * pane, and per round 17 §2.3's stop condition a half-built write path that
 * commits to `main` is worse than no write path.
 *
 * WHAT IS LISTED, and in what order. `orderedCaseStudies()` — the same function
 * the homepage rail and /case-studies render from, so this pane cannot show an
 * order the site does not publish. content/case-studies/order.yaml is the single
 * editorial source; a study not named there appends in date order behind those
 * that are.
 *
 * `clientPublic` is surfaced on every row because it is the field with a
 * consent rule behind it: false until written consent to name the client and use
 * their logo is on file. Showing it as a state rather than hiding it means the
 * cockpit can be used to audit consent, not only to author.
 *
 * UNPUBLISHED studies are listed too, behind the published ones.
 * `orderedCaseStudies()` drops them, correctly — `published: false` is a
 * statement about the study, not about its position — but a cockpit that shows
 * only what is live cannot answer "where did that draft go", which is precisely
 * the question a file-based CMS with no index invites.
 */
export const dynamic = "force-dynamic";

export default function CaseStudiesPane() {
  const all = getAllCaseStudies();
  const studies = orderedCaseStudies(all);
  const publishedSlugs = new Set(studies.map((s) => s.frontmatter.slug));
  const unpublished = all.filter(
    (s) => !publishedSlugs.has(s.frontmatter.slug),
  );

  return (
    <>
      <h1 className={styles.h1}>Case studies</h1>
      <p className={styles.lede}>
        Everything in <code>content/case-studies/</code>, in the published order
        from <code>order.yaml</code> — the same order the homepage rail and{" "}
        <code>/case-studies</code> render. Creating and reordering are not wired
        yet; this pane reads.
      </p>

      <p className={styles.count}>
        {studies.length} published · {unpublished.length} unpublished
      </p>
      <ul className={styles.rows}>
        {[...studies, ...unpublished].map((study, i) => (
          <li key={study.frontmatter.slug} className={styles.row}>
            <div className={styles.rowHead}>
              <span className={styles.meta}>
                {i < studies.length ? i + 1 : "—"}
              </span>
              <p className={styles.rowTitle}>{study.frontmatter.title}</p>
              <span className={styles.meta}>{study.frontmatter.date}</span>
              <span className={styles.meta}>{study.frontmatter.region}</span>
              {study.frontmatter.engagement ? (
                <span className={styles.meta}>
                  {study.frontmatter.engagement}
                </span>
              ) : null}
              <span
                className={
                  study.frontmatter.clientPublic ? styles.ok : styles.bad
                }
              >
                {study.frontmatter.clientPublic
                  ? `client named: ${study.frontmatter.client}`
                  : "client not named"}
              </span>
              {study.frontmatter.published === false ? (
                <span className={styles.bad}>unpublished</span>
              ) : null}
            </div>
            <p className={styles.meta}>{study.frontmatter.slug}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
