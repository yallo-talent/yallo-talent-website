/**
 * Static index of L1 pages for the three hub pages (/industries,
 * /platforms, /capabilities). Kept as a lightweight registry
 * — the actual L1PageData lives in each page's data file.
 */

export interface L1IndexEntry {
  slug: string;
  label: string;
  short: string;
  category: "industries" | "platforms" | "capabilities";
  hue: "blue" | "green" | "orange" | "teal" | "violet" | "rose";
  tagline: string;
}

export const industriesIndex: L1IndexEntry[] = [
  {
    slug: "retail",
    label: "Retail & Consumer",
    short: "Retail",
    category: "industries",
    hue: "orange",
    tagline: "Commerce, POS and supply-chain talent for retail programmes.",
  },
  {
    slug: "finance",
    label: "Banking & Financial Services",
    short: "Banking",
    category: "industries",
    hue: "blue",
    tagline: "Core banking, payments, risk and cloud platform specialists.",
  },
  {
    slug: "government",
    label: "Government & Public Sector",
    short: "Government",
    category: "industries",
    hue: "green",
    tagline: "Digital government, smart-services and citizen-facing platforms.",
  },
  {
    slug: "manufacturing",
    label: "Manufacturing & Logistics",
    short: "Manufacturing",
    category: "industries",
    hue: "orange",
    tagline: "ERP, Industry 4.0 and warehouse/transport specialists.",
  },
  {
    slug: "healthcare",
    label: "Healthcare & Life Sciences",
    short: "Healthcare",
    category: "industries",
    hue: "teal",
    tagline: "Clinical systems, regulated data and compliance-grade delivery.",
  },
  {
    slug: "telco",
    label: "Telco & Media",
    short: "Telco",
    category: "industries",
    hue: "violet",
    tagline: "OSS/BSS, network and data engineering for telco transformation.",
  },
];

export const platformsIndex: L1IndexEntry[] = [
  {
    slug: "sap",
    label: "SAP",
    short: "SAP",
    category: "platforms",
    hue: "blue",
    tagline: "S/4HANA, FICO, MM, SD and integration specialists.",
  },
  {
    slug: "oracle",
    label: "Oracle",
    short: "Oracle",
    category: "platforms",
    hue: "rose",
    tagline: "Fusion Cloud ERP/EPM/HCM/SCM and E-Business Suite specialists.",
  },
  {
    slug: "microsoft",
    label: "Microsoft",
    short: "Microsoft",
    category: "platforms",
    hue: "blue",
    tagline: "Dynamics 365, Azure, Power Platform, M365 engineers.",
  },
  {
    slug: "salesforce",
    label: "Salesforce",
    short: "Salesforce",
    category: "platforms",
    hue: "teal",
    tagline: "Sales, Service, Commerce, Marketing and integration talent.",
  },
  {
    slug: "blue-yonder",
    label: "Blue Yonder",
    short: "Blue Yonder",
    category: "platforms",
    hue: "orange",
    tagline: "WMS, TMS, Luminate and demand-planning specialists.",
  },
  {
    slug: "workday",
    label: "Workday",
    short: "Workday",
    category: "platforms",
    hue: "violet",
    tagline: "HCM, Payroll, Recruiting and Adaptive Planning specialists.",
  },
];

export const capabilitiesIndex: L1IndexEntry[] = [
  {
    slug: "data-analytics",
    label: "Data & Analytics",
    short: "Data & AI",
    category: "capabilities",
    hue: "blue",
    tagline: "Data engineering, ML, GenAI and analytics platform specialists.",
  },
  {
    slug: "devops-platform-engineering",
    label: "DevOps & Platform Engineering",
    short: "Digital & DevOps",
    category: "capabilities",
    hue: "violet",
    tagline: "SRE, platform engineering and continuous delivery talent.",
  },
  {
    slug: "cloud-infrastructure",
    label: "Cloud & Infrastructure",
    short: "Cloud",
    category: "capabilities",
    hue: "teal",
    tagline: "AWS, Azure, GCP architects and platform engineers.",
  },
  {
    slug: "cybersecurity",
    label: "Cybersecurity",
    short: "Security",
    category: "capabilities",
    hue: "green",
    tagline: "Security architects, GRC and identity specialists.",
  },
  {
    slug: "integration-middleware",
    label: "Integration & Middleware",
    short: "Integration",
    category: "capabilities",
    hue: "orange",
    tagline: "MuleSoft, Boomi, Kafka, API and iPaaS specialists.",
  },
  {
    slug: "testing-quality-engineering",
    label: "Testing & Quality Engineering",
    short: "Emerging",
    category: "capabilities",
    hue: "rose",
    tagline: "Blockchain, IoT, digital twin and quantum-adjacent talent.",
  },
];

export const allL1: Record<string, L1IndexEntry[]> = {
  industries: industriesIndex,
  platforms: platformsIndex,
  capabilities: capabilitiesIndex,
};
