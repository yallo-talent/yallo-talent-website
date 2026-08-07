import { readFileSync } from "node:fs";
import { join } from "node:path";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  parseStudyFile,
  validateDraft,
  writeScalar,
} from "@/lib/admin/case-study-draft";
import { ADMIN_ROUTES } from "@/lib/admin/config";
import {
  ORDER_PATH,
  publishOrder,
  publishStudy,
  readPublishes,
  studyPath,
} from "@/lib/admin/publish";
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
 * EXERCISED AGAINST GITHUB, round 20, and watched. One reorder published from
 * this pane created branch `admin/2026-08-07T07-29-20-906Z`, committed
 * content/case-studies/order.yaml to it and opened pull request #13, whose diff
 * is the two lines that swapped and nothing else. CI ran on it.
 *
 * AUTO-MERGE WAS REFUSED, and the refusal is the useful part. `allow_auto_merge`
 * is true on the repository; GitHub still declined with "Pull request is in
 * unstable status", because `main` carries no branch protection and no required
 * status check, so nothing blocks the merge and there is nothing for auto-merge
 * to wait on. The module did what round 17 §2.3 requires — reported it and left
 * the pull request open — and a human merges it. Until a required check exists
 * on `main`, "auto-merge lands it once CI passes" is not a claim this pane can
 * make, and it no longer makes it.
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

  /* The file as it stands, so the rewrite keeps its header and its per-slug
     client column. Read here rather than inside publishOrder because that module
     is the GitHub boundary and reads no filesystem: check-write-path substitutes
     its network calls and would otherwise need a fixture directory too. */
  let previous: string | undefined;
  try {
    previous = readFileSync(join(process.cwd(), ORDER_PATH), "utf8");
  } catch {
    /* Absent is legitimate — the default header is written for a new file. */
  }

  const result = await publishOrder(current, { previous });
  if (!result.ok) {
    redirect(
      `${ADMIN_ROUTES.caseStudies}?err=${encodeURIComponent(result.error)}`,
    );
  }
  revalidatePath(ADMIN_ROUTES.caseStudies);
  redirect(
    `${ADMIN_ROUTES.caseStudies}?moved=${encodeURIComponent(`${slug} ${direction}`)}` +
      `&pr=${result.prNumber}&open=${result.autoMergeEnabled ? "automerge" : "waiting"}` +
      (result.autoMergeError
        ? `&why=${encodeURIComponent(result.autoMergeError)}`
        : ""),
  );
}

/**
 * Publish or unpublish one study, through the same pull request path.
 *
 * NEVER A DELETION. `published: false` is the whole operation: round 17 §3
 * forbids a delete path from the cockpit outright, and an unpublished study is
 * one whose page stops being linked, not one whose evidence stops existing. The
 * study keeps its file, its position in order.yaml and its history, and the pane
 * still lists it — behind the published ones, labelled.
 *
 * The draft is VALIDATED BEFORE THE PULL REQUEST OPENS, against the build's own
 * schema. Unpublishing cannot itself make a study invalid, but a study that was
 * already invalid on disk would open a pull request CI is certain to fail, and
 * §2.2's requirement is that the happy path cannot do that.
 */
async function setPublished(formData: FormData): Promise<void> {
  "use server";
  const slug = String(formData.get("slug") ?? "");
  const next = String(formData.get("next") ?? "") === "true";

  const fail = (message: string) =>
    redirect(`${ADMIN_ROUTES.caseStudies}?err=${encodeURIComponent(message)}`);

  let source: string;
  try {
    source = readFileSync(join(process.cwd(), studyPath(slug)), "utf8");
  } catch {
    fail(
      `No file at ${studyPath(slug)}, so there is nothing to publish or unpublish.`,
    );
    return;
  }

  let written: string;
  try {
    written = writeScalar(source, "published", next);
  } catch (err) {
    fail((err as Error).message);
    return;
  }

  const draft = parseStudyFile(slug, written);
  const errors = validateDraft(draft);
  if (errors.length) {
    fail(
      `${slug} would not pass the build: ` +
        errors.map((e) => `${e.field} — ${e.message}`).join(" · "),
    );
    return;
  }

  const result = await publishStudy(
    slug,
    written,
    next ? `publish ${slug}` : `unpublish ${slug}`,
  );
  if (!result.ok) fail(result.error);
  else {
    revalidatePath(ADMIN_ROUTES.caseStudies);
    redirect(
      `${ADMIN_ROUTES.caseStudies}?moved=${encodeURIComponent(`${slug} ${next ? "published" : "unpublished"}`)}` +
        `&pr=${result.prNumber}&open=${result.autoMergeEnabled ? "automerge" : "waiting"}` +
        (result.autoMergeError
          ? `&why=${encodeURIComponent(result.autoMergeError)}`
          : ""),
    );
  }
}

export default async function CaseStudiesPane({
  searchParams,
}: {
  searchParams: Promise<{
    moved?: string;
    err?: string;
    pr?: string;
    open?: string;
    why?: string;
  }>;
}) {
  const { moved, err, pr, open, why } = await searchParams;
  const publishes = await readPublishes();
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
        against <code>order.yaml</code> and asks GitHub to auto-merge it, so CI
        runs before it publishes. Nothing here writes <code>main</code>{" "}
        directly, and nothing here merges.
      </p>

      <p className={styles.count}>
        {studies.length} published · {unpublished.length} unpublished
      </p>

      {err ? <p className={styles.error}>{err}</p> : null}
      {pr ? (
        <p className={open === "waiting" ? styles.bad : styles.ok}>
          Pull request #{pr} opened.{" "}
          {open === "waiting"
            ? "Auto-merge was refused, so it is waiting for you to merge it after CI passes. Nothing was merged from here."
            : "Auto-merge is on, so it publishes once CI passes."}
          {/* GitHub's own words, not a paraphrase. Round 20 watched the first
              real publish report "auto-merge could not be enabled on this
              repository" while `allow_auto_merge` was in fact true — the
              refusal was "Pull request is in unstable status", which is a
              statement about this PR and about `main` carrying no required
              check, not about the repository setting. A message that names the
              wrong cause sends whoever reads it to the wrong settings page. */}
          {why ? (
            <span className={styles.meta}> GitHub said: {why}</span>
          ) : null}
        </p>
      ) : null}
      {moved ? <p className={styles.ok}>Moved {moved}.</p> : null}

      {/* §2.2's fourth requirement: every publish this cockpit opened, and where
          it got to. Read from GitHub when the pane renders — a local record of
          "publishes I started" drifts the moment a human merges or closes one,
          and "did it land" is the only question worth asking. No polling; the
          refresh is a link, because a spinner that re-fetches every two seconds
          is a worse answer to "has CI finished" than a link that says so. */}
      <h2 className={styles.h2}>Publishes</h2>
      {publishes.ok ? (
        publishes.publishes.length === 0 ? (
          <p className={styles.empty}>
            No pull request has been opened from this cockpit yet.
          </p>
        ) : (
          <ul className={styles.rows}>
            {publishes.publishes.map((p) => (
              <li key={p.number} className={styles.row}>
                <div className={styles.rowHead}>
                  <span className={styles.meta}>#{p.number}</span>
                  <p className={styles.rowTitle}>
                    <a href={p.url} rel="noreferrer">
                      {p.title}
                    </a>
                  </p>
                  <span className={p.merged ? styles.ok : styles.meta}>
                    {p.merged ? "merged" : p.state}
                  </span>
                  <span
                    className={
                      p.checks === "success"
                        ? styles.ok
                        : p.checks === "failure"
                          ? styles.bad
                          : styles.meta
                    }
                  >
                    {p.checks === null
                      ? "checks not reported"
                      : p.checks === "failure" && p.failingCheck
                        ? `failed: ${p.failingCheck}`
                        : `checks ${p.checks}`}
                  </span>
                </div>
                <p className={styles.meta}>{p.branch}</p>
              </li>
            ))}
          </ul>
        )
      ) : (
        <p className={styles.empty}>
          Could not read pull requests: {publishes.error}
        </p>
      )}
      <p className={styles.meta}>
        <Link href={ADMIN_ROUTES.caseStudies}>Refresh publish status</Link>
      </p>

      <h2 className={styles.h2}>Studies</h2>
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
            <p className={styles.meta}>
              <Link
                href={`${ADMIN_ROUTES.caseStudies}/${study.frontmatter.slug}`}
              >
                Edit this study
              </Link>
            </p>
            {/* Publish state is a property of the study, so the control is on
                every row — including the unpublished ones, which is the only
                way a draft can be brought back without editing the file. */}
            <form action={setPublished}>
              <input type="hidden" name="slug" value={study.frontmatter.slug} />
              <input
                type="hidden"
                name="next"
                value={study.frontmatter.published === false ? "true" : "false"}
              />
              <button className={styles.submit} type="submit">
                {study.frontmatter.published === false
                  ? "Publish"
                  : "Unpublish"}
              </button>
            </form>
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
