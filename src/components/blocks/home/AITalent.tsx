import { aiCopy, aiRoles } from "@/data/home/intelligence";
import styles from "./Home.module.css";
import { SectionHead } from "./SectionHead";

/**
 * Second and last inverted band on this page — the Two Band Rule is the ceiling.
 *
 * The Atlas route is unbuilt, so the CTA renders as a flagged non-interactive
 * label rather than a dead link.
 */
export function AITalent() {
  return (
    <section
      className={`${styles.section} ${styles.invert} band-invert amb-2 amb-wash`}
      id="ai-talent"
    >
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
              <p className={styles.aiStatValue}>{aiCopy.stat.value}</p>
              <p className={styles.aiStatClaim}>
                {aiCopy.stat.claim}
                <cite className={styles.aiStatSource}>
                  Source: {aiCopy.stat.source}
                </cite>
              </p>
            </div>
            <p className={styles.ctaRow}>
              <span className={styles.unbuiltFlag}>
                {aiCopy.cta.label} — in preparation
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
