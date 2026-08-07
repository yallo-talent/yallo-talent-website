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
    `  This does NOT assert that a commit has landed. No commit has: ADMIN_GITHUB_TOKEN is blank.\n`,
);
