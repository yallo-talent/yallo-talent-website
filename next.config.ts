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

/**
 * Insights removed because they were not real: written in an earlier pass with
 * invented figures and an unauthorised byline. Retired to the hub rather than
 * rewritten, so no URL 404s.
 */
const INSIGHTS_WITHDRAWN = [
  "sap-talent-gcc",
  "gcc-ai-skills-gap",
  "gcc-engineering-centre-90-days",
  "sap-vs-oracle-migration",
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

// -----------------------------------------------------------------------------
// CASE STUDY REDIRECTS
// -----------------------------------------------------------------------------
// The legacy site served most case studies as `?case-study=<slug>` query
// strings, which cannot be redirected by path alone — the `has` clause below
// matches the query parameter and sends it to the canonical path.
//
// Of the 29 published entries, 15 are Yallo's own work and are ported. The rest
// fall into three groups, all redirected so no published URL breaks.

/** Duplicate or stale URLs -> the canonical study. */
const CASE_STUDY_ALIASES: Record<string, string> = {
  // Same MAF Hyperion engagement, published twice.
  "implementing-hyperion-financial-management-for-majid-al-futtaim-dubai-2":
    "oracle-hyperion-financial-management-hfm-implementation",
  // Same Alshaya planning engagement, published twice.
  "decommissioning-by-planning-licenses-with-custom-built-software-for-alshaya-group-dubai":
    "engineering-a-custom-planning-platform",
  // Earlier, shorter version of the MAF time-and-materials study. Its own
  // headings name MAF, so the "unnamed enterprise" framing was cosmetic.
  "reducing-costs-and-improving-quality-with-yallo":
    "reducing-time-and-materials-cost-for-majid-al-futtaim",
  // Listed in the index but 404s on the live site.
  "reducing-tm-cost-and-improving-quality-with-yallo-for-alshaya-group-dubai":
    "reducing-time-and-materials-cost-for-majid-al-futtaim",
  // Slug tidied for readability.
  "reducing-tm-cost-and-improving-quality-for-majid-al-futtaim-with-yallo":
    "reducing-time-and-materials-cost-for-majid-al-futtaim",
  "rapid-recruitment-for-critical-supply-chain-roles-with-yallo":
    "rapid-recruitment-for-critical-supply-chain-roles",
};

/**
 * Not Yallo's work: a GDPR and incident-response teaching series about
 * Facebook, Google, Uber, Maersk, Equifax, Capital One, Target and Sony. It has
 * no place in an evidence surface for enterprise staffing, so it is retired to
 * the insights hub rather than ported.
 */
const CASE_STUDY_RETIRED = [
  "privacy-violations-and-class-action-lawsuit-facebook-2018",
  "financial-penalties-for-non-compliance-google-2019",
  "data-leaks-and-customer-trust-erosion-uber-2016",
  "operational-meltdown-from-cyber-attack-maersk-2017",
  "mega-breach-with-eye-watering-costs-equifax-2017",
  "insider-data-theft-capital-one-2019",
  "target-2013-data-breach-enterprise-governance-lessons",
  "sony-data-breach-2014-cybersecurity-ip-lessons",
];

/** Every ported study, so the legacy query-string URL reaches it. */
const CASE_STUDY_PORTED = [
  "enabling-sap-s-4hana-transformation-for-al-tayer-group",
  "rapidly-building-a-high-performing-azure-data-engineering-team",
  "enabling-azure-data-platform-delivery-at-enterprise-scale",
  "enabling-supply-chain-transformation-through-targeted-delivery-expertise",
  "oracle-hyperion-financial-management-hfm-implementation",
  "building-a-scalable-arabic-speaking-offshore-it-hub-for-al-othaim-markets",
  "defining-a-target-operating-model-for-sephora-middle-easts-digital-carve-out",
  "ensuring-reliable-oracle-ebs-integrations-for-mission-critical-enterprise-systems",
  "engineering-a-custom-planning-platform",
  "optimising-enterprise-it-delivery-through-a-unified-partner-model",
  "unlocking-cost-efficiency-across-multi-platform-enterprise-it-landscape",
  "driving-consistent-it-delivery-across-a-complex-retail-technology-landscape",
  "enabling-accurate-asset-governance-through-oracle-fusion-fixed-assets",
];

/** Builds both the `?case-study=` and `/case-studies/<slug>/` forms. */
function caseStudyRedirects() {
  const out: Array<{
    source: string;
    destination: string;
    permanent: true;
    has?: Array<{ type: "query"; key: string; value: string }>;
  }> = [];

  /**
   * `alsoPath` adds the `/case-studies/<from>` form. It must stay off for a
   * ported slug, whose path IS the destination — adding it there produces a
   * self-redirect and the real page becomes unreachable.
   */
  const add = (from: string, to: string, alsoPath = true) => {
    out.push({
      source: "/",
      has: [{ type: "query", key: "case-study", value: from }],
      destination: to,
      permanent: true,
    });
    if (alsoPath) {
      out.push({
        source: `/case-studies/${from}`,
        destination: to,
        permanent: true,
      });
    }
  };

  for (const slug of CASE_STUDY_PORTED) {
    add(slug, `/case-studies/${slug}`, false);
  }
  for (const [from, to] of Object.entries(CASE_STUDY_ALIASES)) {
    add(from, `/case-studies/${to}`);
  }
  for (const slug of CASE_STUDY_RETIRED) add(slug, "/insights");

  return out;
}

// -----------------------------------------------------------------------------
// TAXONOMY REDIRECTS
// -----------------------------------------------------------------------------
// Canon §5 renames three disciplines, retires a fourth, and tidies one platform
// slug. Every old URL is a published one, so all of them 301.

/** Old capability slug -> new. `emerging-technologies` retires to /ai-talent. */
const CAPABILITY_MOVES: Record<string, string> = {
  "data-ai": "/capabilities/data-analytics",
  data: "/capabilities/data-analytics",
  "digital-devops": "/capabilities/devops-platform-engineering",
  digital: "/capabilities/devops-platform-engineering",
  cloud: "/capabilities/cloud-infrastructure",
  integration: "/capabilities/integration-middleware",
  // AI is a named specialism, not a discipline route.
  "emerging-technologies": "/ai-talent",
  innovation: "/ai-talent",
  /* AI Talent is the seventh discipline (canon §3 amendment, 1 Aug 2026) but its
     canonical URL stays /ai-talent: it is the campaign landing path and was
     already the redirect target above. Both capability-shaped forms 301 to it, so
     a link written either way lands on the page rather than a 404, and the
     discipline has exactly one indexable URL. */
  "ai-talent": "/ai-talent",
  "artificial-intelligence": "/ai-talent",
};

/**
 * ServiceNow and AWS leave the platform set (§5). ServiceNow remains a tool
 * Yallo staffs inside sector pages — that is real capability — but it is not a
 * platform destination, and AWS folds into cloud-infrastructure.
 */
const PLATFORM_MOVES: Record<string, string> = {
  blueyonder: "/platforms/blue-yonder",
  servicenow: "/platforms",
  aws: "/capabilities/cloud-infrastructure",
};

function taxonomyRedirects() {
  const out: Array<{ source: string; destination: string; permanent: true }> =
    [];
  for (const [from, to] of Object.entries(CAPABILITY_MOVES)) {
    out.push({
      source: `/capabilities/${from}`,
      destination: to,
      permanent: true,
    });
  }
  for (const [from, to] of Object.entries(PLATFORM_MOVES)) {
    out.push({
      source: `/platforms/${from}`,
      destination: to,
      permanent: true,
    });
  }
  return out;
}

const nextConfig: NextConfig = {
  async redirects() {
    const specific: Array<{
      source: string;
      destination: string;
      permanent: boolean;
    }> = [];

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

    // Withdrawn (not-real) insights -> the hub.
    for (const slug of INSIGHTS_WITHDRAWN) {
      for (const prefix of [
        "/insights",
        "/insights/news",
        "/insights/industries/retail",
        "/insights/category",
      ]) {
        specific.push({
          source: `${prefix}/${slug}`,
          destination: "/insights",
          permanent: true,
        });
      }
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

    return [
      ...specific,
      ...taxonomyRedirects(),
      ...caseStudyRedirects(),
      ...catchAll,
    ];
  },
};

export default nextConfig;
