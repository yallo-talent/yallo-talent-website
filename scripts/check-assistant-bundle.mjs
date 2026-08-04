#!/usr/bin/env node
/**
 * check-assistant-bundle — context-round13-chatbot.md §7 item 4: the
 * assistant contributes nothing to the initial payload on any route. Fails
 * the build if it does.
 *
 * Black-box rather than manifest-reading: fetches each sampled route's HTML
 * from a PRODUCTION server (`next start`, not `next dev` — dev serves
 * unbundled modules and would make this assertion meaningless), extracts
 * every synchronously-loaded <script src> and modulepreload link, fetches
 * each of those files, and greps for a marker string unique to the
 * assistant's client bundle. The marker must not appear in anything the
 * route loads eagerly; it may appear only in a file reachable exclusively
 * through the deferred dynamic import.
 *
 *   node scripts/check-assistant-bundle.mjs [baseUrl]
 *
 * ROUTES here is a small representative sample, the same shape check-a11y.mjs
 * uses, not the full route tree — a bundle-composition property does not
 * vary route to route the way rendered content does, and re-fetching every
 * page's JS graph for every one of ~70 published paths would cost far more
 * than it proves.
 */
const BASE = process.env.BASE_URL ?? process.argv[2] ?? "http://localhost:3213";

const ROUTES = ["/", "/ai-talent", "/platforms/microsoft", "/contract", "/case-studies", "/industries/retail"];

/**
 * Unique enough not to appear in unrelated code by accident, and — this
 * matters — actually compiled into the CLIENT bundle. The first version of
 * this gate used "submit_brief", the tool name defined in
 * src/lib/assistant/client.ts, which is server-only code the chat API route
 * imports; it can never reach a client chunk deferred or not, so that
 * version could not have failed no matter how the mount was wired. Proven
 * by self-test: breaking the deferred mount into a plain synchronous import
 * left the old marker's assertion passing regardless. The launcher's own
 * button copy is real client-component JSX text and compiles to a literal
 * string in its chunk, which is what a "did this ship in the initial
 * payload" check actually needs to grep for.
 */
const MARKER = "Ask Yallo Talent";

function extractScriptUrls(html, base) {
  const urls = new Set();
  for (const match of html.matchAll(/<script[^>]+src="([^"]+)"/g)) {
    urls.add(new URL(match[1], base).toString());
  }
  for (const match of html.matchAll(/<link[^>]+rel="modulepreload"[^>]+href="([^"]+)"/g)) {
    urls.add(new URL(match[1], base).toString());
  }
  return [...urls];
}

async function main() {
  const failures = [];

  for (const route of ROUTES) {
    const pageRes = await fetch(`${BASE}${route}`);
    if (!pageRes.ok) {
      failures.push({ route, reason: `page returned ${pageRes.status}` });
      continue;
    }
    const html = await pageRes.text();
    const scriptUrls = extractScriptUrls(html, BASE);

    if (scriptUrls.length === 0) {
      failures.push({ route, reason: "no scripts found — check the build is production (next start)" });
      continue;
    }

    for (const url of scriptUrls) {
      const res = await fetch(url);
      if (!res.ok) continue;
      const body = await res.text();
      if (body.includes(MARKER)) {
        failures.push({
          route,
          reason: `initial script ${url} contains the assistant marker "${MARKER}" — it is not deferred`,
        });
      }
    }
  }

  if (failures.length) {
    console.error(`\n${failures.length} bundle failure(s):\n`);
    for (const f of failures) console.error(`  ${f.route}: ${f.reason}`);
    process.exit(1);
  }

  console.log(
    `The assistant contributes nothing to the initial payload on ${ROUTES.length} sampled routes.`,
  );
}

main().catch((err) => {
  console.error("check-assistant-bundle crashed:", err);
  process.exit(1);
});
