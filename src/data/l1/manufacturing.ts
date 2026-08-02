import { taxonomyLabels } from "./index";
import type { L1PageData } from "./types";

export const manufacturingData: L1PageData = {
  slug: "manufacturing",
  category: "industries",
  breadcrumb: [
    { label: "Industries", href: "/industries" },
    { label: taxonomyLabels("manufacturing").label },
  ],

  eyebrow: "Manufacturing & Logistics · Contract-first",
  title: "Manufacturing tech contractors,",
  sectorNoun: "manufacturing",
  emphasis: "shortlisted in 72 hours.",
  sub: "SAP, Siemens, Rockwell, Blue Yonder and Manhattan specialists for shop-floor to network programmes across the Middle East, Europe and India. Specialist-screened for implementation depth — not just platform familiarity.",
  primaryCta: { label: "Send us a brief", href: "/brief" },
  secondaryCta: { label: "View expertise", href: "#expertise" },
  statusDots: [
    "72h brief to shortlist",
    "Active contractor bench",
    "Middle East · Europe · India",
    "Contract · EOR · Managed Delivery",
  ],

  introEyebrow: "Why us for manufacturing",
  introTitle:
    "Manufacturing programmes stall when shop-floor depth isn't in the room.",
  introCopy: [
    "Every SAP S/4HANA manufacturing rollout, every Siemens Opcenter cutover, every Blue Yonder demand-planning go-live shares the same failure mode — the implementation depends on the depth of the contractor in the room. Generic recruiters place platform names. We place implementation track records.",
    "Our bench is assessed by specialists who have run manufacturing tech delivery. We screen for the specific operating context — multi-plant rollouts, MES integration, IIoT payloads, regulated environments — not just certification badges.",
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
    "The roles every manufacturing programme needs — and struggles to find.",
  scarceCopy:
    "These are the specialists that appear on every manufacturing brief and disappear from the market fastest. Yallo maintains an active bench in each of these areas across the Middle East, Europe and India. When you need one, you don't have six weeks.",
  scarceCta: { label: "Brief us on a scarce role", href: "/brief" },
  scarceRoles: [
    {
      name: "Siemens Opcenter Solution Architect",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "Rockwell Automation MES Specialist",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "SAP Digital Manufacturing (DMC) Consultant",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "Manhattan Active WMS Technical Lead",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "Blue Yonder Luminate Supply Chain Planner",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "Siemens Teamcenter PLM Architect",
      scarcity: "high",
      engagement: "contract-perm",
    },
    {
      name: "SAP EWM Technical Consultant",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "IBM Maximo Solution Architect",
      scarcity: "high",
      engagement: "contract",
    },
  ],

  expertiseEyebrow: "Our expertise",
  expertiseTitle:
    "Every manufacturing function area, with a contractor bench behind it.",
  expertiseSub:
    "From shop-floor execution to network-level planning — we place specialists into every function that moves a manufacturing programme forward.",
  expertise: [
    {
      slug: "production-planning",
      num: "01",
      title: "Production Planning & Scheduling",
      icon: "demand",
      blurb: "Detailed scheduling, capacity levelling and MRP",
      roles: [
        "SAP S/4HANA PP Consultant",
        "Oracle Production Scheduling Specialist",
        "Kinaxis RapidResponse Lead",
      ],
    },
    {
      slug: "mes",
      num: "02",
      title: "Manufacturing Execution (MES)",
      icon: "assortment",
      blurb: "Shop-floor execution, dispatch and traceability",
      roles: [
        "Siemens Opcenter Consultant",
        "Rockwell FactoryTalk Specialist",
        "Honeywell MES Architect",
      ],
    },
    {
      slug: "plm",
      num: "03",
      title: "Product Lifecycle (PLM)",
      icon: "space",
      blurb: "Design, BOM, change control and release",
      roles: [
        "Siemens Teamcenter Architect",
        "SAP PLM Consultant",
        "Dassault ENOVIA Specialist",
      ],
    },
    {
      slug: "quality",
      num: "04",
      title: "Quality Management",
      icon: "returns",
      blurb: "Inspection plans, non-conformance and CAPA",
      roles: [
        "SAP QM Functional Consultant",
        "Oracle QM Cloud Specialist",
        "Infor CloudSuite QC Lead",
      ],
    },
    {
      slug: "asset-management",
      num: "05",
      title: "Enterprise Asset Management",
      icon: "wms",
      blurb: "Reliability, maintenance and asset lifecycle",
      roles: [
        "IBM Maximo Architect",
        "SAP PM / EAM Consultant",
        "Oracle ALM Specialist",
      ],
    },
    {
      slug: "supply-chain-optimisation",
      num: "06",
      title: "Supply Chain Optimisation",
      icon: "supply",
      blurb: "Integrated planning across network and tiers",
      roles: [
        "SAP IBP Consultant",
        "Blue Yonder SCP Specialist",
        "o9 Solutions Lead",
      ],
    },
    {
      slug: "demand-planning",
      num: "07",
      title: "Demand Planning & Forecasting",
      icon: "demand",
      blurb: "Statistical forecasting and demand sensing",
      roles: [
        "Blue Yonder Demand Planner",
        "SAP IBP DP Consultant",
        "Anaplan Model Builder",
      ],
    },
    {
      slug: "supply-planning",
      num: "08",
      title: "Supply Planning & S&OP",
      icon: "analytics",
      blurb: "Constrained network planning and S&OE",
      roles: [
        "Kinaxis RapidResponse Lead",
        "SAP IBP for Response Consultant",
        "o9 Supply Planning Specialist",
      ],
    },
    {
      slug: "inventory-management",
      num: "09",
      title: "Inventory Management",
      icon: "inventory",
      blurb: "Multi-plant stock, replenishment and MEIO",
      roles: [
        "SAP MM / IM Consultant",
        "Oracle Inventory Specialist",
        "Blue Yonder Inventory Optimisation Lead",
      ],
    },
    {
      slug: "wms",
      num: "10",
      title: "Warehouse Management (WMS)",
      icon: "wms",
      blurb: "DC operations, pick paths and slotting",
      roles: [
        "Manhattan Active WMS Lead",
        "SAP EWM Consultant",
        "Blue Yonder WMS Specialist",
      ],
    },
    {
      slug: "tms",
      num: "11",
      title: "Transportation Management (TMS)",
      icon: "tms",
      blurb: "Freight, routing and carrier orchestration",
      roles: [
        "SAP TM Consultant",
        "Blue Yonder TMS Specialist",
        "Manhattan TMS Architect",
      ],
    },
    {
      slug: "logistics-execution",
      num: "12",
      title: "Logistics Execution",
      icon: "tms",
      blurb: "Last-mile, yard and dock scheduling",
      roles: [
        "SAP Logistics Business Network Lead",
        "Blue Yonder Logistics Network Specialist",
        "Oracle Logistics Cloud Consultant",
      ],
    },
    {
      slug: "procurement",
      num: "13",
      title: "Procurement & Sourcing",
      icon: "finance",
      blurb: "Direct/indirect spend and supplier collaboration",
      roles: [
        "SAP Ariba Consultant",
        "Coupa Procurement Specialist",
        "Oracle Procurement Cloud Lead",
      ],
    },
    {
      slug: "crm",
      num: "14",
      title: "Customer Relationship Management",
      icon: "crm",
      blurb: "Aftersales, service and account management",
      roles: [
        "Salesforce Manufacturing Cloud Lead",
        "MS Dynamics 365 CRM Consultant",
        "Oracle CX for Manufacturing Specialist",
      ],
    },
    {
      slug: "finance",
      num: "15",
      title: "Financial Management",
      icon: "finance",
      blurb: "Product costing, margin and plant accounting",
      roles: [
        "SAP S/4HANA Finance Consultant",
        "Oracle Financials Cloud Specialist",
        "Infor Financials Lead",
      ],
    },
    {
      slug: "hcm",
      num: "16",
      title: "Human Capital Management",
      icon: "workforce",
      blurb: "Payroll, shift planning and skills",
      roles: [
        "SAP SuccessFactors Consultant",
        "Oracle HCM Cloud Specialist",
        "Kronos Workforce Dimensions Lead",
      ],
    },
    {
      slug: "shop-floor",
      num: "17",
      title: "Shop-Floor Execution",
      icon: "store",
      blurb: "Andon, digital work instructions and OEE",
      roles: [
        "SAP Digital Manufacturing (DMC) Consultant",
        "Rockwell FactoryTalk InnovationSuite Specialist",
        "Siemens Insights Hub Architect",
      ],
    },
    {
      slug: "digital-twin-iiot",
      num: "18",
      title: "Digital Twin & IIoT",
      icon: "spark",
      blurb: "Sensor networks, edge compute and simulation",
      roles: [
        "PTC ThingWorx Consultant",
        "Siemens MindSphere / Insights Hub Specialist",
        "GE Predix Architect",
      ],
    },
    {
      slug: "compliance-ehs",
      num: "19",
      title: "Compliance & EHS",
      icon: "hr",
      blurb: "Regulated ops, EHS incident and audit",
      roles: [
        "SAP EHS Management Consultant",
        "Enablon EHS Specialist",
        "Sphera EHS Lead",
      ],
    },
    {
      slug: "sustainability",
      num: "20",
      title: "Sustainability & Circular Ops",
      icon: "loyalty",
      blurb: "ESG data, carbon accounting and reverse ops",
      roles: [
        "SAP Sustainability Control Tower Consultant",
        "Sphera Carbon Consultant",
        "Circulor Traceability Specialist",
      ],
    },
  ],

  segmentsEyebrow: "Segments we support",
  segmentsTitle:
    "Every manufacturing segment. Specialists who know the context.",
  segmentsSub:
    "Aerospace runs different programmes from FMCG. Our contractors understand the specific operating context — not just the platform.",
  segments: [
    {
      id: "automotive",
      name: "Automotive Manufacturing",
      intro:
        "Passenger, commercial and electric vehicle production. Programmes lean on MES, PLM and multi-tier supply chain orchestration where a single missed part cripples the line.",
      roles: [
        "Siemens Opcenter Architect",
        "SAP PP / DS Consultant",
        "Teamcenter PLM Lead",
        "SAP EWM Consultant",
        "Blue Yonder SCP Specialist",
        "MES Integration Architect",
        "Manhattan TMS Lead",
        "Rockwell FactoryTalk Specialist",
        "Automotive Compliance Consultant",
      ],
    },
    {
      id: "aerospace",
      name: "Aerospace & Defence",
      intro:
        "Aircraft, defence systems and space equipment. Precision, traceability and regulatory compliance are non-negotiable — the contractor bench needs configuration-controlled experience.",
      roles: [
        "SAP PLM Consultant",
        "Dassault ENOVIA Specialist",
        "SAP QM Functional Lead",
        "Configuration Control Architect",
        "Siemens Teamcenter Lead",
        "IBM Maximo Consultant",
        "Regulated MES Specialist",
        "AS9100 Compliance Consultant",
        "Aerospace Supply Chain Analyst",
      ],
    },
    {
      id: "electronics",
      name: "Electronics & High-Tech Manufacturing",
      intro:
        "Semiconductor, consumer electronics and IoT device production. Short lifecycle products and complex BOMs demand advanced planning and PLM depth.",
      roles: [
        "Siemens Opcenter Consultant",
        "SAP S/4HANA PP Specialist",
        "PLM Data Architect",
        "Blue Yonder Demand Planner",
        "MES Integration Lead",
        "SAP EWM Consultant",
        "Kinaxis RapidResponse Specialist",
        "Contract Manufacturing Analyst",
        "Traceability Systems Lead",
      ],
    },
    {
      id: "pharma",
      name: "Pharmaceutical & Life Sciences Manufacturing",
      intro:
        "Drug manufacturing, medical devices and biotech. GxP, serialisation and validated systems mean contractors need regulated-industry experience end to end.",
      roles: [
        "SAP QM Validation Consultant",
        "Veeva Quality Specialist",
        "Serialisation Systems Lead",
        "GxP MES Consultant",
        "Siemens Opcenter Pharma Architect",
        "SAP PLM Life Sciences Specialist",
        "Kinaxis Response Consultant",
        "Cold Chain Logistics Lead",
        "MasterControl Compliance Consultant",
      ],
    },
    {
      id: "cpg",
      name: "Consumer Packaged Goods (CPG)",
      intro:
        "Packaged foods, beverages and household goods. Demand planning, agile supply chain and rapid inventory turnover define the platform selection.",
      roles: [
        "Blue Yonder Demand Lead",
        "SAP IBP Consultant",
        "TPM Functional Specialist",
        "SAP EWM Consultant",
        "Route-to-Market Architect",
        "Anaplan Supply Planner",
        "Coupa Procurement Lead",
        "SAP CRM Consultant",
        "CPG Analytics Architect",
      ],
    },
    {
      id: "fnb",
      name: "Food and Beverage Manufacturing",
      intro:
        "Recipe, batch and lot traceability at volume. Quality assurance, HACCP and end-to-end traceability set the operating context.",
      roles: [
        "SAP S/4HANA Process Industry Consultant",
        "Recipe Management Specialist",
        "SAP QM Batch Lead",
        "Traceability Systems Architect",
        "Blue Yonder WMS Consultant",
        "Siemens Opcenter Process Specialist",
        "TPM Consultant",
        "SAP EWM Lead",
        "HACCP Compliance Consultant",
      ],
    },
    {
      id: "chemical",
      name: "Chemical Manufacturing",
      intro:
        "Specialty and petrochemical production. Process industry ERP, EHS and hazardous logistics are the defining requirements.",
      roles: [
        "SAP EHS Consultant",
        "Process Industry ERP Lead",
        "SAP S/4HANA Chemicals Consultant",
        "Hazardous Logistics Specialist",
        "Enablon EHS Consultant",
        "AVEVA / OSIsoft PI Specialist",
        "SAP QM Process Lead",
        "Siemens Opcenter Process Architect",
        "Compliance Reporting Consultant",
      ],
    },
    {
      id: "textile",
      name: "Textile & Apparel Manufacturing",
      intro:
        "Fabric and garment production. Demand forecasting, sustainable practices and rapid style turnover define the platform mix.",
      roles: [
        "SAP AFS Consultant",
        "Blue Yonder Demand Planner",
        "PLM for Fashion Specialist",
        "Sustainability Traceability Consultant",
        "Anaplan Model Builder",
        "SAP EWM Lead",
        "Manhattan WMS Consultant",
        "Circulor / Traceability Specialist",
        "Apparel Costing Analyst",
      ],
    },
    {
      id: "industrial-machinery",
      name: "Industrial Machinery & Equipment",
      intro:
        "Heavy equipment and industrial tools. MES, PLM and aftersales service systems drive uptime and margin.",
      roles: [
        "Siemens Teamcenter Architect",
        "SAP S/4HANA Manufacturing Consultant",
        "MES Integration Lead",
        "IBM Maximo Specialist",
        "SAP Service Cloud Consultant",
        "Configure-to-Order Systems Lead",
        "Siemens Opcenter Consultant",
        "Field Service Management Specialist",
        "Warranty Systems Architect",
      ],
    },
    {
      id: "construction",
      name: "Construction & Building Materials",
      intro:
        "Cement, steel and prefabricated structures. Production planning, logistics execution and project-driven manufacturing.",
      roles: [
        "SAP PS Consultant",
        "Oracle Primavera Specialist",
        "SAP S/4HANA Construction Lead",
        "Manhattan TMS Consultant",
        "Bentley Systems Consultant",
        "SAP MM Consultant",
        "Logistics Execution Specialist",
        "Fleet Management Systems Lead",
        "Project Cost Controls Analyst",
      ],
    },
    {
      id: "energy",
      name: "Energy Equipment & Utilities",
      intro:
        "Renewable energy equipment, oil and gas machinery, and smart grid platforms. Asset lifecycle and logistics execution dominate.",
      roles: [
        "IBM Maximo Architect",
        "SAP EAM Consultant",
        "Siemens Digital Grid Specialist",
        "AVEVA / OSIsoft PI Lead",
        "Oracle Utilities Consultant",
        "SAP PM Consultant",
        "Renewables Programme Manager",
        "Field Service Systems Lead",
        "Asset Analytics Architect",
      ],
    },
    {
      id: "logistics-warehousing",
      name: "Logistics & Warehousing",
      intro:
        "DC networks, cross-dock and 3PL operations. WMS, TMS and inventory optimisation set the tempo of the business.",
      roles: [
        "Manhattan Active WMS Lead",
        "SAP EWM Consultant",
        "Blue Yonder WMS Specialist",
        "SAP TM Lead",
        "Blue Yonder TMS Consultant",
        "Yard Management Systems Architect",
        "OMS Architect",
        "Labour Management Specialist",
        "3PL Systems Analyst",
      ],
    },
    {
      id: "cold-chain",
      name: "Cold Chain Logistics",
      intro:
        "Temperature-controlled logistics for pharma, food and biotech. Real-time monitoring and validated cold-chain systems are the differentiator.",
      roles: [
        "Cold Chain WMS Specialist",
        "IoT Temperature Monitoring Lead",
        "SAP EWM Consultant",
        "Pharma Serialisation Consultant",
        "Manhattan Active WM Specialist",
        "AVEVA Historian Consultant",
        "Track & Trace Systems Architect",
        "GDP Compliance Consultant",
        "Cold Chain Programme Manager",
      ],
    },
    {
      id: "ecommerce-fulfilment",
      name: "E-commerce Fulfilment Logistics",
      intro:
        "Fulfilment centres, dark stores and last-mile networks. OMS, WMS and rapid order routing are the top hiring priorities.",
      roles: [
        "OMS Architect",
        "Manhattan Active Omni Consultant",
        "Blue Yonder Fulfillment Lead",
        "SAP EWM Consultant",
        "Fluent Commerce Specialist",
        "Last-Mile Systems Architect",
        "IBM Sterling OMS Consultant",
        "Returns Platform Specialist",
        "Robotic WMS Integration Lead",
      ],
    },
    {
      id: "fmcg-manufacturing",
      name: "FMCG Manufacturing",
      intro:
        "Fast-moving consumer goods at volume. Demand planning, production efficiency and end-to-end supply chain visibility drive the operating rhythm.",
      roles: [
        "SAP IBP Specialist",
        "Blue Yonder Demand Lead",
        "TPM Functional Consultant",
        "Route-to-Market Architect",
        "Distribution Management Lead",
        "SAP CRM Consultant",
        "CPG Analytics Consultant",
        "SAP EWM Lead",
        "Supply Planning Specialist",
      ],
    },
  ],

  insightsEyebrow: "Insights",
  insightsTitle: "What's happening in manufacturing tech talent right now.",
  insightsSub: "Opinionated, specific, useful.",
  insights: [
    {
      href: "/insights/smart-manufacturing-iot-2025",
      published: false,
      category: "Smart Manufacturing",
      title:
        "Smart manufacturing: IoT's role in shaping intelligent ecosystems.",
      excerpt:
        "The gap between IIoT pilots and plant-wide rollout is now a talent problem, not a technology one. Where the specialists actually are — and what they cost.",
      author: "Yallo Talent",
      minutes: 6,
    },
    {
      href: "/insights/supply-chain-resilience-predictive-analytics",
      published: false,
      category: "Supply Chain",
      title:
        "Supply chain resilience: overcoming disruptions with predictive analytics.",
      excerpt:
        "Every manufacturer that got hit hardest in 2024 had the same profile — good tools, wrong contractors. What we've learned from placing planners across three continents.",
      author: "Yallo Talent",
      minutes: 5,
    },
    {
      href: "/insights/circular-economy-manufacturing-tech",
      published: false,
      category: "Sustainability",
      title: "Circular economy in manufacturing: tech-enabled sustainability.",
      excerpt:
        "Carbon accounting, product passports and reverse ops are moving from board decks to programme plans. The specialist bench has not caught up.",
      author: "Yallo Talent",
      minutes: 7,
    },
    {
      href: "/insights/siemens-opcenter-scarcity-2025",
      published: false,
      category: "MES",
      title:
        "Siemens Opcenter specialists in the Gulf: why the bench has dried up.",
      excerpt:
        "Every ME auto and pharma programme in 2024 chased the same Opcenter architects. What that scarcity means for your 2026 rollout timeline.",
      author: "Yallo Talent",
      minutes: 5,
    },
  ],

  relatedTitle:
    "Adjacent industries, platforms and capabilities we place into manufacturing.",
  related: [
    {
      href: "/industries/retail",
      label: taxonomyLabels("retail").label,
      category: "Industry",
    },
    {
      href: "/industries/finance",
      label: taxonomyLabels("finance").label,
      category: "Industry",
    },
    {
      href: "/platforms/sap",
      label: taxonomyLabels("sap").label,
      category: "Platform",
    },
    {
      href: "/platforms/oracle",
      label: taxonomyLabels("oracle").label,
      category: "Platform",
    },
    {
      href: "/platforms/blue-yonder",
      label: taxonomyLabels("blue-yonder").label,
      category: "Platform",
    },
    {
      href: "/platforms/microsoft",
      label: taxonomyLabels("microsoft").label,
      category: "Platform",
    },
    {
      href: "/capabilities/data-analytics",
      label: taxonomyLabels("data-analytics").label,
      category: "Capability",
    },
    {
      href: "/capabilities/cloud-infrastructure",
      label: taxonomyLabels("cloud-infrastructure").label,
      category: "Capability",
    },
  ],

  seo: {
    title:
      "Manufacturing & Logistics Tech Contractors · Middle East · Europe · India | Yallo Talent",
    description:
      "SAP, Siemens, Rockwell, Blue Yonder and Manhattan contractors for manufacturing programmes. 72h specialist-screened shortlists across UK, Middle East and India.",
  },
};
