import type { NextConfig } from "next";

// -----------------------------------------------------------------------------
// LEGACY REDIRECTS
// -----------------------------------------------------------------------------
// yallo.co (WordPress) served insights at three nested prefixes:
//   /insights/news/*, /insights/industries/retail/*, /insights/category/*
// Every article on the new site lives at /insights/{slug}; catch-all redirects
// below map any legacy prefix to the flat form. Where a specific slug does not
// have a matching MDX (merged, renamed or retired), an explicit entry above the
// catch-all takes precedence.

const RETIRED_TO_RETAIL = [
  "septembers-biggest-shifts",
  "from-store-closures-to-ai-led-innovation-august",
  "global-retail-pulse-july-2025-highlights",
  "mid-year-momentum-shaping-the-future-of-ratail-tech",
  "17-big-moves-redefining-global-mena-ecommerce-may",
  "middle-east-retail-boom-2025-trends",
];

const RENAMED: Array<{ from: string; to: string }> = [
  // Merge (2a): both variants collapse into enterprise-architect-middle-east.
  {
    from: "enterprise-architect-uae-hiring",
    to: "enterprise-architect-middle-east",
  },
  {
    from: "enterprise-architect-uae-hiring-challenges",
    to: "enterprise-architect-middle-east",
  },
  // Merge (2b): duplicate title with critical-technology-roles-uae-vacancy-cost.
  {
    from: "gcc-engineering-team-scaling",
    to: "critical-technology-roles-uae-vacancy-cost",
  },
  // Slug renames: GCC -> Middle East.
  {
    from: "gcc-it-hiring-trends-2026-cio-guide",
    to: "middle-east-it-hiring-trends-2026",
  },
  {
    from: "me-india-blended-it-teams-gcc-delivery",
    to: "me-india-blended-delivery-teams",
  },
  // Legacy WordPress slug for the same article on the new tree.
  {
    from: "contract-hiring",
    to: "the-best-way-to-use-contract-hiring-during-high-demand-enterprise-projects",
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    const specific: Array<{
      source: string;
      destination: string;
      permanent: boolean;
    }> = [];

    // Platform slug tidy-up (previous branch).
    specific.push({
      source: "/platforms/blueyonder",
      destination: "/platforms/blue-yonder",
      permanent: true,
    });

    // Retired retail commentary -> /industries/retail.
    for (const slug of RETIRED_TO_RETAIL) {
      specific.push({
        source: `/insights/${slug}`,
        destination: "/industries/retail",
        permanent: true,
      });
      specific.push({
        source: `/insights/news/${slug}`,
        destination: "/industries/retail",
        permanent: true,
      });
      specific.push({
        source: `/insights/industries/retail/${slug}`,
        destination: "/industries/retail",
        permanent: true,
      });
      specific.push({
        source: `/insights/category/${slug}`,
        destination: "/industries/retail",
        permanent: true,
      });
    }

    // Merged / renamed slugs -> canonical article URL.
    for (const { from, to } of RENAMED) {
      const destination = `/insights/${to}`;
      specific.push({
        source: `/insights/${from}`,
        destination,
        permanent: true,
      });
      specific.push({
        source: `/insights/news/${from}`,
        destination,
        permanent: true,
      });
      specific.push({
        source: `/insights/industries/retail/${from}`,
        destination,
        permanent: true,
      });
      specific.push({
        source: `/insights/category/${from}`,
        destination,
        permanent: true,
      });
    }

    // Catch-all: any surviving legacy prefix -> the flat /insights/{slug} URL.
    // Ordered after the specific list so slug-scoped rewrites always win first.
    const catchAll = [
      {
        source: "/insights/news/:slug",
        destination: "/insights/:slug",
        permanent: true,
      },
      {
        source: "/insights/industries/retail/:slug",
        destination: "/insights/:slug",
        permanent: true,
      },
      {
        source: "/insights/category/:slug",
        destination: "/insights/:slug",
        permanent: true,
      },
    ];

    return [...specific, ...catchAll];
  },
};

export default nextConfig;
