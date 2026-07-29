import type { L1PageData } from "./types";

export const governmentData: L1PageData = {
  slug: "government",
  category: "industries",
  hue: "violet",
  breadcrumb: [
    { label: "Industries", href: "/industries" },
    { label: "Government & Public Sector" },
  ],

  eyebrow: "Government & Public Sector · Contract-first",
  title: "Public sector tech contractors,",
  emphasis: "shortlisted in 72 hours.",
  sub: "Salesforce Public Sector, ArcGIS, ServiceNow, Bentley and Motorola specialists for central, local and defence programmes across UK, ME and India. Cleared where the mission demands it.",
  heroImage:
    "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=2000&auto=format&fit=crop&q=80",
  heroImageAlt: "Government building with columns",
  primaryCta: { label: "Send us a brief", href: "/brief" },
  secondaryCta: { label: "View expertise", href: "#expertise" },
  statusDots: [
    "72h brief to shortlist",
    "Active contractor bench",
    "UK · ME · India",
    "SC / BPSS aware",
  ],

  stats: [
    { n: "72h", l: "Brief to shortlist" },
    { n: "2:1", l: "CV to interview ratio" },
    { n: "20", l: "Public sector function areas" },
    { n: "3", l: "Active delivery markets" },
  ],

  introEyebrow: "Why Yallo for government",
  introTitle:
    "Public sector programmes stall when the specialist can't clear the room.",
  introCopy: [
    "Every citizen-services digital rollout, every ArcGIS-led planning programme, every ServiceNow platform build shares the same failure mode — the implementation depends on the depth of the contractor in the room, and often on their clearance. Generic recruiters place platform names. We place implementation track records inside regulated public-sector environments.",
    "Our bench is assessed by specialists who have delivered inside central government, local authority, defence and public healthcare programmes. We screen for the operating context — procurement frameworks, DDaT roles, GDS service standards, mission-critical uptime — not just certification badges.",
  ],
  introStatCards: [
    {
      n: "64%",
      l: "of public-sector programme leads report contractor availability — not budget — is the biggest single cause of major-programme slippage.",
    },
    {
      n: "4–7 wks",
      l: "Average time lost when a cleared specialist is placed without public-sector screening. Yallo's shortlist is in your inbox in 72h.",
    },
    {
      n: "Contract-first",
      l: "Primary focus is interim and contract deployment. Also available in Permanent, EOR and Managed Delivery models.",
    },
  ],

  scarceEyebrow: "Scarce talent",
  scarceIcon: "scarce",
  scarceTitle:
    "The roles every public-sector programme needs — and struggles to find.",
  scarceCopy:
    "These are the cleared specialists that appear on every public-sector brief and disappear from the market fastest. Yallo maintains an active bench in each of these areas across UK, ME and India. When you need one, you don't have six weeks.",
  scarceCta: { label: "Brief us on a scarce role", href: "/brief" },
  scarceRoles: [
    {
      name: "Salesforce Public Sector Solutions Architect",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "ServiceNow Now Assist for Government Consultant",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "ArcGIS Enterprise Solution Architect",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "Palantir Foundry Government Consultant",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "Bentley Systems Infrastructure Lead",
      scarcity: "high",
      engagement: "contract-perm",
    },
    {
      name: "Motorola Public Safety Systems Specialist",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "GDS Service Standard Assessor / Design Lead",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "Government Cloud Landing Zone Architect (AWS / Azure)",
      scarcity: "high",
      engagement: "contract",
    },
  ],

  expertiseEyebrow: "Our expertise",
  expertiseTitle:
    "Twenty public-sector function areas. Contractor bench across all of them.",
  expertiseSub:
    "From citizen services to defence — we place specialists into every function that moves a public-sector programme forward.",
  expertise: [
    {
      slug: "citizen-services",
      num: "01",
      title: "Citizen Services",
      icon: "crm",
      blurb: "Cases, portals and channel modernisation",
      roles: [
        "Salesforce Public Sector Consultant",
        "Oracle Citizen Services Specialist",
        "MS Dynamics 365 Public Sector Lead",
      ],
    },
    {
      slug: "public-safety",
      num: "02",
      title: "Public Safety & Security",
      icon: "security",
      blurb: "CAD, RMS and control-room platforms",
      roles: [
        "Motorola Solutions Consultant",
        "SAP Public Security Specialist",
        "Oracle Public Safety Cloud Lead",
      ],
    },
    {
      slug: "urban-planning",
      num: "03",
      title: "Urban Planning & Infrastructure",
      icon: "space",
      blurb: "GIS, BIM and project delivery",
      roles: [
        "ArcGIS Enterprise Consultant",
        "Oracle Primavera Specialist",
        "Bentley Systems Infrastructure Lead",
      ],
    },
    {
      slug: "case-management",
      num: "04",
      title: "Case Management",
      icon: "cases",
      blurb: "Statutory casework, decisioning and outcomes",
      roles: [
        "Salesforce Case Management Consultant",
        "Pega Case Management Specialist",
        "ServiceNow Case & Knowledge Lead",
      ],
    },
    {
      slug: "digital-identity",
      num: "05",
      title: "Digital Identity & e-Government",
      icon: "integration",
      blurb: "GOV.UK One Login, national ID and consent",
      roles: [
        "Identity & Access Management Consultant",
        "One Login Integration Specialist",
        "Digital Identity Systems Architect",
      ],
    },
    {
      slug: "tax-revenue",
      num: "06",
      title: "Tax & Revenue Management",
      icon: "finance",
      blurb: "Tax admin, collections and revenue analytics",
      roles: [
        "SAP Tax & Revenue Management Consultant",
        "Oracle Public Sector Revenue Specialist",
        "Vertex / OneSource Tax Lead",
      ],
    },
    {
      slug: "benefits-welfare",
      num: "07",
      title: "Benefits & Welfare Administration",
      icon: "workforce",
      blurb: "Eligibility, entitlement and disbursement",
      roles: [
        "Cúram Benefits Specialist",
        "SAP HRSP Consultant",
        "MS Dynamics Public Sector Lead",
      ],
    },
    {
      slug: "healthcare-admin",
      num: "08",
      title: "Healthcare Administration",
      icon: "eor",
      blurb: "Patient admin, commissioning and workforce",
      roles: [
        "Cerner Healthcare Admin Consultant",
        "Epic Systems Specialist",
        "Oracle Healthcare Cloud Lead",
      ],
    },
    {
      slug: "education-admin",
      num: "09",
      title: "Education Administration",
      icon: "cases",
      blurb: "SIS, LMS and student services",
      roles: [
        "Blackboard Education Management Consultant",
        "SAP Education Solutions Specialist",
        "Oracle Student Cloud Lead",
      ],
    },
    {
      slug: "smart-city",
      num: "10",
      title: "Smart City Solutions",
      icon: "spark",
      blurb: "Connected infrastructure and city ops",
      roles: [
        "Siemens Smart City Consultant",
        "Cisco Smart City Infrastructure Specialist",
        "IBM Intelligent Operations Lead",
      ],
    },
    {
      slug: "disaster-management",
      num: "11",
      title: "Disaster & Emergency Management",
      icon: "security",
      blurb: "Alerting, incident and continuity",
      roles: [
        "Everbridge Critical Event Consultant",
        "Oracle Disaster Recovery Specialist",
        "SAP Emergency Management Lead",
      ],
    },
    {
      slug: "cybersecurity-gov",
      num: "12",
      title: "Cybersecurity for Public Services",
      icon: "security",
      blurb: "SOC, IAM and zero-trust programmes",
      roles: [
        "Palo Alto Networks for Public Sector Consultant",
        "IBM Security for Government Specialist",
        "Fortinet Public Sector Cybersecurity Lead",
      ],
    },
    {
      slug: "data-ai-gov",
      num: "13",
      title: "Data & AI for Public Services",
      icon: "dataAi",
      blurb: "Data platform, ML and evidence-led policy",
      roles: [
        "Google Cloud AI for Public Sector Consultant",
        "Azure AI for Government Specialist",
        "Snowflake Data Cloud for Gov Lead",
      ],
    },
    {
      slug: "reg-compliance-gov",
      num: "14",
      title: "Regulatory Compliance & Governance",
      icon: "government",
      blurb: "GRC, audit and controls assurance",
      roles: [
        "Wolters Kluwer Regulatory Consultant",
        "Thomson Reuters ONESOURCE Specialist",
        "MetricStream GRC Lead",
      ],
    },
    {
      slug: "finance-ops-gov",
      num: "15",
      title: "Accounting & Financial Operations",
      icon: "finance",
      blurb: "Public accounting, appropriations and reporting",
      roles: [
        "SAP S/4HANA Finance Public Sector Consultant",
        "Oracle Financials Cloud for Gov Specialist",
        "MS Dynamics 365 Finance Lead",
      ],
    },
    {
      slug: "procurement-gov",
      num: "16",
      title: "Procurement & Vendor Management",
      icon: "finance",
      blurb: "Frameworks, tenders and supplier risk",
      roles: [
        "SAP Ariba Consultant",
        "Coupa Procurement Specialist",
        "Oracle Procurement Cloud Lead",
      ],
    },
    {
      slug: "hcm-gov",
      num: "17",
      title: "Human Capital Management",
      icon: "workforce",
      blurb: "Payroll, workforce and pensions",
      roles: [
        "SAP SuccessFactors Consultant",
        "Oracle HCM Cloud Specialist",
        "Workday HCM Lead",
      ],
    },
    {
      slug: "it-infra-gov",
      num: "18",
      title: "IT Infrastructure & Operations",
      icon: "cloud",
      blurb: "Cloud landing zones and ITSM at scale",
      roles: [
        "ServiceNow ITSM Consultant",
        "BMC Helix Specialist",
        "Microsoft Endpoint Manager Lead",
      ],
    },
    {
      slug: "defence-military",
      num: "19",
      title: "Defence & Military Systems",
      icon: "security",
      blurb: "Mission systems, logistics and simulation",
      roles: [
        "Defence Systems Integration Consultant",
        "SAP S/4HANA Defence & Security Specialist",
        "Palantir Foundry for Defence Lead",
      ],
    },
    {
      slug: "border-immigration",
      num: "20",
      title: "Border & Immigration Systems",
      icon: "integration",
      blurb: "Border control, casework and biometrics",
      roles: [
        "Casework Systems Consultant",
        "Biometrics Integration Specialist",
        "Border Control Platform Lead",
      ],
    },
  ],

  segmentsEyebrow: "Segments we support",
  segmentsTitle:
    "Every public-sector segment. Specialists who know the context.",
  segmentsSub:
    "Central government runs different programmes from a local authority or a police force. Our contractors understand the specific operating context — not just the platform.",
  segments: [
    {
      id: "citizen-services-seg",
      name: "Citizen Services",
      intro:
        "Digital-by-default channels, single-view of the citizen and case-driven services. GDS service standard and accessibility depth are the differentiators.",
      image:
        "https://images.unsplash.com/photo-1560264280-88b68371db39?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Citizen services counter",
      roles: [
        "Salesforce Public Sector Consultant",
        "Pega Case Management Specialist",
        "GDS Service Designer",
        "Content Designer",
        "Frontend Architect",
        "Accessibility Consultant",
        "Digital Identity Specialist",
        "MS Dynamics 365 Public Sector Lead",
        "Programme Architect",
      ],
    },
    {
      id: "public-safety-seg",
      name: "Public Safety & Security",
      intro:
        "Police, fire and emergency response. Control-room modernisation, CAD/RMS and cross-agency data-sharing are the recurring priorities.",
      image:
        "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Public safety control room",
      roles: [
        "Motorola Solutions Consultant",
        "CAD / RMS Specialist",
        "Body-Worn Video Systems Lead",
        "Digital Evidence Management Consultant",
        "SAP Public Security Specialist",
        "Cross-Agency Integration Architect",
        "Oracle Public Safety Cloud Lead",
        "Emergency Services Analytics Consultant",
        "Investigations Systems Analyst",
      ],
    },
    {
      id: "urban-planning-seg",
      name: "Urban Planning & Infrastructure",
      intro:
        "Local authority planning, transport and infrastructure delivery. GIS, BIM and project controls are the platform backbones.",
      image:
        "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Urban planning cityscape",
      roles: [
        "ArcGIS Enterprise Consultant",
        "Oracle Primavera Specialist",
        "Bentley Systems Consultant",
        "BIM Manager",
        "Project Controls Consultant",
        "Local Authority Planning Systems Lead",
        "Highways Systems Specialist",
        "Transport Planning Analyst",
        "Land Charges Systems Consultant",
      ],
    },
    {
      id: "healthcare-admin-seg",
      name: "Healthcare Administration",
      intro:
        "NHS trusts, ICBs and public healthcare estates. Workforce systems, patient administration and financial reporting sit at the heart of the brief.",
      image:
        "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Healthcare administration",
      roles: [
        "Cerner Healthcare Admin Consultant",
        "Epic Systems Specialist",
        "Oracle Healthcare Cloud Lead",
        "ESR / SuccessFactors HR Consultant",
        "Healthcare Reporting Analyst",
        "NHS Digital Integration Consultant",
        "Workforce Planning Analyst",
        "Financial Reporting Specialist",
        "Patient Portal Consultant",
      ],
    },
    {
      id: "education-admin-seg",
      name: "Education Administration",
      intro:
        "Higher education, further education and school-authority systems. Student administration, LMS and finance modernisation are the recurring workstreams.",
      image:
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Education administration",
      roles: [
        "Blackboard Consultant",
        "SAP Education Specialist",
        "Oracle Student Cloud Lead",
        "SITS / Tribal Systems Consultant",
        "LMS Integration Specialist",
        "Admissions Systems Analyst",
        "Financial Aid Systems Consultant",
        "Alumni CRM Specialist",
        "Data Warehouse Consultant",
      ],
    },
    {
      id: "smart-city-seg",
      name: "Smart City Solutions",
      intro:
        "Connected infrastructure, city ops and mobility. Sensor networks, IoT and unified command are the operating backbone.",
      image:
        "https://images.unsplash.com/photo-1470004914212-05527e49370b?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Smart city infrastructure",
      roles: [
        "Siemens Smart City Consultant",
        "Cisco Smart City Systems Specialist",
        "IBM Intelligent Operations Lead",
        "IoT Platform Architect",
        "Mobility Systems Consultant",
        "Urban Data Platform Specialist",
        "Command Centre Systems Lead",
        "Digital Twin for Cities Consultant",
        "Public Realm Analytics Analyst",
      ],
    },
    {
      id: "disaster-management-seg",
      name: "Disaster & Emergency Management",
      intro:
        "Mass alerting, incident response and business continuity. Public-safety-grade uptime with cross-agency dependencies.",
      image:
        "https://images.unsplash.com/photo-1544427920-c49ccfb85579?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Emergency operations centre",
      roles: [
        "Everbridge Critical Event Consultant",
        "Oracle Disaster Recovery Specialist",
        "SAP Emergency Management Lead",
        "Business Continuity Consultant",
        "Alerting Platform Specialist",
        "Incident Command Systems Architect",
        "Resilience Planning Analyst",
        "Crisis Response Systems Consultant",
        "Recovery Programme Manager",
      ],
    },
    {
      id: "cybersecurity-seg",
      name: "Cybersecurity for Public Services",
      intro:
        "Threat detection, IAM and zero-trust for government estates. NCSC / CAF alignment and OFFICIAL-SENSITIVE workloads set the operating context.",
      image:
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Cybersecurity operations centre",
      roles: [
        "Palo Alto Networks for Public Sector Consultant",
        "IBM Security for Government Specialist",
        "Fortinet Public Sector Lead",
        "SIEM / Splunk Consultant",
        "IAM / SailPoint Architect",
        "Zero Trust Programme Consultant",
        "NCSC CAF Assessor",
        "Cloud Security Consultant",
        "DLP Systems Specialist",
      ],
    },
    {
      id: "data-ai-seg",
      name: "Data & AI for Public Services",
      intro:
        "Data platform, machine learning and evidence-led policy. GenAI pilots are moving into production faster than the specialist bench can keep up.",
      image:
        "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Data and AI operations",
      roles: [
        "Google Cloud AI for Public Sector Consultant",
        "Azure AI for Government Specialist",
        "Snowflake for Gov Lead",
        "Databricks Consultant",
        "Palantir Foundry Consultant",
        "MLOps Architect",
        "Data Governance Consultant",
        "GenAI for Gov Consultant",
        "Data Ethics Analyst",
      ],
    },
    {
      id: "reg-compliance-seg",
      name: "Regulatory Compliance & Governance",
      intro:
        "GRC, audit and controls in a public-money environment. NAO / SO / IIA assurance frameworks drive the platform selection.",
      image:
        "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Regulatory compliance office",
      roles: [
        "Wolters Kluwer Reg Reporting Consultant",
        "Thomson Reuters ONESOURCE Specialist",
        "MetricStream GRC Lead",
        "Audit Systems Consultant",
        "Controls Testing Specialist",
        "Assurance Programme Manager",
        "Policy Systems Analyst",
        "GRC Architect",
        "Reg Change Programme Manager",
      ],
    },
    {
      id: "it-infra-seg",
      name: "IT Infrastructure & Operations",
      intro:
        "Cloud landing zones, ITSM and platform ops for regulated public-sector environments. Legacy midrange decommissioning stays busy across the year.",
      image:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "IT infrastructure data centre",
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
      id: "procurement-seg",
      name: "Procurement & Vendor Management",
      intro:
        "Frameworks, tenders and third-party risk. Crown Commercial, G-Cloud, DOS and DFT frameworks anchor the sourcing pipeline.",
      image:
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Procurement office",
      roles: [
        "SAP Ariba Consultant",
        "Coupa Procurement Specialist",
        "Oracle Procurement Cloud Lead",
        "Framework Bid Consultant",
        "Contracts Systems Specialist",
        "Vendor Master Data Consultant",
        "S2P Programme Manager",
        "Category Management Analyst",
        "Sourcing Optimisation Lead",
      ],
    },
    {
      id: "finance-ops-seg",
      name: "Accounting & Financial Operations",
      intro:
        "Public accounting, appropriations, and consolidated whole-of-government reporting. IFRS + FReM combinations demand experienced consultants.",
      image:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Finance operations",
      roles: [
        "SAP S/4HANA Finance Public Sector Consultant",
        "Oracle Financials Cloud for Gov Specialist",
        "MS Dynamics 365 Finance Lead",
        "Group Consolidation Consultant",
        "Appropriations Systems Specialist",
        "Grants Management Systems Consultant",
        "Public Sector Reporting Analyst",
        "Financial Systems Architect",
        "Whole-of-Government Reporting Lead",
      ],
    },
    {
      id: "hcm-seg",
      name: "Human Capital Management",
      intro:
        "Payroll, workforce planning and pensions across huge headcounts. ESR, SuccessFactors and Workday migrations run continuously.",
      image:
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Public sector HCM",
      roles: [
        "SAP SuccessFactors Consultant",
        "Oracle HCM Cloud Specialist",
        "Workday HCM Lead",
        "ESR / NHS HR Consultant",
        "Payroll Systems Specialist",
        "Pensions Systems Consultant",
        "Workforce Planning Analyst",
        "HR Data Warehouse Consultant",
        "Time & Attendance Systems Specialist",
      ],
    },
  ],

  partners: [
    "SAP",
    "Oracle",
    "Salesforce",
    "Microsoft",
    "ServiceNow",
    "IBM",
    "Palantir",
    "Motorola Solutions",
    "Bentley Systems",
    "ESRI",
    "Siemens",
    "Cisco",
    "Palo Alto Networks",
    "Fortinet",
    "AWS",
    "Snowflake",
  ],

  insightsEyebrow: "Insights",
  insightsTitle: "What's happening in public-sector tech talent right now.",
  insightsSub:
    "Written by Sumeet Goenka and the Yallo team. Opinionated, specific, useful.",
  insights: [
    {
      href: "/insights/gds-service-standard-talent-2025",
      published: false,
      category: "Digital Services",
      title:
        "GDS service standard: the specialists central departments cannot deliver a service without.",
      excerpt:
        "The service standard is a talent problem before it's a design problem. Where the service designers, content designers and delivery managers actually are.",
      author: "Sumeet Goenka",
      minutes: 6,
      image:
        "https://images.unsplash.com/photo-1560264280-88b68371db39?w=1000&auto=format&fit=crop&q=80",
      imageAlt: "Public services digital",
    },
    {
      href: "/insights/arcgis-planning-talent-me",
      published: false,
      category: "Urban Planning",
      title:
        "ArcGIS in the Gulf: why regional smart-city programmes are chasing the same twenty consultants.",
      excerpt:
        "Every ME smart-city programme in 2024 confirmed the ArcGIS Enterprise architect last. The result was six-month re-planning cycles across the region.",
      author: "Yallo Talent",
      minutes: 5,
      image:
        "https://images.unsplash.com/photo-1470004914212-05527e49370b?w=1000&auto=format&fit=crop&q=80",
      imageAlt: "Smart city GIS",
    },
    {
      href: "/insights/palantir-foundry-defence",
      published: false,
      category: "Defence",
      title:
        "Palantir Foundry contractors in defence: what actually gets you shortlisted.",
      excerpt:
        "The specialist bench is thin, the clearance timelines are long and the frameworks are opaque. What the programmes with the best delivery track record are doing differently.",
      author: "Sumeet Goenka",
      minutes: 7,
      image:
        "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=1000&auto=format&fit=crop&q=80",
      imageAlt: "Defence data platform",
    },
    {
      href: "/insights/ncsc-caf-2025",
      published: false,
      category: "Cybersecurity",
      title:
        "NCSC CAF: the security architects UK public bodies need on the bench now.",
      excerpt:
        "CAF alignment programmes have moved from optional to critical path. What we're seeing in placement demand across central and local government.",
      author: "Sumeet Goenka",
      minutes: 5,
      image:
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1000&auto=format&fit=crop&q=80",
      imageAlt: "Cybersecurity operations",
    },
  ],

  relatedTitle:
    "Adjacent industries, platforms and capabilities we place into government.",
  related: [
    {
      href: "/industries/healthcare",
      label: "Healthcare & Life Sciences",
      category: "Industry",
    },
    {
      href: "/industries/finance",
      label: "Banking & Financial Services",
      category: "Industry",
    },
    {
      href: "/platforms/salesforce",
      label: "Salesforce",
      category: "Platform",
    },
    { href: "/platforms/microsoft", label: "Microsoft", category: "Platform" },
    {
      href: "/capabilities/data-ai",
      label: "Data & AI",
      category: "Capability",
    },
    {
      href: "/capabilities/cybersecurity",
      label: "Cybersecurity",
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
  ],

  seo: {
    title:
      "Government & Public Sector Tech Contractors · UK · ME · India | Yallo Talent",
    description:
      "Salesforce Public Sector, ArcGIS, ServiceNow, Bentley and Motorola contractors for central, local and defence programmes. 72h architect-screened shortlists across UK, Middle East and India.",
  },
};
