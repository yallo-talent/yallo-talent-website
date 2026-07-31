import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "@/components/blocks/home/Home.module.css";
import { ArrowGlyph } from "@/components/blocks/home/icons";
import { SectionHead } from "@/components/blocks/home/SectionHead";
import { WhyRail } from "@/components/blocks/platform/WhyRail";
import { HeroAtmosphere } from "@/components/ui/HeroAtmosphere";
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

/* Every card needs an anchor, including the derived modules that carry no
   `slug` — that field marks the ones with an L2 page, which is a different
   question from having a place on this page. */
function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default async function PlatformPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { platform } = await params;
  const cov = getPlatformCoverage(platform);
  if (!cov) notFound();

  return (
    /* R4: the platform's identity hue, declared once at the root. Every .amb-N
       inside now resolves to it, so the hero field and section washes are
       recognisably this suite's while gold stays the only interactive colour. */
    /* `amb-1` alongside data-identity, and without it the whole R4 chain is
       inert on this page. --id resolved correctly from the slug, but --amb is
       assigned by the `[data-identity].amb-N` rule, so with no position class
       nothing ever read --id and --amb computed to the empty string. Measured:
       SAP returned `--amb: ""` while retail returned its plum, which made my first
       "SAP is distinct from Retail" reading plum-against-nothing rather than
       indigo-against-plum. */
    <div data-identity={cov.slug} className="amb-1">
      {/* Hero. Dark because a platform page is a data surface — and now carrying
          the shared atmospheric field (B3), which was the one hero the rollout
          missed. `.amb-1` is what lets R4's identity hue reach it: with
          data-identity on the root, position one resolves to the suite's hue
          instead of the generic first ambient. */}
      <section
        className={`${styles.section} ${styles.platformHero} band-dark amb-wash amb-1`}
      >
        <HeroAtmosphere seed={cov.slug} />
        <div className={`${styles.wrap} ${styles.platformHeroInner}`}>
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

      {/* Module coverage — the substance of the page.
          The lede no longer promises function-page links. That clause was
          measured false 16 times out of 17: the suite-level rebuild moved the
          module names away from the sector tool names the appearsIn join matches
          on, and only SAP Customer Experience still collides. A conservative
          normalised match was tested and joins exactly the same one — the suite
          modules are genuinely different products from the retail-seeded sector
          tools, so the join is not broken, the connection does not exist.
          Inventing cross-links would be worse than having none, so the promise
          goes rather than the data being stretched to meet it. The module pages
          carry sector links wherever they do exist. */}
      <section
        className={`${styles.section} ${styles.g1} amb-wash amb-2`}
        id="modules"
      >
        <div className={styles.wrap}>
          <SectionHead
            eyebrow="Module coverage"
            heading={`Every ${cov.name} module we staff, and who we put in it.`}
            lede="Send the brief and the specialist is in your inbox in 72 hours."
            id="modules-heading"
          />

          {/* A compact index of the set, and on mobile it is the difference
              between a list and a wall. Measured: 17 stacked cards run 6,862px
              at 390 — 85% of the page, about 4.6 viewports of near-identical
              composition — with no index, no filter and no jump list. The page
              title promises seventeen modules and nothing enumerated them
              compactly, so the only way to learn the set's shape was to scroll
              all of it.

              Anchors rather than a scroller: every card already has a stable
              id, so this needs no new state, works with JS off, and costs one
              tab stop per module instead of the eighteen a control would add.
              It renders only when the set is big enough to need it. */}
          {cov.modules.length > 8 ? (
            <nav
              className={styles.moduleIndex}
              aria-label={`${cov.name} modules`}
            >
              {cov.modules.map((mod) => (
                <a
                  key={mod.name}
                  href={`#module-${slugify(mod.name)}`}
                  className={styles.moduleIndexLink}
                >
                  {mod.name}
                </a>
              ))}
            </nav>
          ) : null}

          <div className={styles.commitment}>
            {cov.modules.map((mod) => (
              <article
                key={mod.name}
                id={`module-${slugify(mod.name)}`}
                className={styles.vow}
              >
                {/* No vendor mark and no petal fill on these cards.
                    The mark was 17 identical full-colour logos, aria-hidden and
                    carrying no information on a page that IS that vendor — and
                    canon §5's One Marker Rule says gold is the only colour used
                    decoratively anywhere. The petal fill was 17 gold quarter
                    discs pinned top-right while each card's own radius is
                    bottom-left, two competing corner signals per card; DESIGN.md
                    already retired that fill from a SIX-tile grid for working
                    against the same rule. */}
                {/* The drill-down. `slug` is present only on AUTHORED modules,
                    which is exactly the set generateStaticParams builds — so a
                    title links when there is a page behind it and stays plain
                    text when there is not, rather than every card promising
                    depth and two thirds 404ing. */}
                <h3>
                  {mod.slug ? (
                    <Link
                      href={`/platforms/${cov.slug}/${mod.slug}`}
                      className={styles.moduleLink}
                    >
                      {mod.name}
                      <ArrowGlyph />
                    </Link>
                  ) : (
                    mod.name
                  )}
                </h3>
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
                {/* Rendered only when there ARE sector links. Removing the
                    vendor mark left this slot bottom-anchored and EMPTY on 16 of
                    17 cards — measured 607px of dead space across the grid, 150px
                    on one card, and the single card that did carry a link read as
                    an unexplained inconsistency rather than as honest data. */}
                {mod.appearsIn.length > 0 ? (
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
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Where we place it. */}
      <section className={`${styles.section} ${styles.g2} amb-wash amb-4`}>
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
    </div>
  );
}
