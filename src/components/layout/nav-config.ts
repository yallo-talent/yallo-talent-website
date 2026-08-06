import { capabilityNavEntries } from "@/data/capabilities";
import { capabilitiesIndex } from "@/data/l1/index";
import { publishedPlatformSlugs } from "@/data/platforms/derive";
import { eorCorridorLabel } from "@/data/services/eor-countries";
import { platformNavEntries } from "@/lib/platforms";
import { sectorNavEntries } from "@/lib/sectors";

export interface NavItem {
  label: string;
  href: string;
  description?: string;
  external?: boolean;
  /**
   * When false the label is rendered as non-interactive text (aria-disabled)
   * rather than a link. Use for nav targets whose route does not yet exist.
   */
  published?: boolean;
}

export interface NavColumn {
  heading: string;
  items: NavItem[];
}

export interface NavFeatured {
  eyebrow: string;
  title: string;
  copy: string;
  href: string;
  ctaLabel: string;
  /**
   * When false the card renders as a non-interactive tile rather than a
   * link — used where the target route has not shipped yet.
   */
  published?: boolean;
}

export interface NavGroup {
  label: string;
  description?: string;
  columns: NavColumn[];
  featured?: NavFeatured;
}

/**
 * The Capabilities column, derived from the discipline taxonomy.
 *
 * `capabilityNavEntries` is the single predicate for "does this discipline have a
 * page, and where". The hub page answers the same question through the same
 * source, so the two surfaces cannot drift. See src/data/capabilities/index.ts.
 *
 * The Platforms column above is still hand-written. It has the same latent fault
 * and is deliberately left alone here: the platform set is the parallel session's
 * to change, and converting it is their call, not a side effect of this one.
 */
const capabilityNavItems: NavItem[] = capabilityNavEntries(
  capabilitiesIndex,
).map(({ label, href, published }) => ({
  label,
  href,
  /* Only set the flag when it is false. `published: true` is not a state the
     renderer has — it tests `=== false` — and writing it would imply the absence
     of the field means something else. */
  ...(published ? {} : { published: false }),
}));

/**
 * The Platforms column, order and label from `platformsIndex`.
 *
 * `published` derives from module coverage rather than being declared, the same
 * way the Industries column derives it from the sector registry: a platform with
 * too little module data to justify a page renders as non-interactive text and
 * becomes a link on the commit that gives it one. That is decision 9 of
 * context-round5-rulings.md generalised — a hand-declared publication state is
 * the same class of defect as a hand-copied label.
 */
const platformNavItems: NavItem[] = platformNavEntries((slug) =>
  publishedPlatformSlugs().includes(slug),
).map(({ label, href, published }) => ({
  label,
  href,
  ...(published ? {} : { published: false }),
}));

/**
 * The Industries column, derived the same way, and for a sharper reason.
 *
 * This column WAS the canonical order — the "where we deploy" rail was ruled
 * wrong for disagreeing with it — and it still carried a hand-typed list, which
 * made it authoritative and unenforceable at the same time. It also carried
 * "Healthcare & Life Science", the singular, against the plural everywhere else.
 * Now the order and every label come from `industriesIndex`, so the canonical
 * order is a fact about the index rather than about this file, and the two
 * cannot say different things.
 *
 * Education & Universities was the hand-written `published: false` entry here.
 * It is no longer written down: `sectorNavEntries` reads the registry, so the
 * sector renders as non-interactive text until its page exists and becomes a
 * link on the commit that adds it.
 */
const sectorNavItems: NavItem[] = sectorNavEntries().map(
  ({ label, href, published }) => ({
    label,
    href,
    ...(published ? {} : { published: false }),
  }),
);

export const primaryNav: NavGroup[] = [
  {
    label: "Specialisms",
    description: "Platforms, capabilities and industries",
    columns: [
      {
        heading: "Platforms",
        /* DERIVED, closing the eighth instance of the hand-copied-taxonomy class
           (context-round5-rulings.md §5). This column was seven hand-written
           entries and admitted as much in its own comment, which is the tell:
           the fault was known, named in the file, and still could not be fixed
           by care, because care does not survive the next edit.
           Informatica is the proof it needed a mechanism. Ratified as the
           seventh platform on 1 Aug (R-INF1) and last in the order (R-INF2), it
           was added to this column and to the index by hand, and then missed on
           five other copies of the same list. Deriving means the eighth platform
           appears everywhere by being added in one place. */
        items: platformNavItems,
      },
      {
        heading: "Capabilities",
        /* DERIVED, and it is the fix for a real defect rather than a tidy-up.
           This column used to be seven hand-written entries with their own labels
           and their own `published: false` flags — a third copy of the discipline
           taxonomy, after `capabilitiesIndex` and the hub page. When the four
           planned desks were seeded it did not move: the menu went on marking four
           live pages "Desk in build" and kept the retired label "Artificial
           Intelligence" on a row whose subtitle had already changed, because the
           subtitle is read from the index and the label was not.
           Deriving it means the menu cannot disagree with the taxonomy again, and
           the next discipline appears here by being added in one place. */
        items: capabilityNavItems,
      },
      /* Industries merged in as the third column, canon §4 (ratified 30 Jul):
         Specialisms and Industries are ONE item. Two top-level entries made the
         reader hold the taxonomy model in their head to guess which axis a
         sector lived on; the axes are siblings, so they belong side by side.
         The retired Industries group's featured card pointed at an insight that
         is now unpublished, so the merge also removes a would-be dead link. */
      {
        heading: "Industries",
        items: sectorNavItems,
      },
    ],
    featured: {
      eyebrow: "Named specialism",
      title: "AI talent, on demand",
      copy: "Applied AI engineers, prompt architects and data scientists: screened for delivery, not certifications.",
      href: "/ai-talent",
      ctaLabel: "Explore AI talent →",
    },
  },
  {
    label: "How we work",
    columns: [
      {
        heading: "Engagement",
        items: [
          {
            label: "Contract",
            href: "/contract",
            description: "72-hour shortlists · specialist-screened",
          },
          {
            label: "Permanent",
            href: "/permanent",
            description: "Permanent hires, screened by specialists",
          },
          {
            label: "Employer of Record",
            href: "/eor",
            /* Corridor only, no mechanism — §4b. The per-country service
               (entity, payroll, visa sponsorship, or some subset) is not
               ratified for Saudi Arabia, so this line names the three
               countries the index carries and stops there. */
            description: eorCorridorLabel,
          },
          {
            label: "Managed Delivery",
            href: "/managed-delivery",
            description: "A scoped workstream, delivered by our pod",
          },
        ],
      },
    ],
    featured: {
      eyebrow: "Ready to hire?",
      title: "Shortlist in 72 hours.",
      copy: "Send a brief and we'll return an specialist-screened list.",
      href: "/brief",
      ctaLabel: "Send a brief →",
    },
  },
  {
    label: "Evidence",
    columns: [
      {
        heading: "Evidence",
        items: [
          {
            label: "Case studies",
            href: "/case-studies",
            description: "Programmes we've helped staff",
          },
          {
            label: "Clients",
            href: "/about#clients",
            description: "Who we've delivered for",
          },
          {
            label: "The specialists who screen",
            href: "/leadership",
            description: "The six desks that screen your shortlist",
          },
        ],
      },
    ],
    featured: {
      eyebrow: "Featured case",
      title: "Engineering a custom planning platform",
      copy: "Alshaya's planning operations across multiple brands needed lower cost of ownership and more in-house control.",
      href: "/case-studies/engineering-a-custom-planning-platform",
      ctaLabel: "Read the case study →",
    },
  },
  {
    label: "Intelligence",
    columns: [
      {
        heading: "Intelligence",
        items: [
          {
            label: "Insights",
            href: "/insights",
            description: "Articles, research and analysis",
          },
          {
            /* Now built, and pointed at the asset rather than at the hub. The
               href was /intelligence, which is the column's own destination and
               not this item's. */
            label: "Programme Staffing Blueprint",
            href: "/intelligence/programme-staffing-blueprint",
            description: "Streams, phases and the roles scoped too late",
          },
          {
            /* Relabelled, and the description was the reason. "AI Talent Atlas
               — AI roles, scarcity and comp windows" promised two things the
               page is forbidden to publish: R-AI3 bans a scarcity figure and a
               rate outright. A nav description is a claim like any other, and
               this one could never have been met by the page behind it. */
            /* The count came out on 2 Aug 2026 with the tenth family. It was
               correct when written and wrong the moment the data moved, which is
               the R21 argument applied to a nav description: the slot does not
               need a tally to be informative. */
            label: "AI talent",
            href: "/ai-talent",
            description:
              "Role families from agentic to governance, and the stacks we screen against",
          },
        ],
      },
    ],
    /* Was pointed at /insights with copy promising "Compensation windows,
       availability signals and hiring notes" — the same fix as the AI talent
       card above it, one row later. The LTI/Blueprint evidence base holds no
       compensation data of any kind, so no page could ever have kept that
       promise. Repointed at /intelligence, the hub the column's own items
       already sit under, and reworded to describe what it actually
       publishes. check-nav-promise.mjs is the gate that should have caught
       this the first time; it did not exist until now. */
    featured: {
      eyebrow: "Talent intelligence",
      title: "What we publish",
      copy: "The Programme Staffing Blueprint, hiring analysis and AI talent research: open, and written to be used.",
      href: "/intelligence",
      ctaLabel: "See what we publish →",
    },
  },
];

export const jobSeekersHref = "/jobs";
export const primaryCTAHref = "/brief";
