import { platformNavEntries } from "@/lib/platforms";
import {
  type EstateZoneId,
  familyWorksAt,
  type RoleFamilySlug,
  stacks,
} from "./stacks";

/**
 * The AI estate — five layers and two spanning rails, and after round 6 it is
 * the desk's single signature band.
 *
 * WHAT IT ABSORBED, and why that was a defect rather than a tidy-up.
 * The stack matrix was a separate band over the same 44 tools under a second
 * grouping, and the two groupings disagreed. Worse, this file's layer
 * descriptions named tools in hand-typed prose — "LangGraph, CrewAI, Semantic
 * Kernel..." — so a third copy of the same set was sitting in a string,
 * unreachable by any check and free to drift from the list it described. That
 * is precisely the derivation class round 5 closed in code, found here in
 * content structure. Decision 2 deletes the matrix band; the tools now carry a
 * `layer` and arrive here from `stacks.ts`.
 *
 * The governance band went the same way. `governanceFrameworks` in ./index.ts
 * held five frameworks and this file's right rail held four — ISO/IEC 23894 was
 * in one copy and not the other, and both rendered on the same page. One list
 * now, on the rail, and the band that held the other copy is gone.
 *
 * WHAT MAKES THIS MORE THAN A TECHNOLOGY POSTER. The layers alone are a diagram
 * anybody could draw. The overlay marking which role families staff each layer
 * is the part only Yallo can publish, and it is the payload rather than
 * decoration on it.
 *
 * THE OVERLAY IS DERIVED, NOT RETYPED. `stacks.ts` maps every tool to the
 * families screened against it; the families at a layer are computed from the
 * tools at that layer. Two zones hold no tools and carry an explicit list, each
 * marked below with its reason.
 */

/** A zone is a layer or a rail. Both hold tools, roles and a note. */
export interface EstateZone {
  id: EstateZoneId | "governance";
  /** Zone name as a buyer would say it. */
  name: string;
  /**
   * One line on what the zone is.
   *
   * It names no tools, and that is structural rather than stylistic: the tools
   * are data and the note is prose, so a note that lists them is a copy of the
   * data that no check can reach. That was the defect.
   */
  note: string;
  /** Explicit families, used only where no tool at the zone can supply them. */
  families?: RoleFamilySlug[];
}

/**
 * The five layers, top to bottom as rendered, numbered from the bottom.
 *
 * Layer 01 sits at the bottom because that is the argument: the AI estate rests
 * on the platforms Yallo already staffs, which is why this diagram is credible
 * coming from a talent business rather than from a model vendor.
 */
export const estateLayers: EstateZone[] = [
  {
    id: "experience",
    name: "Experience and delivery",
    note: "Copilots and agents inside a business process, and the interaction design that makes an uncertain system usable.",
  },
  {
    id: "orchestration",
    name: "Orchestration and agents",
    note: "Where an agent's steps, tools and state are defined, and where its failures are caught before a user meets them.",
  },
  {
    id: "models",
    name: "Models",
    note: "The models themselves, and the platforms an enterprise hosts them through.",
  },
  {
    id: "data",
    name: "Data and grounding",
    note: "What the model is grounded in, and the integration work that gets enterprise data to where it can reach it.",
  },
  {
    id: "systems",
    name: "Systems you already run",
    /* No tools: this layer is the platform desks, and they derive. See
       `estatePlatformDesks` below. The two families named are the ones that
       have to hold both sides of the join, which is the scarcity this layer
       exists to point at. */
    note: "The seven platform desks Yallo staffs. Almost no AI work is greenfield; it lands here.",
    families: ["ai-solution-architect", "ai-product-manager"],
  },
];

/**
 * The two rails span every layer, which is the whole reason they are rails.
 *
 * You cannot evaluate a model without touching the data under it and the
 * interface over it, and governance is not a stage at the end. Round 5 left
 * that as a sentence doing a diagram's job; the rebuild makes the span visual.
 */
export const estateRails: { left: EstateZone; right: EstateZone } = {
  left: {
    id: "evaluation",
    name: "Evaluation and observability",
    note: "Spans every layer. Without it a system is shipped on impressions.",
  },
  right: {
    id: "governance",
    name: "Governance, risk and safety",
    note: "Spans every layer. Named as what governance roles are screened against; what any of them obliges is your counsel's call.",
    /* No tools: frameworks are not procured and not engineered, so the tier
       test in §5 does not reach them and they are not `stacks.ts` entries. */
    families: ["ai-governance-lead", "chief-ai-officer"],
  },
};

/**
 * The governance frameworks, named accurately and never interpreted.
 *
 * THE SINGLE COPY. This list was written twice — here as the rail's items and
 * again as `governanceFrameworks` in ./index.ts for a separate governance band
 * — and the two disagreed by one entry while both rendered on the same page.
 * The band is deleted and this is the list.
 *
 * Naming a framework is a fact. Summarising what it obliges is legal
 * interpretation, which is not ours to publish, and stating a compliance date
 * would be worse.
 */
export const governanceFrameworks = [
  "EU AI Act",
  "ISO/IEC 42001",
  "ISO/IEC 23894",
  "NIST AI Risk Management Framework",
  "OWASP Top 10 for LLM Applications",
];

/**
 * Layer 01's contents, derived from `platformsIndex`.
 *
 * NOT A HAND-TYPED LIST, and §3.2 is explicit about why: this is the join
 * between /ai-talent and the platform pages, and canon §1 records it as the
 * part a competitor cannot copy without first having the platform depth. The
 * previous version wrote the seven names into a prose string — an eleventh copy
 * of the platform set, invisible to `check:taxonomy` rule 6, and already the
 * kind of copy that shipped five platform lists missing Informatica in round 5.
 *
 * `isPublished` is injected rather than imported, mirroring
 * `platformNavEntries`: it keeps this module clear of the platform-coverage
 * cycle, and the caller already holds `routeExists`.
 *
 * This also retires `estateBridge`. That was a curated five-slug subset with
 * hand-typed names, rendered as a row of buttons below the diagram because the
 * diagram "names the platforms but does not link them". The names are the links
 * now, so the row and the list behind it are both gone.
 */
export function estatePlatformDesks(
  isPublished: (slug: string) => boolean,
): Array<{ slug: string; label: string; href: string; published: boolean }> {
  return platformNavEntries(isPublished);
}

/**
 * The role families that staff a zone.
 *
 * Derived from the tools at that zone, explicit where the zone holds none.
 * Order follows the canonical family order rather than discovery order, so the
 * same families always read in the same sequence across the seven zones.
 */
export function familiesFor(zone: EstateZone): RoleFamilySlug[] {
  if (zone.families) return zone.families;
  const found = new Set<RoleFamilySlug>();
  for (const s of stacks) {
    if (s.layer !== zone.id) continue;
    for (const f of s.roleFamilies) found.add(f);
  }
  return FAMILY_ORDER.filter((f) => found.has(f));
}

/**
 * Whether a role family works at this zone — the L2 lit/dimmed test.
 *
 * A zone with an explicit family list answers from that list; a zone with tools
 * answers from them. §3.3: layers the family works at are lit, the rest stay
 * present and dimmed, because absence would lose the estate context that is the
 * point of the band.
 */
export function zoneLitFor(zone: EstateZone, family: RoleFamilySlug): boolean {
  if (zone.families) return zone.families.includes(family);
  return familyWorksAt(zone.id as EstateZoneId, family);
}

/** Canonical family order, matching aiRoleFamilies in ./index.ts. */
const FAMILY_ORDER: RoleFamilySlug[] = [
  "agentic-ai-developer",
  "llm-engineer",
  "ai-data-engineer",
  "ai-solution-architect",
  "mlops-engineer",
  "ai-evaluation-specialist",
  "ai-governance-lead",
  "ai-product-manager",
  "ai-experience-designer",
  "chief-ai-officer",
];

/**
 * The assertion the band carries, once.
 *
 * Naming a technology says Yallo screens against it and nothing more. The line
 * lives with the data so a layout change cannot drop it.
 */
export const estateAssertion =
  "Naming a technology here says we screen against it, not that we have delivered on it. The role families on each layer are the ones we place there.";
