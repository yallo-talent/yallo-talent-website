import Link from "next/link";
import { entities, hero } from "@/data/home/hero";
import styles from "./Home.module.css";
import { Instrument } from "./Instrument";
import { ArrowGlyph } from "./icons";

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
