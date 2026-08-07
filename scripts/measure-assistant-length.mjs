#!/usr/bin/env node
/**
 * measure-assistant-length — what the assistant's replies actually measure.
 *
 *   ANTHROPIC_API_KEY=... node scripts/measure-assistant-length.mjs [baseUrl]
 *
 * WHY THIS IS A MEASUREMENT AND NOT A GATE. Round 19 replaced a verbose
 * assistant with a flat brevity rule — "two to four sentences" — and round 21
 * §3.2 records the result: replies are now too thin for substantive questions.
 * Both the old rule and the overcorrection were set without anyone measuring
 * the distribution, which is how a fix lands on the opposite side of the same
 * problem.
 *
 * So this reports rather than judges. A pass/fail on reply length would be the
 * flat rule again in a different file: the ruling is that length should track
 * what the question needs, and no single number expresses that. What it gives
 * is the distribution across two deliberately different sets, which is the
 * shape a calibration has to be argued from.
 *
 *   SHORT — round 19's five link-shaped questions. A pointer question wants a
 *     sentence and a link. These should stay short.
 *   COMPLEX — a screening-process question and a multi-market comparison, per
 *     §3.2. These are the ones the flat rule was truncating.
 *
 * A calibrated assistant separates the two. A flat rule does not, in either
 * direction: verbose answers everything at length, brief answers everything
 * thinly, and only the gap between the two sets shows which one is running.
 */

const BASE = process.env.BASE_URL ?? process.argv[2] ?? "http://localhost:3115";

/** Round 19's five, copied from check-assistant-links.mjs's own set. */
const SHORT = [
  "Which page explains your Managed Delivery model?",
  "Where can I read about your retail sector work?",
  "Point me at the page covering SAP contractors.",
  "What does your research say about the Middle East market? Link me the piece.",
  "Who leads delivery at Yallo, and where can I read about the team?",
];

/** The two §3.2 names: a screening question and a multi-market comparison. */
const COMPLEX = [
  "How does your screening process actually work? Walk me through what happens between my brief and a shortlist, and what a specialist screener checks that a generalist recruiter would not.",
  "We are running an Oracle finance programme in Riyadh and a Salesforce commerce programme in London at the same time. How do the UK, Saudi and UAE markets compare for those two, and what does that mean for how we staff each one?",
];

async function ask(prompt) {
  const res = await fetch(`${BASE}/api/assistant/chat`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", content: prompt }],
      transcriptId: `length-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    }),
  });
  const body = await res.json();
  if (!body.ok || body.reply?.type !== "text") return null;
  return body.reply.text;
}

/** Sentences, counted the way a reader would: terminal punctuation and lines. */
function sentences(text) {
  const stripped = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  const bullets = stripped
    .split("\n")
    .filter((l) => /^\s*[-*\d]/.test(l)).length;
  const prose = stripped
    .split("\n")
    .filter((l) => !/^\s*[-*\d]/.test(l))
    .join(" ")
    .split(/[.!?]+(?:\s|$)/)
    .map((s) => s.trim())
    .filter(Boolean).length;
  return { prose, bullets, total: prose + bullets };
}

async function run(label, prompts) {
  const rows = [];
  for (const prompt of prompts) {
    const text = await ask(prompt);
    if (text === null) {
      rows.push({ prompt, error: true });
      continue;
    }
    const s = sentences(text);
    rows.push({
      prompt,
      words: text.split(/\s+/).filter(Boolean).length,
      chars: text.length,
      ...s,
    });
  }

  console.log(`\n${label}`);
  console.log("".padEnd(label.length, "="));
  for (const r of rows) {
    if (r.error) {
      console.log(`  [no reply]  ${r.prompt.slice(0, 64)}`);
      continue;
    }
    console.log(
      `  ${String(r.words).padStart(4)} words  ${String(r.total).padStart(2)} sentence(s)` +
        `${r.bullets ? ` (${r.bullets} bulleted)` : ""}  ${r.prompt.slice(0, 58)}`,
    );
  }
  const ok = rows.filter((r) => !r.error);
  if (ok.length === 0) return null;
  const words = ok.map((r) => r.words).sort((a, b) => a - b);
  const sent = ok.map((r) => r.total).sort((a, b) => a - b);
  const mean = (a) => Math.round(a.reduce((x, y) => x + y, 0) / a.length);
  const summary = {
    label,
    n: ok.length,
    wordsMin: words[0],
    wordsMean: mean(words),
    wordsMax: words[words.length - 1],
    sentMin: sent[0],
    sentMean: mean(sent),
    sentMax: sent[sent.length - 1],
  };
  console.log(
    `  -> words ${summary.wordsMin}-${summary.wordsMax} (mean ${summary.wordsMean}), ` +
      `sentences ${summary.sentMin}-${summary.sentMax} (mean ${summary.sentMean})`,
  );
  return summary;
}

const a = await run("SHORT — round 19's five pointer questions", SHORT);
const b = await run("COMPLEX — screening process, multi-market comparison", COMPLEX);

if (a && b) {
  console.log(
    `\nSeparation: complex replies run ${(b.wordsMean / a.wordsMean).toFixed(1)}x the ` +
      `words of pointer replies (${a.wordsMean} -> ${b.wordsMean}).`,
  );
  console.log(
    "A flat rule shows no separation in either direction. Calibration is the gap.",
  );
}
