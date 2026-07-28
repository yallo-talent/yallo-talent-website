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
          <L2Overview sector={sector} fn={fn} />
          <L2Roles fn={fn} />
          <L2Tools sector={sector} fn={fn} />
        </main>
      </div>
    </div>
  );
}

/* ============ HERO ============ */
function L2Hero({ sector, fn }: { sector: L1PageData; fn: L1ExpertiseCard }) {
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

/* ============ FUNCTION OVERVIEW ============ */
function L2Overview({
  sector,
  fn,
}: {
  sector: L1PageData;
  fn: L1ExpertiseCard;
}) {
  const image = fn.overviewImage ?? sector.heroImage;
  const imageAlt = fn.overviewImageAlt ?? sector.heroImageAlt;
  const copy = fn.overview ?? fn.blurb ?? "";
  return (
    <section className={styles.overview}>
      <div className={styles.overviewInner}>
        <div className={styles.overviewText}>
          <div className={styles.secLabel}>Function overview</div>
          <h2 className={styles.overviewH}>
            Finding {fn.title.toLowerCase()} contractors who
            <br />
            <span className={styles.overviewEm}>
              understand the context is harder than it looks.
            </span>
          </h2>
          <p className={styles.overviewCopy}>{copy}</p>
          <ul className={styles.overviewBullets}>
            <li className={styles.overviewBullet}>
              Architect-screened for platform depth, not certificates
            </li>
            <li className={styles.overviewBullet}>
              Retail-context screening — high transaction volumes, multi-market
              rollouts
            </li>
            <li className={styles.overviewBullet}>
              72h from brief to shortlist — every time
            </li>
          </ul>
        </div>
        <div className={styles.overviewImageWrap}>
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(max-width: 900px) 100vw, 420px"
            className={styles.overviewImage}
          />
          <div className={styles.overviewImageTint} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

/* ============ ROLES STRIP ============ */
function L2Roles({ fn }: { fn: L1ExpertiseCard }) {
  // Aggregate all roles from function + each tool for a comprehensive strip
  const allRoles = new Set<string>(fn.roles);
  for (const t of fn.tools ?? []) {
    for (const r of t.roles) allRoles.add(r);
  }
  const roles = Array.from(allRoles);
  return (
    <section className={styles.roles}>
      <div className={styles.rolesInner}>
        <div className={styles.secLabel}>Roles we deploy</div>
        <h2 className={styles.rolesH}>
          Contractor roles Yallo places into {fn.title.toLowerCase()}.
        </h2>
        <p className={styles.rolesSub}>
          Every role below is on an active bench across UK, ME and India. Send
          the brief — the specialist is in your inbox in 72 hours.
        </p>
        <div className={styles.rolesGrid}>
          {roles.map((r) => (
            <span key={r} className={styles.rolePill}>
              {r}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ TOOL / VENDOR CARDS ============ */
function L2Tools({ sector, fn }: { sector: L1PageData; fn: L1ExpertiseCard }) {
  if (!fn.tools || fn.tools.length === 0) return null;
  const briefHref = `/brief?sector=${sector.slug}&fn=${fn.slug}`;
  return (
    <section className={styles.tools}>
      <div className={styles.toolsInner}>
        <div className={styles.secLabel}>Tools we staff</div>
        <h2 className={styles.toolsH}>
          {fn.tools.length} tool
          {fn.tools.length === 1 ? "" : "s"}. Architect-screened contractor
          bench for each.
        </h2>
        <p className={styles.toolsSub}>
          Every card lists the contractor roles Yallo places into that tool.
          Send the brief — the shortlist is in your inbox in 72 hours.
        </p>
        <div className={styles.toolsGrid}>
          {fn.tools.map((tool, i) => {
            const hue = cardHueCycle[i % cardHueCycle.length] as L1Hue;
            return (
              <article
                key={tool.slug}
                className={styles.tc}
                style={cardHueStyle(hue)}
              >
                <div className={styles.tcGlow} aria-hidden="true" />
                <div className={styles.tcInner}>
                  <div className={styles.tcBadge}>
                    <span className={styles.tcBadgeDot} aria-hidden="true" />
                    <span className={styles.tcBadgeName}>{tool.vendor}</span>
                  </div>
                  <h3 className={styles.tcName}>{tool.name}</h3>
                  <div className={styles.tcRolesLabel}>Contractor roles</div>
                  <div className={styles.tcRoles}>
                    {tool.roles.map((r) => (
                      <span key={r} className={styles.tcRole}>
                        {r}
                      </span>
                    ))}
                  </div>
                  <div className={styles.tcBench}>
                    <span className={styles.tcBenchDot} aria-hidden="true" />
                    <span className={styles.tcBenchTxt}>
                      {tool.benchNote ?? "Active bench · UK · ME · India"}
                    </span>
                  </div>
                  <Link href={briefHref} className={styles.tcCta}>
                    Request a contractor
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            );
          })}
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
