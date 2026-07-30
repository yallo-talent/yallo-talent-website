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
  },
];

export const engageCopy = {
  eyebrow: "How you engage",
  heading: "Four ways to bring in specialists.",
  lede: "Pick the model that matches how you want to hold the risk.",
} as const;
