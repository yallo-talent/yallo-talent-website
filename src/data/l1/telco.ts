import type { L1PageData } from "./types";

export const telcoData: L1PageData = {
  slug: "telco",
  category: "industries",
  hue: "teal",
  breadcrumb: [
    { label: "Industries", href: "/industries" },
    { label: "Telco & Media" },
  ],

  eyebrow: "Telco & Media · Contract-first",
  title: "Telco & media tech contractors,",
  emphasis: "shortlisted in 72 hours.",
  sub: "Ericsson, Nokia, Amdocs, Netcracker and Salesforce C360 specialists for OSS, BSS, 5G and media programmes across UK, ME and India. Screened for carrier-grade delivery depth.",
  heroImage:
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=2000&auto=format&fit=crop&q=80",
  heroImageAlt: "Telecom control centre",
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
    { n: "20", l: "Telco function areas" },
    { n: "3", l: "Active delivery markets" },
  ],

  introEyebrow: "Why Yallo for telco & media",
  introTitle: "Carrier programmes stall when OSS/BSS depth isn't in the room.",
  introCopy: [
    "Every Amdocs or Netcracker BSS transformation, every 5G core rollout, every OSS inventory migration shares the same failure mode — the implementation depends on the depth of the contractor in the room. Generic recruiters place platform names. We place carrier-grade implementation track records.",
    "Our bench is assessed by specialists who have run OSS, BSS, 5G and media delivery. We screen for the specific operating context — TM Forum, ISO 20022 for MNO, live-service uptime, multi-year migration horizons — not just certification badges.",
  ],
  introStatCards: [
    {
      n: "66%",
      l: "of telco CIOs report contractor quality — not budget — is the primary reason OSS/BSS programmes slip past go-live.",
    },
    {
      n: "6–9 wks",
      l: "Average time lost when a specialist is placed without carrier-grade screening. Yallo's shortlist is in your inbox in 72h.",
    },
    {
      n: "Contract-first",
      l: "Primary focus is interim and contract deployment. Also available in Permanent, EOR and Managed Delivery models.",
    },
  ],

  scarceEyebrow: "Scarce talent",
  scarceIcon: "scarce",
  scarceTitle:
    "The roles every telco & media programme needs — and struggles to find.",
  scarceCopy:
    "These are the specialists that appear on every carrier and media brief and disappear from the market fastest. Yallo maintains an active bench in each of these areas across UK, ME and India.",
  scarceCta: { label: "Brief us on a scarce role", href: "/brief" },
  scarceRoles: [
    {
      name: "Amdocs Charging (CES) Solution Architect",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "Netcracker BSS Consultant",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "Ericsson 5G Core Consultant",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "Nokia NetAct / MantaRay Specialist",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "TM Forum Open API Architect",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "SAP BRIM (Billing & Revenue Innovation) Consultant",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "Salesforce Communications Cloud Architect",
      scarcity: "high",
      engagement: "contract-perm",
    },
    {
      name: "OSS Inventory Migration Lead (UIM / Blue Planet)",
      scarcity: "high",
      engagement: "contract",
    },
  ],

  expertiseEyebrow: "Our expertise",
  expertiseTitle:
    "Twenty telco & media function areas. Contractor bench across all of them.",
  expertiseSub:
    "From network operations to advertising ops — we place specialists into every function that moves a carrier or media programme forward.",
  expertise: [
    {
      slug: "network-ops",
      num: "01",
      title: "Network Operations",
      icon: "integration",
      blurb: "NOC, service assurance and orchestration",
      roles: [
        "Ericsson Network Operations Consultant",
        "Nokia NetAct Specialist",
        "Cisco Network Management Lead",
      ],
    },
    {
      slug: "5g-network",
      num: "02",
      title: "5G Network Management",
      icon: "spark",
      blurb: "5G core, RAN and slicing",
      roles: [
        "Ericsson 5G Core Consultant",
        "Nokia 5G Specialist",
        "Huawei 5G Core Network Lead",
      ],
    },
    {
      slug: "oss-inventory",
      num: "03",
      title: "OSS Inventory Management",
      icon: "inventory",
      blurb: "Physical / logical inventory and service",
      roles: [
        "Oracle UIM Consultant",
        "Ciena Blue Planet Specialist",
        "Netcracker Inventory Lead",
      ],
    },
    {
      slug: "service-activation",
      num: "04",
      title: "Service Activation",
      icon: "omnichannel",
      blurb: "Service orchestration and provisioning",
      roles: [
        "Oracle Service Activation Consultant",
        "Ericsson Activation Specialist",
        "Netcracker Provisioning Lead",
      ],
    },
    {
      slug: "rating-billing",
      num: "05",
      title: "Rating & Billing",
      icon: "pricing",
      blurb: "Convergent charging and invoicing",
      roles: [
        "Oracle BRM Consultant",
        "Amdocs Charging Specialist",
        "Netcracker Rating & Billing Lead",
      ],
    },
    {
      slug: "subscriber-billing",
      num: "06",
      title: "Subscriber & Billing Management",
      icon: "finance",
      blurb: "Customer lifecycle billing and revenue",
      roles: [
        "Netcracker Billing Consultant",
        "Amdocs RevenueONE Specialist",
        "SAP BRIM Lead",
      ],
    },
    {
      slug: "telco-crm",
      num: "07",
      title: "Customer Relationship Management",
      icon: "crm",
      blurb: "Care, sales and self-service",
      roles: [
        "Salesforce C360 for Telco Consultant",
        "Oracle Siebel CRM Specialist",
        "MS Dynamics 365 for Telco Lead",
      ],
    },
    {
      slug: "content-management",
      num: "08",
      title: "Content Management & Distribution",
      icon: "space",
      blurb: "Media asset, DRM and CDN",
      roles: [
        "Brightcove Content Management Consultant",
        "AWS Media Services Specialist",
        "Akamai Content Delivery Lead",
      ],
    },
    {
      slug: "advertising-ops",
      num: "09",
      title: "Advertising Operations",
      icon: "loyalty",
      blurb: "Ad tech, DSP and audience",
      roles: [
        "Google Ad Manager Consultant",
        "Xandr Platform Specialist",
        "Adobe Advertising Cloud Lead",
      ],
    },
    {
      slug: "ai-analytics-telco",
      num: "10",
      title: "AI & Analytics for Telco & Media",
      icon: "dataAi",
      blurb: "Network AI, churn and personalisation",
      roles: [
        "Google Cloud AI for Media Consultant",
        "AWS Analytics for Telco Specialist",
        "Azure AI for Telco Lead",
      ],
    },
    {
      slug: "oss-bss-modernisation",
      num: "11",
      title: "OSS/BSS Modernisation",
      icon: "cloud",
      blurb: "Legacy to cloud-native carrier stack",
      roles: [
        "OSS Migration Consultant",
        "BSS Modernisation Specialist",
        "Cloud-Native Telco Architect",
      ],
    },
    {
      slug: "number-portability",
      num: "12",
      title: "Number Portability & Interconnect",
      icon: "integration",
      blurb: "MNP, roaming and settlement",
      roles: [
        "Number Portability Consultant",
        "Interconnect Systems Specialist",
        "Roaming Systems Lead",
      ],
    },
    {
      slug: "fibre-fttx",
      num: "13",
      title: "Fibre & FTTx Planning",
      icon: "space",
      blurb: "GIS, network design and rollout",
      roles: [
        "FTTx Planning Consultant",
        "GIS Network Design Specialist",
        "Fibre Rollout Programme Lead",
      ],
    },
    {
      slug: "fraud-management",
      num: "14",
      title: "Fraud & Revenue Assurance",
      icon: "security",
      blurb: "Fraud detection, RA and leakage",
      roles: [
        "Fraud Management Consultant",
        "Revenue Assurance Specialist",
        "Subex FMS Lead",
      ],
    },
    {
      slug: "cybersecurity-telco",
      num: "15",
      title: "Cybersecurity for Telco",
      icon: "security",
      blurb: "Telco SOC, IoT and network security",
      roles: [
        "Palo Alto Networks Consultant",
        "IBM Security Specialist",
        "Fortinet Telco Security Lead",
      ],
    },
    {
      slug: "reg-compliance-telco",
      num: "16",
      title: "Regulatory Compliance & Governance",
      icon: "government",
      blurb: "Ofcom / TRA / DoT reporting",
      roles: [
        "Wolters Kluwer Compliance Consultant",
        "Thomson Reuters ONESOURCE Specialist",
        "MetricStream GRC Lead",
      ],
    },
    {
      slug: "finance-ops-telco",
      num: "17",
      title: "Accounting & Financial Operations",
      icon: "finance",
      blurb: "Group finance and revenue reporting",
      roles: [
        "SAP S/4HANA Finance Consultant",
        "Oracle Financials Cloud Specialist",
        "MS Dynamics 365 Finance Lead",
      ],
    },
    {
      slug: "procurement-telco",
      num: "18",
      title: "Procurement & Vendor Management",
      icon: "finance",
      blurb: "Vendor spend, contracts and 3rd-party risk",
      roles: [
        "SAP Ariba Consultant",
        "Coupa Procurement Specialist",
        "Oracle Procurement Cloud Lead",
      ],
    },
    {
      slug: "hcm-telco",
      num: "19",
      title: "Human Capital Management",
      icon: "workforce",
      blurb: "Payroll, deployment and comp",
      roles: [
        "SAP SuccessFactors Consultant",
        "Oracle HCM Cloud Specialist",
        "Workday HCM Lead",
      ],
    },
    {
      slug: "it-infra-telco",
      num: "20",
      title: "IT Infrastructure & Operations",
      icon: "cloud",
      blurb: "Cloud, ITSM and edge platforms",
      roles: [
        "ServiceNow ITSM Consultant",
        "BMC Helix Specialist",
        "MS Endpoint Manager Lead",
      ],
    },
  ],

  segmentsEyebrow: "Segments we support",
  segmentsTitle:
    "Every telco & media segment. Specialists who know the context.",
  segmentsSub:
    "A tier-1 MNO runs different programmes from a broadcaster or a hyperscaler-connect carrier. Our contractors understand the specific operating context — not just the platform.",
  segments: [
    {
      id: "network-ops-seg",
      name: "Network Operations",
      intro:
        "NOC, service assurance and orchestration. Ericsson / Nokia / Cisco depth is the differentiator.",
      image:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Network operations centre",
      roles: [
        "Ericsson NOC Consultant",
        "Nokia NetAct Specialist",
        "Cisco Network Management Lead",
        "Service Assurance Architect",
        "Fault Management Consultant",
        "Performance Management Specialist",
        "Orchestration Systems Lead",
        "TM Forum Open API Consultant",
        "Network Analytics Analyst",
      ],
    },
    {
      id: "rating-billing-seg",
      name: "Rating & Billing",
      intro:
        "Convergent charging, real-time rating and invoice generation. Migration programmes dominate.",
      image:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Rating and billing systems",
      roles: [
        "Oracle BRM Consultant",
        "Amdocs Charging Specialist",
        "Netcracker Rating Lead",
        "Convergent Charging Consultant",
        "Real-Time Rating Specialist",
        "Rated Event Analyst",
        "Invoice Systems Consultant",
        "Mediation Platform Lead",
        "SAP BRIM Consultant",
      ],
    },
    {
      id: "oss-inventory-seg",
      name: "OSS Inventory Management",
      intro:
        "Physical, logical and service inventory. Migration to Blue Planet / UIM is the recurring theme.",
      image:
        "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "OSS inventory management",
      roles: [
        "Oracle UIM Consultant",
        "Ciena Blue Planet Specialist",
        "Netcracker Inventory Lead",
        "Inventory Federation Consultant",
        "Service Model Analyst",
        "OSS Data Migration Consultant",
        "Physical Inventory Specialist",
        "Logical Inventory Analyst",
        "Inventory Reporting Architect",
      ],
    },
    {
      id: "service-activation-seg",
      name: "Service Activation",
      intro:
        "Provisioning and service orchestration for consumer, enterprise and wholesale.",
      image:
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Service activation systems",
      roles: [
        "Oracle Service Activation Consultant",
        "Ericsson Activation Specialist",
        "Netcracker Provisioning Lead",
        "Service Orchestration Architect",
        "ONAP / MEF Consultant",
        "Provisioning Systems Analyst",
        "SDN / NFV Specialist",
        "Order Fallout Consultant",
        "Order Decomposition Analyst",
      ],
    },
    {
      id: "crm-seg",
      name: "Customer Relationship Management",
      intro:
        "Care, sales, digital self-service and retention. Salesforce Comms Cloud migrations are moving fast.",
      image:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Telco customer care",
      roles: [
        "Salesforce Communications Cloud Consultant",
        "Oracle Siebel CRM Specialist",
        "MS Dynamics 365 Telco Lead",
        "Care Systems Consultant",
        "Retention Analytics Specialist",
        "Self-Service Portal Architect",
        "Digital Journey Consultant",
        "Contact Centre Systems Analyst",
        "Customer 360 Consultant",
      ],
    },
    {
      id: "content-mgmt-seg",
      name: "Content Management & Distribution",
      intro:
        "Broadcast, OTT and media asset workflows. DRM, encoding and CDN sit at the core.",
      image:
        "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Content management studio",
      roles: [
        "Brightcove Consultant",
        "AWS Media Services Specialist",
        "Akamai CDN Lead",
        "DRM Systems Consultant",
        "Encoding / Transcoding Specialist",
        "Media Asset Management Architect",
        "OTT Platform Consultant",
        "Broadcast Systems Analyst",
        "Live-Streaming Systems Consultant",
      ],
    },
    {
      id: "advertising-ops-seg",
      name: "Advertising Operations",
      intro:
        "Ad tech, DSP/SSP, audience segmentation. Programmatic and identity depth are the differentiators.",
      image:
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Advertising operations",
      roles: [
        "Google Ad Manager Consultant",
        "Xandr Platform Specialist",
        "Adobe Advertising Cloud Lead",
        "CDP / Audience Consultant",
        "Programmatic Trading Specialist",
        "Header Bidding Analyst",
        "Identity Resolution Consultant",
        "Attribution Analytics Specialist",
        "Ad Ops Programme Manager",
      ],
    },
    {
      id: "subscriber-billing-seg",
      name: "Subscriber & Billing Management",
      intro:
        "End-to-end subscriber lifecycle. Migrations from legacy billing to convergent stacks run continuously.",
      image:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Subscriber and billing",
      roles: [
        "Netcracker Billing Consultant",
        "Amdocs RevenueONE Specialist",
        "SAP BRIM Lead",
        "Subscriber Lifecycle Consultant",
        "Product Catalogue Specialist",
        "Order Management Consultant",
        "Convergent Billing Architect",
        "Revenue Assurance Specialist",
        "Prepay / Postpay Consultant",
      ],
    },
    {
      id: "5g-seg",
      name: "5G Network Management",
      intro:
        "5G core, RAN, slicing and edge. UK, ME and India carriers are all mid-rollout.",
      image:
        "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "5G network infrastructure",
      roles: [
        "Ericsson 5G Core Consultant",
        "Nokia 5G Specialist",
        "Huawei 5G Core Lead",
        "Open RAN Consultant",
        "Network Slicing Specialist",
        "Edge Compute Architect",
        "5G Standalone Consultant",
        "MEC / Edge Networking Analyst",
        "5G Security Consultant",
      ],
    },
    {
      id: "ai-analytics-seg",
      name: "AI & Analytics for Telco & Media",
      intro:
        "Network AI, churn, GenAI-driven personalisation. The specialist bench is thin across all three markets.",
      image:
        "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Telco analytics dashboard",
      roles: [
        "Google Cloud AI for Media Consultant",
        "AWS Analytics for Telco Specialist",
        "Azure AI for Telco Lead",
        "Databricks for Telco Consultant",
        "Snowflake Data Cloud Specialist",
        "Churn ML Consultant",
        "Personalisation ML Specialist",
        "Data Governance Consultant",
        "MLOps Architect",
      ],
    },
    {
      id: "finance-ops-seg",
      name: "Accounting & Financial Operations",
      intro: "Group finance, product P&L and IFRS reporting at MNO scale.",
      image:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Telco finance operations",
      roles: [
        "SAP S/4HANA Finance Consultant",
        "Oracle Financials Cloud Specialist",
        "MS Dynamics 365 Finance Lead",
        "Group Consolidation Consultant",
        "Product Costing Specialist",
        "Revenue Reporting Analyst",
        "Cost Allocation Consultant",
        "Financial Reporting Architect",
        "IFRS 15 Consultant",
      ],
    },
    {
      id: "procurement-seg",
      name: "Procurement & Vendor Management",
      intro:
        "Vendor spend, contracts and third-party risk in a heavily regulated industry.",
      image:
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Telco procurement",
      roles: [
        "SAP Ariba Consultant",
        "Coupa Procurement Specialist",
        "Oracle Procurement Cloud Lead",
        "Vendor Master Data Consultant",
        "S2P Programme Manager",
        "Contracts Systems Specialist",
        "Category Management Analyst",
        "Sourcing Optimisation Lead",
        "Third-Party Risk Consultant",
      ],
    },
    {
      id: "hcm-seg",
      name: "Human Capital Management",
      intro:
        "Payroll, workforce deployment and comp for large distributed engineering teams.",
      image:
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Telco HCM",
      roles: [
        "SAP SuccessFactors Consultant",
        "Oracle HCM Cloud Specialist",
        "Workday HCM Lead",
        "Payroll Systems Specialist",
        "Compensation Analyst",
        "Workforce Planning Consultant",
        "HR Data Warehouse Consultant",
        "Time & Attendance Systems Specialist",
        "Learning Systems Consultant",
      ],
    },
    {
      id: "it-infra-seg",
      name: "IT Infrastructure & Operations",
      intro:
        "Cloud landing zones, ITSM and edge compute for carriers. Cloud-first is the platform selection.",
      image:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Telco IT infrastructure",
      roles: [
        "ServiceNow ITSM Consultant",
        "BMC Helix Specialist",
        "MS Endpoint Manager Lead",
        "AWS / Azure Landing Zone Architect",
        "Kubernetes Platform Engineer",
        "DR / BCM Consultant",
        "Observability / Splunk Specialist",
        "Edge Compute Consultant",
        "Network Modernisation Lead",
      ],
    },
    {
      id: "reg-compliance-seg",
      name: "Regulatory Compliance & Governance",
      intro:
        "Ofcom, TRA, DoT and other national telco regulators. Data sovereignty is the recurring headache.",
      image:
        "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Telco regulatory compliance",
      roles: [
        "Wolters Kluwer Reg Reporting Consultant",
        "Thomson Reuters ONESOURCE Specialist",
        "MetricStream GRC Lead",
        "Data Sovereignty Consultant",
        "Telco Reg Change Specialist",
        "Number Portability Compliance Analyst",
        "Ofcom Reporting Consultant",
        "Regulatory Systems Lead",
        "Programme Assurance Consultant",
      ],
    },
  ],

  partners: [
    "SAP",
    "Oracle",
    "Salesforce",
    "Microsoft",
    "Ericsson",
    "Nokia",
    "Cisco",
    "Amdocs",
    "Netcracker",
    "Huawei",
    "Ciena",
    "AWS",
    "Google Cloud",
    "Akamai",
    "Adobe",
    "ServiceNow",
  ],

  insightsEyebrow: "Insights",
  insightsTitle: "What's happening in telco & media tech talent right now.",
  insightsSub:
    "Written by Sumeet Goenka and the Yallo team. Opinionated, specific, useful.",
  insights: [
    {
      href: "/insights/amdocs-charging-scarcity-2025",
      published: false,
      category: "BSS",
      title:
        "Amdocs Charging (CES) specialists: why every UK / ME telco is now competing for the same twenty architects.",
      excerpt:
        "The bench that delivered the last generation of MNO transformations is thinning fast. Where the available architects actually are.",
      author: "Sumeet Goenka",
      minutes: 6,
      image:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1000&auto=format&fit=crop&q=80",
      imageAlt: "Charging systems",
    },
    {
      href: "/insights/5g-standalone-talent-me",
      published: false,
      category: "5G",
      title:
        "5G Standalone in the Gulf: the specialists Middle East carriers need on the bench right now.",
      excerpt:
        "The rollout has moved from proof of concept to network-wide deployment. Vendor consultants are booked out through 2026.",
      author: "Yallo Talent",
      minutes: 5,
      image:
        "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=1000&auto=format&fit=crop&q=80",
      imageAlt: "5G rollout",
    },
    {
      href: "/insights/salesforce-comms-cloud-2025",
      published: false,
      category: "CRM",
      title:
        "Salesforce Communications Cloud: what actually gets a carrier delivery on time.",
      excerpt:
        "The programmes that hit dates confirmed the Comms Cloud architect before vendor selection was complete.",
      author: "Sumeet Goenka",
      minutes: 7,
      image:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1000&auto=format&fit=crop&q=80",
      imageAlt: "Telco CRM",
    },
    {
      href: "/insights/oss-bss-modernisation",
      published: false,
      category: "OSS/BSS",
      title:
        "OSS/BSS modernisation: the migration architects who actually delivered legacy-to-cloud in the last 24 months.",
      excerpt:
        "The specialist bench you need for a real cloud-native carrier stack — where they are and what they cost.",
      author: "Sumeet Goenka",
      minutes: 6,
      image:
        "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=1000&auto=format&fit=crop&q=80",
      imageAlt: "OSS BSS modernisation",
    },
  ],

  relatedTitle:
    "Adjacent industries, platforms and capabilities we place into telco & media.",
  related: [
    {
      href: "/industries/finance",
      label: "Banking & Financial Services",
      category: "Industry",
    },
    {
      href: "/industries/government",
      label: "Government & Public Sector",
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
    title: "Telco & Media Tech Contractors · UK · ME · India | Yallo Talent",
    description:
      "Ericsson, Nokia, Amdocs, Netcracker and Salesforce C360 contractors for OSS, BSS, 5G and media programmes. 72h architect-screened shortlists across UK, Middle East and India.",
  },
};
