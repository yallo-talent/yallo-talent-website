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

/**
 * Named clients we have placed on this platform.
 *
 * Separate from case studies on purpose. Most placements never become a
 * published study, and the page previously showed only the one client that had
 * one — so "SAP programmes we have staffed" sat over a single card and read as
 * though that were the whole of it.
 *
 * `study` marks the ones with a published page behind them. R16 governs the
 * split: a heading may only assert what every row satisfies, so the studies keep
 * the studies heading and the rest are named as placements, which is exactly
 * what they are. Supplied by Sumeet, 1 Aug — not derived, not guessed.
 */
export interface PlatformClient {
  name: string;
  /** Country, not city — the market is the useful unit here. */
  market: string;
  /** True where a published case study exists for this client. */
  study?: boolean;
}

export interface AuthoredModule {
  /** URL-safe, stable — this is the module page's route segment. */
  slug: string;
  /** The product as published. Used as the card heading. */
  name: string;
  /**
   * Chip label, where the published name is too long for an index.
   *
   * Sumeet, 2 Aug: the chip block read as crowded and busy, and the bracketed
   * expansions were the reason. "SAP BTP (Business Technology Platform)" is
   * three quarters parenthesis, and anyone shopping for a BTP contractor knows
   * what BTP is.
   *
   * Chip ONLY. The card heading keeps the published name, because the card has
   * the room and the full product name is what a search engine and a buyer new
   * to the suite are both looking for. Shortening the data itself would have
   * traded one problem for a worse one.
   */
  shortName?: string;
  /** What Yallo places on it — one line, Talent-speak. */
  scope: string;
  /** Contractor roles Yallo places on this module. */
  roles: string[];
  /**
   * The vendor's CURRENT application family (SAP IA round 3).
   *
   * Grouping key only — it changes how the L1 presents the suite, never what we
   * claim. A buyer arriving from sap.com sees five autonomous families over a
   * platform layer and an AI layer; we were showing fourteen product names in one
   * flat column. See docs/design/sap-ia-round-3.md.
   */
  family?: string;
  /**
   * Deployment variants INSIDE one module, per ORDER 1.
   *
   * A deployment is not a product. S/4HANA shipped as four sibling modules —
   * On-Premise, Public Cloud, Cloud Private Edition and "RISE with SAP S/4HANA" —
   * which read as four things to staff when they are one product deployed four
   * ways, and the last of them is not a deployment at all: RISE is SAP's
   * COMMERCIAL programme, bundling S/4HANA Cloud (Public or Private) with managed
   * infrastructure and BTP. Listing it beside the deployments was a category
   * error in our own IA.
   */
  variants?: string[];
}

export interface AuthoredPlatform {
  /** Named clients placed on this platform. Optional; only SAP has them today. */
  clients?: PlatformClient[];
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
  /**
   * Blue Yonder — R13, and every module below is EVIDENCE, not judgement.
   *
   * Q9 sat parked for two rounds because there is no Blue Yonder file in the
   * legacy corpus, so there was no attested suite list to draft from. R13 unparks
   * it with a hard rule: a module ships only if it maps to an existing role in the
   * data layer or to the ratified homepage line. Everything else is omitted rather
   * than guessed — including genuinely real Blue Yonder products, because a
   * product being real is necessary and not sufficient.
   *
   * The homepage line (src/data/home/place.ts) is "Luminate · WMS · planning".
   * Every role cited below already exists in src/data/l1/*.ts. The evidence table
   * is logged in docs/design/blue-yonder-evidence.md.
   *
   * Moss hue per R13.
   */
  "blue-yonder": {
    slug: "blue-yonder",
    name: "Blue Yonder",
    ratified:
      "Suite level, R13, 1 Aug 2026. Every module maps to a role already named in the data layer or to the ratified homepage line. No module is inferred.",
    modules: [
      {
        slug: "blue-yonder-luminate-planning",
        name: "Blue Yonder Luminate Planning",
        scope:
          "Demand, supply and inventory planners on Luminate, and the crews running seasonal planning cycles.",
        roles: [
          "Blue Yonder Luminate Supply Chain Planner",
          "Blue Yonder Demand Planner",
          "Blue Yonder Inventory Optimisation Lead",
          "Blue Yonder SCP Specialist",
        ],
      },
      {
        slug: "blue-yonder-wms",
        name: "Blue Yonder WMS",
        scope:
          "Warehouse management consultants on Blue Yonder, including the DC cutover crews.",
        roles: [
          "Blue Yonder WMS Consultant",
          "Blue Yonder WMS Specialist",
          "Blue Yonder WMS Technical Consultant, MOCA",
          "Blue Yonder WMS Solution Architect",
          "Blue Yonder Labour Management Consultant",
          "Warehouse Cutover Lead",
        ],
      },
      {
        slug: "blue-yonder-tms",
        name: "Blue Yonder TMS",
        scope:
          "Transport management architects on Blue Yonder across DC-to-store and last-mile networks.",
        roles: [
          "Blue Yonder TMS Architect",
          "Blue Yonder TMS Functional Consultant",
          "Transportation Modelling Analyst",
          "Carrier Integration Developer",
        ],
      },
      {
        slug: "blue-yonder-merchandise-management",
        name: "Blue Yonder Merchandise Management",
        scope:
          "Merchandise financial planning consultants, and the MFP crews behind seasonal buying.",
        roles: [
          "Blue Yonder Merchandise Consultant",
          "Blue Yonder MFP Specialist",
          "Merchandise Financial Planning Analyst",
          "Open to Buy Analyst",
        ],
      },
      {
        slug: "blue-yonder-assortment-optimization",
        name: "Blue Yonder Assortment Optimization",
        scope:
          "Assortment planners running seasonal cycles across apparel, grocery and mass merchandise.",
        roles: [
          "Blue Yonder Assortment Specialist",
          "Category Planning Consultant",
          "Cluster and Localisation Analyst",
        ],
      },
      {
        slug: "blue-yonder-space-planning",
        name: "Blue Yonder Space Planning",
        scope: "Space and floor-plan planners on Blue Yonder.",
        roles: [
          "Blue Yonder Space Planner",
          "Floor Planning Consultant",
          "Planogram Analyst",
        ],
      },
      {
        slug: "blue-yonder-price-promotion",
        name: "Blue Yonder Price & Promotion",
        scope:
          "Pricing and promotion leads on Blue Yonder across markdown and campaign cycles.",
        roles: [
          "Blue Yonder Price / Promotion Lead",
          "Markdown Optimisation Analyst",
          "Promotion Planning Consultant",
        ],
      },
      {
        slug: "blue-yonder-fulfillment",
        name: "Blue Yonder Fulfillment",
        scope:
          "Order fulfilment leads on Blue Yonder across store, DC and direct-to-consumer flows.",
        /* ONE role. Both spellings of the same job title shipped, and the chips
           render adjacent on the same row 4px apart at 241px and 237px wide —
           indistinguishable from a duplicate-render bug, and it put three
           spellings of the word in one card. The product name is a proper noun
           and keeps the vendor's own "Fulfillment"; UK spelling still governs
           our own prose, which is why the scope line reads "fulfilment".

           2 Aug: it came BACK, and fixing it here was never going to be enough.
           The authored set is unioned with the derived sector roles, and
           retail.ts and manufacturing.ts still held the UK spelling, so the
           duplicate reappeared on the platform bench through derivation. Both
           sector files now use the product's spelling. The lesson is the
           general one for this file: an authored fix does not stick while a
           sector file disagrees, because the two are merged rather than
           overridden. */
        roles: [
          "Blue Yonder Fulfillment Lead",
          "Order Orchestration Consultant",
          "Blue Yonder Integration Developer",
          "Blue Yonder Technical Architect",
        ],
      },
    ],
  },

  oracle: {
    slug: "oracle",
    name: "Oracle",
    ratified:
      "Suite-level rebuild 31 Jul 2026, names sourced verbatim from the legacy corpus Oracle expertise page. Bench rebuilt to SAP depth 2 Aug 2026 (platform parity round §5).",
    /* BENCH REBUILT, and the depth was the smaller half of the problem.
       Measured against SAP's 64, Oracle published 21 — but three of those were
       also in the wrong desk. "Oracle Fusion Financials Consultant" was listed
       under HCM, under E-Business Suite and under EPM; "Oracle SCM Consultant"
       was listed under CX; and "Power BI Developer", a Microsoft product, sat
       in Oracle BI Apps. That is the carried-across-by-analogy fault this round
       exists to stop, and padding the list without fixing it would have
       multiplied it.
       Every title below is a real Oracle market title. None is a SAP title with
       the vendor name swapped. */
    modules: [
      {
        slug: "oracle-fusion-erp",
        name: "Oracle Fusion ERP",
        scope:
          "Financials and procurement consultants across Fusion Cloud ERP, including the EBS-to-Fusion crews.",
        roles: [
          "Oracle Fusion Financials Consultant",
          "Oracle Fusion Procurement Consultant",
          "Oracle Fusion Projects Consultant",
          "Oracle Fusion Tax Consultant",
          "Oracle Cloud ERP Solution Architect",
          "Oracle Cloud Security and Roles Architect",
          "Data Conversion Specialist, FBDI",
          "Finance Transformation Lead",
        ],
      },
      {
        slug: "oracle-fusion-hcm",
        name: "Oracle Fusion HCM",
        scope: "Core HR, payroll and absence consultants on Fusion HCM.",
        roles: [
          "Oracle Fusion Core HR Consultant",
          "Oracle Fusion Payroll Consultant",
          "Oracle Fusion Absence and Time Consultant",
          "Oracle Fusion Talent Management Consultant",
          "Oracle Recruiting Cloud Consultant",
          "Oracle Fusion HCM Solution Architect",
          "Oracle Fast Formula Developer",
          "Data Conversion Specialist, HDL",
        ],
      },
      {
        slug: "oracle-fusion-scm",
        name: "Oracle Fusion SCM",
        scope:
          "Supply chain, inventory and order-management consultants on Fusion SCM.",
        roles: [
          "Oracle Fusion Inventory Consultant",
          "Oracle Fusion Order Management Consultant",
          "Oracle Fusion Manufacturing Consultant",
          "Oracle Fusion Supply Planning Consultant",
          "Oracle Fusion Cost Management Consultant",
          "Oracle SCM Solution Architect",
        ],
      },
      {
        slug: "oracle-fusion-cx",
        name: "Oracle Fusion CX",
        scope:
          "Sales, service and marketing consultants across the Fusion CX applications.",
        roles: [
          "Oracle Sales Cloud Consultant",
          "Oracle Service Cloud Consultant",
          "Oracle Eloqua Marketing Consultant",
          "Oracle CPQ Developer",
          "Oracle Field Service Consultant",
          "Oracle CX Solution Architect",
        ],
      },
      {
        slug: "oracle-e-business-suite",
        name: "Oracle E-Business Suite",
        scope:
          "EBS consultants and PL/SQL developers — the estates still running it, and the ones leaving it.",
        roles: [
          "Oracle EBS Financials Consultant",
          "Oracle PL/SQL Developer",
          "Oracle Apps DBA",
          "Oracle Forms and Reports Developer",
          "Oracle Workflow Developer",
          "EBS to Fusion Migration Lead",
        ],
      },
      {
        slug: "oracle-enterprise-performance-management",
        name: "Oracle Enterprise Performance Management (EPM)",
        shortName: "Oracle EPM",
        scope:
          "Planning, close and consolidation consultants, including Hyperion migrations.",
        roles: [
          "Oracle EPM Planning Consultant",
          "Financial Consolidation and Close Consultant",
          "Account Reconciliation Consultant",
          "Hyperion Planning Consultant",
          "Enterprise Data Management Consultant",
          "Oracle EPM Data Integration Specialist",
        ],
      },
      {
        slug: "oracle-cloud-infrastructure",
        name: "Oracle Cloud Infrastructure",
        shortName: "Oracle OCI",
        scope:
          "OCI engineers and architects for landing zones, migration and run.",
        roles: [
          "OCI Cloud Architect",
          "OCI Landing Zone Engineer",
          "OCI Network Engineer",
          "Oracle Database Administrator, OCI",
          "Site Reliability Engineer, OCI",
          "Terraform Automation Engineer, OCI",
        ],
      },
      {
        slug: "oracle-netsuite",
        name: "Oracle NetSuite",
        scope:
          "NetSuite consultants and integration developers for mid-market estates.",
        roles: [
          "NetSuite Functional Consultant",
          "NetSuite SuiteScript Developer",
          "NetSuite Administrator",
          "NetSuite Integration Developer, SuiteTalk",
          "NetSuite SuiteAnalytics Consultant",
        ],
      },
      {
        slug: "oracle-bi-apps",
        name: "Oracle BI Apps",
        scope:
          "Reporting and analytics consultants across the Oracle BI estate.",
        roles: [
          "Oracle Analytics Cloud Developer",
          "OTBI Reports Developer",
          "BI Publisher Developer",
          "Oracle Data Integrator Developer",
          "Autonomous Data Warehouse Engineer",
        ],
      },
      {
        /* Integration is its own desk on Oracle, not a line inside ERP. The
           Blueprint's Oracle archetype names the Integration Cloud developer and
           the security and roles architect as two of the three hardest roles to
           fill on a Fusion programme, and neither had a desk to sit in. */
        slug: "oracle-integration-cloud",
        name: "Oracle Integration Cloud",
        shortName: "Oracle OIC",
        scope:
          "Integration developers and architects on OIC, and the Visual Builder extension crews.",
        roles: [
          "Oracle Integration Cloud Developer",
          "Integration Architect, Oracle Integration Cloud",
          "Visual Builder Extension Developer",
          "Oracle Cloud Security and Roles Architect",
        ],
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
      "Suite-level rebuild 31 Jul 2026, names sourced verbatim from the legacy corpus Salesforce expertise page. Bench rebuilt to SAP depth 2 Aug 2026 (platform parity round §5).",
    /* THE THINNEST BENCH ON THE SITE and the most generic: 10 roles against
       SAP's 64, and half of them were "Business Analyst", "Frontend Engineer",
       "Data Engineer", "Functional Architect" — titles that say nothing about
       Salesforce and would read identically on any platform. A Salesforce buyer
       scanning that list learns nothing.

       Four clouds added, all real Salesforce products and all already named in
       the repo: the Programme Staffing Blueprint's Salesforce archetype lists
       Data Cloud, Revenue and CPQ, Field Service and Agentforce among the
       functional streams. Nothing here is a product invented to pad the suite. */
    modules: [
      {
        slug: "sales-cloud",
        name: "Sales Cloud",
        scope:
          "Sales-process consultants, declarative specialists and Apex developers across the Sales Cloud estate.",
        roles: [
          "Salesforce Sales Cloud Consultant",
          "Salesforce Administrator",
          "Salesforce Apex Developer",
          "Declarative and Flow Specialist",
          "Salesforce Solution Architect",
        ],
      },
      {
        slug: "service-cloud",
        name: "Service Cloud",
        scope:
          "Case management and contact-centre consultants on Service Cloud.",
        roles: [
          "Salesforce Service Cloud Consultant",
          "Salesforce Omni-Channel Specialist",
          "Salesforce Apex Developer",
          "Salesforce Technical Architect",
        ],
      },
      {
        slug: "marketing-cloud",
        name: "Marketing Cloud",
        scope:
          "Campaign build and audience consultants, and the data feeds behind them. A separate skill and a separate market from the core platform bench.",
        roles: [
          "Marketing Cloud Consultant",
          "Journey Builder Specialist",
          "Marketing Cloud AMPscript Developer",
          "Account Engagement Consultant",
          "Marketing Cloud Data Architect",
        ],
      },
      {
        slug: "commerce-cloud",
        name: "Commerce Cloud",
        scope: "B2C and B2B commerce developers and architects.",
        roles: [
          "Salesforce B2C Commerce Developer",
          "Salesforce B2B Commerce Consultant",
          "Lightning Web Components Developer",
          "Commerce Cloud Solution Architect",
        ],
      },
      {
        slug: "experience-cloud",
        name: "Experience Cloud",
        scope: "Portal and community builds for customers and partners.",
        roles: [
          "Experience Cloud Consultant",
          "Lightning Web Components Developer",
          "Salesforce Identity and Access Architect",
        ],
      },
      {
        slug: "salesforce-data-cloud",
        name: "Salesforce Data Cloud",
        scope:
          "Unification, identity resolution and activation. New enough that the market is thin, and routinely assumed to be part of a standard build team.",
        roles: [
          "Salesforce Data Cloud Consultant",
          "Data Cloud Solution Architect",
          "Salesforce Data Migration Specialist",
        ],
      },
      {
        slug: "salesforce-revenue-cloud",
        name: "Salesforce Revenue Cloud",
        scope:
          "Quote-to-cash consultants across configure, price, quote and billing.",
        roles: [
          "Salesforce CPQ Consultant",
          "Salesforce Billing Consultant",
          "Revenue Cloud Solution Architect",
        ],
      },
      {
        slug: "salesforce-field-service",
        name: "Salesforce Field Service",
        scope:
          "Scheduling, dispatch and mobile workforce consultants on Field Service.",
        roles: [
          "Salesforce Field Service Consultant",
          "Field Service Scheduling Specialist",
        ],
      },
      {
        slug: "salesforce-agentforce",
        name: "Salesforce Agentforce",
        scope:
          "Agent build and governance on Agentforce. Cross-links to the vendor-neutral AI role families rather than repeating them.",
        roles: [
          "Agentforce Developer",
          "Salesforce AI Specialist",
          "Prompt Builder Specialist",
        ],
      },
      {
        slug: "salesforce-platform",
        name: "Salesforce Platform",
        scope:
          "Release engineering, environment strategy and permissions across every cloud above. Stood up late on most programmes, which is when metadata deployments become manual.",
        roles: [
          "Salesforce DevOps and Release Engineer",
          "Salesforce Release Manager",
          "Salesforce QA Automation Engineer",
          "Salesforce Platform Administrator",
        ],
      },
      {
        slug: "mulesoft-anypoint-platform",
        name: "MuleSoft Anypoint Platform",
        shortName: "MuleSoft",
        scope: "API and integration engineers across the Anypoint estate.",
        roles: [
          "MuleSoft Integration Developer",
          "MuleSoft Solution Architect",
          "Anypoint Platform Engineer",
          "API Product Manager",
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
    clients: [
      { name: "Al Tayer Group", market: "UAE", study: true },
      { name: "Majid Al Futtaim", market: "UAE" },
      { name: "Chalhoub Group", market: "UAE" },
      { name: "Ministry of Finance", market: "Saudi Arabia" },
      { name: "ZATCA", market: "Saudi Arabia" },
    ],
    ratified:
      "Suite-level rebuild 31 Jul 2026, names sourced verbatim from the legacy corpus platform pages. Three desks flagged uncertain — see QUESTIONS.md Q9.",
    modules: [
      {
        slug: "sap-s4hana",
        family: "Core ERP",
        name: "SAP S/4HANA",
        scope:
          "Core finance and logistics consultants across every deployment — brownfield conversion crews on-premise, standard-first consultants on public cloud, and mixed benches on private edition.",
        /* ORDER 1: one entry, deployment variants inside. Verified against SAP's
           2026 portfolio — the deployments are On-Premise, Cloud Public Edition
           and Cloud Private Edition. RISE is named as what it is, a commercial
           programme, rather than as a fourth deployment. GROW with SAP is real and
           OMITTED: no role in the repo names it, and R13's rule holds here too. */
        variants: [
          "On-Premise",
          "Cloud Public Edition",
          "Cloud Private Edition",
          "delivered via RISE with SAP",
        ],
        roles: [
          "SAP S/4HANA Architect",
          "SAP FI/CO Consultant",
          "SAP MM/SD Consultant",
          "ABAP Developer",
          "Data Migration Lead",
          "Functional Architect",
          "SAP Test Lead",
          "SAP CPI Integration Developer",
          "Cutover Manager",
          "Hypercare Lead",
          "Enterprise Architect",
          "PMO Lead",
        ],
      },
      {
        slug: "sap-s4hana-finance",
        family: "Autonomous Finance",
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
        family: "Data & analytics",
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
        /* Added on Sumeet's direction, 1 Aug. Signavio and LeanIX are current
           SAP products and the suite reads incomplete without them — the
           technology layer is not just BTP.

           They ship with NO roles, because we have none: searched, the data
           layer's SAP roles contain nothing for either. Under R16 a heading may
           only assert what every row satisfies, so rather than invent role
           titles these carry the scope line and the Desk-in-build marker, which
           is what the site already does for an offering we name but do not yet
           staff. Give me the roles and they fill. */
        slug: "sap-signavio",
        family: "Enterprise technology",
        name: "SAP Signavio",
        scope:
          "Process mining, modelling and transformation analysis on SAP Signavio.",
        roles: [
          "SAP Signavio Consultant",
          "Process Mining Analyst",
          "Business Process Architect",
        ],
      },
      {
        slug: "sap-leanix",
        family: "Enterprise technology",
        name: "SAP LeanIX",
        scope:
          "Enterprise architecture management and application portfolio mapping on SAP LeanIX.",
        roles: [
          "SAP LeanIX Consultant",
          "Enterprise Architect",
          "Application Portfolio Analyst",
        ],
      },
      {
        /* BTP elaborated. It shipped as one entry covering everything from
           integration to app development, which is the opposite of a lens — a
           buyer browsing SAP for integration work found nothing named. Its real
           children are separate products with separate benches. Integration
           Suite carries the CPI roles we already hold; Build has none yet. */
        slug: "sap-integration-suite",
        family: "Enterprise technology",
        name: "SAP Integration Suite",
        scope:
          "Cloud Integration, API management and event-driven integration across the SAP estate.",
        roles: [
          "SAP CPI Integration Developer",
          "Integration Architect",
          "Integration Developer",
        ],
      },
      {
        slug: "sap-build",
        family: "Enterprise technology",
        name: "SAP Build",
        scope:
          "Low-code application, process automation and work-zone delivery on SAP Build.",
        roles: [
          "SAP Build Developer",
          "Process Automation Consultant",
          "SAP Fiori Developer",
        ],
      },
      {
        slug: "sap-btp",
        family: "Enterprise technology",
        name: "SAP BTP (Business Technology Platform)",
        shortName: "SAP BTP",
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
        family: "Autonomous Supply Chain",
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
        family: "Autonomous CX",
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
        family: "Autonomous CX",
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
        family: "Autonomous Spend",
        name: "SAP Ariba (Procurement & Sourcing)",
        shortName: "SAP Ariba",
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
        family: "Autonomous HCM",
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
        family: "Autonomous Supply Chain",
        name: "SAP Extended Warehouse Management (SAP EWM)",
        shortName: "SAP EWM",
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
        family: "Data & analytics",
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
        family: "Autonomous Spend",
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
        family: "Autonomous CX",
        name: "SAP Emarsys",
        scope:
          "Campaign and customer-data consultants on the Emarsys engagement platform.",
        roles: [
          "Business Analyst",
          "Data Engineer",
          "SAP CX Functional Consultant",
        ],
      },
      /* ── SAP Business AI, seven desks ────────────────────────────────────
         Researched 1 Aug 2026 and ratified; the section rendered EMPTY before
         this, named on the page with a note and no roles behind it.

         The consolidation is the thing to get right. At Sapphire 2026 SAP
         announced the SAP Business AI Platform, folding its AI foundation layer
         together with Business Data Cloud and BTP into one offering. The old
         habit of listing AI Core, AI Launchpad and Generative AI Hub as three
         separate desks is out of date, and publishing them would date the page
         to a buyer who follows SAP.

         Every SAP performance figure is FORBIDDEN here and none appears: not the
         80 per cent of business tasks claim, not the 35 per cent migration
         effort reduction, not the 40 to 60 per cent HR cycle time, not the 400
         use cases. They are SAP's marketing and would become Yallo's claim the
         moment they were printed under our name. No customer names, and no GA
         date for anything.

         Scope lines say what Yallo places, never what Joule does for a business.

         Boundary with /ai-talent: this desk is SAP-specific roles on SAP's own
         AI stack. /ai-talent is the vendor-neutral role-family set. They
         cross-link once each way and the stack matrix is NOT duplicated here. */
      {
        slug: "sap-joule",
        family: "SAP Business AI",
        name: "Joule and Joule Assistants",
        scope:
          "The assistant layer across S/4HANA Cloud, SuccessFactors, Ariba, Concur and Service Cloud. RISE activates three assistants in year one and GROW carries the full portfolio, so the bench differs by commercial programme.",
        roles: [
          "SAP BTP AI Developer",
          "Prompt and Context Engineer, SAP-grounded",
          "Clean Core Extension Architect",
        ],
      },
      {
        slug: "sap-joule-studio",
        family: "SAP Business AI",
        name: "Joule Studio and Joule Agents",
        scope:
          "Building, managing and governing agents, including third-party agents. Joule Work is the newer natural-language interface layer and is in early adopter status, so we screen for build experience rather than for exposure to it.",
        roles: [
          "Joule Studio Agent Developer",
          "SAP BTP AI Developer",
          "Prompt and Context Engineer, SAP-grounded",
          "Integration Architect, MCP and agent-to-agent",
        ],
      },
      {
        slug: "sap-business-ai-platform",
        family: "SAP Business AI",
        name: "SAP Business AI Platform and BTP",
        scope:
          "The foundation layer and runtime, and the clean-core extension work that decides whether an agent survives the next upgrade.",
        roles: [
          "SAP AI Platform Engineer",
          "ABAP Cloud Developer",
          "Clean Core Extension Architect",
          "MLOps Engineer, SAP AI",
        ],
      },
      {
        slug: "sap-business-data-cloud",
        family: "SAP Business AI",
        name: "SAP Business Data Cloud",
        scope:
          "The data foundation agents are grounded on. Master Data Governance is now a core component of Business Data Cloud, and entity resolution came in with the Reltio acquisition. Datasphere has its own desk under Data and analytics and is not repeated here.",
        roles: [
          "Business Data Cloud Engineer",
          "SAP Datasphere Engineer",
          "Master Data Governance Consultant",
        ],
      },
      {
        slug: "sap-domain-models",
        family: "SAP Business AI",
        name: "SAP Domain Models and grounding",
        scope:
          "Models trained on SAP code, data, metadata, process and documentation, which ground Joule rather than generic web knowledge. Context graphs sit here, and so does the person who can tell a grounding failure from a prompt failure.",
        roles: [
          "Prompt and Context Engineer, SAP-grounded",
          "SAP Datasphere Engineer",
          "Process Mining Analyst feeding agent design",
        ],
      },
      {
        slug: "sap-autonomous-finance-assistants",
        family: "SAP Business AI",
        /* "Autonomous Finance assistants", not "Autonomous Finance". The latter
           is already a FAMILY name on this platform, carried by
           sap-s4hana-finance, and a module sharing its parent's name reads as a
           data error rather than as a distinction. The suffix is descriptive,
           not a coined SAP product. */
        name: "Autonomous Finance assistants",
        scope:
          "The finance assistant suite: financial closing, financial planning, billing, governance, tax and compliance, accounts receivable, and cash and treasury.",
        roles: [
          "Autonomous Finance Functional Lead",
          "Process Mining Analyst feeding agent design",
          "SAP BTP AI Developer",
        ],
      },
      {
        slug: "sap-agent-governance",
        family: "SAP Business AI",
        name: "Agent governance and interoperability",
        scope:
          "Guardrails, and interoperability through Model Context Protocol and agent-to-agent, including bidirectional interoperability with the Google Cloud and Microsoft agent frameworks.",
        roles: [
          "AI Governance Lead, SAP agents",
          "Integration Architect, MCP and agent-to-agent",
          "MLOps Engineer, SAP AI",
        ],
      },

      {
        slug: "sap-transportation-management",
        family: "Autonomous Supply Chain",
        name: "SAP Transportation Management (SAP TM)",
        shortName: "SAP TM",
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
          "Microsoft Fabric Data Engineer",
          "Azure Synapse Analytics Developer",
          "Azure Data Factory Developer",
          "Databricks Engineer",
          "Power BI Developer",
          "Azure AI Engineer",
          "Purview Data Governance Specialist",
          "Data Migration Lead",
        ],
      },
      {
        slug: "azure-infrastructure",
        name: "Azure Infrastructure",
        scope: "Landing zones, migrations and hybrid estates, built and run",
        roles: [
          "Azure Solution Architect",
          "Azure Landing Zone Architect",
          "Azure Cloud Engineer",
          "Azure Virtual Desktop Engineer",
          "Bicep and Terraform Automation Engineer",
          "Azure Migrate Specialist",
          "Azure Network Engineer",
          "Cloud Migration Lead",
        ],
      },
      {
        slug: "azure-security",
        name: "Azure Security",
        scope: "Identity, access and compliance across the Azure estate",
        roles: [
          "Microsoft Entra ID Engineer",
          "Microsoft Defender Engineer",
          "Microsoft Sentinel Engineer",
          "Cloud Security Architect, Azure",
          "Microsoft Purview Compliance Specialist",
          "GRC and Compliance Specialist",
        ],
      },
      {
        slug: "azure-devops",
        name: "Azure DevOps",
        scope: "Pipelines, containers and reliability after go-live",
        roles: [
          "Azure DevOps Engineer",
          "GitHub Actions Engineer",
          "Azure Kubernetes Service Platform Engineer",
          "Site Reliability Engineer, Azure",
          "Release Manager",
          "Infrastructure Automation Engineer",
        ],
      },
      {
        slug: "d365-finance-and-operations",
        name: "D365 Finance & Operations",
        scope:
          "Finance and supply chain implementations, rollouts and localisations",
        roles: [
          "D365 F&O Finance Consultant",
          "D365 F&O Supply Chain Consultant",
          "D365 F&O Functional Consultant",
          "X++ Developer",
          "D365 Technical Architect",
          "Data Migration Specialist, DMF",
          "Dual-write Integration Developer",
        ],
      },
      {
        slug: "d365-customer-engagement",
        name: "D365 Customer Engagement",
        scope:
          "Sales and Service implementations and the integrations around them",
        roles: [
          "D365 Sales Consultant",
          "D365 Customer Service Consultant",
          "D365 Field Service Consultant",
          "Customer Insights Consultant",
          "Dataverse Developer",
          "CRM Solution Architect",
          "Power Platform Developer",
        ],
      },
      {
        slug: "d365-business-central",
        name: "D365 Business Central",
        scope: "Mid-market ERP implementations and NAV-to-BC migrations",
        roles: [
          "Business Central Functional Consultant",
          "AL Developer",
          "Business Central Solution Architect",
          "Business Central Integration Developer",
          "NAV to Business Central Upgrade Consultant",
        ],
      },
      {
        slug: "d365-human-resources",
        name: "D365 Human Resources",
        scope: "HR implementations and payroll integrations",
        roles: [
          "D365 Human Resources Functional Consultant",
          "HR Transformation Lead",
          "Dynamics 365 HR Integration Developer",
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
          "Power Automate and RPA Developer",
          "Power Pages Developer",
          "Dataverse Solution Architect",
          "Power Platform Administrator",
          "Copilot Studio Developer",
          "Power BI Developer",
        ],
      },
      {
        slug: "microsoft-365-copilot",
        name: "Microsoft 365 Copilot",
        scope: "Readiness, data governance and adoption for Copilot rollouts",
        roles: [
          "Microsoft 365 Copilot Consultant",
          "Copilot Studio Developer",
          "Microsoft Purview Information Governance Specialist",
          "SharePoint and Teams Engineer",
          "Adoption and Change Lead",
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
          "Workday HCM Solution Architect",
          "Workday Core HR Consultant",
          "Workday Business Process Configuration Specialist",
          "Workday Integration Developer",
          "Workday Studio Developer",
          "Workday Security Consultant",
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
          "Workday Absence and Time Tracking Consultant",
          "Workday Payroll Integration Specialist",
          "Workday PICOF and PECI Integration Developer",
          "Multi-country Payroll Lead",
        ],
      },
      {
        slug: "workday-financial-management",
        name: "Workday Financial Management",
        scope: "Record-to-report implementations and ERP coexistence",
        roles: [
          "Workday Financials Consultant",
          "Workday Record to Report Lead",
          "Workday Accounting Centre Consultant",
          "Workday Financials Integration Developer",
          "Financial Data Migration Lead",
        ],
      },
      {
        slug: "workday-adaptive-planning",
        name: "Workday Adaptive Planning",
        scope: "Budgeting, forecasting and workforce cost models",
        roles: [
          "Workday Adaptive Planning Consultant",
          "Adaptive Planning Model Builder",
          "Workforce Cost Modelling Analyst",
          "FP&A Systems Analyst",
        ],
      },
      {
        slug: "workday-recruiting",
        name: "Workday Recruiting",
        scope: "Recruiting and onboarding configuration",
        roles: [
          "Workday Recruiting Consultant",
          "Workday Onboarding Configuration Specialist",
          "Candidate Experience Consultant",
        ],
      },
      {
        slug: "workday-talent-management",
        name: "Workday Talent Management",
        scope: "Performance, career and succession configuration",
        roles: [
          "Workday Talent and Performance Consultant",
          "Workday Succession Planning Consultant",
          "Workday Compensation Consultant",
        ],
      },
      {
        slug: "workday-learning",
        name: "Workday Learning",
        scope: "Learning rollouts and adoption",
        roles: [
          "Workday Learning Consultant",
          "Learning Content Migration Specialist",
          "Adoption and Change Lead",
        ],
      },
      {
        slug: "workday-workforce-planning",
        name: "Workday Workforce Planning",
        scope: "Headcount planning, scenario modelling and forecasting",
        roles: [
          "Workday Workforce Planning Consultant",
          "Headcount Scenario Modelling Analyst",
          "Workday People Analytics Consultant",
        ],
      },
      {
        slug: "workday-prism-analytics",
        name: "Workday Prism Analytics",
        scope: "Reporting and data hub work across HR and finance",
        roles: [
          "Workday Prism Analytics Consultant",
          "Workday Reporting Developer",
          "Workday Discovery Boards Specialist",
          "Workday Extend Developer",
        ],
      },
      {
        slug: "workday-psa",
        name: "Workday PSA",
        scope: "Resource scheduling, time tracking and project billing",
        roles: [
          "Workday PSA Consultant",
          "Workday Project Billing Consultant",
          "Resource Management Analyst",
        ],
      },
    ],
  },

  /**
   * Informatica — R-INF1, the SEVENTH platform, ratified 1 Aug 2026.
   *
   * Last in the platform order everywhere it is expressed (R-INF2). It is a
   * real desk, not a co-equal of the ERP suites, and the order says so.
   *
   * Nine desks, real products only, from docs/design/context-informatica.md §3.
   * CLAIRE is deliberately absent: it is Informatica's AI engine, referenced
   * inside the desks that use it, and a CLAIRE desk would repeat the error canon
   * §3 already ruled on for SAP Special Applications. There is no tenth desk
   * invented to round the number up.
   *
   * Roles are the §4 market titles, mapped to the desks they actually belong to
   * rather than sprayed evenly. "Informatica MDM Specialist" is carried through
   * from src/data/l1/retail.ts, which already places it — an authored set
   * REPLACES the derived module list, so a role the repo already holds would
   * otherwise have disappeared from the platform axis.
   *
   * No scarce-role flags and no scarcity data on any of them: R-INF5, and there
   * is no such field on this interface to set.
   */
  informatica: {
    slug: "informatica",
    name: "Informatica",
    ratified:
      "R-INF1, docs/design/context-informatica.md v1.0, ratified by Sumeet Goenka 1 Aug 2026 (canon §3 amendment log)",
    modules: [
      {
        slug: "idmc-platform",
        name: "IDMC platform administration",
        scope:
          "Tenancy, runtime environments, Secure Agents, upgrades, capacity and cost on Intelligent Data Management Cloud",
        roles: [
          "Informatica Administrator",
          "IDMC Solution Architect",
          "Data Platform Solution Architect",
          "Secure Agent Engineer",
          "IDMC Capacity and Cost Analyst",
        ],
      },
      {
        slug: "cloud-data-integration",
        name: "Cloud Data Integration",
        scope:
          "The core ETL and ELT desk: CDI and CDI-Elastic, mass ingestion, mappings and taskflows",
        roles: [
          "Informatica Developer, CDI",
          "IDMC Solution Architect",
          "Data Migration Lead",
          "Data Platform Solution Architect",
          "Mass Ingestion Specialist",
          "Taskflow Developer",
        ],
      },
      {
        slug: "cloud-application-integration",
        name: "Cloud Application Integration",
        scope:
          "Process orchestration, API Manager, real-time and event integration on CAI",
        roles: [
          "Integration Architect, CAI and API",
          "IDMC Solution Architect",
          "Informatica Administrator",
          "API Manager Specialist",
          "Event Integration Developer",
        ],
      },
      {
        slug: "data-quality",
        name: "Cloud Data Quality",
        scope:
          "Profiling, rule specifications, cleansing, standardisation, match and merge logic",
        roles: [
          "Data Quality Developer",
          "Data Quality Analyst",
          "Data Governance Lead",
          "Data Profiling Specialist",
          "Match and Merge Rules Developer",
        ],
      },
      {
        slug: "master-data-management",
        name: "Master Data Management",
        scope:
          "MDM SaaS and MDM Hub, and the domain builds on them: Customer 360, Supplier 360, Product 360, Reference 360",
        roles: [
          "MDM Solution Architect",
          "MDM Developer",
          "Informatica MDM Specialist",
          "Data Steward",
          "Data Migration Lead",
          "Customer 360 Consultant",
          "Product 360 Consultant",
        ],
      },
      {
        slug: "data-governance-catalog",
        name: "Data Governance and Catalog",
        scope:
          "CDGC and Metadata Command Center: lineage, stewardship and business glossary, absorbing the former EDC and Axon estates",
        roles: [
          "Data Governance Lead",
          "Metadata and Catalogue Analyst",
          "Data Steward",
          "Data Quality Analyst",
          "Business Glossary Owner",
          "Lineage Analyst",
        ],
      },
      {
        slug: "powercenter-modernisation",
        name: "PowerCenter modernisation",
        scope:
          "PowerCenter run and support, plus assessment and migration to IDMC. The scarcest skill pairing on this desk list",
        roles: [
          "PowerCenter Developer",
          "Cloud Migration Specialist, PowerCenter to IDMC",
          "Informatica Developer, CDI",
          "IDMC Solution Architect",
          "PowerCenter Administrator",
        ],
      },
      {
        slug: "data-privacy-masking",
        name: "Data privacy and masking",
        scope:
          "Data Privacy Management, dynamic and persistent masking, and test data management",
        roles: [
          "Test Data Management Specialist",
          "Data Governance Lead",
          "Informatica Administrator",
          "Data Masking Engineer",
          "Data Privacy Management Consultant",
        ],
      },
      {
        slug: "b2b-data-exchange",
        name: "B2B data exchange",
        scope:
          "B2B Gateway, Data Transformation and Cloud Integration Hub: EDI and partner onboarding",
        roles: [
          "Integration Architect, CAI and API",
          "Informatica Developer, CDI",
          "Informatica Administrator",
          "B2B Gateway Specialist",
          "EDI and Partner Onboarding Consultant",
        ],
      },
    ],
  },
};
