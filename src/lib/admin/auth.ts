import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { ADMIN_ROUTES } from "@/lib/admin/config";
import { isStoredHashWellFormed, verifyPassword } from "@/lib/admin/password";

/**
 * Auth.js v5, one admin identity, server-side session.
 *
 * ONE IDENTITY, ruled round 17 §2.3: no public sign-up, and no second account
 * until one is actually needed. There is therefore no user table, no adapter and
 * no database round trip on the auth path — the identity is two environment
 * variables, and a second account would be a schema decision taken deliberately
 * rather than a capability that arrived for free.
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
        return { id: "admin", email: ADMIN_EMAIL as string, name: "Admin" };
      },
    }),
  ],
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
