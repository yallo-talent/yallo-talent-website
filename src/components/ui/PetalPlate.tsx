/**
 * The drawn plate that replaces stock photography.
 *
 * Canon forbids photography outright, and every L1, L2 and segment surface was
 * hotlinking Unsplash — a generic register plus a third-party production
 * dependency. This draws a composition instead, entirely from the petal
 * geometry and the gold accent.
 *
 * The composition is derived from a seed string (the page slug), so a surface
 * looks the same on every visit but different from its neighbours, with no
 * asset to commission, host or licence. Every colour resolves through a Layer 2
 * token, so it is correct in both themes and inside an inverted band.
 */

export type PlateVariant = "arcs" | "grid" | "strata";

const VARIANTS: PlateVariant[] = ["arcs", "grid", "strata"];

/** Deterministic, stable across builds — not Math.random(). */
function hash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function PetalPlate({
  seed,
  className,
  variant,
  ratio = 1,
}: {
  /** Usually the page slug. Same seed, same drawing. */
  seed: string;
  className?: string;
  /** Override the derived variant where a surface needs a specific one. */
  variant?: PlateVariant;
  /** Height as a multiple of width. 1 is square; 0.6 is a wide band. */
  ratio?: number;
}) {
  const h = hash(seed);
  const kind = variant ?? VARIANTS[h % VARIANTS.length] ?? "arcs";
  const w = 600;
  const ht = Math.round(w * ratio);

  return (
    <svg
      className={className}
      viewBox={`0 0 ${w} ${ht}`}
      preserveAspectRatio="xMidYMid slice"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <title>Decorative</title>
      {/* Ground. One tonal step from the surrounding surface. */}
      <rect width={w} height={ht} fill="var(--ground-2)" />

      {kind === "arcs" ? <Arcs seed={h} w={w} h={ht} /> : null}
      {kind === "grid" ? <Grid seed={h} w={w} h={ht} /> : null}
      {kind === "strata" ? <Strata seed={h} w={w} h={ht} /> : null}

      {/* The signature: one quarter-round corner, always bottom-left. */}
      <path
        d={`M0 ${ht} L0 ${ht - 96} A96 96 0 0 1 96 ${ht} Z`}
        fill="var(--accent-mark)"
        opacity="0.9"
      />
    </svg>
  );
}

/** Concentric quarter-rounds from the top-right — the petal, repeated. */
function Arcs({ seed, w, h }: { seed: number; w: number; h: number }) {
  const rings = 6 + (seed % 3);
  const step = Math.round((w * 0.9) / rings);
  return (
    <g>
      {Array.from({ length: rings }, (_, i) => {
        const r = step * (i + 1);
        return (
          <path
            key={r}
            d={`M${w} ${Math.max(0, h - r)} A${r} ${r} 0 0 1 ${Math.max(0, w - r)} ${h}`}
            fill="none"
            stroke="var(--accent-mark)"
            strokeWidth={i % 2 === 0 ? 2 : 1}
            opacity={0.55 - i * 0.06}
          />
        );
      })}
    </g>
  );
}

/** A field of small petals at four rotations — the mark used as texture. */
function Grid({ seed, w, h }: { seed: number; w: number; h: number }) {
  const cols = 7;
  const rows = Math.max(2, Math.round((cols * h) / w));
  const cell = w / cols;
  const size = cell * 0.44;
  const cells: React.ReactNode[] = [];

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const n = hash(`${seed}:${x}:${y}`);
      if (n % 3 === 0) continue; // leave gaps so it reads as a field, not a grid
      const cx = x * cell + (cell - size) / 2;
      const cy = y * cell + (cell - size) / 2;
      const corner = n % 4;
      const r = size * 0.5;
      const radii = [
        `0 0 0 ${r}px`,
        `${r}px 0 0 0`,
        `0 ${r}px 0 0`,
        `0 0 ${r}px 0`,
      ];
      cells.push(
        <rect
          key={`${x}-${y}`}
          x={cx}
          y={cy}
          width={size}
          height={size}
          fill="var(--accent-mark)"
          opacity={0.1 + (n % 5) * 0.055}
          style={{ borderRadius: radii[corner] }}
          rx={corner === 0 ? r : 0}
        />,
      );
    }
  }
  return <g>{cells}</g>;
}

/** Stacked bands of varying weight — a measured quantity, drawn. */
function Strata({ seed, w, h }: { seed: number; w: number; h: number }) {
  const bands = 9;
  const gap = h / bands;
  // Precomputed so each band can be keyed by its own deterministic hash rather
  // than by array position.
  const rows = Array.from({ length: bands }, (_, i) => {
    const n = hash(`${seed}:band:${i}`);
    return { n, y: i * gap + gap * 0.22, width: w * (0.28 + (n % 60) / 100) };
  });
  return (
    <g>
      {rows.map((row) => (
        <rect
          key={row.n}
          x={0}
          y={row.y}
          width={row.width}
          height={gap * 0.52}
          fill="var(--accent-mark)"
          opacity={0.12 + (row.n % 4) * 0.07}
          rx={0}
        />
      ))}
      {/* One band struck in the accent line colour: the figure that matters. */}
      <rect
        x={0}
        y={(seed % bands) * gap + gap * 0.22}
        width={w * 0.72}
        height={gap * 0.52}
        fill="var(--accent-line)"
        opacity="0.85"
      />
    </g>
  );
}
