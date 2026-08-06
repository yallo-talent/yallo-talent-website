import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";
import { z } from "zod";
import { composeMetricsAttribution } from "@/lib/metrics-attribution";

const metricSchema = z.object({
  target: z.number(),
  suffix: z.string().optional(),
  label: z.string().min(1),
  /** Renders on the page. A number that means exactly one thing is the point. */
  definition: z.string().min(1),
  /**
   * Named once, collectively, in the attribution line beneath the block —
   * round 17 §2.2. Must parse as `<owner> <kind> <record|register>[, <period>]`
   * or `composeMetricsAttribution` returns null and the build fails, because a
   * source that no longer reduces to a line is a provenance change, not a
   * rendering detail.
   */
  source: z.string().min(1),
});

const metricsFileSchema = z.object({
  asAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "asAt must be YYYY-MM-DD")
    .or(z.date().transform((d) => d.toISOString().slice(0, 10))),
  /**
   * Who re-pulls these at the quarterly refresh. A ROLE, never a personal name:
   * round 17 §2.2 ruled that no individual is recorded against a commitment
   * they have not made. Not rendered — this is a maintenance record, not
   * published copy — but schema-validated so it cannot silently disappear.
   */
  refreshOwner: z.string().min(1),
  metrics: z.array(metricSchema),
});

export type MetricStat = z.infer<typeof metricSchema>;

const METRICS_PATH = join(process.cwd(), "content", "metrics.yaml");

const raw = readFileSync(METRICS_PATH, "utf8");
const parsed = metricsFileSchema.safeParse(parseYaml(raw));
if (!parsed.success) {
  const issues = parsed.error.issues
    .map((i) => `${i.path.join(".")}: ${i.message}`)
    .join(", ");
  throw new Error(`Invalid metrics.yaml: ${issues}`);
}

/* Captured once after the guard above. TypeScript does not carry the
   `parsed.success` narrowing into a function body, so `publishedFigure` would
   otherwise see `parsed.data` as possibly undefined. */
const data = parsed.data;

export const asAt: string = data.asAt;
export const refreshOwner: string = data.refreshOwner;
export const homeMetrics: MetricStat[] = data.metrics;

/**
 * The single attribution line rendered beneath every metrics block.
 *
 * Throws rather than degrading. The line is a canon requirement and a
 * differentiator, so a `source` edit that stops parsing must stop the build —
 * eleven pages quietly losing their attribution is exactly the failure this
 * whole family of gates exists to prevent.
 */
const attribution = composeMetricsAttribution(data.metrics, data.asAt);
if (attribution === null) {
  throw new Error(
    "content/metrics.yaml: the four `source` values no longer reduce to one " +
      "attribution line. Each must read `<owner> <kind> <record|register>[, " +
      "<period>]` and all four must share one owner. See " +
      "src/lib/metrics-attribution.ts.",
  );
}
export const metricsAttribution: string = attribution;

/**
 * One of the four published figures, formatted, by its label.
 *
 * WHY. Round 17 found `"2:1"`, `"80%"` and `"72h"` typed into src/data/platforms/why.ts
 * and src/app/ai-talent/page.tsx, published on eight platform pages and one L1 as
 * first-party claims that content/metrics.yaml could no longer reach. The
 * quarterly refresh would have moved the metrics block and left these behind,
 * which is the same defect the L1 `stats` tuples had before they were removed and
 * the same one the attribution line above exists to prevent.
 *
 * THROWS on an unknown label rather than returning a fallback. The label is the
 * lookup key, so a renamed metric must break the build: a figure silently
 * disappearing from a card is how a page comes to publish nothing where it
 * promised a number, and a stale one is worse than either.
 *
 * Server-only, like everything else in this module — it reads the file system.
 * Client components take the value through a prop from a server parent.
 */
export function publishedFigure(label: string): {
  value: string;
  label: string;
} {
  const hit = data.metrics.find((m) => m.label === label);
  if (!hit) {
    throw new Error(
      `publishedFigure("${label}"): content/metrics.yaml publishes no metric ` +
        `with that label. Available: ${data.metrics
          .map((m) => `"${m.label}"`)
          .join(", ")}. Canon §6 permits these four and no others.`,
    );
  }
  return { value: `${hit.target}${hit.suffix ?? ""}`, label: hit.label };
}
