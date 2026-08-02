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
 *
 * ---
 *
 * AUDITED 2 Aug 2026 against context-round3-rulings.md §2 q7 and §5.5.5.
 *
 * The ruling: do NOT restore these four on /ai-talent, because ten role families
 * is more depth than four capability areas and these belonged to a retired
 * discipline. But do not lose them either. Check each against the seven Data &
 * Analytics expertise cards and port anything genuinely absent into that
 * discipline, which is where it now belongs.
 *
 * Three of the four are already covered and need no port:
 *
 *   ML Engineering & MLOps  → the `mlops-engineer` AI role family, in more depth
 *                             than this card ever carried.
 *   GenAI Engineering       → split across `llm-engineer`, `agentic-ai-developer`
 *                             and, as of today, `ai-data-engineer`, which took
 *                             the RAG limb this card named.
 *   AI Safety & Governance  → the `ai-governance-lead` family, with the
 *                             frameworks named rather than interpreted.
 *
 * The fourth, Data Science, is GENUINELY ABSENT, and it is not ported here
 * either. Applied ML, forecasting and decisioning appear in none of the ten AI
 * role families and none of the seven Data & Analytics cards.
 *
 * It is not ported because porting it properly is blocked rather than hard. All
 * seven Data & Analytics cards carry `tools`, which is what generates the L2
 * route: a card without them is a dead end, and adding the only dead end on that
 * page would reintroduce precisely the defect that was fixed on
 * /industries/finance this morning. There is no ratified source for a Data
 * Science desk's products and roles, and inventing them to fill a card is what
 * this file was created to avoid.
 *
 * So the gap is named rather than filled, which is canon §9. It needs one
 * authored desk from Sumeet, the same shape as the finance depth document, and
 * then it lands as an eighth Data & Analytics card. Flagged in the relay.
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
