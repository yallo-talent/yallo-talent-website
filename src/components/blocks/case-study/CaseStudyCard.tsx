import Link from "next/link";
import { LogoImage } from "@/components/blocks/home/LogoImage";
import styles from "./CaseStudyCard.module.css";

export interface CaseStudyCardData {
  slug: string;
  title: string;
  summary: string;
  clientLabel: string;
  clientLogo?: string;
  meta: string;
}

/** The card the landing grid uses, matching the homepage rail's visual system. */
export function CaseStudyCard({ card }: { card: CaseStudyCardData }) {
  return (
    <Link
      href={`/case-studies/${card.slug}`}
      className={styles.card}
      aria-label={`Read the case study: ${card.title}`}
    >
      <span className={styles.logo} aria-hidden="true">
        {card.clientLogo ? (
          <LogoImage src={card.clientLogo} width={96} height={22} />
        ) : (
          <span className={styles.wordmark}>{card.clientLabel}</span>
        )}
      </span>
      <p className={styles.meta}>{card.meta}</p>
      <h3 className={styles.title}>{card.title}</h3>
      <p className={styles.summary}>{card.summary}</p>
      <p className={styles.foot}>Read the case study →</p>
    </Link>
  );
}
