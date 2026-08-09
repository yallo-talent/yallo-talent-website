"use server";

import { redirect } from "next/navigation";
import { ADMIN_ROUTES } from "@/lib/admin/config";
import { validateForPublish } from "@/lib/admin/content-validation";
import { assertPane } from "@/lib/admin/guard";
import { articleById, caseStudyById } from "@/lib/db/content";
import { type ContentType, saveDraft, setStatus } from "@/lib/db/content-write";
import { publishedPaths } from "@/lib/published-routes";

/**
 * The Articles pane's writes, and the case-study pane's, in one module because
 * they are the same three acts on two tables.
 *
 * WHAT REPLACED WHAT. Round 23 sent every write out as a pull request that CI
 * validated and GitHub auto-merged. Canon A2 removed that: a publish now writes
 * one row and revalidates, and the rules CI held are held HERE, in
 * `validateForPublish`, which refuses. That is the whole trade, and the reason
 * the validation has to be at least as strict as the CI it replaced.
 *
 * SAVING IS NEVER VALIDATED, PUBLISHING ALWAYS IS. Canon A2 again. The guard
 * runs on both, because a server action is a POST endpoint with a public URL and
 * having rendered the pane once authorises nothing later.
 */

function back(route: string, params: Record<string, string>): never {
  redirect(`${route}?${new URLSearchParams(params).toString()}`);
}

const ROUTE_FOR: Record<ContentType, string> = {
  article: ADMIN_ROUTES.articles,
  case_study: ADMIN_ROUTES.caseStudies,
};

const PANE_FOR = {
  article: "articles",
  case_study: "caseStudies",
} as const;

export async function createArticleAction(formData: FormData): Promise<void> {
  const signed = await assertPane("articles");

  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  if (title === "")
    back(ADMIN_ROUTES.articles, { err: "A title is required." });
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    back(ADMIN_ROUTES.articles, {
      err: `"${slug}" is not a slug. Lower case, numbers and single hyphens.`,
    });
  }

  /* A NEW ARTICLE IS ALWAYS A DRAFT, and this is not a parameter. Creating a
     piece and publishing it must never be the same act: canon A2 puts eight
     rules between a draft and a published page, and a create path that skipped
     them would be the pull-request bypass in a different costume. */
  try {
    await saveDraft(
      {
        type: "article",
        slug,
        title,
        summary: "",
        category: "",
        body: { type: "doc", content: [] },
        industry: [],
        platform: [],
        discipline: [],
        sources: [],
        metaTitle: null,
        metaDescription: null,
      },
      signed,
    );
  } catch (err) {
    const message = (err as Error).message ?? "";
    if (
      message.includes("articles_slug_lower_idx") ||
      message.includes("duplicate key")
    ) {
      back(ADMIN_ROUTES.articles, {
        err: `There is already an article at /insights/${slug}.`,
      });
    }
    back(ADMIN_ROUTES.articles, {
      err: `The draft was not created: ${message}`,
    });
  }
  back(ADMIN_ROUTES.articles, { created: slug });
}

/**
 * Publish, or take back. The eight refusals live on the publish side only.
 */
export async function setStatusAction(formData: FormData): Promise<void> {
  const type = String(formData.get("type") ?? "") as ContentType;
  if (type !== "article" && type !== "case_study") {
    back(ADMIN_ROUTES.root, { err: "Unknown content type." });
  }
  const signed = await assertPane(PANE_FOR[type]);
  const route = ROUTE_FOR[type];

  const id = String(formData.get("id") ?? "");
  const next = String(formData.get("next") ?? "");
  if (next !== "published" && next !== "draft" && next !== "archived") {
    back(route, { err: "Unknown status." });
  }

  const row =
    type === "article" ? await articleById(id) : await caseStudyById(id);
  if (!row) back(route, { err: "No such piece." });

  if (next === "published") {
    const known = new Set(await publishedPaths());
    const errors = validateForPublish(
      {
        title: row.title,
        summary: row.summary,
        metaTitle: row.metaTitle,
        metaDescription: row.metaDescription,
        body: row.body,
        sources: row.sources,
        industry: row.industry,
        platform: row.platform,
        discipline: row.discipline,
      },
      known,
    );
    if (errors.length > 0) {
      /* Every refusal names the field and the fault. "Validation failed" is a
         message that sends an author to ask somebody. */
      back(route, {
        err: `Not published. ${errors.length} rule(s) refused it: ${errors
          .map((e) => `[${e.field}] ${e.message}`)
          .join(" ")}`,
      });
    }
  }

  await setStatus(type, id, next, signed);
  back(route, { [next]: row.slug });
}
