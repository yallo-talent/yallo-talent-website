import type { L1PageData } from "@/data/l1/types";

export const dataAiData: L1PageData = {
  slug: "data-ai",
  category: "capabilities",
  hue: "blue",
  breadcrumb: [
    { label: "Capabilities", href: "/capabilities" },
    { label: "Data & AI" },
  ],

  eyebrow: "Data & AI · Contract-first",
  title: "Data & AI contractors,",
  emphasis: "shortlisted in 72 hours.",
  sub: "Data engineers, ML/MLOps specialists, analytics engineers and applied AI architects for enterprise programmes across UK, ME and India. Architect-screened for implementation depth — not just certification badges.",
  heroImage:
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=2000&auto=format&fit=crop&q=80",
  heroImageAlt: "Analytics dashboard with data pipelines and charts",
  primaryCta: { label: "Send us a brief", href: "/brief" },
  secondaryCta: { label: "View expertise", href: "#expertise" },
  statusDots: [
    "72h brief to shortlist",
    "Active contractor bench",
    "UK · ME · India",
    "Contract · EOR · Subcontract",
  ],

  stats: [
    { n: "72h", l: "Brief to shortlist" },
    { n: "2:1", l: "CV to interview ratio" },
    { n: "10", l: "Data & AI function areas" },
    { n: "3", l: "Active delivery markets" },
  ],

  introEyebrow: "Why Yallo for Data & AI",
  introTitle:
    "Data & AI programmes stall when the platform depth isn't in the room.",
  introCopy: [
    "Every Snowflake migration, every dbt-driven analytics platform, every GenAI production rollout shares the same failure mode — the outcome depends on the depth of the specialist in the room. Recruiters place tool names. We place implementation track records.",
    "Our contractor bench is assessed by specialists who have built data platforms and shipped ML at enterprise scale. We screen for the specific operating context — high-throughput pipelines, regulated data domains, real-time inference, LLM safety — not just certification badges.",
  ],
  introStatCards: [
    {
      n: "72%",
      l: "of enterprises can't find the AI, ML and data specialists they need — the hardest talent gap on the market. (ManpowerGroup, 2026)",
    },
    {
      n: "4–6 wks",
      l: "Average time lost when a data engineer is placed without production-scale experience. Yallo's shortlist is in your inbox in 72h.",
    },
  ],

  scarceEyebrow: "Scarce talent · high demand",
  scarceTitle: "The Data & AI roles every enterprise programme fights over.",
  scarceCopy:
    "These are the specialists that appear on every AI, ML and data platform brief and disappear from the market fastest. Yallo maintains an active bench in each of these areas across UK, ME and India.",
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
  expertiseTitle:
    "Ten function areas — every enterprise Data & AI programme covered.",
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
      slug: "ml-engineering",
      num: "03",
      title: "ML Engineering & MLOps",
      icon: "spark",
      blurb: "Training pipelines, model serving and observability.",
      roles: ["ML Engineer", "MLOps Platform Engineer", "Model Serving Lead"],
    },
    {
      slug: "data-platform",
      num: "04",
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
      slug: "genai-engineering",
      num: "05",
      title: "GenAI Engineering",
      icon: "spark",
      blurb: "LLM apps, RAG systems, agentic workflows.",
      roles: [
        "LLM Application Engineer",
        "GenAI Solution Architect",
        "Prompt / Evals Engineer",
      ],
    },
    {
      slug: "data-governance",
      num: "06",
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
      num: "07",
      title: "Business Intelligence",
      icon: "analytics",
      blurb: "Power BI, Tableau, Looker — self-serve BI.",
      roles: ["BI Developer", "Power BI Architect", "Analytics Delivery Lead"],
    },
    {
      slug: "data-science",
      num: "08",
      title: "Data Science",
      icon: "spark",
      blurb: "Applied ML, forecasting and decisioning.",
      roles: ["Data Scientist", "Applied ML Scientist", "Decisioning Lead"],
    },
    {
      slug: "streaming-realtime",
      num: "09",
      title: "Real-time & Streaming",
      icon: "integration",
      blurb: "Kafka, Flink, event-driven architectures.",
      roles: [
        "Streaming Data Engineer",
        "Kafka Platform Lead",
        "Event Architect",
      ],
    },
    {
      slug: "ai-safety-governance",
      num: "10",
      title: "AI Safety & Governance",
      icon: "government",
      blurb: "Responsible AI, model risk and evals.",
      roles: [
        "AI Governance Lead",
        "Model Risk Analyst",
        "Responsible AI Architect",
      ],
    },
  ],

  segmentsEyebrow: "Where we deploy",
  segmentsTitle: "Every sector runs a Data & AI programme — we staff them all.",
  segmentsSub:
    "Retail personalisation, banking risk models, healthcare analytics or public-sector data platforms — same architect-screened bench, calibrated to your operating context.",
  segments: [
    {
      id: "retail",
      name: "Retail & Consumer",
      intro:
        "Personalisation, demand forecasting, real-time inventory intelligence and clienteling analytics for retail programmes.",
      image:
        "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Retail store interior",
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
      image:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Financial trading floor",
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
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Healthcare analytics dashboard",
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
      image:
        "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Government building",
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
      image:
        "https://images.unsplash.com/photo-1565034946487-077786996e27?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Manufacturing factory floor",
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
      image:
        "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Telecom network infrastructure",
      roles: [
        "Network Analytics Engineer",
        "Churn Prediction ML Lead",
        "Recommendation Engine Architect",
      ],
    },
  ],

  insightsEyebrow: "Insights",
  insightsTitle: "What's happening in Data & AI talent right now.",
  insightsSub:
    "Written by Sumeet Goenka and the Yallo team. Opinionated, specific, useful.",
  insights: [
    {
      href: "/insights/gcc-ai-skills-gap",
      category: "Talent",
      title: "How GCC enterprises are closing the AI skills gap.",
      excerpt:
        "AI, ML and data roles top the ManpowerGroup shortage index. Here's how the GCC's biggest enterprises are staffing them.",
      author: "Sumeet Goenka",
      minutes: 6,
      image:
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "AI abstract data visualisation",
    },
    {
      href: "/insights/genai-in-enterprise",
      category: "GenAI",
      title: "GenAI in the enterprise — beyond the demo.",
      excerpt:
        "The gap between an LLM prototype and a production system is a specialist bench most organisations don't have. What separates the shipping teams from the stuck ones.",
      author: "Sumeet Goenka",
      minutes: 8,
      image:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "AI neural network abstract",
    },
    {
      href: "/insights/data-platform-migration",
      category: "Data Platform",
      title: "Snowflake or Databricks? The wrong first question.",
      excerpt:
        "Platform choice matters less than the depth of your data engineering bench. A four-week Snowflake shortlist that ships beats a six-month Databricks bench that doesn't.",
      author: "Sumeet Goenka",
      minutes: 7,
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Analytics dashboard with market data",
    },
    {
      href: "/insights/mlops-cost-of-ignoring",
      category: "MLOps",
      title: "The cost of ignoring MLOps until year two.",
      excerpt:
        "Model drift, silent failures and shadow copies. What we've seen when MLOps is the last hire, not the first.",
      author: "Yallo Research",
      minutes: 5,
      image:
        "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "MLOps engineer at workstation",
    },
  ],

  partners: [
    "Snowflake",
    "Databricks",
    "Microsoft Fabric",
    "AWS",
    "Google Cloud",
    "dbt Labs",
    "Confluent",
    "Collibra",
  ],

  relatedTitle: "Related pages",
  related: [
    {
      href: "/capabilities/digital-devops",
      label: "Digital & DevOps",
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
      "Architect-screened Data & AI contractors — data engineering, ML/MLOps, GenAI, analytics platforms. 72h shortlist across UK, ME and India.",
  },
};
