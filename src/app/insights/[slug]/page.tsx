import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import { ContentRails } from "@/components/blocks/editorial/ContentRails";
import styles from "@/components/blocks/editorial/EditorialLayout.module.css";
import { TiptapBody } from "@/components/blocks/editorial/TiptapBody";
import { HeroAtmosphere } from "@/components/ui/HeroAtmosphere";
import { contentGraph } from "@/lib/content-jsonld";
import { breadcrumbFor, contentSeo } from "@/lib/content-seo";
import {
  type ArticleEntry,
  allArticles,
  articleRowToFrontmatter,
  publishedArticle,
  publishedArticles,
  redirectFor,
} from "@/lib/db/content";
import { buildMetadata } from "@/lib/seo";

interface RouteParams {
  slug: string;
}

/* Nothing at build. Canon A2 took the build out of the publishing path, so an
   article's route has to exist the moment it publishes rather than at the next
   deploy — `dynamicParams` generates it on first request and the publish
   action's revalidation refreshes it. See the same note on the case-study
   route; it also keeps a build from needing a connection string. */
export function generateStaticParams(): RouteParams[] {
  return [];
}

interface PageProps {
  params: Promise<RouteParams>;
}

async function tryGetInsight(slug: string): Promise<ArticleEntry | null> {
  const row = await publishedArticle(slug);
  if (!row) return null;
  return { frontmatter: articleRowToFrontmatter(row), body: row.body, row };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = await tryGetInsight(slug);
  if (!entry) return { title: "Insight not found" };
  /* The row's OWN SEO fields, not the title and the summary. The cockpit has
     offered meta title, meta description, canonical and OG image since round
     25b and this route read none of them. */
  return buildMetadata({
    seo: contentSeo(entry.row),
    path: `/insights/${slug}`,
  });
}

export default async function InsightPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = await tryGetInsight(slug);
  if (!entry) {
    /* A SLUG THAT MOVED IS ANSWERED BEFORE ANYTHING ELSE. Design §6 writes a
       redirect row when a published slug changes, and this is where it is
       spent: a permanent redirect, so the authority the old URL earned
       arrives at the new one rather than being spent on a 404. */
    const moved = await redirectFor(`/insights/${slug}`);
    if (moved) permanentRedirect(moved);
    /* Same rule as the case-study route: a slug that exists but is not
       published redirects to the hub, one that exists nowhere is a 404. */
    const known = (await allArticles()).some((a) => a.slug === slug);
    if (known) redirect("/insights");
    notFound();
  }
  const { frontmatter, body, row } = entry;
  const trail = breadcrumbFor("article", row);
  const related = await publishedArticles();

  return (
    <article className={styles.page}>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD built from typed row data in src/lib/content-jsonld.ts, serialised with JSON.stringify
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contentGraph(row, "article", trail)),
        }}
      />
      <section className={styles.hero}>
        <HeroAtmosphere centred seed={slug} />
        <div className={styles.heroInner}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowDot} aria-hidden="true" />
            {frontmatter.category} · {frontmatter.readingTimeMinutes} min read
          </div>
          <h1 className={styles.heroTitle}>{frontmatter.title}</h1>
          <p className={styles.heroLede}>{frontmatter.summary}</p>
          <p className={styles.heroLede}>
            <span aria-hidden="true">By </span>
            {frontmatter.author}
            <span aria-hidden="true"> · </span>
            <time dateTime={frontmatter.date}>{frontmatter.date}</time>
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.wrap}>
          <div className={styles.sectionInner}>
            <div className={styles.prose}>
              <TiptapBody doc={body} />
            </div>
            {frontmatter.sources && frontmatter.sources.length > 0 && (
              <aside>
                <h2 className={styles.sectionH}>Sources</h2>
                <div className={styles.prose}>
                  <ul>
                    {frontmatter.sources.map((s) => (
                      <li key={`${s.claim}-${s.source}`}>
                        <strong>{s.claim}</strong>, {s.source}
                        {s.url && (
                          <>
                            {" "}
                            <a href={s.url} rel="noopener noreferrer">
                              (link)
                            </a>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            )}
          </div>
        </div>
      </section>

      <ContentRails
        candidates={related}
        hubHref="/insights"
        row={row}
        subjectPathPrefix="/insights"
      />

      <section className={styles.bottomCta}>
        <div className={styles.wrap}>
          <div className={styles.bottomCard}>
            <div className={styles.bottomInner}>
              <h2 className={styles.bottomH}>Have a specific brief?</h2>
              <div className={styles.bottomActions}>
                <Link href="/brief" className={styles.ctaPrimary}>
                  Send a brief <span aria-hidden="true">→</span>
                </Link>
                <Link href="/insights" className={styles.ctaGhost}>
                  All insights
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
