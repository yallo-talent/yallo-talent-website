import type { L1PageData } from "./types";

export const healthcareData: L1PageData = {
  slug: "healthcare",
  category: "industries",
  breadcrumb: [
    { label: "Industries", href: "/industries" },
    { label: "Healthcare & Life Sciences" },
  ],

  eyebrow: "Healthcare & Life Sciences · Contract-first",
  title: "Healthcare & life sciences contractors,",
  sectorNoun: "healthcare",
  emphasis: "shortlisted in 72 hours.",
  sub: "Epic, Cerner, Veeva, Medidata and Guidewire specialists for provider, payer and life-sciences programmes across the Middle East, Europe and India. Screened for regulated-industry depth.",
  primaryCta: { label: "Send us a brief", href: "/brief" },
  secondaryCta: { label: "View expertise", href: "#expertise" },
  statusDots: [
    "72h brief to shortlist",
    "Active contractor bench",
    "Middle East · Europe · India",
    "GxP / HIPAA aware",
  ],

  introEyebrow: "Why us for healthcare & life sciences",
  introTitle:
    "Care programmes stall when regulated-industry depth isn't in the room.",
  introCopy: [
    "Every Epic go-live, every Veeva Vault rollout, every pharma serialisation programme shares the same failure mode — the implementation depends on the depth of the contractor in the room. Generic recruiters place platform names. We place implementation track records inside GxP and HIPAA environments.",
    "Our bench is assessed by specialists who have delivered inside providers, payers, and life-sciences organisations. We screen for the operating context — validated systems, HL7 / FHIR, IEC 62304, MDR — not just certification badges.",
  ],
  introStatCards: [
    {
      n: "69%",
      l: "of health-system CIOs report contractor quality — not budget — is the primary reason clinical and admin programmes slip past go-live.",
    },
    {
      n: "6–8 wks",
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
    "The roles every healthcare & life-sciences programme needs — and struggles to find.",
  scarceCopy:
    "These are the specialists that appear on every provider, payer and life-sciences brief and disappear from the market fastest. Yallo maintains an active bench in each of these areas across the Middle East, Europe and India.",
  scarceCta: { label: "Brief us on a scarce role", href: "/brief" },
  scarceRoles: [
    {
      name: "Epic Systems Solution Architect",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "Cerner Millennium Consultant",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "Veeva Vault QualityDocs Lead",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "Medidata Rave Clinical Data Manager",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "HL7 / FHIR Integration Architect",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "Pharma Serialisation (DSCSA / FMD) Specialist",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "Salesforce Health Cloud Solution Architect",
      scarcity: "high",
      engagement: "contract-perm",
    },
    {
      name: "IEC 62304 Medical Device Software Lead",
      scarcity: "high",
      engagement: "contract",
    },
  ],

  expertiseEyebrow: "Our expertise",
  expertiseTitle:
    "Every healthcare and life-sciences function area, with a contractor bench behind it.",
  expertiseSub:
    "From clinical systems to lab operations — we place specialists into every function that moves a care or life-sciences programme forward.",
  expertise: [
    {
      slug: "patient-mgmt",
      num: "01",
      title: "Patient Management",
      icon: "cx",
      blurb: "Registration, scheduling and access",
      roles: [
        "Epic Cadence Consultant",
        "Cerner Registration Specialist",
        "Salesforce Health Cloud Lead",
      ],
    },
    {
      slug: "ehr",
      num: "02",
      title: "Electronic Health Records",
      icon: "eor",
      blurb: "Clinical documentation and orders",
      roles: [
        "Epic Systems Consultant",
        "Cerner Millennium Specialist",
        "Allscripts EHR Lead",
      ],
    },
    {
      slug: "clinical-trials",
      num: "03",
      title: "Clinical Trials Management",
      icon: "cases",
      blurb: "CTMS, EDC and eTMF",
      roles: [
        "Medidata Rave Consultant",
        "Oracle Clinical One Specialist",
        "Veeva CTMS Lead",
      ],
    },
    {
      slug: "pharma-supply",
      num: "04",
      title: "Pharmaceutical Supply Chain",
      icon: "supply",
      blurb: "Serialisation, cold chain and OEM",
      roles: [
        "SAP IBP for Pharma Consultant",
        "Kinaxis RapidResponse Specialist",
        "Blue Yonder Pharma Lead",
      ],
    },
    {
      slug: "reg-life-sciences",
      num: "05",
      title: "Regulatory Compliance (Life Sciences)",
      icon: "government",
      blurb: "Submissions, quality and audits",
      roles: [
        "Veeva QualityOne Consultant",
        "MasterControl Specialist",
        "Oracle LS Compliance Lead",
      ],
    },
    {
      slug: "telemedicine",
      num: "06",
      title: "Telemedicine & Virtual Care",
      icon: "integration",
      blurb: "Virtual clinic, RPM and care pathways",
      roles: [
        "Teladoc Health Consultant",
        "Amwell Virtual Care Specialist",
        "Zoom for Healthcare Lead",
      ],
    },
    {
      slug: "healthcare-analytics",
      num: "07",
      title: "Healthcare Analytics & AI",
      icon: "dataAi",
      blurb: "Clinical insights, ML and MLOps",
      roles: [
        "Snowflake for Healthcare Consultant",
        "Google Cloud AI Healthcare Specialist",
        "Azure AI for Health Lead",
      ],
    },
    {
      slug: "cybersecurity-hc",
      num: "08",
      title: "Cybersecurity for Healthcare",
      icon: "security",
      blurb: "HIPAA, ransomware and IoMT security",
      roles: [
        "Palo Alto Networks Consultant",
        "IBM Security for Healthcare Specialist",
        "Fortinet Healthcare Lead",
      ],
    },
    {
      slug: "precision-medicine",
      num: "09",
      title: "Precision Medicine",
      icon: "spark",
      blurb: "Genomics, biomarker and clinical pipelines",
      roles: [
        "Illumina Bioinformatics Consultant",
        "23andMe Health Specialist",
        "Oracle Precision Medicine Lead",
      ],
    },
    {
      slug: "medical-devices",
      num: "10",
      title: "Medical Device Systems",
      icon: "assortment",
      blurb: "IEC 62304, SaMD and post-market",
      roles: [
        "IEC 62304 SW Lead",
        "MDR / FDA 510(k) Consultant",
        "SaMD Architect",
      ],
    },
    {
      slug: "population-health",
      num: "11",
      title: "Population Health",
      icon: "workforce",
      blurb: "Risk stratification and care gap closure",
      roles: [
        "Population Health Analytics Consultant",
        "Care Pathways Specialist",
        "Risk Adjustment Lead",
      ],
    },
    {
      slug: "care-coordination",
      num: "12",
      title: "Care Coordination",
      icon: "crm",
      blurb: "Referrals, transitions and shared care plans",
      roles: [
        "Salesforce Health Cloud Consultant",
        "Care Coordination Systems Specialist",
        "MS Dynamics for Health Lead",
      ],
    },
    {
      slug: "interop-fhir",
      num: "13",
      title: "Interoperability & FHIR",
      icon: "integration",
      blurb: "HL7 v2, FHIR APIs and consent",
      roles: [
        "FHIR Integration Architect",
        "Rhapsody Integration Consultant",
        "InterSystems HealthShare Lead",
      ],
    },
    {
      slug: "digital-therapeutics",
      num: "14",
      title: "Digital Therapeutics",
      icon: "loyalty",
      blurb: "DTx apps, adherence and outcomes",
      roles: [
        "DTx Product Consultant",
        "Regulatory (DTx) Specialist",
        "Behavioural Analytics Lead",
      ],
    },
    {
      slug: "hcadmin",
      num: "15",
      title: "Healthcare Administration",
      icon: "eor",
      blurb: "Trust admin, workforce and finance",
      roles: [
        "Cerner Admin Consultant",
        "Epic Admin Specialist",
        "Oracle Healthcare Cloud Lead",
      ],
    },
    {
      slug: "reg-compliance-hc",
      num: "16",
      title: "Regulatory Compliance & Governance",
      icon: "government",
      blurb: "MHRA, EMA and FDA reporting",
      roles: [
        "Wolters Kluwer Compliance Consultant",
        "Thomson Reuters ONESOURCE Specialist",
        "MetricStream GRC Lead",
      ],
    },
    {
      slug: "finance-ops-hc",
      num: "17",
      title: "Accounting & Financial Operations",
      icon: "finance",
      blurb: "Trust finance, RCM and payer contracts",
      roles: [
        "SAP S/4HANA Finance for Health Consultant",
        "Oracle Financials Cloud Specialist",
        "MS Dynamics 365 Finance Lead",
      ],
    },
    {
      slug: "procurement-hc",
      num: "18",
      title: "Procurement & Vendor Management",
      icon: "finance",
      blurb: "GPO, supplier risk and clinical supplies",
      roles: [
        "SAP Ariba Consultant",
        "Coupa Procurement Specialist",
        "Oracle Procurement Cloud Lead",
      ],
    },
    {
      slug: "hcm-hc",
      num: "19",
      title: "Human Capital Management",
      icon: "workforce",
      blurb: "Rostering, credentialing and pensions",
      roles: [
        "SAP SuccessFactors Consultant",
        "Oracle HCM Cloud Specialist",
        "Workday HCM Lead",
      ],
    },
    {
      slug: "it-infra-hc",
      num: "20",
      title: "IT Infrastructure & Operations",
      icon: "cloud",
      blurb: "Cloud, ITSM and clinical uptime",
      roles: [
        "ServiceNow ITSM Consultant",
        "BMC Helix Specialist",
        "MS Endpoint Manager Lead",
      ],
    },
  ],

  segmentsEyebrow: "Segments we support",
  segmentsTitle:
    "Every healthcare & life-sciences segment. Specialists who know the context.",
  segmentsSub:
    "Providers run different programmes from CROs or biotech. Our contractors understand the specific operating context — not just the platform.",
  segments: [
    {
      id: "patient-mgmt-seg",
      name: "Patient Management",
      intro:
        "Access, scheduling and patient portals. Epic Cadence / Cerner Registration migrations dominate the pipeline.",
      roles: [
        "Epic Cadence Consultant",
        "Cerner Registration Specialist",
        "Salesforce Health Cloud Lead",
        "Patient Portal Architect",
        "Access Analytics Consultant",
        "MyChart Integration Specialist",
        "Scheduling Optimisation Lead",
        "Consent Systems Consultant",
        "Waitlist Systems Analyst",
      ],
    },
    {
      id: "ehr-seg",
      name: "Electronic Health Records (EHR)",
      intro:
        "Provider EHR platforms — clinical documentation, orders, decision support. IEC 62304 and CDSS integration expertise matters.",
      roles: [
        "Epic Systems Consultant",
        "Cerner Millennium Specialist",
        "Allscripts EHR Lead",
        "CDSS Integration Consultant",
        "Clinical Content Designer",
        "HL7 / FHIR Architect",
        "Order Management Specialist",
        "Ambulatory EHR Consultant",
        "Inpatient EHR Consultant",
      ],
    },
    {
      id: "clinical-trials-seg",
      name: "Clinical Trials Management",
      intro:
        "Sponsor, CRO and site systems. Rave, Clinical One and Veeva CTMS migrations are the busiest track.",
      roles: [
        "Medidata Rave Consultant",
        "Oracle Clinical One Specialist",
        "Veeva CTMS Lead",
        "EDC Programmer",
        "eTMF Consultant",
        "CDISC / SDTM Specialist",
        "Statistical Programming Lead",
        "Regulatory Submission Consultant",
        "Trial Master File Analyst",
      ],
    },
    {
      id: "pharma-supply-seg",
      name: "Pharmaceutical Supply Chain",
      intro:
        "Serialisation, cold chain and multi-echelon planning for pharma. Track & trace obligations dominate.",
      roles: [
        "SAP IBP for Pharma Consultant",
        "Kinaxis RapidResponse Specialist",
        "Blue Yonder Pharma Lead",
        "Serialisation Systems Consultant",
        "Cold Chain Logistics Specialist",
        "Contract Manufacturing Consultant",
        "Track & Trace Architect",
        "GxP Supply Planner",
        "Pharma WMS Consultant",
      ],
    },
    {
      id: "reg-ls-seg",
      name: "Regulatory Compliance in Life Sciences",
      intro:
        "Submissions, QMS and audit-readiness for pharma and medical devices. Veeva Vault and MasterControl migrations run hot.",
      roles: [
        "Veeva QualityOne Consultant",
        "MasterControl Specialist",
        "Oracle LS Compliance Lead",
        "Regulatory Submission Consultant",
        "QMS Validation Specialist",
        "GxP Validation Consultant",
        "Audit Systems Lead",
        "eCTD Publishing Specialist",
        "Change Control Analyst",
      ],
    },
    {
      id: "telemedicine-seg",
      name: "Telemedicine & Virtual Care",
      intro:
        "Virtual clinics, RPM and asynchronous care. Post-pandemic scale meets long-term care-model change.",
      roles: [
        "Teladoc Consultant",
        "Amwell Specialist",
        "Zoom for Healthcare Lead",
        "RPM Systems Consultant",
        "Virtual Clinic Architect",
        "Async Care Platform Specialist",
        "Digital Front Door Consultant",
        "Care Pathways Analyst",
        "Consent & Identity Specialist",
      ],
    },
    {
      id: "analytics-ai-seg",
      name: "Healthcare Analytics & AI",
      intro:
        "Clinical, operational and financial analytics with an ML/GenAI layer. Data platform + interoperability is the constant blocker.",
      roles: [
        "Snowflake for Health Consultant",
        "Google Cloud AI Health Specialist",
        "Azure AI for Health Lead",
        "Databricks Consultant",
        "FHIR Data Consultant",
        "Population Health Analyst",
        "ML Model Consultant",
        "MLOps Architect",
        "Clinical Data Governance Consultant",
      ],
    },
    {
      id: "cyber-hc-seg",
      name: "Cybersecurity for Healthcare",
      intro:
        "HIPAA / Data Security & Protection Toolkit workloads. IoMT, ransomware defence and clinical uptime dominate the brief.",
      roles: [
        "Palo Alto Networks Consultant",
        "IBM Security for Healthcare Specialist",
        "Fortinet Healthcare Lead",
        "SIEM / Splunk Consultant",
        "IAM / SailPoint Architect",
        "IoMT Security Consultant",
        "Ransomware Response Lead",
        "Zero Trust Programme Consultant",
        "DSPT Assessor",
      ],
    },
    {
      id: "precision-medicine-seg",
      name: "Precision Medicine",
      intro:
        "Genomics, biomarker discovery and personalised therapeutic pipelines. HPC, bioinformatics and clinical trials converge here.",
      roles: [
        "Illumina Bioinformatics Consultant",
        "23andMe Health Specialist",
        "Oracle Precision Medicine Lead",
        "HPC / GPU Consultant",
        "Bioinformatics Pipeline Specialist",
        "Genomic Data Engineer",
        "Clinical Genomics Consultant",
        "Variant Interpretation Analyst",
        "PGx Integration Specialist",
      ],
    },
    {
      id: "finance-ops-seg",
      name: "Accounting & Financial Operations",
      intro:
        "Trust finance, revenue cycle management, payer contracts and IFRS/GAAP reporting.",
      roles: [
        "SAP S/4HANA Finance for Health Consultant",
        "Oracle Financials Cloud Specialist",
        "MS Dynamics 365 Finance Lead",
        "RCM Systems Consultant",
        "Payer Contracts Specialist",
        "Product Costing Analyst",
        "Group Consolidation Consultant",
        "Financial Reporting Analyst",
        "Costing Systems Architect",
      ],
    },
    {
      id: "procurement-seg",
      name: "Procurement & Vendor Management",
      intro:
        "GPO participation, clinical supply management and third-party risk in a regulated environment.",
      roles: [
        "SAP Ariba Consultant",
        "Coupa Procurement Specialist",
        "Oracle Procurement Cloud Lead",
        "Clinical Supply Chain Consultant",
        "Vendor Master Data Specialist",
        "GPO Systems Consultant",
        "Sourcing Optimisation Lead",
        "Contracts Systems Analyst",
        "Third-Party Risk Consultant",
      ],
    },
    {
      id: "hcm-seg",
      name: "Human Capital Management",
      intro:
        "Rostering, credentialing, payroll and pensions for large clinical workforces.",
      roles: [
        "SAP SuccessFactors Consultant",
        "Oracle HCM Cloud Specialist",
        "Workday HCM Lead",
        "ESR / NHS HR Consultant",
        "Rostering Systems Specialist",
        "Credentialing Analyst",
        "Payroll Systems Consultant",
        "Pensions Systems Specialist",
        "Learning & OD Consultant",
      ],
    },
    {
      id: "it-infra-seg",
      name: "IT Infrastructure & Operations",
      intro:
        "Cloud landing zones, ITSM and clinical uptime. Legacy midrange decommissioning stays busy across the year.",
      roles: [
        "ServiceNow ITSM Consultant",
        "BMC Helix Specialist",
        "MS Endpoint Manager Lead",
        "AWS / Azure Landing Zone Architect",
        "Mainframe Modernisation Consultant",
        "DR / BCM Consultant",
        "Kubernetes Platform Engineer",
        "Observability / Splunk Specialist",
        "Network Modernisation Lead",
      ],
    },
    {
      id: "reg-compliance-seg",
      name: "Regulatory Compliance & Governance",
      intro:
        "MHRA, EMA, FDA and DHA reporting. IFRS 17 in health-insurance programmes adds another swim-lane.",
      roles: [
        "Wolters Kluwer Reg Reporting Consultant",
        "Thomson Reuters ONESOURCE Specialist",
        "MetricStream GRC Lead",
        "IFRS 17 Reporting Consultant",
        "Regulatory Submission Consultant",
        "Audit Systems Lead",
        "Model Governance Consultant",
        "GRC Architect",
        "Reg Change Programme Manager",
      ],
    },
  ],

  insightsEyebrow: "Insights",
  insightsTitle: "What's happening in healthcare tech talent right now.",
  insightsSub:
    "Written by Sumeet Goenka and the Yallo team. Opinionated, specific, useful.",
  insights: [
    {
      href: "/insights/epic-cerner-talent-2025",
      published: false,
      category: "EHR",
      title:
        "Epic vs Cerner: where the migration specialists are and what they cost in 2025.",
      excerpt:
        "Every Gulf hospital that moved off legacy EHR in the last 18 months hunted the same architects. Where the available bench actually is.",
      author: "Yallo Talent",
      minutes: 6,
    },
    {
      href: "/insights/veeva-vault-scarcity-2025",
      published: false,
      category: "Life Sciences",
      title:
        "Veeva Vault QualityDocs: why life-sciences programmes are hiring six months too late.",
      excerpt:
        "The organisations that delivered Vault on time last year confirmed the QualityDocs architect before the vendor was even signed.",
      author: "Yallo Talent",
      minutes: 5,
    },
    {
      href: "/insights/fhir-interop-2025",
      published: false,
      category: "Interoperability",
      title:
        "FHIR at scale: the integration architects UK ICBs and Gulf networks need on the bench.",
      excerpt:
        "Interop programmes are moving from pilot to network-scale. Where the FHIR-native architects actually are.",
      author: "Yallo Talent",
      minutes: 7,
    },
    {
      href: "/insights/pharma-serialisation-talent",
      published: false,
      category: "Pharma",
      title:
        "DSCSA / FMD serialisation: the specialist bench pharma manufacturers are running out of.",
      excerpt:
        "Serialisation deadlines don't move. What we're seeing in placement demand across UK and the Gulf.",
      author: "Yallo Talent",
      minutes: 6,
    },
  ],

  relatedTitle:
    "Adjacent industries, platforms and capabilities we place into healthcare.",
  related: [
    {
      href: "/industries/government",
      label: "Government & Public Sector",
      category: "Industry",
    },
    {
      href: "/industries/manufacturing",
      label: "Manufacturing & Logistics",
      category: "Industry",
    },
    { href: "/platforms/sap", label: "SAP", category: "Platform" },
    {
      href: "/platforms/salesforce",
      label: "Salesforce",
      category: "Platform",
    },
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
    {
      href: "/capabilities/integration-middleware",
      label: "Integration & Middleware",
      category: "Capability",
    },
    {
      href: "/capabilities/cloud-infrastructure",
      label: "Cloud & Infrastructure",
      category: "Capability",
    },
  ],

  seo: {
    title:
      "Healthcare & Life Sciences Tech Contractors · Middle East · Europe · India | Yallo Talent",
    description:
      "Epic, Cerner, Veeva, Medidata and Salesforce Health Cloud contractors for provider, payer and life-sciences programmes. 72h specialist-screened shortlists across UK, Middle East and India.",
  },
};
