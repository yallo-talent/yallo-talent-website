/**
 * The reserved slug prefix every CI fixture row carries — R-25c.1.
 *
 * THE DEFECT THIS CLOSES, from relay v35 §14. `check:editor` creates a real
 * draft article in the live database, and `check-admin-render` discovers a
 * detail template by taking the FIRST row on `/admin/articles`. Two CI runs in
 * flight put one run's fixture in front of the other run's discovery: the
 * second began rendering a row the first then deleted, and the 404 was real —
 * the row had genuinely stopped existing.
 *
 * v35 fixed it with a per-ref concurrency group and named the residual risk
 * honestly: the group is per ref, so two runs on DIFFERENT branches still share
 * one database. Sumeet's ruling (R-25c.1) chose fixtures that CANNOT collide
 * over a repository-wide group, because a repository-wide group makes every
 * branch wait on every other branch to protect against a case that a naming
 * rule removes outright.
 *
 * SO: every fixture row's slug starts with this, and every gate that DISCOVERS
 * content excludes it. Neither half works alone — a prefix nothing filters on is
 * a convention, and a filter with no prefix to match is a no-op.
 */
export const CI_FIXTURE_PREFIX = "ci-fixture-";

/** A unique fixture slug carrying the reserved prefix. */
export function ciFixtureSlug(what) {
  return `${CI_FIXTURE_PREFIX}${what}-${Date.now().toString(36)}`;
}
