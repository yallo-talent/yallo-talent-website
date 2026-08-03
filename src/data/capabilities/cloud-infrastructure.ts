import { taxonomyLabels } from "@/data/l1/index";
import type { L1PageData } from "@/data/l1/types";

export const cloudInfrastructureData: L1PageData = {
  slug: "cloud-infrastructure",
  category: "capabilities",
  breadcrumb: [
    { label: "Capabilities", href: "/capabilities" },
    { label: taxonomyLabels("cloud-infrastructure").label },
  ],

  eyebrow: "Cloud & Infrastructure · Contract-first",
  title: "Cloud & Infrastructure contractors,",
  sectorNoun: "cloud and infrastructure",
  emphasis: "shortlisted in 72 hours.",
  sub: "Cloud architects, platform engineers, SREs and DevOps specialists for AWS, Azure and GCP programmes across the Middle East, Europe and India. Specialist-screened for landing-zone depth, FinOps discipline and production resilience — not just certification badges.",
  primaryCta: { label: "Send us a brief", href: "/brief" },
  secondaryCta: { label: "View expertise", href: "#expertise" },
  statusDots: [
    "72h brief to shortlist",
    "Active contractor bench",
    "Middle East · Europe · India",
    "Contract · EOR · Managed Delivery",
  ],

  introEyebrow: "Why us for Cloud & Infrastructure",
  introTitle:
    "Cloud programmes stall when the platform depth isn't in the room.",
  introCopy: [
    "Every AWS landing-zone, every Azure migration, every GCP data platform rollout shares the same failure mode — the outcome depends on the depth of the engineer running the build. Recruiters place tool names. We place production track records.",
    "Our contractor bench is assessed by cloud architects who have shipped landing-zones, hardened Kubernetes clusters and run FinOps at enterprise scale. We screen for the specific operating context — regulated workloads, multi-region resilience, cost governance, zero-trust networking.",
  ],
  /**
   * Both cards deleted, and this is the more serious of the two capability
   * pages. "68%" appears exactly ONCE in the entire repository — here — with no
   * source, no corpus attestation and a real organisation's name attached to
   * it. A figure that cannot be traced is not a figure, and attributing an
   * untraceable one to ManpowerGroup is worse than publishing it bare. The
   * "4–6 wks" card had the same problem as its Data & Analytics twin.
   *
   * Nothing is invented to fill the gap: the section renders without the rail
   * until a sourced figure exists. QUESTIONS.md Q12.
   */
  introStatCards: [],

  scarceEyebrow: "Scarce talent · high demand",
  scarceTitle:
    "The Cloud & Infra roles every enterprise programme fights over.",
  scarceCopy:
    "These are the specialists that appear on every cloud migration and platform brief and disappear from the market fastest. Yallo maintains an active bench in each of these areas across the Middle East, Europe and India.",
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

  platformScarcity: [
    { skill: "GCP", scarcityBand: "scarcest" },
    { skill: "Azure", scarcityBand: "moderate" },
    { skill: "AWS", scarcityBand: "least-scarce" },
    { skill: "DevOps (skill)", scarcityBand: "least-scarce" },
    { skill: "Azure DevOps Services", scarcityBand: "least-scarce" },
  ],

  expertiseEyebrow: "Our expertise",
  expertiseTitle:
    "Every enterprise Cloud & Infrastructure programme, covered function by function.",
  /* THE DISTINCTION LINE, added 2 Aug 2026 per context-round3-rulings.md §5.3.
     This desk and DevOps & Platform Engineering share six sub-desk subjects:
     platform engineering, infrastructure as code, Kubernetes and containers,
     observability, SRE and FinOps. The split by subject is correct and canon
     ratifies both desks. The defect was that a buyer had to infer the split from
     the sub-desk names, which is exactly what the names cannot do when six of
     them match. Stated here, and the mirror of it on the DevOps desk. */
  expertiseSub:
    "This desk staffs the estate itself, from landing-zone to production resilience. The delivery system that runs on top of it is the DevOps & Platform Engineering desk, and the two are usually briefed together.",
  /**
   * S3 parity, applied to the last discipline that lacked it.
   *
   * This file was the only remaining page with `overview` and `tools` empty on
   * every card, which after the other six were done made it the thin one by
   * default. Same rule as Data & Analytics: every product below is one this file's
   * own blurbs already name, or one of the three hyperscalers named in the page's
   * hero and tagline. The structure changed; the claims did not.
   *
   * ON THE OVERLAP WITH DEVOPS & PLATFORM ENGINEERING, which is real and is
   * flagged in the relay rather than resolved here. Platform engineering, SRE,
   * Kubernetes, IaC, observability and FinOps appear as sub-desks on both
   * disciplines. Canon §3 ratifies both, so this is not a defect to fix by
   * deleting one side. The distinction held below is by SUBJECT: here the work is
   * the cloud estate itself (landing zones, networking, migration), there it is
   * the software delivery system that runs on it (pipelines, release trains,
   * developer platforms). Where a role genuinely sits on both, it is written to
   * the estate here and to delivery there rather than duplicated verbatim.
   */
  expertise: [
    {
      slug: "cloud-architecture",
      num: "01",
      title: "Cloud Architecture",
      icon: "cloud",
      blurb: "Landing-zones, multi-account, well-architected reviews.",
      overview:
        "The landing zone is the decision everything else inherits, and it is usually made once, quickly, by whoever is available. Account and subscription topology, network segmentation, identity boundaries and guardrails that hold when a delivery team is under pressure. We screen cloud architects on estates they have had to live with rather than diagrams they have drawn: what they would change about the last landing zone they built, and what it cost to change something structural after workloads had landed on it.",
      roles: [
        "Cloud Architect",
        "Landing-Zone Lead",
        "Well-Architected Reviewer",
      ],
      tools: [
        {
          slug: "aws",
          vendor: "AWS",
          name: "AWS",
          roles: [
            "Cloud Architect",
            "Landing-Zone Lead",
            "Well-Architected Reviewer",
          ],
        },
        {
          slug: "azure",
          vendor: "Microsoft",
          name: "Microsoft Azure",
          roles: ["Cloud Architect", "Landing-Zone Lead", "Cloud Engineer"],
        },
        {
          slug: "gcp",
          vendor: "Google Cloud",
          name: "Google Cloud",
          roles: ["Cloud Architect", "Cloud Engineer"],
        },
      ],
    },
    {
      slug: "platform-engineering",
      num: "02",
      title: "Platform Engineering",
      icon: "integration",
      blurb: "Internal developer platforms, golden paths, Backstage.",
      twin: [
        {
          href: "/capabilities/devops-platform-engineering/platform-engineering",
          label: "Platform Engineering & Internal Developer Platforms",
          note: "The same subject from the delivery side: the platform as the thing delivery teams ship through, rather than as the estate they self-serve from.",
        },
      ],
      overview:
        "Here the platform is the cloud estate presented as something a delivery team can safely self-serve: an account vended with guardrails already on, a paved path to a compliant workload, and a catalogue that reflects what actually exists. The failure is a platform that adds a request queue where there used to be a ticket. We screen for what a team could do without asking permission, and for how the platform handled the case it did not anticipate.",
      roles: ["Platform Engineer", "IDP Architect", "Backstage Lead"],
      tools: [
        {
          slug: "backstage",
          vendor: "Backstage",
          name: "Backstage",
          roles: ["Backstage Lead", "IDP Architect", "Platform Engineer"],
        },
        {
          slug: "crossplane",
          vendor: "Crossplane",
          name: "Crossplane",
          roles: ["Platform Engineer", "IDP Architect"],
        },
      ],
    },
    {
      slug: "sre-reliability",
      num: "03",
      title: "SRE & Reliability",
      icon: "spark",
      blurb: "SLOs, error budgets, incident response and chaos.",
      twin: [
        {
          href: "/capabilities/devops-platform-engineering/observability-sre",
          label: "Observability & Site Reliability",
          note: "DevOps runs observability and reliability as one desk where this side runs them as two. Brief there if the reliability work sits on the delivery system rather than on the estate.",
        },
      ],
      overview:
        "Reliability engineering is mostly an organisational discipline wearing a technical title. Anyone can define a service level objective; the question is whether it was ever allowed to stop a release, and whether an incident review changed a system rather than producing an action log. We screen on incidents actually commanded, on an error budget policy someone honoured under pressure, and on failure testing run against something that mattered.",
      roles: ["Principal SRE", "Reliability Engineer", "Incident Commander"],
      tools: [
        {
          slug: "sre-practice",
          vendor: "Reliability",
          name: "SLOs, error budgets and incident command",
          roles: [
            "Principal SRE",
            "Incident Commander",
            "Reliability Engineer",
          ],
        },
      ],
    },
    {
      slug: "kubernetes-containers",
      num: "04",
      title: "Kubernetes & Containers",
      icon: "cloud",
      blurb: "EKS, AKS, GKE, service mesh and workload security.",
      twin: [
        {
          href: "/capabilities/devops-platform-engineering/kubernetes-container-platforms",
          label: "Container Platforms & Kubernetes",
          note: "The same clusters from the delivery side: OpenShift, Argo CD and Helm, where here the subject is the managed cluster and its lifecycle.",
        },
      ],
      overview:
        "The interview question that separates claimed Kubernetes experience from held Kubernetes experience is about upgrades, not deployments. Cluster lifecycle under change control, resource limits set from measurement, network policy someone will have to debug at speed, and a service mesh whose failure modes the team understands. We screen for operators of managed clusters in production, not for engineers who have shipped a workload onto one somebody else runs.",
      roles: [
        "Kubernetes Platform Engineer",
        "Service Mesh Architect",
        "Container Security Lead",
      ],
      tools: [
        {
          slug: "eks",
          vendor: "AWS",
          name: "Amazon EKS",
          roles: ["Kubernetes Platform Engineer", "Cloud Engineer"],
        },
        {
          slug: "aks",
          vendor: "Microsoft",
          name: "Azure Kubernetes Service",
          roles: ["Kubernetes Platform Engineer", "Platform Engineer"],
        },
        {
          slug: "gke",
          vendor: "Google Cloud",
          name: "Google Kubernetes Engine",
          roles: ["Kubernetes Platform Engineer"],
        },
      ],
    },
    {
      slug: "iac-automation",
      num: "05",
      title: "IaC & Automation",
      icon: "integration",
      blurb: "Terraform, Pulumi, Crossplane, policy-as-code.",
      twin: [
        {
          href: "/capabilities/devops-platform-engineering/infrastructure-as-code",
          label: "Infrastructure as Code",
          note: "The same tools inside the delivery system, including Ansible and Vault. Here the subject is the estate the code describes.",
        },
      ],
      overview:
        "Infrastructure as code is where an estate's discipline becomes legible. State management that survives more than one team, modules other people can consume without reading the source, drift between what is committed and what is running, and a plan output a reviewer can reason about at four in the afternoon. We screen for people who have inherited an estate and refactored it without an outage, because greenfield modules are the easy half.",
      roles: ["Terraform Lead", "Pulumi Engineer", "Policy-as-Code Architect"],
      tools: [
        {
          slug: "terraform",
          vendor: "HashiCorp",
          name: "Terraform",
          roles: ["Terraform Lead", "Cloud Engineer", "Platform Engineer"],
        },
        {
          slug: "pulumi",
          vendor: "Pulumi",
          name: "Pulumi",
          roles: ["Pulumi Engineer", "Platform Engineer"],
        },
        {
          slug: "policy-as-code",
          vendor: "Policy as code",
          name: "Policy-as-code guardrails",
          roles: ["Policy-as-Code Architect", "Cloud Security Architect"],
        },
      ],
    },
    {
      slug: "cloud-security",
      num: "06",
      title: "Cloud Security",
      icon: "security",
      blurb: "CSPM, CNAPP, IAM hardening and workload identity.",
      overview:
        "Cloud security is a configuration and identity problem wearing a network security costume, which is why hires from a traditional infrastructure security background often struggle with it. Posture management that produces a fixable backlog rather than a dashboard, workload identity that removes long-lived keys, and permissions narrowed without breaking a deployment. We screen for people who have reduced a real posture backlog and can say what they chose not to fix.",
      roles: ["Cloud Security Architect", "IAM Engineer", "CSPM Consultant"],
      tools: [
        {
          slug: "cspm-cnapp",
          vendor: "Cloud posture",
          name: "CSPM and CNAPP tooling",
          roles: ["CSPM Consultant", "Cloud Security Architect"],
        },
        {
          slug: "workload-identity",
          vendor: "Identity",
          name: "Workload identity and IAM hardening",
          roles: ["IAM Engineer", "Cloud Security Architect"],
        },
      ],
    },
    {
      slug: "networking",
      num: "07",
      title: "Cloud Networking",
      icon: "integration",
      blurb: "Transit gateways, zero-trust, private connectivity.",
      overview:
        "Cloud networking is the scarcest skill on this desk and the least visible until it fails. Hub-and-spoke topology that will still make sense at three times the account count, private connectivity back to a data centre nobody has decommissioned, DNS that resolves consistently across both, and a zero-trust position that is enforced rather than described. We screen for people who have debugged asymmetric routing across a hybrid estate, because that is the day the role is worth its rate.",
      roles: [
        "Cloud Network Architect",
        "Zero-Trust Engineer",
        "Connectivity Lead",
      ],
      tools: [
        {
          slug: "hybrid-connectivity",
          vendor: "Connectivity",
          name: "Transit gateways and private connectivity",
          roles: ["Cloud Network Architect", "Connectivity Lead"],
        },
        {
          slug: "zero-trust",
          vendor: "Zero trust",
          name: "Zero-trust network access",
          roles: ["Zero-Trust Engineer", "Cloud Network Architect"],
        },
      ],
    },
    {
      slug: "finops",
      num: "08",
      title: "FinOps & Cost",
      icon: "finance",
      blurb: "Unit economics, tagging, showback and rate optimisation.",
      twin: [
        {
          href: "/capabilities/devops-platform-engineering/finops",
          label: "FinOps",
          note: "Cost engineering inside the delivery system, including commitment planning. Here the subject is the estate's unit economics and its rate structure.",
        },
      ],
      overview:
        "Cloud cost is an engineering problem routinely handed to finance, which produces a report nobody can act on. The role that works sits between the two: someone who can read a bill down to the workload, tell an engineering team which architectural decision generates the spend, and model a commitment without stranding the organisation on it. We screen on reductions actually delivered and how, not on dashboards produced.",
      roles: ["FinOps Practitioner", "Cloud Economist", "Cost Governance Lead"],
      tools: [
        {
          slug: "cost-management",
          vendor: "FinOps",
          name: "Tagging, showback and rate optimisation",
          roles: [
            "FinOps Practitioner",
            "Cloud Economist",
            "Cost Governance Lead",
          ],
        },
      ],
    },
    {
      slug: "observability",
      num: "09",
      title: "Observability",
      icon: "analytics",
      blurb: "OpenTelemetry, Datadog, Grafana, log/metric/trace pipelines.",
      twin: [
        {
          href: "/capabilities/devops-platform-engineering/observability-sre",
          label: "Observability & Site Reliability",
          note: "The same instrumentation held together with reliability on the DevOps desk. Brief there when what you are watching is the delivery system rather than the estate.",
        },
      ],
      overview:
        "Most estates are monitored and few are observable: the dashboards exist, and when something unfamiliar breaks nobody can ask a new question of the data. The work is instrumentation that outlives the team that wrote it, cardinality controlled before the bill notices, and traces that actually cross a service boundary. We screen for engineers who have cut an observability bill without losing the signal, which is the test of whether they understood what they were collecting.",
      roles: [
        "Observability Platform Lead",
        "OpenTelemetry Engineer",
        "Monitoring Architect",
      ],
      tools: [
        {
          slug: "opentelemetry",
          vendor: "OpenTelemetry",
          name: "OpenTelemetry",
          roles: ["OpenTelemetry Engineer", "Observability Platform Lead"],
        },
        {
          slug: "datadog",
          vendor: "Datadog",
          name: "Datadog",
          roles: ["Observability Platform Lead", "Monitoring Architect"],
        },
        {
          slug: "grafana",
          vendor: "Grafana",
          name: "Grafana",
          roles: ["Monitoring Architect", "Observability Platform Lead"],
        },
      ],
    },
    {
      slug: "migration-modernisation",
      num: "10",
      title: "Migration & Modernisation",
      icon: "cloud",
      blurb: "6R strategy, cutover planning, legacy modernisation.",
      overview:
        "Migration is where an estate's undocumented dependencies present themselves, usually during the cutover rehearsal. The valuable people are the ones who treat discovery as the deliverable and the move as the consequence: an application that nobody owns, a batch window nothing may cross, a database whose licensing changes the target, and a rollback plan that has been executed rather than written. We screen on cutovers run and reversed, not on wave plans produced.",
      roles: [
        "Migration Architect",
        "Modernisation Lead",
        "Cutover Programme Engineer",
      ],
      tools: [
        {
          slug: "migration-strategy",
          vendor: "Migration",
          name: "6R assessment and cutover planning",
          roles: [
            "Migration Architect",
            "Cutover Programme Engineer",
            "Modernisation Lead",
          ],
        },
      ],
    },
  ],

  segmentsEyebrow: "Where we deploy",
  segmentsTitle: "Every sector runs a cloud programme — we staff them all.",
  segmentsSub:
    "Retail resilience, banking landing-zones, healthcare compliant clouds or public-sector modernisation — same specialist-screened bench, calibrated to your operating context.",
  segments: [
    {
      id: "retail",
      name: taxonomyLabels("retail").label,
      intro:
        "Peak-trading resilience, omnichannel platform reliability and store-network cloud connectivity for retail programmes.",
      roles: [
        "Peak-Trading SRE",
        "Omnichannel Platform Engineer",
        "Store Network Cloud Lead",
      ],
    },
    {
      id: "manufacturing",
      name: taxonomyLabels("manufacturing").label,
      intro:
        "Edge-to-cloud pipelines, factory-floor connectivity and IIoT platform engineering for manufacturing programmes.",
      roles: [
        "Edge-to-Cloud Architect",
        "IIoT Platform Engineer",
        "Factory Connectivity Lead",
      ],
    },
    {
      id: "finance",
      name: taxonomyLabels("finance").label,
      intro:
        "Regulated landing-zones, ring-fenced workloads, DORA-aligned resilience and cloud controls for financial services programmes.",
      roles: [
        "Regulated Landing-Zone Architect",
        "DORA Resilience Engineer",
        "Cloud Controls Lead",
      ],
    },
    {
      id: "government",
      name: taxonomyLabels("government").label,
      intro:
        "Sovereign cloud landing-zones, assurance-aligned platforms and legacy modernisation for central and local government.",
      roles: [
        "Sovereign Cloud Architect",
        "Assurance Platform Lead",
        "Legacy Modernisation Engineer",
      ],
    },
    {
      id: "healthcare",
      name: taxonomyLabels("healthcare").label,
      intro:
        "HIPAA and NHS-aligned cloud environments, clinical workload security and disaster-recovery engineering for healthcare programmes.",
      roles: ["HIPAA Cloud Architect", "Clinical Workload SRE", "DR Engineer"],
    },
    {
      id: "telco",
      name: taxonomyLabels("telco").label,
      intro:
        "Carrier-grade cloud, 5G edge platforms and content-delivery infrastructure for telco and media programmes.",
      roles: [
        "Carrier-Grade Cloud Architect",
        "5G Edge Platform Engineer",
        "CDN Infrastructure Lead",
      ],
    },
    {
      id: "education",
      name: taxonomyLabels("education").label,
      intro:
        "Campus and research computing estates, multi-campus landing zones and the term-start load peak for university and school-group programmes.",
      roles: [
        "Cloud Landing-Zone Architect",
        "Campus Network Engineer",
        "Principal SRE",
      ],
    },
  ],

  insightsEyebrow: "Insights",
  insightsTitle: "What's happening in Cloud & Infrastructure talent right now.",
  insightsSub: "Opinionated, specific, useful.",
  insights: [
    {
      href: "/insights/landing-zone-first-hire",
      published: false,
      category: "Cloud",
      title: "The landing-zone architect is your first hire, not your last.",
      excerpt:
        "The pattern repeats across every migration: teams stand up workloads before the landing-zone is stable. Here's how the shipping programmes sequence the bench.",
      author: "Yallo Talent",
      minutes: 6,
    },
    {
      href: "/insights/finops-when-to-hire",
      published: false,
      category: "FinOps",
      title: "When to hire your first FinOps practitioner.",
      excerpt:
        "Before your monthly cloud bill has a comma, not after. What we've seen across the Middle East, Europe and India cloud programmes when cost governance is treated as an afterthought.",
      author: "Yallo Talent",
      minutes: 7,
    },
    {
      href: "/insights/kubernetes-platform-team",
      published: false,
      category: "Kubernetes",
      title: "Why every Kubernetes platform team of five is really seven.",
      excerpt:
        "The two roles teams forget to hire — and the production incidents that show up six months later. Notes from a decade of platform builds.",
      author: "Yallo Talent",
      minutes: 8,
    },
    {
      href: "/insights/sre-in-regulated-clouds",
      published: false,
      category: "SRE",
      title: "SRE inside a regulated cloud — the parts nobody documents.",
      excerpt:
        "Error budgets, incident review and change control when auditors, not just PagerDuty, are watching. How enterprise SREs adapt.",
      author: "Yallo Talent",
      minutes: 5,
    },
  ],

  relatedTitle: "Related pages",
  related: [
    {
      href: "/capabilities/data-analytics",
      label: taxonomyLabels("data-analytics").label,
      category: "Capability",
    },
    {
      href: "/capabilities/devops-platform-engineering",
      label: taxonomyLabels("devops-platform-engineering").label,
      category: "Capability",
    },
    {
      href: "/capabilities/integration-middleware",
      label: taxonomyLabels("integration-middleware").label,
      category: "Capability",
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
      href: "/platforms/salesforce",
      label: taxonomyLabels("salesforce").label,
      category: "Platform",
    },
    {
      href: "/industries/finance",
      label: taxonomyLabels("finance").label,
      category: "Industry",
    },
    {
      href: "/industries/retail",
      label: taxonomyLabels("retail").label,
      category: "Industry",
    },
  ],

  seo: {
    title: "Cloud & Infrastructure Contractors · Yallo Talent",
    description:
      "Specialist-screened Cloud & Infrastructure contractors — landing-zones, Kubernetes, SRE, FinOps, cloud security. 72h shortlist across the Middle East, Europe and India.",
  },
};
