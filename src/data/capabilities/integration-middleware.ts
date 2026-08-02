import { taxonomyLabels } from "@/data/l1/index";
import type { L1PageData } from "@/data/l1/types";

/**
 * Integration & Middleware, seeded 1 Aug 2026.
 *
 * Content from docs/design/context-capabilities-parity-round.md §4.2. Sub-desks,
 * role titles and screened stacks are all ratified there; nothing is invented.
 *
 * IDENTITY HUE. This discipline's ambient hue resolves through
 * `--id-integration-middleware-*`, which the page gets automatically from
 * `data-identity={slug}` in L1PageShell. The domain-level token is deliberately
 * the only reference: session 1 renamed the underlying hue from `--amb-moss-*` to
 * `--amb-harbour-*` on the same night this file was written, and a raw hue
 * reference here would have broken. Never name the hue, name the domain.
 */
export const integrationMiddlewareData: L1PageData = {
  slug: "integration-middleware",
  category: "capabilities",
  breadcrumb: [
    { label: "Capabilities", href: "/capabilities" },
    { label: taxonomyLabels("integration-middleware").label },
  ],

  eyebrow: "Integration & Middleware · Contract-first",
  title: "Integration contractors,",
  sectorNoun: "integration",
  emphasis: "shortlisted in 72 hours.",
  sub: "Integration architects, API engineers, iPaaS developers and event streaming specialists for enterprise programmes across the Middle East, Europe and India. Screened on the interface that has to work on cutover weekend, not on the diagram.",
  primaryCta: { label: "Send us a brief", href: "/brief" },
  secondaryCta: { label: "View expertise", href: "#expertise" },
  statusDots: [
    "72h brief to shortlist",
    "Active contractor bench",
    "Middle East · Europe · India",
    "Contract · EOR · Managed Delivery",
  ],

  introEyebrow: "Why us for Integration & Middleware",
  introTitle:
    "Integration is where the other six workstreams find out whether they agreed on anything.",
  introCopy: [
    "Integration is scoped as plumbing and discovered late as the critical path. Every platform programme has the same moment: two teams built to the same interface specification, read it differently, and nobody found out until system test. The people who prevent that are not the ones who know a product, they are the ones who ask which system owns the record before anyone opens a mapping document.",
    "We screen integration specialists on the awkward parts. Error handling and replay when a downstream system is unavailable for a day, idempotency on a message that will arrive twice, contract versioning when a consumer cannot upgrade, and what they did the last time a cutover had to be reversed with interfaces half-migrated.",
  ],
  introStatCards: [
    {
      n: "72%",
      l: "of employers can't find the skilled talent they need — with AI, IT and data roles now the hardest to fill.",
      source: "ManpowerGroup Talent Shortage Survey, 2026",
    },
  ],

  scarceEyebrow: "Scarce talent · high demand",
  scarceTitle: "The integration roles every enterprise programme fights over.",
  scarceCopy:
    "These are the specialists that appear on every integration brief and disappear from the market fastest. Yallo maintains an active bench in each of these areas across the Middle East, Europe and India.",
  scarceCta: { label: "Brief us on a scarce role", href: "/brief" },
  scarceRoles: [
    {
      name: "Integration Architect",
      scarcity: "high",
      engagement: "contract-perm",
    },
    { name: "MuleSoft Architect", scarcity: "high", engagement: "contract" },
    {
      name: "Event Streaming Architect",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "SAP Integration Suite Developer",
      scarcity: "high",
      engagement: "contract",
    },
    { name: "Kafka Engineer", scarcity: "high", engagement: "contract" },
    { name: "API Architect", scarcity: "med", engagement: "contract-perm" },
    { name: "Boomi Developer", scarcity: "med", engagement: "contract" },
    { name: "EDI and B2B Analyst", scarcity: "med", engagement: "contract" },
  ],

  expertiseEyebrow: "Our expertise",
  expertiseTitle:
    "Every integration discipline, with a contractor bench behind it.",
  expertiseSub:
    "From the API a partner consumes to the ESB nobody wants to touch, specialists we place into every function that connects an enterprise estate.",
  expertise: [
    {
      slug: "integration-architecture",
      num: "01",
      title: "Integration Architecture & Governance",
      icon: "integration",
      blurb: "Patterns, standards, interface ownership and governance.",
      overview:
        "The architect on an integration workstream is doing governance as much as design, and the governance is the part that fails. Which system is master for a given record, what the canonical model is and who is allowed to break it, whether a point-to-point interface is permitted this once. We screen for people who have held that line on a live programme and can describe an interface they refused, because an integration architect who has never said no has not been tested.",
      roles: [
        "Integration Architect",
        "API Architect",
        "Middleware Administrator",
      ],
      tools: [
        {
          slug: "mulesoft-anypoint",
          vendor: "MuleSoft",
          name: "MuleSoft Anypoint Platform",
          roles: [
            "Integration Architect",
            "MuleSoft Architect",
            "MuleSoft Developer",
          ],
        },
        {
          slug: "camunda",
          vendor: "Camunda",
          name: "Camunda",
          roles: ["Integration Architect", "Process Automation Developer"],
        },
      ],
    },
    {
      slug: "api-management",
      num: "02",
      title: "API Management & Gateways",
      icon: "crm",
      blurb: "Gateways, API products, security and developer experience.",
      overview:
        "An API programme is a product problem that presents as a gateway procurement. The gateway is straightforward; the difficult parts are versioning without breaking a consumer you do not control, a security model that does not become a bespoke exception per partner, and enough developer experience that internal teams use the API rather than going round it. We screen for people who have run APIs as products with real external consumers, and for API security engineers who understand authorisation rather than only authentication.",
      roles: [
        "APIM Engineer",
        "API Product Manager",
        "API Security Engineer",
        "API Architect",
      ],
      tools: [
        {
          slug: "apigee",
          vendor: "Google Cloud",
          name: "Apigee",
          roles: ["APIM Engineer", "API Architect", "API Security Engineer"],
        },
        {
          slug: "kong",
          vendor: "Kong",
          name: "Kong",
          roles: ["APIM Engineer", "API Architect"],
        },
        {
          slug: "azure-apim",
          vendor: "Microsoft",
          name: "Azure API Management",
          roles: ["APIM Engineer", "Azure Integration Developer"],
        },
      ],
    },
    {
      slug: "ipaas-cloud-integration",
      num: "03",
      title: "iPaaS & Cloud Integration",
      icon: "cloud",
      blurb: "Boomi, Workato, Azure and platform-native integration.",
      overview:
        "iPaaS moved integration work closer to the business, which solved a delivery bottleneck and created a governance one: hundreds of low-code integrations, no test coverage and no inventory. We screen iPaaS developers on operational discipline as much as build speed, because the ones worth placing treat a low-code integration as production software with error handling, monitoring and a rollback path rather than as a configuration exercise.",
      roles: [
        "Boomi Developer",
        "Azure Integration Developer",
        "Oracle Integration Cloud Developer",
      ],
      tools: [
        {
          slug: "boomi",
          vendor: "Boomi",
          name: "Boomi",
          roles: ["Boomi Developer", "Integration Architect"],
        },
        {
          slug: "azure-integration",
          vendor: "Microsoft",
          name: "Azure Integration Services",
          roles: [
            "Azure Integration Developer",
            "Integration Architect",
            "APIM Engineer",
          ],
        },
        {
          slug: "workato",
          vendor: "Workato",
          name: "Workato",
          roles: ["Integration Developer", "Automation Engineer"],
        },
        {
          slug: "informatica-cai",
          vendor: "Informatica",
          name: "Informatica Cloud Application Integration",
          roles: ["Integration Developer", "Integration Architect"],
        },
      ],
    },
    {
      slug: "event-streaming",
      num: "04",
      title: "Event Streaming",
      icon: "spark",
      blurb: "Kafka, event-driven architecture, streaming platforms.",
      overview:
        "Event-driven architecture is chosen for decoupling and then frequently delivers the opposite, because a topic with six undocumented consumers is tighter coupling than a synchronous call ever was. We screen streaming specialists on the governance of the stream rather than the mechanics of the broker: schema registry discipline, compatibility rules, what happens on replay, and whether they have operated a cluster during an incident rather than only built against one.",
      roles: [
        "Kafka Engineer",
        "Event Streaming Architect",
        "Integration Architect",
      ],
      tools: [
        {
          slug: "kafka-confluent",
          vendor: "Apache",
          name: "Apache Kafka and Confluent",
          roles: [
            "Kafka Engineer",
            "Event Streaming Architect",
            "Platform Engineer",
          ],
        },
        {
          slug: "solace",
          vendor: "Solace",
          name: "Solace",
          roles: ["Event Streaming Architect", "Middleware Administrator"],
        },
      ],
    },
    {
      slug: "esb-modernisation",
      num: "05",
      title: "ESB & Legacy Middleware Modernisation",
      icon: "mdm",
      blurb: "TIBCO, webMethods, IBM MQ and migration off them.",
      overview:
        "Most large estates still run middleware that predates the current architecture team, and the people who understand it are retiring out of the market faster than the platforms are being decommissioned. That is a real and worsening scarcity. We place both sides of it: specialists who can keep an ESB running under change, and migration leads who can move interfaces off it incrementally rather than in a single event, which is the plan that usually gets cancelled after the first attempt.",
      roles: [
        "TIBCO Developer",
        "webMethods Developer",
        "IBM App Connect Developer",
        "Middleware Administrator",
      ],
      tools: [
        {
          slug: "tibco",
          vendor: "TIBCO",
          name: "TIBCO",
          roles: ["TIBCO Developer", "Middleware Administrator"],
        },
        {
          slug: "webmethods",
          vendor: "webMethods",
          name: "webMethods",
          roles: ["webMethods Developer", "Integration Architect"],
        },
        {
          slug: "ibm-mq",
          vendor: "IBM",
          name: "IBM App Connect and MQ",
          roles: ["IBM App Connect Developer", "Middleware Administrator"],
        },
      ],
    },
    {
      slug: "b2b-edi",
      num: "06",
      title: "B2B & EDI",
      icon: "supply",
      blurb:
        "Trading partner onboarding, EDI standards, supply chain messaging.",
      overview:
        "EDI is unfashionable and load-bearing: a large retailer or manufacturer runs its supply chain on it, and a trading partner who cannot transact is a commercial problem within hours. The scarcity is people who understand both the message standards and the partner relationship, because onboarding is as much coordination as mapping. We screen for volume of partners actually onboarded and for how they handled a partner who could not meet the specification.",
      roles: [
        "EDI and B2B Analyst",
        "Integration Developer",
        "Integration Test Engineer",
      ],
      tools: [
        {
          slug: "sap-integration-suite",
          vendor: "SAP",
          name: "SAP Integration Suite",
          roles: [
            "SAP Integration Suite Developer",
            "Integration Architect",
            "EDI and B2B Analyst",
          ],
        },
        {
          slug: "oracle-integration-cloud",
          vendor: "Oracle",
          name: "Oracle Integration Cloud",
          roles: [
            "Oracle Integration Cloud Developer",
            "Integration Developer",
          ],
        },
      ],
    },
    /**
     * Agent interoperability, and it is a real integration concern rather than a
     * forward-looking flourish.
     *
     * Model Context Protocol and agent-to-agent are how an agent reaches an
     * enterprise system, which makes them interface contracts with the same
     * versioning, authorisation and error-handling problems as any other. n8n
     * sitting inside SAP's Joule Studio is the same convergence from the vendor
     * side. Both are named in §4.2 as current and real. This card cross-links to
     * AI Talent rather than restating it: the agent is built there, the interface
     * it consumes is governed here.
     */
    {
      slug: "agent-interoperability",
      num: "07",
      title: "Agent Interoperability",
      icon: "dataAi",
      blurb: "Model Context Protocol, agent-to-agent, Joule Studio, n8n.",
      overview:
        "When an agent calls an enterprise system it is doing integration, and it inherits every problem integration already had plus one new one: the caller is non-deterministic. Which tools an agent may invoke, under whose authorisation, with what rate limit and what audit trail are interface governance questions, and they are being answered on live programmes now. We screen for people who treat an agent as another consumer of a governed interface rather than as an exception to the model.",
      roles: [
        "Integration Architect",
        "API Security Engineer",
        "Integration Developer",
      ],
      tools: [
        {
          slug: "mcp",
          vendor: "Model Context Protocol",
          name: "Model Context Protocol",
          roles: ["Integration Architect", "API Security Engineer"],
        },
        {
          slug: "joule-studio",
          vendor: "SAP",
          name: "SAP Joule Studio",
          roles: ["SAP Integration Suite Developer", "Integration Architect"],
        },
        {
          slug: "n8n",
          vendor: "n8n",
          name: "n8n",
          roles: ["Integration Developer", "Automation Engineer"],
        },
      ],
    },
  ],

  segmentsEyebrow: "Where we deploy",
  segmentsTitle:
    "Every sector runs an integration workstream — we staff them all.",
  segmentsSub:
    "A bank's payment rails, a retailer's trading partners or a manufacturer's plant systems change which integration specialist you need. Same screened bench, calibrated to the operating context.",
  segments: [
    {
      id: "retail",
      name: taxonomyLabels("retail").label,
      intro:
        "Order and inventory interfaces, trading partner onboarding and store-to-centre messaging for retail programmes.",
      roles: ["Integration Architect", "EDI and B2B Analyst", "Kafka Engineer"],
    },
    {
      id: "manufacturing",
      name: taxonomyLabels("manufacturing").label,
      intro:
        "Plant and warehouse system interfaces, EDI with logistics partners and ERP integration for manufacturing programmes.",
      roles: [
        "SAP Integration Suite Developer",
        "EDI and B2B Analyst",
        "Middleware Administrator",
      ],
    },
    {
      id: "finance",
      name: taxonomyLabels("finance").label,
      intro:
        "Payment interfaces, open banking APIs and core banking integration for financial services programmes.",
      roles: ["API Architect", "Integration Architect", "APIM Engineer"],
    },
    {
      id: "government",
      name: taxonomyLabels("government").label,
      intro:
        "Cross-department data exchange, citizen service APIs and legacy system integration for government programmes.",
      roles: ["Integration Architect", "APIM Engineer", "API Architect"],
    },
    {
      id: "healthcare",
      name: taxonomyLabels("healthcare").label,
      intro:
        "Clinical system interfaces, HL7 and FHIR messaging and regulated data exchange for healthcare programmes.",
      roles: [
        "Integration Architect",
        "Integration Developer",
        "Integration Test Engineer",
      ],
    },
    {
      id: "telco",
      name: taxonomyLabels("telco").label,
      intro:
        "OSS and BSS integration, provisioning interfaces and high-volume event streaming for telco and media programmes.",
      roles: [
        "Event Streaming Architect",
        "Kafka Engineer",
        "Integration Architect",
      ],
    },
    {
      id: "education",
      name: taxonomyLabels("education").label,
      intro:
        "Student record to learning platform interfaces, admissions handover into enrolment and statutory reporting feeds for institutional programmes.",
      roles: [
        "Integration Architect",
        "Integration Developer",
        "API Architect",
      ],
    },
  ],

  relatedTitle: "Related pages",
  /* The platform desks that staff integration work, per §4.2: SAP, Oracle,
     Salesforce and Informatica. Linked once each, and the platform side links
     back. */
  related: [
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
      href: "/platforms/informatica",
      label: taxonomyLabels("informatica").label,
      category: "Platform",
    },
    {
      href: "/capabilities/data-analytics",
      label: taxonomyLabels("data-analytics").label,
      category: "Capability",
    },
    {
      href: "/ai-talent",
      label: taxonomyLabels("ai-talent").label,
      category: "Capability",
    },
    {
      href: "/capabilities/testing-quality-engineering",
      label: taxonomyLabels("testing-quality-engineering").label,
      category: "Capability",
    },
  ],

  seo: {
    title: "Integration & Middleware Contractors · Yallo Talent",
    description:
      "Specialist-screened integration contractors: MuleSoft, Boomi, Kafka, API management, SAP and Oracle integration. 72h shortlist across the Middle East, Europe and India.",
  },
};
