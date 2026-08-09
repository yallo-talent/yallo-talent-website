import { expect, test } from "@playwright/test";
import {
  ARTICLE_CATEGORIES,
  CASE_STUDY_CATEGORIES,
} from "../src/lib/admin/categories.mjs";
import {
  BUDGETS,
  FIXED_BYLINE,
  type PublishCandidate,
  validateForPublish,
} from "../src/lib/admin/content-validation";
import { markdownToTiptap } from "../src/lib/tiptap/from-markdown.mjs";

/**
 * THE EIGHT REFUSALS OF CANON A2, EACH WATCHED REFUSING.
 *
 * Canon A2 moved eight rules out of continuous integration and into the publish
 * action. Round 25 §5: "a validation that has never been watched refusing is not
 * a validation". So every rule below is exercised twice — once with a fixture
 * that must be refused, and once with the same fixture corrected, which must be
 * accepted. A test that only ever asserts a refusal cannot tell a working rule
 * apart from one that refuses everything.
 *
 * EVERY FIXTURE CREATES AND REMOVES ITSELF. They are strings built in memory and
 * converted through the same markdown-to-TipTap path the import used. Nothing is
 * written to the database, nothing is written to disk, and no article content is
 * authored: the prose below is deliberately about nothing, because round 25
 * forbids inventing content and a fixture that read like a real article would be
 * exactly that.
 *
 * THE RULES ARE NUMBERED as canon A2 numbers them, and each test names its
 * number, so a relay can report the eight individually rather than as a count.
 */

/** Every route a fixture may link to. Real paths, so rule 3 has something true
    to compare against without needing a server. */
const KNOWN_PATHS = new Set([
  "/",
  "/contract",
  "/permanent",
  "/insights",
  "/case-studies",
  "/platforms/sap",
]);

function candidate(over: Partial<PublishCandidate> = {}): PublishCandidate {
  return {
    title: "A fixture for the publish validator",
    summary:
      "A summary written for this test, long enough to clear the lower budget and short enough to clear the upper one.",
    metaTitle: "A fixture for the publish validator",
    metaDescription:
      "A meta description written for this test and nowhere else.",
    /* Rule 9 is per content type, so the default fixture is an article
       carrying an article category. Without it every other case below would
       start reporting a rule-9 error alongside the one it is about. */
    contentType: "article",
    category: "Market intelligence",
    body: markdownToTiptap("A plain sentence with nothing in it to refuse.\n"),
    sources: [],
    industry: ["retail"],
    platform: [],
    discipline: [],
    ...over,
  };
}

const errors = (over: Partial<PublishCandidate> = {}) =>
  validateForPublish(candidate(over), KNOWN_PATHS);

const rules = (over: Partial<PublishCandidate> = {}) =>
  errors(over).map((e) => e.rule);

test("the clean fixture publishes, so a refusal below means the rule fired", () => {
  expect(errors()).toEqual([]);
});

test.describe("rule 1 — every figure carries a matching source", () => {
  test("refuses a bare percentage", () => {
    const body = markdownToTiptap("Adoption reached 47% across the estate.\n");
    const found = errors({ body });
    expect(rules({ body })).toContain(1);
    expect(found.find((e) => e.rule === 1)?.message).toContain("47%");
  });

  test("accepts the same figure once a source accounts for it", () => {
    expect(
      rules({
        body: markdownToTiptap("Adoption reached 47% across the estate.\n"),
        sources: [{ claim: "Adoption reached 47%", source: "A named source" }],
      }),
    ).not.toContain(1);
  });
});

test.describe("rule 2 — canon §2 banned vocabulary", () => {
  test("refuses a banned abstraction", () => {
    const body = markdownToTiptap("A seamless approach to the work.\n");
    expect(rules({ body })).toContain(2);
    expect(errors({ body }).find((e) => e.rule === 2)?.message).toContain(
      "seamless",
    );
  });

  test("accepts an allow-listed occurrence, which is canon's own method", () => {
    expect(
      rules({ body: markdownToTiptap("The platform ecosystem around it.\n") }),
    ).not.toContain(2);
  });
});

test.describe("rule 3 — every internal link resolves", () => {
  test("refuses a link to a route that does not exist", () => {
    const body = markdownToTiptap("See [the page](/no-such-route) for more.\n");
    expect(rules({ body })).toContain(3);
    expect(errors({ body }).find((e) => e.rule === 3)?.message).toContain(
      "/no-such-route",
    );
  });

  test("accepts a link to a route that does", () => {
    expect(
      rules({
        body: markdownToTiptap("See [contract](/contract) for more.\n"),
      }),
    ).not.toContain(3);
  });

  test("an external link is not this rule's business", () => {
    expect(
      rules({
        body: markdownToTiptap(
          "See [elsewhere](https://example.com) for more.\n",
        ),
      }),
    ).not.toContain(3);
  });
});

test.describe("rule 4 — no rate, fee or day-rate figure", () => {
  test("refuses a day rate", () => {
    const body = markdownToTiptap(
      "Specialists were placed at AED 2,000 per day on that programme.\n",
    );
    expect(rules({ body })).toContain(4);
  });

  test("refuses a percentage fee", () => {
    expect(
      rules({
        body: markdownToTiptap("A fee of 18% applies to each placement.\n"),
      }),
    ).toContain(4);
  });

  test("accepts prose that mentions neither", () => {
    expect(
      rules({
        body: markdownToTiptap("The programme ran to its own schedule.\n"),
      }),
    ).not.toContain(4);
  });
});

test.describe("rule 5 — length budgets", () => {
  test("refuses a summary under the floor", () => {
    expect(rules({ summary: "Too short." })).toContain(5);
  });

  test("refuses a meta description over the budget", () => {
    expect(
      rules({ metaDescription: "x".repeat(BUDGETS.metaDescription.max + 1) }),
    ).toContain(5);
  });

  test("accepts one exactly at the budget", () => {
    expect(
      rules({ metaDescription: "x".repeat(BUDGETS.metaDescription.max) }),
    ).not.toContain(5);
  });
});

test.describe("rule 6 — taxonomy values exist, and at least one is present", () => {
  test("refuses a value that is in no live index", () => {
    const found = errors({ industry: ["not-a-sector"] });
    expect(found.map((e) => e.rule)).toContain(6);
    expect(found.find((e) => e.rule === 6)?.message).toContain("not-a-sector");
  });

  test("refuses a piece carrying no taxonomy at all, canon A5", () => {
    expect(rules({ industry: [], platform: [], discipline: [] })).toContain(6);
  });

  test("accepts a value that resolves", () => {
    expect(
      rules({ industry: [], platform: ["sap"], discipline: [] }),
    ).not.toContain(6);
  });
});

test.describe("rule 7 — alt text on every image", () => {
  const withImage = (alt: string) => ({
    type: "doc",
    content: [
      { type: "paragraph", content: [{ type: "text", text: "A sentence." }] },
      { type: "image", attrs: { src: "https://example.com/a.png", alt } },
    ],
  });

  test("refuses an image with no alt text", () => {
    expect(rules({ body: withImage("") })).toContain(7);
  });

  test("accepts one that carries it", () => {
    expect(rules({ body: withImage("A described image") })).not.toContain(7);
  });
});

test.describe("rule 8 — the byline is applied by the system", () => {
  test("refuses an author supplied by the caller", () => {
    const found = errors({ author: "A Named Person" });
    expect(found.map((e) => e.rule)).toContain(8);
    expect(found.find((e) => e.rule === 8)?.message).toContain(FIXED_BYLINE);
  });

  test("accepts the fixed byline, which is the only value it can be", () => {
    expect(rules({ author: FIXED_BYLINE })).not.toContain(8);
  });

  test("and accepts a payload that never mentions one, which is the real path", () => {
    expect(rules()).not.toContain(8);
  });
});

test.describe("the closed node set, which is not one of the eight", () => {
  test("refuses a body carrying a node the renderer cannot draw", () => {
    const found = validateForPublish(
      candidate({
        body: {
          type: "doc",
          content: [{ type: "iframe", attrs: { src: "https://example.com" } }],
        },
      }),
      KNOWN_PATHS,
    );
    expect(found.map((e) => e.rule)).toContain(0);
    expect(found.find((e) => e.rule === 0)?.message).toContain("iframe");
  });
});

test.describe("rule 9 — the category is on the list for THIS content type (R-25b.2)", () => {
  test("refuses an article with no category at all", () => {
    const found = errors({ category: "" });
    expect(found.map((e) => e.rule)).toContain(9);
    expect(found.find((e) => e.rule === 9)?.message).toContain(
      "Market intelligence",
    );
  });

  test("accepts an article carrying one of the five editorial types", () => {
    for (const category of ARTICLE_CATEGORIES) {
      expect(rules({ category })).not.toContain(9);
    }
  });

  test("refuses an article filed under an ENGAGEMENT PILLAR", () => {
    /* The failure this rule exists for, and the reason it is per type rather
       than one shared list: "EOR" is a real value on this site, so a single
       list would accept it here and file the article under a heading no
       /insights surface renders. */
    const found = errors({ category: "EOR" });
    expect(found.map((e) => e.rule)).toContain(9);
    expect(found.find((e) => e.rule === 9)?.message).toContain("article");
  });

  test("accepts a case study carrying its engagement pillar", () => {
    for (const category of CASE_STUDY_CATEGORIES) {
      expect(rules({ contentType: "case_study", category })).not.toContain(9);
    }
  });

  test("refuses a case study filed under an EDITORIAL TYPE", () => {
    const found = errors({
      contentType: "case_study",
      category: "Market intelligence",
    });
    expect(found.map((e) => e.rule)).toContain(9);
    expect(found.find((e) => e.rule === 9)?.message).toContain("case study");
  });

  test("refuses a category that is on neither list", () => {
    expect(rules({ category: "Thought leadership" })).toContain(9);
    expect(
      rules({ contentType: "case_study", category: "Thought leadership" }),
    ).toContain(9);
  });
});
