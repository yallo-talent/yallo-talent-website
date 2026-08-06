/**
 * Yallo's four legal entities, and every sentence the site builds from them.
 *
 * WHY THIS FILE EXISTS. Round 18 §2.3: `/why-yallo` rendered the numeral **3**
 * under a heading reading "Four entities: London, Dubai, Riyadh, Bengaluru". The
 * label said four, it listed four, and the number said three. The 3 was the
 * leftover of "3 delivery regions", which game plan H3 retired for conflating
 * supply with demand and which canon bans in any phrasing.
 *
 * That is what two separate literals always do eventually. The list lived in
 * `jsonld.ts` as real data; the count was typed into a card by hand, so nothing
 * connected them and nothing could notice.
 *
 * So the count is `ENTITIES.length` and every published phrasing is derived from
 * the same array. Canon §1 fixes the four: London, Dubai, Riyadh, Bengaluru. The
 * discoverability brief §5 requires the site to state them identically
 * everywhere, which is now a property of the code rather than a thing to
 * remember.
 *
 * EXTRACTED FROM jsonld.ts rather than left there, because two of the five
 * consumers are client components (`L1PageShell`, `HubLandingSections`) and
 * importing the JSON-LD builder would pull the team index and the platform label
 * map into a client bundle for the sake of a city list. `jsonld.ts` re-exports
 * `ENTITIES` so nothing that already imported it from there had to change.
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

/** The count, as a numeral. What the `/why-yallo` card renders. */
export const ENTITY_COUNT = ENTITIES.length;

/**
 * The count as a word, for prose.
 *
 * Only as far as ten, and it throws rather than falling back to the numeral: a
 * heading reading "5 entities" beside a card reading "Five" is the same class of
 * defect this file exists to close, and a fifth entity is a canon amendment
 * rather than something to absorb silently.
 */
const NUMBER_WORDS = [
  "Zero",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
];
if (ENTITY_COUNT >= NUMBER_WORDS.length) {
  throw new Error(
    `src/lib/entities.ts: ${ENTITY_COUNT} entities has no spelled-out form. ` +
      "Canon §1 fixes four; changing the count is a canon amendment, so extend " +
      "NUMBER_WORDS deliberately rather than letting prose fall back to a numeral.",
  );
}
export const ENTITY_COUNT_WORD = NUMBER_WORDS[ENTITY_COUNT];

export const ENTITY_CITIES = ENTITIES.map((e) => e.city);

/** "London, Dubai, Riyadh and Bengaluru" — running prose. */
export const ENTITY_CITIES_SENTENCE = `${ENTITY_CITIES.slice(0, -1).join(", ")} and ${ENTITY_CITIES.at(-1)}`;

/** "London · Dubai · Riyadh · Bengaluru" — the house separator, for labels. */
export const ENTITY_CITIES_MIDDOT = ENTITY_CITIES.join(" · ");

/** "London, Dubai, Riyadh, Bengaluru" — a bare list under a heading. */
export const ENTITY_CITIES_COMMA = ENTITY_CITIES.join(", ");

/** "Four entities" — the label the count sits under. */
export const ENTITY_LABEL = `${ENTITY_COUNT_WORD} entities`;
