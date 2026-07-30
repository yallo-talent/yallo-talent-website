import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";
import { z } from "zod";

const metricSchema = z.object({
  target: z.number(),
  suffix: z.string().optional(),
  label: z.string().min(1),
  /** Renders on the page. A number that means exactly one thing is the point. */
  definition: z.string().min(1),
  /** Provenance only — deliberately not rendered. See content/metrics.yaml. */
  source: z.string().min(1),
});

const metricsFileSchema = z.object({
  asAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "asAt must be YYYY-MM-DD")
    .or(z.date().transform((d) => d.toISOString().slice(0, 10))),
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

export const asAt: string = parsed.data.asAt;
export const homeMetrics: MetricStat[] = parsed.data.metrics;
