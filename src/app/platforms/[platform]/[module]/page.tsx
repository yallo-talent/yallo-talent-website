import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlatformModuleShell } from "@/components/blocks/platform/PlatformModuleShell";
import { homeMetrics } from "@/data/metrics";
import {
  getPlatformModule,
  publishedModuleParams,
} from "@/data/platforms/derive";
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
  return (
    <PlatformModuleShell
      platform={hit.platform}
      module={hit.module}
      metrics={homeMetrics}
    />
  );
}
