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
  icon: ScreenIcon;
}

export const screenSteps: ScreenStep[] = [
  {
    num: "01",
    name: "Brief",
    copy: "Role, platform, programme phase, next gate.",
    badge: "Hour 0",
    icon: "brief",
  },
  {
    num: "02",
    name: "Calibrate",
    copy: "The bar is set and the failure modes are named.",
    badge: "Hour 0–8",
    icon: "calibrate",
  },
  {
    num: "03",
    name: "Screen",
    copy: "Depth, fit and delivery risk. Never keyword match.",
    badge: "Hour 8–60",
    icon: "screen",
  },
  {
    num: "04",
    name: "Shortlist",
    copy: "Three names, screening notes, rejection reasons.",
    badge: "Hour 72",
    icon: "shortlist",
  },
];

/** From the team-structure slide. One account manager sits in front of them. */
export const desks: string[] = [
  "Architecture",
  "Software Development",
  "Cloud & Infrastructure",
  "Packaged Software",
  "Data & Analytics",
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
