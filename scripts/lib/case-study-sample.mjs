/**
 * One representative, always-valid case-study slug, for gates that check a
 * shared template rather than every study (one page per template, not one
 * per route). Read from content/case-studies/order.yaml rather than hand
 * copied, because a hand-copied slug outlives the study it names: round 7
 * retired four slugs order.yaml had named, and a gate holding its own copy of
 * one would have started failing on a 404 instead of on what it actually
 * checks. Always the first ranked slug, so it moves if order.yaml's own
 * ranking ever changes it.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";

export function sampleCaseStudySlug() {
  const orderPath = join(
    process.cwd(),
    "content",
    "case-studies",
    "order.yaml",
  );
  const parsed = parseYaml(readFileSync(orderPath, "utf8"));
  const slug = parsed?.order?.[0];
  if (!slug) {
    throw new Error(
      `content/case-studies/order.yaml has no entries at ${orderPath}`,
    );
  }
  return slug;
}
