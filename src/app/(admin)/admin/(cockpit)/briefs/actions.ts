"use server";

import { redirect } from "next/navigation";
import { ADMIN_ROUTES } from "@/lib/admin/config";
import { isFunnelState } from "@/lib/admin/funnel";
import { assertCapability } from "@/lib/admin/guard";
import { setFunnel } from "@/lib/db/funnel";

/**
 * The funnel's only write — cockpit-v3 §11, round 26 item B.
 *
 * `briefsWrite`, NOT `briefs`. Round 25 named the capability before any write
 * path existed, with the reason recorded: "so that when one arrives it arrives
 * against an existing admin-only entry rather than inheriting the read rule by
 * accident." This is that write path, and it honours the entry rather than
 * widening it. The consequence is worth stating plainly because it is a real
 * one: ops can read every lead and export the view, and cannot move a lead
 * through the pipeline. Whether ops should be able to is Sumeet's call, and it
 * is one line in `CAPABILITY_ROLES` either way.
 *
 * `submissions` IS NOT TOUCHED. Everything below writes the sidecar. Round 26 §5
 * forbids a schema change to the capture table and this respects the spirit as
 * well as the letter: the capture path and the sales path never contend for a
 * row.
 *
 * THE FILTERS SURVIVE THE WRITE. The pane's whole state is in the URL, so the
 * form carries it back and the redirect restores it. A state change that
 * dropped somebody out of "New, oldest first" and back to an unfiltered list is
 * a state change that costs them their place.
 */
function back(params: Record<string, string>): never {
  const query = new URLSearchParams(params).toString();
  redirect(query ? `${ADMIN_ROUTES.briefs}?${query}` : ADMIN_ROUTES.briefs);
}

export async function setFunnelAction(formData: FormData): Promise<void> {
  const actor = await assertCapability("briefsWrite");

  const id = String(formData.get("id") ?? "").trim();
  if (id === "") back({ err: "No lead was named." });

  /* Whatever the pane was filtered to, carried through the POST so the
     redirect can put the operator back where they were. */
  const keep: Record<string, string> = {};
  for (const key of ["state", "owner", "source", "q", "from", "to", "view"]) {
    const value = String(formData.get(`f_${key}`) ?? "").trim();
    if (value !== "") keep[key] = value;
  }

  const patch: Parameters<typeof setFunnel>[1] = {};

  const nextState = String(formData.get("state") ?? "").trim();
  if (nextState !== "") {
    if (!isFunnelState(nextState)) {
      back({ ...keep, err: `"${nextState}" is not a pipeline state.` });
    }
    patch.state = nextState;
  }

  /* Present-but-empty is "unassign", absent is "leave alone". The two are
     different acts and one control has to be able to express both. */
  if (formData.has("ownerEmail")) {
    patch.ownerEmail = String(formData.get("ownerEmail") ?? "").trim();
  }

  if (formData.has("note")) {
    patch.note = String(formData.get("note") ?? "").trim();
  }

  if (Object.keys(patch).length === 0) {
    back({ ...keep, err: "Nothing to change." });
  }

  try {
    await setFunnel(id, patch, actor);
  } catch (err) {
    back({ ...keep, err: `Not saved: ${(err as Error).message}` });
  }
  back({ ...keep, moved: id });
}
