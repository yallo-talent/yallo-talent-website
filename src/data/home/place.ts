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
    name: taxonomyLabels("sap").label,
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
    name: taxonomyLabels("oracle").label,
    slug: "oracle",
    modules: "Fusion · EBS · Hyperion · Retail",
    mark: "/logos/platforms/oracle.svg",
    published: true,
  },
  {
    name: taxonomyLabels("microsoft").label,
    slug: "microsoft",
    modules: "Azure · Dynamics 365 · Power Platform",
    mark: "/logos/platforms/microsoft.svg",
    published: true,
  },
  {
    name: taxonomyLabels("salesforce").label,
    slug: "salesforce",
    modules: "Service · Marketing · Commerce",
    mark: "/logos/platforms/salesforce.svg",
    published: true,
  },
  {
    name: taxonomyLabels("blue-yonder").label,
    slug: "blue-yonder",
    modules: "Luminate · WMS · planning",
    /* Round 14: a real source (BlueYonder.png) replaced the opaque plate this
       comment used to describe. scripts/build-logos.mjs now has a `platforms`
       family and keys it through the same gate every client mark passes —
       1344x191, 31.8% ink, 0.2% padding, no box-lockup or filled-plate reason
       to decline. Measured clean by check-marks.mjs on the axis surface
       alongside the other six. */
    mark: "/logos/platforms/blue-yonder.png",
    published: true,
  },
  {
    name: taxonomyLabels("workday").label,
    slug: "workday",
    modules: "HCM · Financials · Adaptive",
    mark: "/logos/platforms/workday.svg",
    published: true,
  },
  {
    /* 7th platform, the MDM vendor Yallo is focusing on.

       PUBLISHED FLIPPED 2 Aug 2026, per context-round5-rulings.md decision 9.
       The "no route yet" this comment used to carry stopped being true when the
       desk shipped: /platforms/informatica was measured at 200 on a production
       build before the flag moved. The homepage was rendering a real page as
       unbuilt and hiding the seventh platform while the mega menu linked it
       correctly. A hand-declared publication state is the same class of defect
       as a hand-copied label, so session A makes this derive from the registry
       the way sectorNavEntries already does; this flag is the data half.

       Round 14: the "no platform artwork" half is now Sumeet's call reversed
       — a real source arrived (Informatica-icon.png, the standalone flag
       mark, not the client rail's icon+wordmark lockup) and keys cleanly
       through the same gate every client mark passes. Deliberately a
       DIFFERENT slug ("informatica-icon") from the client family's
       "informatica", even though both now trace to the same company's
       mark — manifest.json is keyed by slug alone across all three families,
       and reusing "informatica" here would silently collide with the client
       rail's own (now-unused) measurement.
       consentOnFile in content/clients.yaml went back to false the same
       round: Informatica no longer appears on the client rail. */
    name: taxonomyLabels("informatica").label,
    slug: "informatica",
    modules: "MDM · data quality · integration",
    mark: "/logos/platforms/informatica-icon.png",
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
