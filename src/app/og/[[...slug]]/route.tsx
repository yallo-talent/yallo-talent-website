import { ImageResponse } from "next/og";
import { hashSeed } from "@/components/ui/petal-geometry";
import { getOgPalette } from "@/lib/og-palette";
import { publishedPaths } from "@/lib/published-routes";

/**
 * One 1200x630 OG card per published route, drawn at build time and
 * deterministic from the slug — the same PetalPlate contract every other
 * bounded-imagery surface on the site follows (src/components/ui/PetalPlate.tsx),
 * closing the `defaultOgImage` defect as a by-product: that file never
 * existed, so every share on every channel previewed broken.
 *
 * WHY THIS DRAWS WITH DIVS RATHER THAN REUSING PetalPlate's SVG PATHS.
 * Satori (next/og's renderer) has no SVG path support and no CSS custom
 * property resolution — there is no browser evaluating a cascade, so
 * `var(--amb)` never resolves and an arbitrary `<path d="...">` has nothing
 * to render it. What it does support is a real CSS subset, and petal-geometry
 * .ts's "three square corners, one radius" shape is exactly a plain div with
 * one corner's border-radius set — the same form, expressed the way this
 * renderer can actually paint it. hashSeed is imported rather than
 * reimplemented, so a plate and its OG card share one seed function and
 * cannot drift into drawing different shapes for the same page.
 *
 * Colours come from getOgPalette(), which reads globals.css Layer 1 directly
 * rather than hand-copying it — same reasoning as that file's own docstring.
 */

export const dynamic = "force-static";

const WIDTH = 1200;
const HEIGHT = 630;
const CORNER_MARK = 168;

export function generateStaticParams() {
  return publishedPaths().map((path) => ({
    slug: path === "/" ? [] : path.split("/").filter(Boolean),
  }));
}

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const r = Number.parseInt(full.slice(0, 2), 16);
  const g = Number.parseInt(full.slice(2, 4), 16);
  const b = Number.parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** The four corner shapes petal-geometry.ts's petalPath draws, as a div's
 *  own border-radius instead of an SVG arc. */
function cornerRadius(size: number, corner: 0 | 1 | 2 | 3) {
  const zero = {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  };
  if (corner === 0) return { ...zero, borderBottomLeftRadius: size };
  if (corner === 1) return { ...zero, borderTopLeftRadius: size };
  if (corner === 2) return { ...zero, borderTopRightRadius: size };
  return { ...zero, borderBottomRightRadius: size };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug?: string[] }> },
) {
  const { slug } = await params;
  const path = slug && slug.length > 0 ? `/${slug.join("/")}` : "/";

  const palette = getOgPalette();
  const seed = hashSeed(path);
  const ambient =
    palette.ambient[seed % palette.ambient.length] ?? palette.ambient[0];

  const petalCount = 3 + (seed % 2);
  const petals = Array.from({ length: petalCount }, (_, i) => {
    const k = hashSeed(`${path}:petal:${i}`);
    const size = WIDTH * (0.3 + (k % 26) / 100);
    const x = (k % Math.max(1, Math.round(WIDTH - size * 0.6))) - size * 0.1;
    const y =
      (Math.floor(k / 7) % Math.max(1, Math.round(HEIGHT - size * 0.6))) -
      size * 0.1;
    const corner = (k % 4) as 0 | 1 | 2 | 3;
    return {
      key: k,
      x,
      y,
      size,
      corner,
      fill: hexToRgba(ambient, i % 2 === 0 ? 0.5 : 0.22),
    };
  });

  return new ImageResponse(
    <div
      style={{
        width: WIDTH,
        height: HEIGHT,
        display: "flex",
        position: "relative",
        overflow: "hidden",
        background: palette["paper-2"],
      }}
    >
      {/* Atmosphere: the ambient hue breathing up from the bottom-left, the
            same corner and shape PetalPlate's own radial gradient uses. */}
      <div
        style={{
          position: "absolute",
          left: -WIDTH * 0.2,
          top: HEIGHT * 0.3,
          width: WIDTH * 0.9,
          height: WIDTH * 0.9,
          borderRadius: WIDTH * 0.45,
          background: hexToRgba(ambient, 0.28),
        }}
      />
      {petals.map((p) => (
        <div
          key={p.key}
          style={{
            position: "absolute",
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            background: p.fill,
            ...cornerRadius(p.size, p.corner),
          }}
        />
      ))}
      {/* The signature: one quarter-round corner in gold, always
            bottom-left, same as PetalPlate's own signature mark. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: HEIGHT - CORNER_MARK,
          width: CORNER_MARK,
          height: CORNER_MARK,
          borderTopRightRadius: CORNER_MARK,
          background: palette.gold,
          opacity: 0.92,
        }}
      />
    </div>,
    { width: WIDTH, height: HEIGHT },
  );
}
