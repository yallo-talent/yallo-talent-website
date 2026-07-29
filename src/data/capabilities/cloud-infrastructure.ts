import type { L1PageData } from "@/data/l1/types";

export const cloudInfrastructureData: L1PageData = {
  slug: "cloud-infrastructure",
  category: "capabilities",
  hue: "teal",
  breadcrumb: [
    { label: "Capabilities", href: "/capabilities" },
    { label: "Cloud & Infrastructure" },
  ],

  eyebrow: "Cloud & Infrastructure · Contract-first",
  title: "Cloud & Infrastructure contractors,",
  emphasis: "shortlisted in 72 hours.",
  sub: "Cloud architects, platform engineers, SREs and DevOps specialists for AWS, Azure and GCP programmes across UK, ME and India. Architect-screened for landing-zone depth, FinOps discipline and production resilience — not just certification badges.",
  heroImage:
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=2000&auto=format&fit=crop&q=80",
  heroImageAlt: "Cloud data centre server racks with network cabling",
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
    { n: "10", l: "Cloud & Infra function areas" },
    { n: "3", l: "Active delivery markets" },
  ],

  introEyebrow: "Why Yallo for Cloud & Infrastructure",
  introTitle:
    "Cloud programmes stall when the platform depth isn't in the room.",
  introCopy: [
    "Every AWS landing-zone, every Azure migration, every GCP data platform rollout shares the same failure mode — the outcome depends on the depth of the engineer running the build. Recruiters place tool names. We place production track records.",
    "Our contractor bench is assessed by cloud architects who have shipped landing-zones, hardened Kubernetes clusters and run FinOps at enterprise scale. We screen for the specific operating context — regulated workloads, multi-region resilience, cost governance, zero-trust networking — not just certification badges.",
  ],
  introStatCards: [
    {
      n: "68%",
      l: "of enterprises report a shortage of cloud and platform engineers — the second-hardest talent gap after AI. (ManpowerGroup, 2026)",
    },
    {
      n: "4–6 wks",
      l: "Average time lost when a cloud architect is placed without production landing-zone experience. Yallo's shortlist is in your inbox in 72h.",
    },
  ],

  scarceEyebrow: "Scarce talent · high demand",
  scarceTitle:
    "The Cloud & Infra roles every enterprise programme fights over.",
  scarceCopy:
    "These are the specialists that appear on every cloud migration and platform brief and disappear from the market fastest. Yallo maintains an active bench in each of these areas across UK, ME and India.",
  scarceCta: { label: "Brief us on a scarce role", href: "/brief" },
  scarceRoles: [
    {
      name: "Cloud Landing-Zone Architect (AWS / Azure)",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "Kubernetes Platform Engineer",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "Principal SRE",
      scarcity: "high",
      engagement: "contract-perm",
    },
    {
      name: "FinOps Practitioner Lead",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "Zero-Trust Network Architect",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "Terraform / IaC Lead",
      scarcity: "high",
      engagement: "contract-perm",
    },
    {
      name: "Cloud Security Architect (CSPM / CNAPP)",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "Observability Platform Lead (OpenTelemetry / Datadog)",
      scarcity: "med",
      engagement: "contract",
    },
  ],

  expertiseEyebrow: "Our expertise",
  expertiseTitle:
    "Ten function areas — every enterprise Cloud & Infrastructure programme covered.",
  expertiseSub:
    "From landing-zone to production resilience — specialists we place into every function that moves a cloud programme forward.",
  expertise: [
    {
      slug: "cloud-architecture",
      num: "01",
      title: "Cloud Architecture",
      icon: "cloud",
      blurb: "Landing-zones, multi-account, well-architected reviews.",
      roles: [
        "Cloud Architect",
        "Landing-Zone Lead",
        "Well-Architected Reviewer",
      ],
    },
    {
      slug: "platform-engineering",
      num: "02",
      title: "Platform Engineering",
      icon: "integration",
      blurb: "Internal developer platforms, golden paths, Backstage.",
      roles: ["Platform Engineer", "IDP Architect", "Backstage Lead"],
    },
    {
      slug: "sre-reliability",
      num: "03",
      title: "SRE & Reliability",
      icon: "spark",
      blurb: "SLOs, error budgets, incident response and chaos.",
      roles: ["Principal SRE", "Reliability Engineer", "Incident Commander"],
    },
    {
      slug: "kubernetes-containers",
      num: "04",
      title: "Kubernetes & Containers",
      icon: "cloud",
      blurb: "EKS, AKS, GKE, service mesh and workload security.",
      roles: [
        "Kubernetes Platform Engineer",
        "Service Mesh Architect",
        "Container Security Lead",
      ],
    },
    {
      slug: "iac-automation",
      num: "05",
      title: "IaC & Automation",
      icon: "integration",
      blurb: "Terraform, Pulumi, Crossplane, policy-as-code.",
      roles: ["Terraform Lead", "Pulumi Engineer", "Policy-as-Code Architect"],
    },
    {
      slug: "cloud-security",
      num: "06",
      title: "Cloud Security",
      icon: "security",
      blurb: "CSPM, CNAPP, IAM hardening and workload identity.",
      roles: ["Cloud Security Architect", "IAM Engineer", "CSPM Consultant"],
    },
    {
      slug: "networking",
      num: "07",
      title: "Cloud Networking",
      icon: "integration",
      blurb: "Transit gateways, zero-trust, private connectivity.",
      roles: [
        "Cloud Network Architect",
        "Zero-Trust Engineer",
        "Connectivity Lead",
      ],
    },
    {
      slug: "finops",
      num: "08",
      title: "FinOps & Cost",
      icon: "finance",
      blurb: "Unit economics, tagging, showback and rate optimisation.",
      roles: ["FinOps Practitioner", "Cloud Economist", "Cost Governance Lead"],
    },
    {
      slug: "observability",
      num: "09",
      title: "Observability",
      icon: "analytics",
      blurb: "OpenTelemetry, Datadog, Grafana, log/metric/trace pipelines.",
      roles: [
        "Observability Platform Lead",
        "OpenTelemetry Engineer",
        "Monitoring Architect",
      ],
    },
    {
      slug: "migration-modernisation",
      num: "10",
      title: "Migration & Modernisation",
      icon: "cloud",
      blurb: "6R strategy, cutover planning, legacy modernisation.",
      roles: [
        "Migration Architect",
        "Modernisation Lead",
        "Cutover Programme Engineer",
      ],
    },
  ],

  segmentsEyebrow: "Where we deploy",
  segmentsTitle: "Every sector runs a cloud programme — we staff them all.",
  segmentsSub:
    "Retail resilience, banking landing-zones, healthcare compliant clouds or public-sector modernisation — same architect-screened bench, calibrated to your operating context.",
  segments: [
    {
      id: "retail",
      name: "Retail & Consumer",
      intro:
        "Peak-trading resilience, omnichannel platform reliability and store-network cloud connectivity for retail programmes.",
      image:
        "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Retail store interior",
      roles: [
        "Peak-Trading SRE",
        "Omnichannel Platform Engineer",
        "Store Network Cloud Lead",
      ],
    },
    {
      id: "finance",
      name: "Banking & Financial Services",
      intro:
        "Regulated landing-zones, ring-fenced workloads, DORA-aligned resilience and cloud controls for financial services programmes.",
      image:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Financial trading floor",
      roles: [
        "Regulated Landing-Zone Architect",
        "DORA Resilience Engineer",
        "Cloud Controls Lead",
      ],
    },
    {
      id: "healthcare",
      name: "Healthcare & Life Sciences",
      intro:
        "HIPAA and NHS-aligned cloud environments, clinical workload security and disaster-recovery engineering for healthcare programmes.",
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Healthcare analytics dashboard",
      roles: ["HIPAA Cloud Architect", "Clinical Workload SRE", "DR Engineer"],
    },
    {
      id: "government",
      name: "Public Sector",
      intro:
        "Sovereign cloud landing-zones, assurance-aligned platforms and legacy modernisation for central and local government.",
      image:
        "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Government building",
      roles: [
        "Sovereign Cloud Architect",
        "Assurance Platform Lead",
        "Legacy Modernisation Engineer",
      ],
    },
    {
      id: "manufacturing",
      name: "Manufacturing & Logistics",
      intro:
        "Edge-to-cloud pipelines, factory-floor connectivity and IIoT platform engineering for manufacturing programmes.",
      image:
        "https://images.unsplash.com/photo-1565034946487-077786996e27?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Manufacturing factory floor",
      roles: [
        "Edge-to-Cloud Architect",
        "IIoT Platform Engineer",
        "Factory Connectivity Lead",
      ],
    },
    {
      id: "telco",
      name: "Telco & Media",
      intro:
        "Carrier-grade cloud, 5G edge platforms and content-delivery infrastructure for telco and media programmes.",
      image:
        "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Telecom network infrastructure",
      roles: [
        "Carrier-Grade Cloud Architect",
        "5G Edge Platform Engineer",
        "CDN Infrastructure Lead",
      ],
    },
  ],

  insightsEyebrow: "Insights",
  insightsTitle: "What's happening in Cloud & Infrastructure talent right now.",
  insightsSub:
    "Written by Sumeet Goenka and the Yallo team. Opinionated, specific, useful.",
  insights: [
    {
      href: "/insights/landing-zone-first-hire",
      published: false,
      category: "Cloud",
      title: "The landing-zone architect is your first hire, not your last.",
      excerpt:
        "The pattern repeats across every migration: teams stand up workloads before the landing-zone is stable. Here's how the shipping programmes sequence the bench.",
      author: "Sumeet Goenka",
      minutes: 6,
      image:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Cloud infrastructure abstract",
    },
    {
      href: "/insights/finops-when-to-hire",
      published: false,
      category: "FinOps",
      title: "When to hire your first FinOps practitioner.",
      excerpt:
        "Before your monthly cloud bill has a comma, not after. What we've seen across UK and ME cloud programmes when cost governance is treated as an afterthought.",
      author: "Sumeet Goenka",
      minutes: 7,
      image:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Cost dashboard analytics",
    },
    {
      href: "/insights/kubernetes-platform-team",
      published: false,
      category: "Kubernetes",
      title: "Why every Kubernetes platform team of five is really seven.",
      excerpt:
        "The two roles teams forget to hire — and the production incidents that show up six months later. Notes from a decade of platform builds.",
      author: "Sumeet Goenka",
      minutes: 8,
      image:
        "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "Kubernetes cluster visualisation",
    },
    {
      href: "/insights/sre-in-regulated-clouds",
      published: false,
      category: "SRE",
      title: "SRE inside a regulated cloud — the parts nobody documents.",
      excerpt:
        "Error budgets, incident review and change control when auditors, not just PagerDuty, are watching. How enterprise SREs adapt.",
      author: "Yallo Research",
      minutes: 5,
      image:
        "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=1200&auto=format&fit=crop&q=80",
      imageAlt: "SRE engineer at workstation",
    },
  ],

  partners: [
    "AWS",
    "Microsoft Azure",
    "Google Cloud",
    "HashiCorp",
    "Kubernetes",
    "Datadog",
    "Grafana Labs",
    "CrowdStrike",
  ],

  relatedTitle: "Related pages",
  related: [
    {
      href: "/capabilities/data-ai",
      label: "Data & AI",
      category: "Capability",
    },
    {
      href: "/capabilities/digital-devops",
      label: "Digital & DevOps",
      category: "Capability",
    },
    {
      href: "/capabilities/integration-middleware",
      label: "Integration & Middleware",
      category: "Capability",
    },
    { href: "/platforms/sap", label: "SAP", category: "Platform" },
    { href: "/platforms/oracle", label: "Oracle", category: "Platform" },
    {
      href: "/platforms/salesforce",
      label: "Salesforce",
      category: "Platform",
    },
    {
      href: "/industries/finance",
      label: "Banking & Financial Services",
      category: "Industry",
    },
    {
      href: "/industries/retail",
      label: "Retail & Consumer",
      category: "Industry",
    },
  ],

  seo: {
    title: "Cloud & Infrastructure Contractors · Yallo Talent",
    description:
      "Architect-screened Cloud & Infrastructure contractors — landing-zones, Kubernetes, SRE, FinOps, cloud security. 72h shortlist across UK, ME and India.",
  },
};
