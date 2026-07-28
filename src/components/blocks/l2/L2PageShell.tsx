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
          {/* Hero, overview, roles, tools, screening, cross-links, cta */}
          <section className={styles.placeholder}>
            <p className={styles.placeholderText}>
              L2 shell scaffold — {sector.title} / {fn.title}
            </p>
          </section>
        </main>
      </div>
    </div>
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

// Silence unused-import warnings until blocks are added.
void Image;
