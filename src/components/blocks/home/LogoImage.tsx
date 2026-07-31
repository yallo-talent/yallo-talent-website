import Image from "next/image";

/**
 * A client, integrator or vendor mark.
 *
 * NOT decorative when it names a client. The `alt` was empty on every mark on
 * the reasoning that "the surrounding group label carries the name" — but that
 * label is "Clients and integrators", not the client's name, so eleven of
 * eighteen marks were silent and the rail's whole accessible text was the seven
 * clients that happen to ship as typeset names. Canon §8 makes this rail the
 * proof, and 61% of the proof was invisible; every integrator is an image, so
 * the caption's claim about integrators had zero exposed referents.
 *
 * `alt` now takes the client's name when one is given. Pass `alt=""` explicitly
 * for a mark that genuinely is decoration.
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
  alt = "",
  width,
  height,
  className,
  priority = false,
  eager = false,
}: {
  src: string;
  /** The client or integrator name. Empty only for true decoration. */
  alt?: string;
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
      alt={alt}
      width={width}
      height={height}
      className={className}
      unoptimized={src.endsWith(".svg")}
      loading={priority || eager ? "eager" : "lazy"}
      priority={priority}
    />
  );
}
