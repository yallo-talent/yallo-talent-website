import type { RoleFamilySlug } from "./stacks";

/**
 * One AI role family. The field order IS the band order on the L2 (context §3),
 * so a reader of this file can see the page.
 *
 * Separate from index.ts because the nine family files import the shape and
 * index.ts imports the nine families — putting the interface in index.ts would
 * make that a cycle.
 *
 * Deliberately absent, and it is a ruling rather than an omission (R-AI3):
 * there is no `metrics`, no `scarcity`, no `rate`, no `timeToHire` and no
 * `placementCount` field. A field that does not exist cannot be filled in with
 * an estimate by a later pass, which is the whole point of leaving it out
 * rather than leaving it empty.
 */
export interface AiRoleFamily {
  slug: RoleFamilySlug;
  /** As published, e.g. "Agentic AI Developer". */
  name: string;
  /** Nav and card label where the full name is too long for the slot. */
  shortName: string;
  /** Band 1. The role in one line. No superlatives (R-AI6). */
  hero: string;
  /** Band 2. What the role actually does, three to five sentences. */
  whatItDoes: string;
  /** Band 3. The screening tests. The differentiating band. */
  screenFor: string[];
  /** Band 4. The failure mode the buyer has already lived through. */
  misHire: string;
  /**
   * Band 6. What changes between mid, senior and lead.
   *
   * Grades, never rates. The Blueprint's rule applies here too: the shape is
   * publishable, the numbers are Sumeet's to supply.
   */
  seniority: Array<{ grade: "Mid" | "Senior" | "Lead"; change: string }>;
  /** Band 7. Phase and dependency, in programme terms. */
  inProgramme: string;
  /**
   * Band 7, continued. Blueprint archetypes this role appears in.
   *
   * Slugs under /intelligence/programme-staffing-blueprint. Empty is valid and
   * renders nothing — no archetype is invented to fill the band.
   */
  blueprints: string[];
  /** Band 8. Internal links, three maximum (context §3). */
  adjacent: RoleFamilySlug[];
  /**
   * Band 8, the cross-taxonomy half. One optional discipline, or one sub-desk
   * of one.
   *
   * Decision 7 of context-round5-rulings.md, and it is the least structure that
   * satisfies round 4 §7's both-directions requirement. Data Science already
   * links out to AI Talent through its `twin` band; the return leg had nowhere
   * to live, because `adjacent` above is typed to AI families only and
   * `estateBridge` is platform-shaped. A discipline link in either would have
   * been the wrong axis in a round about keeping axes apart.
   *
   * NOT A NEW BAND. It renders inside the adjacent band beside the role-family
   * links, because it answers the same reader question — what this role is
   * confused with — and a band of one link would be a heading with a chip
   * under it.
   *
   * Optional, and one maximum. The label is never written here: `fn` names a
   * sub-desk whose title already exists in the capability data, and
   * `disciplineLink` resolves both. An unresolvable reference renders nothing.
   */
  adjacentDiscipline?: { capability: string; fn?: string };
  /** Search title and description. */
  seo: { title: string; description: string };
}
