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

/**
 * The drag-and-drop affordance's write, design §8.
 *
 * THE SAME WRITE PATH AS `moveAction`, which is the point: `reorderCaseStudies`
 * rewrites the whole sequence in one transaction, so a drag that moves one row
 * three places and a button that moves it one are the same act with a different
 * input. Nothing about the ordering changes because the affordance did.
 *
 * THE SUBMITTED ORDER IS CHECKED AGAINST WHAT EXISTS, not trusted. A dropped
 * list arrives as a form field, so it can name a slug that is not a study, omit
 * one, or repeat one. Any of those would write positions for a sequence nobody
 * saw. A permutation of exactly the current set is the only acceptable input,
 * and anything else is refused with what was wrong rather than partially
 * applied.
 */
export async function reorderAction(formData: FormData): Promise<void> {
  const signed = await assertPane("caseStudies");

  const submitted = String(formData.get("order") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s !== "");
  const current = (await allCaseStudies()).map((s) => s.slug);

  const same =
    submitted.length === current.length &&
    new Set(submitted).size === submitted.length &&
    submitted.every((slug) => current.includes(slug));
  if (!same) {
    back({
      err: `That order does not match the ${current.length} studies on this pane, so nothing was written. Reload and try again.`,
    });
  }
  if (submitted.every((slug, i) => slug === current[i])) {
    back({ moved: "Nothing moved." });
  }

  await reorderCaseStudies(submitted, signed);
  back({ moved: `${submitted.length} studies reordered in one save.` });
}
