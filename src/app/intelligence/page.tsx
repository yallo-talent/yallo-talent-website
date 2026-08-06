import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/components/blocks/home/Home.module.css";
import { ArrowGlyph } from "@/components/blocks/home/icons";
import { SectionHead } from "@/components/blocks/home/SectionHead";
import { BLUEPRINT_BASE } from "@/data/blueprint";
import { RESEARCH_BASE } from "@/data/research";
import { buildMetadata } from "@/lib/seo";

/**
 * /intelligence — the hub the nav has pointed at all along.
 *
 * The nav's Intelligence column carried an item at this href with
 * `published: false`, which renders as plain text rather than a link, so no
 * dead link ever shipped. It also meant the group's own destination did not
 * exist: three items in a column, no page behind the column.
 *
 * This is deliberately thin. It routes to what is real and says nothing
 * about anything else — no roadmap, no "more coming", no placeholder card
 * for an asset that has not been written. A hub that lists what exists is
 * honest; a hub that lists what exists and a promise is not.
 */

export const metadata: Metadata = buildMetadata({
  seo: {
    title: "Intelligence | Yallo Talent",
    description:
      "Published talent intelligence: the Programme Staffing Blueprint, and briefings on hiring across the Middle East, Europe and India.",
  },
  path: "/intelligence",
});

const entries = [
  {
    href: RESEARCH_BASE,
    title: "Talent research",
    copy: "What the enterprise platform talent pools across the UK, Saudi Arabia and the UAE actually look like, family by family, and what each one means for staffing a programme.",
  },
  {
    href: BLUEPRINT_BASE,
    title: "Programme Staffing Blueprint",
    copy: "The team shape and the sequence for an enterprise programme: streams, phases, who is on when, and the roles that are always scoped too late. Three archetypes.",
  },
  {
    href: "/insights",
    title: "Insights",
    copy: "Hiring notes and analysis from the desks, across the Middle East, Europe and India.",
  },
  {
    href: "/ai-talent",
    title: "AI talent",
    copy: "The AI role families, the stacks we screen against, and the mis-hire pattern behind each one.",
  },
];

export default function IntelligencePage() {
  return (
    <>
      <section className={`${styles.section} ${styles.g1}`}>
        <div className={styles.wrap}>
          <p className="eyebrow">Intelligence</p>
          <h1 className={styles.heroHeadline}>What we publish.</h1>
          <p className={styles.heroLede}>
            The parts of how we staff programmes that are useful to you whether
            or not you ever send us a brief.
          </p>
        </div>
      </section>

      <section className={`${styles.section} ${styles.g2}`} id="published">
        <div className={styles.wrap}>
          <SectionHead
            eyebrow="Published"
            heading="Open, and written to be used."
            id="published-heading"
          />
          <div className={styles.commitment}>
            {entries.map((e, i) => (
              <article key={e.href} className={`${styles.vow} amb-${i + 1}`}>
                <span className={styles.panelPetal} aria-hidden="true" />
                <h3>
                  <Link href={e.href}>{e.title}</Link>
                </h3>
                <p className={styles.vowScope}>{e.copy}</p>
              </article>
            ))}
          </div>

          <div className={styles.ctaRow}>
            <Link className={styles.btnSecondary} href="/brief">
              Start a brief
              <ArrowGlyph />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
