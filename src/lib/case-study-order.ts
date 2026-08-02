import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";
import { z } from "zod";
import type { LoadedEntry } from "./content";
import type { CaseStudyFrontmatter } from "./content-schema";

/**
 * The published order of the case studies, in one place.
 *
 * WHY A FILE AND NOT A FIELD. The order was a `featured` integer on each
 * study's frontmatter, so reranking meant editing fourteen files and keeping
 * fourteen integers unique and gapless by hand. It is one editorial decision
 * and it now lives in one editorial file: content/case-studies/order.yaml.
 *
 * Any slug not named there still publishes; it appends in date order behind the
 * ones that are. That way adding a study never requires touching the order file
 * and never silently drops the study either.
 *
 * A slug named there that resolves to nothing is a BUILD FAILURE, not a silent
 * skip. Silently skipping is how an order file rots: it keeps working while
 * describing a site that no longer exists, and the first symptom is a rail
 * quietly one card short. If you delete a case study, delete its line here in
 * the same commit — the error names the file and the slug.
 */

export type CaseStudy = LoadedEntry<CaseStudyFrontmatter>;

const ORDER_PATH = join(process.cwd(), "content", "case-studies", "order.yaml");

const orderFileSchema = z.object({
  order: z.array(z.string().min(1)),
});

let cached: string[] | null = null;

/** The slugs named in order.yaml, in their file order. */
export function caseStudyOrder(): string[] {
  if (cached) return cached;
  const parsed = orderFileSchema.safeParse(
    parseYaml(readFileSync(ORDER_PATH, "utf8")),
  );
  if (!parsed.success) {
    throw new Error(
      `Invalid content/case-studies/order.yaml: ${parsed.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join(", ")}`,
    );
  }
  const seen = new Set<string>();
  for (const slug of parsed.data.order) {
    if (seen.has(slug)) {
      throw new Error(
        `content/case-studies/order.yaml lists "${slug}" twice. A study has one position.`,
      );
    }
    seen.add(slug);
  }
  cached = parsed.data.order;
  return cached;
}

/**
 * Published studies, in the ranked order.
 *
 * Ranked slugs first in file order, then everything else by date, newest first.
 * Unpublished studies are dropped wherever they sit: `published: false` is a
 * statement about the study, not about its position.
 */
export function orderedCaseStudies(all: CaseStudy[]): CaseStudy[] {
  const order = caseStudyOrder();
  const bySlug = new Map(all.map((s) => [s.frontmatter.slug, s]));

  const missing = order.filter((slug) => !bySlug.has(slug));
  if (missing.length) {
    throw new Error(
      `content/case-studies/order.yaml names ${missing.length} slug(s) that resolve to no case study: ${missing.join(", ")}. ` +
        "Remove the line, or restore the file. An order file that skips silently rots.",
    );
  }

  const published = (s: CaseStudy) => s.frontmatter.published !== false;
  const ranked = order
    .map((slug) => bySlug.get(slug))
    .filter((s): s is CaseStudy => Boolean(s) && published(s as CaseStudy));

  const rankedSlugs = new Set(order);
  const rest = all
    .filter((s) => !rankedSlugs.has(s.frontmatter.slug) && published(s))
    .sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1));

  return [...ranked, ...rest];
}
