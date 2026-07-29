import type { L1PageData } from "./types";

export const manufacturingData: L1PageData = {
  slug: "manufacturing",
  category: "industries",
  hue: "blue",
  breadcrumb: [
    { label: "Industries", href: "/industries" },
    { label: "Manufacturing & Logistics" },
  ],

  eyebrow: "Manufacturing & Logistics · Contract-first",
  title: "Manufacturing tech contractors,",
  emphasis: "shortlisted in 72 hours.",
  sub: "SAP, Siemens, Rockwell, Blue Yonder and Manhattan specialists for shop-floor to network programmes across UK, ME and India. Architect-screened for implementation depth — not just platform familiarity.",
  heroImage:
    "https://images.unsplash.com/photo-1565034946487-077786996e27?w=2000&auto=format&fit=crop&q=80",
  heroImageAlt: "Manufacturing plant floor with industrial equipment",
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
    { n: "20", l: "Manufacturing function areas" },
    { n: "3", l: "Active delivery markets" },
  ],

  introEyebrow: "Why Yallo for manufacturing",
  introTitle:
    "Manufacturing programmes stall when shop-floor depth isn't in the room.",
  introCopy: [
    "Every SAP S/4HANA manufacturing rollout, every Siemens Opcenter cutover, every Blue Yonder demand-planning go-live shares the same failure mode — the implementation depends on the depth of the contractor in the room. Generic recruiters place platform names. We place implementation track records.",
    "Our bench is assessed by specialists who have run manufacturing tech delivery. We screen for the specific operating context — multi-plant rollouts, MES integration, IIoT payloads, regulated environments — not just certification badges.",
  ],
  introStatCards: [
    {
      n: "63%",
      l: "of manufacturing CIOs report contractor quality — not budget — is the primary reason MES/ERP programmes slip past go-live.",
    },
    {
      n: "5–7 wks",
      l: "Average time lost when a specialist is placed without shop-floor experience. Yallo's shortlist is in your inbox in 72h.",
    },
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
    "These are the specialists that appear on every manufacturing brief and disappear from the market fastest. Yallo maintains an active bench in each of these areas across UK, ME and India. When you need one, you don't have six weeks.",
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
    "Twenty manufacturing function areas. Contractor bench across all of them.",
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
      image:
        "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Automotive production line",
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
      image:
        "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Aerospace assembly",
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
      image:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Electronics manufacturing",
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
      image:
        "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Pharmaceutical manufacturing",
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
      image:
        "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "CPG production",
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
      image:
        "https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Food and beverage plant",
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
      image:
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Chemical plant",
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
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Textile manufacturing",
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
      image:
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Industrial machinery manufacturing",
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
      image:
        "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Construction and building materials",
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
      image:
        "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Energy equipment manufacturing",
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
      image:
        "https://images.unsplash.com/photo-1553413077-190dd305871c?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Warehousing and logistics",
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
      image:
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Cold chain warehouse",
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
      image:
        "https://images.unsplash.com/photo-1601598851547-4302969d0614?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "E-commerce fulfilment centre",
      roles: [
        "OMS Architect",
        "Manhattan Active Omni Consultant",
        "Blue Yonder Fulfilment Lead",
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
      image:
        "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "FMCG production",
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

  partners: [
    "SAP",
    "Oracle",
    "Siemens",
    "Rockwell Automation",
    "Honeywell",
    "Blue Yonder",
    "Manhattan Associates",
    "IBM",
    "Salesforce",
    "Microsoft",
    "Infor",
    "Dassault Systèmes",
    "Anaplan",
    "Coupa",
    "o9 Solutions",
    "Kinaxis",
  ],

  insightsEyebrow: "Insights",
  insightsTitle: "What's happening in manufacturing tech talent right now.",
  insightsSub:
    "Written by Sumeet Goenka and the Yallo team. Opinionated, specific, useful.",
  insights: [
    {
      href: "/insights/smart-manufacturing-iot-2025",
      category: "Smart Manufacturing",
      title:
        "Smart manufacturing: IoT's role in shaping intelligent ecosystems.",
      excerpt:
        "The gap between IIoT pilots and plant-wide rollout is now a talent problem, not a technology one. Where the specialists actually are — and what they cost.",
      author: "Sumeet Goenka",
      minutes: 6,
      image:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&auto=format&fit=crop&q=80",
      imageAlt: "Smart factory IoT sensors",
    },
    {
      href: "/insights/supply-chain-resilience-predictive-analytics",
      category: "Supply Chain",
      title:
        "Supply chain resilience: overcoming disruptions with predictive analytics.",
      excerpt:
        "Every manufacturer that got hit hardest in 2024 had the same profile — good tools, wrong contractors. What we've learned from placing planners across three continents.",
      author: "Yallo Talent",
      minutes: 5,
      image:
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1000&auto=format&fit=crop&q=80",
      imageAlt: "Supply chain warehouse",
    },
    {
      href: "/insights/circular-economy-manufacturing-tech",
      category: "Sustainability",
      title: "Circular economy in manufacturing: tech-enabled sustainability.",
      excerpt:
        "Carbon accounting, product passports and reverse ops are moving from board decks to programme plans. The specialist bench has not caught up.",
      author: "Sumeet Goenka",
      minutes: 7,
      image:
        "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=1000&auto=format&fit=crop&q=80",
      imageAlt: "Sustainable manufacturing",
    },
    {
      href: "/insights/siemens-opcenter-scarcity-2025",
      category: "MES",
      title:
        "Siemens Opcenter specialists in the Gulf: why the bench has dried up.",
      excerpt:
        "Every ME auto and pharma programme in 2024 chased the same Opcenter architects. What that scarcity means for your 2026 rollout timeline.",
      author: "Sumeet Goenka",
      minutes: 5,
      image:
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1000&auto=format&fit=crop&q=80",
      imageAlt: "Industrial machinery",
    },
  ],

  relatedTitle:
    "Adjacent industries, platforms and capabilities we place into manufacturing.",
  related: [
    {
      href: "/industries/retail",
      label: "Retail & Consumer",
      category: "Industry",
    },
    {
      href: "/industries/finance",
      label: "Banking & Financial Services",
      category: "Industry",
    },
    { href: "/platforms/sap", label: "SAP", category: "Platform" },
    { href: "/platforms/oracle", label: "Oracle", category: "Platform" },
    {
      href: "/platforms/blue-yonder",
      label: "Blue Yonder",
      category: "Platform",
    },
    { href: "/platforms/microsoft", label: "Microsoft", category: "Platform" },
    {
      href: "/capabilities/data-ai",
      label: "Data & AI",
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
      "Manufacturing & Logistics Tech Contractors · UK · ME · India | Yallo Talent",
    description:
      "SAP, Siemens, Rockwell, Blue Yonder and Manhattan contractors for manufacturing programmes. 72h architect-screened shortlists across UK, Middle East and India.",
  },
};
