"use client";

import Link from "next/link";
import { useRef } from "react";
import styles from "./Home.module.css";
import { ArrowGlyph } from "./icons";
import { LogoImage } from "./LogoImage";

export interface CaseCard {
  slug: string;
  title: string;
  summary: string;
  client: string;
  logo?: string;
  meta: string;
}

export interface Testimonial {
  quote: string | null;
  name: string | null;
  title: string | null;
  company: string | null;
}

/**
 * The horizontally scrolling rail. Client component only because of the scroll
 * buttons — the cards themselves are rendered from server data.
 */
export function CaseRail({
  studies,
  testimonial,
}: {
  studies: CaseCard[];
  testimonial: Testimonial;
}) {
  const rail = useRef<HTMLElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.5, behavior: "smooth" });
  };

  return (
    <>
      {/* A <section> with an accessible name is a region landmark. It carries
          tabIndex so the rail can be reached and scrolled by keyboard, which
          SC 2.1.1 requires of any scrollable container — the arrow buttons are
          an addition to that, not a substitute, because they are not reachable
          from inside the rail. */}
      <section
        className={styles.caseRail}
        ref={rail}
        // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable container must be focusable to be keyboard scrollable; the rule does not model overflow
        tabIndex={0}
        aria-label="Published case studies"
      >
        {studies.map((c) => (
          <article key={c.slug} className={styles.caseCard}>
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
              <Link className={styles.btnSecondary} href={c.slug}>
                Read the case study
                <ArrowGlyph />
              </Link>
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

      <Quote testimonial={testimonial} />
    </>
  );
}

/**
 * Renders nothing until a real, permissioned testimonial exists. No placeholder,
 * no lorem, no invented sentence.
 */
function Quote({ testimonial }: { testimonial: Testimonial }) {
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
