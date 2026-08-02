import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BriefCTA } from "@/components/blocks/BriefCTA";
import styles from "@/components/blocks/case-study/CaseStudyDetail.module.css";
import { CaseStudyHero } from "@/components/blocks/case-study/CaseStudyHero";
import { ClientCard } from "@/components/blocks/case-study/ClientCard";
import { EngagementStrip } from "@/components/blocks/case-study/EngagementStrip";
import { MetricsStrip } from "@/components/blocks/case-study/MetricsStrip";
import { Movements } from "@/components/blocks/case-study/Movements";
import { NextCaseStudy } from "@/components/blocks/case-study/NextCaseStudy";
import { clientDisplayNameFor } from "@/data/home/client-logos";
import { orderedCaseStudies } from "@/lib/case-study-order";
import {
  getAllCaseStudies,
  getAllCaseStudySlugs,
  getCaseStudy,
  type LoadedEntry,
} from "@/lib/content";
import type { CaseStudyFrontmatter } from "@/lib/content-schema";
import { buildMetadata } from "@/lib/seo";

interface RouteParams {
  slug: string;
}

export function generateStaticParams(): RouteParams[] {
  return getAllCaseStudySlugs().map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<RouteParams>;
}

function tryGetCaseStudy(
  slug: string,
): LoadedEntry<CaseStudyFrontmatter> | null {
  try {
    return getCaseStudy(slug);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw err;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = tryGetCaseStudy(slug);
  if (!entry) return { title: "Case study not found" };
  return buildMetadata({
    seo: {
      title: `${entry.frontmatter.title} · Yallo Talent`,
      description: entry.frontmatter.summary,
    },
    path: `/case-studies/${slug}`,
  });
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = tryGetCaseStudy(slug);
  if (!entry) notFound();
  const { frontmatter, body } = entry;

  const clientLabel = frontmatter.clientPublic
    ? clientDisplayNameFor(frontmatter.client)
    : `${frontmatter.region} · ${frontmatter.platform}`;

  const ordered = orderedCaseStudies(getAllCaseStudies());
  const currentIndex = ordered.findIndex(
    (e) => e.frontmatter.slug === frontmatter.slug,
  );
  const next =
    ordered.length > 1
      ? ordered[(currentIndex + 1) % ordered.length]
      : undefined;

  return (
    <article className={styles.page}>
      <CaseStudyHero frontmatter={frontmatter} clientLabel={clientLabel} />
      <EngagementStrip frontmatter={frontmatter} />
      <Movements body={body} slug={frontmatter.slug} />
      <MetricsStrip metrics={frontmatter.metrics} />
      <ClientCard frontmatter={frontmatter} />
      {next && (
        <NextCaseStudy
          slug={next.frontmatter.slug}
          title={next.frontmatter.title}
        />
      )}
      <BriefCTA />
    </article>
  );
}
