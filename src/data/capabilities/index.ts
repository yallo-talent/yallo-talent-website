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
