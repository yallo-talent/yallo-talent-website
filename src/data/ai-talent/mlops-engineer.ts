import type { AiRoleFamily } from "./types";

export const mlopsEngineer: AiRoleFamily = {
  slug: "mlops-engineer",
  name: "MLOps and LLMOps Engineer",
  shortName: "MLOps Engineer",
  hero: "Makes AI systems deployable, observable and reversible: pipelines, evaluation in CI, monitoring and cost control.",
  whatItDoes:
    "This role turns a working model into something an operations team can own. Deployment pipelines, evaluation that runs automatically rather than when someone remembers, monitoring that watches output quality and spend as well as uptime, and a route back to the previous version that has actually been used. On generative systems the cost limb matters more than teams expect, because spend scales with usage rather than with headcount and nobody notices until the invoice. Reversibility is the test: a system that cannot be rolled back is not in production, it is merely live.",
  screenFor: [
    "Whether they have run a rollback in anger, and what made it necessary.",
    "What they monitor beyond uptime. Output quality and cost per interaction, or neither.",
    "Whether evaluation runs automatically in CI or by hand before a release.",
    "How they detect drift, and what threshold triggers a human.",
  ],
  misHire:
    "A DevOps engineer who has containerised a model and never watched one degrade. The pipeline is competent, the observability stops at the infrastructure layer, and the first quality regression is reported by a user.",
  seniority: [
    {
      grade: "Mid",
      change:
        "Runs and extends existing pipelines and dashboards. Executes a rollback under a runbook someone else wrote.",
    },
    {
      grade: "Senior",
      change:
        "Owns the deployment and evaluation pipeline, defines what is monitored, and sets the thresholds that page a human.",
    },
    {
      grade: "Lead",
      change:
        "Owns the operating model for AI in production across teams, including cost governance and the standard every service is held to before release.",
    },
  ],
  inProgramme:
    "Stood up early or paid for late. The pattern that hurts is treating this as a deployment-phase role: the evaluation harness and the rollback path have to exist before the first release, not after it. Retained permanently, because unlike a build role there is no point at which the work is finished.",
  blueprints: ["salesforce-multi-cloud"],
  adjacent: [
    "ai-evaluation-specialist",
    "ai-solution-architect",
    "agentic-ai-developer",
  ],
  seo: {
    title: "MLOps and LLMOps Engineers | Yallo Talent",
    description:
      "MLOps and LLMOps engineers screened on rollback, automated evaluation, drift detection and cost control. Shortlisted in 72 hours. Middle East · Europe · India.",
  },
};
