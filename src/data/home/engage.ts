/**
 * Four engagement models, contract leading.
 *
 * One line of positioning per model plus "right for" chips. No paragraphs.
 * Pillar four is Managed Delivery. The word this replaced never appears in
 * public copy; see scripts/check-terminology.mjs for the rule. The white-label-behind-an-SI mode is real but is not
 * published.
 */

export interface EngagementModel {
  num: string;
  name: string;
  /** One line. Not a paragraph. */
  positioning: string;
  /** Marks the lead motion. */
  lead?: boolean;
  rightFor: string[];
  href: string;
  /** One callout per model, drawn ONLY from canon §6 metrics or §7 terms. */
  metric: { value: string; label: string };
}

export const engagementModels: EngagementModel[] = [
  {
    num: "01",
    name: "Contract",
    positioning: "Interim specialists on your programme, on your paper.",
    lead: true,
    rightFor: [
      "Programme surges",
      "Fixed-term delivery gaps",
      "Specialist skills you don't hold",
      "Time and materials or fixed bid",
    ],
    href: "/contract",
    metric: { value: "72h", label: "Brief to shortlist" },
  },
  {
    num: "02",
    name: "Permanent",
    positioning: "The senior hire you build the team around.",
    rightFor: [
      "Architects and programme directors",
      "Seven-stage managed lifecycle",
      "Flat fee, all levels",
      "100-day warranty",
    ],
    href: "/permanent",
    metric: { value: "100 days", label: "Replacement warranty" },
  },
  {
    num: "03",
    name: "Employer of Record",
    positioning: "Hire where you have no entity.",
    rightFor: [
      "Saudi Arabia, UAE, India",
      "Visa sponsorship and renewals",
      "Payroll and end of service",
      "No entity setup",
    ],
    href: "/eor",
    metric: { value: "2–4 weeks", label: "To onboard, visa and EOR included" },
  },
  {
    num: "04",
    name: "Managed Delivery",
    positioning: "Fixed scope on your existing platforms, outcome owned by us.",
    rightFor: [
      "Defined scope of work",
      "Milestone-based delivery",
      "Named delivery owner",
      "Six to nine months typical",
    ],
    href: "/managed-delivery",
    metric: { value: "50+", label: "Programmes staffed" },
  },
];

export const engageCopy = {
  eyebrow: "How you engage",
  heading: "Four ways to bring in specialists.",
  lede: "Four ways to contract for the same thing: named specialists who have done it before.",
} as const;
