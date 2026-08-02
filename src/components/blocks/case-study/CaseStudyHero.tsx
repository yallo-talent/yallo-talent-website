import { PetalPlate } from "@/components/ui/PetalPlate";
import type { CaseStudyFrontmatter } from "@/lib/content-schema";
import styles from "./CaseStudyDetail.module.css";
import {
  pillarChip,
  platformChip,
  regionChip,
  sectorChip,
  type TaxonomyChip,
} from "./taxonomy";

function Chip({ chip }: { chip: TaxonomyChip }) {
  if (chip.href) {
    return (
      <a href={chip.href} className={styles.chip}>
        {chip.label}
      </a>
    );
  }
  return <span className={styles.chip}>{chip.label}</span>;
}

/** Block 1. Light ground, left-aligned, descriptive H1, no photograph. */
export function CaseStudyHero({
  frontmatter,
  clientLabel,
}: {
  frontmatter: CaseStudyFrontmatter;
  clientLabel: string;
}) {
  const chips = [
    pillarChip(frontmatter.engagement),
    platformChip(frontmatter.platform),
    sectorChip(frontmatter.industry),
    regionChip(frontmatter.region),
  ].filter((c): c is TaxonomyChip => Boolean(c));

  return (
    <section className={styles.hero}>
      <PetalPlate
        seed={frontmatter.slug}
        className={styles.heroGround}
        ratio={0.5}
      />
      <div className={styles.heroInner}>
        <span className={styles.eyebrow}>Case study · {clientLabel}</span>
        <h1 className={styles.h1}>{frontmatter.title}</h1>
        <p className={styles.standfirst}>{frontmatter.summary}</p>
        {chips.length > 0 && (
          <div className={styles.chips}>
            {chips.map((c) => (
              <Chip key={c.label} chip={c} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
