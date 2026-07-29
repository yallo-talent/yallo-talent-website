import type { MetadataRoute } from "next";
import { isProductionHost, SITE } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  if (!isProductionHost) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/users/"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
