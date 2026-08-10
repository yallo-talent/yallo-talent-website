import Link from "next/link";
import { RowTitle } from "@/app/admin/RowTitle";
import { LifecycleHelp, NoticesStrip } from "@/components/admin/NoticesStrip";
import { FIXED_BYLINE } from "@/lib/admin/content-validation";
import { requirePane } from "@/lib/admin/guard";
import { noticesFor } from "@/lib/admin/notices";
import { allArticles } from "@/lib/db/content";
import { publishedPaths } from "@/lib/published-routes";
import styles from "../../Admin.module.css";
import { createArticleAction, setStatusAction } from "./actions";

/**
 * Articles. Owner, admin and editor, per canon A4's role map.
 *
 * WHAT CHANGED UNDER CANON A1 AND A2. This pane listed `content/insights/**` and
 * every write left as a pull request. Articles are database rows now, and
 * publishing writes one row and revalidates: no branch, no pull request, no
 * build, live in seconds. The eight A2 rules refuse the publish rather than a
 * CI run refusing the merge, and they name the field and the fault.
 *
 * THE WRITING SURFACE EXISTS NOW. Round 25 said plainly that it did not, and
 * that saying so was better than offering a control that would lose a writer's
 * work. Round 25b built it: the title of every row opens the editor at
 * /admin/articles/[id].
 *
 * THE BYLINE IS NOT A FIELD. Canon §8: "Yallo Talent" is applied by the system,
 * and there is nothing on this pane to type a person's name into.
 */
export const dynamic = "force-dynamic";

export default async function ArticlesPane({
  searchParams,
}: {
  searchParams: Promise<{
    err?: string;
    created?: string;
    published?: string;
    draft?: string;
  }>;
}) {
  await requirePane("articles");
  const q = await searchParams;

  let articles: Awaited<ReturnType<typeof allArticles>> = [];
  let error: string | null = null;
  try {
    articles = await allArticles();
  } catch (err) {
    error = (err as Error).message;
  }

  const published = articles.filter((a) => a.status === "published");

  /* R-26.1's safety net, computed over the live rows on every render rather
     than stored. A stored finding is a finding that can be stale, and the whole
     failure this guards against is somebody trusting a clean panel that was
     computed before the piece was edited. */
  const notices =
    articles.length === 0
      ? []
      : noticesFor("article", articles, new Set(await publishedPaths()));

  return (
    <>
      <h1 className={styles.h1}>Articles</h1>
      <p className={styles.lede}>
        Articles live in the database, not in the repository. Publishing writes
        the row and refreshes the article, the index, its taxonomy archives, the
        sitemap and <code>llms.txt</code>. Nothing opens a pull request and
        nothing waits for a build. The byline is applied by the system as{" "}
        {FIXED_BYLINE} and is not a field.
      </p>

      {q.err ? <p className={styles.error}>{q.err}</p> : null}
      {error ? <p className={styles.error}>{error}</p> : null}
      {q.created ? (
        <p className={styles.ok}>Draft created at /insights/{q.created}.</p>
      ) : null}
      {q.published ? (
        <p className={styles.ok}>/insights/{q.published} is live now.</p>
      ) : null}
      {q.draft ? (
        <p className={styles.ok}>
          /insights/{q.draft} is back to draft and is no longer served.
        </p>
      ) : null}

      <NoticesStrip notices={notices} />

      <h2 className={styles.h2}>
        {articles.length} article{articles.length === 1 ? "" : "s"},{" "}
        {published.length} published
      </h2>
      {articles.length === 0 ? (
        <>
          <p className={styles.empty}>No articles yet.</p>
          {/* A1: the lifecycle, in two sentences, on a pane somebody is seeing
              for the first time. */}
          <LifecycleHelp noun="article" />
        </>
      ) : (
        <ul className={styles.rows}>
          {articles.map((article) => {
            const isPublished = article.status === "published";
            return (
              <li key={article.id} className={styles.row}>
                <div className={styles.rowHead}>
                  <span className={isPublished ? styles.ok : styles.meta}>
                    {article.status}
                  </span>
                  <RowTitle level={3} className={styles.rowTitle}>
                    {/* The title IS the way in. A separate "Edit" button beside
                        it would be a second control for the one thing a person
                        opens this list to do. */}
                    <Link
                      data-slug={article.slug}
                      href={`/admin/articles/${article.id}`}
                    >
                      {article.title}
                    </Link>
                  </RowTitle>
                  <span className={styles.meta}>
                    {article.updatedAt.slice(0, 10)}
                  </span>
                  <span className={styles.meta}>
                    {article.wordCount} words · {article.readingTimeMinutes} min
                  </span>
                </div>
                <div className={styles.rowActions}>
                  <form action={setStatusAction}>
                    <input type="hidden" name="type" value="article" />
                    <input type="hidden" name="id" value={article.id} />
                    <input
                      type="hidden"
                      name="next"
                      value={isPublished ? "draft" : "published"}
                    />
                    <button className={styles.rowButton} type="submit">
                      {isPublished ? "Take back to draft" : "Publish"}
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
        Creates a draft and reserves its slug. Creating is never the same act as
        publishing: canon A2 puts nine rules between the two, and a create path
        that skipped them would be the old pull-request bypass in a different
        costume. Open the draft by its title to write it.
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
        <label className={styles.field} htmlFor="article-slug">
          <span className={styles.fieldLabel}>Slug</span>
          <input
            className={styles.input}
            id="article-slug"
            name="slug"
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            type="text"
            required
          />
        </label>
        <button className={styles.submit} type="submit">
          Create draft
        </button>
      </form>
    </>
  );
}
