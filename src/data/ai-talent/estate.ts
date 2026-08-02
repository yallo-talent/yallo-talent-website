import { type RoleFamilySlug, type StackGroup, stacks } from "./stacks";

/**
 * The AI estate — five layers and two cross-cutting rails, per context §7.1.
 *
 * WHAT MAKES THIS MORE THAN A TECHNOLOGY POSTER. The layers alone are a diagram
 * anybody could draw. The overlay marking which role families staff each layer is
 * the part that only Yallo can publish, and §7.1 is explicit that it is the point
 * of the asset. So the overlay is not decoration on the diagram, it is the payload.
 *
 * THE OVERLAY IS DERIVED, NOT RETYPED. Where a layer corresponds to stack groups
 * in `stacks.ts`, its role families are computed from that data. `stacks.ts`
 * already maps every named technology to the families screened against it, and it
 * is the ratified source for both the L1 matrix and the nine L2 pages. Copying
 * those associations into a third list would guarantee they drift: a family added
 * to LangGraph would update the matrix and the L2 and silently not update this
 * diagram. Two layers have no stack group of their own and carry an explicit list,
 * marked below with the reason.
 *
 * Every technology named here comes from the ratified §7.1 table. Naming one
 * asserts that Yallo screens against it, exactly as the stack matrix does, and the
 * diagram's caption carries that assertion once.
 */

export interface EstateLayer {
  id: string;
  /** Layer name as a buyer would say it. */
  name: string;
  /** The technologies at this layer. Prose, because it reads as a sentence. */
  contents: string;
  /**
   * Stack groups whose role-family associations this layer inherits.
   *
   * Empty where no group corresponds, in which case `families` carries the list
   * and the comment says why.
   */
  fromGroups: StackGroup[];
  /** Explicit families, used only where `fromGroups` cannot supply them. */
  families?: RoleFamilySlug[];
}

/**
 * Bottom to top, and rendered in that reading order.
 *
 * The systems of record sit at the bottom because that is the argument: the AI
 * estate rests on the platforms Yallo already staffs, which is why this diagram is
 * credible coming from a talent business rather than from a model vendor.
 */
export const estateLayers: EstateLayer[] = [
  {
    id: "experience",
    name: "Experience and delivery",
    contents:
      "Copilots and agents embedded in a business process, and the interaction design that makes an uncertain system usable.",
    /* No stack group: this layer is not a product category. What sits here is a
       business process and an interface, so the families are named directly. */
    fromGroups: [],
    families: [
      "ai-experience-designer",
      "ai-product-manager",
      "agentic-ai-developer",
    ],
  },
  {
    id: "orchestration",
    name: "Orchestration and agents",
    contents:
      "LangGraph, CrewAI, Semantic Kernel, Model Context Protocol, agent-to-agent, SAP Joule Studio, Salesforce Agentforce and n8n.",
    fromGroups: [
      "Agent and orchestration frameworks",
      "Automation and integration",
    ],
  },
  {
    id: "models",
    name: "Models",
    contents:
      "Anthropic, OpenAI, Google, Meta, Mistral and Cohere, hosted through Azure AI Foundry, AWS Bedrock or Google Vertex AI.",
    /**
     * "Model providers" only, and deliberately NOT "Cloud AI platforms".
     *
     * Taking both was the first version and the rendered overlay showed why it was
     * wrong: this layer inherited eight of the nine families, including the Chief
     * AI Officer and the AI Experience Designer. "Cloud AI platforms" is a coarse
     * group that holds two different things, model hosting (Azure AI Foundry,
     * Bedrock, Vertex) and vendor agent platforms (Agentforce, Joule), and the
     * second is what dragged the experience and executive families onto a layer
     * they do not staff.
     *
     * An overlay that marks every family on every layer conveys nothing, which
     * would have cost the diagram exactly the thing §7.1 says is its point. The
     * hosting products still appear in `contents` above, because §7.1 names them
     * there as where models are hosted rather than as a thing separately staffed.
     */
    fromGroups: ["Model providers"],
  },
  {
    id: "data",
    name: "Data and grounding",
    contents:
      "SAP Business Data Cloud, Databricks, Snowflake, Microsoft Fabric, vector stores, retrieval and knowledge graphs.",
    /**
     * The layer the tenth family staffs, and it arrives here without an edit
     * because the overlay is derived: adding ai-data-engineer to the retrieval
     * group in stacks.ts marks this layer, which is the behaviour the derivation
     * exists for.
     *
     * Re-checked after the tenth family, per context-round3-rulings.md §5.2. The
     * measured overlay across ten families: experience 3, orchestration 5, models
     * 5, data 4, systems of record 2, evaluation rail 4, governance rail 2. No
     * band carries most of the set. Before the LlamaIndex move the orchestration
     * layer would have reached six of ten, which is what that move avoids; see
     * the note in stacks.ts.
     */
    fromGroups: ["Retrieval and vector stores"],
  },
  {
    id: "systems-of-record",
    name: "Systems of record",
    contents:
      "SAP, Oracle, Microsoft, Salesforce, Workday, Blue Yonder and Informatica. The estate Yallo already staffs, and the reason this diagram is credible.",
    /* No stack group: these are the platform desks, not AI stacks. The families
       named are the two that have to hold both sides of the join, which is the
       scarcity this layer exists to point at. */
    fromGroups: [],
    families: ["ai-solution-architect", "ai-product-manager"],
  },
];

export interface EstateRail {
  id: string;
  name: string;
  /** One line on what the rail does across every layer. */
  note: string;
  /** Named items. Frameworks are NAMED and never interpreted. */
  items: string[];
  fromGroups: StackGroup[];
  families?: RoleFamilySlug[];
}

/**
 * The two rails span every layer, which is the whole reason they are rails rather
 * than layers: you cannot evaluate a model without touching the data under it and
 * the interface over it, and governance is not a stage at the end.
 */
export const estateRails: { left: EstateRail; right: EstateRail } = {
  left: {
    id: "evaluation",
    name: "Evaluation and observability",
    note: "Spans every layer. Without it a system is shipped on impressions.",
    items: ["LangSmith", "Langfuse", "Ragas", "MLflow", "DeepEval"],
    fromGroups: ["Evaluation, observability and model hubs"],
  },
  right: {
    id: "governance",
    name: "Governance, risk and safety",
    note: "Spans every layer. Named as what governance roles are screened against; what any of them obliges is your counsel's call.",
    /* Named, not interpreted. The same four §7.1 lists, and the same rule that
       governs governanceFrameworks in ./index.ts: no obligation summarised, no
       compliance date, no implied certification. */
    items: [
      "EU AI Act",
      "ISO/IEC 42001",
      "NIST AI Risk Management Framework",
      "OWASP Top 10 for LLM Applications",
    ],
    fromGroups: [],
    families: ["ai-governance-lead", "chief-ai-officer"],
  },
};

/**
 * The role families that staff a layer or rail.
 *
 * Derived from `stacks.ts` where the layer maps to stack groups, explicit where it
 * does not. Order follows the canonical family order rather than discovery order,
 * so the same families always read in the same sequence across the five layers.
 */
export function familiesFor(entry: EstateLayer | EstateRail): RoleFamilySlug[] {
  if (entry.fromGroups.length === 0) return entry.families ?? [];
  const found = new Set<RoleFamilySlug>();
  for (const s of stacks) {
    if (!entry.fromGroups.includes(s.group)) continue;
    for (const f of s.roleFamilies) found.add(f);
  }
  return FAMILY_ORDER.filter((f) => found.has(f));
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
 * The assertion the diagram carries, once.
 *
 * Same rule as `stackMatrixAssertion`: naming a technology says Yallo can screen
 * for it and nothing more. The line lives with the data so a layout change cannot
 * drop it.
 */
export const estateAssertion =
  "Naming a technology here says we screen against it, not that we have delivered on it. The overlay shows which role families staff each layer.";
