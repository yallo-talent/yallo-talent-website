/**
 * The EOR country set, ratified by Sumeet 2 August 2026: UAE, Saudi Arabia,
 * India. One index — every surface that names the corridor (mega menu,
 * `/eor`) maps over this rather than hand-typing the list again.
 *
 * Country-level only. No per-country service descriptor (entity, payroll,
 * visa sponsorship, or some subset) is ratified for Saudi Arabia, so this
 * file carries names, not mechanisms. See docs/design/context-round9-scope.md
 * §4b.
 */
export const eorCountries = ["UAE", "Saudi Arabia", "India"] as const;

export const eorCorridorLabel = eorCountries.join(", ");

/** "UAE, Saudi Arabia and India" — for prose, where a comma-only list before
 * the final item reads as a fragment rather than a sentence. */
export const eorCorridorProse = `${eorCountries.slice(0, -1).join(", ")} and ${eorCountries.at(-1)}`;
