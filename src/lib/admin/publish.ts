import "server-only";

/**
 * The cockpit's write path. One way out of the admin panes and into the
 * repository, and it is a pull request with auto-merge every time.
 *
 * SPEC: round 17 §2.3 as amended by round 18 §2.4, restated in round 19 §2.
 * Four of its requirements are structural rather than procedural, so they are
 * enforced here rather than remembered:
 *
 *   1. NEVER A DIRECT PUSH TO THE DEFAULT BRANCH. There is no code path in this
 *      module that writes a ref other than a fresh `admin/` branch, and
 *      `assertNotDefaultBranch` refuses one if a caller ever tries. A direct push
 *      skips the CI that exists to keep a malformed case study off `main`, which
 *      is the entire reason the write path is a PR at all.
 *   2. EVERY WRITTEN PATH IS UNDER content/. Fine-grained GitHub tokens carry no
 *      path scope (round 18 §1.3), so the token cannot enforce this and the
 *      commit path has to. `assertContentPath` is that enforcement, and it runs
 *      on every file of every commit rather than at the call sites.
 *   3. AUTO-MERGE IS REQUESTED, NEVER SIMULATED. If the repository has auto-merge
 *      disabled, this REPORTS it and leaves the pull request open for a human.
 *      It does not merge the PR itself, because a merge this module performs is a
 *      direct push wearing a different hat: it lands on `main` without waiting
 *      for the checks.
 *   4. REORDERING WRITES content/case-studies/order.yaml. Never an `order`
 *      frontmatter field: that instruction was withdrawn in round 18 §1.3 because
 *      it would restore the fourteen-integers-by-hand defect that
 *      src/lib/case-study-order.ts was built to remove.
 *
 * NOT YET EXECUTED AGAINST GITHUB. As of round 19 `ADMIN_GITHUB_TOKEN` is a blank
 * assignment in `.env.local`, so no commit has been watched landing and this
 * module must not be described as working. Its invariants are proven by
 * scripts/check-write-path.mjs against this module with `githubFetch` replaced;
 * that is a different claim and a smaller one, and the relay says so.
 */

const CONTENT_ROOT = "content/";
const BRANCH_PREFIX = "admin/";
const API = "https://api.github.com";
const GRAPHQL = "https://api.github.com/graphql";

export interface WriteFile {
  /** Repository-relative, POSIX separators, and always under `content/`. */
  path: string;
  /** UTF-8 text. This path commits text files only. */
  content: string;
}

export interface PublishRequest {
  message: string;
  files: WriteFile[];
  /** Shown in the PR body so a reviewer knows which pane produced it. */
  reason: string;
}

export type PublishResult =
  | {
      ok: true;
      prNumber: number;
      prUrl: string;
      branch: string;
      /** False when the repository has auto-merge disabled. The PR is open. */
      autoMergeEnabled: boolean;
      /** Present when auto-merge could not be enabled, verbatim from GitHub. */
      autoMergeError?: string;
    }
  | { ok: false; error: string };

/* ------------------------------------------------------------ the invariants */

export class WritePathError extends Error {}

/**
 * Every path a commit touches must be under `content/`, and must be a plain
 * relative path.
 *
 * Rejects, in order: an absolute path, a Windows separator, any `.` or `..`
 * segment, an empty segment, and finally anything not under `content/`. The
 * traversal check runs on SEGMENTS rather than on the joined string, because
 * `content/../../etc/passwd` starts with `content/` and a prefix test alone
 * would pass it.
 */
export function assertContentPath(path: string): string {
  if (typeof path !== "string" || path.length === 0) {
    throw new WritePathError("An empty path cannot be committed.");
  }
  if (path.startsWith("/")) {
    throw new WritePathError(
      `"${path}" is absolute. Commit paths are repository-relative.`,
    );
  }
  if (path.includes("\\")) {
    throw new WritePathError(
      `"${path}" uses a backslash. Commit paths use POSIX separators.`,
    );
  }
  const segments = path.split("/");
  for (const segment of segments) {
    if (segment === "" || segment === "." || segment === "..") {
      throw new WritePathError(
        `"${path}" contains a "${segment}" segment. A commit path is a plain ` +
          "relative path, and traversal is how a write pane restricted to content/ " +
          "comes to write somewhere else.",
      );
    }
  }
  if (!path.startsWith(CONTENT_ROOT) || path.length <= CONTENT_ROOT.length) {
    throw new WritePathError(
      `"${path}" is outside ${CONTENT_ROOT}. The cockpit writes content and ` +
        "nothing else. A fine-grained token carries no path scope, so this is " +
        "where the restriction lives.",
    );
  }
  return path;
}

/**
 * A branch this module is allowed to create. Never the default branch, and
 * always under `admin/` so a human reading the branch list can see where it came
 * from.
 */
export function assertNotDefaultBranch(
  branch: string,
  defaultBranch: string,
): string {
  if (branch === defaultBranch) {
    throw new WritePathError(
      `Refusing to write to "${defaultBranch}" directly. The write path is a ` +
        "pull request so CI runs before anything publishes, and a direct push " +
        "skips it.",
    );
  }
  if (!branch.startsWith(BRANCH_PREFIX)) {
    throw new WritePathError(
      `"${branch}" is not under ${BRANCH_PREFIX}. Every branch this module ` +
        "creates is namespaced, so one can never be mistaken for a human's.",
    );
  }
  return branch;
}

/**
 * order.yaml, serialised.
 *
 * Emits the same `order:` list shape `caseStudyOrder()` parses, with a header
 * saying where the file came from. Duplicates are a hard error rather than a
 * silent de-duplication: two of one slug means the caller's reorder is wrong,
 * and writing a quietly corrected file hides that from whoever sent it.
 */
export function serialiseOrder(slugs: string[]): string {
  const seen = new Set<string>();
  for (const slug of slugs) {
    if (typeof slug !== "string" || slug.trim() === "") {
      throw new WritePathError("order.yaml cannot carry an empty slug.");
    }
    if (seen.has(slug)) {
      throw new WritePathError(
        `order.yaml would list "${slug}" twice. A study has one position, and ` +
          "src/lib/case-study-order.ts throws on a duplicate at build time.",
      );
    }
    seen.add(slug);
  }
  return [
    "# The published order of the case studies. One editorial decision, one file.",
    "#",
    "# Written by the admin cockpit's reorder action. Editing it by hand is fine;",
    "# the cockpit reads this file before it writes it, so a hand edit is not lost.",
    "#",
    "# Two rules, both enforced in src/lib/case-study-order.ts:",
    "#   - A slug named here that resolves to no case study FAILS THE BUILD.",
    "#   - A published study not named here still publishes, appended behind these",
    "#     in date order, newest first.",
    "",
    "order:",
    ...slugs.map((slug) => `  - ${slug}`),
    "",
  ].join("\n");
}

export const ORDER_PATH = "content/case-studies/order.yaml";

/* ------------------------------------------------------- the GitHub boundary */

/**
 * Every network call this module makes goes through here, and it is injectable
 * for exactly one reason: `scripts/check-write-path.mjs` proves the invariants
 * above without a token and without touching the real repository. Round 19 §2
 * bans reporting a commit path as working when it was not watched committing, so
 * the substitute is used to prove what it CAN prove and nothing further.
 */
export type GithubFetch = (url: string, init: RequestInit) => Promise<Response>;

const realFetch: GithubFetch = (url, init) => fetch(url, init);

export interface PublishDeps {
  githubFetch?: GithubFetch;
  token?: string;
  repo?: string;
  now?: () => Date;
}

function repoSlug(deps: PublishDeps): string {
  const repo = deps.repo ?? process.env.ADMIN_GITHUB_REPO ?? "";
  if (!/^[^/\s]+\/[^/\s]+$/.test(repo)) {
    throw new WritePathError(
      "ADMIN_GITHUB_REPO is not set to owner/name, so this module does not know " +
        "which repository it is allowed to write to. It will not guess one.",
    );
  }
  return repo;
}

/* ------------------------------------------------------------ the write path */

export async function publish(
  request: PublishRequest,
  deps: PublishDeps = {},
): Promise<PublishResult> {
  const call = deps.githubFetch ?? realFetch;
  const token = deps.token ?? process.env.ADMIN_GITHUB_TOKEN ?? "";
  if (token === "") {
    return {
      ok: false,
      error:
        "ADMIN_GITHUB_TOKEN is not set, so the cockpit cannot open a pull " +
        "request. Add a fine-grained token with Contents and Pull requests " +
        "read and write, scoped to this repository only.",
    };
  }

  let repo: string;
  try {
    repo = repoSlug(deps);
    if (request.files.length === 0) {
      throw new WritePathError("A commit with no files is not a commit.");
    }
    for (const file of request.files) assertContentPath(file.path);
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }

  const headers = {
    accept: "application/vnd.github+json",
    authorization: `Bearer ${token}`,
    "content-type": "application/json",
    "x-github-api-version": "2022-11-28",
  };

  const json = async (url: string, init: RequestInit = {}) => {
    const res = await call(url, { ...init, headers });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(
        `${init.method ?? "GET"} ${url.replace(API, "")} returned ${res.status}: ${
          (body as { message?: string }).message ?? "no message"
        }`,
      );
    }
    return body as Record<string, unknown>;
  };

  try {
    const meta = await json(`${API}/repos/${repo}`);
    const defaultBranch = String(meta.default_branch ?? "main");

    const stamp = (deps.now ?? (() => new Date()))()
      .toISOString()
      .replace(/[:.]/g, "-");
    const branch = assertNotDefaultBranch(
      `${BRANCH_PREFIX}${stamp}`,
      defaultBranch,
    );

    const head = await json(
      `${API}/repos/${repo}/git/ref/heads/${defaultBranch}`,
    );
    const baseSha = String(
      (head.object as { sha?: string } | undefined)?.sha ?? "",
    );
    if (baseSha === "")
      throw new Error("Could not read the default branch head.");

    await json(`${API}/repos/${repo}/git/refs`, {
      method: "POST",
      body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: baseSha }),
    });

    /* One commit per file through the Contents API. Each call re-asserts the
       path: the loop above validated the request, this validates what is
       actually being sent, and the two being separate is deliberate. */
    for (const file of request.files) {
      assertContentPath(file.path);
      const existing = await call(
        `${API}/repos/${repo}/contents/${file.path}?ref=${branch}`,
        { headers },
      );
      const sha =
        existing.status === 200
          ? ((await existing.json()) as { sha?: string }).sha
          : undefined;
      await json(`${API}/repos/${repo}/contents/${file.path}`, {
        method: "PUT",
        body: JSON.stringify({
          message: request.message,
          content: Buffer.from(file.content, "utf8").toString("base64"),
          branch,
          ...(sha ? { sha } : {}),
        }),
      });
    }

    const pr = await json(`${API}/repos/${repo}/pulls`, {
      method: "POST",
      body: JSON.stringify({
        title: request.message,
        head: branch,
        base: defaultBranch,
        body:
          `${request.reason}\n\nOpened by the Yallo admin cockpit. Every file is ` +
          `under \`content/\`, enforced in the commit path rather than by the ` +
          `token, which carries no path scope.\n\nAuto-merge is requested so CI ` +
          `runs before this publishes. Nothing here merges without it.`,
      }),
    });
    const prNumber = Number(pr.number);
    const prUrl = String(pr.html_url ?? "");
    const prId = String(pr.node_id ?? "");

    /* Auto-merge, requested through GraphQL because REST has no equivalent. A
       repository with auto-merge disabled fails here, and that is REPORTED
       rather than worked around: merging it from this module would land it on
       the default branch without waiting for the checks, which is the direct
       push this whole path exists to avoid. */
    let autoMergeEnabled = false;
    let autoMergeError: string | undefined;
    try {
      const res = await call(GRAPHQL, {
        method: "POST",
        headers,
        body: JSON.stringify({
          query:
            "mutation($id:ID!){enablePullRequestAutoMerge(input:{pullRequestId:$id,mergeMethod:SQUASH}){clientMutationId}}",
          variables: { id: prId },
        }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        errors?: { message?: string }[];
      };
      if (res.ok && !body.errors?.length) autoMergeEnabled = true;
      else {
        autoMergeError =
          body.errors?.map((e) => e.message).join("; ") ??
          `GraphQL returned ${res.status}`;
      }
    } catch (err) {
      autoMergeError = (err as Error).message;
    }

    return {
      ok: true,
      prNumber,
      prUrl,
      branch,
      autoMergeEnabled,
      autoMergeError,
    };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

/** Reordering, the one write operation the case-studies pane exposes. */
export async function publishOrder(
  slugs: string[],
  deps: PublishDeps = {},
): Promise<PublishResult> {
  let content: string;
  try {
    content = serialiseOrder(slugs);
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
  return publish(
    {
      message: "data(case-studies): reorder from the admin cockpit",
      reason: `Reorders ${slugs.length} case studies. Only \`${ORDER_PATH}\` changes; no frontmatter is touched.`,
      files: [{ path: ORDER_PATH, content }],
    },
    deps,
  );
}
