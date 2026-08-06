import Link from "next/link";
import { HeroAtmosphere } from "@/components/ui/HeroAtmosphere";
import type { MetricStat } from "@/data/metrics";
import type { PlatformCoverage, PlatformModule } from "@/data/platforms/derive";
import styles from "./PlatformModuleShell.module.css";

/**
 * The platform-L2 template: one module of one suite.
 *
 * Why it exists. The platform page lists seventeen SAP modules with a scope line
 * each, which answers "do you cover this" and nothing after it. A buyer who has
 * decided they need SuccessFactors people had nowhere deeper to go — the only
 * onward link was the brief form. This is the page that answers the next
 * question: who exactly, on what, and where has it been done.
 *
 * Depth without invention. Everything on this page already exists somewhere in
 * the system — the scope line and roles from the authored module set, the
 * sectors from the derived cross-links, the metrics from content/metrics.yaml.
 * Nothing here is written fresh about a client, an outcome or a number, and the
 * page renders less rather than filling a gap: no cross-links section when the
 * module has none, no sector row when it appears in no sector.
 *
 * Identity hue per R4 — and it was inert until 1 Aug for the SAME reason the L1
 * was: `data-identity` resolved `--id` correctly and the sections carried their
 * `.amb-N` position classes, so `--amb` computed fine. Nothing painted it.
 * `.amb-wash` — the class holding the gradient that consumes `--amb` — appeared
 * ZERO times on this shell, so every platform L2 rendered neutral grey whatever
 * its suite. Measured before the fix: washHosts 0.
 *
 * Identity hue per R4: the page inherits its platform's `data-identity`, so the
 * hero field and washes are the family's hue and gold stays interactive-only.
 */
export function PlatformModuleShell({
  platform,
  module,
  metrics,
  metricsAttribution,
  studies = [],
  clients = [],
}: {
  platform: PlatformCoverage;
  module: PlatformModule;
  metrics: MetricStat[];
  /** Their one dated attribution line, composed server-side. Round 17 §2.2. */
  metricsAttribution: string;
  /** Named placements without a published study. Supplied, never derived. */
  clients?: Array<{ name: string; market: string }>;
  /**
   * R6: published case studies whose platform tag names this suite, joined
   * server-side. Real evidence this page can show that its parent L1 card cannot
   * — which was Q17's whole complaint. Empty renders nothing.
   */
  studies?: {
    slug: string;
    title: string;
    client: string | null;
    platform: string | null;
  }[];
}) {
  const siblings = platform.modules.filter(
    (m) => m.slug && m.slug !== module.slug,
  );

  return (
    <div className={styles.page} data-identity={platform.slug}>
      <section className={`${styles.hero} amb-wash amb-1`}>
        <HeroAtmosphere seed={`${platform.slug}-${module.slug}`} />
        <div className={styles.heroInner}>
          <nav className={styles.crumb} aria-label="Breadcrumb">
            <Link href="/platforms" className={styles.crumbLink}>
              Platforms
            </Link>
            <span className={styles.crumbSep} aria-hidden="true">
              /
            </span>
            <Link
              href={`/platforms/${platform.slug}`}
              className={styles.crumbLink}
            >
              {platform.name}
            </Link>
            <span className={styles.crumbSep} aria-hidden="true">
              /
            </span>
            <span className={styles.crumbCurrent}>{module.name}</span>
          </nav>

          <h1 className={styles.title}>
            {module.name} contractors,{" "}
            <span className={styles.emphasis}>shortlisted in 72 hours.</span>
          </h1>

          {module.scope ? <p className={styles.lede}>{module.scope}</p> : null}

          {/* ORDER 1: deployment variants INSIDE the module, not beside it.
              S/4HANA shipped as four sibling entries, which read as four things to
              staff when they are one product deployed three ways — and the fourth,
              RISE, is SAP's commercial programme rather than a deployment. Folding
              them without showing them would lose information; showing them here
              keeps the distinction a buyer actually asks about. */}
          {module.variants && module.variants.length > 0 ? (
            <ul className={styles.variants}>
              {module.variants.map((v) => (
                <li key={v} className="role-pill">
                  {v}
                </li>
              ))}
            </ul>
          ) : null}

          <div className={styles.ctas}>
            <Link
              href={`/brief?platform=${platform.slug}&module=${module.slug}`}
              className={styles.ctaPrimary}
            >
              Brief us on this module
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href={`/platforms/${platform.slug}`}
              className={styles.ctaGhost}
            >
              All {platform.name} modules
            </Link>
          </div>
        </div>
      </section>

      {/* The metric strip, from content/metrics.yaml like every other surface —
          canon §6 permits these four and no others, and they are the same four
          everywhere so a module page cannot quietly publish a fifth. */}
      <section className={styles.stats}>
        <dl className={styles.statsInner}>
          {metrics.map((m) => (
            /* <dt> BEFORE <dd>, and the definition renders. Two defects in
               four lines: the term/definition pairing was inverted for
               assistive tech — value first, label second, which axe does not
               check — and content/metrics.yaml states outright that
               `definition` renders beneath each value, which canon §6 requires
               and this template alone omitted. A figure without its definition
               is the §6 breach the L1 shells already avoid. */
            <div key={m.label} className={styles.statCell}>
              <dt className={styles.statL}>{m.label}</dt>
              <dd className={styles.statN}>
                {m.target}
                {m.suffix ?? ""}
              </dd>
              {m.definition ? (
                <dd className={styles.statD}>{m.definition}</dd>
              ) : null}
            </div>
          ))}
        </dl>
        {/* One dated attribution beneath the strip, round 17 §2.2 — the same
            line the homepage and the L1 shells carry, composed from the four
            `source` values rather than written, so a refresh cannot leave a
            stale attribution behind on this template alone. */}
        <p className={styles.statsSource}>{metricsAttribution}</p>
      </section>

      <section className={`${styles.section} amb-wash amb-2`}>
        <div className={styles.wrap}>
          <div className={styles.eyebrow}>The bench</div>
          <h2 className={styles.h2}>Who we place on {module.name}.</h2>
          <p className={styles.sub}>
            Every role here is a desk we screen for, not a keyword we match. The
            specialist who assesses them has run the work.
          </p>
          <ul className={styles.roleList}>
            {module.roles.map((r) => (
              <li key={r} className="role-pill">
                {r}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Renders nothing when the module appears in no sector — an empty
          "where this shows up" heading is worse than its absence. */}
      {module.appearsIn.length > 0 ? (
        <section className={`${styles.section} amb-wash amb-3`}>
          <div className={styles.wrap}>
            <div className={styles.eyebrow}>In programme</div>
            <h2 className={styles.h2}>Where {module.name} work comes from.</h2>
            <ul className={styles.sectorGrid}>
              {module.appearsIn.map((a) => (
                <li key={`${a.sectorSlug}-${a.fnSlug}`}>
                  <Link
                    href={`/industries/${a.sectorSlug}/${a.fnSlug}`}
                    className={styles.sectorCard}
                  >
                    <span className={styles.sectorCat}>{a.sectorLabel}</span>
                    <span className={styles.sectorFn}>{a.fnTitle}</span>
                    <span className={styles.sectorArrow} aria-hidden="true">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* R6 join: evidence. Renders only when a published study actually carries
          this suite's tag — no placeholder, no "coming soon". */}
      {/* Clients WITHOUT a published study. The ones that have a study already
          appear as cards above, so listing them again would double-count. */}
      {studies.length > 0 || clients.length > 0 ? (
        <section className={`${styles.section} amb-wash amb-5`}>
          <div className={styles.wrap}>
            <div className={styles.eyebrow}>Published work</div>
            <h2 className={styles.h2}>
              {platform.name} programmes we have staffed.
            </h2>
            <ul className={styles.sectorGrid}>
              {studies.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/case-studies/${s.slug}`}
                    className={styles.sectorCard}
                  >
                    <span className={styles.sectorCat}>
                      {s.client ?? s.platform}
                    </span>
                    <span className={styles.sectorFn}>{s.title}</span>
                    <span className={styles.sectorArrow} aria-hidden="true">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            {/* Named placements, separated from the studies on purpose.

                The section previously showed only the client that had a
                published study, so "SAP programmes we have staffed" sat over a
                single card and read as though that were the whole of it — an
                understatement that made the bench look thinner than it is.

                R16 still governs, and it cuts both ways: the studies keep the
                studies heading, and these get a heading that asserts exactly
                what is true of every row — we placed consultants there. No
                study is implied for any of them, and none links anywhere,
                because there is nothing behind them to link to yet. */}
            {clients.length > 0 ? (
              <div className={styles.clientBlock}>
                <h3 className={styles.clientHeading}>
                  Also placed on {platform.name}
                </h3>
                <ul className={styles.clientList}>
                  {clients.map((c) => (
                    <li key={c.name} className={styles.clientItem}>
                      <span className={styles.clientName}>{c.name}</span>
                      <span className={styles.clientMarket}>{c.market}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* R6: ONE marked depth slot per module, reserved for Chat's copy.
          Deliberately empty and deliberately NOT rendered. R6 says reserve it and
          do not write it — so there is no placeholder, no lorem, and no
          "coming soon" line that would read as a dead affordance. When Chat
          supplies `module.depth`, this becomes the module's own paragraph; until
          then the page renders the joins and nothing else.
          data-depth-slot marks it for the next author rather than for the DOM. */}

      {/* nav + h2, not a styled div. This shipped as a bare `<div>` eyebrow
          above up to 13 links: no heading, no accessible name, no landmark, so
          the whole block was unreachable by heading or landmark navigation and
          a screen-reader user met an unlabelled list of platform names with no
          statement of what they had in common. WCAG 1.3.1, Level A, on every
          platform L2. The L1 shell had already solved it one level up with
          `<nav aria-label="SAP modules">`; the L2 simply never inherited it.
          The eyebrow class carries the same look, so this is semantics only. */}
      {siblings.length > 0 ? (
        <nav
          className={`${styles.section} amb-4`}
          aria-label={`Other ${platform.name} product families`}
        >
          <div className={styles.wrap}>
            <h2 className={styles.eyebrow}>Also in {platform.name}</h2>
            {/* A balanced grid, not a ragged one: the adjacent-links rows used
                to break 2-4-2 because the track count was fixed and the item
                count was not. auto-fill with a min track makes every row full
                except the last, at any count. */}
            <ul className={styles.siblingGrid}>
              {siblings.map((m) => (
                <li key={m.slug}>
                  <Link
                    href={`/platforms/${platform.slug}/${m.slug}`}
                    className={styles.siblingCard}
                  >
                    {m.name}
                    <span className={styles.sectorArrow} aria-hidden="true">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      ) : null}
    </div>
  );
}
