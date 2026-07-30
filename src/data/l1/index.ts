/**
 * Static index of L1 pages for the three hub pages (/industries,
 * /platforms, /capabilities). Kept as a lightweight registry
 * — the actual L1PageData lives in each page's data file.
 */

/**
 * A taxonomy label — the display name of a sector, platform or capability
 * ("Retail & Consumer", "Retail").
 *
 * Branded on purpose. `L1PageData.title` holds the first line of the page's H1
 * ("Retail tech contractors,") and it was being consumed as a taxonomy label in
 * seven places, so every L2 breadcrumb, sidebar, back link and `<title>` read
 * "Retail tech contractors," — trailing comma included. The brand means a hero
 * string can no longer be passed where a label is expected: only this module
 * mints TaxonomyLabel values, and it mints them from `label`/`short`.
 */
declare const taxonomyLabelBrand: unique symbol;
export type TaxonomyLabel = string & { readonly [taxonomyLabelBrand]: true };

export interface L1IndexEntry {
  slug: string;
  label: TaxonomyLabel;
  short: TaxonomyLabel;
  category: "industries" | "platforms" | "capabilities";
  tagline: string;
}

export const industriesIndex: L1IndexEntry[] = [
  {
    slug: "retail",
    label: "Retail & Consumer" as TaxonomyLabel,
    short: "Retail" as TaxonomyLabel,
    category: "industries",
    tagline: "Commerce, POS and supply-chain talent for retail programmes.",
  },
  {
    slug: "finance",
    label: "Banking & Financial Services" as TaxonomyLabel,
    short: "Banking" as TaxonomyLabel,
    category: "industries",
    tagline: "Core banking, payments, risk and cloud platform specialists.",
  },
  {
    slug: "government",
    label: "Government & Public Sector" as TaxonomyLabel,
    short: "Government" as TaxonomyLabel,
    category: "industries",
    tagline: "Digital government, smart-services and citizen-facing platforms.",
  },
  {
    slug: "manufacturing",
    label: "Manufacturing & Logistics" as TaxonomyLabel,
    short: "Manufacturing" as TaxonomyLabel,
    category: "industries",
    tagline: "ERP, Industry 4.0 and warehouse/transport specialists.",
  },
  {
    slug: "healthcare",
    label: "Healthcare & Life Sciences" as TaxonomyLabel,
    short: "Healthcare" as TaxonomyLabel,
    category: "industries",
    tagline: "Clinical systems, regulated data and compliance-grade delivery.",
  },
  {
    slug: "telco",
    label: "Telco & Media" as TaxonomyLabel,
    short: "Telco" as TaxonomyLabel,
    category: "industries",
    tagline: "OSS/BSS, network and data engineering for telco transformation.",
  },
];

export const platformsIndex: L1IndexEntry[] = [
  {
    slug: "sap",
    label: "SAP" as TaxonomyLabel,
    short: "SAP" as TaxonomyLabel,
    category: "platforms",
    tagline: "S/4HANA, FICO, MM, SD and integration specialists.",
  },
  {
    slug: "oracle",
    label: "Oracle" as TaxonomyLabel,
    short: "Oracle" as TaxonomyLabel,
    category: "platforms",
    tagline: "Fusion Cloud ERP/EPM/HCM/SCM and E-Business Suite specialists.",
  },
  {
    slug: "microsoft",
    label: "Microsoft" as TaxonomyLabel,
    short: "Microsoft" as TaxonomyLabel,
    category: "platforms",
    tagline: "Dynamics 365, Azure, Power Platform, M365 engineers.",
  },
  {
    slug: "salesforce",
    label: "Salesforce" as TaxonomyLabel,
    short: "Salesforce" as TaxonomyLabel,
    category: "platforms",
    tagline: "Sales, Service, Commerce, Marketing and integration talent.",
  },
  {
    slug: "blue-yonder",
    label: "Blue Yonder" as TaxonomyLabel,
    short: "Blue Yonder" as TaxonomyLabel,
    category: "platforms",
    tagline: "WMS, TMS, Luminate and demand-planning specialists.",
  },
  {
    slug: "workday",
    label: "Workday" as TaxonomyLabel,
    short: "Workday" as TaxonomyLabel,
    category: "platforms",
    tagline: "HCM, Payroll, Recruiting and Adaptive Planning specialists.",
  },
];

export const capabilitiesIndex: L1IndexEntry[] = [
  {
    slug: "data-analytics",
    label: "Data & Analytics" as TaxonomyLabel,
    short: "Data & AI" as TaxonomyLabel,
    category: "capabilities",
    tagline: "Data engineering, ML, GenAI and analytics platform specialists.",
  },
  {
    slug: "devops-platform-engineering",
    label: "DevOps & Platform Engineering" as TaxonomyLabel,
    short: "Digital & DevOps" as TaxonomyLabel,
    category: "capabilities",
    tagline: "SRE, platform engineering and continuous delivery talent.",
  },
  {
    slug: "cloud-infrastructure",
    label: "Cloud & Infrastructure" as TaxonomyLabel,
    short: "Cloud" as TaxonomyLabel,
    category: "capabilities",
    tagline: "AWS, Azure, GCP architects and platform engineers.",
  },
  {
    slug: "cybersecurity",
    label: "Cybersecurity" as TaxonomyLabel,
    short: "Security" as TaxonomyLabel,
    category: "capabilities",
    tagline: "Security architects, GRC and identity specialists.",
  },
  {
    slug: "integration-middleware",
    label: "Integration & Middleware" as TaxonomyLabel,
    short: "Integration" as TaxonomyLabel,
    category: "capabilities",
    tagline: "MuleSoft, Boomi, Kafka, API and iPaaS specialists.",
  },
  {
    slug: "testing-quality-engineering",
    label: "Testing & Quality Engineering" as TaxonomyLabel,
    short: "Emerging" as TaxonomyLabel,
    category: "capabilities",
    tagline: "Blockchain, IoT, digital twin and quantum-adjacent talent.",
  },
];

export const allL1: Record<string, L1IndexEntry[]> = {
  industries: industriesIndex,
  platforms: platformsIndex,
  capabilities: capabilitiesIndex,
};

/**
 * Resolves the display names for an L1 slug.
 *
 * Single source of truth: nothing duplicates these into the per-page data
 * files, so a sector cannot end up with two different display names.
 */
export function taxonomyLabels(slug: string): {
  label: TaxonomyLabel;
  short: TaxonomyLabel;
} {
  for (const group of Object.values(allL1)) {
    const hit = group.find((e) => e.slug === slug);
    if (hit) return { label: hit.label, short: hit.short };
  }
  // A slug with no index entry is a data error, not a runtime condition worth
  // papering over — but a hard throw would break the whole route tree, so fall
  // back to the slug itself rather than to hero copy.
  return {
    label: slug as TaxonomyLabel,
    short: slug as TaxonomyLabel,
  };
}
