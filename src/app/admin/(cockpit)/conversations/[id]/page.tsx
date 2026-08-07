import Link from "next/link";
import { notFound } from "next/navigation";
import { ADMIN_ROUTES } from "@/lib/admin/config";
import { readConversation } from "@/lib/admin/reads";
import { TRANSCRIPT_RETENTION_DAYS } from "@/lib/assistant/retention";
import styles from "../../../Admin.module.css";

/**
 * One conversation, in full. Round 20 §3.1's "one click deeper".
 *
 * Unchanged in substance from what the list used to render inline: the newest
 * snapshot per transcript is the whole conversation, and it is read only. What
 * changed is that reading one no longer means loading every other.
 *
 * Under the (cockpit) layout, so the session guard applies by position in the
 * tree rather than by anyone remembering to add it here — see that layout's own
 * note on why the guard lives there.
 */
export const dynamic = "force-dynamic";

export default async function ConversationDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const transcriptId = decodeURIComponent(id);

  let row: Awaited<ReturnType<typeof readConversation>> = null;
  let error: string | null = null;
  try {
    row = await readConversation(transcriptId);
  } catch (err) {
    error =
      err instanceof Error ? err.message : "Unknown error reading transcript.";
  }

  /* A transcript that is absent is far more likely to have been purged than to
     be a bad URL, and saying so is the difference between a 404 that worries
     someone and one that explains itself. */
  if (!error && !row) notFound();

  return (
    <>
      <p className={styles.meta}>
        <Link href={ADMIN_ROUTES.conversations}>Back to conversations</Link>
      </p>
      <h1 className={styles.h1}>Conversation</h1>
      <p className={styles.meta}>{transcriptId}</p>

      {error ? (
        <p className={styles.empty}>Could not read transcript: {error}</p>
      ) : row ? (
        <>
          <p className={styles.lede}>
            {row.turns} turn(s), started{" "}
            {new Date(row.createdAt).toLocaleString("en-GB", {
              timeZone: "UTC",
            })}{" "}
            UTC. Read only — the scheduled purge removes this{" "}
            {TRANSCRIPT_RETENTION_DAYS} days after it was recorded, and there is
            no delete here that could race it.
          </p>
          <ul className={styles.rows}>
            <li className={styles.row}>
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
          </ul>
        </>
      ) : null}
    </>
  );
}
