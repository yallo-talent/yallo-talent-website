import { redirect } from "next/navigation";
import { requireSession } from "@/lib/admin/guard";
import { landingFor } from "@/lib/admin/roles";

/**
 * `/admin` has no content of its own.
 *
 * A dashboard of counts would be a fourth surface answering no question the
 * panes do not answer better, and the complaint this cockpit exists to settle was
 * sprawl. What opens is the first pane the signed-in role can actually see.
 *
 * IT USED TO BE BRIEFS, UNCONDITIONALLY, and round 23 could not leave it there:
 * an editor may not read briefs, so the first editor to sign in would have been
 * redirected straight into a pane they are forbidden and bounced back out again.
 * A forbidden landing page reads as a broken account rather than a working one.
 */
export const dynamic = "force-dynamic";

export default async function AdminIndex() {
  const { role } = await requireSession();
  redirect(landingFor(role));
}
