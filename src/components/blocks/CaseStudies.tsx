import Link from "next/link";
import styles from "./CaseStudies.module.css";

interface CaseStudy {
  slug: string;
  metric: string;
  meta: [string, string, string];
  tags: [string, string];
  title: string;
  desc: string;
}

const cases: CaseStudy[] = [
  {
    slug: "gcc-bank-sap-72h",
    metric: "72h",
    meta: ["PERMANENT", "BANKING", "GCC"],
    tags: ["SAP", "Programme"],
    title: "Three SAP specialists, shortlisted in 72 hours",
    desc: "A GCC bank needed a core-banking programme staffed at pace. We calibrated the brief and returned an architect-screened shortlist within 72 hours — the team moved two candidates to offer.",
  },
  {
    slug: "uae-manufacturing-2to1",
    metric: "2:1",
    meta: ["CONTRACT", "MANUFACTURING", "UAE"],
    tags: ["Delivery", "Programme"],
    title: "A delivery team staffed against a hard deadline",
    desc: "A manufacturing group had a fixed go-live and a gap in its delivery team. A calibrated contract shortlist — a 2:1 CV-to-interview ratio — put the right specialists on the programme in days, not weeks.",
  },
];

export function CaseStudies() {
  return (
    <section id="case-studies" className={styles.section}>
      <div className={styles.breathe} aria-hidden="true" />
      <div className={styles.wrap}>
        <header className={styles.hd}>
          <div className={styles.eye}>
            <span className={styles.eyeDot} aria-hidden="true" />
            Case Studies
          </div>
          <h2 className={styles.h}>Shortlists that became hires.</h2>
          <p className={styles.sub}>
            A few of the programmes we've helped staff across the region.
          </p>
        </header>

        <div className={styles.grid}>
          {cases.map((c) => (
            <article key={c.slug} className={styles.co}>
              <div className={styles.card}>
                <div className={styles.glow} aria-hidden="true" />
                <div className={styles.metric}>
                  <span className={styles.metricN}>{c.metric}</span>
                </div>
                <div className={styles.meta}>
                  {c.meta.map((m, i) => (
                    <span key={m}>
                      {m}
                      {i < c.meta.length - 1 && (
                        <span className={styles.metaDivider}>·</span>
                      )}
                    </span>
                  ))}
                </div>
                <div className={styles.tags}>
                  {c.tags.map((t) => (
                    <span key={t} className={styles.tag}>
                      {t}
                    </span>
                  ))}
                </div>
                <div className={styles.rule} />
                <h3 className={styles.title}>{c.title}</h3>
                <p className={styles.desc}>{c.desc}</p>
                <Link href={`/case-studies/${c.slug}`} className={styles.link}>
                  Read the story
                  <span className={styles.linkArr} aria-hidden="true">
                    →
                  </span>
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.footer}>
          <Link href="/case-studies" className={styles.cta}>
            See all case studies
            <span className={styles.ctaArr} aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
