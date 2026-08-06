#!/usr/bin/env node
/**
 * check:admin-isolation — the cockpit is reachable by its operator and by nothing
 * else that reads this site.
 *
 * WHY EACH ASSERTION EXISTS, round 17 §2.3. `/admin` reads every brief and every
 * assistant conversation the site has captured. Six independent things have to be
 * true for that to be safe, and they fail independently:
 *
 *   1. ABSENT FROM sitemap.xml. A sitemap entry is an invitation.
 *   2. ABSENT FROM llms.txt. Same invitation, aimed at retrieval crawlers.
 *   3. ABSENT FROM THE ASSISTANT CORPUS. **This is the one that gets forgotten.**
 *      The corpus is generated from src/data/** and content/**, so an admin
 *      surface described anywhere in those trees becomes something the public
 *      assistant can explain to a stranger — including where the sign-in page is.
 *      An assistant able to describe the admin surface is the failure mode, not a
 *      cosmetic leak.
 *   4. DISALLOWED IN robots.txt, and noindex in the X-Robots-Tag header on every
 *      admin response including redirects and the sign-in page.
 *   5. LINKED FROM NO PUBLISHED PAGE. A crawler that follows links does not need
 *      a sitemap.
 *   6. NO CREDENTIAL OR TOKEN IN THE CLIENT BUNDLE. The admin secrets carry no
 *      NEXT_PUBLIC_ prefix, so Next.js will not inline them — this checks the
 *      served JavaScript rather than trusting that, because the cost of being
 *      wrong is the write token.
 *
 * Also asserted: an ANONYMOUS request to each pane must not return pane content.
 * The layout guard makes that true by construction; a gate makes it true after
 * the next refactor as well.
 *
 *   node scripts/check-admin-isolation.mjs [baseUrl]
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL("../", import.meta.url)));
const BASE = process.env.BASE_URL ?? process.argv[2] ?? "http://localhost:3115";

const policy = JSON.parse(
  readFileSync(join(ROOT, "src/lib/robots-policy.json"), "utf8"),
);
const ADMIN_BASE = policy.adminBase;
const failures = [];

/** Routes the cockpit actually serves, derived from the app tree rather than
    listed here — a hand-kept list is how a new pane escapes every assertion. */
function adminRoutes() {
  const dir = join(ROOT, "src/app/admin");
  const found = new Set([ADMIN_BASE]);
  const walk = (abs, urlParts) => {
    for (const entry of readdirSync(abs, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        /* A (group) is transparent in the URL. */
        const isGroup = entry.name.startsWith("(") && entry.name.endsWith(")");
        walk(
          join(abs, entry.name),
          isGroup ? urlParts : [...urlParts, entry.name],
        );
      } else if (/^page\.tsx?$/.test(entry.name)) {
        found.add(`${ADMIN_BASE}${urlParts.length ? `/${urlParts.join("/")}` : ""}`);
      }
    }
  };
  walk(dir, []);
  return [...found].sort();
}

const ROUTES = adminRoutes();
if (ROUTES.length < 2) {
  failures.push(
    `Only ${ROUTES.length} admin route(s) found under src/app/admin. Either the\n` +
      "      cockpit has been removed, or this gate can no longer see it and would\n" +
      "      pass whatever happened next.",
  );
}

/* ------------------------------------------------- 1, 2, 4: the served files */

async function text(path) {
  const res = await fetch(`${BASE}${path}`).catch(() => null);
  if (!res?.ok) {
    failures.push(`Could not read ${BASE}${path} (${res ? res.status : "no response"}).`);
    return "";
  }
  return res.text();
}

const sitemap = await text("/sitemap.xml");
const llms = await text("/llms.txt");
const robots = await text("/robots.txt");

if (sitemap.includes(ADMIN_BASE)) {
  failures.push(
    `sitemap.xml names ${ADMIN_BASE}. A sitemap entry is an invitation to index it.`,
  );
}
if (llms.includes(ADMIN_BASE)) {
  failures.push(
    `llms.txt names ${ADMIN_BASE}. That file exists to tell retrieval crawlers what\n` +
      "      to read, which is the opposite of what this surface needs.",
  );
}

/* The disallow must be the path prefix form, so it covers every pane. Parsed per
   group rather than grepped: `Disallow: /` contains `Disallow: /admin/` in
   neither direction, and a bare grep would accept the wrong one. */
const adminDisallow = `${ADMIN_BASE}/`;
if (!policy.disallow.includes(adminDisallow)) {
  failures.push(
    `src/lib/robots-policy.json does not disallow ${adminDisallow}.\n` +
      "      robots.ts reads its list from there, so the emitted robots.txt cannot\n" +
      "      carry it either.",
  );
}
for (const group of robots.split(/\n\s*\n/)) {
  if (!/^user-agent\s*:/im.test(group)) continue;
  const agent = /^user-agent\s*:\s*(.+)$/im.exec(group)?.[1]?.trim();
  const disallows = [...group.matchAll(/^disallow\s*:\s*(.*)$/gim)].map((m) =>
    m[1].trim(),
  );
  /* A blanket `Disallow: /` already covers the cockpit — that is the
     non-production branch, and it is not a failure. */
  if (disallows.includes("/")) continue;
  if (!disallows.includes(adminDisallow)) {
    failures.push(
      `robots.txt group for ${agent} does not disallow ${adminDisallow}.`,
    );
  }
}

/* ---------------------------------- 3: the corpus cannot describe the cockpit */

/**
 * A source sweep, not a corpus render, and deliberately an over-approximation.
 *
 * `buildAssistantCorpus()` is TypeScript with path aliases, which a .mjs gate on
 * Node 22.16 cannot import. But the corpus is assembled ONLY from src/data/** and
 * content/**, plus the assistant's own modules — so if the admin base path appears
 * nowhere in those trees, no corpus built from them can name it. Over-approximating
 * costs a false positive if someone has a legitimate reason to write "/admin" into
 * a data file; nothing does, and the assertion is worth more than the flexibility.
 */
const CORPUS_TREES = ["src/data", "content", "src/lib/assistant"];
const TEXTUAL = /\.(ts|tsx|mdx|md|json|ya?ml)$/;

function sweep(dir, hits) {
  const abs = join(ROOT, dir);
  let entries;
  try {
    entries = readdirSync(abs, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      sweep(path, hits);
      continue;
    }
    if (!TEXTUAL.test(entry.name)) continue;
    const body = readFileSync(join(ROOT, path), "utf8");
    /* Word-boundaried so "/administration" or "administrator" do not match: the
       /privacy page says a named administrator can read conversations, and that
       sentence is required by §2.3 rather than a leak. */
    if (new RegExp(`${ADMIN_BASE}(?![a-z0-9-])`, "i").test(body)) {
      hits.push(relative(ROOT, join(ROOT, path)));
    }
  }
}

const corpusHits = [];
for (const tree of CORPUS_TREES) sweep(tree, corpusHits);
if (corpusHits.length > 0) {
  failures.push(
    `${corpusHits.length} file(s) in the assistant corpus's source trees name ${ADMIN_BASE}:\n` +
      corpusHits.map((f) => `        ${f}`).join("\n") +
      "\n      The corpus is generated from src/data/** and content/**, so the public\n" +
      "      assistant could describe the admin surface — including where to sign in.",
  );
}

/* ------------------------------------- 5: no published page links to /admin */

const routes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (m) => new URL(m[1]).pathname.replace(/\/$/, "") || "/",
);
const linked = [];
let i = 0;
await Promise.all(
  Array.from({ length: Math.min(8, routes.length) }, async () => {
    while (i < routes.length) {
      const path = routes[i++];
      const html = await fetch(`${BASE}${path}`)
        .then((r) => (r.ok ? r.text() : null))
        .catch(() => null);
      if (!html) continue;
      if (new RegExp(`href="${ADMIN_BASE}(?![a-z0-9-])`, "i").test(html)) {
        linked.push(path);
      }
    }
  }),
);
if (linked.length > 0) {
  failures.push(
    `${linked.length} published page(s) link to ${ADMIN_BASE}: ${linked.sort().join(", ")}.\n` +
      "      A crawler that follows links needs no sitemap entry.",
  );
}

/* ------------------------- 4b, and the anonymous read: what a stranger gets */

for (const route of ROUTES) {
  const res = await fetch(`${BASE}${route}`, { redirect: "manual" }).catch(
    () => null,
  );
  if (!res) {
    failures.push(`No response from ${BASE}${route}.`);
    continue;
  }
  const header = res.headers.get("x-robots-tag") ?? "";
  if (!/noindex/i.test(header)) {
    failures.push(
      `${route} responds ${res.status} without a noindex X-Robots-Tag (got "${header || "none"}").\n` +
        "      robots.txt is a request and a meta tag only exists where a page sets\n" +
        "      one; the header is what covers redirects and every route added later.",
    );
  }

  if (route === `${ADMIN_BASE}/sign-in`) continue;

  /* An anonymous caller must be redirected, not served. 200 with pane content is
     the failure this whole gate is really about. */
  const body = res.status === 200 ? await res.text() : "";
  const servedPane =
    res.status === 200 &&
    /(Sign out|submission\(s\)|conversation\(s\)|case stud)/i.test(body);
  if (servedPane) {
    failures.push(
      `${route} served pane content to an unauthenticated request (HTTP 200).\n` +
        "      Every pane sits under the (cockpit) layout, which redirects to sign-in\n" +
        "      before any child renders or queries. This says it no longer does.",
    );
  }
}

/* ---------------------- 6: no admin secret reaches a client bundle, and the
                             password parameters have not drifted apart */

const passwordTs = readFileSync(join(ROOT, "src/lib/admin/password.ts"), "utf8");
const hashMjs = readFileSync(
  join(ROOT, "scripts/admin-password-hash.mjs"),
  "utf8",
);
for (const constant of ["SCRYPT_COST", "KEY_LENGTH", "PREFIX"]) {
  const a = new RegExp(`const ${constant} = (.+);`).exec(passwordTs)?.[1];
  const b = new RegExp(`const ${constant} = (.+);`).exec(hashMjs)?.[1];
  if (!a || !b || a !== b) {
    failures.push(
      `${constant} differs between src/lib/admin/password.ts (${a ?? "absent"}) and\n` +
        `      scripts/admin-password-hash.mjs (${b ?? "absent"}). The script would\n` +
        "      produce a hash the verifier cannot check, so a correct password would\n" +
        "      be rejected with no clue why.",
    );
  }
}

const SECRET_ENV = [
  "AUTH_SECRET",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD_HASH",
  "ADMIN_GITHUB_TOKEN",
];
const present = SECRET_ENV.filter((k) => (process.env[k] ?? "") !== "");

if (present.length === 0) {
  console.log(
    "  note: no admin secrets are set in this environment, so the client-bundle\n" +
      "  leak assertion cannot run. It is not being skipped silently — run this gate\n" +
      "  with the real environment to exercise it.",
  );
} else {
  const home = await fetch(BASE).then(
    (r) => (r.ok ? r.text() : ""),
    () => "",
  );
  const scripts = [
    ...home.matchAll(/<script[^>]+src="([^"]+)"/g),
    ...home.matchAll(/<link[^>]+rel="modulepreload"[^>]+href="([^"]+)"/g),
  ].map((m) => m[1]);

  /* The homepage's own HTML counts too: an inlined value is a leak whether or not
     it is in a chunk. */
  const bodies = [home];
  for (const src of scripts) {
    const url = src.startsWith("http") ? src : `${BASE}${src}`;
    bodies.push(
      await fetch(url).then(
        (r) => (r.ok ? r.text() : ""),
        () => "",
      ),
    );
  }
  for (const key of present) {
    const value = process.env[key];
    if (bodies.some((b) => b.includes(value))) {
      failures.push(
        `The value of ${key} appears in the homepage's HTML or in one of the ${scripts.length}\n` +
          "      script(s) it loads. An admin secret has reached the browser.",
      );
    }
  }
}

/* ------------------------------------------------------------------ verdict */

if (failures.length > 0) {
  console.error(
    `\ncheck:admin-isolation FAILED with ${failures.length} problem(s):\n`,
  );
  for (const f of failures.sort()) console.error(`  ${f}\n`);
  process.exit(1);
}

console.log(
  `\ncheck:admin-isolation passed\n` +
    `  ${ROUTES.length} admin route(s) read from the app tree: ${ROUTES.join(", ")}\n` +
    `  absent from sitemap.xml (${routes.length} published paths) and from llms.txt\n` +
    `  disallowed as ${adminDisallow} in every robots.txt group, noindex header on every route\n` +
    `  named in no file under ${CORPUS_TREES.join(", ")}, so the assistant corpus cannot describe it\n` +
    `  linked from none of the ${routes.length} published pages\n` +
    `  ${present.length > 0 ? `${present.length} secret value(s) absent from the served client bundle` : "client-bundle check not exercised (no secrets set here)"}\n`,
);
