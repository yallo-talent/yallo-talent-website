/**
 * Signing a browser gate into the cockpit — R-26.2, one implementation.
 *
 * WHAT WAS WRONG. Three gates each had their own sign-in, and each of them
 * clicked submit and then waited a FIXED number of milliseconds before reading
 * the URL. That is a race against a cold `next start`: the first POST to a
 * server action on a fresh process compiles nothing but does have to mint the
 * session cookie and complete a redirect, and on a loaded machine that takes
 * longer than the guess. v36 §8.4 evidenced it firing on the first context of
 * concurrent runs; it fired again in round 26 on a server four seconds old, and
 * the failure reads as "the credential is wrong" rather than "the wait was
 * short", which is the worst possible message to be given.
 *
 * WHAT REPLACES IT, and R-26.2 is explicit that it is not a third retry:
 *
 *   1. A READINESS PROBE BEFORE THE FIRST POST. The gate GETs the sign-in page
 *      until it answers 200, so the first credential ever sent goes to a server
 *      that is actually serving. A retry after a failure cannot distinguish a
 *      cold server from a wrong password; a probe before the attempt removes
 *      the cold server from the set of explanations.
 *
 *   2. WAITING ON THE OUTCOME, NOT ON A CLOCK. After the click it waits for the
 *      URL to leave /admin/sign-in, with a real timeout. A fixed sleep is a
 *      guess about somebody else's machine.
 *
 * ONE RETRY REMAINS, and it is not the fix — it is what covers a genuinely
 * transient network error inside the click itself. A second failure is reported,
 * because a credential that never works is exactly what this should catch.
 *
 * IT RETURNS A BOOLEAN AND NEVER THROWS. Every caller already treats "could not
 * sign in" as a reportable failure of its own rather than as a stack trace, and
 * a gate that dies with a Playwright TimeoutError says nothing about the surface
 * it was measuring.
 */

/**
 * Wait until the sign-in page is actually being served.
 *
 * @param {import('@playwright/test').APIRequestContext | {get: Function}} request
 * @param {string} base
 * @param {number} timeoutMs
 * @returns {Promise<boolean>}
 */
export async function waitForCockpit(request, base, timeoutMs = 30000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await request.get(`${base}/admin/sign-in`, {
        timeout: 5000,
      });
      if (response.ok()) return true;
    } catch {
      /* Not yet listening, or listening and not yet answering. Both are the
         same thing to a caller: wait and ask again. */
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  return false;
}

/**
 * Sign a context in and leave the session cookie on it.
 *
 * @param {import('@playwright/test').BrowserContext} ctx
 * @param {{base: string, email: string, password: string, onNote?: (s: string) => void}} options
 * @returns {Promise<boolean>}
 */
export async function signInTo(ctx, { base, email, password, onNote }) {
  const note = onNote ?? (() => {});

  /* THE PROBE, and it runs on the context's own request object so it shares the
     proxy settings and the base the pages will use. */
  const page = await ctx.newPage();
  const ready = await waitForCockpit(page.request, base);
  if (!ready) {
    await page.close().catch(() => {});
    note(`the cockpit never answered at ${base}/admin/sign-in`);
    return false;
  }
  await page.close().catch(() => {});

  for (let attempt = 1; attempt <= 2; attempt++) {
    const attemptPage = await ctx.newPage();
    try {
      await attemptPage.goto(`${base}/admin/sign-in`, {
        waitUntil: "domcontentloaded",
      });
      /* The button is disabled until the server reports the cockpit is
         configured. Waiting for it is waiting for the page to be usable, which
         is a stronger readiness signal than the document having loaded. */
      const submit = attemptPage.locator('form button[type="submit"]').last();
      await submit.waitFor({ state: "visible", timeout: 15000 });
      await attemptPage.fill('input[name="email"]', email);
      await attemptPage.fill('input[name="password"]', password);
      await submit.click();
      /* THE OUTCOME, not a clock. */
      await attemptPage.waitForURL(
        (url) => !url.pathname.includes("/admin/sign-in"),
        { timeout: 20000 },
      );
      await attemptPage.waitForLoadState("networkidle").catch(() => {});
      const signedIn = !attemptPage.url().includes("/admin/sign-in");
      await attemptPage.close().catch(() => {});
      if (signedIn) return true;
    } catch (err) {
      await attemptPage.close().catch(() => {});
      if (attempt === 2) {
        note(`sign-in did not complete twice: ${err.message}`);
        return false;
      }
    }
  }
  return false;
}
