import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ADMIN_ROUTES } from "@/lib/admin/config";
import { ORDER_PATH, publishOrder } from "@/lib/admin/publish";
import { caseStudyOrder, orderedCaseStudies } from "@/lib/case-study-order";
import { getAllCaseStudies } from "@/lib/content";
import styles from "../../Admin.module.css";

/**
 * Pane 3, Case studies. Read, and REORDER, which is the write path.
 *
 * Reordering does not write the repository from this process. It calls
 * `publishOrder`, which opens a pull request against `content/case-studies/
 * order.yaml` and asks GitHub to auto-merge it, so CI runs before anything
 * publishes. There is no direct-push path and there is no merge performed here:
 * round 17 §2.3's stop condition is that a half-built write path which commits
 * to `main` is worse than no write path, and a PR that waits for its checks is
 * the shape that satisfies it.
 *
 * NOT YET EXERCISED AGAINST GITHUB. `ADMIN_GITHUB_TOKEN` is blank as of round
 * 19, so the action reports that and does nothing. Its invariants are proven by
 * scripts/check-write-path.mjs with the network boundary substituted, which is a
 * smaller claim than "it commits" and is the only one anyone may make until a
 * commit has been watched landing.
 *
 * WHAT IS LISTED, and in what order. `orderedCaseStudies()` — the same function
 * the homepage rail and /case-studies render from, so this pane cannot show an
 * order the site does not publish. content/case-studies/order.yaml is the single
 * editorial source; a study not named there appends in date order behind those
 * that are.
 *
 * `clientPublic` is surfaced on every row because it is the field with a
 * consent rule behind it: false until written consent to name the client and use
 * their logo is on file. Showing it as a state rather than hiding it means the
 * cockpit can be used to audit consent, not only to author.
 *
 * UNPUBLISHED studies are listed too, behind the published ones.
 * `orderedCaseStudies()` drops them, correctly — `published: false` is a
 * statement about the study, not about its position — but a cockpit that shows
 * only what is live cannot answer "where did that draft go", which is precisely
 * the question a file-based CMS with no index invites.
 */
export const dynamic = "force-dynamic";

/**
 * Move one study one place, and open a pull request for it.
 *
 * The new order is computed from `caseStudyOrder()` READ FRESH, never from
 * anything the form carries. A form that posts the whole intended order would
 * silently overwrite an edit someone made to order.yaml between the page render
 * and the click, and this file is edited by hand as well as by this pane.
 */
async function reorder(formData: FormData): Promise<void> {
  "use server";
  const slug = String(formData.get("slug") ?? "");
  const direction = String(formData.get("direction") ?? "");

  const current = [...caseStudyOrder()];
  const from = current.indexOf(slug);
  if (from === -1) {
    redirect(
      `${ADMIN_ROUTES.caseStudies}?err=${encodeURIComponent(`"${slug}" is not named in ${ORDER_PATH}, so it has no position to move.`)}`,
    );
  }
  const to = direction === "up" ? from - 1 : from + 1;
  if (to < 0 || to >= current.length) {
    redirect(
      `${ADMIN_ROUTES.caseStudies}?err=${encodeURIComponent("That study is already at the end of the order.")}`,
    );
  }
  current.splice(to, 0, ...current.splice(from, 1));

  const result = await publishOrder(current);
  if (!result.ok) {
    redirect(
      `${ADMIN_ROUTES.caseStudies}?err=${encodeURIComponent(result.error)}`,
    );
  }
  revalidatePath(ADMIN_ROUTES.caseStudies);
  redirect(
    `${ADMIN_ROUTES.caseStudies}?moved=${encodeURIComponent(`${slug} ${direction}`)}` +
      `&pr=${result.prNumber}&open=${result.autoMergeEnabled ? "automerge" : "waiting"}`,
  );
}

export default async function CaseStudiesPane({
  searchParams,
}: {
  searchParams: Promise<{
    moved?: string;
    err?: string;
    pr?: string;
    open?: string;
  }>;
}) {
  const { moved, err, pr, open } = await searchParams;
  const all = getAllCaseStudies();
  const studies = orderedCaseStudies(all);
  const publishedSlugs = new Set(studies.map((s) => s.frontmatter.slug));
  const unpublished = all.filter(
    (s) => !publishedSlugs.has(s.frontmatter.slug),
  );

  return (
    <>
      <h1 className={styles.h1}>Case studies</h1>
      <p className={styles.lede}>
        Everything in <code>content/case-studies/</code>, in the published order
        from <code>order.yaml</code>: the same order the homepage rail and{" "}
        <code>/case-studies</code> render. Moving a study opens a pull request
        against <code>order.yaml</code> with auto-merge on, so CI runs before it
        publishes. Nothing here writes <code>main</code> directly.
      </p>

      <p className={styles.count}>
        {studies.length} published · {unpublished.length} unpublished
      </p>

      {err ? <p className={styles.error}>{err}</p> : null}
      {pr ? (
        <p className={open === "waiting" ? styles.bad : styles.ok}>
          Pull request #{pr} opened.{" "}
          {open === "waiting"
            ? "Auto-merge could not be enabled on this repository, so it is waiting for you to merge it after CI passes. Nothing was merged from here."
            : "Auto-merge is on, so it publishes once CI passes."}
        </p>
      ) : null}
      {moved ? <p className={styles.ok}>Moved {moved}.</p> : null}
      <ul className={styles.rows}>
        {[...studies, ...unpublished].map((study, i) => (
          <li key={study.frontmatter.slug} className={styles.row}>
            <div className={styles.rowHead}>
              <span className={styles.meta}>
                {i < studies.length ? i + 1 : "unranked"}
              </span>
              <p className={styles.rowTitle}>{study.frontmatter.title}</p>
              <span className={styles.meta}>{study.frontmatter.date}</span>
              <span className={styles.meta}>{study.frontmatter.region}</span>
              {study.frontmatter.engagement ? (
                <span className={styles.meta}>
                  {study.frontmatter.engagement}
                </span>
              ) : null}
              <span
                className={
                  study.frontmatter.clientPublic ? styles.ok : styles.bad
                }
              >
                {study.frontmatter.clientPublic
                  ? `client named: ${study.frontmatter.client}`
                  : "client not named"}
              </span>
              {study.frontmatter.published === false ? (
                <span className={styles.bad}>unpublished</span>
              ) : null}
            </div>
            <p className={styles.meta}>{study.frontmatter.slug}</p>
            {i < studies.length ? (
              <form action={reorder}>
                <input
                  type="hidden"
                  name="slug"
                  value={study.frontmatter.slug}
                />
                <button
                  className={styles.submit}
                  type="submit"
                  name="direction"
                  value="up"
                  disabled={i === 0}
                >
                  Move up
                </button>
                <button
                  className={styles.submit}
                  type="submit"
                  name="direction"
                  value="down"
                  disabled={i === studies.length - 1}
                >
                  Move down
                </button>
              </form>
            ) : null}
          </li>
        ))}
      </ul>
    </>
  );
}
