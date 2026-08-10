"use server";

import { redirect } from "next/navigation";
import { ADMIN_ROUTES } from "@/lib/admin/config";
import { assertPane } from "@/lib/admin/guard";
import { archiveAsset } from "@/lib/db/media";

/**
 * The library's one write that is not an upload.
 *
 * ARCHIVE, NOT DELETE. Design §9 says the library "refuses deletion of anything
 * in use"; this schema goes further and has no delete at all, for the reason
 * 0005 gives: an object that is gone cannot come back when an article is
 * restored from a revision. The refusal itself lives in `archiveAsset`, next to
 * the usage query it depends on, so a second caller cannot reach the write
 * without passing the check.
 */
export async function archiveAssetAction(formData: FormData): Promise<void> {
  const signed = await assertPane("media");
  const id = String(formData.get("id") ?? "");
  try {
    await archiveAsset(id, signed);
  } catch (err) {
    redirect(
      `${ADMIN_ROUTES.media}?${new URLSearchParams({ err: (err as Error).message })}`,
    );
  }
  redirect(`${ADMIN_ROUTES.media}?${new URLSearchParams({ archived: "1" })}`);
}
