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
 * EXECUTED AGAINST GITHUB, round 20. A reorder published from the pane created
 * `admin/2026-08-07T07-29-20-906Z`, committed order.yaml to it and opened pull
 * request #13; the diff was the two lines that swapped. Requirement 3 was then
 * exercised for real rather than in a fixture: GitHub refused auto-merge with
 * "Pull request is in unstable status" — `allow_auto_merge` is on, but `main`
 * has no required status check, so the merge is not blocked by anything and
 * there is nothing to queue behind. This module reported that and stopped, which
 * is what it is for.
 *
 * `scripts/check-write-path.mjs` still proves the invariants against this module
 * with `githubFetch` replaced. That remains a different and smaller claim than
 * "a commit landed", and the two are not interchangeable.
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

/** Used only when order.yaml does not exist yet. See `serialiseOrder`. */
const DEFAULT_ORDER_HEADER = [
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
];

/**
 * The prose and the per-slug annotations already in the file.
 *
 * ROUND 20. The shipped `order.yaml` opens with 22 lines recording why four
 * studies were removed in round 7 and which one returns in round 8, and each of
 * its ten entries carries the client's name as a trailing comment — the only
 * place a reader can see whose study sits at which position without opening ten
 * files. A serialiser that emits a fixed header destroys all of it on the first
 * reorder, and the reorder is the thing this pane exists to do. Reversible in
 * position, not in prose: moving a study back does not bring the comments back.
 *
 * So the writer READS before it writes. It is the same discipline the reorder
 * action already follows for the order itself — the current order comes from the
 * file, never from the form — extended to the rest of the file's content.
 */
function splitExistingOrder(previous: string): {
  header: string[];
  notes: Map<string, string>;
} {
  const lines = previous.split("\n");
  const at = lines.findIndex((line) => line.trimEnd() === "order:");
  if (at === -1) return { header: DEFAULT_ORDER_HEADER, notes: new Map() };

  const notes = new Map<string, string>();
  for (const line of lines.slice(at + 1)) {
    const entry = /^\s*-\s+(\S+)\s*(#.*)?$/.exec(line);
    if (entry?.[1] && entry[2]) notes.set(entry[1], entry[2]);
  }
  return { header: lines.slice(0, at), notes };
}

/**
 * order.yaml, serialised.
 *
 * Emits the same `order:` list shape `caseStudyOrder()` parses. Duplicates are a
 * hard error rather than a silent de-duplication: two of one slug means the
 * caller's reorder is wrong, and writing a quietly corrected file hides that
 * from whoever sent it.
 *
 * `previous` is the file as it stands. Given it, the header and every trailing
 * comment survive the rewrite and the diff is exactly the lines that moved.
 * Without it the default header is used, which is the right behaviour for a file
 * that does not exist yet and the wrong one for every other case — so the caller
 * that has the file passes it.
 */
export function serialiseOrder(slugs: string[], previous?: string): string {
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

  const { header, notes } = previous
    ? splitExistingOrder(previous)
    : { header: DEFAULT_ORDER_HEADER, notes: new Map<string, string>() };

  return [
    ...header,
    "order:",
    ...slugs.map((slug) => {
      const note = notes.get(slug);
      return note ? `  - ${slug} ${note}` : `  - ${slug}`;
    }),
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

/**
 * `owner/name`, from whichever shape of the same address was configured.
 *
 * ROUND 20, MEASURED AT GROUND. `ADMIN_GITHUB_REPO` held
 * `https://github.com/yallo-talent/yallo-talent-website` — the address a person
 * copies out of a browser, and out of `git remote -v`, which is where the round
 * 19 step list told Sumeet to take it from. The old test accepted `owner/name`
 * and nothing else, so the first real publish would have failed on the
 * configuration rather than on anything about the write path, and the error
 * would have named a variable that was in fact set correctly.
 *
 * Three shapes, all of them unambiguous readings of one repository, all
 * normalised rather than guessed at: the bare slug, an https URL on github.com,
 * and the scp-style SSH remote. `.git` is stripped because both remote forms
 * carry it. Anything else is still refused by name — a host that is not
 * github.com is a different service, and this module will not send a token to
 * one it was not pointed at.
 */
export function repoSlugFrom(raw: string): string {
  const value = raw.trim().replace(/\/+$/, "");
  const strip = (s: string) => s.replace(/\.git$/, "");

  const bare = /^([^/\s:]+)\/([^/\s:]+)$/.exec(strip(value));
  if (bare) return `${bare[1]}/${bare[2]}`;

  const https = /^https?:\/\/(?:www\.)?github\.com\/([^/\s]+)\/([^/\s]+)$/.exec(
    strip(value),
  );
  if (https) return `${https[1]}/${https[2]}`;

  const ssh = /^git@github\.com:([^/\s]+)\/([^/\s]+)$/.exec(strip(value));
  if (ssh) return `${ssh[1]}/${ssh[2]}`;

  throw new WritePathError(
    `ADMIN_GITHUB_REPO is ${value === "" ? "empty" : `"${value}"`}, which does ` +
      "not name a GitHub repository. Accepted: owner/name, " +
      "https://github.com/owner/name, or git@github.com:owner/name. This module " +
      "does not know which repository it is allowed to write to, and it will " +
      "not guess one.",
  );
}

function repoSlug(deps: PublishDeps): string {
  return repoSlugFrom(deps.repo ?? process.env.ADMIN_GITHUB_REPO ?? "");
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

export const STUDY_DIR = "content/case-studies";

/** The repository path of one study. Validated by `assertContentPath` downstream. */
export function studyPath(slug: string): string {
  return `${STUDY_DIR}/${slug}.mdx`;
}

/**
 * An edited study, through the same pull request path as everything else.
 *
 * `source` is the WHOLE file as it should be after the edit — frontmatter fence
 * and body — produced by src/lib/admin/case-study-draft.ts's surgical writers so
 * the diff is the lines that changed and not a re-serialisation of the document.
 * This module does not parse or assemble MDX: it commits bytes, and keeping the
 * two apart is what lets check-write-path prove the commit path without a
 * content fixture and lets the draft module be validated without a network.
 */
export async function publishStudy(
  slug: string,
  source: string,
  reason: string,
  deps: PublishDeps = {},
): Promise<PublishResult> {
  return publish(
    {
      message: `data(case-studies): ${reason}`,
      reason: `${reason}. Only \`${studyPath(slug)}\` changes.`,
      files: [{ path: studyPath(slug), content: source }],
    },
    deps,
  );
}

/* ------------------------------------------------------ what happened after */

export interface PublishState {
  number: number;
  title: string;
  url: string;
  branch: string;
  /** open · merged · closed, as GitHub reports it. */
  state: string;
  merged: boolean;
  /** null while no check has reported; otherwise success · failure · pending. */
  checks: string | null;
  /** Named only when a check has concluded unsuccessfully. */
  failingCheck: string | null;
  createdAt: string;
}

/**
 * The publishes this cockpit has opened, and where each one got to. Round 20
 * §2.2's fourth requirement.
 *
 * READ FROM GITHUB, never from a local record. A table of "publishes I started"
 * written by this process would drift from the truth the moment a human merged
 * or closed one, and the question the pane has to answer is "did it land", which
 * only GitHub can answer. Restricted to the `admin/` branch prefix, so a human's
 * own pull request never appears here as something the cockpit did.
 *
 * NO POLLING. This is read when the pane renders, and the pane has a refresh
 * link. §2.2 rules out polling theatre explicitly, and a spinner that re-fetches
 * every two seconds is a worse answer to "has CI finished" than a link that says
 * what it will do.
 */
export async function readPublishes(
  limit = 10,
  deps: PublishDeps = {},
): Promise<
  { ok: true; publishes: PublishState[] } | { ok: false; error: string }
> {
  const call = deps.githubFetch ?? realFetch;
  const token = deps.token ?? process.env.ADMIN_GITHUB_TOKEN ?? "";
  if (token === "") {
    return { ok: false, error: "ADMIN_GITHUB_TOKEN is not set." };
  }
  let repo: string;
  try {
    repo = repoSlug(deps);
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
  const headers = {
    accept: "application/vnd.github+json",
    authorization: `Bearer ${token}`,
    "x-github-api-version": "2022-11-28",
  };

  try {
    const res = await call(
      `${API}/repos/${repo}/pulls?state=all&sort=created&direction=desc&per_page=30`,
      { headers },
    );
    if (!res.ok) throw new Error(`GET /pulls returned ${res.status}`);
    const list = (await res.json()) as Array<{
      number: number;
      title: string;
      html_url: string;
      state: string;
      merged_at: string | null;
      created_at: string;
      head: { ref: string; sha: string };
    }>;

    const mine = list
      .filter((pr) => pr.head?.ref?.startsWith(BRANCH_PREFIX))
      .slice(0, limit);

    const publishes: PublishState[] = [];
    for (const pr of mine) {
      let checks: string | null = null;
      let failingCheck: string | null = null;
      try {
        const cr = await call(
          `${API}/repos/${repo}/commits/${pr.head.sha}/check-runs`,
          { headers },
        );
        if (cr.ok) {
          const body = (await cr.json()) as {
            check_runs?: Array<{
              name: string;
              status: string;
              conclusion: string | null;
            }>;
          };
          const runs = body.check_runs ?? [];
          if (runs.length === 0) checks = null;
          else if (runs.some((r) => r.status !== "completed"))
            checks = "pending";
          else {
            const bad = runs.find(
              (r) => r.conclusion !== "success" && r.conclusion !== "neutral",
            );
            checks = bad ? "failure" : "success";
            failingCheck = bad ? bad.name : null;
          }
        }
      } catch {
        /* A check-runs read that fails leaves `checks` null, which the pane
           renders as "not reported" rather than as a pass. */
      }
      publishes.push({
        number: pr.number,
        title: pr.title,
        url: pr.html_url,
        branch: pr.head.ref,
        state: pr.state,
        merged: pr.merged_at !== null,
        checks,
        failingCheck,
        createdAt: pr.created_at,
      });
    }
    return { ok: true, publishes };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

/** Reordering, the one write operation the case-studies pane exposes. */
export async function publishOrder(
  slugs: string[],
  deps: PublishDeps & { previous?: string } = {},
): Promise<PublishResult> {
  let content: string;
  try {
    content = serialiseOrder(slugs, deps.previous);
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
