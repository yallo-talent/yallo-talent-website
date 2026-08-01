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
 * Optional per platform. Only SAP is authored, and the six others render
 * exactly as before — each section is gated on presence, so this adds nothing
 * empty anywhere.
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
    title: "An SAP programme is not short of consultants. It is short of the four or five who have done this exact thing.",
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

const narratives: Record<string, PlatformNarrative> = { sap };

export function platformNarrative(slug: string): PlatformNarrative | null {
  return narratives[slug] ?? null;
}
