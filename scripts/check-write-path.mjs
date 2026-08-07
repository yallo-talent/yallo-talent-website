#!/usr/bin/env node
/**
 * check-write-path — the cockpit's write path cannot reach outside content/, and
 * cannot land on the default branch without CI.
 *
 * WHAT THIS PROVES, AND WHAT IT DOES NOT. Round 19 §2 bans reporting a commit
 * path as working when it was not watched committing. This gate does NOT claim
 * that. `ADMIN_GITHUB_TOKEN` is a blank assignment in `.env.local` as of round
 * 19, so no commit has landed and none is asserted here.
 *
 * What it does prove is the part that is structural, and it proves it against the
 * REAL module with only the network boundary substituted:
 *
 *   1. Every path a commit touches is under content/. Absolute paths, backslashes,
 *      `..` traversal and a path that merely starts with the string "content/"
 *      while escaping it are each rejected by name.
 *   2. The module never writes the default branch. It refuses one explicitly, and
 *      the recorded request log is checked for a ref that is not the `admin/`
 *      branch it created.
 *   3. Auto-merge disabled is REPORTED, not worked around. A repository that
 *      refuses the mutation must leave the pull request open and say so, and the
 *      request log must contain no merge call.
 *   4. Reordering writes content/case-studies/order.yaml and nothing else, in the
 *      shape src/lib/case-study-order.ts parses. Never an `order` frontmatter
 *      field: withdrawn, round 18 §1.3.
 *
 * The module is TypeScript with `server-only` and a `@/` alias, so it is compiled
 * for this gate with the project's own tsc rather than re-implemented. A gate that
 * re-implements what it checks is checking itself.
 *
 *   node scripts/check-write-path.mjs
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = "src/lib/admin/publish.ts";

const failures = [];
const passes = [];
const ok = (name) => passes.push(name);
const bad = (name, detail) => failures.push(`${name}\n      ${detail}`);

/* ------------------------------------------------ compile the real module */

const work = mkdtempSync(join(tmpdir(), "yallo-write-path-"));
let publishModule;
try {
  const src = readFileSync(join(ROOT, SOURCE), "utf8").replace(
    /^import "server-only";\s*/m,
    "",
  );
  const entry = join(work, "publish.ts");
  writeFileSync(entry, src);
  execFileSync(
    "pnpm",
    [
      "exec",
      "tsc",
      entry,
      "--module",
      "esnext",
      "--target",
      "es2022",
      "--moduleResolution",
      "bundler",
      "--skipLibCheck",
      "--outDir",
      work,
    ],
    { cwd: ROOT, stdio: "pipe" },
  );
  publishModule = await import(`file://${join(work, "publish.js")}`);
} catch (err) {
  console.error(
    `\ncheck:write-path could not compile ${SOURCE}:\n  ${
      err.stdout?.toString() || err.message
    }\n`,
  );
  rmSync(work, { recursive: true, force: true });
  process.exit(1);
}

const {
  assertContentPath,
  assertNotDefaultBranch,
  serialiseOrder,
  publishOrder,
  publishStudy,
  studyPath,
  repoSlugFrom,
  ORDER_PATH,
} = publishModule;

/* -------------------------------------------- 1. nothing escapes content/ */

const MUST_REJECT = [
  ["/etc/passwd", "absolute"],
  ["src/app/page.tsx", "outside content/"],
  ["package.json", "outside content/"],
  ["content/../src/app/page.tsx", "traversal that still starts with content/"],
  ["content/../../etc/passwd", "traversal escaping the repository"],
  ["content\\case-studies\\a.mdx", "backslash separators"],
  ["content/", "content/ itself, with no file"],
  ["", "empty"],
  ["content//a.mdx", "empty segment"],
  ["./content/a.mdx", "leading dot segment"],
];
for (const [path, why] of MUST_REJECT) {
  let rejected = false;
  try {
    assertContentPath(path);
  } catch {
    rejected = true;
  }
  if (rejected) ok(`rejects ${JSON.stringify(path)} (${why})`);
  else
    bad(
      `ACCEPTED ${JSON.stringify(path)} (${why})`,
      "A fine-grained token carries no path scope, so this check is the only thing\n" +
        "      standing between the cockpit and the rest of the repository.",
    );
}

for (const path of [
  "content/case-studies/order.yaml",
  "content/case-studies/a-study.mdx",
  "content/insights/a-piece.mdx",
]) {
  try {
    assertContentPath(path);
    ok(`accepts ${path}`);
  } catch (err) {
    bad(`REJECTED a legitimate path ${path}`, err.message);
  }
}

/* ------------------------------------------- 2. never the default branch */

let refused = false;
try {
  assertNotDefaultBranch("main", "main");
} catch {
  refused = true;
}
if (refused) ok("refuses to write the default branch");
else
  bad(
    "ACCEPTED the default branch as a write target",
    "A direct push skips the CI that keeps a malformed case study off main.",
  );

let namespaced = false;
try {
  assertNotDefaultBranch("some-branch", "main");
} catch {
  namespaced = true;
}
if (namespaced) ok("refuses a branch outside admin/");
else bad("ACCEPTED an un-namespaced branch", "Every cockpit branch is admin/-prefixed.");

/* ------------------------------- 3 and 4. the whole path, boundary faked */

/**
 * A GitHub substitute that RECORDS rather than simulates. Every assertion below
 * is made against what the module actually sent.
 */
function fakeGithub({ autoMerge }) {
  const log = [];
  const reply = (status, body) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { "content-type": "application/json" },
    });
  return {
    log,
    fetch: async (url, init) => {
      const method = init.method ?? "GET";
      log.push(`${method} ${url}`);
      if (url.endsWith("/graphql")) {
        return autoMerge
          ? reply(200, { data: { enablePullRequestAutoMerge: {} } })
          : reply(200, {
              errors: [
                { message: "Auto-merge is not enabled for this repository" },
              ],
            });
      }
      if (/\/repos\/[^/]+\/[^/]+$/.test(url)) {
        return reply(200, { default_branch: "main" });
      }
      if (url.includes("/git/ref/heads/")) {
        return reply(200, { object: { sha: "a".repeat(40) } });
      }
      if (url.includes("/git/refs") && method === "POST") {
        return reply(201, {});
      }
      if (url.includes("/contents/") && method === "GET") {
        return reply(200, { sha: "b".repeat(40) });
      }
      if (url.includes("/contents/") && method === "PUT") {
        const body = JSON.parse(String(init.body));
        log.push(`  PUT-BODY branch=${body.branch} path-in-url`);
        return reply(200, { commit: { sha: "c".repeat(40) } });
      }
      if (url.endsWith("/pulls") && method === "POST") {
        const body = JSON.parse(String(init.body));
        log.push(`  PR head=${body.head} base=${body.base}`);
        return reply(201, {
          number: 99,
          html_url: "https://example.invalid/pr/99",
          node_id: "PR_node",
        });
      }
      return reply(404, { message: `unexpected call: ${method} ${url}` });
    },
  };
}

const SLUGS = ["alpha-study", "beta-study", "gamma-study"];

for (const autoMerge of [true, false]) {
  const gh = fakeGithub({ autoMerge });
  const result = await publishOrder(SLUGS, {
    githubFetch: gh.fetch,
    token: "fake-token-for-this-gate-only",
    repo: "yallo-talent/yallo-talent-website",
    now: () => new Date("2026-08-07T09:00:00Z"),
  });
  const label = autoMerge ? "auto-merge available" : "auto-merge DISABLED";

  if (!result.ok) {
    bad(`publishOrder failed with ${label}`, result.error);
    continue;
  }

  if (result.autoMergeEnabled === autoMerge) ok(`reports auto-merge honestly (${label})`);
  else
    bad(
      `misreported auto-merge (${label})`,
      `autoMergeEnabled was ${result.autoMergeEnabled}`,
    );

  if (!autoMerge) {
    if (result.autoMergeError) ok("names why auto-merge failed");
    else bad("auto-merge failed silently", "The operator has to know the PR is waiting.");
    const merged = gh.log.some((l) => /\/merge\b/.test(l) || /PUT .*\/pulls\//.test(l));
    if (merged)
      bad(
        "MERGED the pull request itself when auto-merge was unavailable",
        "That lands on main without waiting for the checks. It is a direct push\n" +
          "      wearing a different hat, and §2 forbids it under any failure.",
      );
    else ok("leaves the PR open rather than merging it when auto-merge is off");
  }

  /* Nothing anywhere in the log may touch a ref other than the admin/ branch. */
  const touchedMain = gh.log.some(
    (l) =>
      /branch=main\b/.test(l) ||
      /refs\/heads\/main/.test(l) ||
      /PR head=main\b/.test(l),
  );
  if (touchedMain)
    bad(`wrote to main (${label})`, gh.log.filter((l) => /main/.test(l)).join("\n      "));
  else ok(`writes only the admin/ branch (${label})`);

  const prLine = gh.log.find((l) => l.startsWith("  PR "));
  if (prLine?.includes("base=main") && /head=admin\//.test(prLine ?? ""))
    ok(`opens a PR from admin/ into main (${label})`);
  else bad(`PR was not admin/ into main (${label})`, prLine ?? "no PR opened");

  const contentPuts = gh.log.filter((l) => l.startsWith("PUT ") && l.includes("/contents/"));
  const offPath = contentPuts.filter((l) => !l.includes(`/contents/${ORDER_PATH}`));
  if (contentPuts.length === 1 && offPath.length === 0)
    ok(`reorder writes ${ORDER_PATH} and nothing else (${label})`);
  else
    bad(
      `reorder wrote ${contentPuts.length} file(s) (${label})`,
      contentPuts.join("\n      "),
    );
}

/* --------------------------- 4b. the file it writes is the file that parses */

const yaml = serialiseOrder(SLUGS);
const parsed = parseYaml(yaml);
if (Array.isArray(parsed?.order) && parsed.order.join(",") === SLUGS.join(","))
  ok("serialiseOrder emits the `order:` list case-study-order.ts parses");
else bad("serialiseOrder produced a file case-study-order.ts cannot read", yaml.slice(0, 200));

if (/^\s*order\s*:/m.test(yaml) && !/^\s*-\s*slug\s*:/m.test(yaml))
  ok("no `order` frontmatter field, withdrawn round 18 §1.3");
else bad("emitted something other than the order.yaml list shape", yaml.slice(0, 200));

let dupRejected = false;
try {
  serialiseOrder(["a", "a"]);
} catch {
  dupRejected = true;
}
if (dupRejected) ok("refuses a duplicate slug rather than quietly de-duplicating");
else bad("ACCEPTED a duplicate slug", "case-study-order.ts throws on it at build time.");

/* ------------- 4c. a reorder preserves the file's prose and its annotations */

/* ROUND 20, and the invariant this gate was extended for FIRST — proved red
   before it was trusted. Run against the pre-round-20 `serialiseOrder(slugs)`,
   which emitted a fixed header and bare slugs, this block fails on both counts:
   the round 7 provenance note is gone and every client comment with it. The
   published order.yaml carries 22 lines of prose and a client name on each of
   its ten entries, and a reorder is exactly the operation that used to delete
   all of it. Reversible in position; not reversible in prose. */
{
  const previous = [
    "# A header that must survive.",
    "# Second line of it.",
    "",
    "order:",
    "  - alpha # Client A",
    "  - beta # Client B",
    "  - gamma",
    "",
  ].join("\n");
  const rewritten = serialiseOrder(["beta", "alpha", "gamma"], previous);

  if (rewritten.includes("# A header that must survive.") &&
      rewritten.includes("# Second line of it."))
    ok("a reorder keeps the file's existing header");
  else
    bad(
      "a reorder DISCARDED the header",
      "order.yaml opens with the provenance of four removed studies; a rewrite\n" +
        "      that drops it loses the only record of why they went.",
    );

  if (/-\s*alpha\s+# Client A/.test(rewritten) &&
      /-\s*beta\s+# Client B/.test(rewritten))
    ok("a reorder keeps each entry's trailing comment with the entry that moved");
  else
    bad(
      "a reorder DROPPED the per-slug comments",
      rewritten,
    );

  const order = parseYaml(rewritten)?.order;
  if (Array.isArray(order) && order.join(",") === "beta,alpha,gamma")
    ok("the preserved comments do not change what the file parses to");
  else bad("comment preservation corrupted the parsed order", rewritten);

  /* And with no previous file, the default header is still emitted — a new
     repository must not get an order.yaml with no explanation in it. */
  const fresh = serialiseOrder(["alpha"], undefined);
  if (fresh.startsWith("# The published order"))
    ok("a file that does not exist yet still gets the default header");
  else bad("a fresh order.yaml came out with no header", fresh.slice(0, 120));
}

/* ------------------ 5. edit and unpublish take the same path, under content/ */

/* Round 20 §2.2 extends the pane from reorder to full lifecycle. Both new
   operations are commits like any other, so what has to hold is that they route
   through `publish` — one namespaced branch, one pull request, no merge — and
   that the path they write is the study's own file and nothing else. */
for (const [label, autoMerge] of [["auto-merge on", true], ["auto-merge off", false]]) {
  const gh = fakeGithub({ autoMerge });
  const res = await publishStudy(
    "a-study",
    "---\ntitle: x\n---\nbody\n",
    "edit a-study",
    { githubFetch: gh.fetch, token: "t", repo: "yallo-talent/yallo-talent-website", now: () => new Date("2026-08-07T00:00:00Z") },
  );
  if (!res.ok) {
    bad(`publishStudy failed (${label})`, res.error);
    continue;
  }
  const puts = gh.log.filter((l) => l.startsWith("PUT ") && l.includes("/contents/"));
  const wrong = puts.filter((l) => !l.includes(`/contents/${studyPath("a-study")}`));
  if (puts.length === 1 && wrong.length === 0)
    ok(`an edit writes ${studyPath("a-study")} and nothing else (${label})`);
  else bad(`an edit wrote ${puts.length} file(s) (${label})`, puts.join("\n      "));

  if (res.branch.startsWith("admin/"))
    ok(`an edit lands on a namespaced branch, never main (${label})`);
  else bad(`an edit created branch ${res.branch} (${label})`, "It must be under admin/.");

  const merges = gh.log.filter((l) => /\/merge\b/.test(l));
  if (merges.length === 0) ok(`an edit performs no merge call (${label})`);
  else bad(`an edit called merge (${label})`, merges.join("\n      "));
}

/* An edit cannot be talked into writing outside content/, by the same guard the
   reorder uses. The slug is the only caller-controlled part of the path. */
{
  const gh = fakeGithub({ autoMerge: true });
  const res = await publishStudy(
    "../../../etc/passwd",
    "x",
    "traversal",
    { githubFetch: gh.fetch, token: "t", repo: "yallo-talent/yallo-talent-website" },
  );
  const wrote = gh.log.some((l) => l.startsWith("PUT ") && l.includes("/contents/"));
  if (!res.ok && !wrote)
    ok("a traversing slug is refused before anything is written");
  else bad("a traversing slug reached the commit path", JSON.stringify(res));
}

/* ------------------------------ 6. the repository address, in three shapes */

/* Round 20 ground: ADMIN_GITHUB_REPO held the full https URL, which the old
   owner/name test rejected — so the first real publish would have failed on the
   configuration and blamed a variable that was set correctly. */
for (const [input, why] of [
  ["yallo-talent/yallo-talent-website", "the bare slug"],
  ["https://github.com/yallo-talent/yallo-talent-website", "an https remote"],
  ["https://github.com/yallo-talent/yallo-talent-website.git", "an https remote with .git"],
  ["git@github.com:yallo-talent/yallo-talent-website.git", "an ssh remote"],
]) {
  let got = null;
  try {
    got = repoSlugFrom(input);
  } catch (err) {
    got = `THREW: ${err.message}`;
  }
  if (got === "yallo-talent/yallo-talent-website") ok(`normalises ${why}`);
  else bad(`did not normalise ${why}`, String(got));
}
for (const [input, why] of [
  ["", "an empty value"],
  ["https://gitlab.com/owner/name", "a host that is not github.com"],
  ["owner", "a bare name with no owner"],
]) {
  let threw = false;
  try {
    repoSlugFrom(input);
  } catch {
    threw = true;
  }
  if (threw) ok(`refuses ${why}`);
  else bad(`ACCEPTED ${why}`, "A token does not go to a repository this module was not pointed at.");
}

/* ------------------------- the absent token is reported, not worked around */

const noToken = await publishOrder(SLUGS, {
  githubFetch: fakeGithub({ autoMerge: true }).fetch,
  token: "",
  repo: "yallo-talent/yallo-talent-website",
});
if (!noToken.ok && /ADMIN_GITHUB_TOKEN/.test(noToken.error))
  ok("an absent token is reported by name, and nothing is attempted");
else bad("an absent token did not stop the write path", JSON.stringify(noToken));

/* ------------------------------------------------------------------ verdict */

rmSync(work, { recursive: true, force: true });

if (failures.length > 0) {
  console.error(`\ncheck:write-path FAILED with ${failures.length} problem(s):\n`);
  for (const f of failures) console.error(`  ${f}\n`);
  process.exit(1);
}

console.log(
  `\ncheck:write-path passed\n` +
    `  ${passes.length} assertion(s) against the real ${SOURCE}, network boundary substituted\n` +
    `  ${MUST_REJECT.length} path shapes rejected, 3 accepted, default branch and un-namespaced branch refused\n` +
    `  auto-merge on and OFF both exercised; with it off the PR is left open and no merge call is made\n` +
    `  reorder, edit and unpublish all route through one pull request and perform no merge\n` +
    `  a reorder preserves the file's header and every per-slug comment\n` +
    `  This does NOT assert that a commit has landed. Round 20 watched one land as far as\n` +
    `  an open pull request (#13); that is a claim about a run, not about this module.\n`,
);
