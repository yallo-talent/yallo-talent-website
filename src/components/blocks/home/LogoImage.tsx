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
}: {
  src: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt=""
      width={width}
      height={height}
      className={className}
      unoptimized={src.endsWith(".svg")}
      loading={priority ? undefined : "lazy"}
      priority={priority}
    />
  );
}
