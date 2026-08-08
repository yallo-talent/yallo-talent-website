/**
 * The title of a row in a cockpit list, as a heading rather than a bold `<p>`.
 *
 * WHY THIS EXISTS. Every pane renders a list whose rows have one primary label.
 * All four wrote it as `<p className={styles.rowTitle}>`, styled bold and a size
 * up, which is what axe's `p-as-heading` rule matches: it is a heading to
 * everyone who can see it and not a heading to anyone navigating by headings.
 * check:admin-render caught it on /admin/conversations in all four theme and
 * width combinations, and the same markup was in briefs and in both case-study
 * lists — one instance reported, four in the tree.
 *
 * WHY A COMPONENT AND NOT FOUR EDITED TAGS. The level is not the same in every
 * pane: briefs and conversations put rows directly under the pane's `<h1>`, so
 * their rows are `<h2>`; case studies has `<h2>Publishes</h2>` and
 * `<h2>Studies</h2>` above its two lists, so those rows are `<h3>`. A rule that
 * has to be re-derived per pane is a rule the next pane gets wrong, and this
 * round adds two more panes. Naming the thing makes the level a required
 * argument rather than something to remember.
 */
export function RowTitle({
  level,
  className,
  children,
}: {
  /** 2 directly under the pane's h1, 3 under a section h2. */
  level: 2 | 3;
  className?: string;
  children: React.ReactNode;
}) {
  const Tag = level === 2 ? "h2" : "h3";
  return <Tag className={className}>{children}</Tag>;
}
