"use server";

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { redirect } from "next/navigation";
import {
  articlePath,
  newArticleSource,
  parseArticleFile,
  slugFromTitle,
  validateArticleDraft,
} from "@/lib/admin/article-draft";
import { writeScalar } from "@/lib/admin/case-study-draft";
import { ADMIN_ROUTES } from "@/lib/admin/config";
import { assertPane } from "@/lib/admin/guard";
import { publishArticle } from "@/lib/admin/publish";

/**
 * The Articles pane's writes. Admin and editor, re-checked in every one.
 *
 * NOTHING HERE WRITES THE WORKING TREE. Every action produces the whole file as
 * bytes and hands it to `publishArticle`, which opens a branch and a pull
 * request. The standing invariant is that nothing in the cockpit writes `main`
 * directly, and the way to keep it is to have no filesystem write path at all.
 *
 * VALIDATION RUNS BEFORE THE PULL REQUEST OPENS, in every one of these. A pull
 * request CI is certain to fail blocks auto-merge and has to be closed by hand,
 * so the failure belongs in the form where it can still be fixed.
 */

function back(params: Record<string, string>): never {
  redirect(
    `${ADMIN_ROUTES.articles}?${new URLSearchParams(params).toString()}`,
  );
}

const readSource = (slug: string): string =>
  readFileSync(join(process.cwd(), articlePath(slug)), "utf8");

/** Errors as one line, so the pane can show every one rather than the first. */
const asMessage = (errors: { field: string; message: string }[]): string =>
  errors.map((e) => `${e.field}: ${e.message}`).join(" · ");

export async function createArticleAction(formData: FormData): Promise<void> {
  await assertPane("articles");

  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();
  const minutes = Number.parseInt(
    String(formData.get("readingTimeMinutes") ?? ""),
    10,
  );

  if (title === "")
    back({ err: "A title is required; the slug is derived from it." });
  const slug = slugFromTitle(title);
  if (slug === "") {
    back({
      err: "That title reduces to an empty slug. It needs at least one letter or digit.",
    });
  }

  /* An existing file is never overwritten from here. The pull request would
     silently replace someone's article with a template. */
  try {
    readSource(slug);
    back({
      err: `${articlePath(slug)} already exists. Edit it instead, or choose a different title.`,
    });
  } catch {
    /* Not found is the expected case and the only one that continues. */
  }

  const source = newArticleSource({
    title,
    slug,
    date,
    category,
    summary,
    readingTimeMinutes:
      Number.isSafeInteger(minutes) && minutes > 0 ? minutes : 0,
  });

  const errors = validateArticleDraft(parseArticleFile(slug, source));
  if (errors.length > 0) back({ err: asMessage(errors) });

  const result = await publishArticle(
    slug,
    source,
    `add "${title}", unpublished`,
  );
  if (!result.ok) back({ err: result.error });
  back({ pr: String(result.prNumber), open: result.prUrl });
}

export async function setArticlePublishedAction(
  formData: FormData,
): Promise<void> {
  await assertPane("articles");

  const slug = String(formData.get("slug") ?? "");
  const next = String(formData.get("next") ?? "") === "true";

  let source: string;
  try {
    source = readSource(slug);
  } catch {
    back({
      err: `No file at ${articlePath(slug)}, so there is nothing to change.`,
    });
  }

  let written: string;
  try {
    written = writeScalar(source, "published", next);
  } catch (err) {
    back({ err: (err as Error).message });
  }

  /* Validated even for a one-boolean flip. Turning an article ON is exactly when
     an existing defect in it stops being private, so this is the moment the
     schema, the byline, the taxonomy slugs and the figures rule matter most. */
  const errors = validateArticleDraft(parseArticleFile(slug, written));
  if (errors.length > 0) back({ err: asMessage(errors) });

  const result = await publishArticle(
    slug,
    written,
    `${next ? "publish" : "unpublish"} ${slug}`,
  );
  if (!result.ok) back({ err: result.error });
  back({ pr: String(result.prNumber), open: result.prUrl });
}

export async function saveArticleAction(formData: FormData): Promise<void> {
  await assertPane("articles");

  const slug = String(formData.get("slug") ?? "");
  let source: string;
  try {
    source = readSource(slug);
  } catch {
    back({ err: `No file at ${articlePath(slug)}.` });
  }

  const body = String(formData.get("body") ?? "");
  let written = source;
  try {
    for (const field of ["title", "date", "category"] as const) {
      const raw = formData.get(field);
      if (raw === null) continue;
      written = writeScalar(written, field, String(raw).trim());
    }
    const minutes = Number.parseInt(
      String(formData.get("readingTimeMinutes") ?? ""),
      10,
    );
    if (Number.isSafeInteger(minutes)) {
      written = writeScalar(written, "readingTimeMinutes", minutes);
    }
    if (body.trim() !== "") {
      const { writeBody } = await import("@/lib/admin/case-study-draft");
      written = writeBody(written, body);
    }
  } catch (err) {
    back({ err: (err as Error).message });
  }

  const errors = validateArticleDraft(parseArticleFile(slug, written));
  if (errors.length > 0) back({ err: asMessage(errors) });

  const result = await publishArticle(slug, written, `edit ${slug}`);
  if (!result.ok) back({ err: result.error });
  back({ pr: String(result.prNumber), open: result.prUrl });
}
