import { type ContentKind, contentPath, deskLinksFor } from "@/lib/content-seo";
import type { ArticleRow } from "@/lib/db/content";
import { SITE } from "@/lib/seo";
import { faqPairs } from "@/lib/tiptap/blocks";

/**
 * The structured data a published article or case study carries — design §6,
 * and nothing beyond it.
 *
 * EVERY FIELD IS A FACT THE ROW ALREADY HOLDS. `jsonld.ts`'s docstring makes the
 * argument for the organisation graph and it applies here with more force:
 * search engines treat fabricated structured detail as a trust signal, which is
 * exactly why none of it may be invented. There is no `wordCount` an author
 * asserted, no `aggregateRating`, no `speakable`, no `Person`. Author and
 * publisher are both the Organization node the root layout already emits, by
 * reference rather than by a second copy — canon §8's house byline is the whole
 * authorship model, so a `Person` author here would be inventing one.
 *
 * `BlogPosting` FOR ARTICLES, `Article` FOR CASE STUDIES. Design §6 offers
 * either. An insight article is a dated editorial piece, which is what
 * `BlogPosting` describes; a case study is a record of work rather than a post,
 * and `Article` is the honest parent type for it. Both are `Article` subtypes,
 * so nothing a crawler does with one is unavailable for the other.
 */

const ORG_ID = `${SITE.url}/#organisation`;

function abs(path: string): string {
  return `${SITE.url}${path}`;
}

/** The taxonomy values a piece carries, as `about` entries with real names. */
function aboutFor(row: ArticleRow) {
  /* DERIVED FROM THE SAME RESOLVER THE DESK LINKS USE, so `about` names the
     same seven-plus-seven-plus-seven set the site publishes and cannot list a
     value the taxonomy has since renamed. A slug the index does not know
     resolves to nothing and is omitted, which is the closed-set behaviour
     everywhere else in this codebase. */
  return deskLinksFor(row).map((desk) => ({
    "@type": "Thing" as const,
    name: desk.label,
    url: abs(desk.href),
  }));
}

export function contentArticleJsonLd(row: ArticleRow, kind: ContentKind) {
  const path = contentPath(kind, row.slug);
  const url = abs(path);
  const headline = (row.metaTitle ?? "").trim() || row.title;
  const description = (row.metaDescription ?? "").trim() || row.summary;
  const about = aboutFor(row);

  return {
    "@context": "https://schema.org",
    "@type": kind === "article" ? "BlogPosting" : "Article",
    "@id": `${url}#content`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    headline,
    ...(description ? { description } : {}),
    /* Canon §8: the byline is "Yallo Talent", applied by the system and never
       an author-editable field. Author and publisher are therefore the same
       organisation, referenced by id rather than restated. */
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    ...(row.publishedAt ? { datePublished: row.publishedAt } : {}),
    dateModified: row.updatedAt,
    ...(row.category ? { articleSection: row.category } : {}),
    ...(about.length ? { about } : {}),
    /* The card a share renders. The uploaded hero if there is one, otherwise
       the PetalPlate this path already generates — the same order the page's
       own OG tag resolves in, from the same two fields. */
    image: [(row.ogImageUrl ?? "").trim() || abs(`/og${path}`)],
    inLanguage: "en-GB",
  };
}

/**
 * BreadcrumbList. Home, hub, piece — the trail the reader actually walked,
 * which is also the one the header and the hub links describe.
 */
export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((step, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: step.name,
      item: abs(step.path),
    })),
  };
}

/**
 * FAQPage, and ONLY where an FAQ block is present.
 *
 * `faqPairs` already drops any pair missing either half, which is the same rule
 * the renderer follows — so the structured data can never advertise a question
 * the page does not draw. A body with no FAQ block returns null and no node is
 * emitted: an empty `FAQPage` is a page claiming to be something it is not.
 */
export function faqJsonLd(body: unknown, path: string) {
  const pairs = faqPairs(body);
  if (pairs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${abs(path)}#faq`,
    mainEntity: pairs.map((pair) => ({
      "@type": "Question",
      name: pair.question,
      acceptedAnswer: { "@type": "Answer", text: pair.answer },
    })),
  };
}

/** Everything a content page emits, in one array, ready to serialise. */
export function contentGraph(
  row: ArticleRow,
  kind: ContentKind,
  trail: { name: string; path: string }[],
): object[] {
  const path = contentPath(kind, row.slug);
  const faq = faqJsonLd(row.body, path);
  return [
    contentArticleJsonLd(row, kind),
    breadcrumbJsonLd(trail),
    ...(faq ? [faq] : []),
  ];
}
