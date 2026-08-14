import type { Role } from "@/lib/admin/roles";

/**
 * `role` on the session and the token.
 *
 * Declared rather than cast at each read: a guard that has to write
 * `(session.user as { role?: string }).role` is a guard that compiles when the
 * field is missing, and the whole point of putting authorisation in the type
 * system is that a missing role is a build failure rather than an open door.
 *
 * Nullable on the session because a token minted before this shipped carries no
 * role. Those sessions resolve to `null`, which every check in roles.ts treats
 * as "sees nothing" — the safe direction. Signing in again mints a role.
 */
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      role?: Role | null;
    };
  }

  interface User {
    role?: Role | null;
    /**
     * Whether this sign-in asked to be kept signed in for fifteen days
     * (R-28a.3). Present only on the OTP provider's return value, and read only
     * by the jwt callback on the sign-in call, which is the whole lifetime it
     * needs: Auth.js passes `user` to that callback once and never again.
     */
    remember?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role;
    /**
     * Epoch seconds after which this token is refused, or absent when the person
     * asked for the fifteen-day session.
     *
     * WHY A CLAIM RATHER THAN A SHORTER COOKIE. Auth.js configures `maxAge`
     * statically, verified against @auth/core 0.41.3, so per-sign-in duration is
     * not a native feature. The configured window is therefore the long one and
     * this claim is what makes the short one real, refused in the jwt callback.
     */
    shortWindowEndsAt?: number;
    /**
     * The `users` row this session belongs to, for the per-request disabled
     * check R-28a.4 requires. Absent for the environment break-glass, which has
     * no row to look up.
     */
    userId?: string;
  }
}
