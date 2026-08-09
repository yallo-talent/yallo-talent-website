import { notFound } from "next/navigation";
import { EditorPane } from "@/components/admin/editor/EditorPane";
import { categoriesFor } from "@/lib/admin/categories.mjs";
import { requirePane } from "@/lib/admin/guard";
import { articleById } from "@/lib/db/content";
import { revisionsFor } from "@/lib/db/revisions";
import { publishedPaths } from "@/lib/published-routes";
import {
  changeSlugAction,
  restoreRevisionAction,
  saveBodyAction,
  saveFrontAction,
  saveMetaAction,
  setStatusAction,
} from "../actions";

/**
 * The article editor, design §4.
 *
 * Round 25 said plainly that this did not exist yet and that saying so was
 * better than offering a control that would lose a writer's work. It exists now.
 */
export const dynamic = "force-dynamic";

export default async function ArticleEditorRoute({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    err?: string;
    saved?: string;
    restored?: string;
    moved?: string;
    warned?: string;
    published?: string;
    draft?: string;
    archived?: string;
  }>;
}) {
  await requirePane("articles");
  const { id } = await params;
  const row = await articleById(id);
  if (!row) notFound();
  const revisions = await revisionsFor("article", id);

  /* Bound on the server, so the client never learns which row it is allowed to
     write — it holds a callable, not an identifier it could change. The action
     re-checks the guard regardless. */
  async function saveBody(body: unknown): Promise<void> {
    "use server";
    await saveBodyAction("article", id, body);
  }

  /* Bound on the server for the same reason `saveBody` is: the client holds a
     callable, not an identifier it could change. The action re-checks the guard
     regardless. */
  async function saveFront(front: {
    title: string;
    summary: string;
  }): Promise<void> {
    "use server";
    await saveFrontAction("article", id, front);
  }

  return (
    <EditorPane
      categories={categoriesFor("article")}
      notice={await searchParams}
      changeSlugAction={changeSlugAction}
      knownPaths={await publishedPaths()}
      restoreRevisionAction={restoreRevisionAction}
      revisions={revisions}
      row={row}
      saveBody={saveBody}
      saveFront={saveFront}
      saveMetaAction={saveMetaAction}
      setStatusAction={setStatusAction}
      type="article"
    />
  );
}
