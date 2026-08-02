import { platformsIndex } from "@/data/l1/index";

/**
 * One derivation for every surface that renders the platform taxonomy.
 *
 * WHY THIS EXISTS. Round 4 fixed sectors and predicted that the same fault sat
 * under every other taxonomy on the site. It did. Six copies of the platform set
 * were live at the head of round 5, and five of them were missing Informatica —
 * ratified as the seventh platform on 1 August (R-INF1) and added to the index,
 * to the mega menu and to the vendor map, but not to the hub rail, the JSON-LD,
 * the CV form or the L2 cross-link map. One of them had also transposed
 * Microsoft and Salesforce against canon §3's order.
 *
 * That is the class context-round5-rulings.md §5 rules on: a taxonomy rendered
 * from a hand-written list will drift, because adding a platform to the index
 * does not add it to a copy. So name and order derive here, and a seventh
 * platform reaches every surface by being added in one place.
 *
 * ORDER IS THE INDEX'S, which is canon §3's: SAP, Oracle, Microsoft, Salesforce,
 * Blue Yonder, Workday, then Informatica last (R-INF2). No surface expresses a
 * platform order of its own.
 *
 * Only name and order derive. Taglines, module lists, roles and icons stay
 * authored, exactly as they do for sectors.
 *
 * NO IMPORT OF `@/data/platforms/derive` HERE, and it is deliberate. That module
 * imports this one for its vendor map, and a module-level call across the cycle
 * would read an uninitialised binding. Every function below is pure over the
 * index; the ones that need to know whether a platform has a page take the
 * published predicate from their caller.
 */

/** Platform slugs, in the index's order. The canonical order is the index's. */
export const platformOrder: string[] = platformsIndex.map((e) => e.slug);

/** Index position, for sorting. Unknown slugs sort last, in their own order. */
export function platformRank(slug: string): number {
  const i = platformOrder.indexOf(slug);
  return i === -1 ? Number.MAX_SAFE_INTEGER : i;
}

/** The canonical display label for a platform slug, or undefined if not one. */
export function platformLabel(slug: string): string | undefined {
  return platformsIndex.find((e) => e.slug === slug)?.label;
}

/** Whether a slug names a platform in the index. */
export function isPlatform(slug: string): boolean {
  return platformsIndex.some((e) => e.slug === slug);
}

/** Every platform label, in index order. */
export function platformLabels(): string[] {
  return platformsIndex.map((e) => e.label);
}

/**
 * Vendor display name to platform slug, in index order.
 *
 * Two copies of this map were live: one in `platforms/derive.ts` keying sector
 * tool cards onto the platform axis, one in `L2PageShell` keying an L2's vendor
 * onto its platform link. The second was missing Informatica, so an Informatica
 * module page rendered no link back to its own platform.
 *
 * The vendor name IS the platform label for all seven, which is why one map
 * serves both. If a vendor ever ships under a name the taxonomy does not use,
 * that is an authored alias and belongs beside the data, not here.
 */
export function vendorSlugMap(): Record<string, string> {
  return Object.fromEntries(platformsIndex.map((e) => [e.label, e.slug]));
}

/**
 * Nav and rail entries, order and label from the index.
 *
 * `isPublished` is injected rather than imported so this module stays free of
 * the platform-coverage cycle described above. Callers pass `routeExists` or
 * `publishedPlatformSlugs`, both of which already answer the question from data
 * rather than from a hand-declared flag — which is the second half of decision 9
 * in context-round5-rulings.md: a hand-declared publication state is the same
 * class of defect as a hand-copied label.
 */
export function platformNavEntries(
  isPublished: (slug: string) => boolean,
): Array<{ slug: string; label: string; href: string; published: boolean }> {
  return platformsIndex.map((e) => ({
    slug: e.slug,
    label: e.label,
    href: e.href ?? `/platforms/${e.slug}`,
    published: isPublished(e.slug),
  }));
}

/**
 * A platform list in index order with index labels. Authored fields on each
 * entry are untouched: only `name` and the ordering derive.
 *
 * Mirrors `deriveSectorList` deliberately, down to the pass-through behaviour —
 * a list that is not the platform taxonomy is returned unchanged, so a caller
 * may apply this without first testing what it holds, and a platform not yet in
 * the index keeps its authored name and sorts last.
 */
export function derivePlatformList<T extends { name: string }>(
  items: readonly T[],
  keyOf: (item: T) => string,
): T[] {
  const known = items.filter((s) => isPlatform(keyOf(s)));
  if (known.length === 0) return [...items];
  return [...items]
    .sort((a, b) => platformRank(keyOf(a)) - platformRank(keyOf(b)))
    .map((s) => ({ ...s, name: platformLabel(keyOf(s)) ?? s.name }));
}
