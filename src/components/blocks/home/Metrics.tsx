import { metricsCopy } from "@/data/home/screen";
import { homeMetrics, metricsAttribution } from "@/data/metrics";
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
 * One dated attribution line renders beneath the block, naming each of the four
 * records once — round 17 §2.2, composed rather than typed. Not four labels, and
 * not silence. See src/lib/metrics-attribution.ts.
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

        <p className={styles.metricsSource}>{metricsAttribution}</p>
      </div>
    </section>
  );
}
