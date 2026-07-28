import type { L1PageData } from "./types";

export const retailData: L1PageData = {
  slug: "retail",
  category: "industries",
  hue: "orange",
  breadcrumb: [
    { label: "Industries", href: "/industries" },
    { label: "Retail & Consumer" },
  ],

  eyebrow: "Retail & Consumer · Contract-first",
  title: "Retail tech contractors,",
  emphasis: "shortlisted in 72 hours.",
  sub: "SAP, Oracle, Blue Yonder and Salesforce specialists for retail programmes across UK, ME and India. Architect-screened for implementation depth — not just platform familiarity.",
  heroImage:
    "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=2000&auto=format&fit=crop&q=80",
  heroImageAlt: "Retail store interior with display lighting",
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
    { n: "20", l: "Retail function areas" },
    { n: "3", l: "Active delivery markets" },
  ],

  introEyebrow: "Why Yallo for retail",
  introTitle:
    "Retail programmes stall when the right contractor isn't in the seat.",
  introCopy: [
    "Every SAP S/4HANA retail go-live, every Blue Yonder WMS cutover, every Salesforce Commerce Cloud launch shares the same failure mode — the implementation depends on the depth of the contractor in the room. Generic recruiters place platform names. We place implementation track records.",
    "Our contractor bench is assessed by specialists who have run retail tech delivery. We screen for the specific retail context — high transaction volumes, seasonal peaks, multi-market rollouts — not just certification badges.",
  ],
  introStatCards: [
    {
      n: "68%",
      l: "of retail CIOs report contractor quality — not budget — is the primary reason programmes slip past go-live.",
    },
    {
      n: "4–6 wks",
      l: "Average time lost when a specialist is placed without retail-specific screening. Yallo's shortlist is in your inbox in 72h.",
    },
    {
      n: "Contract-first",
      l: "Primary focus is interim and contract deployment. Also available in Permanent, EOR and Managed Delivery models.",
    },
  ],

  scarceEyebrow: "Scarce talent",
  scarceIcon: "scarce",
  scarceTitle:
    "The roles every retail programme needs — and struggles to find.",
  scarceCopy:
    "These are the specialists that appear on every retail programme brief and disappear from the market fastest. Yallo maintains an active bench in each of these areas across UK, ME and India. When you need one, you don't have six weeks.",
  scarceCta: { label: "Brief us on a scarce role", href: "/brief" },
  scarceRoles: [
    {
      name: "SAP CAR / Customer Activity Repository Specialist",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "Blue Yonder Luminate Data Scientist",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "Oracle Xstore POS Architect",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "Manhattan WMS Functional Consultant",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "Retail Assortment Planning Lead (Anaplan / BY)",
      scarcity: "high",
      engagement: "contract-perm",
    },
    {
      name: "SAP Commerce Cloud Architect",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "Retail EWM / WMS Technical Lead",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "Omnichannel OMS Architect (Oracle / SAP)",
      scarcity: "high",
      engagement: "contract",
    },
  ],

  expertiseEyebrow: "Our expertise",
  expertiseTitle:
    "Twenty retail function areas. Contractor bench across all of them.",
  expertiseSub:
    "From front-of-house customer experience to back-of-house supply chain — we place specialists into every function that moves a retail programme forward.",
  expertise: [
    {
      slug: "customer-experience",
      num: "01",
      title: "Customer Experience",
      icon: "cx",
      blurb: "Brand-to-basket journeys across channels",
      roles: [
        "SAP CX Functional Consultant",
        "SFMC Developer",
        "Personalisation Architect",
      ],
    },
    {
      slug: "clienteling",
      num: "02",
      title: "Clienteling & Styling",
      icon: "clienteling",
      blurb: "Luxury one-to-one selling and appointment flows",
      roles: [
        "Salesforce Clienteling Lead",
        "Endear / Tulip Specialist",
        "Retail Advisor App Architect",
      ],
    },
    {
      slug: "store-operations",
      num: "03",
      title: "Store Operations",
      icon: "store",
      blurb: "Task management, back-office and store systems",
      roles: [
        "Oracle Retail Consultant",
        "SAP S/4HANA Retail Functional",
        "Store Systems Architect",
      ],
    },
    {
      slug: "point-of-sale",
      num: "04",
      title: "Point of Sale",
      icon: "pos",
      blurb: "In-store checkout, mobile POS and payments",
      roles: [
        "Oracle Xstore Specialist",
        "SAP Customer Checkout Consultant",
        "D365 POS Developer",
      ],
    },
    {
      slug: "merchandising",
      num: "05",
      title: "Merchandising & Buying",
      icon: "merch",
      blurb: "Buying, range management and product lifecycle",
      roles: [
        "Blue Yonder MFP Specialist",
        "Oracle Retail MOM Consultant",
        "SAP MM Functional Lead",
      ],
    },
    {
      slug: "assortment-planning",
      num: "06",
      title: "Assortment Planning",
      icon: "assortment",
      blurb: "Store cluster, size scale and OTB planning",
      roles: [
        "Anaplan Model Builder",
        "Blue Yonder Assortment Specialist",
        "Oracle Retail RPAS Consultant",
      ],
    },
    {
      slug: "space-planning",
      num: "07",
      title: "Space & Floor Planning",
      icon: "space",
      blurb: "Planograms, cluster grids and store layouts",
      roles: [
        "JDA Space Planner",
        "Nielsen Spaceman Consultant",
        "Retail Category Architect",
      ],
    },
    {
      slug: "pricing-promotions",
      num: "08",
      title: "Pricing & Promotions",
      icon: "promotions",
      blurb: "Price optimisation, markdown and offer engines",
      roles: [
        "Blue Yonder Price / Promotion Lead",
        "Revionics Specialist",
        "SAP Promotion Management Consultant",
      ],
    },
    {
      slug: "loyalty-rewards",
      num: "09",
      title: "Loyalty & Rewards",
      icon: "loyalty",
      blurb: "Points, tiers, gamification and lifecycle loyalty",
      roles: [
        "Oracle Loyalty Cloud Consultant",
        "Salesforce Loyalty Specialist",
        "Loyalty Platform Architect",
      ],
    },
    {
      slug: "crm",
      num: "10",
      title: "CRM & Marketing Ops",
      icon: "crm",
      blurb: "Segmentation, journeys and cross-channel activation",
      roles: [
        "Salesforce Marketing Cloud Consultant",
        "Braze Specialist",
        "CDP Architect",
      ],
    },
    {
      slug: "ecommerce",
      num: "11",
      title: "E-commerce",
      icon: "ecommerce",
      blurb: "Storefront, checkout and headless commerce",
      roles: [
        "SAP Commerce Architect",
        "Salesforce Commerce Cloud Lead",
        "Shopify Plus Specialist",
      ],
    },
    {
      slug: "omnichannel-fulfillment",
      num: "12",
      title: "Omnichannel Fulfilment",
      icon: "omnichannel",
      blurb: "Ship-from-store, click-collect and dark stores",
      roles: [
        "OMS Architect",
        "Blue Yonder Fulfillment Lead",
        "Store Fulfilment Programme Manager",
      ],
    },
    {
      slug: "order-management",
      num: "13",
      title: "Order Management (OMS)",
      icon: "oms",
      blurb: "Distributed order orchestration across channels",
      roles: [
        "IBM Sterling OMS Architect",
        "Manhattan Active Omni Lead",
        "Fluent Commerce Specialist",
      ],
    },
    {
      slug: "warehouse-management",
      num: "14",
      title: "Warehouse Management (WMS)",
      icon: "wms",
      blurb: "DC operations, pick paths and slotting",
      roles: [
        "Manhattan WMS Lead",
        "SAP EWM Consultant",
        "Blue Yonder WMS Specialist",
      ],
    },
    {
      slug: "transport-management",
      num: "15",
      title: "Transport Management (TMS)",
      icon: "tms",
      blurb: "Last-mile, routing and carrier orchestration",
      roles: [
        "Oracle OTM Specialist",
        "Manhattan Active TMS Consultant",
        "Blue Yonder TMS Architect",
      ],
    },
    {
      slug: "supply-chain",
      num: "16",
      title: "Supply Chain & S&OP",
      icon: "supply",
      blurb: "Integrated supply-demand planning across the network",
      roles: [
        "Kinaxis RapidResponse Lead",
        "SAP IBP Consultant",
        "S&OP Programme Manager",
      ],
    },
    {
      slug: "demand-planning",
      num: "17",
      title: "Demand Planning & Forecasting",
      icon: "demand",
      blurb: "Statistical forecasting and demand sensing",
      roles: [
        "Blue Yonder Demand Planner",
        "o9 Solutions Specialist",
        "SAP APO / IBP Consultant",
      ],
    },
    {
      slug: "inventory-replenishment",
      num: "18",
      title: "Inventory & Replenishment",
      icon: "inventory",
      blurb: "Store, DC and network inventory optimisation",
      roles: [
        "Blue Yonder Replenishment Lead",
        "Oracle Retail Inventory Consultant",
        "SAP F&R Specialist",
      ],
    },
    {
      slug: "returns-reverse-logistics",
      num: "19",
      title: "Returns & Reverse Logistics",
      icon: "returns",
      blurb: "Returns portals, refurb flows and reverse WMS",
      roles: [
        "Returns Platform Specialist",
        "Reverse Logistics Consultant",
        "Post-purchase Systems Lead",
      ],
    },
    {
      slug: "master-data-pim",
      num: "20",
      title: "Master Data & PIM",
      icon: "mdm",
      blurb: "Product, customer and location data at scale",
      roles: [
        "Stibo PIM Consultant",
        "Informatica MDM Specialist",
        "Salsify PIM Lead",
      ],
    },
  ],

  segmentsEyebrow: "Segments we support",
  segmentsTitle: "Every retail segment. Specialists who know the context.",
  segmentsSub:
    "Luxury retail runs different programmes from grocery. Our contractors understand the specific operating context — not just the platform.",
  segments: [
    {
      id: "apparel",
      name: "Apparel, Luxury & Accessories",
      intro:
        "High-SKU, multi-market, seasonally volatile. Luxury programmes demand contractors who understand clienteling, single-view-of-customer and complex omnichannel fulfilment — not just ERP basics.",
      image:
        "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Apparel and luxury retail",
      roles: [
        "SAP CX Consultant",
        "Retail Planning Lead",
        "OMS Architect",
        "Clienteling Specialist",
        "E-commerce Lead",
      ],
    },
    {
      id: "grocery",
      name: "Grocery & Hypermarkets",
      intro:
        "Ultra-high transaction volumes, perishable supply chains and complex promotions. Contractors need SAP CAR, Blue Yonder demand planning and WMS depth to make an impact from week one.",
      image:
        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Grocery and hypermarket retail",
      roles: [
        "SAP CAR Specialist",
        "Blue Yonder WMS Lead",
        "Demand Planner",
        "Promotions Systems Lead",
        "EWM Consultant",
      ],
    },
    {
      id: "electronics",
      name: "Consumer Electronics",
      intro:
        "Rapid product cycles, omnichannel complexity and high-return volumes. Programmes need contractors with strong inventory management and reverse logistics depth alongside core ERP skills.",
      image:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Consumer electronics retail",
      roles: [
        "Inventory Systems Specialist",
        "Oracle Retail Consultant",
        "SAP WM Functional",
        "Returns Management Lead",
      ],
    },
    {
      id: "beauty",
      name: "Drugstore, Health & Beauty",
      intro:
        "Loyalty programme complexity, pharmacy integration and multi-channel fulfilment. CRM and loyalty specialists are consistently the hardest roles to fill in this segment.",
      image:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Health and beauty retail",
      roles: [
        "Loyalty Programme Lead",
        "CRM Functional Consultant",
        "Salesforce Loyalty Specialist",
        "D365 Commerce Lead",
      ],
    },
    {
      id: "mass",
      name: "Mass Merchandise & Department Stores",
      intro:
        "Complex assortment planning, multi-format operations and large-scale SAP landscapes. Programmes often run parallel workstreams — breadth of contractor bench matters here more than anywhere.",
      image:
        "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Department store retail",
      roles: [
        "SAP Retail Functional",
        "Assortment Planning Lead",
        "Oracle Retail Specialist",
        "Space Planning Lead",
      ],
    },
    {
      id: "homeimprovement",
      name: "Home Improvement & Furnishings",
      intro:
        "High-value, low-frequency purchases with complex delivery and installation logistics. WMS, TMS and order management specialists are consistently in demand.",
      image:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Home improvement retail",
      roles: [
        "WMS Functional Lead",
        "TMS Specialist",
        "OMS Architect",
        "SAP EWM Consultant",
      ],
    },
    {
      id: "fnb",
      name: "Restaurants, Food & Beverage",
      intro:
        "POS, kitchen management, franchise systems and loyalty at scale. NCR, Oracle Hospitality and Salesforce loyalty specialists are the most in-demand contractors across this segment.",
      image:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Restaurant and F&B retail",
      roles: [
        "Oracle Hospitality Lead",
        "NCR Aloha Specialist",
        "POS Systems Architect",
        "Loyalty Platform Lead",
      ],
    },
    {
      id: "airline",
      name: "Airline Retail & Duty-Free",
      intro:
        "Multi-currency, multi-jurisdiction and integrated with airline reservation systems. A niche that demands contractors who understand both retail systems and the specific regulatory context of travel retail.",
      image:
        "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Airline duty-free retail",
      roles: [
        "Duty-Free Systems Lead",
        "POS Integration Specialist",
        "Inventory Systems Analyst",
        "CRM Functional Consultant",
      ],
    },
    {
      id: "fmcg",
      name: "FMCG — Fast-Moving Consumer Goods",
      intro:
        "Trade promotions management, demand planning and supply chain optimisation at volume. SAP IBP and Blue Yonder specialists are consistently the hardest roles to place in this segment.",
      image:
        "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "FMCG production",
      roles: [
        "SAP IBP Specialist",
        "Blue Yonder Demand Lead",
        "TPM Functional Consultant",
        "Supply Planning Lead",
      ],
    },
    {
      id: "offprice",
      name: "Off-Price / Discounts",
      intro:
        "Opportunistic buying, rapid markdown decisions and high inventory turnover. Pricing and promotions systems expertise — particularly Oracle Retail Pricing and Revionics — is the core requirement.",
      image:
        "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Off-price retail",
      roles: [
        "Pricing Systems Lead",
        "Markdown Optimisation Specialist",
        "Oracle Retail Pricing Lead",
        "Inventory Analyst",
      ],
    },
    {
      id: "hotels",
      name: "Hotels & Resorts",
      intro:
        "Property management, F&B integration and guest experience platforms. Oracle Hospitality and Salesforce Service Cloud specialists are consistently in demand across this segment in the Middle East.",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Hotels and resorts",
      roles: [
        "Oracle Hospitality Specialist",
        "SAP REFX Consultant",
        "CX Platform Lead",
        "Property Systems Analyst",
      ],
    },
    {
      id: "convenience",
      name: "Convenience & Fuel",
      intro:
        "POS integration, fuel management systems and high-frequency loyalty programmes. A segment where speed of contractor deployment matters most — programmes run on tight timelines.",
      image:
        "https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Convenience and fuel retail",
      roles: [
        "POS Systems Lead",
        "Loyalty Programme Specialist",
        "SAP Retail Functional",
        "Fuel Systems Analyst",
      ],
    },
    {
      id: "specialty",
      name: "Specialty Retail",
      intro:
        "Category-specific operations spanning sports, toys, books, pets and DIY. Contractors need deep vertical understanding paired with modern commerce and inventory systems experience.",
      image:
        "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Specialty retail",
      roles: [
        "Category Systems Lead",
        "Oracle Retail Consultant",
        "Commerce Platform Specialist",
        "Inventory Analyst",
      ],
    },
  ],

  insightsEyebrow: "Insights",
  insightsTitle: "What's happening in retail tech talent right now.",
  insightsSub:
    "Written by Sumeet Goenka and the Yallo team. Opinionated, specific, useful.",
  insights: [
    {
      href: "/insights/blue-yonder-luminate-scarcity-2025",
      category: "Supply Chain",
      title:
        "Blue Yonder Luminate contractors: why the bench dried up and what retail programmes are doing about it.",
      excerpt:
        "Luminate went GA faster than the talent market could absorb. We've placed Luminate specialists across three continents in the last 18 months — here's what we know about where the available contractors are and what they cost.",
      author: "Sumeet Goenka",
      minutes: 6,
      image:
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1000&auto=format&fit=crop&q=80",
      imageAlt: "Supply chain warehouse operations",
    },
    {
      href: "/insights/sap-commerce-cloud-middle-east",
      category: "E-commerce",
      title:
        "SAP Commerce Cloud in the Gulf: implementation contractors are being hired six months too late.",
      excerpt:
        "Every SAP Commerce programme in the ME region that slipped in 2024 had one thing in common: the technical architect was confirmed after the project structure was already locked. The fix isn't faster hiring — it's earlier briefing.",
      author: "Yallo Talent",
      minutes: 5,
      image:
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1000&auto=format&fit=crop&q=80",
      imageAlt: "E-commerce workstation",
    },
    {
      href: "/insights/retail-planning-anaplan-demand",
      category: "Planning & Analytics",
      title:
        "Anaplan Model Builders in retail: the role that's reshaping how large retailers plan — and why there aren't enough of them.",
      excerpt:
        "Anaplan has moved from finance tool to enterprise planning platform faster than the talent pool has followed. In retail specifically, the demand for Model Builders outstrips supply by a ratio we haven't seen since SAP HANA launched in 2015.",
      author: "Sumeet Goenka",
      minutes: 7,
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80",
      imageAlt: "Retail planning analytics dashboard",
    },
    {
      href: "/insights/retail-cx-contractor-retention",
      category: "Customer Experience",
      title:
        "Why retail CX contractors walk at go-live — and how to keep them.",
      excerpt:
        "The highest-risk moment in any retail CX programme is the 30 days before and after go-live. What we've learned about contractor exit patterns, commercial triggers, and how to structure engagement to prevent it.",
      author: "Sumeet Goenka",
      minutes: 8,
      image:
        "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1000&auto=format&fit=crop&q=80",
      imageAlt: "Retail CX programme",
    },
    {
      href: "/insights/72-hour-talent-benchmark",
      category: "Talent Operations",
      title:
        "The 72-hour benchmark: what enterprise retailers get wrong about contractor speed.",
      excerpt:
        "Most retail IT leaders accept 4–6 weeks as normal for contractor shortlisting. It isn't. What makes rapid shortlisting possible, why it needs architect-led screening, and how to brief a talent partner to activate it.",
      author: "Yallo Talent",
      minutes: 6,
      image:
        "https://images.unsplash.com/photo-1553413077-190dd305871c?w=1000&auto=format&fit=crop&q=80",
      imageAlt: "Warehouse fulfilment operations",
    },
  ],

  relatedTitle:
    "Adjacent industries, platforms and capabilities we place into retail.",
  related: [
    {
      href: "/industries/finance",
      label: "Banking & Financial Services",
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
      href: "/platforms/blueyonder",
      label: "Blue Yonder",
      category: "Platform",
    },
    {
      href: "/platforms/salesforce",
      label: "Salesforce",
      category: "Platform",
    },
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
      "Retail & Consumer Tech Contractors · UK · ME · India | Yallo Talent",
    description:
      "SAP, Oracle, Blue Yonder and Salesforce contractors for retail programmes. 72h architect-screened shortlists across UK, Middle East and India.",
  },
};
