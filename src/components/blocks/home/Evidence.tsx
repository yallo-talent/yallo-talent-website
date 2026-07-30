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
    // The second inverted band, and the right one for it: a dossier inverts its
    // evidence appendix. It previously sat on AITalent, directly below
    // WherePlace, so the two permitted inversions rendered as a single ~2,800px
    // slab and the signal cost twice what it bought.
    <section
      className={`${styles.section} ${styles.invert} band-invert amb-2 amb-wash`}
      id="evidence"
    >
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
