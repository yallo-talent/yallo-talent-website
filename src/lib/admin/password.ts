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
export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split("$");
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
