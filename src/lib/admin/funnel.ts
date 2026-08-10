/**
 * The funnel's vocabulary and its arithmetic — cockpit-v3 §11, round 26 item B.
 *
 * PURE, AND NOT `server-only`. Every function here is a decision about words and
 * numbers rather than about the database: which states exist, how old a lead is
 * against the commitment the site publishes, and which fields of a captured
 * payload are the ones a person reads. The pane, the CSV export and the specs
 * all read the same declarations, which is the point.
 *
 * NOTHING HERE INVENTS A LEAD. Every field is read from a payload the site's own
 * form wrote; where a payload does not carry a field, the card says so rather
 * than filling it in.
 */

export const FUNNEL_STATES = [
  "new",
  "contacted",
  "qualified",
  "won",
  "lost",
] as const;

export type FunnelState = (typeof FUNNEL_STATES)[number];

export function isFunnelState(value: unknown): value is FunnelState {
  return (
    typeof value === "string" &&
    (FUNNEL_STATES as readonly string[]).includes(value)
  );
}

export const FUNNEL_LABELS: Record<FunnelState, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  won: "Won",
  lost: "Lost",
};

/**
 * What each state means, in the words the pane shows.
 *
 * WRITTEN DOWN because a five-state pipeline where two people disagree about
 * what Qualified means is a pipeline that reports numbers nobody trusts.
 */
export const FUNNEL_DESCRIPTIONS: Record<FunnelState, string> = {
  new: "Captured and not yet answered. The SLA clock is running.",
  contacted: "Somebody from Yallo Talent has replied. The clock has stopped.",
  qualified: "A real requirement, with a scope worth pursuing.",
  won: "Became an engagement.",
  lost: "Not proceeding, for any reason. Kept, never deleted.",
};

/**
 * The states the default view shows first.
 *
 * ACTIONABLE MEANS SOMETHING IS OWED TO SOMEBODY OUTSIDE YALLO TALENT. New and
 * Contacted are the two where that is true; Qualified is inside a sales cycle,
 * and Won and Lost are finished. cockpit-v3 §11 asks for actionable first,
 * oldest SLA first, and this is the half of that which is a judgement.
 */
export const ACTIONABLE_STATES: readonly FunnelState[] = ["new", "contacted"];

/**
 * The commitment the site publishes, in hours.
 *
 * THE SAME NUMBER THE PUBLIC PAGES PROMISE. The site says a shortlist inside 72
 * hours; the funnel pane is where that promise is kept, so the number the clock
 * counts against is that number and not an internal target somebody preferred.
 * It is stated once here so a change to the promise is a change to one line.
 */
export const SLA_HOURS = 72;

export type SlaBand = "fresh" | "due" | "late" | "stopped";

export interface Sla {
  band: SlaBand;
  hours: number;
  /** What the card says, in words rather than as a bare number. */
  label: string;
}

/**
 * How a lead is doing against the 72-hour commitment.
 *
 * THE CLOCK STOPS AT CONTACTED, not at Qualified. The promise is about a reply
 * reaching the person who wrote in; what happens after that is a sales cycle
 * with its own pace and no published commitment attached to it. A clock that
 * kept running into Won would colour every long, healthy deal red.
 *
 * BANDS RATHER THAN A GRADIENT. Three steps a person can name — inside the
 * commitment, near it, past it — are three steps they can act on. A continuous
 * colour ramp is a colour a reader has to interpret.
 *
 * @param capturedAt ISO timestamp the submission landed
 * @param state where the lead is now
 * @param now injectable so the specs can assert a band rather than wait for one
 */
export function slaFor(
  capturedAt: string,
  state: FunnelState,
  now: Date = new Date(),
): Sla {
  const hours = Math.max(
    0,
    (now.getTime() - new Date(capturedAt).getTime()) / 36e5,
  );
  const rounded = Math.floor(hours);
  if (!ACTIONABLE_STATES.includes(state)) {
    return { band: "stopped", hours: rounded, label: "Clock stopped" };
  }
  if (state === "contacted") {
    return {
      band: "stopped",
      hours: rounded,
      label: `Answered, ${describe(rounded)} old`,
    };
  }
  if (hours >= SLA_HOURS) {
    return {
      band: "late",
      hours: rounded,
      label: `${describe(rounded)} old, past the ${SLA_HOURS}-hour commitment`,
    };
  }
  /* The last quarter of the window. Two thirds through a three-day promise is
     the point at which somebody should be told, not the point at which it is
     already broken. */
  if (hours >= SLA_HOURS * 0.75) {
    return {
      band: "due",
      hours: rounded,
      label: `${describe(rounded)} old, ${Math.max(0, Math.floor(SLA_HOURS - hours))} hours left`,
    };
  }
  return {
    band: "fresh",
    hours: rounded,
    label: `${describe(rounded)} old`,
  };
}

function describe(hours: number): string {
  if (hours < 1) return "under an hour";
  if (hours < 48) return `${hours} hour${hours === 1 ? "" : "s"}`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"}`;
}

/**
 * The fields of a captured payload that a person reads, named.
 *
 * WHY A PROJECTION AND NOT THE RAW OBJECT. cockpit-v3 §11: lead cards, not JSON.
 * A pretty-printed payload is a developer's view of a lead — every key equally
 * weighted, in insertion order, with the message a reader wants buried among
 * campaign parameters. The raw payload stays, behind a disclosure, because it is
 * the only complete record and the card is a reading of it.
 *
 * EVERY KEY BELOW IS ONE THE SITE'S OWN FORMS WRITE. Nothing is guessed at, and
 * a payload that does not carry a field leaves it absent rather than empty.
 */
export interface LeadCard {
  name: string | null;
  email: string | null;
  company: string | null;
  role: string | null;
  region: string | null;
  engagement: string | null;
  platform: string | null;
  message: string | null;
  /** Anything in the payload the card does not name, so nothing is hidden. */
  extra: [string, string][];
}

const FIRST = (
  payload: Record<string, unknown>,
  keys: string[],
): string | null => {
  for (const key of keys) {
    const value = payload[key];
    if (typeof value === "string" && value.trim() !== "") return value.trim();
    if (Array.isArray(value) && value.length > 0) {
      return value.map((v) => String(v)).join(", ");
    }
  }
  return null;
};

/** Keys the card reads by name; everything else falls into `extra`. */
const NAMED = new Set([
  "name",
  "fullName",
  "contactName",
  "email",
  "workEmail",
  "company",
  "organisation",
  "organization",
  "role",
  "jobTitle",
  "title",
  "region",
  "location",
  "country",
  "engagement",
  "engagementModel",
  "model",
  "platform",
  "platforms",
  "technology",
  "message",
  "brief",
  "requirement",
  "details",
]);

export function leadCard(payload: Record<string, unknown>): LeadCard {
  const extra: [string, string][] = [];
  for (const [key, value] of Object.entries(payload)) {
    if (NAMED.has(key)) continue;
    if (value === null || value === undefined || value === "") continue;
    extra.push([
      key,
      typeof value === "string" ? value : JSON.stringify(value),
    ]);
  }
  return {
    name: FIRST(payload, ["name", "fullName", "contactName"]),
    email: FIRST(payload, ["email", "workEmail"]),
    company: FIRST(payload, ["company", "organisation", "organization"]),
    role: FIRST(payload, ["role", "jobTitle", "title"]),
    region: FIRST(payload, ["region", "location", "country"]),
    engagement: FIRST(payload, ["engagement", "engagementModel", "model"]),
    platform: FIRST(payload, ["platform", "platforms", "technology"]),
    message: FIRST(payload, ["message", "brief", "requirement", "details"]),
    extra: extra.sort((a, b) => a[0].localeCompare(b[0], "en-GB")),
  };
}

/**
 * The date from which page-of-origin data exists.
 *
 * SAID ON THE PANEL RATHER THAN INFERRED BACKWARDS — cockpit-v3 §11 is explicit.
 * `assistant_transcripts.origin_path` was added by round 21 and first carried
 * values on 8 August 2026. A rollup that silently counted the conversations
 * before that as "unknown page" would be reporting a gap in instrumentation as
 * a fact about visitors.
 */
export const ORIGIN_DATA_FROM = "2026-08-08";

/**
 * One CSV cell, escaped.
 *
 * DOUBLE QUOTES ALWAYS, not only when a comma appears. A message field carries
 * newlines, quotation marks and commas as a matter of course, and a quoting rule
 * with a condition in it is a quoting rule that is wrong for one row in a
 * hundred — which is the row somebody notices in a spreadsheet a week later.
 *
 * A LEADING APOSTROPHE ON ANYTHING A SPREADSHEET WOULD EXECUTE. A cell opening
 * with =, +, - or @ is a formula in Excel and in Google Sheets, so an export of
 * text a stranger typed into a public form is a way to run a formula on the
 * machine of whoever opens it. Prefixing breaks the interpretation and leaves
 * the text readable.
 */
export function csvCell(value: string | null): string {
  const raw = value ?? "";
  const safe = /^[=+\-@\t\r]/.test(raw) ? `'${raw}` : raw;
  return `"${safe.replace(/"/g, '""')}"`;
}

export function csvRow(cells: (string | null)[]): string {
  return cells.map(csvCell).join(",");
}
