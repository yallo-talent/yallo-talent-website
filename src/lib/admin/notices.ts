import { legacySourcesFor } from "@/data/redirects.mjs";
import {
  type PublishError,
  validateForPublish,
} from "@/lib/admin/content-validation";
import type { ArticleRow } from "@/lib/db/content";
import type { ContentType } from "@/lib/db/content-write";

/**
 * What is wrong with what is ALREADY LIVE — the safety net R-26.1 puts in place
 * of the refusal it removed.
 *
 * WHY THIS HAD TO EXIST BEFORE THE REFUSAL COULD GO. Until R-26.1 the publish
 * action refused an unsourced figure and a rate, so neither could reach a
 * reader. Sumeet's ruling removes that, and records the consequence plainly:
 * both can now reach the public site past a warning. A warning at the moment of
 * publishing is seen once, by one person, who may be publishing at speed. So
 * the same rules run again over everything that is published, on a cadence, and
 * the findings are put where the editorial team already looks.
 *
 * ONE COMPUTATION, TWO CALLERS, NO STORED COPY. The pane calls this on every
 * render over the live rows; `scripts/check-published-notices.mjs` calls the
 * same rules nightly in CI. There is deliberately no findings table: a stored
 * finding is a finding that can be stale, and the whole failure mode this
 * guards against is somebody trusting a clean panel that was computed before
 * the piece was edited. Recomputing is cheap because the rules are pure over
 * rows the pane has already read.
 *
 * IT IS SCOPED TO PUBLISHED ROWS ONLY. A draft carrying a half-written figure
 * is a draft. The strip answers one question — "is anything wrong with what a
 * reader can see right now" — and mixing drafts into it would bury the answer
 * under work in progress.
 *
 * NOTHING HERE WRITES, UNPUBLISHES OR EDITS ANYTHING. It reports. The decision
 * about a published piece is a person's, which is the same principle R-26.1
 * rests on.
 */

export interface Notice {
  contentType: ContentType;
  id: string;
  slug: string;
  title: string;
  /** Where a reader finds it, so the strip can link to the live page. */
  publicPath: string;
  /** Where an editor fixes it. */
  editPath: string;
  findings: PublishError[];
}

const PUBLIC_ROUTE: Record<ContentType, string> = {
  article: "/insights",
  case_study: "/case-studies",
};

const EDIT_ROUTE: Record<ContentType, string> = {
  article: "/admin/articles",
  case_study: "/admin/case-studies",
};

/**
 * The rules that matter MOST once a piece is live, in the order the strip shows
 * them.
 *
 * WHY AN ORDER AND NOT A SEVERITY. R-26.1 removed severity from the publish
 * decision, and reintroducing it here under another name would be the ruling
 * undone in a helper. This is presentation: rule 1 (an unsourced figure) and
 * rule 4 (a rate or fee) are the two the ruling names as the consequence it
 * accepts, so they sort to the top of a strip that a person reads top-down. A
 * long meta description is worth fixing and is not worth reading first.
 */
const FIRST_TO_READ = [1, 4];

function readingOrder(a: PublishError, b: PublishError): number {
  const rank = (e: PublishError) => {
    const at = FIRST_TO_READ.indexOf(e.rule);
    return at === -1 ? FIRST_TO_READ.length : at;
  };
  return rank(a) - rank(b) || a.rule - b.rule;
}

/**
 * Re-validate every published row of one type.
 *
 * @param rows every row of this type, published or not; drafts are skipped here
 *   rather than by the caller, so no caller can forget to
 * @param knownPaths every path the site serves, for the internal-link rule
 */
export function noticesFor(
  contentType: ContentType,
  rows: ArticleRow[],
  knownPaths: ReadonlySet<string>,
): Notice[] {
  const out: Notice[] = [];
  for (const row of rows) {
    if (row.status !== "published") continue;
    const findings = validateForPublish(
      {
        contentType,
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
      knownPaths,
    );
    if (findings.length === 0) continue;
    out.push({
      contentType,
      id: row.id,
      slug: row.slug,
      title: row.title,
      publicPath: `${PUBLIC_ROUTE[contentType]}/${row.slug}`,
      editPath: `${EDIT_ROUTE[contentType]}/${row.id}`,
      findings: [...findings].sort(readingOrder),
    });
  }
  /* Pieces carrying one of the two the ruling names come first, then the rest,
     each group by title so the list is stable between renders. */
  return out.sort((a, b) => {
    const weight = (n: Notice) =>
      n.findings.some((f) => FIRST_TO_READ.includes(f.rule)) ? 0 : 1;
    return weight(a) - weight(b) || a.title.localeCompare(b.title, "en-GB");
  });
}

/**
 * Published case studies whose legacy addresses would strand if taken down.
 *
 * NOT A VALIDATION FINDING, and it is here because it is the other thing a
 * person needs to know before touching a live piece: the unpublish guard will
 * refuse, and knowing that before clicking is better than meeting it as a
 * refusal. `unpublishRefusal` is still the enforcement; this is the notice.
 */
export function tetheredStudies(rows: ArticleRow[]): string[] {
  return rows
    .filter((row) => row.status === "published")
    .filter((row) => legacySourcesFor(`/case-studies/${row.slug}`).length > 0)
    .map((row) => row.slug);
}
