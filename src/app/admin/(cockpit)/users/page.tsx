import { RowTitle } from "@/app/admin/RowTitle";
import { requirePane } from "@/lib/admin/guard";
import { ROLE_DESCRIPTIONS, ROLES } from "@/lib/admin/roles";
import { listUsers } from "@/lib/db/users";
import styles from "../../Admin.module.css";
import {
  createUserAction,
  resetPasswordAction,
  setDisabledAction,
} from "./actions";

/**
 * Accounts. Admin only, at three layers: this pane's `requirePane`, the nav in
 * the shell above it, and `assertCapability("usersManage")` at the top of every
 * action in ./actions.ts.
 *
 * NO ACCOUNT IS CREATED BY ANY SESSION. Round 23 §3 is explicit and this pane
 * ships with the table empty: real accounts are Sumeet's to create here. The
 * gates create a fixture row and remove it again through
 * scripts/admin-fixture-user.mjs, never through this pane and never left behind.
 *
 * THE GENERATED PASSWORD IS DISPLAYED ONCE. It is not emailed, because the site
 * has one transactional sender pointed at the briefs inbox and adding a
 * credential-bearing message to it is a worse surface than reading a value off a
 * screen. It is not stored, so there is no second chance: the pane says so above
 * the value, and reset password is the recovery path.
 */
export const dynamic = "force-dynamic";

export default async function UsersPane({
  searchParams,
}: {
  searchParams: Promise<{
    err?: string;
    created?: string;
    reset?: string;
    disabled?: string;
    enabled?: string;
    password?: string;
  }>;
}) {
  await requirePane("users");
  const q = await searchParams;

  let rows: Awaited<ReturnType<typeof listUsers>> = [];
  let error: string | null = null;
  try {
    rows = await listUsers();
  } catch (err) {
    error = (err as Error).message;
  }

  return (
    <>
      <h1 className={styles.h1}>Users</h1>
      <p className={styles.lede}>
        Who can sign in to this cockpit, and what each of them can reach. An
        account is disabled, never deleted, so that a future audit log can still
        attribute what it did.
      </p>

      {q.err ? <p className={styles.error}>{q.err}</p> : null}
      {error ? <p className={styles.error}>{error}</p> : null}

      {q.password ? (
        <div className={styles.error}>
          <p>
            <strong>
              {q.created
                ? `Account created for ${q.created}.`
                : `Password reset for ${q.reset}.`}
            </strong>{" "}
            This password is shown once and is stored nowhere. Copy it into a
            password manager now, then send it to its owner by a channel you
            trust. Reloading this page loses it, and reset password is the only
            way to get another.
          </p>
          <p>
            <code>{q.password}</code>
          </p>
        </div>
      ) : null}

      {q.disabled ? (
        <p className={styles.ok}>
          {q.disabled} is disabled and cannot sign in.
        </p>
      ) : null}
      {q.enabled ? (
        <p className={styles.ok}>{q.enabled} can sign in again.</p>
      ) : null}

      <h2 className={styles.h2}>Accounts</h2>
      {rows.length === 0 ? (
        <p className={styles.empty}>
          No accounts yet. The environment credential still signs in as admin,
          which is what it is for.
        </p>
      ) : (
        <ul className={styles.rows}>
          {rows.map((user) => (
            <li key={user.id} className={styles.row}>
              <div className={styles.rowHead}>
                <span className={styles.meta}>{user.role}</span>
                <RowTitle level={3} className={styles.rowTitle}>
                  {user.name}
                </RowTitle>
                <span className={styles.meta}>{user.email}</span>
                <span className={user.disabled ? styles.meta : styles.ok}>
                  {user.disabled ? "disabled" : "enabled"}
                </span>
              </div>
              <div className={styles.rowActions}>
                <form action={resetPasswordAction}>
                  <input type="hidden" name="id" value={user.id} />
                  <button className={styles.rowButton} type="submit">
                    Reset password
                  </button>
                </form>
                <form action={setDisabledAction}>
                  <input type="hidden" name="id" value={user.id} />
                  <input
                    type="hidden"
                    name="next"
                    value={user.disabled ? "false" : "true"}
                  />
                  <button className={styles.rowButton} type="submit">
                    {user.disabled ? "Enable" : "Disable"}
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}

      <h2 className={styles.h2}>Add an account</h2>
      <form action={createUserAction} className={styles.createForm}>
        <label className={styles.field} htmlFor="user-name">
          <span className={styles.fieldLabel}>Name</span>
          <input
            className={styles.input}
            id="user-name"
            name="name"
            type="text"
            required
          />
        </label>
        <label className={styles.field} htmlFor="user-email">
          <span className={styles.fieldLabel}>Email</span>
          <input
            className={styles.input}
            id="user-email"
            name="email"
            type="email"
            autoComplete="off"
            required
          />
        </label>
        <label className={styles.field} htmlFor="user-role">
          <span className={styles.fieldLabel}>Role</span>
          <select className={styles.input} id="user-role" name="role" required>
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </label>
        <button className={styles.submit} type="submit">
          Create account
        </button>
        {/* There is no password field, and that is the design: no session and no
            operator types a password into this form. The app generates one and
            shows it once. */}
        <p className={styles.note}>
          A password is generated and displayed once. There is no field for one
          here.
        </p>
      </form>

      <h2 className={styles.h2}>What each role reaches</h2>
      <ul className={styles.rows}>
        {ROLES.map((role) => (
          <li key={role} className={styles.row}>
            <div className={styles.rowHead}>
              <span className={styles.meta}>{role}</span>
              <p className={styles.rowNote}>{ROLE_DESCRIPTIONS[role]}</p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
