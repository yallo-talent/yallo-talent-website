import type { Metadata } from "next";
import Link from "next/link";
import { AiEstateDiagram } from "@/components/blocks/ai/AiEstateDiagram";
import styles from "@/components/blocks/home/Home.module.css";
import { ArrowGlyph } from "@/components/blocks/home/icons";
import { SectionHead } from "@/components/blocks/home/SectionHead";
import { L1BottomCta } from "@/components/blocks/l1/L1PageShell";
import { WhyRail } from "@/components/blocks/platform/WhyRail";
import {
  aiRoleFamilies,
  estateBridge,
  governanceFrameworks,
  screeningPoints,
} from "@/data/ai-talent";
import { stackMatrixAssertion, stacksByGroup } from "@/data/ai-talent/stacks";
import { aiCopy } from "@/data/home/intelligence";
import { buildMetadata } from "@/lib/seo";

/**
 * /ai-talent — the flagship category page, rebuilt to the ratified band order
 * in docs/design/context-ai-talent.md §2.
 *
 * What changed from the first version, and why. That page was assembled
 * entirely from content that already existed: the homepage AI band's six role
 * tiles and four capability areas parked from the retired data-ai page. It was
 * the honest thing to ship at the time, because the alternative was inventing a
 * category page. It is superseded now that the nine role families and the stack
 * matrix exist as real, ratified content with nine L2 pages behind them.
 *
 * Band order is §2 exactly: hero, the gap, nine role families, the stack matrix
 * as the dark signature band, how we screen, where AI sits in a programme,
 * governance, ask. One dark band, against the site ceiling of two.
 *
 * Three things this page deliberately does not do:
 *
 *   R-AI3 — no placement count, client, logo, quotation, date, case study,
 *   scarcity figure or rate. Yallo has real AI placements and the engagements
 *   are confidential proofs of concept, so the claim is made once, at category
 *   level, and says exactly that.
 *
 *   R-AI4 — Anthropic sits inside the matrix at equal weight with the other
 *   providers, plus one depth-proof line in the screening band. "Claude talent"
 *   never leads a heading, a hero or a nav label.
 *
 *   R-AI6 — no sentence claims Yallo is at the frontier, leading, pioneering or
 *   first. The forward-looking read is supposed to come from the breadth and
 *   currency of the matrix and from naming roles that did not exist two years
 *   ago, which is a thing the page shows rather than asserts.
 *
 * Also removed: the "AI Talent Atlas is in preparation" note. A promise of an
 * unpublished asset is a coming-soon state, and those are banned outright.
 */

export const metadata: Metadata = buildMetadata({
  seo: {
    title:
      "AI Talent · Agentic, LLM, MLOps and Governance Specialists | Yallo Talent",
    description:
      "AI talent as a named specialism: nine role families, the stacks we screen against, and the mis-hire pattern for each. Specialist-screened, shortlisted in 72 hours. Middle East · Europe · India.",
  },
  path: "/ai-talent",
});

const whyAi = [
  {
    kicker: "A practice, not a keyword",
    title: "The industry bought AI tools; we built the desk that places people",
    body: "AI talent is a named specialism here with its own screening, not a skill listed among professions. That is the difference between a CV that mentions a model and a contractor who has shipped one.",
    figure: { value: "72%", label: "Employers short of skills" },
  },
  {
    kicker: "Screened on evidence",
    title: "Read by someone who has shipped an agent",
    body: "Screening looks for evaluation discipline, retrieval design and cost control — the things that decide whether an AI build survives contact with production.",
    figure: { value: "2:1", label: "CVs per interview" },
  },
  {
    kicker: "On your existing stack",
    title: "Placed onto the platforms you already run",
    body: "Azure AI, Databricks and the enterprise platforms around them. Yallo Talent staffs work on the systems you own; building new AI-native systems is saasinator's line, not this one.",
  },
  {
    kicker: "In region, at pace",
    title: "Four entities, three demand markets",
    body: "London, Dubai, Riyadh and Bengaluru, so a specialist can start on your paper or ours without an entity of your own.",
    figure: { value: "72h", label: "Brief to shortlist" },
  },
];

export default function AiTalentPage() {
  const matrix = stacksByGroup();

  return (
    <>
      {/* 1 — Hero. */}
      <section className={`${styles.section} ${styles.g1}`}>
        <div className={styles.wrap}>
          <p className="eyebrow">{aiCopy.eyebrow}</p>
          <h1 className={styles.heroHeadline}>{aiCopy.heading}</h1>
          <p className={styles.heroLede}>{aiCopy.lede}</p>

          <div className={styles.ctaRow}>
            <Link className={styles.btnPrimary} href="/brief">
              Start a brief
              <ArrowGlyph />
            </Link>
          </div>
        </div>
      </section>

      {/* 2 — The gap. One figure, and it keeps its source visible: canon §6
          requires a source on every figure, and this is the only sourced one in
          the repo for this claim. */}
      <section className={`${styles.section} ${styles.g2}`} id="ai-gap">
        <div className={styles.wrap}>
          <SectionHead
            eyebrow="The gap"
            heading="These seats stay open because the screen is the hard part."
            lede="The market is short of people, and the shortlist is short of evidence. Both have to be solved, and only one of them is a sourcing problem."
            id="ai-gap-heading"
          />

          <figure className={styles.personaStat}>
            <p className={styles.personaStatValue}>{aiCopy.stat.value}</p>
            <p className={styles.personaStatClaim}>{aiCopy.stat.claim}</p>
            <figcaption className={styles.personaStatSource}>
              {aiCopy.stat.source}
            </figcaption>
          </figure>

          <WhyRail points={whyAi} />
        </div>
      </section>

      {/* 3 — The nine role families. Each routes to its own page; the mis-hire
          line is on the card because it is the part a buyer recognises. */}
      <section className={`${styles.section} ${styles.g2}`} id="ai-families">
        <div className={styles.wrap}>
          <SectionHead
            eyebrow="Role families"
            heading="The AI roles we screen, and the mis-hire behind each one."
            lede="Every family carries its own screening tests and its own failure mode. They are not variations on one job."
            id="ai-families-heading"
          />
          <div className={styles.commitment}>
            {aiRoleFamilies.map((f, i) => (
              <article
                key={f.slug}
                className={`${styles.vow} amb-${(i % 6) + 1}`}
              >
                <span className={styles.panelPetal} aria-hidden="true" />
                <h3>
                  <Link href={`/ai-talent/${f.slug}`}>{f.name}</Link>
                </h3>
                <p className={styles.vowScope}>{f.hero}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4 — The stack matrix. The signature band, and the only dark one. */}
      <section
        className={`${styles.section} ${styles.invert} band-invert amb-2 amb-wash`}
        id="ai-stacks"
      >
        <div className={styles.wrap}>
          <SectionHead
            eyebrow="The stack matrix"
            heading="What we screen against, named."
            lede={stackMatrixAssertion}
            id="ai-stacks-heading"
          />
          {matrix.map((g) => (
            <div key={g.group} className={styles.stackGroup}>
              <h3 className={styles.stackGroupName}>{g.group}</h3>
              <ul className={styles.roleChips}>
                {g.entries.map((e) => (
                  <li key={e.name} className="role-pill">
                    {e.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 5 — How we screen. Point four is the Claude depth proof, R-AI4: once,
          here, and never in a heading. */}
      <section className={`${styles.section} ${styles.g2}`} id="ai-screen">
        <div className={styles.wrap}>
          <SectionHead
            eyebrow="How we screen"
            heading="The screen is designed against the failure, not the job title."
            id="ai-screen-heading"
          />
          <ol className={styles.screenList}>
            {screeningPoints.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ol>
        </div>
      </section>

      {/* 6 — Where AI sits in a programme. The bridge to the platform desks,
          which is the join a competitor cannot copy without the platform depth
          underneath it.

          The estate diagram (§7.1) carries this band now. The row of platform
          buttons underneath it stays: the diagram names the platforms at its
          bottom layer but does not link them, and those links are the actual
          route from this page to the six platform desks. Diagram first, because
          the overlay is the argument; links after, because that is the exit. */}
      <section className={`${styles.section} ${styles.g2}`} id="ai-estate">
        <div className={styles.wrap}>
          <SectionHead
            eyebrow="In the estate"
            heading="AI work lands on the platforms you already run."
            lede="Almost none of this is greenfield. The model layer meets an ERP, a CRM or a data estate, and the people who can hold both are the constraint. Five layers, two concerns that cross all of them, and the role families we place at each."
            id="ai-estate-heading"
          />
          <AiEstateDiagram />
          <ul className={styles.logos}>
            {estateBridge.map((p) => (
              <li key={p.slug}>
                <Link
                  className={styles.btnSecondary}
                  href={`/platforms/${p.slug}`}
                >
                  {p.name}
                  <ArrowGlyph />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 7 — Governance and assurance. Frameworks are NAMED and never
          interpreted: what any of them obliges is legal advice, and stating a
          compliance date would be worse. */}
      <section className={`${styles.section} ${styles.g2}`} id="ai-governance">
        <div className={styles.wrap}>
          <SectionHead
            eyebrow="Governance and assurance"
            heading="Governance roles are screened, not assumed."
            lede="These are the frameworks governance candidates are screened against. Which of them applies to you, and what it obliges, is your counsel's call and not ours."
            id="ai-governance-heading"
          />
          <ul className={styles.roleChips}>
            {governanceFrameworks.map((f) => (
              <li key={f} className="role-pill">
                {f}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 8 — The close. */}
      <L1BottomCta />
    </>
  );
}
