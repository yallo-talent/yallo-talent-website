import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/components/blocks/editorial/EditorialLayout.module.css";
import { getAllCaseStudies } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  seo: {
    title: "Case Studies · Yallo Talent",
    description:
      "How enterprise teams across banking, retail, manufacturing and tech have used Yallo to close their talent gaps and ship their programmes.",
  },
  path: "/case-studies",
});

export default function CaseStudiesHub() {
  const all = getAllCaseStudies();

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
            Case Studies
          </div>
          <h1 className={styles.heroTitle}>
            Programmes like yours,{" "}
            <span className={styles.emphasis}>shipped on time.</span>
          </h1>
          <p className={styles.heroLede}>
            Enterprise teams across banking, retail, manufacturing and tech have
            closed their talent gaps with Yallo. Here's how.
          </p>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.wrap}>
          <div className={styles.sectionInner}>
            <span className={styles.sectionEyebrow}>All case studies</span>
            <h2 className={styles.sectionH}>Every placement, every outcome.</h2>
            <div className={styles.cardGrid3}>
              {all.map(({ frontmatter }) => {
                const clientLabel = frontmatter.clientPublic
                  ? frontmatter.client
                  : `${frontmatter.category} · ${frontmatter.platform} · ${frontmatter.region}`;
                return (
                  <Link
                    key={frontmatter.slug}
                    href={`/case-studies/${frontmatter.slug}`}
                    className={styles.card}
                  >
                    <span className={styles.sectionEyebrow}>{clientLabel}</span>
                    <h3 className={styles.cardTitle}>{frontmatter.title}</h3>
                    <p className={styles.cardCopy}>{frontmatter.summary}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.bottomCta}>
        <div className={styles.wrap}>
          <div className={styles.bottomCard}>
            <div className={styles.bottomGlow} aria-hidden="true" />
            <div className={styles.bottomInner}>
              <h2 className={styles.bottomH}>Ready to ship your programme?</h2>
              <p className={styles.bottomSub}>
                Send a brief — you'll be reading your own case study on this
                page next.
              </p>
              <div className={styles.bottomActions}>
                <Link href="/brief" className={styles.ctaPrimary}>
                  Send a brief
                  <span aria-hidden="true">→</span>
                </Link>
                <Link href="/why-yallo" className={styles.ctaGhost}>
                  Why Yallo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
