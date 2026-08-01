import type { AiRoleFamily } from "./types";

export const aiExperienceDesigner: AiRoleFamily = {
  slug: "ai-experience-designer",
  name: "Generative AI Experience Designer",
  shortName: "AI Experience Designer",
  hero: "Designs the interaction for systems that are uncertain: how confidence, correction, hand-off and refusal are shown to a user.",
  whatItDoes:
    "Conventional interface design assumes the system knows the answer. This role designs for the case where it might not. That means showing confidence without implying precision, making correction cheap enough that people actually do it, designing the hand-off to a human so it does not read as failure, and handling refusal so a user understands why rather than concluding the product is broken. The work is mostly about the wrong answer, which is why a portfolio full of polished happy paths tells you very little.",
  screenFor: [
    "Whether they design for the wrong answer, not only the right one. Ask to see the error and refusal states.",
    "Whether they have tested with users who distrust the system, rather than with enthusiasts.",
    "How they represent uncertainty without either hiding it or making it unusable.",
    "What the correction path costs a user, in clicks and in dignity.",
  ],
  misHire:
    "A visual designer producing a chat window. The surface is attractive, every state assumes success, and the first time the system is wrong the user has nowhere to go.",
  seniority: [
    {
      grade: "Mid",
      change:
        "Designs flows and states against an established interaction pattern for uncertainty.",
    },
    {
      grade: "Senior",
      change:
        "Sets the interaction pattern itself, including confidence, correction and refusal, and validates it with sceptical users.",
    },
    {
      grade: "Lead",
      change:
        "Owns the pattern across products so that trust behaves consistently wherever a user meets the system.",
    },
  ],
  inProgramme:
    "Needed at design, and needed again once real outputs exist, because the states that matter cannot be designed against imagined answers. The dependency is a working system to react to, so plan for a second pass rather than one hand-off.",
  blueprints: ["salesforce-multi-cloud"],
  adjacent: ["ai-product-manager", "llm-engineer", "ai-evaluation-specialist"],
  seo: {
    title: "Generative AI Experience Designers | Yallo Talent",
    description:
      "AI experience designers screened on uncertainty, correction, hand-off and refusal states, not chat surfaces. Shortlisted in 72 hours. Middle East · Europe · India.",
  },
};
