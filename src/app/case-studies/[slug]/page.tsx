import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import styles from "@/components/blocks/editorial/EditorialLayout.module.css";
import {
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
    ? frontmatter.client
    : `${frontmatter.region} · ${frontmatter.platform}`;

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
            Case Study · {clientLabel}
          </div>
          <h1 className={styles.heroTitle}>{frontmatter.title}</h1>
          <p className={styles.heroLede}>{frontmatter.summary}</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.wrap}>
          <div className={styles.sectionInner}>
            <div className={styles.cardGrid3}>
              {frontmatter.metrics.map((m) => (
                <div key={`${m.label}-${m.value}`} className={styles.card}>
                  <div className={styles.cardTitle}>{m.value}</div>
                  <div className={styles.cardCopy}>{m.label}</div>
                  <div className={styles.sectionEyebrow}>
                    Source: {m.source}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.wrap}>
          <div className={styles.sectionInner}>
            <span className={styles.sectionEyebrow}>The outcome</span>
            <h2 className={styles.sectionH}>{frontmatter.outcome}</h2>
            <MDXRemote source={body} />
            {frontmatter.sources && frontmatter.sources.length > 0 && (
              <aside>
                <h3 className={styles.sectionEyebrow}>Sources</h3>
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
              <h2 className={styles.bottomH}>Ready to ship your programme?</h2>
              <div className={styles.bottomActions}>
                <Link href="/brief" className={styles.ctaPrimary}>
                  Send a brief <span aria-hidden="true">→</span>
                </Link>
                <Link href="/case-studies" className={styles.ctaGhost}>
                  All case studies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
