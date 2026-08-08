import "server-only";
import { hashPassword } from "@/lib/admin/password";
import { isRole, type Role } from "@/lib/admin/roles";
import { sql } from "@/lib/db/client";

/**
 * Cockpit accounts. Every read and write of the `users` table goes through here.
 *
 * EMAIL IS LOWERCASED AT THIS BOUNDARY. The unique index is on `lower(email)`,
 * so a write that skips normalisation still cannot create a duplicate, but it
 * could create a row that no lookup finds. Normalising in one module rather than
 * at each call site is what makes the index and the code agree.
 *
 * NO DELETE. `disable` is the whole retirement path, per round 17 §3 and because
 * a future audit log needs the row to attribute past actions to.
 */

export type UserRow = {
  id: string;
  email: string;
  name: string;
  role: Role;
  disabled: boolean;
  createdAt: string;
};

/** Never leaves this module: the hash is for verification, not for display. */
type UserWithHash = UserRow & { passwordHash: string };

const normalise = (email: string): string => email.trim().toLowerCase();

/* A row whose role is not one of the three is a row the check constraint should
   have refused. If one exists anyway — a hand-edited database, a future role
   removed from the code but not the data — it is treated as no user at all
   rather than coerced to something that might grant more than intended. */
function toRow(r: Record<string, unknown>): UserRow | null {
  const role = r.role;
  if (!isRole(role)) return null;
  return {
    id: String(r.id),
    email: String(r.email),
    name: String(r.name),
    role,
    disabled: Boolean(r.disabled),
    createdAt: new Date(String(r.created_at)).toISOString(),
  };
}

/**
 * The sign-in lookup. Returns the hash, so it is the one function here that
 * carries one, and it is exported only to `auth.ts`.
 *
 * A DISABLED USER IS RETURNED, NOT HIDDEN. The caller has to see that the row
 * exists and is disabled, so that it can refuse the sign-in AND refuse to fall
 * through to the env pair. Filtering disabled rows out here would make a
 * disabled account fall through and be checked against the break-glass
 * credential instead, which is the opposite of disabling it.
 */
export async function findUserForSignIn(
  email: string,
): Promise<UserWithHash | null> {
  const rows = (await sql()`
    select id, email, name, role, password_hash, disabled, created_at
      from users
     where lower(email) = ${normalise(email)}
     limit 1
  `) as Array<Record<string, unknown>>;
  const first = rows[0];
  if (!first) return null;
  const row = toRow(first);
  if (!row) return null;
  return { ...row, passwordHash: String(first.password_hash) };
}

export async function listUsers(): Promise<UserRow[]> {
  const rows = (await sql()`
    select id, email, name, role, disabled, created_at
      from users
     order by disabled asc, lower(email) asc
  `) as Array<Record<string, unknown>>;
  return rows.map(toRow).filter((r): r is UserRow => r !== null);
}

export async function getUser(id: string): Promise<UserRow | null> {
  const rows = (await sql()`
    select id, email, name, role, disabled, created_at
      from users
     where id = ${id}
     limit 1
  `) as Array<Record<string, unknown>>;
  return rows[0] ? toRow(rows[0]) : null;
}

/**
 * How many enabled admins exist in the table.
 *
 * This does NOT count the env break-glass identity, and that is deliberate: the
 * last-admin rule below has to hold on the database alone. Counting the env pair
 * would let the table be emptied of admins on the reasoning that the environment
 * still has one, and the environment is exactly what a bad deploy takes away.
 */
export async function enabledAdminCount(): Promise<number> {
  const rows = (await sql()`
    select count(*)::int as n from users where role = 'admin' and disabled = false
  `) as Array<Record<string, unknown>>;
  return Number(rows[0]?.n ?? 0);
}

export type CreateUserInput = {
  email: string;
  name: string;
  role: Role;
  password: string;
};

/** Returns the created row. The plaintext password is the caller's to show once
    and then forget; it is never returned from here and never logged. */
export async function createUser(input: CreateUserInput): Promise<UserRow> {
  const rows = (await sql()`
    insert into users (email, name, role, password_hash)
    values (
      ${normalise(input.email)},
      ${input.name.trim()},
      ${input.role},
      ${hashPassword(input.password)}
    )
    returning id, email, name, role, disabled, created_at
  `) as Array<Record<string, unknown>>;
  const row = rows[0] ? toRow(rows[0]) : null;
  if (!row)
    throw new Error("The user row was written but could not be read back.");
  return row;
}

export async function setPassword(id: string, password: string): Promise<void> {
  await sql()`
    update users set password_hash = ${hashPassword(password)} where id = ${id}
  `;
}

export async function setDisabled(
  id: string,
  disabled: boolean,
): Promise<void> {
  await sql()`update users set disabled = ${disabled} where id = ${id}`;
}

/* There is deliberately no delete here. The gates' fixture rows are created and
   removed by scripts/admin-fixture-user.mjs, which talks to the database
   directly, so that no delete path exists in anything the application imports.
   A function exported from this module is a function a pane can be wired to. */
