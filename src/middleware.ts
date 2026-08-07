import { type NextRequest, NextResponse } from "next/server";
import { canonicalPath, legacyLookup, resolveWith } from "@/data/redirects.mjs";
import { ADMIN_BASE } from "@/lib/admin/config";
import { isProductionHost } from "@/lib/seo";

/**
 * Built once per process, not per request: the table is ~250 entries and the
 * per-request cost is a Map lookup.
 */
const LEGACY = legacyLookup();

/**
 * Header-level crawler lockdown, environment-driven, same switch as
 * robots.ts and buildMetadata's per-page robots field.
 *
 * Exists because per-page `noindex` is opt-in: a route that renders without
 * calling buildMetadata (the root layout's static `metadata` export, inherited
 * by any page under it that sets none of its own) carries no robots signal at
 * all and defaults to indexable. X-Robots-Tag applies to every response
 * regardless of what an individual page's metadata does or omits, so the
 * placeholder host cannot go indexable by a page forgetting to opt in.
 */
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  /**
   * THE LEGACY MAP, APPLIED HERE AND NOT IN next.config.ts — deliberately, and
   * this is the round 21 finding.
   *
   * The map used to live in `redirects()`. Measured on 7 Aug 2026, every legacy
   * URL in its published form took TWO hops: WordPress served everything with a
   * trailing slash, and Next normalises the slash with its own 308 BEFORE any
   * entry in `redirects()` is consulted. `/about-us/` went to `/about-us`, and
   * only then to `/about`. Middleware sits after that normalisation too, so the
   * only way to answer a published legacy URL in one hop is to switch the
   * normalisation off (`skipTrailingSlashRedirect` in next.config.ts) and own it
   * here — canonicalise the path first, then look it up, then answer once.
   *
   * A chain costs retrieval eligibility with the real-time crawlers, not just
   * crawl budget (discoverability scope §8), and the whole point of the map is
   * that the authority arrives.
   *
   * 301, not Next's 308: game plan §7 and round 21 §5 both specify 301, and
   * these are indexed GET pages moving once, at cutover.
   */
  const legacy = resolveWith(LEGACY, pathname, search);
  if (legacy) {
    return NextResponse.redirect(new URL(legacy, request.url), 301);
  }

  /**
   * Trailing-slash and double-slash canonicalisation, which Next is no longer
   * doing for us. 308 here, not 301: this rule applies to every route including
   * the API surface, and 308 preserves the request method where 301 rewrites it
   * to GET. That is exactly why Next's own normalisation is a 308.
   */
  const canonical = canonicalPath(pathname);
  if (canonical !== pathname) {
    return NextResponse.redirect(
      new URL(`${canonical}${search}`, request.url),
      308,
    );
  }

  const response = NextResponse.next();
  /**
   * The admin cockpit is noindex on EVERY host, production included, and that is
   * the one exception to the environment switch above.
   *
   * robots.txt disallows `/admin/` and the layout sets a robots meta tag, so this
   * is the third of three. Three is deliberate: robots.txt is a request a crawler
   * may ignore, a meta tag only exists on responses whose page sets metadata, and
   * the header applies to every response under the path including redirects, the
   * sign-in page and anything added to the tree later. The cost of this surface
   * being indexed once — a lead's email address in a search result — is not
   * bounded by how quickly it is noticed.
   */
  if (
    !isProductionHost ||
    request.nextUrl.pathname === ADMIN_BASE ||
    request.nextUrl.pathname.startsWith(`${ADMIN_BASE}/`)
  ) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
