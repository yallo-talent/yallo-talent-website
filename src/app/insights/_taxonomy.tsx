import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "@/components/blocks/editorial/EditorialLayout.module.css";
import { getInsightsByTaxonomy, getTaxonomyIndex } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export type TaxonomyKind = "industry" | "platform" | "discipline";

const KIND_LABEL: Record<TaxonomyKind, string> = {
  industry: "Industry",
  platform: "Platform",
  discipline: "Discipline",
};

/** Minimum published articles a taxonomy value needs before we render an archive page. */
export const TAXONOMY_MIN_ARTICLES = 3;

export function publishedTaxonomySlugs(kind: TaxonomyKind): string[] {
  const index = getTaxonomyIndex(kind);
  return [...index.entries()]
    .filter(([, entries]) => entries.length >= TAXONOMY_MIN_ARTICLES)
    .map(([slug]) => slug);
}

export function taxonomyMetadata(kind: TaxonomyKind, slug: string): Metadata {
  if (!publishedTaxonomySlugs(kind).includes(slug)) {
    return { title: `${KIND_LABEL[kind]} archive not found` };
  }
  const label = humanise(slug);
  return buildMetadata({
    seo: {
      title: `${label} — ${KIND_LABEL[kind]} insights · Yallo Talent`,
      description: `Insights and research tagged ${label}, from the Yallo architect team.`,
    },
    path: `/insights/${kind}/${slug}`,
  });
}

function humanise(slug: string): string {
  return slug
    .split("-")
    .map((part) =>
      part.length <= 2
        ? part.toUpperCase()
        : part[0].toUpperCase() + part.slice(1),
    )
    .join(" ");
}

export function TaxonomyArchive({
  kind,
  slug,
}: {
  kind: TaxonomyKind;
  slug: string;
}) {
  const validSlugs = publishedTaxonomySlugs(kind);
  if (!validSlugs.includes(slug)) notFound();
  const entries = getInsightsByTaxonomy(kind, slug);
  const label = humanise(slug);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroBg} aria-hidden="true">
          <div className={styles.heroBgA} />
          <div className={styles.heroBgB} />
          <div className={styles.heroGrid} />
        </div>
        <div className={styles.heroInner}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowDot} aria-hidden="true" />
            {KIND_LABEL[kind]} · {label}
          </div>
          <h1 className={styles.heroTitle}>
            Insights tagged <span className={styles.emphasis}>{label}.</span>
          </h1>
          <p className={styles.heroLede}>
            {entries.length} article{entries.length === 1 ? "" : "s"} in this
            archive.
          </p>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.wrap}>
          <div className={styles.sectionInner}>
            <span className={styles.sectionEyebrow}>All articles</span>
            <div className={styles.cardGrid3}>
              {entries.map(({ frontmatter }) => (
                <Link
                  key={frontmatter.slug}
                  href={`/insights/${frontmatter.slug}`}
                  className={styles.card}
                >
                  <span className={styles.sectionEyebrow}>
                    {frontmatter.category} · {frontmatter.readingTimeMinutes}{" "}
                    min read
                  </span>
                  <h2 className={styles.cardTitle}>{frontmatter.title}</h2>
                  <p className={styles.cardCopy}>{frontmatter.summary}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.bottomCta}>
        <div className={styles.wrap}>
          <div className={styles.bottomCard}>
            <div className={styles.bottomInner}>
              <Link href="/insights" className={styles.ctaGhost}>
                All insights
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
