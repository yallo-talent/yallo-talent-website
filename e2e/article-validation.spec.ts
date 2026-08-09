import { expect, test } from "@playwright/test";
import {
  newArticleSource,
  parseArticleFile,
  slugFromTitle,
  unsourcedFigures,
  validateArticleDraft,
} from "../src/lib/admin/article-draft";

/**
 * The Articles pane refuses a bad draft BEFORE a pull request opens.
 *
 * WHY THESE ARE TESTS AND NOT A GATE. Every other assertion in this repository
 * is made against a running server, because the defects it keeps finding are
 * defects of rendering and of configuration. These rules are pure functions over
 * a string, and the failure they prevent is a pull request that CI is certain to
 * reject sitting open and blocking auto-merge. A pure function is cheapest to
 * hold with a test, and this file runs in `pnpm test` with everything else.
 *
 * NO FIXTURE ARTICLE IS WRITTEN. Every case here is a string built in memory.
 * Round 23 forbids creating article content, and a test that drops an .mdx file
 * into content/insights/ to prove a validator would be creating exactly that.
 */

const template = () =>
  newArticleSource({
    title: "A test title",
    slug: "a-test-title",
    date: "2026-08-09",
    category: "For CIOs",
    summary: "A summary written for this test and committed nowhere.",
    readingTimeMinutes: 5,
  });

const errorsFor = (source: string, slug = "a-test-title") =>
  validateArticleDraft(parseArticleFile(slug, source));

test.describe("slugs are derived, never typed", () => {
  test("apostrophes fold rather than becoming separators", () => {
    expect(slugFromTitle("Sephora Middle East's Carve-Out")).toBe(
      "sephora-middle-easts-carve-out",
    );
  });

  test("a title of pure punctuation yields an empty slug, not a file called .mdx", () => {
    expect(slugFromTitle("!!!")).toBe("");
  });
});

test.describe("the template the pane creates", () => {
  test("validates clean", () => {
    expect(errorsFor(template())).toEqual([]);
  });

  test("is unpublished, and that is not a parameter", () => {
    expect(template()).toContain("published: false");
  });

  test("carries the fixed byline", () => {
    expect(template()).toContain('author: "Yallo Talent"');
  });
});

test.describe("what the validator refuses", () => {
  test("a byline naming a person, canon §8", () => {
    const source = template().replace(
      'author: "Yallo Talent"',
      'author: "A Person"',
    );
    expect(errorsFor(source).map((e) => e.field)).toContain("author");
  });

  test("a frontmatter slug that disagrees with the filename", () => {
    const source = template().replace("slug: a-test-title", "slug: elsewhere");
    expect(errorsFor(source).map((e) => e.field)).toContain("slug");
  });

  test("a taxonomy slug with no archive behind it", () => {
    const source = template().replace(
      "published: false",
      "published: false\nindustry:\n  - not-a-real-industry",
    );
    expect(errorsFor(source).map((e) => e.field)).toContain("industry");
  });

  test("but accepts a taxonomy slug that resolves", () => {
    const source = template().replace(
      "published: false",
      "published: false\nindustry:\n  - retail",
    );
    expect(errorsFor(source).map((e) => e.field)).not.toContain("industry");
  });
});

test.describe("figures need a source, and the rule is narrow on purpose", () => {
  test("a bare percentage is caught", () => {
    expect(unsourcedFigures("Roles sit open 63% longer.", undefined)).toContain(
      "63%",
    );
  });

  test("the same percentage with a matching claim is accepted", () => {
    expect(
      unsourcedFigures("Roles sit open 63% longer.", [
        { claim: "63% longer", source: "A named source" },
      ]),
    ).toEqual([]);
  });

  test("a currency amount is caught", () => {
    expect(
      unsourcedFigures("It cost $1.2m.", undefined).length,
    ).toBeGreaterThan(0);
  });

  /* The three below are the reason the rule is narrow. A validator that flags a
     year, a list count or a port number is one authors learn to click past, and
     a warning nobody reads is worse than no warning. */
  test("a year is not a claim", () => {
    expect(unsourcedFigures("In 2026 the market moved.", undefined)).toEqual(
      [],
    );
  });

  test("a small count is not a claim", () => {
    expect(unsourcedFigures("There are 3 things.", undefined)).toEqual([]);
  });

  test("numbers inside a code fence are not prose", () => {
    expect(
      unsourcedFigures("```\nport 3000 and 1,500\n```", undefined),
    ).toEqual([]);
  });
});
