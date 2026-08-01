import type { AiRoleFamily } from "./types";

export const agenticAiDeveloper: AiRoleFamily = {
  slug: "agentic-ai-developer",
  name: "Agentic AI Developer",
  shortName: "Agentic AI Developer",
  hero: "Builds systems where a model plans, calls tools and acts across steps, rather than answering one prompt at a time.",
  whatItDoes:
    "An agentic developer writes the layer between a model and the systems it is allowed to touch. That means tool definitions, the loop that decides what to call next, and the boundaries on what the agent may do without a human. Most of the work is not the happy path: it is what happens when a tool times out, returns something unexpected, or succeeds on step four of six. The role sits closer to distributed-systems engineering than to data science, and the people who are good at it usually came from one of those two directions rather than from prompt writing.",
  screenFor: [
    "Evidence of a tool-calling system in production, not a demonstration. Ask which tools, called by what, and who could see the results.",
    "How they bounded the agent's authority. Which actions needed a human, and how that gate was enforced rather than requested.",
    "What the system does when a step fails halfway. A specific incident, not a policy.",
    "Whether they can describe a retry, a rollback and an audit trail for the same run.",
  ],
  misHire:
    "A strong application developer who has wired one API call to a model and calls the result an agent. No failure semantics, no evaluation, and no answer to what the system does when the tool times out. The build demonstrates well and then cannot be given permission to touch anything that matters.",
  seniority: [
    {
      grade: "Mid",
      change:
        "Implements tools and flows against an agreed design. Needs the authority boundaries and the failure handling specified for them.",
    },
    {
      grade: "Senior",
      change:
        "Owns the loop design and the failure semantics. Decides what the agent may do unattended and defends that line in a security review.",
    },
    {
      grade: "Lead",
      change:
        "Sets the pattern across several agents, owns the evaluation and rollback story, and is the person who says an agent is not ready to be given write access.",
    },
  ],
  inProgramme:
    "Arrives once the target architecture is agreed and the systems the agent will call are known, which in practice means after the solution architect and alongside the integration work rather than before it. The dependency that catches programmes out is authorisation: an agent that acts needs an identity and a permission model, and that is owned elsewhere. Retain into hypercare, because agent behaviour changes when the underlying model does.",
  blueprints: ["salesforce-multi-cloud"],
  adjacent: ["llm-engineer", "ai-solution-architect", "mlops-engineer"],
  seo: {
    title: "Agentic AI Developers | Yallo Talent",
    description:
      "Agentic AI developers screened on production tool-calling systems, failure semantics and bounded agent authority. Shortlisted in 72 hours. Middle East · Europe · India.",
  },
};
