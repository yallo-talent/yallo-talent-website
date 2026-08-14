import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import styles from "@/components/admin/Admin.module.css";
import { YalloFlower } from "@/components/layout/YalloFlower";
import { adminConfigStatus, auth, signIn } from "@/lib/admin/auth";
import { ADMIN_ROUTES } from "@/lib/admin/config";
import { requestCode } from "@/lib/admin/otp";
import { sendSignInCode } from "@/lib/admin/otp-mail";

/**
 * Sign-in. Two doors, and both are real.
 *
 * A DATABASE ACCOUNT ASKS FOR A CODE — R-28a.1, which supersedes round 23 §7.
 * Nothing is generated for anybody by an administrator, and nothing has to be
 * handed over: creating an account is a row, and the person signs in by asking
 * for a code. That is why the account-creation email problem disappears rather
 * than getting solved.
 *
 * ONE STEP AT A TIME, NOT BOTH FORMS AT ONCE. The first build rendered the
 * email step and the code step simultaneously, always, whether or not a code
 * had been requested — a five-field page before anyone had done anything.
 * Sumeet's read, 14 Aug 2026: it looked so weird next to a plain "type your
 * email, get a code" screen. `sent` in the URL is what a code was actually
 * requested against, so it is also what decides which step renders. No client
 * state, no JS required for the switch: a server component reading its own
 * query string.
 *
 * THE BREAK-GLASS PAIR IS UNCHANGED — R-28a.2, and this round strengthens the
 * reason rather than weakening it. Once database sign-in depends on an email
 * arriving, an unverified sender or a Resend outage is a total lockout of the
 * live cockpit. The one door that must work when nothing else does stays a
 * password path.
 *
 * IT IS NOT A SECOND SCREEN THE SYSTEM PICKS FOR YOU. Sumeet also asked
 * whether the page could just "know" that one particular address is the
 * owner and offer the password field only for that address. It was not built
 * that way on purpose: distinguishing one address's sign-in behaviour from
 * every other's is exactly the oracle §2.3 exists to close, except aimed at
 * the single highest-value account rather than at membership generally. The
 * owner path stays a plain disclosure anyone can open, native
 * `<details>`/`<summary>` per this codebase's own convention (Engage,
 * `payloadDisclosure`), so it degrades to a link with no JS and needs no ARIA
 * of its own. `scripts/lib/admin-sign-in.mjs` opens it before filling the
 * owner form, so the two gates that sign in as the environment pair are
 * unaffected.
 *
 * NOT under the admin layout's guard — a sign-in page inside its own auth guard
 * is a redirect loop. Both forms post to server actions, so no credential and no
 * code ever travels through a client component's state.
 */
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sign in · Yallo admin",
  robots: { index: false, follow: false, nocache: true },
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    via?: string;
    sent?: string;
    email?: string;
  }>;
}) {
  const session = await auth();
  if (session?.user) redirect(ADMIN_ROUTES.briefs);

  const { error, via, sent, email } = await searchParams;
  const { ready, missing, codeReady, codeMissing } = adminConfigStatus();
  const prefill = typeof email === "string" ? email : "";
  const showCode = Boolean(sent);
  /* Reopens the owner disclosure on its own failure, so the fields the person
     just filled in are visible again rather than collapsed behind a summary
     they have to remember to click twice. A code-step failure needs no such
     help: `sent` already keeps that step open. */
  const ownerFailed = Boolean(error) && via === "owner";
  const backHref = prefill
    ? `${ADMIN_ROUTES.signIn}?email=${encodeURIComponent(prefill)}`
    : ADMIN_ROUTES.signIn;

  return (
    <div className={styles.signInWrap}>
      <div className={styles.signInCard}>
        <div className={styles.brandRow}>
          <YalloFlower size={24} className={styles.brandMark} />
          <h1 className={styles.h1}>Yallo admin</h1>
        </div>

        <p className={styles.lede}>
          {showCode ? (
            <>
              If <strong>{prefill}</strong> has an account, a code is on its
              way. It expires in ten minutes and can be used once. Enter it
              below.
            </>
          ) : (
            "Sign in with a one-time code sent to your Yallo address."
          )}
        </p>

        {ready ? null : (
          <p className={styles.error}>
            The cockpit is not configured on this machine. Missing:{" "}
            {missing.join(", ")}. Add them to <code>.env.local</code>,{" "}
            <code>pnpm admin:hash</code> produces the password hash without
            printing the password.
          </p>
        )}

        {codeReady ? null : (
          <p className={styles.error}>
            Codes cannot be sent from this machine. Missing:{" "}
            {codeMissing.join(", ")}. Until that is set, no account can sign in
            with a code. The owner sign-in below is unaffected and is the way
            back in.
          </p>
        )}

        {error ? (
          <p className={styles.error}>
            That did not work. Nothing about which part was wrong is reported,
            deliberately.
          </p>
        ) : null}

        {showCode ? (
          <>
            {/* ── Step two: use the code ────────────────────────────────── */}
            <form
              action={async (formData: FormData) => {
                "use server";
                const address = String(formData.get("address") ?? "");
                try {
                  await signIn("otp", {
                    email: address,
                    code: String(formData.get("code") ?? "").trim(),
                    remember: String(formData.get("remember") ?? ""),
                    redirectTo: ADMIN_ROUTES.briefs,
                  });
                } catch (err) {
                  /* redirect() must stay OUTSIDE the catch: Auth.js signals its
                     own success by throwing NEXT_REDIRECT, so catching
                     everything and redirecting here would swallow the
                     successful sign-in too. Only AuthError is handled;
                     everything else is re-thrown untouched.

                     sent and email are carried forward on failure, so a
                     mistyped digit lands the person back on the code step
                     with their address still filled in, rather than back at
                     square one needing a whole new code. */
                  if (err instanceof AuthError) {
                    redirect(
                      `${ADMIN_ROUTES.signIn}?error=1&sent=1&email=${encodeURIComponent(address)}`,
                    );
                  }
                  throw err;
                }
              }}
            >
              <input type="hidden" name="address" defaultValue={prefill} />
              <label className={styles.field} htmlFor="otp-code">
                <span className={styles.fieldLabel}>Six-digit code</span>
                <input
                  className={`${styles.input} ${styles.codeInput}`}
                  id="otp-code"
                  name="code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  /* About the input, not about the account. §2.3 allows this
                     one to be specific because it says nothing about whether
                     the address exists. */
                  title="Enter all six digits"
                  required
                />
              </label>
              <label className={styles.checkboxRow} htmlFor="otp-remember">
                <input id="otp-remember" name="remember" type="checkbox" />
                Keep me signed in for 15 days
              </label>
              <button className={styles.submit} type="submit" disabled={!ready}>
                Sign in
              </button>
            </form>
            <a className={styles.backLink} href={backHref}>
              Use a different address
            </a>
          </>
        ) : (
          <>
            {/* ── Step one: ask for a code ──────────────────────────────── */}
            <form
              action={async (formData: FormData) => {
                "use server";
                const address = String(formData.get("address") ?? "").trim();

                /* §2.3, AND IT IS THE WHOLE POINT OF THIS BLOCK. The outcome
                   is identical whether or not the address has an account,
                   whether or not that account is disabled, and whether or
                   not the rate limit was reached: same redirect, same query,
                   same wording, same status. A form that answers "no such
                   account" differently is a free list of who works here, and
                   the addresses are firstname.lastname, so the list is
                   guessable and the confirmation is the only missing piece.

                   A send failure is not reported to the caller either. It is
                   logged server-side by sendSignInCode, which is where an
                   operator can act on it without it also being an oracle. */
                const outcome = await requestCode(address);
                if (outcome.send) {
                  await sendSignInCode(
                    outcome.email,
                    outcome.name,
                    outcome.code,
                  );
                }
                redirect(
                  `${ADMIN_ROUTES.signIn}?sent=1&email=${encodeURIComponent(address)}`,
                );
              }}
            >
              {/* `address`, NOT `email`, and the code-step form above uses the
                  same name for the same reason. The gates' shared helper
                  (scripts/lib/admin-sign-in.mjs) fills `input[name="email"]`
                  and `input[name="password"]`, and Playwright's strict mode
                  fails a selector that resolves to more than one element.
                  Leaving a second input called `email` on this page would
                  have broken check:editor and check:admin-isolation, and
                  §2.4 is explicit that a gate is never weakened to make a
                  feature fit. The owner form below keeps those two names, so
                  it stays the only match and the helper needs no change for
                  this part. */}
              <label className={styles.field} htmlFor="otp-email">
                <span className={styles.fieldLabel}>Email</span>
                <input
                  className={styles.input}
                  id="otp-email"
                  name="address"
                  type="email"
                  autoComplete="username"
                  defaultValue={prefill}
                  required
                />
              </label>
              <button className={styles.submit} type="submit" disabled={!ready}>
                Email me a code
              </button>
            </form>
          </>
        )}

        {/* ── The break-glass, unchanged in behaviour, quieter on screen ──
            R-28a.2 wants this door findable in the situation it exists for,
            which is nobody being able to receive a code — but findable is not
            the same as competing with the primary flow for attention. Native
            `<details>`, this codebase's own pattern for exactly this
            (`payloadDisclosure` on the briefs pane): keyboard-operable and
            functional with no JS and no ARIA of its own. Reopens itself on
            its own failure via `ownerFailed`; otherwise closed. */}
        <details className={styles.ownerDisclosure} open={ownerFailed}>
          <summary>Sign in with a password instead</summary>
          <p className={styles.note}>
            The environment credential, for when a code cannot be delivered. It
            does not depend on email or on the database.
          </p>
          <form
            action={async (formData: FormData) => {
              "use server";
              try {
                await signIn("credentials", {
                  email: String(formData.get("email") ?? ""),
                  password: String(formData.get("password") ?? ""),
                  redirectTo: ADMIN_ROUTES.briefs,
                });
              } catch (err) {
                if (err instanceof AuthError) {
                  redirect(`${ADMIN_ROUTES.signIn}?error=1&via=owner`);
                }
                throw err;
              }
            }}
          >
            <label className={styles.field} htmlFor="admin-email">
              <span className={styles.fieldLabel}>Email</span>
              <input
                className={styles.input}
                id="admin-email"
                name="email"
                type="email"
                autoComplete="username"
                required
              />
            </label>
            <label className={styles.field} htmlFor="admin-password">
              <span className={styles.fieldLabel}>Password</span>
              <input
                className={styles.input}
                id="admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </label>
            <button className={styles.submit} type="submit" disabled={!ready}>
              Sign in
            </button>
          </form>
        </details>

        <p className={styles.note}>
          This surface is absent from the sitemap, from llms.txt and from the
          assistant&apos;s corpus, disallowed in robots.txt, and linked from no
          published page. A gate asserts each of those.
        </p>
      </div>
    </div>
  );
}
