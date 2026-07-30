import type { L1PageData } from "./types";

export const financeData: L1PageData = {
  slug: "finance",
  category: "industries",
  hue: "green",
  breadcrumb: [
    { label: "Industries", href: "/industries" },
    { label: "Banking & Financial Services" },
  ],

  eyebrow: "Banking & Financial Services · Contract-first",
  title: "Banking & FS contractors,",
  emphasis: "shortlisted in 72 hours.",
  sub: "Temenos, FLEXCUBE, Finacle, Guidewire and Murex specialists for core banking, payments, wealth and insurance programmes across the Middle East, Europe and India. Architect-screened for regulated-industry depth.",
  primaryCta: { label: "Send us a brief", href: "/brief" },
  secondaryCta: { label: "View expertise", href: "#expertise" },
  statusDots: [
    "72h brief to shortlist",
    "Active contractor bench",
    "Middle East · Europe · India",
    "Contract · EOR · Managed Delivery",
  ],

  stats: [
    { n: "72h", l: "Brief to shortlist" },
    { n: "2:1", l: "CV to interview ratio" },
    { n: "20", l: "Finance function areas" },
    { n: "80%", l: "Contracts renewed" },
  ],

  introEyebrow: "Why Yallo for banking & financial services",
  introTitle:
    "Finance programmes stall when regulated-industry depth isn't in the room.",
  introCopy: [
    "Every Temenos core migration, every Guidewire policy admin rollout, every Murex trading platform build shares the same failure mode — the implementation depends on the depth of the contractor in the room. Generic recruiters place platform names. We place implementation track records inside regulated environments.",
    "Our bench is assessed by specialists who have run banking, insurance and capital markets delivery. We screen for the specific operating context — KYC/AML, PCI, PRA/FCA, DFSA, RBI — not just certification badges.",
  ],
  introStatCards: [
    {
      n: "71%",
      l: "of banking CIOs report contractor quality — not budget — is the primary reason core and payments programmes slip past go-live.",
    },
    {
      n: "5–8 wks",
      l: "Average time lost when a specialist is placed without regulated-industry screening. Yallo's shortlist is in your inbox in 72h.",
    },
    {
      n: "Contract-first",
      l: "Primary focus is interim and contract deployment. Also available in Permanent, EOR and Managed Delivery models.",
    },
  ],

  scarceEyebrow: "Scarce talent",
  scarceIcon: "scarce",
  scarceTitle:
    "The roles every banking programme needs — and struggles to find.",
  scarceCopy:
    "These are the specialists that appear on every finance brief and disappear from the market fastest. Yallo maintains an active bench in each of these areas across the Middle East, Europe and India. When you need one, you don't have six weeks.",
  scarceCta: { label: "Brief us on a scarce role", href: "/brief" },
  scarceRoles: [
    {
      name: "Temenos Transact Technical Architect",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "Oracle FLEXCUBE Solution Architect",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "Finacle Core Banking Consultant",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "Murex Front-Office Consultant",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "Guidewire ClaimCenter Configuration Lead",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "nCino Loan Origination Specialist",
      scarcity: "high",
      engagement: "contract-perm",
    },
    {
      name: "PSD2 / Open Banking Integration Architect",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "AML / Actimize Transaction Monitoring Lead",
      scarcity: "high",
      engagement: "contract",
    },
  ],

  expertiseEyebrow: "Our expertise",
  expertiseTitle:
    "Twenty finance function areas. Contractor bench across all of them.",
  expertiseSub:
    "From core banking to capital markets — we place specialists into every function that moves a financial-services programme forward.",
  expertise: [
    {
      slug: "core-banking",
      num: "01",
      title: "Core Banking Systems",
      icon: "finance",
      blurb: "Deposits, ledger and account services",
      roles: [
        "Temenos Transact Consultant",
        "Oracle FLEXCUBE Specialist",
        "Finacle Core Banking Lead",
      ],
    },
    {
      slug: "digital-payments",
      num: "02",
      title: "Digital Payments",
      icon: "pricing",
      blurb: "Card, real-time payments and issuing",
      roles: [
        "Fiserv Digital Payments Consultant",
        "ACI Worldwide Specialist",
        "Mastercard Payment Gateway Lead",
      ],
    },
    {
      slug: "lending",
      num: "03",
      title: "Lending & Loan Management",
      icon: "returns",
      blurb: "Origination, servicing and collections",
      roles: [
        "nCino Loan Origination Specialist",
        "Finastra Loan IQ Consultant",
        "Temenos Lending Lead",
      ],
    },
    {
      slug: "cards-issuing",
      num: "04",
      title: "Cards & Issuing",
      icon: "pricing",
      blurb: "Debit, credit and prepaid card platforms",
      roles: [
        "TSYS Issuer Solutions Consultant",
        "FIS Card Management Specialist",
        "Marqeta Platform Lead",
      ],
    },
    {
      slug: "wealth",
      num: "05",
      title: "Wealth & Asset Management",
      icon: "loyalty",
      blurb: "Portfolio, advisor tools and reporting",
      roles: [
        "FIS Wealth Management Consultant",
        "Temenos WealthSuite Specialist",
        "Oracle Wealth Management Lead",
      ],
    },
    {
      slug: "investment-banking",
      num: "06",
      title: "Investment Banking Solutions",
      icon: "analytics",
      blurb: "Trading, risk and post-trade",
      roles: [
        "Murex Front-Office Consultant",
        "ION Trading Specialist",
        "Calypso Software Lead",
      ],
    },
    {
      slug: "treasury",
      num: "07",
      title: "Treasury & Cash Management",
      icon: "supply",
      blurb: "Liquidity, FX and cash-flow forecasting",
      roles: [
        "SAP Treasury & Risk Consultant",
        "Kyriba Treasury Specialist",
        "Oracle Treasury Cloud Lead",
      ],
    },
    {
      slug: "insurance-policy",
      num: "08",
      title: "Insurance Policy Administration",
      icon: "eor",
      blurb: "Policy, billing and claims platforms",
      roles: [
        "Guidewire ClaimCenter Consultant",
        "Duck Creek Policy Specialist",
        "SAP FS-PM Lead",
      ],
    },
    {
      slug: "risk-compliance",
      num: "09",
      title: "Risk & Compliance Management",
      icon: "security",
      blurb: "Credit, market and operational risk",
      roles: [
        "SAS Risk Management Consultant",
        "Oracle FSAA Specialist",
        "Wolters Kluwer OneSumX Lead",
      ],
    },
    {
      slug: "kyc-aml",
      num: "10",
      title: "KYC / AML & Fin Crime",
      icon: "security",
      blurb: "Customer due diligence and transaction monitoring",
      roles: [
        "NICE Actimize AML Consultant",
        "SAS AML Specialist",
        "Oracle Financial Crime Lead",
      ],
    },
    {
      slug: "reg-compliance",
      num: "11",
      title: "Regulatory Compliance & Governance",
      icon: "government",
      blurb: "FCA / PRA / DFSA reporting and controls",
      roles: [
        "Wolters Kluwer Regulatory Reporting Consultant",
        "Thomson Reuters ONESOURCE Specialist",
        "MetricStream GRC Lead",
      ],
    },
    {
      slug: "digital-onboarding",
      num: "12",
      title: "Digital Onboarding & Open Banking",
      icon: "integration",
      blurb: "PSD2 APIs, KYC onboarding and consent",
      roles: [
        "Open Banking Integration Architect",
        "Onfido / Jumio KYC Specialist",
        "Backbase Digital Banking Consultant",
      ],
    },
    {
      slug: "fs-crm",
      num: "13",
      title: "Financial Services CRM",
      icon: "crm",
      blurb: "Client, householding and lifecycle",
      roles: [
        "Salesforce Financial Services Cloud Consultant",
        "MS Dynamics 365 FS CRM Specialist",
        "Oracle CX for FS Lead",
      ],
    },
    {
      slug: "fpna",
      num: "14",
      title: "Financial Planning & Analytics",
      icon: "analytics",
      blurb: "FP&A, budgeting and scenario modelling",
      roles: [
        "SAP Analytics Cloud for Finance Consultant",
        "Oracle EPM / PBCS Specialist",
        "Anaplan FS Model Builder",
      ],
    },
    {
      slug: "finance-ops",
      num: "15",
      title: "Accounting & Financial Operations",
      icon: "finance",
      blurb: "GL, close, IFRS 9/17 and product control",
      roles: [
        "SAP S/4HANA Finance for FS Consultant",
        "Oracle Financials Cloud Specialist",
        "MS Dynamics 365 Finance Lead",
      ],
    },
    {
      slug: "data-ai-fs",
      num: "16",
      title: "Data & AI in Financial Services",
      icon: "dataAi",
      blurb: "Data platform, ML models and MLOps",
      roles: [
        "Snowflake Data Cloud for Finance Consultant",
        "Google Cloud AI for FS Specialist",
        "Azure AI for Banking Lead",
      ],
    },
    {
      slug: "cybersecurity-fs",
      num: "17",
      title: "Cybersecurity for Financial Services",
      icon: "security",
      blurb: "SOC, IAM and threat detection",
      roles: [
        "Palo Alto Networks for Finance Consultant",
        "IBM Security for FS Specialist",
        "Fortinet Financial Cybersecurity Lead",
      ],
    },
    {
      slug: "procurement",
      num: "18",
      title: "Procurement & Vendor Management",
      icon: "finance",
      blurb: "Sourcing, contracts and third-party risk",
      roles: [
        "SAP Ariba Consultant",
        "Coupa Procurement Specialist",
        "Oracle Procurement Cloud Lead",
      ],
    },
    {
      slug: "hcm-fs",
      num: "19",
      title: "Human Capital Management",
      icon: "workforce",
      blurb: "Talent, comp and workforce planning",
      roles: [
        "SAP SuccessFactors Consultant",
        "Oracle HCM Cloud Specialist",
        "Workday HCM Lead",
      ],
    },
    {
      slug: "it-infra-fs",
      num: "20",
      title: "IT Infrastructure & Operations",
      icon: "cloud",
      blurb: "ITSM, endpoint and platform ops",
      roles: [
        "ServiceNow ITSM Consultant",
        "BMC Helix Specialist",
        "Microsoft Endpoint Manager Lead",
      ],
    },
  ],

  segmentsEyebrow: "Segments we support",
  segmentsTitle:
    "Every financial-services segment. Specialists who know the context.",
  segmentsSub:
    "Retail banking runs different programmes from insurance or capital markets. Our contractors understand the specific operating context — not just the platform.",
  segments: [
    {
      id: "retail-banking",
      name: "Retail Banking",
      intro:
        "Deposits, cards, mortgages and digital channels at consumer scale. Core migrations, digital onboarding and channel modernisation dominate the brief pipeline.",
      roles: [
        "Temenos Transact Consultant",
        "Oracle FLEXCUBE Specialist",
        "Digital Onboarding Architect",
        "Backbase Consultant",
        "Salesforce FSC Lead",
        "Payments Integration Specialist",
        "Card Management Consultant",
        "AML Systems Lead",
        "PSD2 / Open Banking Architect",
      ],
    },
    {
      id: "corporate-banking",
      name: "Corporate Banking",
      intro:
        "Cash management, trade finance and lending for corporates. Client portals, KYC-refresh and lending workflows are constant pain points.",
      roles: [
        "Finastra Loan IQ Consultant",
        "nCino Corporate Banking Specialist",
        "Corporate Onboarding Architect",
        "SWIFT Integration Lead",
        "Trade Finance Systems Consultant",
        "Cash Management Systems Specialist",
        "SAP Treasury Consultant",
        "Kyriba Specialist",
        "Corporate Client Portal Architect",
      ],
    },
    {
      id: "wealth-asset",
      name: "Wealth & Asset Management",
      intro:
        "Portfolio management, advisor productivity and client reporting. Cross-border regulation and household-level views are the recurring differentiators.",
      roles: [
        "FIS Wealth Management Consultant",
        "Temenos WealthSuite Specialist",
        "Oracle Wealth Management Lead",
        "Advisor Portal Architect",
        "Portfolio Analytics Consultant",
        "Cross-Border Compliance Specialist",
        "Salesforce FSC Wealth Lead",
        "Reporting & Reg Consultant",
        "Alternative Assets Systems Lead",
      ],
    },
    {
      id: "insurance",
      name: "Insurance Services",
      intro:
        "P&C, life and health carriers. Policy admin migrations, claims automation and IFRS 17 reporting drive the platform selection.",
      roles: [
        "Guidewire ClaimCenter Consultant",
        "Duck Creek Policy Specialist",
        "SAP FS-PM Lead",
        "IFRS 17 Reporting Consultant",
        "Actuarial Modelling Specialist",
        "Claims Automation Architect",
        "Underwriting Systems Consultant",
        "Insurance Analytics Lead",
        "Salesforce for Insurance Specialist",
      ],
    },
    {
      id: "investment-banking",
      name: "Investment Banking",
      intro:
        "Front, middle and back-office trading. Murex/Calypso migrations, XVA and FRTB delivery need specialists with capital-markets muscle memory.",
      roles: [
        "Murex Front-Office Consultant",
        "ION Trading Specialist",
        "Calypso Software Lead",
        "FRTB / Market Risk Consultant",
        "XVA / CVA Systems Specialist",
        "Post-Trade Processing Architect",
        "Reconciliation Systems Consultant",
        "Reg Reporting for IB Lead",
        "Fixed Income Systems Specialist",
      ],
    },
    {
      id: "digital-payments-seg",
      name: "Digital Payments",
      intro:
        "Card issuing, real-time rails and merchant acquiring. Regulatory rails (ISO 20022, SEPA Inst, FedNow) demand tight programme discipline.",
      roles: [
        "Fiserv Payments Consultant",
        "ACI Worldwide Specialist",
        "Mastercard Payment Gateway Lead",
        "ISO 20022 Migration Consultant",
        "Marqeta Platform Specialist",
        "Card Management Architect",
        "Real-Time Payments Consultant",
        "PSD2 / Open Banking Specialist",
        "Merchant Acquiring Systems Lead",
      ],
    },
    {
      id: "risk-compliance-seg",
      name: "Risk & Compliance",
      intro:
        "Credit, market, operational and financial-crime risk. Regulator-driven programme cadence and end-of-cycle audit demands.",
      roles: [
        "SAS Risk Consultant",
        "Oracle FSAA Specialist",
        "Wolters Kluwer OneSumX Lead",
        "Credit Risk Modelling Consultant",
        "Market Risk Systems Specialist",
        "Operational Risk Analyst",
        "Basel III / IV Reporting Lead",
        "NICE Actimize AML Consultant",
        "GRC Programme Manager",
      ],
    },
    {
      id: "treasury-cash",
      name: "Treasury & Cash Management",
      intro:
        "Liquidity, FX and cash-flow forecasting. Corporate treasury and bank treasury programmes both live and die on integration quality.",
      roles: [
        "SAP TRM Consultant",
        "Kyriba Specialist",
        "Oracle Treasury Cloud Lead",
        "FX Systems Consultant",
        "Cash-Flow Forecasting Analyst",
        "Payments Integration Architect",
        "Bank Connectivity Specialist",
        "SWIFT Integration Consultant",
        "In-House Bank Systems Lead",
      ],
    },
    {
      id: "lending-loans",
      name: "Lending & Loan Management",
      intro:
        "Origination, servicing and collections across retail, SME and corporate. Digital onboarding and credit-decisioning are the two consistent hotspots.",
      roles: [
        "nCino Loan Origination Specialist",
        "Finastra Loan IQ Consultant",
        "Temenos Lending Lead",
        "Credit Decisioning Architect",
        "Collections Systems Specialist",
        "Servicing Platform Consultant",
        "Mortgage Origination Consultant",
        "SME Lending Systems Lead",
        "Open Banking Data Consultant",
      ],
    },
    {
      id: "cybersecurity-seg",
      name: "Cybersecurity for Banking",
      intro:
        "SOC, IAM, DLP and threat detection for regulated banks. Zero-trust programmes and payment-security uplift are the biggest bench draws.",
      roles: [
        "Palo Alto Networks Consultant",
        "IBM Security for FS Specialist",
        "Fortinet Financial Security Lead",
        "IAM / SailPoint Consultant",
        "SIEM / Splunk Architect",
        "Zero Trust Programme Consultant",
        "DLP Systems Specialist",
        "Cloud Security Consultant",
        "Threat Detection Analyst",
      ],
    },
    {
      id: "fpna-seg",
      name: "Financial Planning & Analytics",
      intro:
        "Group FP&A, product-level P&L and scenario modelling. Modernisation from Excel-heavy stacks to Anaplan/EPM is the recurring theme.",
      roles: [
        "Anaplan FS Model Builder",
        "Oracle EPM / PBCS Specialist",
        "SAP Analytics Cloud Lead",
        "Group Consolidation Consultant",
        "Scenario Modelling Analyst",
        "Product Control Systems Lead",
        "Cost Allocation Specialist",
        "Board Reporting Consultant",
        "Tableau for Finance Lead",
      ],
    },
    {
      id: "reg-compliance-seg",
      name: "Regulatory Compliance & Governance",
      intro:
        "Multi-jurisdiction reporting under FCA, PRA, DFSA, RBI and more. Wolters Kluwer and Axiom migrations continue to dominate the pipeline.",
      roles: [
        "Wolters Kluwer Reg Reporting Consultant",
        "Thomson Reuters ONESOURCE Specialist",
        "MetricStream GRC Lead",
        "AxiomSL Reporting Consultant",
        "SFTR / EMIR Reporting Specialist",
        "COREP / FINREP Consultant",
        "SEC Reporting Lead",
        "Model Governance Consultant",
        "Reg Change Programme Manager",
      ],
    },
    {
      id: "it-infra-seg",
      name: "IT Infrastructure & Operations",
      intro:
        "Cloud landing zones, ITSM and DR programmes for regulated environments. Legacy midrange to cloud rehost/replatform is the busiest track.",
      roles: [
        "ServiceNow ITSM Consultant",
        "BMC Helix Specialist",
        "Microsoft Endpoint Manager Lead",
        "AWS / Azure Landing Zone Architect",
        "Mainframe Modernisation Consultant",
        "DR / BCM Consultant",
        "Kubernetes Platform Engineer",
        "Observability / Splunk Specialist",
        "Network Modernisation Lead",
      ],
    },
    {
      id: "procurement-seg",
      name: "Procurement & Vendor Management",
      intro:
        "Third-party risk, contracts and sourcing in a regulator-watched environment. Ariba/Coupa migrations run hot every year.",
      roles: [
        "SAP Ariba Consultant",
        "Coupa Procurement Specialist",
        "Oracle Procurement Cloud Lead",
        "Third-Party Risk Consultant",
        "Contracts Systems Specialist",
        "Vendor Master Data Consultant",
        "S2P Programme Manager",
        "Category Management Analyst",
        "Sourcing Optimisation Lead",
      ],
    },
    {
      id: "data-ai-seg",
      name: "Data & AI in Financial Services",
      intro:
        "Data platform, ML models and MLOps at bank scale. Fraud, credit and personalisation use-cases dominate the specialist demand.",
      roles: [
        "Snowflake for Finance Consultant",
        "Google Cloud AI for FS Specialist",
        "Azure AI for Banking Lead",
        "Databricks Consultant",
        "Fraud ML Model Consultant",
        "Credit Risk Model Specialist",
        "MLOps Architect",
        "Data Governance Consultant",
        "Personalisation ML Lead",
      ],
    },
  ],

  partners: [
    "SAP",
    "Oracle",
    "Temenos",
    "Finastra",
    "Infosys Finacle",
    "Salesforce",
    "Microsoft",
    "Anaplan",
    "Fiserv",
    "ACI Worldwide",
    "Guidewire",
    "Duck Creek",
    "FIS",
    "Murex",
    "Snowflake",
    "ServiceNow",
  ],

  insightsEyebrow: "Insights",
  insightsTitle: "What's happening in banking & FS talent right now.",
  insightsSub:
    "Written by Sumeet Goenka and the Yallo team. Opinionated, specific, useful.",
  insights: [
    {
      href: "/insights/temenos-transact-migration-talent",
      published: false,
      category: "Core Banking",
      title:
        "Temenos Transact migrations: why the specialist bench in the Gulf has thinned in 2025.",
      excerpt:
        "Every Gulf tier-1 that moved off legacy core in the last 18 months chased the same Transact architects. What that scarcity means for your 2026 timeline.",
      author: "Sumeet Goenka",
      minutes: 6,
    },
    {
      href: "/insights/guidewire-claimcenter-talent",
      published: false,
      category: "Insurance",
      title:
        "Guidewire ClaimCenter contractors: the roles insurers are hiring six months too late.",
      excerpt:
        "The insurers that delivered on time last year confirmed the ClaimCenter tech lead before the vendor was even signed. The fix isn't faster hiring — it's earlier briefing.",
      author: "Yallo Talent",
      minutes: 5,
    },
    {
      href: "/insights/psd3-open-banking-2025",
      published: false,
      category: "Digital Payments",
      title:
        "PSD3 and open banking: the API and integration talent that European banks now need on the bench.",
      excerpt:
        "The rules are moving from consent to true portability. Where the integration and API architects that can actually deliver this are, and what they cost.",
      author: "Sumeet Goenka",
      minutes: 7,
    },
    {
      href: "/insights/aml-actimize-scarcity-2025",
      published: false,
      category: "Fin Crime",
      title:
        "AML analytics: why NICE Actimize modellers are the hardest hire in FS this year.",
      excerpt:
        "Every large bank now runs its financial-crime programme through Actimize or a Snowflake-native equivalent. What we're seeing in placement demand across the Middle East and Europe.",
      author: "Sumeet Goenka",
      minutes: 6,
    },
  ],

  relatedTitle:
    "Adjacent industries, platforms and capabilities we place into financial services.",
  related: [
    {
      href: "/industries/retail",
      label: "Retail & Consumer",
      category: "Industry",
    },
    {
      href: "/industries/manufacturing",
      label: "Manufacturing & Logistics",
      category: "Industry",
    },
    { href: "/platforms/sap", label: "SAP", category: "Platform" },
    { href: "/platforms/oracle", label: "Oracle", category: "Platform" },
    {
      href: "/platforms/salesforce",
      label: "Salesforce",
      category: "Platform",
    },
    { href: "/platforms/microsoft", label: "Microsoft", category: "Platform" },
    {
      href: "/capabilities/data-analytics",
      label: "Data & Analytics",
      category: "Capability",
    },
    {
      href: "/capabilities/cybersecurity",
      label: "Cybersecurity",
      category: "Capability",
    },
  ],

  seo: {
    title:
      "Banking & Financial Services Tech Contractors · Middle East · Europe · India | Yallo Talent",
    description:
      "Temenos, FLEXCUBE, Finacle, Guidewire and Murex contractors for banking, insurance and capital-markets programmes. 72h architect-screened shortlists across UK, Middle East and India.",
  },
};
