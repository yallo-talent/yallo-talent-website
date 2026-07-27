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
    { n: "8", l: "Retail function areas" },
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
  scarceTitle:
    "The roles every retail programme needs — and struggles to find.",
  scarceCopy:
    "These are the specialists that appear on every retail programme brief and disappear from the market fastest. Yallo maintains an active bench in each of these areas across UK, ME and India. When you need one, you don't have six weeks.",
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
    "Eight retail function areas. Contractor bench across all of them.",
  expertiseSub:
    "Click any function to see the contractor roles we deploy and the platforms we staff within it.",
  expertise: [
    {
      slug: "customer-experience",
      num: "01",
      title: "Customer Experience",
      roles: [
        "SAP CX Functional Consultant",
        "SFMC Developer",
        "Oracle Retail CX Consultant",
        "Personalisation Architect",
      ],
      image:
        "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=700&auto=format&fit=crop&q=80",
      imageAlt: "Retail customer experience — flagship store",
    },
    {
      slug: "store-operations",
      num: "02",
      title: "Store Operations",
      roles: [
        "Oracle Retail Consultant",
        "SAP S/4HANA Retail Functional",
        "D365 Commerce Specialist",
        "Store Systems Architect",
      ],
      image:
        "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=700&auto=format&fit=crop&q=80",
      imageAlt: "Retail store operations",
    },
    {
      slug: "merchandising",
      num: "03",
      title: "Merchandising & Planning",
      roles: [
        "Blue Yonder MFP Specialist",
        "Oracle Retail MOM Consultant",
        "SAP MM Functional Lead",
        "Merch Systems Architect",
      ],
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=700&auto=format&fit=crop&q=80",
      imageAlt: "Retail merchandising displays",
    },
    {
      slug: "omnichannel-fulfillment",
      num: "04",
      title: "Omnichannel Fulfillment",
      roles: [
        "OMS Architect",
        "Blue Yonder Fulfillment Lead",
        "SAP OMS Functional",
        "Omnichannel Programme Manager",
      ],
      image:
        "https://images.unsplash.com/photo-1553413077-190dd305871c?w=700&auto=format&fit=crop&q=80",
      imageAlt: "Warehouse fulfillment operations",
    },
    {
      slug: "ecommerce",
      num: "05",
      title: "E-commerce",
      roles: [
        "SAP Commerce Architect",
        "Magento 2 Developer",
        "Shopify Plus Specialist",
        "Digital Experience Lead",
      ],
      image:
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=700&auto=format&fit=crop&q=80",
      imageAlt: "E-commerce operations",
    },
    {
      slug: "loyalty-rewards",
      num: "06",
      title: "Loyalty & Rewards",
      roles: [
        "Oracle Loyalty Cloud Consultant",
        "Salesforce Loyalty Specialist",
        "CRM Programme Manager",
        "Loyalty Platform Architect",
      ],
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=700&auto=format&fit=crop&q=80",
      imageAlt: "Loyalty and rewards programme",
    },
    {
      slug: "point-of-sale",
      num: "07",
      title: "Point of Sale",
      roles: [
        "Oracle Xstore Specialist",
        "SAP Customer Checkout Consultant",
        "D365 POS Developer",
        "NCR Aloha Specialist",
      ],
      image:
        "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=700&auto=format&fit=crop&q=80",
      imageAlt: "Point-of-sale terminal",
    },
    {
      slug: "supply-chain",
      num: "08",
      title: "Supply Chain",
      roles: [
        "Blue Yonder Demand Planner",
        "SAP EWM Consultant",
        "Manhattan WMS Lead",
        "TMS Solution Architect",
      ],
      image:
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=700&auto=format&fit=crop&q=80",
      imageAlt: "Retail supply chain and logistics",
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
      id: "fmcg",
      name: "FMCG (Fast-Moving Consumer Goods)",
      intro:
        "Trade promotion, direct-store-delivery and complex distributor networks. Contractors need SAP CRM/TPM, distribution management and CPG-specific analytics depth.",
      image:
        "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "FMCG production",
      roles: [
        "SAP TPM Consultant",
        "Distribution Management Lead",
        "Route-to-Market Architect",
        "CPG Analytics Lead",
      ],
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
