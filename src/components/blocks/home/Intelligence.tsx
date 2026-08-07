import { intelligenceAssets, intelligenceCopy } from "@/data/home/intelligence";
import { AssetCta } from "./AssetCta";
import styles from "./Home.module.css";
import { SectionHead } from "./SectionHead";

/**
 * The Blueprint and the Atlas.
 *
 * Both destinations are published, so both cards link. That was not true when
 * this section was written and the cards carried a hand-set `published: false`
 * which nobody flipped when the routes shipped — see AssetCta, which derives the
 * state from the published route set so the question cannot be answered wrongly
 * again. The gated card takes the inverted corner — not an inverted ground,
 * which would breach the Two Band Rule.
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
              {/* The GATED / OPEN chips are gone. They labelled the asset by
                  its access model before saying what it was, which reads as
                  process rather than substance — and "GATED" on a card asking
                  for an email is a warning, not an invitation. Each card's own
                  CTA already says which is which ("Request the blueprint" vs
                  "Read the atlas"). The flag stays in the data for the request
                  form to key off. */}
              <h3>{a.title}</h3>
              <p className={styles.intelCopy}>{a.copy}</p>
              <ul className={styles.intelPoints}>
                {a.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <p className={styles.intelFoot}>
                <AssetCta label={a.cta.label} href={a.cta.href} />
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
