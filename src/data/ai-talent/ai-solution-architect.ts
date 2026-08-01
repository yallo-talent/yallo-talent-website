import type { AiRoleFamily } from "./types";

export const aiSolutionArchitect: AiRoleFamily = {
  slug: "ai-solution-architect",
  name: "AI and GenAI Solution Architect",
  shortName: "AI Solution Architect",
  hero: "Owns the target architecture: which model, hosted where, grounded on what, governed how, and integrated into which enterprise estate.",
  whatItDoes:
    "The architect makes the decisions that are expensive to reverse. Model and hosting choice, where data sits and under whose jurisdiction, how the system is grounded, and how it reaches the platforms the business already runs. On an enterprise programme the last of those is the hard part, because the AI layer is rarely the constraint and the estate almost always is. This role has to be fluent in both, and has to survive a security review and a cost conversation on the same design.",
  screenFor: [
    "Can they defend a build-versus-buy call in front of a CIO, including the case they rejected.",
    "Do they design for latency, cost per interaction and data residency, or only for capability.",
    "Do they know the client's platform estate rather than only the model layer. Ask what the integration actually lands on.",
    "What they have taken out of a design after security review, and what it cost.",
  ],
  misHire:
    "A cloud architect with a certification and no shipped AI system, or a data scientist who has never had to satisfy a security review. Both produce a design that is coherent on a slide and stalls at the first governance gate.",
  seniority: [
    {
      grade: "Mid",
      change:
        "Designs a component against an agreed target architecture. Not yet the person defending the estate-level call.",
    },
    {
      grade: "Senior",
      change:
        "Owns the target architecture for a capability end to end, including hosting, residency and the integration into the estate.",
    },
    {
      grade: "Lead",
      change:
        "Holds the architecture across a portfolio, sets the reference patterns, and is accountable for the decisions that are expensive to reverse.",
    },
  ],
  inProgramme:
    "First in and last out. Present from discovery, because the hosting and residency decisions gate everything downstream, and retained through deployment because the design is tested by integration rather than by build. The common sequencing error is appointing this role after the model has already been chosen, which turns architecture into justification.",
  blueprints: ["sap-s4hana", "oracle-fusion", "salesforce-multi-cloud"],
  adjacent: ["mlops-engineer", "ai-governance-lead", "agentic-ai-developer"],
  seo: {
    title: "AI and GenAI Solution Architects | Yallo Talent",
    description:
      "AI solution architects screened on hosting, residency, cost and integration into a real enterprise estate, not the model layer alone. Shortlisted in 72 hours. Middle East · Europe · India.",
  },
};
