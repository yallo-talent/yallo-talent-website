/**
 * Hero copy and the four-entity strip.
 *
 * Three demand markets, four entities. There is no "three delivery regions"
 * claim, and India is framed as Global Capability Centre staffing for
 * multinationals — a demand market, never a supply or delivery function.
 */
import { metricValue } from "@/data/metrics.generated";

export const hero = {
  eyebrow: "Enterprise platform talent · Middle East · Europe · India",
  /** Split so the italic gold emphasis can carry the argument. "Enterprise"
      is carried by the eyebrow directly above — repeating it cost the H1 two
      extra lines and pushed the primary CTA below the fold at 1280×800. */
  headline: {
    lead: "Programmes rarely fail on budget. They fail on the",
    emphasis: "six people you couldn't find.",
  },
  /* Middle East and Europe lead; India is not in the headline corridor.
     Sumeet's positioning: those two are the customer corridor, and India appears
     only where it is materially true — capability centres, and the delivery
     bench behind them. Permanent hiring is global because the invoicing can run
     from the UAE entity, and that is stated where permanent is discussed rather
     than diluting the corridor here. */
  lede: "We staff and deliver enterprise platform programmes across the Middle East and Europe. SAP, Oracle, Microsoft, Salesforce. Screened by specialists, shortlisted in 72 hours.",
  pillars: ["Contract", "Permanent", "Employer of Record", "Managed Delivery"],
  primaryCta: { label: "Start a brief", href: "/brief" },
  secondaryCta: { label: "See how the screen works", href: "#screen" },
} as const;

export interface Entity {
  city: string;
  role: string;
}

export const entities: Entity[] = [
  { city: "London", role: "Europe and UK demand" },
  { city: "Dubai", role: "Regional headquarters" },
  { city: "Riyadh", role: "In-country Saudi entity" },
  { city: "Bengaluru", role: "India and capability centres" },
];

/**
 * The hero instrument. Illustrative — labelled as such, and containing no real
 * candidate data. Its job is to make 72 hours visible in the first viewport.
 */
export const instrument = {
  label: "Illustrative shortlist in progress",
  status: "Shortlist in progress",
  requisition: "S/4HANA FI/CO · Dubai",
  phases: [
    { key: "01", name: "Brief", state: "done" },
    { key: "02", name: "Calibrate", state: "done" },
    { key: "03", name: "Screen", state: "active" },
    { key: "04", name: "Shortlist", state: "pending" },
  ],
  candidates: [
    {
      name: "Candidate A",
      meta: "14 yrs · 4 full-cycle S/4 · in region",
      score: 94,
    },
    {
      name: "Candidate B",
      meta: "11 yrs · 3 full-cycle · retail depth",
      score: 88,
    },
    {
      name: "Candidate C",
      meta: "9 yrs · 2 full-cycle · EOR ready",
      score: 81,
    },
  ],
  screenedOut: {
    name: "17 screened out",
    meta: "Reasons attached to the shortlist",
  },
  /* Values from content/metrics.yaml via the generated client-safe module, round
     19 §5.1 — these three were typed here ("72h", "2:1", "80%") and the
     quarterly refresh could not reach them. The LABELS stay local and stay
     short: this strip sits inside the instrument panel where the canonical
     "Brief to shortlist" and "Contracts renewed" do not fit. The lookup key is
     the canonical label, so a refresh that renames a metric fails the build here
     rather than silently publishing a stale number. */
  footer: [
    { value: metricValue("Brief to shortlist"), label: "To shortlist" },
    { value: metricValue("CVs per interview"), label: "CVs per interview" },
    { value: metricValue("Contracts renewed"), label: "Renewed" },
  ],
} as const;

export const logoRail = {
  enterpriseLabel: "Enterprise programmes staffed for",
  /** Never describes the commercial arrangement. */
  integratorLabel:
    "The systems integrators delivering them come to us for specialists",
  /* Canon §8, amended 30 Jul: one continuous rail, the split surviving as data
     and one caption line — never as two walls. */
  mergedLabel: "Enterprise programmes staffed for",
  integratorCaption:
    "Including the systems integrators who come to us for specialists.",
} as const;
