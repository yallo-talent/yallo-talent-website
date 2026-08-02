import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AiEstateDiagram } from "@/components/blocks/ai/AiEstateDiagram";
import styles from "@/components/blocks/home/Home.module.css";
import { ArrowGlyph } from "@/components/blocks/home/icons";
import { SectionHead } from "@/components/blocks/home/SectionHead";
import {
  aiRoleFamily,
  aiRoleFamilyName,
  aiRoleFamilySlugs,
} from "@/data/ai-talent";
import { stackMatrixAssertion } from "@/data/ai-talent/stacks";
import { BLUEPRINT_BASE, blueprintArchetype } from "@/data/blueprint";
import { disciplineLink } from "@/lib/capabilities";
import { buildMetadata } from "@/lib/seo";

/**
 * /ai-talent/{roleFamily} — one AI role family.
 *
 * Band order is context §3 exactly, and the shape deliberately mirrors the
 * existing L2s so no new template exists to keep in step.
 *
 * The two bands competitors do not have are three and four: what we screen for,
 * and the common mis-hire. They are the reason this page is worth reading, so
 * they sit above the stacks rather than below them.
 *
 * The estate band is the SAME COMPONENT as the L1's, with `family` set. Round 6
 * made that literal: it was previously the same data source rendered by a second
 * piece of markup, which is one copy short of a per-page stack list and drifts
 * the same way. One component, one prop.
 *
 * Blueprint cross-links are resolved through `blueprintArchetype`, so a link
 * only renders when the archetype actually exists. That is not defensive
 * styling: these pages were written before the Blueprint routes, and a slug
 * that has not been built yet must render as nothing rather than as a 404.
 *
 * No rates, at any grade. The seniority band says what CHANGES between mid,
 * senior and lead, which is the useful half and the half that does not need
 * Sumeet's data.
 */

interface RouteParams {
  family: string;
}

export function generateStaticParams(): RouteParams[] {
  return aiRoleFamilySlugs().map((family) => ({ family }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { family } = await params;
  const f = aiRoleFamily(family);
  if (!f) return {};
  return buildMetadata({ seo: f.seo, path: `/ai-talent/${family}` });
}

export default async function AiRoleFamilyPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { family } = await params;
  const f = aiRoleFamily(family);
  if (!f) notFound();

  /* Undefined when the family declares no discipline, and also when it declares
     one that does not resolve — an unbuilt sub-desk renders nothing rather than
     a dead link. */
  const discipline = f.adjacentDiscipline
    ? disciplineLink(f.adjacentDiscipline)
    : undefined;
  const blueprints = f.blueprints
    .map((slug) => blueprintArchetype(slug))
    .filter((a) => a !== null);

  return (
    <>
      {/* 1 — Hero. */}
      <section className={`${styles.section} ${styles.g1}`}>
        <div className={styles.wrap}>
          <p className="eyebrow">AI talent</p>
          <h1 className={styles.heroHeadline}>{f.name}</h1>
          <p className={styles.heroLede}>{f.hero}</p>
          <div className={styles.ctaRow}>
            <Link className={styles.btnPrimary} href="/brief">
              Start a brief
              <ArrowGlyph />
            </Link>
          </div>
        </div>
      </section>

      {/* 2 — What the role actually does. */}
      <section className={`${styles.section} ${styles.g2}`} id="what">
        <div className={styles.wrap}>
          <SectionHead
            eyebrow="The role"
            heading="What the job actually is."
            id="what-heading"
          />
          <p className={styles.methodNote}>{f.whatItDoes}</p>
        </div>
      </section>

      {/* 3 — What we screen for. The differentiating band. */}
      <section className={`${styles.section} ${styles.g2}`} id="screen">
        <div className={styles.wrap}>
          <SectionHead
            eyebrow="What we screen for"
            heading="The questions that separate the field."
            lede="Asked by someone who has built the thing, and designed to catch this role's specific failure rather than to confirm a general impression."
            id="screen-heading"
          />
          <ol className={styles.screenList}>
            {f.screenFor.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </div>
      </section>

      {/* 4 — The common mis-hire. The band competitors do not have. */}
      <section
        className={`${styles.section} ${styles.invert} band-invert amb-5 amb-wash`}
        id="mis-hire"
      >
        <div className={styles.wrap}>
          <SectionHead
            eyebrow="The common mis-hire"
            heading="The one you have probably already made."
            id="mis-hire-heading"
          />
          <p className={styles.misHire}>{f.misHire}</p>
        </div>
      </section>

      {/* 5 — The estate, filtered to this family (§3.3).

        THE SAME COMPONENT AS THE L1, WITH ONE PROP. Not a second data path and
        not a separate filtered list: `AiEstateDiagram` takes `family` and passes
        it through `toolsForZone`, so a tool added on the L1 reaches this page by
        existing rather than by being copied here.

        Layers this family works at are lit; the rest stay present and dimmed.
        Absence would be the cheaper rendering and the wrong one — the estate
        context is the point of the band, and a filtered list of five tools with
        no estate around them says nothing about where the role sits.

        What this replaces: a "Stacks" band that re-rendered the L1's groups for
        this family and closed with a link back to the full matrix. The matrix
        band no longer exists, so that link pointed at a dead anchor the moment
        decision 2 landed. The estate is the full view now, and it is on the
        page rather than one navigation away. */}
      <section className={`${styles.section} ${styles.g2}`} id="stacks">
        <div className={styles.wrap}>
          <SectionHead
            eyebrow="In the estate"
            heading="Where this role works, and what we screen it against."
            lede={`The layers this family works at, lit. ${stackMatrixAssertion}`}
            id="stacks-heading"
          />
          <AiEstateDiagram family={f.slug} />
        </div>
      </section>

      {/* 6 — Seniority. Grades, never rates. */}
      <section className={`${styles.section} ${styles.g2}`} id="seniority">
        <div className={styles.wrap}>
          <SectionHead
            eyebrow="Seniority"
            heading="What changes between mid, senior and lead."
            lede="The grade is a description of what the person owns, not a band. Rates come with the shortlist."
            id="seniority-heading"
          />
          <dl className={styles.phaseMatrix}>
            {f.seniority.map((s) => (
              <div key={s.grade} className={styles.phaseRow}>
                <dt className={styles.phaseRowName}>{s.grade}</dt>
                <dd className={styles.phaseRowOn}>{s.change}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 7 — Where the role sits in a programme, with the Blueprint archetypes
          that carry it. */}
      <section className={`${styles.section} ${styles.g2}`} id="programme">
        <div className={styles.wrap}>
          <SectionHead
            eyebrow="In a programme"
            heading="When this role is needed, and what blocks it."
            id="programme-heading"
          />
          <p className={styles.methodNote}>{f.inProgramme}</p>
          {blueprints.length > 0 ? (
            <ul className={styles.logos}>
              {blueprints.map((a) => (
                <li key={a.slug}>
                  <Link
                    className={styles.btnSecondary}
                    href={`${BLUEPRINT_BASE}/${a.slug}`}
                  >
                    {a.name}
                    <ArrowGlyph />
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>

      {/* 8 — Adjacent families, three maximum, plus at most one discipline.

          The discipline link is decision 7's return leg: Data Science links out
          to AI Talent from its `twin` band, and until now nothing came back.
          It sits in this band rather than in one of its own because it answers
          the band's own question — what this role gets confused with — and the
          answer for the AI Data Engineer genuinely is a role on another desk.

          `disciplineLink` resolves the label from the capability data, so the
          band cannot name a desk by a name that desk no longer uses, and
          resolves to undefined rather than rendering a link to a route that
          does not exist. */}
      {f.adjacent.length > 0 || discipline ? (
        <section className={`${styles.section} ${styles.g2}`} id="adjacent">
          <div className={styles.wrap}>
            <SectionHead
              eyebrow="Adjacent"
              heading="The roles this one is confused with."
              id="adjacent-heading"
            />
            <ul className={styles.logos}>
              {f.adjacent.slice(0, 3).map((slug) => (
                <li key={slug}>
                  <Link
                    className={styles.btnSecondary}
                    href={`/ai-talent/${slug}`}
                  >
                    {aiRoleFamilyName(slug)}
                    <ArrowGlyph />
                  </Link>
                </li>
              ))}
              {discipline ? (
                <li key={discipline.href}>
                  <Link className={styles.btnSecondary} href={discipline.href}>
                    {discipline.label}
                    <ArrowGlyph />
                  </Link>
                </li>
              ) : null}
            </ul>
          </div>
        </section>
      ) : null}

      {/* 9 — Ask. */}
      <section className={`${styles.section} ${styles.g2}`} id="ask">
        <div className={styles.wrap}>
          <SectionHead
            eyebrow="Ask"
            heading={`Send the brief, get a screened ${f.shortName} shortlist.`}
            lede="Tell us the programme, the stack and the timeline."
            id="ask-heading"
          />
          <div className={styles.ctaRow}>
            <Link
              className={styles.btnPrimary}
              href={`/brief?source=ai-${f.slug}`}
            >
              Start a brief
              <ArrowGlyph />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
