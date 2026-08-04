/**
 * check-nav-promise — a nav card's promise must be consistent with the page
 * behind it.
 *
 * WHY THIS EXISTS. The Intelligence group's featured card promised
 * "Compensation windows, availability signals and hiring notes" while
 * pointing at a hub that publishes none of that — the LTI/Blueprint evidence
 * base holds no compensation data of any kind
 * (context-round14-research.md §1), so no page behind any card could ever
 * have kept that promise. `check:yallo-case` proves every href resolves and
 * `check:no-redirects` proves there is no hop; neither checks whether the
 * card's own words are true. round13-scope.md §4.2 / context-round13-chatbot
 * .md §8a.
 *
 * SCOPE, "at minimum". A full promise-vs-destination comparison would need
 * to read the target page's own content and is a larger exercise; this gate
 * asserts the narrower, mechanical half — that no NavFeatured or NavItem
 * copy in nav-config.ts contains the vocabulary the site's own evidence base
 * can never back, on any route, per scripts/lib/compensation-terms.mjs.
 *
 * Text-based rather than a TypeScript import, matching check-taxonomy.mjs:
 * there is no ts-node/tsx in this repo, and adding one for a single lint
 * would be new infrastructure for a check that only needs to read strings.
 */
import { readFileSync } from "node:fs";
import { COMPENSATION_BANNED_TERMS } from "./lib/compensation-terms.mjs";

const NAV_CONFIG_FILE = "src/components/layout/nav-config.ts";

/** Fields that carry hand-written nav-card prose in this file. Derived
 * columns (capabilities, sectors, platforms) pull their labels from their
 * own data indices, not from string literals here, so they are out of this
 * gate's reach by construction rather than by exclusion. */
const PROSE_FIELDS = ["eyebrow", "title", "copy", "ctaLabel", "label", "description"];

const FIELD_RE = new RegExp(`\\b(${PROSE_FIELDS.join("|")}):\\s*(?:"([^"]*)"|\`([^\`]*)\`)`);

const source = readFileSync(NAV_CONFIG_FILE, "utf8");
const lines = source.split("\n");

const failures = [];
lines.forEach((line, i) => {
  const m = line.match(FIELD_RE);
  if (!m) return;
  const text = m[2] ?? m[3] ?? "";
  for (const [re, label] of COMPENSATION_BANNED_TERMS) {
    if (re.test(text)) {
      failures.push({
        line: i + 1,
        field: m[1],
        label,
        text: text.trim().slice(0, 120),
      });
    }
  }
});

if (failures.length) {
  console.error(
    `${failures.length} nav-card promise violation(s) in ${NAV_CONFIG_FILE}:\n`,
  );
  for (const f of failures) {
    console.error(
      `  line ${f.line}  [${f.field}: ${f.label}]  "${f.text}"`,
    );
  }
  process.exit(1);
}

console.log(`Nav-card promises clean: no NavFeatured/NavItem copy in ${NAV_CONFIG_FILE} carries banned vocabulary.`);
