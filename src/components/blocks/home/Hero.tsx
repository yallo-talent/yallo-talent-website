import Link from "next/link";
import { entities, hero, instrument } from "@/data/home/hero";
import styles from "./Home.module.css";
import { ArrowGlyph, TickGlyph } from "./icons";

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-heading">
      <span className={styles.heroPetal} aria-hidden="true" />
      <div className={styles.wrap}>
        <div className={styles.heroGrid}>
          <div>
            <p className="eyebrow">{hero.eyebrow}</p>
            <h1 id="hero-heading" className={styles.heroHeadline}>
              {hero.headline.lead} <em>{hero.headline.emphasis}</em>
            </h1>
            <p className={styles.heroLede}>{hero.lede}</p>
            <ul className={styles.pillars}>
              {hero.pillars.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <div className={styles.ctaRow}>
              <Link className={styles.btnPrimary} href={hero.primaryCta.href}>
                {hero.primaryCta.label}
                <ArrowGlyph />
              </Link>
              <Link
                className={styles.btnSecondary}
                href={hero.secondaryCta.href}
              >
                {hero.secondaryCta.label}
              </Link>
            </div>
          </div>

          <Instrument />
        </div>

        <ul className={styles.entities}>
          {entities.map((e) => (
            <li key={e.city} className={styles.entity}>
              <span className={styles.entityMark} aria-hidden="true" />
              <span className={styles.entityCity}>{e.city}</span>
              <span className={styles.entityRole}>{e.role}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/**
 * The hero instrument. Illustrative, labelled as such, and drawn entirely in
 * markup — no image, no canvas. Bar widths are inline because they are data,
 * not style; the growth animation is CSS and is stopped by the global
 * reduced-motion block, which leaves the bars at their true width.
 */
function Instrument() {
  return (
    <figure className={styles.instrument} aria-label={instrument.label}>
      <span className={styles.sweep} aria-hidden="true" />

      <div className={styles.instrumentTop}>
        <span className={styles.live} aria-hidden="true" />
        <span>{instrument.status}</span>
        <span className={styles.requisition}>{instrument.requisition}</span>
      </div>

      <ol className={styles.phases}>
        {instrument.phases.map((p) => (
          <li
            key={p.key}
            className={[
              styles.phase,
              p.state === "active" ? styles.phaseActive : "",
              p.state === "done" ? styles.phaseDone : "",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-current={p.state === "active" ? "step" : undefined}
          >
            {p.state === "done" ? (
              <span className={styles.phaseTick} aria-hidden="true">
                <TickGlyph />
              </span>
            ) : null}
            <span className={styles.phaseKey}>{p.key}</span>
            <span className={styles.phaseName}>{p.name}</span>
          </li>
        ))}
      </ol>

      <div className={styles.candidates}>
        {instrument.candidates.map((c, i) => (
          <div key={c.name} className={styles.candidate}>
            <div>
              <div className={styles.candidateName}>{c.name}</div>
              <div className={styles.candidateMeta}>{c.meta}</div>
            </div>
            <div className={styles.bar}>
              <span
                className={styles.barFill}
                style={{ width: `${c.score}%`, animationDelay: `${i * 0.15}s` }}
              />
            </div>
            <div className={styles.candidateScore}>{c.score}</div>
          </div>
        ))}
        <div className={`${styles.candidate} ${styles.screenedOut}`}>
          <div>
            <div className={styles.candidateName}>
              {instrument.screenedOut.name}
            </div>
            <div className={styles.candidateMeta}>
              {instrument.screenedOut.meta}
            </div>
          </div>
          <div />
          <div className={styles.screenedOutScore} aria-hidden="true">
            —
          </div>
        </div>
      </div>

      <div className={styles.instrumentFoot}>
        {instrument.footer.map((f) => (
          <div key={f.label}>
            <div className={styles.footValue}>{f.value}</div>
            <div className={styles.footLabel}>{f.label}</div>
          </div>
        ))}
      </div>
    </figure>
  );
}
