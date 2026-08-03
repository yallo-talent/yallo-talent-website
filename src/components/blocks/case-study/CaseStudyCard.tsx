import Link from "next/link";
import { ClientMark } from "@/components/blocks/ClientMark";
import styles from "./CaseStudyCard.module.css";

export interface CaseStudyCardData {
  slug: string;
  title: string;
  summary: string;
  clientLabel: string;
  clientLogo?: string;
  meta: string;
}

/**
 * The card the landing grid uses, matching the homepage rail's visual system.
 *
 * `set` is every mark on the grid, not this card's own: ink-area normalisation
 * is a property of a set, so a mark has no correct size until the median is
 * known. It is deliberately the UNFILTERED set: sizing a mark against whichever
 * cards happen to be visible would resize every mark on the page each time a
 * facet is toggled.
 */
export function CaseStudyCard({
  card,
  set,
}: {
  card: CaseStudyCardData;
  set: readonly string[];
}) {
  return (
    <article className={styles.card}>
      <ClientMark
        src={card.clientLogo}
        name={card.clientLabel}
        surface="card"
        set={set}
        decorative
        className={styles.logo}
      />
      <p className={styles.meta}>{card.meta}</p>
      <h3 className={styles.title}>{card.title}</h3>
      <p className={styles.summary}>{card.summary}</p>
      {/* Same treatment as the homepage rail's card (Home.module.css
          .caseFoot .btnSecondary::after): the whole card is one destination,
          so a stretched pseudo-element keeps exactly one anchor rather than
          wrapping the card's own meta/title/summary text in a link whose
          aria-label omitted all of it — WCAG 2.5.3 Label in Name, found by
          the axe experimental-rules pass, round12-scope.md §4.1. */}
      <p className={styles.foot}>
        <Link
          href={`/case-studies/${card.slug}`}
          className={styles.footLink}
          aria-label={`Read the case study: ${card.title}`}
        >
          Read the case study <span aria-hidden="true">→</span>
        </Link>
      </p>
    </article>
  );
}
