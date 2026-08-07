/**
 * Four engagement models, contract leading.
 *
 * One line of positioning per model plus "right for" chips. No paragraphs.
 * Pillar four is Managed Delivery. The word this replaced never appears in
 * public copy; see scripts/check-terminology.mjs for the rule. The white-label-behind-an-SI mode is real but is not
 * published.
 *
 * The two card metrics come from content/metrics.yaml via the generated
 * client-safe module, round 19 §5.1. They were typed here ("72h", "50+") and
 * the quarterly refresh could not reach them; this file feeds a client
 * component, so it could not read the server-only src/data/metrics.ts.
 */
import { metricValue } from "@/data/metrics.generated";

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
    metric: {
      value: metricValue("Brief to shortlist"),
      label: "Brief to shortlist",
    },
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
    /* EOR keeps the headline because it is the category buyers search for and
       /eor is an established route. TALENT HOSTING sits beneath it as the
       distinct service it actually is — per Sumeet, 1 Aug.

       The difference is not the visa, it is the SOURCING. Classic EOR is "hire
       where you have no entity". Hosting is "you found the person, you do not
       want them on your payroll, so they sit on ours and we deploy them back to
       you". Chalhoub and MAF use it heavily and it is a major line in Saudi
       Arabia and the UAE. We compete with TASC and UHRS on it.

       Two flavours, and neither involves the CLIENT's visa:
         - the consultant holds their own freelance visa: we issue the work
           permit, onboard, run payroll and manage the tenure;
         - the consultant has no visa: we sponsor the visa and the permit too,
           in the country of deployment.
       Fee follows: visa sponsorship on actuals, a flat fee for onboarding,
       offboarding, payroll and management. */
    name: "Employer of Record",
    positioning:
      "Hire where you have no entity, or host a consultant you found yourself.",
    rightFor: [
      "Saudi Arabia and the UAE",
      "Talent hosting: your hire, our payroll",
      "Visa sponsorship, or work permit on their own visa",
      "Payroll, onboarding and end of service",
    ],
    href: "/eor",
    metric: { value: "2–4 weeks", label: "To onboard, visa included" },
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
    metric: {
      value: metricValue("Programmes staffed"),
      label: "Programmes staffed",
    },
  },
];

export const engageCopy = {
  eyebrow: "How you engage",
  heading: "Four ways to bring in specialists.",
  lede: "Four ways to contract for the same thing: named specialists who have done it before.",
} as const;
