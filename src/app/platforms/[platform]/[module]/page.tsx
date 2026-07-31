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

  /* R6: the L2's depth comes from JOINING data already held, not from new copy.
     Published case studies carry a `platform` frontmatter tag, so a study whose
     tag names this suite is real evidence this page can show and its parent card
     cannot. Read server-side and matched on the tag rather than on prose.
     "Multi-platform" counts: those studies span suites by definition, so a suite
     page is a legitimate place for them. Everything else is excluded — a study
     tagged Oracle Fusion is not evidence about SAP. */
  const suite = hit.platform.name.toLowerCase();
  const studies = getAllCaseStudies()
    .filter((c) => {
      const tag = (c.frontmatter.platform ?? "").toLowerCase();
      return tag.includes(suite) || tag === "multi-platform";
    })
    .slice(0, 3)
    .map((c) => ({
      slug: c.frontmatter.slug,
      title: c.frontmatter.title,
      /* clientPublic gates the NAME, not the study. The schema says outright
         "False where the published page does not name the client. Never
         guessed." — so a study with a private client still shows as evidence,
         with its platform and title, and simply does not name who it was for. */
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
