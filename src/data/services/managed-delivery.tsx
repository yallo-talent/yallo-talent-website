import { checkCircleIcon, rocketIcon, targetIcon } from "./icons";
import type { ServicePageData } from "./types";

export const managedDeliveryData: ServicePageData = {
  slug: "managed-delivery",
  eyebrow: "Managed Delivery · Scoped workstreams",
  title: "Hand us the workstream.",
  emphasis: "We own the outcome.",
  lede: "For the delivery slice where you need the result — not just the hands. Yallo scopes, staffs and runs the workstream end-to-end, with our specialists accountable for the outcome.",
  heroStat: { n: "End-to-end", l: "scoped to the work" },
  primaryCta: { label: "Scope a delivery package", href: "/brief" },
  secondaryCta: { label: "How it works", href: "/#how" },
  /* No "Yallo" here — .trustLine renders uppercase (canon §2), and the other
     three services' trust lines already avoid the word for the same reason. */
  trustLine: "Fixed-scope · outcome-owned · delivery risk is ours",
  audienceLabel: "Who this is for",
  audience: [
    "CIOs and Delivery Directors who want a workstream delivered, not staffed",
    "Practice Leads without the in-house depth to run it themselves",
  ],
  benefitsHeading: "What you get with Managed Delivery",
  benefits: [
    {
      title: "One accountable partner",
      copy: "A single delivery lead from Yallo owns the workstream. No orchestrating five contractors and hoping the seams hold.",
      icon: targetIcon,
    },
    {
      title: "Outcome, not effort",
      copy: "You buy the deliverable — a signed-off go-live, a data migration completed, a module integrated. Not day-rates against a task list.",
      icon: checkCircleIcon,
    },
    {
      title: "Delivery risk on us",
      copy: "If we scoped wrong, we cover the overrun. Our accountability is written into the SOW — not passed back to your CIO.",
      icon: rocketIcon,
    },
  ],
  processHeading: "How Managed Delivery works",
  processLede:
    "We define the scope with you, staff it from our bench, and run it end-to-end with a Yallo delivery lead accountable to your programme.",
  process: [
    {
      title: "Scope the outcome",
      copy: "A working session to define the workstream boundaries, the deliverable, the definition of done, and the constraints. Not a task list — an outcome.",
      tag: "Week 1",
    },
    {
      title: "Fixed statement of work",
      copy: "You get a fixed-price SOW with milestones, deliverables, gate criteria and dependency assumptions. No day-rate ambiguity.",
      tag: "Week 1–2",
    },
    {
      title: "Team mobilised",
      copy: "We staff from our bench — specialists you've already seen in shortlists. Yallo delivery lead runs the daily engagement.",
      tag: "Week 2–3",
    },
    {
      title: "Delivery, gate, handover",
      copy: "Milestone reviews with you, gate approvals, sign-off on final deliverable. Warranty period post-handover.",
      tag: "Life of engagement",
    },
  ],
  boundaryHeading: "Where Managed Delivery ends",
  boundary:
    "Managed Delivery is the up-market move: a fixed-scope workstream on the platforms you already run, with our specialists accountable for the outcome. It ends at the platform boundary itself. Yallo delivers fixed scope on your existing enterprise platforms; saasinator builds the new AI-native systems you go on to own.",
  proofHeading: "Proof, from Managed Delivery engagements",
  proof: [
    {
      title: "Consolidating Alshaya's multi-vendor IT delivery into one model",
      client: "Alshaya Group",
      href: "/case-studies/driving-consistent-it-delivery-across-a-complex-retail-technology-landscape",
      excerpt:
        "Alshaya ran Oracle Retail, Fusion, EPM and Azure through multiple vendors, driving up costs, inconsistent quality and slow onboarding. Yallo consolidated delivery into one hybrid, accountable model and reduced T&M costs.",
    },
    {
      title: "Building Al Othaim Markets' Arabic-speaking IT hub in Cairo",
      client: "Al Othaim Markets",
      href: "/case-studies/building-a-scalable-arabic-speaking-offshore-it-hub-for-al-othaim-markets",
      excerpt:
        "Al Othaim Markets needed an Arabic-speaking offshore IT team in Cairo, fast and on budget, covering development, ERP, integration and testing. Yallo built the pipeline and delivered the hub within budget and target.",
    },
    {
      title: "Delivering MAF's Oracle Hyperion financial consolidation",
      client: "Majid Al Futtaim",
      href: "/case-studies/oracle-hyperion-financial-management-hfm-implementation",
      excerpt:
        "MAF's group-wide Oracle Hyperion consolidation programme needed governance and predictability. Yallo supplied senior HFM architects and specialists, reaching first-phase go-live with a roadmap for what followed.",
    },
  ],
  rolesHeading: "Managed Delivery workstreams",
  roles: [
    "SAP module implementation (S/4HANA, FICO, MM, SD)",
    "Data migration to Oracle Fusion",
    "Salesforce Commerce Cloud stand-up",
    "Workday HCM configuration",
    "Blue Yonder WMS go-live",
    "Cloud landing zone build (Azure, AWS)",
    "Integration workstream (MuleSoft, Boomi)",
    "Data platform build (Snowflake, Databricks)",
    "Programme-level testing",
    "Cutover & hypercare",
    "Post-go-live optimisation",
    "Global Capability Centre stand-up",
  ],
  faqHeading: "Managed Delivery — common questions",
  faqs: [
    {
      q: "When should I use Managed Delivery vs Contract?",
      a: "Contract when you want to direct the work — you own delivery. Managed Delivery when you want to hand off a slice — we own delivery. Rule of thumb: if you'd struggle to interview each specialist because you don't hold the depth, hand it off. If you have delivery leadership in place, contract in.",
    },
    {
      q: "How is the SOW priced?",
      a: "Fixed-price against scope, with a contingency allowance for known-unknowns disclosed in the SOW. Change requests are quoted separately — no scope creep hidden in day-rates.",
    },
    {
      q: "Who owns the delivery risk if things slip?",
      a: "Yallo. If we scoped wrong, we absorb the overrun. If a genuine dependency slips (e.g. business availability, third-party vendor), that's a change request. All spelled out in the SOW.",
    },
    {
      q: "Can you run the whole programme, or just a workstream?",
      a: "Both. A single workstream (a module go-live, a migration, a cutover) is our sweet spot. Whole-programme managed delivery is possible — usually staged as multiple SOWs so you're never locked in.",
    },
    {
      q: "Who are the specialists on my Managed Delivery?",
      a: "Same specialist-screened bench you'd see on Contract. You see the team CVs at SOW signing, and can veto anyone on grounds of fit. We don't swap-in without your sign-off.",
    },
    {
      q: "What happens after go-live?",
      a: "A defined warranty period (typically 30–90 days) covers defects and knowledge transfer. Beyond that, you can convert the team to Contract engagements if you want ongoing operate-mode support.",
    },
  ],
  seo: {
    title: "Managed Delivery · Scoped Workstreams | Yallo Talent",
    description:
      "Hand us the workstream — we own the outcome. Fixed-scope managed delivery for SAP, Oracle, Salesforce, cloud and data programmes across the Middle East, Europe and India.",
  },
};
