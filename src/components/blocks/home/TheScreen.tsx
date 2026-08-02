import { desks, screenCopy, screenSteps } from "@/data/home/screen";
import styles from "./Home.module.css";
import { ScreenGlyph } from "./icons";
import { SectionHead } from "./SectionHead";

/**
 * The four-phase mechanism, high on the page because it is the differentiator.
 *
 * The ghost numeral, icon tile, connector line and inline badge are carried
 * from the previous HowItWorks.tsx, whose execution of this pattern was
 * stronger than the prototype's. The glass-and-orb treatment around them is
 * not carried: that register is anti-reference.
 *
 * The six specialist desks replace the deleted "people who screen" section —
 * a named-specialist gallery would overclaim.
 */
export function TheScreen() {
  return (
    <section className={`${styles.section} ${styles.g1}`} id="screen">
      <div className={styles.wrap}>
        <SectionHead
          eyebrow={screenCopy.eyebrow}
          heading={screenCopy.heading}
          lede={screenCopy.lede}
          id="screen-heading"
        />

        <div className={styles.flow}>
          <span
            className={`flow-connector ${styles.connector}`}
            aria-hidden="true"
          />
          <ol className={styles.steps}>
            {screenSteps.map((s) => (
              <li key={s.num} className={styles.step}>
                <span className={styles.ghost} aria-hidden="true">
                  {s.num}
                </span>
                <span className={styles.stepIcon} aria-hidden="true">
                  <ScreenGlyph name={s.icon} />
                </span>
                <h3>{s.name}</h3>
                <p className={styles.stepCopy}>{s.copy}</p>
                <span className={styles.stepBadge}>{s.badge}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className={styles.desks}>
          <p className={styles.desksLabel}>{screenCopy.desksLabel}</p>
          <ul className={styles.desksList}>
            {desks.map((d) => (
              <li key={d} className="role-pill">
                {d}
              </li>
            ))}
          </ul>
          <p className={styles.desksNote}>{screenCopy.desksNote}</p>
        </div>
      </div>
    </section>
  );
}
