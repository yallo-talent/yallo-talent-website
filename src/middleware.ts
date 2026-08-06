import { type NextRequest, NextResponse } from "next/server";
import { ADMIN_BASE } from "@/lib/admin/config";
import { isProductionHost } from "@/lib/seo";

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
