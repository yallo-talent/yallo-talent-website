import { NextResponse } from "next/server";
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
export function middleware() {
  const response = NextResponse.next();
  if (!isProductionHost) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
