import "server-only";
import { unstable_cache } from "next/cache";
import type { TiptapNode } from "@/components/blocks/editorial/TiptapBody";
import type {
  CaseStudyFrontmatter,
  InsightFrontmatter,
} from "@/lib/content-schema";
import { sql } from "@/lib/db/client";

/**
 * Every public read of an article or a case study. Canon A1 made the database
 * the source of truth for these two types, and this is the only module that
 * knows it.
 *
 * TAGS, NOT TIME. A publish must be live in seconds without a deployment, so
 * every read is wrapped in `unstable_cache` under a tag the publish action
 * invalidates. Nothing here revalidates on a timer: a timer is a window in
 * which the site is wrong, and there is no reason to have one when the writer
 * and the cache are in the same process.
 *
 * NO DATABASE ACCESS DURING `generateStaticParams`. CI builds without a
 * connection string, and a build that needs one is a build that cannot be
 * verified in CI. The content routes prerender nothing at build and generate on
 * first request instead, which is also what makes a NEW article's route exist
 * without a deploy — the same property, from the same decision.
 */

export const CONTENT_TAGS = {
  articles: "content:articles",
  caseStudies: "content:case-studies",
} as const;

export type ContentStatus =
  | "draft"
  | "review"
  | "scheduled"
  | "published"
  | "archived";

export interface ArticleRow {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  body: { type: "doc"; content: TiptapNode[] };
  status: ContentStatus;
  industry: string[];
  platform: string[];
  discipline: string[];
  sources: { claim?: string; source?: string; url?: string }[];
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  ogImageUrl: string | null;
  readingTimeMinutes: number;
  wordCount: number;
  publishedAt: string | null;
  updatedAt: string;
}

export interface CaseStudyRow extends ArticleRow {
  client: string;
  clientPublic: boolean;
  platformLabel: string | null;
  engagement: string | null;
  region: string | null;
  deck: string | null;
  sourceUrl: string | null;
  cardTitle: string | null;
  excerpt: string | null;
  outcome: string | null;
  metrics: { value: string; label: string; source: string }[];
  position: number;
}

/* Postgres returns snake_case; the rest of the codebase reads camelCase, and a
   route that has to remember which is which is a route that gets it wrong once.
   Mapped in one place. */
function toArticle(r: Record<string, unknown>): ArticleRow {
  return {
    id: String(r.id),
    slug: String(r.slug),
    title: String(r.title ?? ""),
    summary: String(r.summary ?? ""),
    category: String(r.category ?? ""),
    body: (r.body ?? { type: "doc", content: [] }) as ArticleRow["body"],
    status: String(r.status) as ContentStatus,
    industry: (r.industry ?? []) as string[],
    platform: (r.platform ?? []) as string[],
    discipline: (r.discipline ?? []) as string[],
    sources: (r.sources ?? []) as ArticleRow["sources"],
    metaTitle: (r.meta_title as string) ?? null,
    metaDescription: (r.meta_description as string) ?? null,
    canonicalUrl: (r.canonical_url as string) ?? null,
    ogImageUrl: (r.og_image_url as string) ?? null,
    readingTimeMinutes: Number(r.reading_time_minutes ?? 0),
    wordCount: Number(r.word_count ?? 0),
    publishedAt: r.published_at
      ? new Date(String(r.published_at)).toISOString()
      : null,
    updatedAt: new Date(String(r.updated_at ?? Date.now())).toISOString(),
  };
}

function toCaseStudy(r: Record<string, unknown>): CaseStudyRow {
  return {
    ...toArticle(r),
    client: String(r.client ?? ""),
    clientPublic: Boolean(r.client_public),
    platformLabel: (r.platform_label as string) ?? null,
    engagement: (r.engagement as string) ?? null,
    region: (r.region as string) ?? null,
    deck: (r.deck as string) ?? null,
    sourceUrl: (r.source_url as string) ?? null,
    cardTitle: (r.card_title as string) ?? null,
    excerpt: (r.excerpt as string) ?? null,
    outcome: (r.outcome as string) ?? null,
    metrics: (r.metrics ?? []) as CaseStudyRow["metrics"],
    position: Number(r.position ?? 0),
  };
}

export const publishedArticles = unstable_cache(
  async (): Promise<ArticleRow[]> => {
    const rows = await sql()`
      select * from articles
       where status = 'published'
       order by published_at desc nulls last, created_at desc`;
    return (rows as Record<string, unknown>[]).map(toArticle);
  },
  ["published-articles"],
  { tags: [CONTENT_TAGS.articles] },
);

export const publishedCaseStudies = unstable_cache(
  async (): Promise<CaseStudyRow[]> => {
    const rows = await sql()`
      select * from case_studies
       where status = 'published'
       order by position asc, published_at desc nulls last`;
    return (rows as Record<string, unknown>[]).map(toCaseStudy);
  },
  ["published-case-studies"],
  { tags: [CONTENT_TAGS.caseStudies] },
);

/**
 * One published study by slug.
 *
 * Reads the cached LIST rather than issuing its own query, so a page and the
 * index it sits under can never disagree about what is published. The list is
 * nine rows and twenty-one; a per-slug query would buy nothing and would need
 * its own cache key, its own tag and its own chance to go stale.
 */
export async function publishedCaseStudy(
  slug: string,
): Promise<CaseStudyRow | null> {
  const all = await publishedCaseStudies();
  return all.find((s) => s.slug === slug) ?? null;
}

export async function publishedArticle(
  slug: string,
): Promise<ArticleRow | null> {
  const all = await publishedArticles();
  return all.find((a) => a.slug === slug) ?? null;
}

/**
 * A database row in the shape the case-study template's blocks already take.
 *
 * WHY AN ADAPTER RATHER THAN A REWRITE. Round 25 §2 requires every published
 * study to render byte-comparable prose to what production serves today, and
 * the surest way to that is to change the SUBSTRATE and nothing else. Seven
 * components — hero, engagement strip, metrics strip, client card, next-study
 * card and their CSS — read `CaseStudyFrontmatter` today. Rewriting them to
 * take a row would have put seven chances to change a rendered string inside
 * the one commit whose whole point is that no rendered string changes.
 *
 * The adapter is therefore deliberate and temporary in spirit rather than in
 * lifetime: it can be unwound component by component afterwards, each with its
 * own evidence, which is a different and much smaller claim than doing it here.
 *
 * `platform` IS THE LABEL, NOT THE TAXONOMY. `CaseStudyFrontmatter.platform` is
 * a free-text descriptor ("SAP S/4HANA", "Multi-platform") that the platform
 * module pages substring-match. The taxonomy arrays are a different field with
 * a different meaning; mapping one onto the other would silently rewire which
 * studies appear on which platform page.
 */
export function caseStudyRowToFrontmatter(
  row: CaseStudyRow,
): CaseStudyFrontmatter {
  return {
    title: row.title,
    slug: row.slug,
    date: (row.publishedAt ?? row.updatedAt).slice(0, 10),
    summary: row.summary,
    category: row.category,
    author: "Yallo Talent",
    readingTimeMinutes: Math.max(1, row.readingTimeMinutes),
    ...(row.sources.length
      ? { sources: row.sources as CaseStudyFrontmatter["sources"] }
      : {}),
    ...(row.industry.length ? { industry: row.industry } : {}),
    ...(row.discipline.length ? { discipline: row.discipline } : {}),
    published: row.status === "published",
    client: row.client,
    clientPublic: row.clientPublic,
    platform: row.platformLabel ?? "",
    region: row.region ?? "",
    ...(row.engagement ? { engagement: row.engagement } : {}),
    ...(row.deck ? { deck: row.deck } : {}),
    ...(row.sourceUrl ? { sourceUrl: row.sourceUrl } : {}),
    ...(row.cardTitle ? { cardTitle: row.cardTitle } : {}),
    ...(row.excerpt ? { excerpt: row.excerpt } : {}),
    ...(row.outcome ? { outcome: row.outcome } : {}),
    ...(row.metrics.length ? { metrics: row.metrics } : {}),
  } as CaseStudyFrontmatter;
}

/**
 * A published study in the `{ frontmatter, body }` shape every consumer already
 * destructures, ordered by `position`.
 *
 * SIX CONSUMERS CHANGE ONE LINE EACH because of this: the detail page, the
 * index, the homepage rail, the platform module pages, the assistant corpus and
 * the cockpit list all read `orderedCaseStudies(getAllCaseStudies())` today and
 * read `await orderedCaseStudyEntries()` after. `order.yaml` and
 * `src/lib/case-study-order.ts` retire with the content files: the order is the
 * `position` column now, and drag and drop writes it.
 */
export interface CaseStudyEntry {
  frontmatter: CaseStudyFrontmatter;
  body: { type: "doc"; content: TiptapNode[] };
  row: CaseStudyRow;
}

export async function orderedCaseStudyEntries(): Promise<CaseStudyEntry[]> {
  const rows = await publishedCaseStudies();
  return rows.map((row) => ({
    frontmatter: caseStudyRowToFrontmatter(row),
    body: row.body,
    row,
  }));
}

export interface ArticleEntry {
  frontmatter: InsightFrontmatter;
  body: { type: "doc"; content: TiptapNode[] };
  row: ArticleRow;
}

export function articleRowToFrontmatter(row: ArticleRow): InsightFrontmatter {
  return {
    title: row.title,
    slug: row.slug,
    date: (row.publishedAt ?? row.updatedAt).slice(0, 10),
    summary: row.summary,
    category: row.category,
    author: "Yallo Talent",
    readingTimeMinutes: Math.max(1, row.readingTimeMinutes),
    ...(row.sources.length
      ? { sources: row.sources as InsightFrontmatter["sources"] }
      : {}),
    ...(row.industry.length ? { industry: row.industry } : {}),
    ...(row.platform.length ? { platform: row.platform } : {}),
    ...(row.discipline.length ? { discipline: row.discipline } : {}),
    published: row.status === "published",
  } as InsightFrontmatter;
}

export async function publishedArticleEntries(): Promise<ArticleEntry[]> {
  const rows = await publishedArticles();
  return rows.map((row) => ({
    frontmatter: articleRowToFrontmatter(row),
    body: row.body,
    row,
  }));
}

/**
 * Every row, whatever its status, for the cockpit panes.
 *
 * NOT CACHED, and not by omission. The public reads are cached and invalidated
 * by tag, because a visitor must never wait for a query and must never see a
 * stale page after a publish. A pane is the opposite case: the person looking at
 * it just changed something and needs to see what is actually there, so a cache
 * between them and the row is a cache that will show them their own edit
 * missing.
 */
export async function allArticles(): Promise<ArticleRow[]> {
  const rows = await sql()`
    select * from articles order by updated_at desc`;
  return (rows as Record<string, unknown>[]).map(toArticle);
}

export async function allCaseStudies(): Promise<CaseStudyRow[]> {
  const rows = await sql()`
    select * from case_studies order by position asc, updated_at desc`;
  return (rows as Record<string, unknown>[]).map(toCaseStudy);
}

export async function articleById(id: string): Promise<ArticleRow | null> {
  const rows = await sql()`select * from articles where id = ${id}`;
  const r = (rows as Record<string, unknown>[])[0];
  return r ? toArticle(r) : null;
}

export async function caseStudyById(id: string): Promise<CaseStudyRow | null> {
  const rows = await sql()`select * from case_studies where id = ${id}`;
  const r = (rows as Record<string, unknown>[])[0];
  return r ? toCaseStudy(r) : null;
}

export type TaxonomyKind = "industry" | "platform" | "discipline";

/**
 * Published articles carrying a taxonomy value, newest first.
 *
 * THE THRESHOLD IS NOT HERE. `TAXONOMY_MIN_ARTICLES` decides which archives are
 * worth rendering at all and lives with the archive template, because it is an
 * editorial judgement about a thin page rather than a fact about the data.
 */
export async function articlesByTaxonomy(
  kind: TaxonomyKind,
  slug: string,
): Promise<ArticleEntry[]> {
  const all = await publishedArticleEntries();
  return all.filter((e) => (e.row[kind] ?? []).includes(slug));
}

/** Every taxonomy value that at least `min` published articles carry. */
export async function taxonomyValuesWithArticles(
  kind: TaxonomyKind,
  min: number,
): Promise<string[]> {
  const all = await publishedArticleEntries();
  const counts = new Map<string, number>();
  for (const e of all) {
    for (const value of e.row[kind] ?? []) {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .filter(([, n]) => n >= min)
    .map(([slug]) => slug)
    .sort();
}
