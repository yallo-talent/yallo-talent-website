import { agenticAiDeveloper } from "./agentic-ai-developer";
import { aiDataEngineer } from "./ai-data-engineer";
import { aiEvaluationSpecialist } from "./ai-evaluation-specialist";
import { aiExperienceDesigner } from "./ai-experience-designer";
import { aiGovernanceLead } from "./ai-governance-lead";
import { aiProductManager } from "./ai-product-manager";
import { aiSolutionArchitect } from "./ai-solution-architect";
import { chiefAiOfficer } from "./chief-ai-officer";
import { llmEngineer } from "./llm-engineer";
import { mlopsEngineer } from "./mlops-engineer";
import type { RoleFamilySlug } from "./stacks";
import type { AiRoleFamily } from "./types";

/**
 * The ten AI role families, ordered as context §4.
 *
 * The first nine come from the legacy corpus role taxonomy, which is real and
 * already in the repo. The tenth, "AI Data Engineer, retrieval and RAG
 * pipelines", was proposed in the previous round and deliberately left out
 * rather than shipped on the assumption it would be waved through. It is now
 * ratified by Sumeet, 2 Aug 2026 (context-round3-rulings.md §2, question 3): the
 * retrieval work was split across two families, so no family owned it, and this
 * is the domain carrying paid spend, which makes a gap in it expensive.
 *
 * It sits third rather than last because the order groups the hands-on build
 * roles first, and because it reads next to the family it took ownership from.
 *
 * Order is the render order on the L1 and the order of the L2 route set. It must
 * stay in step with FAMILY_ORDER in ./estate.ts, which the overlay reads.
 */
export const aiRoleFamilies: AiRoleFamily[] = [
  agenticAiDeveloper,
  llmEngineer,
  aiDataEngineer,
  aiSolutionArchitect,
  mlopsEngineer,
  aiEvaluationSpecialist,
  aiGovernanceLead,
  aiProductManager,
  aiExperienceDesigner,
  chiefAiOfficer,
];

export function aiRoleFamily(slug: string): AiRoleFamily | null {
  return aiRoleFamilies.find((f) => f.slug === slug) ?? null;
}

export function aiRoleFamilySlugs(): RoleFamilySlug[] {
  return aiRoleFamilies.map((f) => f.slug);
}

/** Display name for a slug, for the adjacent-families links. */
export function aiRoleFamilyName(slug: RoleFamilySlug): string {
  return aiRoleFamily(slug)?.name ?? slug;
}

/**
 * How AI roles are screened — the band that carries the differentiation.
 *
 * Four points, no more (context §6). Point four is the Claude depth proof, and
 * R-AI4 governs it tightly: "AI talent" is the category, "Claude talent" is
 * depth proof only and never the organising claim. It appears here, once, in
 * the screening band, and nowhere in a heading, a hero or a nav label.
 */
export const screeningPoints = [
  "Screening is done by someone who has built the thing, not by keyword match against a CV.",
  "Every role has a mis-hire pattern, and the screen is designed to catch that specific one rather than to confirm a general impression.",
  "Evidence of production, not demonstration: what broke, what it cost, and what was rolled back.",
  "Our own delivery work runs on Claude-native systems, so the screen for agentic and prompt roles is built from practice rather than from a specification.",
];

/**
 * `governanceFrameworks` MOVED to ./estate.ts in round 6, and the move is the
 * fix rather than a tidy-up.
 *
 * This file held five frameworks and ./estate.ts's right rail held four —
 * ISO/IEC 23894 was in one copy and not the other, and both rendered on the
 * same page, in a governance band and in the estate diagram beside it. One
 * list now, on the rail it belongs to, and the band carrying the second copy
 * is deleted.
 *
 * `estateBridge` is retired in the same pass. It was a curated five-slug subset
 * with hand-typed platform names, rendered as a row of buttons under the
 * diagram because the diagram named the platforms without linking them. Layer
 * 01 derives the desks from `platformsIndex` and the names are the links, so
 * neither the row nor the list behind it has anything left to do.
 */

export type { AiRoleFamily } from "./types";
