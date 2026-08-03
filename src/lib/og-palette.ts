import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * The OG image generator's colours, read out of globals.css Layer 1 rather
 * than hand-typed, for the same reason src/lib/mark-surfaces.json and
 * src/lib/crawler-families.json are one file each: a hand copy of a value
 * that already lives somewhere drifts from it, and AGENTS.md's rule that
 * hex lives only in globals.css Layer 1 exists to make that drift visible.
 *
 * WHY THIS FILE PARSES RATHER THAN IMPORTS A TOKEN. Satori (next/og's
 * renderer) has no CSS engine behind it — it never resolves `var(--amb-1)`,
 * because there is no browser evaluating a cascade. A build-time image needs
 * literal colour values, and the only way to get them without hand-typing a
 * second copy of Layer 1 is to read the same file the cascade itself reads
 * from and pull the raw hex out by name.
 *
 * Scope is deliberately narrow: the light-theme mapping only, because canon
 * §2 fixes light as the default register and an OG card carries no
 * data-theme of its own to invert against.
 */

const TOKEN_NAMES = [
  "paper-2",
  "gold",
  "gold-deep",
  "amb-indigo-l",
  "amb-teal-l",
  "amb-plum-l",
  "amb-harbour-l",
  "amb-violet-l",
  "amb-claret-l",
] as const;

type TokenName = (typeof TOKEN_NAMES)[number];

export type OgPalette = Record<TokenName, string> & { ambient: string[] };

let cached: OgPalette | null = null;

export function getOgPalette(): OgPalette {
  if (cached) return cached;

  const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

  const values = {} as Record<TokenName, string>;
  for (const name of TOKEN_NAMES) {
    const m = css.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{3,8})`));
    if (!m) {
      throw new Error(
        `og-palette: token --${name} not found in globals.css Layer 1. ` +
          "The OG generator's colours must come from there, not a hand-typed fallback.",
      );
    }
    values[name] = m[1];
  }

  cached = {
    ...values,
    ambient: [
      values["amb-indigo-l"],
      values["amb-teal-l"],
      values["amb-plum-l"],
      values["amb-harbour-l"],
      values["amb-violet-l"],
      values["amb-claret-l"],
    ],
  };
  return cached;
}
