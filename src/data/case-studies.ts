export type CaseHue = "blue" | "green" | "orange" | "teal" | "violet" | "rose";

export interface CaseStudy {
  slug: string;
  hue: CaseHue;
  metric: string;
  metricAnimateTo?: number;
  metricSuffix?: string;
  meta: [string, string, string];
  tags: [string, string];
  title: string;
  desc: string;
  logo: string;
  quickStats: { n: string; l: string }[];
}

export const cases: CaseStudy[] = [
  {
    slug: "gcc-bank-sap-72h",
    hue: "blue",
    metric: "72h",
    metricAnimateTo: 72,
    metricSuffix: "h",
    meta: ["PERMANENT", "BANKING", "GCC"],
    tags: ["SAP", "Core Banking"],
    title: "Three SAP specialists, shortlisted in 72 hours",
    desc: "A GCC bank needed a core-banking programme staffed at pace. We calibrated the brief and returned an architect-screened shortlist within 72 hours — the team moved two candidates to offer.",
    logo: "TR",
    quickStats: [
      { n: "3", l: "shortlisted" },
      { n: "2", l: "to offer" },
      { n: "1", l: "week to placement" },
    ],
  },
  {
    slug: "uae-manufacturing-2to1",
    hue: "orange",
    metric: "2:1",
    meta: ["CONTRACT", "MANUFACTURING", "UAE"],
    tags: ["Blue Yonder", "Delivery"],
    title: "A delivery team staffed against a hard deadline",
    desc: "A manufacturing group had a fixed go-live and a gap in its delivery team. A calibrated contract shortlist — a 2:1 CV-to-interview ratio — put the right specialists on the programme in days, not weeks.",
    logo: "MG",
    quickStats: [
      { n: "5", l: "roles filled" },
      { n: "10d", l: "avg time-to-start" },
      { n: "0", l: "re-hires needed" },
    ],
  },
  {
    slug: "gcc-retail-oracle-cutover",
    hue: "rose",
    metric: "0",
    meta: ["MANAGED DELIVERY", "RETAIL", "GCC"],
    tags: ["Oracle", "Fusion"],
    title: "Oracle Fusion cutover, zero unplanned downtime",
    desc: "A regional retail group ran their Oracle Fusion cutover with Yallo Managed Delivery. Zero unplanned downtime and full sign-off from the finance function on go-live day.",
    logo: "RG",
    quickStats: [
      { n: "12", l: "specialists deployed" },
      { n: "0", l: "critical incidents" },
      { n: "90d", l: "brief to go-live" },
    ],
  },
  {
    slug: "india-engineering-bench",
    hue: "teal",
    metric: "35",
    meta: ["CONTRACT", "TECH", "INDIA"],
    tags: ["Cloud", "Data"],
    title: "35-strong engineering bench, spun up in 60 days",
    desc: "A UK-headquartered SaaS platform stood up a Bengaluru engineering bench through Yallo — 35 engineers across cloud, data and platform, active on delivery in eight weeks.",
    logo: "SP",
    quickStats: [
      { n: "35", l: "engineers hired" },
      { n: "8w", l: "start to active bench" },
      { n: "97%", l: "12-month retention" },
    ],
  },
];
