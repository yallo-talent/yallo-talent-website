import type { Metadata } from "next";
import Link from "next/link";
import { CvUploadForm } from "@/components/blocks/CvUploadForm";
import styles from "@/components/blocks/editorial/EditorialLayout.module.css";
import { HeroAtmosphere } from "@/components/ui/HeroAtmosphere";
import { desks } from "@/data/home/screen";
import { buildMetadata } from "@/lib/seo";

/**
 * THE CANDIDATE SURFACE THIS APPLICATION WILL EVENTUALLY SERVE, PARKED.
 *
 * It used to live at `/jobs`, and that was a collision rather than a route: the
 * Volcanic board answers `/jobs` on the live estate, so two systems claimed one
 * address and which one a person got depended on which host they arrived at.
 * Measured 14 Aug 2026, the application's own ingress served THIS page at
 * `/jobs` while `www.yallo.co/jobs` served the board, and at DNS cutover this
 * page would have become the site's `/jobs`.
 *
 * Sumeet's ruling, 14 Aug 2026: the Volcanic board keeps `/jobs` and keeps the
 * candidate relationship, including CV capture and applicant profiles, until the
 * internal board and candidate portal are built as part of the talent engine.
 * This page is that future surface, kept rather than deleted because the work in
 * it is the starting point for the internal one, and moved rather than left in
 * place because a second address for the same intent is what caused the problem.
 *
 * PARKED MEANS PARKED. `noindex, nofollow`, and absent from `publishedPaths()`,
 * so it is out of sitemap.xml, llms.txt, the OG generator and the assistant's
 * corpus, all four of which derive from that one list. Nothing links to it. The
 * print surface at /intelligence/research/corridor/print is the precedent: a
 * real route that renders and that no discovery surface names.
 *
 * The CV form below still posts. It is not wired to anything new here, and the
 * board's own capture is what candidates actually reach today.
 */
/* `robots` is spread on rather than passed in: buildMetadata takes `seo` and
   `path` only, and the print surface sets its own robots the same way. */
export const metadata: Metadata = {
  ...buildMetadata({
    seo: {
      title: "Job Seekers · Yallo Talent",
      description:
        "Contract, permanent and EOR opportunities across the Middle East, Europe and India. Send your CV. We'll match you to your next enterprise programme.",
    },
    path: "/jobs-future",
  }),
  robots: { index: false, follow: false },
};

export default function JobsPage() {
  return (
    <div className={styles.page}>
      {/* HERO */}
      <section className={styles.hero}>
        <HeroAtmosphere centred seed="jobs" />
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
            across UK, Middle East and India. Send your CV. We&apos;ll match you
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
              We don&apos;t spam-submit you to five roles.
            </h2>
            <p className={styles.sectionLede}>
              We talk to you once, work out what you actually want your next
              engagement to look like, and only submit you where we&apos;re
              confident you&apos;re the fit.
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
                  We put you forward for two roles you&apos;d actually want, not
                  twenty you don&apos;t.
                </p>
              </article>
              <article className={styles.card}>
                <h3 className={styles.cardTitle}>Regional coverage</h3>
                <p className={styles.cardCopy}>
                  The UK, UAE, Saudi Arabia and India, with visa cover and
                  payroll support if the role sits in a market you&apos;re not
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
              We don&apos;t publish a live jobs board yet. Send your CV once and
              an specialist on the relevant desk screens it against the
              enterprise programmes we&apos;re actively staffing across the UK,
              Middle East and India.
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
