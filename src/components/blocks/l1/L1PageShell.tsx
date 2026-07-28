"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { L1Hue, L1IconKey, L1PageData } from "@/data/l1/types";
import styles from "./L1PageShell.module.css";
import { l1Icons } from "./l1-icons";

function L1Icon({ icon, className }: { icon: L1IconKey; className?: string }) {
  const Comp = l1Icons[icon];
  return <Comp className={className} />;
}

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
  data: L1PageData;
}

export function L1PageShell({ data }: Props) {
  return (
    <div className={styles.page} style={hueStyle(data.hue)}>
      <L1Hero data={data} />
      <L1StatsStrip data={data} />
      <L1Intro data={data} />
      {data.scarceRoles && data.scarceRoles.length > 0 && (
        <L1ScarceTalent data={data} />
      )}
      <L1Expertise data={data} />
      <L1Segments data={data} />
      <L1Partners partners={data.partners} />
      <L1ServicePillars />
      <L1BottomCta />
      <L1ReadNext data={data} />
      {data.insights && data.insights.length > 0 && <L1Insights data={data} />}
    </div>
  );
}

/* ============ HERO ============ */
function L1Hero({ data }: Props) {
  return (
    <section className={styles.hero}>
      <div className={styles.heroImageWrap}>
        <Image
          src={data.heroImage}
          alt={data.heroImageAlt}
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
        />
      </div>
      <div className={styles.heroTint} aria-hidden="true" />
      <div className={styles.heroOverlay} aria-hidden="true" />
      <div className={styles.heroGrid} aria-hidden="true" />
      <div className={styles.heroInner}>
        <nav className={styles.crumb} aria-label="Breadcrumb">
          {data.breadcrumb.map((c, i) => {
            const isLast = i === data.breadcrumb.length - 1;
            return (
              <span key={c.label} className={styles.crumbItem}>
                {isLast || !c.href ? (
                  <span className={styles.crumbCurrent}>{c.label}</span>
                ) : (
                  <>
                    <Link href={c.href} className={styles.crumbLink}>
                      {c.label}
                    </Link>
                    <span className={styles.crumbSep} aria-hidden="true">
                      /
                    </span>
                  </>
                )}
              </span>
            );
          })}
        </nav>

        <div className={styles.heroEyebrow}>
          <span className={styles.heroEyebrowDot} aria-hidden="true" />
          {data.eyebrow}
        </div>

        <h1 className={styles.heroTitle}>
          {data.title}
          <br />
          <span className={styles.heroEmphasis}>{data.emphasis}</span>
        </h1>

        <p className={styles.heroSub}>{data.sub}</p>

        <div className={styles.heroCtas}>
          <Link href={data.primaryCta.href} className={styles.ctaPrimary}>
            {data.primaryCta.label}
            <span aria-hidden="true">→</span>
          </Link>
          <Link href={data.secondaryCta.href} className={styles.ctaGhost}>
            {data.secondaryCta.label}
          </Link>
        </div>

        <div className={styles.heroDots}>
          {data.statusDots.map((d) => (
            <div key={d} className={styles.heroDot}>
              <span className={styles.heroDotMark} aria-hidden="true" />
              {d}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ STATS STRIP ============ */
function L1StatsStrip({ data }: Props) {
  return (
    <section className={styles.statsStrip}>
      <div className={styles.statsInner}>
        {data.stats.map((s) => (
          <div key={s.l} className={styles.statCell}>
            <div className={styles.statN}>{s.n}</div>
            <div className={styles.statL}>{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============ INTRO ============ */
function L1Intro({ data }: Props) {
  return (
    <section className={styles.intro}>
      <div className={styles.introOrb} aria-hidden="true" />
      <div className={styles.wrap}>
        <div className={styles.introGrid}>
          <div className={styles.introLeft}>
            <div className={styles.eyebrow}>{data.introEyebrow}</div>
            <h2 className={styles.h2}>{data.introTitle}</h2>
            {data.introCopy.map((p) => (
              <p key={p.slice(0, 30)} className={styles.introPara}>
                {p}
              </p>
            ))}
          </div>
          <div className={styles.introRight}>
            {data.introStatCards.map((c) => (
              <div key={c.l} className={styles.introStatCard}>
                <div className={styles.introStatN}>{c.n}</div>
                <div className={styles.introStatL}>{c.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ SCARCE TALENT ============ */
function L1ScarceTalent({ data }: Props) {
  if (!data.scarceRoles || !data.scarceEyebrow) return null;
  const icon: L1IconKey = data.scarceIcon ?? "scarce";
  return (
    <section className={styles.scarce}>
      <div className={styles.wrap}>
        <div className={styles.scarceCard}>
          <div className={styles.scarceGlow} aria-hidden="true" />
          <div className={styles.scarceGridBg} aria-hidden="true" />
          <div className={styles.scarceGrid}>
            <div className={styles.scarceLeft}>
              <div className={styles.scarceIcon}>
                <L1Icon icon={icon} className={styles.scarceIconSvg} />
              </div>
              <div className={styles.scarceLeftMid}>
                <div className={styles.eyebrow}>{data.scarceEyebrow}</div>
                <h3 className={styles.scarceH}>{data.scarceTitle}</h3>
                <p className={styles.scarceCopy}>{data.scarceCopy}</p>
                {data.scarceCta && (
                  <Link href={data.scarceCta.href} className={styles.scarceCta}>
                    {data.scarceCta.label}
                    <span aria-hidden="true">→</span>
                  </Link>
                )}
              </div>
            </div>
            <div className={styles.scarceList}>
              {data.scarceRoles.map((r) => (
                <div key={r.name} className={styles.scarceRow}>
                  <span className={styles.scarceRowName}>{r.name}</span>
                  <span className={styles.scarceTags}>
                    <span
                      className={`${styles.rtag} ${
                        r.scarcity === "high" ? styles.rtagHigh : styles.rtagMed
                      }`}
                    >
                      {r.scarcity === "high" ? "High scarcity" : "Med scarcity"}
                    </span>
                    <span
                      className={`${styles.rtag} ${
                        r.engagement === "perm"
                          ? styles.rtagPerm
                          : styles.rtagContract
                      }`}
                    >
                      {r.engagement === "perm"
                        ? "Perm"
                        : r.engagement === "contract-perm"
                          ? "Perm / Contract"
                          : "Contract"}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ EXPERTISE ============ */
function L1Expertise({ data }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const toggle = (slug: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  return (
    <section className={styles.expertise} id="expertise">
      <div className={styles.wrap}>
        <div className={styles.eyebrow}>{data.expertiseEyebrow}</div>
        <h2 className={styles.h2}>{data.expertiseTitle}</h2>
        <p className={styles.sub}>{data.expertiseSub}</p>
        <div className={styles.expertiseGrid}>
          {data.expertise.map((card, i) => {
            const isOpen = expanded.has(card.slug);
            const cardHue = cardHueCycle[i % cardHueCycle.length] as L1Hue;
            // Auto-derive L2 href when this function has tools configured
            const l2Href =
              card.href ??
              (card.tools && card.tools.length > 0
                ? `/industries/${data.slug}/${card.slug}`
                : undefined);
            return (
              <motion.div
                key={card.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                className={styles.expCardWrap}
              >
                <div
                  className={`${styles.expCard} ${isOpen ? styles.expCardOpen : ""}`}
                  style={cardHueStyle(cardHue)}
                >
                  <div className={styles.expCardGlow} aria-hidden="true" />
                  <div className={styles.expCardBorder} aria-hidden="true" />
                  <div className={styles.expCardInner}>
                    <div className={styles.expCardTop}>
                      <span className={styles.expCardIcon}>
                        <L1Icon
                          icon={card.icon}
                          className={styles.expCardIconSvg}
                        />
                      </span>
                      <button
                        type="button"
                        className={styles.expCardToggle}
                        aria-expanded={isOpen}
                        aria-controls={`exp-panel-${card.slug}`}
                        aria-label={isOpen ? "Hide roles" : "See roles"}
                        onClick={() => toggle(card.slug)}
                      >
                        <svg
                          viewBox="0 0 16 16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          aria-hidden="true"
                        >
                          <title>Toggle roles</title>
                          <path d="M8 3v10M3 8h10" />
                        </svg>
                      </button>
                    </div>
                    <span className={styles.expCardNum}>{card.num}</span>
                    <h3 className={styles.expCardTitle}>{card.title}</h3>
                    {card.blurb && (
                      <p className={styles.expCardBlurb}>{card.blurb}</p>
                    )}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`exp-panel-${card.slug}`}
                          key="panel"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{
                            duration: 0.28,
                            ease: [0.2, 0.8, 0.2, 1],
                          }}
                          className={styles.expCardPanel}
                        >
                          <ul className={styles.expCardRoles}>
                            {card.roles.map((r) => (
                              <li key={r} className={styles.expCardRole}>
                                {r}
                              </li>
                            ))}
                          </ul>
                          {l2Href ? (
                            <Link
                              href={l2Href}
                              className={styles.expCardLink}
                            >
                              View contractors
                              <span aria-hidden="true">→</span>
                            </Link>
                          ) : (
                            <span className={styles.expCardLink}>
                              View contractors
                              <span aria-hidden="true">→</span>
                            </span>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============ SEGMENTS ============ */
function L1Segments({ data }: Props) {
  const [active, setActive] = useState(data.segments[0]?.id ?? "");
  const activeIdx = data.segments.findIndex((s) => s.id === active);
  const activeSeg = data.segments[activeIdx >= 0 ? activeIdx : 0];
  if (!activeSeg) return null;
  const activeHue = cardHueCycle[
    (activeIdx >= 0 ? activeIdx : 0) % cardHueCycle.length
  ] as L1Hue;

  return (
    <section className={styles.segments} id="segments">
      <div className={styles.wrap}>
        <div className={styles.eyebrow}>{data.segmentsEyebrow}</div>
        <h2 className={styles.h2}>{data.segmentsTitle}</h2>
        <p className={styles.sub}>{data.segmentsSub}</p>

        <div className={styles.segWrap}>
          <div className={styles.segListWrap}>
            <ul className={styles.segList} aria-label="Select a segment">
              {data.segments.map((s, i) => {
                const isActive = s.id === activeSeg.id;
                const segHue = cardHueCycle[i % cardHueCycle.length] as L1Hue;
                return (
                  <li
                    key={s.id}
                    className={`${styles.segItem} ${isActive ? styles.segItemOn : ""}`}
                    style={cardHueStyle(segHue)}
                  >
                    <button
                      type="button"
                      onMouseEnter={() => setActive(s.id)}
                      onFocus={() => setActive(s.id)}
                      onClick={() => setActive(s.id)}
                      aria-pressed={isActive}
                      className={styles.segTrigger}
                    >
                      <span className={styles.segItemDot} aria-hidden="true" />
                      <span className={styles.segItemName}>{s.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className={styles.segListFade} aria-hidden="true" />
          </div>

          <motion.div
            className={styles.segPanel}
            style={cardHueStyle(activeHue)}
            key={activeSeg.id}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.segPanelGlow} aria-hidden="true" />
            <div className={styles.segImgWrap}>
              <Image
                src={activeSeg.image}
                alt={activeSeg.imageAlt}
                fill
                sizes="(max-width: 900px) 92vw, 640px"
                className={styles.segImg}
              />
              <div className={styles.segImgTint} aria-hidden="true" />
              <div className={styles.segImgOverlay} aria-hidden="true" />
            </div>
            <div className={styles.segContent}>
              <h3 className={styles.segH}>{activeSeg.name}</h3>
              <p className={styles.segCopy}>{activeSeg.intro}</p>
              <div className={styles.segRolesLabel}>Roles in demand now</div>
              <div className={styles.segRolesPills}>
                {activeSeg.roles.map((r) => (
                  <span key={r} className={styles.segRolePill}>
                    {r}
                  </span>
                ))}
              </div>
              <div className={styles.segCtaRow}>
                <Link
                  href={`/brief?segment=${activeSeg.id}`}
                  className={styles.segCta}
                >
                  Brief us on {activeSeg.name.split(/[,&—]/)[0]?.trim()}{" "}
                  contractors
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ============ TECHNOLOGY PARTNERS ============ */
const defaultPartnerNames: string[] = [
  "SAP",
  "Oracle",
  "Salesforce",
  "Anaplan",
  "Microsoft",
  "Blue Yonder",
  "Workday",
  "Manhattan Associates",
  "Google Cloud",
  "Shopify",
  "IBM",
  "Informatica",
  "AWS",
  "Magento",
  "Coupa",
  "Infor",
];

function L1Partners({ partners }: { partners?: string[] }) {
  const partnerNames =
    partners && partners.length > 0 ? partners : defaultPartnerNames;
  return (
    <section className={styles.partners}>
      <div className={styles.wrap}>
        <div className={styles.eyebrow}>Technology partners</div>
        <h2 className={styles.h2}>The platforms we staff.</h2>
        <p className={styles.sub}>
          Active contractor benches across every major enterprise retail
          technology platform.
        </p>
        <div className={styles.partnersGrid}>
          {partnerNames.map((name, i) => {
            const hue = cardHueCycle[i % cardHueCycle.length] as L1Hue;
            return (
              <div
                key={name}
                className={styles.partnerCell}
                style={cardHueStyle(hue)}
              >
                <span className={styles.partnerName}>{name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============ INSIGHTS (scrolling) ============ */
function L1Insights({ data }: Props) {
  if (!data.insights || data.insights.length === 0) return null;
  return (
    <section className={styles.insights}>
      <div className={styles.wrap}>
        <div className={styles.eyebrow}>
          {data.insightsEyebrow ?? "Insights"}
        </div>
        <h2 className={styles.h2}>
          {data.insightsTitle ?? "What's happening in the market right now."}
        </h2>
        {data.insightsSub && <p className={styles.sub}>{data.insightsSub}</p>}
      </div>
      <div className={styles.insightsScrollWrap}>
        <div className={styles.insightsScroll}>
          {data.insights.map((post, i) => {
            const hue = cardHueCycle[i % cardHueCycle.length] as L1Hue;
            return (
              <Link
                key={post.href}
                href={post.href}
                className={styles.insCard}
                style={cardHueStyle(hue)}
              >
                <Image
                  src={post.image}
                  alt={post.imageAlt}
                  fill
                  sizes="(max-width: 900px) 88vw, 380px"
                  className={styles.insImg}
                />
                <div className={styles.insImgTint} aria-hidden="true" />
                <div className={styles.insImgShade} aria-hidden="true" />
                <span className={styles.insCat}>{post.category}</span>
                <div className={styles.insOverlay}>
                  <h3 className={styles.insTitle}>{post.title}</h3>
                  <div className={styles.insMeta}>
                    <span className={styles.insAuthor}>
                      {post.author} · {post.minutes} min read
                    </span>
                    <span className={styles.insRead}>Read →</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============ SERVICE PILLARS ============ */
const servicePillars: {
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

function L1ServicePillars() {
  return (
    <section className={styles.pillars}>
      <div className={styles.wrap}>
        <div className={styles.eyebrow}>Engagement models</div>
        <h2 className={styles.h2}>
          Four ways to deploy Yallo talent into your programme.
        </h2>
        <p className={styles.sub}>
          Same architect-screened bench, four commercial models — pick the one
          that fits how you want to engage.
        </p>
        <div className={styles.pillarsGrid}>
          {servicePillars.map((p, i) => (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className={styles.pillarWrap}
            >
              <Link
                href={p.href}
                className={styles.pillar}
                style={cardHueStyle(p.hue)}
              >
                <div className={styles.pillarGlow} aria-hidden="true" />
                <div className={styles.pillarBorder} aria-hidden="true" />
                <span className={styles.pillarArrow} aria-hidden="true">
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
                <div className={styles.pillarInner}>
                  <div className={styles.pillarIcon}>
                    <L1Icon icon={p.icon} className={styles.pillarIconSvg} />
                  </div>
                  <div className={styles.pillarEyebrow}>{p.eyebrow}</div>
                  <h3 className={styles.pillarTitle}>{p.title}</h3>
                  <p className={styles.pillarCopy}>{p.copy}</p>
                  <ul className={styles.pillarBullets}>
                    {p.bullets.map((b) => (
                      <li key={b} className={styles.pillarBullet}>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ BOTTOM CTA ============ */
function L1BottomCta() {
  return (
    <section className={styles.bottomCta}>
      <div className={styles.wrap}>
        <div className={styles.bottomCard}>
          <div className={styles.bottomGlow} aria-hidden="true" />
          <div className={styles.bottomInner}>
            <div className={styles.eyebrow}>Ready to brief us?</div>
            <h2 className={styles.h2}>
              Send the role, the platform, the timeline —{" "}
              <span className={styles.heroEmphasis}>
                get a shortlist in 72 hours.
              </span>
            </h2>
            <p className={styles.sub}>
              No CVs until we understand your programme. Architect-screened
              shortlist matched to your context.
            </p>
            <div className={styles.bottomActions}>
              <Link href="/brief" className={styles.ctaPrimary}>
                Send us a brief
                <span aria-hidden="true">→</span>
              </Link>
              <Link href="/contract" className={styles.ctaGhost}>
                Contract model
              </Link>
              <Link href="/eor" className={styles.ctaGhost}>
                EOR model
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ READ NEXT ============ */
function L1ReadNext({ data }: Props) {
  return (
    <section className={styles.readNext}>
      <div className={styles.wrap}>
        <div className={styles.readNextHead}>
          <div className={styles.eyebrow}>Read next</div>
          <h3 className={styles.readNextH}>{data.relatedTitle}</h3>
        </div>
        <div className={styles.readNextGrid}>
          {data.related.map((r, i) => {
            const hue = cardHueCycle[i % cardHueCycle.length] as L1Hue;
            return (
              <Link
                key={r.href}
                href={r.href}
                className={styles.readNextCard}
                style={cardHueStyle(hue)}
              >
                <span className={styles.readNextCat}>{r.category}</span>
                <span className={styles.readNextLabel}>{r.label}</span>
                <span className={styles.readNextArr} aria-hidden="true">
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
