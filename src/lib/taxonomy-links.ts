import { capabilityLabel } from "@/lib/capabilities";
import { platformLabel } from "@/lib/platforms";
import { sectorLabel } from "@/lib/sectors";

/**
 * The display label for an internal taxonomy href, derived from the index that
 * owns it.
 *
 * WHY THIS EXISTS. `related` cross-links carry a hand-typed `label` beside their
 * `href`, on every L1 and L2 in the repo. The href is a fact — it either routes
 * or it does not, and `routeExists` already checks that. The label is a copy of
 * a taxonomy name, and it is the copy that drifts: renaming a discipline in
 * `capabilitiesIndex` moves the page's own title, its nav entry and its hub card,
 * and moves none of the cross-links pointing at it. The Cybersecurity to
 * "Cybersecurity & Risk" rename of 2 August 2026 is the worked example, and the
 * platform set carried a live instance of the same shape: five hand-written
 * copies had never gained Informatica after it was ratified on 1 August.
 *
 * So the label is derived from the href wherever the href names something the
 * taxonomy knows, and the authored label is kept wherever it does not. That
 * second half matters: `related` also points at case studies, service pages and
 * insight articles, whose labels are genuinely authored and have no index to
 * come from. A deriver that insisted on owning every label would have to invent
 * one for those, which is the failure this exists to prevent.
 *
 * `/ai-talent` resolves through the capability index rather than by pattern,
 * because it is the one discipline whose canonical route is not
 * `/capabilities/{slug}`.
 */
export function taxonomyLabelForHref(href: string): string | undefined {
  const path = href.split("#")[0]?.split("?")[0]?.replace(/\/+$/, "") ?? "";

  if (path === "/ai-talent") return capabilityLabel("ai-talent");

  const capability = /^\/capabilities\/([^/]+)$/.exec(path);
  if (capability?.[1]) return capabilityLabel(capability[1]);

  const platform = /^\/platforms\/([^/]+)$/.exec(path);
  if (platform?.[1]) return platformLabel(platform[1]);

  const sector = /^\/industries\/([^/]+)$/.exec(path);
  if (sector?.[1]) return sectorLabel(sector[1]);

  return undefined;
}

/**
 * Normalise a list of cross-links so every taxonomy label comes from its index.
 *
 * Order is NOT touched here, and that is the deliberate difference from
 * `deriveSectorRail` and its two siblings. A `related` rail is a curated subset
 * spanning three taxonomies plus authored pages — its sequence is an editorial
 * judgement about what a reader wants next, not an expression of taxonomy order,
 * so there is no index order to impose on it. Only the names derive.
 */
export function deriveLinkLabels<T extends { href: string; label: string }>(
  links: readonly T[],
): T[] {
  return links.map((l) => {
    const derived = taxonomyLabelForHref(l.href);
    return derived === undefined ? l : { ...l, label: derived };
  });
}
