"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ADMIN_ROUTES } from "@/lib/admin/config";
import { validateForPublish } from "@/lib/admin/content-validation";
import { assertPane } from "@/lib/admin/guard";
import { articleById, caseStudyById } from "@/lib/db/content";
import {
  type ContentType,
  changeSlug,
  restoreRevision,
  saveBody,
  saveDraft,
  setStatus,
} from "@/lib/db/content-write";
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
        canonicalUrl: null,
        ogImageUrl: null,
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
        contentType: type,
        category: row.category,
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

/**
 * Autosave. Writes the body, and nothing else.
 *
 * NOT A FORM ACTION. The editor calls it directly with the TipTap document, so
 * there is no FormData to unpack and no redirect afterwards — a redirect every
 * few seconds would take the writer's caret with it. It returns the computed
 * counts so the surface reports what the database now holds rather than what
 * the client believed it sent.
 *
 * THE GUARD RUNS ON EVERY CALL. A server action is a POST endpoint with a
 * public URL; having rendered the editor once authorises nothing later.
 */
export async function saveBodyAction(
  type: ContentType,
  id: string,
  body: unknown,
): Promise<{ words: number; minutes: number }> {
  if (type !== "article" && type !== "case_study") {
    throw new Error("Unknown content type.");
  }
  const signed = await assertPane(PANE_FOR[type]);
  const counts = await saveBody(type, id, body, signed);
  /* The preview iframe is a separate document reading the same row, so the
     editor route's own cache has to be invalidated or the preview reloads
     into whatever was there before. */
  revalidatePath(`${ROUTE_FOR[type]}/${id}`);
  revalidatePath(`/admin/preview/${type}/${id}`);
  return counts;
}

/**
 * Move a published piece's URL, writing the redirect.
 *
 * A SEPARATE ACTION FROM THE FIELDS FORM, and deliberately a deliberate act.
 * Design §6 freezes the slug at first publish and writes a redirect if it ever
 * changes; both halves are true at once only if there is exactly one path that
 * moves a URL and it always writes the redirect. Making it its own form also
 * means nobody moves a live URL by tabbing through a field on their way to
 * saving a meta description.
 */
export async function changeSlugAction(formData: FormData): Promise<void> {
  const type = String(formData.get("type") ?? "") as ContentType;
  if (type !== "article" && type !== "case_study") {
    back(ADMIN_ROUTES.root, { err: "Unknown content type." });
  }
  const signed = await assertPane(PANE_FOR[type]);
  const id = String(formData.get("id") ?? "");
  const next = String(formData.get("newSlug") ?? "").trim();
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(next)) {
    back(`${ROUTE_FOR[type]}/${id}`, {
      err: `"${next}" is not a slug. Lower case, numbers and single hyphens.`,
    });
  }
  let moved: { from: string; to: string };
  try {
    moved = await changeSlug(type, id, next, signed);
  } catch (err) {
    const message = (err as Error).message ?? "";
    if (message.includes("duplicate key") || message.includes("_slug_lower_")) {
      back(`${ROUTE_FOR[type]}/${id}`, {
        err: `There is already a piece at ${ROUTE_FOR[type] === ADMIN_ROUTES.articles ? "/insights" : "/case-studies"}/${next}.`,
      });
    }
    back(`${ROUTE_FOR[type]}/${id}`, {
      err: `The URL was not changed: ${message}`,
    });
  }
  back(`${ROUTE_FOR[type]}/${id}`, { moved: `${moved.from} → ${moved.to}` });
}

/** Put a previous revision back. Itself recorded as a revision. */
export async function restoreRevisionAction(formData: FormData): Promise<void> {
  const type = String(formData.get("type") ?? "") as ContentType;
  if (type !== "article" && type !== "case_study") {
    back(ADMIN_ROUTES.root, { err: "Unknown content type." });
  }
  const signed = await assertPane(PANE_FOR[type]);
  const id = String(formData.get("id") ?? "");
  const revisionId = String(formData.get("revisionId") ?? "");
  try {
    await restoreRevision(type, id, revisionId, signed);
  } catch (err) {
    back(`${ROUTE_FOR[type]}/${id}`, {
      err: `Not restored: ${(err as Error).message}`,
    });
  }
  back(`${ROUTE_FOR[type]}/${id}`, { restored: "1" });
}

/**
 * The metadata form: everything on the piece that is not the body.
 *
 * SEPARATE FROM THE BODY on purpose, and the same reason autosave is separate:
 * two writers of one row that overlap will overwrite each other, and here the
 * two writers are the same person in two halves of one screen. This one owns
 * the fields; autosave owns the body.
 */
export async function saveMetaAction(formData: FormData): Promise<void> {
  const type = String(formData.get("type") ?? "") as ContentType;
  if (type !== "article" && type !== "case_study") {
    back(ADMIN_ROUTES.root, { err: "Unknown content type." });
  }
  const signed = await assertPane(PANE_FOR[type]);
  const id = String(formData.get("id") ?? "");
  const row =
    type === "article" ? await articleById(id) : await caseStudyById(id);
  if (!row) back(ROUTE_FOR[type], { err: "No such piece." });

  const values = (name: string): string[] =>
    formData
      .getAll(name)
      .map(String)
      .filter((v) => v !== "");

  /* THE SLUG FREEZES AT FIRST PUBLISH — design §6. A piece that has never
     published has no URL anybody holds, so its slug is an ordinary field; once
     it has, the URL is out in the world and moving it silently is how a link
     somebody sent a client stops working. The field is read-only in the pane
     from that moment, and this is the server half of that: whatever arrives in
     the form is discarded in favour of what is stored. A disabled input is a
     hint to a browser, not a rule, and this action is a public POST endpoint. */
  const frozen = row.firstPublishedAt !== null;
  const submitted = String(formData.get("slug") ?? "").trim();
  const slug = frozen ? row.slug : submitted;
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    back(`${ROUTE_FOR[type]}/${id}`, {
      err: `"${slug}" is not a slug. Lower case, numbers and single hyphens.`,
    });
  }

  const meta = (name: string): string | null => {
    const raw = formData.get(name);
    if (raw === null) return null;
    const value = String(raw).trim();
    /* Null means "derive it" and empty string means "the author cleared it".
       0005_content.sql made the columns nullable for exactly this distinction,
       and collapsing the two here would throw it away. */
    return value === "" ? null : value;
  };

  try {
    await saveDraft(
      {
        type,
        id,
        slug,
        title: String(formData.get("title") ?? "").trim(),
        summary: String(formData.get("summary") ?? "").trim(),
        category: String(formData.get("category") ?? "").trim(),
        /* The body is NOT taken from this form. It is the editor's, and a
           metadata save that carried a stale copy of it would silently undo
           whatever was typed since the page loaded. */
        body: row.body,
        industry: values("industry"),
        platform: values("platform"),
        discipline: values("discipline"),
        sources: row.sources,
        metaTitle: meta("metaTitle"),
        metaDescription: meta("metaDescription"),
        canonicalUrl: meta("canonicalUrl"),
        ogImageUrl: meta("ogImageUrl"),
      },
      signed,
    );
  } catch (err) {
    back(`${ROUTE_FOR[type]}/${id}`, {
      err: `Not saved: ${(err as Error).message}`,
    });
  }
  back(`${ROUTE_FOR[type]}/${id}`, { saved: "1" });
}
