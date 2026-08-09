"use client";

import { useEffect, useId, useRef } from "react";
import type { PublishError } from "@/lib/admin/content-validation";
import type { ContentType } from "@/lib/db/content-write";
import styles from "./Editor.module.css";

/**
 * The publish sheet — R-26.1's "one sheet listing any outstanding warnings,
 * publishing on a single confirm".
 *
 * IT IS INFORMATION, NOT A GATE, and the wording carries that. Nothing here can
 * refuse; the confirm is always live. What the sheet does is make sure the
 * person publishing has SEEN what they are publishing over, once, at the moment
 * it matters, rather than discovering it in a redirect afterwards. R-26.1
 * records the consequence it accepts: past a warning, an unsourced figure can
 * reach a reader. This sheet is where that choice is actually made, so it shows
 * the findings in full rather than counting them.
 *
 * THE FINDINGS ARE THE LIVE ONES. They come from the same `validateForPublish`
 * running in the editor on every keystroke, over the document on screen, so the
 * sheet cannot disagree with the panel the writer has been reading. The server
 * runs them again after the write and carries them back, which is a second
 * opinion over the stored row rather than a duplicate of this one.
 *
 * ONE SUBMIT, AND IT IS A FORM. The confirm posts the same `setStatusAction`
 * the list's Publish button posts, with `returnTo=editor` so the writer lands
 * back on the piece with its live URL rather than on a list.
 */
export function PublishSheet({
  type,
  id,
  slug,
  publicRoute,
  findings,
  setStatusAction,
  onClose,
  onBeforeConfirm,
}: {
  type: ContentType;
  id: string;
  slug: string;
  publicRoute: string;
  findings: PublishError[];
  setStatusAction: (formData: FormData) => Promise<void>;
  onClose: () => void;
  /** Flushes any outstanding autosave, so the publish cannot beat the typing. */
  onBeforeConfirm: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const headingId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    const onCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };
    dialog.addEventListener("cancel", onCancel);
    return () => dialog.removeEventListener("cancel", onCancel);
  }, [onClose]);

  const noun = type === "article" ? "article" : "case study";

  return (
    <dialog aria-labelledby={headingId} className={styles.dialog} ref={ref}>
      <div className={styles.dialogHead}>
        <h2 className={styles.dialogTitle} id={headingId}>
          Publish this {noun}
        </h2>
        <button className={styles.barButton} onClick={onClose} type="button">
          Close
        </button>
      </div>

      <div className={styles.dialogBody}>
        <p className={styles.dialogLede}>
          It goes live at{" "}
          <code className={styles.dialogUrl}>
            {publicRoute}/{slug}
          </code>{" "}
          within seconds. Its index, its taxonomy pages, the sitemap and{" "}
          <code className={styles.dialogUrl}>llms.txt</code> update with it.
        </p>

        {findings.length === 0 ? (
          <p className={styles.dialogClean}>
            Nothing outstanding. Every check this cockpit runs is clean on this
            piece.
          </p>
        ) : (
          <>
            <h3 className={styles.dialogSectionTitle}>
              {findings.length} thing{findings.length === 1 ? "" : "s"} worth
              knowing before it goes out
            </h3>
            <p className={styles.dialogNote}>
              None of these stops the publish. They are listed so the decision
              to publish over them is a decision rather than an accident.
            </p>
            <ul className={styles.sheetFindings}>
              {findings.map((f) => (
                <li
                  className={styles.sheetFinding}
                  key={`${f.rule}-${f.field}-${f.message.slice(0, 32)}`}
                >
                  <span className={styles.sheetFindingField}>{f.field}</span>
                  <span className={styles.sheetFindingText}>{f.message}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <form action={setStatusAction} className={styles.dialogFoot}>
        <input name="type" type="hidden" value={type} />
        <input name="id" type="hidden" value={id} />
        <input name="next" type="hidden" value="published" />
        <input name="returnTo" type="hidden" value="editor" />
        <button
          className={styles.primaryAction}
          onClick={onBeforeConfirm}
          type="submit"
        >
          Publish now
        </button>
        <button className={styles.barButton} onClick={onClose} type="button">
          Not yet
        </button>
      </form>
    </dialog>
  );
}
