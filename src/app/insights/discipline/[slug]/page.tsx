import type { Metadata } from "next";
import { TaxonomyArchive, taxonomyMetadata } from "../../_taxonomy";

interface RouteParams {
  slug: string;
}

/* Nothing at build, for the reason the article routes give: canon A2 removed
   the build from the publishing path, so an archive that crosses the
   three-article threshold has to appear the moment it does. */
export function generateStaticParams(): RouteParams[] {
  return [];
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
