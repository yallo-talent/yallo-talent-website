import type { MetadataRoute } from "next";
import { BLUEPRINT_BASE } from "@/data/blueprint";
import { publishedPaths } from "@/lib/published-routes";
import { SITE } from "@/lib/seo";

/**
 * Priority and change frequency by route shape. publishedPaths() is the one
 * enumeration; this only decides how each shape is weighted, so the two
 * concerns — which routes exist, and how a sitemap should rank them — cannot
 * drift against each other the way two separate route lists would.
 */
const TAXONOMY_KINDS = new Set(["industry", "platform", "discipline"]);

function weightOf(path: string): {
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
} {
  if (path === "/") return { changeFrequency: "weekly", priority: 1 };

  const segs = path.split("/").filter(Boolean);

  // /insights/{industry|platform|discipline}/{slug}
  if (
    segs.length === 3 &&
    segs[0] === "insights" &&
    TAXONOMY_KINDS.has(segs[1] ?? "")
  ) {
    return { changeFrequency: "weekly", priority: 0.5 };
  }
  // /industries/{sector}/{fn}, /platforms/{platform}/{module}
  if (
    segs.length === 3 &&
    (segs[0] === "industries" || segs[0] === "platforms")
  ) {
    return { changeFrequency: "monthly", priority: 0.6 };
  }
  // The blueprint archetype pages, one level under BLUEPRINT_BASE.
  if (path.startsWith(`${BLUEPRINT_BASE}/`)) {
    return { changeFrequency: "monthly", priority: 0.7 };
  }
  if (path === BLUEPRINT_BASE) {
    return { changeFrequency: "monthly", priority: 0.8 };
  }
  // /insights/{slug}, /case-studies/{slug}
  if (
    segs.length === 2 &&
    (segs[0] === "insights" || segs[0] === "case-studies")
  ) {
    return { changeFrequency: "monthly", priority: 0.6 };
  }
  // /platforms/{slug}
  if (segs.length === 2 && segs[0] === "platforms") {
    return { changeFrequency: "monthly", priority: 0.8 };
  }
  // /industries/{slug}, /ai-talent/{slug}, /capabilities/{slug}
  if (
    segs.length === 2 &&
    (segs[0] === "industries" ||
      segs[0] === "ai-talent" ||
      segs[0] === "capabilities")
  ) {
    return { changeFrequency: "monthly", priority: 0.7 };
  }
  // Every top-level static route.
  return { changeFrequency: "weekly", priority: 0.8 };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return publishedPaths().map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified: now,
    ...weightOf(path),
  }));
}
