#!/usr/bin/env node
/**
 * check-assistant-grounding — context-round13-chatbot.md §7 item 2: every
 * factual claim in a sampled response traces to a corpus document. Mechanical
 * version of that assertion: every page the assistant CITES in a sampled
 * reply must be a real, published route. A citation to a route that does not
 * exist is the sharpest, cheapest signal of an ungrounded (hallucinated)
 * answer this script can check without re-implementing a fact-checker.
 *
 * The published-route set is read from the live /llms.txt endpoint rather
 * than re-imported from src/lib/published-routes.ts — that module pulls in
 * a long TS import chain with path aliases, which a plain Node script cannot
 * resolve without a bundler, and /llms.txt is already `publishedPaths()`
 * rendered to text (src/app/llms.txt/route.ts), so reading it is reading the
 * same enumeration through its own generated artefact rather than a second
 * copy of it.
 *
 *   ANTHROPIC_API_KEY=... node scripts/check-assistant-grounding.mjs [baseUrl]
 */
const BASE = process.env.BASE_URL ?? process.argv[2] ?? "http://localhost:3213";

const SAMPLE_QUESTIONS = [
  "What do you place for SAP programmes?",
  "Tell me about your retail industry experience.",
  "What engagement models do you offer?",
  "Do you have any published case studies for Oracle programmes?",
  "What AI roles do you place?",
];

/**
 * Matches a site-relative path the model might cite, e.g. "/industries/retail
 * ) — but NOT a mid-word slash such as "S/4HANA", "buying/promotions" or
 * "platform/module", all of which are real corpus vocabulary and were the
 * entire first run's false-positive set. A genuine citation is always
 * preceded by whitespace, an opening paren/quote, or the start of the
 * string; a conjunction or product-name slash is preceded by a letter.
 */
const PATH_PATTERN = /(?<=^|[\s("'])\/[a-z][a-z0-9/-]*/g;

async function fetchPublishedPaths() {
  const res = await fetch(`${BASE}/llms.txt`);
  if (!res.ok) {
    throw new Error(`/llms.txt returned ${res.status} — is the server running the current build?`);
  }
  const text = await res.text();
  const paths = new Set();
  for (const match of text.matchAll(/\]\(([^)]+)\)/g)) {
    try {
      paths.add(new URL(match[1]).pathname);
    } catch {
      // not a URL — skip
    }
  }
  return paths;
}

async function askOnce(prompt) {
  const res = await fetch(`${BASE}/api/assistant/chat`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", content: prompt }],
      transcriptId: `grounding-suite-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    }),
  });
  return res.json();
}

async function main() {
  const published = await fetchPublishedPaths();
  const failures = [];
  let citationsChecked = 0;

  for (const prompt of SAMPLE_QUESTIONS) {
    const body = await askOnce(prompt);
    if (!body.ok || body.reply?.type !== "text") {
      failures.push({ prompt, reason: "no text reply to check" });
      continue;
    }
    const text = body.reply.text;
    const candidates = [...new Set(text.match(PATH_PATTERN) ?? [])];
    // Only judge candidates that look like a real route (2+ chars, no file
    // extension) — this filters stray slashes in prose ("either/or") without
    // needing a stricter grammar.
    const looksLikeRoute = candidates.filter((c) => c.length > 1 && !c.includes("."));

    if (looksLikeRoute.length === 0) {
      failures.push({ prompt, reason: "reply cited no page at all", text });
      continue;
    }

    for (const path of looksLikeRoute) {
      citationsChecked += 1;
      if (!published.has(path)) {
        failures.push({
          prompt,
          reason: `cited "${path}", which is not a published route`,
          text,
        });
      }
    }
  }

  if (failures.length) {
    console.error(`\n${failures.length} grounding failure(s):\n`);
    for (const f of failures) {
      console.error(`  [${f.prompt}] ${f.reason}`);
    }
    process.exit(1);
  }

  console.log(
    `${citationsChecked} citation(s) across ${SAMPLE_QUESTIONS.length} sample question(s), all resolved to real published routes.`,
  );
}

main().catch((err) => {
  console.error("check-assistant-grounding crashed:", err);
  process.exit(1);
});
