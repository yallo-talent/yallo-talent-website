import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "@/components/blocks/editorial/EditorialLayout.module.css";
import {
  capabilitiesIndex,
  industriesIndex,
  platformsIndex,
} from "@/data/l1/index";
import { TAXONOMY_LABEL, taxonomyLandingPath } from "@/lib/content-seo";
import { articlesByTaxonomy } from "@/lib/db/content";
import { buildMetadata } from "@/lib/seo";
import { resolveDesk } from "@/lib/tiptap/blocks";

export type TaxonomyKind = "industry" | "platform" | "discipline";

const INDEX: Record<TaxonomyKind, typeof industriesIndex> = {
  industry: industriesIndex,
  platform: platformsIndex,
  discipline: capabilitiesIndex,
};

/**
 * The single-facet landing pages — canon A5 and design §5.
 *
 * WHAT CHANGED IN ROUND 25c, AND WHY THE OLD SHAPE WAS WRONG. These pages used
 * to exist only for taxonomy values carrying at least three published articles,
 * and to consist of a hero, a count and a card grid. Canon A5 calls them "real,
 * indexable landing pages, each with its own copy", and a page that appears
 * when a third article publishes and vanishes when one is unpublished is not a
 * landing page, it is a filtered view with a threshold. It also meant an
 * internal link to one could 404 depending on what was published that week.
 *
 * SO THE ROUTE EXISTS FOR EVERY VALUE IN THE INDEX, all twenty-one, and the
 * copy comes from the index rather than being written per page: the label and
 * the tagline are ratified taxonomy data that the desk pages, the nav and the
 * hub already publish, so nothing is invented here and nothing can drift.
 *
 * INDEXABILITY IS THE THING THAT VARIES, not existence. A landing page with no
 * published article behind it is a thin page, and twenty-one of them in a
 * sitemap is a thin-content problem rather than twenty-one search surfaces. So
 * a value with nothing published renders, says so plainly, points at the desk
 * and at the hub, and carries `noindex`. The moment one article publishes it
 * becomes indexable and joins the sitemap, with no deploy.
 *
 * NO COUNT IN THE LEDE. Canon R21: a lede never states a count the page already
 * displays. The old lede read "{n} articles in this archive", which is exactly
 * the tally R21 names.
 */

/** Every value of a kind, whether or not anything is published against it. */
export function taxonomyLandingSlugs(kind: TaxonomyKind): string[] {
  return INDEX[kind].map((entry) => entry.slug);
}

/** The values a crawler should be pointed at: those with something to read. */
export async function indexableTaxonomySlugs(
  kind: TaxonomyKind,
): Promise<string[]> {
  const slugs = taxonomyLandingSlugs(kind);
  const withArticles = await Promise.all(
    slugs.map(async (slug) => ({
      slug,
      n: (await articlesByTaxonomy(kind, slug)).length,
    })),
  );
  return withArticles.filter((s) => s.n > 0).map((s) => s.slug);
}

function entryFor(kind: TaxonomyKind, slug: string) {
  return INDEX[kind].find((e) => e.slug === slug);
}

export async function taxonomyMetadata(
  kind: TaxonomyKind,
  slug: string,
): Promise<Metadata> {
  const entry = entryFor(kind, slug);
  if (!entry) return { title: `${TAXONOMY_LABEL[kind]} archive not found` };
  const entries = await articlesByTaxonomy(kind, slug);
  const base = buildMetadata({
    seo: {
      title: `${entry.label}: ${TAXONOMY_LABEL[kind]} insights · Yallo Talent`,
      description: `Insights and research from the Yallo specialist team on ${entry.label}. ${entry.tagline}`,
    },
    path: taxonomyLandingPath(kind, slug),
  });
  if (entries.length > 0) return base;
  /* Nothing published against this value yet. The page exists so a link to it
     resolves; it is not something to send a crawler to. */
  return {
    ...base,
    robots: { index: false, follow: true },
  };
}

export async function TaxonomyArchive({
  kind,
  slug,
}: {
  kind: TaxonomyKind;
  slug: string;
}) {
  const entry = entryFor(kind, slug);
  if (!entry) notFound();
  const entries = await articlesByTaxonomy(kind, slug);
  const desk = resolveDesk({ kind, slug });

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
            {TAXONOMY_LABEL[kind]} · Insights
          </div>
          <h1 className={styles.heroTitle}>
            <span className={styles.emphasis}>{entry.label}</span> hiring, as we
            see it.
          </h1>
          {/* The desk's own ratified tagline. Not a second description written
              for this page: the discipline is named once in the index, and
              every surface that names it reads from there. */}
          <p className={styles.heroLede}>{entry.tagline}</p>
        </div>
      </section>

      {entries.length > 0 ? (
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.wrap}>
            <div className={styles.sectionInner}>
              <span className={styles.sectionEyebrow}>Published</span>
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
      ) : (
        <section className={styles.section}>
          <div className={styles.wrap}>
            <div className={styles.sectionInner}>
              {/* Stated rather than hidden. A landing page that pretends to
                  have content is worse than one that says what it has, and
                  this page carries noindex until it does. */}
              <p className={styles.sectionLede}>
                Nothing is published under this tag yet. The desk below is where
                the work itself sits.
              </p>
            </div>
          </div>
        </section>
      )}

      {desk && (
        <section className={styles.section}>
          <div className={styles.wrap}>
            <div className={styles.sectionInner}>
              <span className={styles.sectionEyebrow}>The desk</span>
              <Link className={styles.card} href={desk.href}>
                <h2 className={styles.cardTitle}>{desk.label}</h2>
                <p className={styles.cardCopy}>{desk.tagline}</p>
              </Link>
            </div>
          </div>
        </section>
      )}

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
    </div>
  );
}
