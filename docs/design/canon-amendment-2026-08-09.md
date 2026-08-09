# Canon amendment — 9 August 2026

**Ratified by Sumeet Goenka, 9 August 2026 · Chat lens · Project GTM.01**
To be folded into `docs/design/yallo-talent-CANON.md` in round 25, in canon's own voice and numbering, preserving surrounding text. This file is the authority for the change and stays in the repository as the record of what was amended and why.

---

## A1 · Source of truth for articles and case studies (canon §9, content operating rules)

Articles and case studies are held in the application database, not in the repository. They are authored and published in the admin cockpit, and publishing takes effect immediately without a deployment.

Consequences to record in canon:

- The repository ceases to be the source of truth for these two content types. It remains the source of truth for all structural content in `src/data/**`, for every page template, and for the design system.
- Version history for these types is the cockpit's revision record, not git history. Every save is a revision; any revision can be previewed and restored.
- Nothing is hard-deleted. Archive is the terminal state, so every URL that ever published can be resolved or redirected.
- The publishing mechanics described in `yallo-talent-content-authoring-guide-v1.0.md` §§4 to 9 are superseded for these two types. That guide stands only for structural content.

## A2 · No pull request in a content path (canon §9)

Publishing an article or a case study opens nothing, waits for nothing and merges nothing. The quality rules previously enforced by continuous integration are enforced by the publish action itself, which refuses to publish content that breaks them. Saving a draft is never blocked; publishing is.

The rules that must be enforced at publish, each of which was previously a build gate or a standing rule:

1. Every figure in the body carries a matching source entry.
2. No banned vocabulary per canon §2, with the documented occurrence-by-occurrence allow-list method retained.
3. Every internal link resolves to a real route.
4. No rate, fee or day-rate figure appears.
5. Title, summary and meta description within their length budgets.
6. Taxonomy values exist in the live taxonomy indexes.
7. Alt text present on every image.
8. Byline is "Yallo Talent", applied by the system and not an author-editable field.

A nightly re-validation of everything published reports drift into the cockpit.

## A3 · Imagery in article and case-study bodies (canon §5)

The imagery rule is relaxed inside article and case-study bodies only. Permitted there: uploaded photography and illustration, data charts generated from typed values, and PetalPlate art. Every image carries alt text and a caption where the image carries meaning.

Unchanged everywhere else: no stock photography and no hotlinked images on marketing surfaces, page furniture, heroes or navigation. PetalPlate remains the default and the fallback, and remains the source of automatically generated social cards.

## A4 · Roles and the privacy clause (canon §8, and `/privacy`)

Four roles: **owner**, **admin**, **editor**, **ops**.

- **owner** reaches everything and cannot be disabled or demoted by any other account. Sumeet Goenka.
- **admin** reaches everything, including briefs and assistant conversations, and cannot demote or disable the owner. Raphy Varghese, as Head of Marketing and Growth, owns the site day to day.
- **editor** reaches articles, case studies and media only.
- **ops** reaches briefs only.

**The `/privacy` clause must change, because it is currently inaccurate.** It states that one named administrator can read assistant conversations. Two accounts now can. Replacement wording, ratified for publication:

> Conversations with the site assistant are stored for up to twelve months and can be read by a small, named group of Yallo Talent administrators for the purpose of responding to enquiries and improving the service. They are not used for any other purpose, are not sold, and are not shared with third parties.

An audit log recording who published, changed or archived what, and when, is required rather than deferred.

## A5 · Insight taxonomy (canon §3)

Every article and case study carries at least one taxonomy value across the three pillars, and may carry one from each: **Industry**, **Platform**, **Discipline**. Values are read from the live taxonomy indexes and are never retyped. A fourth field, **Category**, carries the editorial type and is a fixed list.

Single-facet taxonomy views at `/insights/industry/{slug}`, `/insights/platform/{slug}` and `/insights/discipline/{slug}` are real, indexable landing pages. Multi-facet filter combinations canonicalise to `/insights` and carry `noindex`.
