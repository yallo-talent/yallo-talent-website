"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  caseStudies,
  evidenceCopy,
  testimonial,
} from "@/data/home/intelligence";
import styles from "./Home.module.css";
import { ArrowGlyph } from "./icons";
import { LogoImage } from "./LogoImage";
import { SectionHead } from "./SectionHead";

/**
 * The case-study rail. Titles and summaries are verbatim from the published
 * pages on yallo.co — nothing here is written or paraphrased.
 *
 * Cards whose body has not been ported yet render non-interactive. That is
 * deliberate: an unbuilt route must not be linked, and a plausible-looking
 * summary must never lead somewhere that invents the rest.
 */
export function Evidence() {
  const rail = useRef<HTMLElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.5, behavior: "smooth" });
  };

  return (
    <section className={`${styles.section} ${styles.g1}`} id="evidence">
      <div className={styles.wrap}>
        <SectionHead
          eyebrow={evidenceCopy.eyebrow}
          heading={evidenceCopy.heading}
          lede={evidenceCopy.lede}
          id="evidence-heading"
        />

        {/* A <section> with an accessible name is a region landmark. It carries
            tabIndex so the horizontally scrolling rail can be reached and
            scrolled by keyboard, which SC 2.1.1 requires of any scrollable
            container — the arrow buttons below are an addition to that, not a
            substitute, because they are not reachable from inside the rail. */}
        <section
          className={styles.caseRail}
          ref={rail}
          // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable container must be focusable to be keyboard scrollable; the rule does not model overflow
          tabIndex={0}
          aria-label="Published case studies"
        >
          {caseStudies.map((c) => (
            <article
              key={c.slug}
              className={`${styles.caseCard} ${c.published ? "" : styles.unbuilt}`}
            >
              <span className={styles.caseLogo} aria-hidden="true">
                {c.logo ? (
                  <LogoImage src={c.logo} width={96} height={24} />
                ) : (
                  <span className={styles.wordmark}>{c.client}</span>
                )}
              </span>
              <p className={styles.caseMeta}>{c.meta}</p>
              <h3>{c.title}</h3>
              <p className={styles.caseSummary}>{c.summary}</p>
              <p className={styles.caseFoot}>
                {c.published ? (
                  <Link className={styles.btnSecondary} href={c.slug}>
                    Read the case study
                    <ArrowGlyph />
                  </Link>
                ) : (
                  <span className={styles.unbuiltFlag}>Being published</span>
                )}
              </p>
            </article>
          ))}
        </section>

        <div className={styles.railNav}>
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Scroll case studies left"
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Scroll case studies right"
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>

        <Testimonial />
      </div>
    </section>
  );
}

/**
 * Renders nothing until a real, permissioned testimonial exists.
 *
 * No placeholder, no lorem, no invented sentence. Fill all four fields in
 * src/data/home/intelligence.ts together and this appears.
 */
function Testimonial() {
  const { quote, name, title, company } = testimonial;
  if (!quote || !name || !title || !company) return null;

  return (
    <figure className={styles.personaPanel}>
      <span className={styles.panelPetal} aria-hidden="true" />
      <blockquote>{quote}</blockquote>
      <figcaption>
        {name} · {title} · {company}
      </figcaption>
    </figure>
  );
}
