import Image from "next/image";

/**
 * A client, integrator or vendor mark.
 *
 * Always decorative: the accessible name is carried by the surrounding group
 * label or heading, never by the logo, so `alt` is deliberately empty.
 *
 * SVG sources skip the image optimiser. Next only passes SVG through the
 * optimiser when `dangerouslyAllowSVG` is enabled, and enabling that
 * project-wide to serve two first-party vector files is a worse trade than
 * marking those two `unoptimized` — a vector needs no format negotiation
 * anyway. Rasters go through the optimiser and gain AVIF/WebP; they are already
 * emitted at twice their rendered height by scripts/build-logos.mjs.
 */
export function LogoImage({
  src,
  width,
  height,
  className,
  priority = false,
  eager = false,
}: {
  src: string;
  width: number;
  height: number;
  className?: string;
  /** Next's priority: adds a preload link. Use for at most a couple of marks. */
  priority?: boolean;
  /**
   * Load immediately WITHOUT a preload link. This is the setting a marquee
   * needs: a lazily-loaded mark on a horizontally-translated track never enters
   * the viewport by vertical scrolling, so it never loads at all — but marking
   * all 36 of them `priority` emitted 36 preload links and stalled the page's
   * load event outright.
   */
  eager?: boolean;
}) {
  return (
    <Image
      src={src}
      alt=""
      width={width}
      height={height}
      className={className}
      unoptimized={src.endsWith(".svg")}
      loading={priority || eager ? "eager" : "lazy"}
      priority={priority}
    />
  );
}
