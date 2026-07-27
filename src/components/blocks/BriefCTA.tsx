import Link from "next/link";
import styles from "./BriefCTA.module.css";

export function BriefCTA() {
  return (
    <section id="brief" className={styles.section}>
      <div className={styles.mesh} aria-hidden="true" />
      <div className={styles.orbA} aria-hidden="true" />
      <div className={styles.orbB} aria-hidden="true" />

      <div className={styles.wrap}>
        <div className={styles.card}>
          <div className={styles.cardGlow} aria-hidden="true" />
          <div className={styles.cardHighlight} aria-hidden="true" />

          <div className={styles.text}>
            <div className={styles.eye}>
              <span className={styles.eyeDot} aria-hidden="true" />
              Ready when you are
            </div>
            <h2 className={styles.h}>
              Send your brief.
              <br />
              <span className={styles.accent}>
                Get your shortlist in 72 hours.
              </span>
            </h2>
            <p className={styles.sub}>
              Your programme, your platform, your region — matched.
              Architect-led screening from operators who've run enterprise
              delivery themselves.
            </p>
          </div>

          <div className={styles.actions}>
            <Link href="/brief" className={styles.ctaPrimary}>
              Send us a brief
              <span aria-hidden="true">→</span>
            </Link>
            <Link href="/contract" className={styles.ctaGhost}>
              How contract works
            </Link>
          </div>

          <div className={styles.pillsRow}>
            <span className={styles.pill}>
              <span
                className={styles.pillDot}
                data-hue="blue"
                aria-hidden="true"
              />
              72h to shortlist
            </span>
            <span className={styles.pill}>
              <span
                className={styles.pillDot}
                data-hue="green"
                aria-hidden="true"
              />
              Architect-screened
            </span>
            <span className={styles.pill}>
              <span
                className={styles.pillDot}
                data-hue="rose"
                aria-hidden="true"
              />
              UK · ME · India
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
