/**
 * One representative, always-valid case-study slug, for gates that check a
 * shared template rather than every study (one page per template, not one per
 * route).
 *
 * NEVER HAND COPIED, and that has not changed: a hand-copied slug outlives the
 * study it names, and round 7 retired four studies that `order.yaml` still
 * named. A gate holding its own copy of one would have started failing on a 404
 * instead of on what it actually checks.
 *
 * ROUND 25 CHANGED ONLY WHERE IT READS FROM. Canon A1 moved case studies into
 * the database and `content/case-studies/order.yaml` no longer exists; the order
 * is the `position` column, and this asks the running SERVER for it rather than
 * the database directly. A gate that opened its own connection would need a
 * connection string of its own, and every one of these gates already has a base
 * URL and a server: the index page is the same list, in the same order, and it
 * is the thing a reader actually gets. Reading the served page is also stricter
 * than reading the row, because a study whose page does not render is not a
 * study this sample should hand to another gate.
 *
 * @param {string} base the server the calling gate is already pointed at
 */
export async function sampleCaseStudySlug(base = "http://localhost:3100") {
  const res = await fetch(`${base}/case-studies`);
  if (!res.ok) {
    throw new Error(
      `sampleCaseStudySlug: ${base}/case-studies returned ${res.status}. ` +
        "The case-study index is where the published order lives since canon A1; " +
        "a gate cannot pick a representative study without it.",
    );
  }
  const html = await res.text();
  const match = html.match(/\/case-studies\/([a-z0-9][a-z0-9-]*)/);
  const slug = match?.[1];
  if (!slug) {
    throw new Error(
      `sampleCaseStudySlug: no case study is linked from ${base}/case-studies. ` +
        "Either nothing is published, or the index stopped rendering its cards.",
    );
  }
  return slug;
}
