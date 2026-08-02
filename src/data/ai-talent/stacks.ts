/**
 * The tools /ai-talent screens against — one list, placed and graded.
 *
 * WHAT CHANGED IN ROUND 6, and it is the whole point of the file now.
 * `StackGroup` is gone. Every entry carries a `layer` and a `tier` instead
 * (context-round6-rulings.md decision 2 and §5). The stack matrix was a second
 * band over this same data under a second grouping, and the two groupings
 * disagreed: the matrix said "Cloud AI platforms" while the estate band's layer
 * prose named the same products as model hosting. One set of tools cannot have
 * two taxonomies over it and stay true, so the estate's layers won and the
 * matrix band was deleted.
 *
 * `layer` places a tool in the estate. `tier` grades it within that layer.
 * `roleFamilies` is unchanged and is the join that makes the three-way map
 * work: the layer holds tools, the layer places roles, `roleFamilies` connects
 * the two.
 *
 * THE TIER TEST, stated once (§5). It replaces the withdrawn max-ten cap, which
 * was aimed at crowding and would have deleted the screening depth that is the
 * proof rather than the clutter.
 *
 *   bought      — an enterprise procurement route exists. Somebody signs a
 *                 contract. Leads its layer, prominently.
 *   engineered  — no procurement route, but Yallo screens candidates against
 *                 it. A secondary line within the same layer.
 *
 * A tool failing both comes off. Zapier and Make came off on decision 5: SMB
 * automation, against canon §1's enterprise-programme wedge, on exactly the
 * reasoning R2 used to retire SAP Business One and Business ByDesign.
 * LlamaIndex fails "bought" and passes "screened against", which is what the
 * engineered tier exists for.
 *
 * WHERE THE LINE FALLS, because the grading has to be reproducible rather than
 * a taste call: a tool is `bought` when it cannot be run in production without
 * a commercial agreement, or when its dominant enterprise deployment is a
 * vendor-hosted service under contract. It is `engineered` when the dominant
 * deployment is self-hosted open source. That puts Pinecone and Azure AI Search
 * with the bought set and pgvector, Weaviate and Qdrant with the engineered
 * one, even though all five are vector stores — which is the distinction a
 * buyer's procurement team would draw, and the one this page is for.
 *
 * R-AI2 stands: these are NOT platform destinations. Anthropic, OpenAI, Bedrock
 * and the rest do not become `/platforms/*` pages. Canon §3 fixes the platform
 * set at seven and states that ServiceNow and AWS are not destinations either.
 *
 * R-AI3 stands: naming a tool here asserts that Yallo SCREENS for it. Nothing
 * more. `placementHistory` is the gate on any stronger claim and is `false` on
 * every entry. Code does not set one to `true`; Sumeet does, per vendor, when
 * there is a placement he will stand behind.
 *
 * R-AI5, the correction that had to be carried: "Azure AI Fabric" is not a
 * product. Two separate Microsoft products are meant and both appear below in
 * different layers — Azure AI Foundry, the AI platform, and Microsoft Fabric,
 * the data platform.
 */

/** The ten role-family slugs. Kept here as the type so a typo cannot compile. */
export type RoleFamilySlug =
  | "agentic-ai-developer"
  | "llm-engineer"
  | "ai-data-engineer"
  | "ai-solution-architect"
  | "mlops-engineer"
  | "ai-evaluation-specialist"
  | "ai-governance-lead"
  | "ai-product-manager"
  | "ai-experience-designer"
  | "chief-ai-officer";

/**
 * Where a tool sits in the estate.
 *
 * The five layers plus the evaluation rail. The governance rail carries
 * frameworks rather than tools and takes no entries here — a framework is not
 * procured and not engineered, so the tier test does not apply to it.
 *
 * `experience` takes no tools either, and that is a finding rather than a gap;
 * see the layer's own note in ./estate.ts.
 */
export type EstateZoneId =
  | "experience"
  | "orchestration"
  | "models"
  | "data"
  | "systems"
  | "evaluation";

export type Tier = "bought" | "engineered";

export interface StackEntry {
  name: string;
  /** The estate zone this tool sits in. */
  layer: EstateZoneId;
  /** Bought leads its layer; engineered is the secondary line. */
  tier: Tier;
  /** The role families screened against this tool. Drives the L2 filter. */
  roleFamilies: RoleFamilySlug[];
  /**
   * Whether Yallo publishes a placement claim for this vendor.
   *
   * `false` everywhere, by ruling. Engagements are confidential proofs of
   * concept, so no client may be named and no count published. This field
   * exists so the claim has a gate to sit behind when Sumeet supplies one,
   * rather than being a copy edit against ten pages.
   */
  placementHistory: boolean;
}

/**
 * The one line that must accompany the tools, per R-AI3.
 *
 * It moved onto the merged band with them. It did not disappear with the band
 * it was written for, which decision 2 is explicit about: the claim and the
 * thing it governs travel together, which is why the line lives with the data
 * rather than in a template where a layout change can drop it.
 */
export const stackMatrixAssertion =
  "These are the tools we screen against. Naming one says we can test for it, not that we have delivered on it.";

const build = (
  layer: EstateZoneId,
  tier: Tier,
  rows: Array<[string, RoleFamilySlug[]]>,
): StackEntry[] =>
  rows.map(([name, roleFamilies]) => ({
    name,
    layer,
    tier,
    roleFamilies,
    placementHistory: false,
  }));

export const stacks: StackEntry[] = [
  /* ---- 05 Experience and delivery ----------------------------------------
     The products a business user actually meets: an agent or copilot inside a
     process someone is already paid to run. §5's worked example is this layer
     against the one below it — a buyer should not meet LangGraph before
     Salesforce Agentforce, and putting the vendor agent platforms at the top
     layer and the frameworks beneath is what makes that true structurally
     rather than by ordering a flat list carefully.

     The split was already documented in this file before round 6, in a note on
     the retired "Cloud AI platforms" group: that group "holds two different
     things, model hosting and vendor agent platforms". The layers separate
     them, which is the drift the merge closes. */
  ...build("experience", "bought", [
    [
      "Salesforce Agentforce",
      [
        "agentic-ai-developer",
        "ai-solution-architect",
        "ai-product-manager",
        "ai-experience-designer",
      ],
    ],
    [
      "SAP AI Core and Joule",
      ["ai-solution-architect", "ai-product-manager", "chief-ai-officer"],
    ],
    ["Oracle AI Services", ["ai-solution-architect", "ai-product-manager"]],
    ["Power Automate", ["ai-product-manager", "ai-solution-architect"]],
    ["UiPath", ["ai-product-manager", "ai-solution-architect"]],
  ]),

  /* ---- 04 Orchestration and agents ---------------------------------------
     Every entry is engineered, and that is the layer's actual shape rather
     than an omission: agent orchestration has no enterprise procurement route
     yet. It is the clearest thing the tier grading shows, and it is exactly
     why a buyer needs a specialist screen here — there is no vendor to hold
     accountable for the choice.

     n8n is graded engineered. It sells enterprise licences, but the dominant
     deployment in the estates Yallo staffs is self-hosted, and grading it
     bought would stand it at the head of this layer beside nothing. Logged as
     a judgement rather than a fact. */
  ...build("orchestration", "engineered", [
    ["LangChain", ["agentic-ai-developer", "llm-engineer"]],
    [
      "LangGraph",
      ["agentic-ai-developer", "llm-engineer", "ai-solution-architect"],
    ],
    ["CrewAI", ["agentic-ai-developer"]],
    ["AutoGen", ["agentic-ai-developer"]],
    ["Semantic Kernel", ["agentic-ai-developer", "ai-solution-architect"]],
    [
      "Model Context Protocol",
      ["agentic-ai-developer", "ai-solution-architect", "mlops-engineer"],
    ],
    ["Pydantic AI", ["agentic-ai-developer", "llm-engineer"]],
    ["n8n", ["agentic-ai-developer", "ai-product-manager"]],
  ]),

  /* ---- 03 Models ---------------------------------------------------------
     The models, and the platforms they are hosted through. Anthropic sits at
     equal weight with the other providers, per R-AI4: "Claude talent" is depth
     proof only and never the organising claim, so it never leads. */
  ...build("models", "bought", [
    [
      "Anthropic (Claude)",
      [
        "agentic-ai-developer",
        "llm-engineer",
        "ai-solution-architect",
        "ai-evaluation-specialist",
      ],
    ],
    [
      "OpenAI",
      [
        "agentic-ai-developer",
        "llm-engineer",
        "ai-solution-architect",
        "ai-evaluation-specialist",
      ],
    ],
    [
      "Google (Gemini)",
      ["agentic-ai-developer", "llm-engineer", "ai-solution-architect"],
    ],
    ["Mistral", ["llm-engineer", "ai-solution-architect", "mlops-engineer"]],
    ["Cohere", ["llm-engineer", "ai-solution-architect"]],
    [
      "Azure AI Foundry",
      [
        "ai-solution-architect",
        "mlops-engineer",
        "agentic-ai-developer",
        "llm-engineer",
      ],
    ],
    [
      "AWS Bedrock",
      ["ai-solution-architect", "mlops-engineer", "agentic-ai-developer"],
    ],
    [
      "Google Vertex AI",
      ["ai-solution-architect", "mlops-engineer", "llm-engineer"],
    ],
    ["AWS SageMaker", ["mlops-engineer", "ai-solution-architect"]],
    ["Hugging Face", ["llm-engineer", "mlops-engineer"]],
  ]),
  /* Open weights, self-hosted, no contract. The one engineered entry at this
     layer, and the distinction a buyer cares about: running Llama is a build,
     buying Bedrock is a procurement. */
  ...build("models", "engineered", [
    [
      "Meta (Llama)",
      ["llm-engineer", "ai-solution-architect", "mlops-engineer"],
    ],
  ]),

  /* ---- 02 Data and grounding ---------------------------------------------
     What the model is grounded in, and the integration that gets it there.
     MuleSoft and Informatica IDMC sit here rather than at orchestration: they
     move enterprise data to where a model can reach it, which is grounding
     work, not agent control flow. */
  ...build("data", "bought", [
    [
      "Databricks Mosaic AI",
      ["mlops-engineer", "ai-solution-architect", "ai-data-engineer"],
    ],
    [
      "Snowflake Cortex",
      ["ai-solution-architect", "mlops-engineer", "ai-data-engineer"],
    ],
    [
      "Microsoft Fabric",
      ["ai-solution-architect", "mlops-engineer", "ai-data-engineer"],
    ],
    [
      "Azure AI Search",
      ["llm-engineer", "ai-solution-architect", "ai-data-engineer"],
    ],
    ["Pinecone", ["llm-engineer", "agentic-ai-developer", "ai-data-engineer"]],
    [
      "Elasticsearch",
      ["llm-engineer", "ai-solution-architect", "ai-data-engineer"],
    ],
    ["Informatica IDMC", ["ai-solution-architect", "mlops-engineer"]],
    ["MuleSoft", ["ai-solution-architect", "agentic-ai-developer"]],
  ]),
  /* The tenth family owns retrieval, per context-round3-rulings.md §2 q3, so it
     is on every entry here: retrieval is the role's subject rather than one of
     its tools. llm-engineer and agentic-ai-developer stay on the entries they
     already had — they consume a retrieval layer and are screened on telling a
     retrieval fault from a prompt fault.

     LlamaIndex is graded engineered on decision 5 and sits at this layer rather
     than at orchestration: it is a retrieval and indexing framework first, and
     it is the single most obvious tool for the AI Data Engineer, so its absence
     from that family's L2 would read as a gap. It does have agent features, so
     this is a judgement rather than a fact, and it was flagged for reversal in
     round 3 and left standing. */
  ...build("data", "engineered", [
    ["pgvector", ["llm-engineer", "agentic-ai-developer", "ai-data-engineer"]],
    ["Weaviate", ["llm-engineer", "ai-solution-architect", "ai-data-engineer"]],
    ["Qdrant", ["llm-engineer", "ai-solution-architect", "ai-data-engineer"]],
    [
      "LlamaIndex",
      ["agentic-ai-developer", "llm-engineer", "ai-data-engineer"],
    ],
  ]),

  /* ---- Rail, left: evaluation and observability --------------------------
     A rail rather than a layer because you cannot evaluate a model without
     touching the data under it and the interface over it. Ragas measures
     retrieval quality specifically, so the family that owns the retrieval layer
     is screened against it; the rest is model and prompt evaluation. */
  ...build("evaluation", "bought", [
    [
      "LangSmith",
      ["ai-evaluation-specialist", "llm-engineer", "mlops-engineer"],
    ],
    ["Weights and Biases", ["mlops-engineer", "ai-evaluation-specialist"]],
  ]),
  ...build("evaluation", "engineered", [
    [
      "Langfuse",
      ["ai-evaluation-specialist", "llm-engineer", "mlops-engineer"],
    ],
    ["Ragas", ["ai-evaluation-specialist", "llm-engineer", "ai-data-engineer"]],
    ["MLflow", ["mlops-engineer", "ai-evaluation-specialist"]],
    ["DeepEval", ["ai-evaluation-specialist", "llm-engineer"]],
  ]),
];

/** Tier render order within a zone: bought leads, engineered follows. */
export const tierOrder: Tier[] = ["bought", "engineered"];

/**
 * The tools at one estate zone, graded, in tier order.
 *
 * `family` filters to the tools that family is screened against. Passing none
 * returns the whole zone, which is the L1 case. One code path serves both
 * levels — §3.3 is explicit that the L2 is the same component with one prop and
 * not a second data path.
 */
export function toolsForZone(
  zone: EstateZoneId,
  family?: RoleFamilySlug,
): Array<{ tier: Tier; entries: StackEntry[] }> {
  return tierOrder
    .map((tier) => ({
      tier,
      entries: stacks.filter(
        (s) =>
          s.layer === zone &&
          s.tier === tier &&
          (family === undefined || s.roleFamilies.includes(family)),
      ),
    }))
    .filter((t) => t.entries.length > 0);
}

/** Whether a family is screened against anything at this zone. */
export function familyWorksAt(
  zone: EstateZoneId,
  family: RoleFamilySlug,
): boolean {
  return stacks.some(
    (s) => s.layer === zone && s.roleFamilies.includes(family),
  );
}
