import { eorCorridorProse, eorCountries } from "@/data/services/eor-countries";
import { globeIcon, handshakeIcon, shieldIcon } from "./icons";
import type { ServicePageData } from "./types";

export const eorData: ServicePageData = {
  slug: "eor",
  eyebrow: `Employer of Record · ${eorCountries.join(" · ")}`,
  title: "You choose the hire.",
  emphasis: "We carry the employment.",
  /* Corridor only, no per-country mechanism — §4b. What Yallo offers in
     Saudi Arabia specifically (entity, payroll, visa sponsorship, or some
     subset) is not ratified, so this names the employment relationship in
     general rather than pinning "visa" to one country and "payroll" to
     another the way the UAE/India-only version did. */
  lede: `Found the specialist yourself? We handle the employment relationship in the ${eorCorridorProse} so you don't have to. You direct the work, we hold the compliance, no local entity setup, no legal exposure.`,
  heroStat: {
    n: String(eorCountries.length),
    l: `countries · ${eorCountries.join(", ")}`,
  },
  primaryCta: { label: "Set up an EOR arrangement", href: "/brief" },
  secondaryCta: { label: "How it works", href: "/#how" },
  trustLine: `${eorCountries.join(" · ")} · full compliance · service-fee only`,
  audienceLabel: "Who this is for",
  audience: [
    "Delivery Directors and HR leads who've already made the hire but have no local entity to employ them",
  ],
  boundaryHeading: "Where EOR ends",
  boundary:
    "EOR is an enabler inside Contract and Permanent, not a peer product: it exists to let you employ someone you've already found. Where the need is finding that person, that's Contract or Permanent. Where the need is an outcome delivered rather than people supplied, that's Managed Delivery.",
  benefitsHeading: "What you get with Yallo EOR",
  benefits: [
    {
      title: "No entity setup required",
      copy: `Deploy talent into the ${eorCorridorProse} without spinning up a legal entity, opening bank accounts, or navigating local labour law.`,
      icon: globeIcon,
    },
    {
      title: "Compliance on us",
      copy: "Visa sponsorship, work permits, PF/ESI, gratuity, insurance, and end-of-service. We handle every regulatory obligation.",
      icon: shieldIcon,
    },
    {
      title: "You direct the work",
      copy: "Your team manages day-to-day delivery. We handle the employment relationship. Same result as a direct hire, none of the friction.",
      icon: handshakeIcon,
    },
  ],
  processHeading: "How EOR works",
  processLede:
    "You've made the hiring decision. We take it from offer letter to onboarded employee: visa-cleared, payroll-live, compliance-covered.",
  process: [
    {
      title: "Confirm the hire",
      copy: "You send us the offered package (base, allowances, benefits) and start date. We validate against local regulations and confirm feasibility.",
      tag: "Day 1",
    },
    {
      title: "Contract & visa",
      copy: "UAE: employment contract, entry visa, medical, Emirates ID, residence visa. India: appointment letter, PF/ESI enrolment, insurance.",
      tag: "Weeks 1–4",
    },
    {
      title: "Payroll goes live",
      copy: "Monthly payroll in local currency, WPS-compliant (UAE) or PF/TDS-compliant (India). Your invoice is a single service fee: one line item.",
      tag: "Month 1",
    },
    {
      title: "Ongoing employment",
      copy: "We handle appraisal support, leave tracking, statutory filings, insurance renewals, and off-boarding when the engagement ends.",
      tag: "Life of engagement",
    },
  ],
  rolesHeading: "Common EOR arrangements",
  roles: [
    "Programme leads relocating to Dubai",
    "SAP consultants in Bengaluru delivery centres",
    "India-based engineering benches",
    "UAE-based commercial hires",
    "Cross-region delivery teams",
    "Short-term specialist deployments (6–24 months)",
    "Founding country teams (pre-entity)",
    "Contractor-to-employee conversions",
  ],
  faqHeading: "EOR: common questions",
  faqs: [
    {
      /* TALENT HOSTING, added 1 Aug on Sumeet's brief. This is the half of the
         service the page never described: the client has already found the
         person and simply does not want them on their own payroll. Chalhoub and
         MAF run a lot of it, it is a major line in Saudi Arabia and the UAE, and
         it competes with TASC and UHRS rather than with the global EOR players. */
      q: "We have already found the person. Can you employ them and deploy them back to us?",
      a: "Yes. That is talent hosting, and it is a large part of what we do. You identify the consultant, we employ them and deploy them back to you, and you direct the work exactly as you would your own team. Two flavours. If the consultant already holds their own freelance visa we issue the work permit, onboard them, run payroll and manage them for the tenure. If they hold no visa we sponsor the visa and the permit in the country of deployment as well. Visa sponsorship is charged on actuals; onboarding, offboarding, payroll and management carry a flat fee.",
    },
    {
      q: "What is the difference between talent hosting and Employer of Record?",
      a: "The sourcing. Classic EOR is for hiring where you have no entity. We find or place the person and employ them for you. Talent hosting starts with a person you have already chosen. Everything downstream is the same: employment, visa where needed, payroll, compliance and end of service sit with us.",
    },
    {
      q: "What's the difference between EOR and contracting through Yallo?",
      a: "Contract through Yallo Contract if the engagement is short-term and specialist. Use EOR when you've made a hiring decision (contract or permanent-track) but don't have a local entity to employ the person yourself. EOR gives you the ongoing employment relationship without the entity overhead.",
    },
    {
      q: "How is the fee structured?",
      a: "Monthly service fee per employee, disclosed up-front. The employee's salary, benefits and statutory costs are separate line items on your invoice, no margin hidden inside the CTC.",
    },
    {
      q: "What visas can you sponsor in the UAE?",
      a: "Employment visas (2- and 3-year), Golden visas (where the employee qualifies), family sponsorship for dependents, and DIFC/ADGM special-zone visas depending on your location and cluster.",
    },
    {
      q: "Can we transition an EOR employee to our own entity later?",
      a: "Yes. When you set up your entity or the engagement changes, we run a clean transition: end-of-service processed on our side, new contract issued on yours, no gratuity or PF disruption for the employee.",
    },
    {
      q: "Do you handle India-specific compliance like PF and gratuity?",
      a: "Yes. Full PF, ESI, professional tax, gratuity accrual, statutory bonus and TDS handling: filed and paid on your behalf. Employees see their Form 16 at year-end.",
    },
    {
      q: "How long from offer letter to onboarded employee?",
      a: "UAE: typically 4–6 weeks depending on the free-zone visa track. India: 5–10 working days for a resident hire; 2–3 weeks with a new-hire background check.",
    },
  ],
  seo: {
    title: `Employer of Record · ${eorCountries.join(", ")} | Yallo Talent`,
    description: `Deploy talent into the ${eorCorridorProse} without a local entity. Employment, payroll and statutory compliance handled. You direct the work.`,
  },
};
