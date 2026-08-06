/**
 * The five buying personas.
 *
 * Content is carried VERBATIM from the previous TheProblem.tsx — five roles,
 * five headlines, fifteen quotes and five sourced statistics. Do not reword,
 * re-punctuate or "tighten" any of it: the quotes are composites of real buyer
 * language and the statistics are the only third-party figures on the page.
 *
 * The panel label is "what we hear", never "in their words", precisely because
 * the quotes are composites rather than attributed speech.
 */

export interface Persona {
  role: string;
  /** One-line cue shown in the index, so the reader finds their own seat. */
  cue: string;
  headline: string;
  /** Exactly three. Composites of real buyer language. */
  quotes: [string, string, string];
  /** The figure. Rendered oversized. */
  value: string;
  /** What the figure means. */
  claim: string;
  /** Visible on the page — these are third-party, so the citation is the proof. */
  source: string;
}

export const personas: Persona[] = [
  {
    role: "Delivery Director",
    cue: "Can't staff fast enough",
    headline: "You win the work faster than you can staff it.",
    quotes: [
      "We've signed the programme, now I need a team on the ground, fast.",
      "Contractor churn keeps resetting delivery every few months.",
      "Half the budget sits benched, waiting on the right specialists.",
    ],
    value: "95%",
    claim:
      "of UAE employers actively seek tech professionals from outside the region; 83% say offshoring is a key part of their business model.",
    source:
      "UAE Future Tech Talent Report 2024, UAE Ministry of Economy with Integra Seven",
  },
  {
    role: "Head of TA",
    cue: "Buried in CVs, not fit",
    headline: "Drowning in CVs, starving for fit.",
    quotes: [
      "Two hundred applications a role, and maybe five worth a call.",
      "I spend more time filtering noise than talking to real candidates.",
      "The good ones drop off before I've even finished screening.",
    ],
    value: "250+",
    claim:
      "applications land on the average corporate opening, yet only four to six are worth interviewing.",
    source: "SHRM",
  },
  {
    role: "PMO Director",
    cue: "Every open seat is red",
    headline: "Every red seat is a red programme.",
    quotes: [
      "Half my status pack is 'awaiting hire'. Leadership sees red before delivery does.",
      "Recruitment says four weeks, but by week six the sprint has already slipped twice.",
      "By the time the seat is filled, the mitigation plan has become the plan.",
    ],
    value: "~63 days",
    claim:
      "median time to fill a role today, and specialist tech roles routinely run longer, dragging every milestone behind them.",
    source: "Employ Recruiting Benchmarks Report, 2026",
  },
  {
    role: "VP Engineering",
    cue: "Backlog stalls on specialists",
    headline: "The backlog isn't the problem: the bench is.",
    quotes: [
      "I've got the roadmap. What I don't have is two senior specialists who can actually ship it.",
      "Contract agencies send me profiles. I need people who've built this at scale.",
      "I'm three weeks into shortlisting and the sprint window is closing.",
    ],
    value: "72%",
    claim:
      "of employers can't find the skilled talent they need, with AI, IT and data roles now the hardest to fill.",
    source: "ManpowerGroup Talent Shortage Survey, 2026",
  },
  {
    role: "Practice Lead",
    cue: "Bench is thin at the top",
    headline: "Certified isn't the same as delivered.",
    quotes: [
      "Ninety percent of the CVs look right on paper: five percent have actually shipped this platform.",
      "I end up screening every candidate myself because generalist recruiters can't tell the difference.",
      "The good ones aren't on the market. They're already placed on someone else's programme.",
    ],
    value: "up to 30%",
    claim:
      "of first-year salary is the cost of a single bad hire, and replacing a senior specialist can reach two times salary.",
    source: "U.S. Department of Labor; SHRM",
  },
];

export const gapCopy = {
  eyebrow: "The gap",
  heading: "The same shortage looks different from every seat.",
  lede: "Five people sign off an enterprise hire, and each of them is losing something different.",
  /** Never "in their words" — the quotes are composites. */
  panelLabel: "what we hear",
  indexLabel: "Choose your role",
} as const;
