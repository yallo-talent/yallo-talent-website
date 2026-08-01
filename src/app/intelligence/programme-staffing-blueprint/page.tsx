import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/components/blocks/home/Home.module.css";
import { ArrowGlyph } from "@/components/blocks/home/icons";
import { SectionHead } from "@/components/blocks/home/SectionHead";
import { BLUEPRINT_BASE, blueprintArchetypes } from "@/data/blueprint";
import { buildMetadata } from "@/lib/seo";

/**
 * The Programme Staffing Blueprint index.
 *
 * Open and indexed, deliberately. The SEO surface is the point of the asset and
 * there is nothing real to withhold: v1 publishes the team shape and the
 * sequence, and the quantities that would justify a gate do not exist yet.
 *
 * One line on method, three archetypes, and a close that asks rather than
 * promises a file. No fourth archetype is added to round the set.
 */

export const metadata: Metadata = buildMetadata({
  seo: {
    title: "Programme Staffing Blueprint | Yallo Talent",
    description:
      "How enterprise programmes are staffed: the streams, the phases, who is on when, and the roles that are always scoped too late. SAP S/4HANA, Oracle Fusion and Salesforce multi-cloud.",
  },
  path: BLUEPRINT_BASE,
});

export default function BlueprintIndexPage() {
  return (
    <>
      <section className={`${styles.section} ${styles.g1}`}>
        <div className={styles.wrap}>
          <p className="eyebrow">Intelligence</p>
          <h1 className={styles.heroHeadline}>Programme Staffing Blueprint.</h1>
          <p className={styles.heroLede}>
            What an enterprise programme actually needs on it, phase by phase.
            The streams, the sequence, and the roles that are reliably scoped
            too late.
          </p>
        </div>
      </section>

      <section className={`${styles.section} ${styles.g2}`} id="why">
        <div className={styles.wrap}>
          <SectionHead
            eyebrow="Why it exists"
            heading="Staffing plans are built from the plan, not from the programme."
            lede="A method tells you the phases. It does not tell you who has to be in the room during each of them, or which role will be discovered late enough to move a date. That is the part we are asked for most often, so it is the part we published."
            id="why-heading"
          />
          <p className={styles.methodNote}>
            Each archetype below is drawn from programmes we have staffed, and
            names phases the way the vendor method names them. Team sizes,
            effort and hiring times are held back rather than estimated.
          </p>
        </div>
      </section>

      <section className={`${styles.section} ${styles.g2}`} id="archetypes">
        <div className={styles.wrap}>
          <SectionHead
            eyebrow="Archetypes"
            heading="Pick the shape closest to your programme."
            id="archetypes-heading"
          />
          <div className={styles.commitment}>
            {blueprintArchetypes.map((a, i) => (
              <article key={a.slug} className={`${styles.vow} amb-${i + 1}`}>
                <span className={styles.panelPetal} aria-hidden="true" />
                <h3>
                  <Link href={`${BLUEPRINT_BASE}/${a.slug}`}>{a.name}</Link>
                </h3>
                <p className={styles.vowScope}>{a.hero}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.g2}`} id="ask">
        <div className={styles.wrap}>
          <SectionHead
            eyebrow="Ask"
            heading="Ask for the planning pack for your programme."
            lede="Tell us the shape you are running and we will come back with the staffing plan against it."
            id="ask-heading"
          />
          <div className={styles.ctaRow}>
            <Link className={styles.btnPrimary} href="/brief?source=blueprint">
              Start a brief
              <ArrowGlyph />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
