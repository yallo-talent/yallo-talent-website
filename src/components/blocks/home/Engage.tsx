import Link from "next/link";
import { engageCopy, engagementModels } from "@/data/home/engage";
import styles from "./Home.module.css";
import { ArrowGlyph } from "./icons";
import { SectionHead } from "./SectionHead";

/**
 * Four models, contract leading.
 *
 * Native details/summary: it is keyboard accessible, works without JS, and is
 * announced correctly by screen readers with no ARIA of our own. Contract is
 * open by default because it is the lead motion.
 *
 * One line of positioning per model plus "right for" chips. No paragraphs.
 */
export function Engage() {
  return (
    <section className={`${styles.section} ${styles.g2}`} id="engage">
      <div className={styles.wrap}>
        <SectionHead
          eyebrow={engageCopy.eyebrow}
          heading={engageCopy.heading}
          lede={engageCopy.lede}
          id="engage-heading"
        />

        <div className={styles.accordion}>
          {engagementModels.map((m) => (
            <details key={m.name} className={styles.model} open={m.lead}>
              <summary className={styles.modelSummary}>
                <span className={styles.modelNum}>{m.num}</span>
                <span>
                  <span className={styles.modelName}>{m.name}</span>
                  <span className={styles.modelPositioning}>
                    {m.positioning}
                  </span>
                </span>
                {m.lead ? <span className={styles.leadFlag}>Lead</span> : null}
                <span className={styles.chevron} aria-hidden="true" />
              </summary>

              <div className={styles.modelBody}>
                <p className={styles.rightForLabel}>Right for</p>
                <ul className={styles.chips}>
                  {m.rightFor.map((c) => (
                    <li key={c} className="role-pill">
                      {c}
                    </li>
                  ))}
                </ul>
                <p>
                  <Link className={styles.btnSecondary} href={m.href}>
                    See how {m.name} works
                    <ArrowGlyph />
                  </Link>
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
