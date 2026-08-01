import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "@/components/blocks/home/Home.module.css";
import { ArrowGlyph } from "@/components/blocks/home/icons";
import { SectionHead } from "@/components/blocks/home/SectionHead";
import {
  aiRoleFamily,
  aiRoleFamilyName,
  aiRoleFamilySlugs,
} from "@/data/ai-talent";
import { stacksForFamily } from "@/data/ai-talent/stacks";
import { BLUEPRINT_BASE, blueprintArchetype } from "@/data/blueprint";
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
 * The stacks band reads from the SAME source as the L1 matrix, filtered by this
 * family. A per-page stack list would be the same data written ten times.
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

  const stacks = stacksForFamily(f.slug);
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

      {/* 5 — Stacks, filtered from the L1's matrix. */}
      {stacks.length > 0 ? (
        <section className={`${styles.section} ${styles.g2}`} id="stacks">
          <div className={styles.wrap}>
            <SectionHead
              eyebrow="Stacks"
              heading="What we screen this role against."
              lede="A subset of the full matrix. Naming a stack says we can test for it, not that we have delivered on it."
              id="stacks-heading"
            />
            {stacks.map((g) => (
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
            <div className={styles.ctaRow}>
              <Link className={styles.btnSecondary} href="/ai-talent#ai-stacks">
                The full matrix
                <ArrowGlyph />
              </Link>
            </div>
          </div>
        </section>
      ) : null}

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

      {/* 8 — Adjacent families, three maximum. */}
      {f.adjacent.length > 0 ? (
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
