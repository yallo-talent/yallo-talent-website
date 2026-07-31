/**
 * The petal form and its seeding, shared by every drawn surface.
 *
 * Extracted so PetalPlate (bounded card imagery) and HeroAtmosphere (full-bleed
 * hero field) draw the SAME quarter-round form from the SAME hash. Two copies of
 * this would drift, and the form is canon §5's structural signature — the one
 * shape that has to be identical everywhere it appears.
 */

/** Deterministic, stable across builds — not Math.random(). */
export function hashSeed(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/**
 * The quarter-round petal as an SVG path: three square corners, one radius,
 * taken from the Yallo mark. `corner` selects which corner is rounded.
 */
export function petalPath(
  x: number,
  y: number,
  s: number,
  corner: 0 | 1 | 2 | 3,
): string {
  const r = s;
  switch (corner) {
    case 0: // rounded bottom-left
      return `M${x} ${y} L${x + s} ${y} L${x + s} ${y + s} L${x + r} ${y + s} A${r} ${r} 0 0 1 ${x} ${y + s - r} Z`;
    case 1: // rounded top-left
      return `M${x + s} ${y} L${x + s} ${y + s} L${x} ${y + s} L${x} ${y + r} A${r} ${r} 0 0 1 ${x + r} ${y} Z`;
    case 2: // rounded top-right
      return `M${x} ${y} L${x + s - r} ${y} A${r} ${r} 0 0 1 ${x + s} ${y + r} L${x + s} ${y + s} L${x} ${y + s} Z`;
    default: // rounded bottom-right
      return `M${x} ${y} L${x + s} ${y} L${x + s} ${y + s - r} A${r} ${r} 0 0 1 ${x + s - r} ${y + s} L${x} ${y + s} Z`;
  }
}
