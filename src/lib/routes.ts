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

  return true;
}
