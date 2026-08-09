import {
  capabilitiesIndex,
  industriesIndex,
  platformsIndex,
} from "@/data/l1/index";
import { categoriesFor } from "@/lib/admin/categories.mjs";
import { bannedVocabulary, rateFigures } from "@/lib/banned-vocabulary.mjs";
import { disallowedNodes } from "@/lib/tiptap/schema.mjs";
import { docToText, images, links } from "@/lib/tiptap/text.mjs";
import { unsourcedFigures } from "@/lib/unsourced-figures.mjs";

/**
 * The eight refusals canon A2 moves out of continuous integration and into the
 * publish action.
 *
 * WHAT CHANGED AND WHY IT HAD TO. Round 23 built a pull-request publishing path
 * whose quality bar was CI. R-C2 removed the pull request, so the bar moved
 * here, and it has to be AT LEAST AS STRICT — a rule that used to block a merge
 * and now blocks nothing is a rule that has been repealed by accident.
 *
 * SAVING A DRAFT IS NEVER BLOCKED. Every function below runs on the publish
 * transition only. A writer mid-sentence must not be arguing with a validator,
 * and a draft with a half-written figure is a draft, not a broken page.
 *
 * EVERY REFUSAL NAMES THE FIELD AND THE FAULT. "Validation failed" is a message
 * that sends an author to ask somebody; "the body carries 2 figures with no
 * matching source: 40%, AED 1.4 million" is a message they can act on without
 * leaving the editor.
 *
 * NOT `server-only`, deliberately. Every function here is pure over its inputs
 * and holds no secret, and marking it server-only would make it unreachable from
 * the spec that red-proves the eight refusals. A rule nobody can watch refusing
 * is worth less than a rule that could theoretically be imported by a client
 * component and never is.
 *
 * ALL EIGHT ARE RED-PROVEN in `e2e/publish-validation.spec.ts`, each with a
 * fixture the test creates and removes. A validation that has never been
 * watched refusing is a validation nobody has any reason to believe in.
 */

export interface PublishError {
  /** The A2 rule number, so the relay and the tests can name them individually. */
  rule: number;
  field: string;
  message: string;
  /** Set by `severityOf`; callers read this rather than re-deciding. */
  severity?: Severity;
}

export type Severity = "block" | "warn";

/**
 * THE TWO RULES THAT STILL REFUSE A PUBLISH — Sumeet's ruling, 9 August 2026,
 * amending canon A2.
 *
 * Canon A2 made all nine refuse and canon §9 called them "never weakened". This
 * narrows that, and the reasoning is his: nine blocking rules made editing an
 * imported study a fight, they arrived at publish time as one wall of text with
 * no way to act on it from the editor, and most of them are judgements rather
 * than facts. Every rule still RUNS, live and inline while a writer types; what
 * changed is which ones stop the piece going out.
 *
 * These two stop it, and the line between them and the rest is what gets
 * PUBLISHED rather than how tidy it is:
 *
 *   Rule 1, an unsourced figure. Canon §9's first principle is that nothing is
 *   invented, and a number with no source is the exact shape of that.
 *   Rule 4, a rate or fee. Canon §7 keeps commercial terms off public pages
 *   entirely; publishing one is a commercial disclosure, not a typo.
 *
 * Everything else warns: a banned word, a dead internal link, a long meta
 * description, a missing taxonomy value, a missing alt text, a wrong category.
 * Each is worth fixing and none of them is worth refusing a publish over when
 * the person publishing can see the warning and disagree.
 *
 * NOTHING HERE WEAKENS DETECTION. Every rule below still produces its finding
 * with the same message; `severityOf` decides only what a caller does with it.
 */
export const BLOCKING_RULES: ReadonlySet<number> = new Set([1, 4]);

export function severityOf(rule: number): Severity {
  return BLOCKING_RULES.has(rule) ? "block" : "warn";
}

/** The findings that refuse a publish. */
export function blockingErrors(errors: PublishError[]): PublishError[] {
  return errors.filter((e) => severityOf(e.rule) === "block");
}

/** The findings a writer should see and may overrule. */
export function warnings(errors: PublishError[]): PublishError[] {
  return errors.filter((e) => severityOf(e.rule) === "warn");
}

/** Canon §8. Written by the system, never a form field, and never an input. */
export const FIXED_BYLINE = "Yallo Talent";

/**
 * Length budgets. Title and summary are the site's existing schema budgets;
 * meta description is Google's practical truncation point rather than a hard
 * limit, which is why the message says "will be cut" rather than "is invalid".
 */
export const BUDGETS = {
  title: { min: 1, max: 100 },
  summary: { min: 40, max: 320 },
  metaTitle: { min: 0, max: 60 },
  metaDescription: { min: 0, max: 160 },
} as const;

const KNOWN = {
  industry: new Set(industriesIndex.map((e) => e.slug)),
  platform: new Set(platformsIndex.map((e) => e.slug)),
  discipline: new Set(capabilitiesIndex.map((e) => e.slug)),
} as const;

export interface PublishCandidate {
  /**
   * Which table this row belongs to — R-25b.2's rule 9 needs it.
   *
   * Optional, and it defaults to `article`, because every existing caller of
   * this function predates rule 9 and a required field would have made the
   * eight into a compile error rather than a nine. The two callers that matter
   * both pass it.
   */
  contentType?: "article" | "case_study";
  title: string;
  /** R-25b.2's rule 9 reads it; every other rule ignores it. */
  category?: string;
  summary: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  body: unknown;
  sources?: { claim?: string; source?: string }[];
  industry: string[];
  platform: string[];
  discipline: string[];
  /** Present only if a caller tried to set one. It is never a form field. */
  author?: string;
  byline?: string;
}

/**
 * @param candidate the row as it would be written
 * @param knownPaths every path the site publishes, for rule 3
 */
export function validateForPublish(
  candidate: PublishCandidate,
  knownPaths: ReadonlySet<string>,
): PublishError[] {
  const errors: PublishError[] = [];
  const prose = docToText(candidate.body);

  /* Not one of the eight, and it runs first: a body carrying a node the
     renderer cannot draw would publish a page with a hole in it, and the
     closed-set renderer would do that silently. */
  const bad = disallowedNodes(candidate.body);
  if (bad.length > 0) {
    errors.push({
      rule: 0,
      field: "body",
      message: `The body carries ${bad.length} thing(s) this template cannot render: ${bad.join(", ")}. Nothing is lost, because the draft keeps them, but a published page would show a gap where they are.`,
    });
  }

  // 1. Every figure in the body carries a matching source entry.
  const unsourced = unsourcedFigures(prose, candidate.sources);
  if (unsourced.length > 0) {
    errors.push({
      rule: 1,
      field: "sources",
      message: `${unsourced.length} figure(s) in the body have no matching source: ${unsourced.join(", ")}. Add the source, or take the figure out. An unattributed number is the one thing this site does not publish.`,
    });
  }

  // 2. No banned vocabulary per canon §2.
  const banned = bannedVocabulary(prose);
  if (banned.length > 0) {
    errors.push({
      rule: 2,
      field: "body",
      message: `Canon §2 banned vocabulary: ${banned.map((b) => `"${b.term}" in "${b.context}"`).join("; ")}. If an occurrence is load-bearing rather than filler, it belongs on the allow-list in src/lib/banned-vocabulary.mjs with its reason, not in the body.`,
    });
  }

  // 3. Every internal link resolves to a real route.
  const dead = links(candidate.body)
    .filter((href) => href.startsWith("/"))
    .map((href) => href.split("#")[0].split("?")[0])
    .filter((path) => path !== "" && !knownPaths.has(path));
  if (dead.length > 0) {
    errors.push({
      rule: 3,
      field: "body",
      message: `${dead.length} internal link(s) go nowhere: ${[...new Set(dead)].join(", ")}. A link to a route that does not exist is a 404 a reader finds before we do.`,
    });
  }

  // 4. No rate, fee or day-rate figure.
  const rates = rateFigures(prose);
  if (rates.length > 0) {
    errors.push({
      rule: 4,
      field: "body",
      message: `Canon §7: no rates, fees or percentages on public pages. Found: ${rates.join(", ")}. Rate bands live only inside the gated Programme Staffing Blueprint.`,
    });
  }

  // 5. Title, summary and meta description within their length budgets.
  const lengths: [string, string, { min: number; max: number }][] = [
    ["title", candidate.title, BUDGETS.title],
    ["summary", candidate.summary, BUDGETS.summary],
    ["metaTitle", candidate.metaTitle ?? "", BUDGETS.metaTitle],
    [
      "metaDescription",
      candidate.metaDescription ?? "",
      BUDGETS.metaDescription,
    ],
  ];
  for (const [field, value, budget] of lengths) {
    const n = value.trim().length;
    if (n < budget.min) {
      errors.push({
        rule: 5,
        field,
        message: `${field} is ${n} characters; it needs at least ${budget.min}.`,
      });
    } else if (n > budget.max) {
      errors.push({
        rule: 5,
        field,
        message: `${field} is ${n} characters, over the ${budget.max} budget. Search results cut it, and a cut sentence reads as a mistake.`,
      });
    }
  }

  // 6. Taxonomy values exist in the live taxonomy indexes.
  let taxonomyCount = 0;
  for (const kind of ["industry", "platform", "discipline"] as const) {
    for (const slug of candidate[kind] ?? []) {
      taxonomyCount++;
      if (!KNOWN[kind].has(slug)) {
        errors.push({
          rule: 6,
          field: kind,
          message: `"${slug}" is not a ${kind} in the live index. The taxonomy landing pages are generated from that index, so an unknown value tags this against a page that does not exist.`,
        });
      }
    }
  }
  if (taxonomyCount === 0) {
    errors.push({
      rule: 6,
      field: "industry",
      message:
        "At least one Industry, Platform or Discipline is needed to publish (canon A5). Without one the piece appears on no taxonomy page and no related rail can find it.",
    });
  }

  // 7. Alt text present on every image.
  const missingAlt = images(candidate.body).filter(
    (img) => String(img.alt ?? "").trim() === "",
  );
  if (missingAlt.length > 0) {
    errors.push({
      rule: 7,
      field: "body",
      message: `${missingAlt.length} image(s) have no alt text. Every image in a published body carries it; a decorative image is still an image somebody has to skip past.`,
    });
  }

  // 8. Byline is "Yallo Talent", applied by the system.
  const supplied = candidate.author ?? candidate.byline;
  if (supplied !== undefined && supplied !== FIXED_BYLINE) {
    errors.push({
      rule: 8,
      field: "author",
      message: `The byline is fixed at "${FIXED_BYLINE}" (canon §8) and is applied by the system. Nothing in this cockpit attributes writing to a named person.`,
    });
  }

  /* 9. The category is on the list for THIS content type — R-25b.2.
     Two lists, not one: an article carries one of the design's five editorial
     types, a case study carries the engagement pillar its card already
     displays. A study filed under "Market intelligence" would appear under a
     heading no case-study surface has, and an article filed under "EOR" would
     claim an engagement model rather than a subject. Both are silent: the
     piece publishes and simply files itself nowhere a reader looks. */
  const type = candidate.contentType ?? "article";
  const allowed = categoriesFor(type) as string[];
  const category = (candidate.category ?? "").trim();
  if (category === "") {
    errors.push({
      rule: 9,
      field: "category",
      message: `A category is needed to publish. ${type === "case_study" ? "A case study carries its engagement pillar" : "An article carries one of the five editorial types"}: ${allowed.join(", ")}.`,
    });
  } else if (!allowed.includes(category)) {
    errors.push({
      rule: 9,
      field: "category",
      message: `"${category}" is not a category a ${type === "case_study" ? "case study" : "article"} may carry. The list is: ${allowed.join(", ")}. A piece filed outside it publishes to a heading no surface renders.`,
    });
  }

  /* Stamped once, here, rather than at each call site: a caller that decided
     severity for itself would be a second place the ruling lives. */
  return errors.map((e) => ({ ...e, severity: severityOf(e.rule) }));
}

/**
 * R-25b.4 — whether this status change would strand a legacy URL.
 *
 * EXTRACTED FROM THE ACTION so it can be watched refusing and watched
 * permitting. The action is a public POST endpoint that needs a session and a
 * real row; a decision living inside it is a decision no test reaches, and
 * "red-proven both directions" was the ruling.
 *
 * Returns the message, or null. The message names the URLs rather than counting
 * them, because the person taking a study down needs to know which addresses
 * they are about to break.
 */
export function unpublishRefusal(
  contentType: "article" | "case_study",
  nextStatus: string,
  slug: string,
  legacySourcesFor: (path: string) => string[],
): string | null {
  if (contentType !== "case_study") return null;
  if (nextStatus === "published") return null;
  const legacy = legacySourcesFor(`/case-studies/${slug}`);
  if (legacy.length === 0) return null;
  return `Not unpublished. ${legacy.length} legacy URL(s) still point at /case-studies/${slug} and would become a two-hop redirect into the hub: ${legacy.join(", ")}. Retire the redirect first, or leave the study published.`;
}
