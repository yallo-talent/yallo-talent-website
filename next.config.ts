import type { NextConfig } from "next";

/**
 * The legacy redirect map is NOT written here.
 *
 * Game plan §7 is the migration's redirect table. Until round 21 part of it
 * lived in this file's `redirects()` while the rest lived only in the plan
 * document, with nothing comparing the two. It now lives in
 * `src/data/redirects.mjs` and is applied by `src/middleware.ts`, because a
 * `redirects()` entry cannot answer a published legacy URL in one hop — see the
 * comment in the middleware for the measurement. `scripts/check-redirects.mjs`
 * reads that same module, so the gate walks the table the server applies.
 *
 * Add a legacy URL there, not here.
 */
const nextConfig: NextConfig = {
  /**
   * Trailing-slash normalisation moves to the middleware, which is the only
   * place it can happen AFTER the legacy map has had its say. Next's built-in
   * version runs first and turns every published legacy URL into a two-hop
   * chain. The middleware reimplements it — same 308, same canonical form — for
   * anything the map does not claim.
   */
  skipTrailingSlashRedirect: true,
  /**
   * Build directory, overridable by environment.
   *
   * Two sessions worked this repository in parallel on 1 Aug 2026 and both needed
   * a server. `next dev` and `next start` share `.next`, so the second one to
   * start corrupts what the first is serving — which is how a measurement pass
   * came to be run against a stale production build and read the previous
   * commit's markup as the current one. Setting NEXT_DIST_DIR gives a session its
   * own build directory. Unset, behaviour is exactly as before.
   */
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  /**
   * Cockpit media served through the Spaces CDN.
   *
   * ONE HOST, AND IT IS THE CDN, not the origin. `next/image` refuses any
   * remote host it has not been told about, so this is what makes an uploaded
   * image renderable at all. The origin
   * `yallo-talent-media.lon1.digitaloceanspaces.com` is deliberately NOT listed:
   * if both were allowed, a URL that bypassed the CDN would still render and
   * nothing would ever surface that the cache was being missed.
   *
   * `pathname` is left open because the bucket's key space is the cockpit's to
   * organise. The bucket is the boundary, and the access key behind the upload
   * route is scoped to that bucket alone.
   *
   * Uploads are server-side through the app's own route, never browser-direct,
   * so the bucket needs no CORS configuration for this to work.
   */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "yallo-talent-media.lon1.cdn.digitaloceanspaces.com",
      },
    ],
  },
};

export default nextConfig;
