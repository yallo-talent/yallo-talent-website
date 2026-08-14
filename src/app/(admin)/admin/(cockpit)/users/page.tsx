import styles from "@/components/admin/Admin.module.css";
import { RowTitle } from "@/components/admin/RowTitle";
import { requirePane } from "@/lib/admin/guard";
import {
  canAssignRole,
  canManageAccount,
  ROLE_DESCRIPTIONS,
  ROLES,
} from "@/lib/admin/roles";
import { listUsers } from "@/lib/db/users";
import { createUserAction, setDisabledAction } from "./actions";

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
 * NO CREDENTIAL APPEARS ON THIS PANE — R-28a.1 and §2.4. Creating an account
 * creates a row and says so; the person signs in with an emailed one-time code.
 * The display-once password and the reset that regenerated it are both gone,
 * because that flow put four colleagues out of the live cockpit on 13 Aug 2026
 * when the value was shown, not captured, and could only be replaced by showing
 * another one.
 */
export const dynamic = "force-dynamic";

export default async function UsersPane({
  searchParams,
}: {
  searchParams: Promise<{
    err?: string;
    created?: string;
    disabled?: string;
    enabled?: string;
  }>;
}) {
  const signed = await requirePane("users");
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

      {q.created ? (
        <div className={styles.notice}>
          <p>
            <strong>Account created for {q.created}.</strong> Tell them the
            address is live. There is nothing to send: they sign in by asking
            the sign-in page for a one-time code, which arrives by email,
            expires in ten minutes and works once.
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
          No accounts yet. The environment credential still signs in as owner,
          which is what it is for.
        </p>
      ) : (
        <ul className={styles.rows}>
          {rows.map((user) => {
            /* THE ACTIONS ARE NOT RENDERED AT ALL for an account this one may
               not manage, and the guard in ./actions.ts refuses the same case
               anyway. A hidden button is not access control; two layers is the
               round-23 rule and it applies to the owner row like any other. */
            const manageable = canManageAccount(signed.role, user.role);
            return (
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
                  {manageable ? (
                    <>
                      {/* No reset control. There is no credential on this row
                          to reset: the account signs in with an emailed code
                          that it asks for itself. */}
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
                    </>
                  ) : (
                    <p className={styles.rowNote}>
                      The owner cannot be disabled, demoted or reset by any
                      account, including another owner. Canon A4.
                    </p>
                  )}
                </div>
              </li>
            );
          })}
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
            {ROLES.filter((role) => canAssignRole(signed.role, role)).map(
              (role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ),
            )}
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
