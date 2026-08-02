import { type Client, getConsentedClients, hasLogoAsset } from "@/lib/clients";

/**
 * Match a case study's own `client` string against the client register.
 *
 * Not an exact-string lookup, deliberately. The register carries the short
 * form ("Al Tayer", "Sephora"); several case studies still carry a longer
 * regional variant ("Al Tayer Group", "Sephora Middle East") that
 * context-round7-rulings.md §4.4 assigns to B to normalise at the content
 * layer. Matching by containment means a case study resolves to its register
 * entry today, drifts to nothing if B ever removes the entry, and needs no
 * second edit here once the field is normalised — the fix and this lookup
 * converge on the same string rather than needing to agree on timing.
 */
export function findClientMark(clientName: string): Client | undefined {
  const name = clientName.trim().toLowerCase();
  if (!name) return undefined;
  const all = [
    ...getConsentedClients("enterprise"),
    ...getConsentedClients("integrators"),
  ];
  return all.find((c) => {
    const registered = c.name.trim().toLowerCase();
    return name.includes(registered) || registered.includes(name);
  });
}

export { hasLogoAsset };
