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
