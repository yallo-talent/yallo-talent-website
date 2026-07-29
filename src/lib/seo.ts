import type { Metadata } from "next";
import type { SEOMeta } from "@/types";

const PRODUCTION_URL = "https://yallo.co";

export const SITE = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? PRODUCTION_URL,
  name: "Yallo Talent",
  brand: "Yallo",
  locales: ["en-GB", "en-AE"] as const,
  defaultOgImage: "/images/og-default.jpg",
} as const;

export const isProductionHost = SITE.url === PRODUCTION_URL;

interface BuildMetadataInput {
  seo: SEOMeta;
  path: string;
}

export function buildMetadata({ seo, path }: BuildMetadataInput): Metadata {
  const url = `${SITE.url}${path}`;
  const image = seo.ogImage ?? SITE.defaultOgImage;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    metadataBase: new URL(SITE.url),
    alternates: {
      canonical: seo.canonical ?? url,
      languages: {
        "en-GB": url,
        "en-AE": url,
      },
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url,
      siteName: SITE.name,
      images: [{ url: image, width: 1200, height: 630, alt: seo.title }],
      locale: "en_GB",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [image],
    },
    robots: isProductionHost
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        }
      : {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        },
  };
}
