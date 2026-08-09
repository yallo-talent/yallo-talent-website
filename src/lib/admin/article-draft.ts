import matter from "gray-matter";
import {
  capabilitiesIndex,
  industriesIndex,
  platformsIndex,
} from "@/data/l1/index";
import { insightFrontmatterSchema } from "@/lib/content-schema";

/**
 * Articles, as the cockpit sees them before they become a pull request.
 *
 * WHAT THIS MODULE IS FOR. Everything the Articles pane validates, and nothing
 * it commits. The commit path is publish.ts, the surgical frontmatter writers
 * are case-study-draft.ts's `writeScalar` and `writeBody` (they take a source
 * string and are not study-specific, so they are reused rather than forked), and
 * this file holds only the rules that are particular to an insight.
 *
 * VALIDATION RUNS BEFORE A PULL REQUEST OPENS, round 23 §4. The reason is not
 * tidiness: a pull request CI is certain to fail is a pull request that sits
 * open, blocks auto-merge, and has to be closed by hand. Every rule the build
 * holds is therefore checked in the form first, where it can still be fixed.
 *
 * THE BYLINE IS NOT AN INPUT. Canon §8: articles are published as "Yallo
 * Talent" and no session, pane or editor invents a person to attribute writing
 * to. `author` is written by the template and rejected here if it is anything
 * else, rather than being a field somebody can type a name into.
 */

export const ARTICLE_DIR = "content/insights";

export function articlePath(slug: string): string {
  return `${ARTICLE_DIR}/${slug}.mdx`;
}

/** Canon §8. Written by the template, asserted here, never a form field. */
export const FIXED_BYLINE = "Yallo Talent";

/** The frontmatter fields the pane may edit as single-line scalars. */
export const EDITABLE_ARTICLE_FIELDS = [
  "title",
  "date",
  "category",
  "readingTimeMinutes",
  "published",
] as const;

export type EditableArticleField = (typeof EDITABLE_ARTICLE_FIELDS)[number];

/**
 * `summary` is a folded YAML block in every article in the corpus, and the
 * scalar writer edits single-line values only. `sources`, `industry`, `platform`
 * and `discipline` are lists. Both are edited in the file, and the pane says so
 * rather than offering a control that would truncate them.
 */
export const NOT_EDITABLE_HERE = [
  "summary",
  "sources",
  "industry",
  "platform",
  "discipline",
  "rewriteBrief",
] as const;

export interface ArticleDraftError {
  field: string;
  message: string;
}

export interface ArticleDraft {
  slug: string;
  frontmatter: Record<string, unknown>;
  body: string;
}

/**
 * Title to slug. Lowercase, hyphenated, ASCII.
 *
 * Diacritics are folded rather than stripped, so "Sephora Middle East's" gives
 * `sephora-middle-easts` and not `sephora-middle-east-s`. The result is checked
 * against the schema's kebab-case rule like any other slug, so a title that
 * reduces to nothing is a validation error rather than a file called `.mdx`.
 */
export function slugFromTitle(title: string): string {
  return title
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/['‘’]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* The three taxonomies an article may tag itself with, read from the same
   indexes the site's own routes are generated from. A hand-kept copy here would
   be a second list to drift, which is the defect this repository keeps paying
   for. */
const KNOWN_SLUGS = {
  industry: new Set(industriesIndex.map((e) => e.slug)),
  platform: new Set(platformsIndex.map((e) => e.slug)),
  discipline: new Set(capabilitiesIndex.map((e) => e.slug)),
} as const;

/**
 * Figures in the body that no `sources` entry accounts for.
 *
 * WHAT THIS IS AND IS NOT. Round 23 §4 asks for it and calls it "the build's own
 * rule". It is not one yet: measured on this tree, `sources` is `optional()` in
 * `insightFrontmatterSchema` and no gate cross-checks figures against it. This
 * function therefore INTRODUCES the rule at the authoring surface, which is
 * where it is cheapest to satisfy, and the relay says so.
 *
 * DELIBERATELY NARROW. It matches figures that read as claims — percentages,
 * multipliers, currency amounts, and bare numbers of three digits or more — and
 * ignores years, list ordinals, ISO dates and anything already inside a code
 * fence or a link target. A rule that flags "2026" or "3 things" is a rule
 * authors learn to click past, and a warning nobody reads is worse than none.
 */
export function unsourcedFigures(
  body: string,
  sources: Array<{ claim?: string; source?: string }> | undefined,
): string[] {
  /* Code fences and inline code hold configuration and command output, not
     claims about the world. Link targets hold ids. Neither is prose. */
  const prose = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/\]\([^)]*\)/g, "] ");

  const claims = (sources ?? [])
    .map((s) => `${s.claim ?? ""} ${s.source ?? ""}`)
    .join(" ");

  const found = new Set<string>();
  const patterns = [
    /\b\d+(?:\.\d+)?\s?%/g, // 63%, 12.5 %
    /\b\d+(?:\.\d+)?x\b/gi, // 3x, 1.4x
    /[$£€]\s?\d[\d,.]*\s?(?:k|m|bn|billion|million)?/gi, // $1.2m
    /\b\d[\d,]{2,}\b/g, // 1,000 and 250 upwards
  ];

  for (const pattern of patterns) {
    for (const [match] of prose.matchAll(pattern)) {
      const figure = match.trim();
      /* A four-digit number that is a plausible year is not a claim. */
      if (/^(19|20)\d{2}$/.test(figure)) continue;
      if (claims.includes(figure)) continue;
      /* The digits alone, so "63%" is covered by a claim written "63 per cent". */
      const digits = figure.replace(/[^0-9.]/g, "");
      if (digits && claims.includes(digits)) continue;
      found.add(figure);
    }
  }
  return [...found];
}

/**
 * Everything that must be true before a pull request may open.
 *
 * Schema first, because a frontmatter that does not parse makes every later
 * question meaningless. Then the rules the schema cannot express: the fixed
 * byline, taxonomy slugs that resolve, the slug agreeing with its filename, and
 * the figures rule above.
 */
export function validateArticleDraft(draft: ArticleDraft): ArticleDraftError[] {
  const errors: ArticleDraftError[] = [];
  const fm = draft.frontmatter;

  const parsed = insightFrontmatterSchema.safeParse(fm);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      errors.push({
        field: String(issue.path[0] ?? "frontmatter"),
        message: issue.message,
      });
    }
  }

  if (fm.slug !== draft.slug) {
    errors.push({
      field: "slug",
      message: `The frontmatter slug is "${String(fm.slug)}" but the file is ${articlePath(draft.slug)}. A slug that disagrees with its filename resolves to nothing.`,
    });
  }

  if (fm.author !== FIXED_BYLINE) {
    errors.push({
      field: "author",
      message: `The byline is fixed at "${FIXED_BYLINE}" (canon §8). Nothing in this cockpit attributes writing to a named person.`,
    });
  }

  for (const kind of ["industry", "platform", "discipline"] as const) {
    const value = fm[kind];
    if (value === undefined) continue;
    if (!Array.isArray(value)) {
      errors.push({ field: kind, message: `${kind} must be a list of slugs.` });
      continue;
    }
    for (const slug of value) {
      if (!KNOWN_SLUGS[kind].has(String(slug))) {
        errors.push({
          field: kind,
          message: `"${String(slug)}" is not a known ${kind} slug. The archives are generated from the ${kind} index, so an unknown value tags the article with a page that does not exist.`,
        });
      }
    }
  }

  const unsourced = unsourcedFigures(
    draft.body,
    fm.sources as Array<{ claim?: string; source?: string }> | undefined,
  );
  if (unsourced.length > 0) {
    errors.push({
      field: "sources",
      message: `${unsourced.length} figure(s) in the body have no matching \`sources\` entry: ${unsourced.join(", ")}. Add the source, or take the figure out. An unattributed number is the one thing this site does not publish.`,
    });
  }

  return errors;
}

export function parseArticleFile(slug: string, source: string): ArticleDraft {
  const { data, content } = matter(source);
  const date =
    data.date instanceof Date
      ? data.date.toISOString().slice(0, 10)
      : data.date;
  return { slug, frontmatter: { ...data, date }, body: content };
}

/**
 * A new article file, as bytes.
 *
 * `published: false` is not negotiable and is not a parameter. Round 23 §4:
 * the pane ships, article content does not, every existing insight stays
 * unpublished, and no session publishes one. Publishing is a separate,
 * deliberate act through the toggle, by a person.
 *
 * The body is a single instruction rather than lorem or a skeleton with invented
 * headings. Placeholder content is forbidden this round, and a template that
 * ships fake prose is how placeholder text reaches a live site.
 */
export function newArticleSource(input: {
  title: string;
  slug: string;
  date: string;
  category: string;
  summary: string;
  readingTimeMinutes: number;
}): string {
  const yamlString = (v: string) => JSON.stringify(v);
  return [
    "---",
    `title: ${yamlString(input.title)}`,
    `slug: ${input.slug}`,
    `date: ${input.date}`,
    "summary: >-",
    ...input.summary
      .trim()
      .split(/\s*\n\s*/)
      .map((line) => `  ${line}`),
    `category: ${yamlString(input.category)}`,
    `author: ${yamlString(FIXED_BYLINE)}`,
    `readingTimeMinutes: ${input.readingTimeMinutes}`,
    "published: false",
    "---",
    "",
    "Write the article here. It stays unpublished until someone turns it on.",
    "",
  ].join("\n");
}
