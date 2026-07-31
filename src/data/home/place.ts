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
    /* R9: NAME, not a mark — and measured on the ARTWORK, not on its cell.
       Rasterised at 300 DPI on a transparent ground, sap.svg is 129x64 with
       opaque 0.748 and PERIMETER ink 0.668. A letterform's ink does not run
       along its outer frame; the four marks that survive here measure 0.000 to
       0.040 on that axis. What silhouettes here is the box.
       My first attempt measured the rendered cell and read 91.4% dark — but the
       #place band is near-black, so every cell reads ~95% and the test was
       measuring the band. Same conclusion, different evidence. */
    mark: null,
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
    /* R9: NAME, not a mark. blue-yonder.png measures 448x64 at
       opaqueFraction 1.000 — every pixel fully opaque, so it is a baked ground
       with no transparency to recover. Keying it would mean guessing which colour
       is the ground, and canon §8 forbids shipping a mark it cannot vouch for. */
    mark: null,
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
