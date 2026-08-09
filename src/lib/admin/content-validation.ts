import {
  capabilitiesIndex,
  industriesIndex,
  platformsIndex,
} from "@/data/l1/index";
import { categoriesFor } from "@/lib/admin/categories.mjs";
import { bannedVocabulary, rateFigures } from "@/lib/banned-vocabulary.mjs";
import { disallowedNodes } from "@/lib/tiptap/schema.mjs";
import { docToText, embeds, images, links } from "@/lib/tiptap/text.mjs";
import { unsourcedFigures } from "@/lib/unsourced-figures.mjs";

/**
 * Every editorial rule this site holds, as findings rather than refusals.
 *
 * WHAT THESE ARE NOW. Round 23 built a pull-request publishing path whose
 * quality bar was CI; canon A2 removed the pull request and moved the bar into
 * the publish action, where all nine rules refused. R-26.1 removes the refusal
 * and keeps the rules: they run live and inline while the writer types, each
 * naming the exact text it is about, and the publish sheet lists whatever is
 * outstanding before a single confirm. See `BLOCKING_RULES` for the ruling and
 * for what replaces the refusal.
 *
 * NOTHING HERE RUNS ONLY AT PUBLISH TIME ANY MORE. `LiveChecks` calls the same
 * function on every keystroke, `publishedNotices` calls it nightly and on the
 * pane over what is already live, and the publish sheet calls it once more at
 * the moment of publishing. Three surfaces, one function, so they cannot
 * disagree about what is wrong with a piece.
 *
 * EVERY FINDING NAMES THE FIELD AND THE FAULT. "Validation failed" is a message
 * that sends an author to ask somebody; "the body carries 2 figures with no
 * matching source: 40%, AED 1.4 million" is a message they can act on without
 * leaving the editor. That was true when they refused and it matters more now
 * that they only advise.
 *
 * NOT `server-only`, deliberately. Every function here is pure over its inputs
 * and holds no secret, and marking it server-only would make it unreachable
 * from the client editor that has to run it per keystroke, and from the spec
 * that red-proves each rule.
 *
 * ALL NINE ARE RED-PROVEN in `e2e/publish-validation.spec.ts`, each with a
 * fixture the test creates and removes. A rule that has never been watched
 * firing is a rule nobody has any reason to believe in.
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
 * NO RULE REFUSES ANYTHING — R-26.1, Sumeet's ruling of 9 August 2026.
 *
 * THE HISTORY, because the set is empty and an empty set with no reason reads
 * as an oversight. Canon A2 made all nine rules refuse a publish and canon §9
 * called them "never weakened". Round 25c narrowed that to two on his ruling.
 * R-26.1 supersedes both: every validation rule runs live and inline while the
 * writer types, naming the exact text, as a warning; saving is never impeded
 * and publishing is never refused by a validation rule. The publish sheet lists
 * whatever is outstanding and publishes on a single confirm. That sheet is
 * information, not a gate.
 *
 * DETECTION IS UNCHANGED AND THAT IS THE WHOLE POINT. Every rule below still
 * produces its finding, with the same message, naming the same text. What
 * changed is only what a caller may DO with a finding, which is: show it. The
 * assertions in `e2e/publish-validation.spec.ts` about what each rule FINDS are
 * untouched; the ones about what refuses assert the warning surface instead.
 *
 * THE CONSEQUENCE, RECORDED RATHER THAN ARGUED. An unsourced figure or a rate
 * can now reach the public site past a warning. The nightly re-validation sweep
 * (`scripts/check-published-notices.mjs`) is the safety net that replaces the
 * refusal, and its findings surface on the pane through `publishedNotices`.
 *
 * THE SET IS KEPT, EMPTY, RATHER THAN DELETED. It is the one place the ruling
 * is written down in code, and the spec asserts it is empty — so a future round
 * that wants a rule to refuse again has to change this line deliberately and
 * watch a test go red, rather than discover the concept was quietly removed.
 *
 * THE UNPUBLISH GUARD IS NOT A VALIDATION RULE and still refuses; see
 * `unpublishRefusal`. Link integrity is not an editorial judgement.
 */
export const BLOCKING_RULES: ReadonlySet<number> = new Set<number>();

export function severityOf(rule: number): Severity {
  return BLOCKING_RULES.has(rule) ? "block" : "warn";
}

/**
 * The findings that refuse a publish, which under R-26.1 is none of them.
 *
 * KEPT AS A FUNCTION rather than removed from the callers. A publish path that
 * simply stopped consulting severity would be a publish path where reinstating
 * a refusal means finding the call site again; this way the seam is still
 * there, it returns empty, and the spec watches it return empty.
 */
export function blockingErrors(errors: PublishError[]): PublishError[] {
  return errors.filter((e) => severityOf(e.rule) === "block");
}

/** The findings a writer sees, and may publish over. Under R-26.1, all of them. */
export function warnings(errors: PublishError[]): PublishError[] {
  return errors.filter((e) => severityOf(e.rule) !== "block");
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
        message: `${field} is ${n} characters, under the ${budget.min} this site writes to.`,
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
        "No Industry, Platform or Discipline is set (canon A5). Without one the piece appears on no taxonomy page and no related rail can find it, so nothing but its own URL leads a reader to it.",
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

  /* 7, continued: an embed with no words beside it — A2A.
     THE SAME RULE, NOT A TENTH. An image with no alt text and a video with no
     caption are one fault: media that offers nothing to a reader who cannot or
     will not consume it, and nothing to a crawler either. Numbering it 7 means
     the next embed type the seam adds is covered by a rule that already exists,
     rather than by a rule somebody has to remember to write. */
  const uncaptioned = embeds(candidate.body).filter(
    (embed) => String(embed.caption ?? "").trim() === "",
  );
  if (uncaptioned.length > 0) {
    errors.push({
      rule: 7,
      field: "body",
      message: `${uncaptioned.length} embed(s) carry no caption: ${[...new Set(uncaptioned.map((e) => e.type))].join(", ")}. The caption is what the page says to a reader who does not press play, and it is the frame's accessible name.`,
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
      message: `No category is set. ${type === "case_study" ? "A case study carries its engagement pillar" : "An article carries one of the five editorial types"}: ${allowed.join(", ")}. Without one it files itself under a heading no surface renders.`,
    });
  } else if (!allowed.includes(category)) {
    errors.push({
      rule: 9,
      field: "category",
      message: `"${category}" is not a category a ${type === "case_study" ? "case study" : "article"} carries. The list is: ${allowed.join(", ")}. A piece filed outside it goes to a heading no surface renders.`,
    });
  }

  /* Stamped once, here, rather than at each call site: a caller that decided
     severity for itself would be a second place the ruling lives. */
  return errors.map((e) => ({ ...e, severity: severityOf(e.rule) }));
}

/**
 * R-25b.4 — whether this status change would strand a legacy URL.
 *
 * THE ONE THING THAT STILL REFUSES, AND IT IS NOT A VALIDATION RULE. R-26.1
 * removed every editorial refusal; this stayed, because it is link integrity
 * rather than editorial judgement. An unsourced figure is a piece of writing
 * somebody may defend. A URL that 404s is not a matter of opinion, and the
 * person clicking Unpublish has no way to see from the cockpit that an old
 * address elsewhere on the web points here.
 *
 * EXTRACTED FROM THE ACTION so it can be watched refusing and watched
 * permitting. The action is a public POST endpoint that needs a session and a
 * real row; a decision living inside it is a decision no test reaches, and
 * "red-proven both directions" was the ruling.
 *
 * THE MESSAGE IS AN EXPLANATION WITH ONE ACTION IN IT — R-26.1's second clause.
 * It says what would happen, names the addresses it would happen to, and gives
 * the single step that resolves it. The URLs are listed rather than counted:
 * the person taking a study down needs to know which addresses they are about
 * to break, and a count sends them to ask somebody.
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
  const addresses = legacy.join(", ");
  const plural = legacy.length === 1;
  return `Not unpublished, and here is why. /case-studies/${slug} is still the destination of ${legacy.length} older address${plural ? "" : "es"} on this site: ${addresses}. Taking the study down would leave ${plural ? "that address" : "those addresses"} pointing at a page that is no longer served, so anybody following an old link would arrive at the case-studies hub rather than the study they were sent to. The one action that resolves it: retire the redirect${plural ? "" : "s"} in src/data/redirects.mjs, then unpublish. Until then the study stays published.`;
}
