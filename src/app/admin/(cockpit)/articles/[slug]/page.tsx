import { readFileSync } from "node:fs";
import { join } from "node:path";
import Link from "next/link";
import {
  articlePath,
  NOT_EDITABLE_HERE,
  parseArticleFile,
  validateArticleDraft,
} from "@/lib/admin/article-draft";
import { ADMIN_ROUTES } from "@/lib/admin/config";
import { requirePane } from "@/lib/admin/guard";
import styles from "../../../Admin.module.css";
import { saveArticleAction } from "../actions";

/**
 * One article, edited.
 *
 * THE VALIDATION IS SHOWN BEFORE ANYONE TOUCHES ANYTHING. The draft on disk is
 * validated on load and every failure is listed here, so an article that is
 * already invalid says so rather than looking fine until a pull request opens
 * and CI rejects it. That is the same lesson as the case-study pane: the happy
 * path must not be able to open a pull request CI is certain to fail.
 *
 * The body is a plain textarea. There is no editor, no preview and no toolbar,
 * because the file is MDX that the build renders and a WYSIWYG over MDX is a
 * second renderer to keep honest.
 */
export const dynamic = "force-dynamic";

export default async function EditArticle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requirePane("articles");
  const { slug } = await params;

  let source: string;
  try {
    source = readFileSync(join(process.cwd(), articlePath(slug)), "utf8");
  } catch {
    return (
      <>
        <h1 className={styles.h1}>Article not found</h1>
        <p className={styles.error}>
          There is no file at <code>{articlePath(slug)}</code>.
        </p>
        <p>
          <Link href={ADMIN_ROUTES.articles}>Back to articles</Link>
        </p>
      </>
    );
  }

  const draft = parseArticleFile(slug, source);
  const fm = draft.frontmatter;
  const errors = validateArticleDraft(draft);

  return (
    <>
      <h1 className={styles.h1}>{String(fm.title ?? slug)}</h1>
      <p className={styles.lede}>
        <code>{articlePath(slug)}</code>. Saving opens one pull request that
        changes only this file. It is{" "}
        {fm.published === false ? "unpublished" : "published"}.
      </p>

      {errors.length > 0 ? (
        <div className={styles.error}>
          <p>
            <strong>
              This article does not validate as it stands on disk, in{" "}
              {errors.length} way{errors.length === 1 ? "" : "s"}.
            </strong>{" "}
            Saving is refused until these are fixed, because the pull request
            would fail CI and then sit open blocking auto-merge.
          </p>
          <ul>
            {errors.map((e) => (
              <li key={`${e.field}:${e.message}`}>
                <code>{e.field}</code>: {e.message}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <form action={saveArticleAction}>
        <input type="hidden" name="slug" value={slug} />
        <label className={styles.field} htmlFor="edit-title">
          <span className={styles.fieldLabel}>Title</span>
          <input
            className={styles.input}
            id="edit-title"
            name="title"
            type="text"
            defaultValue={String(fm.title ?? "")}
          />
        </label>
        <label className={styles.field} htmlFor="edit-category">
          <span className={styles.fieldLabel}>Category</span>
          <input
            className={styles.input}
            id="edit-category"
            name="category"
            type="text"
            defaultValue={String(fm.category ?? "")}
          />
        </label>
        <label className={styles.field} htmlFor="edit-date">
          <span className={styles.fieldLabel}>Date</span>
          <input
            className={styles.input}
            id="edit-date"
            name="date"
            type="date"
            defaultValue={String(fm.date ?? "")}
          />
        </label>
        <label className={styles.field} htmlFor="edit-minutes">
          <span className={styles.fieldLabel}>Reading time, minutes</span>
          <input
            className={styles.input}
            id="edit-minutes"
            name="readingTimeMinutes"
            type="number"
            min={1}
            defaultValue={Number(fm.readingTimeMinutes ?? 0)}
          />
        </label>
        <label className={styles.field} htmlFor="edit-body">
          <span className={styles.fieldLabel}>Body, MDX</span>
          <textarea
            className={styles.input}
            id="edit-body"
            name="body"
            rows={24}
            defaultValue={draft.body}
          />
        </label>
        <button className={styles.submit} type="submit">
          Save, as a pull request
        </button>
      </form>

      <p className={styles.note}>
        Not editable here:{" "}
        {NOT_EDITABLE_HERE.map((field, i) => (
          <span key={field}>
            {i > 0 ? ", " : null}
            <code>{field}</code>
          </span>
        ))}
        . Edit those in the file. The byline is fixed and is not a field.
      </p>
      <p>
        <Link href={ADMIN_ROUTES.articles}>Back to articles</Link>
      </p>
    </>
  );
}
