import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const REPO_ROOT = "/Users/sumeetgoenka/Claude/Claude-code/yallo-talent-website";
const EXTRACT_DIR = "/tmp/yallo-fetch/extracted";
const OUT_DIR = join(REPO_ROOT, "content/insights");

const READ = (slug) =>
  JSON.parse(readFileSync(join(EXTRACT_DIR, `${slug}.json`), "utf8"));

// Replace GCC (word-boundary) with Middle East. Preserves case of surrounding
// text and only rewrites the acronym, not slugs or product names that
// happen to contain 'gcc' otherwise.
const reGCC = /\bGCC\b/g;
const reGCCs = /\bGCCs\b/g;
const swapGcc = (s) =>
  s.replace(reGCCs, "Middle East businesses").replace(reGCC, "Middle East");

/**
 * @param {{
 *   slug: string;
 *   sourceSlug?: string;
 *   category: string;
 *   industry?: string[];
 *   platform?: string[];
 *   discipline?: string[];
 * }} opts
 */
function portArticle(opts) {
  const sourceSlug = opts.sourceSlug ?? opts.slug;
  const src = READ(sourceSlug);
  const title = swapGcc(src.title);
  const summary = swapGcc(
    src.description || src.bodyMd.split(/\n+/)[0].slice(0, 240),
  ).trim();
  const bodyMd = swapGcc(src.bodyMd);
  const front = [
    "---",
    `title: ${JSON.stringify(title)}`,
    `slug: ${opts.slug}`,
    `date: ${src.date}`,
    `summary: >-`,
    ...summary.match(/.{1,72}(\s|$)/g).map((l) => `  ${l.trim()}`),
    `category: ${JSON.stringify(opts.category)}`,
    `author: ${JSON.stringify(src.author)}`,
    `readingTimeMinutes: ${src.readingTimeMinutes}`,
  ];
  if (opts.industry?.length)
    front.push(`industry:`, ...opts.industry.map((s) => `  - ${s}`));
  if (opts.platform?.length)
    front.push(`platform:`, ...opts.platform.map((s) => `  - ${s}`));
  if (opts.discipline?.length)
    front.push(`discipline:`, ...opts.discipline.map((s) => `  - ${s}`));
  front.push("---", "");

  const mdx = `${front.join("\n")}\n${bodyMd}\n`;
  writeFileSync(join(OUT_DIR, `${opts.slug}.mdx`), mdx);
  console.log("port", opts.slug, `(${src.bodyMd.split(/\s+/).length}w)`);
}

/**
 * @param {{ slug: string; category: string; industry?: string[]; rewriteBrief: string; }} opts
 */
function stubArticle(opts) {
  const src = READ(opts.slug);
  const title = swapGcc(src.title);
  const summary = swapGcc(
    src.description || src.bodyMd.split(/\n+/)[0].slice(0, 240),
  ).trim();
  const front = [
    "---",
    `title: ${JSON.stringify(title)}`,
    `slug: ${opts.slug}`,
    `date: ${src.date}`,
    `summary: >-`,
    ...summary.match(/.{1,72}(\s|$)/g).map((l) => `  ${l.trim()}`),
    `category: ${JSON.stringify(opts.category)}`,
    `author: ${JSON.stringify(src.author)}`,
    `readingTimeMinutes: ${src.readingTimeMinutes}`,
    `published: false`,
    `rewriteBrief: >-`,
    ...opts.rewriteBrief.match(/.{1,72}(\s|$)/g).map((l) => `  ${l.trim()}`),
  ];
  if (opts.industry?.length)
    front.push(`industry:`, ...opts.industry.map((s) => `  - ${s}`));
  front.push("---", "");
  const bodyNote =
    `> **Stub — held for rewrite.** The original piece is preserved in the ` +
    `git history at content/insights/${opts.slug}.mdx@HEAD. Do not publish ` +
    `until the rewrite in the frontmatter's rewriteBrief has landed.\n`;
  const mdx = `${front.join("\n")}\n${bodyNote}\n`;
  writeFileSync(join(OUT_DIR, `${opts.slug}.mdx`), mdx);
  console.log("stub", opts.slug);
}

// -----------------------------------------------------------------------------
// PORT (13 articles). Slugs preserved except where explicitly renamed below.
// -----------------------------------------------------------------------------

// (2a) Merge duplicate pair — enterprise-architect-uae-hiring{,-challenges}.
// The '-challenges' body is longer (696w vs 461w), so it's the survivor.
portArticle({
  slug: "enterprise-architect-middle-east",
  sourceSlug: "enterprise-architect-uae-hiring-challenges",
  category: "Hiring",
  discipline: ["hiring", "enterprise-architecture"],
});

portArticle({
  slug: "reduce-enterprise-hiring-delays",
  category: "Hiring",
  discipline: ["hiring"],
});

portArticle({
  slug: "why-cloud-transformation-is-creating-a-new-talent-shortage",
  category: "Cloud",
  discipline: ["hiring", "cloud-infrastructure"],
});

portArticle({
  slug: "data-engineer-uae-ai-programmes",
  category: "AI",
  discipline: ["data-ai", "hiring"],
});

portArticle({
  slug: "critical-technology-roles-uae-vacancy-cost",
  category: "Hiring",
  discipline: ["hiring"],
});

// (Renamed) gcc-it-hiring-trends-2026-cio-guide -> middle-east-it-hiring-trends-2026
portArticle({
  slug: "middle-east-it-hiring-trends-2026",
  sourceSlug: "gcc-it-hiring-trends-2026-cio-guide",
  category: "Hiring",
  discipline: ["hiring"],
});

portArticle({
  slug: "ai-talent-uae-programme-failure-before-go-live",
  category: "AI",
  discipline: ["data-ai", "hiring"],
});

portArticle({
  slug: "enterprise-ai-in-2026-the-gap-everyone-is-ignoring",
  category: "AI",
  discipline: ["data-ai", "hiring"],
});

portArticle({
  slug: "wrong-it-hire-cost",
  category: "Hiring",
  discipline: ["hiring"],
});

// (Renamed) me-india-blended-it-teams-gcc-delivery -> me-india-blended-delivery-teams
portArticle({
  slug: "me-india-blended-delivery-teams",
  sourceSlug: "me-india-blended-it-teams-gcc-delivery",
  category: "Delivery",
  discipline: ["delivery", "hiring"],
});

portArticle({
  slug: "hidden-cost-of-slow-tech-hiring-enterprises",
  category: "Hiring",
  discipline: ["hiring"],
});

portArticle({
  slug: "the-best-way-to-use-contract-hiring-during-high-demand-enterprise-projects",
  category: "Hiring",
  discipline: ["hiring", "contract"],
});

// -----------------------------------------------------------------------------
// STUB (5 rewrite candidates). Frontmatter valid, body a "hold for rewrite" note.
// -----------------------------------------------------------------------------

stubArticle({
  slug: "retail-technology-investment-2025",
  category: "Retail",
  industry: ["retail"],
  rewriteBrief:
    "Keep the sector knowledge on retail technology investment. Change the conclusion from a technology-trend spotlight into its hiring consequence: which specialists become scarce, which comp windows shift and how programme staffing plans should adjust as this investment lands.",
});

stubArticle({
  slug: "smart-manufacturing-iots-role-in-shaping-intelligent-ecosystems",
  category: "Manufacturing",
  industry: ["manufacturing"],
  rewriteBrief:
    "Preserve the manufacturing / IIoT sector reporting. Change the conclusion from an ecosystem-technology outlook into its hiring consequence: the exact IIoT, MES and OT-security roles that scale rollout, where the specialist bench actually sits and what the compensation ceiling is doing in 2026.",
});

stubArticle({
  slug: "supply-chain-resilience-overcoming-disruptions-with-predictive-analytics",
  category: "Manufacturing",
  industry: ["manufacturing", "logistics"],
  rewriteBrief:
    "Keep the supply-chain-analytics sector view but re-shape the conclusion around the specialist roles that make predictive-analytics rollouts stick — demand planners, ML-ops leads, integration architects — with hiring-market signals, not just tooling.",
});

stubArticle({
  slug: "circular-economy-in-manufacturing-tech-enabled-sustainability",
  category: "Manufacturing",
  industry: ["manufacturing"],
  rewriteBrief:
    "Preserve the circular-economy sector context and shift the conclusion into hiring reality: carbon accounting, product-passport and reverse-ops specialists are scarce; here's where the bench actually is, what the market rate looks like and where programmes stall on people rather than tech.",
});

stubArticle({
  slug: "the-role-of-robotics-in-logistics-increasing-speed-and-efficiency",
  category: "Logistics",
  industry: ["logistics"],
  rewriteBrief:
    "Keep the robotics-in-logistics sector context. Change the conclusion from a speed / efficiency technology piece into its hiring consequence: the robotics-integration, WCS / WES and controls-engineering specialists that shape rollout success, and where the market is right now.",
});

// -----------------------------------------------------------------------------
// Sanity: fail loudly if a target file is missing.
// -----------------------------------------------------------------------------
for (const slug of [
  "enterprise-architect-middle-east",
  "reduce-enterprise-hiring-delays",
  "why-cloud-transformation-is-creating-a-new-talent-shortage",
  "data-engineer-uae-ai-programmes",
  "critical-technology-roles-uae-vacancy-cost",
  "middle-east-it-hiring-trends-2026",
  "ai-talent-uae-programme-failure-before-go-live",
  "enterprise-ai-in-2026-the-gap-everyone-is-ignoring",
  "wrong-it-hire-cost",
  "me-india-blended-delivery-teams",
  "hidden-cost-of-slow-tech-hiring-enterprises",
  "the-best-way-to-use-contract-hiring-during-high-demand-enterprise-projects",
  "retail-technology-investment-2025",
  "smart-manufacturing-iots-role-in-shaping-intelligent-ecosystems",
  "supply-chain-resilience-overcoming-disruptions-with-predictive-analytics",
  "circular-economy-in-manufacturing-tech-enabled-sustainability",
  "the-role-of-robotics-in-logistics-increasing-speed-and-efficiency",
]) {
  if (!existsSync(join(OUT_DIR, `${slug}.mdx`)))
    throw new Error(`missing: ${slug}`);
}
console.log("done: 12 ports (13 including merge) + 5 stubs");
