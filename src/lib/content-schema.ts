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
  clientPublic: z.boolean(),
  platform: z.string().min(1),
  region: z.string().min(1),
  outcome: z.string().min(1),
  metrics: z.array(metricSchema),
});

export type InsightFrontmatter = z.infer<typeof insightFrontmatterSchema>;
export type CaseStudyFrontmatter = z.infer<typeof caseStudyFrontmatterSchema>;
export type ContentSource = z.infer<typeof sourceSchema>;
