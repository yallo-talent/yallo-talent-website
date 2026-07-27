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
  image: string;
  imageAlt: string;
}

export const industriesIndex: L1IndexEntry[] = [
  {
    slug: "retail",
    label: "Retail & Consumer",
    short: "Retail",
    category: "industries",
    hue: "orange",
    tagline: "Commerce, POS and supply-chain talent for retail programmes.",
    image:
      "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=900&auto=format&fit=crop&q=80",
    imageAlt: "Retail store interior",
  },
  {
    slug: "finance",
    label: "Banking & Financial Services",
    short: "Banking",
    category: "industries",
    hue: "blue",
    tagline: "Core banking, payments, risk and cloud platform specialists.",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&auto=format&fit=crop&q=80",
    imageAlt: "Financial services skyline",
  },
  {
    slug: "government",
    label: "Government & Public Sector",
    short: "Government",
    category: "industries",
    hue: "green",
    tagline: "Digital government, smart-services and citizen-facing platforms.",
    image:
      "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=900&auto=format&fit=crop&q=80",
    imageAlt: "Government building",
  },
  {
    slug: "manufacturing",
    label: "Manufacturing & Logistics",
    short: "Manufacturing",
    category: "industries",
    hue: "orange",
    tagline: "ERP, Industry 4.0 and warehouse/transport specialists.",
    image:
      "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=900&auto=format&fit=crop&q=80",
    imageAlt: "Manufacturing floor",
  },
  {
    slug: "healthcare",
    label: "Healthcare & Life Sciences",
    short: "Healthcare",
    category: "industries",
    hue: "teal",
    tagline: "Clinical systems, regulated data and compliance-grade delivery.",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&auto=format&fit=crop&q=80",
    imageAlt: "Healthcare setting",
  },
  {
    slug: "telco",
    label: "Telco & Media",
    short: "Telco",
    category: "industries",
    hue: "violet",
    tagline: "OSS/BSS, network and data engineering for telco transformation.",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&auto=format&fit=crop&q=80",
    imageAlt: "Network infrastructure",
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
    image:
      "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=900&auto=format&fit=crop&q=80",
    imageAlt: "Enterprise software workstation",
  },
  {
    slug: "oracle",
    label: "Oracle",
    short: "Oracle",
    category: "platforms",
    hue: "rose",
    tagline: "Fusion Cloud ERP/EPM/HCM/SCM and E-Business Suite specialists.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&auto=format&fit=crop&q=80",
    imageAlt: "Analytics dashboard",
  },
  {
    slug: "microsoft",
    label: "Microsoft",
    short: "Microsoft",
    category: "platforms",
    hue: "blue",
    tagline: "Dynamics 365, Azure, Power Platform, M365 engineers.",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&auto=format&fit=crop&q=80",
    imageAlt: "Modern developer workspace",
  },
  {
    slug: "salesforce",
    label: "Salesforce",
    short: "Salesforce",
    category: "platforms",
    hue: "teal",
    tagline: "Sales, Service, Commerce, Marketing and integration talent.",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&auto=format&fit=crop&q=80",
    imageAlt: "CRM strategy session",
  },
  {
    slug: "blueyonder",
    label: "Blue Yonder",
    short: "Blue Yonder",
    category: "platforms",
    hue: "orange",
    tagline: "WMS, TMS, Luminate and demand-planning specialists.",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=900&auto=format&fit=crop&q=80",
    imageAlt: "Supply chain operations",
  },
  {
    slug: "workday",
    label: "Workday",
    short: "Workday",
    category: "platforms",
    hue: "violet",
    tagline: "HCM, Payroll, Recruiting and Adaptive Planning specialists.",
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&auto=format&fit=crop&q=80",
    imageAlt: "HR leadership meeting",
  },
];

export const capabilitiesIndex: L1IndexEntry[] = [
  {
    slug: "data-ai",
    label: "Data & AI",
    short: "Data & AI",
    category: "capabilities",
    hue: "blue",
    tagline: "Data engineering, ML, GenAI and analytics platform specialists.",
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=900&auto=format&fit=crop&q=80",
    imageAlt: "Data visualisation",
  },
  {
    slug: "digital-devops",
    label: "Digital & DevOps",
    short: "Digital & DevOps",
    category: "capabilities",
    hue: "violet",
    tagline: "SRE, platform engineering and continuous delivery talent.",
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=900&auto=format&fit=crop&q=80",
    imageAlt: "DevOps engineer workstation",
  },
  {
    slug: "cloud-infrastructure",
    label: "Cloud & Infrastructure",
    short: "Cloud",
    category: "capabilities",
    hue: "teal",
    tagline: "AWS, Azure, GCP architects and platform engineers.",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&auto=format&fit=crop&q=80",
    imageAlt: "Cloud infrastructure",
  },
  {
    slug: "cybersecurity",
    label: "Cybersecurity",
    short: "Security",
    category: "capabilities",
    hue: "green",
    tagline: "Security architects, GRC and identity specialists.",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=900&auto=format&fit=crop&q=80",
    imageAlt: "Cybersecurity operations",
  },
  {
    slug: "integration-middleware",
    label: "Integration & Middleware",
    short: "Integration",
    category: "capabilities",
    hue: "orange",
    tagline: "MuleSoft, Boomi, Kafka, API and iPaaS specialists.",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&auto=format&fit=crop&q=80",
    imageAlt: "Integration architecture",
  },
  {
    slug: "emerging-technologies",
    label: "Emerging Technologies",
    short: "Emerging",
    category: "capabilities",
    hue: "rose",
    tagline: "Blockchain, IoT, digital twin and quantum-adjacent talent.",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&auto=format&fit=crop&q=80",
    imageAlt: "Emerging technology R&D",
  },
];

export const allL1: Record<string, L1IndexEntry[]> = {
  industries: industriesIndex,
  platforms: platformsIndex,
  capabilities: capabilitiesIndex,
};
