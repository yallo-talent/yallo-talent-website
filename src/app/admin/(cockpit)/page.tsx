import { redirect } from "next/navigation";
import { ADMIN_ROUTES } from "@/lib/admin/config";

/**
 * `/admin` has no content of its own.
 *
 * A dashboard of counts would be a fourth surface answering no question the three
 * panes do not answer better, and the complaint this cockpit exists to settle was
 * sprawl. The briefs pane is what gets opened when something has gone wrong, so
 * it is what opens.
 */
export const dynamic = "force-dynamic";

export default function AdminIndex() {
  redirect(ADMIN_ROUTES.briefs);
}
