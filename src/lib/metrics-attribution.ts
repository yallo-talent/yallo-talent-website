/**
 * The one dated attribution line beneath the published metrics block.
 *
 * WHY IT EXISTS AT ALL, ruled round 17 §2.2. Two positions were argued and
 * neither won. Rendering all four `source` values put "Yallo internal record"
 * on the page four times, which reads as defensive and invites a challenge that
 * cannot be answered publicly. Rendering none of them left the site's only
 * first-party numbers unattributed, against canon's visible-source requirement
 * and the game plan's explicit "as at" requirement — and against the Phase 1
 * benchmark's central finding, that every firm in this category publishes
 * claims nobody can attribute. A dated first-party number is the one proof
 * asset the competitors do not have. So: one compact line, naming each record
 * once, with a single date.
 *
 * WHY IT IS DERIVED RATHER THAN WRITTEN. The line names the same four records
 * the `source` fields name. Typed as prose it would be a second copy of four
 * values — this build's signature defect, found eleven times — and the failure
 * mode is specific: change `source` in metrics.yaml at the quarterly refresh and
 * the visible attribution keeps naming the old records, with nothing to notice.
 *
 * Pure and dependency-free so a client component can import it: the metrics
 * loader reads the file system and cannot cross the client boundary.
 */

interface AttributableMetric {
  source: string;
}

/**
 * `Yallo internal delivery record, Q1–Q2 2026` -> owner, kind, noun.
 *
 * The period is deliberately dropped from the rendered line: `asAt` is the one
 * date published, and per-record periods would put four dates on a line whose
 * whole purpose is to carry one.
 */
const SOURCE_SHAPE = /^(.+?) ([a-z-]+) (record|register)s?(?:,.*)?$/i;

/** "a, b and c" — Oxford comma deliberately absent, per house style. */
function conjoin(parts: readonly string[]): string {
  if (parts.length <= 1) return parts[0] ?? "";
  return `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
}

/**
 * The rendered attribution, or `null` when the sources cannot be reduced to one
 * line.
 *
 * Returning null rather than guessing is the point: the alternative is a line
 * that half-describes the provenance, and an attribution nobody can rely on is
 * worse than none. `check:metrics-attribution` fails on null, so this cannot
 * quietly stop rendering — a `source` that stops matching the shape is a gate
 * failure at build time, not a missing line on eleven live pages.
 */
export function composeMetricsAttribution(
  metrics: readonly AttributableMetric[],
  asAt: string,
): string | null {
  if (metrics.length === 0) return null;

  const parsed = metrics.map((m) => SOURCE_SHAPE.exec(m.source.trim()));
  if (parsed.some((p) => p === null)) return null;

  const owners = new Set(parsed.map((p) => (p as RegExpExecArray)[1]));
  if (owners.size !== 1) return null;
  const owner = [...owners][0];

  /* Grouped by noun, in first-seen order, so "delivery, shortlist and placement
     records and programme register" reads once and stays accurate. A register is
     not a record and the line does not pretend otherwise. */
  const byNoun = new Map<string, string[]>();
  for (const p of parsed as RegExpExecArray[]) {
    const kind = p[2].toLowerCase();
    const noun = p[3].toLowerCase();
    const kinds = byNoun.get(noun) ?? [];
    if (!kinds.includes(kind)) kinds.push(kind);
    byNoun.set(noun, kinds);
  }

  const clauses = [...byNoun].map(
    ([noun, kinds]) =>
      `${conjoin(kinds)} ${noun}${kinds.length > 1 ? "s" : ""}`,
  );

  const date = new Date(`${asAt}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return null;
  const dateDisplay = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  return `${owner} ${conjoin(clauses)}, as at ${dateDisplay}.`;
}
