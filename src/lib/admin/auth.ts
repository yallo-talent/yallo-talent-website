import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { ADMIN_ROUTES } from "@/lib/admin/config";
import { isStoredHashWellFormed, verifyPassword } from "@/lib/admin/password";
import { isRole, type Role } from "@/lib/admin/roles";
import { findUserForSignIn } from "@/lib/db/users";

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
 * `ADMIN_PASSWORD_HASH` still sign in, still map to admin, and are checked when
 * no row matches the address. The failure this guards against is concrete:
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
  session: { strategy: "jwt" },
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
          id: "admin",
          email: ADMIN_EMAIL as string,
          name: "Admin",
          role: "admin" satisfies Role,
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
    jwt({ token, user }) {
      if (user && "role" in user && isRole(user.role)) token.role = user.role;
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

/** Whether the cockpit can work at all here. Rendered as guidance, never as a
    value: the sign-in page says which variables are missing by NAME. */
export function adminConfigStatus(): {
  ready: boolean;
  missing: string[];
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

  return { ready: missing.length === 0, missing };
}
