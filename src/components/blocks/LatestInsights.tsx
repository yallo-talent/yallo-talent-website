import Image from "next/image";
import Link from "next/link";
import styles from "./LatestInsights.module.css";

type Hue = "blue" | "green" | "orange" | "teal" | "violet" | "rose";

interface Insight {
  slug: string;
  title: string;
  category: string;
  hue: Hue;
  author: string;
  minutes: number;
  image: string;
  imageAlt: string;
}

const insights: Insight[] = [
  {
    slug: "gcc-ai-skills-gap",
    title: "How GCC enterprises are closing the AI skills gap",
    category: "AI · Talent",
    hue: "blue",
    author: "Sumeet Goenka",
    minutes: 6,
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&auto=format&fit=crop&q=80",
    imageAlt: "AI abstract data visualisation",
  },
  {
    slug: "2-to-1-cv-ratio",
    title: "Close talent gaps without the 200-CV pile",
    category: "Screening",
    hue: "orange",
    author: "Sumeet Goenka",
    minutes: 5,
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=1200&auto=format&fit=crop&q=80",
    imageAlt: "Business team reviewing candidate shortlist",
  },
  {
    slug: "sap-talent-gcc",
    title: "SAP talent in the GCC: what your peers are paying",
    category: "Market data",
    hue: "teal",
    author: "Yallo Research",
    minutes: 12,
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80",
    imageAlt: "Analytics dashboard with market data charts",
  },
  {
    slug: "gcc-engineering-centre-90-days",
    title: "Stand up your GCC engineering centre in 90 days",
    category: "Capability build",
    hue: "green",
    author: "Sumeet Goenka",
    minutes: 20,
    image:
      "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=1200&auto=format&fit=crop&q=80",
    imageAlt: "Modern engineering office space",
  },
  {
    slug: "cio-hiring-problem",
    title: "Stop your roadmap slipping on open seats",
    category: "For CIOs",
    hue: "rose",
    author: "Sumeet Goenka",
    minutes: 7,
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&auto=format&fit=crop&q=80",
    imageAlt: "Enterprise leadership team meeting",
  },
];

const cardHueStyle = (hue: Hue): React.CSSProperties =>
  ({
    "--card-hue": `var(--hue-${hue}-500)`,
    "--card-hue-08": `var(--hue-${hue}-08)`,
    "--card-hue-20": `var(--hue-${hue}-20)`,
    "--card-hue-35": `var(--hue-${hue}-35)`,
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
      </div>

      <div className={styles.scrollWrap}>
        <div className={styles.scroll}>
          {insights.map((c) => (
            <Link
              key={c.slug}
              href={`/insights/${c.slug}`}
              className={styles.insCard}
              style={cardHueStyle(c.hue)}
            >
              <Image
                src={c.image}
                alt={c.imageAlt}
                fill
                sizes="(max-width: 900px) 88vw, 340px"
                className={styles.insImg}
              />
              <div className={styles.insImgTint} aria-hidden="true" />
              <div className={styles.insImgShade} aria-hidden="true" />
              <span className={styles.insCat}>{c.category}</span>
              <div className={styles.insOverlay}>
                <h3 className={styles.insTitle}>{c.title}</h3>
                <div className={styles.insMeta}>
                  <span className={styles.insAuthor}>
                    {c.author} · {c.minutes} min read
                  </span>
                  <span className={styles.insRead}>Read →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
