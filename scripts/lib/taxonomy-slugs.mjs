import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * The three taxonomy index slugs, read from the file that declares them.
 *
 * WHY A PARSER RATHER THAN AN IMPORT. `src/data/l1/index.ts` is TypeScript and a
 * plain Node gate has no loader for it, which is the same constraint
 * `check-taxonomy.mjs` already works under and the reason `published-paths.mjs`
 * derives from the sitemap instead of importing `publishedPaths()`.
 *
 * WHY IT IS NEEDED AT ALL, given the sitemap. Round 25c split "exists" from
 * "worth crawling": all twenty-one single-facet landing pages render whatever is
 * published, and only the ones with an article behind them are in the sitemap.
 * That is correct for a crawler and wrong for a gate — a page nobody should be
 * sent to is still a page that must pass axe in both themes at both widths, and
 * deriving the gates' route list from the sitemap alone would have left twenty-
 * one live templates unvisited while `check-gate-coverage` reported them as
 * having no live URL.
 */
const INDEX_FILE = join("src", "data", "l1", "index.ts");

const ARRAYS = {
  industry: "industriesIndex",
  platform: "platformsIndex",
  discipline: "capabilitiesIndex",
};

/**
 * The public URL segment per pillar — the .mjs copy of `TAXONOMY_SEGMENT` in
 * src/lib/content-seo.ts, which carries the reasoning. The third pillar is
 * `discipline` in the database and **capabilities** in every URL and label a
 * visitor sees; Sumeet ruled on the split during round 25c. A plain Node gate
 * cannot import the TypeScript declaration, so this is the one duplicate, and
 * `check-published-counts.mjs` asserts the routes it produces really resolve.
 */
const SEGMENT = {
  industry: "industry",
  platform: "platform",
  discipline: "capabilities",
};

/** @returns {{industry: string[], platform: string[], discipline: string[]}} */
export function taxonomySlugs() {
  const source = readFileSync(INDEX_FILE, "utf8");
  /** @type {Record<string, string[]>} */
  const out = {};
  for (const [kind, name] of Object.entries(ARRAYS)) {
    const start = source.indexOf(`export const ${name}`);
    if (start === -1) {
      throw new Error(
        `${INDEX_FILE} no longer declares ${name}. The gates derive the taxonomy landing routes from it, so this is a real break rather than a rename to paper over.`,
      );
    }
    /* Bounded by the next top-level export so one array's slugs cannot bleed
       into the next. */
    const rest = source.slice(start);
    const end = rest.indexOf("\nexport const ", 1);
    const block = end === -1 ? rest : rest.slice(0, end);
    out[kind] = [...block.matchAll(/^\s*slug:\s*"([a-z0-9-]+)"/gm)].map(
      (m) => m[1],
    );
    if (out[kind].length === 0) {
      throw new Error(`${name} yielded no slugs, which cannot be right.`);
    }
  }
  return /** @type {any} */ (out);
}

/** Every landing route, in index order, at its PUBLIC segment. */
export function taxonomyLandingPaths() {
  const slugs = taxonomySlugs();
  return Object.entries(slugs).flatMap(([kind, values]) =>
    values.map((slug) => `/insights/${SEGMENT[kind]}/${slug}`),
  );
}
