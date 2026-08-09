"use client";

import { useMemo } from "react";
import styles from "@/app/admin/Admin.module.css";
import {
  type PublishError,
  severityOf,
  validateForPublish,
} from "@/lib/admin/content-validation";
import { answerFirstNotes } from "@/lib/content-seo";
import editor from "./Editor.module.css";

/**
 * Every check, live, while the piece is being written.
 *
 * WHY THIS EXISTS. Until now the rules only spoke at publish time, and they
 * spoke all at once, as one paragraph of concatenated messages on a pane the
 * writer had already left the editor to reach. Sumeet's report of 9 August is
 * the whole brief: editing an imported case study meant hitting Publish, being
 * handed a wall of text about a heading level and about one canon §2 term in
 * inherited prose, and having no way to act on either from where he stood.
 *
 * So the same functions run here, against the document as it is now, and each
 * finding names the exact text it is about. Nothing new is detected: this is
 * the identical `validateForPublish` the publish action calls, so the editor
 * and the publish can never disagree about what is wrong.
 *
 * TWO SEVERITIES, AND THE DISTINCTION IS THE RULING. `BLOCKING_RULES` names the
 * two that refuse a publish; everything else is a warning the writer may
 * overrule. Showing both here, marked differently, is what makes the publish
 * button predictable — a writer can see before they press it whether it will
 * go out.
 *
 * IT RUNS ON THE CLIENT, over the document in memory, on every keystroke the
 * editor reports. That is why `content-validation.ts` is deliberately not
 * `server-only`: every function in it is pure over its inputs and holds no
 * secret, and the alternative is a round trip per keystroke.
 */
export interface LiveChecksProps {
  body: unknown;
  title: string;
  summary: string;
  category: string;
  metaTitle: string | null;
  metaDescription: string | null;
  industry: string[];
  platform: string[];
  discipline: string[];
  sources: { claim?: string; source?: string }[];
  contentType: "article" | "case_study";
  /** Every path the site serves, so rule 3 has something true to compare to. */
  knownPaths: string[];
}

export function LiveChecks(props: LiveChecksProps) {
  const findings = useMemo<PublishError[]>(() => {
    const known = new Set(props.knownPaths);
    const rules = validateForPublish(
      {
        contentType: props.contentType,
        title: props.title,
        category: props.category,
        summary: props.summary,
        metaTitle: props.metaTitle,
        metaDescription: props.metaDescription,
        body: props.body,
        sources: props.sources,
        industry: props.industry,
        platform: props.platform,
        discipline: props.discipline,
      },
      known,
    );
    /* The answer-first notes join the same list rather than sitting in their
       own box. To a writer they are one question — "is anything wrong with
       this piece" — and two panels answering it separately is two places to
       look. They are advisory by construction and carry no rule number. */
    const answerFirst = answerFirstNotes({
      summary: props.summary,
      body: props.body,
    }).map((note) => ({
      rule: -1,
      field: "answer-first",
      message: note.message,
      severity: "warn" as const,
    }));
    return [...rules, ...answerFirst];
  }, [props]);

  const blocking = findings.filter(
    (f) => f.rule >= 0 && severityOf(f.rule) === "block",
  );
  const warned = findings.filter(
    (f) => f.rule < 0 || severityOf(f.rule) !== "block",
  );

  return (
    <section aria-live="polite" className={editor.checks}>
      <h2 className={styles.warnHead}>
        {blocking.length === 0
          ? "Ready to publish"
          : `${blocking.length} thing(s) will stop this publishing`}
      </h2>

      {blocking.length === 0 && warned.length === 0 ? (
        <p className={styles.note}>
          Nothing to flag. Every check runs here as you type, so the publish
          button holds no surprises.
        </p>
      ) : null}

      {blocking.length > 0 && (
        <ul className={editor.checkList}>
          {blocking.map((f) => (
            <li className={editor.checkBlock} key={`${f.rule}-${f.field}`}>
              <span className={editor.checkTag}>Blocks publishing</span>
              <span className={editor.checkField}>{f.field}</span>
              {f.message}
            </li>
          ))}
        </ul>
      )}

      {warned.length > 0 && (
        <ul className={editor.checkList}>
          {warned.map((f) => (
            <li
              className={editor.checkWarn}
              key={`${f.rule}-${f.field}-${f.message.slice(0, 24)}`}
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
