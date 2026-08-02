import type { CaseStudyFrontmatter } from "@/lib/content-schema";
import { platformLabel, platformOrder } from "@/lib/platforms";
import { isSector, sectorLabel } from "@/lib/sectors";

/**
 * Taxonomy chip and filter derivation for the case study family.
 *
 * WHY THIS DOES NOT LOOK LIKE `platforms.ts` OR `sectors.ts`. Those derive from
 * a canonical slug the caller already holds. A case study's own `platform`
 * field is free authored text ("SAP S/4HANA", "Custom planning platform"),
 * not a slug, because the source case studies were never tagged against the
 * platform taxonomy. So platform identity here is a CONTAINMENT match against
 * the canonical label set — never a hand-typed synonym table, and never a
 * guess at a client's sector. A study whose platform text names no canonical
 * platform (`"Multi-platform"`, `"Supply chain"`) carries no platform chip,
 * which is correct: it is not tagged, not mistagged.
 *
 * Sector has no derivation at all yet. `industry` is on the schema
 * (inherited from the insight frontmatter base) but no case study populates
 * it, so `sectorChip` and the sector filter are both empty until content adds
 * it — logged in the round's relay rather than guessed here.
 *
 * Pillar is the one closed enumeration on this page: canon §1 fixes Contract,
 * Permanent, EOR and Managed Delivery as the four pillars, and the schema's
 * own comment on `engagement` adds Advisory as the fifth value the field
 * actually carries. Unlike platforms and sectors this set is not growing, so
 * a small table here is not the drifting hand-written list canon and the
 * relay both warn about — it is the closed set the schema comment already
 * names, given routes only where those routes exist.
 */

export interface TaxonomyChip {
  label: string;
  href?: string;
}

const PILLAR_ROUTES: Record<string, string> = {
  Contract: "/contract",
  Permanent: "/permanent",
  EOR: "/eor",
  "Managed Delivery": "/managed-delivery",
};

export function pillarChip(
  engagement: string | undefined,
): TaxonomyChip | undefined {
  if (!engagement) return undefined;
  return { label: engagement, href: PILLAR_ROUTES[engagement] };
}

export function pillarFilterOptions(
  studies: readonly CaseStudyFrontmatter[],
): string[] {
  const present = new Set(
    studies.map((s) => s.engagement).filter((v): v is string => Boolean(v)),
  );
  const known = Object.keys(PILLAR_ROUTES).filter((p) => present.has(p));
  const rest = [...present].filter((p) => !(p in PILLAR_ROUTES)).sort();
  return [...known, ...rest];
}

export function platformChip(platformText: string): TaxonomyChip | undefined {
  const lower = platformText.toLowerCase();
  for (const slug of platformOrder) {
    const label = platformLabel(slug);
    if (label && lower.includes(label.toLowerCase())) {
      return { label, href: `/platforms/${slug}` };
    }
  }
  return undefined;
}

export function platformFilterOptions(
  studies: readonly CaseStudyFrontmatter[],
): TaxonomyChip[] {
  const seen = new Map<string, TaxonomyChip>();
  for (const s of studies) {
    const chip = platformChip(s.platform);
    if (chip?.href) seen.set(chip.href, chip);
  }
  return platformOrder
    .map((slug) => seen.get(`/platforms/${slug}`))
    .filter((c): c is TaxonomyChip => Boolean(c));
}

export function sectorChip(
  industry: string[] | undefined,
): TaxonomyChip | undefined {
  const slug = industry?.find((s) => isSector(s));
  if (!slug) return undefined;
  const label = sectorLabel(slug);
  return label ? { label, href: `/industries/${slug}` } : undefined;
}

export function sectorFilterOptions(
  studies: readonly CaseStudyFrontmatter[],
): TaxonomyChip[] {
  const seen = new Map<string, TaxonomyChip>();
  for (const s of studies) {
    const chip = sectorChip(s.industry);
    if (chip?.href) seen.set(chip.href, chip);
  }
  return [...seen.values()];
}

/** Plain text only: no `/regions/{x}` route exists anywhere on the site. */
export function regionChip(region: string): TaxonomyChip {
  return { label: region };
}
