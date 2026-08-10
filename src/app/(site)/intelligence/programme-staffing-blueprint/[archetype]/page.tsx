import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "@/components/blocks/home/Home.module.css";
import { ArrowGlyph } from "@/components/blocks/home/icons";
import { SectionHead } from "@/components/blocks/home/SectionHead";
import {
  BLUEPRINT_BASE,
  blueprintArchetype,
  blueprintSlugs,
} from "@/data/blueprint";
import { derivePlatformList } from "@/lib/platforms";
import { buildMetadata } from "@/lib/seo";

/**
 * One Programme Staffing Blueprint archetype.
 *
 * Band order is context §2 exactly: hero, the phases, the team by stream, who
 * is on in which phase, the roles that always get under-scoped, what we screen
 * for on the hardest roles, cross-links to the desks that staff it, the ask.
 *
 * Band 4 is the signature device and the one dark band on the page, which is
 * also the ceiling these pages are given.
 *
 * The close is a REQUEST, not a download. There is no PDF, so promising one
 * would be the plainest kind of dishonesty available on a lead-capture page.
 * The link carries the archetype in a `source` parameter so the brief knows
 * which planning pack was asked for, and it captures the same lead.
 *
 * Nothing here carries a quantity. Not FTE, not duration, not time-to-hire, not
 * scarcity, not a rate, not a percentage. The data interface has no field for
 * any of them — see the note at the foot of src/data/blueprint/index.ts for
 * what v2 needs and who supplies it.
 */

interface RouteParams {
  archetype: string;
}

export function generateStaticParams(): RouteParams[] {
  return blueprintSlugs().map((archetype) => ({ archetype }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { archetype } = await params;
  const a = blueprintArchetype(archetype);
  if (!a) return {};
  return buildMetadata({ seo: a.seo, path: `${BLUEPRINT_BASE}/${archetype}` });
}

export default async function BlueprintArchetypePage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { archetype } = await params;
  const a = blueprintArchetype(archetype);
  if (!a) notFound();

  return (
    <>
      {/* 1 — Hero. */}
      <section className={`${styles.section} ${styles.g1}`}>
        <div className={styles.wrap}>
          <p className="eyebrow">Programme Staffing Blueprint</p>
          <h1 className={styles.heroHeadline}>{a.name}</h1>
          <p className={styles.heroLede}>{a.hero}</p>
        </div>
      </section>

      {/* 2 — The phases, named as the vendor's own method names them. Renaming
          them to a house term would make the page unrecognisable to the person
          it is written for. */}
      <section className={`${styles.section} ${styles.g2}`} id="phases">
        <div className={styles.wrap}>
          <SectionHead
            eyebrow="The phases"
            heading={
              a.methodName
                ? `Phases, as ${a.methodName} names them.`
                : "Phases, as the method names them."
            }
            lede="Named the way the programme names them, so the shape below maps onto the plan you already have."
            id="phases-heading"
          />
          <ol className={styles.bpPhaseRail}>
            {a.phases.map((p) => (
              <li key={p.name} className={styles.bpPhaseStep}>
                <span className={styles.bpPhaseName}>{p.name}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 3 — The team, by stream. The substance band. */}
      <section className={`${styles.section} ${styles.g2}`} id="streams">
        <div className={styles.wrap}>
          <SectionHead
            eyebrow="The team"
            heading="Who the programme needs, by stream."
            lede="Grouped the way a programme is actually staffed and governed, rather than by seniority or by contract type."
            id="streams-heading"
          />
          <div className={styles.commitment}>
            {a.streams.map((s, i) => (
              <article
                key={s.name}
                className={`${styles.vow} amb-${(i % 6) + 1}`}
              >
                <span className={styles.panelPetal} aria-hidden="true" />
                <h3>{s.name}</h3>
                <ul className={styles.roleChips}>
                  {s.roles.map((r) => (
                    <li key={r} className="role-pill">
                      {r}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4 — Who is on when. The signature device, and the one dark band. */}
      <section
        className={`${styles.section} ${styles.invert} band-invert amb-3 amb-wash`}
        id="who-is-on"
      >
        <div className={styles.wrap}>
          <SectionHead
            eyebrow="Sequence"
            heading="Who is on in which phase."
            lede="The sequence is the part that gets planned last and hurts first."
            id="who-is-on-heading"
          />
          <dl className={styles.phaseMatrix}>
            {a.phases.map((p) => (
              <div key={p.name} className={styles.phaseRow}>
                <dt className={styles.phaseRowName}>{p.name}</dt>
                <dd className={styles.phaseRowOn}>{p.on}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 5 — The band a programme director screenshots. */}
      <section className={`${styles.section} ${styles.g2}`} id="under-scoped">
        <div className={styles.wrap}>
          <SectionHead
            eyebrow="Under-scoped"
            heading="The roles that are always scoped too late."
            lede="Each of these is recoverable when it is planned and expensive when it is discovered."
            id="under-scoped-heading"
          />
          <dl className={styles.underScoped}>
            {a.underScoped.map((u) => (
              <div key={u.item} className={styles.underScopedRow}>
                <dt className={styles.underScopedItem}>{u.item}</dt>
                <dd className={styles.underScopedWhy}>{u.consequence}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 6 — What we screen for on the hardest roles here. */}
      <section className={`${styles.section} ${styles.g2}`} id="screen">
        <div className={styles.wrap}>
          <SectionHead
            eyebrow="What we screen for"
            heading="The hardest roles on this shape, and the evidence we ask for."
            lede={a.screenHardest.evidence}
            id="screen-heading"
          />
          <ul className={styles.roleChips}>
            {a.screenHardest.roles.map((r) => (
              <li key={r} className="role-pill">
                {r}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 7 — The desks that staff it. */}
      <section className={`${styles.section} ${styles.g2}`} id="desks">
        <div className={styles.wrap}>
          <SectionHead
            eyebrow="The desks"
            heading="Where these people come from."
            id="desks-heading"
          />
          <ul className={styles.logos}>
            {/* Name and order from `platformsIndex`. Which desks an archetype
                draws on stays authored; only their names derive. */}
            {derivePlatformList(a.desks, (d) => d.slug).map((d) => (
              <li key={d.slug}>
                <Link
                  className={styles.btnSecondary}
                  href={`/platforms/${d.slug}`}
                >
                  {d.name}
                  <ArrowGlyph />
                </Link>
              </li>
            ))}
            <li>
              <Link className={styles.btnSecondary} href={BLUEPRINT_BASE}>
                All archetypes
                <ArrowGlyph />
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* 8 — The ask. A request, never a download. */}
      <section className={`${styles.section} ${styles.g2}`} id="ask">
        <div className={styles.wrap}>
          <SectionHead
            eyebrow="Ask"
            heading="Ask for the planning pack for your programme."
            lede="Tell us the shape you are running and we will come back with the staffing plan against it."
            id="ask-heading"
          />
          <div className={styles.ctaRow}>
            <Link
              className={styles.btnPrimary}
              href={`/brief?source=blueprint-${a.slug}`}
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
