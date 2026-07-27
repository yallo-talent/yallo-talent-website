import { boltIcon, clockIcon, shieldIcon } from "./icons";
import type { ServicePageData } from "./types";

export const contractData: ServicePageData = {
  slug: "contract",
  hue: "orange",
  eyebrow: "Contract Workforce · UK · ME · India",
  title: "Get contract specialists",
  emphasis: "on your programme in 72 hours.",
  lede: "When your programme has a delivery gap or a peak, get architect-screened contract talent — mobilised faster than a permanent hire, screened to the same bar.",
  heroImage:
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1100&q=80&auto=format&fit=crop",
  heroImageAlt: "Programme team collaborating on a delivery workstream",
  heroStat: { n: "72h", l: "brief to shortlist" },
  primaryCta: { label: "Send us a brief", href: "/brief" },
  secondaryCta: { label: "How it works", href: "/#how" },
  trustLine:
    "Architect-led · region-deep · same specialists we'd hire ourselves",
  benefitsHeading: "What you get with Yallo Contract",
  benefits: [
    {
      title: "Shortlist in 72 hours",
      copy: "You don't wait weeks on a search. A calibrated shortlist lands in your inbox within three working days of the brief.",
      icon: clockIcon,
    },
    {
      title: "Architect-screened, not keyword-matched",
      copy: "Every candidate is reviewed by operators who have shipped the same programmes you're running — depth checks before you ever see a CV.",
      icon: shieldIcon,
    },
    {
      title: "Mobilised in days, not months",
      copy: "Interviews to offer to onboarding — we handle the rate negotiation, contracts and start-date coordination so your delivery date holds.",
      icon: boltIcon,
    },
  ],
  processHeading: "How Contract works",
  processLede:
    "No CVs land in your inbox until we've calibrated to your programme. Every shortlist is reviewed by our architect team before you see it.",
  process: [
    {
      title: "Brief & calibrate",
      copy: "A short working session pins down the role, stack, delivery timeline and what 'good' looks like for your programme. No CVs discussed.",
      tag: "Day 1",
    },
    {
      title: "Architect-led screening",
      copy: "Our team assesses candidates for depth and delivery risk — not just keyword match. You review fits, not filler.",
      tag: "Days 1–3",
    },
    {
      title: "Shortlist delivered",
      copy: "3–5 architect-screened candidates in your inbox, each with reasoning on why they're a fit for your programme.",
      tag: "72h",
    },
    {
      title: "Interview, offer, onboard",
      copy: "We handle rate negotiation, contracts, notice periods and start-date logistics so you focus on delivery.",
      tag: "Week 1–2",
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
  faqHeading: "Contract — common questions",
  faqs: [
    {
      q: "How quickly can you actually mobilise a contractor?",
      a: "For most enterprise stacks (SAP, Oracle, Microsoft, Salesforce, Blue Yonder, Workday) we return a shortlist within 72 hours of the calibration call. Once you interview and select, we handle rate negotiation, contract issuance, and coordinate notice periods — most contractors are on-site within one to two weeks.",
    },
    {
      q: "What screening do you do before I see a CV?",
      a: "Each candidate is reviewed by our architect team — the same operators who have shipped enterprise programmes at Richemont, Landmark and Alshaya EMEA. We assess technical depth, prior delivery risk, cultural fit for your programme, and rate reasonableness. On average two to three candidates get through screening for every one you interview.",
    },
    {
      q: "Which regions do you cover?",
      a: "Active benches across the UK, the Middle East (UAE and KSA primarily), and India (Bengaluru, Pune, Mumbai). We can also place remote contractors into your programme where the engagement model supports it.",
    },
    {
      q: "How do you handle rate cards and margins?",
      a: "Transparent day rate on your invoice, with our margin disclosed up-front. No inflation between candidate rate and client rate — you see the whole stack.",
    },
    {
      q: "What if the contractor doesn't work out?",
      a: "We stand behind every placement. If a contractor isn't performing within the first four weeks, we run a replacement search on the same 72-hour SLA at no additional fee.",
    },
    {
      q: "Do you handle IR35 for UK placements?",
      a: "Yes. We work with an IR35-assured umbrella panel for UK inside-IR35 placements, and can advise on outside-IR35 determinations where appropriate. Compliance is on us.",
    },
  ],
  seo: {
    title: "Contract Workforce · Contractors in 72 hours | Yallo Talent",
    description:
      "Get architect-screened contract specialists on your enterprise programme in 72 hours. UK, ME and India — SAP, Oracle, Microsoft, Salesforce, Blue Yonder, Workday.",
  },
};
