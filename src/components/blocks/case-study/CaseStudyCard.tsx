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
    <Link
      href={`/case-studies/${card.slug}`}
      className={styles.card}
      aria-label={`Read the case study: ${card.title}`}
    >
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
      <p className={styles.foot}>Read the case study →</p>
    </Link>
  );
}
