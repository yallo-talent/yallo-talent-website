import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/components/blocks/editorial/EditorialLayout.module.css";
import { cases } from "@/data/case-studies";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  seo: {
    title: "Case Studies · Yallo Talent",
    description:
      "How enterprise teams across banking, retail, manufacturing and tech have used Yallo to close their talent gaps and ship their programmes.",
  },
  path: "/case-studies",
});

const hueStyle: React.CSSProperties = {
  "--sector-accent": "var(--hue-orange-500)",
  "--sector-accent-08": "var(--hue-orange-08)",
  "--sector-accent-20": "var(--hue-orange-20)",
  "--sector-accent-35": "var(--hue-orange-35)",
} as React.CSSProperties;

export default function CaseStudiesHub() {
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

      {/* GRID */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.wrap}>
          <div className={styles.sectionInner}>
            <span className={styles.sectionEyebrow}>All case studies</span>
            <h2 className={styles.sectionH}>Every placement, every outcome.</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: 20,
                marginTop: 32,
              }}
            >
              {cases.map((c) => (
                <Link
                  key={c.slug}
                  href={`/case-studies/${c.slug}`}
                  className={styles.card}
                  style={
                    {
                      "--sector-accent": `var(--hue-${c.hue}-500)`,
                      "--sector-accent-08": `var(--hue-${c.hue}-08)`,
                      "--sector-accent-20": `var(--hue-${c.hue}-20)`,
                      "--sector-accent-35": `var(--hue-${c.hue}-35)`,
                      display: "flex",
                      flexDirection: "column",
                      color: "var(--fg)",
                    } as React.CSSProperties
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 20,
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        display: "grid",
                        placeItems: "center",
                        borderRadius: 10,
                        background: "var(--sector-accent-08)",
                        border: "1px solid var(--sector-accent-35)",
                        color: "var(--sector-accent)",
                        fontFamily: "var(--font-mono)",
                        fontSize: 13,
                        fontWeight: 700,
                        letterSpacing: "0.04em",
                      }}
                    >
                      {c.logo}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "var(--fg-subtle)",
                      }}
                    >
                      {c.meta.join(" · ")}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 48,
                      fontWeight: 900,
                      letterSpacing: "-0.03em",
                      lineHeight: 0.95,
                      color: "var(--sector-accent)",
                      marginBottom: 12,
                    }}
                  >
                    {c.metric}
                  </div>
                  <h3 className={styles.cardTitle}>{c.title}</h3>
                  <p className={styles.cardCopy} style={{ marginBottom: 20 }}>
                    {c.desc}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      marginBottom: 16,
                    }}
                  >
                    {c.tags.map((t) => (
                      <span
                        key={t}
                        style={{
                          padding: "5px 11px",
                          fontFamily: "var(--font-mono)",
                          fontSize: 10,
                          letterSpacing: "0.06em",
                          color: "var(--sector-accent)",
                          background: "var(--sector-accent-08)",
                          border: "1px solid var(--sector-accent-35)",
                          borderRadius: 999,
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <span
                    style={{
                      marginTop: "auto",
                      paddingTop: 16,
                      borderTop: "1px solid var(--border)",
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--fg-muted)",
                    }}
                  >
                    Read the story →
                  </span>
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
