import Link from "next/link";
import styles from "./LatestInsights.module.css";

type InsightType = "article" | "research" | "paper";

interface Insight {
  slug: string;
  title: string;
  type: InsightType;
  label: string;
  variant: 1 | 2 | 3 | 4 | 5;
}

const insights: Insight[] = [
  {
    slug: "gcc-ai-skills-gap",
    title: "How GCC enterprises are closing the AI skills gap",
    type: "article",
    label: "Article",
    variant: 1,
  },
  {
    slug: "2-to-1-cv-ratio",
    title: "Why the 2:1 CV ratio matters more than volume hiring",
    type: "article",
    label: "Article",
    variant: 2,
  },
  {
    slug: "sap-talent-gcc",
    title: "SAP talent in the GCC: what the market tells us",
    type: "research",
    label: "Research",
    variant: 3,
  },
  {
    slug: "gcc-engineering-centre-90-days",
    title: "Building a GCC engineering centre: the first 90 days",
    type: "paper",
    label: "White Paper",
    variant: 4,
  },
  {
    slug: "cio-hiring-problem",
    title: "Open seats, stalled roadmaps: the CIO's hiring problem",
    type: "article",
    label: "Article",
    variant: 5,
  },
];

export function LatestInsights() {
  return (
    <section id="insights" className={styles.section}>
      <div className={styles.wrap}>
        <header className={styles.hd}>
          <div className={styles.eye}>
            <span className={styles.eyeDot} aria-hidden="true" />
            Knowledge
          </div>
          <div className={styles.hdRow}>
            <h2 className={styles.h}>Latest insights</h2>
            <Link href="/insights" className={styles.hdCta}>
              View all
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </header>

        <div className={styles.scrollWrap}>
          <div className={styles.scroll}>
            {insights.map((c) => (
              <Link
                key={c.slug}
                href={`/insights/${c.slug}`}
                className={`${styles.card} ${styles[`theme${c.variant}`]}`}
              >
                <div className={styles.bg} aria-hidden="true" />
                <div className={styles.overlay} />
                <div className={styles.bar} aria-hidden="true" />
                <div className={styles.body}>
                  <div className={styles.top}>
                    <span className={styles.chip} data-type={c.type}>
                      <span className={styles.chipDot} aria-hidden="true" />
                      {c.label}
                    </span>
                  </div>
                  <h3 className={styles.title}>{c.title}</h3>
                  <span className={styles.read}>
                    Read
                    <span className={styles.arr} aria-hidden="true">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
