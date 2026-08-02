/**
 * check-case-study-excerpts — the excerpt rule, gated (context-round7-rulings.md §5.5).
 *
 * WHY THIS EXISTS. Canon §8: an excerpt is compression of the body, never a new
 * fact. Once a case study has a full article, the risk is not that the card
 * lies outright but that it names a client, platform or figure the article
 * itself never mentions — content added at the summary layer that the reader
 * can never verify against the body it claims to compress. That defect is
 * exactly what a heading-completeness or a duplicate-content check cannot see,
 * because the summary field is syntactically valid and the body is real; the
 * two just do not agree.
 *
 * THE CHEAP GATE. Every proper noun in `summary` and `excerpt` must appear
 * somewhere in the body. "Proper noun" here is mechanical, not linguistic: a
 * maximal run of capitalised words, skipping a short list of capitalised
 * function words that only mark a sentence's start (The, A, An, ...) so this
 * does not fail on ordinary prose. A single capitalised word that is not a
 * stopword still counts — "Wipro", "MAF" and "Chalhoub" are each one token,
 * and are exactly the kind of unverifiable client name this gate exists to
 * catch. Comparison is case-insensitive and whitespace-normalised so it
 * survives typographic quote differences, not exact-byte matching.
 *
 * `--selftest` proves the gate can fail without touching real content: it runs
 * the same check function against an in-memory fixture carrying a summary
 * that names a client the fixture's body never mentions, and asserts the gate
 * catches it. Run this before trusting the gate against the real corpus.
 *
 * Usage: node scripts/check-case-study-excerpts.mjs [--selftest]
 */

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";

const DIR = join(process.cwd(), "content", "case-studies");

const STOPWORDS = new Set([
  "The",
  "A",
  "An",
  "This",
  "That",
  "These",
  "Those",
  "It",
  "Its",
  "With",
  "As",
  "To",
  "For",
  "In",
  "On",
  "At",
  "By",
  "From",
  "And",
  "Or",
  "But",
  "When",
  "While",
  "Where",
  "Because",
  "Since",
  "After",
  "Before",
  "During",
  "Through",
  "Yallo",
]);

/* Word chars deliberately exclude "-" and ".": a hyphenated compound modifier
   ("UK-remote", "Paris-run") is one authored word joined to a plain adjective,
   not a two-word proper noun, and matching the whole compound made the gate
   fail on "UK" and "Paris" merely because the body phrases the same fact
   without the hyphen. Including "." caused a worse bug: "Business Analysts."
   consumed the full stop as a word character, so the following "\s+[A-Z]"
   kept matching straight into the next sentence's capitalised opening word. */
const PHRASE_RE = /\b[A-Z][A-Za-z&'’]*(?:\s+[A-Z][A-Za-z&'’]*)*/g;

function normalise(text) {
  return text.replace(/[’']/g, "'").replace(/\s+/g, " ").trim().toLowerCase();
}

/** A phrase's possessive form ("Alshaya's") passes if the bare name does. */
function stripPossessive(phrase) {
  return phrase.replace(/'s$/i, "");
}

/** Strip leading stopwords off a matched run so "The Chalhoub Group" -> "Chalhoub Group". */
function trimLeadingStopwords(phrase) {
  const words = phrase.split(/\s+/);
  while (words.length > 1 && STOPWORDS.has(words[0])) words.shift();
  if (words.length === 1 && STOPWORDS.has(words[0])) return null;
  return words.join(" ");
}

function properNounPhrases(text) {
  const matches = text.match(PHRASE_RE) ?? [];
  const phrases = matches
    .map(trimLeadingStopwords)
    .filter((p) => p !== null && p.length > 1);
  return [...new Set(phrases)];
}

/**
 * Returns the list of phrases from `summary`/`excerpt` that do not appear in
 * `body`. Pure function so `--selftest` can call it directly on a fixture.
 */
export function findUnverifiedPhrases({ summary, excerpt, body }) {
  const bodyNorm = normalise(body);
  const candidates = [
    ...properNounPhrases(summary ?? ""),
    ...properNounPhrases(excerpt ?? ""),
  ];
  return [...new Set(candidates)].filter((phrase) => {
    if (bodyNorm.includes(normalise(phrase))) return false;
    const bare = stripPossessive(phrase);
    return bare === phrase || !bodyNorm.includes(normalise(bare));
  });
}

function runSelfTest() {
  const fixture = {
    summary:
      "Al Tayer Group needed niche SAP consultants fast for their transformation.",
    excerpt:
      "Landmark Group brought in Yallo to cover the same SAP gap within weeks.",
    body: "The client needed niche SAP consultants fast for its transformation, and Yallo delivered within weeks.",
  };
  const found = findUnverifiedPhrases(fixture);
  const expectFailOn = "Landmark Group";
  if (!found.includes(expectFailOn)) {
    console.error(
      `check-case-study-excerpts --selftest FAILED: expected to catch "${expectFailOn}" (present in excerpt, absent from body) but did not. Found: ${JSON.stringify(found)}`,
    );
    process.exit(1);
  }
  console.log(
    `check-case-study-excerpts --selftest passed: correctly failed on "${expectFailOn}", a client the fixture's excerpt names and its body never mentions.`,
  );
}

function runAgainstContent() {
  const files = readdirSync(DIR).filter((n) => n.endsWith(".mdx"));
  const failures = [];

  for (const name of files) {
    const raw = readFileSync(join(DIR, name), "utf8");
    const { data, content } = matter(raw);
    const unverified = findUnverifiedPhrases({
      summary: data.summary,
      excerpt: data.excerpt,
      body: content,
    });
    if (unverified.length > 0) {
      failures.push({ file: name, phrases: unverified });
    }
  }

  if (failures.length > 0) {
    console.error(
      `check-case-study-excerpts: ${failures.length} case stud${failures.length === 1 ? "y" : "ies"} name something in summary/excerpt that never appears in the body.\n`,
    );
    for (const f of failures) {
      console.error(`  ${f.file}`);
      for (const p of f.phrases) console.error(`    - "${p}"`);
    }
    process.exit(1);
  }

  console.log(
    `check-case-study-excerpts: ${files.length} case studies checked, every proper noun in summary/excerpt is verifiable against the body.`,
  );
}

if (process.argv.includes("--selftest")) {
  runSelfTest();
} else {
  runAgainstContent();
}
