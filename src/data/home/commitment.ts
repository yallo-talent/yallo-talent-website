/**
 * The commitment — real contractual terms, taken from the actual pitch-deck
 * service scopes.
 *
 * NOTHING may be added to these lists. The earlier "first ten working days at
 * our risk" line is withdrawn: it creates unbounded exposure where contractors
 * are on Yallo visa sponsorship. No rates, no fee percentages — those live only
 * inside the gated Programme Staffing Blueprint.
 */

export interface CommitmentColumn {
  /** Mono label above the heading. */
  kind: string;
  heading: string;
  /** The one term worth setting oversized. */
  badge: { value: string; label: string };
  terms: string[];
  cta: { label: string; href: string };
}

export const commitmentColumns: [CommitmentColumn, CommitmentColumn] = [
  {
    kind: "Contract workforce",
    heading: "Rate-card based, and replaced if the quality misses.",
    badge: { value: "2–4", label: "weeks to onboard" },
    terms: [
      "Published rate card",
      "Replacement on quality",
      "Ramp up and ramp down",
      "Contract to hire available",
    ],
    cta: { label: "How Contract works", href: "/contract" },
  },
  {
    kind: "Permanent hiring",
    heading: "You pay when someone starts, and only if they stay.",
    badge: { value: "100", label: "day warranty" },
    terms: [
      "No success, no fee",
      "Payment on start date",
      "Flat fee across every level",
      "Exclusive or retained only",
    ],
    cta: { label: "How Permanent works", href: "/permanent" },
  },
];

export const commitmentCopy = {
  eyebrow: "The commitment",
  heading: "What sits in the agreement, not just in the pitch.",
  lede: "Permanent and contract carry different terms. Both are in writing before you brief us.",
  /* Hosting added: the old line implied EOR only applies when the client has no
     entity, which is the smaller half of what we actually do. */
  note: "Onboarding includes visa and Employer of Record where you have no entity, or talent hosting where you have found the person yourself.",
} as const;
