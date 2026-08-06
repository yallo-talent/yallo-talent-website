#!/usr/bin/env node
/**
 * check-assistant-terms — context-round13-chatbot.md §7 item 3: terminology
 * governs generated output, not only authored copy.
 *
 * DUPLICATION, NAMED RATHER THAN HIDDEN: the canonical banned-vocabulary
 * source is scripts/check-terminology.mjs's RULES/ABSTRACTIONS arrays. That
 * file is an existing scripts/** file — session A's territory per
 * context-round13-scope.md §3, never edited from this session — and it is
 * also written as a source-tree sweep with its own file-rewriting side
 * effects (readFileSync/writeFileSync over src/ and content/), not as an
 * importable module with an exported constant. Re-running it against live
 * model output isn't possible without either editing it to export its lists
 * or executing its top-level sweep (which calls process.exit(1) itself, so
 * importing it inside another gate would kill that gate's own process).
 *
 * So this file holds its own copy of the small, high-value subset that
 * matters for generated conversational text — logged here, not silently
 * duplicated: a future round should extract RULES/ABSTRACTIONS into an
 * importable src/lib/terminology.ts that both check-terminology.mjs and
 * this file import, closing the duplication properly. That edit needs
 * scripts/check-terminology.mjs to change, which is out of this session's
 * territory — see docs/relay/v21-B.md.
 */
const BASE = process.env.BASE_URL ?? process.argv[2] ?? "http://localhost:3213";

const BANNED_TERMS = [
  [/\bGCC\b/, "GCC (ambiguous with Global Capability Centre — say Middle East)"],
  [/\bKSA\b/, "KSA (say Saudi Arabia)"],
  [/\bsubcontract(ing)?\b/i, "subcontract(ing) (the pillar is Managed Delivery)"],
  [/\bBangalore\b/, "Bangalore (say Bengaluru)"],
  [/\bUK · ME · India\b/, "UK · ME · India framing (Middle East leads)"],
  [/—/, "em dash"],
];

const SAMPLE_QUESTIONS = [
  "What markets do you operate in?",
  "Tell me about your Managed Delivery offering.",
  "What's your take on hiring in the Gulf?",
];

async function askOnce(prompt) {
  const res = await fetch(`${BASE}/api/assistant/chat`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", content: prompt }],
      transcriptId: `terms-suite-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    }),
  });
  return res.json();
}

async function main() {
  const failures = [];
  /* Counted, not assumed. The success line used to report
     SAMPLE_QUESTIONS.length regardless of how many replies were actually
     examined, which is how it once printed "3 sampled generated replies"
     clean when all three were the 502 error string. */
  let inspected = 0;

  for (const prompt of SAMPLE_QUESTIONS) {
    const body = await askOnce(prompt);

    /* ROUND 16, context-round16-scope.md §2.6. This was `continue`, so a run
       that never reached the model skipped every assertion and then reported
       success. A gate that asserts a clean result about output it never saw
       is worse than a missing gate: the missing one is at least visible.
       An unusable reply now FAILS. It does not warn and it does not skip. */
    if (!body.ok || body.reply?.type !== "text") {
      failures.push({
        prompt,
        label: `no usable reply to assert on (ok=${body.ok}, type=${body.reply?.type ?? "none"})${body.error ? `, error: ${body.error}` : ""}`,
        text: JSON.stringify(body).slice(0, 200),
      });
      continue;
    }

    inspected += 1;
    const text = body.reply.text;
    for (const [pattern, label] of BANNED_TERMS) {
      if (pattern.test(text)) {
        failures.push({ prompt, label, text });
      }
    }
  }

  if (failures.length) {
    console.error(
      `\n${failures.length} terminology failure(s) in generated output:\n`,
    );
    for (const f of failures) {
      console.error(`  [${f.prompt}] ${f.label}\n    ${f.text.slice(0, 150)}`);
    }
    process.exit(1);
  }

  console.log(
    `No banned terminology in ${inspected} of ${SAMPLE_QUESTIONS.length} sampled generated replies, all of which reached the model.`,
  );
}

main().catch((err) => {
  console.error("check-assistant-terms crashed:", err);
  process.exit(1);
});
