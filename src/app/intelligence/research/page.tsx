import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/components/blocks/home/Home.module.css";
import { ArrowGlyph } from "@/components/blocks/home/icons";
import { SectionHead } from "@/components/blocks/home/SectionHead";
import research from "@/components/blocks/research/Research.module.css";
import { RESEARCH_BASE, researchHref, researchPieces } from "@/data/research";
import { LTI_AS_AT_MONTH } from "@/data/research/dataset";
import {
  SYNTHESIS_SLUG,
  synthesisStandfirst,
  synthesisTitle,
} from "@/data/research/synthesis";
import { buildMetadata } from "@/lib/seo";

/**
 * /intelligence/research — the index for the five published pieces and the
 * gated synthesis.
 *
 * The coverage note is not small print and it is not optional. The extract
 * measures five families; the site has desks for more than five. An index
 * that listed five pieces without saying which desks are absent would imply
 * coverage that does not exist, which round 14's brief §2.7 rules out
 * explicitly.
 */

export const metadata: Metadata = buildMetadata({
  seo: {
    title: "Talent research | Yallo Talent",
    description:
      "Measured analysis of enterprise platform talent across the UK, Saudi Arabia and the UAE: SAP, Oracle, Salesforce, cloud and DevOps, AI and data.",
  },
  path: RESEARCH_BASE,
});

export default function ResearchIndexPage() {
  return (
    <>
      <section className={`${styles.section} ${styles.g1}`}>
        <div className={styles.wrap}>
          <p className="eyebrow">Intelligence</p>
          <h1 className={styles.heroHeadline}>Talent research.</h1>
          <p className={styles.heroLede}>
            What the enterprise platform talent pools across the UK, Saudi
            Arabia and the UAE actually look like, and what each one means for
            staffing a programme.
          </p>
          <p className={research.asAt}>{LTI_AS_AT_MONTH}</p>
        </div>
      </section>

      <section className={`${styles.section} ${styles.g2}`} id="pieces">
        <div className={styles.wrap}>
          <SectionHead
            eyebrow="Published"
            heading="Five families, three markets."
            lede="Each piece states a conclusion about staffing rather than reproducing a table. The figures are there to support the argument, not to be the argument."
            id="pieces-heading"
          />
          <div className={styles.commitment}>
            {researchPieces.map((piece, i) => (
              <article
                key={piece.slug}
                className={`${styles.vow} amb-${(i % 6) + 1}`}
              >
                <span className={styles.panelPetal} aria-hidden="true" />
                <h3>
                  <Link href={researchHref(piece.slug)}>{piece.cardTitle}</Link>
                </h3>
                <p className={styles.vowScope}>{piece.standfirst}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.g2}`} id="synthesis">
        <div className={styles.wrap}>
          <SectionHead
            eyebrow="The synthesis"
            heading="The corridor runs both ways."
            lede={synthesisStandfirst}
            id="synthesis-heading"
          />
          <p className={research.coverage}>
            <Link
              className={research.nextLink}
              href={`${RESEARCH_BASE}/${SYNTHESIS_SLUG}`}
            >
              Read the cross-market synthesis
              <ArrowGlyph />
            </Link>
            {" · "}
            {synthesisTitle}.
          </p>
        </div>
      </section>
    </>
  );
}
