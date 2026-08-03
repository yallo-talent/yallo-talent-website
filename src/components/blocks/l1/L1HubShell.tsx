import Link from "next/link";
import { HeroAtmosphere } from "@/components/ui/HeroAtmosphere";
import { PetalPlate } from "@/components/ui/PetalPlate";
import type { L1IndexEntry } from "@/data/l1/index";
import styles from "./L1HubShell.module.css";

interface Props {
  eyebrow: string;
  title: string;
  emphasis: string;
  sub: string;
  entries: L1IndexEntry[];
  /**
   * Real branches of the taxonomy with no page yet (B6).
   *
   * They render as cards, styled the same, but as a <div> rather than a <Link>
   * and carrying a visible marker. The alternative was what this replaced: the
   * capabilities hub listing only the two disciplines that have pages, under a
   * heading that says "Six cross-cutting capabilities" — so the page contradicted
   * its own H1 and hid two thirds of canon §3's taxonomy. A card that 404s is
   * worse than an absent card, but an honest card is better than both.
   */
  planned?: Array<{ slug: string; label: string }>;
}

export function L1HubShell({
  eyebrow,
  title,
  emphasis,
  sub,
  entries,
  planned,
}: Props) {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        {/* B3. The two "orbs" were exactly the blurred-orb treatment canon §5
            bans by name; the field replaces them with drawn geometry. */}
        <HeroAtmosphere seed={eyebrow} />
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
                /* `e.href` where the canonical route is not /{category}/{slug}.
                   AI Talent is the only such entry; see L1IndexEntry.href. */
                href={e.href ?? `/${e.category}/${e.slug}`}
                className={styles.card}
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

            {planned?.map((e) => (
              /* Not a link, and it does not pretend to be: no href, no hover
                 lift, no arrow, and a marker that says what it is. Focus order
                 skips it because there is nothing to activate. */
              <div
                key={e.slug}
                className={`${styles.card} ${styles.cardPlanned}`}
              >
                <div className={styles.cardImage}>
                  <PetalPlate
                    seed={e.slug}
                    className={styles.cardImg}
                    ratio={0.7}
                  />
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardCat}>Capability</div>
                  <h2 className={styles.cardTitle}>{e.label}</h2>
                  <div className={styles.cardPlannedMark}>Desk in build</div>
                </div>
              </div>
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
                Send a brief and we&apos;ll come back with a shortlist
                calibrated to your programme, inside 72 hours.
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
