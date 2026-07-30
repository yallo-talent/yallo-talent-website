"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { HeroAtmosphere } from "@/components/ui/HeroAtmosphere";
import { PetalPlate } from "@/components/ui/PetalPlate";
import type { ServicePageData } from "@/data/services/types";
import styles from "./ServicePageShell.module.css";

interface Props {
  data: ServicePageData;
}

export function ServicePageShell({ data }: Props) {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className={`${styles.page} amb-4`}>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: FAQ JSON-LD is generated server-side from typed FAQ data — no user input
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <ServiceHero data={data} />
      <ServiceBenefits data={data} />
      <ServiceProcess data={data} />
      <ServiceRoles data={data} />
      <ServiceFaq data={data} />
      <ServiceBottomCta data={data} />
    </div>
  );
}

function ServiceHero({ data }: Props) {
  return (
    <section className={styles.hero}>
      {/* B3. Replaces a hand-rolled three-layer gradient-and-grid stack with the
          shared field, so a service hero and an L1 hero are the same object. */}
      <HeroAtmosphere seed={data.slug} />
      <div className={styles.heroWrap}>
        <div className={styles.heroText}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowDot} aria-hidden="true" />
            {data.eyebrow}
          </div>
          <h1 className={styles.heroTitle}>
            {data.title}
            <br />
            <span className={styles.emphasis}>{data.emphasis}</span>
          </h1>
          <p className={styles.heroLede}>{data.lede}</p>
          <div className={styles.heroCtas}>
            <Link href={data.primaryCta.href} className={styles.ctaPrimary}>
              {data.primaryCta.label}
              <span aria-hidden="true">→</span>
            </Link>
            <Link href={data.secondaryCta.href} className={styles.ctaGhost}>
              {data.secondaryCta.label}
            </Link>
          </div>
          <div className={styles.trustLine}>{data.trustLine}</div>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.heroFrame}>
            <PetalPlate
              seed={data.slug}
              className={styles.heroImage}
              ratio={0.5}
            />
            <div className={styles.heroImageOverlay} aria-hidden="true" />
            <div className={styles.heroImageTint} aria-hidden="true" />
            <div className={styles.heroStat}>
              <span className={styles.heroStatN}>{data.heroStat.n}</span>
              <span className={styles.heroStatL}>{data.heroStat.l}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceBenefits({ data }: Props) {
  return (
    <section className={styles.benefits}>
      <div className={styles.wrap}>
        <h2 className={styles.sectionH}>{data.benefitsHeading}</h2>
        <div className={styles.benefitsGrid}>
          {data.benefits.map((b, i) => (
            <motion.article
              // biome-ignore lint/suspicious/noArrayIndexKey: benefit list is static, stable order
              key={i}
              className={styles.benefitCard}
              initial={{ y: 20 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <div className={styles.benefitIcon}>{b.icon}</div>
              <h3 className={styles.benefitTitle}>{b.title}</h3>
              <p className={styles.benefitCopy}>{b.copy}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceProcess({ data }: Props) {
  const total = data.process.length;
  return (
    <section className={styles.process}>
      <div className={styles.processOrbA} aria-hidden="true" />
      <div className={styles.processOrbB} aria-hidden="true" />
      <div className={styles.wrap}>
        <div className={styles.processHead}>
          <div className={styles.processEyebrow}>
            The Yallo operating rhythm
          </div>
          <h2 className={styles.sectionH}>{data.processHeading}</h2>
          <p className={styles.processLede}>{data.processLede}</p>
        </div>
        <ol className={styles.steps}>
          {/* Vertical connecting line running through step numbers */}
          <div className={styles.stepsLine} aria-hidden="true" />
          {data.process.map((s, i) => (
            <motion.li
              key={s.title}
              className={styles.step}
              initial={{ y: 20 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className={styles.stepMarker}>
                <div className={styles.stepMarkerRing} aria-hidden="true" />
                <div className={styles.stepNum}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className={styles.stepMarkerLabel} aria-hidden="true">
                  Step {i + 1} of {total}
                </div>
              </div>
              <div className={styles.stepCard}>
                <div className={styles.stepCardInner}>
                  <div className={styles.stepTitleRow}>
                    <h3 className={styles.stepTitle}>{s.title}</h3>
                    {s.tag && <span className={styles.stepTag}>{s.tag}</span>}
                  </div>
                  <p className={styles.stepCopy}>{s.copy}</p>
                </div>
                <div className={styles.stepArrow} aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    role="presentation"
                  >
                    <title>Continue</title>
                    <path d="M12 5v14M5 12l7 7 7-7" />
                  </svg>
                </div>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ServiceRoles({ data }: Props) {
  return (
    <section className={styles.roles}>
      <div className={styles.wrap}>
        <div className={styles.rolesHead}>
          <h2 className={styles.sectionH}>{data.rolesHeading}</h2>
        </div>
        <div className={styles.rolesGrid}>
          {data.roles.map((role) => (
            <span key={role} className={styles.rolePill}>
              {role}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceFaq({ data }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <section className={styles.faq}>
      <div className={styles.faqOrb} aria-hidden="true" />
      <div className={styles.wrap}>
        <div className={styles.faqLayout}>
          <div className={styles.faqAside}>
            <div className={styles.faqEyebrow}>Quick answers</div>
            <h2 className={styles.sectionH}>{data.faqHeading}</h2>
            <p className={styles.faqAsideCopy}>
              The questions we get most often — answered directly. Anything not
              covered? Send us a brief and we'll pick it up.
            </p>
            <div className={styles.faqAsideStats}>
              <div className={styles.faqAsideStat}>
                <span className={styles.faqAsideStatN}>{data.faqs.length}</span>
                <span className={styles.faqAsideStatL}>questions answered</span>
              </div>
              <div className={styles.faqAsideStat}>
                <span className={styles.faqAsideStatN}>72h</span>
                <span className={styles.faqAsideStatL}>reply on briefs</span>
              </div>
            </div>
          </div>
          <div className={styles.faqList}>
            {data.faqs.map((f, i) => {
              const isOpen = openIdx === i;
              return (
                <div
                  key={f.q}
                  className={`${styles.faqItem} ${isOpen ? styles.faqOpen : ""}`}
                >
                  <button
                    type="button"
                    className={styles.faqQ}
                    aria-expanded={isOpen}
                    onClick={() => setOpenIdx(isOpen ? null : i)}
                  >
                    <span className={styles.faqQNum}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={styles.faqQText}>{f.q}</span>
                    <span className={styles.faqChev} aria-hidden="true">
                      <svg
                        viewBox="0 0 16 16"
                        role="presentation"
                        strokeWidth="1.6"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <title>Toggle</title>
                        <path d="M4 6l4 4 4-4" />
                      </svg>
                    </span>
                  </button>
                  {isOpen && (
                    <motion.div
                      className={styles.faqA}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
                    >
                      <p>{f.a}</p>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceBottomCta({ data }: Props) {
  return (
    <section className={styles.bottomCta}>
      <div className={styles.wrap}>
        <div className={styles.bottomCard}>
          <div className={styles.bottomGlow} aria-hidden="true" />
          <div className={styles.bottomInner}>
            <h2 className={styles.bottomH}>Ready to close your talent gap?</h2>
            <p className={styles.bottomSub}>
              Send a brief. We'll come back with a calibrated shortlist inside
              72 hours.
            </p>
            <div className={styles.bottomActions}>
              <Link href={data.primaryCta.href} className={styles.ctaPrimary}>
                {data.primaryCta.label}
                <span aria-hidden="true">→</span>
              </Link>
              <Link href="/#how" className={styles.ctaGhost}>
                See how it works
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
