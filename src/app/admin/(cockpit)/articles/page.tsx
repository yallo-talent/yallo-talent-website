import { RowTitle } from "@/app/admin/RowTitle";
import {
  ARTICLE_DIR,
  FIXED_BYLINE,
  NOT_EDITABLE_HERE,
} from "@/lib/admin/article-draft";
import { requirePane } from "@/lib/admin/guard";
import { getAllInsights } from "@/lib/content";
import styles from "../../Admin.module.css";
import { createArticleAction, setArticlePublishedAction } from "./actions";

/**
 * Articles. Admin and editor, per round 23 §3's pane map.
 *
 * THE PANE SHIPS; ARTICLE CONTENT DOES NOT. Round 23 §4. Every existing insight
 * stays `published: false`, this session created none and published none, and
 * the create form's template hardcodes `published: false` so that creating one
 * is never the same act as publishing it. The template and visual work on the
 * articles themselves is Raphy's, per the handover brief.
 *
 * EVERY WRITE IS A PULL REQUEST. There is no filesystem write path here at all:
 * the actions produce whole files as bytes and hand them to `publishArticle`.
 * Validation runs before any pull request opens, because one CI is certain to
 * fail blocks auto-merge and has to be closed by hand.
 */
export const dynamic = "force-dynamic";

export default async function ArticlesPane({
  searchParams,
}: {
  searchParams: Promise<{ err?: string; pr?: string; open?: string }>;
}) {
  await requirePane("articles");
  const q = await searchParams;

  let articles: ReturnType<typeof getAllInsights> = [];
  let error: string | null = null;
  try {
    articles = getAllInsights();
  } catch (err) {
    error = (err as Error).message;
  }

  const published = articles.filter((a) => a.frontmatter.published !== false);

  return (
    <>
      <h1 className={styles.h1}>Articles</h1>
      <p className={styles.lede}>
        Articles are MDX in <code>{ARTICLE_DIR}/</code>. Everything on this pane
        travels branch, pull request, CI, auto-merge, exactly as case studies
        do. Nothing here writes <code>main</code>, and nothing here deletes.
      </p>

      {q.err ? <p className={styles.error}>{q.err}</p> : null}
      {error ? <p className={styles.error}>{error}</p> : null}
      {q.pr ? (
        <p className={styles.ok}>
          Pull request #{q.pr} is open.{" "}
          {q.open ? (
            <a href={q.open} rel="noreferrer">
              Open it on GitHub
            </a>
          ) : null}{" "}
          It merges itself once CI is green.
        </p>
      ) : null}

      <h2 className={styles.h2}>
        {articles.length} article{articles.length === 1 ? "" : "s"},{" "}
        {published.length} published
      </h2>
      {articles.length === 0 ? (
        <p className={styles.empty}>Nothing in {ARTICLE_DIR}/ yet.</p>
      ) : (
        <ul className={styles.rows}>
          {articles.map((article) => {
            const fm = article.frontmatter;
            const isPublished = fm.published !== false;
            return (
              <li key={fm.slug} className={styles.row}>
                <div className={styles.rowHead}>
                  <span className={isPublished ? styles.ok : styles.meta}>
                    {isPublished ? "published" : "unpublished"}
                  </span>
                  <RowTitle level={3} className={styles.rowTitle}>
                    {fm.title}
                  </RowTitle>
                  <span className={styles.meta}>{fm.date}</span>
                  <span className={styles.meta}>{fm.category}</span>
                </div>
                <div className={styles.rowActions}>
                  <a
                    className={styles.rowButton}
                    href={`/admin/articles/${encodeURIComponent(fm.slug)}`}
                  >
                    Edit
                  </a>
                  <form action={setArticlePublishedAction}>
                    <input type="hidden" name="slug" value={fm.slug} />
                    <input
                      type="hidden"
                      name="next"
                      value={isPublished ? "false" : "true"}
                    />
                    <button className={styles.rowButton} type="submit">
                      {isPublished ? "Unpublish" : "Publish"}
                    </button>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <h2 className={styles.h2}>New article</h2>
      <p className={styles.note}>
        Creates the file unpublished and opens one pull request. The slug is
        derived from the title. The byline is fixed at {FIXED_BYLINE} and is not
        a field here, per canon §8: nothing in this cockpit attributes writing
        to a named person.
      </p>
      <form action={createArticleAction} className={styles.createForm}>
        <label className={styles.field} htmlFor="article-title">
          <span className={styles.fieldLabel}>Title</span>
          <input
            className={styles.input}
            id="article-title"
            name="title"
            type="text"
            required
          />
        </label>
        <label className={styles.field} htmlFor="article-summary">
          <span className={styles.fieldLabel}>Summary</span>
          <textarea
            className={styles.input}
            id="article-summary"
            name="summary"
            rows={3}
            required
          />
        </label>
        <label className={styles.field} htmlFor="article-category">
          <span className={styles.fieldLabel}>Category</span>
          <input
            className={styles.input}
            id="article-category"
            name="category"
            type="text"
            required
          />
        </label>
        <label className={styles.field} htmlFor="article-date">
          <span className={styles.fieldLabel}>Date</span>
          <input
            className={styles.input}
            id="article-date"
            name="date"
            type="date"
            required
          />
        </label>
        <label className={styles.field} htmlFor="article-minutes">
          <span className={styles.fieldLabel}>Reading time, minutes</span>
          <input
            className={styles.input}
            id="article-minutes"
            name="readingTimeMinutes"
            type="number"
            min={1}
            required
          />
        </label>
        <button className={styles.submit} type="submit">
          Create, unpublished
        </button>
      </form>

      <h2 className={styles.h2}>Edited in the file, not here</h2>
      <p className={styles.note}>
        {NOT_EDITABLE_HERE.map((field, i) => (
          <span key={field}>
            {i > 0 ? ", " : null}
            <code>{field}</code>
          </span>
        ))}
        . The first is a folded YAML block and the rest are lists; the writers
        on this pane edit single-line values, so they refuse rather than
        truncating one. Every figure in a body still needs a matching{" "}
        <code>sources</code> entry, and the form refuses a pull request without
        it.
      </p>
    </>
  );
}
