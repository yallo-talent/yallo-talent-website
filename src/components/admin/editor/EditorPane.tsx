import Link from "next/link";
import styles from "@/app/admin/Admin.module.css";
import {
  capabilitiesIndex,
  industriesIndex,
  platformsIndex,
} from "@/data/l1/index";
import { BUDGETS } from "@/lib/admin/content-validation";
import type { ArticleRow } from "@/lib/db/content";
import type { ContentType } from "@/lib/db/content-write";
import type { RevisionSummary } from "@/lib/db/revisions";
import editor from "./Editor.module.css";
import { EditorSurface } from "./EditorSurface";

/**
 * One editor surface for both content types, design §4: "Works for articles AND
 * case studies."
 *
 * ONE COMPONENT, NOT TWO PANES THAT LOOK ALIKE. The two tables differ by the
 * structured case-study fields and by nothing else that a writer touches, so a
 * second copy of this would be a second place for the taxonomy controls, the
 * counters and the revision list to drift.
 *
 * WHAT ROUND 26 CHANGED. The long scroll of metadata is gone: the title and the
 * subtitle are on the canvas (R-26.5), and everything else — taxonomy, SEO, the
 * social card, the URL and the history — is in a drawer opened from the rail.
 * This component is now the DRAWER's content plus the props the surface needs;
 * the surface owns the rail, the canvas and the publish sheet.
 *
 * IT IS STILL A SERVER COMPONENT, and that is what the drawer arrangement buys.
 * The taxonomy indexes, the revision list and the server actions stay on this
 * side of the boundary; only the small client shell crosses it.
 *
 * THE THREE TAXONOMY CONTROLS ARE HERE FOR BOTH TYPES — R-25b.3. The nine
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
  /* "Capabilities" is what the nav column, the hub and the desk routes have
     always said; `discipline` is the column name. Sumeet ruled on the split
     during round 25c. */
  { name: "discipline", label: "Capabilities", index: capabilitiesIndex },
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
  setStatusAction: (formData: FormData) => Promise<void>;
  saveBody: (body: unknown) => Promise<void>;
  saveFront: (front: { title: string; summary: string }) => Promise<void>;
  /** Every path the site serves, for the live link check. */
  knownPaths: string[];
  notice?: {
    err?: string;
    saved?: string;
    restored?: string;
    moved?: string;
    warned?: string;
    published?: string;
    draft?: string;
    archived?: string;
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
  setStatusAction,
  saveBody,
  saveFront,
  knownPaths,
  notice,
}: EditorPaneProps) {
  const publicRoute = type === "article" ? "/insights" : "/case-studies";
  const backRoute =
    type === "article" ? "/admin/articles" : "/admin/case-studies";
  const frozen = row.firstPublishedAt !== null;

  return (
    <EditorSurface
      backRoute={backRoute}
      checks={{
        category: row.category,
        discipline: row.discipline,
        industry: row.industry,
        knownPaths,
        metaDescription: row.metaDescription,
        metaTitle: row.metaTitle,
        platform: row.platform,
        sources: row.sources,
      }}
      drawer={
        <div className={editor.drawerBody}>
          {/* ── What this piece is ─────────────────────────────────────── */}
          <form action={saveMetaAction} className={editor.drawerForm}>
            <input name="type" type="hidden" value={type} />
            <input name="id" type="hidden" value={row.id} />

            <section className={editor.drawerSection}>
              <h3 className={editor.drawerSectionTitle}>Filing</h3>

              <label className={editor.drawerField} htmlFor="f-category">
                <span className={editor.drawerLabel}>Category</span>
                {/* A closed list, not free text — R-25b.2. Articles carry the
                    design's five editorial types; case studies carry the
                    engagement pillar their cards already display. */}
                <select
                  className={editor.drawerInput}
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
                <fieldset className={editor.chipSet} key={tax.name}>
                  <legend className={editor.drawerLabel}>{tax.label}</legend>
                  {/* A3: chips, not raw checkboxes. The control is the same
                      checkbox underneath — the label is the whole target and
                      the box itself is drawn by the chip, so a keyboard reaches
                      it, a screen reader announces it, and a thumb can hit it. */}
                  <div className={editor.chipGrid}>
                    {tax.index.map((entry) => {
                      const id = `${tax.name}-${entry.slug}`;
                      return (
                        <label className={editor.chip} htmlFor={id} key={id}>
                          <input
                            className={editor.chipInput}
                            defaultChecked={(
                              row[tax.name] as string[]
                            ).includes(entry.slug)}
                            id={id}
                            name={tax.name}
                            type="checkbox"
                            value={entry.slug}
                          />
                          <span className={editor.chipLabel}>
                            {entry.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              ))}
            </section>

            {/* ── How it appears in search and on a card ───────────────── */}
            <section className={editor.drawerSection}>
              <h3 className={editor.drawerSectionTitle}>Search and sharing</h3>

              <label className={editor.drawerField} htmlFor="f-meta-title">
                <span className={editor.drawerLabel}>
                  Meta title{" "}
                  <Counter
                    max={BUDGETS.metaTitle.max}
                    value={row.metaTitle ?? ""}
                  />
                </span>
                <input
                  className={editor.drawerInput}
                  defaultValue={row.metaTitle ?? ""}
                  id="f-meta-title"
                  name="metaTitle"
                  placeholder={row.title}
                  type="text"
                />
              </label>

              <label
                className={editor.drawerField}
                htmlFor="f-meta-description"
              >
                <span className={editor.drawerLabel}>
                  Meta description{" "}
                  <Counter
                    max={BUDGETS.metaDescription.max}
                    value={row.metaDescription ?? ""}
                  />
                </span>
                <textarea
                  className={editor.drawerInput}
                  defaultValue={row.metaDescription ?? ""}
                  id="f-meta-description"
                  name="metaDescription"
                  placeholder={row.summary}
                  rows={3}
                />
              </label>

              <label className={editor.drawerField} htmlFor="f-canonical">
                <span className={editor.drawerLabel}>Canonical URL</span>
                <input
                  className={editor.drawerInput}
                  defaultValue={row.canonicalUrl ?? ""}
                  id="f-canonical"
                  name="canonicalUrl"
                  placeholder={`https://yallo.co${publicRoute}/${row.slug}`}
                  type="url"
                />
                <span className={editor.drawerNote}>
                  Left empty, the page is its own canonical, which is almost
                  always right. Fill it only when this piece is a copy of
                  something that lives elsewhere.
                </span>
              </label>

              <label className={editor.drawerField} htmlFor="f-og-image">
                <span className={editor.drawerLabel}>Social card image</span>
                <input
                  className={editor.drawerInput}
                  defaultValue={row.ogImageUrl ?? ""}
                  id="f-og-image"
                  name="ogImageUrl"
                  placeholder="Leave empty for the generated PetalPlate"
                  type="url"
                />
                <span className={editor.drawerNote}>
                  Left empty, the card is the PetalPlate drawn from this slug,
                  which is never blank and never wrong. An uploaded hero
                  replaces it.
                </span>
              </label>
            </section>

            {!frozen ? (
              <section className={editor.drawerSection}>
                <h3 className={editor.drawerSectionTitle}>Address</h3>
                <label className={editor.drawerField} htmlFor="f-slug">
                  <span className={editor.drawerLabel}>Slug</span>
                  <input
                    className={editor.drawerInput}
                    defaultValue={row.slug}
                    id="f-slug"
                    name="slug"
                    pattern="[a-z0-9]+(-[a-z0-9]+)*"
                    required
                    type="text"
                  />
                  <span className={editor.drawerNote}>
                    Free to change until this first publishes. After that,
                    moving it writes a redirect in the same act.
                  </span>
                </label>
              </section>
            ) : null}

            {/* A3: the full-width gold slab is gone. One compact save at the
                foot of the fields it saves, rather than a banner across the
                page for a form the reader is already inside. */}
            <button className={editor.drawerSave} type="submit">
              Save these details
            </button>
          </form>

          {frozen ? (
            <section className={editor.drawerSection}>
              <h3 className={editor.drawerSectionTitle}>The published URL</h3>
              <p className={editor.drawerNote}>
                Live at{" "}
                <code className={editor.drawerCode}>
                  {publicRoute}/{row.slug}
                </code>
                . Moving it writes a permanent redirect from the old address in
                the same transaction, so anything already pointing at it keeps
                working and keeps its authority.
              </p>
              {/* Its own form, deliberately: nobody moves a live URL by tabbing
                  through a field on their way to saving a meta description. */}
              <form action={changeSlugAction} className={editor.drawerForm}>
                <input name="type" type="hidden" value={type} />
                <input name="id" type="hidden" value={row.id} />
                <label className={editor.drawerField} htmlFor="f-new-slug">
                  <span className={editor.drawerLabel}>New slug</span>
                  <input
                    className={editor.drawerInput}
                    defaultValue={row.slug}
                    id="f-new-slug"
                    name="newSlug"
                    pattern="[a-z0-9]+(-[a-z0-9]+)*"
                    required
                    type="text"
                  />
                </label>
                <button className={editor.drawerSave} type="submit">
                  Move the URL and write the redirect
                </button>
              </form>
            </section>
          ) : null}

          {/* ── History ─────────────────────────────────────────────────── */}
          <section className={editor.drawerSection}>
            <h3 className={editor.drawerSectionTitle}>
              History · {revisions.length} revision
              {revisions.length === 1 ? "" : "s"}
            </h3>
            <p className={editor.drawerNote}>
              Every save writes one. This is what replaces git history, and it
              is why nothing here needs a copy in the repository. Restoring is
              itself recorded, so it can be undone by restoring again.
            </p>
            {revisions.length === 0 ? (
              <p className={editor.drawerNote}>No revisions yet.</p>
            ) : (
              /* A3: a compact timeline, not stacked full-width cards. Twenty
                 revisions as cards is a page of scrolling to reach the one from
                 this morning. */
              <ol className={editor.timeline}>
                {revisions.map((rev) => (
                  <li className={editor.timelineRow} key={rev.id}>
                    <span className={editor.timelineWhen}>
                      {rev.createdAt.slice(0, 16).replace("T", " ")}
                    </span>
                    <span className={editor.timelineWho}>{rev.authorName}</span>
                    <span className={editor.timelineSize}>
                      {rev.bytes} chars
                    </span>
                    <span className={editor.timelineActions}>
                      <Link
                        className={editor.timelineLink}
                        href={`/admin/preview/${type}/${row.id}?revision=${rev.id}`}
                        target="_blank"
                      >
                        Preview
                      </Link>
                      <form action={restoreRevisionAction}>
                        <input name="type" type="hidden" value={type} />
                        <input name="id" type="hidden" value={row.id} />
                        <input name="revisionId" type="hidden" value={rev.id} />
                        <button className={editor.timelineLink} type="submit">
                          Restore
                        </button>
                      </form>
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>
      }
      frozen={frozen}
      id={row.id}
      initialBody={row.body}
      initialSummary={row.summary}
      initialTitle={row.title}
      notice={<Notices notice={notice} publicRoute={publicRoute} row={row} />}
      previewPath={`/admin/preview/${type}/${row.id}`}
      publicRoute={publicRoute}
      saveBody={saveBody}
      saveFront={saveFront}
      setStatusAction={setStatusAction}
      slug={row.slug}
      status={row.status}
      type={type}
    />
  );
}

/**
 * What the last action did, said once.
 *
 * THE LIVE URL IS SHOWN ON A PUBLISH — A1. "It is live" without an address is a
 * claim somebody has to go and verify; the link is the verification.
 */
function Notices({
  notice,
  publicRoute,
  row,
}: {
  notice?: EditorPaneProps["notice"];
  publicRoute: string;
  row: ArticleRow;
}) {
  if (!notice) return null;
  return (
    <>
      {notice.err ? <p className={styles.error}>{notice.err}</p> : null}
      {notice.published ? (
        <p className={styles.ok}>
          Live now at{" "}
          <a
            href={`${publicRoute}/${notice.published}`}
            rel="noreferrer"
            target="_blank"
          >
            {publicRoute}/{notice.published}
          </a>
          .
        </p>
      ) : null}
      {notice.draft ? (
        <p className={styles.ok}>
          Back to draft. {publicRoute}/{notice.draft} is no longer served.
        </p>
      ) : null}
      {notice.archived ? (
        <p className={styles.ok}>
          Archived. Nothing was deleted, and the history is intact.
        </p>
      ) : null}
      {notice.saved ? <p className={styles.ok}>Details saved.</p> : null}
      {notice.restored ? (
        <p className={styles.ok}>
          That revision is now the body. The version it replaced was itself
          recorded, so this is undoable.
        </p>
      ) : null}
      {notice.moved ? (
        <p className={styles.ok}>
          URL moved: <code>{notice.moved}</code>. The redirect is written and
          permanent.
        </p>
      ) : null}
      {notice.warned ? <p className={styles.warn}>{notice.warned}</p> : null}
      {/* The first-run explainer, A1. Two sentences, and only on a piece that
          has never been live — once something has published, its operator has
          been through the cycle at least once. */}
      {row.firstPublishedAt === null ? (
        <p className={styles.note}>
          This is a draft: nothing here is on the site yet, and nothing you type
          can put it there by accident. When it is ready, Continue shows you
          what is outstanding and publishes on one confirm; afterwards the same
          rail offers Update, Unpublish and Archive.
        </p>
      ) : null}
    </>
  );
}

/**
 * The character counter, design §6.
 *
 * SERVER-RENDERED FROM THE STORED VALUE for the drawer's fields, which are a
 * form rather than a live surface. The two counters that had to follow the
 * keystrokes — the title and the subtitle — are on the canvas now and are
 * client-side there.
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
