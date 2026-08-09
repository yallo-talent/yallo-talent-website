import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import styles from "@/components/blocks/editorial/EditorialLayout.module.css";
import { TiptapBody } from "@/components/blocks/editorial/TiptapBody";
import {
  type ArticleEntry,
  allArticles,
  articleRowToFrontmatter,
  publishedArticle,
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
  return buildMetadata({
    seo: {
      title: `${entry.frontmatter.title} · Yallo Talent`,
      description: entry.frontmatter.summary,
    },
    path: `/insights/${slug}`,
  });
}

export default async function InsightPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = await tryGetInsight(slug);
  if (!entry) {
    /* Same rule as the case-study route: a slug that exists but is not
       published redirects to the hub, one that exists nowhere is a 404. */
    const known = (await allArticles()).some((a) => a.slug === slug);
    if (known) redirect("/insights");
    notFound();
  }
  const { frontmatter, body } = entry;

  return (
    <article className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroBg} aria-hidden="true">
          <div className={styles.heroBgA} />
          <div className={styles.heroBgB} />
          <div className={styles.heroGrid} />
        </div>
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
