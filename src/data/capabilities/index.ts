import type { L1PageData } from "@/data/l1/types";
import { cloudInfrastructureData } from "./cloud-infrastructure";
import { cybersecurityData } from "./cybersecurity";
import { dataAnalyticsData } from "./data-analytics";
import { devopsPlatformEngineeringData } from "./devops-platform-engineering";
import { integrationMiddlewareData } from "./integration-middleware";
import { testingQualityEngineeringData } from "./testing-quality-engineering";

/**
 * The disciplines with a page under /capabilities. Only slugs present here
 * generate a route.
 *
 * AI Talent is the seventh discipline (canon §3 amendment, 1 Aug 2026) and is
 * deliberately absent: its canonical route is /ai-talent, not
 * /capabilities/ai-talent, and both capability-shaped forms 301 to it. The
 * taxonomy entry that makes it a discipline lives in `capabilitiesIndex`.
 *
 * `emerging-technologies` is retired and also 301s to /ai-talent.
 */
export const capabilityRegistry: Record<string, L1PageData> = {
  "data-analytics": dataAnalyticsData,
  "cloud-infrastructure": cloudInfrastructureData,
  cybersecurity: cybersecurityData,
  "integration-middleware": integrationMiddlewareData,
  "devops-platform-engineering": devopsPlatformEngineeringData,
  "testing-quality-engineering": testingQualityEngineeringData,
};

/**
 * Real disciplines with no page yet. Rendered as inert cards carrying a "Desk in
 * build" marker rather than as links to a route that would 404.
 *
 * EMPTY as of 1 Aug 2026, and that is the correct end state rather than a
 * deletion. All four disciplines that sat here (Cybersecurity, Integration &
 * Middleware, DevOps & Platform Engineering, Testing & Quality Engineering) are
 * real desks Yallo staffs, and Sumeet's ruling was to seed all four to the same
 * depth as Data & Analytics. The marker was always data-driven, so seeding the
 * data is what removes it: the label was never edited out to hide the tag.
 *
 * The array and the mechanism stay. The next discipline canon adds arrives here
 * first and renders honestly until its data lands.
 */
export const PLANNED_CAPABILITIES = [] as const;

/**
 * Canon order, for any surface that lists every discipline.
 *
 * AI Talent first, per the six-to-seven amendment. `capabilitiesIndex` in
 * src/data/l1/index.ts holds the same order and is the source of truth for
 * labels; this array is the slug order for surfaces that do not read the index.
 */
export const CAPABILITY_ORDER = [
  "ai-talent",
  "data-analytics",
  "cloud-infrastructure",
  "cybersecurity",
  "integration-middleware",
  "devops-platform-engineering",
  "testing-quality-engineering",
] as const;

/**
 * Does this discipline have a page, and what is its route?
 *
 * ONE predicate, because there were three answers to this question and two of
 * them were wrong. The capabilities hub derived it correctly; the nav mega panel
 * carried a hand-written copy of the whole taxonomy — its own labels and its own
 * `published: false` flags — so when the four planned desks were seeded, the hub
 * updated and the nav did not. It went on showing "Desk in build" on four live
 * pages and the retired label "Artificial Intelligence" on a row whose subtitle
 * had already updated, because the subtitle came from the index and the label did
 * not. That is what Sumeet reported as "L2 links not clickable", and the copy in
 * the nav is why fixing the data did not fix it.
 *
 * Anything that needs to know whether a discipline is live asks this. A fourth
 * copy of the answer is the failure mode; `scripts/check-taxonomy.mjs` now fails
 * the build if a nav or menu file hardcodes a capability route.
 */
export function capabilityNavEntries(
  index: Array<{ slug: string; label: string; href?: string }>,
): Array<{ label: string; href: string; published: boolean }> {
  return index.map((e) => ({
    label: e.label,
    /* `href` where the canonical route is not /capabilities/{slug}. AI Talent is
       the only one: it lives at /ai-talent and the capability-shaped forms 301. */
    href: e.href ?? `/capabilities/${e.slug}`,
    /* Live when it has a page in the registry, or an explicit canonical route of
       its own. Not "when it is absent from PLANNED_CAPABILITIES": that array is
       now empty, and reading a negative from an empty list is how a future
       discipline would silently render as a link to a 404. */
    published: e.slug in capabilityRegistry || e.href !== undefined,
  }));
}
