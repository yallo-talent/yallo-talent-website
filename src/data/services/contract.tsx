import { metricValue } from "@/data/metrics.generated";
import { boltIcon, clockIcon, shieldIcon } from "./icons";
import type { ServicePageData } from "./types";

export const contractData: ServicePageData = {
  slug: "contract",
  eyebrow: "Contract Workforce · Middle East · Europe · India",
  title: "Get contract specialists",
  emphasis: "shortlisted in 72 hours.",
  lede: "When your programme has a delivery gap or a peak, get specialist-screened contract talent: mobilised faster than a permanent hire, screened to the same bar.",
  heroStat: { n: metricValue("Brief to shortlist"), l: "brief to shortlist" },
  primaryCta: { label: "Send us a brief", href: "/brief" },
  secondaryCta: { label: "How it works", href: "/#how" },
  trustLine:
    "Specialist-led · region-deep · same specialists we'd hire ourselves",
  audienceLabel: "Who this is for",
  audience: [
    "Delivery Directors closing a named skills gap on a live programme",
    "PMO Directors with an open seat showing red on the status pack",
    "Practice Leads who need specialist depth their own bench doesn't have",
  ],
  benefitsHeading: "What you get with Yallo Contract",
  benefits: [
    {
      title: "Shortlist in 72 hours",
      copy: "You don't wait weeks on a search. A calibrated shortlist lands in your inbox within three working days of the brief.",
      icon: clockIcon,
    },
    {
      title: "Specialist-screened, not keyword-matched",
      copy: "Every candidate is reviewed by specialists who have shipped the same programmes you're running: depth checks before you ever see a CV.",
      icon: shieldIcon,
    },
    {
      title: "Mobilised in days, not months",
      copy: "Interviews to offer to onboarding. We handle the rate negotiation, contracts and start-date coordination so your delivery date holds.",
      icon: boltIcon,
    },
  ],
  processHeading: "How Contract works",
  processLede:
    "No CVs land in your inbox until we've calibrated to your programme. Every shortlist is reviewed by our specialist team before you see it.",
  process: [
    {
      title: "Brief & calibrate",
      copy: "A short working session pins down the role, stack, delivery timeline and what 'good' looks like for your programme. No CVs discussed.",
      tag: "Day 1",
    },
    {
      title: "Specialist-led screening",
      copy: "Our team assesses candidates for depth and delivery risk, not just keyword match. You review fits, not filler.",
      tag: "Days 1–3",
    },
    {
      title: "Shortlist delivered",
      copy: "3–5 specialist-screened candidates in your inbox, each with reasoning on why they're a fit for your programme.",
      tag: metricValue("Brief to shortlist"),
    },
    {
      title: "Interview, offer, onboard",
      copy: "We handle rate negotiation, contracts, notice periods and start-date logistics so you focus on delivery.",
      tag: "Week 1–2",
    },
  ],
  boundaryHeading: "Where Contract ends",
  boundary:
    "Contract closes a defined gap for a defined term. When the person is meant to stay, that's Permanent. When you've made the hire but have no local entity to employ them, that's Employer of Record. When what you need is an outcome delivered rather than people supplied, that's Managed Delivery.",
  proofHeading: "Proof, from Contract engagements",
  proof: [
    {
      title: "Staffing Wipro's SAP S/4HANA programme for Al Tayer Group",
      client: "Al Tayer Group",
      href: "/case-studies/enabling-sap-s-4hana-transformation-for-al-tayer-group",
      excerpt:
        "Wipro needed niche SAP S/4HANA specialists onsite, fast, across CAR, GRC, SAC, SD, MM, FICO and Group Reporting for the Al Tayer programme. Yallo supplied high-quality consultants and managed delivery quality throughout.",
    },
    {
      title: "Scaling Alshaya's Azure data platform delivery team",
      client: "Alshaya Group",
      href: "/case-studies/enabling-azure-data-platform-delivery-at-enterprise-scale",
      excerpt:
        "Alshaya needed Azure data engineers mobilised fast for a new platform, with architecture kept sound and team size flexible by phase. Yallo assembled the team, added architecture oversight and scaled with each milestone.",
    },
  ],
  rolesHeading: "Contract roles we place",
  roles: [
    "SAP FICO Functional Consultant",
    "SAP S/4HANA Technical Architect",
    "Oracle Fusion Consultant",
    "Salesforce Commerce Architect",
    "Blue Yonder WMS Specialist",
    "Workday HCM Lead",
    "Programme Manager",
    "Delivery Manager",
    "Cloud Solutions Architect",
    "Data Engineering Lead",
    "DevOps / Platform Engineer",
    "Integration Architect",
    "Business Analyst",
    "Change & Adoption Lead",
    "Test Manager",
  ],
  faqHeading: "Contract: common questions",
  faqs: [
    {
      q: "How quickly can you actually mobilise a contractor?",
      a: "For most enterprise stacks (SAP, Oracle, Microsoft, Salesforce, Blue Yonder, Workday) we return a shortlist within 72 hours of the calibration call. Once you interview and select, we handle rate negotiation, contract issuance, and coordinate notice periods: most contractors are on-site within one to two weeks.",
    },
    {
      q: "What screening do you do before I see a CV?",
      a: "Each candidate is reviewed by a specialist who has shipped the same kind of programme. We assess technical depth, prior delivery risk, cultural fit for your programme, and rate reasonableness. On average two to three candidates get through screening for every one you interview.",
    },
    {
      q: "Which regions do you cover?",
      a: "Active benches across the UK, the Middle East (UAE and Saudi Arabia primarily), and India (Bengaluru, Pune, Mumbai). We can also place remote contractors into your programme where the engagement model supports it.",
    },
    {
      q: "How do you handle rate cards and margins?",
      a: "Transparent day rate on your invoice, with our margin disclosed up-front. No inflation between candidate rate and client rate. You see the whole stack.",
    },
    {
      q: "What if the contractor doesn't work out?",
      a: "We stand behind every placement. If a contractor isn't performing, we run a replacement search on the same 72-hour SLA at no additional fee.",
    },
    {
      q: "Do you handle IR35 for UK placements?",
      a: "Yes. We work with an IR35-assured umbrella panel for UK inside-IR35 placements, and can advise on outside-IR35 determinations where appropriate. Compliance is on us.",
    },
  ],
  seo: {
    title: "Contract Workforce · Shortlists in 72 hours | Yallo Talent",
    description:
      "Specialist-screened contract specialists for your enterprise programme, shortlisted in 72 hours. The Middle East, Europe and India: SAP, Oracle, Microsoft, Salesforce, Blue Yonder, Workday.",
  },
};
