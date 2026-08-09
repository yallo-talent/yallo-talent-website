import Link from "next/link";
import styles from "@/app/admin/Admin.module.css";
import {
  capabilitiesIndex,
  industriesIndex,
  platformsIndex,
} from "@/data/l1/index";
import { BUDGETS, FIXED_BYLINE } from "@/lib/admin/content-validation";
import type { ArticleRow } from "@/lib/db/content";
import type { ContentType } from "@/lib/db/content-write";
import type { RevisionSummary } from "@/lib/db/revisions";
import editor from "./Editor.module.css";
import { EditorClient } from "./EditorClient";

/**
 * One editor surface for both content types, design §4: "Works for articles AND
 * case studies."
 *
 * ONE COMPONENT, NOT TWO PANES THAT LOOK ALIKE. The two tables differ by the
 * structured case-study fields and by nothing else that a writer touches, so a
 * second copy of this would be a second place for the taxonomy dropdowns, the
 * counters and the revision list to drift. The case-study extras sit ALONGSIDE
 * the body editor rather than replacing anything, which is what the design says.
 *
 * THE THREE TAXONOMY DROPDOWNS ARE HERE FOR BOTH TYPES — R-25b.3. The nine
 * imported studies carry no taxonomy values, and until this existed there was
 * no way for Sumeet or Raphy to give them any from a browser. No session
 * assigns them: canon A5 enforcement applies to publishes after real values
 * exist, and inventing taxonomy is forbidden.
 *
 * THE BYLINE IS NOT A FIELD. Canon §8, and there is nothing here to type a
 * person's name into.
 */

const TAXONOMIES = [
  { name: "industry", label: "Industry", index: industriesIndex },
  { name: "platform", label: "Platform", index: platformsIndex },
  { name: "discipline", label: "Discipline", index: capabilitiesIndex },
] as const;

export interface EditorPaneProps {
  type: ContentType;
  row: ArticleRow;
  revisions: RevisionSummary[];
  /** Editorial types for articles, engagement pillars for case studies. */
  categories: readonly string[];
  saveMetaAction: (formData: FormData) => Promise<void>;
  restoreRevisionAction: (formData: FormData) => Promise<void>;
  saveBody: (body: unknown) => Promise<void>;
  notice?: { err?: string; saved?: string; restored?: string };
}

export function EditorPane({
  type,
  row,
  revisions,
  categories,
  saveMetaAction,
  restoreRevisionAction,
  saveBody,
  notice,
}: EditorPaneProps) {
  const publicRoute = type === "article" ? "/insights" : "/case-studies";
  const backRoute =
    type === "article" ? "/admin/articles" : "/admin/case-studies";
  const published = row.status === "published";

  return (
    <>
      <p className={styles.meta}>
        <Link href={backRoute}>
          ← {type === "article" ? "Articles" : "Case studies"}
        </Link>
      </p>
      <h1 className={styles.h1}>{row.title || "Untitled"}</h1>
      <p className={styles.lede}>
        {published ? "Published at " : "Draft, will publish at "}
        <code>
          {publicRoute}/{row.slug}
        </code>
        . The byline is applied by the system as {FIXED_BYLINE} and is not a
        field.
      </p>

      {notice?.err ? <p className={styles.error}>{notice.err}</p> : null}
      {notice?.saved ? <p className={styles.ok}>Fields saved.</p> : null}
      {notice?.restored ? (
        <p className={styles.ok}>
          That revision is now the body. The version it replaced was itself
          recorded, so this is undoable.
        </p>
      ) : null}

      <EditorClient
        initialBody={row.body}
        previewPath={`/admin/preview/${type}/${row.id}`}
        previewReady
        saveBody={saveBody}
      />

      <h2 className={styles.h2}>Fields</h2>
      <form action={saveMetaAction} className={editor.metaForm}>
        <input name="type" type="hidden" value={type} />
        <input name="id" type="hidden" value={row.id} />

        <label className={styles.field} htmlFor="f-title">
          <span className={styles.fieldLabel}>
            Title <Counter max={BUDGETS.title.max} value={row.title} />
          </span>
          <input
            className={styles.input}
            defaultValue={row.title}
            id="f-title"
            name="title"
            required
            type="text"
          />
        </label>

        <label className={styles.field} htmlFor="f-slug">
          <span className={styles.fieldLabel}>Slug</span>
          <input
            className={styles.input}
            defaultValue={row.slug}
            id="f-slug"
            name="slug"
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            required
            type="text"
          />
        </label>

        <label className={styles.field} htmlFor="f-summary">
          <span className={styles.fieldLabel}>
            Summary <Counter max={BUDGETS.summary.max} value={row.summary} />
          </span>
          <textarea
            className={styles.input}
            defaultValue={row.summary}
            id="f-summary"
            name="summary"
            rows={3}
          />
        </label>

        <label className={styles.field} htmlFor="f-category">
          <span className={styles.fieldLabel}>Category</span>
          {/* A closed list, not free text — R-25b.2. Articles carry the design's
              five editorial types; case studies carry the engagement pillar
              their cards already display. The publish action enforces the right
              list per type, and this is the control that makes obeying it the
              easy path. */}
          <select
            className={styles.input}
            defaultValue={row.category}
            id="f-category"
            name="category"
          >
            <option value="">Not set</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        {TAXONOMIES.map((tax) => (
          <fieldset className={editor.taxFieldset} key={tax.name}>
            <legend className={styles.fieldLabel}>{tax.label}</legend>
            <div className={editor.taxGrid}>
              {tax.index.map((entry) => {
                const id = `${tax.name}-${entry.slug}`;
                return (
                  <label className={editor.taxOption} htmlFor={id} key={id}>
                    <input
                      defaultChecked={(row[tax.name] as string[]).includes(
                        entry.slug,
                      )}
                      id={id}
                      name={tax.name}
                      type="checkbox"
                      value={entry.slug}
                    />
                    <span>{entry.label}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}

        <label className={styles.field} htmlFor="f-meta-title">
          <span className={styles.fieldLabel}>
            Meta title{" "}
            <Counter max={BUDGETS.metaTitle.max} value={row.metaTitle ?? ""} />
          </span>
          <input
            className={styles.input}
            defaultValue={row.metaTitle ?? ""}
            id="f-meta-title"
            name="metaTitle"
            placeholder={row.title}
            type="text"
          />
        </label>

        <label className={styles.field} htmlFor="f-meta-description">
          <span className={styles.fieldLabel}>
            Meta description{" "}
            <Counter
              max={BUDGETS.metaDescription.max}
              value={row.metaDescription ?? ""}
            />
          </span>
          <textarea
            className={styles.input}
            defaultValue={row.metaDescription ?? ""}
            id="f-meta-description"
            name="metaDescription"
            placeholder={row.summary}
            rows={2}
          />
        </label>

        <button className={styles.submit} type="submit">
          Save fields
        </button>
      </form>

      <h2 className={styles.h2}>
        History · {revisions.length} revision
        {revisions.length === 1 ? "" : "s"}
      </h2>
      <p className={styles.note}>
        Every save writes one. This is what replaces git history, and it is why
        nothing here needs a copy in the repository. Restoring is itself
        recorded, so it can be undone by restoring again.
      </p>
      {revisions.length === 0 ? (
        <p className={styles.empty}>No revisions yet.</p>
      ) : (
        <ul className={styles.rows}>
          {revisions.map((rev) => (
            <li className={styles.row} key={rev.id}>
              <div className={styles.rowHead}>
                <span className={styles.meta}>
                  {rev.createdAt.slice(0, 16).replace("T", " ")}
                </span>
                <span className={styles.meta}>{rev.authorName}</span>
                <span className={styles.meta}>{rev.bytes} characters</span>
              </div>
              <div className={styles.rowActions}>
                <Link
                  className={styles.rowButton}
                  href={`/admin/preview/${type}/${row.id}?revision=${rev.id}`}
                  target="_blank"
                >
                  Preview
                </Link>
                <form action={restoreRevisionAction}>
                  <input name="type" type="hidden" value={type} />
                  <input name="id" type="hidden" value={row.id} />
                  <input name="revisionId" type="hidden" value={rev.id} />
                  <button className={styles.rowButton} type="submit">
                    Restore
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

/**
 * The live character counter, design §6.
 *
 * SERVER-RENDERED FROM THE STORED VALUE. It reports what is saved, which is
 * what a search engine will read. A count that followed the keystrokes would
 * be reporting a state that does not exist anywhere yet.
 */
function Counter({ value, max }: { value: string; max: number }) {
  const n = value.trim().length;
  return (
    <span
      className={editor.counter}
      data-over={n > max ? "true" : "false"}
      title={`${n} of ${max} characters`}
    >
      {n}/{max}
    </span>
  );
}
