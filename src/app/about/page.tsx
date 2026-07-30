import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/components/blocks/editorial/EditorialLayout.module.css";
import { getConsentedClients } from "@/lib/clients";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  seo: {
    title: "About Yallo Talent · Architect-led enterprise talent",
    description:
      "Yallo Talent is the contract-first workforce partner for enterprise programmes. Architect-led screening, region-deep, across UK, Middle East and India.",
  },
  path: "/about",
});

const hueStyle: React.CSSProperties = {
  "--sector-accent": "var(--hue-blue-500)",
  "--sector-accent-08": "var(--hue-blue-08)",
  "--sector-accent-20": "var(--hue-blue-20)",
  "--sector-accent-35": "var(--hue-blue-35)",
} as React.CSSProperties;

const values = [
  {
    title: "Architect-led, always",
    copy: "Every shortlist is reviewed by an operator who has run the same programme. No keyword-match, no volume, no filler.",
  },
  {
    title: "Region-deep, not surface-broad",
    copy: "UK, Middle East, India. We know the local markets, the visa realities, the compensation windows — not a global brand pretending it does.",
  },
  {
    title: "72 hours, always",
    copy: "The 72-hour brief-to-shortlist SLA is our operating rhythm — not a marketing claim.",
  },
  {
    title: "Transparent economics",
    copy: "Day rate on the invoice, margin disclosed. No hidden layers between the specialist and your programme.",
  },
];

const timeline = [
  {
    year: "Founded",
    title: "The architect team assembles",
    copy: "Sumeet Goenka and a small team of enterprise operators start Yallo Talent to fix the volume-over-fit problem in enterprise hiring.",
  },
  {
    year: "Middle East · Europe",
    title: "First benches active",
    copy: "SAP, Oracle and Salesforce contractor benches live across London, Dubai and Riyadh.",
  },
  {
    year: "India",
    title: "Delivery hub opens",
    copy: "Bengaluru delivery-centre engagements begin, extending managed delivery and Global Capability Centre stand-up capability.",
  },
  {
    year: "Today",
    title: "Group of businesses",
    copy: "Yallo Talent is one arm of a group — with saasinator (AI advisory & build) and Yallo AI Academy (enablement) launching in support of enterprise transformation.",
  },
];

export default function AboutPage() {
  const enterpriseClients = getConsentedClients("enterprise");
  const integratorPartners = getConsentedClients("integrators");
  const hasClients = enterpriseClients.length + integratorPartners.length > 0;

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
            About Yallo Talent
          </div>
          <h1 className={styles.heroTitle}>
            Enterprise talent, run by{" "}
            <span className={styles.emphasis}>enterprise operators.</span>
          </h1>
          <p className={styles.heroLede}>
            We're not a recruitment agency. Yallo Talent is architect-led — a
            small, region-deep team of specialists who have shipped enterprise
            programmes themselves, now screening every shortlist that lands in
            your inbox.
          </p>
          <div className={styles.heroCtas}>
            <Link href="/leadership" className={styles.ctaPrimary}>
              Meet the team
              <span aria-hidden="true">→</span>
            </Link>
            <Link href="/why-yallo" className={styles.ctaGhost}>
              Why Yallo
            </Link>
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.wrap}>
          <div className={styles.sectionInner}>
            <span className={styles.sectionEyebrow}>What we do</span>
            <h2 className={styles.sectionH}>
              Talent for enterprise tech programmes — across four engagement
              models.
            </h2>
            <p className={styles.sectionLede}>
              Contract, Permanent, Employer of Record and Managed Delivery. Same
              architect-led screening across all four — matched to how you want
              to hold the risk.
            </p>
            <div className={styles.cardGrid2}>
              <Link href="/contract" className={styles.card}>
                <h3 className={styles.cardTitle}>Contract Workforce</h3>
                <p className={styles.cardCopy}>
                  Interim specialists on your programme in 72 hours.
                </p>
              </Link>
              <Link href="/permanent" className={styles.card}>
                <h3 className={styles.cardTitle}>Permanent Hiring</h3>
                <p className={styles.cardCopy}>
                  Retention-focused permanent hires for programme-critical
                  roles.
                </p>
              </Link>
              <Link href="/eor" className={styles.card}>
                <h3 className={styles.cardTitle}>Employer of Record</h3>
                <p className={styles.cardCopy}>
                  UAE visa and India payroll cover — you direct the work.
                </p>
              </Link>
              <Link href="/managed-delivery" className={styles.card}>
                <h3 className={styles.cardTitle}>Managed Delivery</h3>
                <p className={styles.cardCopy}>
                  Scoped SOW workstreams where Yallo owns the outcome.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className={styles.section}>
        <div className={styles.wrap}>
          <div className={styles.sectionInner}>
            <span className={styles.sectionEyebrow}>How we operate</span>
            <h2 className={styles.sectionH}>The Yallo standard.</h2>
            <p className={styles.sectionLede}>
              Four operating principles that shape every brief, every screening
              call and every placement.
            </p>
            <div className={styles.cardGrid2}>
              {values.map((v) => (
                <article key={v.title} className={styles.card}>
                  <h3 className={styles.cardTitle}>{v.title}</h3>
                  <p className={styles.cardCopy}>{v.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* JOURNEY */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.wrap}>
          <div className={styles.sectionInner}>
            <span className={styles.sectionEyebrow}>Our journey</span>
            <h2 className={styles.sectionH}>
              Built by operators, not recruiters.
            </h2>
            <div className={styles.cardGrid2}>
              {timeline.map((t) => (
                <article key={t.title} className={styles.card}>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--sector-accent)",
                      marginBottom: 12,
                    }}
                  >
                    {t.year}
                  </div>
                  <h3 className={styles.cardTitle}>{t.title}</h3>
                  <p className={styles.cardCopy}>{t.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAMILY */}
      <section className={styles.section}>
        <div className={styles.wrap}>
          <div className={styles.sectionInner}>
            <span className={styles.sectionEyebrow}>The Yallo family</span>
            <h2 className={styles.sectionH}>
              Beyond talent — advisory, build and enablement.
            </h2>
            <p className={styles.sectionLede}>
              Talent is one arm of Yallo. Our sister companies pick up when your
              challenge goes deeper than hiring.
            </p>
            <div className={styles.cardGrid3}>
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>Yallo Talent</h3>
                <p className={styles.cardCopy}>
                  Specialist enterprise talent — permanent, contract, EOR,
                  managed delivery.
                </p>
              </div>
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>saasinator</h3>
                <p className={styles.cardCopy}>
                  Enterprise AI, designed, built and run. Live at saasinator.ai.
                </p>
              </div>
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>Yallo AI Academy</h3>
                <p className={styles.cardCopy}>
                  Role-based AI enablement for leaders and teams. Launching
                  soon.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CLIENTS */}
      <section id="clients" className={styles.section}>
        <div className={styles.wrap}>
          <div className={styles.sectionInner}>
            <span className={styles.sectionEyebrow}>Clients</span>
            <h2 className={styles.sectionH}>Who we've worked with.</h2>
            {hasClients ? (
              <>
                {enterpriseClients.length > 0 && (
                  <>
                    <span className={styles.sectionEyebrow}>Enterprise</span>
                    <div className={styles.cardGrid3}>
                      {enterpriseClients.map((c) => (
                        <div key={c.name} className={styles.card}>
                          <div className={styles.cardTitle}>{c.name}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {integratorPartners.length > 0 && (
                  <>
                    <span className={styles.sectionEyebrow}>
                      Integrator partners
                    </span>
                    <div className={styles.cardGrid3}>
                      {integratorPartners.map((c) => (
                        <div key={c.name} className={styles.card}>
                          <div className={styles.cardTitle}>{c.name}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <p className={styles.sectionLede}>
                We name clients only where written consent is on file. A current
                reference list is available on request.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className={styles.bottomCta}>
        <div className={styles.wrap}>
          <div className={styles.bottomCard}>
            <div className={styles.bottomGlow} aria-hidden="true" />
            <div className={styles.bottomInner}>
              <h2 className={styles.bottomH}>Ready to see how we work?</h2>
              <p className={styles.bottomSub}>
                Send us a brief — you'll have a calibrated shortlist inside 72
                hours.
              </p>
              <div className={styles.bottomActions}>
                <Link href="/brief" className={styles.ctaPrimary}>
                  Send us a brief
                  <span aria-hidden="true">→</span>
                </Link>
                <Link href="/leadership" className={styles.ctaGhost}>
                  Meet the leadership
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
