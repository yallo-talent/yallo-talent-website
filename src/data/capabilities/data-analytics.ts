import type { L1PageData } from "@/data/l1/types";

export const dataAnalyticsData: L1PageData = {
  slug: "data-analytics",
  category: "capabilities",
  breadcrumb: [
    { label: "Capabilities", href: "/capabilities" },
    { label: "Data & Analytics" },
  ],

  eyebrow: "Data & Analytics · Contract-first",
  title: "Data and analytics contractors,",
  sectorNoun: "data and analytics",
  emphasis: "shortlisted in 72 hours.",
  sub: "Data engineers, analytics engineers, BI developers and migration leads for enterprise programmes across the Middle East, Europe and India. Specialist-screened for implementation depth — not just certification badges. AI roles have their own practice.",
  primaryCta: { label: "Send us a brief", href: "/brief" },
  secondaryCta: { label: "View expertise", href: "#expertise" },
  statusDots: [
    "72h brief to shortlist",
    "Active contractor bench",
    "Middle East · Europe · India",
    "Contract · EOR · Managed Delivery",
  ],

  introEyebrow: "Why Yallo for Data & AI",
  introTitle:
    "Data & AI programmes stall when the platform depth isn't in the room.",
  introCopy: [
    "Every Snowflake migration, every dbt-driven analytics platform, every GenAI production rollout shares the same failure mode — the outcome depends on the depth of the specialist in the room. Recruiters place tool names. We place implementation track records.",
    "Our contractor bench is assessed by specialists who have built data platforms and shipped ML at enterprise scale. We screen for the specific operating context — high-throughput pipelines, regulated data domains, real-time inference, LLM safety — not just certification badges.",
  ],
  /**
   * One card, and the second is deleted rather than replaced.
   *
   * The 72% claim was a MISCITATION. ManpowerGroup's figure is that 72% of
   * employers cannot find the skilled talent they need in general, with AI, IT
   * and data among the hardest categories to fill; this page had narrowed it to
   * "72% of enterprises can't find the AI, ML and data specialists they need",
   * which is a different and stronger claim than the source makes. The wording
   * below is the one already ratified for the same figure in
   * src/data/home/personas.ts, so the two surfaces can no longer drift.
   *
   * The "4–6 wks average time lost" card is removed outright. No source exists
   * for it anywhere in the repo or the legacy corpus — it was a figure with the
   * authority of data and nothing behind it. QUESTIONS.md Q12.
   */
  introStatCards: [
    {
      n: "72%",
      l: "of employers can't find the skilled talent they need — with AI, IT and data roles now the hardest to fill.",
      source: "ManpowerGroup Talent Shortage Survey, 2026",
    },
  ],

  scarceEyebrow: "Scarce talent · high demand",
  scarceTitle: "The Data & AI roles every enterprise programme fights over.",
  scarceCopy:
    "These are the specialists that appear on every AI, ML and data platform brief and disappear from the market fastest. Yallo maintains an active bench in each of these areas across the Middle East, Europe and India.",
  scarceCta: { label: "Brief us on a scarce role", href: "/brief" },
  scarceRoles: [
    {
      name: "LLM Application Engineer",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "MLOps Platform Lead",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "Data Platform Architect (Snowflake / Databricks)",
      scarcity: "high",
      engagement: "contract-perm",
    },
    {
      name: "GenAI Solution Architect",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "Real-time / Streaming Data Engineer (Kafka / Flink)",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "Analytics Engineering Lead (dbt)",
      scarcity: "high",
      engagement: "contract-perm",
    },
    {
      name: "AI Safety / Responsible AI Lead",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "Data Governance Architect (Collibra / Alation)",
      scarcity: "med",
      engagement: "contract",
    },
  ],

  expertiseEyebrow: "Our expertise",
  expertiseTitle: "Every data discipline, with a contractor bench behind it.",
  expertiseSub:
    "From ingestion to inference — specialists we place into every function that moves a Data & AI programme forward.",
  expertise: [
    {
      slug: "data-engineering",
      num: "01",
      title: "Data Engineering",
      icon: "dataAi",
      blurb: "Pipelines, warehousing, batch and streaming.",
      roles: [
        "Senior Data Engineer",
        "Streaming Data Engineer",
        "Pipeline Reliability Lead",
      ],
    },
    {
      slug: "analytics-engineering",
      num: "02",
      title: "Analytics Engineering",
      icon: "analytics",
      blurb: "dbt, semantic layers, self-serve modelling.",
      roles: ["Analytics Engineer", "dbt Lead", "Semantic Layer Architect"],
    },
    {
      slug: "data-platform",
      num: "03",
      title: "Data Platform & Lakehouse",
      icon: "cloud",
      blurb: "Snowflake, Databricks, BigQuery, Fabric.",
      roles: [
        "Data Platform Architect",
        "Snowflake Lead",
        "Databricks Solution Architect",
      ],
    },
    {
      slug: "data-governance",
      num: "04",
      title: "Data Governance & MDM",
      icon: "mdm",
      blurb: "Catalogue, lineage, quality and stewardship.",
      roles: [
        "Data Governance Architect",
        "Collibra Consultant",
        "Master Data Lead",
      ],
    },
    {
      slug: "business-intelligence",
      num: "05",
      title: "Business Intelligence",
      icon: "analytics",
      blurb: "Power BI, Tableau, Looker — self-serve BI.",
      roles: ["BI Developer", "Power BI Architect", "Analytics Delivery Lead"],
    },
    {
      slug: "streaming-realtime",
      num: "06",
      title: "Real-time & Streaming",
      icon: "integration",
      blurb: "Kafka, Flink, event-driven architectures.",
      roles: [
        "Streaming Data Engineer",
        "Kafka Platform Lead",
        "Event Architect",
      ],
    },
  ],

  segmentsEyebrow: "Where we deploy",
  segmentsTitle: "Every sector runs a data programme — we staff them all.",
  segmentsSub:
    "Retail personalisation, banking risk models, healthcare analytics or public-sector data platforms — same specialist-screened bench, calibrated to your operating context.",
  segments: [
    {
      id: "retail",
      name: "Retail & Consumer",
      intro:
        "Personalisation, demand forecasting, real-time inventory intelligence and clienteling analytics for retail programmes.",
      roles: [
        "Customer 360 Data Engineer",
        "Demand Forecasting Scientist",
        "Personalisation ML Engineer",
      ],
    },
    {
      id: "finance",
      name: "Banking & Financial Services",
      intro:
        "Risk models, fraud detection, regulatory analytics and open-banking data platforms for financial services programmes.",
      roles: [
        "Risk Model Engineer",
        "Fraud Detection ML Lead",
        "Regulatory Analytics Architect",
      ],
    },
    {
      id: "healthcare",
      name: "Healthcare & Life Sciences",
      intro:
        "Clinical data platforms, HL7/FHIR pipelines, real-world evidence analytics and pharmaceutical R&D data science.",
      roles: [
        "Clinical Data Engineer",
        "HL7 / FHIR Integration Lead",
        "Real-world Evidence Scientist",
      ],
    },
    {
      id: "government",
      name: "Public Sector",
      intro:
        "Government data platforms, service analytics, fraud and compliance modelling for central and local government.",
      roles: [
        "Government Data Platform Lead",
        "Service Analytics Engineer",
        "Compliance ML Analyst",
      ],
    },
    {
      id: "manufacturing",
      name: "Manufacturing & Logistics",
      intro:
        "IIoT payloads, predictive maintenance, demand forecasting and factory-floor analytics for manufacturing programmes.",
      roles: [
        "IIoT Data Engineer",
        "Predictive Maintenance Scientist",
        "Supply Chain Analytics Lead",
      ],
    },
    {
      id: "telco",
      name: "Telco & Media",
      intro:
        "Network analytics, churn modelling, subscriber intelligence and content recommendation engines for telco and media.",
      roles: [
        "Network Analytics Engineer",
        "Churn Prediction ML Lead",
        "Recommendation Engine Architect",
      ],
    },
  ],

  insightsEyebrow: "Insights",
  insightsTitle: "What's happening in data and analytics talent right now.",
  insightsSub:
    "Specific, sourced, and written for the person doing the hiring.",
  insights: [
    {
      href: "/insights/data-engineer-uae-ai-programmes",
      category: "Talent",
      title: "Why data engineers are becoming the backbone of AI programmes.",
      excerpt:
        "The AI roadmap stalls on the pipeline long before it stalls on the model. Where the scarcity actually sits.",
      author: "Yallo Talent",
      minutes: 6,
      /* Non-interactive: the whole legacy insight family is unpublished per
         Relay v2.2 §2, so this card must not link to a 404. The dead-href gate
         caught it — the only link the unpublishing broke. */
      published: false,
    },
    {
      href: "/insights/genai-in-enterprise",
      published: false,
      category: "GenAI",
      title: "GenAI in the enterprise — beyond the demo.",
      excerpt:
        "The gap between an LLM prototype and a production system is a specialist bench most organisations don't have. What separates the shipping teams from the stuck ones.",
      author: "Yallo Talent",
      minutes: 8,
    },
    {
      href: "/insights/data-platform-migration",
      published: false,
      category: "Data Platform",
      title: "Snowflake or Databricks? The wrong first question.",
      excerpt:
        "Platform choice matters less than the depth of your data engineering bench. A four-week Snowflake shortlist that ships beats a six-month Databricks bench that doesn't.",
      author: "Yallo Talent",
      minutes: 7,
    },
    {
      href: "/insights/mlops-cost-of-ignoring",
      published: false,
      category: "MLOps",
      title: "The cost of ignoring MLOps until year two.",
      excerpt:
        "Model drift, silent failures and shadow copies. What we've seen when MLOps is the last hire, not the first.",
      author: "Yallo Talent",
      minutes: 5,
    },
  ],

  relatedTitle: "Related pages",
  related: [
    {
      href: "/capabilities/devops-platform-engineering",
      label: "DevOps & Platform Engineering",
      category: "Capability",
    },
    {
      href: "/capabilities/cloud-infrastructure",
      label: "Cloud & Infrastructure",
      category: "Capability",
    },
    {
      href: "/capabilities/integration-middleware",
      label: "Integration & Middleware",
      category: "Capability",
    },
    { href: "/platforms/sap", label: "SAP", category: "Platform" },
    { href: "/platforms/oracle", label: "Oracle", category: "Platform" },
    {
      href: "/platforms/salesforce",
      label: "Salesforce",
      category: "Platform",
    },
    {
      href: "/industries/finance",
      label: "Banking & Financial Services",
      category: "Industry",
    },
    {
      href: "/industries/retail",
      label: "Retail & Consumer",
      category: "Industry",
    },
  ],

  seo: {
    title: "Data & AI Contractors · Yallo Talent",
    description:
      "Specialist-screened Data & AI contractors — data engineering, ML/MLOps, GenAI, analytics platforms. 72h shortlist across the Middle East, Europe and India.",
  },
};
