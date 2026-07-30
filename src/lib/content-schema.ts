import { z } from "zod";

const sourceSchema = z.object({
  claim: z.string().min(1),
  source: z.string().min(1),
  url: z.url().optional(),
});

const isoDateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD");

const slugArray = z
  .array(z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "must be kebab-case"))
  .optional();

export const insightFrontmatterSchema = z.object({
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "slug must be kebab-case"),
  date: isoDateString,
  summary: z.string().min(1),
  category: z.string().min(1),
  author: z.string().min(1),
  readingTimeMinutes: z.number().int().positive(),
  sources: z.array(sourceSchema).optional(),
  /** Taxonomy tags. Consumed by /insights/{industry,platform,discipline}/[slug] archives. */
  industry: slugArray,
  platform: slugArray,
  discipline: slugArray,
  /** Defaults to true; when false the article is not linked from any hub or archive. */
  published: z.boolean().optional(),
  /** For unpublished stubs: rewrite direction so the piece can be revived intentionally. */
  rewriteBrief: z.string().optional(),
});

const metricSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
  source: z.string().min(1),
});

export const caseStudyFrontmatterSchema = insightFrontmatterSchema.extend({
  client: z.string().min(1),
  /** False where the published page does not name the client. Never guessed. */
  clientPublic: z.boolean(),
  platform: z.string().min(1),
  region: z.string().min(1),
  /** Contract · Permanent · EOR · Managed Delivery · Advisory. */
  engagement: z.string().min(1).optional(),
  /** The page's own sub-headline, where it has one. */
  deck: z.string().min(1).optional(),
  /** The published URL this was ported from, for provenance. */
  sourceUrl: z.url().optional(),
  /**
   * Homepage rail position (canon's eight, relay §8). Absent means the study
   * appears on the hub in date order but not in the rail.
   */
  featured: z.number().int().positive().optional(),
  /**
   * Optional, deliberately. Requiring an outcome line and a metrics array is
   * what drove the first pass of this content to invent both — the real
   * published studies carry neither as separate quotable fields. A figure
   * appears here only when it is genuinely published and attributable.
   */
  outcome: z.string().min(1).optional(),
  metrics: z.array(metricSchema).optional(),
  /**
   * The card display line — a faithful compression of the published title,
   * schema-budgeted so cards never clip or wrap to three lines. The full
   * `title` stays verbatim and owns the detail page. Sentence case.
   */
  cardTitle: z.string().min(1).max(64).optional(),
  /**
   * Devendored card excerpt: compression of the study body only, never new
   * facts. Replaces the vendor-voice `summary` opener on cards; `summary`
   * remains for metadata description.
   */
  excerpt: z.string().min(80).max(220).optional(),
});

export type InsightFrontmatter = z.infer<typeof insightFrontmatterSchema>;
export type CaseStudyFrontmatter = z.infer<typeof caseStudyFrontmatterSchema>;
export type ContentSource = z.infer<typeof sourceSchema>;
