import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { BriefCTA } from "@/components/blocks/BriefCTA";
import styles from "@/components/blocks/case-study/CaseStudyDetail.module.css";
import { CaseStudyHero } from "@/components/blocks/case-study/CaseStudyHero";
import { ClientCard } from "@/components/blocks/case-study/ClientCard";
import { EngagementStrip } from "@/components/blocks/case-study/EngagementStrip";
import { MetricsStrip } from "@/components/blocks/case-study/MetricsStrip";
import { Movements } from "@/components/blocks/case-study/Movements";
import { NextCaseStudy } from "@/components/blocks/case-study/NextCaseStudy";
import { clientDisplayNameFor } from "@/data/home/client-logos";
import {
  allCaseStudies,
  type CaseStudyEntry,
  caseStudyRowToFrontmatter,
  orderedCaseStudyEntries,
  publishedCaseStudy,
} from "@/lib/db/content";
import { buildMetadata } from "@/lib/seo";

interface RouteParams {
  slug: string;
}

/**
 * NOTHING IS PRERENDERED AT BUILD, and that is the point rather than a
 * concession. Canon A1 put these bodies in the database and A2 removed the
 * build from the publishing path, so a route that only exists because a build
 * enumerated it is a route a new study would not have until the next deploy.
 * Returning nothing here leaves `dynamicParams` to generate each study on first
 * request and cache it, and the publish action's revalidation is what refreshes
 * it. It also means a build needs no connection string, which is what keeps CI
 * able to build this repository at all.
 */
export function generateStaticParams(): RouteParams[] {
  return [];
}

interface PageProps {
  params: Promise<RouteParams>;
}

async function tryGetCaseStudy(slug: string): Promise<CaseStudyEntry | null> {
  const row = await publishedCaseStudy(slug);
  if (!row) return null;
  return { frontmatter: caseStudyRowToFrontmatter(row), body: row.body, row };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = await tryGetCaseStudy(slug);
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
  const entry = await tryGetCaseStudy(slug);
  if (!entry) {
    /* A slug that EXISTS but is not published redirects to the hub; one that
       exists nowhere is a 404. The legacy redirect map points here directly
       since round 25 removed the published manifest, so this is where a 301
       into a 404 is prevented — and a mistyped URL still 404s, which it should. */
    const known = (await allCaseStudies()).some((s) => s.slug === slug);
    if (known) redirect("/case-studies");
    notFound();
  }
  const { frontmatter, body } = entry;

  const clientLabel = frontmatter.clientPublic
    ? clientDisplayNameFor(frontmatter.client)
    : `${frontmatter.region} · ${frontmatter.platform}`;

  const ordered = await orderedCaseStudyEntries();
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
