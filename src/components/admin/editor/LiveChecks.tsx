"use client";

import styles from "@/components/admin/Admin.module.css";
import type { PublishError } from "@/lib/admin/content-validation";
import editor from "./Editor.module.css";

/**
 * Every check, live, while the piece is being written.
 *
 * WHY THIS EXISTS. Until round 25c the rules only spoke at publish time, and
 * they spoke all at once, as one paragraph of concatenated messages on a pane
 * the writer had already left the editor to reach. Sumeet's report of 9 August
 * is the whole brief: editing an imported case study meant hitting Publish,
 * being handed a wall of text about a heading level and about one canon §2 term
 * in inherited prose, and having no way to act on either from where he stood.
 *
 * NOTHING HERE STOPS ANYTHING — R-26.1. There is no blocking list any more, and
 * there is no "will stop this publishing" heading, because that heading was a
 * promise about a refusal that no longer happens. What each finding gets is the
 * exact text it is about and the field it lives in. The publish sheet shows the
 * same list one click before the piece goes out.
 *
 * IT IS PRESENTATION ONLY SINCE ROUND 26. The findings are computed in
 * `EditorSurface`, because the sheet needs the same list and two components
 * computing it from different inputs is how a warning comes to name a summary
 * the writer has already fixed.
 */
export function LiveChecks({ findings }: { findings: PublishError[] }) {
  return (
    <section aria-live="polite" className={editor.checks}>
      <h2 className={styles.warnHead}>
        {findings.length === 0
          ? "Nothing outstanding"
          : `${findings.length} thing${findings.length === 1 ? "" : "s"} worth fixing`}
      </h2>

      {findings.length === 0 ? (
        <p className={styles.note}>
          Every check runs here as you type. None of them can stop a save or a
          publish; they are here so nothing goes out by surprise.
        </p>
      ) : (
        <ul className={editor.checkList}>
          {findings.map((f) => (
            <li
              className={editor.checkWarn}
              key={`${f.rule}-${f.field}-${f.message.slice(0, 32)}`}
            >
              <span className={editor.checkTag}>Worth fixing</span>
              <span className={editor.checkField}>{f.field}</span>
              {f.message}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
