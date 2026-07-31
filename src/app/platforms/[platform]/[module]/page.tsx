import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlatformModuleShell } from "@/components/blocks/platform/PlatformModuleShell";
import { homeMetrics } from "@/data/metrics";
import {
  getPlatformModule,
  publishedModuleParams,
} from "@/data/platforms/derive";
import { getAllCaseStudies } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

/**
 * Platform L2 — /platforms/[platform]/[module].
 *
 * Only AUTHORED modules get a route: a derived module is a re-projection of a
 * sector's tool entry, so a page for it would restate its own source at less
 * depth. `publishedModuleParams` is gated on the module carrying a slug, which
 * is the same test the L1 cards use to decide whether to link — so a card never
 * points at a route that does not exist.
 */
export async function generateStaticParams() {
  return publishedModuleParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ platform: string; module: string }>;
}): Promise<Metadata> {
  const { platform, module } = await params;
  const hit = getPlatformModule(platform, module);
  if (!hit) return {};
  return buildMetadata({
    seo: {
      title: `${hit.module.name} Contractors · ${hit.platform.name} | Yallo Talent`,
      description:
        hit.module.scope ??
        `Specialist-screened ${hit.module.name} contractors, shortlisted in 72 hours.`,
    },
    path: `/platforms/${platform}/${module}`,
  });
}

export default async function PlatformModulePage({
  params,
}: {
  params: Promise<{ platform: string; module: string }>;
}) {
  const { platform, module } = await params;
  const hit = getPlatformModule(platform, module);
  if (!hit) notFound();

  /* R6, corrected. The heading over this section names the suite — "SAP
     programmes we have staffed" — so every study under it must be a study of
     that suite. It was not.

     My first version also matched `tag === "multi-platform"`, on the reasoning
     that those studies span suites by definition. That reasoning defends SHOWING
     them; it does not license the HEADING. On Blue Yonder it produced
     "Blue Yonder programmes we have staffed." above three engagements naming
     Majid Al Futtaim and Alshaya Group, while `grep -rli "blue yonder"` across
     content/case-studies returns ZERO — no study is tagged Blue Yonder and none
     mentions it. That is canon §9's one rule above all: never invent a client or
     a case study, and where something is missing render nothing and name the gap.

     It was worst on the suite with no corpus, which is exactly the suite R13
     built under a hard rule to avoid guessing about. The page omits six real
     Blue Yonder products for want of a role, then claimed three client
     programmes on strictly less evidence.

     So: the tag must NAME the suite. Blue Yonder now renders no evidence section
     at all, which is the honest state; SAP keeps its one genuinely
     "SAP S/4HANA"-tagged study. */
  const suite = hit.platform.name.toLowerCase();
  const studies = getAllCaseStudies()
    .filter((c) => (c.frontmatter.platform ?? "").toLowerCase().includes(suite))
    .slice(0, 3)
    .map((c) => ({
      slug: c.frontmatter.slug,
      title: c.frontmatter.title,
      /* clientPublic gates the NAME, not the study. The schema says outright
         "False where the published page does not name the client. Never
         guessed." */
      client: c.frontmatter.clientPublic ? c.frontmatter.client : null,
      platform: c.frontmatter.platform ?? null,
    }));

  return (
    <PlatformModuleShell
      platform={hit.platform}
      module={hit.module}
      metrics={homeMetrics}
      studies={studies}
    />
  );
}
