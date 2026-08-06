import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/components/blocks/editorial/EditorialLayout.module.css";
import { teamIndex } from "@/data/team";
import { leadershipPersonJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  seo: {
    title: "Leadership · Yallo Talent",
    description:
      "Meet Yallo Talent's leadership: Sumeet Goenka, Chandrashekhar Kolar, Niharika Patir, Raphy Varghese and Kritika Poddar.",
  },
  path: "/leadership",
});

const philosophy = [
  {
    title: "Specialists, not sourcers",
    /* Reused verbatim from /about's own "Specialist-led, always" value, rather
       than the retired "every practice lead" framing that no longer matches
       any role title on this page. */
    copy: "Every shortlist is screened against a written standard by a specialist who has run the same programme. No keyword-match, no volume, no filler.",
  },
  {
    title: "One team, one bench",
    copy: "No agency salesperson, no recruiter middle-layer. The person on your calibration call is the person reviewing the shortlist.",
  },
  {
    title: "Region-deep, not brand-broad",
    copy: "We're not a global-brand office in every capital. We're specialists who work the Middle East, Europe and India markets we know cold.",
  },
];

export default function LeadershipPage() {
  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Person JSON-LD is built server-side from src/data/team/index.ts, four fields only (src/lib/jsonld.ts leadershipPersonJsonLd) — no user input
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(leadershipPersonJsonLd()),
        }}
      />

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
            Leadership
          </div>
          <h1 className={styles.heroTitle}>
            The people leading{" "}
            <span className={styles.emphasis}>Yallo Talent.</span>
          </h1>
          <p className={styles.heroLede}>
            Delivery, talent operations, marketing and finance: the people
            running Yallo Talent.
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
            <span className={styles.sectionEyebrow}>The team</span>
            <h2 className={styles.sectionH}>
              Five people leading Yallo Talent.
            </h2>
            <p className={styles.sectionLede}>
              Name, role and a link to their profile.
            </p>
            <div className={styles.cardGrid3}>
              {teamIndex.map((member) => (
                <article
                  key={member.slug}
                  id={member.slug}
                  className={styles.card}
                >
                  <h3 className={styles.cardTitle}>{member.name}</h3>
                  <p className={styles.cardCopy}>{member.role}</p>
                  {member.bio && (
                    <p className={styles.cardCopy}>{member.bio}</p>
                  )}
                  {member.linkedin && (
                    <p className={styles.cardCopy}>
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        LinkedIn <span aria-hidden="true">↗</span>
                      </a>
                    </p>
                  )}
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
                Work with specialists, not sourcers.
              </h2>
              <p className={styles.bottomSub}>
                Send your brief. Yallo Talent&apos;s team picks it up
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
