/**
 * The screen — the four-phase brief-to-shortlist mechanism, and the six
 * specialist desks that sit behind it.
 *
 * This is the differentiator and it sits high on the page. The named-architect
 * gallery is deliberately absent: Sumeet is the calibrating architect and
 * Niharika is Head of Talent Acquisition, so a gallery would overclaim. The
 * desks carry that proof instead.
 */

export type ScreenIcon = "brief" | "calibrate" | "screen" | "shortlist";

export interface ScreenStep {
  num: string;
  name: string;
  copy: string;
  /** Rendered as an inline badge on the card. */
  badge: string;
  /**
   * WHO DOES THIS STEP. Sumeet's point: the pipeline said what happens and never
   * who acts, so a reader could not tell where their own effort begins and ends
   * — which is the actual selling point, since three of the four steps are ours.
   */
  actor: "You" | "We" | "You and we";
  icon: ScreenIcon;
}

export const screenSteps: ScreenStep[] = [
  {
    num: "01",
    name: "Brief",
    actor: "You and we",
    copy: "Role, platform, programme phase, next gate.",
    badge: "Hour 0",
    icon: "brief",
  },
  {
    num: "02",
    name: "Calibrate",
    actor: "We",
    copy: "The bar is set and the failure modes are named.",
    badge: "Hour 0–8",
    icon: "calibrate",
  },
  {
    num: "03",
    name: "Screen",
    actor: "We",
    copy: "Depth, fit and delivery risk. Never keyword match.",
    badge: "Hour 8–60",
    icon: "screen",
  },
  {
    num: "04",
    name: "Shortlist",
    actor: "We",
    copy: "Three names, screening notes, rejection reasons.",
    badge: "Hour 72",
    icon: "shortlist",
  },
];

/** From the team-structure slide. One account manager sits in front of them. */
export const desks: string[] = [
  /* Packaged Software FIRST, per Sumeet: SAP and Oracle are the bulk of what we
     staff, so the desk that carries them leads. "Data & Analytics" is now
     "Data & AI" — the combined platform-and-capability view, and the term the
     market uses. Same order on every surface that lists the desks. */
  "Packaged Software",
  "Architecture",
  "Software Development",
  "Data & AI",
  "Cloud & Infrastructure",
  "Agile & DevOps",
];

export const screenCopy = {
  eyebrow: "How you get your shortlist",
  heading: "Seventy-two hours, four steps, no CV dumps.",
  lede: "Nothing reaches your inbox until the bar has been set against your platform and your programme phase.",
  desksLabel: "Screened by six specialist desks",
  desksNote:
    "One account manager in front of them, as your single point of contact.",
} as const;

export const metricsCopy = {
  eyebrow: "Measured, not marketed",
  heading: "Four numbers we will stand behind.",
  lede: "Each one means exactly one thing, and the definition is on the page.",
} as const;
