import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import styles from "@/components/blocks/editorial/EditorialLayout.module.css";
import {
  getAllInsightSlugs,
  getInsight,
  type LoadedEntry,
} from "@/lib/content";
import type { InsightFrontmatter } from "@/lib/content-schema";
import { buildMetadata } from "@/lib/seo";

interface RouteParams {
  slug: string;
}

export function generateStaticParams(): RouteParams[] {
  return getAllInsightSlugs()
    .filter((slug) => {
      try {
        return getInsight(slug).frontmatter.published !== false;
      } catch {
        return false;
      }
    })
    .map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<RouteParams>;
}

function tryGetInsight(slug: string): LoadedEntry<InsightFrontmatter> | null {
  try {
    return getInsight(slug);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw err;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = tryGetInsight(slug);
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
  const entry = tryGetInsight(slug);
  if (!entry || entry.frontmatter.published === false) notFound();
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
            <MDXRemote source={body} />
            {frontmatter.sources && frontmatter.sources.length > 0 && (
              <aside>
                <h2 className={styles.sectionH}>Sources</h2>
                <ul>
                  {frontmatter.sources.map((s) => (
                    <li key={`${s.claim}-${s.source}`}>
                      <strong>{s.claim}</strong> — {s.source}
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
