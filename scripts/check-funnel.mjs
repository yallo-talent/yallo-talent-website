#!/usr/bin/env node
/**
 * The funnel actually works, asserted by using it — round 26 item B.
 *
 * WHY A GATE AND NOT A SCREENSHOT. Every clause of cockpit-v3 §11 is a
 * behaviour rather than an appearance: a lead moves through the pipeline in one
 * click, an owner sticks, the filters survive the write, the SLA clock counts
 * against the published commitment, and the export is the view on screen. A
 * picture proves none of that, and a write path nobody has watched writing is a
 * write path nobody has any reason to believe in.
 *
 * IT CREATES AND REMOVES ITS OWN FIXTURE. One submission row, one sidecar row,
 * one account, all gone before it exits including when an assertion fails.
 *
 * THE FIXTURE IS NOT A LEAD AND CANNOT BE MISTAKEN FOR ONE. Its endpoint is
 * `ci-fixture`, which is none of the three the site's forms write, so it is
 * excluded from every real view by its own value; its address is at
 * `yallo.invalid`, a TLD that cannot resolve, the same convention the account
 * fixtures use. Round 26 §5 forbids invented example leads and this is not one:
 * it is self-describing test data that says what it is in every field.
 *
 * `submissions` IS NOT ALTERED. The row is inserted and deleted; no existing
 * row is read for anything but a count, and none is written.
 *
 * Run against a `next start` server:
 *   DATABASE_URL=... node scripts/check-funnel.mjs http://localhost:3115
 */

import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";
import { chromium } from "@playwright/test";
import { signInTo } from "./lib/admin-sign-in.mjs";

const BASE = process.argv[2] ?? "http://localhost:3115";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set, so the funnel was never exercised.");
  process.exit(1);
}
const sql = neon(process.env.DATABASE_URL);

const failures = [];
const ok = (what) => console.log(`  OK    ${what}`);
const bad = (what, detail) => {
  failures.push(what);
  console.log(`  FAIL  ${what}${detail ? `\n        ${detail}` : ""}`);
};

let browser;
let fixtureEmail = null;
let submissionId = null;

async function cleanUp() {
  if (browser) await browser.close().catch(() => {});
  if (submissionId) {
    await sql`delete from submission_funnel where submission_id = ${submissionId}`.catch(
      () => {},
    );
    await sql`delete from content_audit where content_id = ${submissionId}`.catch(
      () => {},
    );
    await sql`delete from submissions where id = ${submissionId}`.catch(() => {});
  }
  if (fixtureEmail) {
    try {
      execFileSync(
        "node",
        [join(ROOT, "scripts/admin-fixture-user.mjs"), "remove", fixtureEmail],
        { encoding: "utf8" },
      );
    } catch {
      console.error(`  NOTE  the fixture account ${fixtureEmail} was not removed.`);
    }
  }
}

try {
  /* ── The fixtures ──────────────────────────────────────────────────────── */
  const created = execFileSync(
    "node",
    [join(ROOT, "scripts/admin-fixture-user.mjs"), "create", "owner"],
    { encoding: "utf8" },
  )
    .trim()
    .split("\n")
    .pop();
  const fixture = JSON.parse(created);
  fixtureEmail = fixture.email;

  /* Four days old, so the SLA band is unambiguously past the 72-hour
     commitment and the assertion below is about the arithmetic rather than
     about when this happens to run. */
  const inserted = await sql`
    insert into submissions (endpoint, payload, created_at)
    values ('ci-fixture',
            ${JSON.stringify({
              name: "Gate Fixture",
              email: "gate-fixture@yallo.invalid",
              company: "A fixture the funnel gate made",
              role: "None, this is test data",
              region: "None",
              engagement: "None",
              message: "A sentence written for this gate and for nowhere else.",
            })}::jsonb,
            now() - interval '4 days')
    returning id`;
  submissionId = String(inserted[0].id);

  browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1400, height: 1000 },
  });

  if (
    !(await signInTo(context, {
      base: BASE,
      email: fixture.email,
      password: fixture.password,
      onNote: (m) => bad(m),
    }))
  ) {
    bad("the fixture account could not sign in, so nothing below was measured");
    throw new Error("sign-in failed");
  }
  ok("signed in");
  const page = await context.newPage();

  /* ── The lead appears, with its clock ──────────────────────────────────── */
  const view = `${BASE}/admin/briefs?state=all&source=ci-fixture`;
  await page.goto(view, { waitUntil: "networkidle" });
  const card = page.locator(`#lead-${submissionId}`);
  if ((await card.count()) === 0) {
    bad("the fixture lead does not appear on the funnel pane");
    throw new Error("no card");
  }
  ok("the lead renders as a card");

  const cardText = await card.innerText();
  if (!cardText.includes("Gate Fixture")) {
    bad("the card does not show the captured name", cardText.slice(0, 160));
  } else {
    ok("the card shows the parsed fields rather than a payload");
  }
  /* The SLA clock, against the published 72-hour commitment. Four days old and
     still New, so it must read as past it. */
  if (!/past the 72-hour commitment/.test(cardText)) {
    bad("the SLA clock does not report a four-day-old New lead as late", cardText.slice(0, 240));
  } else {
    ok("the SLA clock reports it past the 72-hour commitment");
  }
  /* The raw payload is still reachable — §11 says behind a disclosure, not
     gone. */
  if ((await card.locator("details").count()) === 0) {
    bad("the raw payload is not available behind a disclosure");
  } else {
    ok("the raw payload is behind a disclosure");
  }

  /* ── One click moves it, and the filter survives ───────────────────────── */
  /* WAITING ON THE OUTCOME, NOT ON A CLOCK OR ON IDLENESS. A first version
     called waitForLoadState("networkidle") straight after the click; that
     resolves against the page as it already is, which was idle, so the assertion
     below ran before the server action had written anything and the URL check
     passed vacuously because the URL had not changed yet. Waiting for the
     redirect's own marker is the only honest signal that the write completed. */
  await card.getByRole("button", { name: "Contacted", exact: true }).click();
  await page.waitForURL((u) => u.searchParams.has("moved"), { timeout: 20000 });
  await page.waitForLoadState("networkidle");
  const after = new URL(page.url());
  if (after.searchParams.get("source") !== "ci-fixture") {
    bad(
      "the filters did not survive the state change",
      `landed on ${page.url()}`,
    );
  } else {
    ok("the filters survived the write, so the operator keeps their place");
  }

  const moved = await sql`select state, updated_by from submission_funnel
                           where submission_id = ${submissionId}`;
  if (moved[0]?.state !== "contacted") {
    bad(`the state did not reach the database (it is "${moved[0]?.state}")`);
  } else {
    ok(`the state is "contacted" in the database, by ${moved[0].updated_by}`);
  }

  /* The capture table is untouched by any of it — the whole reason the sidecar
     exists. */
  const capture = await sql`select payload, endpoint from submissions
                             where id = ${submissionId}`;
  if (capture[0]?.endpoint !== "ci-fixture") {
    bad("the submission row was altered by a funnel write");
  } else {
    ok("the capture row is untouched: state lives in the sidecar");
  }

  /* ── The clock stops at Contacted ──────────────────────────────────────── */
  await page.goto(view, { waitUntil: "networkidle" });
  const stopped = await page.locator(`#lead-${submissionId}`).innerText();
  if (/past the 72-hour commitment/.test(stopped)) {
    bad("the clock is still running after the lead was answered");
  } else {
    ok("the clock stopped once the lead was answered");
  }

  /* ── An owner sticks ───────────────────────────────────────────────────── */
  const assign = page.locator(`#lead-${submissionId} select[name="ownerEmail"]`);
  await assign.selectOption(fixture.email);
  await page
    .locator(`#lead-${submissionId}`)
    .getByRole("button", { name: "Assign" })
    .click();
  await page.waitForURL((u) => u.searchParams.has("moved"), { timeout: 20000 });
  await page.waitForLoadState("networkidle");
  const owned = await sql`select owner_email, state from submission_funnel
                           where submission_id = ${submissionId}`;
  if (owned[0]?.owner_email !== fixture.email) {
    bad(`the owner did not stick (it is "${owned[0]?.owner_email}")`);
  } else if (owned[0]?.state !== "contacted") {
    bad(`assigning an owner reset the state to "${owned[0]?.state}"`);
  } else {
    ok("the owner stuck, and assigning it did not reset the state");
  }

  /* ── The audit trail ───────────────────────────────────────────────────── */
  const audit = await sql`select count(*)::int as n from content_audit
                           where content_id = ${submissionId} and content_type = 'submission'`;
  if (audit[0].n < 2) {
    bad(`only ${audit[0].n} audit row(s) for two changes`);
  } else {
    ok(`${audit[0].n} audit rows recorded, so who moved a lead has an answer`);
  }

  /* ── The export is the view ────────────────────────────────────────────── */
  const csv = await page.request.get(
    `${BASE}/api/admin/briefs/export?state=all&source=ci-fixture`,
  );
  if (!csv.ok()) {
    bad(`the CSV export answered HTTP ${csv.status()}`);
  } else {
    const body = await csv.text();
    const lines = body.trim().split(/\r?\n/);
    if (!lines[0].includes("captured_at_utc")) {
      bad("the CSV has no header row", lines[0]?.slice(0, 120));
    } else if (lines.length !== 2) {
      bad(
        `the export is not the filtered view: ${lines.length - 1} data row(s) for a one-row view`,
      );
    } else if (!lines[1].includes("Gate Fixture")) {
      bad("the exported row is not the lead on screen", lines[1].slice(0, 160));
    } else if (!lines[1].includes("Contacted")) {
      bad("the exported row carries the wrong state", lines[1].slice(0, 160));
    } else {
      ok("the CSV export is exactly the view on screen, state included");
    }
    const disposition = csv.headers()["content-disposition"] ?? "";
    if (!disposition.includes("attachment")) {
      bad("the CSV is not served as an attachment", disposition);
    } else {
      ok("the CSV downloads rather than rendering");
    }
  }

  /* ── An anonymous caller gets nothing ──────────────────────────────────── */
  const anon = await browser.newContext();
  const anonResponse = await anon.request.get(
    `${BASE}/api/admin/briefs/export`,
  );
  if (anonResponse.status() !== 403 && anonResponse.status() !== 401) {
    bad(
      `the export answered an anonymous caller with HTTP ${anonResponse.status()}`,
      "This route sits outside the (cockpit) layout, so its own guard is the only one.",
    );
  } else {
    ok(`an anonymous caller is refused the export (HTTP ${anonResponse.status()})`);
  }
  await anon.close();
} catch (err) {
  if (failures.length === 0) bad("the gate threw", (err && err.message) || String(err));
} finally {
  await cleanUp();
}

if (failures.length > 0) {
  console.error(`\n${failures.length} funnel assertion(s) failed.`);
  process.exit(1);
}
console.log(
  "\nThe funnel moves a lead, keeps its filters, stops the clock, assigns an owner, audits every change and exports the view it shows.",
);
