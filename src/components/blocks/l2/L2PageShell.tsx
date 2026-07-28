"use client";

import Image from "next/image";
import Link from "next/link";
import type { L1ExpertiseCard, L1Hue, L1PageData } from "@/data/l1/types";
import styles from "./L2PageShell.module.css";

const hueStyle = (hue: L1Hue): React.CSSProperties =>
  ({
    "--sector-accent": `var(--hue-${hue}-500)`,
    "--sector-accent-08": `var(--hue-${hue}-08)`,
    "--sector-accent-20": `var(--hue-${hue}-20)`,
    "--sector-accent-35": `var(--hue-${hue}-35)`,
  }) as React.CSSProperties;

const cardHueCycle: L1Hue[] = [
  "blue",
  "teal",
  "violet",
  "rose",
  "green",
  "orange",
];

const cardHueStyle = (hue: L1Hue): React.CSSProperties =>
  ({
    "--card-hue": `var(--hue-${hue}-500)`,
    "--card-hue-08": `var(--hue-${hue}-08)`,
    "--card-hue-20": `var(--hue-${hue}-20)`,
    "--card-hue-35": `var(--hue-${hue}-35)`,
  }) as React.CSSProperties;

interface Props {
  /** The L1 page data for the parent sector — provides sidebar list + hero image + hue. */
  sector: L1PageData;
  /** The specific L2 function being rendered. */
  fn: L1ExpertiseCard;
}

export function L2PageShell({ sector, fn }: Props) {
  return (
    <div className={styles.page} style={hueStyle(sector.hue)}>
      <div className={styles.layout}>
        <L2Sidebar sector={sector} activeSlug={fn.slug} />
        <main className={styles.main}>
          <L2Hero sector={sector} fn={fn} />
        </main>
      </div>
    </div>
  );
}

/* ============ HERO ============ */
function L2Hero({
  sector,
  fn,
}: {
  sector: L1PageData;
  fn: L1ExpertiseCard;
}) {
  return (
    <section className={styles.hero}>
      <div className={styles.heroImageWrap}>
        <Image
          src={sector.heroImage}
          alt={sector.heroImageAlt}
          fill
          priority
          sizes="(max-width: 900px) 100vw, calc(100vw - 280px)"
          className={styles.heroImage}
        />
      </div>
      <div className={styles.heroTint} aria-hidden="true" />
      <div className={styles.heroOverlay} aria-hidden="true" />
      <div className={styles.heroGrid} aria-hidden="true" />
      <div className={styles.heroInner}>
        <nav className={styles.crumb} aria-label="Breadcrumb">
          <Link href="/industries" className={styles.crumbLink}>
            Industries
          </Link>
          <span className={styles.crumbSep} aria-hidden="true">
            /
          </span>
          <Link
            href={`/industries/${sector.slug}`}
            className={styles.crumbLink}
          >
            {sector.title.split("&")[0]?.trim() ?? sector.title}
          </Link>
          <span className={styles.crumbSep} aria-hidden="true">
            /
          </span>
          <span className={styles.crumbCurrent}>{fn.title}</span>
        </nav>

        <div className={styles.heroEyebrow}>
          <span className={styles.heroEyebrowDot} aria-hidden="true" />
          {fn.num} · {sector.title.split("&")[0]?.trim() ?? sector.title}
        </div>

        <h1 className={styles.heroTitle}>
          {fn.title}
          <br />
          <span className={styles.heroEmphasis}>
            contractors, deployed in 72 hours.
          </span>
        </h1>

        <p className={styles.heroSub}>{fn.blurb ?? fn.overview}</p>

        <div className={styles.heroDots}>
          <div className={styles.heroDot}>
            <span className={styles.heroDotMark} aria-hidden="true" />
            72h brief to shortlist
          </div>
          <div className={styles.heroDot}>
            <span className={styles.heroDotMark} aria-hidden="true" />
            Active bench · UK · ME · India
          </div>
          <div className={styles.heroDot}>
            <span className={styles.heroDotMark} aria-hidden="true" />
            Contract · EOR · Subcontract
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ SIDEBAR ============ */
function L2Sidebar({
  sector,
  activeSlug,
}: {
  sector: L1PageData;
  activeSlug: string;
}) {
  return (
    <aside className={styles.sidebar} aria-label="Sector function list">
      <div className={styles.sbTop}>
        <Link
          href={`/industries/${sector.slug}`}
          className={styles.sbBack}
          aria-label={`Back to ${sector.title}`}
        >
          <span aria-hidden="true">←</span> Back to {sector.title}
        </Link>
        <div className={styles.sbSectorLabel}>{sector.category}</div>
        <div className={styles.sbSectorName}>{sector.title}</div>
      </div>
      <div className={styles.sbSection}>
        <div className={styles.sbHeading}>All functions</div>
        <ul className={styles.sbList}>
          {sector.expertise.map((item) => {
            const isActive = item.slug === activeSlug;
            const enabled = Boolean(item.tools && item.tools.length > 0);
            const href = `/industries/${sector.slug}/${item.slug}`;
            return (
              <li
                key={item.slug}
                className={`${styles.sbItem} ${isActive ? styles.sbItemActive : ""} ${!enabled ? styles.sbItemDisabled : ""}`}
              >
                {enabled ? (
                  <Link href={href} className={styles.sbItemLink}>
                    <span className={styles.sbItemNum}>{item.num}</span>
                    <span className={styles.sbItemName}>{item.title}</span>
                  </Link>
                ) : (
                  <span className={styles.sbItemLink} aria-disabled="true">
                    <span className={styles.sbItemNum}>{item.num}</span>
                    <span className={styles.sbItemName}>{item.title}</span>
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}

// Exported so route pages / tests can reuse if needed.
export { cardHueCycle, cardHueStyle };

