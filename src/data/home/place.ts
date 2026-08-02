/**
 * Where we place — two axes only.
 *
 * The discipline axis is deliberately absent because RoleCoverage carries it.
 * Platform order is canon and not alphabetical: Microsoft sits third and gets
 * equal depth to Oracle because Yallo is a Microsoft house. ServiceNow and AWS
 * are not in the platform set; AWS folds into cloud-infrastructure.
 */

import { taxonomyLabels } from "@/data/l1/index";

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
  /**
   * Vendor mark, or `null` where the artwork cannot key to one clean ink.
   *
   * R9: canon §8 allows exactly two treatments — a keyed silhouette or the
   * vendor's NAME as text. There is no third option and no padded box.
   */
  mark: string | null;
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
    /* The real mark, restored. R9 made this NAME text and it was right about the
       DARK RAIL: sap.svg is a box lockup (perimeter ink 0.668) and silhouetting
       it to one ink gives a solid slab, which canon §8 forbids there. This band
       is light and renders the artwork as-is at full colour — no keying, no
       silhouette, so the box lockup is simply the logo, which is what it is. */
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
    /* The real mark, restored. R9 made this NAME text and it was right about the
       DARK RAIL: sap.svg is a box lockup (perimeter ink 0.668) and silhouetting
       it to one ink gives a solid slab, which canon §8 forbids there. This band
       is light and renders the artwork as-is at full colour — no keying, no
       silhouette, so the box lockup is simply the logo, which is what it is. */
    mark: "/logos/platforms/sap.svg",
    published: true,
  },
  {
    name: "Workday",
    slug: "workday",
    modules: "HCM · Financials · Adaptive",
    mark: "/logos/platforms/workday.svg",
    published: true,
  },
  {
    /* 7th platform — the MDM vendor Yallo is focusing on. No route yet, so it
       renders as a row without a link rather than a promise that 404s, and no
       mark ships because the pack has no Informatica artwork. */
    name: "Informatica",
    slug: "informatica",
    modules: "MDM · data quality · integration",
    mark: null,
    published: false,
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
    name: taxonomyLabels("retail").label,
    slug: "retail",
    scope: "Commerce, POS, supply chain",
    icon: "biz",
    published: true,
  },
  {
    name: taxonomyLabels("finance").label,
    slug: "finance",
    scope: "Core banking, payments, risk",
    icon: "arch",
    published: true,
  },
  {
    name: taxonomyLabels("manufacturing").label,
    slug: "manufacturing",
    scope: "ERP, WMS, TMS",
    icon: "biz",
    published: true,
  },
  {
    name: taxonomyLabels("government").label,
    slug: "government",
    scope: "Digital delivery, data platforms",
    icon: "arch",
    published: true,
  },
  {
    name: taxonomyLabels("healthcare").label,
    slug: "healthcare",
    scope: "Clinical systems, EMR",
    icon: "app",
    published: true,
  },
  {
    name: taxonomyLabels("telco").label,
    slug: "telco",
    scope: "OSS/BSS, network, data",
    icon: "cloud",
    published: true,
  },
  {
    /* 7th sector, behind the Yallo AI Academy push into education. No route
       yet. */
    name: taxonomyLabels("education").label,
    slug: "education",
    scope: "Student systems, research and campus platforms",
    icon: "biz",
    published: false,
  },
];

export const placeCopy = {
  eyebrow: "Where we place",
  heading: "Platform depth first, because that is where programmes break.",
  lede: "Most firms here organise by profession and treat enterprise platforms as one line item. We go the other way.",
  platformsLabel: "Platforms",
  sectorsLabel: "Sectors",
} as const;
