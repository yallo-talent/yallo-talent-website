/**
 * The Programme Staffing Blueprint — v1 content, from
 * docs/design/context-programme-staffing-blueprint.md, ratified 1 Aug 2026.
 *
 * THE RULING THAT MAKES THIS SHIPPABLE: v1 is a STRUCTURE asset, not a data
 * asset. Relay v6.0 reported the Blueprint blocked on content, and it was
 * blocked on the wrong half of it. The unclaimed ground is the team shape and
 * the sequence — which roles a programme needs, in which phase, and which ones
 * are chronically under-scoped. That is programme knowledge and it is
 * publishable today. The quantities are what need Sumeet's data.
 *
 * Held back for v2, and there is no field for any of them below, deliberately:
 * team size, FTE, effort, time-to-hire, scarcity index, rate bands. A field
 * that does not exist cannot be filled with an estimate by a later pass.
 *
 * NO EMPTY NUMERIC SLOT RENDERS. A section that needs a figure does not exist
 * until the figure does. No metric block with dashes, no column headed "time to
 * hire" with nothing under it — that reads worse than the absence.
 *
 * NO DOWNLOAD PROMISE. There is no PDF and there will not be one in v1. The
 * close is a request routed to /brief with the archetype in a `source` field,
 * which is honest and captures the same lead.
 *
 * Three archetypes, in Sumeet's priority order, all three programmes Yallo has
 * staffed. A fourth is not added.
 */

/* Taxonomy names come from the index, never from this file. The label is the
   half that drifts: a `href` either routes or it does not, but a hand-typed
   "Salesforce" beside it does not move when `platformsIndex` does, which is how
   five copies of the platform set never heard that Informatica had been
   ratified. `src/data/l1/index.ts` is a leaf module with no imports of its own,
   so reaching for it here cannot close an initialisation cycle the way
   `@/lib/*` would. */
import { taxonomyLabels } from "@/data/l1/index";

export interface BlueprintStream {
  /** Architecture, functional, technical, quality, programme. */
  name: string;
  roles: string[];
}

export interface BlueprintPhase {
  /** Named as the VENDOR method names it, never renamed to a house term. */
  name: string;
  /** Who is on in this phase. */
  on: string;
}

export interface BlueprintUnderScoped {
  /** The role or stream that gets under-scoped. */
  item: string;
  /** What happens when it is. The consequence is the content. */
  consequence: string;
}

export interface BlueprintArchetype {
  slug: string;
  /** The programme type as a buyer would name it. */
  name: string;
  /** Band 1, one line on what the page gives a reader. */
  hero: string;
  /** The vendor's own method name, e.g. "SAP Activate". */
  methodName?: string;
  phases: BlueprintPhase[];
  streams: BlueprintStream[];
  underScoped: BlueprintUnderScoped[];
  /** Band 6, the two or three hardest roles and the evidence demanded. */
  screenHardest: { roles: string[]; evidence: string };
  /** Band 7, the platform desks that staff it. Slugs under /platforms. */
  desks: Array<{ slug: string; name: string }>;
  seo: { title: string; description: string };
}

const sapS4hana: BlueprintArchetype = {
  slug: "sap-s4hana",
  name: "SAP S/4HANA rollout",
  hero: "The team shape and the sequence for an S/4HANA rollout: who is on in which phase, and the roles that are always scoped too late.",
  methodName: "SAP Activate",
  phases: [
    {
      name: "Discover",
      on: "Enterprise Architect, Solution Architect, Programme Director",
    },
    {
      name: "Prepare",
      on: "Adds PMO, Basis, Authorisations Architect, Data Migration Lead, Change Lead, Integration Architect",
    },
    {
      name: "Explore",
      on: "Functional streams at peak for fit-to-standard, Integration Architect, Data Migration Lead",
    },
    {
      name: "Realise",
      on: "Technical build at peak, all developers, migration developers, Test Lead, Test Automation",
    },
    {
      name: "Deploy",
      on: "Testing at peak, Cutover Manager, Training Lead, hypercare planning begins",
    },
    {
      name: "Run",
      on: "Hypercare Lead, retained functional and technical cover, support model",
    },
  ],
  streams: [
    {
      name: "Programme",
      roles: [
        "Programme Director",
        "PMO Lead",
        "PMO Analyst",
        "Change and Adoption Lead",
        "Training Lead",
      ],
    },
    {
      name: "Architecture",
      roles: [
        "Enterprise Architect",
        "S/4HANA Solution Architect",
        "Integration Architect",
        "Authorisations and Security Architect",
      ],
    },
    {
      name: "Functional",
      roles: [
        "FI and CO",
        "MM and Sourcing",
        "SD and Order to Cash",
        "PP and QM",
        "EWM and TM",
        "PM and PS",
        "SuccessFactors interface lead",
        "Sector-specific functional lead where the sector demands one",
      ],
    },
    {
      name: "Technical",
      roles: [
        "ABAP and RAP Developer",
        "Fiori and CDS Developer",
        "BTP Developer",
        "Basis and HANA Administrator",
        "Integration Developer, Cloud Integration",
        "Data Migration Lead",
        "Data Migration Developer, Migration Cockpit",
        "Analytics Developer, Analytics Cloud and Datasphere",
      ],
    },
    {
      name: "Quality and cutover",
      roles: [
        "Test Lead",
        "Test Automation Engineer",
        "Functional Testers",
        "Cutover Manager",
        "Hypercare Lead",
      ],
    },
  ],
  underScoped: [
    {
      item: "Data migration",
      consequence:
        "Scoped as a task rather than a stream, and started after Explore. Legacy data quality is discovered during Realise, and the go-live date moves.",
    },
    {
      item: "Authorisations and security",
      consequence:
        "Roles design starts near user acceptance testing. Testers cannot get into the system and the test window compresses to nothing.",
    },
    {
      item: "Integration",
      consequence:
        "Assumed to be configuration on a middleware tool. Every non-SAP counterparty has its own contract, and nobody owns the end-to-end error handling.",
    },
    {
      item: "Test automation",
      consequence:
        "Manual regression is planned once and then needed every cycle, so regression cost rises through Realise.",
    },
    {
      item: "Cutover management",
      consequence:
        "Treated as a plan rather than a role. Nobody owns the hour-by-hour sequence, and the rehearsal exposes it too late.",
    },
    {
      item: "Master data governance",
      consequence:
        "Migration is funded, governance after go-live is not, and the data degrades within two quarters.",
    },
    {
      item: "Change and training",
      consequence:
        "Funded last and cut first. It is the reason a technically successful go-live is reported as a failure by the business.",
    },
  ],
  screenHardest: {
    roles: [
      "Data Migration Lead",
      "Authorisations and Security Architect",
      "Integration Architect",
    ],
    evidence:
      "For each, evidence of a live cutover rather than a project they joined after go-live.",
  },
  desks: [
    { slug: "sap", name: taxonomyLabels("sap").label },
    { slug: "informatica", name: taxonomyLabels("informatica").label },
  ],
  seo: {
    title: "SAP S/4HANA Programme Staffing Blueprint | Yallo Talent",
    description:
      "The team shape for an S/4HANA rollout: streams, SAP Activate phases, who is on when, and the roles that are always under-scoped. Middle East · Europe · India.",
  },
};

const oracleFusion: BlueprintArchetype = {
  slug: "oracle-fusion",
  name: "Oracle Fusion implementation",
  hero: "The team shape and the sequence for an Oracle Fusion implementation, including the two streams that most often delay a pilot.",
  phases: [
    { name: "Plan", on: "Solution Architect, Programme Director, PMO" },
    {
      name: "Design and Configure",
      on: "Functional streams at peak, Security and Roles Architect, Integration Architect, Data Conversion Specialist",
    },
    {
      name: "Validate, through conference room pilots",
      on: "Pilot coordination at peak, Test Lead, functional streams, reporting developers",
    },
    {
      name: "Deploy",
      on: "Cutover Manager, payroll parallel runs, training, hypercare planning",
    },
    {
      name: "Operate",
      on: "Hypercare Lead, quarterly update regression cover",
    },
  ],
  streams: [
    {
      name: "Programme",
      roles: [
        "Programme Director",
        "PMO Lead",
        "Change and Adoption Lead",
        "Training Lead",
      ],
    },
    {
      name: "Architecture",
      roles: [
        "Fusion Solution Architect",
        "Integration Architect, Integration Cloud",
        "Security and Roles Architect",
        "Reporting and Analytics Architect",
      ],
    },
    {
      name: "Functional, ERP and SCM",
      roles: [
        "General Ledger",
        "Payables and Receivables",
        "Fixed Assets and Cash",
        "Tax",
        "Procurement",
        "Projects",
        "Inventory",
        "Order Management",
        "Manufacturing",
        "Supply Planning",
      ],
    },
    {
      name: "Functional, HCM",
      roles: ["Core HR", "Payroll", "Absence", "Talent", "Recruiting"],
    },
    {
      name: "Functional, EPM",
      roles: [
        "Planning",
        "Financial Consolidation",
        "Account Reconciliation",
        "Enterprise Data Management",
      ],
    },
    {
      name: "Technical",
      roles: [
        "Integration Cloud Developer",
        "Reports Developer, Publisher, OTBI and Data Intelligence",
        "Data Conversion Specialist, FBDI and HDL",
        "Visual Builder Extension Developer",
        "Roles and Security Specialist",
      ],
    },
    {
      name: "Quality and cutover",
      roles: [
        "Test Lead",
        "Conference room pilot Coordinator",
        "Cutover Manager",
        "Hypercare Lead",
      ],
    },
  ],
  underScoped: [
    {
      item: "Security and roles design",
      consequence:
        "Oracle's role model is the single most common cause of a delayed pilot. Started late, it blocks every downstream test.",
    },
    {
      item: "Data conversion",
      consequence:
        "FBDI and HDL loads are treated as a technical chore. Iterations multiply and the pilot slips.",
    },
    {
      item: "Quarterly update regression",
      consequence:
        "The one nobody staffs for at all. Oracle updates on a fixed cadence after go-live and there is no team left to test it.",
    },
    {
      item: "Reporting",
      consequence:
        "Assumed to come with the product. Users do not accept the system without their reports.",
    },
    {
      item: "Payroll parallel runs",
      consequence:
        "Under-planned, and payroll is the one workstream that cannot be soft-launched.",
    },
    {
      item: "EPM data integration",
      consequence:
        "Planned as a separate project, then found to depend on the same conversion team.",
    },
  ],
  screenHardest: {
    roles: [
      "Security and Roles Architect",
      "Data Conversion Specialist",
      "Payroll lead",
    ],
    evidence: "Ask for the parallel run they got wrong and what they changed.",
  },
  desks: [{ slug: "oracle", name: taxonomyLabels("oracle").label }],
  seo: {
    title: "Oracle Fusion Programme Staffing Blueprint | Yallo Talent",
    description:
      "The team shape for an Oracle Fusion implementation: streams, phases, conference room pilots, and the roles that delay a pilot when scoped late. Middle East · Europe · India.",
  },
};

const salesforceMultiCloud: BlueprintArchetype = {
  slug: "salesforce-multi-cloud",
  name: "Salesforce multi-cloud programme",
  hero: "The team shape and the sequence for a Salesforce multi-cloud programme, including the skills most often assumed to be interchangeable.",
  phases: [
    { name: "Discover", on: "Solution Architect, Programme Director" },
    {
      name: "Define",
      on: "Adds functional cloud leads, Data Architect, Change Lead",
    },
    {
      name: "Design",
      on: "Technical Architect, Integration Architect, Identity Architect, DevOps Engineer stood up early",
    },
    {
      name: "Build and iterate",
      on: "Developers and declarative specialists at peak, QA Automation, Data Migration",
    },
    {
      name: "Deploy",
      on: "Release Manager, Test Lead at peak, training, hypercare planning",
    },
    {
      name: "Optimise",
      on: "Hypercare Lead, adoption measurement, retained release cover",
    },
  ],
  streams: [
    {
      name: "Programme",
      roles: [
        "Programme Director",
        "Delivery Lead",
        "PMO Lead",
        "Change and Adoption Lead",
      ],
    },
    {
      name: "Architecture",
      roles: [
        "Solution Architect",
        "Technical Architect",
        "Integration Architect, MuleSoft",
        "Data Architect",
        "Identity and Access Architect",
      ],
    },
    {
      name: "Cloud and functional",
      roles: [
        "Sales Cloud",
        "Service Cloud",
        "Marketing Cloud, including Journey Builder",
        "Experience Cloud",
        "Data Cloud",
        "Revenue and CPQ",
        "Field Service",
        "Agentforce",
      ],
    },
    {
      name: "Technical",
      roles: [
        "Apex and Lightning Web Components Developer",
        "Declarative and Flow Specialist",
        "DevOps and Release Engineer",
        "Data Migration Specialist",
        "QA Automation Engineer",
      ],
    },
    {
      name: "Quality and cutover",
      roles: [
        "Test Lead",
        "User Acceptance Coordinator",
        "Release Manager",
        "Hypercare Lead",
      ],
    },
  ],
  underScoped: [
    {
      item: "Release engineering and DevOps",
      consequence:
        "Stood up late, so metadata deployments are manual and every release becomes an event.",
    },
    {
      item: "Data migration and de-duplication",
      consequence:
        "Underestimated because the object model looks simple. Duplicate records destroy user trust in week one.",
    },
    {
      item: "Marketing Cloud specialists",
      consequence:
        "Assumed to be interchangeable with core platform people. They are a separate skill and a separate market.",
    },
    {
      item: "Identity, permissions and licence design",
      consequence:
        "Discovered at user acceptance testing, when the licence mix turns out to be wrong.",
    },
    {
      item: "Adoption and enablement",
      consequence:
        "The clouds go live and the pipeline data stays incomplete, so the business sees no value.",
    },
    {
      item: "Data Cloud and Agentforce skills",
      consequence:
        "New, scarce, and now assumed to be part of a standard build team.",
    },
  ],
  screenHardest: {
    roles: [
      "DevOps and Release Engineer",
      "Data Migration Specialist",
      "Marketing Cloud lead",
    ],
    evidence: "Evidence of a live release train, not a sandbox.",
  },
  desks: [{ slug: "salesforce", name: taxonomyLabels("salesforce").label }],
  seo: {
    title: "Salesforce Multi-Cloud Programme Staffing Blueprint | Yallo Talent",
    description:
      "The team shape for a Salesforce multi-cloud programme: streams, phases, release engineering, and the skills wrongly assumed interchangeable. Middle East · Europe · India.",
  },
};

/** Sumeet's priority order: SAP, then Oracle, then Salesforce. */
export const blueprintArchetypes: BlueprintArchetype[] = [
  sapS4hana,
  oracleFusion,
  salesforceMultiCloud,
];

export function blueprintArchetype(slug: string): BlueprintArchetype | null {
  return blueprintArchetypes.find((a) => a.slug === slug) ?? null;
}

export function blueprintSlugs(): string[] {
  return blueprintArchetypes.map((a) => a.slug);
}

export const BLUEPRINT_BASE = "/intelligence/programme-staffing-blueprint";

/**
 * What v2 needs, kept in code so the dependency is explicit and no later pass
 * quietly fills it in. Not rendered: this is a note to the next author, not
 * page content, and a "what is missing" band would be a coming-soon state.
 *
 *  1. Time-to-hire per role, from Vincere history, with the definition used.
 *  2. Scarcity per role in-region. LICENCE CHECK OUTSTANDING — LinkedIn Talent
 *     Insights terms typically restrict external redistribution of derived
 *     data. Verify before any scarcity figure is published. Vincere data is
 *     Yallo's own and is the fallback.
 *  3. Team size and effort per phase.
 *  4. Rate bands, which stay off the public site and inside the requested
 *     planning pack only.
 */
