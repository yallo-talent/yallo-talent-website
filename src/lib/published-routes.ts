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
import {
  getAllCaseStudySlugs,
  getAllInsightSlugs,
  getInsight,
} from "@/lib/content";

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
export function publishedPaths(): string[] {
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

  const insightRoutes = getAllInsightSlugs()
    .filter((slug) => {
      try {
        return getInsight(slug).frontmatter.published !== false;
      } catch {
        return false;
      }
    })
    .map((slug) => `/insights/${slug}`);

  const caseStudyRoutes = getAllCaseStudySlugs().map(
    (slug) => `/case-studies/${slug}`,
  );

  const taxonomyRoutes = (
    ["industry", "platform", "discipline"] as const
  ).flatMap((kind) =>
    publishedTaxonomySlugs(kind).map((slug) => `/insights/${kind}/${slug}`),
  );

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
    ...insightRoutes,
    ...caseStudyRoutes,
    ...taxonomyRoutes,
  ];
}
