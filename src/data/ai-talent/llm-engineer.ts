import type { AiRoleFamily } from "./types";

/**
 * RETRIEVAL OWNERSHIP MOVED OUT, 2 Aug 2026, per context-round3-rulings.md §5.2.
 *
 * This family and the Agentic AI Developer were splitting retrieval between
 * them, which meant no family owned it. It now belongs to ai-data-engineer, and
 * the ruling asks for a move rather than a duplication.
 *
 * What left: the design and pipeline claims. The hero said "including
 * retrieval"; `whatItDoes` claimed the retrieval that grounds an answer; the
 * Senior grade claimed to own the retrieval design; one screening point asked
 * how the candidate chunks and evaluates a corpus, which is now the other
 * family's opening question.
 *
 * What stayed, deliberately: telling a retrieval fault from a prompt fault. That
 * diagnosis is the join between the two roles rather than either one's property,
 * and a prompt engineer who cannot do it will tune a prompt against a corpus
 * that was never going to answer the question. The stack associations in
 * stacks.ts also stayed: this role is still screened against the vector stores
 * it consumes.
 */
export const llmEngineer: AiRoleFamily = {
  slug: "llm-engineer",
  name: "Prompt and LLM Engineer",
  shortName: "LLM Engineer",
  hero: "Designs, tests and maintains the prompt and context layer, and holds output quality over time.",
  whatItDoes:
    "This is the role that owns what the model is given and what comes back. It covers prompt structure, how retrieved context is assembled into a request, and the test sets that say whether the result is working. The word most people miss is maintains: a prompt is not finished when it works, because the model underneath it will change and the documents it draws on will drift. A good LLM engineer treats prompts as versioned artefacts with regressions attached, and can tell you whether a bad answer came from the prompt or from the retrieval layer before touching either. Where the retrieval layer itself is designed and built, that is the AI Data Engineer's work, and the two roles are normally hired together.",
  screenFor: [
    "A worked example of an output that got worse after a model change, and what they did about it.",
    "Whether they version prompts, and what the diff of a prompt change looks like to them.",
    "Whether they can distinguish a retrieval problem from a prompt problem, and how they proved which it was.",
    "How they assemble retrieved context into a request, and what they cut when it stopped fitting.",
  ],
  misHire:
    "Someone who is fluent in a chat interface. Fluency is not engineering, and it interviews extremely well because the demonstration is the skill. Ask for the regression they caught rather than the prompt they are proud of.",
  seniority: [
    {
      grade: "Mid",
      change:
        "Writes and tunes prompts against an existing evaluation set and retrieval design.",
    },
    {
      grade: "Senior",
      change:
        "Owns the prompt and context layer end to end, and builds the evaluation that decides whether a change ships.",
    },
    {
      grade: "Lead",
      change:
        "Sets the prompt and context standard across teams, owns model-change response, and holds quality across releases rather than at one point in time.",
    },
  ],
  inProgramme:
    "Starts once there is a grounded corpus to write against, which puts it a step behind the AI Data Engineer rather than alongside it. The dependency that bites is the same one: this role is blocked by whatever governs the documents, not by procurement. Keep it retained after go-live, because the maintenance limb of the job only begins there.",
  blueprints: ["sap-s4hana", "salesforce-multi-cloud"],
  adjacent: [
    "ai-data-engineer",
    "ai-evaluation-specialist",
    "agentic-ai-developer",
  ],
  seo: {
    title: "Prompt and LLM Engineers | Yallo Talent",
    description:
      "LLM and prompt engineers screened on prompt versioning, regression discipline and context assembly, not chat fluency. Shortlisted in 72 hours. Middle East · Europe · India.",
  },
};
