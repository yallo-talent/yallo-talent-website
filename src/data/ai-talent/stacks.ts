/**
 * The AI stack matrix — the signature band of /ai-talent, and the single source
 * for both levels.
 *
 * ONE list, read twice: rendered whole as the dark band on the L1, filtered by
 * role family on each L2. The alternative was a matrix on the L1 and a stacks
 * list per L2 file, which is the same data written ten times and nine chances
 * for them to disagree.
 *
 * R-AI2: these are NOT platform destinations. Anthropic, OpenAI, Bedrock and the
 * rest do not become `/platforms/*` pages — canon §3 fixes the platform set and
 * states that ServiceNow and AWS are not destinations either. Model vendors as
 * platforms would dilute the enterprise-programme wedge. They render as a
 * governed matrix instead, and a vendor page arrives later only where search
 * demand justifies one, as a canon amendment.
 *
 * R-AI3: naming a tool here asserts that Yallo SCREENS for it. Nothing more.
 * `placementHistory` is the gate on any stronger claim and it is `false` on
 * every entry below. Code does not set one to `true`; Sumeet does, per vendor,
 * when there is a placement he is willing to stand behind. The band carries a
 * line saying exactly this, so the assertion is on the page and not only here.
 *
 * R-AI5, the correction that had to be carried: "Azure AI Fabric" is not a
 * product and never was. Two separate Microsoft products are meant, and both
 * appear below in different groups — **Azure AI Foundry**, the AI platform
 * formerly Azure AI Studio, and **Microsoft Fabric**, the data platform. A
 * buyer who runs either would notice the conflation immediately.
 *
 * The second group is the deliberate one. Those are the AI platforms of the
 * enterprise vendors Yallo already staffs, which is the join between this page
 * and the platform desks — the part a competitor cannot copy without first
 * having the platform depth.
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

export type StackGroup =
  | "Model providers"
  | "Cloud AI platforms"
  | "Agent and orchestration frameworks"
  | "Evaluation, observability and model hubs"
  | "Retrieval and vector stores"
  | "Automation and integration";

export interface StackEntry {
  name: string;
  group: StackGroup;
  /** The role families screened against this stack. Drives the L2 filter. */
  roleFamilies: RoleFamilySlug[];
  /**
   * Whether Yallo publishes a placement claim for this vendor.
   *
   * `false` everywhere, by ruling. Engagements are confidential proofs of
   * concept, so no client may be named and no count published. This field
   * exists so the claim has a gate to sit behind when Sumeet supplies one,
   * rather than being a copy edit against nine pages.
   */
  placementHistory: boolean;
}

/** Group render order on the L1 band. */
export const stackGroups: StackGroup[] = [
  "Model providers",
  "Cloud AI platforms",
  "Agent and orchestration frameworks",
  "Evaluation, observability and model hubs",
  "Retrieval and vector stores",
  "Automation and integration",
];

/**
 * The one line that must accompany the matrix, per R-AI3.
 *
 * Lives with the data rather than in the template so it cannot be dropped by a
 * layout change: the claim and the thing it governs travel together.
 */
export const stackMatrixAssertion =
  "These are the stacks we screen against. Naming one says we can test for it, not that we have delivered on it.";

const build = (
  group: StackGroup,
  rows: Array<[string, RoleFamilySlug[]]>,
): StackEntry[] =>
  rows.map(([name, roleFamilies]) => ({
    name,
    group,
    roleFamilies,
    placementHistory: false,
  }));

export const stacks: StackEntry[] = [
  ...build("Model providers", [
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
    [
      "Meta (Llama)",
      ["llm-engineer", "ai-solution-architect", "mlops-engineer"],
    ],
    ["Mistral", ["llm-engineer", "ai-solution-architect", "mlops-engineer"]],
    ["Cohere", ["llm-engineer", "ai-solution-architect"]],
  ]),

  ...build("Cloud AI platforms", [
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
    ["AWS SageMaker", ["mlops-engineer", "ai-solution-architect"]],
    [
      "Google Vertex AI",
      ["ai-solution-architect", "mlops-engineer", "llm-engineer"],
    ],
    /* The three data platforms in this group take the tenth family; the model
       hosting and vendor agent platforms around them do not. This group feeds no
       estate layer, so these three change the matrix and the family's own L2
       band without touching the overlay. */
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
      "SAP AI Core and Joule",
      ["ai-solution-architect", "ai-product-manager", "chief-ai-officer"],
    ],
    ["Oracle AI Services", ["ai-solution-architect", "ai-product-manager"]],
    [
      "Salesforce Agentforce",
      [
        "agentic-ai-developer",
        "ai-solution-architect",
        "ai-product-manager",
        "ai-experience-designer",
      ],
    ],
  ]),

  ...build("Agent and orchestration frameworks", [
    ["LangChain", ["agentic-ai-developer", "llm-engineer"]],
    [
      "LangGraph",
      ["agentic-ai-developer", "llm-engineer", "ai-solution-architect"],
    ],
    /* LlamaIndex moved to "Retrieval and vector stores" — see the note there. */
    ["CrewAI", ["agentic-ai-developer"]],
    ["AutoGen", ["agentic-ai-developer"]],
    ["Semantic Kernel", ["agentic-ai-developer", "ai-solution-architect"]],
    [
      "Model Context Protocol",
      ["agentic-ai-developer", "ai-solution-architect", "mlops-engineer"],
    ],
    ["Pydantic AI", ["agentic-ai-developer", "llm-engineer"]],
  ]),

  ...build("Evaluation, observability and model hubs", [
    ["Hugging Face", ["llm-engineer", "mlops-engineer"]],
    [
      "LangSmith",
      ["ai-evaluation-specialist", "llm-engineer", "mlops-engineer"],
    ],
    [
      "Langfuse",
      ["ai-evaluation-specialist", "llm-engineer", "mlops-engineer"],
    ],
    /* Ragas measures retrieval quality specifically, so the family that owns the
       retrieval layer is screened against it. The rest of this group is model and
       prompt evaluation and stays as it was. */
    [
      "Ragas",
      ["ai-evaluation-specialist", "llm-engineer", "ai-data-engineer"],
    ],
    ["MLflow", ["mlops-engineer", "ai-evaluation-specialist"]],
    ["Weights and Biases", ["mlops-engineer", "ai-evaluation-specialist"]],
    ["DeepEval", ["ai-evaluation-specialist", "llm-engineer"]],
  ]),

  /* The tenth family owns this group, per context-round3-rulings.md §2 q3. It is
     added to every entry because retrieval is the role's subject rather than one
     of its tools. llm-engineer and agentic-ai-developer stay on the entries they
     already had: they consume a retrieval layer and are screened on telling a
     retrieval fault from a prompt fault. What moved out of llm-engineer is the
     OWNERSHIP claim in its prose, not its screening against these stores.

     LlamaIndex MOVED here from "Agent and orchestration frameworks". It is a
     retrieval and indexing framework first, and it is the single most obvious
     tool for this family, so its absence from the family's L2 band would read as
     a gap. Two reasons to move rather than dual-list it: the group it sat in
     feeds the orchestration layer of the estate diagram, and adding a tenth
     family there would have taken that layer to six of ten — "most of the set",
     which §5.2 asks the overlay to avoid; and removing it changes that group's
     derived families not at all, because LangChain and Pydantic AI already carry
     agentic-ai-developer and llm-engineer.

     LlamaIndex does have agent features, so this is a judgement rather than a
     fact, and it is flagged in the relay for reversal if Sumeet reads it the
     other way. */
  ...build("Retrieval and vector stores", [
    ["pgvector", ["llm-engineer", "agentic-ai-developer", "ai-data-engineer"]],
    ["Pinecone", ["llm-engineer", "agentic-ai-developer", "ai-data-engineer"]],
    ["Weaviate", ["llm-engineer", "ai-solution-architect", "ai-data-engineer"]],
    ["Qdrant", ["llm-engineer", "ai-solution-architect", "ai-data-engineer"]],
    [
      "Elasticsearch",
      ["llm-engineer", "ai-solution-architect", "ai-data-engineer"],
    ],
    [
      "Azure AI Search",
      ["llm-engineer", "ai-solution-architect", "ai-data-engineer"],
    ],
    ["LlamaIndex", ["agentic-ai-developer", "llm-engineer", "ai-data-engineer"]],
  ]),

  ...build("Automation and integration", [
    ["n8n", ["agentic-ai-developer", "ai-product-manager"]],
    ["Power Automate", ["ai-product-manager", "ai-solution-architect"]],
    ["Zapier", ["ai-product-manager"]],
    ["Make", ["ai-product-manager"]],
    ["UiPath", ["ai-product-manager", "ai-solution-architect"]],
    ["MuleSoft", ["ai-solution-architect", "agentic-ai-developer"]],
    ["Informatica IDMC", ["ai-solution-architect", "mlops-engineer"]],
  ]),
];

/** The matrix, grouped, for the L1 band. */
export function stacksByGroup(): Array<{
  group: StackGroup;
  entries: StackEntry[];
}> {
  return stackGroups
    .map((group) => ({
      group,
      entries: stacks.filter((s) => s.group === group),
    }))
    .filter((g) => g.entries.length > 0);
}

/** The subset relevant to one role family, grouped, for an L2 stacks band. */
export function stacksForFamily(
  slug: RoleFamilySlug,
): Array<{ group: StackGroup; entries: StackEntry[] }> {
  return stackGroups
    .map((group) => ({
      group,
      entries: stacks.filter(
        (s) => s.group === group && s.roleFamilies.includes(slug),
      ),
    }))
    .filter((g) => g.entries.length > 0);
}
