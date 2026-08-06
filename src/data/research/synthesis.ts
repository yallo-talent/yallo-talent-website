/**
 * The cross-market synthesis — the gated asset (R-A4).
 *
 * WHAT IS GATED AND WHAT IS NOT. Per the discoverability brief §4.3: an
 * ungated summary layer is retrievable and the quantities sit behind the
 * gate. A fully gated asset cannot be cited at all, and a citation carrying
 * no numbers still names Yallo. So `summary` publishes openly on the page and
 * `chapters` is what the PDF carries.
 *
 * THE GATE IS LEAD CAPTURE, NOT ACCESS CONTROL. The generated PDF is served
 * from a static path so that a programme director can forward it to
 * procurement, which round 14's brief §5 identifies as the whole mechanism.
 * A forwarded link that demands an email address from the second reader
 * defeats the purpose. Anyone who guesses the path can fetch the file; the
 * form is there to capture the people who arrive through the site, and it
 * should not be described internally as anything stronger.
 *
 * NO FIGURE IS TYPED HERE EITHER. Everything resolves through ./dataset via
 * ./index, so the PDF and the pages cannot disagree — which is the specific
 * defect context-round16-scope.md §2.3 forbids when it rules out a hand-made
 * PDF.
 */
import { LTI_AS_AT_DISPLAY, ltiFamily, ltiSkill } from "./dataset";
import { researchMethodology, researchPieces } from "./index";

const oracleFamily = ltiFamily("Oracle");
const salesforceFamily = ltiFamily("Salesforce");
const oracleFinancials = ltiSkill("Oracle", "Financials");
const sfMarketing = ltiSkill("Salesforce", "Marketing Cloud+AMPscript");

function pct(n: number): string {
  return `${n.toFixed(1)}%`;
}
function count(n: number): string {
  return n.toLocaleString("en-GB");
}

export const SYNTHESIS_SLUG = "corridor";

/** Where the built PDF lands. Also the path robots.ts disallows. */
export const SYNTHESIS_PDF_PATH =
  "/downloads/yallo-talent-corridor-research.pdf";

export const synthesisTitle =
  "The corridor runs both ways: enterprise platform talent across the UK, Saudi Arabia and the UAE";

export const synthesisStandfirst =
  "Five platform families, three markets, one measurement. The finding that holds them together is not that one end of the corridor is short of people. It is that the two ends specialise, and in opposite directions.";

/**
 * The ungated argument. This is the part that gets quoted, indexed and cited,
 * and it is deliberately the whole conclusion rather than a teaser for it.
 */
export const synthesisSummary: string[] = [
  "The usual account of enterprise talent between the UK and the Gulf has one direction: the Gulf is short of specialists, so specialists come in. The measurement does not support that account, and the way it fails is more useful than the account itself.",
  `Oracle is the counter-example that breaks the pattern open. ${pct(oracleFamily.gulfShareOfPool)} of the Oracle professionals measured sit in Saudi Arabia or the UAE, the highest Gulf share of any family here, and Oracle Financials is declared more widely in the Gulf than in the UK. Salesforce runs the other way: the UK pool is ${count(salesforceFamily.baseline.uk)} against ${count(salesforceFamily.baseline.saudi)} in Saudi Arabia, and Marketing Cloud is far more widely declared in the UK.`,
  "So the corridor is not a shortage at one end and a surplus at the other. The two ends have specialised, and a programme's staffing problem depends on which platform it is running and where. An Oracle finance programme in Riyadh is in the deep end of its market. A Salesforce commerce programme in the same city is not, and no amount of local recruitment effort changes that.",
  "This is a more defensible position than scarcity alone, and a harder one for a competitor to copy, because it requires knowing what a programme actually needs in each workstream as well as what the market declares. Two of the sharpest findings sit inside families that look healthy from the outside: Oracle payroll is the scarcest named skill in the entire extract and sits in the workstream with a legal date on it, and the cloud pool is so broadly declared that the constraint moves from finding people to telling them apart.",
  "The practical conclusion is the same in every case and it is about timing rather than effort. The roles that will have to come from outside are knowable at business case. Naming them then costs a paragraph in a plan. Discovering them at week six costs the date.",
];

export interface SynthesisChapter {
  heading: string;
  paragraphs: string[];
}

/**
 * The gated detail. The per-family reads assemble here in one place, which is
 * the only reason the asset is worth an email address.
 */
export const synthesisChapters: SynthesisChapter[] = [
  {
    heading: "How to read these numbers",
    paragraphs: researchMethodology,
  },
  {
    heading: "The specialisation asymmetry",
    paragraphs: [
      `Oracle carries ${pct(oracleFamily.gulfShareOfPool)} of its measured pool in the Gulf. Oracle Financials is declared by ${pct(oracleFinancials.gulfMean)} of the Gulf pool against ${pct(oracleFinancials.ratioUk)} in the UK.`,
      `Salesforce inverts it. Marketing Cloud is declared by ${pct(sfMarketing.ratioUk)} of the UK pool and ${pct(sfMarketing.gulfMean)} across the Gulf.`,
      "Two families, two directions, one dataset. The corridor exists because programmes need skills that are unevenly distributed, and the unevenness does not have a consistent sign.",
    ],
  },
  ...researchPieces.map((piece) => ({
    heading: piece.title,
    paragraphs: [
      piece.standfirst,
      ...piece.sections.flatMap((s) => s.paragraphs),
      `Conclusion: ${piece.conclusion}`,
    ],
  })),
  {
    heading: "What this does not tell you",
    paragraphs: [
      "It counts professionals who exist, not roles that are open, so it supports no statement about how long a hire takes or which role is hardest to fill. Those need a firm's own placement data, and ours is not published here.",
      "It carries nothing about compensation. There is no pay data in the source at all, so any rate or salary figure attached to this analysis did not come from it.",
      `It is a snapshot dated ${LTI_AS_AT_DISPLAY}. Markets that are building capability quickly will not match it for long, and Saudi Arabia in particular should be expected to move.`,
    ],
  },
];

/** The form's `source` value, so capture rows can be told apart. */
export const SYNTHESIS_CAPTURE_SOURCE = "research-synthesis";
