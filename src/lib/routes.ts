import { capabilityRegistry } from "@/data/capabilities";
import { sectorRegistry } from "@/data/l1/registry";
import { publishedPlatformSlugs } from "@/data/platforms/derive";

/**
 * Whether an internal href resolves to a route that actually exists.
 *
 * One source of truth, derived from the registries rather than hand-maintained,
 * so a link cannot outlive its page. Cross-links are generated from data across
 * the L1 and L2 templates, and several pointed at capability and platform slugs
 * that were never built — the fix is to ask, not to remember.
 *
 * Anything unknown is treated as existing: this guards data-driven taxonomy
 * links, not every href on the site, and returning false for an unrecognised
 * static route would silently disable working navigation.
 */
export function routeExists(href: string): boolean {
  const path = href.split("#")[0]?.split("?")[0]?.replace(/\/+$/, "") ?? "";

  const capability = /^\/capabilities\/([^/]+)$/.exec(path);
  if (capability?.[1]) return capability[1] in capabilityRegistry;

  const platform = /^\/platforms\/([^/]+)$/.exec(path);
  if (platform?.[1]) return publishedPlatformSlugs().includes(platform[1]);

  const sector = /^\/industries\/([^/]+)$/.exec(path);
  if (sector?.[1]) return sector[1] in sectorRegistry;

  const fn = /^\/industries\/([^/]+)\/([^/]+)$/.exec(path);
  if (fn?.[1] && fn[2]) {
    const s = sectorRegistry[fn[1]];
    return Boolean(
      s?.expertise.some((e) => e.slug === fn[2] && (e.tools?.length ?? 0) > 0),
    );
  }

  /* Capability sub-desks. The sector equivalent above has been here since the
     cross-links were made data-driven; the capability one had not, so every
     /capabilities/{cap}/{fn} href fell through to the permissive default and was
     never actually checked. The twin links added for
     context-round3-rulings.md §5.3 are exactly this shape, and a guard that
     always returns true is not a guard. Same rule as the sector branch: a
     function without tools has no L2 route. */
  const capFn = /^\/capabilities\/([^/]+)\/([^/]+)$/.exec(path);
  if (capFn?.[1] && capFn[2]) {
    const c = capabilityRegistry[capFn[1]];
    return Boolean(
      c?.expertise.some(
        (e) => e.slug === capFn[2] && (e.tools?.length ?? 0) > 0,
      ),
    );
  }

  return true;
}
