import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/components/blocks/home/Home.module.css";
import { SectionHead } from "@/components/blocks/home/SectionHead";
import research from "@/components/blocks/research/Research.module.css";
import { ResearchGate } from "@/components/blocks/research/ResearchGate";
import { RESEARCH_BASE, researchHref, researchPieces } from "@/data/research";
import { LTI_AS_AT_DISPLAY, LTI_SOURCE } from "@/data/research/dataset";
import {
  SYNTHESIS_CAPTURE_SOURCE,
  SYNTHESIS_SLUG,
  synthesisStandfirst,
  synthesisSummary,
  synthesisTitle,
} from "@/data/research/synthesis";
import { buildMetadata } from "@/lib/seo";

/**
 * The cross-market synthesis: ungated argument, gated detail.
 *
 * WHY THE ARGUMENT IS OPEN. Per the discoverability brief §4.3, a fully gated
 * asset cannot be cited at all, and a citation carrying no numbers still
 * names Yallo. So the whole conclusion publishes here — not a teaser for it —
 * and the gate holds the assembled per-family detail, which is the part worth
 * an email address because it is the only place the whole picture is in one
 * document.
 *
 * This route is a static sibling of [slug] rather than one of its params, and
 * `SYNTHESIS_SLUG` is deliberately not in `researchSlugs`. A static segment
 * wins over a dynamic one in the App Router, so a collision would resolve
 * silently in this file's favour and the piece would simply vanish; keeping
 * the slug out of the piece list means there is nothing to collide.
 */

export const metadata: Metadata = buildMetadata({
  seo: {
    title: "The corridor runs both ways | Yallo Talent",
    description:
      "Enterprise platform talent across the UK, Saudi Arabia and the UAE: the two ends of the corridor specialise in opposite directions, and what that means for staffing a programme.",
  },
  path: `${RESEARCH_BASE}/${SYNTHESIS_SLUG}`,
});

export default function SynthesisPage() {
  return (
    <>
      <section className={`${styles.section} ${styles.g1}`}>
        <div className={styles.wrap}>
          <p className="eyebrow">
            <Link href={RESEARCH_BASE}>Talent research</Link>
          </p>
          <h1 className={styles.heroHeadline}>{synthesisTitle}</h1>
          <p className={research.standfirst}>{synthesisStandfirst}</p>
          <p className={research.asAt}>
            {LTI_SOURCE} · measured as at {LTI_AS_AT_DISPLAY}
          </p>
        </div>
      </section>

      <section className={`${styles.section} ${styles.g2}`} id="argument">
        <div className={styles.wrap}>
          <SectionHead
            eyebrow="The argument"
            heading="Neither end of the corridor is simply the shallow end."
            lede="This is the whole conclusion, not a summary of one. Quote it, check it, disagree with it."
            id="argument-heading"
          />
          <div className={research.body}>
            {synthesisSummary.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.g2}`} id="pieces">
        <div className={styles.wrap}>
          <SectionHead
            eyebrow="The five reads"
            heading="Each family, on its own terms."
            lede="The synthesis is assembled from these. Each publishes in full, openly."
            id="pieces-heading"
          />
          <ul className={styles.roleChips}>
            {researchPieces.map((piece) => (
              <li key={piece.slug} className="role-pill">
                <Link href={researchHref(piece.slug)}>{piece.cardTitle}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`${styles.section} ${styles.g2}`} id="download">
        <div className={styles.wrap}>
          <SectionHead
            eyebrow="The document"
            heading="All five families and all three markets, in one file."
            lede="The assembled analysis, generated from this site's own figures so the document and the pages cannot disagree."
            id="download-heading"
          />
          <ResearchGate asset={SYNTHESIS_CAPTURE_SOURCE} />
          <p className={research.gateNote}>
            If you have a live requirement rather than a reading interest,{" "}
            <Link href="/brief">start a brief</Link> instead. It reaches the
            same people faster.
          </p>
        </div>
      </section>
    </>
  );
}
