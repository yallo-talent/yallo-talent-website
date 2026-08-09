/**
 * The category list, per content type — R-25b.2.
 *
 * ARTICLES USE THE DESIGN'S FIVE EDITORIAL TYPES. Design §5 names them and
 * `/insights` groups by them.
 *
 * CASE STUDIES USE THE ENGAGEMENT PILLAR THEIR CARDS ALREADY DISPLAY. The nine
 * imported studies carry pillars already, so nothing here is invented and
 * nothing needs assigning. A study whose category is an editorial type would
 * be filed under a heading no case-study surface has.
 *
 * WHY ONE DECLARATION IN .mjs. The same list is read by the publish action, by
 * the editor's dropdown and by the gate that proves the refusal — the same
 * arrangement, and the same reason, as `src/lib/tiptap/schema.mjs`. A second
 * copy is a copy that is wrong in one place, and here the two would disagree
 * about what an author is allowed to choose.
 */

/** Design §5, the five editorial types. */
export const ARTICLE_CATEGORIES = [
  "Market intelligence",
  "Hiring guidance",
  "Programme staffing",
  "AI talent",
  "Company news",
];

/** Canon: the engagement pillars, as the case-study cards display them. */
export const CASE_STUDY_CATEGORIES = [
  "Contract",
  "Permanent",
  "EOR",
  "Managed Delivery",
  "Advisory",
];

/**
 * @param {"article"|"case_study"} type
 * @returns {string[]} the categories that type may carry
 */
export function categoriesFor(type) {
  return type === "case_study" ? CASE_STUDY_CATEGORIES : ARTICLE_CATEGORIES;
}
