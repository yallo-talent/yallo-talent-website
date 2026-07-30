export type L1Category = "industries" | "platforms" | "capabilities";

/**
 * Right-column stat card in the Intro block.
 */
export interface L1IntroStatCard {
  n: string;
  l: string;
}

/**
 * One card in the Expertise grid.
 * Clicks through to the L2 page for that function or module.
 */
export interface L1ExpertiseCard {
  slug: string;
  num: string;
  title: string;
  roles: string[];
  /**
   * Icon key from `l1-icons.tsx` — sits in the top-left of the card,
   * drawn in the one brand accent.
   */
  icon: L1IconKey;
  /** Short blurb under the title — one line, sub-heading style. */
  blurb?: string;
  /**
   * L2 href — optional; if omitted the card is presentational for now.
   * Will populate once we build L2 pages.
   */
  href?: string;
  /**
   * Deep-copy paragraph for the L2 function-page overview block.
   * If omitted, the shell falls back to `blurb`.
   */
  overview?: string;
  /**
   * Vendor / tool cards rendered on the L2 page for this function.
   * Each card lists a specific tool (SAP Customer Experience, etc.)
   * with the contractor roles Yallo places into it.
   */
  tools?: L2Tool[];
}

/**
 * Vendor tool card rendered on an L2 function page.
 * Vendor name maps to a slug in `/public/logos/{vendorSlug}.svg`.
 * Until the logo file exists the shell shows a text badge fallback.
 */
export interface L2Tool {
  /** URL-safe slug, unique inside the function. */
  slug: string;
  /** Human-readable vendor (SAP, Oracle, Salesforce…). */
  vendor: string;
  /**
   * Vendor logo slug (lowercase, hyphenated) → resolves to
   * `/public/logos/{vendorSlug}.svg`. Optional; falls back to a text badge.
   */
  vendorSlug?: string;
  /** Full product name — "SAP Customer Experience", "Blue Yonder Luminate". */
  name: string;
  /** 4–5 contractor role titles Yallo places on this tool. */
  roles: string[];
  /** Optional bench signal override. Defaults to the sector default. */
  benchNote?: string;
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
  | "spark"
  | "security"
  | "cloud"
  | "dataAi"
  | "integration"
  | "government"
  | "eor"
  | "cases"
  | "pillarContract"
  | "pillarPermanent"
  | "pillarEor"
  | "pillarManaged";

/**
 * One segment in the interactive "Segments we support" panel.
 * Sidebar list on the left; hovering an item swaps the panel drawing, copy and
 * role pills. No image field: the drawing is derived from the segment id by
 * PetalPlate, because canon forbids photography and every one of these was a
 * hotlinked Unsplash URL.
 */
export interface L1Segment {
  id: string;
  name: string;
  intro: string;
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

/**
 * One card in the horizontally scrolling Insights row.
 */
export interface L1Insight {
  href: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  minutes: number;
  /**
   * When false, the card renders as non-interactive text rather than a
   * link. Use where `href` points at a route that has not shipped yet.
   */
  published?: boolean;
}

export interface L1PageData {
  slug: string;
  category: L1Category;
  breadcrumb: { label: string; href?: string }[];

  /** Hero */
  eyebrow: string;
  title: string;
  emphasis: string;
  sub: string;
  /**
   * The sector as a NOUN, for use inside prose.
   *
   * Body copy used to derive this by splitting the H1, which yielded "every
   * retail tech contractors programme" in a 38px heading — a broken sentence in
   * the first thing a cold visitor from organic search reads. Prose takes this
   * field; the H1 keeps its own wording.
   */
  sectorNoun: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  statusDots: string[];

  /* No `stats` field. The top strip renders the four metrics from
     content/metrics.yaml, passed in by the server page — canon §6 permits
     exactly those four, and a per-page tuple here published a fifth and put
     all of them beyond the quarterly refresh. See L1StatsStrip. */

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

  /** Insights (horizontal scrolling row) — optional per page */
  insightsEyebrow?: string;
  insightsTitle?: string;
  insightsSub?: string;
  insights?: L1Insight[];

  /**
   * Technology partners tile grid — optional per page.
   * If omitted, the shell falls back to a shared default list.
   */
  partners?: string[];

  /** Read next — cross-links */
  relatedTitle: string;
  related: L1RelatedLink[];

  /** SEO */
  seo: {
    title: string;
    description: string;
  };
}
