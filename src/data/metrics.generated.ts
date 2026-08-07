/**
 * GENERATED FILE — do not edit. Written by scripts/build-metrics.mjs from
 * content/metrics.yaml, which is the source of truth for all four published
 * figures. Change the YAML and run `pnpm metrics`; `pnpm check:metrics`
 * fails if this file and the YAML have drifted apart.
 *
 * WHY THIS EXISTS ALONGSIDE src/data/metrics.ts. That module reads the YAML
 * with node:fs, which makes it server-only. Everything a CLIENT component
 * reaches has to read its figures from here, or it types them by hand, which is
 * what src/data/home/hero.ts and engage.ts did until round 19 §5.1.
 *
 * As at 2026-07-30. Refreshed quarterly; see content/metrics.yaml.
 */

export interface PublishedMetric {
  readonly target: number;
  readonly suffix: string;
  readonly label: MetricLabel;
  readonly definition: string;
  readonly source: string;
}

/** The labels content/metrics.yaml publishes. A typo is a compile error. */
export type MetricLabel =
  | "Brief to shortlist"
  | "CVs per interview"
  | "Contracts renewed"
  | "Programmes staffed";

export const METRICS_AS_AT = "2026-07-30";

export const publishedMetrics: readonly PublishedMetric[] = [
  {
    target: 72,
    suffix: "h",
    label: "Brief to shortlist",
    definition: "Three screened candidates from a complete brief.",
    source: "Yallo internal delivery record, Q1–Q2 2026",
  },
  {
    target: 2,
    suffix: ":1",
    label: "CVs per interview",
    definition: "Candidates sent for every one you interview.",
    source: "Yallo internal shortlist record, Q1–Q2 2026",
  },
  {
    target: 80,
    suffix: "%",
    label: "Contracts renewed",
    definition: "Placed contractors extended at least once.",
    source: "Yallo internal placement record, Q1–Q2 2026",
  },
  {
    target: 50,
    suffix: "+",
    label: "Programmes staffed",
    definition: "Enterprise platform programmes, not placements.",
    source: "Yallo internal programme register, Q2 2026",
  },
];

/**
 * One published figure, formatted, by its label — the client-safe counterpart
 * of `publishedFigure()` in src/data/metrics.ts, and deliberately the same
 * lookup key so the two cannot answer differently.
 *
 * The parameter is typed to the union above, so an unknown label cannot compile
 * rather than throwing at request time. Retained as a runtime throw as well:
 * this module is generated, and a caller reaching it through a widened string
 * would otherwise get `undefined` rendered into a card where a number was
 * promised.
 */
export function metricValue(label: MetricLabel): string {
  const hit = publishedMetrics.find((m) => m.label === label);
  if (!hit) {
    throw new Error(
      `metricValue("${label}"): content/metrics.yaml publishes no metric with that label.`,
    );
  }
  return `${hit.target}${hit.suffix}`;
}
