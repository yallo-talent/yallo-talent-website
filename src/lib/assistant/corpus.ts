/**
 * The assistant's corpus, generated at request time from `src/data/**` and
 * `content/**` — the same modules the site itself renders from, never a
 * second copy. `publishedPaths()` is the filter: a path this function does
 * not enumerate is a path the assistant may not discuss, which is the leak
 * guard context-round13-chatbot.md §3 requires.
 *
 * No vector database. `system-prompt.ts` embeds the return value of
 * `buildAssistantCorpus()` directly into a cached system-prompt block —
 * round 13's ratified architecture, and not reopened here.
 *
 * Each family's digest pulls only fields the data module already exports.
 * Where a family carries no field for something (rates, scarcity figures,
 * candidate counts — see the R-AI3/Blueprint-v1 "no field, so nothing to
 * leak" pattern used across src/data/ai-talent and src/data/blueprint), the
 * digest inherits that absence rather than trying to fill the gap.
 */
import { aiRoleFamilies } from "@/data/ai-talent";
import { BLUEPRINT_BASE, blueprintArchetypes } from "@/data/blueprint";
import { capabilityRegistry } from "@/data/capabilities";
import { hero as homeHero } from "@/data/home/hero";
import { industriesIndex } from "@/data/l1";
import { educationData } from "@/data/l1/education";
import { financeData } from "@/data/l1/finance";
import { governmentData } from "@/data/l1/government";
import { healthcareData } from "@/data/l1/healthcare";
import { manufacturingData } from "@/data/l1/manufacturing";
import { retailData } from "@/data/l1/retail";
import { telcoData } from "@/data/l1/telco";
import type { L1PageData } from "@/data/l1/types";
import { authoredPlatforms } from "@/data/platforms/authored";
import {
  publishedModuleParams,
  publishedPlatformSlugs,
} from "@/data/platforms/derive";
import { contractData } from "@/data/services/contract";
import { eorData } from "@/data/services/eor";
import { managedDeliveryData } from "@/data/services/managed-delivery";
import { permanentData } from "@/data/services/permanent";
import type { ServicePageData } from "@/data/services/types";
import { teamIndex } from "@/data/team";
import { getAllCaseStudies, getPublishedInsights } from "@/lib/content";
import { publishedPaths } from "@/lib/published-routes";

export interface CorpusDocument {
  path: string;
  title: string;
  summary: string;
  facts: string[];
}

const industryDataBySlug: Record<string, L1PageData> = {
  retail: retailData,
  finance: financeData,
  healthcare: healthcareData,
  manufacturing: manufacturingData,
  telco: telcoData,
  government: governmentData,
  education: educationData,
};

const serviceDataBySlug: Record<string, ServicePageData> = {
  contract: contractData,
  permanent: permanentData,
  eor: eorData,
  "managed-delivery": managedDeliveryData,
};

function l1Digest(path: string, data: L1PageData): CorpusDocument {
  return {
    path,
    title: `${data.title} ${data.emphasis}`.trim(),
    summary: data.sub,
    facts: [
      `Screening context: ${data.screeningContext ?? "specialist-led, region-deep screening"}`,
      ...data.expertise
        .slice(0, 8)
        .map((e) => `${e.title}: ${e.blurb ?? e.roles.slice(0, 3).join(", ")}`),
    ],
  };
}

function buildIndustryDocs(published: Set<string>): CorpusDocument[] {
  return industriesIndex
    .filter((entry) => entry.category === "industries")
    .map((entry) => `/industries/${entry.slug}`)
    .filter((path) => published.has(path))
    .map((path) => {
      const slug = path.split("/")[2] as string;
      const data = industryDataBySlug[slug];
      return data ? l1Digest(path, data) : null;
    })
    .filter((doc): doc is CorpusDocument => doc !== null);
}

function buildCapabilityDocs(published: Set<string>): CorpusDocument[] {
  return Object.entries(capabilityRegistry)
    .map(([slug, data]) => [`/capabilities/${slug}`, data] as const)
    .filter(([path]) => published.has(path))
    .map(([path, data]) => l1Digest(path, data));
}

function buildPlatformDocs(published: Set<string>): CorpusDocument[] {
  const docs: CorpusDocument[] = [];
  for (const slug of publishedPlatformSlugs()) {
    const path = `/platforms/${slug}`;
    if (!published.has(path)) continue;
    const authored = authoredPlatforms[slug];
    docs.push({
      path,
      title: authored ? `${authored.name} contractors` : slug,
      summary: authored
        ? `Modules staffed: ${authored.modules.map((m) => m.name).join(", ")}.`
        : `Platform desk for ${slug}.`,
      facts: (authored?.modules ?? []).slice(0, 6).map((m) => m.name),
    });
  }
  for (const { platform, module } of publishedModuleParams()) {
    const path = `/platforms/${platform}/${module}`;
    if (!published.has(path)) continue;
    const authored = authoredPlatforms[platform]?.modules.find(
      (m) => m.slug === module,
    );
    if (!authored) continue;
    docs.push({
      path,
      title: authored.name,
      summary: `Roles Yallo places into ${authored.name}: ${authored.roles.slice(0, 6).join(", ")}.`,
      facts: authored.roles,
    });
  }
  return docs;
}

function buildAiTalentDocs(published: Set<string>): CorpusDocument[] {
  return aiRoleFamilies
    .map((family) => [`/ai-talent/${family.slug}`, family] as const)
    .filter(([path]) => published.has(path))
    .map(([path, family]) => ({
      path,
      title: family.name,
      summary: family.hero,
      facts: [family.whatItDoes, ...family.screenFor.slice(0, 3)],
    }));
}

function buildServiceDocs(published: Set<string>): CorpusDocument[] {
  return Object.entries(serviceDataBySlug)
    .map(([slug, data]) => [`/${slug}`, data] as const)
    .filter(([path]) => published.has(path))
    .map(([path, data]) => ({
      path,
      title: `${data.title} ${data.emphasis}`.trim(),
      summary: data.lede,
      facts: data.benefits.slice(0, 4).map((b) => `${b.title}: ${b.copy}`),
    }));
}

function buildBlueprintDocs(published: Set<string>): CorpusDocument[] {
  return blueprintArchetypes
    .map(
      (archetype) =>
        [`${BLUEPRINT_BASE}/${archetype.slug}`, archetype] as const,
    )
    .filter(([path]) => published.has(path))
    .map(([path, archetype]) => ({
      path,
      title: archetype.name,
      summary: archetype.hero,
      facts: archetype.streams
        .slice(0, 6)
        .map((s) => `${s.name}: ${s.roles.slice(0, 4).join(", ")}`),
    }));
}

function buildCaseStudyDocs(published: Set<string>): CorpusDocument[] {
  return getAllCaseStudies()
    .filter((entry) => published.has(`/case-studies/${entry.frontmatter.slug}`))
    .map((entry) => {
      const fm = entry.frontmatter;
      const clientName = fm.clientPublic
        ? fm.client
        : "an enterprise client (not named)";
      return {
        path: `/case-studies/${fm.slug}`,
        title: fm.title,
        summary: fm.excerpt ?? fm.summary,
        facts: [
          `Client: ${clientName}`,
          `Platform: ${fm.platform}`,
          `Region: ${fm.region}`,
          ...(fm.outcome ? [`Outcome: ${fm.outcome}`] : []),
          ...(fm.metrics ?? []).map(
            (m) => `${m.label}: ${m.value} (${m.source})`,
          ),
        ],
      };
    });
}

function buildInsightDocs(published: Set<string>): CorpusDocument[] {
  return getPublishedInsights()
    .filter((entry) => published.has(`/insights/${entry.frontmatter.slug}`))
    .map((entry) => ({
      path: `/insights/${entry.frontmatter.slug}`,
      title: entry.frontmatter.title,
      summary: entry.frontmatter.summary,
      facts: [
        `Category: ${entry.frontmatter.category}`,
        `Published: ${entry.frontmatter.date}`,
      ],
    }));
}

/**
 * The five named leaders, strictly name/role/link. §5's forbidden list bans
 * characterisation beyond that for four of them — `bio` is only ever present
 * on Sumeet's own entry (already published on /why-yallo), so passing the
 * field straight through, absent or not, is the enforcement: nothing is added
 * here that `teamIndex` does not already carry.
 */
function buildLeadershipDoc(published: Set<string>): CorpusDocument | null {
  if (!published.has("/leadership")) return null;
  return {
    path: "/leadership",
    title: "Leadership",
    summary: "Yallo Talent's leadership team, named for public credibility.",
    facts: teamIndex.map((m) =>
      [m.name, m.role, m.linkedin, m.bio].filter(Boolean).join(" — "),
    ),
  };
}

function buildHomeDoc(published: Set<string>): CorpusDocument | null {
  if (!published.has("/")) return null;
  return {
    path: "/",
    title: `${homeHero.headline.lead} ${homeHero.headline.emphasis}`,
    summary: homeHero.lede,
    facts: [`Pillars: ${homeHero.pillars.join(", ")}`],
  };
}

/**
 * Legal and the small set of static marketing pages with no dedicated data
 * module (their copy lives directly in each page's JSX). A hand-held
 * digest, not derived — flagged rather than hidden, and bounded to a handful
 * of routes rather than the load-bearing content families above.
 */
const STATIC_DOCS: CorpusDocument[] = [
  {
    path: "/privacy",
    title: "Privacy notice",
    summary:
      "How Yallo Talent collects, uses and protects personal data for candidates, clients and visitors.",
    facts: [],
  },
  {
    path: "/terms",
    title: "Terms of use",
    summary:
      "The terms governing use of talent.yallo.co. Engagements are governed by a separate written agreement.",
    facts: [],
  },
  {
    path: "/cookies",
    title: "Cookies notice",
    summary:
      "How Yallo Talent uses cookies and browser storage on talent.yallo.co.",
    facts: [],
  },
  {
    path: "/why-yallo",
    title: "Why Yallo",
    summary:
      "Yallo Talent's founding story and operating philosophy, including Sumeet Goenka's enterprise IT background at Richemont, Landmark Group and Alshaya EMEA.",
    facts: [],
  },
  {
    path: "/about",
    title: "About Yallo Talent",
    summary:
      "Who Yallo Talent is, the markets it serves and named clients who have consented to be listed.",
    facts: [],
  },
  {
    path: "/intelligence",
    title: "Intelligence",
    summary: "Yallo Talent's research and programme-staffing intelligence hub.",
    facts: [],
  },
  {
    path: "/jobs",
    title: "Jobs",
    summary:
      "Yallo Talent's live roles, hosted on Volcanic. This assistant serves clients only and does not discuss candidates or vacancies.",
    facts: [],
  },
];

let cached: CorpusDocument[] | null = null;

/**
 * Builds the corpus once per server lifetime (module-level cache — the
 * underlying data is compiled in, so it cannot change within a running
 * process). Filtered to `publishedPaths()` twice over: once per family
 * above, and once here as a final backstop.
 */
export function buildAssistantCorpus(): CorpusDocument[] {
  if (cached) return cached;

  const published = new Set(publishedPaths());

  const docs = [
    buildHomeDoc(published),
    buildLeadershipDoc(published),
    ...STATIC_DOCS.filter((d) => published.has(d.path)),
    ...buildIndustryDocs(published),
    ...buildCapabilityDocs(published),
    ...buildPlatformDocs(published),
    ...buildAiTalentDocs(published),
    ...buildServiceDocs(published),
    ...buildBlueprintDocs(published),
    ...buildCaseStudyDocs(published),
    ...buildInsightDocs(published),
  ].filter(
    (doc): doc is CorpusDocument => doc !== null && published.has(doc.path),
  );

  cached = docs;
  return docs;
}
