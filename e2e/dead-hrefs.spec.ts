import { expect, test } from "@playwright/test";

/**
 * Enforces the invariant introduced with the content-layer migration:
 * every rendered internal link to `/insights/*` or `/case-studies/*`
 * must correspond to a real MDX-backed page.
 *
 * Scope widened: platform pages now exist for every platform with real module
 * coverage, and the two without it (Microsoft, Workday) render non-interactive.
 * Capability slugs without seed data do the same. So the test no longer needs to
 * exempt them — any rendered internal link is expected to resolve.
 */

function normalisePath(href: string): string | null {
  if (!href.startsWith("/")) return null;
  const [pathPart] = href.split("#");
  const [pathOnly] = pathPart.split("?");
  if (pathOnly === "/") return "/";
  return pathOnly.replace(/\/+$/, "");
}

async function fetchSitemapPaths(baseURL: string): Promise<string[]> {
  const res = await fetch(`${baseURL}/sitemap.xml`);
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  return locs
    .map((full) => {
      try {
        return new URL(full).pathname;
      } catch {
        return null;
      }
    })
    .filter((p): p is string => p !== null)
    .map((p) => normalisePath(p) ?? p);
}

const CONTENT_ROUTE_RE =
  /^\/(insights|case-studies|platforms|capabilities)\/[^/]+$/;

test("every rendered content, platform and capability href resolves", async ({
  page,
  baseURL,
}) => {
  test.setTimeout(600_000);
  if (!baseURL) throw new Error("baseURL required");

  const paths = await fetchSitemapPaths(baseURL);
  const knownContentPaths = new Set(
    paths.filter((p) => CONTENT_ROUTE_RE.test(p)),
  );
  expect(knownContentPaths.size).toBeGreaterThan(0);

  const dead: { onPage: string; href: string }[] = [];

  for (const onPath of paths) {
    const response = await page.goto(onPath);
    expect(response?.ok(), `page ${onPath} did not 200`).toBeTruthy();

    const hrefs = await page.$$eval("a[href]", (as) =>
      as.map((a) => (a as HTMLAnchorElement).getAttribute("href") ?? ""),
    );

    for (const href of hrefs) {
      const target = normalisePath(href);
      if (!target) continue;
      if (!CONTENT_ROUTE_RE.test(target)) continue;
      if (knownContentPaths.has(target)) continue;
      dead.push({ onPage: onPath, href });
    }
  }

  const summary = dead
    .map(({ onPage, href }) => `  ${onPage} -> ${href}`)
    .join("\n");
  expect(dead, `Dead internal content links found:\n${summary}`).toEqual([]);
});
