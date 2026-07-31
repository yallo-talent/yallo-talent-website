import styles from "./HeroAtmosphere.module.css";
import { hashSeed, petalPath } from "./petal-geometry";

/**
 * The full-bleed hero background — B3.
 *
 * Replaces the flat hero band. Three layers, all drawn from the design system
 * and all deterministic from the page slug, so the same surface always renders
 * the same field and neighbours differ:
 *
 *   1. an ambient gradient FIELD, at large scale, taking its hue from `--amb`
 *      (the host assigns it positionally per the section-ambient rule — never
 *      by taxonomy branch, which canon §5 bans);
 *   2. large-scale PETAL geometry, the same quarter-round form as PetalPlate but
 *      sized to the viewport rather than to a card, so the signature reads as
 *      architecture rather than as an illustration;
 *   3. a fine GRAIN, as an SVG turbulence mask at very low alpha.
 *
 * Then a SCRIM, which is the part that matters for legibility. The old site's
 * heroes had the headline sitting in the image; that only survives AA if the
 * text's immediate background is effectively opaque. So the scrim is a
 * two-stop gradient that is near-opaque behind the text column and clears
 * towards the outer edge, and every pair is measured against the scrimmed
 * value, not against the field.
 *
 * No photography, no stock, no legacy imagery. The legacy heroes were mined as
 * reference for the composition only; nothing is traced or embedded.
 *
 * STATIC. There is no animation here at all — not "animation that stops under
 * reduced motion", none. A hero background is the one place where movement
 * competes directly with the LCP text, and canon requires text to remain the
 * LCP element on the homepage. Being inert also means there is nothing for the
 * reduced-motion path to switch off.
 *
 * Rendered as inline SVG rather than an <img> or a CSS gradient stack because it
 * has to scale to any viewport without a fixed aspect ratio, resolve its colours
 * through tokens so both registers and inverted bands stay correct, and cost no
 * network request on the critical path.
 */
export function HeroAtmosphere({
  seed,
  className,
}: {
  seed: string;
  className?: string;
}) {
  const h = hashSeed(seed);

  // Four petals at architectural scale, placed off a coarse grid so the
  // composition differs per page without ever crowding the text column.
  const petals = [0, 1, 2, 3].map((i) => {
    const n = h >> (i * 5);
    const size = 260 + ((n >> 2) % 5) * 90; // 260..620
    return {
      x: -80 + ((n >> 4) % 9) * 130,
      y: -60 + ((n >> 7) % 5) * 90,
      size,
      corner: ((n >> 11) % 4) as 0 | 1 | 2 | 3,
      // Nearer petals slightly stronger, so the field has depth rather than
      // reading as one flat pattern.
      opacity: 0.1 + ((n >> 13) % 4) * 0.045,
    };
  });

  const gid = `hero-${h.toString(36)}`;

  return (
    <div
      className={`${styles.atmosphere} ${className ?? ""}`}
      aria-hidden="true"
    >
      <svg
        className={styles.field}
        viewBox="0 0 1200 600"
        preserveAspectRatio="xMidYMid slice"
        role="presentation"
      >
        <defs>
          {/* The ambient field. --amb is the section's assigned hue; --ground
              keeps both ends resolving through the register. */}
          <radialGradient id={`${gid}-a`} cx="22%" cy="18%" r="88%">
            <stop offset="0%" stopColor="var(--amb)" stopOpacity="0.5" />
            <stop offset="55%" stopColor="var(--amb)" stopOpacity="0.16" />
            <stop offset="100%" stopColor="var(--ground)" stopOpacity="0" />
          </radialGradient>
          {/* A second, cooler pass from the opposite corner gives the field a
              direction. Same hue, so it never reads as two colours. */}
          <radialGradient id={`${gid}-b`} cx="88%" cy="96%" r="76%">
            <stop offset="0%" stopColor="var(--amb)" stopOpacity="0.34" />
            <stop offset="100%" stopColor="var(--ground)" stopOpacity="0" />
          </radialGradient>

          {/* Grain. feTurbulence at a high base frequency is a texture, not a
              pattern: it breaks up the gradient banding that large soft fields
              show on wide displays. */}
          <filter id={`${gid}-grain`} x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>

        <rect width="1200" height="600" fill={`url(#${gid}-a)`} />
        <rect width="1200" height="600" fill={`url(#${gid}-b)`} />

        {/* Petal geometry at architectural scale, in the ambient hue rather than
            in gold: canon §5 keeps gold for markers, and a hero-sized gold form
            would be the largest gold object on the site. */}
        <g fill="var(--amb)">
          {petals.map((p) => (
            <path
              key={`${p.x}-${p.y}-${p.size}`}
              d={petalPath(p.x, p.y, p.size, p.corner)}
              opacity={p.opacity}
            />
          ))}
        </g>

        {/* One struck line in gold — the single marker the composition is
            allowed, matching PetalPlate's signature. */}
        <path
          d={`M0 ${420 + (h % 60)} L1200 ${360 + ((h >> 3) % 80)}`}
          stroke="var(--accent-line)"
          strokeWidth="1"
          opacity="0.28"
          fill="none"
        />

        <rect
          width="1200"
          height="600"
          filter={`url(#${gid}-grain)`}
          opacity="0.055"
        />
      </svg>

      {/* The scrim. Near-opaque behind the text column, clearing outward, so the
          headline sits IN the field while its measured contrast stays the
          register's own pair. */}
      <div className={styles.scrim} />
    </div>
  );
}
