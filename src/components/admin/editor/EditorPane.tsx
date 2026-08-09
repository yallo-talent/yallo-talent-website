import Link from "next/link";
import styles from "@/app/admin/Admin.module.css";
import {
  capabilitiesIndex,
  industriesIndex,
  platformsIndex,
} from "@/data/l1/index";
import { BUDGETS, FIXED_BYLINE } from "@/lib/admin/content-validation";
import { answerFirstNotes } from "@/lib/content-seo";
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
  changeSlugAction: (formData: FormData) => Promise<void>;
  saveBody: (body: unknown) => Promise<void>;
  notice?: {
    err?: string;
    saved?: string;
    restored?: string;
    moved?: string;
  };
}

export function EditorPane({
  type,
  row,
  revisions,
  categories,
  saveMetaAction,
  restoreRevisionAction,
  changeSlugAction,
  saveBody,
  notice,
}: EditorPaneProps) {
  const publicRoute = type === "article" ? "/insights" : "/case-studies";
  const backRoute =
    type === "article" ? "/admin/articles" : "/admin/case-studies";
  const published = row.status === "published";
  const frozen = row.firstPublishedAt !== null;
  const answerFirst = answerFirstNotes(row);

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
      {notice?.moved ? (
        <p className={styles.ok}>
          URL moved: <code>{notice.moved}</code>. The redirect is written and
          permanent.
        </p>
      ) : null}

      {/* THE ANSWER-FIRST SOFT CHECK — design §6, and soft is the ruling. It
          warns and never refuses: the eight publish rules are mechanical, and
          whether an opening paragraph states a claim is a judgement. A
          validator that refuses on a judgement is one writers learn to defeat
          rather than satisfy. */}
      {answerFirst.length > 0 ? (
        <div className={styles.warn}>
          <p className={styles.warnHead}>
            Answer first. This is a reading of the first screen, not a rule.
            Publish anyway if you disagree.
          </p>
          <ul>
            {answerFirst.map((note) => (
              <li key={note.message}>{note.message}</li>
            ))}
          </ul>
        </div>
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
          {/* FROZEN AT FIRST PUBLISH — design §6. Read-only rather than absent,
              so the writer can still see and copy the URL; the action discards
              whatever arrives here regardless, because a read-only input is a
              hint to a browser and not a rule. Moving it is the separate,
              deliberate act below, which writes the redirect. */}
          <input
            className={styles.input}
            defaultValue={row.slug}
            id="f-slug"
            name="slug"
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            readOnly={frozen}
            required
            type="text"
          />
          {frozen ? (
            <span className={styles.note}>
              Frozen since this piece first published. Changing a live URL is
              the separate step below, which writes the redirect with it.
            </span>
          ) : null}
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

        <label className={styles.field} htmlFor="f-canonical">
          <span className={styles.fieldLabel}>Canonical URL</span>
          <input
            className={styles.input}
            defaultValue={row.canonicalUrl ?? ""}
            id="f-canonical"
            name="canonicalUrl"
            placeholder={`https://yallo.co${publicRoute}/${row.slug}`}
            type="url"
          />
          <span className={styles.note}>
            Left empty, the page is its own canonical, which is almost always
            right. Fill it only when this piece is a copy of something that
            lives elsewhere.
          </span>
        </label>

        <label className={styles.field} htmlFor="f-og-image">
          <span className={styles.fieldLabel}>Social card image</span>
          <input
            className={styles.input}
            defaultValue={row.ogImageUrl ?? ""}
            id="f-og-image"
            name="ogImageUrl"
            placeholder="Leave empty for the generated PetalPlate"
            type="url"
          />
          <span className={styles.note}>
            Left empty, the card is the PetalPlate drawn from this slug, which
            is never blank and never wrong. An uploaded hero replaces it.
          </span>
        </label>

        <button className={styles.submit} type="submit">
          Save fields
        </button>
      </form>

      {frozen ? (
        <>
          <h2 className={styles.h2}>Change the published URL</h2>
          <p className={styles.note}>
            This piece is live at{" "}
            <code>
              {publicRoute}/{row.slug}
            </code>
            . Moving it writes a permanent redirect from the old address in the
            same transaction, so anything already pointing at it keeps working
            and keeps its authority.
          </p>
          <form action={changeSlugAction} className={editor.metaForm}>
            <input name="type" type="hidden" value={type} />
            <input name="id" type="hidden" value={row.id} />
            <label className={styles.field} htmlFor="f-new-slug">
              <span className={styles.fieldLabel}>New slug</span>
              <input
                className={styles.input}
                defaultValue={row.slug}
                id="f-new-slug"
                name="newSlug"
                pattern="[a-z0-9]+(-[a-z0-9]+)*"
                required
                type="text"
              />
            </label>
            <button className={styles.submit} type="submit">
              Move the URL and write the redirect
            </button>
          </form>
        </>
      ) : null}

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
