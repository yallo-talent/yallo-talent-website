import type { CaseStudyFrontmatter } from "@/lib/content-schema";
import styles from "./CaseStudyDetail.module.css";

/**
 * Block 4. The one permanently dark band on the page. Renders nothing where
 * the published source carries no sourced figures — a case study with no
 * metrics is not a broken page, and an empty dark band would be exactly the
 * invented-content pattern canon bans.
 */
export function MetricsStrip({
  metrics,
}: {
  metrics: CaseStudyFrontmatter["metrics"];
}) {
  if (!metrics || metrics.length === 0) return null;

  return (
    <section className={styles.metricsSection}>
      <div className={styles.wrap}>
        <span className={styles.metricsEyebrow}>Sourced results</span>
        <div className={styles.metricsGrid}>
          {metrics.map((m) => (
            <div key={`${m.label}-${m.value}`}>
              <div className={styles.metricValue}>{m.value}</div>
              <div className={styles.metricLabel}>{m.label}</div>
              <div className={styles.metricSource}>Source: {m.source}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
