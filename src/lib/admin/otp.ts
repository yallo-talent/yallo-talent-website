import "server-only";
import { randomInt } from "node:crypto";
import { hashPassword, verifyPassword } from "@/lib/admin/password";
import {
  consumeCode,
  issueCode,
  liveCodeFor,
  recordFailedAttempt,
  requestsSince,
} from "@/lib/db/signin-codes";
import { findUserForSignIn } from "@/lib/db/users";

/**
 * The one-time code policy, in one place — R-28a.1 and §2.2.
 *
 * Every number here is a security parameter, so each one carries its reason
 * rather than sitting as a bare literal somebody later "tidies".
 */

/** Six digits. Short enough to retype off a phone; its safety comes from the
    expiry and the attempt cap below, never from length. */
const CODE_DIGITS = 6;

/** Ten minutes, per §2.2. */
export const CODE_TTL_MS = 10 * 60 * 1000;

/** Five wrong guesses and the code is dead. A six-digit code with unlimited
    attempts is a million guesses against one target and is not a credential. */
export const MAX_ATTEMPTS = 5;

/**
 * The request rate limit: three codes per address per fifteen minutes.
 *
 * CHOSEN, AND THE CHOICE IS STATED because §2.2 asks for it. It is a floor, not
 * a ceiling: the job is to stop somebody using a colleague's inbox as a mail
 * bomb, not to make a person who mistypes their address twice wait. Three covers
 * "it did not arrive, send another" twice over inside one sitting, and caps the
 * inbox at twelve messages an hour in the worst case.
 */
export const RATE_LIMIT_MAX = 3;
export const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

/**
 * A code, generated without modulo bias.
 *
 * `randomInt` with a range is rejection-sampled by Node itself. Deriving digits
 * from `randomBytes` with `% 10` is the version of this that looks identical and
 * is not uniform.
 */
function generateCode(): string {
  return String(randomInt(0, 10 ** CODE_DIGITS)).padStart(CODE_DIGITS, "0");
}

/** Exactly the digits, nothing else. Used to reject before any lookup. */
export function isWellFormedCode(code: string): boolean {
  return new RegExp(`^\\d{${CODE_DIGITS}}$`).test(code);
}

export type CodeRequest =
  /** A code was generated and should be sent to this address. */
  | { send: true; email: string; name: string; code: string }
  /** Nothing to send. The CALLER MUST BEHAVE IDENTICALLY either way. */
  | { send: false };

/**
 * Ask for a code.
 *
 * THE RETURN VALUE IS NOT A RESPONSE. It tells the caller whether an email
 * exists to be sent; §2.3 requires the caller's response to the browser to be
 * the same in both cases, and the sign-in action is where that is enforced.
 *
 * A code is produced only when a row exists and is not disabled. Everything
 * else — no row, disabled row, rate limit reached — returns `{ send: false }`,
 * and none of those are distinguishable from outside.
 *
 * THE WORK IS DELIBERATELY NOT SKIPPED FOR AN UNKNOWN ADDRESS. A path that
 * returns early costs measurably less than one that hashes, and the difference
 * is a free membership oracle for a list of `firstname.lastname@yallo.co`
 * addresses that are already guessable. `auth.ts` makes the same argument about
 * its email comparison, in the same words, and this is that reasoning applied
 * one flow along.
 */
export async function requestCode(rawEmail: string): Promise<CodeRequest> {
  const code = generateCode();
  const codeHash = hashPassword(code);

  let row: Awaited<ReturnType<typeof findUserForSignIn>> = null;
  try {
    row = await findUserForSignIn(rawEmail);
  } catch {
    row = null;
  }

  if (!row || row.disabled) return { send: false };

  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);
  const recent = await requestsSince(row.id, since);
  if (recent >= RATE_LIMIT_MAX) {
    /* OBSERVABLE RATHER THAN SILENT, per §2.2. The address is an internal
       colleague's and is not a credential; the code is never logged anywhere,
       here or otherwise. */
    console.warn(
      `[admin-otp] rate limit reached for ${row.email}: ${recent} request(s) in the last ${RATE_LIMIT_WINDOW_MS / 60000} minutes, no code sent`,
    );
    return { send: false };
  }

  await issueCode(row.id, codeHash, new Date(Date.now() + CODE_TTL_MS));
  return { send: true, email: row.email, name: row.name, code };
}

export type VerifiedUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

/**
 * Check a code, and consume it if it is right.
 *
 * ONE FAILURE VALUE FOR EVERY WAY OF FAILING. Wrong code, expired code, already
 * consumed, too many attempts and no such account all return `null`. §2.3 is
 * explicit that distinguishing them tells an attacker which of their guesses
 * was close to a real state, and it is the caller's message that must stay
 * generic too.
 */
export async function verifyCode(
  rawEmail: string,
  code: string,
): Promise<VerifiedUser | null> {
  if (!isWellFormedCode(code)) return null;

  let row: Awaited<ReturnType<typeof findUserForSignIn>> = null;
  try {
    row = await findUserForSignIn(rawEmail);
  } catch {
    row = null;
  }
  if (!row || row.disabled) return null;

  const live = await liveCodeFor(row.id);
  if (!live) return null;

  /* The cap is checked BEFORE the comparison. A code that has already had five
     wrong guesses is dead, and letting a sixth guess be compared would make the
     cap a suggestion. */
  if (live.attempts >= MAX_ATTEMPTS) return null;

  if (!verifyPassword(code, live.codeHash)) {
    await recordFailedAttempt(live.id);
    return null;
  }

  await consumeCode(live.id);
  return { id: row.id, email: row.email, name: row.name, role: row.role };
}
