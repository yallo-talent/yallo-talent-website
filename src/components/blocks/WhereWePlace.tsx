"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./WhereWePlace.module.css";

type Hue = "blue" | "green" | "orange" | "teal" | "violet" | "rose";

interface Sector {
  slug: string;
  id: string;
  name: string;
  short: string;
  category: string;
  hot: boolean;
  hue: Hue;
  iconPath: string;
  desc: string;
  stat: { n: string; l: string };
  roles: [string, string, string];
  useCases: {
    title: string;
    desc: string;
  }[];
}

const sectors: Sector[] = [
  {
    slug: "retail",
    id: "01",
    name: "Retail & Consumer",
    short: "Retail",
    category: "Retail & Commerce",
    hot: false,
    hue: "orange",
    iconPath:
      "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0",
    desc: "Commerce, POS and supply-chain transformation as the retail sector reshapes across the GCC and UK.",
    stat: { n: "3", l: "delivery regions" },
    roles: ["Commerce & POS", "Supply chain", "Data & personalisation"],
    useCases: [
      { title: "Commerce & POS", desc: "Platform and store-systems talent." },
      { title: "Supply chain", desc: "Planning and fulfilment specialists." },
      {
        title: "Data & personalisation",
        desc: "Analytics and CDP engineers.",
      },
    ],
  },
  {
    slug: "finance",
    id: "02",
    name: "Banking & Financial Services",
    short: "Banking",
    category: "Financial Services",
    hot: true,
    hue: "blue",
    iconPath: "M12 2l10 6.5v7L12 22 2 15.5v-7L12 2zM12 22v-7M2 8.5l10 7 10-7",
    desc: "Core banking, payments, risk and data programmes across the GCC. Open banking is driving platform and integration demand at significant scale.",
    stat: { n: "72h", l: "to shortlist" },
    roles: [
      "Core banking & payments",
      "Risk, data & regulatory",
      "Cloud platform engineering",
    ],
    useCases: [
      {
        title: "Core banking & payments",
        desc: "Platform, integration and delivery leads for transformation programmes.",
      },
      {
        title: "Risk, data & regulatory",
        desc: "Data engineers and risk-tech specialists for regulatory change.",
      },
      {
        title: "Cloud & platform engineering",
        desc: "Azure and AWS engineers across banking estate migrations.",
      },
    ],
  },
  {
    slug: "government",
    id: "03",
    name: "Public Sector",
    short: "Government",
    category: "Government",
    hot: true,
    hue: "green",
    iconPath: "M3 21h18M5 21V7l7-4 7 4v14M9 21v-5h6v5",
    desc: "Government digital, smart services and national transformation across the GCC and UK. Multi-year programmes sustain deep and consistent demand.",
    stat: { n: "GCC", l: "primary region" },
    roles: [
      "Digital government delivery",
      "Data & platform",
      "Cybersecurity & GRC",
    ],
    useCases: [
      {
        title: "Digital government delivery",
        desc: "Programme and delivery leadership for national transformation.",
      },
      {
        title: "Data & platform engineering",
        desc: "Engineers building citizen-facing systems at scale.",
      },
      {
        title: "Cybersecurity & GRC",
        desc: "Security architects and compliance specialists.",
      },
    ],
  },
  {
    slug: "manufacturing",
    id: "04",
    name: "Manufacturing & Logistics",
    short: "Mfg & Logistics",
    category: "Industry & Supply Chain",
    hot: true,
    hue: "orange",
    iconPath: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
    desc: "ERP, Industry 4.0, warehouse and transport transformation across plants and logistics networks in the UAE and KSA.",
    stat: { n: "SAP", l: "primary platform" },
    roles: [
      "ERP & supply chain",
      "WMS & TMS specialists",
      "Plant & OT systems",
    ],
    useCases: [
      {
        title: "ERP & supply chain",
        desc: "SAP and Oracle functional and technical consultants for manufacturing programmes.",
      },
      {
        title: "WMS / TMS specialists",
        desc: "Blue Yonder and Manhattan talent for warehouse and transport transformation.",
      },
      {
        title: "Plant & OT systems",
        desc: "Automation, shop-floor and logistics integration specialists.",
      },
    ],
  },
  {
    slug: "healthcare",
    id: "05",
    name: "Healthcare & Life Sciences",
    short: "Healthcare",
    category: "Health & Life Sciences",
    hot: false,
    hue: "teal",
    iconPath: "M22 12h-4l-3 9L9 3l-3 9H2",
    desc: "Clinical systems and compliance-grade delivery — from EMR implementations to regulated data platforms across GCC and UK.",
    stat: { n: "GCC+UK", l: "active markets" },
    roles: [
      "Clinical & EMR systems",
      "Data platforms",
      "Security & compliance",
    ],
    useCases: [
      {
        title: "Clinical & EMR systems",
        desc: "Functional and integration specialists for hospital systems.",
      },
      {
        title: "Regulated data platforms",
        desc: "Engineers building and governing healthcare data estates.",
      },
      {
        title: "Security & compliance",
        desc: "GRC and cybersecurity specialists for healthcare.",
      },
    ],
  },
  {
    slug: "telco",
    id: "06",
    name: "Telco & Media",
    short: "Telco & Media",
    category: "Telecommunications",
    hot: false,
    hue: "violet",
    iconPath:
      "M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01",
    desc: "OSS/BSS, network and data engineering across major telco transformation programmes in the GCC and UK.",
    stat: { n: "6+", l: "platform ecosystems" },
    roles: ["OSS / BSS", "Network engineering", "Data engineering"],
    useCases: [
      {
        title: "OSS / BSS",
        desc: "Platform and integration talent for telco transformation.",
      },
      {
        title: "Network engineering",
        desc: "Core and edge network specialists.",
      },
      {
        title: "Data engineering",
        desc: "Analytics and platform engineers at telco scale.",
      },
    ],
  },
];

const hueStyle = (hue: Hue): React.CSSProperties =>
  ({
    "--sector-accent": `var(--hue-${hue}-500)`,
    "--sector-accent-08": `var(--hue-${hue}-08)`,
    "--sector-accent-20": `var(--hue-${hue}-20)`,
    "--sector-accent-35": `var(--hue-${hue}-35)`,
  }) as React.CSSProperties;

export function WhereWePlace() {
  const [activeIdx, setActiveIdx] = useState(0);
  const featured = sectors[activeIdx];
  if (!featured) return null;

  const others = sectors
    .map((s, i) => ({ s, i }))
    .filter(({ i }) => i !== activeIdx);

  return (
    <section
      id="where-we-place"
      className={styles.section}
      style={hueStyle(featured.hue)}
    >
      <div className={styles.dotgrid} aria-hidden="true" />
      <div className={styles.wrap}>
        <header className={styles.hd}>
          <div className={styles.eye}>
            <span className={styles.eyeDot} aria-hidden="true" />
            <span>Your sector, our bench</span>
          </div>
          <h2 className={styles.h}>
            Talent ready for your sector —<br />
            wherever your programme runs.
          </h2>
          <p className={styles.sub}>
            Whether you're in banking, public sector, manufacturing or beyond,
            we have specialists calibrated to your programme. Hover any sector
            to see the roles you can call on.
          </p>
        </header>

        <div className={styles.grid}>
          <FeaturedCard sector={featured} />
          <ul className={styles.mini} aria-label="Select a sector">
            {others.map(({ s }) => (
              <MiniCard
                key={s.slug}
                sector={s}
                onActivate={() => {
                  const target = sectors.findIndex((x) => x.slug === s.slug);
                  if (target !== -1) setActiveIdx(target);
                }}
              />
            ))}
            <MiniCtaCard />
          </ul>
        </div>
      </div>
    </section>
  );
}

function FeaturedCard({ sector }: { sector: Sector }) {
  return (
    <article
      className={styles.feat}
      style={hueStyle(sector.hue)}
      key={sector.slug}
    >
      <div className={styles.featArt} aria-hidden="true">
        <SectorArt path={sector.iconPath} big />
      </div>
      <div className={styles.featOverlay} aria-hidden="true" />
      <div className={styles.featBar} aria-hidden="true" />
      <div className={styles.featWm} aria-hidden="true">
        {sector.id}
      </div>

      <div className={styles.featMeta}>
        <span className={styles.featCat}>{sector.category}</span>
        {sector.hot && <span className={styles.featBadge}>Hiring now</span>}
      </div>

      <div className={styles.featIconWrap}>
        <div className={styles.featIcon}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d={sector.iconPath} />
          </svg>
        </div>
      </div>

      <div className={styles.featBody}>
        <div className={styles.featName}>{sector.name}</div>
        <p className={styles.featDesc}>{sector.desc}</p>
        <div className={styles.featChips}>
          {sector.roles.map((r) => (
            <span key={r} className={styles.featChip}>
              {r}
            </span>
          ))}
        </div>
        <div className={styles.featFoot}>
          <div className={styles.featStat}>
            <span className={styles.featStatN}>{sector.stat.n}</span>
            <span className={styles.featStatL}>{sector.stat.l}</span>
          </div>
          <Link href={`/industries/${sector.slug}`} className={styles.featCta}>
            Explore {sector.short}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

interface MiniProps {
  sector: Sector;
  onActivate: () => void;
}

function MiniCard({ sector, onActivate }: MiniProps) {
  return (
    <li className={styles.miniLi}>
      <button
        type="button"
        className={styles.miniCard}
        style={hueStyle(sector.hue)}
        onMouseEnter={onActivate}
        onFocus={onActivate}
        onClick={onActivate}
        aria-label={`View ${sector.name}`}
      >
        <div className={styles.miniArt} aria-hidden="true">
          <SectorArt path={sector.iconPath} />
        </div>
        <div className={styles.miniOverlay} aria-hidden="true" />
        <div className={styles.miniBar} aria-hidden="true" />
        <div className={styles.miniBody}>
          <div className={styles.miniTop}>
            <span className={styles.miniName}>{sector.name}</span>
            {sector.hot && <span className={styles.miniHot}>HOT</span>}
          </div>
          <ul className={styles.miniRoles}>
            {sector.roles.slice(0, 2).map((r) => (
              <li key={r} className={styles.miniRole}>
                {r}
              </li>
            ))}
          </ul>
        </div>
      </button>
    </li>
  );
}

function MiniCtaCard() {
  return (
    <li className={styles.miniLi}>
      <Link
        href="/brief"
        className={styles.miniCta}
        aria-label="Send us a brief"
      >
        <div className={styles.miniCtaGlow} aria-hidden="true" />
        <div className={styles.miniCtaBody}>
          <span className={styles.miniCtaEyebrow}>Not sure where you fit?</span>
          <span className={styles.miniCtaTitle}>
            Send us a brief — we'll come back in 72h.
          </span>
          <span className={styles.miniCtaAction}>
            Send a brief
            <span aria-hidden="true">→</span>
          </span>
        </div>
      </Link>
    </li>
  );
}

function SectorArt({ path, big = false }: { path: string; big?: boolean }) {
  const vw = big ? 600 : 300;
  const vh = big ? 600 : 220;
  return (
    <svg
      viewBox={`0 0 ${vw} ${vh}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id={`sga-${vw}-${vh}`} cx="55%" cy="40%" r="65%">
          <stop offset="0%" stopColor="var(--sector-accent-35)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width={vw} height={vh} fill={`url(#sga-${vw}-${vh})`} />
      <g stroke="var(--sector-accent)" strokeWidth="0.6" opacity="0.1">
        <line
          x1="0"
          y1={Math.round(vh * 0.32)}
          x2={vw}
          y2={Math.round(vh * 0.32)}
        />
        <line
          x1="0"
          y1={Math.round(vh * 0.64)}
          x2={vw}
          y2={Math.round(vh * 0.64)}
        />
        <line
          x1={Math.round(vw * 0.33)}
          y1="0"
          x2={Math.round(vw * 0.33)}
          y2={Math.round(vh * 0.75)}
        />
        <line
          x1={Math.round(vw * 0.66)}
          y1="0"
          x2={Math.round(vw * 0.66)}
          y2={Math.round(vh * 0.75)}
        />
      </g>
    </svg>
  );
}
