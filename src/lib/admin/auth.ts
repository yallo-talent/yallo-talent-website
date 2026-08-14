import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { ADMIN_ROUTES } from "@/lib/admin/config";
import { verifyCode } from "@/lib/admin/otp";
import { isStoredHashWellFormed, verifyPassword } from "@/lib/admin/password";
import { isRole, type Role } from "@/lib/admin/roles";
import { findUserForSignIn, getUser } from "@/lib/db/users";

/**
 * Auth.js v5, database accounts with an environment break-glass, server-side
 * session.
 *
 * WAS ONE IDENTITY, ruled round 17 §2.3: no second account until one is actually
 * needed. Round 23 is when one is needed — article authoring goes to an editor
 * who must not see briefs or conversations, and a shared login cannot express
 * that. The `users` table (migration 0004) is now consulted first.
 *
 * THE ENV PAIR IS THE RULE THAT MUST NEVER REGRESS. `ADMIN_EMAIL` and
 * `ADMIN_PASSWORD_HASH` still sign in and are checked when no row matches the
 * address. Round 25 §3: THEY MAP TO `owner`, not to `admin`. Break-glass exists
 * for the failure nobody chose, and an owner is the only role that can restore
 * another owner — a break-glass session that could not do that would arrive with
 * exactly the wrong power in exactly the situation it is for. The failure this guards against is concrete:
 * locking the owner out of the live cockpit overnight because a table, a
 * migration or a connection string went wrong. A database that is the only door
 * is a database outage that is a lockout. check:admin-render signs in with this
 * pair and would fail if it stopped working.
 *
 * ONE ORDER, AND IT MATTERS. Table first, environment second. The reverse would
 * mean an address that exists in both places gets the environment's admin role
 * regardless of what the table says, so demoting or disabling that account in
 * the pane would do nothing.
 *
 * NO CREDENTIAL AND NO TOKEN REACHES THE BROWSER BUNDLE. This module is imported
 * only by server code: the route handler, the admin layout and the server
 * actions. `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` and `AUTH_SECRET` carry no
 * `NEXT_PUBLIC_` prefix, so Next.js will not inline them into client chunks even
 * if a client component were to reference one — and
 * scripts/check-admin-isolation.mjs greps the served client bundles for each
 * value's presence rather than trusting that.
 *
 * JWT SESSION rather than a database session, for the same reason as above: a
 * session table is a store to migrate, purge and reason about for one person.
 * The cookie is httpOnly and, in production, Secure — Auth.js's defaults, not
 * restated here.
 */
const { AUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD_HASH } = process.env;

/**
 * The two session windows — R-28a.3.
 *
 * FIFTEEN DAYS IS THE CONFIGURED maxAge, and the short window is enforced as a
 * claim on top of it. Verified against the installed Auth.js before building,
 * because §2.5 marked this inferred: @auth/core 0.41.3 types `session.maxAge` as
 * a single number, "relative time from now in seconds", with no per-sign-in
 * variant. The same file types the `jwt` callback as returning
 * `Awaitable<JWT | null>`, and a null token is an invalid session. So the
 * mechanism is: configure the long window, stamp the short one as a claim when
 * the person did not ask to be kept signed in, and refuse the token in the
 * callback once that claim has passed. §2.5's fallback is not needed and the
 * session strategy is untouched.
 *
 * TWELVE HOURS FOR THE SHORT WINDOW, and §5.3 leaves the number to Sumeet to
 * overrule. It is one working day: long enough that nobody is asked to sign in
 * twice between morning and evening, short enough that a session does not
 * survive the night on a machine in an office. A browser-session cookie was the
 * other candidate and is not expressible here — the cookie's own lifetime comes
 * from the configured maxAge, which the fifteen-day case needs.
 */
export const LONG_SESSION_SECONDS = 15 * 24 * 60 * 60;
export const SHORT_SESSION_SECONDS = 12 * 60 * 60;

/**
 * Configuration is checked at call time, not at module load.
 *
 * A missing variable must fail the SIGN-IN, not the build: `next build`
 * prerenders and imports this module in environments that legitimately have no
 * admin secrets (CI, a contributor's checkout), and throwing at import time
 * would make the whole site unbuildable there. The cockpit being unusable
 * without its secrets is correct; the marketing site failing to compile without
 * them is not.
 */
function configured(): boolean {
  return Boolean(AUTH_SECRET && ADMIN_EMAIL && ADMIN_PASSWORD_HASH);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: AUTH_SECRET,
  session: { strategy: "jwt", maxAge: LONG_SESSION_SECONDS },
  pages: { signIn: ADMIN_ROUTES.signIn },
  trustHost: true,
  providers: [
    Credentials({
      name: "Yallo admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        if (!configured()) return null;

        const email = typeof raw?.email === "string" ? raw.email : "";
        const password = typeof raw?.password === "string" ? raw.password : "";
        if (email === "" || password === "") return null;

        /* A lookup failure is not a sign-in failure with a different cause: if
           the database is unreachable the env pair below must still work, which
           is the entire point of keeping it. Swallowing the error here is what
           makes an outage a degraded cockpit rather than a lockout. */
        let row: Awaited<ReturnType<typeof findUserForSignIn>> = null;
        try {
          row = await findUserForSignIn(email);
        } catch {
          row = null;
        }

        if (row) {
          /* A disabled account does NOT fall through to the env pair. If it did,
             disabling the address that happens to equal ADMIN_EMAIL would leave
             it signing in against the break-glass credential, which is the
             opposite of disabling it. The password is still verified first so
             that a disabled account and a wrong password cost the same. */
          const matches = verifyPassword(password, row.passwordHash);
          if (!matches || row.disabled) return null;
          return {
            id: row.id,
            email: row.email,
            name: row.name,
            role: row.role,
          };
        }

        /* Both checks always run, and the email comparison does not short
           circuit the expensive one. Returning early on a wrong email makes the
           response measurably faster for an unknown address than for the real
           one, which tells an attacker the admin address without a single
           successful sign-in. */
        const emailMatches =
          email.trim().toLowerCase() ===
          (ADMIN_EMAIL as string).trim().toLowerCase();
        const passwordMatches = verifyPassword(
          password,
          ADMIN_PASSWORD_HASH as string,
        );

        if (!emailMatches || !passwordMatches) return null;
        return {
          id: "owner",
          email: ADMIN_EMAIL as string,
          name: "Owner",
          role: "owner" satisfies Role,
        };
      },
    }),
    /**
     * The emailed one-time code — R-28a.1, and the path a database account uses
     * from this round on.
     *
     * IT SITS BESIDE THE PASSWORD PROVIDER RATHER THAN REPLACING IT, and §2.4
     * made that a measurement rather than a preference. Measured on this branch:
     * `scripts/admin-fixture-user.mjs` inserts a `users` row with a
     * `password_hash`, and TWO gates sign a fixture row in with that password —
     * `check-editor` for the editor pane, and `check-admin-isolation`'s
     * role-reach half, once per role. So removing the password path for database
     * rows would break two gates, and §2.4 is explicit that a gate is never
     * weakened, skipped or deleted to make a feature fit. The narrowest option
     * that keeps every gate green is to retain it, which is what this does.
     * There is no test-only bypass, no CI-only provider and no environment flag
     * that turns OTP off: both doors are real doors, open to everyone, which is
     * the only honest version of this.
     *
     * How to remove it later, so this does not become permanent by drift: give
     * the two gates a sign-in that does not need a password by having the
     * fixture script issue a code row directly and read it back from the
     * database, which a gate with `DATABASE_URL` can do and an attacker cannot.
     * That is a gate change rather than an application change, which is the
     * right shape: the application would then have one door.
     */
    Credentials({
      id: "otp",
      name: "Yallo admin code",
      credentials: {
        email: { label: "Email", type: "email" },
        code: { label: "Code", type: "text" },
        remember: { label: "Keep me signed in", type: "text" },
      },
      async authorize(raw) {
        if (!configured()) return null;
        const email = typeof raw?.email === "string" ? raw.email : "";
        const code = typeof raw?.code === "string" ? raw.code : "";
        if (email === "" || code === "") return null;

        const user = await verifyCode(email, code);
        if (!user || !isRole(user.role)) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          /* Carried through `authorize` so the jwt callback can stamp the
             window. Auth.js passes the returned user straight to that callback
             on the sign-in call and never afterwards, which is exactly the
             lifetime this needs. */
          remember: raw?.remember === "on" || raw?.remember === "true",
        };
      },
    }),
  ],
  callbacks: {
    /**
     * The role rides on the JWT, so every guard reads it from the session
     * without a database round trip on each render.
     *
     * THE COST OF THAT, STATED: a role change takes effect when the session is
     * next issued, not instantly. For three accounts that is the right trade —
     * the alternative is a users query on every request to every pane. Disabling
     * is the urgent case and it is not affected, because a disabled account
     * cannot sign in again; what an existing session survives is a demotion, not
     * a disable. If that ever stops being acceptable the fix is a database
     * session strategy, not a per-request lookup bolted onto this one.
     */
    /**
     * R-28a.3 and R-28a.4 are both enforced here, and both need the callback to
     * be able to say no. It can: @auth/core 0.41.3 types this as returning
     * `Awaitable<JWT | null>`, and a null token is an invalid session.
     */
    async jwt({ token, user }) {
      if (user && "role" in user && isRole(user.role)) token.role = user.role;

      /* Stamped once, on the sign-in call, because `user` is present only then.
         An unchecked box gets an expiry claim; a checked one gets none and rides
         the configured fifteen days. The break-glass and password paths return
         no `remember` field at all, so they take the short window too, which is
         the safe default rather than a decision. */
      if (user) {
        const remember = "remember" in user && user.remember === true;
        token.shortWindowEndsAt = remember
          ? undefined
          : Math.floor(Date.now() / 1000) + SHORT_SESSION_SECONDS;
        if (typeof user.id === "string") token.userId = user.id;
      }

      const endsAt = token.shortWindowEndsAt;
      if (
        typeof endsAt === "number" &&
        Math.floor(Date.now() / 1000) > endsAt
      ) {
        return null;
      }

      /**
       * R-28a.4: a fifteen-day session forces a live disabled check.
       *
       * THIS IS THE SECOND-ORDER EFFECT OF THE FIFTEEN-DAY OPTION, not a
       * separate feature. The reasoning this replaces was correct for its time:
       * disabling was said to be unaffected because a disabled account cannot
       * sign in again. A fifteen-day session breaks that argument outright — a
       * person disabled on day one keeps a working session until day fifteen.
       * One indexed lookup per admin request is the accepted cost, ruled.
       *
       * Role changes may still lag until the session is next issued. That half
       * of the old reasoning stands and is deliberately not addressed here.
       *
       * A LOOKUP FAILURE DOES NOT SIGN ANYBODY OUT. The break-glass exists
       * because the database can be unreachable, and a callback that invalidated
       * every session on a connection error would turn an outage into the
       * lockout the break-glass is there to prevent. The owner identity has no
       * row at all and is skipped for the same reason.
       */
      if (typeof token.userId === "string" && token.userId !== "owner") {
        try {
          const row = await getUser(token.userId);
          if (row?.disabled) return null;
        } catch {
          /* Deliberately ignored. See above. */
        }
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = isRole(token.role) ? token.role : null;
      }
      return session;
    },
  },
});

/**
 * Whether the cockpit can work at all here. Rendered as guidance, never as a
 * value: the sign-in page says which variables are missing by NAME.
 *
 * `ready` STILL MEANS THE BREAK-GLASS WORKS, and that separation is the point of
 * §2.6. `codeReady` is the second question, asked separately: a missing Resend
 * key or sender does not stop the owner signing in, it stops every DATABASE
 * account signing in. Collapsing the two into one boolean would either report a
 * working cockpit as broken or a locked-out team as fine.
 */
export function adminConfigStatus(): {
  ready: boolean;
  missing: string[];
  codeReady: boolean;
  codeMissing: string[];
} {
  const missing = [
    ["AUTH_SECRET", AUTH_SECRET],
    ["ADMIN_EMAIL", ADMIN_EMAIL],
    ["ADMIN_PASSWORD_HASH", ADMIN_PASSWORD_HASH],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name as string);

  /* Presence was not enough, and the gap cost a live cutover afternoon. A hash
     that is set but does not PARSE reported ready, the sign-in page showed no
     warning, and a correct password came back as a bare CredentialsSignin. The
     shape check carries no password and reveals nothing about the secret; it
     only says whether the stored string could ever match anything. */
  if (ADMIN_PASSWORD_HASH && !isStoredHashWellFormed(ADMIN_PASSWORD_HASH)) {
    missing.push("ADMIN_PASSWORD_HASH (set, but malformed and cannot match)");
  }

  /* Sending is now a SIGN-IN dependency for database accounts, per §2.6. The
     sender has a default (R-28a.5) so it can never be missing; the key has none
     and is the one that locks a team out. DATABASE_URL is listed with it because
     an account that cannot be looked up cannot be sent a code either. */
  const codeMissing = [
    ["RESEND_API_KEY", process.env.RESEND_API_KEY],
    ["DATABASE_URL", process.env.DATABASE_URL],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name as string);

  return {
    ready: missing.length === 0,
    missing,
    codeReady: codeMissing.length === 0,
    codeMissing,
  };
}
