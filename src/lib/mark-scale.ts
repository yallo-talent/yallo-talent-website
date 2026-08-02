import manifest from "../../public/logos/manifest.json";
import surfaces from "./mark-surfaces.json";

/**
 * Optical normalisation for client, integrator and platform marks.
 *
 * THE RULE, canon §5 as amended round 7: a mark is normalised on its RENDERED
 * INK AREA against the set median, never on box height or box width.
 *
 * WHY BOX DIMENSIONS CANNOT WORK. A mark's bounding box is not its optical
 * weight. Measured across the shipped pack: Richemont is 14.45:1 and Wipro is
 * 1.01:1, so a shared cap height gives Richemont roughly fourteen times the ink
 * of Wipro on the same row. That is the "Wipro is tiny beside Infosys" report,
 * and it had been fixed twice by hand-tuning individual widths, which is an
 * instance fix on a class problem — it came back both times.
 *
 * WHAT THIS REPLACES. The previous attempt lived in scripts/build-logos.mjs as
 * a single `dh` per mark, solved against a hand-chosen TARGET_AREA of 1150px².
 * It was measured, but it was wrong twice over, and the manifest showed it:
 *   - It was clamped to 20-46px, and NINE of fifteen marks sat pinned at the 46
 *     ceiling. For those nine the clamp was the operative rule and the
 *     normalisation never ran at all. Rendered ink area still spanned 6.07x
 *     across the rail, from Wipro at -74% of the median to Infosys at +58%.
 *   - One number cannot serve three surfaces at three box sizes, so the case
 *     cards and the platform axis ignored it and rendered at a flat max-height.
 *
 * SO THE SHAPE IS: measurement is a property of the ASSET and lives in the
 * manifest, written by scripts/measure-marks.mjs. Display height is a property
 * of the SURFACE and is derived here. No scale factor is written by hand
 * anywhere, and every number below is a box dimension in CSS px, not a fudge.
 */

interface MarkMetrics {
  family: string;
  /** The image box, in source px. */
  w: number;
  h: number;
  /** Ink as a fraction of the image box. */
  ink: number;
  /** The non-transparent bounding box within the image box. */
  bw: number;
  bh: number;
  pad: number;
  plate?: boolean;
}

const METRICS = manifest as unknown as Record<string, MarkMetrics>;

/** The surfaces on which a mark renders. One entry per rendering unit. */
export type MarkSurface = "rail" | "card" | "axis" | "entity";

export interface SurfaceSpec {
  /**
   * Ceiling and floor on the mark's INK height, not on its image height.
   *
   * The distinction is the whole reason padded assets do not break the set.
   * Wipro's file is 56.4% padding and Workday's is 46.0%; constraining the
   * image box would charge them for their own empty margins and force the ink
   * below the legibility floor. Transparent padding costs nothing to render, so
   * the constraint is applied where the eye actually looks.
   */
  inkCap: number;
  /** Below this an ink box is a hairline rather than a mark. */
  inkFloor: number;
  /** The cell's inner width. Ink wider than this is clamped by CSS anyway. */
  maxInkWidth: number;
  /**
   * The gate's tolerance for this surface, as a fraction of the median.
   *
   * NOT chosen in advance. Each is the tightest band the current asset set can
   * actually satisfy inside the box above, found by sweeping — see the table in
   * scripts/check-marks.mjs. Improve an asset and the value can tighten; the
   * gate reports the achievable figure on every run so the two cannot drift.
   */
  tolerance: number;
}

/**
 * Geometry and tolerances live in src/lib/mark-surfaces.json, which
 * scripts/check-marks.mjs reads too.
 *
 * One file rather than a constant in each, because two copies of a threshold
 * drift and a gate whose threshold disagrees with the code it guards passes
 * exactly the defect it exists to catch. Every value in there is annotated with
 * what measured it.
 */
export const MARK_SURFACES = surfaces as unknown as Record<
  MarkSurface,
  SurfaceSpec
>;

/** `/logos/clients/alshaya.png` -> `alshaya`. */
export function markSlug(src: string): string {
  return (
    src
      .split("/")
      .pop()
      ?.replace(/\.[a-z0-9]+$/i, "") ?? ""
  );
}

export interface MarkScale {
  slug: string;
  /** Image-box height in CSS px. What the component sets. */
  height: number;
  /** Rendered ink area in px², and its deviation from the surface median. */
  inkArea: number;
  deviation: number;
  /** Set when the box, not the objective, decided this mark's size. */
  constrainedBy: "cap" | "floor" | "width" | null;
}

/**
 * Solves the display height for every mark on one surface.
 *
 * At image height H a mark of aspect A covers H·H·A of box, of which `ink` is
 * ink, so rendered ink area is H²·A·ink. Setting that equal to a shared target
 * and solving for H is the whole normalisation: H = sqrt(target / (A·ink)).
 *
 * The target is the set's MEDIAN unit ink area, scaled by a reference height R.
 * R is not chosen; it is swept, because the box constrains the extremes and the
 * choice of R decides which extreme absorbs the residual. Marks that are not
 * clamped land exactly on the median whatever R is, so the sweep only trades
 * the clamped ones against each other and settles where the worst deviation is
 * smallest. Where the whole set fits, the residual is zero and R is arbitrary.
 */
export function markScales(
  srcs: readonly string[],
  surface: MarkSurface,
): Map<string, MarkScale> {
  const spec = MARK_SURFACES[surface];
  const items = srcs
    .map((src) => markSlug(src))
    .filter((slug, i, all) => all.indexOf(slug) === i)
    .map((slug) => ({ slug, m: METRICS[slug] }))
    .filter((x): x is { slug: string; m: MarkMetrics } => Boolean(x.m))
    .map(({ slug, m }) => ({
      slug,
      /** Ink area at image height 1. */
      unit: (m.w / m.h) * m.ink,
      aspect: m.w / m.h,
      /** Ink box as a share of the image box, per axis. */
      hRatio: m.bh / m.h,
      wRatio: m.bw / m.w,
    }));

  const out = new Map<string, MarkScale>();
  if (items.length === 0) return out;

  const units = items.map((i) => i.unit).sort((a, b) => a - b);
  const median = units[Math.floor((units.length - 1) / 2)];

  const solve = (reference: number) => {
    const target = reference * reference * median;
    let worst = 0;
    const rows = items.map((i) => {
      const ideal = Math.sqrt(target / i.unit);
      const capH = spec.inkCap / i.hRatio;
      const widthH = spec.maxInkWidth / (i.aspect * i.wRatio);
      const ceiling = Math.min(capH, widthH);
      const floorH = spec.inkFloor / i.hRatio;
      /* The ceiling wins a fight with the floor: an illegibly small mark is a
         defect to report, an overflowing one breaks the row it sits in. */
      const height = Math.max(
        Math.min(ideal, ceiling),
        Math.min(floorH, ceiling),
      );
      const inkArea = height * height * i.unit;
      const deviation = inkArea / target - 1;
      worst = Math.max(worst, Math.abs(deviation));
      let constrainedBy: MarkScale["constrainedBy"] = null;
      if (height < ideal - 0.05)
        constrainedBy = capH <= widthH ? "cap" : "width";
      else if (height > ideal + 0.05) constrainedBy = "floor";
      return {
        slug: i.slug,
        height: Math.round(height * 10) / 10,
        inkArea: Math.round(inkArea),
        deviation: Math.round(deviation * 1000) / 1000,
        constrainedBy,
      } satisfies MarkScale;
    });
    return { worst, rows };
  };

  /* Coarse then fine, so the search is deterministic and cheap. The range
     covers every box this site has: nothing renders a mark under 4px or over
     140px, and a 0.05px final step is below the device pixel. */
  let best = solve(4);
  let bestR = 4;
  for (let r = 4; r <= 140; r += 1) {
    const attempt = solve(r);
    if (attempt.worst < best.worst - 1e-9) {
      best = attempt;
      bestR = r;
    }
  }
  for (let r = Math.max(4, bestR - 1); r <= bestR + 1; r += 0.05) {
    const attempt = solve(r);
    if (attempt.worst < best.worst - 1e-9) best = attempt;
  }

  for (const row of best.rows) out.set(row.slug, row);
  return out;
}

/** Every measured mark, for the gate and the report. */
export function allMarkMetrics(): Record<string, MarkMetrics> {
  return METRICS;
}
