import Link from "next/link";
import styles from "./LatestInsights.module.css";

type InsightType = "article" | "research" | "paper";
type Hue = "blue" | "green" | "orange" | "teal" | "violet" | "rose";

interface Insight {
  slug: string;
  title: string;
  type: InsightType;
  label: string;
  hueA: Hue;
  hueB: Hue;
  readTime: string;
  eyebrow: string;
}

const insights: Insight[] = [
  {
    slug: "gcc-ai-skills-gap",
    title: "How GCC enterprises are closing the AI skills gap",
    type: "article",
    label: "Article",
    hueA: "blue",
    hueB: "violet",
    readTime: "6 min read",
    eyebrow: "AI · Talent",
  },
  {
    slug: "2-to-1-cv-ratio",
    title: "Why the 2:1 CV ratio matters more than volume hiring",
    type: "article",
    label: "Article",
    hueA: "orange",
    hueB: "rose",
    readTime: "5 min read",
    eyebrow: "Screening",
  },
  {
    slug: "sap-talent-gcc",
    title: "SAP talent in the GCC: what the market tells us",
    type: "research",
    label: "Research",
    hueA: "blue",
    hueB: "teal",
    readTime: "12 min read",
    eyebrow: "Market data",
  },
  {
    slug: "gcc-engineering-centre-90-days",
    title: "Building a GCC engineering centre: the first 90 days",
    type: "paper",
    label: "White Paper",
    hueA: "green",
    hueB: "teal",
    readTime: "20 min read",
    eyebrow: "Capability build",
  },
  {
    slug: "cio-hiring-problem",
    title: "Open seats, stalled roadmaps: the CIO's hiring problem",
    type: "article",
    label: "Article",
    hueA: "rose",
    hueB: "orange",
    readTime: "7 min read",
    eyebrow: "Delivery",
  },
];

const hueStyle = (hueA: Hue, hueB: Hue): React.CSSProperties =>
  ({
    "--hue-a": `var(--hue-${hueA}-500)`,
    "--hue-a-35": `var(--hue-${hueA}-35)`,
    "--hue-b": `var(--hue-${hueB}-500)`,
    "--hue-b-35": `var(--hue-${hueB}-35)`,
  }) as React.CSSProperties;

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
                className={styles.card}
                style={hueStyle(c.hueA, c.hueB)}
              >
                <div className={styles.image} aria-hidden="true">
                  <div className={styles.imageA} />
                  <div className={styles.imageB} />
                  <div className={styles.imageNoise} />
                  <div className={styles.imageOverlay} />
                  <svg
                    viewBox="0 0 200 220"
                    className={styles.imageSvg}
                    aria-hidden="true"
                  >
                    <g
                      stroke="var(--hue-a)"
                      strokeWidth="0.5"
                      opacity="0.35"
                      fill="none"
                    >
                      <circle cx="100" cy="110" r="40" />
                      <circle cx="100" cy="110" r="70" />
                      <circle cx="100" cy="110" r="100" />
                    </g>
                    <g fill="var(--hue-b)" opacity="0.7">
                      <circle cx="100" cy="70" r="3" />
                      <circle cx="140" cy="110" r="3" />
                      <circle cx="100" cy="150" r="3" />
                      <circle cx="60" cy="110" r="3" />
                    </g>
                  </svg>
                </div>
                <div className={styles.body}>
                  <div className={styles.topRow}>
                    <span className={styles.chip} data-type={c.type}>
                      <span className={styles.chipDot} aria-hidden="true" />
                      {c.label}
                    </span>
                    <span className={styles.readTime}>{c.readTime}</span>
                  </div>
                  <span className={styles.eyebrowText}>{c.eyebrow}</span>
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
