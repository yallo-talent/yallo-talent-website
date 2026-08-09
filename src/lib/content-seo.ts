import {
  capabilitiesIndex,
  industriesIndex,
  platformsIndex,
} from "@/data/l1/index";
import type { ArticleRow } from "@/lib/db/content";
import type { Desk } from "@/lib/tiptap/blocks";
import { resolveDesk } from "@/lib/tiptap/blocks";
import { docToText } from "@/lib/tiptap/text.mjs";
import type { SEOMeta } from "@/types";

/**
 * Everything design §6 asks a published piece to carry, derived from the row.
 *
 * WHY THIS MODULE EXISTS AT ALL. The editor has held `meta_title`,
 * `meta_description`, `canonical_url` and `og_image_url` since round 25b, and
 * `/insights/[slug]` and `/case-studies/[slug]` both ignored all four: each
 * built its metadata from `title` and `summary` directly. Four fields a writer
 * can fill in and no surface reads is worse than no fields at all, because the
 * cockpit tells them it worked. Two routes, one derivation, so they cannot
 * disagree about which field wins.
 *
 * NOT `server-only`, deliberately, and for the same reason
 * `content-validation.ts` is not: everything here is pure over its inputs and
 * holds no secret, so a gate can import it and watch it produce what a crawler
 * will read.
 */

/** The four routes a piece of each type lives under. */
export type ContentKind = "article" | "case_study";

const PUBLIC_ROUTE: Record<ContentKind, string> = {
  article: "/insights",
  case_study: "/case-studies",
};

const HUB_LABEL: Record<ContentKind, string> = {
  article: "Insights",
  case_study: "Case studies",
};

export function contentPath(kind: ContentKind, slug: string): string {
  return `${PUBLIC_ROUTE[kind]}/${slug}`;
}

/**
 * The row's SEO fields, each falling back to the field it is derived from.
 *
 * NULL MEANS "DERIVE IT", EMPTY STRING MEANS "THE AUTHOR CLEARED IT" — the
 * distinction 0005_content.sql made the columns nullable to keep. A cleared
 * meta title still has to produce a `<title>`, so the fallback runs on both; the
 * difference the columns preserve is what the cockpit shows the author, not what
 * the page emits.
 *
 * The suffix is applied here rather than typed into `meta_title`, so a writer
 * spending characters on the brand name is spending them against a 60-character
 * budget that already excludes it.
 */
export function contentSeo(row: ArticleRow): SEOMeta {
  const title = (row.metaTitle ?? "").trim() || row.title;
  const description = (row.metaDescription ?? "").trim() || row.summary;
  const canonical = (row.canonicalUrl ?? "").trim();
  const ogImage = (row.ogImageUrl ?? "").trim();
  return {
    title: `${title} · Yallo Talent`,
    description,
    /* Absent means "this page is its own canonical", which `buildMetadata`
       resolves against SITE.url. A canonical the author typed is honoured
       whole: it is the field for saying "this piece lives somewhere else". */
    ...(canonical ? { canonical } : {}),
    /* The uploaded hero wins; otherwise NOTHING is set here, and
       `buildMetadata` falls back to `/og{path}` — the PetalPlate drawn from
       this piece's own path. That is design §6's "uploaded hero, or PetalPlate
       generated from the slug" in that order, and the fallback stays in the
       one place every other page on the estate already gets it from rather
       than being spelled a second time here. Never a static default: the one
       this site used to name did not exist, and every share previewed broken. */
    ...(ogImage ? { ogImage } : {}),
  };
}

const INDEX = {
  industry: industriesIndex,
  platform: platformsIndex,
  discipline: capabilitiesIndex,
} as const;

export type TaxonomyKind = keyof typeof INDEX;

export const TAXONOMY_KINDS: readonly TaxonomyKind[] = [
  "industry",
  "platform",
  "discipline",
];

/**
 * The URL segment and the visible label for each pillar.
 *
 * THE THIRD PILLAR IS CALLED TWO THINGS, AND THAT IS DELIBERATE RATHER THAN A
 * MESS. The database column, the TypeScript type and every internal reference
 * say `discipline`, which is what canon A5 ratified and what round 25's schema
 * shipped. Everything a visitor sees says **Capabilities**, which is what the
 * nav column, the hub at `/capabilities` and the desk routes have said since
 * long before this round — canon §4's "Disciplines" nav wording is the stale
 * line, not the site.
 *
 * Sumeet ruled on 9 August 2026, during this round, that the public surface
 * wins and the column stays: the rename is cheap now (no article is published,
 * no article carries a taxonomy value, and zero `/insights/discipline/*` URLs
 * are indexed) and a column rename would be a migration buying nothing a
 * reader can see. This amends canon A5's route clause, which names
 * `/insights/discipline/{slug}` literally, and is logged for his ratification.
 *
 * ONE DECLARATION. The segment is spelled here and nowhere else in TypeScript,
 * so the route, the canonical, the revalidation and the sitemap cannot disagree
 * about it. The plain-Node gates get their copy from
 * `scripts/lib/taxonomy-slugs.mjs`, which says so in its own comment.
 */
export const TAXONOMY_SEGMENT: Record<TaxonomyKind, string> = {
  industry: "industry",
  platform: "platform",
  discipline: "capabilities",
};

export const TAXONOMY_LABEL: Record<TaxonomyKind, string> = {
  industry: "Industry",
  platform: "Platform",
  discipline: "Capabilities",
};

/** The public path of a single-facet landing page. */
export function taxonomyLandingPath(kind: TaxonomyKind, slug: string): string {
  return `/insights/${TAXONOMY_SEGMENT[kind]}/${slug}`;
}

/**
 * The desks a piece's taxonomy names, resolved against the live indexes.
 *
 * DESIGN §6: "automatic internal links to the desks named in the taxonomy
 * fields". Automatic is the whole of it — a writer tags the piece once, in the
 * fields they already have to fill in to publish at all, and the links follow.
 * Nothing here is typed by an author and nothing is stored: a desk renamed in
 * its index is renamed on every article that points at it.
 *
 * Order is taxonomy order within each kind and industry-platform-discipline
 * across them, because that is the order the indexes express and the order the
 * rest of the estate renders these three families in.
 */
export function deskLinksFor(row: ArticleRow): Desk[] {
  const out: Desk[] = [];
  const seen = new Set<string>();
  for (const kind of TAXONOMY_KINDS) {
    for (const entry of INDEX[kind]) {
      if (!(row[kind] ?? []).includes(entry.slug)) continue;
      const desk = resolveDesk({ kind, slug: entry.slug });
      if (!desk || seen.has(desk.href)) continue;
      seen.add(desk.href);
      out.push(desk);
    }
  }
  return out;
}

/**
 * The related rail: other published pieces sharing this one's taxonomy, most
 * shared values first.
 *
 * SHARED TAXONOMY, NOT RECENCY. Design §6 says "a related-articles rail derived
 * from shared taxonomy", and the difference matters: recency puts whatever was
 * published last under every article, which is a second index rather than a
 * related rail. Ties break on recency, because between two pieces sharing the
 * same two tags the newer one is the better answer.
 *
 * The piece itself is excluded, and a piece sharing nothing never appears — an
 * empty rail renders nothing, which is the same rule the testimonial slot
 * follows.
 */
export function relatedByTaxonomy<T extends ArticleRow>(
  subject: ArticleRow,
  candidates: readonly T[],
  limit = 3,
): T[] {
  const scored = candidates
    .filter((c) => c.id !== subject.id)
    .map((row) => {
      let shared = 0;
      for (const kind of TAXONOMY_KINDS) {
        const mine = new Set(subject[kind] ?? []);
        for (const value of row[kind] ?? []) if (mine.has(value)) shared++;
      }
      return { row, shared };
    })
    .filter((s) => s.shared > 0);

  scored.sort((a, b) => {
    if (b.shared !== a.shared) return b.shared - a.shared;
    const at = a.row.publishedAt ?? a.row.updatedAt;
    const bt = b.row.publishedAt ?? b.row.updatedAt;
    return bt.localeCompare(at);
  });

  return scored.slice(0, limit).map((s) => s.row);
}

/**
 * The answer-first soft check, `context-discoverability-scope-v1.0.md` §4 as
 * design §6 asks for it: a WARNING in the editor, never a publish refusal.
 *
 * SOFT IS THE RULING, AND IT IS NOT TIMIDITY. The eight publish refusals are
 * mechanical — a figure either has a source or it does not. Whether a first
 * paragraph states a substantive claim is a judgement, and a validator that
 * refuses on a judgement is a validator writers learn to defeat rather than
 * satisfy. So this returns prose for the writer to disagree with.
 *
 * WHAT IT MEASURES, stated plainly so nobody reads more into it. Three
 * heuristics over the summary and the first paragraph, none of which can tell a
 * good answer from a bad one:
 *
 *   1. The summary is missing or too short to hold an answer.
 *   2. The first paragraph is shorter than a sentence that could carry one.
 *   3. The first paragraph opens on scene-setting rather than on a claim —
 *      the openers below, which the discoverability scope names as the tell.
 *
 * It never inspects the claim itself, and it says so to the writer.
 */
const SCENE_SETTING_OPENERS = [
  "in today",
  "in the current",
  "in recent years",
  "over the past",
  "it is no secret",
  "we all know",
  "as organisations",
  "as businesses",
  "as companies",
  "there has never been",
  "the world of",
  "in an era",
];

/** A first paragraph shorter than this cannot be carrying the answer. */
const FIRST_PARAGRAPH_FLOOR = 80;

export interface AnswerFirstNote {
  /** What the writer is being told, in one sentence they can act on. */
  message: string;
}

export function answerFirstNotes(row: {
  summary: string;
  body: unknown;
}): AnswerFirstNote[] {
  const notes: AnswerFirstNote[] = [];
  const summary = (row.summary ?? "").trim();
  if (summary.length < 40) {
    notes.push({
      message:
        "The summary is the first thing an answer engine quotes. It reads as too short to state the answer; say what the piece concludes, not what it covers.",
    });
  }

  const first = docToText(row.body).split("\n\n")[0]?.trim() ?? "";
  if (first === "") {
    notes.push({
      message:
        "There is no opening paragraph yet, so the first screen carries no claim at all.",
    });
    return notes;
  }
  if (first.length < FIRST_PARAGRAPH_FLOOR) {
    notes.push({
      message: `The opening paragraph is ${first.length} characters. The first screen is where a retrieval engine looks for the answer, and a line that short is rarely carrying one.`,
    });
  }
  const lowered = first.toLowerCase();
  const opener = SCENE_SETTING_OPENERS.find((o) => lowered.startsWith(o));
  if (opener) {
    notes.push({
      message: `The opening paragraph starts "${first.slice(0, 40).trim()}…", which is scene-setting rather than a claim. Lead with what you found; the context can follow it.`,
    });
  }
  return notes;
}

/** The breadcrumb trail a piece sits on, hub then piece. */
export function breadcrumbFor(
  kind: ContentKind,
  row: Pick<ArticleRow, "slug" | "title">,
): { name: string; path: string }[] {
  return [
    { name: "Home", path: "/" },
    { name: HUB_LABEL[kind], path: PUBLIC_ROUTE[kind] },
    { name: row.title, path: contentPath(kind, row.slug) },
  ];
}
