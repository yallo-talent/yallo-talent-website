import { industriesIndex } from "@/data/l1/index";
import { sectorRegistry } from "@/data/l1/registry";

/**
 * One derivation for every surface that renders the sector taxonomy.
 *
 * WHY THIS EXISTS. The "where we deploy" rail shipped with a different order
 * from the mega menu, "Public Sector" where the menu says "Government & Public
 * Sector", and "Healthcare & Life Science" where the menu says the plural. Three
 * defects, one cause: the list was hand-copied. It was the sixth hand-copied
 * taxonomy of the round, so the fix is not the rail.
 *
 * `industriesIndex` is the single source for BOTH order and label. No surface
 * writes a sector name and no surface writes a sector order. A seventh sector
 * appears everywhere the moment it is added to the index, and appears with the
 * same name in every place, because there is nowhere else for a name to come
 * from.
 *
 * This deliberately mirrors `capabilityNavEntries`, which already did the same
 * job for disciplines. The two taxonomies now derive the same way.
 */

/** Sector slugs, in the index's order. The canonical order is the index's. */
export const sectorOrder: string[] = industriesIndex.map((e) => e.slug);

/** Index position, for sorting. Unknown slugs sort last, in their own order. */
export function sectorRank(slug: string): number {
  const i = sectorOrder.indexOf(slug);
  return i === -1 ? Number.MAX_SAFE_INTEGER : i;
}

/** The canonical display label for a sector slug, or undefined if not one. */
export function sectorLabel(slug: string): string | undefined {
  return industriesIndex.find((e) => e.slug === slug)?.label;
}

/** Whether a slug names a sector in the index. */
export function isSector(slug: string): boolean {
  return industriesIndex.some((e) => e.slug === slug);
}

/**
 * Nav items for the Industries column, order and label from the index.
 *
 * `published` is derived from the registry rather than declared, so a sector
 * with no page renders as non-interactive text and flips to a link on the
 * commit that adds the page — no second edit, and no window where the menu
 * links to a 404.
 */
export function sectorNavEntries(): Array<{
  label: string;
  href: string;
  published: boolean;
}> {
  return industriesIndex.map((e) => ({
    label: e.label,
    href: e.href ?? `/industries/${e.slug}`,
    published: e.slug in sectorRegistry,
  }));
}

/**
 * Whether a segments list is the sector rail rather than a page's own
 * sub-segments.
 *
 * The distinction is real and both shapes are legitimate: a capability page's
 * segments ARE the sectors it serves, while an L1 sector page's segments are
 * its own sub-markets (retail has `fnb`, `electronics`, `textile`). Only the
 * first kind derives. Every id, not merely one: a list that is mostly sectors
 * plus something else is a rail somebody has edited by hand, which is the
 * defect rather than a shape to support, and `check:taxonomy` fails on it.
 */
export function isSectorRail(segments: ReadonlyArray<{ id: string }>): boolean {
  return segments.length > 0 && segments.every((s) => isSector(s.id));
}

/**
 * A sector list in index order with index labels. Authored copy is untouched:
 * the intro, roles, scope line and icon on each entry are genuinely
 * page-specific and are the reason the list is authored at all. Only the name
 * and the order derive.
 *
 * `keyOf` because the two shapes that need this disagree on the identifier
 * field — a capability page's segments key on `id`, the homepage's sector cards
 * key on `slug` — and that difference is not worth a second copy of the logic.
 *
 * A list that is not the sector taxonomy passes through unchanged, so a caller
 * may apply this unconditionally. A sector that is not yet in the index keeps
 * its authored name and sorts last, which is what lets a planned seventh sector
 * sit at the end of the homepage rail before its index entry exists.
 */
export function deriveSectorList<T extends { name: string }>(
  items: readonly T[],
  keyOf: (item: T) => string,
): T[] {
  const known = items.filter((s) => isSector(keyOf(s)));
  if (known.length === 0) return [...items];
  return [...items]
    .sort((a, b) => sectorRank(keyOf(a)) - sectorRank(keyOf(b)))
    .map((s) => ({ ...s, name: sectorLabel(keyOf(s)) ?? s.name }));
}

/** The capability pages' "where we deploy" rail, keyed on `id`. */
export function deriveSectorRail<T extends { id: string; name: string }>(
  segments: readonly T[],
): T[] {
  if (!isSectorRail(segments)) return [...segments];
  return deriveSectorList(segments, (s) => s.id);
}
