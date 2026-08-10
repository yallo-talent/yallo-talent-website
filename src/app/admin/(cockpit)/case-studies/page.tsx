import Link from "next/link";
import { RowTitle } from "@/app/admin/RowTitle";
import { LifecycleHelp, NoticesStrip } from "@/components/admin/NoticesStrip";
import { requirePane } from "@/lib/admin/guard";
import { noticesFor } from "@/lib/admin/notices";
import { allCaseStudies } from "@/lib/db/content";
import { publishedPaths } from "@/lib/published-routes";
import styles from "../../Admin.module.css";
import { setStatusAction } from "../articles/actions";
import { moveAction, reorderAction } from "./actions";
import { OrderList } from "./OrderList";

/**
 * Case studies. Owner, admin and editor, per canon A4's role map.
 *
 * THE STAGED ORDER IS GONE, AND THAT IS THE POINT. Round 23 staged a reorder in
 * a cookie, showed a banner explaining that what you were looking at was not
 * what the site served, and shipped the change as a pull request that GitHub
 * auto-merged. Canon A2 removed the pull request, so the cookie has nothing to
 * stage FOR: a move writes the `position` column in one transaction and the
 * homepage rail and `/case-studies` read it on the next request. What this pane
 * shows is what the site serves, which is what the banner existed to apologise
 * for not being.
 *
 * ORDERING IS UP AND DOWN HERE, DRAG AND DROP IN 25b. The column, the single
 * transaction and both read paths are in place; what is missing is the pointer
 * affordance over the top of them. An up/down control is also the keyboard route
 * that a drag-and-drop surface has to provide anyway, so it is not scaffolding
 * to be thrown away.
 */
export const dynamic = "force-dynamic";

export default async function CaseStudiesPane({
  searchParams,
}: {
  searchParams: Promise<{
    err?: string;
    moved?: string;
    published?: string;
    draft?: string;
  }>;
}) {
  await requirePane("caseStudies");
  const q = await searchParams;

  let studies: Awaited<ReturnType<typeof allCaseStudies>> = [];
  let error: string | null = null;
  try {
    studies = await allCaseStudies();
  } catch (err) {
    error = (err as Error).message;
  }

  const published = studies.filter((s) => s.status === "published");

  /* R-26.1's safety net, computed over the live rows rather than stored. */
  const notices =
    studies.length === 0
      ? []
      : noticesFor("case_study", studies, new Set(await publishedPaths()));

  return (
    <>
      <h1 className={styles.h1}>Case studies</h1>
      <p className={styles.lede}>
        Case studies live in the database. The order below is the order the
        homepage rail and <code>/case-studies</code> render, and moving one
        writes it in a single transaction. Nothing is staged, nothing opens a
        pull request, and nothing here deletes.
      </p>

      {q.err ? <p className={styles.error}>{q.err}</p> : null}
      {error ? <p className={styles.error}>{error}</p> : null}
      {q.moved ? <p className={styles.ok}>Order saved. {q.moved}</p> : null}
      {q.published ? (
        <p className={styles.ok}>/case-studies/{q.published} is live now.</p>
      ) : null}
      {q.draft ? (
        <p className={styles.ok}>
          /case-studies/{q.draft} is back to draft and is no longer served.
        </p>
      ) : null}

      <NoticesStrip notices={notices} />

      {studies.length > 1 && (
        <>
          <h2 className={styles.h2}>Order</h2>
          <p className={styles.note}>
            This is the order the homepage rail and /case-studies both read.
            Drag to move a study, then save: the whole sequence is written in
            one transaction, so a reordering cannot be interrupted halfway.
          </p>
          <OrderList
            reorderAction={reorderAction}
            rows={studies.map((s) => ({
              slug: s.slug,
              title: s.cardTitle ?? s.title,
              status: s.status,
            }))}
          />
        </>
      )}

      <h2 className={styles.h2}>
        {studies.length} stud{studies.length === 1 ? "y" : "ies"},{" "}
        {published.length} published
      </h2>
      {studies.length === 0 ? (
        <>
          <p className={styles.empty}>No case studies yet.</p>
          {/* A1: the lifecycle, in two sentences, on a pane somebody is seeing
              for the first time. */}
          <LifecycleHelp noun="case study" />
        </>
      ) : (
        <ul className={styles.rows}>
          {studies.map((study, i) => {
            const isPublished = study.status === "published";
            return (
              <li key={study.id} className={styles.row}>
                <div className={styles.rowHead}>
                  <span className={isPublished ? styles.ok : styles.meta}>
                    {study.status}
                  </span>
                  <RowTitle level={3} className={styles.rowTitle}>
                    {/* R-25b.3: the way in to the three taxonomy dropdowns, so
                        the nine imported studies can be given real values from
                        a browser. No session assigns them. */}
                    <Link
                      data-slug={study.slug}
                      href={`/admin/case-studies/${study.id}`}
                    >
                      {study.cardTitle ?? study.title}
                    </Link>
                  </RowTitle>
                  <span className={styles.meta}>
                    {study.clientPublic ? study.client : "client not named"}
                  </span>
                  <span className={styles.meta}>
                    {[study.platformLabel, study.region]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </div>
                <div className={styles.rowActions}>
                  <form action={moveAction}>
                    <input type="hidden" name="slug" value={study.slug} />
                    <input type="hidden" name="direction" value="up" />
                    <button
                      className={styles.rowButton}
                      disabled={i === 0}
                      type="submit"
                    >
                      Move up
                    </button>
                  </form>
                  <form action={moveAction}>
                    <input type="hidden" name="slug" value={study.slug} />
                    <input type="hidden" name="direction" value="down" />
                    <button
                      className={styles.rowButton}
                      disabled={i === studies.length - 1}
                      type="submit"
                    >
                      Move down
                    </button>
                  </form>
                  <form action={setStatusAction}>
                    <input type="hidden" name="type" value="case_study" />
                    <input type="hidden" name="id" value={study.id} />
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
    </>
  );
}
