import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { adminConfigStatus, auth, signIn } from "@/lib/admin/auth";
import { ADMIN_ROUTES } from "@/lib/admin/config";
import styles from "../Admin.module.css";

/**
 * Sign-in. One identity, no sign-up link, no password reset, no "remember me".
 *
 * NOT under the admin layout's guard — it is a sibling of the guarded panes rather
 * than a child, because a sign-in page inside its own auth guard is a redirect
 * loop. It sets no session of its own and reads no data.
 *
 * The form posts to a server action, so the password never travels through a
 * client component's state and no credential is present in any client chunk.
 */
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sign in · Yallo admin",
  robots: { index: false, follow: false, nocache: true },
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  if (session?.user) redirect(ADMIN_ROUTES.briefs);

  const { error } = await searchParams;
  const { ready, missing } = adminConfigStatus();

  return (
    <div className={styles.signInWrap}>
      <div className={styles.signInCard}>
        <h1 className={styles.h1}>Yallo admin</h1>
        <p className={styles.lede}>
          One identity. There is no sign-up and no second account.
        </p>

        {ready ? null : (
          <p className={styles.error}>
            The cockpit is not configured on this machine. Missing:{" "}
            {missing.join(", ")}. Add them to <code>.env.local</code>,{" "}
            <code>pnpm admin:hash</code> produces the password hash without
            printing the password.
          </p>
        )}

        {error ? (
          <p className={styles.error}>
            That email and password did not match. Nothing about which of the
            two was wrong is reported, deliberately.
          </p>
        ) : null}

        <form
          action={async (formData: FormData) => {
            "use server";
            /* redirectTo rather than a manual redirect: Auth.js sets the session
               cookie on its own response, and redirecting ourselves afterwards
               races that. */
            /* The catch is load-bearing, and its absence was a live 500.
               Measured on the production host: a wrong password made Auth.js v5
               throw `CredentialsSignin`, nothing caught it, Next rendered the
               error boundary, and the visitor got a 500 page with digest
               2464541465 instead of "that email and password did not match".
               The message below this form already existed and was simply never
               reachable, because nothing ever set `?error=`.

               `redirect()` must stay OUTSIDE the catch. Auth.js signals its own
               success redirect by throwing NEXT_REDIRECT, so catching
               everything and redirecting here would swallow the successful
               sign-in as well. Only AuthError is handled; everything else is
               re-thrown untouched. */
            try {
              await signIn("credentials", {
                email: String(formData.get("email") ?? ""),
                password: String(formData.get("password") ?? ""),
                redirectTo: ADMIN_ROUTES.briefs,
              });
            } catch (err) {
              if (err instanceof AuthError) {
                redirect(`${ADMIN_ROUTES.signIn}?error=CredentialsSignin`);
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

        <p className={styles.note}>
          This surface is absent from the sitemap, from llms.txt and from the
          assistant's corpus, disallowed in robots.txt, and linked from no
          published page. A gate asserts each of those.
        </p>
      </div>
    </div>
  );
}
