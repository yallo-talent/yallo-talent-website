/**
 * unsourcedFigures — the one detector behind canon §6's "no figure without a
 * source", in the one place both consumers can reach it.
 *
 * WHY THIS FILE EXISTS, AND WHY IT IS .mjs IN src/.
 *
 * Round 23 introduced this rule at the authoring surface: the Articles pane
 * refuses a pull request whose body carries a figure no `sources` entry
 * accounts for. Round 24 §4 makes it a build gate as well, so an article that
 * reaches `content/insights/` by any other route is held to the same rule.
 *
 * Two consumers, and the round file is explicit that there must not be two
 * implementations:
 *
 *   - `src/lib/admin/article-draft.ts` -> the pane, which refuses before a
 *     pull request opens, where it is cheapest to fix
 *   - `scripts/check-sources.mjs`      -> the gate, which refuses at merge
 *
 * The pane is TypeScript and the gate is a plain node script, so the shared
 * unit is a dependency-free `.mjs` module in `src/` — exactly the arrangement
 * `src/data/redirects.mjs` already uses for the redirect table, and for the
 * same reason: a rule maintained in two places is a rule that is wrong in one
 * of them, and here the two would drift silently, each staying green on the
 * article the other would have caught.
 *
 * DELIBERATELY NARROW, and this is unchanged from round 23. It matches figures
 * that read as claims — percentages, multipliers, currency amounts, and bare
 * numbers of three digits or more — and ignores years, list ordinals, ISO dates
 * and anything inside a code fence or a link target. A rule that flags "2026"
 * or "3 things" is a rule authors learn to click past, and a warning nobody
 * reads is worse than none.
 */

/**
 * Figures in the body that no `sources` entry accounts for.
 *
 * @param {string} body prose body, without frontmatter
 * @param {Array<{ claim?: string, source?: string }> | undefined} sources
 * @returns {string[]} each unaccounted figure, as written
 */
export function unsourcedFigures(body, sources) {
  /* Code fences and inline code hold configuration and command output, not
     claims about the world. Link targets hold ids. Neither is prose. */
  const prose = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/\]\([^)]*\)/g, "] ");

  const claims = (sources ?? [])
    .map((s) => `${s.claim ?? ""} ${s.source ?? ""}`)
    .join(" ");

  const found = new Set();
  const patterns = [
    /\b\d+(?:\.\d+)?\s?%/g, // 63%, 12.5 %
    /\b\d+(?:\.\d+)?x\b/gi, // 3x, 1.4x
    /[$£€]\s?\d[\d,.]*\s?(?:k|m|bn|billion|million)?/gi, // $1.2m
    /\b\d[\d,]{2,}\b/g, // 1,000 and 250 upwards
  ];

  for (const pattern of patterns) {
    for (const [match] of prose.matchAll(pattern)) {
      const figure = match.trim();
      /* A four-digit number that is a plausible year is not a claim. */
      if (/^(19|20)\d{2}$/.test(figure)) continue;
      if (claims.includes(figure)) continue;
      /* The digits alone, so "63%" is covered by a claim written "63 per cent". */
      const digits = figure.replace(/[^0-9.]/g, "");
      if (digits && claims.includes(digits)) continue;
      found.add(figure);
    }
  }
  return [...found];
}
