/**
 * Authored platform module sets — the second source of platform truth.
 *
 * The derived source (derive.ts) re-projects sector data onto the platform
 * axis and can only say what a sector page already says. This file holds the
 * module sets Sumeet ratified directly (Relay v2.1 rev 2 §5 and §5b, canon §3):
 * platform-level desks with scope lines, sourced from the legacy site's
 * platform areas and his confirmation of the workloads his desks staff.
 *
 * Scope lines follow the content rule: what Yallo places, never what the
 * platform does. The legacy outcome figures ("cut downtime by 40%", "90%
 * payroll errors") do NOT port — delivery outcomes without a client or record
 * attached fail the sourced-figures rule.
 */

export interface AuthoredModule {
  /** URL-safe, stable — this is the module page's route segment. */
  slug: string;
  /** The product as published. */
  name: string;
  /** What Yallo places on it — one line, Talent-speak. */
  scope: string;
  /** Contractor roles Yallo places on this module. */
  roles: string[];
}

export interface AuthoredPlatform {
  slug: string;
  name: string;
  /** Ratification provenance, kept with the data. */
  ratified: string;
  modules: AuthoredModule[];
}

export const authoredPlatforms: Record<string, AuthoredPlatform> = {
  /**
   * Oracle — SUITE level, from the legacy corpus, 31 Jul.
   *
   * Same skew as SAP and worse: eight of the ten modules the platform page was
   * publishing were Oracle RETAIL (Xstore, Retail MOM, Assortment Planning,
   * Space Optimization, Retail Pricing, Retail Order Management), because retail
   * was the only sector seeded with Oracle tools.
   *
   * Names verbatim from content/platform-expertise/oracle-expertise.md, whose
   * headings enumerate the suite. The industry verticals the legacy page also
   * lists — Oracle Retail, Hospitality, Food & Beverage, Healthcare, Financial
   * Services, Communication — are deliberately NOT modules here: they are
   * sector cuts of the suite, which is the level the sector L1s already work at,
   * and repeating them would rebuild the skew one layer up.
   */
  oracle: {
    slug: "oracle",
    name: "Oracle",
    ratified:
      "Suite-level rebuild 31 Jul 2026, names sourced verbatim from the legacy corpus Oracle expertise page.",
    modules: [
      {
        slug: "oracle-fusion-erp",
        name: "Oracle Fusion ERP",
        scope:
          "Financials and procurement consultants across Fusion Cloud ERP, including the EBS-to-Fusion crews.",
        roles: [
          "Oracle Fusion Financials Consultant",
          "Oracle Integration Cloud Developer",
          "Finance Transformation Lead",
          "Data Migration Lead",
        ],
      },
      {
        slug: "oracle-fusion-hcm",
        name: "Oracle Fusion HCM",
        scope: "Core HR, payroll and absence consultants on Fusion HCM.",
        roles: [
          "Oracle Fusion Financials Consultant",
          "Functional Architect",
          "Data Migration Test Analyst",
        ],
      },
      {
        slug: "oracle-fusion-scm",
        name: "Oracle Fusion SCM",
        scope:
          "Supply chain, inventory and order-management consultants on Fusion SCM.",
        roles: [
          "Oracle SCM Consultant",
          "Supply Chain Lead",
          "Functional Test Analyst",
        ],
      },
      {
        slug: "oracle-fusion-cx",
        name: "Oracle Fusion CX",
        scope:
          "Sales, service and marketing consultants across the Fusion CX applications.",
        roles: [
          "Oracle SCM Consultant",
          "Business Analyst",
          "Integration Architect",
        ],
      },
      {
        slug: "oracle-e-business-suite",
        name: "Oracle E-Business Suite",
        scope:
          "EBS consultants and PL/SQL developers — the estates still running it, and the ones leaving it.",
        roles: [
          "Oracle PL/SQL Developer",
          "Oracle Fusion Financials Consultant",
          "Integration Test Analyst",
        ],
      },
      {
        slug: "oracle-enterprise-performance-management",
        name: "Oracle Enterprise Performance Management (EPM)",
        scope:
          "Planning, close and consolidation consultants, including Hyperion migrations.",
        roles: [
          "Finance Transformation Lead",
          "Oracle Fusion Financials Consultant",
          "Data Architect",
        ],
      },
      {
        slug: "oracle-cloud-infrastructure",
        name: "Oracle Cloud Infrastructure",
        scope:
          "OCI engineers and architects for landing zones, migration and run.",
        roles: [
          "Cloud Architect",
          "Platform Engineer",
          "Network Engineer",
          "Site Reliability Engineer",
        ],
      },
      {
        slug: "oracle-netsuite",
        name: "Oracle NetSuite",
        scope:
          "NetSuite consultants and integration developers for mid-market estates.",
        roles: [
          "Oracle Integration Cloud Developer",
          "Business Analyst",
          "Delivery Lead",
        ],
      },
      {
        slug: "oracle-bi-apps",
        name: "Oracle BI Apps",
        scope:
          "Reporting and analytics consultants across the Oracle BI estate.",
        roles: ["Data Architect", "ETL Developer", "Power BI Developer"],
      },
    ],
  },

  /**
   * Salesforce — SUITE level, from the legacy corpus, 31 Jul.
   *
   * The platform page was publishing three modules, all retail: Retail Cloud
   * (Clienteling), Loyalty Management and Marketing Cloud. Three is also below
   * the threshold at which a platform page earns its place, so this was thin as
   * well as skewed.
   *
   * Names verbatim from content/platform-expertise/salesforce-expertise.md. That
   * page also lists feature-level headings (CPQ, AI Recommendations, Digital
   * Storefronts, Customer Self-Service Portals); those are capabilities INSIDE a
   * cloud, not desks, so they are not modules here.
   */
  salesforce: {
    slug: "salesforce",
    name: "Salesforce",
    ratified:
      "Suite-level rebuild 31 Jul 2026, names sourced verbatim from the legacy corpus Salesforce expertise page.",
    modules: [
      {
        slug: "sales-cloud",
        name: "Sales Cloud",
        scope:
          "Sales-process consultants and Apex developers across the Sales Cloud estate.",
        roles: [
          "Salesforce Apex Developer",
          "Functional Architect",
          "Business Analyst",
        ],
      },
      {
        slug: "service-cloud",
        name: "Service Cloud",
        scope:
          "Case management and contact-centre consultants on Service Cloud.",
        roles: [
          "Salesforce Service Cloud Consultant",
          "Salesforce Apex Developer",
          "Functional Test Analyst",
        ],
      },
      {
        slug: "marketing-cloud",
        name: "Marketing Cloud",
        scope:
          "Campaign build and audience consultants, and the data feeds behind them.",
        roles: ["Business Analyst", "Data Engineer", "Integration Architect"],
      },
      {
        slug: "commerce-cloud",
        name: "Commerce Cloud",
        scope: "B2C and B2B commerce developers and architects.",
        roles: [
          "Salesforce Apex Developer",
          "Frontend Engineer",
          "Integration Architect",
        ],
      },
      {
        slug: "experience-cloud",
        name: "Experience Cloud",
        scope: "Portal and community builds for customers and partners.",
        roles: [
          "Salesforce Apex Developer",
          "Frontend Engineer",
          "Business Analyst",
        ],
      },
      {
        slug: "mulesoft-anypoint-platform",
        name: "MuleSoft Anypoint Platform",
        scope: "API and integration engineers across the Anypoint estate.",
        roles: [
          "Integration Architect",
          "Platform Engineer",
          "DevOps Engineer",
        ],
      },
    ],
  },
  /**
   * SAP — SUITE level, rebuilt 31 Jul from the legacy corpus.
   *
   * What was wrong: the SAP platform page was rendering twelve RETAIL SAP
   * modules — Customer Checkout, Merchandise Management, Space Optimisation,
   * Promotion Management, Forecasting & Replenishment — because derive.ts
   * re-projects sector data onto the platform axis, and retail was the only
   * sector seeded with SAP tools. Correct mechanism, wrong level: a platform
   * page presents the SUITE FAMILY, and a buyer arriving on /platforms/sap to
   * ask about SuccessFactors or Ariba was shown a retail merchandising bench.
   * The retail-flavoured modules are untouched and stay where they belong, on
   * the retail L1 and its L2s.
   *
   * PROVENANCE OF THE NAMES. Every module name below is taken verbatim from the
   * legacy corpus at ../yallo-legacy-archive — specifically the platform-level
   * pages content/platform/sap.md and content/platform-expertise/sap-expertise.md,
   * whose own headings enumerate the suite. Nothing here is invented, and nothing
   * is drafted from memory of the SAP catalogue.
   *
   * Two corrections applied to the legacy copy rather than ported:
   *   · Under "SAP Analytics" the legacy scope line reads "SAP S/4HANA Public
   *     Cloud offers scalable, subscription-based ERP" — a copy-paste defect in
   *     the source. Not ported. The product is published as SAP Analytics Cloud
   *     in the corpus body, so that name is used.
   *   · Every legacy scope line is platform-speak (what SAP does). Canon §9
   *     requires Talent-speak (what Yallo places), so the scope lines are
   *     rewritten. The NAMES are the corpus's; the scope lines are ours.
   *
   * Roles are mapped from titles that already exist in roles.ts and the sector
   * files — no new role vocabulary is introduced here.
   */
  sap: {
    slug: "sap",
    name: "SAP",
    ratified:
      "Suite-level rebuild 31 Jul 2026, names sourced verbatim from the legacy corpus platform pages. Three desks flagged uncertain — see QUESTIONS.md Q9.",
    modules: [
      {
        slug: "sap-s4hana-on-premise",
        name: "SAP S/4HANA On-Premise",
        scope:
          "Core finance and logistics consultants for on-premise estates, including the brownfield conversion crews.",
        roles: [
          "SAP S/4HANA Architect",
          "SAP FI/CO Consultant",
          "SAP MM/SD Consultant",
          "ABAP Developer",
          "Data Migration Lead",
        ],
      },
      {
        slug: "sap-s4hana-public-cloud",
        name: "SAP S/4HANA Public Cloud",
        scope:
          "Consultants who work inside the standard, on a quarterly release cadence rather than a modification backlog.",
        roles: [
          "SAP S/4HANA Architect",
          "SAP FI/CO Consultant",
          "Functional Architect",
          "SAP Test Lead",
        ],
      },
      {
        slug: "sap-s4hana-cloud-private-edition",
        name: "SAP S/4HANA Cloud, Private Edition",
        scope:
          "Mixed benches for private-edition estates that keep custom code but move the hosting.",
        roles: [
          "SAP S/4HANA Architect",
          "ABAP Developer",
          "SAP CPI Integration Developer",
          "Cutover Manager",
        ],
      },
      {
        slug: "rise-with-sap-s4hana",
        name: "RISE with SAP S/4HANA",
        scope:
          "Transformation-side people for RISE programmes: the architects and cutover leads, not the licence conversation.",
        roles: [
          "Enterprise Architect",
          "SAP S/4HANA Architect",
          "Cutover Manager",
          "Hypercare Lead",
          "PMO Lead",
        ],
      },
      {
        slug: "sap-s4hana-finance",
        name: "SAP S/4HANA Finance",
        scope:
          "Finance transformation consultants — record to report, treasury and group close.",
        roles: [
          "SAP FI/CO Consultant",
          "Finance Transformation Lead",
          "SAP Treasury & Risk Consultant",
          "Data Migration Test Analyst",
        ],
      },
      {
        slug: "sap-analytics-cloud",
        name: "SAP Analytics Cloud",
        scope:
          "Planning and reporting specialists, including the ones who rebuild legacy BPC models.",
        roles: [
          "SAP Analytics Cloud Consultant",
          "Data Architect",
          "Power BI Developer",
          "Business Analyst",
        ],
      },
      {
        slug: "sap-btp",
        name: "SAP BTP (Business Technology Platform)",
        scope:
          "Integration and extension engineers — CPI, event mesh and side-by-side extensions.",
        roles: [
          "SAP CPI Integration Developer",
          "Integration Architect",
          "Platform Engineer",
          "DevOps Engineer",
        ],
      },
      {
        slug: "sap-integrated-business-planning",
        name: "SAP Integrated Business Planning",
        scope:
          "Demand, supply and response planners, and the APO consultants migrating off it.",
        roles: [
          "SAP APO / IBP Consultant",
          "Supply Chain Lead",
          "Data Engineer",
          "Functional Test Analyst",
        ],
      },
      {
        slug: "sap-customer-experience",
        name: "SAP Customer Experience",
        scope:
          "Commerce, marketing and sales-cloud consultants across the CX estate.",
        roles: [
          "SAP CX Functional Consultant",
          "SAP Commerce Cloud Architect",
          "SAP CRM Consultant",
          "Frontend Engineer",
        ],
      },
      {
        slug: "sap-service-cloud",
        name: "SAP Service Cloud",
        scope:
          "Service and case-management consultants for contact-centre estates.",
        roles: [
          "SAP Service Cloud Consultant",
          "SAP CX Functional Consultant",
          "Business Analyst",
        ],
      },
      {
        slug: "sap-ariba",
        name: "SAP Ariba (Procurement & Sourcing)",
        scope:
          "Source-to-pay consultants, supplier-enablement leads and the integration side of Ariba.",
        roles: [
          "SAP MM/SD Consultant",
          "SAP CPI Integration Developer",
          "Business Analyst",
          "Delivery Lead",
        ],
      },
      {
        slug: "sap-successfactors",
        name: "SAP SuccessFactors",
        scope:
          "Employee Central, payroll and talent-module consultants, plus the reporting side.",
        roles: [
          "SAP SuccessFactors Consultant",
          "Functional Architect",
          "Data Migration Lead",
          "Functional Test Analyst",
        ],
      },
      {
        slug: "sap-extended-warehouse-management",
        name: "SAP Extended Warehouse Management (SAP EWM)",
        scope:
          "Warehouse consultants for embedded and decentralised EWM, including go-live floor support.",
        roles: [
          "SAP WM Functional",
          "Supply Chain Lead",
          "Integration Test Analyst",
          "Hypercare Lead",
        ],
      },
      {
        /* R5 IA modernisation, 31 Jul. SAP's current data platform, and the
           clearest gap in a 2-3 year old corpus IA: it supersedes SAP Data
           Warehouse Cloud, sits directly beside Analytics Cloud which was
           already listed, and is named on the legacy SAP expertise page and the
           data-expertise page — attested, not guessed. */
        slug: "sap-datasphere",
        name: "SAP Datasphere",
        scope:
          "Data engineers and modellers on the semantic layer, and the crews migrating off BW.",
        roles: [
          "Data Architect",
          "Data Engineer",
          "SAP Analytics Cloud Consultant",
          "ETL Developer",
        ],
      },
      {
        /* R5. External workforce management — unusually relevant here, since it
           is the system a client uses to engage contractors. Named on the legacy
           SAP expertise page. */
        slug: "sap-fieldglass",
        name: "SAP Fieldglass",
        scope:
          "Consultants for external-workforce and services-procurement rollouts, including supplier onboarding.",
        roles: [
          "Functional Architect",
          "Business Analyst",
          "SAP CPI Integration Developer",
          "Delivery Lead",
        ],
      },
      {
        /* R5. SAP's customer-engagement product, named on the legacy SAP
           expertise page as both Customer Engagement and Account Engagement. */
        slug: "sap-emarsys",
        name: "SAP Emarsys",
        scope:
          "Campaign and customer-data consultants on the Emarsys engagement platform.",
        roles: [
          "Business Analyst",
          "Data Engineer",
          "SAP CX Functional Consultant",
        ],
      },
      {
        slug: "sap-transportation-management",
        name: "SAP Transportation Management (SAP TM)",
        scope:
          "Transport and freight-settlement consultants, and the carrier integrations.",
        roles: [
          "SAP TM Consultant",
          "SAP TM Lead",
          "SAP CPI Integration Developer",
          "Supply Chain Lead",
        ],
      },
    ],
  },
  microsoft: {
    slug: "microsoft",
    name: "Microsoft",
    ratified: "Relay v2.1 rev 2 §5, ratified by Sumeet Goenka 30 Jul 2026",
    modules: [
      {
        slug: "azure-data-and-ai",
        name: "Azure Data & AI",
        scope:
          "Data platforms on Fabric, Synapse, Databricks and Power BI, from migration to reporting",
        roles: [
          "Azure Data Engineer",
          "Databricks Engineer",
          "Data Architect",
          "Power BI Developer",
          "Data Migration Lead",
          "Azure AI Engineer",
        ],
      },
      {
        slug: "azure-infrastructure",
        name: "Azure Infrastructure",
        scope: "Landing zones, migrations and hybrid estates, built and run",
        roles: [
          "Azure Solution Architect",
          "Azure Cloud Engineer",
          "Platform Engineer",
          "Network Engineer",
          "Cloud Migration Lead",
        ],
      },
      {
        slug: "azure-security",
        name: "Azure Security",
        scope: "Identity, access and compliance across the Azure estate",
        roles: [
          "Security Architect",
          "Cloud Security Engineer",
          "IAM Engineer",
          "GRC and Compliance Specialist",
        ],
      },
      {
        slug: "azure-devops",
        name: "Azure DevOps",
        scope: "Pipelines, containers and reliability after go-live",
        roles: [
          "DevOps Engineer",
          "Site Reliability Engineer",
          "Kubernetes Engineer",
          "Release Manager",
          "Automation Engineer",
        ],
      },
      {
        slug: "d365-finance-and-operations",
        name: "D365 Finance & Operations",
        scope:
          "Finance and supply chain implementations, rollouts and localisations",
        roles: [
          "D365 F&O Functional Consultant",
          "X++ Developer",
          "D365 Technical Architect",
          "Data Migration Lead",
          "Integration Developer",
        ],
      },
      {
        slug: "d365-customer-engagement",
        name: "D365 Customer Engagement",
        scope:
          "Sales and Service implementations and the integrations around them",
        roles: [
          "D365 CE Functional Consultant",
          "CRM Solution Architect",
          "Power Platform Developer",
        ],
      },
      {
        slug: "d365-business-central",
        name: "D365 Business Central",
        scope: "Mid-market ERP implementations and NAV-to-BC migrations",
        roles: [
          "BC Functional Consultant",
          "AL Developer",
          "Upgrade and Migration Consultant",
        ],
      },
      {
        slug: "d365-human-resources",
        name: "D365 Human Resources",
        scope: "HR implementations and payroll integrations",
        roles: [
          "D365 HR Functional Consultant",
          "HR Transformation Lead",
          "Integration Developer",
        ],
      },
      {
        slug: "power-platform",
        name: "Power Platform",
        scope:
          "Apps, automation and governance on the platform the business already owns",
        roles: [
          "Power Platform Solution Architect",
          "Power Apps Developer",
          "Power Automate / RPA Developer",
          "Power BI Developer",
        ],
      },
      {
        slug: "microsoft-365-copilot",
        name: "Microsoft 365 Copilot",
        scope: "Readiness, data governance and adoption for Copilot rollouts",
        roles: [
          "Information Governance (Purview) Specialist",
          "Adoption and Change Lead",
          "M365 Consultant",
        ],
      },
    ],
  },

  workday: {
    slug: "workday",
    name: "Workday",
    ratified:
      "Relay v2.1 rev 2 §5b, ratified by Sumeet Goenka 30 Jul 2026 (canon §3 amendment log)",
    modules: [
      {
        slug: "workday-hcm",
        name: "Workday HCM",
        scope:
          "Core HR implementations, employee lifecycle and the integrations around them",
        roles: [
          "Workday HCM Functional Consultant",
          "Workday HCM Architect",
          "Workday Integration Developer",
          "Data Migration Lead",
        ],
      },
      {
        slug: "workday-payroll",
        name: "Workday Payroll",
        scope:
          "Payroll builds, absence and time tracking, multi-country compliance",
        roles: [
          "Workday Payroll Consultant",
          "Absence & Time Consultant",
          "Payroll Integration Specialist",
        ],
      },
      {
        slug: "workday-financial-management",
        name: "Workday Financial Management",
        scope: "Record-to-report implementations and ERP coexistence",
        roles: [
          "Workday Financials Consultant",
          "Record-to-Report Lead",
          "Financial Data Migration Lead",
        ],
      },
      {
        slug: "workday-adaptive-planning",
        name: "Workday Adaptive Planning",
        scope: "Budgeting, forecasting and workforce cost models",
        roles: [
          "Adaptive Planning Consultant",
          "FP&A Systems Analyst",
          "Model Builder",
        ],
      },
      {
        slug: "workday-recruiting",
        name: "Workday Recruiting",
        scope: "Recruiting and onboarding configuration",
        roles: [
          "Workday Recruiting Consultant",
          "Onboarding Configuration Specialist",
        ],
      },
      {
        slug: "workday-talent-management",
        name: "Workday Talent Management",
        scope: "Performance, career and succession configuration",
        roles: ["Workday Talent & Performance Consultant"],
      },
      {
        slug: "workday-learning",
        name: "Workday Learning",
        scope: "Learning rollouts and adoption",
        roles: ["Workday Learning Consultant", "Adoption and Change Lead"],
      },
      {
        slug: "workday-workforce-planning",
        name: "Workday Workforce Planning",
        scope: "Headcount planning, scenario modelling and forecasting",
        roles: ["Workforce Planning Consultant", "HR Data Analyst"],
      },
      {
        slug: "workday-prism-analytics",
        name: "Workday Prism Analytics",
        scope: "Reporting and data hub work across HR and finance",
        roles: ["Prism Analytics Consultant", "Workday Reporting Developer"],
      },
      {
        slug: "workday-psa",
        name: "Workday PSA",
        scope: "Resource scheduling, time tracking and project billing",
        roles: ["Workday PSA Consultant", "Resource Management Analyst"],
      },
    ],
  },
};
