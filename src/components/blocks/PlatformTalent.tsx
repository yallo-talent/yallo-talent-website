"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./PlatformTalent.module.css";

type Hue = "blue" | "green" | "orange" | "teal" | "violet" | "rose";

interface Platform {
  slug: string;
  abbr: string;
  name: string;
  desc: string;
  tags: [string, string, string];
  hue: Hue;
}

const platforms: Platform[] = [
  {
    slug: "sap",
    abbr: "SAP",
    name: "SAP",
    desc: "S/4HANA, FICO, MM, SD and integration specialists — functional and technical.",
    tags: ["Functional", "Technical", "Architecture"],
    hue: "blue",
  },
  {
    slug: "oracle",
    abbr: "ORA",
    name: "Oracle",
    desc: "ERP, EPM, HCM and Fusion specialists across the back office.",
    tags: ["Functional", "Technical", "EPM"],
    hue: "rose",
  },
  {
    slug: "microsoft",
    abbr: "MS",
    name: "Microsoft",
    desc: "Dynamics, Azure, Power Platform and M365 engineers and leads.",
    tags: ["Dynamics", "Azure", "Power Platform"],
    hue: "blue",
  },
  {
    slug: "salesforce",
    abbr: "SF",
    name: "Salesforce",
    desc: "Core CRM, Commerce Cloud and integration architects.",
    tags: ["Admin", "Developer", "Architect"],
    hue: "teal",
  },
  {
    slug: "blueyonder",
    abbr: "BY",
    name: "Blue Yonder",
    desc: "SCM, WMS, TMS, Luminate and MFP specialists.",
    tags: ["WMS", "TMS", "Luminate"],
    hue: "orange",
  },
  {
    slug: "workday",
    abbr: "WD",
    name: "Workday",
    desc: "HCM, Payroll, Recruiting and Adaptive Planning specialists.",
    tags: ["HCM", "Payroll", "Adaptive"],
    hue: "violet",
  },
  {
    slug: "servicenow",
    abbr: "SN",
    name: "ServiceNow",
    desc: "ITSM, HRSD and platform development specialists.",
    tags: ["ITSM", "Platform Dev", "Integration"],
    hue: "green",
  },
  {
    slug: "aws",
    abbr: "AWS",
    name: "AWS",
    desc: "Cloud architects, DevOps engineers and solutions architects.",
    tags: ["Cloud", "DevOps", "Solutions Arch"],
    hue: "orange",
  },
];

const hueStyle = (hue: Hue): React.CSSProperties =>
  ({
    "--sector-accent": `var(--hue-${hue}-500)`,
    "--sector-accent-08": `var(--hue-${hue}-08)`,
    "--sector-accent-20": `var(--hue-${hue}-20)`,
    "--sector-accent-35": `var(--hue-${hue}-35)`,
  }) as React.CSSProperties;

export function PlatformTalent() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows]);

  const scrollBy = (delta: number) => {
    trackRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <section id="platforms" className={styles.section}>
      <div className={styles.orbA} aria-hidden="true" />
      <div className={styles.orbB} aria-hidden="true" />
      <div className={styles.orbC} aria-hidden="true" />

      <div className={styles.wrap}>
        <header className={styles.hd}>
          <div className={styles.hdText}>
            <div className={styles.eye}>
              <span className={styles.eyeDot} aria-hidden="true" />
              <span>Your platform, our specialists</span>
            </div>
            <h2 className={styles.h}>
              Specialists ready for your platform stack.
            </h2>
            <p className={styles.sub}>
              Running SAP, Oracle, Microsoft, Salesforce, Blue Yonder or
              Workday? Active benches across UK, ME and India — ready to move on
              your brief.
            </p>
          </div>
          <div className={styles.nav}>
            <button
              type="button"
              className={styles.navBtn}
              aria-label="Scroll left"
              onClick={() => scrollBy(-360)}
              disabled={atStart}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              className={styles.navBtn}
              aria-label="Scroll right"
              onClick={() => scrollBy(360)}
              disabled={atEnd}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </header>

        <div className={styles.trackWrap}>
          <div className={styles.track} ref={trackRef}>
            {platforms.map((p) => (
              <Link
                key={p.slug}
                href={`/platforms/${p.slug}`}
                className={styles.card}
                style={hueStyle(p.hue)}
                aria-label={`View ${p.name} contractors`}
              >
                <div className={styles.cardGlow} aria-hidden="true" />
                <div className={styles.cardHighlight} aria-hidden="true" />
                <div className={styles.cardTop}>
                  <span className={styles.badge}>{p.abbr}</span>
                  <span className={styles.cardArrow} aria-hidden="true">
                    →
                  </span>
                </div>
                <div className={styles.cardName}>{p.name}</div>
                <p className={styles.cardDesc}>{p.desc}</p>
                <div className={styles.cardTags}>
                  {p.tags.map((t) => (
                    <span key={t} className={styles.cardTag}>
                      {t}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
