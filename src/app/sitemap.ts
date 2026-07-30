import type { MetadataRoute } from "next";
import { publishedTaxonomySlugs } from "@/app/insights/_taxonomy";
import { capabilityRegistry } from "@/data/capabilities";
import { industriesIndex } from "@/data/l1";
import { retailData } from "@/data/l1/retail";
import type { L1PageData } from "@/data/l1/types";
import { publishedPlatformSlugs } from "@/data/platforms/derive";
import {
  getAllCaseStudySlugs,
  getAllInsightSlugs,
  getInsight,
} from "@/lib/content";
import { SITE } from "@/lib/seo";

const sectorL2Registry: Record<string, L1PageData> = {
  retail: retailData,
};

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    "",
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
    "/case-studies",
    "/jobs",
    "/privacy",
    "/terms",
    "/cookies",
  ].map((path) => ({
    url: `${SITE.url}${path || "/"}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const industryRoutes = industriesIndex.map((entry) => ({
    url: `${SITE.url}/industries/${entry.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const industryL2Routes = Object.entries(sectorL2Registry).flatMap(
    ([sectorSlug, data]) =>
      data.expertise
        .filter((fn) => fn.tools && fn.tools.length > 0)
        .map((fn) => ({
          url: `${SITE.url}/industries/${sectorSlug}/${fn.slug}`,
          lastModified: now,
          changeFrequency: "monthly" as const,
          priority: 0.6,
        })),
  );

  // Only platforms with real module coverage have a page, so only those are
  // listed — the sitemap must match the generated route set exactly.
  const platformRoutes = publishedPlatformSlugs().map((slug) => ({
    url: `${SITE.url}/platforms/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const capabilityRoutes = Object.keys(capabilityRegistry).map((slug) => ({
    url: `${SITE.url}/capabilities/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const insightRoutes = getAllInsightSlugs()
    .filter((slug) => {
      try {
        return getInsight(slug).frontmatter.published !== false;
      } catch {
        return false;
      }
    })
    .map((slug) => ({
      url: `${SITE.url}/insights/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  const caseStudyRoutes = getAllCaseStudySlugs().map((slug) => ({
    url: `${SITE.url}/case-studies/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const taxonomyRoutes = (
    ["industry", "platform", "discipline"] as const
  ).flatMap((kind) =>
    publishedTaxonomySlugs(kind).map((slug) => ({
      url: `${SITE.url}/insights/${kind}/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
  );

  return [
    ...staticRoutes,
    ...industryRoutes,
    ...industryL2Routes,
    ...platformRoutes,
    ...capabilityRoutes,
    ...insightRoutes,
    ...caseStudyRoutes,
    ...taxonomyRoutes,
  ];
}
