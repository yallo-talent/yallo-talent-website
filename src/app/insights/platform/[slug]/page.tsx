import type { Metadata } from "next";
import {
  TaxonomyArchive,
  taxonomyLandingSlugs,
  taxonomyMetadata,
} from "../../_taxonomy";

interface RouteParams {
  slug: string;
}

/* Every value in the index, so all seven routes exist whatever is published.
   Round 25c: canon A5 calls these real landing pages, and a page that appears
   when a third article publishes is a filtered view with a threshold. What
   varies is indexability, not existence — see `_taxonomy.tsx`. */
export function generateStaticParams(): RouteParams[] {
  return taxonomyLandingSlugs("platform").map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<RouteParams>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return taxonomyMetadata("platform", slug);
}

export default async function PlatformArchive({ params }: PageProps) {
  const { slug } = await params;
  return <TaxonomyArchive kind="platform" slug={slug} />;
}
