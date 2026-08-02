"use client";

import { useMemo, useState } from "react";
import { CaseStudyCard, type CaseStudyCardData } from "./CaseStudyCard";
import styles from "./CaseStudyFilters.module.css";
import type { TaxonomyChip } from "./taxonomy";

export interface FilterableCard extends CaseStudyCardData {
  pillar?: string;
  platformHref?: string;
  sectorHref?: string;
}

/**
 * Client-side faceted filtering over an already-built, already-ordered list.
 * No fetch, no route change: the full set is static-generated once and this
 * only toggles which cards are visible, AND across facets and OR within one.
 *
 * A facet group with no options does not render — the sector facet is empty
 * today because no case study populates the `industry` field yet (logged in
 * the round's relay), and an empty filter row would be worse than none.
 */
export function CaseStudyFilters({
  cards,
  pillarOptions,
  platformOptions,
  sectorOptions,
}: {
  cards: FilterableCard[];
  pillarOptions: string[];
  platformOptions: TaxonomyChip[];
  sectorOptions: TaxonomyChip[];
}) {
  const [pillar, setPillar] = useState<string | null>(null);
  const [platform, setPlatform] = useState<string | null>(null);
  const [sector, setSector] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      cards.filter(
        (c) =>
          (!pillar || c.pillar === pillar) &&
          (!platform || c.platformHref === platform) &&
          (!sector || c.sectorHref === sector),
      ),
    [cards, pillar, platform, sector],
  );

  /* Taken over every card rather than the filtered ones, and once rather than
     per card. The mark set is what the median is taken from, so deriving it
     from `filtered` would rescale every mark on the grid whenever a facet
     changed. */
  const markSet = useMemo(
    () =>
      cards
        .map((c) => c.clientLogo)
        .filter((logo): logo is string => Boolean(logo)),
    [cards],
  );

  return (
    <div>
      <div className={styles.facets}>
        {pillarOptions.length > 0 && (
          <FacetGroup
            label="Pillar"
            active={pillar}
            onSelect={setPillar}
            options={pillarOptions.map((p) => ({ value: p, label: p }))}
          />
        )}
        {platformOptions.length > 0 && (
          <FacetGroup
            label="Platform"
            active={platform}
            onSelect={setPlatform}
            options={platformOptions.map((p) => ({
              value: p.href ?? p.label,
              label: p.label,
            }))}
          />
        )}
        {sectorOptions.length > 0 && (
          <FacetGroup
            label="Sector"
            active={sector}
            onSelect={setSector}
            options={sectorOptions.map((s) => ({
              value: s.href ?? s.label,
              label: s.label,
            }))}
          />
        )}
      </div>

      {filtered.length > 0 ? (
        <div className={styles.grid}>
          {filtered.map((card) => (
            <CaseStudyCard key={card.slug} card={card} set={markSet} />
          ))}
        </div>
      ) : (
        <p className={styles.empty}>No case studies match that filter.</p>
      )}
    </div>
  );
}

function FacetGroup({
  label,
  options,
  active,
  onSelect,
}: {
  label: string;
  options: Array<{ value: string; label: string }>;
  active: string | null;
  onSelect: (value: string | null) => void;
}) {
  return (
    <div className={styles.facetGroup}>
      <span className={styles.facetLabel}>{label}</span>
      <div className={styles.facetPills}>
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            className={styles.facetPill}
            data-active={active === o.value}
            onClick={() => onSelect(active === o.value ? null : o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
