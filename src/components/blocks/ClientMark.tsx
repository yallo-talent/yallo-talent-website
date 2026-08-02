import Image from "next/image";
import {
  allMarkMetrics,
  type MarkSurface,
  markScales,
  markSlug,
} from "@/lib/mark-scale";
import styles from "./ClientMark.module.css";

/**
 * A client, integrator or vendor mark. THE ONLY PLACE A MARK RENDERS.
 *
 * Three surfaces used to render marks three ways: the homepage rail applied a
 * per-mark display height from the build manifest, the case-study cards applied
 * a flat 24px max-height and no ink treatment at all — which is why they were
 * invisible, black silhouettes on a near-black card — and the platform axis
 * applied a flat 26px. One component, one normalisation, one treatment, so a
 * fourth surface cannot invent a fourth.
 *
 * SIZING. Pass the surface's whole mark set as `set`. Ink-area normalisation is
 * a property of a SET, not of a mark: the target is the set's median, so a mark
 * has no correct size until you know what it sits beside. src/lib/mark-scale.ts
 * does the solving and documents the rule; nothing here chooses a number.
 *
 * FALLBACK. No asset means the client's NAME, per canon §8. Never a padded box,
 * never a substituted mark, never a broken image. Callers check the asset
 * exists (lib/clients.ts `hasLogoAsset`) and simply omit `src`.
 *
 * ACCESSIBILITY. `alt` carries the name where the mark is the only thing naming
 * the client. Pass `decorative` where a text label beside it already does —
 * on the platform axis the vendor name renders immediately after the mark, so
 * an alt there stutters the name twice before the content.
 */
export function ClientMark({
  src,
  name,
  surface,
  set,
  decorative = false,
  eager = false,
  className,
}: {
  /** Public path to the mark. Omit for the name fallback. */
  src?: string;
  /** The client or vendor name. Required: it is the alt text and the fallback. */
  name: string;
  surface: MarkSurface;
  /**
   * Every mark path rendered on this surface, so the median can be taken.
   * Defaults to this mark alone, which is correct for a single-mark surface:
   * a set of one is its own median and the cap governs.
   */
  set?: readonly string[];
  decorative?: boolean;
  /**
   * Load immediately without a preload link. What a marquee needs: a lazily
   * loaded mark on a horizontally translated track never enters the viewport
   * by scrolling, so it never loads at all.
   */
  eager?: boolean;
  className?: string;
}) {
  const box = [styles.mark, styles[surface], className]
    .filter(Boolean)
    .join(" ");

  if (!src) {
    return (
      <span className={box} aria-hidden={decorative || undefined}>
        <span className={styles.wordmark}>{name}</span>
      </span>
    );
  }

  const slug = markSlug(src);
  const scales = markScales(set ?? [src], surface);
  const height = scales.get(slug)?.height;
  const metrics = allMarkMetrics()[slug];

  /* An unmeasured mark is a build error waiting to happen, not something to
     paper over with a default height: it means the asset shipped without going
     through scripts/measure-marks.mjs, so check:marks cannot see it either.
     Render the name, which is the same honest fallback as a missing file. */
  if (!height || !metrics) {
    return (
      <span className={box} aria-hidden={decorative || undefined}>
        <span className={styles.wordmark}>{name}</span>
      </span>
    );
  }

  const isVector = src.endsWith(".svg");
  const width = height * (metrics.w / metrics.h);

  return (
    <span
      className={box}
      aria-hidden={decorative || undefined}
      data-mark-slug={slug}
      data-mark-surface={surface}
    >
      <Image
        src={src}
        alt={decorative ? "" : name}
        /* The real rendered box, so next/image builds its srcset from the size
           actually painted. A stale declared width makes the optimiser serve a
           variant sized for a different box and every mark resamples to fit.
           These are rounded because the attributes must be integers; the CSS
           below carries the exact box, so the rounding costs a srcset choice
           rather than the mark's optical weight. */
        width={Math.round(width)}
        height={Math.round(height)}
        className={`${styles.img} ${isVector ? styles.vector : styles.silhouette}`}
        /* Next only routes SVG through the optimiser with dangerouslyAllowSVG
           enabled, and a vector needs no format negotiation anyway. */
        unoptimized={isVector}
        loading={eager ? "eager" : "lazy"}
        style={
          {
            "--mark-h": `${height}px`,
            "--mark-w": `${width.toFixed(2)}px`,
          } as React.CSSProperties
        }
      />
    </span>
  );
}
