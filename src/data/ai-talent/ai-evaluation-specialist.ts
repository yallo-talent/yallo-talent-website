import type { AiRoleFamily } from "./types";

export const aiEvaluationSpecialist: AiRoleFamily = {
  slug: "ai-evaluation-specialist",
  name: "AI Prompt QA and Evaluation Specialist",
  shortName: "AI Evaluation Specialist",
  hero: "Builds the test sets and judging methods that say whether the system is good enough to ship, and keeps saying so after each change.",
  whatItDoes:
    "Evaluation is the discipline that makes a probabilistic system releasable. This role designs the datasets, decides how outputs are judged and by whom, and turns that into something that runs on every change rather than once before launch. The judging question is the hard one: model judges are cheap and biased, human judges are expensive and inconsistent, and the specialist has to know when each is appropriate and what to do when they disagree. Their real output is a number the programme trusts enough to make a release decision on.",
  screenFor: [
    "Whether they can design a dataset for a task they have not seen before. Give them one in the interview.",
    "How they handle disagreement between a human judge and a model judge.",
    "Whether they measure regression against a baseline, not only accuracy against a target.",
    "What they do about the cases that are rare, expensive and the reason the system would be pulled.",
  ],
  misHire:
    "A manual tester applying scripted test cases to a probabilistic system. Every run produces a different result, the scripts are marked as failures, and within a month the suite is being ignored because it cries wolf.",
  seniority: [
    {
      grade: "Mid",
      change:
        "Builds and runs test sets against an established evaluation method.",
    },
    {
      grade: "Senior",
      change:
        "Designs the evaluation method itself, including the judging approach, and owns the release recommendation.",
    },
    {
      grade: "Lead",
      change:
        "Sets the evaluation standard across the portfolio and defines what evidence a system must produce before it is allowed near users.",
    },
  ],
  inProgramme:
    "Needed before the first release and consistently under-scoped until the week of it. The dependency is subject-matter access: the test set is only as good as the people who can say what a correct answer looks like, and their time has to be booked in advance. Retained, because the evaluation has to run again on every model change.",
  blueprints: [],
  adjacent: ["llm-engineer", "mlops-engineer", "ai-governance-lead"],
  seo: {
    title: "AI Evaluation and Prompt QA Specialists | Yallo Talent",
    description:
      "AI evaluation specialists screened on dataset design, judging methods and regression measurement for probabilistic systems. Shortlisted in 72 hours. Middle East · Europe · India.",
  },
};
