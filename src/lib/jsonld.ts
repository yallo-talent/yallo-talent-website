import { teamIndex } from "@/data/team";
import { ENTITIES } from "./entities";
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

/* ENTITIES moved to ./entities in round 18 §2.3 so the count and the city list
   derive from one array, and so the two client components that publish the list
   can import it without pulling this builder into a client bundle. Re-exported
   because jsonld.ts was where every existing importer looked for it. */
export { ENTITIES, type Entity } from "./entities";

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

/**
 * Person, one per real named leader on `/leadership`. round14-scope.md §2.5:
 * the discoverability ban on `Person` schema holds until real named
 * consultants exist; five now do, on the leadership surface, so the ban
 * lifts for exactly them.
 *
 * Four fields only — `name`, `jobTitle`, `url`, `worksFor` — every one
 * derived from `teamIndex` (src/data/team/index.ts) so this cannot drift
 * from what the page itself publishes. Deliberately excludes `email`,
 * `telephone`, `knowsAbout`, any specialism, biography, seniority claim or
 * years-of-experience figure: none of that is in `teamIndex`, and this
 * function has no field to invent one into. Those are Sumeet's to supply;
 * see the round 14 relay for the open slots.
 */
export function leadershipPersonJsonLd() {
  return teamIndex.map((member) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE.url}/leadership#${member.slug}`,
    name: member.name,
    jobTitle: member.role,
    url: `${SITE.url}/leadership#${member.slug}`,
    worksFor: { "@id": `${SITE.url}/#organisation` },
  }));
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
