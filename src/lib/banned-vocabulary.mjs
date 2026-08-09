/**
 * Canon §2's banned vocabulary, in the one place every consumer reads it.
 *
 * WHY IT MOVED HERE. Round 24 extracted the figure detector into
 * `src/lib/unsourced-figures.mjs` for exactly this reason and round 25 §5
 * restates it as a rule: the terminology list now has a second consumer — the
 * publish action, which refuses a body carrying banned vocabulary — and a list
 * maintained in two places is a list that is wrong in one of them. The gate and
 * the publish action would have drifted the way the pane and the gate would
 * have drifted over figures, each staying green on the copy the other would
 * have caught.
 *
 * `scripts/check-terminology.mjs` keeps everything else it does: the mechanical
 * replacements, the `--fix` mode, the scarcity rules and the 72-hour claim. Only
 * the abstraction list and its allow-list live here, because only they have two
 * readers.
 *
 * THE ALLOW-LIST METHOD IS CANON, NOT CONVENIENCE. Canon §2: "occurrence-by-
 * occurrence resolution with a documented reason per allow-listed case". Every
 * entry carries its reason. An entry without one is drift, and the publish
 * action reports the reason back to the author so the same judgement is
 * available at the moment of writing rather than only in a script.
 */

/**
 * Banned abstractions, ratified in Chat Relay v2.0 §3.2 and canon §2.
 *
 * NOT banned, and deliberately absent: phase, gate, go-live, cutover,
 * mobilisation, hypercare, brief, shortlist. That is the buyer's own working
 * vocabulary — a programme director says "we are at the design gate" every
 * week, and removing it would make the site sound like an outsider.
 *
 * "shape" as a verb is banned by the relay but is not mechanically detectable
 * without false positives ("team shape", "the shape of the programme"), so it is
 * left to review rather than guessed at here.
 */
export const ABSTRACTIONS = [
  "hold the risk",
  "pipeline to insight",
  "delivery cadence",
  "where the process lives",
  "run and reliability",
  "seamless",
  "robust",
  "unlock",
  "leverage",
  "journey",
  "landscape",
  "tailored",
  "best-in-class",
  "world-class",
  "cutting-edge",
  "empower",
  "streamline",
  "holistic",
  "ecosystem",
];

/** Occurrences where a banned abstraction is load-bearing rather than filler. */
export const ABSTRACTION_ALLOWED = [
  [
    "Journey Builder",
    "Salesforce Marketing Cloud product name — not ours to rename",
  ],
  ["Digital Journey Consultant", "a real role name Yallo places"],
  ["SAP landscape", "SAP's own word for a system environment"],
  ["SAP landscapes", "SAP's own word for a system environment"],
  ["shopper journey", "standard retail CX vocabulary, and the buyer's own"],
  [
    "Brand-to-basket journeys",
    "standard retail vocabulary for the channel path",
  ],
  ["segmentation, journeys and cross-channel", "standard CRM/CDP vocabulary"],
  ["highest-leverage function", "specific and measurable, not filler"],
  [
    "intelligent ecosystems",
    "part of a real published article title — a title is a fact",
  ],
  ["tailored to your specific situation", "legal wording on the terms page"],
  ["platform ecosystem", "the one literal use of 'ecosystem' canon permits"],
  [
    "technology-landscape",
    "substring of a real case-study URL slug (the Alshaya multi-vendor consolidation study) — a route, not prose, and not renamable to satisfy this lint",
  ],
];

/**
 * Banned vocabulary in a piece of prose, allow-listed occurrences removed
 * first.
 *
 * REMOVING THE ALLOWED PHRASES BEFORE MATCHING, rather than filtering hits
 * afterwards, is what makes "platform ecosystem" pass while a bare "ecosystem"
 * three words later still fails. Filtering afterwards can only decide per TERM,
 * and the whole point of canon's method is that it decides per OCCURRENCE.
 *
 * @param {string} prose
 * @returns {Array<{ term: string, context: string }>}
 */
export function bannedVocabulary(prose) {
  let scrubbed = prose;
  for (const [phrase] of ABSTRACTION_ALLOWED) {
    scrubbed = scrubbed.split(phrase).join(" ");
  }
  const hits = [];
  for (const term of ABSTRACTIONS) {
    const re = new RegExp(
      `\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`,
      "gi",
    );
    const m = re.exec(scrubbed);
    while (m) {
      hits.push({
        term,
        context: scrubbed
          .slice(Math.max(0, m.index - 30), m.index + term.length + 30)
          .trim(),
      });
      break; // one report per term is enough to act on
    }
  }
  return hits;
}

/**
 * Rates, fees and day rates — canon §7's "no rates, fees or percentages on
 * public pages", which round 23 held as a standing rule and A2 rule 4 moves
 * into the publish action.
 *
 * DELIBERATELY NARROW, for the same reason the figure detector is. It matches a
 * currency amount or a bare number sitting next to rate/fee vocabulary, not
 * every number and not every mention of the word "rate" — "the rate of change"
 * is prose, "AED 2,000 per day" is a day rate, and a detector that cannot tell
 * them apart is a detector authors learn to click past.
 *
 * @param {string} prose
 * @returns {string[]} each offending phrase, as written
 */
export function rateFigures(prose) {
  const money = String.raw`(?:AED|SAR|USD|GBP|EUR|£|\$|€|₹|INR)\s?[\d,]+(?:\.\d+)?[kKmM]?`;
  const near = `(?:day rate|daily rate|rate card|hourly rate|per day|per hour|per annum|fee|fees|retainer|margin|mark-?up|commission|percentage of salary)`;
  const patterns = [
    new RegExp(`${money}\\s*(?:\\w+\\s+){0,4}?${near}`, "gi"),
    new RegExp(`${near}\\s*(?:of|at|is|:)?\\s*${money}`, "gi"),
    new RegExp(`\\b\\d{1,3}(?:\\.\\d+)?%\\s*(?:\\w+\\s+){0,3}?${near}`, "gi"),
    new RegExp(`${near}\\s*(?:of|at|is|:)?\\s*\\d{1,3}(?:\\.\\d+)?%`, "gi"),
  ];
  const out = [];
  for (const re of patterns) {
    for (const m of prose.matchAll(re)) {
      const hit = m[0].trim();
      if (!out.includes(hit)) out.push(hit);
    }
  }
  return out;
}
