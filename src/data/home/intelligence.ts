/**
 * AI talent, Evidence and Intelligence.
 *
 * "AI talent" is the category name. Rate bands and compensation windows live
 * only inside the gated Blueprint, never on a public surface.
 */

export interface AiRole {
  name: string;
  scope: string;
}

export const aiRoles: AiRole[] = [
  { name: "Agentic AI Developer", scope: "Tool calling, orchestration, evals" },
  {
    name: "Prompt & LLM Engineer",
    scope: "Context design, retrieval, model choice",
  },
  {
    name: "AI Evaluation Specialist",
    scope: "Test harnesses, red teaming, regression",
  },
  { name: "MLOps Engineer", scope: "Serving, monitoring, cost and drift" },
  {
    name: "AI Governance Lead",
    scope: "Policy, assurance, regulatory readiness",
  },
  {
    name: "AI Solution Architect",
    scope: "Reference architecture on your stack",
  },
];

export const aiCopy = {
  eyebrow: "AI talent",
  heading: "The hardest roles to fill did not exist two years ago.",
  lede: "The industry answered AI by buying AI tools for itself. We built a practice that places the people.",
  stat: {
    value: "72%",
    claim:
      "of employers cannot find the skills they need, and AI has overtaken engineering and traditional IT as the hardest category of all.",
    source: "ManpowerGroup Talent Shortage Survey, 2026",
  },
  cta: { label: "The AI Talent Atlas", href: "/ai-talent", published: false },
} as const;

/**
 * The eight real published case studies. Titles and summaries are taken
 * verbatim from yallo.co/case-studies — nothing here is paraphrased or written.
 *
 * `slug` is the destination on this site. The legacy site serves most of these
 * as `?case-study=` query strings, which are 301'd to these paths.
 *
 * `published` stays false until the real body is ported into
 * content/case-studies/. A card with no body renders non-interactive rather
 * than linking to a 404.
 */
export interface CaseStudyCard {
  client: string;
  /** Resolves to /logos/clients/{logo}.png|svg, or a wordmark when absent. */
  logo?: string;
  /** Engagement · platform · geography. */
  meta: string;
  title: string;
  summary: string;
  slug: string;
  published: boolean;
}

export const caseStudies: CaseStudyCard[] = [
  {
    client: "Al Tayer Group",
    logo: "/logos/clients/al-tayer.png",
    meta: "Contract · SAP S/4HANA · UAE",
    title: "Enabling SAP S/4HANA Transformation for Al Tayer Group",
    summary:
      "Al Tayer Group, a leading UAE-based conglomerate, embarked on a large-scale SAP S/4HANA transformation programme to modernise its enterprise systems. Wipro was appointed as the strategic System Integrator.",
    slug: "/case-studies/enabling-sap-s-4hana-transformation-for-al-tayer-group",
    published: false,
  },
  {
    client: "Alshaya Group",
    logo: "/logos/clients/alshaya.svg",
    meta: "Contract · Azure · Data engineering",
    title: "Rapidly Building a High-Performing Azure Data Engineering Team",
    summary:
      "Alshaya, a major international retail group launched a critical initiative to build a data platform on Azure. To ensure success, they needed skilled Azure Data Engineers ready to deliver from day one.",
    slug: "/case-studies/rapidly-building-a-high-performing-azure-data-engineering-team",
    published: false,
  },
  {
    client: "Chalhoub Group",
    logo: "/logos/clients/chalhoub-group.png",
    meta: "Contract · Supply chain · Middle East",
    title: "Rapid Recruitment for Critical Supply Chain Roles",
    summary:
      "Chalhoub, a leading luxury retail group in the Middle East struggled to recruit experienced Retail Supply Chain Architects and Business Analysts.",
    slug: "/case-studies/rapid-recruitment-for-critical-supply-chain-roles",
    published: false,
  },
  {
    client: "Majid Al Futtaim",
    logo: "/logos/clients/majid-al-futtaim.png",
    meta: "Managed Delivery · Oracle Hyperion · UAE",
    title: "Oracle Hyperion Financial Management (HFM) Implementation",
    summary:
      "Majid Al Futtaim (MAF) is a leading diversified conglomerate operating across retail, real estate, leisure, and entertainment, with complex financial consolidation and reporting requirements across multiple geographies and entities.",
    slug: "/case-studies/oracle-hyperion-financial-management-hfm-implementation",
    published: false,
  },
  {
    client: "Al Othaim Markets",
    logo: "/logos/clients/al-othaim-markets.png",
    meta: "Managed Delivery · Offshore hub · Saudi Arabia",
    title:
      "Building a Scalable Arabic-Speaking Offshore IT Hub for Al Othaim Markets",
    summary:
      "Al Othaim Markets, one of Saudi Arabia's leading retail groups, set out to insource key IT capabilities by establishing an offshore delivery centre in Cairo to support current and future technology programmes.",
    slug: "/case-studies/building-a-scalable-arabic-speaking-offshore-it-hub-for-al-othaim-markets",
    published: false,
  },
  {
    client: "Sephora",
    logo: "/logos/clients/sephora.png",
    meta: "Advisory · Target operating model · UAE",
    title:
      "Defining a Target Operating Model for Sephora Middle East's Digital Carve-Out",
    summary:
      "Sephora Middle East, with operations across the UAE and France, was experiencing rapid digital growth. To stay closer to customers and local market needs, leadership initiated a carve-out of ecommerce, CRM, digital, and data analytics capabilities from Sephora's central IT organisation in Paris.",
    slug: "/case-studies/defining-a-target-operating-model-for-sephora-middle-easts-digital-carve-out",
    published: false,
  },
  {
    client: "TCS",
    logo: "/logos/integrators/tcs.png",
    meta: "Contract · Oracle EBS · Saudi Arabia",
    title:
      "Ensuring Reliable Oracle EBS Integrations for Mission-Critical Enterprise Systems",
    summary:
      "Tata Consultancy Services (TCS) was delivering a large-scale Oracle E-Business Suite (EBS) integration program for an enterprise customer in Saudi Arabia.",
    slug: "/case-studies/ensuring-reliable-oracle-ebs-integrations-for-mission-critical-enterprise-systems",
    published: false,
  },
  {
    client: "Alshaya Group",
    logo: "/logos/clients/alshaya.svg",
    meta: "Managed Delivery · Custom build · Kuwait, UAE",
    title: "Engineering a Custom Planning Platform for Alshaya Group",
    summary:
      "Alshaya Group is one of the region's largest retail operators, managing complex planning operations across multiple brands, geographies, and high-volume retail environments.",
    slug: "/case-studies/engineering-a-custom-planning-platform",
    published: false,
  },
];

export const evidenceCopy = {
  eyebrow: "Evidence",
  heading: "Named clients, named platforms, published work.",
  lede: "Every one of these is already published. Scroll for more.",
  allHref: "/case-studies",
  allLabel: "All case studies",
} as const;

/**
 * The attributed testimonial slot.
 *
 * No permissioned client testimonial exists yet. `quote` stays null and the
 * component renders NOTHING — not a placeholder, not lorem, not an invented
 * sentence. Fill all four fields together when real permissioned text arrives.
 */
export const testimonial: {
  quote: string | null;
  name: string | null;
  title: string | null;
  company: string | null;
} = {
  quote: null,
  name: null,
  title: null,
  company: null,
};

export interface IntelligenceAsset {
  flag: "Gated" | "Open";
  title: string;
  copy: string;
  points: string[];
  cta: { label: string; href: string };
  /** Both routes are unbuilt; cards render non-interactive. */
  published: boolean;
  /**
   * Takes the inverted *corner* (top-right) rather than the default
   * bottom-left, so the pair is distinguishable in silhouette. Not an inverted
   * ground: this page already spends both of its permitted inverted bands on
   * WherePlace and AITalent.
   */
  invertCorner?: boolean;
}

export const intelligenceAssets: IntelligenceAsset[] = [
  {
    flag: "Gated",
    title: "The Programme Staffing Blueprint",
    copy: "Role by role and phase by phase. One per archetype: S/4HANA, Fusion, Dynamics 365, Salesforce multi-cloud, Blue Yonder.",
    points: [
      "Team shape by phase, with FTE counts",
      "Scarcity per role, in region",
      "Realistic time to hire",
      "The roles that always get under-scoped",
    ],
    cta: { label: "Request the Blueprint", href: "/intelligence" },
    published: false,
    invertCorner: true,
  },
  {
    flag: "Open",
    title: "The AI Talent Atlas",
    copy: "Every AI role we place: what it does, how we screen for it, and how scarce it is in region.",
    points: [
      "Role definitions and screening criteria",
      "In-region scarcity signals",
      "No email required",
    ],
    cta: { label: "Read the Atlas", href: "/ai-talent" },
    published: false,
  },
];

export const intelligenceCopy = {
  eyebrow: "Intelligence",
  heading: "Nobody publishes what it takes to staff a programme. We do.",
  lede: "Four firms in this market publish a salary guide. None publishes the team shape behind a transformation.",
} as const;

export const closeCopy = {
  eyebrow: "Start here",
  headline: {
    lead: "Tell us about the programme,",
    emphasis: "not the vacancy.",
  },
  lede: "The more we know about the phase you are in and the gate you are working to, the sharper the calibration and the shorter the shortlist.",
  primaryCta: { label: "Start a brief", href: "/brief" },
  jobsCta: { label: "Looking for a role instead?", href: "/jobs" },
  checklistTitle: "What a complete brief contains",
  checklist: [
    "Platform and modules in scope",
    "Programme phase and next gate",
    "The roles, and how many of each",
    "Location, and whether you have an entity",
    "Start date and duration",
  ],
  send: { label: "Send it", href: "/brief" },
} as const;
