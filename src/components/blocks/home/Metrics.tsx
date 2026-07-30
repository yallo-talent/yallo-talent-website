import { metricsCopy } from "@/data/home/screen";
import { homeMetrics } from "@/data/metrics";
import styles from "./Home.module.css";
import { MetricValue } from "./MetricValue";
import { SectionHead } from "./SectionHead";

/**
 * The four published metrics.
 *
 * Server component: the real value is in the markup, so crawlers, social
 * scrapers and non-scrolling readers see "80%", never "0". MetricValue is a
 * thin client wrapper that animates *from* zero after hydration, and only when
 * motion is permitted.
 *
 * No source lines and no "as at" date render — see content/metrics.yaml for why.
 */
export function Metrics() {
  return (
    <section className={`${styles.section} ${styles.g2}`} id="metrics">
      <div className={styles.wrap}>
        <SectionHead
          eyebrow={metricsCopy.eyebrow}
          heading={metricsCopy.heading}
          lede={metricsCopy.lede}
          id="metrics-heading"
        />

        <dl className={styles.metrics}>
          {homeMetrics.map((m) => (
            <div key={m.label} className={styles.metric}>
              <span className={styles.metricPetal} aria-hidden="true" />
              <dd className={styles.metricValue}>
                <MetricValue target={m.target} suffix={m.suffix ?? ""} />
              </dd>
              <dt className={styles.metricLabel}>{m.label}</dt>
              <dd className={styles.metricDefinition}>{m.definition}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
