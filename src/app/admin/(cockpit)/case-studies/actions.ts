"use server";

import { redirect } from "next/navigation";
import { ADMIN_ROUTES } from "@/lib/admin/config";
import { assertPane } from "@/lib/admin/guard";
import { allCaseStudies } from "@/lib/db/content";
import { reorderCaseStudies } from "@/lib/db/content-write";

/**
 * The case-study order.
 *
 * THE WHOLE SEQUENCE IS REWRITTEN, not the two rows that swapped. A pairwise
 * swap depends on what the positions already were, so two rows that somehow
 * share a position stay stuck; rewriting the sequence from the list the pane
 * just rendered cannot. It is also what a drag-and-drop surface will send, so
 * the write path does not change when the affordance does.
 */
function back(params: Record<string, string>): never {
  redirect(
    `${ADMIN_ROUTES.caseStudies}?${new URLSearchParams(params).toString()}`,
  );
}

export async function moveAction(formData: FormData): Promise<void> {
  const signed = await assertPane("caseStudies");

  const slug = String(formData.get("slug") ?? "");
  const direction = String(formData.get("direction") ?? "");
  if (direction !== "up" && direction !== "down") {
    back({ err: "Unknown direction." });
  }

  const studies = await allCaseStudies();
  const order = studies.map((s) => s.slug);
  const from = order.indexOf(slug);
  if (from === -1) back({ err: "No such case study." });

  const to = direction === "up" ? from - 1 : from + 1;
  if (to < 0 || to >= order.length) {
    back({ err: "That study is already at the end of the order." });
  }

  const next = [...order];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved as string);

  await reorderCaseStudies(next, signed);
  back({ moved: `${slug} is now position ${to + 1} of ${next.length}.` });
}
