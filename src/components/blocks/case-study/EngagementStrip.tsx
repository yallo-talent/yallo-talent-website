import type { CaseStudyFrontmatter } from "@/lib/content-schema";
import styles from "./CaseStudyDetail.module.css";

/**
 * Block 2. What Yallo placed, mono and tabular.
 *
 * The ruling's list is roles, count, platform, duration, region — but no
 * case study frontmatter carries a role count or an engagement duration; the
 * schema has no field for either. Rather than infer a headcount or a length
 * of months out of prose (which is not sourcing, it is estimating), this
 * renders only the three facts the schema actually carries: platform,
 * region, pillar. Logged in the round's relay as a schema gap for whoever
 * adds structured roles/count/duration fields to the case study frontmatter.
 * Renders nothing if none of the three exist, though in practice all three
 * are required fields and always do.
 */
export function EngagementStrip({
  frontmatter,
}: {
  frontmatter: CaseStudyFrontmatter;
}) {
  const items = [
    { label: "Platform", value: frontmatter.platform },
    { label: "Region", value: frontmatter.region },
    { label: "Engagement", value: frontmatter.engagement },
  ].filter((i): i is { label: string; value: string } => Boolean(i.value));

  if (items.length === 0) return null;

  return (
    <section className={styles.engagement}>
      <div className={styles.wrap}>
        <div className={styles.engagementRow}>
          {items.map((i) => (
            <div key={i.label} className={styles.engagementItem}>
              <span className={styles.engagementLabel}>{i.label}</span>
              <span className={styles.engagementValue}>{i.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
