"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ADMIN_ROUTES } from "@/lib/admin/config";
import { assertCapability } from "@/lib/admin/guard";
import { canAssignRole, canManageAccount, isRole } from "@/lib/admin/roles";
import {
  createUser,
  enabledManagerCount,
  getUser,
  setDisabled,
} from "@/lib/db/users";

/**
 * The Users pane's writes. Every one of them re-checks the role first.
 *
 * NO CREDENTIAL IS DISPLAYED, GENERATED FOR DISPLAY, OR REPORTED — R-28a.1 and
 * §2.4, superseding round 23 §7's display-once flow.
 *
 * That flow was carefully argued and it still failed, in the one way that
 * matters: on 13 Aug 2026 four accounts were created for real colleagues, the
 * generated values were shown once, were not captured, and all four people were
 * locked out of a cockpit they need daily. A credential whose only recovery is
 * "generate another and read it off the screen again" fails exactly when
 * somebody needs it.
 *
 * Creating an account is now a row and a sentence: the administrator tells the
 * person their address is live, and the person signs in by asking for a code.
 * Nothing is handed over, so nothing can be lost in the handing over. The query
 * string carries only which address was created, which is not a secret from the
 * signed-in admin who just typed it.
 */

/* Returns `never`, so a call to it narrows the code after it the way an early
   return would. Without that every read below has to be optional-chained past a
   case that cannot happen. */
function back(params: Record<string, string>): never {
  redirect(`${ADMIN_ROUTES.users}?${new URLSearchParams(params).toString()}`);
}

/**
 * A hash filler, and nothing else — R-28a.1 and §2.4.
 *
 * `users.password_hash` is NOT NULL, so a row must carry a hash. Nothing signs
 * in with this one: it is 18 random bytes that are hashed and then dropped on
 * the floor inside this function, never returned, never displayed, never
 * emailed, never logged. The account's real sign-in is the emailed code.
 *
 * IT IS NOT A CEREMONY. A column that must hold something is going to hold
 * something whatever this round does; the choice is between a value nobody can
 * guess and a value somebody chose, and only one of those is safe to leave
 * lying in a NOT NULL column for the life of the account.
 */
const unusableSecret = (): string => randomBytes(18).toString("base64url");

export async function createUserAction(formData: FormData): Promise<void> {
  const signed = await assertCapability("usersManage");

  const email = String(formData.get("email") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "");

  if (!email.includes("@")) back({ err: "That is not an email address." });
  if (name === "")
    back({
      err: "A name is required: an account with no name is a row nobody can identify later.",
    });
  if (!isRole(role)) back({ err: "That is not one of the four roles." });
  /* ONLY AN OWNER MAY MAKE AN OWNER. Canon A4 makes an owner undemotable, so an
     admin who could create one could mint an account nobody can take back. */
  if (!canAssignRole(signed.role, role)) {
    back({
      err: "Only an owner can create another owner. An owner cannot be demoted or disabled by anyone, so an account that could hand that out would be handing out something it could never take back.",
    });
  }

  try {
    await createUser({ email, name, role, password: unusableSecret() });
  } catch (err) {
    const message = (err as Error).message ?? "";
    /* The unique index on lower(email) is the check. Reporting it as a
       duplicate rather than as a database error is the difference between a
       pane that can be used and one that has to be debugged. */
    if (
      message.includes("users_email_lower_idx") ||
      message.includes("duplicate key")
    ) {
      back({ err: `There is already an account for ${email}.` });
    }
    back({ err: `The account was not created: ${message}` });
  }

  revalidatePath(ADMIN_ROUTES.users);
  back({ created: email });
}

/* resetPasswordAction IS GONE, and its absence is the feature — R-28a.1, §2.4.
   It existed to generate a credential and show it on screen, which is the exact
   flow that locked four colleagues out on 13 Aug 2026: the value was displayed
   once, was not captured, and the only recovery offered was to do the same thing
   again. There is nothing to reset now. A person who cannot get in asks for a
   code, and if the code cannot be delivered that is an operational failure the
   sign-in page names by variable, not an account that needs taking over. */

export async function setDisabledAction(formData: FormData): Promise<void> {
  const signed = await assertCapability("usersManage");

  const id = String(formData.get("id") ?? "");
  const next = String(formData.get("next") ?? "") === "true";
  const user = await getUser(id);
  if (!user) back({ err: "No such account." });

  /**
   * The last enabled admin cannot be disabled, by anyone including themselves.
   *
   * Disabling it empties the table of everyone who can re-enable it, and if the
   * caller is that admin it also ends their own session, so the person who has
   * to fix it is locked out while fixing it. The env break-glass would still let
   * Sumeet in and that is not a reason to permit this: break-glass is for the
   * failure nobody chose, not for one the pane offered.
   *
   * `enabledAdminCount()` counts rows only, never the env identity — see the
   * note on that function for why.
   */
  if (!canManageAccount(signed.role, user.role)) {
    back({
      err: "The owner cannot be disabled or demoted by anyone, including an owner. Canon A4.",
    });
  }

  if (
    next &&
    (user.role === "admin" || user.role === "owner") &&
    !user.disabled
  ) {
    const remaining = await enabledManagerCount();
    if (remaining <= 1) {
      const self = user.email.toLowerCase() === signed.email.toLowerCase();
      back({
        err: self
          ? "That is your own account and the last enabled admin. Create or enable another admin first, otherwise nobody can manage accounts and you cannot undo this."
          : "That is the last enabled admin. Create or enable another admin first, otherwise nobody can manage accounts.",
      });
    }
  }

  await setDisabled(id, next);
  revalidatePath(ADMIN_ROUTES.users);
  back({ [next ? "disabled" : "enabled"]: user.email });
}
