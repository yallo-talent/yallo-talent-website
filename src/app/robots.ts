import type { MetadataRoute } from "next";
import families from "@/lib/crawler-families.json";
import { isProductionHost, SITE } from "@/lib/seo";

/**
 * The three-family crawler policy, environment-driven.
 *
 * Production allows Search, Agent and Training by name. Every other host — the
 * talent.yallo.co placeholder, previews, local — disallows all of them, also by
 * name, alongside the `*` catch-all.
 *
 * WHY NAME THEM WHEN `*` ALREADY COVERS IT. Two reasons, neither decorative. A
 * crawler that reads only its own token honours a named rule and may not honour
 * the wildcard, so the placeholder's noindex posture is weaker without them.
 * And on the allow side the policy has to be READABLE: permitting Training is a
 * deliberate decision, taken because from 15 September 2026 Cloudflare
 * evaluates multi-purpose crawlers under all of their behaviours, so a Training
 * block takes Googlebot with it. A bare `Allow: /` records none of that and
 * cannot be checked against the zone.
 *
 * The list lives in src/lib/crawler-families.json because
 * scripts/check-crawler-access.mjs measures the same set. robots.txt is a
 * request; the Cloudflare zone is the enforcement, which is why the probe
 * exists alongside this file.
 */

const CRAWLERS = families.crawlers as ReadonlyArray<{
  token: string;
  category: string;
}>;

export default function robots(): MetadataRoute.Robots {
  if (!isProductionHost) {
    return {
      rules: [
        { userAgent: "*", disallow: "/" },
        ...CRAWLERS.map((c) => ({ userAgent: c.token, disallow: "/" })),
      ],
    };
  }

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/users/"] },
      ...CRAWLERS.map((c) => ({
        userAgent: c.token,
        allow: "/",
        disallow: ["/api/", "/users/"],
      })),
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
