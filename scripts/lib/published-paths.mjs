/**
 * Fetches every published route from the live `/sitemap.xml` rather than
 * hand-listing them: sitemap.ts already derives its entries from
 * `publishedPaths()` (src/lib/published-routes.ts), so parsing its output is
 * deriving once removed rather than a second hand-copy. A plain Node script
 * has no TypeScript loader to import `publishedPaths()` directly.
 *
 * Shared by every gate whose own remit is general-purpose across templates
 * rather than scoped to a route property — round13-scope.md §4.4.
 */
export async function fetchPublishedPaths(base) {
  const xml = await fetch(`${base}/sitemap.xml`).then((r) => r.text());
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  return locs.map((loc) => new URL(loc).pathname);
}
