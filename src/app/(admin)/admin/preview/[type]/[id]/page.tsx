import { notFound } from "next/navigation";
import styles from "@/components/blocks/editorial/EditorialLayout.module.css";
import { TiptapBody } from "@/components/blocks/editorial/TiptapBody";
import { requireSession } from "@/lib/admin/guard";
import { canSee } from "@/lib/admin/roles";
import { articleById, caseStudyById } from "@/lib/db/content";
import { revisionById } from "@/lib/db/revisions";
import { PreviewTheme } from "./PreviewTheme";

/**
 * A draft rendered in the real template, design §3 and §4.
 *
 * WHY THIS IS NOT A SECOND TEMPLATE. Design §4 asks for the preview to be "the
 * real article template", and the reason is not convenience: a second renderer
 * inside the cockpit would drift, and the whole estate has been bitten by
 * second copies of things. So this imports `TiptapBody` and
 * `EditorialLayout.module.css` — the same renderer and the same stylesheet the
 * published page uses. If the published article changes, this changes with it,
 * because there is nothing here to forget to update.
 *
 * IT IS NOT THE WHOLE PUBLIC PAGE, and that is deliberate rather than a
 * shortcut. The hero, the sources aside and the brief CTA are chrome the writer
 * is not editing, and at 360px inside a split pane they would push the body two
 * screens down — a preview whose first screen is a call to action is a preview
 * of the wrong thing. The BODY is rendered by the same code, which is the part
 * that has to be true.
 *
 * UNDER `/admin`, WHICH IS WHY THERE IS NO SIGNATURE. Design §3 describes a
 * signed preview URL so a draft can be shown to somebody without an account.
 * This is stricter, not looser: the route sits inside the admin surface, is
 * `noindex` by the middleware, absent from the sitemap and refused to an
 * anonymous request like every other pane. A shareable signed link is a
 * separate feature with its own expiry and revocation questions, and it is
 * named as 25c rather than half-built here.
 *
 * THE ROLE CHECK MATCHES THE PANE, not merely "signed in". An `ops` account
 * reaches briefs and no content, and a preview route that only checked for a
 * session would be the one hole in canon A4's matrix.
 */
export const dynamic = "force-dynamic";

export default async function PreviewRoute({
  params,
  searchParams,
}: {
  params: Promise<{ type: string; id: string }>;
  searchParams: Promise<{ theme?: string; revision?: string }>;
}) {
  const { type, id } = await params;
  if (type !== "article" && type !== "case_study") notFound();

  const signed = await requireSession();
  const pane = type === "article" ? "articles" : "caseStudies";
  if (!canSee(signed.role, pane)) notFound();

  const row =
    type === "article" ? await articleById(id) : await caseStudyById(id);
  if (!row) notFound();

  const q = await searchParams;

  /* A revision preview reads the revision's body and nothing else of it: the
     title and the fields shown are the row's current ones, because that is
     what restoring would produce. Showing the revision's stored title next to
     the current body would describe a state that has never existed. */
  let body = row.body;
  if (q.revision) {
    const rev = await revisionById(type, id, q.revision);
    if (!rev) notFound();
    body = rev.body as typeof row.body;
  }

  const theme = q.theme === "dark" ? "dark" : "light";

  return (
    <>
      <PreviewTheme theme={theme} />
      <article className={styles.page}>
        <section className={styles.section}>
          <div className={styles.wrap}>
            <div className={styles.sectionInner}>
              <h1>{row.title || "Untitled"}</h1>
              {row.summary ? (
                <p className={styles.heroLede}>{row.summary}</p>
              ) : null}
              <div className={styles.prose}>
                <TiptapBody doc={body} />
              </div>
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
