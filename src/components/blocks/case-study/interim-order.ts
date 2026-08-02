import type { LoadedEntry } from "@/lib/content";
import type { CaseStudyFrontmatter } from "@/lib/content-schema";

/**
 * INTERIM. `src/lib/case-study-order.ts` is A's file per
 * context-round7-rulings.md §1.2 — `orderedCaseStudies(all)` and
 * `HOMEPAGE_CASE_STUDY_COUNT`, reading `content/case-studies/order.yaml` —
 * and this session imports it, never writes it. Neither exists yet in this
 * worktree because A's branch merges separately.
 *
 * This is a deliberately narrower stand-in under a different name, so it
 * cannot collide with A's file at merge: it sorts by the existing `featured`
 * field (ascending) with unfeatured entries falling back to date order,
 * which is the same shape the round's rulings describe for the real library.
 * Swap the one import in the two files that use this for
 * `orderedCaseStudies` the moment A's branch lands — logged in the round's
 * relay so it is not forgotten.
 */
export function interimOrderedCaseStudies<
  T extends LoadedEntry<CaseStudyFrontmatter>,
>(all: readonly T[]): T[] {
  return [...all].sort((a, b) => {
    const fa = a.frontmatter.featured;
    const fb = b.frontmatter.featured;
    if (fa !== undefined && fb !== undefined) return fa - fb;
    if (fa !== undefined) return -1;
    if (fb !== undefined) return 1;
    return a.frontmatter.date < b.frontmatter.date ? 1 : -1;
  });
}
