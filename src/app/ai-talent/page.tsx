import type { Metadata } from "next";
import Link from "next/link";
import { AiEstateDiagram } from "@/components/blocks/ai/AiEstateDiagram";
import styles from "@/components/blocks/home/Home.module.css";
import { ArrowGlyph } from "@/components/blocks/home/icons";
import { SectionHead } from "@/components/blocks/home/SectionHead";
import { L1BottomCta, L1StatsStrip } from "@/components/blocks/l1/L1PageShell";
import { L1SubNav, L1SubNavScope } from "@/components/blocks/l1/L1SubNav";
import { WhyRail } from "@/components/blocks/platform/WhyRail";
import { HeroAtmosphere } from "@/components/ui/HeroAtmosphere";
import { aiRoleFamilies, screeningPoints } from "@/data/ai-talent";
import { stackMatrixAssertion } from "@/data/ai-talent/stacks";
import { aiCopy } from "@/data/home/intelligence";
import { homeMetrics } from "@/data/metrics";
import { buildMetadata } from "@/lib/seo";

/**
 * /ai-talent — the flagship category page, rebuilt to the ratified band order
 * in docs/design/context-ai-talent.md §2.
 *
 * What changed from the first version, and why. That page was assembled
 * entirely from content that already existed: the homepage AI band's six role
 * tiles and four capability areas parked from the retired data-ai page. It was
 * the honest thing to ship at the time, because the alternative was inventing a
 * category page. It is superseded now that the role families and the stack
 * matrix exist as real, ratified content with an L2 page behind each family.
 *
 * ROUND 6 — three bands became one, and the desk conformed everywhere else.
 *
 * The §3.1 inventory rendered this page beside /capabilities/data-analytics and
 * found the delta nobody had written down: the discipline page renders entirely
 * from `L1PageShell`, and this one hand-composed seven of its eight bands from
 * `Home.module.css`, sharing only the sub-nav and the closing CTA. It was not a
 * variant of the discipline template; it was a separate page wearing the
 * homepage's stylesheet.
 *
 * What changed, in order:
 *   · The stack matrix band is DELETED (decision 2) and its tools moved onto the
 *     estate band, which already held the roles they are screened against.
 *   · The governance band is DELETED and folded into the estate's right rail. It
 *     was a second copy of the same list, and the two disagreed by one entry
 *     while both rendered on this page.
 *   · The hero gained `HeroAtmosphere` and `amb-1`, which every other L1 hero
 *     has had since B3 and this one never did.
 *   · The four published metrics arrived, via the same `L1StatsStrip` every
 *     other L1 uses, so the quarterly refresh reaches this page now.
 *
 * Band order: hero, the metrics, the gap, the role families, how we screen, the
 * estate, ask. Decision 3 leaves the desk exactly three unique elements — the
 * role-family structure, the `adjacentDiscipline` join on the L2s, and the
 * estate band — so it is simpler than it was rather than more special.
 *
 * No sector rail, per decision 4, and none until per-sector AI evidence exists.
 * Zero dark bands now that the matrix has gone, against the site ceiling of two.
 *
 * The count is not written down anywhere on this page or in its metadata, and
 * that is R21 rather than vagueness: a tally is what a machine notices about a
 * list, and it dates the moment the data moves. It dated on 2 Aug 2026, when the
 * tenth family was ratified and "nine role families" was live in three places.
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
      "AI talent as a named specialism: agentic, LLM, retrieval, MLOps and governance role families, the stacks we screen against, and the mis-hire pattern for each. Specialist-screened, shortlisted in 72 hours. Middle East · Europe · India.",
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

/**
 * The sticky section bar's index, per context-round3-rulings.md §3.
 *
 * This page had no sub-nav at all, alone among the long L1s. The ruling took the
 * recommendation over the alternative: rebuilding /ai-talent on `L1PageShell`
 * would have cost the stack matrix and the estate diagram their place, and those
 * are the page's two most distinctive assets. So the shell exports `L1SubNav` and
 * this page consumes it.
 *
 * Labels are the sections' own eyebrows rather than new copy, so the bar and the
 * band it points at cannot say different things. Six real sections; the hero and
 * the close are not indexed, because a bar that indexes the thing you are already
 * looking at and the thing below the fold is a list, not a bar.
 */
const subNavItems = [
  { id: "ai-gap", label: "The gap" },
  { id: "ai-families", label: "Role families" },
  { id: "ai-screen", label: "How we screen" },
  { id: "ai-estate", label: "In the estate" },
];

export default function AiTalentPage() {
  return (
    /* R4: the discipline's identity hue, declared once. Until this landed, the
       page carrying the paid marketing had no `data-identity` at all, so every
       `.amb-N` on it fell through to the POSITIONAL rhythm and it wore whichever
       hue its section index happened to give it — indigo in the hero, teal in the
       invert band. Its own token existed; nothing consumed it.
       A plain div, because the page is a fragment of sibling sections and the
       attribute needs an element to sit on. Layout-neutral: these were already
       block children in this order. */
    <div data-identity="ai-talent">
      {/* 1 — Hero. CONFORMED in round 6: `HeroAtmosphere` and `amb-1`, which
          every other L1 hero has carried since B3 and this one never did. The
          §3.1 inventory measured the delta on the rendered page — the desk's
          hero was a bare `.section` with no atmospheric field at all, so the one
          page carrying the paid marketing opened flatter than the discipline
          pages it sits beside. The field is deterministic from the slug and
          takes its tint from --amb, which `data-identity` resolves to mulberry. */}
      {/* `.section` is already a positioned host for .amb-wash::before, so the
          field needs nothing added to contain it. */}
      <section className={`${styles.section} ${styles.g1} amb-wash amb-1`}>
        <HeroAtmosphere seed="ai-talent" />
        {/* `.aboveAtmosphere` is not optional decoration: the field is
            `z-index: 0`, so a bare `.wrap` beside it paints UNDERNEATH the wash.
            Measured on the first pass — the H1 rendered at roughly the ground's
            own value and the hero read as empty. */}
        <div className={`${styles.wrap} ${styles.aboveAtmosphere}`}>
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

      {/* 2 — The four published metrics. CONFORMED: a standard L1 band the desk
          was missing outright. Canon §6's four, from content/metrics.yaml via the
          same component every other L1 uses, so the quarterly refresh reaches
          this page too. It did not before. */}
      <L1StatsStrip metrics={homeMetrics} />

      {/* The scope wraps the bar AND everything the bar indexes, which is the
          lesson the platform L1 paid for: `position: sticky` travels inside its
          PARENT's box, so wrapping only the bar gives it a parent a few dozen
          pixels tall and no travel at all. Closed after the last indexed
          section, before the close. `L1SubNavScope` rather than the raw class:
          the shell exports the scope as a component and two idioms for one
          wrapper is how the next page comes to use the wrong one. */}
      <L1SubNavScope>
        <L1SubNav items={subNavItems} />

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

        {/* THE STACK MATRIX BAND IS DELETED (decision 2), and the deletion is
          the round's structural fix rather than a trim.

          It was a second band over the same 44 tools under a second grouping,
          and the two groupings disagreed: the matrix said "Cloud AI platforms"
          while the estate band's layer prose named the same products as model
          hosting. One set of tools under two taxonomies cannot both be true.
          The tools carry a `layer` and a `tier` now and arrive on the estate
          band, which is where the roles they are screened against already were.

          `stackMatrixAssertion` did not go with it. R-AI3's line travels with
          the data it governs, so it leads the merged band below. */}

        {/* 4 — How we screen. Point four is the Claude depth proof, R-AI4: once,
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

        {/* 5 — The estate. The desk's ONE unique band after round 6, and it now
          holds everything three bands used to hold between them.

          It absorbed the stack matrix (decision 2) and the governance band. The
          governance band was the same defect found twice: `governanceFrameworks`
          held five frameworks, the estate's right rail held four, ISO/IEC 23894
          was in one copy and not the other, and BOTH rendered on this page. One
          list now, on the rail it belongs to.

          The row of platform buttons is gone too. It existed because the diagram
          named the platforms at its bottom layer without linking them; layer 01
          derives the desks from `platformsIndex` and the names are the links, so
          the row was a second copy of the same exit. */}
        <section className={`${styles.section} ${styles.g2}`} id="ai-estate">
          <div className={styles.wrap}>
            <SectionHead
              eyebrow="In the estate"
              heading="AI work lands on the platforms you already run."
              lede={`Almost none of this is greenfield. The model layer meets an ERP, a CRM or a data estate, and the people who can hold both are the constraint. Five layers, two concerns that cross all of them, the tools at each and the role families we place there. ${stackMatrixAssertion}`}
              id="ai-estate-heading"
            />
            <AiEstateDiagram />
          </div>
        </section>
      </L1SubNavScope>

      {/* 8 — The close. */}
      <L1BottomCta />
    </div>
  );
}
