import { metricValue } from "@/data/metrics.generated";
import { layersIcon, shieldIcon, usersIcon } from "./icons";
import type { ServicePageData } from "./types";

export const permanentData: ServicePageData = {
  slug: "permanent",
  eyebrow: "Permanent Hiring · Middle East · Europe · India",
  title: "Build your permanent bench",
  emphasis: "with specialists placed to stay.",
  lede: "For the programme-critical roles you need long-term: specialist-vetted, retention-minded, and matched to the delivery outcomes your team is on the hook for.",
  heroStat: { n: metricValue("CVs per interview"), l: "CV-to-interview ratio" },
  primaryCta: { label: "Discuss a permanent hire", href: "/brief" },
  secondaryCta: { label: "How it works", href: "/#how" },
  trustLine:
    "Same 72h SLA as contract · specialist-vetted for stay-power · region-deep",
  audienceLabel: "Who this is for",
  audience: [
    "CIOs and Heads of Delivery building the leadership bench for a multi-year programme",
    "Heads of Talent Acquisition who need specialist-vetted fits, not CV volume",
  ],
  benefitsHeading: "What you get with Yallo Permanent",
  benefits: [
    {
      title: "Fits, not filler",
      copy: "A 2:1 CV-to-interview ratio means your hiring managers only meet candidates worth their time, no more sifting piles of misaligned CVs.",
      icon: shieldIcon,
    },
    {
      title: "Depth over volume",
      copy: "We calibrate to your team's delivery style, tech stack, and cultural fit, not just to a job spec keyword list.",
      icon: layersIcon,
    },
    {
      title: "Retention-focused matching",
      copy: "We ask candidates how they think about staying, growing and shipping, screening out the mercenaries before they land in your inbox.",
      icon: usersIcon,
    },
  ],
  processHeading: "How Permanent works",
  processLede:
    "The same 72-hour brief-to-shortlist rigour we apply to contract, for the permanent roles that matter most to your programme.",
  process: [
    {
      title: "Brief & calibrate",
      copy: "Working session to define the role, the delivery outcomes, the growth path, and what 'success at 12 months' looks like.",
      tag: "Day 1",
    },
    {
      title: "Specialist-led screening",
      copy: "We sift the market against your calibration, not the JD. Every candidate is depth-tested against the role by a specialist who has held it.",
      tag: "Days 1–3",
    },
    {
      title: "Shortlist delivered",
      copy: "3–5 candidates worth interviewing, each with detailed reasoning, not a CV dump.",
      tag: metricValue("Brief to shortlist"),
    },
    {
      title: "Interview, offer, onboard",
      copy: "We manage the interview loop scheduling, offer negotiation, resignations, and first-day logistics.",
      tag: "Weeks 2–8",
    },
  ],
  boundaryHeading: "Where Permanent ends",
  boundary:
    "Permanent is for the roles that must outlast any single programme: leadership, architecture, product ownership. When the need has a defined term and a defined end, that's Contract. When you've made the hire but have no local entity to employ them, that's Employer of Record.",
  rolesHeading: "Permanent roles we place",
  roles: [
    "Chief Information Officer",
    "IT Director",
    "Enterprise Architect",
    "Head of Delivery",
    "Head of Data",
    "SAP Programme Director",
    "Salesforce Practice Lead",
    "Cloud Platform Lead",
    "Cybersecurity Lead",
    "AI / Data Science Lead",
    "Product Manager (Platform)",
    "Delivery Manager",
    "Engineering Manager",
    "Change & Transformation Director",
  ],
  faqHeading: "Permanent: common questions",
  faqs: [
    {
      q: "How is Yallo different from a traditional search firm?",
      a: "Traditional recruiters send you volume. We send you fits. Every candidate is reviewed by architects who have run the role themselves. You interview two people who could do the job, not ten who couldn't.",
    },
    {
      q: "When should I use Permanent vs Contract?",
      a: "Permanent for roles that are core to your programme long-term: leadership, architecture, product ownership. Contract for delivery peaks, specialist skills you don't hold in-house, and fixed-term programmes.",
    },
    {
      q: "What's your fee model?",
      a: "Fixed retained fee or contingent placement, transparent up-front.",
    },
    {
      q: "Which regions do you cover?",
      a: "UK, Middle East (UAE and Saudi Arabia), and India (Bengaluru, Pune, Mumbai). We support relocation and visa cover through Yallo EOR where needed.",
    },
    {
      q: "How long from brief to signed offer?",
      a: "72 hours to shortlist. Typical time-to-signed-offer is 3–6 weeks depending on interview loop and notice periods. Faster if your interview panel moves quickly.",
    },
    {
      q: "Do you handle counter-offers and negotiations?",
      a: "Yes. We position the role, brief candidates on the compensation window early, and manage counter-offer scenarios before they escalate.",
    },
  ],
  seo: {
    title: "Permanent Hiring · Enterprise IT Specialists | Yallo Talent",
    description:
      "Specialist-vetted permanent enterprise IT hires with a 2:1 CV-to-interview ratio. Placed to stay. Middle East, Europe, India: SAP, Oracle, Microsoft and more.",
  },
};
