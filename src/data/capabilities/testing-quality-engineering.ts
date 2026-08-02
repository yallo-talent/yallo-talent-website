import { taxonomyLabels } from "@/data/l1/index";
import type { L1PageData } from "@/data/l1/types";

/**
 * Testing & Quality Engineering, seeded 1 Aug 2026.
 *
 * Content from docs/design/context-capabilities-parity-round.md §4.4.
 *
 * This is the desk that carried defect D1: it was rendering the retired
 * `emerging-technologies` description, "Blockchain, IoT, digital twin and
 * quantum-adjacent talent", left attached to it when that discipline was retired
 * under canon §3. It now has its own description in src/data/l1/index.ts and its
 * own page here, and the orphan string exists nowhere in the repo.
 *
 * THE ARGUMENT THIS PAGE MAKES, and it is grounded rather than rhetorical. §4.4
 * says test roles are the ones programmes cut first and regret. That is already
 * repo content and not a new claim: the Programme Staffing Blueprint's SAP S/4HANA
 * archetype lists test automation in its under-scoped section, with the
 * consequence spelled out. The page cross-links to the archetypes and restates no
 * figure of any kind.
 *
 * JUDGEMENT CALL, LOGGED FOR SUMEET. The dispatch names this desk "Testing &
 * Quality" in its summary list while canon §3 and the taxonomy index both carry
 * "Testing & Quality Engineering". The canon label is used throughout, on the
 * ground that a taxonomy label is not something to shorten in passing and the
 * discipline includes quality engineering in the pipeline as a named sub-desk.
 * Flagged so Sumeet can rule the other way if the shorter label was intended.
 */
export const testingQualityEngineeringData: L1PageData = {
  slug: "testing-quality-engineering",
  category: "capabilities",
  breadcrumb: [
    { label: "Capabilities", href: "/capabilities" },
    { label: taxonomyLabels("testing-quality-engineering").label },
  ],

  eyebrow: "Testing & Quality Engineering · Contract-first",
  title: "Test and quality engineering contractors,",
  sectorNoun: "testing and quality engineering",
  emphasis: "shortlisted in 72 hours.",
  sub: "Test managers, automation engineers, performance specialists and test data leads for enterprise programmes across the Middle East, Europe and India. The stream that gets cut in planning and rebuilt in a panic before go-live.",
  primaryCta: { label: "Send us a brief", href: "/brief" },
  secondaryCta: { label: "View expertise", href: "#expertise" },
  statusDots: [
    "72h brief to shortlist",
    "Active contractor bench",
    "Middle East · Europe · India",
    "Contract · EOR · Managed Delivery",
  ],

  introEyebrow: "Why us for Testing & Quality Engineering",
  introTitle:
    "Testing is the first stream cut and the one every delayed programme wishes it had kept.",
  introCopy: [
    "This is the most predictable staffing mistake in enterprise delivery. Test automation is scoped as a task inside another stream, manual regression is planned once and then needed every cycle, and by the second test cycle the programme is paying for a full manual pass it did not budget for. Our own Programme Staffing Blueprint names it in the under-scoped list for the S/4HANA archetype, because it happens on nearly every one.",
    "The market makes it worse by treating test roles as interchangeable. A functional test analyst, an automation engineer and a performance engineer are three different disciplines, and a test architect is a fourth. We screen for the specific one: whether an automation engineer has maintained a suite past the point where it became slow, and whether a performance engineer has produced a result a programme board acted on rather than a report it filed.",
  ],
  introStatCards: [
    {
      n: "72%",
      l: "of employers can't find the skilled talent they need — with AI, IT and data roles now the hardest to fill.",
      source: "ManpowerGroup Talent Shortage Survey, 2026",
    },
  ],

  scarceEyebrow: "Scarce talent · high demand",
  scarceTitle: "The test roles every enterprise programme fights over.",
  scarceCopy:
    "These are the specialists that appear on every test brief and disappear from the market fastest, usually at the point a programme has decided it needs them urgently. Yallo maintains an active bench in each of these areas across the Middle East, Europe and India.",
  scarceCta: { label: "Brief us on a scarce role", href: "/brief" },
  scarceRoles: [
    { name: "Test Architect", scarcity: "high", engagement: "contract" },
    {
      name: "Performance Test Engineer",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "Software Development Engineer in Test",
      scarcity: "high",
      engagement: "contract-perm",
    },
    { name: "Test Data Manager", scarcity: "high", engagement: "contract" },
    {
      name: "Non-functional Test Lead",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "Accessibility Test Specialist",
      scarcity: "med",
      engagement: "contract",
    },
    { name: "Environment Manager", scarcity: "med", engagement: "contract" },
    { name: "Test Manager", scarcity: "med", engagement: "contract-perm" },
  ],

  expertiseEyebrow: "Our expertise",
  expertiseTitle: "Every test discipline, with a contractor bench behind it.",
  expertiseSub:
    "From test strategy at design gate to the accessibility audit nobody scheduled, specialists we place into every function that decides whether a release is safe.",
  expertise: [
    {
      slug: "test-strategy-management",
      num: "01",
      title: "Test Strategy & Management",
      icon: "cases",
      blurb: "Strategy, planning, test governance and reporting.",
      overview:
        "The test manager's real job is telling a programme board something it does not want to hear, with evidence, early enough to matter. Everything else is coordination. We screen for people who have held a quality position against schedule pressure and can describe the call they made and what happened: which defects they were willing to go live with, which they were not, and how they defended the difference.",
      roles: ["Test Manager", "Test Lead", "Quality Engineering Manager"],
      tools: [
        {
          slug: "xray-zephyr",
          vendor: "Atlassian",
          name: "Xray and Zephyr",
          roles: ["Test Manager", "Test Lead", "Functional Test Analyst"],
        },
      ],
    },
    {
      slug: "test-automation",
      num: "02",
      title: "Test Automation Engineering",
      icon: "spark",
      blurb: "Playwright, Selenium, Cypress, Tosca, Worksoft.",
      overview:
        "Nearly every automation suite we see was built successfully and then abandoned, because it became slower and less trustworthy than running the tests by hand. Maintainability is the whole discipline. We screen for engineers who have owned a suite over time: how they handled flakiness, what their selector strategy was on a packaged application whose markup they did not control, and what they deleted when coverage stopped earning its runtime.",
      roles: [
        "QA Automation Engineer",
        "Software Development Engineer in Test",
        "Test Architect",
      ],
      tools: [
        {
          slug: "playwright",
          vendor: "Playwright",
          name: "Playwright",
          roles: [
            "QA Automation Engineer",
            "Software Development Engineer in Test",
            "Test Architect",
          ],
        },
        {
          slug: "selenium",
          vendor: "Selenium",
          name: "Selenium",
          roles: ["QA Automation Engineer", "Test Architect"],
        },
        {
          slug: "cypress",
          vendor: "Cypress",
          name: "Cypress",
          roles: [
            "QA Automation Engineer",
            "Software Development Engineer in Test",
          ],
        },
        {
          slug: "tosca",
          vendor: "Tricentis",
          name: "Tricentis Tosca",
          roles: ["QA Automation Engineer", "Test Architect", "Test Lead"],
        },
      ],
    },
    {
      slug: "functional-regression",
      num: "03",
      title: "Functional & Regression Testing",
      icon: "analytics",
      blurb: "Functional analysis, regression cycles, packaged applications.",
      overview:
        "On a packaged platform the scarce skill is not testing technique, it is knowing the business process well enough to recognise a wrong result that the system reports as a success. A tester who understands order-to-cash will find defects a technically stronger tester without that knowledge walks past. We screen for process depth on the specific platform, and place functional analysts who have run regression through more than one release cycle on it.",
      roles: [
        "Functional Test Analyst",
        "Integration Test Analyst",
        "User Acceptance Coordinator",
      ],
      tools: [
        {
          slug: "sap-cbta",
          vendor: "SAP",
          name: "SAP CBTA",
          roles: ["Functional Test Analyst", "QA Automation Engineer"],
        },
        {
          slug: "worksoft",
          vendor: "Worksoft",
          name: "Worksoft",
          roles: ["Functional Test Analyst", "QA Automation Engineer"],
        },
        {
          slug: "provar",
          vendor: "Provar",
          name: "Provar",
          roles: ["QA Automation Engineer", "Functional Test Analyst"],
        },
      ],
    },
    {
      slug: "performance-engineering",
      num: "04",
      title: "Performance & Load Engineering",
      icon: "demand",
      blurb: "JMeter, k6, LoadRunner, NeoLoad.",
      overview:
        "Performance testing is commissioned late, run once against an environment that does not resemble production, and reported in a document nobody can act on. A performance engineer worth placing works the other way round: agrees the workload model with the business first, insists on representative data volumes, and produces a bottleneck with a named cause. We screen on diagnosis rather than tooling, because generating load is the trivial part.",
      roles: [
        "Performance Test Engineer",
        "Non-functional Test Lead",
        "Test Architect",
      ],
      tools: [
        {
          slug: "jmeter",
          vendor: "Apache",
          name: "JMeter",
          roles: ["Performance Test Engineer", "Non-functional Test Lead"],
        },
        {
          slug: "k6",
          vendor: "Grafana",
          name: "k6",
          roles: [
            "Performance Test Engineer",
            "Software Development Engineer in Test",
          ],
        },
        {
          slug: "loadrunner",
          vendor: "OpenText",
          name: "LoadRunner",
          roles: ["Performance Test Engineer", "Non-functional Test Lead"],
        },
        {
          slug: "neoload",
          vendor: "Tricentis",
          name: "NeoLoad",
          roles: ["Performance Test Engineer"],
        },
      ],
    },
    {
      slug: "non-functional-resilience",
      num: "05",
      title: "Non-functional & Resilience Testing",
      icon: "security",
      blurb: "Failover, disaster recovery, resilience and operability.",
      overview:
        "Most programmes test that the system works and assume it will keep working. Resilience testing is the discipline that checks the second half: failover that has actually been executed rather than documented, recovery inside the time the business was promised, and behaviour when a dependency is slow rather than down, which is the harder and more common case. We screen for people who have run a real failover test on a production-like estate and found something.",
      roles: [
        "Non-functional Test Lead",
        "Test Architect",
        "Performance Test Engineer",
      ],
      tools: [
        {
          slug: "resilience-testing",
          vendor: "Resilience",
          name: "Failover and disaster recovery testing",
          roles: ["Non-functional Test Lead", "Test Architect"],
        },
      ],
    },
    {
      slug: "test-data-environments",
      num: "06",
      title: "Test Data & Environment Management",
      icon: "mdm",
      blurb: "Delphix, Informatica TDM, environment planning.",
      overview:
        "Test data and environments are the constraint that quietly sets the pace of every test cycle, and the two roles that own them are the first to be treated as overhead. Masked data that is still referentially valid, a refresh that does not take a week, and an environment schedule three streams can share. We screen for people who have untangled a contended environment plan, because that is the work, and place them early enough to matter.",
      roles: ["Test Data Manager", "Environment Manager", "Test Lead"],
      tools: [
        {
          slug: "delphix",
          vendor: "Delphix",
          name: "Delphix",
          roles: ["Test Data Manager", "Environment Manager"],
        },
        {
          slug: "informatica-tdm",
          vendor: "Informatica",
          name: "Informatica Test Data Management",
          roles: ["Test Data Manager", "Data Quality Consultant"],
        },
      ],
    },
    {
      slug: "accessibility-testing",
      num: "07",
      title: "Accessibility Testing",
      icon: "workforce",
      blurb: "WCAG conformance, assistive technology, axe.",
      overview:
        "Accessibility is usually discovered at the end, when it is a remediation programme rather than a test activity, and automated tooling finds only part of it. The specialists worth placing test with the assistive technology a real user has, can tell the difference between a technical pass and something a screen reader user can actually complete, and write findings a development team can act on. Public sector and regulated buyers increasingly require this evidence, and we name what a specialist is screened against rather than interpreting any obligation.",
      roles: [
        "Accessibility Test Specialist",
        "Functional Test Analyst",
        "Test Lead",
      ],
      tools: [
        {
          slug: "axe",
          vendor: "Deque",
          name: "axe",
          roles: ["Accessibility Test Specialist", "QA Automation Engineer"],
        },
        {
          slug: "wcag",
          vendor: "W3C",
          name: "WCAG 2.2",
          roles: ["Accessibility Test Specialist", "Test Lead"],
          benchNote:
            "Named as a standard specialists are screened against. Yallo does not interpret what any standard obliges.",
        },
      ],
    },
    {
      slug: "quality-in-pipeline",
      num: "08",
      title: "Quality Engineering in the Pipeline",
      icon: "integration",
      blurb: "Shift-left, API testing, quality gates in CI.",
      overview:
        "Quality engineering moves the work from a phase to a gate, which sounds like a process change and is really a hiring change: it needs engineers who write tests as part of the build rather than testers who arrive after it. API-level coverage where it is cheap, contract tests between services, and a gate that fails a build for a reason the team accepts. We screen for people who have put a gate into someone else's pipeline and got it adopted.",
      roles: [
        "Software Development Engineer in Test",
        "Quality Engineering Manager",
        "Integration Test Analyst",
      ],
      tools: [
        {
          slug: "postman",
          vendor: "Postman",
          name: "Postman",
          roles: ["Integration Test Analyst", "QA Automation Engineer"],
        },
        {
          slug: "rest-assured",
          vendor: "REST Assured",
          name: "REST Assured",
          roles: [
            "Software Development Engineer in Test",
            "Integration Test Analyst",
          ],
        },
        {
          slug: "appium-browserstack",
          vendor: "BrowserStack",
          name: "Appium and BrowserStack",
          roles: ["QA Automation Engineer", "Mobile Test Engineer"],
        },
      ],
    },
  ],

  segmentsEyebrow: "Where we deploy",
  segmentsTitle: "Every sector runs a test cycle — we staff them all.",
  segmentsSub:
    "A bank's regulatory evidence, a retailer's peak readiness or a hospital's clinical safety case changes which test specialist you need. Same screened bench, calibrated to the operating context.",
  segments: [
    {
      id: "retail",
      name: taxonomyLabels("retail").label,
      intro:
        "Peak load readiness, omnichannel regression and store estate testing for retail programmes.",
      roles: [
        "Performance Test Engineer",
        "QA Automation Engineer",
        "Test Data Manager",
      ],
    },
    {
      id: "manufacturing",
      name: taxonomyLabels("manufacturing").label,
      intro:
        "ERP regression, warehouse system testing and integration cycles for manufacturing programmes.",
      roles: [
        "Functional Test Analyst",
        "Integration Test Analyst",
        "QA Automation Engineer",
      ],
    },
    {
      id: "finance",
      name: taxonomyLabels("finance").label,
      intro:
        "Regulatory test evidence, payment testing and resilience validation for banking and financial services programmes.",
      roles: [
        "Test Manager",
        "Non-functional Test Lead",
        "Performance Test Engineer",
      ],
    },
    {
      id: "government",
      name: taxonomyLabels("government").label,
      intro:
        "Accessibility conformance, citizen service testing and acceptance coordination for government programmes.",
      roles: [
        "Accessibility Test Specialist",
        "Test Manager",
        "User Acceptance Coordinator",
      ],
    },
    {
      id: "healthcare",
      name: taxonomyLabels("healthcare").label,
      intro:
        "Validated testing, clinical safety evidence and controlled environment management for healthcare programmes.",
      roles: ["Test Lead", "Environment Manager", "Functional Test Analyst"],
    },
    {
      id: "telco",
      name: taxonomyLabels("telco").label,
      intro:
        "High-volume performance testing, order-to-activation regression and OSS/BSS test cycles for telco and media programmes.",
      roles: [
        "Performance Test Engineer",
        "Test Architect",
        "Integration Test Analyst",
      ],
    },
    {
      id: "education",
      name: taxonomyLabels("education").label,
      intro:
        "Parallel run and reconciliation on student records, registration load testing and accessibility conformance for institutional systems.",
      roles: [
        "Test Manager, education systems",
        "Performance Test Engineer",
        "Accessibility Test Specialist",
      ],
    },
  ],

  relatedTitle: "Related pages",
  /* The Blueprint archetypes, per §4.4: all three name an under-scoped stream, and
     the SAP one names test automation explicitly. Linked, not restated, and no
     figure travels with the link. */
  related: [
    {
      href: "/intelligence/programme-staffing-blueprint/sap-s4hana",
      label: "SAP S/4HANA staffing blueprint",
      category: "Blueprint",
    },
    {
      href: "/intelligence/programme-staffing-blueprint/oracle-fusion",
      label: "Oracle Fusion staffing blueprint",
      category: "Blueprint",
    },
    {
      href: "/intelligence/programme-staffing-blueprint/salesforce-multi-cloud",
      label: "Salesforce multi-cloud staffing blueprint",
      category: "Blueprint",
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
  ],

  seo: {
    title: "Testing & Quality Engineering Contractors · Yallo Talent",
    description:
      "Specialist-screened test contractors: automation, performance, test data, accessibility and quality engineering. 72h shortlist across the Middle East, Europe and India.",
  },
};
