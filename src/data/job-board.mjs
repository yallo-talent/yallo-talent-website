/**
 * The job board's address, in one place, for the two languages that need it.
 *
 * `.mjs` rather than `.ts` for the same reason `redirects.mjs` is: the redirect
 * table is read by plain Node in `scripts/check-redirects.mjs` and by CI's
 * import probe, neither of which has a TypeScript loader. `src/middleware.ts`
 * already imports that table across the same boundary, so this direction is the
 * established one rather than a new pattern.
 *
 * WHY IT IS A CONSTANT AND NOT FOUR STRINGS. Volcanic hosts the board today.
 * Sumeet's plan, stated 14 Aug 2026, is that it survives until the internal
 * board and candidate portal are built as part of the talent engine, and is
 * superseded then. On that day this file is edited once: the nav, the footer,
 * the homepage punchout and the two legacy redirects all follow. Round 27.1 was
 * spent proving what happens when an address is written out by hand in several
 * places instead, and the footer's private copy of "/jobs" is the evidence.
 *
 * ABSOLUTE, AND DELIBERATELY SO. This application serves the apex and the board
 * keeps the `www` host, ruled by Sumeet on 14 Aug 2026, so a relative "/jobs"
 * resolves into this application, which does not serve that address.
 *
 * @type {string}
 */
export const JOB_BOARD_URL = "https://www.yallo.co/jobs";
