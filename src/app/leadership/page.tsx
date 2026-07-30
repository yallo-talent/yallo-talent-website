import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/components/blocks/editorial/EditorialLayout.module.css";
import { PetalPlate } from "@/components/ui/PetalPlate";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  seo: {
    title: "Leadership · Yallo Talent",
    description:
      "Meet the architect team behind Yallo Talent — enterprise operators from Richemont, Landmark and Alshaya EMEA who screen every shortlist.",
  },
  path: "/leadership",
});

const hueStyle: React.CSSProperties = {
  "--sector-accent": "var(--hue-orange-500)",
  "--sector-accent-08": "var(--hue-orange-08)",
  "--sector-accent-20": "var(--hue-orange-20)",
  "--sector-accent-35": "var(--hue-orange-35)",
} as React.CSSProperties;

const team = [
  {
    initials: "SG",
    name: "Sumeet Goenka",
    role: "Founder & CEO",
    bio: "Enterprise operator with two decades across Richemont, Landmark Group and Alshaya EMEA. Ran the programmes; now runs the team that staffs them.",
    hue: "orange",
  },
  {
    initials: "AK",
    name: "Architect · SAP",
    role: "SAP practice lead",
    bio: "20+ years of SAP delivery across retail and financial services. Reviews every SAP shortlist personally.",
    hue: "blue",
  },
  {
    initials: "RM",
    name: "Architect · Oracle",
    role: "Oracle practice lead",
    bio: "Ex-Oracle Fusion delivery leader. Depth-tests every Oracle candidate for functional and technical fit.",
    hue: "rose",
  },
  {
    initials: "PN",
    name: "Architect · Cloud & Data",
    role: "Cloud and Data practice lead",
    bio: "Azure and AWS platform builder. Runs screening for cloud, data engineering and DevOps roles.",
    hue: "teal",
  },
  {
    initials: "HL",
    name: "Head of Delivery",
    role: "Managed Delivery lead",
    bio: "Runs Yallo Managed Delivery engagements — from scope to hypercare, accountable for outcomes.",
    hue: "violet",
  },
  {
    initials: "MS",
    name: "Head of Talent Ops",
    role: "Contract + EOR ops",
    bio: "Runs the operating tempo — brief calibration, rate cards, visa cover, payroll. Where the 72-hour SLA actually lives.",
    hue: "green",
  },
];

const philosophy = [
  {
    title: "Architects, not sourcers",
    copy: "Every practice lead has run the role they screen for. Depth beats keyword-match, every time.",
  },
  {
    title: "One team, one bench",
    copy: "No agency salesperson, no recruiter middle-layer. The person on your calibration call is the person reviewing the shortlist.",
  },
  {
    title: "Region-deep, not brand-broad",
    copy: "We're not a global-brand office in every capital. We're operators who work the Middle East, Europe and India markets we know cold.",
  },
];

export default function LeadershipPage() {
  return (
    <div className={styles.page} style={hueStyle}>
      {/* HERO */}
      <section className={`${styles.hero} band-dark`}>
        <div className={styles.heroBg} aria-hidden="true">
          <div className={styles.heroBgA} />
          <div className={styles.heroBgB} />
          <div className={styles.heroGrid} />
        </div>
        <div className={styles.heroInner}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowDot} aria-hidden="true" />
            The architect team
          </div>
          <h1 className={styles.heroTitle}>
            The operators screening{" "}
            <span className={styles.emphasis}>every shortlist.</span>
          </h1>
          <p className={styles.heroLede}>
            Yallo's architect team spent two decades building the programmes
            you're building. Now they screen the specialists you hire.
          </p>
          <div className={styles.heroCtas}>
            <Link href="/brief" className={styles.ctaPrimary}>
              Brief the team
              <span aria-hidden="true">→</span>
            </Link>
            <Link href="/about" className={styles.ctaGhost}>
              About Yallo
            </Link>
          </div>
        </div>
      </section>

      {/* FOUNDER SPOTLIGHT */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.wrap}>
          <div className={styles.sectionInner}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1.2fr",
                gap: 48,
                alignItems: "center",
              }}
            >
              <div
                style={{
                  position: "relative",
                  aspectRatio: "4 / 5",
                  borderRadius: 24,
                  overflow: "hidden",
                  border: "1px solid var(--wa15)",
                  boxShadow:
                    "0 40px 90px -30px rgba(0, 0, 0, 0.75), inset 0 1px 0 var(--wa15)",
                }}
              >
                <PetalPlate seed="leadership" ratio={1.2} variant="arcs" />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, transparent 40%, color-mix(in oklab, var(--ink-950) 55%, transparent) 100%)",
                  }}
                  aria-hidden="true"
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 20,
                    left: 20,
                    right: 20,
                    padding: "14px 18px",
                    background: "var(--ground-2)",
                    border: "1px solid var(--hairline)",
                    borderRadius: "0 0 0 var(--r-md)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 900,
                      color: "var(--sector-accent)",
                      letterSpacing: "-0.02em",
                      lineHeight: 1,
                    }}
                  >
                    Sumeet Goenka
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--fg-muted)",
                      marginTop: 4,
                    }}
                  >
                    Founder & CEO
                  </div>
                </div>
              </div>
              <div>
                <span className={styles.sectionEyebrow}>Meet the founder</span>
                <h2 className={styles.sectionH}>
                  Built by an operator, for operators.
                </h2>
                <p
                  style={{
                    fontSize: 16,
                    lineHeight: 1.7,
                    color: "var(--fg-muted)",
                    marginBottom: 20,
                  }}
                >
                  Sumeet spent two decades inside enterprise programmes at
                  Richemont, Landmark Group and Alshaya EMEA — the same
                  programmes you're running today. He knows the SAP go-lives,
                  the WMS cutovers, the multi-country payroll consolidations.
                </p>
                <p
                  style={{
                    fontSize: 16,
                    lineHeight: 1.7,
                    color: "var(--fg-muted)",
                    marginBottom: 24,
                  }}
                >
                  He founded Yallo because he was tired of recruiters sending
                  him keyword-matched CVs that couldn't run the job. Now Yallo
                  is the recruiter he wished he'd had.
                </p>
                <Link href="/brief" className={styles.ctaPrimary}>
                  Brief Sumeet directly
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE TEAM */}
      <section className={styles.section}>
        <div className={styles.wrap}>
          <div className={styles.sectionInner}>
            <span className={styles.sectionEyebrow}>The architect team</span>
            <h2 className={styles.sectionH}>Six operators. Six practices.</h2>
            <p className={styles.sectionLede}>
              Each practice lead has been in the role they screen for. Depth
              beats keyword-match — always.
            </p>
            <div className={styles.cardGrid3}>
              {team.map((member) => (
                <article
                  key={member.initials}
                  className={styles.card}
                  style={
                    {
                      "--sector-accent": `var(--hue-${member.hue}-500)`,
                      "--sector-accent-08": `var(--hue-${member.hue}-08)`,
                      "--sector-accent-35": `var(--hue-${member.hue}-35)`,
                    } as React.CSSProperties
                  }
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 14,
                      display: "grid",
                      placeItems: "center",
                      background: "var(--sector-accent-08)",
                      border: "1px solid var(--sector-accent-35)",
                      color: "var(--sector-accent)",
                      fontFamily: "var(--font-mono)",
                      fontSize: 15,
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                      marginBottom: 20,
                    }}
                  >
                    {member.initials}
                  </div>
                  <h3 className={styles.cardTitle}>{member.name}</h3>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--sector-accent)",
                      marginBottom: 12,
                    }}
                  >
                    {member.role}
                  </div>
                  <p className={styles.cardCopy}>{member.bio}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.wrap}>
          <div className={styles.sectionInner}>
            <span className={styles.sectionEyebrow}>How the team operates</span>
            <h2 className={styles.sectionH}>Three operating principles.</h2>
            <div className={styles.cardGrid3}>
              {philosophy.map((p) => (
                <article key={p.title} className={styles.card}>
                  <h3 className={styles.cardTitle}>{p.title}</h3>
                  <p className={styles.cardCopy}>{p.copy}</p>
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
                Work with operators, not sourcers.
              </h2>
              <p className={styles.bottomSub}>
                Send your brief. Sumeet or one of the practice leads picks it up
                personally.
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
