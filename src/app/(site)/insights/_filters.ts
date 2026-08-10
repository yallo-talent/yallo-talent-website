import {
  capabilitiesIndex,
  industriesIndex,
  platformsIndex,
} from "@/data/l1/index";
import { ARTICLE_CATEGORIES } from "@/lib/admin/categories.mjs";
import { TAXONOMY_SEGMENT, taxonomyLandingPath } from "@/lib/content-seo";
import type { ArticleRow } from "@/lib/db/content";

/**
 * The `/insights` filter state, read from and written to the URL — design §5:
 * "filter state lives in the URL so a filtered view is shareable".
 *
 * SERVER-SIDE, WITH A PLAIN GET FORM. The filters are a search over thirty rows
 * that the server already holds, so doing it in the browser would mean shipping
 * the corpus to every visitor and re-implementing the match. A GET form puts the
 * state in the URL by construction rather than by a `pushState` somebody has to
 * remember to call, works without JavaScript, and makes the back button do what
 * a reader expects.
 *
 * AN UNKNOWN VALUE IS DROPPED, NOT ERRORED. A query string is user input and
 * arrives mangled by link shorteners, mail clients and people editing it by
 * hand. A filtered view that 400s on a typo is worse than one that ignores the
 * part it cannot read and says what it applied.
 */

export const FILTER_KEYS = [
  "industry",
  "platform",
  "discipline",
  "category",
  "q",
] as const;

export type FilterKey = (typeof FILTER_KEYS)[number];

export interface InsightFilters {
  industry: string | null;
  platform: string | null;
  discipline: string | null;
  category: string | null;
  q: string;
}

export const EMPTY_FILTERS: InsightFilters = {
  industry: null,
  platform: null,
  discipline: null,
  category: null,
  q: "",
};

const KNOWN = {
  industry: new Set(industriesIndex.map((e) => e.slug)),
  platform: new Set(platformsIndex.map((e) => e.slug)),
  discipline: new Set(capabilitiesIndex.map((e) => e.slug)),
} as const;

const KNOWN_CATEGORIES = new Set<string>(ARTICLE_CATEGORIES);

/** The three taxonomies as the control needs them: value, label, in index order. */
export const FILTER_OPTIONS = {
  industry: industriesIndex.map((e) => ({ value: e.slug, label: e.label })),
  platform: platformsIndex.map((e) => ({ value: e.slug, label: e.label })),
  discipline: capabilitiesIndex.map((e) => ({ value: e.slug, label: e.label })),
  category: ARTICLE_CATEGORIES.map((c) => ({ value: c, label: c })),
} as const;

type RawParams = Record<string, string | string[] | undefined>;

function one(raw: string | string[] | undefined): string {
  return (Array.isArray(raw) ? raw[0] : (raw ?? "")).trim();
}

export function parseFilters(params: RawParams): InsightFilters {
  /* Read under the PUBLIC name. The third pillar's parameter is
     `capabilities` because that is what a person reads in a shared URL; the
     field this parses into is `discipline`, which is the column. */
  const pick = (key: "industry" | "platform" | "discipline") => {
    const value = one(params[TAXONOMY_SEGMENT[key]]);
    return value !== "" && KNOWN[key].has(value) ? value : null;
  };
  const category = one(params.category);
  return {
    industry: pick("industry"),
    platform: pick("platform"),
    discipline: pick("discipline"),
    category: KNOWN_CATEGORIES.has(category) ? category : null,
    /* Bounded rather than validated: a search term is free text, and the only
       thing worth refusing is a length nobody typed on purpose. */
    q: one(params.q).slice(0, 120),
  };
}

/** How many facets are set, which is what decides indexability. */
export function facetCount(filters: InsightFilters): number {
  return (
    (filters.industry ? 1 : 0) +
    (filters.platform ? 1 : 0) +
    (filters.discipline ? 1 : 0) +
    (filters.category ? 1 : 0) +
    (filters.q !== "" ? 1 : 0)
  );
}

/**
 * The canonical path for a filter state — canon A5 and design §5.
 *
 * ONE FACET, ONE TAXONOMY: the landing page owns that view, so a single-facet
 * filter canonicalises to it rather than competing with it for the same query.
 * Anything else canonicalises to the bare index. Category and the text search
 * have no landing page of their own and never will: a category is an editorial
 * type rather than a subject, and a search result is not a page.
 */
export function canonicalPathFor(filters: InsightFilters): string {
  if (facetCount(filters) === 1) {
    for (const kind of ["industry", "platform", "discipline"] as const) {
      const value = filters[kind];
      if (value) return taxonomyLandingPath(kind, value);
    }
  }
  return "/insights";
}

/**
 * Whether a crawler should index this view.
 *
 * ONLY THE BARE INDEX. Every filtered view canonicalises somewhere else — a
 * single taxonomy facet to its landing page, everything else to `/insights` —
 * and a page that names another page as canonical has no business also asking
 * to be indexed. This is the half of canon A5 that closes the faceted-crawl
 * hole, and it is one line because the rule is one line.
 */
export function isIndexable(filters: InsightFilters): boolean {
  return facetCount(filters) === 0;
}

/** The query string a set of filters produces, stable in key order. */
export function toQuery(filters: InsightFilters): string {
  const params = new URLSearchParams();
  for (const key of FILTER_KEYS) {
    const value = filters[key];
    if (!value) continue;
    params.set(
      key === "category" || key === "q" ? key : TAXONOMY_SEGMENT[key],
      value,
    );
  }
  const query = params.toString();
  return query === "" ? "" : `?${query}`;
}

/**
 * Apply the filters to a set of rows.
 *
 * THE SEARCH READS TITLE, SUMMARY AND CATEGORY, and deliberately not the body.
 * A body match returns a piece whose relevance a reader cannot see from the
 * card, which reads as a wrong result rather than a deep one; and matching
 * bodies in memory over every published row is a scan that stops being free
 * exactly when the library gets big enough to need a search.
 */
export function applyFilters<T extends ArticleRow>(
  rows: readonly T[],
  filters: InsightFilters,
): T[] {
  const needle = filters.q.toLowerCase();
  return rows.filter((row) => {
    for (const kind of ["industry", "platform", "discipline"] as const) {
      const value = filters[kind];
      if (value && !(row[kind] ?? []).includes(value)) return false;
    }
    if (filters.category && row.category !== filters.category) return false;
    if (needle === "") return true;
    return `${row.title} ${row.summary} ${row.category}`
      .toLowerCase()
      .includes(needle);
  });
}
