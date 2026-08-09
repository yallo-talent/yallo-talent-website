"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ADMIN_ROUTES } from "@/lib/admin/config";
import { assertCapability } from "@/lib/admin/guard";
import { isRole } from "@/lib/admin/roles";
import {
  createUser,
  enabledAdminCount,
  getUser,
  setDisabled,
  setPassword,
} from "@/lib/db/users";

/**
 * The Users pane's writes. Every one of them re-checks the role first.
 *
 * THE GENERATED PASSWORD IS SHOWN ONCE AND STORED NOWHERE. It is returned to the
 * pane through the redirect's query string so that the admin who just clicked
 * "create" can read it, and it exists nowhere else: not in a log line, not in an
 * email, not in the relay, not in this repository. Round 23 §7 forbids credential
 * entry by any session, and generating one the running app displays to its own
 * signed-in admin is the only path that does not put a password in a transcript.
 *
 * WHY THE QUERY STRING IS ACCEPTABLE HERE, given the general rule against
 * secrets in URLs: the response is `noindex`, the surface is behind the admin
 * guard, there is no Referer leak because the pane links nowhere external, and
 * the alternative — a server-side flash store — is a second place a plaintext
 * password lives. It is a one-time value the admin is expected to move to a
 * password manager immediately, and the pane says so.
 */

/* Returns `never`, so a call to it narrows the code after it the way an early
   return would. Without that every read below has to be optional-chained past a
   case that cannot happen. */
function back(params: Record<string, string>): never {
  redirect(`${ADMIN_ROUTES.users}?${new URLSearchParams(params).toString()}`);
}

/* 18 random bytes, base64url. Not a memorable passphrase: it is typed once into
   a password manager and then changed by its owner. */
const generatePassword = (): string => randomBytes(18).toString("base64url");

export async function createUserAction(formData: FormData): Promise<void> {
  await assertCapability("usersManage");

  const email = String(formData.get("email") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "");

  if (!email.includes("@")) back({ err: "That is not an email address." });
  if (name === "")
    back({
      err: "A name is required: an account with no name is a row nobody can identify later.",
    });
  if (!isRole(role)) back({ err: "That is not one of the three roles." });

  const password = generatePassword();
  try {
    await createUser({ email, name, role, password });
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
  back({ created: email, password });
}

export async function resetPasswordAction(formData: FormData): Promise<void> {
  await assertCapability("usersManage");

  const id = String(formData.get("id") ?? "");
  const user = await getUser(id);
  if (!user) back({ err: "No such account." });

  const password = generatePassword();
  await setPassword(id, password);

  revalidatePath(ADMIN_ROUTES.users);
  back({ reset: user.email, password });
}

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
  if (next && user.role === "admin" && !user.disabled) {
    const remaining = await enabledAdminCount();
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
