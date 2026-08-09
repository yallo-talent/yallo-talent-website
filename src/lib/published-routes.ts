import { publishedTaxonomySlugs } from "@/app/insights/_taxonomy";
import { aiRoleFamilySlugs } from "@/data/ai-talent";
import { BLUEPRINT_BASE, blueprintSlugs } from "@/data/blueprint";
import { capabilityRegistry } from "@/data/capabilities";
import { industriesIndex } from "@/data/l1";
import { retailData } from "@/data/l1/retail";
import type { L1PageData } from "@/data/l1/types";
import {
  publishedModuleParams,
  publishedPlatformSlugs,
} from "@/data/platforms/derive";
import { RESEARCH_BASE, researchSlugs } from "@/data/research";
import { SYNTHESIS_SLUG } from "@/data/research/synthesis";
import { publishedArticles, publishedCaseStudies } from "@/lib/db/content";

const sectorL2Registry: Record<string, L1PageData> = {
  retail: retailData,
};

/**
 * Every published path, path-only, "/" for the homepage.
 *
 * Extracted from sitemap.ts rather than kept as sitemap.ts's own private
 * detail, because two more consumers now need the identical published-route
 * set: the OG image generator's build-time static params, and llms.txt. A
 * second hand-kept copy of this list is exactly the class of defect this
 * repository's own history already shows — the platform module L2s were
 * absent from the sitemap for as long as the template existed, because
 * listing a route was a separate step someone had to remember. One function,
 * so sitemap.ts, the OG route and llms.txt cannot enumerate different route
 * sets.
 */
export async function publishedPaths(): Promise<string[]> {
  /* ROUND 25: these three families come from the database, so the sitemap,
     llms.txt and the assistant corpus all change the moment a publish lands
     rather than at the next deploy. Published rows only — a draft has no URL,
     and listing one would put a 404 in the sitemap. The archives follow the
     articles: an archive is a view of published rows, so it appears when the
     rows do and disappears when they stop clearing the threshold. */
  const [articles, studies, taxonomies] = await Promise.all([
    publishedArticles(),
    publishedCaseStudies(),
    Promise.all(
      (["industry", "platform", "discipline"] as const).map(async (kind) => {
        const slugs = await publishedTaxonomySlugs(kind);
        return slugs.map((slug) => `/insights/${kind}/${slug}`);
      }),
    ),
  ]);
  return [
    ...structuralPaths(),
    ...articles.map((a) => `/insights/${a.slug}`),
    ...studies.map((c) => `/case-studies/${c.slug}`),
    ...taxonomies.flat(),
  ];
}

/**
 * Every published path the REPOSITORY owns — the whole estate except the two
 * content families that moved to the database under canon A1.
 *
 * WHY THE SPLIT EXISTS. It is synchronous and needs no connection string, so a
 * build can enumerate it: the OG card generator prerenders against this, and CI
 * builds this repository without a database. `publishedPaths()` is still the one
 * enumeration for the sitemap, llms.txt and the assistant corpus — this is its
 * first half, not a second list.
 */
export function structuralPaths(): string[] {
  const staticRoutes = [
    "/",
    "/brief",
    "/contract",
    "/permanent",
    "/eor",
    "/managed-delivery",
    "/industries",
    "/platforms",
    "/capabilities",
    "/about",
    "/why-yallo",
    "/leadership",
    "/insights",
    "/intelligence",
    "/ai-talent",
    "/case-studies",
    "/jobs",
    "/privacy",
    "/terms",
    "/cookies",
  ];

  const industryRoutes = industriesIndex.map(
    (entry) => `/industries/${entry.slug}`,
  );

  const industryL2Routes = Object.entries(sectorL2Registry).flatMap(
    ([sectorSlug, data]) =>
      data.expertise
        .filter((fn) => fn.tools && fn.tools.length > 0)
        .map((fn) => `/industries/${sectorSlug}/${fn.slug}`),
  );

  // Only platforms with real module coverage have a page, so only those are
  // listed — the published set must match the generated route set exactly.
  const platformRoutes = publishedPlatformSlugs().map(
    (slug) => `/platforms/${slug}`,
  );

  const platformModuleRoutes = publishedModuleParams().map(
    ({ platform, module }) => `/platforms/${platform}/${module}`,
  );

  const aiTalentRoutes = aiRoleFamilySlugs().map(
    (slug) => `/ai-talent/${slug}`,
  );

  const blueprintRoutes = [
    BLUEPRINT_BASE,
    ...blueprintSlugs().map((slug) => `${BLUEPRINT_BASE}/${slug}`),
  ];

  const capabilityRoutes = Object.keys(capabilityRegistry).map(
    (slug) => `/capabilities/${slug}`,
  );

  /* The five pieces, the index and the synthesis. The synthesis's PRINT
     surface is deliberately absent: it is the build input the PDF is
     generated from, not a page, and listing it here would put it in
     sitemap.xml, llms.txt, the OG generator and the assistant's corpus, all
     four of which derive from this one function. */
  const researchRoutes = [
    RESEARCH_BASE,
    `${RESEARCH_BASE}/${SYNTHESIS_SLUG}`,
    ...researchSlugs.map((slug) => `${RESEARCH_BASE}/${slug}`),
  ];

  return [
    ...staticRoutes,
    ...industryRoutes,
    ...industryL2Routes,
    ...platformRoutes,
    ...platformModuleRoutes,
    ...aiTalentRoutes,
    ...blueprintRoutes,
    ...capabilityRoutes,
    ...researchRoutes,
  ];
}
