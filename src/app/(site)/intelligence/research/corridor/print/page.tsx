import type { Metadata } from "next";
import { YalloFlower } from "@/components/layout/YalloFlower";
import { PrintChart } from "@/components/research/PrintChart";
import { PetalPlate } from "@/components/ui/PetalPlate";
import {
  LTI_AS_AT_DISPLAY,
  LTI_SOURCE,
  ltiFamilies,
} from "@/data/research/dataset";
import {
  SYNTHESIS_SLUG,
  synthesisChapters,
  synthesisStandfirst,
  synthesisSummary,
  synthesisTitle,
} from "@/data/research/synthesis";
import styles from "./Print.module.css";

/**
 * The print surface the gated PDF is generated FROM.
 *
 * This exists so the PDF has a source rather than an author.
 * context-round16-scope.md §2.3 forbids a hand-made PDF because it would be a
 * second copy of every figure; this page renders the same `src/data/research`
 * modules the public pages render, and `scripts/build-research-pdf.mjs` prints
 * it. Change a number in the extract and the pages and the document move
 * together, because there is only one number.
 *
 * ROUND 21 §2 REBUILT IT AS A DOCUMENT. What shipped before was a print of the
 * web page, and the rendered pages showed exactly that: the site's navigation
 * bar and its "Start a brief" button on the cover, the assistant launcher
 * floating over it, and the last two pages given over to the site footer's link
 * columns. Every figure was a percentage written out in prose. The three
 * existing checks on the artefact — byte length, text fingerprint, heading
 * count — were all green on it, which is why §2.3 requires the output be read
 * as images.
 *
 * NOT PUBLIC. `noindex, nofollow` here; excluded from `publishedPaths()`, so it
 * is absent from sitemap.xml, llms.txt, the OG generator and the assistant's
 * corpus, all four of which derive from that one list. It is a build input, not
 * a page anyone should arrive at.
 */

export const metadata: Metadata = {
  title: `${synthesisTitle} | Yallo Talent`,
  robots: { index: false, follow: false },
};

/**
 * The site chrome, removed STRUCTURALLY rather than by naming each piece.
 *
 * The document is a route, so it renders inside the root layout with the nav,
 * the skip link, the assistant launcher, the sticky brief CTA and the footer
 * around it. Listing those five selectors would hide today's chrome and miss
 * whatever is added to the layout next — which is how all three got into the
 * shipped PDF in the first place.
 *
 * `body > *:not(main)` inverts it: the document is what is inside <main>, and
 * everything else in the body is chrome by definition. A new layout component
 * is hidden the day it is added, without anyone remembering this file.
 *
 * Server-rendered in the page rather than set by an effect, so it is in the
 * first HTML the printer sees and does not depend on hydration having run.
 */
const CHROME_RESET = `
  body > *:not(main) { display: none !important; }
  body { background: var(--document-paper) !important; }
  main { padding: 0 !important; }
`;

/**
 * Which family's figure belongs under which chapter.
 *
 * Keyed by the family name as the dataset spells it, matched against the
 * chapter heading. A chapter with no family named in its heading gets no
 * figure, which is the correct outcome for the argument and the asymmetry
 * chapters — both talk across families, and a chart spanning two families is
 * exactly what the corpus rules forbid.
 */
function familyFor(heading: string) {
  return ltiFamilies.find((f) => {
    const name = f.family.split(" (")[0];
    return heading.toLowerCase().includes(name.toLowerCase());
  });
}

/**
 * The caveat chapters, removed FROM THE PDF ONLY.
 *
 * context-round21-scope.md §2.2, Sumeet's ruling of 7 August: "What this does
 * not tell you" and the block-capital declaration come out of the document and
 * are replaced by the quiet colophon on the closing page. §7 of the same
 * document forbids touching the web page, where both sections stay.
 */
const REMOVED_FROM_PDF = new Set(["What this does not tell you"]);

export default function SynthesisPrintPage() {
  const chapters = synthesisChapters.filter(
    (c) => !REMOVED_FROM_PDF.has(c.heading),
  );

  return (
    <>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static string defined above in this file, no interpolation */}
      <style dangerouslySetInnerHTML={{ __html: CHROME_RESET }} />

      <article className={styles.doc}>
        {/* ---------------------------------------------------------------
            COVER. No body text, per §2.1 — a title page carries the title,
            the source line and the mark, and nothing a reader has to read.
            --------------------------------------------------------------- */}
        <section className={styles.cover}>
          <div className={styles.coverArt} aria-hidden="true">
            <PetalPlate seed={SYNTHESIS_SLUG} ratio={0.62} />
          </div>

          <div className={styles.coverBody}>
            <p className={styles.coverBrand}>
              <YalloFlower size={26} className={styles.coverMark} />
              Yallo Talent
            </p>
            <h1 className={styles.coverTitle}>{synthesisTitle}</h1>
            <p className={styles.coverStandfirst}>{synthesisStandfirst}</p>
          </div>

          <div className={styles.coverFoot}>
            <p className={styles.coverSource}>
              Source: {LTI_SOURCE} · read {LTI_AS_AT_DISPLAY}
            </p>
            <p className={styles.coverDomain}>yallo.co</p>
          </div>
        </section>

        {/* ---------------------------------------------------------------
            THE DOCUMENT.
            --------------------------------------------------------------- */}
        <section className={styles.opening}>
          <h2 className={styles.h2}>The argument</h2>
          {synthesisSummary.map((p) => (
            <p key={p} className={styles.p}>
              {p}
            </p>
          ))}
        </section>

        {chapters.map((chapter) => {
          const family = familyFor(chapter.heading);
          return (
            <section key={chapter.heading} className={styles.chapter}>
              <h2 className={styles.h2}>{chapter.heading}</h2>
              {chapter.paragraphs.map((p) => (
                <p key={p} className={styles.p}>
                  {p}
                </p>
              ))}
              {family ? <PrintChart family={family} /> : null}
            </section>
          );
        })}

        {/* ---------------------------------------------------------------
            CLOSING PAGE. Brief CTA, the footprint, and the colophon —
            §2.2's replacement for the caveat block, verbatim.
            --------------------------------------------------------------- */}
        <section className={styles.closing}>
          {/* The mark, not a second plate. A PetalPlate cropped to a 96px
              square reads as a stray fragment of artwork rather than as a
              sign-off, which is what the rendered closing page showed. */}
          <YalloFlower size={40} className={styles.closingMark} />

          <h2 className={styles.closingTitle}>
            Staffing a programme against this map
          </h2>
          <p className={styles.closingLede}>
            The roles that will have to come from outside are knowable at
            business case. Tell us about the programme and we will tell you
            which of its workstreams the market cannot supply locally.
          </p>
          <p className={styles.closingCta}>yallo.co/brief</p>

          <p className={styles.footprint}>
            London · Dubai · Riyadh · Bengaluru
          </p>

          <p className={styles.colophon}>
            <strong className={styles.colophonLead}>
              About this measurement.
            </strong>{" "}
            Figures are drawn from a LinkedIn Talent Insights extract read on 2
            August 2026 and describe the supply side of three markets at that
            date. Skills are self-declared and counts within a family overlap.
            Read alongside a firm&rsquo;s own placement data — ours informs the
            desks behind this document.
          </p>
        </section>
      </article>
    </>
  );
}
