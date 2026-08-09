import { notFound } from "next/navigation";
import { EditorPane } from "@/components/admin/editor/EditorPane";
import { categoriesFor } from "@/lib/admin/categories.mjs";
import { requirePane } from "@/lib/admin/guard";
import { caseStudyById } from "@/lib/db/content";
import { revisionsFor } from "@/lib/db/revisions";
import { publishedPaths } from "@/lib/published-routes";
import {
  changeSlugAction,
  restoreRevisionAction,
  saveBodyAction,
  saveMetaAction,
} from "../../articles/actions";

/**
 * The case-study editor — design §4's "works for articles AND case studies",
 * and R-25b.3's three taxonomy dropdowns.
 *
 * THE SAME PANE, NOT A SECOND ONE. The two types differ by the structured
 * case-study fields and by nothing a writer touches, so the surface is shared
 * and the differences are parameters. What differs here: the category list is
 * the engagement pillars rather than the editorial types (R-25b.2), and the
 * writes go to `case_studies`.
 *
 * R-25b.3 IS THE REASON THIS ROUTE EXISTS AT ALL RIGHT NOW. The nine imported
 * studies carry no industry, platform or discipline values, and until this
 * pane existed there was no way for Sumeet or Raphy to give them any from a
 * browser. NO SESSION ASSIGNS THEM: round 25b forbids it, and canon A5's
 * enforcement applies to publishes made after real values exist.
 */
export const dynamic = "force-dynamic";

export default async function CaseStudyEditorRoute({
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
  }>;
}) {
  await requirePane("caseStudies");
  const { id } = await params;
  const row = await caseStudyById(id);
  if (!row) notFound();
  const revisions = await revisionsFor("case_study", id);

  async function saveBody(body: unknown): Promise<void> {
    "use server";
    await saveBodyAction("case_study", id, body);
  }

  return (
    <EditorPane
      categories={categoriesFor("case_study")}
      notice={await searchParams}
      changeSlugAction={changeSlugAction}
      knownPaths={await publishedPaths()}
      restoreRevisionAction={restoreRevisionAction}
      revisions={revisions}
      row={row}
      saveBody={saveBody}
      saveMetaAction={saveMetaAction}
      type="case_study"
    />
  );
}
