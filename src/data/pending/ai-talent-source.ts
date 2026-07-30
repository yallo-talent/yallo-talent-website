/**
 * AI capability content lifted verbatim from the former data-ai capability page.
 *
 * Canon §5 renames that page `data-analytics` and narrows it to data
 * engineering, analytics, BI and migration. AI is a named specialism with its
 * own destination, so this is the source material for /ai-talent rather than
 * content to be deleted. Nothing here is rewritten — it is the published copy,
 * parked until that route is built.
 *
 * Not exported into any registry: /ai-talent does not exist yet, and a
 * half-wired page is worse than an honest absence.
 */
import type { L1ExpertiseCard } from "@/data/l1/types";

export const aiTalentExpertiseSource: L1ExpertiseCard[] = [
  {
    slug: "ml-engineering",
    num: "03",
    title: "ML Engineering & MLOps",
    icon: "spark",
    blurb: "Training pipelines, model serving and observability.",
    roles: ["ML Engineer", "MLOps Platform Engineer", "Model Serving Lead"],
  },
  {
    slug: "genai-engineering",
    num: "05",
    title: "GenAI Engineering",
    icon: "spark",
    blurb: "LLM apps, RAG systems, agentic workflows.",
    roles: [
      "LLM Application Engineer",
      "GenAI Solution Architect",
      "Prompt / Evals Engineer",
    ],
  },
  {
    slug: "data-science",
    num: "08",
    title: "Data Science",
    icon: "spark",
    blurb: "Applied ML, forecasting and decisioning.",
    roles: ["Data Scientist", "Applied ML Scientist", "Decisioning Lead"],
  },
  {
    slug: "ai-safety-governance",
    num: "10",
    title: "AI Safety & Governance",
    icon: "government",
    blurb: "Responsible AI, model risk and evals.",
    roles: [
      "AI Governance Lead",
      "Model Risk Analyst",
      "Responsible AI Architect",
    ],
  },
];
