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
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role;
  }
}
