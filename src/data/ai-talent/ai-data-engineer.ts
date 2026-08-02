import type { AiRoleFamily } from "./types";

/**
 * The tenth family, ratified by Sumeet 2 Aug 2026 (context-round3-rulings.md §2,
 * question 3). It was proposed and deliberately withheld in the previous round
 * rather than shipped on the assumption it would be waved through.
 *
 * The gap it closes: retrieval was split across the Prompt and LLM Engineer and
 * the Agentic AI Developer, so no family owned it. Ownership has been MOVED here
 * from llm-engineer rather than duplicated. The Prompt and LLM Engineer still
 * consumes retrieval and is still screened on telling a retrieval fault from a
 * prompt fault, because that diagnosis is the join between the two roles; what
 * it no longer claims is the design and the pipeline.
 *
 * `blueprints` is deliberately empty. The three archetypes under
 * /intelligence/programme-staffing-blueprint carry no AI or retrieval content to
 * check an association against, and types.ts is explicit that empty renders
 * nothing and no archetype is invented to fill the band. Flagged for Sumeet.
 */
export const aiDataEngineer: AiRoleFamily = {
  slug: "ai-data-engineer",
  name: "AI Data Engineer, Retrieval and RAG Pipelines",
  shortName: "AI Data Engineer",
  hero: "Builds and owns the retrieval layer: the corpus, the chunking, the index and the pipeline that keeps all three current.",
  whatItDoes:
    "This role owns what the model is allowed to know. It covers ingestion from the systems that hold the documents, the chunking and metadata decisions that determine whether a passage can be found at all, the embedding and index choices underneath, and the pipeline that reflects a change in the source rather than requiring a rebuild. Most retrieval disappointment is a data problem wearing a model problem's clothes: the answer was wrong because the passage was never retrievable, not because the prompt was weak. The part that separates this role from a conventional data engineer is that correctness here is measured on whether the right passage surfaced, not on whether the load completed. Permissions are part of the job rather than adjacent to it, because a retrieval layer that ignores who may see which document is a data-leak path with a chat interface on it.",
  screenFor: [
    "How they chose a chunking strategy on a real corpus, what the first version got wrong, and what they measured to know.",
    "Whether they can show a retrieval evaluation set and say what recall looked like before and after a change.",
    "How document permissions survive the pipeline, and what happens when a source document's access changes after it was indexed.",
    "What their re-index and freshness path is, and whether a source change reaches the index without a human remembering.",
  ],
  misHire:
    "A capable warehouse engineer who treats the index as another load target. The pipeline runs, the dashboards are green, and nobody has measured whether the right passage comes back, because the definition of done was arrival rather than retrievability. The tell is an interview with no retrieval evaluation in it.",
  seniority: [
    {
      grade: "Mid",
      change:
        "Builds and maintains ingestion and indexing against a design and an evaluation set someone else owns.",
    },
    {
      grade: "Senior",
      change:
        "Owns the retrieval design: chunking, metadata, index choice and the freshness path, and the evaluation that decides whether a change to any of them ships.",
    },
    {
      grade: "Lead",
      change:
        "Sets the grounding standard across teams, owns the permission model the retrieval layer inherits, and holds recall as sources and access rules change.",
    },
  ],
  inProgramme:
    "Blocked by data access rather than by model choice, so it starts at whatever point the programme can get at the documents, which is usually earlier than the plan assumes and later than it should be. This is the role whose absence is discovered during evaluation, when the prompt layer has been tuned twice against a corpus that cannot answer the question. Keep it retained after go-live: sources change, access rules change, and an index that is correct on the cutover weekend drifts from that day onward.",
  blueprints: [],
  adjacent: ["llm-engineer", "ai-solution-architect", "mlops-engineer"],
  /* The return leg of the Data Science cross-link, decision 7. The AI Data
     Engineer is the role the two desks genuinely share, and the Data Science
     desk already names it as the role briefed from here — so this is the one
     family the reverse link belongs on, rather than on /ai-talent as a whole.
     No label: the sub-desk's title is resolved from the capability data. */
  adjacentDiscipline: { capability: "data-analytics", fn: "data-science" },
  seo: {
    title: "AI Data Engineers, Retrieval and RAG Pipelines | Yallo Talent",
    description:
      "AI data engineers screened on chunking decisions, retrieval evaluation, document permissions and index freshness, not warehouse throughput. Shortlisted in 72 hours. Middle East · Europe · India.",
  },
};
