import styles from "@/components/blocks/research/Research.module.css";

/**
 * The intelligence and research surfaces, given one place to carry their link
 * treatment — round 21 §2.4.
 *
 * WHY A LAYOUT AND NOT A CLASS ON EACH LINK. Sumeet reported two controls that
 * rendered as body text: the post-gate download link and the "Get the
 * synthesis" submit. Both were fixed at their site. The rendered gate then
 * found seven more on the same surfaces — `<Link href={RESEARCH_BASE}>Talent
 * research</Link>`, the five desk links, the "start a brief" link inside a
 * sentence — every one of them an anchor with no class at all, painting in its
 * parent's colour with no underline. Fixing those nine individually leaves the
 * tenth to be written next week, which is how this class reached its third
 * occurrence (assistant links, then these).
 *
 * So the rule is scoped here and keyed on the absence of a class:
 * `a:not([class])` is exactly "a link nobody styled", and it now cannot render
 * as prose. Adding a link to any of these pages gets the treatment without
 * anyone remembering to ask for it.
 *
 * The wrapper is a plain block element around full-bleed sections, so it
 * changes no layout: the bands still span the viewport and `.wrap` still sets
 * the measure inside them.
 */
export default function IntelligenceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={styles.surface}>{children}</div>;
}
