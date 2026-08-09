#!/usr/bin/env node
/**
 * The ratified `/privacy` sentence says "up to twelve months". This asserts the
 * site still keeps conversations for twelve months.
 *
 * WHY A GATE AND NOT A DERIVATION. Round 15 derived every retention sentence
 * from `src/lib/assistant/retention.json`, because round 14's two sessions each
 * held one true half and the merge published a denial of a store that existed.
 * That mechanism is right and it still runs. But canon A4's replacement clause
 * is RATIFIED WORDING, and wording that is ratified cannot be assembled from a
 * template without ceasing to be the wording that was ratified. So the sentence
 * carries the number as a literal and this gate carries the invariant instead.
 *
 * WHAT IT MEANS WHEN THIS FAILS. Somebody changed the retention window and the
 * published privacy notice is now false. The fix is NOT to edit the sentence —
 * it is ratified, and a session that rewords it has changed a legal page on its
 * own authority. The fix is to take the new window to Sumeet and re-ratify.
 * The message says so, because a gate that fails without saying who can clear
 * it is a gate somebody silences.
 *
 * Run: node scripts/check-privacy-retention.mjs
 */
import { readFileSync } from "node:fs";

const RETENTION_JSON = "src/lib/assistant/retention.json";
const PRIVACY_PAGE = "src/app/privacy/page.tsx";

/** The one number the ratified sentence commits us to. */
const RATIFIED_MONTHS = 12;
const RATIFIED_PHRASE = "stored for up to twelve months";

const failures = [];

const retention = JSON.parse(readFileSync(RETENTION_JSON, "utf8"));
const days = retention.transcriptRetentionDays;
/* 30.437 is the mean Gregorian month, and it is the same conversion
   src/lib/assistant/retention.ts uses. Two conversions would be two answers. */
const months = Math.round(days / 30.437);

if (months !== RATIFIED_MONTHS) {
  failures.push(
    `${RETENTION_JSON} keeps transcripts for ${days} days, which is ${months} months.\n` +
      `  The ratified /privacy sentence says "up to twelve months", so the published notice is now FALSE.\n` +
      `  Do not edit the sentence to match: canon A4 ratified it and only Sumeet can re-ratify it.\n` +
      `  Either restore a twelve-month window or take the new one to him.`,
  );
}

const page = readFileSync(PRIVACY_PAGE, "utf8");
if (!page.includes(RATIFIED_PHRASE)) {
  failures.push(
    `${PRIVACY_PAGE} no longer carries the ratified phrase "${RATIFIED_PHRASE}".\n` +
      `  Canon A4 publishes that sentence verbatim. If it has been reworded, it has been\n` +
      `  changed on a session's own authority, which R-A9 does not permit for published copy.`,
  );
}

if (failures.length > 0) {
  console.error(`\n${failures.length} privacy-retention failure(s):`);
  for (const f of failures) console.error(`\n  ${f}`);
  process.exit(1);
}

console.log(
  `Privacy retention clean: ${days} days resolves to ${months} months, and /privacy carries the ratified sentence.`,
);
