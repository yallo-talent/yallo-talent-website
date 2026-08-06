import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/components/blocks/editorial/EditorialLayout.module.css";
import {
  ENTITY_CITIES_COMMA,
  ENTITY_COUNT,
  ENTITY_LABEL,
} from "@/lib/entities";
import { buildMetadata } from "@/lib/seo";
import cmp from "./comparison.module.css";

export const metadata: Metadata = buildMetadata({
  seo: {
    title: "Why Yallo Talent · Specialist-led, not agency-volume",
    description:
      "Four reasons enterprise leaders choose Yallo over traditional recruitment: specialist-led screening, 72-hour SLA, region-deep, 2:1 CV-to-interview ratio.",
  },
  path: "/why-yallo",
});

const differentiators = [
  {
    stat: "72h",
    title: "Brief to shortlist: always",
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
    /* Round 18 §2.3. This rendered a literal "3" under a label reading "Four
       entities" that then listed four cities — the leftover of the retired "3
       delivery regions" stat. Both the numeral and the label derive from
       src/lib/entities.ts now, so they cannot disagree again. */
    stat: String(ENTITY_COUNT),
    title: `${ENTITY_LABEL}: ${ENTITY_CITIES_COMMA}`,
    copy: "Not a global brand pretending to know these markets. Region-deep benches, local visa and compliance knowledge, active in the sectors that are hiring.",
  },
];

/**
 * The three-column comparison, rebuilt per round 18 §2.5 (game plan §7 ratified
 * the rebuild; this supersedes the round 10 §11.3 copy freeze on this table).
 *
 * WHY THREE COLUMNS. The two-column version lost the actual position, which is
 * that Yallo sits BETWEEN volume recruitment and the consultancies. A table with
 * one "them" column can only say "not that", and the interesting claim is "not
 * either of those, and here is the axis".
 *
 * THE COMPETITOR COLUMNS ARE CATEGORIES, NOT NAMES. Sumeet named Tata, Infosys
 * and Capgemini when describing the table he wants. Whether a competitor is named
 * on the site is a publishing decision, which R-A9 makes his rather than mine, so
 * this ships the category and the relay asks him to overrule it if he wants the
 * names.
 *
 * EVERY CELL IN THE YALLO COLUMN RESTATES A CLAIM PUBLISHED ELSEWHERE, and the
 * source is named per row below. §2.5's hard constraint, and the reason for it is
 * that a comparison table is exactly where an unevidenced claim gets in: it reads
 * as a summary of things already established, so nobody checks it. A row with no
 * published claim behind it gets cut rather than written.
 *
 * Five rows from the legacy fifteen do not come across, and §2.5 records why so it
 * is not re-litigated: Strategic Tech Advisory and Innovation + Co-Design are the
 * consulting proposition R1 strips from this site; Real-time Performance
 * Monitoring and Industry-Specific Playbooks assert capabilities nothing else here
 * supports; Cost vs Value Efficiency invites the rate comparison game plan §3 says
 * never to compete on; Embedded Knowledge Sharing carries no claim. The legacy
 * subtitle "Seamless, Scalable Solutions" is banned vocabulary twice over.
 */
const comparison = [
  {
    axis: "How candidates are screened",
    volume: "Keyword-matched against the job description, at volume.",
    consultancy:
      "Assigned from whoever is free on the bench, then trained into the role.",
    /* Published: /about and /leadership, "screened against a written standard by
       a specialist who has run the same programme". */
    yallo:
      "Screened against a written standard by a specialist who has run the role.",
  },
  {
    axis: "Brief to shortlist",
    volume: "The first CVs arrive before the brief is understood.",
    consultancy:
      "Weeks, because the resourcing and the commercial are one conversation.",
    /* Published: content/metrics.yaml, "Brief to shortlist / 72h / Three screened
       candidates from a complete brief", and /contract's own FAQ. */
    yallo: "Three screened candidates, 72 hours from a complete brief.",
  },
  {
    axis: "Platform depth at module level",
    volume: "The platform is named on the CV, never tested.",
    consultancy:
      "Depth sits in the practice, and you take the person it assigns.",
    /* Published: every /platforms/[platform]/[module] page lists the roles it
       staffs for that module. */
    yallo:
      "Roles published per module, so the depth is visible before you brief us.",
  },
  {
    axis: "Who owns the shortlist",
    volume: "A different consultant each time you call.",
    consultancy:
      "An engagement manager between you and the people doing the work.",
    /* Published: src/data/home/screen.ts, "One account manager in front of them,
       as your single point of contact", over the six specialist desks. */
    yallo:
      "One account manager as your single point of contact, in front of six specialist desks.",
  },
  {
    axis: "Engagement models",
    volume: "Contingent placement, and that is the only shape on offer.",
    consultancy: "A statement of work, priced and scoped as a project.",
    /* Published: the four pillars, on the homepage commitment band and each of
       the four service pages. */
    yallo: "Contract, Permanent, Employer of Record or Managed Delivery.",
  },
  {
    axis: "Commercial transparency",
    volume: "The margin sits between the candidate's rate and your invoice.",
    consultancy: "A blended day rate, with the mix inside it.",
    /* Published: /contract's FAQ, "transparent day rate on your invoice, with our
       margin disclosed up-front", and commitment.ts's "Published rate card". */
    yallo:
      "Day rate on your invoice, margin disclosed up front, against a published rate card.",
  },
  {
    axis: "When a placement does not work",
    volume: "A fresh fee and a fresh search.",
    consultancy:
      "A replacement from the bench, under the same statement of work.",
    /* Published: /contract's FAQ, a replacement search on the same standard, and
       commitment.ts's "Replacement on quality". */
    yallo: "A replacement search on the same 72-hour standard.",
  },
  {
    axis: "Scaling a team mid-programme",
    volume: "A new requisition and a new search each time.",
    consultancy: "A change request, scoped and priced again.",
    /* Published: commitment.ts, "Ramp up and ramp down", inside the contract
       workforce terms. */
    yallo: "Ramp up and ramp down inside the same agreement.",
  },
  {
    axis: "Accountability after placement",
    volume: "The relationship ends at the invoice.",
    consultancy: "Accountability sits with the programme, not with the hire.",
    /* Published: commitment.ts, "You pay when someone starts, and only if they
       stay", with the 100-day warranty on permanent. */
    yallo:
      "Permanent carries a 100-day warranty: you pay on start, and only if they stay.",
  },
];

export default function WhyYalloPage() {
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
            {/* No "Yallo" — .eyebrow renders uppercase (canon §2). Reused from
                this page's own metadata tagline rather than inventing new
                copy. */}
            Specialist-led, not agency-volume
          </div>
          <h1 className={styles.heroTitle}>
            The hiring partner your{" "}
            <span className={styles.emphasis}>delivery team wanted.</span>
          </h1>
          <p className={styles.heroLede}>
            Not another recruitment agency. Every shortlist is calibrated by
            someone who has run these programmes, then screened against a
            standard your hiring manager can read.
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
              This is our operating rhythm, not marketing. If we don't hit
              these, the model isn't working.
            </p>
            <div className={styles.cardGrid2}>
              {differentiators.map((d) => (
                <article key={d.title} className={styles.card}>
                  <div
                    style={{
                      fontSize: "var(--fs-numeral)",
                      fontWeight: 900,
                      letterSpacing: "-0.03em",
                      color: "var(--accent-label)",
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
            {/* No "Yallo" — .sectionEyebrow renders uppercase (canon §2). */}
            <span className={styles.sectionEyebrow}>Where we sit</span>
            <h2 className={styles.sectionH}>Different by design.</h2>
            <p className={styles.sectionLede}>
              Volume recruitment optimises for candidate throughput and the
              consultancies optimise for the statement of work. We optimise for
              the hire actually shipping your programme.
            </p>
            {/* A scrollable container must be focusable to be keyboard
                scrollable, which SC 2.1.1 requires. */}
            <section
              className={cmp.wrap}
              // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable container must be focusable to be keyboard scrollable; the rule does not model overflow
              tabIndex={0}
              aria-label="Scrollable comparison table"
            >
              <table className={cmp.table}>
                <caption className={cmp.srOnly}>
                  How volume recruiters, consultancies and integrators, and
                  Yallo Talent differ across nine aspects of staffing an
                  enterprise platform programme.
                </caption>
                <thead>
                  <tr>
                    {/* The corner cell of a matrix names the row axis for a screen
                        reader rather than sitting empty. */}
                    <th scope="col" className={cmp.theadAxis}>
                      <span className={cmp.srOnly}>What is being compared</span>
                    </th>
                    <th scope="col" className={cmp.theadThem}>
                      Volume recruiters
                    </th>
                    <th scope="col" className={cmp.theadThem}>
                      Consultancies and integrators
                    </th>
                    {/* No "Yallo" in uppercase — .theadUs renders uppercase
                        (canon §2), and the brand is capital-Y only. */}
                    <th scope="col" className={cmp.theadUs}>
                      Specialist-led delivery
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row) => (
                    <tr key={row.axis}>
                      <th scope="row" className={cmp.cellAxis}>
                        {row.axis}
                      </th>
                      <td className={cmp.cellThem}>{row.volume}</td>
                      <td className={cmp.cellThem}>{row.consultancy}</td>
                      <td className={cmp.cellUs}>{row.yallo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
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
