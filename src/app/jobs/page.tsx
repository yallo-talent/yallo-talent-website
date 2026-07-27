import type { Metadata } from "next";
import Link from "next/link";
import { CvUploadForm } from "@/components/blocks/CvUploadForm";
import styles from "@/components/blocks/editorial/EditorialLayout.module.css";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  seo: {
    title: "Job Seekers · Yallo Talent",
    description:
      "Contract, permanent and EOR opportunities across UK, ME and India. Send your CV — we'll match you to your next enterprise programme.",
  },
  path: "/jobs",
});

const hueStyle: React.CSSProperties = {
  "--sector-accent": "var(--hue-green-500)",
  "--sector-accent-08": "var(--hue-green-08)",
  "--sector-accent-20": "var(--hue-green-20)",
  "--sector-accent-35": "var(--hue-green-35)",
} as React.CSSProperties;

const openings = [
  {
    role: "SAP FICO Functional Consultant",
    engagement: "Contract",
    location: "Dubai, UAE",
    hue: "orange",
    days: "12-month engagement",
  },
  {
    role: "Oracle Fusion Cloud Architect",
    engagement: "Contract",
    location: "London, UK",
    hue: "rose",
    days: "9-month engagement",
  },
  {
    role: "Salesforce Commerce Cloud Lead",
    engagement: "Permanent",
    location: "Riyadh, KSA",
    hue: "teal",
    days: "Immediate start",
  },
  {
    role: "Blue Yonder WMS Specialist",
    engagement: "Contract",
    location: "Bengaluru, India",
    hue: "orange",
    days: "6-month engagement",
  },
  {
    role: "Cloud Platform Engineer (Azure)",
    engagement: "Permanent",
    location: "London, UK",
    hue: "blue",
    days: "Rolling",
  },
  {
    role: "Data Engineering Lead",
    engagement: "Contract",
    location: "Remote (UK/UAE)",
    hue: "violet",
    days: "12-month engagement",
  },
];

export default function JobsPage() {
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
            For specialists
          </div>
          <h1 className={styles.heroTitle}>
            Enterprise programmes that{" "}
            <span className={styles.emphasis}>actually ship.</span>
          </h1>
          <p className={styles.heroLede}>
            Yallo places enterprise IT specialists onto real delivery programmes
            across UK, Middle East and India. Send your CV — we'll match you
            where your depth genuinely fits.
          </p>
          <div className={styles.heroCtas}>
            <Link href="#upload" className={styles.ctaPrimary}>
              Send your CV
              <span aria-hidden="true">→</span>
            </Link>
            <Link href="#openings" className={styles.ctaGhost}>
              Browse openings
            </Link>
          </div>
        </div>
      </section>

      {/* WHY WORK VIA YALLO */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.wrap}>
          <div className={styles.sectionInner}>
            <span className={styles.sectionEyebrow}>Why work through us</span>
            <h2 className={styles.sectionH}>
              We don't spam-submit you to five roles.
            </h2>
            <p className={styles.sectionLede}>
              We talk to you once, work out what you actually want your next
              engagement to look like, and only submit you where we're confident
              you're the fit.
            </p>
            <div className={styles.cardGrid3}>
              <article className={styles.card}>
                <h3 className={styles.cardTitle}>Actual conversations</h3>
                <p className={styles.cardCopy}>
                  A real screening call with an operator, not a five-minute
                  keyword-list phone screen.
                </p>
              </article>
              <article className={styles.card}>
                <h3 className={styles.cardTitle}>Depth over volume</h3>
                <p className={styles.cardCopy}>
                  We put you forward for two roles you'd actually want, not
                  twenty you don't.
                </p>
              </article>
              <article className={styles.card}>
                <h3 className={styles.cardTitle}>Regional coverage</h3>
                <p className={styles.cardCopy}>
                  UK, UAE, KSA, India — with visa cover and payroll support if
                  the role sits in a market you're not resident in.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* OPEN ROLES */}
      <section id="openings" className={styles.section}>
        <div className={styles.wrap}>
          <div className={styles.sectionInner}>
            <span className={styles.sectionEyebrow}>Current openings</span>
            <h2 className={styles.sectionH}>
              Live briefs we're screening for.
            </h2>
            <p className={styles.sectionLede}>
              A sample of the enterprise programmes we're actively staffing.
              Send your CV even if you don't see your exact role — we screen for
              more than what's listed.
            </p>
            <div
              style={{
                display: "grid",
                gap: 12,
                marginTop: 24,
              }}
            >
              {openings.map((o) => (
                <div
                  key={o.role}
                  className={styles.card}
                  style={
                    {
                      "--sector-accent": `var(--hue-${o.hue}-500)`,
                      "--sector-accent-08": `var(--hue-${o.hue}-08)`,
                      "--sector-accent-35": `var(--hue-${o.hue}-35)`,
                      display: "grid",
                      gridTemplateColumns: "1fr auto auto auto",
                      gap: 24,
                      alignItems: "center",
                      padding: "20px 24px",
                    } as React.CSSProperties
                  }
                >
                  <div>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: "var(--fg)",
                        letterSpacing: "-0.01em",
                        marginBottom: 4,
                      }}
                    >
                      {o.role}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        letterSpacing: "0.06em",
                        color: "var(--fg-muted)",
                      }}
                    >
                      {o.location} · {o.days}
                    </div>
                  </div>
                  <span
                    style={{
                      padding: "5px 12px",
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "var(--sector-accent)",
                      background: "var(--sector-accent-08)",
                      border: "1px solid var(--sector-accent-35)",
                      borderRadius: 999,
                    }}
                  >
                    {o.engagement}
                  </span>
                  <Link
                    href="#upload"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--fg)",
                      transition: "color 0.15s ease",
                    }}
                  >
                    Apply →
                  </Link>
                </div>
              ))}
            </div>
            <p
              style={{
                marginTop: 24,
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--fg-subtle)",
              }}
            >
              Full jobs board coming soon — for now, send us your CV.
            </p>
          </div>
        </div>
      </section>

      {/* CV UPLOAD */}
      <div id="upload">
        <CvUploadForm />
      </div>
    </div>
  );
}
