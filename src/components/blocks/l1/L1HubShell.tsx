import Link from "next/link";
import { PetalPlate } from "@/components/ui/PetalPlate";
import type { L1IndexEntry } from "@/data/l1/index";
import styles from "./L1HubShell.module.css";

interface Props {
  eyebrow: string;
  title: string;
  emphasis: string;
  sub: string;
  entries: L1IndexEntry[];
}

export function L1HubShell({ eyebrow, title, emphasis, sub, entries }: Props) {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroOrbA} aria-hidden="true" />
        <div className={styles.heroOrbB} aria-hidden="true" />
        <div className={styles.heroGrid} aria-hidden="true" />
        <div className={styles.heroInner}>
          <div className={styles.heroEyebrow}>
            <span className={styles.heroEyebrowDot} aria-hidden="true" />
            {eyebrow}
          </div>
          <h1 className={styles.heroTitle}>
            {title}
            <br />
            <span className={styles.heroEmphasis}>{emphasis}</span>
          </h1>
          <p className={styles.heroSub}>{sub}</p>
        </div>
      </section>

      <section className={styles.grid}>
        <div className={styles.wrap}>
          <div className={styles.cards}>
            {entries.map((e) => (
              <Link
                key={e.slug}
                href={`/${e.category}/${e.slug}`}
                className={styles.card}
                style={
                  {
                    "--sector-accent": `var(--hue-${e.hue}-500)`,
                    "--sector-accent-08": `var(--hue-${e.hue}-08)`,
                    "--sector-accent-20": `var(--hue-${e.hue}-20)`,
                    "--sector-accent-35": `var(--hue-${e.hue}-35)`,
                  } as React.CSSProperties
                }
              >
                <div className={styles.cardImage}>
                  <PetalPlate
                    seed={e.slug}
                    className={styles.cardImg}
                    ratio={0.7}
                  />
                  <div className={styles.cardTint} aria-hidden="true" />
                  <div className={styles.cardOverlay} aria-hidden="true" />
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardCat}>
                    {e.category === "industries"
                      ? "Industry"
                      : e.category === "platforms"
                        ? "Platform"
                        : "Capability"}
                  </div>
                  <h2 className={styles.cardTitle}>{e.label}</h2>
                  <p className={styles.cardTag}>{e.tagline}</p>
                  <span className={styles.cardArr} aria-hidden="true">
                    Explore →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.bottomCta}>
        <div className={styles.wrap}>
          <div className={styles.bottomCard}>
            <div>
              <div className={styles.bottomEyebrow}>Ready to hire?</div>
              <h2 className={styles.bottomH}>Talent for every one of these.</h2>
              <p className={styles.bottomSub}>
                Send a brief and we'll come back with a shortlist calibrated to
                your programme, inside 72 hours.
              </p>
            </div>
            <div className={styles.bottomActions}>
              <Link href="/brief" className={styles.ctaPrimary}>
                Send us a brief
                <span aria-hidden="true">→</span>
              </Link>
              <Link href="/#how" className={styles.ctaGhost}>
                See how it works
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
