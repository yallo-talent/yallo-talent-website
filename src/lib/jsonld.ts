import { platformLabels } from "./platforms";
import { SITE } from "./seo";

/**
 * Structured data for the organisation and its four legal entities.
 *
 * Deliberately incomplete where the facts are not established: no street
 * address, no telephone, no opening hours, no aggregate rating. Search engines
 * treat fabricated `LocalBusiness` detail as a trust signal, which is precisely
 * why it must be real. City and country are known; nothing else is asserted.
 *
 * Four entities, three demand markets — the site makes no "delivery regions"
 * claim, so neither does this.
 */

export interface Entity {
  city: string;
  country: string;
  /** ISO 3166-1 alpha-2. */
  countryCode: string;
  /** What the entity is for, in Yallo's own framing. */
  role: string;
}

export const ENTITIES: Entity[] = [
  {
    city: "London",
    country: "United Kingdom",
    countryCode: "GB",
    role: "Europe and UK demand",
  },
  {
    city: "Dubai",
    country: "United Arab Emirates",
    countryCode: "AE",
    role: "Regional headquarters",
  },
  {
    city: "Riyadh",
    country: "Saudi Arabia",
    countryCode: "SA",
    role: "In-country Saudi entity",
  },
  {
    city: "Bengaluru",
    country: "India",
    countryCode: "IN",
    role: "India and Global Capability Centre staffing",
  },
];

const SERVICES = [
  "Contract technology staffing",
  "Permanent technology recruitment",
  "Employer of Record",
  "Managed Delivery",
];

/* Supplied by Sumeet, 3 August — round12-scope.md §1.4 and §4.7. It is the
   Yallo Group page; there is no separate Yallo Talent company page. sameAs is
   corroboration of identity against a real, owned, authoritative profile —
   not an assertion of the group relationship. `name` below stays "Yallo
   Talent", with no `parentOrganization` and no group naming anywhere
   user-facing: asserting the parent relationship in structured data invites
   a knowledge panel for yallo.co to render the group's name, which is the
   shell R1 and R2 exist to remove. One is corroboration; the other is
   structure. `Person` schema stays deferred (§4.7) — a separate decision. */
const LINKEDIN_URL = "https://www.linkedin.com/company/yallogroup/";

/* DERIVED. Six hand-written names, missing Informatica since it was ratified on
   1 Aug (R-INF1), so the structured data every crawler reads understated the
   platform set by one while the site itself published seven. A copy of a
   taxonomy in a file nobody renders is the copy least likely to be noticed and
   the one search engines see first. */
const PLATFORMS = platformLabels();

/** Organization, with each entity as a LocalBusiness sub-organisation. */
export function organisationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE.url}/#organisation`,
    name: "Yallo Talent",
    url: SITE.url,
    logo: `${SITE.url}/logos/yallo-flower.svg`,
    sameAs: [LINKEDIN_URL],
    description:
      "Yallo Talent staffs and delivers enterprise platform programmes across the Middle East, Europe and India with specialist-screened people, including AI talent.",
    areaServed: ENTITIES.map((e) => ({
      "@type": "Country",
      name: e.country,
    })),
    knowsAbout: PLATFORMS,
    subOrganization: ENTITIES.map((e) => ({
      "@type": "LocalBusiness",
      "@id": `${SITE.url}/#entity-${e.city.toLowerCase()}`,
      name: `Yallo Talent ${e.city}`,
      parentOrganization: { "@id": `${SITE.url}/#organisation` },
      address: {
        "@type": "PostalAddress",
        addressLocality: e.city,
        addressCountry: e.countryCode,
      },
      description: e.role,
    })),
    makesOffer: SERVICES.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s },
    })),
  };
}

/** WebSite, so the site name resolves in search results. */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: "Yallo Talent",
    publisher: { "@id": `${SITE.url}/#organisation` },
    inLanguage: "en-GB",
  };
}
