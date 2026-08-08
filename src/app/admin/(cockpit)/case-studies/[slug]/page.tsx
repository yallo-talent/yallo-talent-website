import { readFileSync } from "node:fs";
import { join } from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  NOT_EDITABLE_HERE,
  parseStudyFile,
} from "@/lib/admin/case-study-draft";
import { ADMIN_ROUTES } from "@/lib/admin/config";
import { requirePane } from "@/lib/admin/guard";
import { studyPath } from "@/lib/admin/publish";
import styles from "../../../Admin.module.css";
import { EditStudyForm } from "./EditStudyForm";

/**
 * Edit one case study, and open a pull request for the change. Round 20 §2.2.
 *
 * THE VALIDATION RUNS BEFORE THE PULL REQUEST EXISTS, and that is the point of
 * the screen. §2.2: "a PR that CI will fail should be impossible to open from
 * the happy path". The draft is assembled, then put through `validateDraft` —
 * which imports the build's own `caseStudyFrontmatterSchema` rather than
 * paraphrasing it — and a draft with errors comes back to the form with one
 * message per field and nothing sent to GitHub. See ./actions.ts.
 *
 * `clientPublic` IS ENFORCED HERE, NOT ANNOUNCED. Every rendering surface gates
 * the client name and logo on the flag and none of them reads the title, deck,
 * excerpt or body, so a study with the flag false whose headline names the
 * client would publish that name at full size under a card labelled
 * confidential. This form refuses the draft and says which field carries the
 * name. It does not quietly rewrite the copy: anonymising someone's prose for
 * them is how a consent rule becomes a thing nobody knows is happening.
 *
 * WHAT IS NOT EDITABLE HERE, and why that is deliberate: `summary`, `sources`
 * and `metrics` are multi-line YAML, and the writer under this form edits
 * single-line scalars so a change to one field is a one-line diff for the human
 * reviewing the pull request. Widening it would turn every edit into a
 * whole-file re-serialisation.
 */
export const dynamic = "force-dynamic";

export default async function EditStudy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requirePane("caseStudies");
  const { slug } = await params;

  let source: string;
  try {
    source = readFileSync(join(process.cwd(), studyPath(slug)), "utf8");
  } catch {
    notFound();
  }

  const draft = parseStudyFile(slug, source);
  const fm = draft.frontmatter;
  const text = (field: string) =>
    typeof fm[field] === "string" ? (fm[field] as string) : "";

  return (
    <>
      <p className={styles.meta}>
        <Link href={ADMIN_ROUTES.caseStudies}>Back to case studies</Link>
      </p>
      <h1 className={styles.h1}>Edit study</h1>
      <p className={styles.meta}>{studyPath(slug)}</p>
      <p className={styles.lede}>
        Saving opens a pull request against this one file. Nothing is written to{" "}
        <code>main</code> and nothing is merged from here. The draft is checked
        against the same schema the build enforces before any pull request
        opens, so a change CI would reject does not become one.{" "}
        <strong>{NOT_EDITABLE_HERE.join(", ")}</strong> are multi-line YAML and
        are edited in the file itself.
      </p>

      <EditStudyForm
        slug={slug}
        values={{
          title: text("title"),
          cardTitle: text("cardTitle"),
          deck: text("deck"),
          excerpt: text("excerpt"),
          client: text("client"),
          region: text("region"),
          engagement: text("engagement"),
          category: text("category"),
        }}
        body={draft.body}
        clientPublic={fm.clientPublic === true}
        published={fm.published !== false}
      />
    </>
  );
}
