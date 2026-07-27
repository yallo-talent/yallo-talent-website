import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import styles from "@/components/blocks/editorial/EditorialLayout.module.css";
import { insights } from "@/data/insights";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  seo: {
    title: "Insights · Yallo Talent",
    description:
      "Articles, research and white papers on enterprise tech hiring, engagement models and delivery — from the Yallo architect team.",
  },
  path: "/insights",
});

const hueStyle: React.CSSProperties = {
  "--sector-accent": "var(--hue-blue-500)",
  "--sector-accent-08": "var(--hue-blue-08)",
  "--sector-accent-20": "var(--hue-blue-20)",
  "--sector-accent-35": "var(--hue-blue-35)",
} as React.CSSProperties;

export default function InsightsHub() {
  const [featured, ...rest] = insights;

  return (
    <div className={styles.page} style={hueStyle}>
      {/* HERO */}
      <section className={styles.hero}>
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
            Articles, research and white papers from the Yallo architect team —
            operators who ran the programmes, sharing what actually works.
          </p>
        </div>
      </section>

      {/* FEATURED */}
      {featured && (
        <section className={styles.section}>
          <div className={styles.wrap}>
            <div className={styles.sectionInner}>
              <span className={styles.sectionEyebrow}>Featured</span>
              <Link
                href={`/insights/${featured.slug}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.2fr 1fr",
                  gap: 40,
                  padding: 24,
                  background: "var(--glass-bg)",
                  backdropFilter: "blur(14px)",
                  border: "1px solid var(--sector-accent-35)",
                  borderRadius: 24,
                  color: "var(--fg)",
                  alignItems: "center",
                  boxShadow: "0 30px 70px -30px rgba(0,0,0,0.8)",
                }}
                className={styles.card}
              >
                <div
                  style={{
                    position: "relative",
                    aspectRatio: "4 / 3",
                    borderRadius: 16,
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={featured.image}
                    alt={featured.imageAlt}
                    fill
                    sizes="(max-width: 900px) 92vw, 620px"
                    style={{ objectFit: "cover" }}
                    priority
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(135deg, var(--sector-accent-35) 0%, transparent 45%)",
                      mixBlendMode: "overlay",
                    }}
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <span
                    style={{
                      display: "inline-flex",
                      padding: "5px 12px",
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: `var(--hue-${featured.hue}-500)`,
                      background: `var(--hue-${featured.hue}-08)`,
                      border: `1px solid var(--hue-${featured.hue}-35)`,
                      borderRadius: 999,
                      marginBottom: 16,
                    }}
                  >
                    {featured.label} · {featured.readTime}
                  </span>
                  <h2
                    style={{
                      fontSize: "clamp(22px, 2.6vw, 32px)",
                      fontWeight: 900,
                      letterSpacing: "-0.02em",
                      lineHeight: 1.2,
                      color: "var(--fg)",
                      margin: "0 0 12px",
                    }}
                  >
                    {featured.title}
                  </h2>
                  <p
                    style={{
                      fontSize: 15,
                      lineHeight: 1.7,
                      color: "var(--fg-muted)",
                      margin: "0 0 20px",
                    }}
                  >
                    {featured.excerpt}
                  </p>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: `var(--hue-${featured.hue}-500)`,
                    }}
                  >
                    Read the piece
                    <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* GRID */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.wrap}>
          <div className={styles.sectionInner}>
            <span className={styles.sectionEyebrow}>All insights</span>
            <h2 className={styles.sectionH}>The library.</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 20,
                marginTop: 32,
              }}
            >
              {rest.map((item) => (
                <Link
                  key={item.slug}
                  href={`/insights/${item.slug}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    color: "var(--fg)",
                    background: "var(--glass-bg)",
                    border: "1px solid var(--glass-border)",
                    borderRadius: 18,
                    overflow: "hidden",
                    transition: "border-color 0.3s ease, transform 0.3s ease",
                  }}
                  className={styles.card}
                >
                  <div
                    style={{
                      position: "relative",
                      aspectRatio: "4 / 3",
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      fill
                      sizes="(max-width: 900px) 88vw, 320px"
                      style={{ objectFit: "cover" }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: `linear-gradient(135deg, var(--hue-${item.hue}-35) 0%, transparent 50%)`,
                        mixBlendMode: "overlay",
                      }}
                      aria-hidden="true"
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: 14,
                        left: 14,
                        padding: "5px 11px",
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: `var(--hue-${item.hue}-500)`,
                        background:
                          "color-mix(in oklab, var(--ink-950) 70%, transparent)",
                        border: `1px solid var(--hue-${item.hue}-35)`,
                        borderRadius: 999,
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      {item.label}
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "20px 22px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      flexGrow: 1,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                      }}
                    >
                      <span style={{ color: `var(--hue-${item.hue}-500)` }}>
                        {item.eyebrow}
                      </span>
                      <span style={{ color: "var(--fg-subtle)" }}>
                        {item.readTime}
                      </span>
                    </div>
                    <h3
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: "var(--fg)",
                        letterSpacing: "-0.01em",
                        lineHeight: 1.35,
                        margin: 0,
                      }}
                    >
                      {item.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className={styles.bottomCta}>
        <div className={styles.wrap}>
          <div className={styles.bottomCard}>
            <div className={styles.bottomGlow} aria-hidden="true" />
            <div className={styles.bottomInner}>
              <h2 className={styles.bottomH}>
                Have a specific question we haven't covered?
              </h2>
              <p className={styles.bottomSub}>
                Send a brief. One of our architect team will pick it up directly
                — usually with a useful angle you hadn't considered.
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
