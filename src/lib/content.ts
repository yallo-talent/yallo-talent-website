import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import type { z } from "zod";
import {
  type CaseStudyFrontmatter,
  caseStudyFrontmatterSchema,
  type InsightFrontmatter,
  insightFrontmatterSchema,
} from "./content-schema";

const CONTENT_ROOT = join(process.cwd(), "content");
const INSIGHTS_DIR = join(CONTENT_ROOT, "insights");
const CASE_STUDIES_DIR = join(CONTENT_ROOT, "case-studies");

export interface LoadedEntry<T> {
  frontmatter: T;
  body: string;
}

function readMdxFilesSync(dir: string): string[] {
  return readdirSync(dir)
    .filter((name) => name.endsWith(".mdx"))
    .map((name) => name.replace(/\.mdx$/, ""));
}

function loadEntry<T extends { slug: string }>(
  dir: string,
  slug: string,
  schema: z.ZodType<T>,
): LoadedEntry<T> {
  const raw = readFileSync(join(dir, `${slug}.mdx`), "utf8");
  const { data, content } = matter(raw);
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join(", ");
    throw new Error(`Invalid frontmatter in ${dir}/${slug}.mdx: ${issues}`);
  }
  const frontmatter = parsed.data;
  if (frontmatter.slug !== slug) {
    throw new Error(
      `Frontmatter slug '${frontmatter.slug}' does not match filename '${slug}' in ${dir}`,
    );
  }
  return { frontmatter, body: content };
}

export function getAllInsightSlugs(): string[] {
  return readMdxFilesSync(INSIGHTS_DIR);
}

export function getInsight(slug: string): LoadedEntry<InsightFrontmatter> {
  return loadEntry(INSIGHTS_DIR, slug, insightFrontmatterSchema);
}

export function getAllInsights(): LoadedEntry<InsightFrontmatter>[] {
  return getAllInsightSlugs()
    .map((slug) => getInsight(slug))
    .sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1));
}

export function getAllCaseStudySlugs(): string[] {
  return readMdxFilesSync(CASE_STUDIES_DIR);
}

export function getCaseStudy(slug: string): LoadedEntry<CaseStudyFrontmatter> {
  return loadEntry(CASE_STUDIES_DIR, slug, caseStudyFrontmatterSchema);
}

export function getAllCaseStudies(): LoadedEntry<CaseStudyFrontmatter>[] {
  return getAllCaseStudySlugs()
    .map((slug) => getCaseStudy(slug))
    .sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1));
}
