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
      title: s.frontmatter.title,
      summary: s.frontmatter.summary,
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
    <section className={`${styles.section} ${styles.g1}`} id="evidence">
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
