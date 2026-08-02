"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { HeroAtmosphere } from "@/components/ui/HeroAtmosphere";
import { PetalPlate } from "@/components/ui/PetalPlate";
import type { L1IconKey, L1PageData } from "@/data/l1/types";
import type { MetricStat } from "@/data/metrics";
import { routeExists } from "@/lib/routes";
import { deriveLinkLabels } from "@/lib/taxonomy-links";
import { deriveSectorRail } from "@/lib/sectors";
import styles from "./L1PageShell.module.css";
import { L1SubNav, L1SubNavScope } from "./L1SubNav";
import { l1Icons } from "./l1-icons";

/**
 * Re-exported so a bespoke page can take the sticky bar off the shell without
 * rebuilding itself on the shell. /ai-talent is the case: it carries the stack
 * matrix and the estate diagram, which the shell has no slot for, and it was
 * the only L1 with no section bar. Import both from here — the scope is not
 * optional, see its own comment.
 */
export { L1SubNav, L1SubNavScope } from "./L1SubNav";

function L1Icon({ icon, className }: { icon: L1IconKey; className?: string }) {
  const Comp = l1Icons[icon];
  return <Comp className={className} />;
}

/** Every section below this file's top level takes only the page data. */
interface Props {
  data: L1PageData;
}

interface ShellProps extends Props {
  /** The four published metrics, read server-side. See L1StatsStrip. */
  metrics: MetricStat[];
}

export function L1PageShell({ data, metrics }: ShellProps) {
  const hasScarce =
    Boolean(data.scarceRoles) && (data.scarceRoles?.length ?? 0) > 0;
  /**
   * Gated on PUBLISHED insights, not on the array being non-empty.
   *
   * Canon §9 descopes the insight family entirely and every legacy piece is
   * `published: false`, so this section was rendering five openable-looking
   * cards with no anchors — ~790px of dead ends closing the page. An unbuilt
   * destination renders nothing, it does not render a card.
   */
  const hasInsights =
    (data.insights ?? []).some((p) => p.published !== false) === true;
  const subNavItems: { id: string; label: string }[] = [
    { id: "why", label: "Why us" },
    { id: "deliver", label: "What we deliver" },
    { id: "how", label: "How we work" },
    ...(hasScarce ? [{ id: "scarce", label: "Scarce talent" }] : []),
    { id: "expertise", label: "Expertise" },
    { id: "segments", label: "Segments" },
    ...(hasInsights ? [{ id: "insights", label: "Insights" }] : []),
  ];

  return (
    /* R4: the sector's identity hue, declared once. Section rhythm still varies
       by POSITION (.amb-1 hero, .amb-3 segment panel, .amb-5 insight rail) — it
       now varies within one hue instead of across six.
       This is not the retired per-sector system returning: that one pushed its
       hue into borders, labels and card washes, so the page's ACCENT changed
       with the branch. Here the hue never leaves the ambient layer and gold
       stays the only interactive colour, which is the whole distinction R4
       draws. A sector with no identity token falls back to the positional
       rhythm, so nothing breaks for the sectors not yet mapped. */
    /* .page keeps amb-1 so the PetalPlates inherit --amb, but it is NOT a wash
       host: it is the whole document (measured 7,235px on retail), and the wash
       gradient sizes in percentages of its host, so on a box that tall the
       radial is scaled to the document and reads as nothing at viewport scale.
       The wash goes on individual bands below — which is what canon §5 already
       said it was for ("this lives on bands and panel edges"). */
    <div className={`${styles.page} amb-1`} data-identity={data.slug}>
      <L1Hero data={data} />
      <L1StatsStrip metrics={metrics} />
      {/* The sub-nav and the sections it navigates share one containing block,
          and that is the fix for a measured occlusion rather than tidying. A
          sticky element sticks for the length of its containing block, so as a
          direct child of the page it stayed pinned over the read-next rail and
          the closing card — content it does not navigate. At the terminal scroll
          position, where End lands, it covered the top row of read-next chips
          and reduced three live links to ZERO clickable area; that rail is the
          only way off this page other than the brief form. Scoped here, sticky
          releases when the last navigated section ends. */}
      <L1SubNavScope>
        <L1SubNav items={subNavItems} />
        <div id="why">
          <L1Intro data={data} />
        </div>
        <div id="deliver">
          <L1WhatWeDeliver data={data} />
        </div>
        <div id="how">
          <L1HowWeWork noun={data.sectorNoun ?? data.slug} />
        </div>
        {hasScarce && (
          <div id="scarce">
            <L1ScarceTalent data={data} />
          </div>
        )}
        <L1Expertise data={data} />
        <L1Segments data={data} />
      </L1SubNavScope>
      {/* Three sections dropped, on the re-critique's own finding: six of
          thirteen were the same figure — eyebrow, counted H2, lede, row of equal
          tiles — while the page's genuinely distinctive assets were the least
          designed surfaces on it.
          · The specialist gallery. Canon §8 assigns the screening proof to the
            six specialist desks, not to a four-card practice-lead gallery, and
            the desks appeared nowhere on the page. L1BottomCta carries them now.
          · Technology partners. Ten of sixteen marks sat outside the
            six-platform set, and calling SAP, AWS and Google Cloud "partners" is
            a commercial claim with nothing behind it.
          · Service pillars. A second four-model grid duplicating the homepage's,
            sitting ~700px above a CTA that asks for the same thing. Folded in. */}
      <L1BottomCta />
      <L1ReadNext data={data} />
      {hasInsights && (
        <div id="insights">
          <L1Insights data={data} />
        </div>
      )}
    </div>
  );
}

/* ============ IN-PAGE STICKY SUB-NAV ============ */

/* ============ HERO ============ */
function L1Hero({ data }: Props) {
  return (
    <section className={`${styles.hero} amb-wash amb-1`}>
      {/* B3: one full-bleed atmospheric field replaces four stacked layers — a
          bounded PetalPlate pinned into a corner, plus a tint, an overlay and a
          grid, each fighting the others for the same pixels. The plate was card
          imagery doing a background's job: at hero scale its own gold corner was
          painted out by the overlay (the earlier critique measured that), and the
          composition read as a flat band with a picture stuck to one side.
          HeroAtmosphere is the field, the geometry, the grain and the scrim as
          one object, deterministic from the slug and tinted by the section's
          assigned --amb. */}
      <HeroAtmosphere seed={data.slug} />
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
/**
 * The four published metrics, from `content/metrics.yaml` via the server page.
 *
 * Each L1 data file used to carry its own `stats` tuple, and all eight of them
 * had replaced "50+ Programmes staffed" with a per-page count — "20 Retail
 * function areas", "10 Cloud & Infra function areas". That published a fifth
 * metric canon §6 does not sanction, dropped a sanctioned one, and put the
 * figures beyond the reach of the quarterly refresh: editing metrics.yaml would
 * never have reached these pages. The values arrive as a prop rather than an
 * import because this is a client component and the loader reads the file
 * system; a server parent passes them, so they are still in the markup.
 */
function L1StatsStrip({ metrics }: { metrics: MetricStat[] }) {
  return (
    <section className={styles.statsStrip}>
      <dl className={styles.statsInner}>
        {metrics.map((m) => (
          <div key={m.label} className={styles.statCell}>
            <dd className={styles.statN}>
              {m.target}
              {m.suffix ?? ""}
            </dd>
            <dt className={styles.statL}>{m.label}</dt>
            <dd className={styles.statD}>{m.definition}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ============ INTRO ============ */
function L1Intro({ data }: Props) {
  return (
    <section className={`${styles.intro} amb-wash amb-2`}>
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
          {/* No sourced figure renders no rail. An empty flex column still
              claims its grid track, which is how a removed stat leaves a hole
              instead of leaving nothing. */}
          {data.introStatCards.length > 0 ? (
            <div className={styles.introRight}>
              {data.introStatCards.map((c) => (
                <div key={c.l} className={styles.introStatCard}>
                  <div className={styles.introStatN}>{c.n}</div>
                  <div className={styles.introStatL}>{c.l}</div>
                  {c.source ? (
                    <cite className={styles.introStatSource}>{c.source}</cite>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/* ============ WHAT WE DELIVER ============ */
type L1IconKeyLocal = L1IconKey;
const whatWeDeliverCards: {
  icon: L1IconKeyLocal;
  eyebrow: string;
  title: string;
  copy: string;
  bullets: string[];
}[] = [
  {
    icon: "scarce",
    eyebrow: "Contract-first bench",
    title: "Specialists in the seat — not sourced in a week.",
    copy: "Every role we place already sits on an assessed bench. Named consultants with delivery track records, screened by the specialist leading that practice.",
    bullets: [
      "72h from brief to shortlist",
      "2:1 CV-to-interview ratio",
      "Named consultants — not agency profiles",
    ],
  },
  {
    icon: "workforce",
    eyebrow: "Specialist-led screening",
    title: "Screening depth that recruiters can't reproduce.",
    copy: "Every shortlist is depth-tested by specialists who have delivered this platform, in this sector, at this scale. Certifications don't cut it — evidence does.",
    bullets: [
      "Practice leads screen every candidate",
      "Sector-specific context tests",
      "Reference-verified track records",
    ],
  },
  {
    icon: "spark",
    eyebrow: "Multi-market flexibility",
    title: "Middle East · Europe · India — contract, EOR, perm or delivery.",
    copy: "Cross-market bench lets us place fast in the region that's constrained. Four commercial models decide who carries the contract, the visa and the notice period.",
    bullets: [
      /* R17. "Active bench across 3 markets" was unevidenced — nothing in the
         repo sizes a bench in any market, let alone three — and it collided with
         §2's supply/demand ban by implying three symmetric supply markets. The
         four entities are a PUBLISHED fact (src/data/platforms/why.ts, and the
         homepage's own city list), and they say more: an entity is what lets a
         specialist start on our paper. Closes Q11. */
      "Four entities: London · Dubai · Riyadh · Bengaluru",
      "Contract · EOR · Perm · Managed",
      "IR35, VAT and compliance built in",
    ],
  },
];

function L1WhatWeDeliver({ data }: Props) {
  const sector = data.sectorNoun;
  return (
    <section className={styles.wwd}>
      <div className={styles.wrap}>
        <div className={styles.wwdHead}>
          <div className={styles.eyebrow}>What we deliver</div>
          <h2 className={styles.h2}>
            What every {sector} programme buys from us —{" "}
            <span className={styles.heroEmphasis}>
              speed, screening depth, and coverage.
            </span>
          </h2>
          <p className={styles.sub}>
            The Yallo Talent bench is engineered around three commitments. Every
            programme we support gets all three — from the first brief.
          </p>
        </div>
        <div className={styles.wwdGrid}>
          {whatWeDeliverCards.map((c, i) => (
            <article key={c.title} className={styles.wwdCard}>
              <div className={styles.wwdGlow} aria-hidden="true" />
              <div className={styles.wwdCardInner}>
                <span className={styles.wwdIcon}>
                  <L1Icon icon={c.icon} className={styles.wwdIconSvg} />
                </span>
                <div className={styles.wwdEyebrow}>{c.eyebrow}</div>
                <h3 className={styles.wwdTitle}>{c.title}</h3>
                <p className={styles.wwdCopy}>{c.copy}</p>
                <ul className={styles.wwdBullets}>
                  {c.bullets.map((b) => (
                    <li key={b} className={styles.wwdBullet}>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
              <span className={styles.wwdBadge} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ HOW WE WORK ============ */
const howWeWorkSteps: {
  n: string;
  title: string;
  copy: string;
}[] = [
  {
    n: "01",
    title: "Send us the brief",
    copy: "Role, platform, timeline, engagement model. No CVs traded on speculation — we start from what your programme actually needs.",
  },
  {
    n: "02",
    title: "Specialist-led screening",
    copy: "Specialists who have run your kind of delivery assess every candidate for implementation depth. Not certificates. Not keywords.",
  },
  {
    n: "03",
    title: "Shortlist in 72 hours",
    copy: "Three to five specialist-screened candidates in your inbox with rate, notice, engagement model and evidence attached.",
  },
  {
    n: "04",
    title: "Deploy the model that fits",
    copy: "Contract, EOR, Permanent or Managed Delivery — matched to who needs to carry the contract and the visa.",
  },
];

/* Exported, and takes a NOUN rather than the whole page object.
   Its four cards are a module-level constant — the engagement models, identical
   on every surface — and its own sub-copy says so outright: "regardless of
   sector, platform or model". The only thing it ever needed from L1PageData was
   one word for the heading. Taking `data` made a generic section look
   sector-only, which is why the platform L1 never had it. */
export function L1HowWeWork({ noun }: { noun: string }) {
  return (
    <section className={`${styles.hww} amb-wash amb-3`}>
      <div className={styles.wrap}>
        <div className={styles.hwwHead}>
          <div className={styles.eyebrow}>How we work</div>
          <h2 className={styles.h2}>
            From brief to bench —{" "}
            <span className={styles.heroEmphasis}>
              every {noun} programme, same rhythm.
            </span>
          </h2>
          <p className={styles.sub}>
            Yallo Talent is a contract-first bench built on specialist-led
            screening. Every engagement follows the same disciplined operating
            rhythm — regardless of sector, platform or model.
          </p>
        </div>
        <div className={styles.hwwGrid}>
          {/* The section's ONE purposeful travelling element under the ratified
              motion budget. Same component as the homepage screen band. */}
          <span
            className={`flow-connector ${styles.hwwConnector}`}
            aria-hidden="true"
          />
          {howWeWorkSteps.map((s) => (
            <div key={s.n} className={styles.hwwStep}>
              <div className={styles.hwwGlow} aria-hidden="true" />
              <div className={styles.hwwStepInner}>
                <div className={styles.hwwStepNum}>{s.n}</div>
                <h3 className={styles.hwwStepTitle}>{s.title}</h3>
                <p className={styles.hwwStepCopy}>{s.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* CROSS-SECTOR ADVANTAGE, removed 2 Aug 2026.

   `_L1CrossSector` was unreferenced — underscore-prefixed, no caller — and it
   carried its own hand-typed array of the six sectors, with its own labels
   ("Banking & FS") and its own order. A seventh hand-copied taxonomy, invisible
   because it never rendered, and it would have shipped a stale sector list the
   moment anyone re-enabled it. Deleted rather than derived: dead code that
   derives is still dead code. If the section returns it takes its order and
   labels from `sectorNavEntries` like every other surface. */

/* ============ SCARCE TALENT ============ */
function L1ScarceTalent({ data }: Props) {
  if (!data.scarceRoles || !data.scarceEyebrow) return null;
  const icon: L1IconKey = data.scarceIcon ?? "scarce";
  return (
    <section className={styles.scarce}>
      <div className={styles.wrap}>
        <div className={styles.scarceCard}>
          {/* Two decorative layers removed, markup and all.
              .scarceGlow had already been neutralised to display:none as a
              DESIGN.md anti-reference, but a hidden div is dead weight rather
              than a fix, so it goes properly.
              .scarceGridBg was a hairline grid-line field tiled at 32px — the
              generated-UI signature, one rule below a block deleted on exactly
              that principle. A grid overlay belongs on a canvas, a map, a
              blueprint or a measurement surface; the scarce-talent card is
              none of those, and canon has no clause admitting it. The card
              already carries a gradient, a hairline and an inset highlight;
              this was a fourth texture doing nothing the other three don't. */}
          <div className={styles.scarceGrid}>
            <div className={styles.scarceLeft}>
              <div className={styles.scarceIcon}>
                <L1Icon icon={icon} className={styles.scarceIconSvg} />
              </div>
              <div className={styles.scarceLeftMid}>
                <div className={styles.eyebrow}>{data.scarceEyebrow}</div>
                {/* h2, not h3, and the 27px class is unchanged. These are top-level
                    sections whose only heading was an h3, so an assistive-tech
                    outline nested the scarce-talent band — the page's
                    differentiating product — underneath the how-we-work
                    section as a child rather than a sibling. axe's
                    heading-order passes because 2 to 3 is not a skip.
                    Visual size and semantic level are independent; the head
                    stays 27px because it sits inside a bordered panel. */}
                <h2 className={styles.scarceH}>{data.scarceTitle}</h2>
                <p className={styles.scarceCopy}>{data.scarceCopy}</p>
                {data.scarceCta && (
                  <Link href={data.scarceCta.href} className={styles.scarceCta}>
                    {data.scarceCta.label}
                    <span aria-hidden="true">→</span>
                  </Link>
                )}
              </div>
            </div>
            {/* A chip only earns its place if it says something the row next to
                it does not. Measured on retail: the scarcity chip was IDENTICAL
                on all eight rows — 0.000 bits — and the engagement chip carried
                0.544, seven CONTRACT against one variant. Sixteen chips for
                half a bit, and they were the loudest thing in the block: 13px
                signal-orange tracked mono inside a 4.37:1 bordered box, against
                a neutral role name. The salience order inverted the information
                order, on the one column a buyer actually reads.

                So the scarcity chip goes entirely — the section HEADING is the
                scarcity claim, and repeating it eight times in a coloured box
                adds nothing — and the engagement chip renders only where it
                DEVIATES from the section's norm. A uniform value stated once in
                prose beats a badge on every row. */}
            {/* Wrapped with the list in a SINGLE grid child, and that matters:
                .scarceGrid is `1fr 1.15fr`, so adding this as a third sibling
                put it in column 2 and pushed the list into column 1 row 2 —
                the whole right half of the card went empty. Grid children are
                positional; a new element is a new cell unless you say otherwise. */}
            <div className={styles.scarceRight}>
              {/* The norm stated once, DERIVED from the rows rather than written.
                Dropping a uniform chip only works if the value it carried is
                still somewhere, and computing it means the line cannot drift
                out of step with the data the way authored copy would. */}
              {(() => {
                const counts = new Map();
                for (const r of data.scarceRoles ?? [])
                  counts.set(
                    r.engagement ?? "contract",
                    (counts.get(r.engagement ?? "contract") ?? 0) + 1,
                  );
                const total = data.scarceRoles?.length ?? 0;
                const [norm, n] =
                  [...counts.entries()].sort((a, b) => b[1] - a[1])[0] ?? [];
                return norm && n > total / 2 ? (
                  <p className={styles.scarceNorm}>
                    {norm === "perm" ? "Permanent" : "Contract"} unless noted.
                  </p>
                ) : null;
              })()}
              <div className={styles.scarceList}>
                {(() => {
                  const norm = "contract";
                  return data.scarceRoles.map((r) => (
                    <div key={r.name} className={styles.scarceRow}>
                      <span className={styles.scarceRowName}>{r.name}</span>
                      {r.engagement && r.engagement !== norm ? (
                        <span className={styles.scarceTags}>
                          <span className={`${styles.rtag} ${styles.rtagPerm}`}>
                            {r.engagement === "perm"
                              ? "Perm"
                              : "Perm / Contract"}
                          </span>
                        </span>
                      ) : null}
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ EXPERTISE ============ */
const EXPERTISE_COLLAPSED_COUNT = 8;

function L1Expertise({ data }: Props) {
  const [showAll, setShowAll] = useState(false);
  const total = data.expertise.length;
  const collapsible = total > EXPERTISE_COLLAPSED_COUNT;
  const hiddenCount = collapsible ? total - EXPERTISE_COLLAPSED_COUNT : 0;
  // Render every card; CSS hides cards past the limit on desktop when
  // collapsed, and shows all in the mobile horizontal-scroll layout.
  const visible = data.expertise;
  /* The largest column count up to four that divides the card total evenly, so
     the last desktop row is never short. auto-fill cannot do this job: the track
     width that yields four columns for twenty cards yields four for six as well,
     because the container is the same width either way. Falls back to four for
     counts with no such divisor (17, say), where raggedness is unavoidable. */
  const expCols = [4, 3, 2].find((n) => visible.length % n === 0) ?? 4;
  // First function that has an L2 page — the "Explore all functions in
  // detail" hint links here, and the L2 sidebar shows every function.
  //
  // routeExists is the second half of the test and not belt-and-braces. Having
  // the gating field only means the DATA could support an L2; it does not mean
  // the route is built.
  //
  // The gate differs by family because the EVIDENCE differs. A sector L2 earns
  // its page from `tools` — that is what the sector route builds on. A
  // capability L2 earns it from `roles`: capability cards carry no `tools` and
  // never have, so a tools gate meant no capability could ever drill down, which
  // is why /capabilities/data-analytics shipped zero L2 links against retail's
  // twenty-one. Roles are the honest test — a discipline earns a page when we can
  // say who we place on it.
  //
  // (This comment previously said there was no /capabilities/[cap]/[fn] route at
  // all. There is now; D3 built it on the same L2PageShell.)
  const firstL2 = data.expertise.find((e) =>
    data.category === "capabilities"
      ? (e.roles?.length ?? 0) > 0
      : (e.tools?.length ?? 0) > 0,
  );
  const candidateHref = firstL2
    ? `/${data.category}/${data.slug}/${firstL2.slug}`
    : null;
  const firstL2Href =
    candidateHref && routeExists(candidateHref) ? candidateHref : null;

  return (
    <section className={styles.expertise} id="expertise">
      <div className={styles.wrap}>
        <div className={styles.expertiseHead}>
          <div className={styles.expertiseHeadLeft}>
            <div className={styles.eyebrow}>{data.expertiseEyebrow}</div>
            <h2 className={styles.h2}>{data.expertiseTitle}</h2>
            <p className={styles.sub}>{data.expertiseSub}</p>
          </div>
          {/* No destination renders NOTHING. The fallback used to be a <div>
              carrying the same class as the link — same gold, same arrow, same
              hover translate — so on every capability page the section's only
              apparent exit was a dead affordance that could not be clicked,
              focused or announced. A missing destination is not a styling
              problem to solve with a disabled state; it is content that does
              not exist, and content that does not exist renders nothing. */}
          {/* The label NAMES its destination. It used to read "Explore all
              functions in detail" and resolve to a single function's page — one
              of twenty — which a frozen pass caught as an SC 2.4.4 Link Purpose
              failure on the section's primary taxonomy exit. The href is derived
              as the first function with an L2, so the honest label is that
              function's own name; when there is no destination it still renders
              nothing rather than a promise. */}
          {firstL2Href && firstL2 ? (
            <Link href={firstL2Href} className={styles.expertiseHint}>
              {firstL2.title} in detail
              <span aria-hidden="true"> →</span>
            </Link>
          ) : null}
        </div>
        {/* Focusable because it scrolls at narrow widths (SC 2.1.1). */}
        <div
          className={`${styles.expertiseGrid} ${collapsible && !showAll ? styles.expertiseGridCollapsed : ""}`}
          style={{ "--exp-cols": expCols } as React.CSSProperties}
          // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable container must be focusable to be keyboard scrollable; the rule does not model overflow
          tabIndex={0}
        >
          {visible.map((card, i) => {
            /* Auto-derive the L2 href from whatever gates that family's L2
               route: `tools` for sectors, `roles` for capabilities. Same reason
               as firstL2 above — capability cards carry no tools, so a tools-only
               test left every discipline card unlinked even once the route
               existed. Kept as one expression so the card link and the section
               hint can never disagree about which functions have pages. */
            const hasL2Evidence =
              data.category === "capabilities"
                ? (card.roles?.length ?? 0) > 0
                : (card.tools?.length ?? 0) > 0;
            const l2Href =
              card.href ??
              (hasL2Evidence
                ? `/${data.category}/${data.slug}/${card.slug}`
                : undefined);
            return (
              <motion.div
                key={card.slug}
                initial={{ y: 16 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                className={styles.expCardWrap}
              >
                <div className={styles.expCard}>
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
                      {l2Href ? (
                        <Link
                          href={l2Href}
                          className={styles.expCardOpenLink}
                          aria-label={`Open ${card.title} contractors page`}
                        >
                          <svg
                            viewBox="0 0 16 16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <title>Open page</title>
                            <path d="M4 12L12 4M6 4h6v6" />
                          </svg>
                        </Link>
                      ) : null}
                    </div>
                    <h3 className={styles.expCardTitle}>{card.title}</h3>
                    {card.blurb && (
                      <p className={styles.expCardBlurb}>{card.blurb}</p>
                    )}
                    <ul className={styles.expCardRoles}>
                      {card.roles.map((r) => (
                        <li key={r} className={styles.expCardRole}>
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        {collapsible && (
          <div className={styles.expertiseFoot}>
            <button
              type="button"
              className={styles.expertiseShowAll}
              onClick={() => {
                setShowAll((v) => {
                  if (v) {
                    // Collapsing — bring the expertise section back into view
                    // so the user isn't stranded further down the page.
                    requestAnimationFrame(() => {
                      document.getElementById("expertise")?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    });
                  }
                  return !v;
                });
              }}
              aria-expanded={showAll}
              aria-label={
                showAll ? "Show less" : `Show all ${total} function areas`
              }
            >
              {showAll ? "Show less" : `Show all ${total} function areas`}
              <span aria-hidden="true">{showAll ? "↑" : "↓"}</span>
              {!showAll && (
                <span className={styles.expertiseHiddenCount}>
                  +{hiddenCount} more
                </span>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ============ SEGMENTS ============ */
function L1Segments({ data }: Props) {
  /* Order and label derive from the sector index, and this is the fix for
     three defects at once rather than for the one that was reported. The rail
     shipped in a different order from the mega menu, with "Public Sector" where
     the menu says "Government & Public Sector" and the singular "Life Science"
     where the menu says the plural. One cause: the list was hand-copied into
     each capability's data file, six times, so it could disagree three ways.

     Only the name and the order derive. The intro and the roles on each segment
     stay authored, because they are genuinely per-page and are the reason the
     rail exists at all. A page whose segments are its own sub-markets rather
     than sectors — retail's fnb, electronics, textile — passes through
     untouched, so this is applied unconditionally.

     A seventh sector renders here the moment it is added to the index. Nothing
     in this component knows how many there are. */
  const segments = deriveSectorRail(data.segments);
  const [active, setActive] = useState(segments[0]?.id ?? "");
  const activeIdx = segments.findIndex((s) => s.id === active);
  const activeSeg = segments[activeIdx >= 0 ? activeIdx : 0];
  if (!activeSeg) return null;

  return (
    <section className={styles.segments} id="segments">
      <div className={styles.wrap}>
        <div className={styles.eyebrow}>{data.segmentsEyebrow}</div>
        <h2 className={styles.h2}>{data.segmentsTitle}</h2>
        <p className={styles.sub}>{data.segmentsSub}</p>

        <div className={styles.segWrap}>
          <div className={styles.segListWrap}>
            {/* A real tablist, and this replaces three separate defects.
                The triggers used to activate on FOCUS and carry aria-pressed:
                that models thirteen independent toggles rather than a
                thirteen-way single select, so a keyboard user tabbing towards
                the CTA below swapped the panel thirteen times and landed on
                whichever segment they passed through last, while a screen
                reader announced nothing about the 400px of content that had
                just changed. axe cannot see any of it.

                Roving tabindex is what fixes the tab-stop count — exactly one
                trigger is in the tab sequence, so Tab enters the group and Tab
                leaves it, and the arrows move within. Activation follows focus
                only when focus was moved deliberately by an arrow key, which is
                the automatic-activation pattern and is safe here because the
                panel is already rendered.

                The <li> elements are role="presentation" on purpose: role=tablist
                requires role=tab CHILDREN, and a list item between them breaks
                that relationship. That is the aria-required-children failure
                that made Engage use disclosure instead of tabs. */}
            {/* A div, not a ul. Once every item is role="presentation" the list
                semantics are already gone, so keeping the list elements bought
                nothing and cost a lint suppression: a tablist is not a list. */}
            <div
              className={styles.segList}
              role="tablist"
              aria-label="Select a segment"
              aria-orientation="vertical"
              onKeyDown={(e) => {
                const delta =
                  e.key === "ArrowDown" || e.key === "ArrowRight"
                    ? 1
                    : e.key === "ArrowUp" || e.key === "ArrowLeft"
                      ? -1
                      : e.key === "Home"
                        ? -activeIdx
                        : e.key === "End"
                          ? segments.length - 1 - activeIdx
                          : 0;
                if (delta === 0) return;
                e.preventDefault();
                const next =
                  (activeIdx + delta + segments.length) %
                  segments.length;
                const target = segments[next];
                if (!target) return;
                setActive(target.id);
                document
                  .getElementById(`${data.slug}-segtab-${target.id}`)
                  ?.focus();
              }}
            >
              {segments.map((s) => {
                const isActive = s.id === activeSeg.id;
                return (
                  <div
                    key={s.id}
                    className={`${styles.segItem} ${isActive ? styles.segItemOn : ""}`}
                  >
                    <button
                      type="button"
                      id={`${data.slug}-segtab-${s.id}`}
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={`${data.slug}-segpanel`}
                      tabIndex={isActive ? 0 : -1}
                      /* No hover activation. A pointer crossing thirteen
                         vertical triggers on its way down the page fired up to
                         six swaps of a 636px panel, with no way to pin one —
                         and the tab that ended up selected was whichever the
                         cursor passed last, not one the reader chose. A tablist
                         activates on click and on arrow keys; both are
                         deliberate acts. */
                      onClick={() => setActive(s.id)}
                      className={styles.segTrigger}
                    >
                      <span className={styles.segItemDot} aria-hidden="true" />
                      <span className={styles.segItemName}>{s.name}</span>
                    </button>
                  </div>
                );
              })}
            </div>
            <div className={styles.segListFade} aria-hidden="true" />
          </div>

          <motion.div
            className={`${styles.segPanel} amb-3`}
            key={activeSeg.id}
            id={`${data.slug}-segpanel`}
            role="tabpanel"
            aria-labelledby={`${data.slug}-segtab-${activeSeg.id}`}
            initial={{ x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.segPanelGlow} aria-hidden="true" />
            <div className={styles.segImgWrap}>
              <PetalPlate
                seed={`${data.slug}:${activeSeg.id}`}
                className={styles.segImg}
                ratio={0.62}
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
                  <span key={r} className="role-pill">
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

/* ============ INSIGHTS (scrolling) ============ */
/**
 * The insight row, and it renders PUBLISHED items only.
 *
 * Decision 1 of context-round5-rulings.md, the Blueprint's no-empty-slot rule
 * applied sitewide. The row used to render every item in the array and grey out
 * the ones with no article behind them, so a reader met a card with a headline,
 * a byline and a reading time that could not be opened. On the sector pages that
 * was the whole row: canon §9 descopes insight articles from this build, so
 * every teaser on six of the seven sectors is a placeholder.
 *
 * A placeholder is worse than an absence, and worse again when it has gone
 * stale — two finance teasers were still advertising platforms the desk had
 * stopped staffing, one of them with an unsourced market claim in its excerpt.
 * Nothing published means no row at all, no eyebrow and no heading.
 */
function L1Insights({ data }: Props) {
  const published = (data.insights ?? []).filter((p) => p.published !== false);
  if (published.length === 0) return null;
  return (
    <section className={`${styles.insights} amb-wash amb-5`}>
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
        {/* SC 2.1.1: a scrollable container must be keyboard operable. The
            cards' links are reachable already; the container itself was not, so
            arrow-key scrolling was impossible. Focusability is all the criterion
            needs — no role, matching how CaseRail handles the same problem. */}
        <div
          className={`${styles.insightsScroll} amb-5`}
          // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable container must be focusable to be keyboard scrollable; the rule does not model overflow
          tabIndex={0}
        >
          {/* Every card here is published, so every card is a link. The
              disabled-card branch is gone rather than left unreachable: an
              unpublished teaser has no rendering at all now. */}
          {published.map((post) => (
            <Link key={post.href} href={post.href} className={styles.insCard}>
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
                    {post.author} · {post.minutes} min read
                  </span>
                  <span className={styles.insRead}>Read →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Canon §3, verbatim and in order: "Six specialist desks carry the screening
   proof: Architecture, Software Development, Cloud & Infrastructure, Packaged
   Software, Data & Analytics, Agile & DevOps." */
const SPECIALIST_DESKS = [
  /* Packaged Software FIRST, per Sumeet: SAP and Oracle are the bulk of what we
     staff, so the desk that carries them leads. "Data & Analytics" is now
     "Data & AI" — the combined platform-and-capability view, and the term the
     market uses. Same order on every surface that lists the desks. */
  "Packaged Software",
  "Architecture",
  "Software Development",
  "Data & AI",
  "Cloud & Infrastructure",
  "Agile & DevOps",
] as const;

/* ============ BOTTOM CTA ============ */
/* Exported: this section takes no props and reads no page data — it is the same
   closing ask on every L1. The platform template is bespoke and never had one,
   so SAP ended on a module list with no call to action. Generic by construction,
   so reusing it authors nothing. */
export function L1BottomCta() {
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
              No CVs until we understand your programme. Specialist-screened
              shortlist matched to your context.
            </p>

            {/* The desks that do the screening, against the ask rather than as
                their own section 700px above it. Named, not counted — the label
                does not say "six". */}
            <p className={styles.deskLabel}>Screened by</p>
            <ul className={styles.deskList}>
              {SPECIALIST_DESKS.map((d) => (
                <li key={d} className="role-pill">
                  {d}
                </li>
              ))}
            </ul>

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
  /* Four rails: industries | platforms | capabilities | intelligence.
     The fourth was added by session B on 2 Aug 2026, and it is a silent-drop fix
     rather than a feature. Three buckets meant any `related` entry whose
     category was not one of exactly "Industry", "Platform" or "Capability" fell
     through the if/else chain and rendered nothing at all, while still reading
     as a shipped cross-link in the data file.

     Measured across every L1 and capability `related` array, it was four links
     in two files: three "Blueprint" entries on Testing & Quality Engineering,
     authored and inert since they were written, and one "Intelligence" entry I
     added to finance an hour earlier for context-finance-depth.md §3, which is
     how the defect surfaced. Deleting four deliberately authored links would
     have been the cheaper fix and the wrong one.

     Both labels are accepted into one rail because they name the same
     destination tree, /intelligence/**, from two authors' vocabularies.
     Normalising the data to one string instead would leave the next unmatched
     category silently dropped, which is the actual fault here. */
  const buckets = {
    Industry: [] as typeof data.related,
    Platform: [] as typeof data.related,
    Capability: [] as typeof data.related,
    Intelligence: [] as typeof data.related,
  };
  /* Only rail links whose target exists — the related arrays are authored data
     and several entries point at pages that were never built.

     `deriveLinkLabels` then takes the NAME from the index that owns the href,
     leaving authored labels alone where the href is not a taxonomy route (case
     studies, service pages, intelligence). The href was already checked against
     the registries here and the label beside it never was, so a rename moved the
     page and left every cross-link pointing at it saying the old name. Six of
     these rails name platforms and none of them had heard of Informatica. */
  for (const r of deriveLinkLabels(data.related).filter((x) =>
    routeExists(x.href),
  )) {
    if (r.category === "Industry") buckets.Industry.push(r);
    else if (r.category === "Platform") buckets.Platform.push(r);
    else if (r.category === "Capability") buckets.Capability.push(r);
    else if (r.category === "Blueprint" || r.category === "Intelligence")
      buckets.Intelligence.push(r);
  }
  const rails: { label: string; items: typeof data.related }[] = [
    { label: "Adjacent industries", items: buckets.Industry },
    { label: "Platforms we staff", items: buckets.Platform },
    { label: "Capabilities we deliver", items: buckets.Capability },
    { label: "Programme intelligence", items: buckets.Intelligence },
  ].filter((r) => r.items.length > 0);

  return (
    <section className={styles.readNext}>
      <div className={styles.wrap}>
        <div className={styles.readNextHead}>
          <div className={styles.eyebrow}>Also connected</div>
          <h2 className={styles.readNextH}>{data.relatedTitle}</h2>
        </div>
        <div className={styles.readNextRails}>
          {rails.map((rail) => (
            <div key={rail.label} className={styles.readNextRail}>
              <div className={styles.readNextRailLabel}>{rail.label}</div>
              <div className={styles.readNextChips}>
                {rail.items.map((r, _i) => {
                  return (
                    <Link
                      key={r.href}
                      href={r.href}
                      className={styles.readNextChip}
                    >
                      <span className={styles.readNextChipLabel}>
                        {r.label}
                      </span>
                      <span
                        className={styles.readNextChipArr}
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
