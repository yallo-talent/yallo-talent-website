import type { L1PageData } from "@/data/l1/types";

/**
 * DevOps & Platform Engineering, seeded 1 Aug 2026.
 *
 * Content from docs/design/context-capabilities-parity-round.md §4.3.
 *
 * JUDGEMENT CALL, LOGGED FOR SUMEET (§4.3). Canon §3 retired ServiceNow as a
 * platform destination and kept it as a role-level capability without naming
 * which discipline owns it. It lands here, under IT service and operations
 * management, on the reasoning that the roles are engineering roles on a platform
 * that automates operations, and the alternative homes are worse: it is not a
 * security discipline, not an integration one, and re-opening it as a platform
 * destination would contradict the canon amendment that removed it. This was taken
 * under delegated authority and is flagged rather than left silent, so Sumeet can
 * reverse it as a canon amendment if he disagrees.
 *
 * IDENTITY HUE. Resolved through `--id-devops-platform-engineering-*` via
 * `data-identity={slug}`. The underlying hue was renamed from `--amb-umber-*` to
 * `--amb-claret-*` by session 1 on the night this file was written; referencing
 * the domain token rather than the hue is what makes that rename invisible here.
 */
export const devopsPlatformEngineeringData: L1PageData = {
  slug: "devops-platform-engineering",
  category: "capabilities",
  breadcrumb: [
    { label: "Capabilities", href: "/capabilities" },
    { label: "DevOps & Platform Engineering" },
  ],

  eyebrow: "DevOps & Platform Engineering · Contract-first",
  title: "DevOps and platform contractors,",
  sectorNoun: "DevOps and platform engineering",
  emphasis: "shortlisted in 72 hours.",
  sub: "Platform engineers, SREs, Kubernetes specialists and release managers for enterprise programmes across the Middle East, Europe and India. Screened on what they have run in production, not on the pipeline they built once.",
  primaryCta: { label: "Send us a brief", href: "/brief" },
  secondaryCta: { label: "View expertise", href: "#expertise" },
  statusDots: [
    "72h brief to shortlist",
    "Active contractor bench",
    "Middle East · Europe · India",
    "Contract · EOR · Managed Delivery",
  ],

  introEyebrow: "Why us for DevOps & Platform Engineering",
  introTitle:
    "A platform team either removes work from delivery teams or becomes a new queue for them.",
  introCopy: [
    "Platform engineering is the discipline with the widest gap between title and capability. The market is full of people who have written a pipeline, and much shorter of people who have operated one for two years, carried a pager for it, and made a self-service platform that delivery teams choose to use rather than are made to use. That second group is what an internal developer platform actually needs.",
    "We screen on operational history rather than tool inventory. What their error budget policy was and whether anyone honoured it, how they handled a rollback of a migration that had already run, what their platform's adoption rate was and why teams routed around it, and what a cluster upgrade cost them the last time they did one under change control.",
  ],
  introStatCards: [
    {
      n: "72%",
      l: "of employers can't find the skilled talent they need — with AI, IT and data roles now the hardest to fill.",
      source: "ManpowerGroup Talent Shortage Survey, 2026",
    },
  ],

  scarceEyebrow: "Scarce talent · high demand",
  scarceTitle:
    "The platform and reliability roles every enterprise programme fights over.",
  scarceCopy:
    "These are the specialists that appear on every platform brief and disappear from the market fastest. Yallo maintains an active bench in each of these areas across the Middle East, Europe and India.",
  scarceCta: { label: "Brief us on a scarce role", href: "/brief" },
  scarceRoles: [
    {
      name: "Platform Architect",
      scarcity: "high",
      engagement: "contract-perm",
    },
    {
      name: "Site Reliability Engineer",
      scarcity: "high",
      engagement: "contract",
    },
    { name: "Kubernetes Engineer", scarcity: "high", engagement: "contract" },
    {
      name: "Infrastructure as Code Engineer",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "Observability Engineer",
      scarcity: "high",
      engagement: "contract",
    },
    { name: "ServiceNow Architect", scarcity: "med", engagement: "contract" },
    { name: "Release Manager", scarcity: "med", engagement: "contract" },
    { name: "FinOps Analyst", scarcity: "med", engagement: "contract-perm" },
  ],

  expertiseEyebrow: "Our expertise",
  expertiseTitle:
    "Every platform discipline, with a contractor bench behind it.",
  expertiseSub:
    "From the commit to the pager, specialists we place into every function that gets software into production and keeps it there.",
  expertise: [
    {
      slug: "ci-cd-engineering",
      num: "01",
      title: "CI/CD Engineering",
      icon: "integration",
      blurb: "GitHub Actions, GitLab CI, Azure DevOps, Jenkins.",
      overview:
        "A pipeline is easy to build and difficult to keep trustworthy. The failure mode is not a broken build, it is a suite that fails often enough that people stop reading it, at which point the pipeline is theatre. We screen for engineers who have owned build times and flake rates as numbers they were accountable for, and who can describe what they deleted rather than only what they added.",
      roles: [
        "DevOps Engineer",
        "Build and Release Engineer",
        "Automation Engineer",
      ],
      tools: [
        {
          slug: "github-actions",
          vendor: "GitHub",
          name: "GitHub Actions",
          roles: [
            "DevOps Engineer",
            "Build and Release Engineer",
            "Platform Engineer",
          ],
        },
        {
          slug: "gitlab-ci",
          vendor: "GitLab",
          name: "GitLab CI",
          roles: ["DevOps Engineer", "Automation Engineer"],
        },
        {
          slug: "azure-devops",
          vendor: "Microsoft",
          name: "Azure DevOps",
          roles: [
            "DevOps Engineer",
            "Release Manager",
            "Build and Release Engineer",
          ],
        },
        {
          slug: "jenkins",
          vendor: "Jenkins",
          name: "Jenkins",
          roles: ["DevOps Engineer", "Build and Release Engineer"],
        },
      ],
    },
    {
      slug: "platform-engineering",
      num: "02",
      title: "Platform Engineering & Internal Developer Platforms",
      icon: "cloud",
      blurb: "Backstage, Crossplane, self-service platforms.",
      overview:
        "An internal developer platform is a product with internal customers, and the reason so many are abandoned is that they were built as infrastructure projects with no product discipline. The specialists worth placing think in terms of adoption, golden paths and the paved road a team takes because it is genuinely easier. We screen for evidence of that: what the platform's users could do without raising a ticket, and what proportion actually did.",
      roles: [
        "Platform Engineer",
        "Platform Architect",
        "Developer Experience Engineer",
      ],
      tools: [
        {
          slug: "backstage",
          vendor: "Backstage",
          name: "Backstage",
          roles: [
            "Platform Engineer",
            "Developer Experience Engineer",
            "Platform Architect",
          ],
        },
        {
          slug: "crossplane",
          vendor: "Crossplane",
          name: "Crossplane",
          roles: ["Platform Engineer", "Platform Architect"],
        },
      ],
    },
    {
      slug: "infrastructure-as-code",
      num: "03",
      title: "Infrastructure as Code",
      icon: "mdm",
      blurb: "Terraform, Pulumi, Ansible, policy as code.",
      overview:
        "Infrastructure as code is where a programme's discipline becomes visible. State management, module design that other teams can consume, drift between what is committed and what is running, and a plan output a reviewer can actually reason about. We screen for people who have inherited someone else's estate and refactored it without an outage, because writing greenfield modules is the easy half of this role.",
      roles: [
        "Infrastructure as Code Engineer",
        "Cloud Platform Engineer",
        "Automation Engineer",
      ],
      tools: [
        {
          slug: "terraform",
          vendor: "HashiCorp",
          name: "Terraform",
          roles: [
            "Infrastructure as Code Engineer",
            "Cloud Platform Engineer",
            "Platform Engineer",
          ],
        },
        {
          slug: "pulumi",
          vendor: "Pulumi",
          name: "Pulumi",
          roles: ["Infrastructure as Code Engineer", "Platform Engineer"],
        },
        {
          slug: "ansible",
          vendor: "Red Hat",
          name: "Ansible",
          roles: ["Automation Engineer", "Infrastructure as Code Engineer"],
        },
        {
          slug: "vault",
          vendor: "HashiCorp",
          name: "HashiCorp Vault",
          roles: ["Platform Engineer", "DevSecOps Engineer"],
        },
      ],
    },
    {
      slug: "kubernetes-container-platforms",
      num: "04",
      title: "Container Platforms & Kubernetes",
      icon: "supply",
      blurb: "Kubernetes, OpenShift, Helm, Argo CD, Flux.",
      overview:
        "Kubernetes experience is claimed far more often than it is held, and the interview question that separates the two is about upgrades rather than deployments. Cluster lifecycle under change control, resource limits set from measurement rather than habit, network policy that someone will have to debug, and a GitOps workflow that survives an urgent fix. We screen for operators, not for people who have deployed a workload onto a managed cluster someone else runs.",
      roles: [
        "Kubernetes Engineer",
        "Platform Engineer",
        "Cloud Platform Engineer",
      ],
      tools: [
        {
          slug: "kubernetes",
          vendor: "Kubernetes",
          name: "Kubernetes",
          roles: [
            "Kubernetes Engineer",
            "Platform Engineer",
            "Site Reliability Engineer",
          ],
        },
        {
          slug: "openshift",
          vendor: "Red Hat",
          name: "OpenShift",
          roles: ["Kubernetes Engineer", "Platform Engineer"],
        },
        {
          slug: "argo-cd",
          vendor: "Argo",
          name: "Argo CD",
          roles: [
            "Kubernetes Engineer",
            "DevOps Engineer",
            "Platform Engineer",
          ],
        },
        {
          slug: "helm",
          vendor: "Helm",
          name: "Helm and Flux",
          roles: ["Kubernetes Engineer", "Platform Engineer"],
        },
      ],
    },
    {
      slug: "observability-sre",
      num: "05",
      title: "Observability & Site Reliability",
      icon: "analytics",
      blurb: "Prometheus, Grafana, Datadog, OpenTelemetry, SLOs.",
      overview:
        "Most estates are monitored and few are observable: dashboards exist, and when something unusual breaks nobody can ask a new question of the data. Reliability engineering is the discipline that closes that, and it is as much about the service level objective conversation with a product owner as about instrumentation. We screen for people who have defined an SLO that was allowed to constrain a release, and who have run a blameless post-incident review that changed something.",
      roles: [
        "Site Reliability Engineer",
        "Observability Engineer",
        "Platform Engineer",
      ],
      tools: [
        {
          slug: "prometheus-grafana",
          vendor: "Prometheus",
          name: "Prometheus and Grafana",
          roles: ["Observability Engineer", "Site Reliability Engineer"],
        },
        {
          slug: "datadog",
          vendor: "Datadog",
          name: "Datadog",
          roles: ["Observability Engineer", "Site Reliability Engineer"],
        },
        {
          slug: "opentelemetry",
          vendor: "OpenTelemetry",
          name: "OpenTelemetry",
          roles: ["Observability Engineer", "Platform Engineer"],
        },
      ],
    },
    {
      slug: "release-engineering",
      num: "06",
      title: "Release Engineering",
      icon: "cases",
      blurb: "Release trains, change control, Copado and Gearset.",
      overview:
        "On packaged platforms the release problem is a metadata and environment problem, which is why generic DevOps engineers struggle on a Salesforce or ERP release train. Branching that maps to sandboxes, deployment of configuration that does not behave like code, and a change process an enterprise change board will accept. We screen for release specialists who have run a train on the platform in question rather than transferred a pipeline pattern to it.",
      roles: [
        "Release Manager",
        "Build and Release Engineer",
        "DevOps Engineer",
      ],
      tools: [
        {
          slug: "copado",
          vendor: "Copado",
          name: "Copado",
          roles: ["Release Manager", "DevOps Engineer"],
        },
        {
          slug: "gearset",
          vendor: "Gearset",
          name: "Gearset",
          roles: ["Release Manager", "Build and Release Engineer"],
        },
      ],
    },
    {
      slug: "itsm-operations",
      num: "07",
      title: "IT Service & Operations Management",
      icon: "workforce",
      blurb: "ServiceNow development, architecture and operations automation.",
      overview:
        "ServiceNow is where operations processes are actually implemented in most large estates, and the roles are engineering roles: platform architecture, integrations to the systems that raise the work, and automation that removes a queue rather than instrumenting it. We screen for people who have built on the platform rather than administered it, and who can tell you which process they automated out of existence.",
      roles: [
        "ServiceNow Developer",
        "ServiceNow Architect",
        "Automation Engineer",
      ],
      tools: [
        {
          slug: "servicenow",
          vendor: "ServiceNow",
          name: "ServiceNow",
          roles: [
            "ServiceNow Developer",
            "ServiceNow Architect",
            "Automation Engineer",
          ],
          /* Canon §3 removed ServiceNow as a platform DESTINATION and kept it as a
             role-level capability. It is named here as a platform we screen
             against, and there is deliberately no /platforms/servicenow link:
             that route 301s to /platforms by design. */
          benchNote:
            "A platform we screen against at role level. ServiceNow is not one of Yallo's platform desks.",
        },
      ],
    },
    {
      slug: "finops",
      num: "08",
      title: "FinOps",
      icon: "finance",
      blurb: "Cloud cost engineering, showback, commitment planning.",
      overview:
        "Cloud cost is an engineering problem that is usually handed to finance, which produces a report nobody can act on. The useful role sits between the two: someone who can read a bill down to the workload, tell an engineering team which architectural decision is generating the spend, and model a commitment without stranding the organisation. We screen for cost reductions they actually delivered and how, not for dashboards they produced.",
      roles: [
        "FinOps Analyst",
        "Cloud Platform Engineer",
        "Platform Architect",
      ],
      tools: [
        {
          slug: "finops-tooling",
          vendor: "FinOps",
          name: "Cloud cost management and showback",
          roles: ["FinOps Analyst", "Cloud Platform Engineer"],
        },
      ],
    },
  ],

  segmentsEyebrow: "Where we deploy",
  segmentsTitle: "Every sector runs a platform team — we staff them all.",
  segmentsSub:
    "A bank's change control, a retailer's peak trading freeze or a telco's scale changes which platform specialist you need. Same screened bench, calibrated to the operating context.",
  segments: [
    {
      id: "finance",
      name: "Banking & Financial Services",
      intro:
        "Regulated change control, resilience requirements and audit-ready pipelines for banking and financial services programmes.",
      roles: [
        "Site Reliability Engineer",
        "Release Manager",
        "Platform Architect",
      ],
    },
    {
      id: "retail",
      name: "Retail & Consumer",
      intro:
        "Peak trading readiness, store estate release management and e-commerce scale for retail programmes.",
      roles: [
        "Site Reliability Engineer",
        "Kubernetes Engineer",
        "Observability Engineer",
      ],
    },
    {
      id: "telco",
      name: "Telco & Media",
      intro:
        "High-volume platforms, network automation and large-scale observability for telco and media programmes.",
      roles: [
        "Platform Engineer",
        "Observability Engineer",
        "Kubernetes Engineer",
      ],
    },
    {
      id: "government",
      name: "Public Sector",
      intro:
        "Cloud landing zones, service reliability and change governance for central and local government programmes.",
      roles: [
        "Cloud Platform Engineer",
        "Infrastructure as Code Engineer",
        "ServiceNow Developer",
      ],
    },
    {
      id: "manufacturing",
      name: "Manufacturing & Logistics",
      intro:
        "Plant-adjacent systems, ERP release trains and operational automation for manufacturing programmes.",
      roles: ["Release Manager", "DevOps Engineer", "Automation Engineer"],
    },
    {
      id: "healthcare",
      name: "Healthcare & Life Sciences",
      intro:
        "Clinical system availability, validated environments and controlled release for healthcare programmes.",
      roles: [
        "Site Reliability Engineer",
        "Release Manager",
        "Platform Engineer",
      ],
    },
  ],

  relatedTitle: "Related pages",
  related: [
    {
      href: "/capabilities/cloud-infrastructure",
      label: "Cloud & Infrastructure",
      category: "Capability",
    },
    {
      href: "/capabilities/cybersecurity",
      label: "Cybersecurity & Risk",
      category: "Capability",
    },
    {
      href: "/capabilities/testing-quality-engineering",
      label: "Testing & Quality Engineering",
      category: "Capability",
    },
    { href: "/ai-talent", label: "AI Talent", category: "Capability" },
    { href: "/platforms/microsoft", label: "Microsoft", category: "Platform" },
    {
      href: "/platforms/salesforce",
      label: "Salesforce",
      category: "Platform",
    },
  ],

  seo: {
    title: "DevOps & Platform Engineering Contractors · Yallo Talent",
    description:
      "Specialist-screened DevOps and platform contractors: Kubernetes, Terraform, SRE, observability, release engineering and FinOps. 72h shortlist across the Middle East, Europe and India.",
  },
};
