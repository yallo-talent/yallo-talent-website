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
 * Governance frameworks, named accurately and not interpreted.
 *
 * Context §7 is explicit: present these as what governance roles are screened
 * against. Do NOT summarise what any of them obliges and do NOT state
 * compliance dates. Naming a framework is a fact; explaining its obligations in
 * a marketing band is legal interpretation, which is not ours to publish.
 */
export const governanceFrameworks = [
  "EU AI Act",
  "ISO/IEC 42001",
  "ISO/IEC 23894",
  "NIST AI Risk Management Framework",
  "OWASP Top 10 for LLM Applications",
];

/**
 * Where AI work lands in the estate — the bridge band to the platform desks.
 *
 * Slugs, not authored names, so a platform rename cannot leave this band
 * pointing at a page that has moved. Informatica is included because the AI
 * data layer is where that desk meets this one.
 */
export const estateBridge: Array<{ slug: string; name: string }> = [
  { slug: "sap", name: "SAP" },
  { slug: "oracle", name: "Oracle" },
  { slug: "microsoft", name: "Microsoft" },
  { slug: "salesforce", name: "Salesforce" },
  { slug: "informatica", name: "Informatica" },
];

export type { AiRoleFamily } from "./types";
