import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "@/components/blocks/home/Home.module.css";
import { ArrowGlyph } from "@/components/blocks/home/icons";
import { SectionHead } from "@/components/blocks/home/SectionHead";
import research from "@/components/blocks/research/Research.module.css";
import { ResearchBars } from "@/components/blocks/research/ResearchBars";
import {
  RESEARCH_BASE,
  researchHref,
  researchPiece,
  researchSlugs,
} from "@/data/research";
import { LTI_AS_AT_DISPLAY, LTI_SOURCE } from "@/data/research/dataset";
import { SYNTHESIS_SLUG } from "@/data/research/synthesis";
import { routeExists } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { taxonomyLabelForHref } from "@/lib/taxonomy-links";

/**
 * One research piece.
 *
 * Cross-link labels are DERIVED from the href through the taxonomy index, and
 * a link whose route does not exist is dropped rather than rendered. Both are
 * the same rule this repository has had to relearn on every taxonomy it owns:
 * a hand-typed label beside an href is the half that drifts, and a link to an
 * unbuilt slug outlives the page it pointed at.
 *
 * The method note repeats on every piece rather than living only on the
 * index. A caveat that appears on some surfaces and not others is a caveat
 * that will be quoted without itself, and these pieces are written to be
 * quoted.
 */

interface RouteParams {
  slug: string;
}

export function generateStaticParams(): RouteParams[] {
  return researchSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const piece = researchPiece(slug);
  if (!piece) return {};
  return buildMetadata({
    seo: { title: piece.seoTitle, description: piece.seoDescription },
    path: researchHref(slug),
  });
}

export default async function ResearchPiecePage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const piece = researchPiece(slug);
  if (!piece) notFound();

  const desks = [piece.deskHref, ...piece.crossLinks]
    .filter((href) => routeExists(href))
    .map((href) => ({ href, label: taxonomyLabelForHref(href) ?? href }));

  return (
    <>
      <section className={`${styles.section} ${styles.g1}`}>
        <div className={styles.wrap}>
          <p className="eyebrow">
            <Link href={RESEARCH_BASE}>Talent research</Link>
          </p>
          <h1 className={styles.heroHeadline}>{piece.title}</h1>
          <p className={research.standfirst}>{piece.standfirst}</p>
          <p className={research.asAt}>
            {LTI_SOURCE} · measured as at {LTI_AS_AT_DISPLAY}
          </p>
        </div>
      </section>

      <section className={`${styles.section} ${styles.g2}`} id="analysis">
        <div className={styles.wrap}>
          {piece.sections.map((section) => (
            <div key={section.heading} className={research.sectionBlock}>
              <h2 className={research.sectionHeading}>{section.heading}</h2>
              <div className={research.body}>
                {section.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              {section.chart ? <ResearchBars chart={section.chart} /> : null}
            </div>
          ))}
        </div>
      </section>

      {desks.length > 0 ? (
        <section className={`${styles.section} ${styles.g2}`} id="desks">
          <div className={styles.wrap}>
            <SectionHead
              eyebrow="The desks"
              heading="Who staffs this."
              lede="The teams this analysis is drawn from, and who you would be talking to."
              id="desks-heading"
            />
            <ul className={styles.roleChips}>
              {desks.map((desk) => (
                <li key={desk.href} className="role-pill">
                  <Link href={desk.href}>{desk.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className={`${styles.section} ${styles.g2}`} id="next">
        <div className={styles.wrap}>
          <SectionHead
            eyebrow="Next"
            heading="The whole picture assembles in one place."
            lede="The cross-market synthesis puts all five families and all three markets together, which is where the corridor argument actually lands."
            id="next-heading"
          />
          <p className={research.coverage}>
            <Link
              className={research.nextLink}
              href={`${RESEARCH_BASE}/${SYNTHESIS_SLUG}`}
            >
              Read the cross-market synthesis
              <ArrowGlyph />
            </Link>
            {" · "}
            <Link className={research.nextLink} href="/brief">
              Start a brief
              <ArrowGlyph />
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
