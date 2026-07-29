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
  return publishedTaxonomySlugs("discipline").map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<RouteParams>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return taxonomyMetadata("discipline", slug);
}

export default async function DisciplineArchive({ params }: PageProps) {
  const { slug } = await params;
  return <TaxonomyArchive kind="discipline" slug={slug} />;
}
