import { clientLogoFor } from "@/data/home/client-logos";
import { evidenceCopy, testimonial } from "@/data/home/intelligence";
import { getAllCaseStudies } from "@/lib/content";
import { CaseRail } from "./CaseRail";
import styles from "./Home.module.css";
import { SectionHead } from "./SectionHead";

/**
 * The case-study rail, read from content/case-studies/ rather than a hardcoded
 * list — so what the homepage promises and what the site can serve cannot drift
 * apart.
 *
 * Titles and bodies are Yallo's own published words, ported by
 * scripts/extract-case-studies.mjs. Nothing here is written or paraphrased.
 */
export function Evidence() {
  // Canon §8 names the eight studies that seed the rail, and their order is a
  // deliberate argument rather than a consequence of publication dates. Anything
  // unfeatured still lives on the hub.
  const studies = getAllCaseStudies()
    .filter((s) => s.frontmatter.published !== false && s.frontmatter.featured)
    .sort(
      (a, b) => (a.frontmatter.featured ?? 99) - (b.frontmatter.featured ?? 99),
    )
    .map((s) => ({
      slug: `/case-studies/${s.frontmatter.slug}`,
      // Cards take the budgeted display line and the devendored excerpt where
      // they exist; the verbatim title and summary still own the detail page
      // and metadata. Excerpts are compression of the body only.
      title: s.frontmatter.cardTitle ?? s.frontmatter.title,
      summary: s.frontmatter.excerpt ?? s.frontmatter.summary,
      client: s.frontmatter.clientPublic
        ? s.frontmatter.client
        : "Undisclosed enterprise",
      // Only a named client gets a mark; an undisclosed one must not be
      // identifiable by its logo.
      logo: s.frontmatter.clientPublic
        ? clientLogoFor(s.frontmatter.client)
        : undefined,
      meta: [
        s.frontmatter.engagement,
        s.frontmatter.platform,
        s.frontmatter.region,
      ]
        .filter(Boolean)
        .join(" · "),
    }));

  return (
    // NOT an inverted band any more, and this is canon arithmetic rather than a
    // change of mind. §5 permits at most two dark bands per page. In the light
    // register the homepage was running four dark regions — #place (inverted),
    // this one (inverted), .close (which hardcodes --dk, so it is dark in BOTH
    // registers) and the footer — measured at 3,617px, about a third of the
    // document, with the last third flipping register four times.
    //
    // Of the three non-chrome candidates this is the one to give up. #place is a
    // data surface and inverts for that reason; .close plus the footer read as
    // one closing block and inverting only half of it would be worse. Case
    // studies are editorial content and read perfectly well on paper — the
    // earlier note below is still true about WHERE this band sat, just no longer
    // about whether it should be one.
    //
    // Kept for the record: this band previously sat on AITalent, directly below
    // WherePlace, so the two permitted inversions rendered as a single ~2,800px
    // slab and the signal cost twice what it bought.
    <section className={`${styles.section} ${styles.g2} amb-2`} id="evidence">
      <div className={styles.wrap}>
        <SectionHead
          eyebrow={evidenceCopy.eyebrow}
          heading={evidenceCopy.heading}
          id="evidence-heading"
        />
        <CaseRail studies={studies} testimonial={testimonial} />
      </div>
    </section>
  );
}
