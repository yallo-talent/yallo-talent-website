import type { AiRoleFamily } from "./types";

export const aiProductManager: AiRoleFamily = {
  slug: "ai-product-manager",
  name: "AI Product Manager",
  shortName: "AI Product Manager",
  hero: "Owns the problem, the adoption and the measurement of value for an AI capability inside a business process.",
  whatItDoes:
    "The distinguishing word is process. An AI product manager is not managing a model, they are managing a change to how work gets done, and the model is one component of it. That means choosing which problem is worth the cost per interaction, deciding what good looks like when the output is probabilistic, and owning adoption once the capability exists. The strongest people in this role are comfortable killing something that demonstrated well, because pilots that impress and never enter a process are the standard failure mode of the category.",
  screenFor: [
    "Whether they have killed a feature that demoed well, and what the argument was.",
    "How they measure value when the output is probabilistic rather than deterministic.",
    "Whether they understand cost per interaction and who pays it as usage grows.",
    "What they changed about the surrounding process, not only about the product.",
  ],
  misHire:
    "A product manager who has run a pilot that never reached a business process. The demonstration was successful, the adoption number was never defined, and the capability is still described as promising a year later.",
  seniority: [
    {
      grade: "Mid",
      change:
        "Owns a feature and its adoption within a defined process and an agreed value measure.",
    },
    {
      grade: "Senior",
      change:
        "Owns the problem selection and the value measure itself, including the decision not to build.",
    },
    {
      grade: "Lead",
      change:
        "Owns a portfolio of capabilities and the sequencing between them, and holds the line on which do not proceed.",
    },
  ],
  inProgramme:
    "In from discovery and retained well past go-live, because value is measured after adoption rather than at release. The dependency is business ownership: this role cannot define the value measure alone, and a programme that cannot name the process owner is not ready for the capability.",
  blueprints: ["oracle-fusion", "salesforce-multi-cloud"],
  adjacent: [
    "ai-experience-designer",
    "chief-ai-officer",
    "ai-solution-architect",
  ],
  seo: {
    title: "AI Product Managers | Yallo Talent",
    description:
      "AI product managers screened on process change, value measurement under uncertainty and cost per interaction, not pilot delivery. Shortlisted in 72 hours. Middle East · Europe · India.",
  },
};
