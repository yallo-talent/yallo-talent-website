"use client";

import { useActionState } from "react";
import type { DraftError } from "@/lib/admin/case-study-draft";
import styles from "../../../Admin.module.css";
import { type SaveResult, saveStudy } from "./actions";

/**
 * The edit form. The ONE client component in the cockpit, and it earns it.
 *
 * `useActionState` is what lets the server action hand validation errors back
 * into this render without a navigation. The alternative was built first: it
 * redirected with the messages JSON-encoded in a query parameter, which put
 * several hundred bytes of prose per error into the URL and rebuilt the form
 * from the file on disk, discarding the draft the operator had just typed.
 * Errors belong in the response.
 *
 * Everything else in this cockpit stays server-rendered, including the
 * conversations filter, which is a GET form precisely because it has no errors
 * to carry back.
 */
const EMPTY: SaveResult = { errors: [] };

const TEXT_FIELDS = [
  ["title", "Title"],
  ["cardTitle", "Card title"],
  ["deck", "Deck"],
  ["excerpt", "Excerpt"],
  ["client", "Client"],
  ["region", "Region"],
  ["engagement", "Engagement"],
  ["category", "Category"],
] as const;

export function EditStudyForm({
  slug,
  values,
  body,
  clientPublic,
  published,
}: {
  slug: string;
  values: Record<string, string>;
  body: string;
  clientPublic: boolean;
  published: boolean;
}) {
  const [state, action, pending] = useActionState(saveStudy, EMPTY);

  const errorsFor = (field: string) =>
    state.errors.filter((e: DraftError) => e.field === field);

  const known = new Set<string>([
    ...TEXT_FIELDS.map(([f]) => f),
    "clientPublic",
    "published",
    "body",
  ]);
  const unattached = state.errors.filter((e) => !known.has(e.field));

  return (
    <form action={action}>
      <input type="hidden" name="slug" value={slug} />

      {state.errors.length ? (
        <p className={styles.error}>
          {state.errors.length} problem(s). No pull request was opened and
          nothing was sent to GitHub.
        </p>
      ) : null}

      {TEXT_FIELDS.map(([field, label]) => (
        <label className={styles.field} key={field}>
          <span className={styles.fieldLabel}>{label}</span>
          <input
            className={styles.input}
            type="text"
            name={field}
            defaultValue={values[field] ?? ""}
          />
          {errorsFor(field).map((e) => (
            <span className={styles.error} key={e.message}>
              {e.message}
            </span>
          ))}
        </label>
      ))}

      {/* Rendered as a decision with its consequence spelled out, not as a
          checkbox labelled with a field name. The flag governs whether five
          different surfaces print a client's name, and the wording is the only
          place an operator meets the consent rule behind it. */}
      <label className={styles.field}>
        <span className={styles.fieldLabel}>
          Client named publicly — written consent on file
        </span>
        <select
          className={styles.input}
          name="clientPublic"
          defaultValue={clientPublic ? "true" : "false"}
        >
          <option value="true">Yes, the page may name the client</option>
          <option value="false">No, the page must not name the client</option>
        </select>
        {errorsFor("clientPublic").map((e) => (
          <span className={styles.error} key={e.message}>
            {e.message}
          </span>
        ))}
      </label>

      <label className={styles.field}>
        <span className={styles.fieldLabel}>Published</span>
        <select
          className={styles.input}
          name="published"
          defaultValue={published ? "true" : "false"}
        >
          <option value="true">Published</option>
          <option value="false">Unpublished — never a deletion</option>
        </select>
      </label>

      <label className={styles.field}>
        <span className={styles.fieldLabel}>Body</span>
        <textarea
          className={styles.input}
          name="body"
          rows={24}
          defaultValue={body}
        />
        {errorsFor("body").map((e) => (
          <span className={styles.error} key={e.message}>
            {e.message}
          </span>
        ))}
      </label>

      {unattached.map((e) => (
        <p className={styles.error} key={`${e.field}${e.message}`}>
          {e.field}: {e.message}
        </p>
      ))}

      <button className={styles.submit} type="submit" disabled={pending}>
        {pending ? "Opening a pull request…" : "Save and open a pull request"}
      </button>
    </form>
  );
}
