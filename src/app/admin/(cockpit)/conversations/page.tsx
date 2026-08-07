import Link from "next/link";
import { ADMIN_ROUTES } from "@/lib/admin/config";
import {
  type ConversationSummary,
  readConversationSummaries,
} from "@/lib/admin/reads";
import { TRANSCRIPT_RETENTION_DAYS } from "@/lib/assistant/retention";
import styles from "../../Admin.module.css";

/**
 * Pane 2, Conversations. READ ONLY, and deliberately so (round 17 §3).
 *
 * The scheduled purge owns transcript deletion. A second deletion path would race
 * it: the purge deletes by age across the whole table, and a per-row delete in a
 * UI would let a row disappear mid-purge, or a purge report a count that no
 * longer matches what it removed. One owner. Round 20 changes the view and
 * changes neither retention nor purge.
 *
 * ROUND 20 §3.1: A SUMMARY LIST IS THE DEFAULT VIEW. Every transcript was
 * previously printed in full, one after another, so the pane answered "what did
 * this one person ask" and could not answer "how many people asked anything this
 * week". Five fields per line, all deterministic from stored fields — no model
 * call, no summarisation, no new cost, and no new derived personal data. The
 * summary line is the visitor's own opening question, quoted.
 *
 * THE FILTERS ARE A GET FORM. No client component, no state, no JavaScript: the
 * filter is in the URL, which means it is linkable, back-button-correct and
 * survives a reload. A cockpit that needs a bundle to filter a list is a cockpit
 * that breaks differently from the site around it.
 *
 * PAGE OF ORIGIN IS PARTIAL BY CONSTRUCTION, and the pane says so rather than
 * rendering an empty cell. `assistant_transcripts` stores no origin; the only
 * one in the database sits on `submissions`, so it exists for conversations that
 * produced a brief and for no others. See src/lib/admin/reads.ts.
 */
export const dynamic = "force-dynamic";

interface Filters {
  from?: string;
  to?: string;
  brief?: string;
  page?: string;
}

/**
 * Applied here rather than in SQL, deliberately. The unfiltered set is one row
 * per conversation inside a retention window measured in days; filtering it in
 * the database would mean four optional predicates and a query that is harder to
 * read than the thing it saves. If this list ever outgrows that, the query is
 * the place to move it and this comment is the note saying why it was not there
 * first.
 */
function applyFilters(
  rows: ConversationSummary[],
  f: Filters,
): ConversationSummary[] {
  return rows.filter((r) => {
    const day = r.createdAt.slice(0, 10);
    if (f.from && day < f.from) return false;
    if (f.to && day > f.to) return false;
    if (f.brief === "yes" && !r.hasBrief) return false;
    if (f.brief === "no" && r.hasBrief) return false;
    if (f.page && f.page !== "" && r.originPath !== f.page) return false;
    return true;
  });
}

export default async function ConversationsPane({
  searchParams,
}: {
  searchParams: Promise<Filters>;
}) {
  const filters = await searchParams;

  let all: ConversationSummary[] = [];
  let error: string | null = null;
  try {
    all = await readConversationSummaries();
  } catch (err) {
    error =
      err instanceof Error ? err.message : "Unknown error reading transcripts.";
  }

  const rows = applyFilters(all, filters);
  const pages = [
    ...new Set(all.map((r) => r.originPath).filter((p): p is string => !!p)),
  ].sort();
  const withOrigin = all.filter((r) => r.originPath !== null).length;

  return (
    <>
      <h1 className={styles.h1}>Conversations</h1>
      <p className={styles.lede}>
        Assistant transcripts, newest first, one entry per conversation rather
        than one per turn. Read only: the scheduled purge owns deletion and
        removes anything older than {TRANSCRIPT_RETENTION_DAYS} days, so a
        second delete path here would race it. What is missing from this list
        has been purged, not lost.
      </p>

      {error ? (
        <p className={styles.empty}>Could not read transcripts: {error}</p>
      ) : (
        <>
          <form className={styles.filters} method="get">
            <label className={styles.field}>
              <span className={styles.meta}>From</span>
              <input
                className={styles.input}
                type="date"
                name="from"
                defaultValue={filters.from ?? ""}
              />
            </label>
            <label className={styles.field}>
              <span className={styles.meta}>To</span>
              <input
                className={styles.input}
                type="date"
                name="to"
                defaultValue={filters.to ?? ""}
              />
            </label>
            <label className={styles.field}>
              <span className={styles.meta}>Brief captured</span>
              <select
                className={styles.input}
                name="brief"
                defaultValue={filters.brief ?? ""}
              >
                <option value="">Any</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </label>
            <label className={styles.field}>
              <span className={styles.meta}>Page of origin</span>
              <select
                className={styles.input}
                name="page"
                defaultValue={filters.page ?? ""}
              >
                <option value="">Any</option>
                {pages.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>
            <button className={styles.submit} type="submit">
              Filter
            </button>
            <Link className={styles.submit} href={ADMIN_ROUTES.conversations}>
              Clear
            </Link>
          </form>

          <p className={styles.count}>
            {rows.length} of {all.length} conversation(s)
          </p>

          {/* Stated once, on the pane, rather than left for someone to infer
              from a column that is empty most of the time. */}
          <p className={styles.meta}>
            Page of origin is recorded for {withOrigin} of {all.length}. Every
            conversation started from 8 August 2026 carries the page the panel
            was opened on, as a path with no query string. Conversations before
            that date carry one only where they produced a brief; the rest read
            &ldquo;before 8 August 2026&rdquo;. It is never inferred.
          </p>

          {rows.length === 0 ? (
            <p className={styles.empty}>
              {all.length === 0
                ? "No conversations within the retention window."
                : "No conversation matches this filter."}
            </p>
          ) : (
            <ul className={styles.rows}>
              {rows.map((row) => (
                <li key={row.transcriptId} className={styles.row}>
                  <div className={styles.rowHead}>
                    <span className={styles.meta}>
                      {new Date(row.createdAt).toLocaleString("en-GB", {
                        timeZone: "UTC",
                      })}{" "}
                      UTC
                    </span>
                    <span className={styles.meta}>{row.turns} turn(s)</span>
                    {/* Round 21 §4: a null origin is a DATE, not a gap. Every
                        conversation from 8 August 2026 carries the page it was
                        opened on; the ones before it never will, and saying so
                        is more useful than "not recorded", which reads as a
                        fault in the capture rather than as its start date. */}
                    <span className={styles.meta}>
                      {row.originPath ?? "before 8 August 2026"}
                    </span>
                    <span className={row.hasBrief ? styles.ok : styles.meta}>
                      {row.hasBrief ? "brief captured" : "no brief"}
                    </span>
                  </div>
                  <p className={styles.rowTitle}>
                    <Link
                      href={`${ADMIN_ROUTES.conversations}/${encodeURIComponent(row.transcriptId)}`}
                    >
                      {row.opening ?? "(the visitor sent no message)"}
                    </Link>
                  </p>
                  <p className={styles.meta}>{row.transcriptId}</p>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </>
  );
}
