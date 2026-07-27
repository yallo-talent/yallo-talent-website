import type { MetadataRoute } from "next";
import { getAllCapabilities, getAllPlatforms, getAllSectors } from "@/lib/data";
import { SITE } from "@/lib/seo";

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

  const sectorRoutes = getAllSectors().flatMap((sector) => {
    const base = `${SITE.url}/industries/${sector.slug}`;
    return [
      {
        url: base,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      },
      ...sector.functions.map((fn) => ({
        url: `${base}/${fn.slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ];
  });

  const platformRoutes = getAllPlatforms().flatMap((platform) => {
    const base = `${SITE.url}/platforms/${platform.slug}`;
    return [
      {
        url: base,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      },
      ...platform.modules.map((mod) => ({
        url: `${base}/${mod.slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ];
  });

  const capabilityRoutes = getAllCapabilities().flatMap((cap) => {
    const base = `${SITE.url}/capabilities/${cap.slug}`;
    return [
      {
        url: base,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      },
      ...cap.subs.map((sub) => ({
        url: `${base}/${sub.slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ];
  });

  return [
    ...staticRoutes,
    ...sectorRoutes,
    ...platformRoutes,
    ...capabilityRoutes,
  ];
}
