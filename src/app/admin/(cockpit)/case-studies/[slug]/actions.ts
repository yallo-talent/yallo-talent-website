"use server";

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  type DraftError,
  EDITABLE_FIELDS,
  parseStudyFile,
  validateDraft,
  writeBody,
  writeScalar,
} from "@/lib/admin/case-study-draft";
import { ADMIN_ROUTES } from "@/lib/admin/config";
import { assertPane } from "@/lib/admin/guard";
import { publishStudy, studyPath } from "@/lib/admin/publish";

/**
 * Save an edited study: validate, then open one pull request.
 *
 * IN ITS OWN FILE because the form that calls it is a client component, and a
 * client component may only import server actions from a module that declares
 * `"use server"` at the top.
 *
 * WHY THE ERRORS COME BACK AS A RETURN VALUE AND NOT IN THE URL. The first cut
 * redirected with the messages JSON-encoded in a query parameter. Each message
 * is a few hundred bytes of prose, so a draft with four problems produced a
 * kilobyte-plus URL that Auth.js then wrote into its `callback-url` cookie; and
 * the form on the other side of a redirect is rebuilt from the file on disk, so
 * the draft the operator had just typed was thrown away in order to tell them it
 * was wrong. Both are fixed by returning the errors instead.
 *
 * Watched, round 20: setting `clientPublic` false on a study whose title names
 * the client returns four errors naming title, cardTitle, excerpt and body, and
 * opens no pull request. An empty body returns one. Neither reaches GitHub.
 */
export interface SaveResult {
  errors: DraftError[];
}

export async function saveStudy(
  _previous: SaveResult,
  formData: FormData,
): Promise<SaveResult> {
  await assertPane("caseStudies");
  const slug = String(formData.get("slug") ?? "");

  let source: string;
  try {
    source = readFileSync(join(process.cwd(), studyPath(slug)), "utf8");
  } catch {
    return {
      errors: [
        {
          field: "slug",
          message: `No file at ${studyPath(slug)}, so there is nothing to edit.`,
        },
      ],
    };
  }

  let written = source;
  try {
    for (const field of EDITABLE_FIELDS) {
      const raw = formData.get(field);
      if (raw === null) continue;
      const value =
        field === "clientPublic" || field === "published"
          ? String(raw) === "true"
          : String(raw);
      /* Every field is written, not only the changed ones. An unchanged scalar
         written back identically produces no diff line at all, so there is
         nothing to gain from comparing first. */
      written = writeScalar(written, field, value);
    }
    const body = formData.get("body");
    if (body !== null) written = writeBody(written, String(body));
  } catch (err) {
    return {
      errors: [{ field: "frontmatter", message: (err as Error).message }],
    };
  }

  const errors = validateDraft(parseStudyFile(slug, written));
  if (errors.length) return { errors };

  const result = await publishStudy(slug, written, `edit ${slug}`);
  if (!result.ok)
    return { errors: [{ field: "github", message: result.error }] };

  revalidatePath(ADMIN_ROUTES.caseStudies);
  /* Only the success path leaves the page, and it carries nothing but a pull
     request number and a state word. */
  redirect(
    `${ADMIN_ROUTES.caseStudies}?moved=${encodeURIComponent(`${slug} edited`)}` +
      `&pr=${result.prNumber}&open=${result.autoMergeEnabled ? "automerge" : "waiting"}`,
  );
}
