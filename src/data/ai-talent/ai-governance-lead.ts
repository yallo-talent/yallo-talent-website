import type { AiRoleFamily } from "./types";

export const aiGovernanceLead: AiRoleFamily = {
  slug: "ai-governance-lead",
  name: "AI Governance, Risk and Ethics Lead",
  shortName: "AI Governance Lead",
  hero: "Owns policy, risk classification, documentation and audit for AI in production, against the regulation that applies.",
  whatItDoes:
    "This role decides what a use case is, under whichever framework the organisation is held to, and what that classification obliges. It covers the documentation that has to exist before a system is allowed near a customer, the register of what is running and who owns it, and the audit trail that proves the controls were real. The useful version of the role works with the engineers rather than at them, because a control that cannot be implemented is a control that will be quietly skipped. The screening question that separates the field is whether they have ever stopped a launch.",
  screenFor: [
    "Whether they can classify a use case under a real framework and say precisely what that classification obliges.",
    "Whether they have said no to a launch, and what happened next.",
    "Whether they work with engineers or only produce documents. Ask them to read a system diagram.",
    "How they keep a register current once the first wave of enthusiasm has passed.",
  ],
  misHire:
    "A compliance generalist who can cite frameworks and cannot read a system diagram. The policy is written, the register is accurate on the day it is published, and nothing in engineering changes as a result.",
  seniority: [
    {
      grade: "Mid",
      change:
        "Maintains the register and the documentation against an agreed classification method.",
    },
    {
      grade: "Senior",
      change:
        "Owns the classification method and the control set, and holds the gate on individual launches.",
    },
    {
      grade: "Lead",
      change:
        "Owns the governance operating model across the portfolio and is accountable to the board for it.",
    },
  ],
  inProgramme:
    "Engaged at design, not at deployment. Classification changes what has to be built, so a governance lead appointed after build produces rework rather than assurance. This is the role most often bolted on late, and the cost lands on the engineering team rather than on the function that was late.",
  blueprints: [],
  adjacent: [
    "ai-solution-architect",
    "ai-evaluation-specialist",
    "chief-ai-officer",
  ],
  seo: {
    title: "AI Governance, Risk and Ethics Leads | Yallo Talent",
    description:
      "AI governance leads screened on real framework classification, control design and working with engineering rather than around it. Shortlisted in 72 hours. Middle East · Europe · India.",
  },
};
