import { publishedPaths } from "@/lib/published-routes";
import { SITE } from "@/lib/seo";

/**
 * llms.txt, generated from the route tree alongside sitemap.ts so the two
 * cannot list different route sets — one function (publishedPaths) is the
 * enumeration for both.
 *
 * SCOPE, per context-discoverability-scope-v1.0.md §2 and §9: this is agent
 * wayfinding and a Lighthouse Agentic Browsing audit item, nothing more.
 * Google names it among tactics to ignore for ranking or citation purposes,
 * and an SE Ranking model found removing it as a variable improved citation
 * prediction accuracy — it is noise there, not signal. No claim to that
 * effect is made anywhere this file is described, including here.
 *
 * Labels are mechanically humanised from each path's own last segment
 * (kebab-case to Title Case) rather than hand-typed, so a heading here can
 * never assert something the URL itself does not already say. That costs
 * correct-looking labels for acronym slugs ("Sap" rather than "SAP") in
 * exchange for zero invented copy — an acceptable trade for a wayfinding
 * manifest, not for a page a visitor reads.
 */

export const dynamic = "force-static";

function humanise(path: string): string {
  if (path === "/") return "Home";
  const last = path.split("/").filter(Boolean).pop() ?? path;
  return last
    .split("-")
    .map((w) => (w.length > 0 ? w[0]?.toUpperCase() + w.slice(1) : w))
    .join(" ");
}

/** The families with more than one page under them; every other path — the
 *  homepage and every single-segment static page alike — shares one "Site"
 *  group rather than getting a one-entry heading of its own. */
const NESTED_FAMILIES = [
  "industries",
  "platforms",
  "capabilities",
  "ai-talent",
  "intelligence",
  "insights",
  "case-studies",
];

function sectionOf(path: string): string {
  const first = path.split("/").filter(Boolean)[0];
  return first && NESTED_FAMILIES.includes(first) ? first : "top";
}

const SECTION_TITLES: Record<string, string> = {
  top: "Site",
  industries: "Industries",
  platforms: "Platforms",
  capabilities: "Capabilities",
  "ai-talent": "AI Talent",
  intelligence: "Intelligence",
  insights: "Insights",
  "case-studies": "Case Studies",
};

export async function GET() {
  const paths = publishedPaths();

  const groups = new Map<string, string[]>();
  for (const path of paths) {
    const section = sectionOf(path);
    if (!groups.has(section)) groups.set(section, []);
    groups.get(section)?.push(path);
  }

  const order = ["top", ...NESTED_FAMILIES];

  const sections = order
    .filter((key) => groups.has(key))
    .map((key) => {
      const title = SECTION_TITLES[key] ?? humanise(`/${key}`);
      const links = (groups.get(key) ?? [])
        .sort()
        .map((path) => `- [${humanise(path)}](${SITE.url}${path})`)
        .join("\n");
      return `## ${title}\n\n${links}`;
    })
    .join("\n\n");

  const body = `# ${SITE.name}\n\n${sections}\n`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
