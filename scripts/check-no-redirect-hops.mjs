#!/usr/bin/env node
/**
 * check-no-redirect-hops — no internal link resolves through a redirect.
 *
 * WHY THIS IS A SEPARATE GATE FROM check-yallo-case's dead-link assertion.
 * That gate proves an internal href eventually resolves — it follows
 * redirects and only fails on 404 or no response, so a working 301 chain
 * passes it today. A hop is a different defect: real-time retrieval crawlers
 * tolerate redirect chains poorly, and one extra hop can drop a page out of
 * a generated answer. This gate reads every internal href the same way and
 * fails on any 3xx response, whether or not it eventually lands somewhere
 * real.
 *
 * HOW. The published URL set comes from /sitemap.xml, the same source
 * check-gate-coverage reads, so the crawl set is the site's own route list
 * rather than a maintained sample. Each page's rendered HTML is fetched
 * (no browser needed — a redirect is a server response, not a paint-time
 * fact) and parsed with cheerio for internal `<a href>`s. Every unique href
 * is then probed with `redirect: "manual"`, which surfaces the real 3xx
 * status and Location header instead of silently following it.
 *
 *   node scripts/check-no-redirect-hops.mjs [baseUrl]
 */
import { load as loadHtml } from "cheerio";

const BASE = process.env.BASE_URL ?? process.argv[2] ?? "http://localhost:3100";
const CONCURRENCY = 8;

async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return out;
}

let live = [];
try {
  const xml = await fetch(`${BASE}/sitemap.xml`).then((r) => r.text());
  live = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (m) => new URL(m[1]).pathname.replace(/\/$/, "") || "/",
  );
} catch {
  console.error(
    `Could not read ${BASE}/sitemap.xml. Start the server first, or pass its base URL.`,
  );
  process.exit(1);
}

/** href -> one page that links to it. Deduped across the whole crawl. */
const linkSources = new Map();

await mapLimit(live, CONCURRENCY, async (path) => {
  const html = await fetch(`${BASE}${path}`)
    .then((r) => (r.ok ? r.text() : null))
    .catch(() => null);
  if (!html) return;
  const $ = loadHtml(html);
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href || !href.startsWith("/") || href.startsWith("//")) return;
    const clean = href.split("#")[0].split("?")[0];
    if (!clean) return;
    if (!linkSources.has(clean)) linkSources.set(clean, path);
  });
});

const failures = [];

await mapLimit([...linkSources], CONCURRENCY, async ([href, from]) => {
  const res = await fetch(`${BASE}${href}`, { redirect: "manual" }).catch(
    () => null,
  );
  if (!res) return;
  if (res.status >= 300 && res.status < 400) {
    const location = res.headers.get("location") ?? "(no Location header)";
    failures.push(
      `${from}  links to ${href}, which responds ${res.status} -> ${location}.\n` +
        `      An internal link must resolve in one hop. Point it at the final URL,\n` +
        `      or fix the redirect map so the hop is not internal-to-internal.`,
    );
  }
});

if (failures.length > 0) {
  console.error(
    `\ncheck-no-redirect-hops FAILED with ${failures.length} problem(s):\n`,
  );
  for (const f of failures.sort()) console.error(`  ${f}\n`);
  process.exit(1);
}
console.log(
  `\nNo internal link resolves through a redirect: ${linkSources.size} distinct href(s) across ${live.length} published page(s).`,
);
