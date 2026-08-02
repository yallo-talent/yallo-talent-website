import { taxonomyLabels } from "@/data/l1/index";
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
  sub: "Data engineers, analytics engineers, BI developers and migration leads for enterprise programmes across the Middle East, Europe and India. Specialist-screened for implementation depth, not for certification badges. Agentic AI, LLM and MLOps roles are a separate discipline: see AI Talent.",
  primaryCta: { label: "Send us a brief", href: "/brief" },
  secondaryCta: { label: "View expertise", href: "#expertise" },
  statusDots: [
    "72h brief to shortlist",
    "Active contractor bench",
    "Middle East · Europe · India",
    "Contract · EOR · Managed Delivery",
  ],

  /* "Data & AI" is the specialist DESK, renamed by Relay v6.0 and correct on the
     platform side. This is the DISCIPLINE, and it is Data & Analytics. The desk
     name had leaked into six strings on this file and into the taxonomy index,
     which put it on the rendered page thirteen times. See src/data/l1/index.ts
     for the class-level fix and scripts/check-taxonomy.mjs for the guard. */
  introEyebrow: "Why us for Data & Analytics",
  introTitle:
    "Data and analytics programmes stall when the platform depth isn't in the room.",
  introCopy: [
    "Every Snowflake migration, every dbt-driven analytics platform, every warehouse consolidation shares the same failure mode: the outcome depends on the depth of the specialist in the room. Recruiters place tool names. We place implementation track records.",
    "Our contractor bench is assessed by specialists who have built data platforms at enterprise scale. We screen for the specific operating context, whether that is high-throughput pipelines, regulated data domains, a semantic layer several hundred models deep, or a migration running against a live reporting estate.",
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
  scarceTitle:
    "The data and analytics roles every enterprise programme fights over.",
  scarceCopy:
    "These are the specialists that appear on every data platform and analytics brief and disappear from the market fastest. Yallo maintains an active bench in each of these areas across the Middle East, Europe and India.",
  scarceCta: { label: "Brief us on a scarce role", href: "/brief" },
  /**
   * Four AI roles moved out of this list, to AI Talent.
   *
   * LLM Application Engineer, MLOps Platform Lead, GenAI Solution Architect and
   * AI Safety / Responsible AI Lead were half of this desk's scarce list while AI
   * was folded into it. AI Talent is now the seventh discipline and holds them, so
   * leaving them here would have the two rows competing for the same brief.
   *
   * Nothing is invented to backfill: every replacement is a role this page already
   * publishes in its own expertise grid below.
   */
  scarceRoles: [
    {
      name: "Data Platform Architect (Snowflake / Databricks)",
      scarcity: "high",
      engagement: "contract-perm",
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
      name: "Semantic Layer Architect",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "SAP Datasphere Engineer",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "BW/4HANA Modeller",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "Data Governance Architect (Collibra / Alation)",
      scarcity: "med",
      engagement: "contract",
    },
    {
      name: "Master Data Lead",
      scarcity: "med",
      engagement: "contract",
    },
  ],

  expertiseEyebrow: "Our expertise",
  expertiseTitle: "Every data discipline, with a contractor bench behind it.",
  expertiseSub:
    "From ingestion to the semantic layer, specialists we place into every function that moves a data and analytics programme forward.",
  /**
   * S3, the depth gap, measured rather than asserted.
   *
   * `retail.ts` populates `overview` and `tools` on all twenty of its expertise
   * cards. This file populated neither on any of its seven, so every capability L2
   * opened with a one-line blurb where a sector L2 opens with a paragraph and a
   * vendor band: 14KB of data against retail's 51KB, and the thinness Sumeet
   * reported was that difference rendered.
   *
   * An earlier pass declined to author these, on the correct ground that the only
   * source for capability tool names was a three-year-old workbook and a `tools`
   * array asserts that we staff that tool on that discipline. That objection is
   * answered rather than overruled: every product below is already published in
   * this file's own blurbs, so promoting it into `tools` adds no claim the page did
   * not already make, and the L2 band carries the same "screened against, not
   * delivered on" framing the AI stack matrix uses. Nothing here is new
   * information; it is information the page already had, structured so the L2 can
   * render it.
   */
  expertise: [
    {
      slug: "data-engineering",
      num: "01",
      title: "Data Engineering",
      icon: "dataAi",
      blurb: "Pipelines, warehousing, batch and streaming.",
      overview:
        "The pipeline is where a data programme is actually won or lost. Ingestion from source systems that were never designed to be read at volume, transformation that has to survive a schema change upstream, and a warehouse load that has to finish before the business opens. We screen data engineers on what happens when a pipeline fails at 03:00, not on which tools appear on the CV: idempotent reloads, backfill strategy, cost per run, and whether they have owned the on-call rota for something they built.",
      roles: [
        "Senior Data Engineer",
        "Streaming Data Engineer",
        "Pipeline Reliability Lead",
      ],
      tools: [
        {
          slug: "snowflake",
          vendor: "Snowflake",
          name: "Snowflake",
          roles: [
            "Senior Data Engineer",
            "Snowflake Lead",
            "Data Platform Architect",
            "Migration Lead",
          ],
        },
        {
          slug: "databricks",
          vendor: "Databricks",
          name: "Databricks",
          roles: [
            "Senior Data Engineer",
            "Databricks Solution Architect",
            "Lakehouse Engineer",
            "Spark Engineer",
          ],
        },
        {
          slug: "airflow",
          vendor: "Apache",
          name: "Apache Airflow",
          roles: [
            "Senior Data Engineer",
            "Pipeline Reliability Lead",
            "Orchestration Engineer",
          ],
        },
      ],
    },
    {
      slug: "analytics-engineering",
      num: "02",
      title: "Analytics Engineering",
      icon: "analytics",
      blurb: "dbt, semantic layers, self-serve modelling.",
      overview:
        "Analytics engineering is the discipline that stops a warehouse becoming a second set of spreadsheets. Modelled, tested, documented transformations, and one definition of revenue that finance and operations both recognise. The screen is for modelling judgement rather than tool familiarity: how they decide what belongs in a shared model against a mart, how they handle a metric two departments define differently, and whether their tests catch a silent break before a dashboard does.",
      roles: ["Analytics Engineer", "dbt Lead", "Semantic Layer Architect"],
      tools: [
        {
          slug: "dbt",
          vendor: "dbt Labs",
          name: "dbt",
          roles: [
            "Analytics Engineer",
            "dbt Lead",
            "Analytics Engineering Lead",
            "Data Modeller",
          ],
        },
        {
          slug: "semantic-layer",
          vendor: "Semantic layer",
          name: "Semantic layer and metrics modelling",
          roles: [
            "Semantic Layer Architect",
            "Analytics Engineer",
            "Metrics Lead",
          ],
        },
      ],
    },
    {
      slug: "data-platform",
      num: "03",
      title: "Data Platform & Lakehouse",
      icon: "cloud",
      blurb: "Snowflake, Databricks, BigQuery, Fabric.",
      overview:
        "The platform decision is usually made before we are called, and it matters less than the depth of the bench behind it. What we screen for is the work that follows the decision: storage and compute separation that does not surprise finance, a permissions model that survives an audit, workload isolation so one analyst's query cannot slow a nightly load, and a migration path off whatever the estate runs today without a reporting blackout.",
      roles: [
        "Data Platform Architect",
        "Snowflake Lead",
        "Databricks Solution Architect",
      ],
      tools: [
        {
          slug: "snowflake-platform",
          vendor: "Snowflake",
          name: "Snowflake",
          roles: [
            "Data Platform Architect",
            "Snowflake Lead",
            "Warehouse Migration Lead",
          ],
        },
        {
          slug: "databricks-platform",
          vendor: "Databricks",
          name: "Databricks Lakehouse",
          roles: [
            "Databricks Solution Architect",
            "Lakehouse Engineer",
            "Data Platform Architect",
          ],
        },
        {
          slug: "bigquery",
          vendor: "Google Cloud",
          name: "BigQuery",
          roles: ["Data Platform Architect", "Analytics Engineer"],
        },
        {
          slug: "microsoft-fabric",
          vendor: "Microsoft",
          name: "Microsoft Fabric",
          roles: [
            "Data Platform Architect",
            "Fabric Engineer",
            "Power BI Architect",
          ],
        },
      ],
    },
    {
      slug: "data-governance",
      num: "04",
      title: "Data Governance & MDM",
      icon: "mdm",
      blurb: "Catalogue, lineage, quality and stewardship.",
      overview:
        "Governance is the function most often bought as a tool and staffed last, which is why so many catalogues are populated once and never trusted again. The roles that make it hold are operational rather than advisory: someone who can define ownership a business unit will actually accept, write quality rules against a domain they understand, and run a stewardship forum that survives its third month. We screen for that, and for whether they have governed data in a regulated domain rather than described how they would.",
      roles: [
        "Data Governance Architect",
        "Collibra Consultant",
        "Master Data Lead",
      ],
      tools: [
        {
          slug: "collibra",
          vendor: "Collibra",
          name: "Collibra",
          roles: [
            "Collibra Consultant",
            "Data Governance Architect",
            "Data Steward Lead",
          ],
        },
        {
          slug: "alation",
          vendor: "Alation",
          name: "Alation",
          roles: ["Data Governance Architect", "Catalogue Consultant"],
        },
        {
          slug: "informatica-mdm",
          vendor: "Informatica",
          name: "Informatica MDM",
          roles: [
            "Master Data Lead",
            "MDM Developer",
            "Data Quality Consultant",
          ],
        },
      ],
    },
    {
      slug: "business-intelligence",
      num: "05",
      title: "Business Intelligence",
      icon: "analytics",
      blurb: "Power BI, Tableau, Looker and self-serve BI.",
      overview:
        "BI is judged on adoption, not on the number of reports delivered. The work that decides it is unglamorous: a model that performs at the row counts the business actually has, row-level security that matches the org chart, and a decision about what stays curated against what genuinely goes self-serve. We screen BI developers on performance tuning and on how they handle the request for a report that should not exist, which is the conversation that separates a BI lead from a report writer.",
      roles: ["BI Developer", "Power BI Architect", "Analytics Delivery Lead"],
      tools: [
        {
          slug: "power-bi",
          vendor: "Microsoft",
          name: "Power BI",
          roles: [
            "Power BI Architect",
            "BI Developer",
            "DAX Specialist",
            "Analytics Delivery Lead",
          ],
        },
        {
          slug: "tableau",
          vendor: "Tableau",
          name: "Tableau",
          roles: ["BI Developer", "Tableau Consultant", "Visualisation Lead"],
        },
        {
          slug: "looker",
          vendor: "Google Cloud",
          name: "Looker",
          roles: ["BI Developer", "LookML Developer", "Analytics Engineer"],
        },
      ],
    },
    {
      slug: "streaming-realtime",
      num: "06",
      title: "Real-time & Streaming",
      icon: "integration",
      blurb: "Kafka, Flink, event-driven architectures.",
      overview:
        "Real-time is the area where the gap between a demonstration and a production system is widest, and where a mis-hire is most expensive. Exactly-once semantics, ordering guarantees, replay after an outage, schema evolution on a topic three teams consume, and a back-pressure story that does not end in data loss. We screen for people who have run a stream in production and can describe what broke, because everything else in this area interviews well.",
      roles: [
        "Streaming Data Engineer",
        "Kafka Platform Lead",
        "Event Architect",
      ],
      tools: [
        {
          slug: "kafka",
          vendor: "Apache",
          name: "Apache Kafka and Confluent",
          roles: [
            "Kafka Platform Lead",
            "Streaming Data Engineer",
            "Event Architect",
            "Platform Engineer",
          ],
        },
        {
          slug: "flink",
          vendor: "Apache",
          name: "Apache Flink",
          roles: ["Streaming Data Engineer", "Stream Processing Engineer"],
        },
      ],
    },
    /**
     * R5 addition, and the clearest gap on this page.
     *
     * Every other desk here is modern-stack — Snowflake, dbt, Collibra, Kafka —
     * while Yallo's whole wedge is enterprise platform programmes. A buyer with
     * a BW/4HANA estate or an Oracle Analytics footprint found nothing on the
     * page that spoke to it, even though SAP Analytics Cloud, SAP Datasphere and
     * Oracle Analytics Cloud are all already authored modules in this repo's own
     * platform sets. Nothing here is invented: every product named is one the
     * site already publishes as a desk it staffs.
     */
    {
      slug: "enterprise-platform-analytics",
      num: "07",
      title: "Enterprise Platform Analytics",
      icon: "analytics",
      blurb:
        "SAP Analytics Cloud, SAP Datasphere, BW/4HANA, Oracle Analytics Cloud.",
      overview:
        "Most enterprise reporting estates are not on the modern stack, and a buyer with a BW/4HANA footprint gets nothing from a bench that only knows Snowflake. This desk is the join between the analytics discipline and the platform desks: modelling inside SAP Datasphere, a BW estate being migrated rather than replaced, Analytics Cloud stories built on a live S/4 model, and Oracle Analytics Cloud against Fusion. The scarcity here is people who hold both sides, because the platform specialists rarely model and the analytics specialists rarely know the source.",
      roles: [
        "SAP Analytics Cloud Consultant",
        "SAP Datasphere Engineer",
        "BW/4HANA Modeller",
      ],
      tools: [
        {
          slug: "sap-datasphere",
          vendor: "SAP",
          name: "SAP Datasphere",
          roles: [
            "SAP Datasphere Engineer",
            "Data Platform Architect",
            "BW/4HANA Modeller",
          ],
        },
        {
          slug: "sap-analytics-cloud",
          vendor: "SAP",
          name: "SAP Analytics Cloud",
          roles: [
            "SAP Analytics Cloud Consultant",
            "Planning Consultant",
            "BI Developer",
          ],
        },
        {
          slug: "bw4hana",
          vendor: "SAP",
          name: "SAP BW/4HANA",
          roles: ["BW/4HANA Modeller", "SAP Data Engineer", "Migration Lead"],
        },
        {
          slug: "oracle-analytics-cloud",
          vendor: "Oracle",
          name: "Oracle Analytics Cloud",
          roles: ["Oracle Analytics Consultant", "BI Developer"],
        },
      ],
    },
    {
      /* THE EIGHTH CARD, authored in context-round4-rulings.md §7, and it closes
         the last of the four orphaned areas.
         Data science was homeless: the modelling roles left this desk when AI
         Talent became the seventh discipline, and AI Talent is foundation-model
         work rather than modelling a company's own data. A buyer briefing a
         forecasting or experimentation hire had nowhere on the site to land.
         THE BOUNDARY IS STATED ONCE, in `overview` below, and cross-linked
         rather than restated: `twin` carries the route to AI Talent, and the
         AI Data Engineer is named as the join because that family genuinely
         serves both sides. Nothing about foundation models, retrieval or
         evaluation is repeated here; that is AI Talent's content and it stays
         there. */
      slug: "data-science",
      num: "08",
      title: "Data Science",
      icon: "spark",
      blurb: "Modelling, forecasting, experimentation and optimisation.",
      overview:
        "Data science answers questions from a company's own data: what will demand be, which customers are about to leave, whether the change actually caused the lift, and what the best allocation is under a constraint. That is a different discipline from AI Talent, which builds systems on foundation models, and the two are briefed as one often enough to be worth separating. The sub-desks are applied machine learning, statistical modelling and experimentation, forecasting and demand science, optimisation and operations research, causal inference and measurement, and model deployment and monitoring, the last of which is staffed with the MLOps desk rather than restated here. We screen on whether a model reached production and what happened to it afterwards, because the failure mode is a notebook nobody could deploy and a result nobody could reproduce.",
      screening:
        "Screened on a model that reached production and was still running six months later, on how they validated it against a holdout somebody else chose, and on whether they can tell a correlation they exploited from a cause they established.",
      roles: [
        "Senior Data Scientist",
        "Applied Machine Learning Engineer",
        "Forecasting and Demand Planning Analyst",
      ],
      twin: [
        {
          href: "/ai-talent",
          label: "AI Talent",
          note: "Data science models a company's own data. AI Talent builds on foundation models. The AI Data Engineer is the role that serves both, and it is briefed from there.",
        },
      ],
      tools: [
        {
          slug: "python-ml",
          vendor: "Python",
          name: "Python: scikit-learn, PyTorch and statsmodels",
          roles: [
            "Data Scientist",
            "Senior Data Scientist",
            "Applied Machine Learning Engineer",
            "Statistician",
          ],
        },
        {
          slug: "r-statistical-computing",
          vendor: "R",
          name: "R",
          roles: [
            "Statistician",
            "Experimentation and Causal Inference Analyst",
            "Data Scientist",
          ],
        },
        {
          slug: "databricks-ml",
          vendor: "Databricks",
          name: "Databricks",
          roles: [
            "Applied Machine Learning Engineer",
            "Senior Data Scientist",
            "Data Science Lead",
          ],
        },
        {
          slug: "azure-machine-learning",
          vendor: "Microsoft",
          name: "Azure Machine Learning",
          roles: [
            "Applied Machine Learning Engineer",
            "Data Scientist",
            "Data Science Lead",
          ],
        },
        {
          slug: "amazon-sagemaker",
          vendor: "Amazon Web Services",
          name: "Amazon SageMaker",
          roles: [
            "Applied Machine Learning Engineer",
            "Senior Data Scientist",
            "Data Scientist",
          ],
        },
        {
          slug: "google-vertex-ai",
          vendor: "Google Cloud",
          name: "Google Vertex AI",
          roles: [
            "Applied Machine Learning Engineer",
            "Data Scientist",
            "Data Science Lead",
          ],
        },
        {
          slug: "snowflake-data-science",
          vendor: "Snowflake",
          name: "Snowflake",
          roles: [
            "Data Scientist",
            "Decision Scientist",
            "Forecasting and Demand Planning Analyst",
          ],
        },
        {
          slug: "mlflow",
          vendor: "MLflow",
          name: "MLflow",
          roles: [
            "Applied Machine Learning Engineer",
            "Senior Data Scientist",
            "Data Science Lead",
          ],
        },
        {
          slug: "dataiku",
          vendor: "Dataiku",
          name: "Dataiku",
          roles: [
            "Data Scientist",
            "Decision Scientist",
            "Optimisation Specialist",
          ],
        },
        {
          slug: "sas",
          vendor: "SAS",
          name: "SAS",
          roles: [
            "Statistician",
            "Forecasting and Demand Planning Analyst",
            "Optimisation Specialist",
          ],
        },
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
      name: taxonomyLabels("retail").label,
      intro:
        "Personalisation, demand forecasting, real-time inventory intelligence and clienteling analytics for retail programmes.",
      roles: [
        "Customer 360 Data Engineer",
        "Demand Forecasting Scientist",
        "Personalisation ML Engineer",
      ],
    },
    {
      id: "manufacturing",
      name: taxonomyLabels("manufacturing").label,
      intro:
        "IIoT payloads, predictive maintenance, demand forecasting and factory-floor analytics for manufacturing programmes.",
      roles: [
        "IIoT Data Engineer",
        "Predictive Maintenance Scientist",
        "Supply Chain Analytics Lead",
      ],
    },
    {
      id: "finance",
      name: taxonomyLabels("finance").label,
      intro:
        "Risk models, fraud detection, regulatory analytics and open-banking data platforms for financial services programmes.",
      roles: [
        "Risk Model Engineer",
        "Fraud Detection ML Lead",
        "Regulatory Analytics Architect",
      ],
    },
    {
      id: "government",
      name: taxonomyLabels("government").label,
      intro:
        "Government data platforms, service analytics, fraud and compliance modelling for central and local government.",
      roles: [
        "Government Data Platform Lead",
        "Service Analytics Engineer",
        "Compliance ML Analyst",
      ],
    },
    {
      id: "healthcare",
      name: taxonomyLabels("healthcare").label,
      intro:
        "Clinical data platforms, HL7/FHIR pipelines, real-world evidence analytics and pharmaceutical R&D data science.",
      roles: [
        "Clinical Data Engineer",
        "HL7 / FHIR Integration Lead",
        "Real-world Evidence Scientist",
      ],
    },
    {
      id: "telco",
      name: taxonomyLabels("telco").label,
      intro:
        "Network analytics, churn modelling, subscriber intelligence and content recommendation engines for telco and media.",
      roles: [
        "Network Analytics Engineer",
        "Churn Prediction ML Lead",
        "Recommendation Engine Architect",
      ],
    },
    {
      id: "education",
      name: taxonomyLabels("education").label,
      intro:
        "Institutional research, student data and reporting assembled across the student record, the finance ledger and the learning platform.",
      roles: [
        "Data Engineer, education",
        "Institutional Research Analyst",
        "Accreditation Reporting Analyst",
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
    /* The neighbouring discipline, and the reason the AI roles left the scarce
       list above. A buyer who arrived here looking for an LLM engineer needs one
       link, not a second reading of this page. */
    { href: "/ai-talent", label: "AI Talent", category: "Capability" },
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
      label: taxonomyLabels("finance").label,
      category: "Industry",
    },
    {
      href: "/industries/retail",
      label: taxonomyLabels("retail").label,
      category: "Industry",
    },
  ],

  seo: {
    title: "Data & Analytics Contractors · Yallo Talent",
    description:
      "Specialist-screened data and analytics contractors: data engineering, analytics engineering, BI, lakehouse and governance. 72h shortlist across the Middle East, Europe and India.",
  },
};
