import "server-only";
import { sql } from "@/lib/db/client";

/**
 * One-time sign-in codes. Every read and write of `signin_codes` goes through
 * here, the same way `users.ts` owns the accounts table.
 *
 * NOTHING IN THIS MODULE RETURNS A CODE. It stores and compares hashes; the
 * plaintext exists only inside the request that generated it, long enough to be
 * put in an email. That is the difference between this and the password flow it
 * replaces, and it is the whole reason R-28a.1 supersedes round 23 §7.
 */

export type LiveCode = {
  id: string;
  codeHash: string;
  attempts: number;
};

/**
 * Issue a code, and kill whatever was live for that account.
 *
 * ONE LIVE CODE PER ACCOUNT, per §2.2. Two live codes double the guessing
 * surface for no benefit, and a person who asks for a second code has told you
 * the first one is no use to them. The invalidation and the insert are one
 * statement each in one call: a failure between them leaves the old code
 * consumed and no new one, which fails closed.
 */
export async function issueCode(
  userId: string,
  codeHash: string,
  expiresAt: Date,
): Promise<void> {
  await sql()`
    update signin_codes
       set consumed_at = now()
     where user_id = ${userId}
       and consumed_at is null`;
  await sql()`
    insert into signin_codes (user_id, code_hash, expires_at)
    values (${userId}, ${codeHash}, ${expiresAt})`;
}

/**
 * The one code that could still be verified for this account, if any.
 *
 * Expiry is evaluated by the DATABASE rather than by comparing timestamps in
 * Node. The application server's clock and the database's are two clocks, and a
 * credential window that depends on which one you ask is a window nobody can
 * state.
 */
export async function liveCodeFor(userId: string): Promise<LiveCode | null> {
  const rows = (await sql()`
    select id, code_hash, attempts
      from signin_codes
     where user_id = ${userId}
       and consumed_at is null
       and expires_at > now()
     order by created_at desc
     limit 1`) as Array<Record<string, unknown>>;
  const r = rows[0];
  if (!r) return null;
  return {
    id: String(r.id),
    codeHash: String(r.code_hash),
    attempts: Number(r.attempts),
  };
}

/**
 * A wrong guess. Returns the attempt count AFTER the increment so the caller can
 * decide whether that was the last one without a second read.
 */
export async function recordFailedAttempt(id: string): Promise<number> {
  const rows = (await sql()`
    update signin_codes
       set attempts = attempts + 1
     where id = ${id}
    returning attempts`) as Array<Record<string, unknown>>;
  return Number(rows[0]?.attempts ?? 0);
}

/** Single use. Marked, never deleted — round 17 §3. */
export async function consumeCode(id: string): Promise<void> {
  await sql()`
    update signin_codes
       set consumed_at = now()
     where id = ${id}`;
}

/**
 * How many codes this account has asked for inside the window.
 *
 * The rate limit is a floor rather than a ceiling, per §2.2: its job is to stop
 * somebody using a colleague's inbox as a mail bomb, not to make sign-in
 * awkward. Counting rows means the limit survives a deploy, which an in-memory
 * counter does not.
 */
export async function requestsSince(
  userId: string,
  since: Date,
): Promise<number> {
  const rows = (await sql()`
    select count(*)::int as n
      from signin_codes
     where user_id = ${userId}
       and created_at >= ${since}`) as Array<Record<string, unknown>>;
  return Number(rows[0]?.n ?? 0);
}
