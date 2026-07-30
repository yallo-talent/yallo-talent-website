import { globeIcon, handshakeIcon, shieldIcon } from "./icons";
import type { ServicePageData } from "./types";

export const eorData: ServicePageData = {
  slug: "eor",
  hue: "teal",
  eyebrow: "Employer of Record · UAE + India",
  title: "You choose the hire.",
  emphasis: "We carry the employment.",
  lede: "Found the specialist yourself? We handle the UAE visa or the India payroll. You direct the work, we hold the compliance — no local entity setup, no legal exposure.",
  heroStat: { n: "2", l: "regions · UAE + India" },
  primaryCta: { label: "Set up an EOR arrangement", href: "/brief" },
  secondaryCta: { label: "How it works", href: "/#how" },
  trustLine: "UAE visa · India payroll · full compliance · service-fee only",
  benefitsHeading: "What you get with Yallo EOR",
  benefits: [
    {
      title: "No entity setup required",
      copy: "Deploy talent into the UAE or India without spinning up a legal entity, opening bank accounts, or navigating local labour law.",
      icon: globeIcon,
    },
    {
      title: "Compliance on us",
      copy: "Visa sponsorship, work permits, PF/ESI, gratuity, insurance, and end-of-service — we handle every regulatory obligation.",
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
    "You've made the hiring decision. We take it from offer letter to onboarded employee — visa-cleared, payroll-live, compliance-covered.",
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
      copy: "Monthly payroll in local currency, WPS-compliant (UAE) or PF/TDS-compliant (India). Your invoice is a single service fee — one line item.",
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
  faqHeading: "EOR — common questions",
  faqs: [
    {
      q: "What's the difference between EOR and contracting through Yallo?",
      a: "Contract through Yallo Contract if the engagement is short-term and specialist. Use EOR when you've made a hiring decision (contract or permanent-track) but don't have a local entity to employ the person yourself. EOR gives you the ongoing employment relationship without the entity overhead.",
    },
    {
      q: "How is the fee structured?",
      a: "Monthly service fee per employee, disclosed up-front. The employee's salary, benefits and statutory costs are separate line items on your invoice — no margin hidden inside the CTC.",
    },
    {
      q: "What visas can you sponsor in the UAE?",
      a: "Employment visas (2- and 3-year), Golden visas (where the employee qualifies), family sponsorship for dependents, and DIFC/ADGM special-zone visas depending on your location and cluster.",
    },
    {
      q: "Can we transition an EOR employee to our own entity later?",
      a: "Yes. When you set up your entity or the engagement changes, we run a clean transition — end-of-service processed on our side, new contract issued on yours, no gratuity or PF disruption for the employee.",
    },
    {
      q: "Do you handle India-specific compliance like PF and gratuity?",
      a: "Yes. Full PF, ESI, professional tax, gratuity accrual, statutory bonus and TDS handling — filed and paid on your behalf. Employees see their Form 16 at year-end.",
    },
    {
      q: "How long from offer letter to onboarded employee?",
      a: "UAE: typically 4–6 weeks depending on the free-zone visa track. India: 5–10 working days for a resident hire; 2–3 weeks with a new-hire background check.",
    },
  ],
  seo: {
    title: "Employer of Record · UAE + India EOR | Yallo Talent",
    description:
      "Deploy talent into UAE and India without a local entity. UAE visa sponsorship, India payroll, statutory compliance — you direct the work.",
  },
};
