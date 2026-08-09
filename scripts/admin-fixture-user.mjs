#!/usr/bin/env node
/**
 * Fixture accounts for the cockpit gates: create one, remove it, list them.
 *
 * WHY THIS IS A SCRIPT AND NOT A FUNCTION IN src/lib/db/users.ts. The cockpit has
 * no delete path anywhere (round 17 §3), and an account is not an exception:
 * `disabled` is the whole retirement story. A `deleteUser` exported from the
 * application's data layer is a function a pane can be wired to by someone who
 * does not know that. The gates genuinely do need to remove what they create —
 * a test row left in a live table IS an invented user — so the delete exists
 * here, in a file nothing under src/ imports.
 *
 * CREATE NO REAL USER. Every address this writes carries the fixture prefix
 * below, `remove` refuses to touch anything that does not, and `sweep` exists so
 * that a gate killed halfway through does not leave a row behind.
 *
 *   DATABASE_URL=... node scripts/admin-fixture-user.mjs create <role>
 *       prints one JSON line: {"email":...,"password":...,"role":...}
 *   DATABASE_URL=... node scripts/admin-fixture-user.mjs remove <email>
 *   DATABASE_URL=... node scripts/admin-fixture-user.mjs sweep
 *   DATABASE_URL=... node scripts/admin-fixture-user.mjs list
 */
import { randomBytes, scryptSync } from "node:crypto";
import { Pool } from "@neondatabase/serverless";

/* Every fixture address starts with this. It is the safety catch on `remove`
   and the selector for `sweep`. */
const FIXTURE_PREFIX = "gate-fixture+";
const FIXTURE_DOMAIN = "@yallo.invalid";

const ROLES = ["admin", "editor", "ops"];

/* The same parameters as src/lib/admin/password.ts, restated for the same reason
   every check-* script restates its constants: this is a plain Node script that
   does not resolve the `@/` alias and nothing under scripts/ imports src/. If
   they ever drift, a fixture user simply cannot sign in, which the gate reports
   as a failure rather than passing quietly. */
const SCRYPT_COST = 2 ** 15;
const KEY_LENGTH = 64;

function hashPassword(password) {
  const salt = randomBytes(16);
  const key = scryptSync(password, salt, KEY_LENGTH, {
    N: SCRYPT_COST,
    maxmem: 128 * SCRYPT_COST * 8 * 2,
  });
  return ["scrypt", SCRYPT_COST, salt.toString("hex"), key.toString("hex")].join(
    "$",
  );
}

function pool() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set.");
    process.exit(1);
  }
  return new Pool({ connectionString: url });
}

const isFixture = (email) =>
  typeof email === "string" && email.toLowerCase().startsWith(FIXTURE_PREFIX);

async function main() {
  const [command, arg] = process.argv.slice(2);
  const db = pool();

  try {
    if (command === "create") {
      const role = arg ?? "editor";
      if (!ROLES.includes(role)) {
        console.error(`Role must be one of ${ROLES.join(", ")}. Got "${role}".`);
        process.exit(1);
      }
      const email = `${FIXTURE_PREFIX}${role}-${randomBytes(6).toString("hex")}${FIXTURE_DOMAIN}`;
      const password = randomBytes(18).toString("base64url");
      await db.query(
        "insert into users (email, name, role, password_hash) values ($1, $2, $3, $4)",
        [email, `Gate fixture (${role})`, role, hashPassword(password)],
      );
      /* One JSON line on stdout, so a gate can parse it without a second
         round trip. The password is a throwaway for a row that is deleted at
         teardown; it is never a real credential and never reaches a file. */
      console.log(JSON.stringify({ email, password, role }));
      return;
    }

    if (command === "remove") {
      if (!isFixture(arg)) {
        console.error(
          `Refusing to remove "${arg}": only addresses beginning "${FIXTURE_PREFIX}" are fixtures.`,
        );
        process.exit(1);
      }
      const r = await db.query("delete from users where lower(email) = $1", [
        arg.toLowerCase(),
      ]);
      console.log(`Removed ${r.rowCount} fixture row(s).`);
      return;
    }

    if (command === "sweep") {
      const r = await db.query("delete from users where email like $1", [
        `${FIXTURE_PREFIX}%`,
      ]);
      console.log(`Swept ${r.rowCount} fixture row(s).`);
      return;
    }

    if (command === "list") {
      const r = await db.query(
        "select email, role, disabled from users order by lower(email)",
      );
      if (r.rows.length === 0) console.log("No accounts.");
      for (const row of r.rows) {
        console.log(
          `${row.email}\t${row.role}\t${row.disabled ? "disabled" : "enabled"}${isFixture(row.email) ? "\t[FIXTURE]" : ""}`,
        );
      }
      return;
    }

    console.error("Usage: admin-fixture-user.mjs create <role> | remove <email> | sweep | list");
    process.exit(1);
  } finally {
    await db.end();
  }
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
