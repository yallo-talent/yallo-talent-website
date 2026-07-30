import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/components/blocks/home/Home.module.css";
import { ArrowGlyph } from "@/components/blocks/home/icons";
import { SectionHead } from "@/components/blocks/home/SectionHead";
import { WhyRail } from "@/components/blocks/platform/WhyRail";
import { aiCopy, aiRoles } from "@/data/home/intelligence";
import { aiTalentExpertiseSource } from "@/data/pending/ai-talent-source";
import { buildMetadata } from "@/lib/seo";

/**
 * /ai-talent — the named specialism, canon §1 and §3.
 *
 * Built entirely from content that already existed and was already ratified:
 * the homepage AI band's copy, sourced statistic and six role tiles
 * (src/data/home/intelligence.ts), plus the four capability areas lifted
 * verbatim from the former data-ai capability page and parked in
 * src/data/pending/ai-talent-source.ts. Nothing on this page is written for it.
 *
 * It exists because the nav has listed "AI talent" first in the disciplines
 * column all along while the route 404'd — a canon violation shipping on every
 * page. The AI Talent Atlas remains unbuilt and is stated as such rather than
 * linked or implied.
 */

export const metadata: Metadata = buildMetadata({
  seo: {
    title: "AI Talent · Agentic, LLM and MLOps Specialists | Yallo Talent",
    description:
      "AI talent as a named specialism: agentic developers, LLM engineers, evaluation specialists, MLOps and AI governance. Specialist-screened, shortlisted in 72 hours. Middle East · Europe · India.",
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

export default function AiTalentPage() {
  return (
    <>
      <section className={`${styles.section} ${styles.g1}`}>
        <div className={styles.wrap}>
          <p className="eyebrow">{aiCopy.eyebrow}</p>
          <h1 className={styles.heroHeadline}>{aiCopy.heading}</h1>
          <p className={styles.heroLede}>{aiCopy.lede}</p>

          {/* The one statistic, with its source visible — canon §6 requires a
              source on every figure. */}
          {/* No .panelPetal here. It marks a PANEL, and .personaStat is a bare
              flex row with a top rule and no ground — so the petal had nothing to
              bleed off, and because it is positioned at right:-34px on an element
              flush to the content wrap it pushed the document to 374px at a 360px
              viewport, the only horizontal overflow left on the site. The same
              marker is used correctly on the .vow cards below. */}
          <figure className={styles.personaStat}>
            <p className={styles.personaStatValue}>{aiCopy.stat.value}</p>
            <p className={styles.personaStatClaim}>{aiCopy.stat.claim}</p>
            <figcaption className={styles.personaStatSource}>
              {aiCopy.stat.source}
            </figcaption>
          </figure>

          <WhyRail points={whyAi} />

          <div className={styles.ctaRow}>
            <Link className={styles.btnPrimary} href="/brief">
              Start a brief
              <ArrowGlyph />
            </Link>
          </div>
        </div>
      </section>

      {/* The six roles, verbatim from the homepage band. */}
      <section
        className={`${styles.section} ${styles.invert} band-invert amb-1 amb-wash`}
        id="ai-roles"
      >
        <div className={styles.wrap}>
          <SectionHead
            eyebrow="Roles"
            heading="The six seats clients cannot fill from their own bench."
            id="ai-roles-heading"
          />
          <ul className={styles.aiRoles}>
            {aiRoles.map((r) => (
              <li key={r.name} className={styles.aiRole}>
                <h3 className={styles.aiRoleName}>{r.name}</h3>
                <p className={styles.aiRoleScope}>{r.scope}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The four capability areas, ported verbatim from the retired data-ai
          page. Each carries its own roles; nothing is paraphrased. */}
      <section className={`${styles.section} ${styles.g2}`} id="ai-capability">
        <div className={styles.wrap}>
          <SectionHead
            eyebrow="Capability"
            heading="Where the work actually sits."
            lede="Four areas, each with the contractor roles we place into it."
            id="ai-capability-heading"
          />
          <div className={styles.commitment}>
            {aiTalentExpertiseSource.map((c, i) => (
              <article key={c.slug} className={`${styles.vow} amb-${i + 1}`}>
                <span className={styles.panelPetal} aria-hidden="true" />
                <h3>{c.title}</h3>
                <p className={styles.vowScope}>{c.blurb}</p>
                <ul className={styles.roleChips}>
                  {c.roles.map((r) => (
                    <li key={r} className="role-pill">
                      {r}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          {/* The Atlas is unbuilt. Stated, never linked or implied. */}
          <p className={styles.commitmentNote}>
            The AI Talent Atlas — role definitions, scarcity and comparable
            rates — is in preparation and is not published yet.
          </p>
        </div>
      </section>
    </>
  );
}
