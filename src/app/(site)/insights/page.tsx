import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/components/blocks/editorial/EditorialLayout.module.css";
import { HeroAtmosphere } from "@/components/ui/HeroAtmosphere";
import { TAXONOMY_LABEL, TAXONOMY_SEGMENT } from "@/lib/content-seo";
import { publishedArticles } from "@/lib/db/content";
import { buildMetadata, SITE } from "@/lib/seo";
import {
  applyFilters,
  canonicalPathFor,
  FILTER_OPTIONS,
  isIndexable,
  parseFilters,
} from "./_filters";
import filters from "./Filters.module.css";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * The hub, with the filter controls design §5 asks for.
 *
 * THE CRAWL DISCIPLINE IS THE WHOLE POINT OF THE METADATA BELOW. Canon A5:
 * single-facet views are real indexable landing pages, and multi-facet
 * combinations canonicalise to the base index and carry `noindex`. Without that
 * second half, five filter controls produce hundreds of URLs a crawler will
 * happily spend its budget on, all of them thin views of the same thirty rows.
 * So `generateMetadata` reads the same filter state the page renders, and one
 * function decides both.
 */
export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const state = parseFilters(await searchParams);
  const base = buildMetadata({
    seo: {
      title: "Insights · Yallo Talent",
      description:
        "Articles, research and white papers on enterprise tech hiring, engagement models and delivery, from the Yallo specialist team.",
      canonical: `${SITE.url}${canonicalPathFor(state)}`,
    },
    path: "/insights",
  });
  if (isIndexable(state)) return base;
  return { ...base, robots: { index: false, follow: true } };
}

export default async function InsightsHub({ searchParams }: PageProps) {
  const state = parseFilters(await searchParams);
  const all = await publishedArticles();
  const matched = applyFilters(all, state);
  const filtering =
    state.industry !== null ||
    state.platform !== null ||
    state.discipline !== null ||
    state.category !== null ||
    state.q !== "";
  const [featured, ...rest] = filtering ? [] : matched;

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <HeroAtmosphere centred seed="insights" />
        <div className={styles.heroInner}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowDot} aria-hidden="true" />
            Knowledge · Insights
          </div>
          <h1 className={styles.heroTitle}>
            Practical thinking on{" "}
            <span className={styles.emphasis}>enterprise tech hiring.</span>
          </h1>
          <p className={styles.heroLede}>
            Articles, research and white papers from the Yallo specialist team,
            specialists who ran the programmes, sharing what actually works.
          </p>
        </div>
      </section>

      {/* A PLAIN GET FORM. The state lands in the URL by construction rather
          than by a pushState somebody has to remember, it works without
          JavaScript, and the back button does what a reader expects. */}
      <section className={styles.section}>
        <div className={styles.wrap}>
          <form action="/insights" className={filters.bar} method="get">
            <h2 className={filters.legend}>Filter</h2>
            <div className={filters.controls}>
              <label className={filters.control} htmlFor="f-q">
                <span className={filters.label}>Search</span>
                <input
                  className={filters.input}
                  defaultValue={state.q}
                  id="f-q"
                  name="q"
                  placeholder="Title, summary or type"
                  type="search"
                />
              </label>

              {(
                ["industry", "platform", "discipline", "category"] as const
              ).map((key) => {
                /* The PUBLIC name, for the control and for the query parameter
                   it writes. A shareable URL is something a person reads, so
                   `?capabilities=ai-talent` and a column called `discipline`
                   are the same split the routes carry. */
                const param =
                  key === "category" ? "category" : TAXONOMY_SEGMENT[key];
                return (
                  <label
                    className={filters.control}
                    htmlFor={`f-${param}`}
                    key={key}
                  >
                    <span className={filters.label}>
                      {key === "category" ? "Type" : TAXONOMY_LABEL[key]}
                    </span>
                    <select
                      className={filters.input}
                      defaultValue={state[key] ?? ""}
                      id={`f-${param}`}
                      name={param}
                    >
                      <option value="">Any</option>
                      {FILTER_OPTIONS[key].map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                );
              })}
            </div>
            <div className={filters.actions}>
              <button className={filters.apply} type="submit">
                Apply
              </button>
              {filtering && (
                <Link className={filters.clear} href="/insights">
                  Clear
                </Link>
              )}
            </div>
          </form>
        </div>
      </section>

      {featured && (
        <section className={styles.section}>
          <div className={styles.wrap}>
            <div className={styles.sectionInner}>
              <span className={styles.sectionEyebrow}>Featured</span>
              <Link href={`/insights/${featured.slug}`} className={styles.card}>
                <span className={styles.sectionEyebrow}>
                  {featured.category} ·{" "}
                  {Math.max(1, featured.readingTimeMinutes)} min read
                </span>
                <h2 className={styles.cardTitle}>{featured.title}</h2>
                <p className={styles.cardCopy}>{featured.summary}</p>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* The quiet hub state, round 22 §4. Gated on the UNFILTERED library
          being empty, not on the filtered result: a filter that matches
          nothing is a different sentence from a library with nothing in it,
          and offering the research link in place of a no-results message
          would answer a question nobody asked. */}
      {all.length === 0 && (
        <section className={styles.section}>
          <div className={styles.wrap}>
            <div className={styles.sectionInner}>
              <span className={styles.sectionEyebrow}>Published research</span>
              <p className={styles.sectionLede}>
                Insight articles are being prepared. The research already
                published sits under Intelligence: five platform talent families
                across the UK, Saudi Arabia and the UAE, each one stating a
                staffing conclusion rather than reproducing a table.
              </p>
              <Link href="/intelligence/research" className={styles.ctaGhost}>
                Read the talent research
              </Link>
            </div>
          </div>
        </section>
      )}

      {all.length > 0 && matched.length === 0 && (
        <section className={styles.section}>
          <div className={styles.wrap}>
            <div className={styles.sectionInner}>
              <p className={styles.sectionLede}>
                Nothing matches those filters.
              </p>
              <Link className={styles.ctaGhost} href="/insights">
                Clear the filters
              </Link>
            </div>
          </div>
        </section>
      )}

      {(filtering ? matched : rest).length > 0 && (
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.wrap}>
            <div className={styles.sectionInner}>
              <span className={styles.sectionEyebrow}>
                {filtering ? "Matching" : "All insights"}
              </span>
              {!filtering && <h2 className={styles.sectionH}>The library.</h2>}
              <div className={styles.cardGrid3}>
                {(filtering ? matched : rest).map((row) => (
                  <Link
                    key={row.slug}
                    href={`/insights/${row.slug}`}
                    className={styles.card}
                  >
                    <span className={styles.sectionEyebrow}>
                      {row.category} · {Math.max(1, row.readingTimeMinutes)} min
                      read
                    </span>
                    <h3 className={styles.cardTitle}>{row.title}</h3>
                    <p className={styles.cardCopy}>{row.summary}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className={styles.bottomCta}>
        <div className={styles.wrap}>
          <div className={styles.bottomCard}>
            <div className={styles.bottomGlow} aria-hidden="true" />
            <div className={styles.bottomInner}>
              <h2 className={styles.bottomH}>
                Have a specific question we haven&apos;t covered?
              </h2>
              <p className={styles.bottomSub}>
                Send a brief. One of our specialist team will pick it up
                directly, usually with a useful angle you hadn&apos;t
                considered.
              </p>
              <div className={styles.bottomActions}>
                <Link href="/brief" className={styles.ctaPrimary}>
                  Send a brief
                  <span aria-hidden="true">→</span>
                </Link>
                <Link href="/case-studies" className={styles.ctaGhost}>
                  See case studies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
