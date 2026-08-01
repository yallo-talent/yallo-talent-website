import type { AiRoleFamily } from "./types";

export const llmEngineer: AiRoleFamily = {
  slug: "llm-engineer",
  name: "Prompt and LLM Engineer",
  shortName: "LLM Engineer",
  hero: "Designs, tests and maintains the prompt and context layer, including retrieval, and holds output quality over time.",
  whatItDoes:
    "This is the role that owns what the model is given and what comes back. It covers prompt structure, the retrieval that grounds an answer, and the test sets that say whether either is working. The word most people miss is maintains: a prompt is not finished when it works, because the model underneath it will change and the documents it retrieves from will drift. A good LLM engineer treats prompts as versioned artefacts with regressions attached, and can tell you which of the two layers caused a bad answer before touching either.",
  screenFor: [
    "A worked example of an output that got worse after a model change, and what they did about it.",
    "Whether they version prompts, and what the diff of a prompt change looks like to them.",
    "Whether they can distinguish a retrieval problem from a prompt problem, and how they proved which it was.",
    "How they chunk and evaluate a corpus, and what they changed after the first evaluation disappointed them.",
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
        "Owns the retrieval design as well as the prompt layer, and builds the evaluation that decides whether a change ships.",
    },
    {
      grade: "Lead",
      change:
        "Sets the prompt and context standard across teams, owns model-change response, and holds quality across releases rather than at one point in time.",
    },
  ],
  inProgramme:
    "Starts as soon as there is a real corpus to ground against, which is usually earlier than programmes plan for. The dependency is data access rather than model choice: this role is blocked by whatever governs the documents, not by procurement. Keep it retained after go-live, because the maintenance limb of the job only begins there.",
  blueprints: ["sap-s4hana", "salesforce-multi-cloud"],
  adjacent: [
    "agentic-ai-developer",
    "ai-evaluation-specialist",
    "ai-solution-architect",
  ],
  seo: {
    title: "Prompt and LLM Engineers | Yallo Talent",
    description:
      "LLM and prompt engineers screened on retrieval design, prompt versioning and regression discipline, not chat fluency. Shortlisted in 72 hours. Middle East · Europe · India.",
  },
};
