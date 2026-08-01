import type { AiRoleFamily } from "./types";

export const chiefAiOfficer: AiRoleFamily = {
  slug: "chief-ai-officer",
  name: "Chief AI Officer and AI Programme Director",
  shortName: "Chief AI Officer",
  hero: "Owns the enterprise AI portfolio: sequencing, funding, governance, delivery and the operating model around it.",
  whatItDoes:
    "This is a portfolio role, not a project one. It decides what is funded and in what order, holds the governance and delivery functions to account, and builds the operating model that lets a second and third capability ship faster than the first. Most of the value is in sequencing and in stopping: an organisation with eleven pilots and no operating model is worse off than one with two capabilities in a process. The person has to hold a board conversation and a build-team conversation in the same week without changing the story between them.",
  screenFor: [
    "Whether they have run a portfolio rather than a project, and what the funding mechanism was.",
    "Whether they can hold a board and a build team in the same week. Ask for both versions of one decision.",
    "What they stopped, and how they made stopping acceptable.",
    "What the operating model looked like by the time they left, not at the point they arrived.",
  ],
  misHire:
    "A transformation executive with a strategy deck and nothing in production. The narrative is fluent, the roadmap is credible, and eighteen months later the estate contains pilots rather than capabilities.",
  seniority: [
    {
      grade: "Mid",
      change:
        "Not a grade this role is filled at. The portfolio limb is the job, and it does not exist below senior.",
    },
    {
      grade: "Senior",
      change:
        "Runs the portfolio and the governance against a mandate someone else has set.",
    },
    {
      grade: "Lead",
      change:
        "Sets the mandate, owns the funding model and the operating model, and is accountable at board level for what does and does not proceed.",
    },
  ],
  inProgramme:
    "Before the first capability, or the first capability sets the pattern by accident. The dependency is a funding mechanism rather than a technology decision, and the failure mode is appointing the role once several pilots are already running, which makes the first job a clean-up rather than a direction.",
  blueprints: ["sap-s4hana", "oracle-fusion"],
  adjacent: [
    "ai-governance-lead",
    "ai-product-manager",
    "ai-solution-architect",
  ],
  seo: {
    title: "Chief AI Officers and AI Programme Directors | Yallo Talent",
    description:
      "Chief AI Officers and AI programme directors screened on portfolio delivery, funding models and what they stopped. Shortlisted in 72 hours. Middle East · Europe · India.",
  },
};
