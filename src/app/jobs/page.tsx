import type { Metadata } from "next";
import Link from "next/link";
import { CvUploadForm } from "@/components/blocks/CvUploadForm";
import styles from "@/components/blocks/editorial/EditorialLayout.module.css";
import { desks } from "@/data/home/screen";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  seo: {
    title: "Job Seekers · Yallo Talent",
    description:
      "Contract, permanent and EOR opportunities across the Middle East, Europe and India. Send your CV. We'll match you to your next enterprise programme.",
  },
  path: "/jobs",
});

export default function JobsPage() {
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
            For specialists
          </div>
          <h1 className={styles.heroTitle}>
            Enterprise programmes that{" "}
            <span className={styles.emphasis}>actually ship.</span>
          </h1>
          <p className={styles.heroLede}>
            Yallo places enterprise IT specialists onto real delivery programmes
            across UK, Middle East and India. Send your CV. We'll match you
            where your depth genuinely fits.
          </p>
          <div className={styles.heroCtas}>
            <Link href="#upload" className={styles.ctaPrimary}>
              Send your CV
              <span aria-hidden="true">→</span>
            </Link>
            <Link href="#openings" className={styles.ctaGhost}>
              Where we screen
            </Link>
          </div>
        </div>
      </section>

      {/* Why work via Yallo */}
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
                  A real screening call with a specialist, not a five-minute
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
                  The UK, UAE, Saudi Arabia and India, with visa cover and
                  payroll support if the role sits in a market you're not
                  resident in.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* SCREENING DESKS */}
      <section id="openings" className={styles.section}>
        <div className={styles.wrap}>
          <div className={styles.sectionInner}>
            <span className={styles.sectionEyebrow}>Where we screen</span>
            <h2 className={styles.sectionH}>Six specialist desks, one CV.</h2>
            <p className={styles.sectionLede}>
              We don't publish a live jobs board yet. Send your CV once and an
              specialist on the relevant desk screens it against the enterprise
              programmes we're actively staffing across the UK, Middle East and
              India.
            </p>
            <div className={styles.cardGrid3}>
              {desks.map((desk) => (
                <article key={desk} className={styles.card}>
                  <h3 className={styles.cardTitle}>{desk}</h3>
                </article>
              ))}
            </div>
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
