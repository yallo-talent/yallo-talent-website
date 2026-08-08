import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/components/blocks/editorial/EditorialLayout.module.css";
import { getPublishedInsights } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  seo: {
    title: "Insights · Yallo Talent",
    description:
      "Articles, research and white papers on enterprise tech hiring, engagement models and delivery, from the Yallo specialist team.",
  },
  path: "/insights",
});

export default function InsightsHub() {
  const all = getPublishedInsights();
  const [featured, ...rest] = all;

  return (
    <div className={styles.page}>
      <section className={`${styles.hero} band-dark`}>
        <div className={styles.heroBg} aria-hidden="true">
          <div className={styles.heroBgA} />
          <div className={styles.heroBgB} />
          <div className={styles.heroGrid} />
        </div>
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

      {featured && (
        <section className={styles.section}>
          <div className={styles.wrap}>
            <div className={styles.sectionInner}>
              <span className={styles.sectionEyebrow}>Featured</span>
              <Link
                href={`/insights/${featured.frontmatter.slug}`}
                className={styles.card}
              >
                <span className={styles.sectionEyebrow}>
                  {featured.frontmatter.category} ·{" "}
                  {featured.frontmatter.readingTimeMinutes} min read
                </span>
                <h2 className={styles.cardTitle}>
                  {featured.frontmatter.title}
                </h2>
                <p className={styles.cardCopy}>
                  {featured.frontmatter.summary}
                </p>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* The quiet hub state, round 22 §4. Measured before it was written: with
          every legacy insight unpublished, this page rendered exactly two
          sections, hero then brief CTA, so a visitor read a promise of
          "articles, research and white papers" and was handed a contact form.
          Nothing was broken; there was simply no route from here to the
          research that does exist. One paragraph and one link close that.

          Gated on `all.length === 0`, not on a flag: the moment a single
          article publishes, the featured card answers the hero and this block
          removes itself. No placeholder cards and no coming-soon device, per
          the same ruling. */}
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

      {/* The whole legacy insight family is unpublished pending Talent-speak
          conversion, so this list can legitimately be empty. Render nothing
          rather than a heading with a void under it — the same rule the
          testimonial slot follows. */}
      {rest.length > 0 && (
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.wrap}>
            <div className={styles.sectionInner}>
              <span className={styles.sectionEyebrow}>All insights</span>
              <h2 className={styles.sectionH}>The library.</h2>
              <div className={styles.cardGrid3}>
                {rest.map(({ frontmatter }) => (
                  <Link
                    key={frontmatter.slug}
                    href={`/insights/${frontmatter.slug}`}
                    className={styles.card}
                  >
                    <span className={styles.sectionEyebrow}>
                      {frontmatter.category} · {frontmatter.readingTimeMinutes}{" "}
                      min read
                    </span>
                    <h3 className={styles.cardTitle}>{frontmatter.title}</h3>
                    <p className={styles.cardCopy}>{frontmatter.summary}</p>
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
                Have a specific question we haven't covered?
              </h2>
              <p className={styles.bottomSub}>
                Send a brief. One of our specialist team will pick it up
                directly, usually with a useful angle you hadn't considered.
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
