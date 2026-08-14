import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import styles from "@/components/admin/Admin.module.css";
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
 * THE BREAK-GLASS PAIR IS UNCHANGED — R-28a.2, and this round strengthens the
 * reason rather than weakening it. Once database sign-in depends on an email
 * arriving, an unverified sender or a Resend outage is a total lockout of the
 * live cockpit. The one door that must work when nothing else does stays a
 * password path, and it is deliberately still on this page rather than hidden
 * behind a query parameter: a door you have to know about is a door somebody
 * will not find at 2am.
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
  searchParams: Promise<{ error?: string; sent?: string; email?: string }>;
}) {
  const session = await auth();
  if (session?.user) redirect(ADMIN_ROUTES.briefs);

  const { error, sent, email } = await searchParams;
  const { ready, missing, codeReady, codeMissing } = adminConfigStatus();
  const prefill = typeof email === "string" ? email : "";

  return (
    <div className={styles.signInWrap}>
      <div className={styles.signInCard}>
        <h1 className={styles.h1}>Yallo admin</h1>
        <p className={styles.lede}>
          Sign in with a one-time code sent to your Yallo address.
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

        {sent ? (
          <p className={styles.note}>
            If that address has an account, a code is on its way. It expires in
            ten minutes and can be used once. Enter it below.
          </p>
        ) : null}

        {error ? (
          <p className={styles.error}>
            That did not work. Nothing about which part was wrong is reported,
            deliberately.
          </p>
        ) : null}

        {/* ── Step one: ask for a code ────────────────────────────────────── */}
        <form
          action={async (formData: FormData) => {
            "use server";
            const address = String(formData.get("address") ?? "").trim();

            /* §2.3, AND IT IS THE WHOLE POINT OF THIS BLOCK. The outcome is
               identical whether or not the address has an account, whether or
               not that account is disabled, and whether or not the rate limit
               was reached: same redirect, same query, same wording, same status.
               A form that answers "no such account" differently is a free list
               of who works here, and the addresses are firstname.lastname, so
               the list is guessable and the confirmation is the only missing
               piece.

               A send failure is not reported to the caller either. It is logged
               server-side by sendSignInCode, which is where an operator can act
               on it without it also being an oracle. */
            const outcome = await requestCode(address);
            if (outcome.send) {
              await sendSignInCode(outcome.email, outcome.name, outcome.code);
            }
            redirect(
              `${ADMIN_ROUTES.signIn}?sent=1&email=${encodeURIComponent(address)}`,
            );
          }}
        >
          {/* `address`, NOT `email`, and the two OTP forms below use the same
              name for the same reason. The gates' shared helper
              (scripts/lib/admin-sign-in.mjs) fills `input[name="email"]` and
              `input[name="password"]`, and Playwright's strict mode fails a
              selector that resolves to more than one element. Leaving three
              inputs called `email` on this page would have broken check:editor
              and check:admin-isolation, and §2.4 is explicit that a gate is
              never weakened to make a feature fit. The break-glass form keeps
              those two names, so it stays the only match and the helper needs
              no change at all. */}
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

        {/* ── Step two: use it ────────────────────────────────────────────── */}
        <form
          action={async (formData: FormData) => {
            "use server";
            try {
              await signIn("otp", {
                email: String(formData.get("address") ?? ""),
                code: String(formData.get("code") ?? "").trim(),
                remember: String(formData.get("remember") ?? ""),
                redirectTo: ADMIN_ROUTES.briefs,
              });
            } catch (err) {
              /* redirect() must stay OUTSIDE the catch: Auth.js signals its own
                 success by throwing NEXT_REDIRECT, so catching everything and
                 redirecting here would swallow the successful sign-in too. Only
                 AuthError is handled; everything else is re-thrown untouched. */
              if (err instanceof AuthError) {
                redirect(`${ADMIN_ROUTES.signIn}?error=1`);
              }
              throw err;
            }
          }}
        >
          <input type="hidden" name="address" defaultValue={prefill} />
          <label className={styles.field} htmlFor="otp-code">
            <span className={styles.fieldLabel}>Six-digit code</span>
            <input
              className={styles.input}
              id="otp-code"
              name="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              /* About the input, not about the account. §2.3 allows this one to
                 be specific because it says nothing about whether the address
                 exists. */
              title="Enter all six digits"
              required
            />
          </label>
          <label className={styles.field} htmlFor="otp-remember">
            <span className={styles.fieldLabel}>
              <input id="otp-remember" name="remember" type="checkbox" /> Keep
              me signed in for 15 days
            </span>
          </label>
          <button className={styles.submit} type="submit" disabled={!ready}>
            Sign in
          </button>
        </form>

        {/* ── The break-glass, unchanged ──────────────────────────────────── */}
        {/* NOT behind a <details>, and not last for layout reasons alone. The
            gates' helper takes `form button[type="submit"]` .last() and waits
            for it to be VISIBLE, so a collapsed disclosure would hide the
            control two gates depend on. R-28a.2 wants this door findable in the
            situation it exists for, which is nobody being able to receive a
            code; a door somebody has to know to expand is a door they will not
            find at 2am. */}
        <section className={styles.note}>
          <h2 className={styles.fieldLabel}>Owner sign-in</h2>
          <p>
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
                  redirect(`${ADMIN_ROUTES.signIn}?error=1`);
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
        </section>

        <p className={styles.note}>
          This surface is absent from the sitemap, from llms.txt and from the
          assistant&apos;s corpus, disallowed in robots.txt, and linked from no
          published page. A gate asserts each of those.
        </p>
      </div>
    </div>
  );
}
