/**
 * Static index of L1 pages for the three hub pages (/industries,
 * /platforms, /capabilities). Kept as a lightweight registry
 * — the actual L1PageData lives in each page's data file.
 */

/**
 * A taxonomy label — the display name of a sector, platform or capability
 * ("Retail & Consumer", "Retail").
 *
 * Branded on purpose. `L1PageData.title` holds the first line of the page's H1
 * ("Retail tech contractors,") and it was being consumed as a taxonomy label in
 * seven places, so every L2 breadcrumb, sidebar, back link and `<title>` read
 * "Retail tech contractors," — trailing comma included. The brand means a hero
 * string can no longer be passed where a label is expected: only this module
 * mints TaxonomyLabel values, and it mints them from `label`/`short`.
 */
declare const taxonomyLabelBrand: unique symbol;
export type TaxonomyLabel = string & { readonly [taxonomyLabelBrand]: true };

export interface L1IndexEntry {
  slug: string;
  label: TaxonomyLabel;
  short: TaxonomyLabel;
  category: "industries" | "platforms" | "capabilities";
  tagline: string;
  /**
   * Canonical route, where it is NOT `/{category}/{slug}`.
   *
   * One entry needs this: AI Talent is a capability discipline whose canonical
   * URL is `/ai-talent`, because it is the campaign landing path and was already
   * canon §3's redirect target for `emerging-technologies`.
   * `/capabilities/ai-talent` 301s to it. Without this field the hub would link
   * to the redirect rather than to the page, putting a 301 hop on the primary
   * nav link of the one discipline carrying paid marketing spend.
   */
  href?: string;
}

/**
 * THE SECTOR INDEX. Label AND order both derive from here, everywhere sectors
 * are rendered.
 *
 * ORDER IS DATA, ratified in context-round4-rulings.md §4.3. It is the mega
 * menu's, and it is canonical: Retail & Consumer · Manufacturing & Logistics ·
 * Banking & Financial Services · Government & Public Sector · Healthcare & Life
 * Sciences · Telco & Media · Education & Universities. The array order below IS
 * that order, so a surface that maps over this array is correct by construction
 * and a surface that keeps its own array is wrong by construction. Reordering
 * this array reorders the mega menu, the footer and every "where we deploy"
 * rail; no surface expresses a sector order of its own. The derivation lives in
 * src/lib/sectors.ts.
 *
 * WHY THIS NEEDED A RULING. The "where we deploy" rail on the capability desks
 * was wrong three ways at once: a different order from the mega menu, "Public
 * Sector" against the menu's "Government & Public Sector", and a singular where
 * the menu said plural. Three faults, one cause, and it was the SIXTH
 * hand-copied taxonomy of the round. A rail that retypes a label cannot stay in
 * step with the label, because renaming a source does not rename a copy.
 *
 * ONE NAMING DECISION, taken under delegated authority and recorded here so it
 * is not relitigated: the plural, HEALTHCARE & LIFE SCIENCES, is the
 * conventional term and is ratified. The mega menu's singular "Healthcare & Life
 * Science" was corrected to match it, not the other way round.
 *
 * Education & Universities is the seventh and last, and it is last because the
 * mega menu puts it last, not because it is newest.
 */
export const industriesIndex: L1IndexEntry[] = [
  {
    slug: "retail",
    label: "Retail & Consumer" as TaxonomyLabel,
    short: "Retail" as TaxonomyLabel,
    category: "industries",
    tagline: "Commerce, POS and supply-chain talent for retail programmes.",
  },
  {
    slug: "manufacturing",
    label: "Manufacturing & Logistics" as TaxonomyLabel,
    short: "Manufacturing" as TaxonomyLabel,
    category: "industries",
    tagline: "ERP, Industry 4.0 and warehouse/transport specialists.",
  },
  {
    slug: "finance",
    label: "Banking & Financial Services" as TaxonomyLabel,
    short: "Banking" as TaxonomyLabel,
    category: "industries",
    tagline: "Core banking, payments, risk and cloud platform specialists.",
  },
  {
    slug: "government",
    label: "Government & Public Sector" as TaxonomyLabel,
    short: "Government" as TaxonomyLabel,
    category: "industries",
    tagline: "Digital government, smart-services and citizen-facing platforms.",
  },
  {
    slug: "healthcare",
    label: "Healthcare & Life Sciences" as TaxonomyLabel,
    short: "Healthcare" as TaxonomyLabel,
    category: "industries",
    tagline: "Clinical systems, regulated data and compliance-grade delivery.",
  },
  {
    slug: "telco",
    label: "Telco & Media" as TaxonomyLabel,
    short: "Telco" as TaxonomyLabel,
    category: "industries",
    tagline: "OSS/BSS, network and data engineering for telco transformation.",
  },
  {
    slug: "education",
    label: "Education & Universities" as TaxonomyLabel,
    short: "Education" as TaxonomyLabel,
    category: "industries",
    tagline:
      "Student information systems, learning platforms and campus IT specialists.",
  },
];

export const platformsIndex: L1IndexEntry[] = [
  {
    slug: "sap",
    label: "SAP" as TaxonomyLabel,
    short: "SAP" as TaxonomyLabel,
    category: "platforms",
    tagline: "S/4HANA, FICO, MM, SD and integration specialists.",
  },
  {
    slug: "oracle",
    label: "Oracle" as TaxonomyLabel,
    short: "Oracle" as TaxonomyLabel,
    category: "platforms",
    tagline: "Fusion Cloud ERP/EPM/HCM/SCM and E-Business Suite specialists.",
  },
  {
    slug: "microsoft",
    label: "Microsoft" as TaxonomyLabel,
    short: "Microsoft" as TaxonomyLabel,
    category: "platforms",
    tagline: "Dynamics 365, Azure, Power Platform, M365 engineers.",
  },
  {
    slug: "salesforce",
    label: "Salesforce" as TaxonomyLabel,
    short: "Salesforce" as TaxonomyLabel,
    category: "platforms",
    tagline: "Sales, Service, Commerce, Marketing and integration talent.",
  },
  {
    slug: "blue-yonder",
    label: "Blue Yonder" as TaxonomyLabel,
    short: "Blue Yonder" as TaxonomyLabel,
    category: "platforms",
    tagline: "WMS, TMS, Luminate and demand-planning specialists.",
  },
  {
    slug: "workday",
    label: "Workday" as TaxonomyLabel,
    short: "Workday" as TaxonomyLabel,
    category: "platforms",
    tagline: "HCM, Payroll, Recruiting and Adaptive Planning specialists.",
  },
  {
    /* Informatica was missing from this index entirely, which is why its row was
       the only one in the mega-menu panel with no support line under it. Sumeet
       noticed it twice. The platform itself has been real since the canon §3
       amendment of 1 Aug 2026 (R-INF1) and has nine authored desks in
       platforms/authored.ts; only the taxonomy entry was absent, so every surface
       that reads labels and taglines from here had nothing to render.

       The tagline names real products from those nine desks and nothing else,
       and is written to the register its six siblings already use: the products
       a buyer would recognise, then "specialists". */
    slug: "informatica",
    label: "Informatica" as TaxonomyLabel,
    short: "Informatica" as TaxonomyLabel,
    category: "platforms",
    tagline:
      "IDMC, data integration, MDM, data quality and governance specialists.",
  },
];

/**
 * The seven disciplines, in canon §3 order with the six-to-seven amendment of
 * 1 Aug 2026 applied: AI Talent is the seventh discipline and the first in the
 * order.
 *
 * `short` is a SHORT FORM OF THE DISCIPLINE LABEL and nothing else. Three of
 * these carried a specialist-desk name instead, which is the fault S1 reported:
 * canon §3 runs two taxonomies that share labels, so when Relay v6.0 renamed the
 * DESK "Data & Analytics" to "Data & AI", the discipline's `short` was renamed
 * with it by string match. The discipline then rendered as "Data & AI" in every
 * slot that takes a short label, thirteen times on its own L1.
 *
 * The other two were orphans of the `emerging-technologies` retirement: DevOps &
 * Platform Engineering wore the retired "Digital & DevOps" desk name, and
 * Testing & Quality Engineering wore "Emerging" plus the retired discipline's
 * whole tagline about blockchain and quantum — a description of a discipline that
 * no longer exists, attached to one that does.
 *
 * scripts/check-taxonomy.mjs now fails the build if a desk name resolves into
 * this array, so the rename cannot cross the taxonomies again.
 */
export const capabilitiesIndex: L1IndexEntry[] = [
  {
    slug: "ai-talent",
    label: "AI Talent" as TaxonomyLabel,
    short: "AI Talent" as TaxonomyLabel,
    category: "capabilities",
    tagline:
      "Agentic AI, LLM, MLOps, evaluation and AI governance specialists.",
    href: "/ai-talent",
  },
  {
    slug: "data-analytics",
    label: "Data & Analytics" as TaxonomyLabel,
    short: "Data & Analytics" as TaxonomyLabel,
    category: "capabilities",
    /* "GenAI" and "ML" leave this line: with AI Talent as its own discipline
       they describe the neighbouring domain, and two rows competing for the same
       word tells a buyer nothing about which desk to brief. */
    tagline:
      "Data engineering, analytics engineering, BI and data platform specialists.",
  },
  {
    slug: "cloud-infrastructure",
    label: "Cloud & Infrastructure" as TaxonomyLabel,
    short: "Cloud" as TaxonomyLabel,
    category: "capabilities",
    tagline:
      "AWS, Azure and Google Cloud architects, platform and network engineers.",
  },
  {
    /**
     * Label is "Cybersecurity & Risk"; the SLUG stays `cybersecurity`.
     *
     * Renamed 2 Aug 2026 to match the `X & Y` shape the rest of the taxonomy
     * uses, with cybersecurity first because that is where the weight is: seven
     * of the eight sub-desks are security proper and GRC is the eighth. Every
     * other pair in this file leads with the dominant term (Data & Analytics,
     * Cloud & Infrastructure, Testing & Quality Engineering), so "Risk &
     * Cybersecurity" would have inverted the convention and demoted the word
     * buyers search for.
     *
     * "& Risk" is earned rather than decorative: the GRC consultants, ISO 27001
     * lead implementers and the NCA and UAE regional-framework screening are a
     * risk and compliance conversation, and that regional angle is this desk's
     * stated differentiator.
     *
     * The slug does not move, and that is deliberate. A short slug under a fuller
     * label is already the pattern here — `finance` renders "Banking & Financial
     * Services", `telco` renders "Telco & Media" — and /capabilities/cybersecurity
     * is the better search target. No redirect, and canon §3's slug list is
     * untouched.
     */
    slug: "cybersecurity",
    label: "Cybersecurity & Risk" as TaxonomyLabel,
    short: "Cybersecurity" as TaxonomyLabel,
    category: "capabilities",
    /* Spells out risk rather than hiding it inside the GRC acronym, now that the
       label promises it. */
    tagline:
      "Security architecture, identity, governance, risk and security operations.",
  },
  {
    slug: "integration-middleware",
    label: "Integration & Middleware" as TaxonomyLabel,
    short: "Integration" as TaxonomyLabel,
    category: "capabilities",
    tagline:
      "MuleSoft, Boomi, Kafka, API management and iPaaS integration specialists.",
  },
  {
    slug: "devops-platform-engineering",
    label: "DevOps & Platform Engineering" as TaxonomyLabel,
    short: "DevOps" as TaxonomyLabel,
    category: "capabilities",
    tagline:
      "SRE, platform engineering, observability and continuous delivery talent.",
  },
  {
    slug: "testing-quality-engineering",
    label: "Testing & Quality Engineering" as TaxonomyLabel,
    short: "Testing & QE" as TaxonomyLabel,
    category: "capabilities",
    tagline:
      "Test strategy, automation, performance and accessibility specialists.",
  },
];

export const allL1: Record<string, L1IndexEntry[]> = {
  industries: industriesIndex,
  platforms: platformsIndex,
  capabilities: capabilitiesIndex,
};

/**
 * Resolves the display names for an L1 slug.
 *
 * Single source of truth: nothing duplicates these into the per-page data
 * files, so a sector cannot end up with two different display names.
 */
export function taxonomyLabels(slug: string): {
  label: TaxonomyLabel;
  short: TaxonomyLabel;
} {
  for (const group of Object.values(allL1)) {
    const hit = group.find((e) => e.slug === slug);
    if (hit) return { label: hit.label, short: hit.short };
  }
  // A slug with no index entry is a data error, not a runtime condition worth
  // papering over — but a hard throw would break the whole route tree, so fall
  // back to the slug itself rather than to hero copy.
  return {
    label: slug as TaxonomyLabel,
    short: slug as TaxonomyLabel,
  };
}
