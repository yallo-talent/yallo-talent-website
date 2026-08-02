import { taxonomyLabels } from "./index";
import type { L1PageData } from "./types";

export const governmentData: L1PageData = {
  slug: "government",
  category: "industries",
  breadcrumb: [
    { label: "Industries", href: "/industries" },
    { label: taxonomyLabels("government").label },
  ],

  eyebrow: "Government & Public Sector · Contract-first",
  title: "Public sector tech contractors,",
  sectorNoun: "public sector",
  emphasis: "shortlisted in 72 hours.",
  sub: "Salesforce Public Sector, ArcGIS, ServiceNow, Bentley and Motorola specialists for central, local and defence programmes across the Middle East, Europe and India. Cleared where the mission demands it.",
  primaryCta: { label: "Send us a brief", href: "/brief" },
  secondaryCta: { label: "View expertise", href: "#expertise" },
  statusDots: [
    "72h brief to shortlist",
    "Active contractor bench",
    "Middle East · Europe · India",
    "SC / BPSS aware",
  ],

  introEyebrow: "Why us for government",
  introTitle:
    "Public sector programmes stall when the specialist can't clear the room.",
  introCopy: [
    "Every citizen-services digital rollout, every ArcGIS-led planning programme, every ServiceNow platform build shares the same failure mode — the implementation depends on the depth of the contractor in the room, and often on their clearance. Generic recruiters place platform names. We place implementation track records inside regulated public-sector environments.",
    "Our bench is assessed by specialists who have delivered inside central government, local authority, defence and public healthcare programmes. We screen for the operating context — procurement frameworks, DDaT roles, GDS service standards, mission-critical uptime — not just certification badges.",
  ],
  /* TWO UNSOURCED CARDS REMOVED, 2 Aug 2026, a percentage and a week range.

     Canon section 6 requires a source on any published figure, and
     `L1IntroStatCard.source` exists so that a card without one is a visible
     omission rather than an invisible one. Neither card carried the field, and
     no source was ever recorded for either, so they cannot be re-cited. They
     return only with attribution.

     THIS IS THE CLASS, NOT A FIFTH INSTANCE. R18 deleted a figure of exactly
     this shape on 1 Aug and the sweep stopped at the page it was reported on.
     Four sector pages kept theirs: 64%/4-7 wks, 69%/6-8 wks, 63%/5-7 wks and
     66%/6-9 wks, one per page, on the same sentence template with the number
     changed. Five capability pages carry a 72% card that STAYS, because it
     names ManpowerGroup in a source field. The rule is the source, not the
     figure. The card left below is the one retail, finance and education
     already carry, word for word. */
  introStatCards: [
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
    "These are the cleared specialists that appear on every public-sector brief and disappear from the market fastest. Yallo maintains an active bench in each of these areas across the Middle East, Europe and India. When you need one, you don't have six weeks.",
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
    "Every public-sector function area, with a contractor bench behind it.",
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
  /* TEN SEGMENTS REMOVED, 2 Aug 2026, per context-round5-rulings.md §6.

     A SEGMENT IS CUSTOMER-SHAPED, and the test that separates the four below
     from the ten that went is whether the name partitions the customer base or
     the work. A police force, a planning authority, a health body and an
     education authority buy differently from one another. Citizen Services,
     Smart City Solutions, Disaster & Emergency Management, Cybersecurity for
     Public Services, Data & AI for Public Services, Regulatory Compliance &
     Governance, IT Infrastructure & Operations, Procurement & Vendor
     Management, Accounting & Financial Operations and Human Capital Management
     do not: every public body on the list runs all ten, so they cut across the
     customers rather than dividing them. A segment present in every customer
     is a function.

     THE LAST FIVE OF THOSE ARE THE SAME FIVE removed from the finance desk in
     round 4, under the same names, and they are still live on healthcare and
     telco. One list was copied onto four sector pages.

     THE THREE BORDERLINE KEEPS ARE NAMED FOR A DOMAIN and kept anyway, on the
     same reading that kept Insurance Services on the finance desk: each intro
     opens by naming the institutions that buy. Urban Planning opens on local
     authorities, Healthcare Administration on NHS trusts and ICBs, Education
     Administration on higher education, further education and school
     authorities. Where an intro names no institution, the segment went. */
  segments: [
    {
      id: "public-safety-seg",
      name: "Public Safety & Security",
      intro:
        "Police, fire and emergency response. Control-room modernisation, CAD/RMS and cross-agency data-sharing are the recurring priorities.",
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
      author: "Yallo Talent",
      minutes: 6,
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
    },
    {
      href: "/insights/palantir-foundry-defence",
      published: false,
      category: "Defence",
      title:
        "Palantir Foundry contractors in defence: what actually gets you shortlisted.",
      excerpt:
        "The specialist bench is thin, the clearance timelines are long and the frameworks are opaque. What the programmes with the best delivery track record are doing differently.",
      author: "Yallo Talent",
      minutes: 7,
    },
    {
      href: "/insights/ncsc-caf-2025",
      published: false,
      category: "Cybersecurity",
      title:
        "NCSC CAF: the security architects UK public bodies need on the bench now.",
      excerpt:
        "CAF alignment programmes have moved from optional to critical path. What we're seeing in placement demand across central and local government.",
      author: "Yallo Talent",
      minutes: 5,
    },
  ],

  relatedTitle:
    "Adjacent industries, platforms and capabilities we place into government.",
  related: [
    {
      href: "/industries/healthcare",
      label: taxonomyLabels("healthcare").label,
      category: "Industry",
    },
    {
      href: "/industries/finance",
      label: taxonomyLabels("finance").label,
      category: "Industry",
    },
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
      label: "Cybersecurity & Risk",
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
      "Government & Public Sector Tech Contractors · Middle East · Europe · India | Yallo Talent",
    description:
      "Salesforce Public Sector, ArcGIS, ServiceNow, Bentley and Motorola contractors for central, local and defence programmes. 72h specialist-screened shortlists across UK, Middle East and India.",
  },
};
