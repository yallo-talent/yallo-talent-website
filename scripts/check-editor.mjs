#!/usr/bin/env node
/**
 * The writing surface actually works, asserted by using it.
 *
 * WHY A GATE AND NOT A SCREENSHOT. Design §4's bar is "a writer never wanting
 * to draft somewhere else first", and every clause of it is a behaviour rather
 * than an appearance: the slash menu opens, a block inserts, autosave reaches
 * the database, the saved state says so, the preview renders the same words in
 * the real template, full screen leaves on Escape. A picture proves none of
 * that. An editor that renders and silently loses work is the exact failure
 * round 25 refused to ship a half-built control for.
 *
 * IT CREATES AND REMOVES ITS OWN FIXTURES. One draft row and one account, both
 * gone before it exits, including when an assertion fails. Round 25b forbids
 * real accounts and invented content, so the draft's title says what it is and
 * its body is a sentence about nothing.
 *
 * Run against a `next start` server:
 *   DATABASE_URL=... node scripts/check-editor.mjs http://localhost:3115
 */

import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";
import { chromium } from "@playwright/test";

const BASE = process.argv[2] ?? "http://localhost:3115";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set, so the editor was never exercised.");
  process.exit(1);
}
const sql = neon(process.env.DATABASE_URL);

const SLUG = `gate-editor-fixture-${Date.now().toString(36)}`;
const failures = [];
const ok = (what) => console.log(`  OK    ${what}`);
const bad = (what, detail) => {
  failures.push(what);
  console.log(`  FAIL  ${what}${detail ? `\n        ${detail}` : ""}`);
};

let browser;
let fixtureEmail = null;
let articleId = null;

async function cleanUp() {
  if (browser) await browser.close().catch(() => {});
  if (articleId) {
    await sql`delete from content_revisions where content_id = ${articleId}`.catch(() => {});
    await sql`delete from content_audit where content_id = ${articleId}`.catch(() => {});
    await sql`delete from articles where id = ${articleId}`.catch(() => {});
  }
  if (fixtureEmail) {
    try {
      execFileSync("node", [join(ROOT, "scripts/admin-fixture-user.mjs"), "remove", fixtureEmail], {
        encoding: "utf8",
      });
    } catch {
      /* Reported below rather than thrown: a fixture that outlives the run is
         worth saying out loud even when everything else passed. */
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

  const inserted = await sql`
    insert into articles (slug, title, summary, status)
    values (${SLUG}, 'A fixture the editor gate made', 'A summary written for this gate and nowhere else.', 'draft')
    returning id`;
  articleId = String(inserted[0].id);

  browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });

  /* ── Sign in ───────────────────────────────────────────────────────────── */
  await page.goto(`${BASE}/admin/sign-in`, { waitUntil: "domcontentloaded" });
  await page.fill('input[name="email"]', fixture.email);
  await page.fill('input[name="password"]', fixture.password);
  await page.locator('form button[type="submit"]').last().click();
  await page.waitForLoadState("networkidle");
  if (page.url().includes("/admin/sign-in")) {
    bad("the fixture account could not sign in, so nothing below was measured");
    throw new Error("sign-in failed");
  }
  ok("signed in");

  /* ── The editor loads ──────────────────────────────────────────────────── */
  await page.goto(`${BASE}/admin/articles/${articleId}`, {
    waitUntil: "networkidle",
  });
  const editable = page.locator('[contenteditable="true"]').first();
  if ((await editable.count()) === 0) {
    bad("no editable surface on the article editor route");
    throw new Error("no editor");
  }
  ok("the editor mounted");

  /* ── It obeys DESIGN.md: the publication's column and faces ────────────── */
  const look = await editable.evaluate((el) => {
    const cs = getComputedStyle(el);
    return { maxWidth: cs.maxWidth, family: cs.fontFamily, size: cs.fontSize };
  });
  if (!look.maxWidth.endsWith("px") || Number.parseFloat(look.maxWidth) < 400) {
    bad(`the writing column has no measure (max-width ${look.maxWidth})`);
  } else {
    ok(`the writing column is measured at ${look.maxWidth}`);
  }

  /* ── Typing autosaves, and the state says so ───────────────────────────── */
  await editable.click();
  await page.keyboard.type("A sentence typed by the gate.");
  const state = page.locator("output[data-state]");
  await state.waitFor({ state: "attached" });
  await page
    .waitForFunction(
      () => document.querySelector("output[data-state]")?.dataset.state === "saved",
      { timeout: 15000 },
    )
    .catch(() => {});
  const finalState = await state.getAttribute("data-state");
  if (finalState !== "saved") {
    bad(`autosave never reported saved (state is "${finalState}")`);
  } else {
    ok("autosave reported saved");
  }

  /* The claim is about the DATABASE, not about the indicator. An indicator
     that says "saved" over a failed write is the worst version of this. */
  const stored = await sql`select body, word_count from articles where id = ${articleId}`;
  const text = JSON.stringify(stored[0].body);
  if (!text.includes("A sentence typed by the gate.")) {
    bad("the typed sentence did not reach the database", text.slice(0, 200));
  } else {
    ok(`the typed sentence is in the row (${stored[0].word_count} words counted)`);
  }

  const revs = await sql`select count(*)::int as n from content_revisions
                          where content_type = 'article' and content_id = ${articleId}`;
  if (revs[0].n < 1) {
    bad("the save left no revision, so there is no history to restore from");
  } else {
    ok(`${revs[0].n} revision(s) recorded`);
  }

  /* ── The slash menu opens and inserts a Yallo block ─────────────────────── */
  await editable.click();
  await page.keyboard.press("Enter");
  await page.keyboard.type("/pull");
  const menu = page.locator('[role="listbox"]');
  await menu.waitFor({ state: "visible", timeout: 5000 }).catch(() => {});
  if (!(await menu.isVisible().catch(() => false))) {
    bad("the slash menu did not open on / at the start of a line");
  } else {
    ok("the slash menu opened and filtered");
    await page.keyboard.press("Enter");
    await page.waitForTimeout(300);
    const blocks = await page.locator("text=Pull quote").count();
    if (blocks === 0) {
      bad("choosing an item did not insert the block");
    } else {
      ok("a pull quote was inserted from the keyboard");
    }
  }

  /* ── The preview is the real template ──────────────────────────────────── */
  const previewButton = page.getByRole("button", { name: "Preview", exact: true });
  await previewButton.click();
  const frame = page.locator("iframe");
  await frame.waitFor({ state: "visible", timeout: 8000 }).catch(() => {});
  if (!(await frame.isVisible().catch(() => false))) {
    bad("the preview pane showed no frame");
  } else {
    const inner = page.frameLocator("iframe");
    await page.waitForTimeout(1500);
    const previewText = await inner
      .locator("body")
      .innerText()
      .catch(() => "");
    if (!previewText.includes("A sentence typed by the gate.")) {
      bad("the preview does not show what was typed", previewText.slice(0, 160));
    } else {
      ok("the preview renders the saved words in the real template");
    }
  }

  /* ── Full screen, and Escape leaves it ─────────────────────────────────── */
  await page.getByRole("button", { name: "Full screen" }).click();
  await page.waitForTimeout(200);
  const isFull = await page.locator('[data-full-screen="true"]').count();
  if (isFull === 0) {
    bad("full screen did not engage");
  } else {
    await page.keyboard.press("Escape");
    await page.waitForTimeout(200);
    const stillFull = await page.locator('[data-full-screen="true"]').count();
    if (stillFull > 0) bad("Escape did not leave full screen");
    else ok("full screen engaged and Escape left it");
  }
} catch (err) {
  if (failures.length === 0) bad("the gate threw", (err && err.message) || String(err));
} finally {
  await cleanUp();
}

if (failures.length > 0) {
  console.error(`\n${failures.length} editor assertion(s) failed.`);
  process.exit(1);
}
console.log("\nThe editor writes, saves, records history, inserts blocks and previews in the real template.");
