import { intelligenceAssets, intelligenceCopy } from "@/data/home/intelligence";
import styles from "./Home.module.css";
import { SectionHead } from "./SectionHead";

/**
 * The Blueprint and the Atlas.
 *
 * Neither route is built yet, so both cards render non-interactive with a
 * visible state rather than a dead CTA. The gated card takes the inverted
 * corner — not an inverted ground, which would breach the Two Band Rule.
 */
export function Intelligence() {
  return (
    <section className={`${styles.section} ${styles.g3}`} id="intelligence">
      <div className={styles.wrap}>
        <SectionHead
          eyebrow={intelligenceCopy.eyebrow}
          heading={intelligenceCopy.heading}
          lede={intelligenceCopy.lede}
          id="intelligence-heading"
        />

        <div className={styles.intelGrid}>
          {intelligenceAssets.map((a) => (
            <article
              key={a.title}
              className={`${styles.intelCard} ${a.invertCorner ? styles.intelCardInvert : ""}`}
            >
              <span className={styles.panelPetal} aria-hidden="true" />
              <p className={styles.intelFlag}>{a.flag}</p>
              <h3>{a.title}</h3>
              <p className={styles.intelCopy}>{a.copy}</p>
              <ul className={styles.intelPoints}>
                {a.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <p className={styles.intelFoot}>
                <span className={styles.unbuiltFlag}>
                  {a.cta.label} — in preparation
                </span>
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
