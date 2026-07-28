export type L1Hue = "blue" | "green" | "orange" | "teal" | "violet" | "rose";

export type L1Category = "industries" | "platforms" | "capabilities";

/**
 * Single stat in the top strip (72h / 2:1 / etc.).
 */
export interface L1Stat {
  n: string;
  l: string;
}

/**
 * Right-column stat card in the Intro block.
 */
export interface L1IntroStatCard {
  n: string;
  l: string;
}

/**
 * One card in the Expertise grid.
 * Each card has a background image behind a glass surface, tinted by
 * the page hue; clicks through to the L2 page for that function/module.
 */
export interface L1ExpertiseCard {
  slug: string;
  num: string;
  title: string;
  roles: string[];
  /**
   * Icon key from `l1-icons.tsx` — sits in the top-left of the card,
   * tinted with the sector accent.
   */
  icon: L1IconKey;
  /** Short blurb under the title — one line, sub-heading style. */
  blurb?: string;
  /**
   * L2 href — optional; if omitted the card is presentational for now.
   * Will populate once we build L2 pages.
   */
  href?: string;
}

/** Icon keys supported by the L1 icon set. */
export type L1IconKey =
  | "cx"
  | "store"
  | "merch"
  | "assortment"
  | "pricing"
  | "loyalty"
  | "omnichannel"
  | "ecommerce"
  | "pos"
  | "oms"
  | "wms"
  | "tms"
  | "supply"
  | "demand"
  | "inventory"
  | "analytics"
  | "mdm"
  | "finance"
  | "workforce"
  | "crm"
  | "returns"
  | "clienteling"
  | "promotions"
  | "space"
  | "hr"
  | "scarce"
  | "spark";

/**
 * One segment in the interactive "Segments we support" panel.
 * Sidebar list on the left; hovering an item swaps the panel image + copy + role pills.
 */
export interface L1Segment {
  id: string;
  name: string;
  intro: string;
  image: string;
  imageAlt: string;
  roles: string[];
}

/**
 * A hard-to-find / scarce role — shown in the "Scarce talent" section as a
 * chip row with scarcity + engagement tags. Only used for industries currently.
 */
export interface L1ScarceRole {
  name: string;
  scarcity: "high" | "med";
  engagement: "contract" | "perm" | "contract-perm";
}

/**
 * A cross-link chip in the "Read next" row at the bottom.
 */
export interface L1RelatedLink {
  href: string;
  label: string;
  category: string;
}

export interface L1PageData {
  slug: string;
  category: L1Category;
  hue: L1Hue;
  breadcrumb: { label: string; href?: string }[];

  /** Hero */
  eyebrow: string;
  title: string;
  emphasis: string;
  sub: string;
  heroImage: string;
  heroImageAlt: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  statusDots: string[];

  /** Stats strip (4 items) */
  stats: [L1Stat, L1Stat, L1Stat, L1Stat];

  /** Intro block */
  introEyebrow: string;
  introTitle: string;
  introCopy: string[];
  introStatCards: L1IntroStatCard[];

  /** Scarce talent (optional — industries mainly) */
  scarceEyebrow?: string;
  scarceTitle?: string;
  scarceCopy?: string;
  scarceRoles?: L1ScarceRole[];
  scarceIcon?: L1IconKey;
  scarceCta?: { label: string; href: string };

  /** Expertise grid */
  expertiseEyebrow: string;
  expertiseTitle: string;
  expertiseSub: string;
  expertise: L1ExpertiseCard[];

  /** Segments panel */
  segmentsEyebrow: string;
  segmentsTitle: string;
  segmentsSub: string;
  segments: L1Segment[];

  /** Read next — cross-links */
  relatedTitle: string;
  related: L1RelatedLink[];

  /** SEO */
  seo: {
    title: string;
    description: string;
  };
}
