#!/usr/bin/env node
/**
 * check-assistant-links — every link the assistant RENDERS goes somewhere real.
 *
 * WHY THIS EXISTS AND WHY check-assistant-grounding DID NOT COVER IT, round 19
 * §3.2. Sumeet clicked a link in a live conversation on 7 August and the whole
 * page navigated to a 404, taking the panel's conversation state with it.
 * check-assistant-grounding was green on 30 citations the same round.
 *
 * Both were true, because they were about different strings. The grounding gate
 * extracts path TOKENS from the reply text and checks each against the published
 * set. The token it extracted was `/managed-delivery`, which is published, so it
 * passed. What the browser actually received was
 * `<a href="[Managed Delivery](/managed-delivery">` — because `linkifyCitations`
 * re-wrapped a path the model had ALREADY put inside a markdown link, and the
 * renderer's link pattern then took the first `)` as the end of the target. The
 * gate was asserting something true about a string nobody renders.
 *
 * So this gate asserts the HREF, which is the thing a visitor clicks:
 *
 *   PART A — the published set is routable at all. Every path /llms.txt
 *     enumerates must return 200. `buildAssistantCorpus()` filters itself to
 *     `publishedPaths()` twice over, so a corpus path is always a member of this
 *     set: prove the set and no unroutable path can enter the corpus. This is
 *     the half check-assistant-grounding structurally cannot see, because it
 *     compares the reply against that same enumeration rather than against the
 *     route table, so an enumeration that lists a dead route agrees with itself.
 *
 *   PART B — every href in a live reply resolves. Real questions, real model,
 *     hrefs extracted with renderAssistantText.tsx's OWN patterns, each fetched.
 *     Not fixture conversations: fixtures are what made the last gate blind.
 *
 * PROVING IT RED. `ASSISTANT_SELF_TEST_MARKDOWN_CITE=true` makes the system
 * prompt ask the model to cite in markdown link syntax, which is what it does
 * unprompted anyway and what the mangling needs as its input. Run this gate with
 * that set and `linkifyCitations` reverted to its pre-round-19 one-line replace,
 * and Part B goes red on the real defect through the real path. Round 19 did
 * exactly that before trusting it; the transcript is in docs/relay/v27.md.
 *
 *   ANTHROPIC_API_KEY=... node scripts/check-assistant-links.mjs [baseUrl]
 */
import { readFileSync } from "node:fs";

const BASE = process.env.BASE_URL ?? process.argv[2] ?? "http://localhost:3115";

/**
 * Copied from src/components/assistant/renderAssistantText.tsx, deliberately and
 * with a guard. A gate that re-implements the renderer loosely is how the last
 * one came to pass on a string the renderer never produces, so these have to be
 * the renderer's patterns and nothing near them. The existing check-assistant-*
 * gates are plain Node scripts that do not resolve the `@/` path alias, so
 * nothing under scripts/ imports src/ today; `assertPatternsStillMatchSource()`
 * below is what stops the copy drifting silently instead.
 */
const INLINE = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
const LINK = /^\[([^\]]+)\]\(([^)]+)\)$/;

const RENDERER = "src/components/assistant/renderAssistantText.tsx";

function assertPatternsStillMatchSource(failures) {
  const src = readFileSync(new URL(`../${RENDERER}`, import.meta.url), "utf8");
  for (const [name, re] of [
    ["INLINE", INLINE],
    ["LINK", LINK],
  ]) {
    const declared = new RegExp(`const ${name} = (/.*/[a-z]*);`).exec(src)?.[1];
    if (declared !== re.toString()) {
      failures.push(
        `${name} in this gate is ${re} but ${RENDERER} declares ${declared ?? "no such constant"}.\n` +
          "      This gate extracts hrefs the way the renderer does. The moment the two\n" +
          "      differ it is checking a string the browser never receives, which is the\n" +
          "      exact failure it was written to end.",
      );
    }
  }
}

/** Every href renderAssistantText would draw from this reply text. */
function renderedHrefs(text) {
  const hrefs = [];
  for (const block of text.trim().split(/\n\s*\n/)) {
    for (const part of block.split(INLINE)) {
      const m = part.match(LINK);
      if (m) hrefs.push(m[2]);
    }
  }
  return hrefs;
}

/**
 * Real client questions, chosen to pull citations out of different corpus
 * families rather than to be easy to pass. Not a fixture conversation: the model
 * answers each one fresh.
 */
const SAMPLE_QUESTIONS = [
  "Which page explains your Managed Delivery model?",
  "Where can I read about your retail sector work?",
  "Point me at the page covering SAP contractors.",
  "What does your research say about the Middle East market? Link me the piece.",
  "Who leads delivery at Yallo, and where can I read about the team?",
];

async function askOnce(prompt) {
  const res = await fetch(`${BASE}/api/assistant/chat`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", content: prompt }],
      transcriptId: `links-suite-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    }),
  });
  return res.json();
}

async function main() {
  const failures = [];
  assertPatternsStillMatchSource(failures);

  /* ------------------------------------ PART A: the published set is routable */

  const llms = await fetch(`${BASE}/llms.txt`);
  if (!llms.ok) {
    console.error(
      `\n/llms.txt returned ${llms.status}. That file is publishedPaths() rendered to\n` +
        "text, so without it this gate has no route set to prove. Is the server running\n" +
        "the current build?\n",
    );
    process.exit(1);
  }
  const publishedPaths = [
    ...new Set(
      [...(await llms.text()).matchAll(/\]\(([^)]+)\)/g)]
        .map((m) => {
          try {
            return new URL(m[1]).pathname;
          } catch {
            return null;
          }
        })
        .filter(Boolean),
    ),
  ];
  if (publishedPaths.length < 20) {
    failures.push(
      `Only ${publishedPaths.length} published path(s) parsed out of /llms.txt. This gate\n` +
        "      would then be proving almost nothing and reporting it as clean.",
    );
  }

  const published = new Set(publishedPaths);
  const unroutable = [];
  for (const path of publishedPaths) {
    const res = await fetch(`${BASE}${path}`, { redirect: "manual" }).catch(
      () => null,
    );
    if (res?.status !== 200) unroutable.push([path, res ? res.status : "no response"]);
  }
  if (unroutable.length > 0) {
    failures.push(
      `${unroutable.length} published path(s) do not serve a page:\n` +
        unroutable.map(([p, s]) => `        ${s}  ${p}`).join("\n") +
        "\n      The assistant's corpus is filtered to this same set, so each of these is a\n" +
        "      page the assistant can cite and a visitor cannot reach.",
    );
  }

  /* ---------------------------------- PART B: every rendered href resolves */

  let hrefsChecked = 0;
  const repliesWithNoLink = [];
  for (const prompt of SAMPLE_QUESTIONS) {
    const body = await askOnce(prompt);
    if (!body.ok || body.reply?.type !== "text") {
      failures.push({
        toString: () => `[${prompt}] no text reply to check.`,
      });
      continue;
    }
    const hrefs = renderedHrefs(body.reply.text);
    if (hrefs.length === 0) {
      repliesWithNoLink.push(prompt);
      continue;
    }
    for (const href of hrefs) {
      hrefsChecked += 1;
      /* A rendered href must be a site-relative path in the published set. The
         membership test catches a mangled target before the fetch does, and
         reports the mangling rather than a bare 404. */
      if (!published.has(href)) {
        failures.push(
          `[${prompt}] would render <a href="${href}">, which is not a published route.\n` +
            `      Reply text: ${JSON.stringify(body.reply.text.slice(0, 400))}`,
        );
        continue;
      }
      const res = await fetch(`${BASE}${href}`, { redirect: "manual" }).catch(
        () => null,
      );
      if (res?.status !== 200) {
        failures.push(
          `[${prompt}] would render <a href="${href}">, which returns ${res ? res.status : "no response"}.`,
        );
      }
    }
  }

  /* Every reply citing nothing is the "gate narrowed itself to nothing" case the
     grounding gate already guards against, and it belongs here too: a suite that
     produced no links at all would otherwise report clean. */
  if (repliesWithNoLink.length === SAMPLE_QUESTIONS.length) {
    failures.push(
      `None of the ${SAMPLE_QUESTIONS.length} sample replies rendered a single link, so Part B\n` +
        "      asserted nothing. Every question above asks the assistant to point at a page.",
    );
  }

  if (failures.length > 0) {
    console.error(`\ncheck:assistant-links FAILED with ${failures.length} problem(s):\n`);
    for (const f of failures) console.error(`  ${f}\n`);
    process.exit(1);
  }

  console.log(
    `\ncheck:assistant-links passed\n` +
      `  ${publishedPaths.length} published path(s) from /llms.txt, every one serving 200\n` +
      `  ${hrefsChecked} rendered href(s) across ${SAMPLE_QUESTIONS.length - repliesWithNoLink.length} of ${SAMPLE_QUESTIONS.length} live replies, every one a published route serving 200\n` +
      `  link patterns still identical to ${RENDERER}\n`,
  );
}

main().catch((err) => {
  console.error("check-assistant-links crashed:", err);
  process.exit(1);
});
