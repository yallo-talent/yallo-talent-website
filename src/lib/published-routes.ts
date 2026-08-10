import {
  indexableTaxonomySlugs,
  taxonomyLandingSlugs,
} from "@/app/(site)/insights/_taxonomy";
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
import { TAXONOMY_SEGMENT, taxonomyLandingPath } from "@/lib/content-seo";
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
  /* ROUND 25: these two families come from the database, so the sitemap,
     llms.txt and the assistant corpus all change the moment a publish lands
     rather than at the next deploy. Published rows only — a draft has no URL,
     and listing one would put a 404 in the sitemap.

     ROUND 25c: the taxonomy landings moved OUT of here and into
     `structuralPaths`, because they no longer depend on what is published. All
     twenty-one exist whatever the database holds, which is what makes an
     internal link to one safe to write — publish rule 3 reads this set, and a
     route that came and went with the publishing state would have made that
     rule's answer depend on the week. Which of them a CRAWLER should be sent to
     is a different question, answered by `discoverablePaths`. */
  const [articles, studies] = await Promise.all([
    publishedArticles(),
    publishedCaseStudies(),
  ]);
  return [
    ...structuralPaths(),
    ...articles.map((a) => `/insights/${a.slug}`),
    ...studies.map((c) => `/case-studies/${c.slug}`),
  ];
}

/**
 * The paths the discovery surfaces name: `publishedPaths` minus the taxonomy
 * landings that have nothing published behind them.
 *
 * THE SPLIT IS BETWEEN "EXISTS" AND "WORTH CRAWLING", and conflating the two is
 * what the old three-article threshold did. A landing page with no article is a
 * real page a reader can reach from a desk link and a thin one to put in a
 * sitemap; it renders, it carries `noindex`, and it is absent from here. The
 * moment one article publishes it appears in both, with no deploy.
 */
export async function discoverablePaths(): Promise<string[]> {
  const [paths, indexable] = await Promise.all([
    publishedPaths(),
    Promise.all(
      (["industry", "platform", "discipline"] as const).map(async (kind) => {
        const slugs = await indexableTaxonomySlugs(kind);
        return slugs.map((slug) => taxonomyLandingPath(kind, slug));
      }),
    ),
  ]);
  const keep = new Set(indexable.flat());
  return paths.filter((path) => !isTaxonomyLanding(path) || keep.has(path));
}

const TAXONOMY_SEGMENTS = new Set(Object.values(TAXONOMY_SEGMENT));

function isTaxonomyLanding(path: string): boolean {
  const segs = path.split("/").filter(Boolean);
  return (
    segs.length === 3 &&
    segs[0] === "insights" &&
    TAXONOMY_SEGMENTS.has(segs[1] ?? "")
  );
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

  /* The twenty-one single-facet landings, canon A5. Repo-owned and synchronous:
     they are derived from the taxonomy indexes, not from what is published, so
     they belong here rather than in the database half. */
  const taxonomyLandingRoutes = (
    ["industry", "platform", "discipline"] as const
  ).flatMap((kind) =>
    taxonomyLandingSlugs(kind).map((slug) => taxonomyLandingPath(kind, slug)),
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
    ...taxonomyLandingRoutes,
    ...researchRoutes,
  ];
}
