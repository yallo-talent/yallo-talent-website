/**
 * The talent research family — five pieces, published open, plus one gated
 * cross-market synthesis.
 *
 * Ruled by Sumeet, 6 August 2026 (R-A3, R-A4). Route shape and slugs from
 * context-round14-research.md §3; conclusions from context-round16-scope.md
 * §2.3. Constraints from round 14's brief §1, restated at the foot of this
 * comment because they are the reason several obvious shapes are absent.
 *
 * NOT ONE FIGURE IS TYPED HERE. Every number resolves through ./dataset,
 * generated from the extract. The prose states Yallo's conclusion; the
 * arithmetic comes from the source. That is what makes the analysis the
 * product rather than a restatement of LinkedIn's tables, which is the
 * licence mitigation and the quality bar at once.
 *
 * THREE DRAFTED CLAIMS DID NOT SURVIVE VERIFICATION and are corrected here.
 * Recorded rather than quietly fixed, because each is a class of error:
 *
 *   1. "Azure DevOps Services at 48.7% is the highest ratio in the dataset."
 *      It is not. Salesforce Marketing Cloud is 60.3% and Oracle E-Business
 *      Suite 58.6%. It is the highest ratio in the cloud family, which is
 *      what the piece now says. `ltiHighestRatio` is derived so the
 *      superlative cannot drift again.
 *   2. "573 professionals hold any of Bedrock, Foundry or Vertex AI."
 *      That is the sum of three overlapping skill counts, and the corpus's
 *      own second constraint says these counts overlap. The union is smaller
 *      and the extract cannot give it. Stated as declarations, with the
 *      overlap said out loud — which is a stronger finding, not a weaker one.
 *   3. "The Gulf" is not a column in the extract. Every Gulf-versus-UK
 *      comparison is constructed, and the drafted figures reproduce under an
 *      unweighted mean of the Saudi and UAE ratios rather than a pooled
 *      share. The mean is used, and the methodology note says so.
 *
 * FORBIDDEN, and there is no field for any of them: a compensation or rate
 * figure; a pie or stacked chart (the skill counts overlap and can exceed
 * 100% together, so those chart types would assert a false whole); a
 * time-to-fill or hardest-to-hire claim (this is supply-side data and says
 * nothing about demand); a cross-family baseline comparison (baselines are
 * the width of a title net, not the size of a market).
 *
 * THE SALESFORCE PIECE IS A PLANNING ARGUMENT, NOT A VERDICT ON A MARKET.
 * Round 16's fourth constraint, and Yallo sells into Saudi Arabia. The
 * finding stands exactly as measured; the framing is what a mobilisation
 * plan has to account for and why the corridor exists.
 */
import {
  LTI_AS_AT_DISPLAY,
  LTI_SOURCE,
  ltiFamily,
  ltiHighestRatio,
  ltiSkill,
} from "./dataset";

export const RESEARCH_BASE = "/intelligence/research";

/** "27.4%" from 27.38. One decimal everywhere, so the set reads as one set. */
function pct(n: number): string {
  return `${n.toFixed(1)}%`;
}

/** "2,169". UK grouping. */
function count(n: number): string {
  return n.toLocaleString("en-GB");
}

/** "+4.3 points" / "4.3 points lower" — direction said in words, not a sign. */
function points(n: number): string {
  return `${Math.abs(n).toFixed(1)} percentage points`;
}

/**
 * A chart is bars or it is nothing.
 *
 * There is deliberately no `kind` field and no pie or stacked variant to
 * select. A chart type that asserts a whole cannot be built from these
 * numbers, so the way to stop one being built is not to model it. Each bar is
 * an independent statement of the form "this share of the pool declares this
 * skill"; two bars may legitimately sum past 100 and the caption says so.
 */
export interface ResearchBar {
  label: string;
  /** Percentage of the family baseline, or an absolute headcount. */
  value: number;
  /** The figure as it should read beside the bar. */
  display: string;
  /** Draws the eye to the bar the surrounding paragraph is about. */
  emphasis?: boolean;
}

/**
 * Which functional series token the bars take.
 *
 * `info` is globals.css Layer 1's "data series, in-region availability".
 * `signal` is its "scarcity, criticality, hard to fill". Chosen per chart
 * rather than per bar, because the semantic belongs to what the chart is
 * about: a chart showing how a pool distributes is an information chart even
 * when one of its bars is small, and a chart whose subject is scarcity is a
 * scarcity chart throughout. Per-bar colour would encode a judgement the
 * reader cannot see the rule for.
 */
export type ResearchChartTone = "info" | "signal";

export interface ResearchChart {
  caption: string;
  /** Why these bars do not add up to anything. Rendered, never omitted. */
  note: string;
  /** The axis maximum, so sibling charts share a scale where that is honest. */
  max: number;
  tone: ResearchChartTone;
  bars: ResearchBar[];
}

export interface ResearchSection {
  heading: string;
  paragraphs: string[];
  chart?: ResearchChart;
}

export interface ResearchPiece {
  slug: string;
  /** The desk this piece is keyed to. The slug is the desk's own. */
  deskHref: string;
  /** Further desks the finding touches. Labels derive from the href. */
  crossLinks: string[];
  title: string;
  /** Short form for cards and the assistant's citation links. */
  cardTitle: string;
  standfirst: string;
  seoTitle: string;
  seoDescription: string;
  sections: ResearchSection[];
  /** The one-line conclusion, reused by the index, the PDF and the corpus. */
  conclusion: string;
}

/* ── 1 · SAP ─────────────────────────────────────────────────────────────── */

const sapFamily = ltiFamily("SAP");
const sapMigration = ltiSkill("SAP", "Data migration");
const sapSecurity = ltiSkill("SAP", "Security (Security+Auth+GRC)");
const sapIntegration = ltiSkill("SAP", "Integration (Cloud Platform)");

const sap: ResearchPiece = {
  slug: "sap",
  deskHref: "/platforms/sap",
  crossLinks: ["/platforms/oracle", "/capabilities/integration-middleware"],
  title: "SAP: the pool is weighted toward the phase that ends",
  cardTitle: "SAP talent",
  standfirst:
    "Data migration is the largest declared skill in the regional SAP pool and security is the thinnest. A rollout can staff the workstream that finishes and will struggle to staff the one that never does.",
  seoTitle: "SAP talent across the UK, Saudi Arabia and the UAE | Yallo Talent",
  seoDescription:
    "What the declared skills of the regional SAP pool say about staffing a rollout: migration is abundant, security is thin, and integration runs higher in the Gulf.",
  conclusion:
    "The SAP market has declared its skills around go-live events, so a programme staffs its migration workstream from the pool and has to plan for its security workstream.",
  sections: [
    {
      heading: "The market declared its skills around go-live",
      paragraphs: [
        `Data migration is the largest named skill in the SAP pool: ${pct(sapMigration.ratioCombined)} of ${count(sapFamily.baseline.combined)} professionals across the UK, Saudi Arabia and the UAE, ${count(sapMigration.combined)} people. Security is the thinnest at ${pct(sapSecurity.ratioCombined)}.`,
        "That ordering is not an accident of sampling. Migration is the workstream with a date on it, visible on every programme plan, and the skill a consultant can name after one cutover. Security is the workstream that runs after go-live and never finishes, and it is the line that gets cut at business-case stage when the number needs to come down.",
        `The regional market has, in effect, declared its skills around go-live events. A rollout can therefore staff its migration workstream from the pool. It will struggle to staff its security workstream from the same pool, and the shortfall arrives at the point in the programme where there is least room to absorb it.`,
      ],
      chart: {
        caption: `Share of the SAP pool declaring each skill, all three markets, as at ${LTI_AS_AT_DISPLAY}`,
        note: "Each bar is an independent share of the same pool. One professional commonly declares several of these skills, so the bars overlap and are not parts of a whole.",
        max: 30,
        tone: "info",
        bars: [
          {
            label: "Data migration",
            value: sapMigration.ratioCombined,
            display: pct(sapMigration.ratioCombined),
            emphasis: true,
          },
          {
            label: "Integration",
            value: sapIntegration.ratioCombined,
            display: pct(sapIntegration.ratioCombined),
          },
          {
            label: "Security, authorisations and GRC",
            value: sapSecurity.ratioCombined,
            display: pct(sapSecurity.ratioCombined),
            emphasis: true,
          },
        ],
      },
    },
    {
      heading: "The UAE skews hardest toward migration",
      paragraphs: [
        `Migration is highest in the UAE at ${pct(sapMigration.ratioUae)}, against ${pct(sapMigration.ratioUk)} in the UK. Integration runs ${points(sapIntegration.gulfVsUkMean)} higher in the Gulf than in the UK.`,
        "Integration running higher in the Gulf is consistent with a region that bought a great many platforms in a short period and then had to join them together. That is a coherent picture of a market's recent history rather than a curiosity, and it is useful: an integration-heavy programme has more to work with regionally than the headline pool size suggests.",
      ],
      chart: {
        caption: `SAP integration skills by market, as at ${LTI_AS_AT_DISPLAY}`,
        note: "Three independent shares of three different pools. The markets are not being added together here.",
        max: 20,
        tone: "info",
        bars: [
          {
            label: "United Kingdom",
            value: sapIntegration.ratioUk,
            display: pct(sapIntegration.ratioUk),
          },
          {
            label: "Saudi Arabia",
            value: sapIntegration.ratioSaudi,
            display: pct(sapIntegration.ratioSaudi),
          },
          {
            label: "United Arab Emirates",
            value: sapIntegration.ratioUae,
            display: pct(sapIntegration.ratioUae),
            emphasis: true,
          },
        ],
      },
    },
  ],
};

/* ── 2 · Oracle ──────────────────────────────────────────────────────────── */

const oracleFamily = ltiFamily("Oracle");
const oraclePayroll = ltiSkill("Oracle", "Payroll");
const oracleFinancials = ltiSkill("Oracle", "Financials");
const oracleFusion = ltiSkill("Oracle", "Fusion (OFA+HCM)");
const oracleEbs = ltiSkill("Oracle", "E-Business Suite");

const oracle: ResearchPiece = {
  slug: "oracle",
  deskHref: "/platforms/oracle",
  crossLinks: ["/eor", "/platforms/sap"],
  title: "Oracle: the Gulf is the deep end, and payroll is still the problem",
  cardTitle: "Oracle talent",
  standfirst:
    "Oracle is the one family where the Gulf holds the deeper pool. Depth is not evenness: inside it, payroll is the scarcest named skill in the entire dataset, and payroll is the workstream that cannot slip.",
  seoTitle:
    "Oracle talent across the UK, Saudi Arabia and the UAE | Yallo Talent",
  seoDescription:
    "Oracle carries the highest Gulf share of any platform family measured, with Financials and Fusion both stronger than the UK. Payroll is the exception, and it is the workstream with a legal date on it.",
  conclusion:
    "For a Fusion programme in the Gulf: staff finance locally, and treat payroll as a corridor role from day one rather than discovering it late.",
  sections: [
    {
      heading: "The one family where the Gulf is the deep end",
      paragraphs: [
        `${pct(oracleFamily.gulfShareOfPool)} of the Oracle professionals measured sit in Saudi Arabia or the UAE: the highest Gulf share of any family in the set. Financials runs ${points(oracleFinancials.gulfVsUkMean)} higher in the Gulf than in the UK, and Fusion ${points(oracleFusion.gulfVsUkMean)} higher.`,
        "This matters because the corridor is usually described in one direction, as though the Gulf were short of everything and the UK had a surplus. On Oracle it is the other way round. The two ends of the corridor specialise; neither is simply the shallow end.",
      ],
      chart: {
        caption: `Oracle skills, Gulf against the UK, as at ${LTI_AS_AT_DISPLAY}`,
        note: "The Gulf figure is the unweighted mean of the Saudi and UAE shares. Each pair is one skill measured in two places, not two parts of a total.",
        max: 65,
        tone: "info",
        bars: [
          {
            label: "E-Business Suite, UK",
            value: oracleEbs.ratioUk,
            display: pct(oracleEbs.ratioUk),
          },
          {
            label: "E-Business Suite, Gulf",
            value: oracleEbs.gulfMean,
            display: pct(oracleEbs.gulfMean),
          },
          {
            label: "Financials, UK",
            value: oracleFinancials.ratioUk,
            display: pct(oracleFinancials.ratioUk),
          },
          {
            label: "Financials, Gulf",
            value: oracleFinancials.gulfMean,
            display: pct(oracleFinancials.gulfMean),
            emphasis: true,
          },
          {
            label: "Fusion, UK",
            value: oracleFusion.ratioUk,
            display: pct(oracleFusion.ratioUk),
          },
          {
            label: "Fusion, Gulf",
            value: oracleFusion.gulfMean,
            display: pct(oracleFusion.gulfMean),
            emphasis: true,
          },
        ],
      },
    },
    {
      heading: "Payroll is the scarcest named skill anywhere in the set",
      paragraphs: [
        `${count(oraclePayroll.combined)} professionals across all three markets declare Oracle payroll: ${count(oraclePayroll.uk)} in the UK, ${count(oraclePayroll.saudi)} in Saudi Arabia, ${count(oraclePayroll.uae)} in the UAE. That is ${pct(oraclePayroll.ratioCombined)} of the Oracle pool, and the smallest named skill in the entire extract.`,
        "Payroll is also the workstream that cannot slip. It is legally dated, it touches every employee, and it is the one part of a Fusion programme where a missed date is visible outside the programme on the same day it happens.",
        "So the planning consequence is specific rather than general. Finance can be staffed from the Gulf pool with confidence. Payroll cannot be staffed from any of these three markets on the assumption that a search will simply find someone, and a plan that assumes it will is carrying an unpriced risk in its most exposed workstream.",
      ],
      chart: {
        caption: `Oracle payroll professionals by market, as at ${LTI_AS_AT_DISPLAY}`,
        note: "Headcounts, not shares. These are the people the extract found, in the whole of each market.",
        max: 50,
        tone: "signal",
        bars: [
          {
            label: "United Kingdom",
            value: oraclePayroll.uk,
            display: count(oraclePayroll.uk),
          },
          {
            label: "Saudi Arabia",
            value: oraclePayroll.saudi,
            display: count(oraclePayroll.saudi),
            emphasis: true,
          },
          {
            label: "United Arab Emirates",
            value: oraclePayroll.uae,
            display: count(oraclePayroll.uae),
            emphasis: true,
          },
        ],
      },
    },
    {
      heading: "Which is the friction the EOR pillar exists to remove",
      paragraphs: [
        "Treating payroll as a corridor role from day one means deciding, at business case, that the specialist will be engaged from outside the country and that someone has to be able to employ them there. That is entity and payroll friction, and it is precisely what an employer of record removes.",
        "The connection is worth stating plainly because it runs the right way round: the data did not go looking for a service to justify. The scarcest skill in the set happens to sit in the workstream with the least tolerance for delay, and the mechanism for staffing it across a border already exists.",
      ],
    },
  ],
};

/* ── 3 · Salesforce ──────────────────────────────────────────────────────── */

const salesforceFamily = ltiFamily("Salesforce");
const sfCommerce = ltiSkill("Salesforce", "Commerce Cloud (SFCC+B2B+B2C)");
const sfMarketing = ltiSkill("Salesforce", "Marketing Cloud+AMPscript");
const sfService = ltiSkill("Salesforce", "Service Cloud");
const sfDx = ltiSkill("Salesforce", "DX (release engineering)");
const sfMigration = ltiSkill("Salesforce", "Data migration");

const salesforce: ResearchPiece = {
  slug: "salesforce",
  deskHref: "/platforms/salesforce",
  crossLinks: ["/managed-delivery", "/contract"],
  title:
    "Salesforce: why a Riyadh programme is a mobilisation planning problem",
  cardTitle: "Salesforce talent",
  standfirst:
    "The local Salesforce pool in Saudi Arabia is small enough to count. That is not a reason to avoid the market; it is a reason to decide how the programme will be staffed at business case rather than at week six.",
  seoTitle:
    "Salesforce talent across the UK, Saudi Arabia and the UAE | Yallo Talent",
  seoDescription:
    "What the measured Salesforce pool means for mobilising a programme in the Gulf: plan the corridor at business case, because the arithmetic will not change during the project.",
  conclusion:
    "A Salesforce programme in Riyadh is a corridor programme by arithmetic. The planning question is not whether specialists come from outside, it is whether the plan says so at business case or discovers it at week six.",
  sections: [
    {
      heading: "The number, and what it is not",
      paragraphs: [
        `The extract finds ${count(salesforceFamily.baseline.saudi)} Salesforce professionals in the whole of Saudi Arabia, against ${count(salesforceFamily.baseline.uk)} in the UK. Inside that ${count(salesforceFamily.baseline.saudi)}: Marketing Cloud ${count(sfMarketing.saudi)}, Service Cloud ${count(sfService.saudi)}, data migration ${count(sfMigration.saudi)}, release engineering ${count(sfDx.saudi)}, and Commerce Cloud ${count(sfCommerce.saudi)}.`,
        "This is a supply measurement and nothing more. It says how many professionals declare the skill; it says nothing about how many roles are open, how long a hire takes, or how capable the market is. Saudi Arabia is building enterprise capability quickly and the picture will not look like this indefinitely.",
        "What it does say is that a Salesforce programme in Riyadh cannot assume a local starting point, and a commerce programme has none at all. That is arithmetic, and arithmetic is planning information.",
      ],
      chart: {
        caption: `Salesforce professionals declaring each skill in Saudi Arabia, as at ${LTI_AS_AT_DISPLAY}`,
        note: "Headcounts within a single market. Professionals declare more than one of these, so the bars overlap.",
        max: 20,
        tone: "signal",
        bars: [
          {
            label: "Marketing Cloud",
            value: sfMarketing.saudi,
            display: count(sfMarketing.saudi),
          },
          {
            label: "Service Cloud",
            value: sfService.saudi,
            display: count(sfService.saudi),
          },
          {
            label: "Data migration",
            value: sfMigration.saudi,
            display: count(sfMigration.saudi),
          },
          {
            label: "Release engineering",
            value: sfDx.saudi,
            display: count(sfDx.saudi),
          },
          {
            label: "Commerce Cloud",
            value: sfCommerce.saudi,
            display: count(sfCommerce.saudi),
            emphasis: true,
          },
        ],
      },
    },
    {
      heading: "Mobilisation planning is the whole of the difference",
      paragraphs: [
        "Two programmes with identical scope and identical budget can have very different outcomes here, and the difference is decided before either one starts.",
        "The first plans for a local team, mobilises, discovers in week six that the shortlist is not going to materialise, and then does the corridor sourcing anyway: late, at pace, against a date that has already been communicated. The second writes the corridor into the business case, budgets for mobilisation and entity costs, and starts sourcing before the programme does.",
        "Nothing in the data distinguishes those two programmes. The only difference is whether the plan admitted the arithmetic while it was still cheap to admit it.",
      ],
    },
    {
      heading: "Which is what the corridor is for",
      paragraphs: [
        "Yallo operates across the UK, the Middle East and India because programmes routinely need specialists who are not in the country the programme is in. That is not a claim about any market's capability. It is a statement about how enterprise platform skills are distributed at a given moment, and this measurement is one snapshot of that distribution.",
        "The practical form it takes is unglamorous: name the roles that will have to come from outside, price mobilisation and employment properly, and start those searches first because they have the longest lead time.",
      ],
    },
  ],
};

/* ── 4 · Cloud and DevOps ────────────────────────────────────────────────── */

const cloudName = "Cloud (Cloud+DevOps titles)";
const cloudFamily = ltiFamily(cloudName);
const cloudAdo = ltiSkill(cloudName, "Azure DevOps Services");
const cloudAws = ltiSkill(cloudName, "AWS");
const cloudAzure = ltiSkill(cloudName, "Azure");
const cloudGcp = ltiSkill(cloudName, "GCP");
const cloudDevops = ltiSkill(cloudName, "DevOps (skill)");

const cloud: ResearchPiece = {
  slug: "cloud-infrastructure",
  deskHref: "/capabilities/cloud-infrastructure",
  crossLinks: [
    "/capabilities/devops-platform-engineering",
    "/capabilities/testing-quality-engineering",
  ],
  title: "Cloud and DevOps: a pool broad enough to be a poor filter",
  cardTitle: "Cloud and DevOps talent",
  standfirst:
    "This is the one layer where declared skills are genuinely broad. Breadth moves the entire burden from sourcing to screening, and it hides a regional pattern that runs against the received assumption.",
  seoTitle:
    "Cloud and DevOps talent across the UK, Saudi Arabia and the UAE | Yallo Talent",
  seoDescription:
    "Cloud and DevOps skills are declared widely enough that a search returns everyone. What that does to screening, and why GCP in Saudi Arabia is the finding worth a second look.",
  conclusion:
    "When almost half a pool declares the same skill, the declaration stops discriminating and the work moves to screening. Sourcing is not the constraint at this layer.",
  sections: [
    {
      heading: "Breadth is not the good news it looks like",
      paragraphs: [
        `Azure DevOps Services is declared by ${pct(cloudAdo.ratioCombined)} of the ${count(cloudFamily.baseline.combined)} cloud and DevOps professionals measured, and AWS by ${pct(cloudAws.ratioCombined)}. Those are the two highest shares in this family.`,
        `They are not the highest in the whole extract: ${ltiHighestRatio.family} ${ltiHighestRatio.label} reaches ${pct(ltiHighestRatio.ratio)}, and the distinction matters, because comparing shares across families compares the width of two different title nets rather than two markets.`,
        "A skill declared by nearly half a pool has stopped discriminating. A search on it returns a list that is large and undifferentiated, which feels like abundance and behaves like noise. The constraint at this layer is not finding candidates; it is telling them apart, and that is screening work rather than sourcing work.",
        "This is the clearest place in the corpus where the gap between a declared skill and a demonstrated one is the entire problem. Everything on LinkedIn is self-declared. A profile listing a platform is not a person who has run it in production under load.",
      ],
      chart: {
        caption: `Share of the cloud and DevOps pool declaring each skill, as at ${LTI_AS_AT_DISPLAY}`,
        note: "Independent shares of one pool. Most professionals here declare several, so these bars sum well past 100% and are not parts of a whole.",
        max: 55,
        tone: "info",
        bars: [
          {
            label: "Azure DevOps Services",
            value: cloudAdo.ratioCombined,
            display: pct(cloudAdo.ratioCombined),
            emphasis: true,
          },
          {
            label: "AWS",
            value: cloudAws.ratioCombined,
            display: pct(cloudAws.ratioCombined),
            emphasis: true,
          },
          {
            label: "DevOps",
            value: cloudDevops.ratioCombined,
            display: pct(cloudDevops.ratioCombined),
          },
          {
            label: "Azure",
            value: cloudAzure.ratioCombined,
            display: pct(cloudAzure.ratioCombined),
          },
          {
            label: "GCP",
            value: cloudGcp.ratioCombined,
            display: pct(cloudGcp.ratioCombined),
          },
        ],
      },
    },
    {
      heading: "The GCP finding runs against the assumption",
      paragraphs: [
        `The received view is that the Gulf is Azure-first. On this measure Google Cloud is declared by ${pct(cloudGcp.ratioSaudi)} of the Saudi pool against ${pct(cloudGcp.ratioUk)} of the UK pool: ${points(cloudGcp.gulfVsUkMean)} higher across the Gulf as a whole.`,
        "One measurement does not overturn a market assumption, and this one is self-declared. It is enough to say that a Saudi programme choosing its platform on an assumption about local skills availability should check the assumption rather than inherit it.",
      ],
      chart: {
        caption: `Google Cloud skills by market, as at ${LTI_AS_AT_DISPLAY}`,
        note: "Three independent shares of three different pools.",
        max: 22,
        tone: "info",
        bars: [
          {
            label: "United Kingdom",
            value: cloudGcp.ratioUk,
            display: pct(cloudGcp.ratioUk),
          },
          {
            label: "Saudi Arabia",
            value: cloudGcp.ratioSaudi,
            display: pct(cloudGcp.ratioSaudi),
            emphasis: true,
          },
          {
            label: "United Arab Emirates",
            value: cloudGcp.ratioUae,
            display: pct(cloudGcp.ratioUae),
          },
        ],
      },
    },
    {
      heading: "One honest mismatch in how this was measured",
      paragraphs: [
        "The source net for this family is cloud and DevOps titles together, and that spans two of our desks rather than one. This piece is keyed to cloud and infrastructure and cross-links platform engineering and DevOps, because the net is what was measured and splitting it after the fact to produce a tidier mapping would be inventing precision the data does not have.",
      ],
    },
  ],
};

/* ── 5 · AI and data ─────────────────────────────────────────────────────── */

const dataFamily = ltiFamily("Data");
const dataDatabricks = ltiSkill("Data", "Databricks");
const dataSnowflake = ltiSkill("Data", "Snowflake");
const aiFamily = ltiFamily("AI/ML");
const aiBedrock = ltiSkill("AI/ML", "Amazon Bedrock");
const aiVertex = ltiSkill("AI/ML", "Vertex AI");
const aiFoundry = ltiSkill("AI/ML", "Azure AI Foundry");

/* The sum of three overlapping counts, so it is an upper bound on the number
   of distinct people and is described as declarations. The extract cannot
   give the union and this module will not imply one. */
const aiPlatformDeclarations =
  aiBedrock.combined + aiVertex.combined + aiFoundry.combined;

const dataAi: ResearchPiece = {
  slug: "data-analytics",
  deskHref: "/capabilities/data-analytics",
  crossLinks: ["/ai-talent", "/capabilities/cloud-infrastructure"],
  title: "AI and data: the distance between a title and a tool",
  cardTitle: "AI and data talent",
  standfirst:
    "The market has data people. It has far fewer data platform people, and fewer still who have touched a named AI platform. At this end of the market, hiring stops being a funnel.",
  seoTitle:
    "AI and data talent across the UK, Saudi Arabia and the UAE | Yallo Talent",
  seoDescription:
    "A large data workforce declares the named platforms rarely, and the named AI platforms almost never. What that means for how these roles have to be filled.",
  conclusion:
    "For AI platform work the pool is small enough to be a named-individual exercise rather than a funnel, and the figure replaces the adjective in claims about hard-to-find AI talent.",
  sections: [
    {
      heading: "Abundant titles, rare tooling",
      paragraphs: [
        `${count(dataFamily.baseline.combined)} data professionals across the three markets. Databricks is declared by ${pct(dataDatabricks.ratioCombined)} of them and Snowflake by ${pct(dataSnowflake.ratioCombined)}.`,
        "The market has data people. It does not, on this measure, have data platform people in anything like the same quantity. That is the single clearest expression in the corpus of the problem this business exists to solve: a title is abundant and a capability is not, and only one of the two is visible in a search.",
      ],
      chart: {
        caption: `Share of the data pool declaring each platform, as at ${LTI_AS_AT_DISPLAY}`,
        note: `Independent shares of one pool of ${count(dataFamily.baseline.combined)}. Not parts of a whole.`,
        max: 6,
        tone: "signal",
        bars: [
          {
            label: "AWS",
            value: ltiSkill("Data", "AWS").ratioCombined,
            display: pct(ltiSkill("Data", "AWS").ratioCombined),
          },
          {
            label: "Azure",
            value: ltiSkill("Data", "Azure").ratioCombined,
            display: pct(ltiSkill("Data", "Azure").ratioCombined),
          },
          {
            label: "Databricks",
            value: dataDatabricks.ratioCombined,
            display: pct(dataDatabricks.ratioCombined),
            emphasis: true,
          },
          {
            label: "Snowflake",
            value: dataSnowflake.ratioCombined,
            display: pct(dataSnowflake.ratioCombined),
            emphasis: true,
          },
          {
            label: "GCP",
            value: ltiSkill("Data", "GCP").ratioCombined,
            display: pct(ltiSkill("Data", "GCP").ratioCombined),
          },
        ],
      },
    },
    {
      heading: "The AI figures are the sharper version of the same thing",
      paragraphs: [
        `Across a pool of ${count(aiFamily.baseline.combined)} AI and machine learning professionals: Amazon Bedrock ${count(aiBedrock.combined)}, Vertex AI ${count(aiVertex.combined)}, Azure AI Foundry ${count(aiFoundry.combined)}. Each is under one per cent of the pool.`,
        `Those three counts sum to ${count(aiPlatformDeclarations)} declarations, and that is the number to be careful with. A professional can declare more than one of these platforms, so the count of distinct individuals is lower than ${count(aiPlatformDeclarations)} and the extract cannot say how much lower. Even taken as an upper bound it is a small number for three national markets.`,
        "This is what replaces the adjective. Claims about AI talent nobody else can find are ordinarily unfalsifiable; this is a measurement, with a date on it and a stated method, and it can be checked.",
        "The practical consequence is a change of kind rather than degree. A funnel assumes enough candidates at the top that filtering produces a shortlist. At these quantities there is no funnel to filter. The work becomes identifying named individuals, understanding what they have actually built, and approaching them properly, which is a different activity with different economics.",
      ],
      chart: {
        caption: `AI professionals declaring each named platform, all three markets, as at ${LTI_AS_AT_DISPLAY}`,
        note: `Headcounts from a pool of ${count(aiFamily.baseline.combined)}. The three overlap, so they must not be added into a total of distinct people.`,
        max: 250,
        tone: "signal",
        bars: [
          {
            label: "Vertex AI",
            value: aiVertex.combined,
            display: count(aiVertex.combined),
            emphasis: true,
          },
          {
            label: "Azure AI Foundry",
            value: aiFoundry.combined,
            display: count(aiFoundry.combined),
            emphasis: true,
          },
          {
            label: "Amazon Bedrock",
            value: aiBedrock.combined,
            display: count(aiBedrock.combined),
            emphasis: true,
          },
        ],
      },
    },
  ],
};

/* ── The set ─────────────────────────────────────────────────────────────── */

export const researchPieces: ResearchPiece[] = [
  sap,
  oracle,
  salesforce,
  cloud,
  dataAi,
];

export const researchSlugs: string[] = researchPieces.map((p) => p.slug);

export function researchPiece(slug: string): ResearchPiece | undefined {
  return researchPieces.find((p) => p.slug === slug);
}

/** The piece keyed to a desk href, so a desk can link to its research. */
export function researchForDesk(href: string): ResearchPiece | undefined {
  return researchPieces.find((p) => p.deskHref === href);
}

export function researchHref(slug: string): string {
  return `${RESEARCH_BASE}/${slug}`;
}

/**
 * The methodology note. One copy, rendered on every piece, on the index and
 * in the PDF, because a caveat that appears on some surfaces and not others
 * is a caveat that will be quoted without itself.
 */
export const researchMethodology: string[] = [
  `Figures are drawn from a ${LTI_SOURCE} extract read on ${LTI_AS_AT_DISPLAY}, covering the United Kingdom, Saudi Arabia and the United Arab Emirates. Every figure carries that date.`,
  "Skills on LinkedIn are self-declared. A profile listing a platform is not a person who has delivered with it. This is the dataset's weakest property, and it is also the argument: the distance between a declared skill and a screened one is the work.",
  "The named skill counts inside a family overlap, because one professional declares several. They are independent shares of the same pool and can sum past 100%. No chart here presents them as parts of a whole.",
  "Baselines are not comparable between families. The size of a pool reflects how wide the title net was, not how large a market is, so no chart places two families on one axis.",
  "This is supply, not demand. It counts professionals who exist, not roles that are open, and it supports no claim about how long a role takes to fill or how hard it is to hire.",
  "The extract has no Gulf column. Where a figure compares the Gulf with the UK it is the unweighted mean of the Saudi Arabian and Emirati shares, stated so the construction can be checked.",
  "The research covers the five platform and capability families the extract measures. It is not a complete view of the desks Yallo staffs, and nothing here should be read as coverage of the ones it does not name.",
];
