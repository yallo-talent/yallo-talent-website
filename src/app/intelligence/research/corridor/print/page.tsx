import type { Metadata } from "next";
import {
  LTI_AS_AT_DISPLAY,
  LTI_AS_AT_MONTH,
  LTI_SOURCE,
} from "@/data/research/dataset";
import {
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
 * context-round16-scope.md §2.3 forbids a hand-made PDF because it would be
 * a second copy of every figure; this page renders the same
 * `src/data/research` modules the public pages render, and
 * `scripts/build-research-pdf.mjs` prints it. Change a number in the extract
 * and the pages and the document move together, because there is only one
 * number.
 *
 * NOT PUBLIC. `noindex, nofollow` here; excluded from `publishedPaths()`, so
 * it is absent from sitemap.xml, llms.txt, the OG generator and the
 * assistant's corpus, all four of which derive from that one list. It is a
 * build input, not a page anyone should arrive at.
 */

export const metadata: Metadata = {
  title: `${synthesisTitle} | Yallo Talent`,
  robots: { index: false, follow: false },
};

export default function SynthesisPrintPage() {
  return (
    <main className={styles.sheet}>
      <header className={styles.cover}>
        <p className={styles.brand}>Yallo Talent</p>
        <h1 className={styles.title}>{synthesisTitle}</h1>
        <p className={styles.standfirst}>{synthesisStandfirst}</p>
        <p className={styles.meta}>
          Source: {LTI_SOURCE} · {LTI_AS_AT_MONTH}
        </p>
      </header>

      <section className={styles.block}>
        <h2 className={styles.h2}>The argument</h2>
        {synthesisSummary.map((p) => (
          <p key={p} className={styles.p}>
            {p}
          </p>
        ))}
      </section>

      {synthesisChapters.map((chapter) => (
        <section key={chapter.heading} className={styles.block}>
          <h2 className={styles.h2}>{chapter.heading}</h2>
          {chapter.paragraphs.map((p) => (
            <p key={p} className={styles.p}>
              {p}
            </p>
          ))}
        </section>
      ))}

      <footer className={styles.foot}>
        <p className={styles.meta}>
          Yallo Talent · yallo.co · Figures from a {LTI_SOURCE} extract read on{" "}
          {LTI_AS_AT_DISPLAY}. Skills are self-declared. Counts within a family
          overlap and are not parts of a whole. This is supply-side data and
          supports no claim about how long a role takes to fill.
        </p>
      </footer>
    </main>
  );
}
