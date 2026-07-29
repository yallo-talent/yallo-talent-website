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
  return publishedTaxonomySlugs("industry").map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<RouteParams>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return taxonomyMetadata("industry", slug);
}

export default async function IndustryArchive({ params }: PageProps) {
  const { slug } = await params;
  return <TaxonomyArchive kind="industry" slug={slug} />;
}
