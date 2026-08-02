# Context — AI Talent L1 and L2 family

**v1.0 · 1 August 2026 · Chat lens, ratified by Sumeet 1 Aug 2026 · Project GTM.01**
Authority: subordinate to `docs/design/yallo-talent-CANON.md`. Where this file and canon disagree, canon wins.
Purpose: everything Code needs to build the AI talent family without inventing anything.

---

## 1. Rulings

**R-AI1 · Route map. Amended 1 Aug 2026, see `context-capabilities-parity-round.md` §7.** AI Talent is now the **seventh capability discipline and the first in the order**, not a standalone hub. `/ai-talent` remains the canonical route and the 301 destination for `emerging-technologies`; `/capabilities/ai-talent` redirects to it. L2s stay at `/ai-talent/{roleFamily}`, nine pages. The page now carries the full Data & Analytics discipline treatment plus the AI estate diagram, its label is "AI Talent" rather than "Artificial Intelligence", and its hue is mulberry. **Ownership transferred to the capabilities session.**

**R-AI2 · No new taxonomy for AI vendors.** Anthropic, OpenAI, Bedrock and the rest do **not** become `/platforms/*` pages. Canon §3 fixes six platforms and states that ServiceNow and AWS are not platform destinations; adding model vendors would break that and dilute the enterprise-programme wedge. AI stacks render as a **governed matrix** on the L1 and as a stacks band inside each L2. Vendor pages may be added later only where search demand justifies one, as a canon amendment.

**R-AI3 · Claim strength.** Yallo has real AI placements. Engagements are confidential proofs of concept, so no client may be named and no count may be published.
- Permitted at category level, once, on the L1: that Yallo has placed AI specialists into enterprise programmes and that those engagements are under non-disclosure.
- Forbidden everywhere: a number of placements, a client name, a logo, a quotation, a date, a case study, a scarcity figure, a rate.
- Per-vendor placement claims are gated on a data field, `placementHistory: boolean`, default `false` on every stack entry. Code sets none of them to `true`. Sumeet flips them.
- Naming a tool in the matrix asserts only that Yallo screens for it. The matrix must carry one line stating that.

**R-AI4 · Claude stays depth-proof.** Canon: "AI talent" is the category, "Claude talent" is depth-proof only, never the organising claim. Anthropic appears inside the matrix at equal weight with other providers, plus one depth-proof line in the screening band. It never leads a heading, hero or nav label.

**R-AI5 · Correction to carry.** "Azure AI Fabric" is not a product. Two separate Microsoft products are meant: **Azure AI Foundry** (the AI platform, formerly Azure AI Studio) and **Microsoft Fabric** (the data platform). Both appear, in different groups. Getting this wrong is the exact error a buyer would notice.

**R-AI6 · Forward-looking without overclaiming.** The forward-looking read comes from the *breadth and currency of the matrix* and from naming roles that did not exist two years ago. It does not come from adjectives. No sentence may claim Yallo is at the frontier, leading, pioneering or first.

---

## 2. What the L1 has to do

`/ai-talent` is the flagship category page. Its job, in order: name the category, prove Yallo screens at depth across roles and stacks, show the matrix nobody else publishes, route to the nine role families, route to a brief.

Band order:

| # | Band | Content | Register |
|---|---|---|---|
| 1 | Hero | One claim about placing AI specialists on enterprise programmes in the Middle East, Europe and India. One primary ask | Light |
| 2 | The gap | Why these roles are hard to fill, in the buyer's terms. One sourced figure only if a source already exists in the repo, otherwise no figure | Light |
| 3 | Nine role families | The §4 set as a real device, each routing to its L2 | Light |
| 4 | The stack matrix | §5, six groups. The signature band of this page | **Dark** |
| 5 | How we screen AI roles | §6. Where the Claude depth-proof line sits | Light |
| 6 | Where AI sits in a programme | The bridge to the platform desks: AI work lands on SAP, Oracle, Microsoft, Salesforce and Informatica estates, and links to those pages | Light |
| 7 | Governance and assurance | §7. Evaluation, safety and regulatory roles as first-class, not an afterthought | Light |
| 8 | Start a brief | The close, programme-shaped | Light |

Two dark bands maximum per page is the site rule; this page uses one. Petal signature and PetalPlate imagery only, per `DESIGN.md`. No stock photography, no people imagery, no vendor logos rendered in full colour (One Marker Rule, canon §5).

---

## 3. What each L2 has to do

`/ai-talent/{roleFamily}`. Structure mirrors the existing L2 shell so no new template is needed:

1. Hero: the role in one line, no superlatives.
2. What the role actually does, three to five sentences of substance.
3. **What we screen for**: the §4 screening tests, as the differentiating band.
4. **The common mis-hire**: the failure mode a buyer has already lived through. This is the band competitors do not have.
5. Stacks: the subset of §5 relevant to this role, from the same data source as the L1 matrix.
6. Seniority grades: what changes between mid, senior and lead. No rates.
7. Where this role sits in a programme: phase and dependency, cross-linking the Programme Staffing Blueprint archetypes.
8. Adjacent role families: internal links, three maximum.
9. Ask.

Depth target: real content, not boilerplate around a swapped noun. If a role family cannot carry its own §4 substance, do not ship its page; report it instead. D12 applies: fewer, better.

---

## 4. The nine role families

Set taken from the legacy corpus role taxonomy, which is real and already in the repo. Do not add a tenth without Sumeet. A candidate tenth, "AI Data Engineer, retrieval and RAG pipelines", is proposed and **not** ratified; leave it out and flag it in the relay.

| Slug | Role family | What it does | What we screen for | The common mis-hire |
|---|---|---|---|---|
| `agentic-ai-developer` | Agentic AI Developer | Builds systems where a model plans, calls tools and acts across steps rather than answering a single prompt | Evidence of a tool-calling system in production, not a demo. How they bound an agent's authority. What they do when a step fails halfway. Whether they can describe a retry, a rollback and an audit trail | A strong application developer who has wired one API call to a model and calls it an agent. No failure semantics, no evaluation, no idea what the system does when the tool times out |
| `llm-engineer` | Prompt and LLM Engineer | Designs, tests and maintains the prompt and context layer, including retrieval, and holds output quality over time | A worked example of an output that got worse after a model change and what they did. Whether they version prompts. Whether they can distinguish a retrieval problem from a prompt problem | Someone who is fluent in a chat interface. Fluency is not engineering; ask for the regression they caught |
| `ai-solution-architect` | AI and GenAI Solution Architect | Owns the target architecture: which model, hosted where, grounded on what, governed how, integrated into which enterprise estate | Can they defend a build-versus-buy call in front of a CIO. Do they price and design for latency, cost and data residency. Do they know the client's platform estate, not just the model layer | A cloud architect with a certification and no shipped AI system, or a data scientist who has never had to satisfy security review |
| `mlops-engineer` | MLOps and LLMOps Engineer | Makes AI systems deployable, observable and reversible: pipelines, evaluation in CI, monitoring, cost control | Whether they have run a rollback. What they monitor beyond uptime. Whether evaluation runs automatically or by hand | A DevOps engineer who has containerised a model and never watched one drift |
| `ai-evaluation-specialist` | AI Prompt QA and Evaluation Specialist | Builds the test sets and judging methods that say whether the system is good enough to ship, and keeps saying so after each change | Whether they can design a dataset for a task they have not seen. How they handle disagreement between human and model judges. Whether they measure regression, not just accuracy | A manual tester applying scripted test cases to a probabilistic system |
| `ai-governance-lead` | AI Governance, Risk and Ethics Lead | Owns policy, risk classification, documentation and audit for AI in production, against the regulation that applies | Whether they can classify a use case under a real framework and say what that obliges. Whether they have said no to a launch. Whether they work with engineers or only produce documents | A compliance generalist who can cite frameworks and cannot read a system diagram |
| `ai-product-manager` | AI Product Manager | Owns the problem, the adoption and the measurement of value for an AI capability inside a business process | Whether they killed a feature that demoed well. How they measure value when the output is probabilistic. Whether they understand the cost per interaction | A product manager who has run a pilot that never reached a business process |
| `ai-experience-designer` | Generative AI Experience Designer | Designs the interaction for systems that are uncertain: how confidence, correction, hand-off and refusal are shown to a user | Whether they design for the wrong answer, not just the right one. Whether they have tested with users who distrust the system | A visual designer producing a chat window |
| `chief-ai-officer` | Chief AI Officer and AI Programme Director | Owns the enterprise AI portfolio: sequencing, funding, governance, delivery and the operating model around it | Whether they have run a portfolio, not a project. Whether they can hold a board and a build team in the same week. What they stopped | A transformation executive with a strategy deck and nothing in production |

---

## 5. The stack matrix

Six groups. Each entry carries `name`, `group`, `roleFamilies[]`, `placementHistory: false`. Rendered as the dark signature band on the L1, filtered per role family on each L2. Grayscale marks only where a mark is used at all; text entries are acceptable and preferred where no clean mark exists.

| Group | Entries |
|---|---|
| **Model providers** | Anthropic (Claude), OpenAI, Google (Gemini), Meta (Llama), Mistral, Cohere |
| **Cloud AI platforms** | Azure AI Foundry, AWS Bedrock, AWS SageMaker, Google Vertex AI, Databricks Mosaic AI, Snowflake Cortex, Microsoft Fabric, SAP AI Core and Joule, Oracle AI Services, Salesforce Agentforce |
| **Agent and orchestration frameworks** | LangChain, LangGraph, LlamaIndex, CrewAI, AutoGen, Semantic Kernel, Model Context Protocol, Pydantic AI |
| **Evaluation, observability and model hubs** | Hugging Face, LangSmith, Langfuse, Ragas, MLflow, Weights and Biases, DeepEval |
| **Retrieval and vector stores** | pgvector, Pinecone, Weaviate, Qdrant, Elasticsearch, Azure AI Search |
| **Automation and integration** | n8n, Power Automate, Zapier, Make, UiPath, MuleSoft, Informatica IDMC |

Note the deliberate design of the second row: the AI platforms of the enterprise vendors Yallo already staffs. That is the join between this page and the platform desks, and it is the part no competitor can copy without the platform depth.

One line must accompany the matrix stating that these are the stacks Yallo screens against. It must not read as a claim of delivery on all of them.

---

## 6. How we screen AI roles

The band that carries the differentiation. Four points, no more:

1. Screening is done by someone who has built the thing, not by keyword match against a CV.
2. Every role has a mis-hire pattern, listed in §4, and the screen is designed to catch it.
3. Evidence of production, not demonstration: what broke, what it cost, what was rolled back.
4. Depth proof: Yallo's own delivery work runs on Claude-native systems, so the screen for agentic and prompt roles is built from practice. One line only, per R-AI4.

---

## 7. Governance and assurance band

Real frameworks, named accurately, no interpretation of what any of them obliges: EU AI Act, ISO/IEC 42001, ISO/IEC 23894, NIST AI Risk Management Framework, OWASP Top 10 for LLM Applications. Present as what governance roles are screened against. Do not summarise legal obligations and do not state compliance dates.

---

## 8. Data contract

Follow the existing `roles.ts` and L1 patterns; `roles.ts` is the truth for role data. Add:

- `src/data/ai-talent/index.ts` — the nine role families, ordered as §4.
- `src/data/ai-talent/{slug}.ts` — one file per family, fields matching the §3 band order.
- `src/data/ai-talent/stacks.ts` — the §5 matrix, single source for both L1 and L2.

Every stack entry: `{ name, group, roleFamilies, placementHistory: false }`. No `metrics`, no `scarcity`, no `rate` fields on anything in this family until Sumeet supplies data.

---

## 9. Forbidden

- Any number without a source already in the repo.
- Any client name, logo, quotation, testimonial, case study or date.
- Any scarcity index, time-to-hire, salary or rate.
- Any invented role family, vendor product name or certification.
- Any claim that Yallo is leading, pioneering, first or at the frontier.
- Banned vocabulary per canon §2, and any sentence that counts the items below it.
