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
        <aside className={styles.sidebar} aria-label="Sector function list">
          {/* Sidebar block populated in a follow-up commit */}
        </aside>
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

// Exported so route pages / tests can reuse if needed.
export { cardHueCycle, cardHueStyle };

// Silence unused-import warnings until blocks are added.
void Image;
void Link;
