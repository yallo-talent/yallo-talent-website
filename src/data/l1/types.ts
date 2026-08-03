export type L1Category = "industries" | "platforms" | "capabilities";

/**
 * Right-column stat card in the Intro block.
 */
export interface L1IntroStatCard {
  n: string;
  l: string;
  /**
   * Canon §6: a published figure carries its attribution. This field was
   * missing, so the only way to cite one was to append "(ManpowerGroup, 2026)"
   * to the claim text — which reads as prose, not as a citation, and left
   * nothing to check an uncited figure against. A card WITHOUT a source is now
   * a visible omission rather than an invisible one.
   */
  source?: string;
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
  /**
   * Sub-desks on ANOTHER discipline that cover this same subject from the other
   * side, per context-round3-rulings.md §5.3.
   *
   * Cloud & Infrastructure and DevOps & Platform Engineering share six sub-desk
   * subjects: platform engineering, infrastructure as code, Kubernetes and
   * containers, observability, SRE and FinOps. The split between them is by
   * subject and canon ratifies both, but six matching names cannot themselves
   * tell a buyer which side they are on. Each L1 now states the distinction in
   * one line, and this field puts the other side one click away rather than
   * leaving the reader to navigate back up and across.
   *
   * An array because the mapping is not one to one: DevOps runs observability
   * and SRE as a single desk where Cloud runs them as two.
   *
   * NOT the same thing as `L2CrossLinks`, which links a function to a whole
   * platform or discipline. This is peer to peer, sub-desk to sub-desk, and
   * `note` carries why the reader might want the other one.
   */
  twin?: Array<{ href: string; label: string; note: string }>;
  /**
   * What the screening band says for THIS function, per
   * context-round3-rulings.md §5.5.4.
   *
   * The band used to be a hardcoded paragraph in `L2PageShell` taking no props,
   * so it was word-for-word identical on every L2 on the site. Twenty retail
   * functions each claimed to be "assessed for implementation depth by
   * specialists who have run delivery in this function" in exactly the same
   * sentence, which is the kind of sameness a buyer reads as generated.
   *
   * A screening claim is the page's most load-bearing one, so it is the worst
   * place for boilerplate: it is the only band that says what Yallo actually
   * does that a job board does not.
   *
   * Optional, and the fallback is the original generic paragraph rather than
   * nothing. A function that has not said what it screens for makes the honest
   * general claim; it does not borrow another function's specifics. That is the
   * same rule `screeningContext` already follows on L1PageData.
   *
   * Note what is deliberately NOT here: an engagement equivalent. The engagement
   * band is the four commercial models in canon §7, and those do not vary by
   * function. Making them differ per function would mean inventing distinctions
   * that do not exist, so that half of the band's sameness is correct.
   */
  screening?: string;
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
 * A platform or skill's market-scarcity read on a capability desk — a
 * different axis from `L1ScarceRole` above, which names job ROLES with an
 * engagement type. This names a PLATFORM or SKILL ("GCP", "Snowflake") and
 * has no engagement concept, so it is its own type rather than an overload.
 * Ranked, not republished — see `BlueprintScarcityRole` in
 * `src/data/blueprint/index.ts` for the shared evidence and rule:
 * `scarcityNote` never carries a percentage, a pool size or a market-research
 * attribution.
 */
export interface L1PlatformScarcity {
  skill: string;
  scarcityBand: "scarcest" | "moderate" | "least-scarce" | null;
  scarcityNote?: string;
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
  /**
   * The operating conditions this sector's screening actually tests for.
   *
   * Rendered in the L2 overview bullet. That bullet used to hardcode
   * "Retail-context screening — high transaction volumes, multi-market
   * rollouts" on EVERY L2 on the site, which was invisible while every built L2
   * was retail and would have told a banking buyer we screen for retail the
   * moment a finance L2 shipped.
   *
   * Optional, and the fallback is deliberately plain: a sector that has not
   * said what it screens for gets a true generic line rather than another
   * sector's specifics.
   */
  screeningContext?: string;
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
  /** v2, capability desks only: per-platform/skill scarcity — see L1PlatformScarcity. */
  platformScarcity?: L1PlatformScarcity[];

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

  /* No `partners` field. The technology-partners tile grid is gone: ten of its
     sixteen marks sat outside canon §3's six-platform set, and calling SAP, AWS
     and Google Cloud "partners" is a commercial claim with nothing behind it. */

  /** Read next — cross-links */
  relatedTitle: string;
  related: L1RelatedLink[];

  /** SEO */
  seo: {
    title: string;
    description: string;
  };
}
