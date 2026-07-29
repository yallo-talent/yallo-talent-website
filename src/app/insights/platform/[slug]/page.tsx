import type { Metadata } from "next";
import {
  publishedTaxonomySlugs,
  TaxonomyArchive,
  taxonomyMetadata,
} from "../../_taxonomy";

interface RouteParams {
  slug: string;
}

export function generateStaticParams(): RouteParams[] {
  return publishedTaxonomySlugs("platform").map((slug) => ({ slug }));
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
