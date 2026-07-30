/**
 * The drawn plate that replaces stock photography — second generation.
 *
 * Canon forbids photography, people and places outright. This draws a rich
 * gradient-and-geometry composition from the petal form alone, deterministic
 * from a seed string (the page slug): the same surface always draws the same
 * plate, neighbours differ, and there is nothing to commission, host or
 * licence.
 *
 * Colour: the plate takes its hue from the ambient layer via `--amb`, which
 * the HOST assigns positionally (`.amb-1`…`.amb-6` by section rhythm — never
 * by taxonomy). Gold remains the only marker: it appears as the signature
 * corner and one struck line, never as the field. Inside the plate the hue
 * runs stronger than the page-level wash ceiling: a plate is bounded imagery,
 * not atmosphere (QUESTIONS.md Q1), and it never sits behind body copy.
 *
 * Every colour resolves through a token, so plates are correct in both themes
 * and inside inverted bands.
 */

export type PlateVariant = "bloom" | "field" | "strata" | "arcs";

const VARIANTS: PlateVariant[] = ["bloom", "field", "strata", "arcs"];

/** Deterministic, stable across builds — not Math.random(). */
function hash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/** The quarter-round petal as a path: one rounded corner, three square. */
function petalPath(x: number, y: number, s: number, corner: 0 | 1 | 2 | 3) {
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
  const kind = variant ?? VARIANTS[h % VARIANTS.length] ?? "bloom";
  const w = 600;
  const ht = Math.round(w * ratio);
  const uid = `pp${(h % 100000).toString(36)}`;

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
      <defs>
        {/* Atmosphere: the ambient hue breathing up from a corner. */}
        <radialGradient id={`${uid}-atmo`} cx="18%" cy="88%" r="110%">
          <stop
            offset="0%"
            stopColor="var(--amb, var(--amb-1))"
            stopOpacity="0.5"
          />
          <stop
            offset="45%"
            stopColor="var(--amb, var(--amb-1))"
            stopOpacity="0.18"
          />
          <stop
            offset="100%"
            stopColor="var(--amb, var(--amb-1))"
            stopOpacity="0"
          />
        </radialGradient>
        {/* Counter-light from the opposite corner, cooler and fainter. */}
        <radialGradient id={`${uid}-counter`} cx="92%" cy="6%" r="90%">
          <stop
            offset="0%"
            stopColor="var(--amb, var(--amb-1))"
            stopOpacity="0.28"
          />
          <stop
            offset="100%"
            stopColor="var(--amb, var(--amb-1))"
            stopOpacity="0"
          />
        </radialGradient>
        {/* Petal fill: hue into ground, so forms read as glass sheets. */}
        <linearGradient id={`${uid}-petal`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop
            offset="0%"
            stopColor="var(--amb, var(--amb-1))"
            stopOpacity="0.55"
          />
          <stop
            offset="100%"
            stopColor="var(--amb, var(--amb-1))"
            stopOpacity="0.08"
          />
        </linearGradient>
        <linearGradient
          id={`${uid}-petal2`}
          x1="100%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop
            offset="0%"
            stopColor="var(--amb, var(--amb-1))"
            stopOpacity="0.38"
          />
          <stop
            offset="100%"
            stopColor="var(--amb, var(--amb-1))"
            stopOpacity="0.04"
          />
        </linearGradient>
        {/* The one gold moment. */}
        <linearGradient id={`${uid}-strike`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--accent-mark)" stopOpacity="0.95" />
          <stop
            offset="100%"
            stopColor="var(--accent-mark)"
            stopOpacity="0.35"
          />
        </linearGradient>
      </defs>

      {/* Ground and atmosphere. */}
      <rect width={w} height={ht} fill="var(--ground-2)" />
      <rect width={w} height={ht} fill={`url(#${uid}-atmo)`} />
      <rect width={w} height={ht} fill={`url(#${uid}-counter)`} />

      {kind === "bloom" ? <Bloom seed={h} w={w} h={ht} uid={uid} /> : null}
      {kind === "field" ? <Field seed={h} w={w} h={ht} uid={uid} /> : null}
      {kind === "strata" ? <Strata seed={h} w={w} h={ht} uid={uid} /> : null}
      {kind === "arcs" ? <Arcs seed={h} w={w} h={ht} uid={uid} /> : null}

      {/* The signature: one quarter-round corner in gold, always bottom-left. */}
      <path
        d={`M0 ${ht} L0 ${ht - 96} A96 96 0 0 1 96 ${ht} Z`}
        fill="var(--accent-mark)"
        opacity="0.9"
      />
    </svg>
  );
}

/** Three to four large petals overlapping like pressed leaves. */
function Bloom({
  seed,
  w,
  h,
  uid,
}: {
  seed: number;
  w: number;
  h: number;
  uid: string;
}) {
  const n = 3 + (seed % 2);
  const petals = Array.from({ length: n }, (_, i) => {
    const k = hash(`${seed}:bloom:${i}`);
    const s = w * (0.34 + (k % 30) / 100);
    const x = (k % Math.max(1, Math.round(w - s * 0.7))) - s * 0.15;
    const y =
      (Math.floor(k / 7) % Math.max(1, Math.round(h - s * 0.7))) - s * 0.15;
    return {
      k,
      d: petalPath(x, y, s, (k % 4) as 0 | 1 | 2 | 3),
      fill: i % 2 === 0 ? `url(#${uid}-petal)` : `url(#${uid}-petal2)`,
    };
  });
  const strike = hash(`${seed}:strike`);
  return (
    <g>
      {petals.map((p) => (
        <path key={p.k} d={p.d} fill={p.fill} />
      ))}
      {/* One hairline petal outline, and the gold strike underlining it. */}
      <path
        d={petalPath(w * 0.52, h * 0.14, w * 0.34, 0)}
        fill="none"
        stroke="var(--accent-line)"
        strokeWidth="1.5"
        opacity="0.7"
      />
      <rect
        x={w * 0.52}
        y={h * 0.14 + w * 0.34 + 10}
        width={w * (0.16 + (strike % 12) / 100)}
        height={3}
        fill={`url(#${uid}-strike)`}
      />
    </g>
  );
}

/** A field of small petals, gradient-washed, gaps left so it reads organic. */
function Field({
  seed,
  w,
  h,
  uid,
}: {
  seed: number;
  w: number;
  h: number;
  uid: string;
}) {
  const cols = 7;
  const rows = Math.max(2, Math.round((cols * h) / w));
  const cell = w / cols;
  const size = cell * 0.5;
  const cells: React.ReactNode[] = [];

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const n = hash(`${seed}:${x}:${y}`);
      if (n % 3 === 0) continue;
      const cx = x * cell + (cell - size) / 2;
      const cy = y * cell + (cell - size) / 2;
      cells.push(
        <path
          key={`${x}-${y}`}
          d={petalPath(cx, cy, size, (n % 4) as 0 | 1 | 2 | 3)}
          fill={n % 5 === 1 ? `url(#${uid}-petal2)` : `url(#${uid}-petal)`}
          opacity={0.35 + (n % 5) * 0.13}
        />,
      );
    }
  }
  // One cell struck gold: the candidate that made the shortlist.
  const g = hash(`${seed}:gold`);
  const gx = g % cols;
  const gy = Math.floor(g / cols) % rows;
  return (
    <g>
      {cells}
      <path
        d={petalPath(
          gx * cell + (cell - size) / 2,
          gy * cell + (cell - size) / 2,
          size,
          0,
        )}
        fill="var(--accent-mark)"
        opacity="0.85"
      />
    </g>
  );
}

/** Stacked bands of varying weight — a measured quantity, drawn. */
function Strata({
  seed,
  w,
  h,
  uid,
}: {
  seed: number;
  w: number;
  h: number;
  uid: string;
}) {
  const bands = 9;
  const gap = h / bands;
  const rows = Array.from({ length: bands }, (_, i) => {
    const n = hash(`${seed}:band:${i}`);
    return { n, y: i * gap + gap * 0.22, width: w * (0.28 + (n % 60) / 100) };
  });
  return (
    <g>
      {rows.map((row, i) => (
        <rect
          key={row.n}
          x={0}
          y={row.y}
          width={row.width}
          height={gap * 0.52}
          fill={i % 2 === 0 ? `url(#${uid}-petal)` : `url(#${uid}-petal2)`}
          opacity={0.5 + (row.n % 4) * 0.12}
        />
      ))}
      {/* One band struck in gold: the figure that matters. */}
      <rect
        x={0}
        y={(seed % bands) * gap + gap * 0.22}
        width={w * 0.72}
        height={gap * 0.52}
        fill={`url(#${uid}-strike)`}
      />
    </g>
  );
}

/** Concentric quarter-rounds from a corner — the petal as a wave. */
function Arcs({
  seed,
  w,
  h,
  uid,
}: {
  seed: number;
  w: number;
  h: number;
  uid: string;
}) {
  const rings = 6 + (seed % 3);
  const step = Math.round((w * 0.9) / rings);
  const goldRing = seed % rings;
  return (
    <g>
      {Array.from({ length: rings }, (_, i) => {
        const r = step * (i + 1);
        const isGold = i === goldRing;
        return (
          <path
            key={r}
            d={`M${w} ${Math.max(0, h - r)} A${r} ${r} 0 0 1 ${Math.max(0, w - r)} ${h}`}
            fill="none"
            stroke={isGold ? "var(--accent-line)" : "var(--amb, var(--amb-1))"}
            strokeWidth={isGold ? 2.5 : i % 2 === 0 ? 8 : 3}
            opacity={isGold ? 0.9 : 0.5 - i * 0.045}
          />
        );
      })}
      {/* A filled petal anchoring the opposite corner. */}
      <path
        d={petalPath(-w * 0.08, -h * 0.1, w * 0.42, 3)}
        fill={`url(#${uid}-petal)`}
      />
    </g>
  );
}
