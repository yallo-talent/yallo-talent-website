"use client";

import Link from "next/link";
import { l1Icons } from "@/components/blocks/l1/l1-icons";
import { HeroAtmosphere } from "@/components/ui/HeroAtmosphere";
import { PetalPlate } from "@/components/ui/PetalPlate";
import { taxonomyLabels } from "@/data/l1/index";
import type { L1ExpertiseCard, L1IconKey, L1PageData } from "@/data/l1/types";
import { routeExists } from "@/lib/routes";
import styles from "./L2PageShell.module.css";

interface Props {
  /** The L1 page data for the parent sector — provides sidebar list + hero image + hue. */
  sector: L1PageData;
  /** The specific L2 function being rendered. */
  fn: L1ExpertiseCard;
}

/**
 * B1: `sector.title` is hero copy ("Retail tech contractors,"), not a label.
 * The display names come from the index, which is their single source.
 */
export function L2PageShell({ sector, fn }: Props) {
  return (
    /* data-identity, and it was never here. Measured on both consumers: the
       root carried `amb-2` and no identity at all, so --amb resolved to the
       POSITIONAL teal — every sector and capability L2 on the site
       rendered the same hue regardless of its domain. And `.amb-wash` appeared
       zero times, so even that positional hue painted nothing.

       I reported retail's L2 hue as working in the parity table. I had not
       measured it; it was as broken as the capability one. Same fault as R11 and
       as the platform L2 — declaring identity is not painting it. One shell, so
       this fixes every L2 that uses it. */
    <div className={`${styles.page} amb-2`} data-identity={sector.slug}>
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
    <section className={`${styles.hero} amb-wash`}>
      {/* B3, as on the L1. Seeded on the FUNCTION slug rather than the
          sector's, so sibling L2s under one sector each get their own field
          instead of twenty pages sharing one. */}
      <HeroAtmosphere seed={`${sector.slug}-${fn.slug}`} />
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
            {taxonomyLabels(sector.slug).short}
          </Link>
          <span className={styles.crumbSep} aria-hidden="true">
            /
          </span>
          <span className={styles.crumbCurrent}>{fn.title}</span>
        </nav>

        <div className={styles.heroEyebrow}>
          <span className={styles.heroEyebrowDot} aria-hidden="true" />
          {fn.num} · {taxonomyLabels(sector.slug).short}
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
            Active bench · Middle East · Europe
          </div>
          <div className={styles.heroDot}>
            <span className={styles.heroDotMark} aria-hidden="true" />
            Contract · EOR · Managed Delivery
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
  const copy = fn.overview ?? fn.blurb ?? "";
  return (
    <section className={`${styles.overview} amb-wash`}>
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
              Specialist-screened for platform depth, not certificates
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
          <PetalPlate
            seed={`${sector.slug}:${fn.slug}`}
            className={styles.overviewImage}
            ratio={0.8}
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
  /* This section is gone, and it is the "jumble" in the brief.
     It unioned every role from every tool card further down the page, so the
     same seventeen names appeared twice: once as a loose wall with nothing to
     tell you which platform any of them belonged to, and once inside the tool
     card that answers exactly that. A chip is only informative next to the tool
     it staffs, so the wall was the same content with the context stripped out.
     Removing it also takes ~420px off the page and deletes the duplicate the
     reader had to reconcile.
     The count is still computed above because the sub-nav uses it. */
  return null;
}

/* ============ TOOL / VENDOR CARDS ============ */
function L2Tools({ sector, fn }: { sector: L1PageData; fn: L1ExpertiseCard }) {
  if (!fn.tools || fn.tools.length === 0) return null;
  const briefHref = `/brief?sector=${sector.slug}&fn=${fn.slug}`;
  return (
    <section className={`${styles.tools} amb-wash`}>
      <div className={styles.toolsInner}>
        <div className={styles.secLabel}>Tools we staff</div>
        <h2 className={styles.toolsH}>
          The tools we staff, and the bench behind each one.
        </h2>
        <p className={styles.toolsSub}>
          Every card lists the contractor roles Yallo places into that tool.
          Send the brief — the shortlist is in your inbox in 72 hours.
        </p>
        <div className={styles.toolsGrid}>
          {fn.tools.map((tool, _i) => {
            return (
              <article key={tool.slug} className={styles.tc}>
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
                      {tool.benchNote ?? "Active bench · Middle East · Europe"}
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
    <section className={`${styles.screening} amb-wash`}>
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
            <title>Specialist screening</title>
            <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        </div>
        <div className={styles.screeningBody}>
          <h3 className={styles.screeningH}>
            Specialist-screened, not keyword-matched.
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
              Specialist-screened
            </span>
            <span className={styles.screeningChip}>
              <span className={styles.screeningChipDot} aria-hidden="true" />
              72h shortlist
            </span>
            <span className={styles.screeningChip}>
              <span className={styles.screeningChipDot} aria-hidden="true" />
              Contract · EOR · Managed Delivery
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
  "customer-experience": ["data-analytics", "integration-middleware"],
  clienteling: ["data-analytics"],
  "store-operations": ["cloud-infrastructure", "integration-middleware"],
  "point-of-sale": ["cybersecurity", "cloud-infrastructure"],
  merchandising: ["data-analytics"],
  "assortment-planning": ["data-analytics"],
  "space-planning": ["data-analytics"],
  "pricing-promotions": ["data-analytics"],
  "loyalty-rewards": ["data-analytics", "integration-middleware"],
  crm: ["data-analytics", "integration-middleware"],
  ecommerce: ["cloud-infrastructure", "integration-middleware"],
  "omnichannel-fulfillment": ["integration-middleware", "cloud-infrastructure"],
  "order-management": ["integration-middleware"],
  "warehouse-management": ["integration-middleware", "cloud-infrastructure"],
  "transport-management": ["integration-middleware"],
  "supply-chain": ["data-analytics"],
  "demand-planning": ["data-analytics"],
  "inventory-replenishment": ["data-analytics"],
  "returns-reverse-logistics": ["integration-middleware"],
  "master-data-pim": ["data-analytics", "integration-middleware"],
};

/* Two hand-maintained label maps used to live here, and they were the second
   half of the S1 fault rather than a tidiness problem.

   `capabilityLabels` held "Data & AI" for the data-analytics DISCIPLINE and
   "Emerging Technologies" for testing-quality-engineering — a desk name and a
   retired discipline name, both resolved into the capability taxonomy. A map that
   duplicates taxonomy labels will always drift from the taxonomy, because
   renaming the source of truth does not rename a copy of it.
   `taxonomyLabels` is that source of truth and covers all three families, so the
   copies are deleted rather than corrected. See src/data/l1/index.ts. */

function L2CrossLinks({ fn }: { fn: L1ExpertiseCard }) {
  const platformSlugs = new Set<string>();
  for (const t of fn.tools ?? []) {
    const slug = vendorToPlatformSlug[t.vendor];
    if (slug) platformSlugs.add(slug);
  }
  // Only cross-link to pages that exist. These are data-driven maps, and
  // several slugs in them point at pages that were never built.
  const platforms = Array.from(platformSlugs).filter((sl) =>
    routeExists(`/platforms/${sl}`),
  );
  const capabilities = (fnToCapabilitySlugs[fn.slug] ?? []).filter((sl) =>
    routeExists(`/capabilities/${sl}`),
  );

  if (platforms.length === 0 && capabilities.length === 0) return null;

  return (
    <section className={styles.cross}>
      <div className={styles.crossInner}>
        {platforms.length > 0 && (
          <div className={styles.crossRail}>
            <div className={styles.crossLabel}>Related platforms</div>
            <div className={styles.crossChips}>
              {platforms.map((slug, _i) => {
                return (
                  <Link
                    key={slug}
                    href={`/platforms/${slug}`}
                    className={styles.crossChip}
                  >
                    <span className={styles.crossChipName}>
                      {taxonomyLabels(slug).label}
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
              {capabilities.map((slug, _i) => {
                return (
                  <Link
                    key={slug}
                    href={`/capabilities/${slug}`}
                    className={styles.crossChip}
                  >
                    <span className={styles.crossChipName}>
                      {taxonomyLabels(slug).label}
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
  icon: L1IconKey;
  eyebrow: string;
  title: string;
  copy: string;
  bullets: string[];
}[] = [
  {
    slug: "contract",
    href: "/contract",
    icon: "pillarContract",
    eyebrow: "01 · Contract",
    title: "Contract & interim",
    copy: "Specialist-screened contractors placed in 72 hours. Day-rate and fixed-term across the Middle East, Europe and India.",
    bullets: [
      "72h brief to shortlist",
      "IR35, day-rate or fixed-term",
      "Bench refreshed weekly",
    ],
  },
  {
    slug: "permanent",
    href: "/permanent",
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
    icon: "pillarManaged",
    eyebrow: "04 · Managed delivery",
    title: "Managed delivery",
    copy: "Outcome-based pods stood up end-to-end. Specialist-led delivery with fixed-price milestones.",
    bullets: [
      "Fixed-price milestones",
      "Specialist-led pods",
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
          One screening standard, whichever commercial model you use.
        </h2>
        <p className={styles.engageSub}>
          Same specialist-screened bench. Four ways to bring them into your
          programme.
        </p>
        <div className={styles.engagePillarsGrid}>
          {engagementPillars.map((p) => {
            const Icon = l1Icons[p.icon];
            return (
              <Link key={p.slug} href={p.href} className={styles.engagePillar}>
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
            specialist-screened shortlist inside 72 hours. No CVs until we
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
        <div className={styles.secLabel}>
          More {taxonomyLabels(sector.slug).label}
        </div>
        <h3 className={styles.relatedH}>Related functions in this sector</h3>
        <div className={styles.relatedGrid}>
          {picks.map((rf, _i) => {
            return (
              <Link
                key={rf.slug}
                href={`/industries/${sector.slug}/${rf.slug}`}
                className={styles.relatedCard}
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
  /**
   * Gated on PUBLISHED insights, not on the array being non-empty — the same
   * correction already made in L1PageShell.
   *
   * Canon §9 descopes the insight family entirely and every legacy piece is
   * `published: false`. The per-post branch below degrades an unpublished card
   * to non-interactive text, which meant this section closed every L2 with five
   * cards that look openable and go nowhere. An unbuilt destination renders
   * nothing; it does not render a card.
   */
  const published = (sector.insights ?? []).filter(
    (p) => p.published !== false,
  );
  if (published.length === 0) return null;
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
        {/* Focusable because it scrolls (SC 2.1.1). */}
        <div
          className={styles.insightsScroll}
          // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable container must be focusable to be keyboard scrollable; the rule does not model overflow
          tabIndex={0}
        >
          {published.map((post, _i) => {
            const inner = (
              <>
                <PetalPlate
                  seed={post.href}
                  className={styles.insImg}
                  ratio={0.66}
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
                  aria-disabled="true"
                >
                  {inner}
                </div>
              );
            }
            return (
              <Link key={post.href} href={post.href} className={styles.insCard}>
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
          aria-label={`Back to ${taxonomyLabels(sector.slug).label}`}
        >
          <span aria-hidden="true">←</span> Back to{" "}
          {taxonomyLabels(sector.slug).short}
        </Link>
        <div className={styles.sbSectorLabel}>{sector.category}</div>
        <div className={styles.sbSectorName}>
          {taxonomyLabels(sector.slug).label}
        </div>
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

// cardHueCycle and cardHueStyle are both gone: the six per-sector hues are
// retired (canon §5) and the plumbing is now deleted, not stubbed.
