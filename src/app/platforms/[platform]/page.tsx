import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "@/components/blocks/home/Home.module.css";
import { ArrowGlyph } from "@/components/blocks/home/icons";
import { LogoImage } from "@/components/blocks/home/LogoImage";
import { SectionHead } from "@/components/blocks/home/SectionHead";
import { WhyRail } from "@/components/blocks/platform/WhyRail";
import { platforms as platformAxis } from "@/data/home/place";
import {
  getPlatformCoverage,
  publishedPlatformSlugs,
} from "@/data/platforms/derive";
import { whyPoints } from "@/data/platforms/why";
import { buildMetadata } from "@/lib/seo";

/**
 * Platform depth at module level — the wedge.
 *
 * The benchmark found that the closest competitor treats enterprise platforms as
 * one line item in a profession list, and that nobody in the category publishes
 * SAP, Oracle and Microsoft with module-level role coverage. This is that page.
 *
 * Every module and every role here is derived from the sector data, so the page
 * cannot claim coverage the site does not already document. A platform without
 * enough module data gets no route at all — see derive.ts.
 */

interface RouteParams {
  platform: string;
}

export function generateStaticParams(): RouteParams[] {
  return publishedPlatformSlugs().map((platform) => ({ platform }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { platform } = await params;
  const cov = getPlatformCoverage(platform);
  if (!cov) return {};

  return buildMetadata({
    seo: {
      title: `${cov.name} Contractors · ${cov.moduleCount} modules | Yallo Talent`,
      description: `${cov.roleCount} ${cov.name} contractor roles across ${cov.moduleCount} modules. Specialist-screened for implementation depth, shortlisted in 72 hours. Middle East · Europe · India.`,
    },
    path: `/platforms/${platform}`,
  });
}

export default async function PlatformPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { platform } = await params;
  const cov = getPlatformCoverage(platform);
  if (!cov) notFound();

  const axis = platformAxis.find((p) => p.slug === platform);

  return (
    <>
      {/* Hero. Dark because a platform page is a data surface. */}
      <section className={`${styles.section} band-dark`}>
        <div className={styles.wrap}>
          <p className="eyebrow">Platform depth · {cov.name}</p>
          <h1 className={styles.heroHeadline}>
            {cov.name} specialists, <em>by module.</em>
          </h1>
          <p className={styles.heroLede}>
            {cov.roleCount} contractor roles across {cov.moduleCount} {cov.name}{" "}
            modules. Most firms in this market treat enterprise platforms as one
            line in a profession list. This is what the depth actually looks
            like.
          </p>

          {/* The four-point why rail: the wedge, the screen, the terms, the
              speed. Three figures are derived from this platform's own
              coverage; the fourth is a canon §6 metric. Nothing unsourced. */}
          <WhyRail points={whyPoints(cov)} />

          <div className={styles.ctaRow}>
            <Link className={styles.btnPrimary} href="/brief">
              Start a brief
              <ArrowGlyph />
            </Link>
            <Link className={styles.btnSecondary} href="/platforms">
              All platforms
            </Link>
          </div>
        </div>
      </section>

      {/* Module coverage — the substance of the page. */}
      <section className={`${styles.section} ${styles.g1}`} id="modules">
        <div className={styles.wrap}>
          <SectionHead
            eyebrow="Module coverage"
            heading={`Every ${cov.name} module we staff, and who we put in it.`}
            lede="Each module lists the contractor roles we place into it, and the function pages where that work sits."
            id="modules-heading"
          />

          <div className={styles.commitment}>
            {cov.modules.map((mod) => (
              <article key={mod.name} className={styles.vow}>
                <span className={styles.panelPetal} aria-hidden="true" />
                {axis ? (
                  <span className={styles.caseLogo} aria-hidden="true">
                    <LogoImage src={axis.mark} width={96} height={24} />
                  </span>
                ) : null}
                <h3>{mod.name}</h3>
                {/* The scope line: what Yallo places on this module, never what
                    the module does. Only authored modules carry one; derived
                    modules render the roles alone rather than a written-for-them
                    sentence. */}
                {mod.scope ? (
                  <p className={styles.vowScope}>{mod.scope}</p>
                ) : null}
                <ul className={styles.roleChips}>
                  {mod.roles.map((r) => (
                    <li key={r} className="role-pill">
                      {r}
                    </li>
                  ))}
                </ul>
                <p className={styles.vowFoot}>
                  {mod.appearsIn.slice(0, 3).map((a) => (
                    <Link
                      key={`${a.sectorSlug}-${a.fnSlug}`}
                      className={styles.btnSecondary}
                      href={`/industries/${a.sectorSlug}/${a.fnSlug}`}
                    >
                      {a.fnTitle}
                      <ArrowGlyph />
                    </Link>
                  ))}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Where we place it. */}
      <section className={`${styles.section} ${styles.g2}`}>
        <div className={styles.wrap}>
          <SectionHead
            eyebrow="Where we place"
            heading={`Sectors running ${cov.name} programmes.`}
            lede="Platform depth is only useful with the sector context to apply it."
          />
          <ul className={styles.logos}>
            {cov.sectors.map((s) => (
              <li key={s.slug}>
                <Link
                  className={styles.btnSecondary}
                  href={`/industries/${s.slug}`}
                >
                  {s.label}
                  <ArrowGlyph />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
