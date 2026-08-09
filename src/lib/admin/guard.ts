import "server-only";
import { redirect } from "next/navigation";
import { auth } from "@/lib/admin/auth";
import { ADMIN_ROUTES } from "@/lib/admin/config";
import {
  type Capability,
  canDo,
  canSee,
  landingFor,
  type Pane,
  type Role,
} from "@/lib/admin/roles";

/**
 * The two layers of enforcement, round 23 §3.
 *
 * Layer one is `requirePane`, called by a pane's own server component before it
 * renders or queries anything. Layer two is `assertPane` / `assertCapability`,
 * called by every server action at the top of its body.
 *
 * WHY BOTH, when the route guard already ran. A server action is a POST endpoint
 * with a public URL, reachable by anyone who has the action id from a page they
 * were once allowed to see. Nothing about having rendered a page earlier
 * authorises the action later, and the route guard does not run on the action's
 * request. A UI that hides a link is not access control, and neither is a route
 * guard on a different request.
 *
 * TWO SHAPES, DELIBERATELY. The page guard REDIRECTS, because a person who
 * followed a link to a pane they cannot see should land somewhere useful rather
 * than on an error. The action guard THROWS, because there is no useful place to
 * send a POST and a redirect would look to the caller like the action succeeded.
 */

export type Signed = { email: string; name: string; role: Role };

/** The signed-in identity, or a redirect to sign-in. Nothing below this line in
    a pane runs — and therefore nothing queries — without a session. */
export async function requireSession(): Promise<Signed> {
  const session = await auth();
  const user = session?.user;
  if (!user?.role) redirect(ADMIN_ROUTES.signIn);
  return {
    email: user.email ?? "",
    name: user.name ?? "",
    role: user.role,
  };
}

/**
 * Layer one. A signed-in caller who may not see this pane goes to their own
 * landing page, not to sign-in: bouncing them to a sign-in form they are already
 * past reads as a broken session and invites them to try again forever.
 */
export async function requirePane(pane: Pane): Promise<Signed> {
  const signed = await requireSession();
  if (!canSee(signed.role, pane)) redirect(landingFor(signed.role));
  return signed;
}

/** Thrown by the action guards. Named so a caller can tell an authorisation
    refusal apart from a failure in the work the action was doing. */
export class NotPermittedError extends Error {
  constructor(what: string) {
    super(`Not permitted: ${what}`);
    this.name = "NotPermittedError";
  }
}

/** Layer two, for an action that belongs to a pane. */
export async function assertPane(pane: Pane): Promise<Signed> {
  const session = await auth();
  const user = session?.user;
  if (!user?.role || !canSee(user.role, pane)) {
    throw new NotPermittedError(pane);
  }
  return { email: user.email ?? "", name: user.name ?? "", role: user.role };
}

/** Layer two, for an action narrower than the pane that contains it. */
export async function assertCapability(
  capability: Capability,
): Promise<Signed> {
  const session = await auth();
  const user = session?.user;
  if (!user?.role || !canDo(user.role, capability)) {
    throw new NotPermittedError(capability);
  }
  return { email: user.email ?? "", name: user.name ?? "", role: user.role };
}
