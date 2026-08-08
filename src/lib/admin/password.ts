import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

/**
 * The admin password, stored as a scrypt hash and never as plaintext.
 *
 * WHY A HASH FOR A SINGLE-IDENTITY COCKPIT. `.env.local` is gitignored, so a
 * plaintext `ADMIN_PASSWORD` is not obviously worse — until it is read out of a
 * shell history, a process listing, a `printenv`, a crash dump, or the hosting
 * platform's own environment-variable UI, all of which show a value and none of
 * which show a hash usefully. It also means the password never has to be typed
 * anywhere except the sign-in form: `pnpm admin:hash` reads it with echo off and
 * prints only the hash, so it never reaches a transcript or a clipboard.
 *
 * scrypt from node:crypto rather than bcrypt or argon2, because both would be a
 * new native dependency for one comparison a day, and scrypt with these
 * parameters is the algorithm Node ships for exactly this.
 */

/* N=2^15. Roughly 100ms on the hosts this runs on: slow enough that offline
   guessing is expensive, fast enough that a sign-in does not feel broken. The
   cost lives in the stored string so raising it later does not invalidate
   existing hashes. */
const SCRYPT_COST = 2 ** 15;
const KEY_LENGTH = 64;
const PREFIX = "scrypt";

/* scrypt needs 128 * N * r bytes, which at N=2^15 and the default r=8 is exactly
   32 MiB — precisely node's default maxmem ceiling, so the call throws
   ERR_CRYPTO_INVALID_SCRYPT_PARAMS unless the limit is raised. Derived from the
   cost rather than hardcoded so that raising SCRYPT_COST, or verifying a hash
   stored at a higher cost, cannot reintroduce the same failure. */
const scryptMaxmem = (cost: number): number => 128 * cost * 8 * 2;

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const key = scryptSync(password, salt, KEY_LENGTH, {
    N: SCRYPT_COST,
    maxmem: scryptMaxmem(SCRYPT_COST),
  });
  return [PREFIX, SCRYPT_COST, salt.toString("hex"), key.toString("hex")].join(
    "$",
  );
}

/**
 * Constant-time verification. Returns false on a malformed stored hash rather
 * than throwing, so a mistyped environment variable is a failed sign-in and not
 * a 500 that tells an anonymous caller the deployment is misconfigured.
 */
/**
 * One hash, two hosting conventions, opposite escaping rules.
 *
 * `pnpm admin:hash` prints the `$` separators backslash-escaped, and it has to:
 * `@next/env` expands `$name` when it reads `.env.local`, so an unescaped hash
 * arrives here truncated. But a platform environment variable — DigitalOcean's
 * App Platform UI, and any other dashboard that stores a literal string — does
 * no expansion at all, so the same printed line arrives with the backslashes
 * intact. `split("$")` then yields four parts whose first is `scrypt\` rather
 * than `scrypt`, the prefix check fails, and a CORRECT password is rejected.
 *
 * Measured on the production host, 8 August 2026: exactly that, presenting as a
 * bare CredentialsSignin with nothing pointing at the environment. Accepting
 * both forms is the fix, because the alternative is a foot-gun that fires once
 * per deployment target and fails silently every time.
 */
const unescapeSeparators = (stored: string): string =>
  stored.replaceAll("\\$", "$");

/** Whether a stored hash parses at all. Shape only; no password involved. */
export function isStoredHashWellFormed(stored: string): boolean {
  const parts = unescapeSeparators(stored).split("$");
  if (parts.length !== 4 || parts[0] !== PREFIX) return false;
  const cost = Number.parseInt(parts[1], 10);
  if (!Number.isSafeInteger(cost) || cost < 2 ** 14) return false;
  return /^[0-9a-f]+$/i.test(parts[2]) && /^[0-9a-f]+$/i.test(parts[3]);
}

export function verifyPassword(password: string, stored: string): boolean {
  const parts = unescapeSeparators(stored).split("$");
  if (parts.length !== 4 || parts[0] !== PREFIX) return false;

  const cost = Number.parseInt(parts[1], 10);
  if (!Number.isSafeInteger(cost) || cost < 2 ** 14) return false;

  let salt: Buffer;
  let expected: Buffer;
  try {
    salt = Buffer.from(parts[2], "hex");
    expected = Buffer.from(parts[3], "hex");
  } catch {
    return false;
  }
  if (salt.length === 0 || expected.length !== KEY_LENGTH) return false;

  const actual = scryptSync(password, salt, KEY_LENGTH, {
    N: cost,
    maxmem: scryptMaxmem(cost),
  });
  return timingSafeEqual(actual, expected);
}
