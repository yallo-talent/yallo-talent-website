import { aiCopy, aiRoles } from "@/data/home/intelligence";
import styles from "./Home.module.css";
import { SectionHead } from "./SectionHead";

/**
 * A light band. This carried the page's second inversion until the two
 * inversions turned out to be adjacent — WherePlace then AITalent read as one
 * ~2,800px slab, spending both permitted bands on a single perceived signal.
 * The second inversion moved to Evidence, which is the actual data surface a
 * dossier would invert.
 *
 * The Atlas route is unbuilt, so the CTA renders as a flagged non-interactive
 * label rather than a dead link.
 */
export function AITalent() {
  return (
    <section className={`${styles.section} ${styles.g2}`} id="ai-talent">
      <div className={styles.wrap}>
        <SectionHead
          eyebrow={aiCopy.eyebrow}
          heading={aiCopy.heading}
          lede={aiCopy.lede}
          id="ai-heading"
        />

        <div className={styles.aiGrid}>
          <div>
            <div className={styles.aiStat}>
              <span className={styles.aiStatValue}>{aiCopy.stat.value}</span>
              <p className={styles.aiStatClaim}>
                {aiCopy.stat.claim}
                <cite className={styles.aiStatSource}>
                  Source: {aiCopy.stat.source}
                </cite>
              </p>
            </div>
            <p className={styles.ctaRow}>
              <span className={styles.unbuiltFlag}>
                {aiCopy.cta.label}, in preparation
              </span>
            </p>
          </div>

          <ul className={styles.aiRoles}>
            {aiRoles.map((r) => (
              <li key={r.name} className={styles.aiRole}>
                <span className={styles.aiRoleName}>{r.name}</span>
                <span className={styles.aiRoleScope}>{r.scope}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
