import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "@/components/blocks/home/Home.module.css";
import { ArrowGlyph } from "@/components/blocks/home/icons";
import { SectionHead } from "@/components/blocks/home/SectionHead";
import l1 from "@/components/blocks/l1/L1PageShell.module.css";
import { L1SubNav } from "@/components/blocks/l1/L1SubNav";
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

  /* Modules grouped by the vendor's current application family.

     The ORDER is declared, not discovered. Bucketing in first-encountered order
     put Data & platform third and Autonomous HCM last, because that is where
     Analytics Cloud and SuccessFactors happen to sit in the authored list — an
     accident of our file, presented as SAP's structure. This is the order
     docs/design/sap-ia-round-3.md records: the core, the five autonomous
     families, then the layers underneath them.

     A platform whose modules carry no family — every vendor but SAP today —
     collapses to a single unnamed group and renders exactly as before. */
  const FAMILY_ORDER = [
    "Core ERP",
    "Autonomous Finance",
    "Autonomous Spend",
    "Autonomous Supply Chain",
    "Autonomous HCM",
    "Autonomous CX",
    "Data & platform",
  ];
  const moduleFamilies: Array<{ name?: string; modules: typeof cov.modules }> =
    [];
  for (const mod of cov.modules) {
    const name = mod.family;
    const bucket = moduleFamilies.find((f) => f.name === name);
    if (bucket) bucket.modules.push(mod);
    else moduleFamilies.push({ name, modules: [mod] });
  }
  moduleFamilies.sort((a, b) => {
    const ai = a.name ? FAMILY_ORDER.indexOf(a.name) : -1;
    const bi = b.name ? FAMILY_ORDER.indexOf(b.name) : -1;
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  /* Families SAP publishes that we do not staff. Named because they are part of
     the suite a buyer is looking at; empty because we have no roles for them and
     R16 forbids a heading asserting what no row satisfies. */
  const plannedFamilies =
    cov.slug === "sap"
      ? [
          {
            name: "SAP Business AI",
            note: "SAP ships Joule and the SAP Business AI Platform across the suite. We do not staff a SAP AI desk yet, so there is nothing here to claim.",
          },
        ]
      : [];

  /* The sticky section bar retail has had all along, from the SAME component.
     Families become sections, so the bar indexes the suite rather than the page
     furniture. */
  const subNavItems = [
    ...(cov.roles.length > 0 ? [{ id: "roles", label: "The bench" }] : []),
    { id: "sectors", label: "Where we place" },
    ...moduleFamilies
      .filter((f) => f.name)
      .map((f) => ({
        id: `family-${slugify(f.name as string)}`,
        label: f.name as string,
      })),
    ...plannedFamilies.map((f) => ({
      id: `family-${slugify(f.name)}`,
      label: f.name,
    })),
  ];

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

      {/* Retail's sticky section bar, the SAME component rather than a copy of
          it. The platform L1 never had one because L1SubNav was private to the
          L1 shell and this template is bespoke on Home.module.css — so every
          sector and capability page indexed itself and the suite pages, which
          are the longest of the three, did not. */}
      {subNavItems.length > 1 ? (
        <div className={l1.subNavScope}>
          <L1SubNav items={subNavItems} />
        </div>
      ) : null}

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
      {/* SAP IA round 3: the suite is presented by the vendor's CURRENT
          application family, not as a flat product list. Grouping only — the 14
          modules and every role beneath them are unchanged. A platform whose
          modules carry no family (every vendor but SAP today) falls through to
          one unnamed group and renders exactly as before.
          docs/design/sap-ia-round-3.md */}
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

          {moduleFamilies.map((fam) => (
            <div key={fam.name ?? "_"} className={styles.familyBlock}>
              {fam.name ? (
                <h3
                  className={styles.familyHeading}
                  id={`family-${slugify(fam.name)}`}
                >
                  {fam.name}
                  <span className={styles.familyCount}>
                    {fam.modules.length}{" "}
                    {fam.modules.length === 1 ? "module" : "modules"}
                  </span>
                </h3>
              ) : null}
              <div className={styles.commitment}>
                {fam.modules.map((mod) => (
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
          ))}

          {/* SAP Business AI — represented, and honestly empty.
              The brief requires the AI layer to appear, and it is a fact about
              SAP's portfolio that it exists. It is NOT a fact that we staff it:
              the data layer's 93 distinct SAP roles contain no Joule, SAP
              Business AI, AI Core or AI Foundation role, and the AI-titled roles
              we hold are Azure and Databricks. Putting those under a SAP AI
              heading is exactly the false attribution R16 forbids, so the family
              ships with no rows and says so, using the same Desk-in-build
              convention the nav already uses. Parked for Sumeet in
              docs/design/sap-ia-round-3.md. */}
          {plannedFamilies.map((fam) => (
            <div key={fam.name} className={styles.familyBlock}>
              <h3
                className={styles.familyHeading}
                id={`family-${slugify(fam.name)}`}
              >
                {fam.name}
                <span className={styles.familyPlanned}>Desk in build</span>
              </h3>
              <p className={styles.familyPlannedCopy}>{fam.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* THE BENCH, from the join and nothing else.

          The L1 was three sections against retail's ten, and the middle one was
          a 4,671px wall of module cards. What it never showed is the thing a
          buyer actually asks for: the roles. They already exist — cov.roles is
          every distinct role across every module, de-duplicated by the derive
          layer — so this is R6's principle again, depth by joining data already
          held rather than by authoring a new page.

          R16 governs the heading. It says "every role we place across SAP", and
          that is exactly what the list is: no filtering, no selection, no claim
          about seniority, volume or availability that the data cannot carry. */}
      {cov.roles.length > 0 ? (
        <section
          className={`${styles.section} ${styles.g1} amb-wash amb-3`}
          id="roles"
        >
          <div className={styles.wrap}>
            <SectionHead
              eyebrow="The bench"
              heading={`Every role we place across ${cov.name}.`}
              lede={`${cov.roleCount} distinct roles across ${cov.moduleCount} modules. Send the brief and the specialist is in your inbox in 72 hours.`}
              id="roles-heading"
            />
            <ul className={styles.roleIndex}>
              {cov.roles.map((role) => (
                <li key={role} className={styles.roleIndexItem}>
                  {role}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* Where we place it. */}
      <section
        className={`${styles.section} ${styles.g2} amb-wash amb-4`}
        id="sectors"
      >
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
