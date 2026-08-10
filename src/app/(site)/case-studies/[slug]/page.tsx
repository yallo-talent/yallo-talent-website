import type { Metadata } from "next";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import { BriefCTA } from "@/components/blocks/BriefCTA";
import styles from "@/components/blocks/case-study/CaseStudyDetail.module.css";
import { CaseStudyHero } from "@/components/blocks/case-study/CaseStudyHero";
import { ClientCard } from "@/components/blocks/case-study/ClientCard";
import { EngagementStrip } from "@/components/blocks/case-study/EngagementStrip";
import { MetricsStrip } from "@/components/blocks/case-study/MetricsStrip";
import { Movements } from "@/components/blocks/case-study/Movements";
import { NextCaseStudy } from "@/components/blocks/case-study/NextCaseStudy";
import { ContentRails } from "@/components/blocks/editorial/ContentRails";
import { clientDisplayNameFor } from "@/data/home/client-logos";
import { contentGraph } from "@/lib/content-jsonld";
import { breadcrumbFor, contentSeo } from "@/lib/content-seo";
import {
  allCaseStudies,
  type CaseStudyEntry,
  caseStudyRowToFrontmatter,
  orderedCaseStudyEntries,
  publishedCaseStudy,
  redirectFor,
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
  /* The row's own SEO fields — see the identical note on the insights route.
     Both templates read one derivation so they cannot disagree about which
     field wins. */
  return buildMetadata({
    seo: contentSeo(entry.row),
    path: `/case-studies/${slug}`,
  });
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = await tryGetCaseStudy(slug);
  if (!entry) {
    /* A slug that MOVED is answered first, permanently — design §6's redirect
       row, spent here rather than in the middleware so the query falls on the
       404 path and not on every request to the site. */
    const moved = await redirectFor(`/case-studies/${slug}`);
    if (moved) permanentRedirect(moved);
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

  const trail = breadcrumbFor("case_study", entry.row);

  return (
    <article className={styles.page}>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD built from typed row data in src/lib/content-jsonld.ts, serialised with JSON.stringify
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contentGraph(entry.row, "case_study", trail)),
        }}
      />
      <CaseStudyHero frontmatter={frontmatter} clientLabel={clientLabel} />
      <EngagementStrip frontmatter={frontmatter} />
      <Movements body={body} slug={frontmatter.slug} />
      <MetricsStrip metrics={frontmatter.metrics} />
      <ClientCard frontmatter={frontmatter} />
      <ContentRails
        candidates={ordered.map((e) => e.row)}
        hubHref="/case-studies"
        row={entry.row}
        subjectPathPrefix="/case-studies"
      />
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
