import { capabilitiesIndex } from "@/data/l1/index";

/**
 * One derivation for every surface that renders the discipline taxonomy.
 *
 * The nav column and the hub cross-rail already derived before this round —
 * `capabilityNavEntries` in src/data/capabilities/index.ts does the nav, and the
 * hub rail maps `capabilitiesIndex` directly. What did not derive was every
 * `related` cross-link, which carries a hand-typed label beside its href, and
 * those are the copies that would not move if a discipline were renamed. The
 * Cybersecurity to "Cybersecurity & Risk" rename of 2 August is the live proof:
 * the index moved, and eight `related` entries pointing at that page still say
 * the old name would have been the drift. See src/lib/taxonomy-links.ts.
 *
 * CANON §3 RUNS TWO TAXONOMIES THAT SHARE LABELS, and this module is only about
 * one of them. The six specialist DESKS in canon §3 also contain a "Data &
 * Analytics" and a "Cloud & Infrastructure"; they are not disciplines, they do
 * not live in `capabilitiesIndex`, and nothing here should be pointed at them.
 * Applying a discipline rename by string match is precisely how the desk rename
 * of relay v6.0 took the discipline with it and put "Data & AI" on the Data &
 * Analytics page thirteen times.
 *
 * Only name and order derive. Taglines, sub-desks, roles and scope lines stay
 * authored.
 */

/** Discipline slugs, in the index's order. AI Talent is first, per canon §3. */
export const capabilityOrder: string[] = capabilitiesIndex.map((e) => e.slug);

/** Index position, for sorting. Unknown slugs sort last, in their own order. */
export function capabilityRank(slug: string): number {
  const i = capabilityOrder.indexOf(slug);
  return i === -1 ? Number.MAX_SAFE_INTEGER : i;
}

/** The canonical display label for a discipline slug, or undefined if not one. */
export function capabilityLabel(slug: string): string | undefined {
  return capabilitiesIndex.find((e) => e.slug === slug)?.label;
}

/** Whether a slug names a discipline in the index. */
export function isCapability(slug: string): boolean {
  return capabilitiesIndex.some((e) => e.slug === slug);
}

/**
 * The canonical route for a discipline slug.
 *
 * `href` where it is not `/capabilities/{slug}`. AI Talent is the only one: it
 * lives at `/ai-talent`, and linking it through the capability-shaped form would
 * put a 301 hop on the one discipline carrying paid marketing spend.
 */
export function capabilityHref(slug: string): string | undefined {
  const entry = capabilitiesIndex.find((e) => e.slug === slug);
  return entry ? (entry.href ?? `/capabilities/${entry.slug}`) : undefined;
}

/**
 * A discipline list in index order with index labels. Authored fields are
 * untouched: only `name` and the ordering derive.
 *
 * Mirrors `deriveSectorList` and `derivePlatformList`, including the
 * pass-through for a list that is not this taxonomy.
 */
export function deriveCapabilityList<T extends { name: string }>(
  items: readonly T[],
  keyOf: (item: T) => string,
): T[] {
  const known = items.filter((s) => isCapability(keyOf(s)));
  if (known.length === 0) return [...items];
  return [...items]
    .sort((a, b) => capabilityRank(keyOf(a)) - capabilityRank(keyOf(b)))
    .map((s) => ({ ...s, name: capabilityLabel(keyOf(s)) ?? s.name }));
}
