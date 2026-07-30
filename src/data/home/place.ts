/**
 * Where we place — two axes only.
 *
 * The discipline axis is deliberately absent because RoleCoverage carries it.
 * Platform order is canon and not alphabetical: Microsoft sits third and gets
 * equal depth to Oracle because Yallo is a Microsoft house. ServiceNow and AWS
 * are not in the platform set; AWS folds into cloud-infrastructure.
 */

export interface PlatformAxis {
  name: string;
  slug: string;
  /** Module-level depth — this is the wedge made visible. */
  modules: string;
  /**
   * Vendor mark under /logos/platforms/. Held explicitly rather than derived
   * from the slug because the pack mixes vector and raster: five are SVG, Blue
   * Yonder only exists as a bitmap.
   */
  mark: string;
  /**
   * Whether /platforms/{slug} exists. Derived at build time from module data
   * presence in src/data/platforms/derive.ts — a platform with fewer than three
   * documented modules gets no page, so this is not hand-maintained.
   */
  published: boolean;
}

export const platforms: PlatformAxis[] = [
  {
    name: "SAP",
    slug: "sap",
    modules: "S/4HANA · ECC · SuccessFactors",
    mark: "/logos/platforms/sap.svg",
    published: true,
  },
  {
    name: "Oracle",
    slug: "oracle",
    modules: "Fusion · EBS · Hyperion · Retail",
    mark: "/logos/platforms/oracle.svg",
    published: true,
  },
  {
    name: "Microsoft",
    slug: "microsoft",
    modules: "Azure · Dynamics 365 · Power Platform",
    mark: "/logos/platforms/microsoft.svg",
    published: true,
  },
  {
    name: "Salesforce",
    slug: "salesforce",
    modules: "Service · Marketing · Commerce",
    mark: "/logos/platforms/salesforce.svg",
    published: true,
  },
  {
    name: "Blue Yonder",
    slug: "blue-yonder",
    modules: "Luminate · WMS · planning",
    mark: "/logos/platforms/blue-yonder.png",
    published: true,
  },
  {
    name: "Workday",
    slug: "workday",
    modules: "HCM · Financials · Adaptive",
    mark: "/logos/platforms/workday.svg",
    published: true,
  },
];

export type SectorIcon = "biz" | "arch" | "app" | "cloud";

export interface SectorAxis {
  name: string;
  slug: string;
  scope: string;
  icon: SectorIcon;
  published: boolean;
}

export const sectors: SectorAxis[] = [
  {
    name: "Retail & Consumer",
    slug: "retail",
    scope: "Commerce, POS, supply chain",
    icon: "biz",
    published: true,
  },
  {
    name: "Banking & Financial Services",
    slug: "finance",
    scope: "Core banking, payments, risk",
    icon: "arch",
    published: true,
  },
  {
    name: "Manufacturing & Logistics",
    slug: "manufacturing",
    scope: "ERP, WMS, TMS",
    icon: "biz",
    published: true,
  },
  {
    name: "Government & Public Sector",
    slug: "government",
    scope: "Digital delivery, data platforms",
    icon: "arch",
    published: true,
  },
  {
    name: "Healthcare & Life Sciences",
    slug: "healthcare",
    scope: "Clinical systems, EMR",
    icon: "app",
    published: true,
  },
  {
    name: "Telco & Media",
    slug: "telco",
    scope: "OSS/BSS, network, data",
    icon: "cloud",
    published: true,
  },
];

export const placeCopy = {
  eyebrow: "Where we place",
  heading: "Platform depth first, because that is where programmes break.",
  lede: "Most firms here organise by profession and treat enterprise platforms as one line item. We go the other way.",
  platformsLabel: "Platforms",
  sectorsLabel: "Sectors",
} as const;
