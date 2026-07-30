import type { L1PageData } from "@/data/l1/types";
import { cloudInfrastructureData } from "./cloud-infrastructure";
import { dataAnalyticsData } from "./data-analytics";

/**
 * The six disciplines, in canon order (§5).
 *
 * Only slugs present here generate a route. The four without seed content are
 * listed in PLANNED_CAPABILITIES instead of being registered with thin data —
 * L2 generation is gated on data presence for the same reason, and a page that
 * says nothing is worse than a page that does not exist yet.
 *
 * `emerging-technologies` is retired and 301s to /ai-talent. AI is a named
 * specialism with its own destination, not a discipline route.
 */
export const capabilityRegistry: Record<string, L1PageData> = {
  "data-analytics": dataAnalyticsData,
  "cloud-infrastructure": cloudInfrastructureData,
};

/**
 * Real disciplines with no page yet. The nav renders these non-interactive via
 * `published: false`, so nothing links to a route that would 404.
 */
export const PLANNED_CAPABILITIES = [
  "cybersecurity",
  "integration-middleware",
  "devops-platform-engineering",
  "testing-quality-engineering",
] as const;

/** Canon order, for any surface that lists all six. */
export const CAPABILITY_ORDER = [
  "data-analytics",
  "cloud-infrastructure",
  "cybersecurity",
  "integration-middleware",
  "devops-platform-engineering",
  "testing-quality-engineering",
] as const;
