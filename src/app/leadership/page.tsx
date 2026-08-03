import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/components/blocks/editorial/EditorialLayout.module.css";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  seo: {
    title: "Leadership · Yallo Talent",
    description:
      "Meet the specialist team behind Yallo Talent — enterprise operators from Richemont, Landmark and Alshaya EMEA who screen every shortlist.",
  },
  path: "/leadership",
});

const team = [
  {
    role: "Founder & CEO",
    bio: "Built Yallo after running enterprise programmes at Richemont, Landmark Group and Alshaya EMEA. Still reviews the calibration call personally.",
  },
  {
    role: "SAP practice lead",
    bio: "Reviews every SAP shortlist personally. Screens for delivery fit, not keyword match.",
  },
  {
    role: "Oracle practice lead",
    bio: "Depth-tests every Oracle candidate for functional and technical fit before it reaches your shortlist.",
  },
  {
    role: "Cloud and Data practice lead",
    bio: "Runs screening for cloud, data engineering and DevOps roles across every programme.",
  },
  {
    role: "Managed Delivery lead",
    bio: "Runs Yallo Managed Delivery engagements — from scope to hypercare, accountable for outcomes.",
  },
  {
    role: "Contract + EOR ops lead",
    bio: "Runs the operating tempo — brief calibration, rate cards, visa cover, payroll. Where the 72-hour SLA actually lives.",
  },
];

const philosophy = [
  {
    title: "Specialists, not sourcers",
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
    <div className={styles.page}>
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
            The specialist team
          </div>
          <h1 className={styles.heroTitle}>
            The operators screening{" "}
            <span className={styles.emphasis}>every shortlist.</span>
          </h1>
          <p className={styles.heroLede}>
            Yallo's specialist team spent two decades building the programmes
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

      {/* THE TEAM */}
      <section className={styles.section}>
        <div className={styles.wrap}>
          <div className={styles.sectionInner}>
            <span className={styles.sectionEyebrow}>The specialist team</span>
            <h2 className={styles.sectionH}>Six operators. Six practices.</h2>
            <p className={styles.sectionLede}>
              Each practice lead has been in the role they screen for. Depth
              beats keyword-match — always.
            </p>
            <div className={styles.cardGrid3}>
              {team.map((member) => (
                <article key={member.role} className={styles.card}>
                  <h3 className={styles.cardTitle}>{member.role}</h3>
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
                Send your brief. A practice lead picks it up personally.
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
