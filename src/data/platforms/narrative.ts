/**
 * Authored narrative for a platform L1 — the four sections `/platforms/sap` was
 * missing against `/industries/retail`.
 *
 * MEASURED FIRST, because "SAP needs retail's depth" was reported for two
 * rounds without anyone saying which sections. Rendered and counted at 1440:
 * retail paints eight H2 sections in 1,196 words, SAP four in 1,291. SAP is not
 * short of WORDS — it has more of them than retail — it is short of ARGUMENT.
 * Its four sections are the module grid, the role list, the operating rhythm
 * and the ask, and three of those are inventory. Retail additionally opens with
 * a problem, names the roles that are hard to fill, tells the reader which kind
 * of programme they are running, and routes onward. Those four are what is
 * added here.
 *
 * THE CONTENT RULE, and it is the one that gets broken on platform pages: write
 * what Yallo places, screens and staffs. Never what SAP does. "S/4HANA unifies
 * finance and logistics on one data model" is vendor marketing and is banned;
 * "brownfield conversion crews are a different bench from standard-first public
 * cloud consultants" is the site's voice, because it is a statement about
 * people.
 *
 * WHAT IS NOT HERE, deliberately:
 *
 *   No figure. Not one. The intro band on retail carries stat cards; this
 *   interface has no field for them, so none can be added later without a
 *   decision. Canon §6 permits the four metrics in content/metrics.yaml and
 *   nothing else, and every figure this page needs it already renders in the
 *   hero rail from the coverage data.
 *
 *   No client, quotation, case study, date or person.
 *
 *   No scarcity index on the scarce band. It names roles and says why they are
 *   hard to fill, which is desk knowledge; how hard, in numbers, is Sumeet's
 *   data and does not exist yet.
 *
 * EVERY ROLE NAME BELOW ALREADY EXISTS in src/data/platforms/authored.ts under
 * the SAP module set. Nothing is coined. The same rule R13 applied to Blue
 * Yonder modules applies to roles here: a role ships if the repo already places
 * it, and is omitted otherwise.
 *
 * Optional per platform, and all seven are now authored (parity round §5).
 * SAP came first as the reference; the other six followed once the measurement
 * was unambiguous — SAP painted six sections and 14,170px against roughly 6,500
 * and two on every other platform, so the parity gap was the argument bands,
 * not the inventory. Each section stays gated on presence, so a platform
 * without a narrative still renders nothing empty.
 */

export interface PlatformNarrative {
  /** Band 1, the problem the page is answering. */
  intro: {
    eyebrow: string;
    title: string;
    /** Paragraphs. Prose, not bullets — this is the argument. */
    copy: string[];
  };
  /** Band 2, the roles that are hard to fill and why. No scarcity figure. */
  scarce: {
    eyebrow: string;
    title: string;
    copy: string;
    /** Role, and the reason the market is thin. Names must exist in the data. */
    roles: Array<{ name: string; why: string }>;
  };
  /** Band 3, which kind of programme the reader is running. */
  segments: {
    eyebrow: string;
    title: string;
    sub: string;
    items: Array<{ name: string; copy: string }>;
  };
  /** Band 4, routes onward. Every href must resolve. */
  related: {
    title: string;
    links: Array<{ href: string; label: string; category: string }>;
  };
}

const sap: PlatformNarrative = {
  intro: {
    eyebrow: "The problem",
    title:
      "An SAP programme is not short of consultants. It is short of the four or five who have done this exact thing.",
    copy: [
      "Every integrator on the shortlist can field FI/CO and MM/SD consultants. What decides a delivery date is narrower than that: whether the person who has run a brownfield conversion is on the team before the conversion starts, whether the authorisations architect arrived early enough for testers to get into the system, and whether anybody on the programme has personally owned a cutover weekend.",
      "Those are not seniority questions and they are not certification questions. They are questions about what somebody has already lived through, and a CV answers none of them. It is the reason we screen SAP briefs with people who have run the programme rather than with a keyword match against a role title.",
      "We publish the modules and the roles inside each one so the depth can be checked before a brief is sent. A desk that cannot name what it staffs at module level is a desk that will send you generalists.",
    ],
  },
  scarce: {
    eyebrow: "Hard to fill",
    title: "The SAP roles that are scarce, and why the market is thin on each.",
    copy: "Scarcity on an SAP programme is rarely about the technology. It is about how few people have been in the room when it went wrong, which is a much smaller population than the one holding the certification.",
    roles: [
      {
        name: "Data Migration Lead",
        why: "Migration is scoped as a task rather than a stream on most programmes, so the people who have owned one end to end are rare. The ones who have also carried the legacy data quality problem into a live cutover are rarer again.",
      },
      {
        name: "SAP CPI Integration Developer",
        why: "Integration is assumed to be configuration on a middleware tool until the first non-SAP counterparty turns out to have its own contract and its own error handling. Developers who have owned that end to end are competed for by every programme at once.",
      },
      {
        name: "Cutover Manager",
        why: "Treated as a plan rather than as a role on most plans, which means very few people have ever held the hour-by-hour sequence. Ask for the rehearsal that exposed something, because the ones who have run a cutover always have that story.",
      },
      {
        name: "SAP S/4HANA Architect",
        why: "The deployment decision, the conversion approach and the extensibility model are all owned here, and all three are expensive to reverse. Architects who have made those calls on more than one estate are a small field.",
      },
      {
        name: "SAP Test Lead",
        why: "Regression on an SAP estate is planned once and needed every cycle. Test leads who arrived with an automation strategy rather than a spreadsheet are the difference between a compressed test window and a moved date.",
      },
      {
        name: "Hypercare Lead",
        why: "Funded last, and the first role cut when the build runs late. The people who have actually held a hypercare period know it is a staffing model rather than a rota, and there are not many of them.",
      },
    ],
  },
  segments: {
    eyebrow: "Which programme are you running",
    title: "Four SAP estates, and they do not take the same bench.",
    sub: "The deployment is not a detail of the contract. It changes which consultants can do the work.",
    items: [
      {
        name: "Brownfield conversion, on-premise",
        copy: "An existing ECC estate converted in place, carrying its history and its custom code. Needs consultants who can read someone else's twenty-year-old configuration and an ABAP bench that can remediate rather than rewrite.",
      },
      {
        name: "Cloud Public Edition",
        copy: "Standard-first, with extension rather than modification, and a quarterly release cadence that never stops. The bench is different in temperament as much as in skill: the useful consultant here is the one who can talk a business out of a modification.",
      },
      {
        name: "Cloud Private Edition",
        copy: "The mixed case, and the one most often mis-staffed. It carries the flexibility of on-premise with the operating model of cloud, so it needs people who have worked both and know which habits to leave behind.",
      },
      {
        name: "Delivered via RISE with SAP",
        copy: "A commercial programme rather than a fourth deployment, and it changes who is accountable for what. The staffing consequence is at the boundaries: somebody has to own the seams between the client, the integrator and SAP, and that role is routinely nobody's.",
      },
    ],
  },
  related: {
    title: "Adjacent desks and where SAP work lands",
    links: [
      {
        href: "/intelligence/programme-staffing-blueprint/sap-s4hana",
        label: "SAP S/4HANA staffing blueprint",
        category: "Blueprint",
      },
      {
        href: "/industries/retail",
        label: "Retail and consumer",
        category: "Industry",
      },
      {
        href: "/platforms/informatica",
        label: "Informatica",
        category: "Platform",
      },
      {
        href: "/capabilities/data-analytics",
        label: "Data and AI",
        category: "Capability",
      },
      {
        href: "/ai-talent",
        label: "AI talent",
        category: "Specialism",
      },
      {
        href: "/managed-delivery",
        label: "Managed delivery",
        category: "Engagement",
      },
    ],
  },
};

const oracle: PlatformNarrative = {
  intro: {
    eyebrow: "The problem",
    title:
      "Fusion programmes do not slip on the modules. They slip on roles and on conversion.",
    copy: [
      "Ask any integrator for General Ledger or Procurement consultants and you will get them. Ask who is designing the role model, and when, and the answer decides your pilot date. Oracle's security and roles design is the single most common cause of a delayed conference room pilot, and it is almost always started after the people who depend on it needed it.",
      "The second one is conversion. FBDI and HDL loads get scoped as a technical chore, the first iteration exposes the data, and the iterations multiply until the pilot moves. The people who have already been through that cycle price it differently at the start, which is the whole value of hiring one.",
      "The third is what happens after go-live. Oracle updates on a fixed quarterly cadence and most programmes have released their team by the time the first one lands. We staff for that cadence rather than for the launch.",
    ],
  },
  scarce: {
    eyebrow: "Hard to fill",
    title: "The Oracle roles that are scarce, and why the market is thin.",
    copy: "Fusion certification is widely held. What is not widely held is having owned the role model on a live estate, or having taken a payroll parallel run through to sign-off.",
    roles: [
      {
        name: "Oracle Cloud Security and Roles Architect",
        why: "The role model touches every downstream test, and it is the first thing to be deferred and the last thing to be forgiven. Architects who have designed one under audit, rather than inherited it, are a small field.",
      },
      {
        name: "Data Conversion Specialist, FBDI",
        why: "Everyone has loaded a template. Far fewer have owned the loop where the load fails, the source is wrong, and the business has to decide what to correct before the next attempt.",
      },
      {
        name: "Oracle Fusion Payroll Consultant",
        why: "Payroll is the one workstream that cannot be soft-launched, so the useful consultant is the one who has run parallel cycles to sign-off. Ask about the run that did not reconcile.",
      },
      {
        name: "Integration Architect, Oracle Integration Cloud",
        why: "OIC work is assumed to be configuration until the first counterparty has its own contract and nobody owns end-to-end error handling. Architects who have held those seams are competed for continuously.",
      },
      {
        name: "Oracle Fast Formula Developer",
        why: "A narrow, specific skill with no substitute. A strong HCM consultant who has never written one cannot pick it up on the programme, and every payroll and absence build needs it.",
      },
      {
        name: "EBS to Fusion Migration Lead",
        why: "Requires fluency in both a twenty-year-old estate and the product replacing it. That pairing is shrinking as EBS experience leaves the market rather than growing.",
      },
    ],
  },
  segments: {
    eyebrow: "Which programme are you running",
    title: "Four Oracle estates, and the bench differs on each.",
    sub: "What you are running decides which consultants are relevant, and it is decided before the brief is written.",
    items: [
      {
        name: "Fusion Cloud, greenfield",
        copy: "Standard-first, with extension through Visual Builder rather than modification. The useful consultant is the one who can hold a business to the standard process, which is a temperament as much as a skill.",
      },
      {
        name: "EBS to Fusion",
        copy: "The mixed case. Needs people who can read the legacy estate and the new one, and who can tell which customisations were a decision and which were a workaround nobody removed.",
      },
      {
        name: "E-Business Suite, still running",
        copy: "Estates staying on EBS for now still need PL/SQL, Apps DBA and Workflow cover, and that bench is thinning as the market moves. Support cover is a real staffing problem, not a residual one.",
      },
      {
        name: "NetSuite",
        copy: "A different market from Fusion, not a smaller one. SuiteScript and SuiteTalk skills do not come from the Fusion bench and hiring as though they do is the common error.",
      },
    ],
  },
  related: {
    title: "Adjacent desks and where Oracle work lands",
    links: [
      {
        href: "/intelligence/programme-staffing-blueprint/oracle-fusion",
        label: "Oracle Fusion staffing blueprint",
        category: "Blueprint",
      },
      { href: "/platforms/sap", label: "SAP", category: "Platform" },
      {
        href: "/capabilities/integration-middleware",
        label: "Integration and middleware",
        category: "Capability",
      },
      {
        href: "/capabilities/data-analytics",
        label: "Data and AI",
        category: "Capability",
      },
      { href: "/ai-talent", label: "AI talent", category: "Specialism" },
      { href: "/contract", label: "Contract", category: "Engagement" },
    ],
  },
};

const microsoft: PlatformNarrative = {
  intro: {
    eyebrow: "The problem",
    title:
      "Microsoft is not one bench. It is four, and most shortlists quietly assume it is one.",
    copy: [
      "Azure infrastructure, Dynamics 365, Power Platform and the Copilot layer share a vendor and very little else. The engineer who builds a landing zone and the consultant who configures Finance and Operations are not interchangeable, and neither is a substitute for the person who has governed a Power Platform estate that grew without anyone watching.",
      "That last one is the quiet problem. Power Platform arrives through the business rather than through IT, so by the time somebody owns it there are hundreds of apps and flows and no environment strategy. Staffing it needs an administrator who has cleaned one up, which is a different hire from a maker.",
      "We publish the desks separately for that reason. A single Microsoft rate card and a single Microsoft shortlist is how a programme ends up with a competent person in the wrong seat.",
    ],
  },
  scarce: {
    eyebrow: "Hard to fill",
    title: "The Microsoft roles that are scarce, and why.",
    copy: "The Azure certification population is large. The population that has run the thing in production, at cost, under a security review, is not.",
    roles: [
      {
        name: "X++ Developer",
        why: "A specialised language with a shrinking pool and no adjacent skill that substitutes for it. Every Finance and Operations programme needs one, and they are booked well ahead.",
      },
      {
        name: "Microsoft Entra ID Engineer",
        why: "Identity is where a migration stalls, and the estate is usually hybrid, half-documented and load-bearing. Engineers who have cut over an identity estate rather than extended one are rare.",
      },
      {
        name: "Data Migration Specialist, DMF",
        why: "Treated as a technical task until the first entity refuses to load cleanly. The people who have owned it end to end, including the business decisions about what to correct, are few.",
      },
      {
        name: "Power Platform Administrator",
        why: "The role almost nobody staffs until the estate is already sprawling. Governance, environment strategy and licence control are a discipline, and very few people have practised it on a live tenant.",
      },
      {
        name: "Dual-write Integration Developer",
        why: "Sits between Finance and Operations and the Dataverse side, so it needs both, and failures surface as data problems rather than as integration errors. That diagnostic experience is the scarce part.",
      },
      {
        name: "Microsoft Fabric Data Engineer",
        why: "New enough that genuine production experience is thin, and often confused with Synapse or Power BI experience on a CV. Ask what they migrated and what broke.",
      },
    ],
  },
  segments: {
    eyebrow: "Which programme are you running",
    title: "Four Microsoft estates, and they take different people.",
    sub: "Naming which one you are running is the fastest way to get a relevant shortlist.",
    items: [
      {
        name: "Azure platform build and migration",
        copy: "Landing zones, migration waves and the run model afterwards. An infrastructure and platform bench, with security engaged from the design rather than at the review.",
      },
      {
        name: "Dynamics 365 implementation",
        copy: "Finance and Operations, Customer Engagement or Business Central. A functional and X++ bench, and closer to an ERP programme than to anything else on this page.",
      },
      {
        name: "Power Platform at scale",
        copy: "Usually a governance problem before it is a build problem. Needs an administrator and a solution architect before it needs more makers.",
      },
      {
        name: "Copilot readiness",
        copy: "Mostly information governance work wearing an AI label. The blocker is nearly always permissions and data sprawl, so the first hire is a Purview specialist rather than a developer.",
      },
    ],
  },
  related: {
    title: "Adjacent desks and where Microsoft work lands",
    links: [
      {
        href: "/platforms/salesforce",
        label: "Salesforce",
        category: "Platform",
      },
      {
        href: "/capabilities/cloud-infrastructure",
        label: "Cloud and infrastructure",
        category: "Capability",
      },
      {
        href: "/capabilities/cybersecurity",
        label: "Cybersecurity",
        category: "Capability",
      },
      {
        href: "/capabilities/devops-platform-engineering",
        label: "DevOps and platform engineering",
        category: "Capability",
      },
      { href: "/ai-talent", label: "AI talent", category: "Specialism" },
      { href: "/contract", label: "Contract", category: "Engagement" },
    ],
  },
};

const salesforce: PlatformNarrative = {
  intro: {
    eyebrow: "The problem",
    title:
      "Multi-cloud Salesforce programmes fail on the clouds nobody treated as separate.",
    copy: [
      "Sales Cloud and Service Cloud people are plentiful and largely interchangeable. Marketing Cloud people are neither, and assuming otherwise is the most reliable way to lose a quarter. It is a separate skill and a separate market, and the assumption that a strong core platform consultant will pick it up is made on almost every programme.",
      "The second failure is release engineering. DevOps is stood up late, so metadata deployments stay manual and every release becomes an event with a rollback nobody has rehearsed. Standing that role up before the build rather than during it is the cheapest decision on the programme.",
      "The third is data. The object model looks simple, so de-duplication is under-scoped, and duplicate records destroy user trust in the first week in a way that is very hard to recover.",
    ],
  },
  scarce: {
    eyebrow: "Hard to fill",
    title: "The Salesforce roles that are scarce, and why.",
    copy: "Administrator and developer supply is deep. The scarcity sits in the roles that only exist once a programme is large enough to have been burned.",
    roles: [
      {
        name: "Salesforce DevOps and Release Engineer",
        why: "Ask for evidence of a live release train rather than a sandbox. The people who have run metadata deployments at cadence, with a rollback they have actually used, are a small population.",
      },
      {
        name: "Marketing Cloud Consultant",
        why: "A separate market from the core platform, and routinely staffed by assumption. Journey Builder and AMPscript experience does not transfer from Sales Cloud, however senior the consultant.",
      },
      {
        name: "Salesforce Data Migration Specialist",
        why: "Underestimated because the objects look simple. The scarce skill is de-duplication and identity resolution at volume, and the consequence of getting it wrong is user trust rather than a defect.",
      },
      {
        name: "Salesforce Identity and Access Architect",
        why: "Discovered at user acceptance testing, when the licence mix turns out to be wrong. Architects who have designed permissions and licensing together, in advance, are unusual.",
      },
      {
        name: "Salesforce Data Cloud Consultant",
        why: "New, and the experience claimed on a CV frequently predates the product being what it is now. Ask what they unified and what the match rate did.",
      },
      {
        name: "Agentforce Developer",
        why: "Newer still, and the market is thin by simple arithmetic. Screen for agent design and failure handling rather than for the product name.",
      },
    ],
  },
  segments: {
    eyebrow: "Which programme are you running",
    title: "Three Salesforce shapes, and they staff differently.",
    sub: "The number of clouds in scope changes the team more than the number of users does.",
    items: [
      {
        name: "Single cloud, deep",
        copy: "Sales or Service done properly. A functional and declarative bench with one architect, and the risk is over-engineering rather than under-staffing.",
      },
      {
        name: "Multi-cloud programme",
        copy: "Where the separate markets bite. Each cloud needs its own specialist, release engineering has to exist from the start, and somebody has to own the data model across all of them.",
      },
      {
        name: "Commerce and B2B",
        copy: "A developer-weighted shape rather than a consultant-weighted one, and closer to a build than to a configuration programme.",
      },
    ],
  },
  related: {
    title: "Adjacent desks and where Salesforce work lands",
    links: [
      {
        href: "/intelligence/programme-staffing-blueprint/salesforce-multi-cloud",
        label: "Salesforce multi-cloud staffing blueprint",
        category: "Blueprint",
      },
      {
        href: "/platforms/informatica",
        label: "Informatica",
        category: "Platform",
      },
      {
        href: "/capabilities/integration-middleware",
        label: "Integration and middleware",
        category: "Capability",
      },
      { href: "/ai-talent", label: "AI talent", category: "Specialism" },
      {
        href: "/industries/retail",
        label: "Retail and consumer",
        category: "Industry",
      },
      { href: "/contract", label: "Contract", category: "Engagement" },
    ],
  },
};

const blueYonder: PlatformNarrative = {
  intro: {
    eyebrow: "The problem",
    title:
      "Supply chain software is bought as a suite and staffed as though it were one skill.",
    copy: [
      "Planning, warehouse and transport are three different benches that happen to share a vendor. A demand planner and a WMS technical consultant have almost nothing in common beyond the logo on the login screen, and a shortlist that treats them as one pool will fill the easy seat and miss the one holding the date.",
      "The warehouse side is the sharpest example. WMS work is functional until it is not, and then it needs somebody who can read and write MOCA, which is a narrow skill with no substitute and a market to match.",
      "The other constant is cutover. A distribution centre going live is a physical event with a fixed weekend and no partial rollback. The people who have owned one plan it differently from the people who have only planned one.",
    ],
  },
  scarce: {
    eyebrow: "Hard to fill",
    title: "The Blue Yonder roles that are scarce, and why.",
    copy: "The whole market is smaller than the ERP markets, so scarcity here is about absolute numbers as much as about experience.",
    roles: [
      {
        name: "Blue Yonder WMS Technical Consultant, MOCA",
        why: "A proprietary skill with no adjacent language that substitutes for it. Every non-trivial WMS build needs one and the population is measured in the hundreds rather than the thousands.",
      },
      {
        name: "Warehouse Cutover Lead",
        why: "A distribution centre go-live is a physical event with no soft launch. Ask what went wrong on the rehearsal, because everyone who has run one has an answer.",
      },
      {
        name: "Blue Yonder TMS Architect",
        why: "Transport work sits between the network design and the carrier contracts, so it needs someone fluent in both. That combination is rare and is usually held by people already inside a retailer.",
      },
      {
        name: "Blue Yonder Inventory Optimisation Lead",
        why: "Optimisation is easy to configure and hard to make trusted. The scarce experience is having held the business through the period when the system's recommendation disagrees with the planner.",
      },
      {
        name: "Blue Yonder Luminate Supply Chain Planner",
        why: "Planning skill and product skill are separate, and the market is full of people with one of them. The useful hire has both and has run a seasonal cycle.",
      },
      {
        name: "Blue Yonder Integration Developer",
        why: "Everything here talks to an ERP, a carrier and a store estate. Developers who have owned those interfaces in production are the difference between a go-live and a go-live with manual workarounds.",
      },
    ],
  },
  segments: {
    eyebrow: "Which programme are you running",
    title: "Three Blue Yonder shapes, and each has its own bench.",
    sub: "Naming the workstream is more useful than naming the suite.",
    items: [
      {
        name: "Planning and replenishment",
        copy: "Demand, supply and inventory. An analytical bench, and the hard part is adoption by planners rather than configuration.",
      },
      {
        name: "Warehouse management",
        copy: "The most technical of the three and the one with the fixed date. Functional consultants, MOCA capability and a cutover owner who has done it before.",
      },
      {
        name: "Merchandise and category planning",
        copy: "Financial planning, assortment and space. Closer to a retail finance bench than to a supply chain one, and frequently staffed from the wrong pool for exactly that reason.",
      },
    ],
  },
  related: {
    title: "Adjacent desks and where Blue Yonder work lands",
    links: [
      {
        href: "/industries/retail",
        label: "Retail and consumer",
        category: "Industry",
      },
      {
        href: "/industries/manufacturing",
        label: "Manufacturing and logistics",
        category: "Industry",
      },
      { href: "/platforms/sap", label: "SAP", category: "Platform" },
      {
        href: "/capabilities/integration-middleware",
        label: "Integration and middleware",
        category: "Capability",
      },
      { href: "/contract", label: "Contract", category: "Engagement" },
    ],
  },
};

const workday: PlatformNarrative = {
  intro: {
    eyebrow: "The problem",
    title:
      "Workday programmes are configuration-light and decision-heavy, and the bench has to match.",
    copy: [
      "The product resists modification by design, so the work is not build. It is business process design, security group design and integration, and the consultant who is good at those is not the one who is fastest at configuration screens.",
      "Security is the piece most often left late. Workday's model is granular and it touches every report, every business process and every test script, so a design that arrives near testing blocks the people who needed it weeks earlier.",
      "Integration is the other one. Payroll, benefits and finance counterparties all have their own formats and their own failure modes, and the studio work behind them is a specialism rather than a task for the functional team.",
    ],
  },
  scarce: {
    eyebrow: "Hard to fill",
    title: "The Workday roles that are scarce, and why.",
    copy: "Certification is gated by the vendor and by partner status, which keeps the qualified population structurally small compared with the ERP markets.",
    roles: [
      {
        name: "Workday Studio Developer",
        why: "The deepest technical skill on the platform and the least widely held. Most integration people stop at the packaged connectors, and the hard interfaces are exactly the ones that need more.",
      },
      {
        name: "Workday Security Consultant",
        why: "Domain and business process security decides who can test, and it is routinely designed too late. Consultants who have owned a security model through an audit are a narrow field.",
      },
      {
        name: "Workday PICOF and PECI Integration Developer",
        why: "Payroll interface work with specific formats and unforgiving downstream consumers. The experience does not generalise from other integration work.",
      },
      {
        name: "Multi-country Payroll Lead",
        why: "Needs product knowledge and statutory knowledge in more than one jurisdiction at once. That combination is scarce everywhere and scarcer in region.",
      },
      {
        name: "Workday Business Process Configuration Specialist",
        why: "The product's real surface area. The scarce version is the person who can say no to a requested step because they have seen what fifteen approvals do to adoption.",
      },
      {
        name: "Workday Extend Developer",
        why: "Newer, narrower and frequently claimed on CVs by people who have configured rather than built. Ask what they extended and why it could not be standard.",
      },
    ],
  },
  segments: {
    eyebrow: "Which programme are you running",
    title: "Three Workday shapes, and they staff differently.",
    sub: "The module in scope changes the bench more than the headcount does.",
    items: [
      {
        name: "HCM deployment",
        copy: "Core HR and the business processes around it. Functional and security weighted, with integration running alongside from the start rather than behind.",
      },
      {
        name: "Payroll and time",
        copy: "The least forgiving workstream on the platform, because it cannot be soft-launched. Parallel runs are the schedule, and the bench has to include someone who has taken one to sign-off.",
      },
      {
        name: "Financials and planning",
        copy: "Record to report, Accounting Centre and Adaptive Planning. A different bench again, and closer to a finance transformation than to an HR one.",
      },
    ],
  },
  related: {
    title: "Adjacent desks and where Workday work lands",
    links: [
      { href: "/platforms/oracle", label: "Oracle", category: "Platform" },
      { href: "/platforms/sap", label: "SAP", category: "Platform" },
      {
        href: "/capabilities/integration-middleware",
        label: "Integration and middleware",
        category: "Capability",
      },
      {
        href: "/industries/finance",
        label: "Banking and financial services",
        category: "Industry",
      },
      { href: "/eor", label: "Employer of Record", category: "Engagement" },
    ],
  },
};

const informatica: PlatformNarrative = {
  intro: {
    eyebrow: "The problem",
    title:
      "Data platform work is staffed as tooling, and it fails as governance.",
    copy: [
      "The developer who can build a mapping is not hard to find. The person who can tell you why the customer record is wrong, who owns it, and what has to change upstream, is a different hire and the one the programme actually needed.",
      "Modernisation is the other constant. Large PowerCenter estates are being moved to IDMC, and that migration needs somebody fluent in both, which is a pairing the market is actively losing rather than building as PowerCenter experience ages out.",
      "Yallo already carries a Salesforce desk, and Informatica now sits under the same owner. That means we can staff both sides of a convergence programme rather than one, which is the argument this desk exists to make.",
    ],
  },
  scarce: {
    eyebrow: "Hard to fill",
    title: "The Informatica roles that are scarce, and why.",
    copy: "Data work rewards experience over certification more than most, because the hard part is judgement about someone else's data rather than knowledge of the product.",
    roles: [
      {
        name: "Cloud Migration Specialist, PowerCenter to IDMC",
        why: "Needs fluency in a maturing estate and the platform replacing it. The pairing is the scarcest on this desk and the pool is shrinking rather than growing.",
      },
      {
        name: "MDM Solution Architect",
        why: "Master data is a governance problem wearing a technical costume. Architects who have made match and merge decisions stick with a business, rather than just configuring them, are rare.",
      },
      {
        name: "Data Governance Lead",
        why: "The role that is funded for the migration and not for the two years afterwards, which is when the data degrades. People who have held governance past go-live are unusual because few programmes fund it.",
      },
      {
        name: "Match and Merge Rules Developer",
        why: "A narrow, consequential skill. Getting it wrong merges two real customers or splits one, and both are discovered by the business rather than by a test.",
      },
      {
        name: "Integration Architect, CAI and API",
        why: "Real-time and event integration is a different discipline from batch, and most Informatica CVs are batch. Ask what they have run under load.",
      },
      {
        name: "Test Data Management Specialist",
        why: "Masking and test data provisioning are treated as a compliance checkbox until an audit or a breach makes them urgent. Very few people have built one properly.",
      },
    ],
  },
  segments: {
    eyebrow: "Which programme are you running",
    title: "Three Informatica shapes, and each takes a different bench.",
    sub: "The estate you have decides which of these you are actually buying.",
    items: [
      {
        name: "PowerCenter estate, running",
        copy: "Run and support work with an ageing skill base. The staffing risk is availability rather than capability, and it gets worse each year.",
      },
      {
        name: "Modernisation to IDMC",
        copy: "Assessment and migration. Needs the dual-fluency pairing, and the assessment is worth more than the migration if it is done by somebody who has already done one.",
      },
      {
        name: "Governance and MDM build",
        copy: "Quality, catalogue and master data. Closer to a business change programme than to a data engineering one, and mis-staffed whenever it is treated as the latter.",
      },
    ],
  },
  related: {
    title: "Adjacent desks and where Informatica work lands",
    links: [
      {
        href: "/platforms/salesforce",
        label: "Salesforce",
        category: "Platform",
      },
      {
        href: "/capabilities/data-analytics",
        label: "Data and AI",
        category: "Capability",
      },
      {
        href: "/capabilities/integration-middleware",
        label: "Integration and middleware",
        category: "Capability",
      },
      { href: "/ai-talent", label: "AI talent", category: "Specialism" },
      { href: "/contract", label: "Contract", category: "Engagement" },
    ],
  },
};

const narratives: Record<string, PlatformNarrative> = {
  sap,
  oracle,
  microsoft,
  salesforce,
  "blue-yonder": blueYonder,
  workday,
  informatica,
};

export function platformNarrative(slug: string): PlatformNarrative | null {
  return narratives[slug] ?? null;
}
