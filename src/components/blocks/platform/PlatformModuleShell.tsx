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
 * Identity hue per R4: the page inherits its platform's `data-identity`, so the
 * hero field and washes are the family's hue and gold stays interactive-only.
 */
export function PlatformModuleShell({
  platform,
  module,
  metrics,
}: {
  platform: PlatformCoverage;
  module: PlatformModule;
  metrics: MetricStat[];
}) {
  const siblings = platform.modules.filter(
    (m) => m.slug && m.slug !== module.slug,
  );

  return (
    <div className={styles.page} data-identity={platform.slug}>
      <section className={`${styles.hero} amb-1`}>
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
            <div key={m.label} className={styles.statCell}>
              <dd className={styles.statN}>
                {m.target}
                {m.suffix ?? ""}
              </dd>
              <dt className={styles.statL}>{m.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      <section className={`${styles.section} amb-2`}>
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
        <section className={`${styles.section} amb-3`}>
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

      {siblings.length > 0 ? (
        <section className={`${styles.section} amb-4`}>
          <div className={styles.wrap}>
            <div className={styles.eyebrow}>Also in {platform.name}</div>
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
        </section>
      ) : null}
    </div>
  );
}
