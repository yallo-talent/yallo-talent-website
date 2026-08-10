import Link from "next/link";
import styles from "@/components/admin/Admin.module.css";
import { RowTitle } from "@/components/admin/RowTitle";
import {
  ACTIONABLE_STATES,
  FUNNEL_DESCRIPTIONS,
  FUNNEL_LABELS,
  FUNNEL_STATES,
  type FunnelState,
  leadCard,
  SLA_HOURS,
  slaFor,
} from "@/lib/admin/funnel";
import { requirePane } from "@/lib/admin/guard";
import { type BriefRow, readBriefs } from "@/lib/admin/reads";
import { canDo } from "@/lib/admin/roles";
import { type FunnelRow, readFunnel } from "@/lib/db/funnel";
import { listUsers } from "@/lib/db/users";
import { setFunnelAction } from "./actions";

/**
 * Briefs, which is the lead funnel — cockpit-v3 §11, round 26 item B.
 *
 * WHAT THIS PANE WAS. Every capture, newest first, each one printed as a
 * pretty-printed JSON payload. That is a developer's view of a lead: every key
 * equally weighted, in insertion order, with the sentence somebody actually
 * wrote buried among campaign parameters. It answered "was this captured" and
 * nothing else, which was the right question in round 17 and is not the question
 * a business two months from launch is asking.
 *
 * WHAT IT IS NOW. A working lead surface: a pipeline state per lead, an owner,
 * a clock against the 72-hour commitment the site publishes, a card with the
 * fields a person reads, and the raw payload behind a disclosure so nothing is
 * hidden. Filters, search and saved views in the URL, and the whole current view
 * exportable as CSV.
 *
 * `submissions` IS STILL APPEND-ONLY AND STILL THE BACKSTOP. Nothing on this
 * pane writes to it. State lives in `submission_funnel`, a sidecar keyed to the
 * submission id, so capture integrity and pipeline state never contend — round
 * 26 §5, and the reason is older than the ruling: that table's value is that a
 * row lands before any downstream is attempted.
 *
 * NOTHING HERE DELETES. Lost is a state. Round 17 §3's rule that this tree has
 * no delete path is unchanged.
 *
 * THE FILTERS ARE A GET FORM, like the conversations pane's. No client
 * component, no state, no JavaScript: the filter is in the URL, which means it
 * is linkable, back-button-correct and survives a reload. A cockpit that needs a
 * bundle to filter a list is a cockpit that breaks differently from the site
 * around it.
 */
export const dynamic = "force-dynamic";

interface Filters {
  state?: string;
  owner?: string;
  source?: string;
  q?: string;
  from?: string;
  to?: string;
  view?: string;
  lead?: string;
  err?: string;
  moved?: string;
}

/**
 * The saved views — cockpit-v3 §11.
 *
 * A FIXED SET, NOT A PER-USER STORE. A saved view is a named filter, and the
 * three that matter to an operating team of this size are the same three for
 * everybody: what is owed a reply, what is mine, what closed. Each one is a
 * plain link that sets the ordinary filters, so a saved view is bookmarkable,
 * shareable and inspectable — and building a table to store per-user views
 * would be building the wrong half of the feature first.
 *
 * `Mine` resolves against the signed-in address at render time, so the link is
 * the same for everybody and means something different to each of them.
 */
const SAVED_VIEWS = [
  {
    id: "actionable",
    label: "Needs an answer",
    note: "New and Contacted, oldest first. The default.",
    params: () => ({}),
  },
  {
    id: "late",
    label: `Past ${SLA_HOURS} hours`,
    note: "New leads that have run out the commitment.",
    params: () => ({ state: "new", view: "late" }),
  },
  {
    id: "mine",
    label: "Mine",
    note: "Assigned to you, in any state.",
    params: (email: string) => ({ owner: email, state: "all" }),
  },
  {
    id: "closed",
    label: "Closed",
    note: "Won and Lost together.",
    params: () => ({ state: "closed" }),
  },
] as const;

function deliveryLine(status: BriefRow["deliveryStatus"]) {
  const entries = Object.entries(status ?? {});
  if (entries.length === 0)
    return { text: "no delivery attempt recorded", failed: true };
  const failed = entries.filter(([, o]) => !o?.delivered);
  return {
    text: entries
      .map(([channel, o]) =>
        o?.delivered
          ? `${channel}: delivered`
          : `${channel}: FAILED${o?.error ? ` (${o.error})` : ""}`,
      )
      .join(" · "),
    failed: failed.length > 0,
  };
}

/**
 * The filtered, ordered view.
 *
 * EXPORTED, because the CSV route has to produce the SAME view. cockpit-v3 §11
 * says "export current view", and a second filter implementation in the route
 * would be a second answer to what "current" means — the defect that makes an
 * export somebody checks once and then stops trusting.
 *
 * IN MEMORY RATHER THAN IN SQL, deliberately, and the same reasoning as the
 * conversations pane: the unfiltered set is one row per capture the site has
 * ever taken, six optional predicates would be a query harder to read than the
 * thing it saves, and the moment this list outgrows that the query is where it
 * moves. This comment is the note saying why it was not there first.
 */
export function funnelView(
  rows: BriefRow[],
  funnel: Map<string, FunnelRow>,
  f: Filters,
  now: Date = new Date(),
): { row: BriefRow; state: FunnelState; owner: string | null }[] {
  const q = (f.q ?? "").trim().toLowerCase();
  const decorated = rows.map((row) => {
    const side = funnel.get(row.id);
    return {
      row,
      state: (side?.state ?? "new") as FunnelState,
      owner: side?.ownerEmail ?? null,
    };
  });

  const filtered = decorated.filter(({ row, state, owner }) => {
    if (f.state === "closed") {
      if (state !== "won" && state !== "lost") return false;
    } else if (f.state && f.state !== "all") {
      if (state !== f.state) return false;
    } else if (!f.state) {
      /* The default view is actionable first — cockpit-v3 §11. Absent means
         actionable, `all` means everything, and a named state means that one. */
      if (!ACTIONABLE_STATES.includes(state)) return false;
    }
    if (
      f.view === "late" &&
      slaFor(row.createdAt, state, now).band !== "late"
    ) {
      return false;
    }
    if (f.owner && f.owner !== "" && owner !== f.owner) return false;
    if (f.source && f.source !== "" && row.endpoint !== f.source) return false;
    const day = row.createdAt.slice(0, 10);
    if (f.from && day < f.from) return false;
    if (f.to && day > f.to) return false;
    if (q !== "") {
      /* Over the card's fields AND the raw payload. A search that only read the
         projection would fail to find a lead by a value the projection does not
         name, which is precisely when somebody searches. */
      const hay = JSON.stringify(row.payload).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  /* Oldest first within the actionable set, because the oldest is the one the
     commitment is closest to breaking on. Newest first everywhere else, because
     a closed list is a record and a record reads newest first. */
  const oldestFirst =
    !f.state || f.state === "" || ACTIONABLE_STATES.includes(f.state as never);
  return filtered.sort((a, b) =>
    oldestFirst
      ? a.row.createdAt.localeCompare(b.row.createdAt)
      : b.row.createdAt.localeCompare(a.row.createdAt),
  );
}

export default async function BriefsPane({
  searchParams,
}: {
  searchParams: Promise<Filters>;
}) {
  const signed = await requirePane("briefs");
  const f = await searchParams;
  const mayWrite = canDo(signed.role, "briefsWrite");

  let rows: BriefRow[] = [];
  let funnel = new Map<string, FunnelRow>();
  let owners: { email: string; role: string }[] = [];
  let error: string | null = null;
  try {
    rows = await readBriefs(500);
    funnel = await readFunnel();
    /* Ops and admin, per cockpit-v3 §11: the people who follow a lead up are
       the people it can be assigned to. Read from the live account list rather
       than typed, so an account that is disabled stops being offered. */
    owners = (await listUsers())
      .filter((u) => !u.disabled)
      .filter(
        (u) => u.role === "ops" || u.role === "admin" || u.role === "owner",
      )
      .map((u) => ({ email: u.email, role: u.role }));
  } catch (err) {
    error =
      err instanceof Error ? err.message : "Unknown error reading submissions.";
  }

  const now = new Date();
  const view = funnelView(rows, funnel, f, now);
  const counts = new Map<FunnelState, number>();
  for (const state of FUNNEL_STATES) counts.set(state, 0);
  for (const row of rows) {
    const state = (funnel.get(row.id)?.state ?? "new") as FunnelState;
    counts.set(state, (counts.get(state) ?? 0) + 1);
  }
  const sources = [...new Set(rows.map((r) => r.endpoint))].sort();
  const exportQuery = new URLSearchParams(
    Object.entries(f).filter(
      ([k, v]) => v && !["err", "moved", "lead"].includes(k),
    ) as [string, string][],
  ).toString();

  return (
    <>
      <h1 className={styles.h1}>Briefs</h1>
      <p className={styles.lede}>
        Every capture the site has recorded, as a pipeline. The capture table
        itself is the backstop and is append-only: a row exists whether or not
        email delivery succeeded, so a failed delivery is a lead to chase rather
        than a lead lost. Pipeline state sits beside it and nothing here
        deletes.
      </p>

      {f.err ? <p className={styles.error}>{f.err}</p> : null}
      {f.moved ? <p className={styles.ok}>Lead updated.</p> : null}
      {error ? (
        <p className={styles.empty}>Could not read submissions: {error}</p>
      ) : null}

      {/* ── The pipeline, as counts ─────────────────────────────────────── */}
      <ul className={styles.pipeline}>
        {FUNNEL_STATES.map((state) => (
          <li key={state}>
            <Link
              className={styles.pipelineStep}
              data-current={f.state === state ? "true" : "false"}
              data-state={state}
              href={`/admin/briefs?state=${state}`}
              title={FUNNEL_DESCRIPTIONS[state]}
            >
              <span className={styles.pipelineCount}>
                {counts.get(state) ?? 0}
              </span>
              <span className={styles.pipelineLabel}>
                {FUNNEL_LABELS[state]}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* ── Saved views ─────────────────────────────────────────────────── */}
      <nav aria-label="Saved views" className={styles.savedViews}>
        {SAVED_VIEWS.map((saved) => {
          const params = new URLSearchParams(
            saved.params(signed.email) as Record<string, string>,
          ).toString();
          return (
            <Link
              className={styles.savedView}
              href={params ? `/admin/briefs?${params}` : "/admin/briefs"}
              key={saved.id}
              title={saved.note}
            >
              {saved.label}
            </Link>
          );
        })}
      </nav>

      {/* ── Filters and search ──────────────────────────────────────────── */}
      <form action="/admin/briefs" className={styles.filters} method="get">
        <label className={styles.field} htmlFor="f-state">
          <span className={styles.fieldLabel}>State</span>
          <select
            className={styles.input}
            defaultValue={f.state ?? ""}
            id="f-state"
            name="state"
          >
            <option value="">Needs an answer</option>
            <option value="all">Every state</option>
            {FUNNEL_STATES.map((state) => (
              <option key={state} value={state}>
                {FUNNEL_LABELS[state]}
              </option>
            ))}
            <option value="closed">Closed (Won and Lost)</option>
          </select>
        </label>

        <label className={styles.field} htmlFor="f-owner">
          <span className={styles.fieldLabel}>Owner</span>
          <select
            className={styles.input}
            defaultValue={f.owner ?? ""}
            id="f-owner"
            name="owner"
          >
            <option value="">Anyone</option>
            {owners.map((o) => (
              <option key={o.email} value={o.email}>
                {o.email}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field} htmlFor="f-source">
          <span className={styles.fieldLabel}>Source</span>
          <select
            className={styles.input}
            defaultValue={f.source ?? ""}
            id="f-source"
            name="source"
          >
            <option value="">Any</option>
            {sources.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field} htmlFor="f-from">
          <span className={styles.fieldLabel}>From</span>
          <input
            className={styles.input}
            defaultValue={f.from ?? ""}
            id="f-from"
            name="from"
            type="date"
          />
        </label>

        <label className={styles.field} htmlFor="f-to">
          <span className={styles.fieldLabel}>To</span>
          <input
            className={styles.input}
            defaultValue={f.to ?? ""}
            id="f-to"
            name="to"
            type="date"
          />
        </label>

        <label className={styles.field} htmlFor="f-q">
          <span className={styles.fieldLabel}>Search</span>
          <input
            className={styles.input}
            defaultValue={f.q ?? ""}
            id="f-q"
            name="q"
            placeholder="Any word in the capture"
            type="search"
          />
        </label>

        <button className={styles.submit} type="submit">
          Apply
        </button>
      </form>

      <div className={styles.viewBar}>
        <p className={styles.count}>
          {view.length} of {rows.length} lead{rows.length === 1 ? "" : "s"}
        </p>
        {/* Admin and ops, per cockpit-v3 §11. Reading a view and exporting the
            same view are the same act with a different destination. */}
        <a
          className={styles.rowButton}
          href={`/api/admin/briefs/export${exportQuery ? `?${exportQuery}` : ""}`}
        >
          Export this view as CSV
        </a>
      </div>

      {!mayWrite ? (
        <p className={styles.note}>
          You can read and export every lead. Moving a lead through the pipeline
          and assigning an owner are reserved to an owner or an administrator.
        </p>
      ) : null}

      {view.length === 0 ? (
        <p className={styles.empty}>
          {rows.length === 0
            ? "No submissions recorded yet. This is what an empty table looks like, not a failed read: a failed read says so above."
            : "No lead matches this view. The filters above are in the URL, so clearing them is a step back."}
        </p>
      ) : (
        <ul className={styles.rows}>
          {view.map(({ row, state, owner }) => {
            const card = leadCard(row.payload);
            const sla = slaFor(row.createdAt, state, now);
            const delivery = deliveryLine(row.deliveryStatus);
            const side = funnel.get(row.id);
            return (
              <li
                className={styles.leadRow}
                data-highlight={f.lead === row.id ? "true" : "false"}
                id={`lead-${row.id}`}
                key={row.id}
              >
                <div className={styles.rowHead}>
                  <span className={styles.statePill} data-state={state}>
                    {FUNNEL_LABELS[state]}
                  </span>
                  <RowTitle className={styles.rowTitle} level={2}>
                    {card.name ?? card.email ?? "No name in the capture"}
                  </RowTitle>
                  <span className={styles.meta}>{row.endpoint}</span>
                  <span className={styles.slaPill} data-band={sla.band}>
                    {sla.label}
                  </span>
                </div>

                {/* ── The card ────────────────────────────────────────── */}
                <dl className={styles.leadFields}>
                  {(
                    [
                      ["Email", card.email],
                      ["Company", card.company],
                      ["Role", card.role],
                      ["Region", card.region],
                      ["Engagement", card.engagement],
                      ["Platform", card.platform],
                    ] as const
                  )
                    .filter(([, value]) => value !== null)
                    .map(([label, value]) => (
                      <div className={styles.leadField} key={label}>
                        <dt>{label}</dt>
                        <dd>
                          {label === "Email" && value ? (
                            <a href={`mailto:${value}`}>{value}</a>
                          ) : (
                            value
                          )}
                        </dd>
                      </div>
                    ))}
                  <div className={styles.leadField}>
                    <dt>Captured</dt>
                    <dd>
                      {new Date(row.createdAt).toLocaleString("en-GB", {
                        timeZone: "UTC",
                      })}{" "}
                      UTC
                    </dd>
                  </div>
                  <div className={styles.leadField}>
                    <dt>Owner</dt>
                    <dd>{owner ?? "Unassigned"}</dd>
                  </div>
                  <div className={styles.leadField}>
                    <dt>Delivery</dt>
                    <dd className={delivery.failed ? styles.bad : styles.ok}>
                      {delivery.text}
                    </dd>
                  </div>
                </dl>

                {card.message ? (
                  <p className={styles.leadMessage}>{card.message}</p>
                ) : null}

                {side?.note ? (
                  <p className={styles.leadNote}>
                    <span className={styles.leadNoteLabel}>Note</span>
                    {side.note}
                  </p>
                ) : null}

                <p className={styles.leadLinks}>
                  {row.transcriptRef ? (
                    /* The linkage both ways — cockpit-v3 §11. The brief knew its
                       transcript id and showed it as a bare string; it is a link
                       to the conversation now, and the conversation links back. */
                    <Link
                      href={`/admin/conversations/${encodeURIComponent(row.transcriptRef)}`}
                    >
                      The conversation this came from
                    </Link>
                  ) : null}
                  {card.email ? (
                    <a href={`mailto:${card.email}`}>Reply by email</a>
                  ) : null}
                  {row.referrer ? (
                    <span className={styles.meta}>
                      referrer: {row.referrer}
                    </span>
                  ) : null}
                </p>

                {/* ── The controls ────────────────────────────────────── */}
                {mayWrite ? (
                  <div className={styles.leadControls}>
                    {FUNNEL_STATES.filter((s) => s !== state).map((next) => (
                      <form action={setFunnelAction} key={next}>
                        <input name="id" type="hidden" value={row.id} />
                        <input name="state" type="hidden" value={next} />
                        <FilterEcho f={f} />
                        <button
                          className={styles.rowButton}
                          title={FUNNEL_DESCRIPTIONS[next]}
                          type="submit"
                        >
                          {FUNNEL_LABELS[next]}
                        </button>
                      </form>
                    ))}
                    <form
                      action={setFunnelAction}
                      className={styles.assignForm}
                    >
                      <input name="id" type="hidden" value={row.id} />
                      <FilterEcho f={f} />
                      <label
                        className={styles.assignLabel}
                        htmlFor={`owner-${row.id}`}
                      >
                        Owner
                      </label>
                      <select
                        className={styles.assignSelect}
                        defaultValue={owner ?? ""}
                        id={`owner-${row.id}`}
                        name="ownerEmail"
                      >
                        <option value="">Unassigned</option>
                        {owners.map((o) => (
                          <option key={o.email} value={o.email}>
                            {o.email}
                          </option>
                        ))}
                      </select>
                      <button className={styles.rowButton} type="submit">
                        Assign
                      </button>
                    </form>
                  </div>
                ) : null}

                {/* The raw payload stays, behind a disclosure — cockpit-v3 §11.
                    It is the only complete record; the card above is a reading
                    of it, and a reading must never be the only copy. */}
                <details className={styles.payloadDisclosure}>
                  <summary>The captured payload, exactly as stored</summary>
                  <pre className={styles.payload}>
                    {JSON.stringify(row.payload, null, 2)}
                  </pre>
                </details>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

/**
 * The current filters, echoed into a POST so the redirect can restore them.
 *
 * A state change that dropped an operator out of "New, oldest first" and back
 * to an unfiltered list would cost them their place in a list they are working
 * down. Hidden inputs rather than a query string on the action, because a
 * server action's URL is not ours to compose.
 */
function FilterEcho({ f }: { f: Filters }) {
  const keys = ["state", "owner", "source", "q", "from", "to", "view"] as const;
  return (
    <>
      {keys.map((key) =>
        f[key] ? (
          <input key={key} name={`f_${key}`} type="hidden" value={f[key]} />
        ) : null,
      )}
    </>
  );
}
