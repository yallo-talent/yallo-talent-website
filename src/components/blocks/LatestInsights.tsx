import Image from "next/image";
import Link from "next/link";
import styles from "./LatestInsights.module.css";

type InsightType = "article" | "research" | "paper";
type Hue = "blue" | "green" | "orange" | "teal" | "violet" | "rose";

interface Insight {
  slug: string;
  title: string;
  type: InsightType;
  label: string;
  hue: Hue;
  readTime: string;
  eyebrow: string;
  image: string;
  imageAlt: string;
}

const insights: Insight[] = [
  {
    slug: "gcc-ai-skills-gap",
    title: "How GCC enterprises are closing the AI skills gap",
    type: "article",
    label: "Article",
    hue: "blue",
    readTime: "6 min read",
    eyebrow: "AI · Talent",
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80&auto=format&fit=crop",
    imageAlt: "AI abstract data visualisation",
  },
  {
    slug: "2-to-1-cv-ratio",
    title: "Close talent gaps without the 200-CV pile",
    type: "article",
    label: "Article",
    hue: "orange",
    readTime: "5 min read",
    eyebrow: "Your screening",
    image:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80&auto=format&fit=crop",
    imageAlt: "Recruiter reviewing candidate profiles",
  },
  {
    slug: "sap-talent-gcc",
    title: "SAP talent in the GCC: what your peers are paying",
    type: "research",
    label: "Research",
    hue: "teal",
    readTime: "12 min read",
    eyebrow: "Market data",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80&auto=format&fit=crop",
    imageAlt: "Analytics and market data",
  },
  {
    slug: "gcc-engineering-centre-90-days",
    title: "Stand up your GCC engineering centre in 90 days",
    type: "paper",
    label: "White Paper",
    hue: "green",
    readTime: "20 min read",
    eyebrow: "Capability build",
    image:
      "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&q=80&auto=format&fit=crop",
    imageAlt: "Modern engineering office space",
  },
  {
    slug: "cio-hiring-problem",
    title: "Stop your roadmap slipping on open seats",
    type: "article",
    label: "Article",
    hue: "rose",
    readTime: "7 min read",
    eyebrow: "For CIOs",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80&auto=format&fit=crop",
    imageAlt: "Enterprise leadership meeting",
  },
];

const hueStyle = (hue: Hue): React.CSSProperties =>
  ({
    "--hue-a": `var(--hue-${hue}-500)`,
    "--hue-a-08": `var(--hue-${hue}-08)`,
    "--hue-a-20": `var(--hue-${hue}-20)`,
    "--hue-a-35": `var(--hue-${hue}-35)`,
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
                style={hueStyle(c.hue)}
              >
                <div className={styles.image}>
                  <Image
                    src={c.image}
                    alt={c.imageAlt}
                    fill
                    sizes="(max-width: 640px) 88vw, 320px"
                    className={styles.imageImg}
                  />
                  <div className={styles.imageTint} aria-hidden="true" />
                  <div className={styles.imageOverlay} aria-hidden="true" />
                  <div className={styles.imageChip}>
                    <span className={styles.chip} data-type={c.type}>
                      <span className={styles.chipDot} aria-hidden="true" />
                      {c.label}
                    </span>
                  </div>
                </div>
                <div className={styles.body}>
                  <div className={styles.topRow}>
                    <span className={styles.eyebrowText}>{c.eyebrow}</span>
                    <span className={styles.readTime}>{c.readTime}</span>
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
