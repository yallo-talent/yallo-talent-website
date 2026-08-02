import type { Metadata } from "next";
import { BriefCTA } from "@/components/blocks/BriefCTA";
import type { FilterableCard } from "@/components/blocks/case-study/CaseStudyFilters";
import { CaseStudyFilters } from "@/components/blocks/case-study/CaseStudyFilters";
import styles from "@/components/blocks/case-study/CaseStudyLanding.module.css";
import {
  findClientMark,
  hasLogoAsset,
} from "@/components/blocks/case-study/client-lookup";
import { interimOrderedCaseStudies } from "@/components/blocks/case-study/interim-order";
import {
  pillarChip,
  pillarFilterOptions,
  platformChip,
  platformFilterOptions,
  sectorChip,
  sectorFilterOptions,
} from "@/components/blocks/case-study/taxonomy";
import { getAllCaseStudies } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  seo: {
    title: "Case Studies · Yallo Talent",
    description:
      "Named clients, named platforms, published work: how enterprise teams across the Middle East and Europe have closed their talent gaps with Yallo.",
  },
  path: "/case-studies",
});

export default function CaseStudiesHub() {
  const all = getAllCaseStudies();
  const ordered = interimOrderedCaseStudies(all);
  const frontmatters = all.map((e) => e.frontmatter);

  const cards: FilterableCard[] = ordered.map(({ frontmatter: fm }) => {
    const match = fm.clientPublic ? findClientMark(fm.client) : undefined;
    const clientLabel = fm.clientPublic
      ? (match?.name ?? fm.client)
      : `${fm.region} · ${fm.platform}`;
    const showLogo = match?.logo && hasLogoAsset(match.logo);
    const pillar = pillarChip(fm.engagement);
    const platform = platformChip(fm.platform);
    const sector = sectorChip(fm.industry);

    return {
      slug: fm.slug,
      title: fm.cardTitle ?? fm.title,
      summary: fm.excerpt ?? fm.summary,
      clientLabel,
      clientLogo: showLogo ? match?.logo : undefined,
      meta: [pillar?.label, fm.region].filter(Boolean).join(" · "),
      pillar: pillar?.label,
      platformHref: platform?.href,
      sectorHref: sector?.href,
    };
  });

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>Case studies</span>
          <h1 className={styles.h1}>Programmes like yours, shipped on time.</h1>
          <p className={styles.lede}>
            Named clients, named platforms, published work: enterprise teams
            across the Middle East and Europe who have closed their talent gaps
            with Yallo.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.wrap}>
          <CaseStudyFilters
            cards={cards}
            pillarOptions={pillarFilterOptions(frontmatters)}
            platformOptions={platformFilterOptions(frontmatters)}
            sectorOptions={sectorFilterOptions(frontmatters)}
          />
        </div>
      </section>

      <BriefCTA />
    </div>
  );
}
