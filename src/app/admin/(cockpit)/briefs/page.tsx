import { readBriefs } from "@/lib/admin/reads";
import styles from "../../Admin.module.css";
import { RowTitle } from "../../RowTitle";

/**
 * Pane 1, Briefs. READ ONLY, and there is no delete path anywhere in this tree
 * (round 17 §3). `submissions` is the durable capture backstop: it exists so a
 * lead survives Resend being down, and a table whose whole purpose is never to
 * lose a row does not get a delete button in a web UI.
 *
 * This replaces `pnpm db:read-submissions` as the thing consulted when Resend has
 * failed. The script stays — when the cockpit is what is broken, a shell an
 * operator already has is the right tool.
 *
 * Newest first, with endpoint, source, delivery status and the raw payload, which
 * is the exact set round 14 could only get from a terminal.
 */
export const dynamic = "force-dynamic";

function deliveryLine(
  status: Awaited<ReturnType<typeof readBriefs>>[number]["deliveryStatus"],
) {
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

export default async function BriefsPane() {
  let rows: Awaited<ReturnType<typeof readBriefs>> = [];
  let error: string | null = null;
  try {
    rows = await readBriefs();
  } catch (err) {
    /* The message, not the stack, and never the connection string. A cockpit that
       500s tells its one reader nothing; a cockpit that says "DATABASE_URL is not
       set" tells them what to do. */
    error =
      err instanceof Error ? err.message : "Unknown error reading submissions.";
  }

  return (
    <>
      <h1 className={styles.h1}>Briefs</h1>
      <p className={styles.lede}>
        Every capture the site has recorded, newest first. This table is the
        backstop: a row here means the submission was captured whether or not
        email delivery succeeded, so a failed delivery is a lead to chase, not a
        lead lost. Read only, and nothing here can be deleted.
      </p>

      {error ? (
        <p className={styles.empty}>Could not read submissions: {error}</p>
      ) : rows.length === 0 ? (
        <p className={styles.empty}>
          No submissions recorded yet. This is what an empty table looks like,
          not a failed read: a failed read says so above.
        </p>
      ) : (
        <>
          <p className={styles.count}>{rows.length} submission(s)</p>
          <ul className={styles.rows}>
            {rows.map((row) => {
              const delivery = deliveryLine(row.deliveryStatus);
              const who =
                (typeof row.payload.email === "string" && row.payload.email) ||
                (typeof row.payload.name === "string" && row.payload.name) ||
                "(no name or email in payload)";
              return (
                <li key={row.id} className={styles.row}>
                  <div className={styles.rowHead}>
                    <RowTitle level={2} className={styles.rowTitle}>
                      {who}
                    </RowTitle>
                    <span className={styles.meta}>{row.endpoint}</span>
                    {row.originSource ? (
                      <span className={styles.meta}>{row.originSource}</span>
                    ) : null}
                    <span className={styles.meta}>
                      {new Date(row.createdAt).toLocaleString("en-GB", {
                        timeZone: "UTC",
                      })}{" "}
                      UTC
                    </span>
                    <span className={delivery.failed ? styles.bad : styles.ok}>
                      {delivery.text}
                    </span>
                  </div>
                  {row.referrer ? (
                    <p className={styles.meta}>referrer: {row.referrer}</p>
                  ) : null}
                  {row.transcriptRef ? (
                    <p className={styles.meta}>
                      transcript: {row.transcriptRef}
                    </p>
                  ) : null}
                  <pre className={styles.payload}>
                    {JSON.stringify(row.payload, null, 2)}
                  </pre>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </>
  );
}
