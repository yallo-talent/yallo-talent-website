"use client";

import Image from "next/image";
import Link from "next/link";
import { l1Icons } from "@/components/blocks/l1/l1-icons";
import type {
  L1ExpertiseCard,
  L1Hue,
  L1IconKey,
  L1PageData,
} from "@/data/l1/types";
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
          <L2Screening />
          <L2Engagement />
          <L2BottomCta sector={sector} fn={fn} />
          <L2RelatedFunctions sector={sector} fn={fn} />
          <L2CrossLinks fn={fn} />
        </main>
      </div>
      <L2Insights sector={sector} />
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

/* ============ SCREENING CALLOUT ============ */
function L2Screening() {
  return (
    <section className={styles.screening}>
      <div className={styles.screeningInner}>
        <div className={styles.screeningIcon} aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <title>Architect screening</title>
            <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        </div>
        <div className={styles.screeningBody}>
          <h3 className={styles.screeningH}>
            Architect-screened, not keyword-matched.
          </h3>
          <p className={styles.screeningCopy}>
            Every contractor on our bench is assessed for implementation depth
            by specialists who have run delivery in this function. Not
            certification badges. Not platform familiarity. Track records inside
            programmes like yours — verified before they get on the shortlist.
          </p>
          <div className={styles.screeningChips}>
            <span className={styles.screeningChip}>
              <span className={styles.screeningChipDot} aria-hidden="true" />
              Architect-screened
            </span>
            <span className={styles.screeningChip}>
              <span className={styles.screeningChipDot} aria-hidden="true" />
              72h shortlist
            </span>
            <span className={styles.screeningChip}>
              <span className={styles.screeningChipDot} aria-hidden="true" />
              Contract · EOR · Subcontract
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ CROSS-LINKS ============ */
const vendorToPlatformSlug: Record<string, string> = {
  SAP: "sap",
  Oracle: "oracle",
  Salesforce: "salesforce",
  Microsoft: "microsoft",
  "Blue Yonder": "blue-yonder",
  Workday: "workday",
};

const fnToCapabilitySlugs: Record<string, string[]> = {
  "customer-experience": ["data-ai", "integration-middleware"],
  clienteling: ["data-ai"],
  "store-operations": ["cloud-infrastructure", "integration-middleware"],
  "point-of-sale": ["cybersecurity", "cloud-infrastructure"],
  merchandising: ["data-ai"],
  "assortment-planning": ["data-ai"],
  "space-planning": ["data-ai"],
  "pricing-promotions": ["data-ai"],
  "loyalty-rewards": ["data-ai", "integration-middleware"],
  crm: ["data-ai", "integration-middleware"],
  ecommerce: ["cloud-infrastructure", "integration-middleware"],
  "omnichannel-fulfillment": ["integration-middleware", "cloud-infrastructure"],
  "order-management": ["integration-middleware"],
  "warehouse-management": ["integration-middleware", "cloud-infrastructure"],
  "transport-management": ["integration-middleware"],
  "supply-chain": ["data-ai"],
  "demand-planning": ["data-ai"],
  "inventory-replenishment": ["data-ai"],
  "returns-reverse-logistics": ["integration-middleware"],
  "master-data-pim": ["data-ai", "integration-middleware"],
};

const platformLabels: Record<string, string> = {
  sap: "SAP",
  oracle: "Oracle",
  salesforce: "Salesforce",
  microsoft: "Microsoft",
  "blue-yonder": "Blue Yonder",
  workday: "Workday",
};

const capabilityLabels: Record<string, string> = {
  "data-ai": "Data & AI",
  "digital-devops": "Digital & DevOps",
  "cloud-infrastructure": "Cloud & Infrastructure",
  cybersecurity: "Cybersecurity",
  "integration-middleware": "Integration & Middleware",
  "emerging-technologies": "Emerging Technologies",
};

function L2CrossLinks({ fn }: { fn: L1ExpertiseCard }) {
  const platformSlugs = new Set<string>();
  for (const t of fn.tools ?? []) {
    const slug = vendorToPlatformSlug[t.vendor];
    if (slug) platformSlugs.add(slug);
  }
  const platforms = Array.from(platformSlugs);
  const capabilities = fnToCapabilitySlugs[fn.slug] ?? [];

  if (platforms.length === 0 && capabilities.length === 0) return null;

  return (
    <section className={styles.cross}>
      <div className={styles.crossInner}>
        {platforms.length > 0 && (
          <div className={styles.crossRail}>
            <div className={styles.crossLabel}>Related platforms</div>
            <div className={styles.crossChips}>
              {platforms.map((slug, i) => {
                const hue = cardHueCycle[i % cardHueCycle.length] as L1Hue;
                return (
                  <Link
                    key={slug}
                    href={`/platforms/${slug}`}
                    className={styles.crossChip}
                    style={cardHueStyle(hue)}
                  >
                    <span className={styles.crossChipName}>
                      {platformLabels[slug] ?? slug}
                    </span>
                    <span className={styles.crossChipArrow} aria-hidden="true">
                      →
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
        {capabilities.length > 0 && (
          <div className={styles.crossRail}>
            <div className={styles.crossLabel}>Related capabilities</div>
            <div className={styles.crossChips}>
              {capabilities.map((slug, i) => {
                const hue = cardHueCycle[
                  (i + 3) % cardHueCycle.length
                ] as L1Hue;
                return (
                  <Link
                    key={slug}
                    href={`/capabilities/${slug}`}
                    className={styles.crossChip}
                    style={cardHueStyle(hue)}
                  >
                    <span className={styles.crossChipName}>
                      {capabilityLabels[slug] ?? slug}
                    </span>
                    <span className={styles.crossChipArrow} aria-hidden="true">
                      →
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ============ ENGAGEMENT MODELS (detailed pillars — mirrors L1) ============ */
const engagementPillars: {
  slug: string;
  href: string;
  hue: L1Hue;
  icon: L1IconKey;
  eyebrow: string;
  title: string;
  copy: string;
  bullets: string[];
}[] = [
  {
    slug: "contract",
    href: "/contract",
    hue: "orange",
    icon: "pillarContract",
    eyebrow: "01 · Contract",
    title: "Contract & interim",
    copy: "Architect-screened contractors placed in 72 hours. Day-rate and fixed-term across UK, ME and India.",
    bullets: [
      "72h brief to shortlist",
      "IR35, day-rate or fixed-term",
      "Bench refreshed weekly",
    ],
  },
  {
    slug: "permanent",
    href: "/permanent",
    hue: "blue",
    icon: "pillarPermanent",
    eyebrow: "02 · Permanent",
    title: "Permanent placement",
    copy: "Long-horizon hires when the role is core to the operating model. Retained and contingent search.",
    bullets: [
      "Retained or contingent",
      "Executive to senior IC",
      "Cross-market talent pool",
    ],
  },
  {
    slug: "eor",
    href: "/eor",
    hue: "violet",
    icon: "pillarEor",
    eyebrow: "03 · EOR",
    title: "Employer of Record",
    copy: "Compliant employment in 15+ markets. Onboard talent in days without setting up an entity.",
    bullets: [
      "15+ markets covered",
      "Payroll, tax and compliance",
      "Talent onboarded in days",
    ],
  },
  {
    slug: "managed",
    href: "/managed-delivery",
    hue: "teal",
    icon: "pillarManaged",
    eyebrow: "04 · Managed delivery",
    title: "Managed delivery",
    copy: "Outcome-based pods stood up end-to-end. Architect-led delivery with fixed-price milestones.",
    bullets: [
      "Fixed-price milestones",
      "Architect-led pods",
      "SLA on delivery outcomes",
    ],
  },
];

function L2Engagement() {
  return (
    <section className={styles.engage}>
      <div className={styles.engageInner}>
        <div className={styles.secLabel}>How you engage</div>
        <h2 className={styles.engageH}>
          Four commercial models — pick how you want to hold the risk.
        </h2>
        <p className={styles.engageSub}>
          Same architect-screened bench. Four ways to bring them into your
          programme.
        </p>
        <div className={styles.engagePillarsGrid}>
          {engagementPillars.map((p) => {
            const Icon = l1Icons[p.icon];
            return (
              <Link
                key={p.slug}
                href={p.href}
                className={styles.engagePillar}
                style={cardHueStyle(p.hue)}
              >
                <div className={styles.engagePillarGlow} aria-hidden="true" />
                <span className={styles.engagePillarArrow} aria-hidden="true">
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <title>Open</title>
                    <path d="M4 12L12 4M6 4h6v6" />
                  </svg>
                </span>
                <div className={styles.engagePillarInner}>
                  <div className={styles.engagePillarIcon}>
                    <Icon className={styles.engagePillarIconSvg} />
                  </div>
                  <div className={styles.engagePillarEyebrow}>{p.eyebrow}</div>
                  <h3 className={styles.engagePillarTitle}>{p.title}</h3>
                  <p className={styles.engagePillarCopy}>{p.copy}</p>
                  <ul className={styles.engagePillarBullets}>
                    {p.bullets.map((b) => (
                      <li key={b} className={styles.engagePillarBullet}>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============ BOTTOM CTA ============ */
function L2BottomCta({
  sector,
  fn,
}: {
  sector: L1PageData;
  fn: L1ExpertiseCard;
}) {
  const briefHref = `/brief?sector=${sector.slug}&fn=${fn.slug}`;
  return (
    <section className={styles.bottomCta}>
      <div className={styles.bottomInner}>
        <div className={styles.bottomGlow} aria-hidden="true" />
        <div className={styles.bottomContent}>
          <div className={styles.secLabel}>Ready to brief us?</div>
          <h2 className={styles.bottomH}>
            Need a{" "}
            <span className={styles.bottomEm}>
              {fn.title.toLowerCase()} contractor?
            </span>
          </h2>
          <p className={styles.bottomSub}>
            Send the role, the platform, the timeline — get an
            architect-screened shortlist inside 72 hours. No CVs until we
            understand your programme.
          </p>
          <div className={styles.bottomActions}>
            <Link href={briefHref} className={styles.bottomCtaPrimary}>
              Request a contractor
              <span aria-hidden="true">→</span>
            </Link>
            <Link href="/contract" className={styles.bottomCtaGhost}>
              Contract model
            </Link>
            <Link href="/eor" className={styles.bottomCtaGhost}>
              EOR model
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ RELATED FUNCTIONS ============ */
function L2RelatedFunctions({
  sector,
  fn,
}: {
  sector: L1PageData;
  fn: L1ExpertiseCard;
}) {
  // Prev/next by index + one wrap-around pick to give three chips.
  const enabled = sector.expertise.filter((e) => e.tools && e.tools.length > 0);
  const idx = enabled.findIndex((e) => e.slug === fn.slug);
  if (idx < 0 || enabled.length < 2) return null;
  const picks: L1ExpertiseCard[] = [];
  const prev = enabled[(idx - 1 + enabled.length) % enabled.length];
  const next = enabled[(idx + 1) % enabled.length];
  const jump = enabled[(idx + 3) % enabled.length];
  if (prev && prev.slug !== fn.slug) picks.push(prev);
  if (next && next.slug !== fn.slug && next.slug !== prev?.slug)
    picks.push(next);
  if (
    jump &&
    jump.slug !== fn.slug &&
    jump.slug !== prev?.slug &&
    jump.slug !== next?.slug
  )
    picks.push(jump);

  return (
    <section className={styles.related}>
      <div className={styles.relatedInner}>
        <div className={styles.secLabel}>More {sector.title}</div>
        <h3 className={styles.relatedH}>Related functions in this sector</h3>
        <div className={styles.relatedGrid}>
          {picks.map((rf, i) => {
            const hue = cardHueCycle[i % cardHueCycle.length] as L1Hue;
            return (
              <Link
                key={rf.slug}
                href={`/industries/${sector.slug}/${rf.slug}`}
                className={styles.relatedCard}
                style={cardHueStyle(hue)}
              >
                <span className={styles.relatedNum}>{rf.num}</span>
                <span className={styles.relatedTitle}>{rf.title}</span>
                <span className={styles.relatedBlurb}>{rf.blurb}</span>
                <span className={styles.relatedArrow} aria-hidden="true">
                  →
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============ INSIGHTS (horizontal scrolling) ============ */
function L2Insights({ sector }: { sector: L1PageData }) {
  if (!sector.insights || sector.insights.length === 0) return null;
  return (
    <section className={styles.insights}>
      <div className={styles.insightsHead}>
        <div className={styles.secLabel}>
          {sector.insightsEyebrow ?? "Insights"}
        </div>
        <h2 className={styles.insightsH}>
          {sector.insightsTitle ?? "What's happening in this market right now."}
        </h2>
      </div>
      <div className={styles.insightsScrollWrap}>
        <div className={styles.insightsScroll}>
          {sector.insights.map((post, i) => {
            const hue = cardHueCycle[i % cardHueCycle.length] as L1Hue;
            const inner = (
              <>
                <Image
                  src={post.image}
                  alt={post.imageAlt}
                  fill
                  sizes="(max-width: 900px) 88vw, 320px"
                  className={styles.insImg}
                />
                <div className={styles.insImgTint} aria-hidden="true" />
                <div className={styles.insImgShade} aria-hidden="true" />
                <span className={styles.insCat}>{post.category}</span>
                <div className={styles.insOverlay}>
                  <h3 className={styles.insTitle}>{post.title}</h3>
                  <div className={styles.insMeta}>
                    <span className={styles.insAuthor}>
                      {post.author} · {post.minutes} min
                    </span>
                    {post.published !== false && (
                      <span className={styles.insRead}>Read →</span>
                    )}
                  </div>
                </div>
              </>
            );
            if (post.published === false) {
              return (
                <div
                  key={post.href}
                  className={styles.insCard}
                  style={cardHueStyle(hue)}
                  aria-disabled="true"
                >
                  {inner}
                </div>
              );
            }
            return (
              <Link
                key={post.href}
                href={post.href}
                className={styles.insCard}
                style={cardHueStyle(hue)}
              >
                {inner}
              </Link>
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
