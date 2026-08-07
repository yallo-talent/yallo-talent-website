#!/usr/bin/env node
/**
 * admin:hash — turn an admin password into the hash `.env.local` stores.
 *
 *   pnpm admin:hash
 *
 * Reads the password from the terminal WITH ECHO OFF and prints only the hash.
 * The password itself never appears on screen, in shell history, in a process
 * listing (it is not an argument), or in any transcript of the session that ran
 * this. That is the whole reason the script exists rather than a one-line node
 * invocation: `node -e "...hashPassword('hunter2')"` puts the password in
 * `ps` output and in the history file.
 *
 * Paste the printed line into .env.local as ADMIN_PASSWORD_HASH.
 */
import { createInterface } from "node:readline";
import { randomBytes, scryptSync } from "node:crypto";

/* Duplicated from src/lib/admin/password.ts, and it is the one place in this
   repository where a duplicate is the lesser evil: a .mjs script cannot import a
   path-aliased .ts module on Node 22.16, and the alternative — a plain .js
   module imported by both — would put the credential primitive somewhere the
   TypeScript build cannot type-check it. The parameters are asserted against
   each other: scripts/check-admin-isolation.mjs fails if the constants here and
   in password.ts disagree, so the copy cannot drift silently. */
const SCRYPT_COST = 2 ** 15;
const KEY_LENGTH = 64;
const PREFIX = "scrypt";

/* scrypt needs 128 * N * r bytes, which at N=2^15 and the default r=8 is exactly
   32 MiB — precisely node's default maxmem ceiling, so the call throws
   ERR_CRYPTO_INVALID_SCRYPT_PARAMS unless the limit is raised. Derived from the
   cost rather than hardcoded so that raising SCRYPT_COST, or verifying a hash
   stored at a higher cost, cannot reintroduce the same failure. */
const scryptMaxmem = (cost) => 128 * cost * 8 * 2;

function hashPassword(password) {
  const salt = randomBytes(16);
  const key = scryptSync(password, salt, KEY_LENGTH, {
    N: SCRYPT_COST,
    maxmem: scryptMaxmem(SCRYPT_COST),
  });
  return [PREFIX, SCRYPT_COST, salt.toString("hex"), key.toString("hex")].join(
    "$",
  );
}

/** Reads a line with the terminal's echo suppressed. */
function readSecret(prompt) {
  return new Promise((resolve, reject) => {
    if (!process.stdin.isTTY) {
      reject(
        new Error(
          "admin:hash needs an interactive terminal, so the password is never " +
            "piped, argued or logged. Run it directly, not through a pipe.",
        ),
      );
      return;
    }
    process.stdout.write(prompt);
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    /* Suppress the echo without suppressing the newline readline needs. */
    const output = rl.output;
    rl.output = {
      write: (chunk) => {
        if (chunk === "\r\n" || chunk === "\n") output.write(chunk);
      },
    };
    rl.question("", (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

const password = await readSecret("Admin password (not echoed): ");
const again = await readSecret("Again: ");

if (password.length === 0) {
  console.error("\nEmpty password. Nothing written.");
  process.exit(1);
}
if (password !== again) {
  console.error("\nThe two entries do not match. Nothing written.");
  process.exit(1);
}
if (password.length < 12) {
  console.error(
    `\nThat password is ${password.length} characters. This identity can read ` +
      "every brief and every conversation the site has captured; 12 is the " +
      "floor. Nothing written.",
  );
  process.exit(1);
}

/* The `$` separators are printed backslash-escaped because @next/env expands
   `$name` references when it reads .env.local, so an unescaped hash arrives at
   verifyPassword truncated to "scrypt" — a correct password then fails with a
   bare CredentialsSignin and nothing pointing at the env file. Quoting the value
   does not help; @next/env expands inside single and double quotes alike. */
console.log(
  "\nAdd this line to .env.local exactly as printed — the backslashes are\n" +
    "required, and it is a hash, not the password:\n\n" +
    `ADMIN_PASSWORD_HASH=${hashPassword(password).replaceAll("$", "\\$")}\n`,
);
