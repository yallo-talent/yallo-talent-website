import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/components/blocks/editorial/EditorialLayout.module.css";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  seo: {
    title: "Why Yallo Talent · Architect-led, not agency-volume",
    description:
      "Four reasons enterprise leaders choose Yallo over traditional recruitment: architect-led screening, 72-hour SLA, region-deep, 2:1 CV-to-interview ratio.",
  },
  path: "/why-yallo",
});

const hueStyle: React.CSSProperties = {
  "--sector-accent": "var(--hue-rose-500)",
  "--sector-accent-08": "var(--hue-rose-08)",
  "--sector-accent-20": "var(--hue-rose-20)",
  "--sector-accent-35": "var(--hue-rose-35)",
} as React.CSSProperties;

const differentiators = [
  {
    stat: "72h",
    title: "Brief to shortlist — always",
    copy: "Not sometimes. Not for easy roles. Every calibrated brief returns a shortlist inside 72 hours. It's how we're set up to operate.",
  },
  {
    stat: "2:1",
    title: "CV-to-interview ratio",
    copy: "For every candidate you interview, we've screened two more out. You review fits, not filler. Your hiring managers get their time back.",
  },
  {
    stat: "0",
    title: "CVs sent before calibration",
    copy: "No CVs land in your inbox until we've had the calibration call. We understand the programme before we recommend anyone.",
  },
  {
    stat: "3",
    title: "Four entities — London, Dubai, Riyadh, Bengaluru",
    copy: "Not a global brand pretending to know these markets. Region-deep benches, local visa and compliance knowledge, active in the sectors that are hiring.",
  },
];

const comparison = [
  {
    them: "Volume recruiters send 20 CVs and hope",
    us: "We send 3–5 architect-screened fits",
  },
  {
    them: "Keyword-match against a JD",
    us: "Depth-tested by an operator who has run the role",
  },
  {
    them: "Weeks from brief to first CV",
    us: "72 hours to shortlist, always",
  },
  {
    them: "Hidden margin between candidate and client rate",
    us: "Day rate on your invoice, margin disclosed",
  },
  {
    them: "Replacement takes weeks + fresh fee",
    us: "Free replacement search on same 72h SLA",
  },
  {
    them: "No accountability for the placement working",
    us: "Architect-led — the person who screened them stays involved",
  },
];

const credentials = [
  {
    org: "Richemont",
    role: "Enterprise IT operator",
  },
  {
    org: "Landmark Group",
    role: "Retail transformation lead",
  },
  {
    org: "Alshaya EMEA",
    role: "Programme director",
  },
  {
    org: "Yallo Talent",
    role: "Architect team",
  },
];

export default function WhyYalloPage() {
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
            Why Yallo Talent
          </div>
          <h1 className={styles.heroTitle}>
            The hiring partner your{" "}
            <span className={styles.emphasis}>delivery team wanted.</span>
          </h1>
          <p className={styles.heroLede}>
            Not another recruitment agency. Yallo is architect-led — the same
            operators who shipped enterprise programmes at Richemont, Landmark
            and Alshaya EMEA are the ones reviewing every shortlist you get.
          </p>
          <div className={styles.heroCtas}>
            <Link href="/brief" className={styles.ctaPrimary}>
              Send us a brief
              <span aria-hidden="true">→</span>
            </Link>
            <Link href="/leadership" className={styles.ctaGhost}>
              Meet the team
            </Link>
          </div>
        </div>
      </section>

      {/* DIFFERENTIATORS */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.wrap}>
          <div className={styles.sectionInner}>
            <span className={styles.sectionEyebrow}>
              What makes us different
            </span>
            <h2 className={styles.sectionH}>
              Four numbers behind every shortlist.
            </h2>
            <p className={styles.sectionLede}>
              This is our operating rhythm — not marketing. If we don't hit
              these, the model isn't working.
            </p>
            <div className={styles.cardGrid2}>
              {differentiators.map((d) => (
                <article key={d.title} className={styles.card}>
                  <div
                    style={{
                      fontSize: 44,
                      fontWeight: 900,
                      letterSpacing: "-0.03em",
                      color: "var(--sector-accent)",
                      lineHeight: 1,
                      marginBottom: 20,
                    }}
                  >
                    {d.stat}
                  </div>
                  <h3 className={styles.cardTitle}>{d.title}</h3>
                  <p className={styles.cardCopy}>{d.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className={styles.section}>
        <div className={styles.wrap}>
          <div className={styles.sectionInner}>
            <span className={styles.sectionEyebrow}>
              Yallo vs. volume recruiters
            </span>
            <h2 className={styles.sectionH}>Different by design.</h2>
            <p className={styles.sectionLede}>
              Traditional recruitment optimises for candidate throughput. We
              optimise for the hire actually shipping your programme.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
                background: "var(--glass-bg)",
                backdropFilter: "blur(12px)",
                border: "1px solid var(--glass-border)",
                borderRadius: 20,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: 24,
                  background: "var(--wa03)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "var(--fg-subtle)",
                    marginBottom: 20,
                  }}
                >
                  Traditional recruiters
                </div>
                <ul
                  style={{
                    listStyle: "none",
                    margin: 0,
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                  }}
                >
                  {comparison.map((row) => (
                    <li
                      key={row.them}
                      style={{
                        fontSize: 14,
                        color: "var(--fg-muted)",
                        lineHeight: 1.6,
                      }}
                    >
                      {row.them}
                    </li>
                  ))}
                </ul>
              </div>
              <div
                style={{
                  padding: 24,
                  background: "var(--sector-accent-08)",
                  borderLeft: "1px solid var(--sector-accent-35)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "var(--sector-accent)",
                    marginBottom: 20,
                  }}
                >
                  Yallo Talent
                </div>
                <ul
                  style={{
                    listStyle: "none",
                    margin: 0,
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                  }}
                >
                  {comparison.map((row) => (
                    <li
                      key={row.us}
                      style={{
                        fontSize: 14,
                        color: "var(--fg)",
                        lineHeight: 1.6,
                        fontWeight: 500,
                      }}
                    >
                      {row.us}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CREDENTIALS */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.wrap}>
          <div className={styles.sectionInner}>
            <span className={styles.sectionEyebrow}>The architect team</span>
            <h2 className={styles.sectionH}>
              Operators who ran the programmes you're running.
            </h2>
            <p className={styles.sectionLede}>
              Every shortlist is reviewed by someone who has been in that role
              themselves. Not a keyword match against a JD.
            </p>
            <div className={styles.cardGrid2}>
              {credentials.map((c) => (
                <article key={c.org} className={styles.card}>
                  <h3 className={styles.cardTitle}>{c.org}</h3>
                  <p className={styles.cardCopy}>{c.role}</p>
                </article>
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
                See the difference on your next hire.
              </h2>
              <p className={styles.bottomSub}>
                Send us a brief. The 72-hour SLA starts when we finish the
                calibration call.
              </p>
              <div className={styles.bottomActions}>
                <Link href="/brief" className={styles.ctaPrimary}>
                  Send us a brief
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
