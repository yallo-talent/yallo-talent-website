"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { legacySourcesFor } from "@/data/redirects.mjs";
import { ADMIN_ROUTES } from "@/lib/admin/config";
import {
  blockingErrors,
  unpublishRefusal,
  validateForPublish,
  warnings,
} from "@/lib/admin/content-validation";
import { assertPane } from "@/lib/admin/guard";
import { articleById, caseStudyById } from "@/lib/db/content";
import {
  type ContentType,
  changeSlug,
  restoreRevision,
  saveBody,
  saveDraft,
  saveFront,
  setStatus,
} from "@/lib/db/content-write";
import { publishedPaths } from "@/lib/published-routes";

/**
 * The Articles pane's writes, and the case-study pane's, in one module because
 * they are the same three acts on two tables.
 *
 * WHAT REPLACED WHAT. Round 23 sent every write out as a pull request that CI
 * validated and GitHub auto-merged. Canon A2 removed that: a publish now writes
 * one row and revalidates, and the rules CI held moved into
 * `validateForPublish`.
 *
 * NOTHING VALIDATES BY REFUSING — R-26.1. The rules run continuously in the
 * editor, again on the publish sheet, and again nightly over what is already
 * live; none of them stops a save or a publish. The guard still runs on every
 * action below, because a server action is a POST endpoint with a public URL
 * and having rendered the pane once authorises nothing later. Authorisation and
 * editorial judgement are different things, and only one of them was relaxed.
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
 * Publish, or take back.
 *
 * NO VALIDATION RULE REFUSES ANY MORE — R-26.1. The rules still run, and what
 * they find is carried back as a notice so the person who published knows what
 * they published over; the publish sheet showed them the same list one click
 * earlier. The single refusal left in this action is the unpublish guard, which
 * is link integrity rather than editorial judgement.
 *
 * IT CAN RETURN TO THE EDITOR OR TO THE LIST. The list's row buttons want the
 * list back; the editor's publish sheet wants the editor back, with the live URL
 * on screen. One action either way, because two publish paths is two places for
 * the rules to be consulted differently.
 */
export async function setStatusAction(formData: FormData): Promise<void> {
  const type = String(formData.get("type") ?? "") as ContentType;
  if (type !== "article" && type !== "case_study") {
    back(ADMIN_ROUTES.root, { err: "Unknown content type." });
  }
  const signed = await assertPane(PANE_FOR[type]);

  const id = String(formData.get("id") ?? "");
  /* Not a URL from the form. A returnTo carrying an arbitrary path would be an
     open redirect on an authenticated POST; this is a flag, and the two
     destinations are composed here from values this module already owns. */
  const route =
    String(formData.get("returnTo") ?? "") === "editor" && id !== ""
      ? `${ROUTE_FOR[type]}/${id}`
      : ROUTE_FOR[type];

  const next = String(formData.get("next") ?? "");
  if (next !== "published" && next !== "draft" && next !== "archived") {
    back(route, { err: "Unknown status." });
  }

  const row =
    type === "article" ? await articleById(id) : await caseStudyById(id);
  if (!row) back(route, { err: "No such piece." });

  /* R-25b.4: A CASE STUDY A LEGACY URL NAMES CANNOT BE TAKEN DOWN.
     Unpublishing turns every legacy URL aimed at it into a two-hop chain —
     the legacy path 301s to /case-studies/<slug>, which then redirects to the
     hub because the row is no longer published. `check:redirects` notices on
     the next full CI lane, and the window until then is long enough for a
     person to open the URL. The refusal names the URL, because "a legacy URL
     points here" is a message that sends somebody to ask. */
  const stranded = unpublishRefusal(type, next, row.slug, legacySourcesFor);
  if (stranded) back(route, { err: stranded });

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
    /* NOTHING REFUSES — R-26.1. `blockingErrors` is still consulted, and still
       asserted to be empty, because a publish path that stopped consulting
       severity at all is a publish path where reinstating a refusal means
       finding this call site again. It returns nothing today, and the spec
       watches it return nothing.

       THE WARNINGS ARE NOT SWALLOWED. They were live in the editor while the
       piece was being written and listed on the publish sheet one click ago;
       they come back with the redirect so the person who published can see, on
       the page they land on, what went out with it. */
    const blocking = blockingErrors(errors);
    const warned = [...blocking, ...warnings(errors)];
    if (warned.length > 0) {
      await setStatus(type, id, next, signed);
      back(route, {
        [next]: row.slug,
        warned: `${warned.length} warning(s) published with it: ${warned
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
 * Autosave for the two fields that moved onto the canvas: the title and the
 * subtitle, R-26.5.
 *
 * ONE VALUE, NOT A SECOND COPY. The subtitle IS the summary column. R-26.5 is
 * explicit that it maps to the existing field with no duplicate storage, so the
 * drawer no longer carries either of these two and `saveMetaAction` no longer
 * writes them. Two forms that both own a column is how the metadata save came
 * to be able to revert what somebody had just typed.
 *
 * SAME SHAPE AS `saveBodyAction` AND FOR THE SAME REASON. It is called from a
 * debounce as the writer types, so it takes values rather than FormData and
 * does not redirect: a redirect every few seconds would take the caret with it.
 *
 * IT WRITES TWO COLUMNS AND NOTHING ELSE. `saveDraft` would rewrite the whole
 * row, including a body that the editor's own autosave may have moved on from
 * in the meantime.
 */
export async function saveFrontAction(
  type: ContentType,
  id: string,
  front: { title: string; summary: string },
): Promise<void> {
  if (type !== "article" && type !== "case_study") {
    throw new Error("Unknown content type.");
  }
  const signed = await assertPane(PANE_FOR[type]);
  await saveFront(type, id, front, signed);
  revalidatePath(`${ROUTE_FOR[type]}/${id}`);
  revalidatePath(`/admin/preview/${type}/${id}`);
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
 * The drawer's form: everything on the piece that is neither the body nor the
 * two fields that live on the canvas.
 *
 * THREE WRITERS, THREE DISJOINT SETS OF COLUMNS. Two writers of one column that
 * overlap will overwrite each other, and here the writers are the same person
 * in two halves of one screen. The body belongs to the editor's autosave; the
 * title and the summary belong to the canvas's autosave since R-26.5 moved them
 * there; everything else belongs here. This action reads all three of those
 * columns from the stored row rather than from the form, so submitting the
 * drawer can never revert a sentence typed a moment ago in the canvas.
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
        /* NOT TAKEN FROM THIS FORM, and they are not in it. R-26.5 put the
           title and the subtitle on the canvas, where they autosave; the
           subtitle is this same summary column, stored once. */
        title: row.title,
        summary: row.summary,
        category: String(formData.get("category") ?? "").trim(),
        /* The body is NOT taken from this form either. It is the editor's, and
           a metadata save that carried a stale copy of it would silently undo
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
