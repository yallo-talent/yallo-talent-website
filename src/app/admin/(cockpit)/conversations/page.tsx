import { readConversations } from "@/lib/admin/reads";
import { TRANSCRIPT_RETENTION_DAYS } from "@/lib/assistant/retention";
import styles from "../../Admin.module.css";

/**
 * Pane 2, Conversations. READ ONLY, and deliberately so (round 17 §3).
 *
 * The scheduled purge owns transcript deletion. A second deletion path would race
 * it: the purge deletes by age across the whole table, and a per-row delete in a
 * UI would let a row disappear mid-purge, or a purge report a count that no
 * longer matches what it removed. One owner.
 *
 * The NEWEST snapshot per transcriptId is the whole conversation — each row in
 * `assistant_transcripts` carries the full running conversation as of that turn,
 * so listing every row would show the same chat once per turn. See
 * src/lib/admin/reads.ts.
 *
 * The retention window is imported, never restated: a period written into a
 * sentence is a period that drifts from the one being enforced.
 */
export const dynamic = "force-dynamic";

export default async function ConversationsPane() {
  let rows: Awaited<ReturnType<typeof readConversations>> = [];
  let error: string | null = null;
  try {
    rows = await readConversations();
  } catch (err) {
    error =
      err instanceof Error ? err.message : "Unknown error reading transcripts.";
  }

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
      ) : rows.length === 0 ? (
        <p className={styles.empty}>
          No conversations within the retention window.
        </p>
      ) : (
        <>
          <p className={styles.count}>{rows.length} conversation(s)</p>
          <ul className={styles.rows}>
            {rows.map((row) => (
              <li key={row.transcriptId} className={styles.row}>
                <div className={styles.rowHead}>
                  <p className={styles.rowTitle}>{row.transcriptId}</p>
                  <span className={styles.meta}>{row.turns} turn(s)</span>
                  <span className={styles.meta}>
                    {new Date(row.createdAt).toLocaleString("en-GB", {
                      timeZone: "UTC",
                    })}{" "}
                    UTC
                  </span>
                </div>
                {row.messages.map((message, i) => (
                  <p
                    // biome-ignore lint/suspicious/noArrayIndexKey: a conversation can legitimately repeat a message verbatim, so role+content is not unique; the list is read-only and never reordered or spliced, which is the condition the rule guards against
                    key={`${row.transcriptId}-${i}`}
                    className={`${styles.turn} ${message.role === "user" ? styles.turnUser : ""}`}
                  >
                    <span className={styles.turnRole}>{message.role}</span>
                    {message.content}
                  </p>
                ))}
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
