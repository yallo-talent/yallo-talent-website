import { taxonomyLandingPaths } from "./taxonomy-slugs.mjs";

/**
 * Every route a gate should visit.
 *
 * Fetches the live `/sitemap.xml` rather than hand-listing: sitemap.ts derives
 * its entries from `discoverablePaths()` (src/lib/published-routes.ts), so
 * parsing its output is deriving once removed rather than a second hand-copy. A
 * plain Node script has no TypeScript loader to import that function directly.
 *
 * PLUS THE TAXONOMY LANDINGS, and the addition is the round-25c correction. The
 * sitemap answers "where should a crawler go", and from this round those are two
 * different questions: all twenty-one single-facet landing pages render whatever
 * is published, and only the ones with an article behind them are listed. A page
 * a crawler should not be sent to is still a page that has to pass axe in both
 * themes at both widths — deriving from the sitemap alone would have left
 * twenty-one live templates unvisited by every browser gate on the estate.
 *
 * Shared by every gate whose own remit is general-purpose across templates
 * rather than scoped to a route property — round13-scope.md §4.4.
 */
export async function fetchPublishedPaths(base) {
  const xml = await fetch(`${base}/sitemap.xml`).then((r) => r.text());
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const fromSitemap = locs.map((loc) => new URL(loc).pathname);
  return [...new Set([...fromSitemap, ...taxonomyLandingPaths()])];
}
