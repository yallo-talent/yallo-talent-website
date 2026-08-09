import { expect, test } from "@playwright/test";
import {
  breadcrumbJsonLd,
  contentArticleJsonLd,
  contentGraph,
  faqJsonLd,
} from "../src/lib/content-jsonld";
import {
  answerFirstNotes,
  breadcrumbFor,
  contentSeo,
  deskLinksFor,
  relatedByTaxonomy,
} from "../src/lib/content-seo";
import type { ArticleRow } from "../src/lib/db/content";
import { markdownToTiptap } from "../src/lib/tiptap/from-markdown.mjs";

/**
 * DESIGN §6, ASSERTED IN BOTH DIRECTIONS.
 *
 * The four SEO columns have existed since round 25b and no rendering surface
 * read any of them, which is the defect this round closes. A test that only
 * asserted "a canonical tag is present" would have passed against that broken
 * state, because `buildMetadata` has always emitted one from the path. So every
 * assertion below is about WHICH VALUE WINS: the row's field when it is set, and
 * the derived fallback when it is not. That is the only shape of test that can
 * tell a wired field from an ignored one.
 *
 * EVERY FIXTURE IS BUILT IN MEMORY AND REMOVES ITSELF WITH THE PROCESS. Nothing
 * is written to the database and no content is authored: the prose is
 * deliberately about nothing, per the round's standing rule.
 */

function row(over: Partial<ArticleRow> = {}): ArticleRow {
  return {
    id: "00000000-0000-0000-0000-000000000001",
    slug: "a-fixture-slug",
    title: "A fixture title",
    summary:
      "A fixture summary long enough to clear the budget floor without saying anything about anything.",
    category: "Market intelligence",
    body: markdownToTiptap("A fixture paragraph.") as ArticleRow["body"],
    status: "published",
    industry: [],
    platform: [],
    discipline: [],
    sources: [],
    metaTitle: null,
    metaDescription: null,
    canonicalUrl: null,
    ogImageUrl: null,
    readingTimeMinutes: 1,
    wordCount: 3,
    publishedAt: "2026-08-01T00:00:00.000Z",
    firstPublishedAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-02T00:00:00.000Z",
    ...over,
  };
}

test.describe("design §6 — the SEO fields reach the page", () => {
  test("meta title falls back to the title, and the field wins when set", () => {
    expect(contentSeo(row()).title).toBe("A fixture title · Yallo Talent");
    expect(contentSeo(row({ metaTitle: "A shorter one" })).title).toBe(
      "A shorter one · Yallo Talent",
    );
  });

  test("meta description falls back to the summary, and the field wins", () => {
    expect(contentSeo(row()).description).toContain("A fixture summary");
    expect(
      contentSeo(row({ metaDescription: "Twenty-eight characters." }))
        .description,
    ).toBe("Twenty-eight characters.");
  });

  test("canonical is absent unless the author set one", () => {
    /* Absent means "this page is its own canonical", which buildMetadata
       resolves from the path. A canonical the author typed is honoured whole. */
    expect(contentSeo(row()).canonical).toBeUndefined();
    expect(
      contentSeo(row({ canonicalUrl: "https://example.com/elsewhere" }))
        .canonical,
    ).toBe("https://example.com/elsewhere");
  });

  test("the OG image is the uploaded hero, or nothing so the PetalPlate stands", () => {
    expect(contentSeo(row()).ogImage).toBeUndefined();
    expect(
      contentSeo(row({ ogImageUrl: "https://cdn.example/hero.jpg" })).ogImage,
    ).toBe("https://cdn.example/hero.jpg");
  });
});

test.describe("design §6 — the structured data", () => {
  test("an article is BlogPosting and a case study is Article", () => {
    expect(contentArticleJsonLd(row(), "article")["@type"]).toBe("BlogPosting");
    expect(contentArticleJsonLd(row(), "case_study")["@type"]).toBe("Article");
  });

  test("author and publisher are the Organization node, never a person", () => {
    const node = contentArticleJsonLd(row(), "article");
    expect(node.author).toEqual(node.publisher);
    expect(JSON.stringify(node.author)).toContain("#organisation");
    /* Canon §8: no individual names anywhere in authorship. */
    expect(JSON.stringify(node)).not.toContain('"@type":"Person"');
  });

  test("about names the taxonomy the row carries, resolved to real labels", () => {
    const node = contentArticleJsonLd(
      row({ platform: ["sap"], discipline: ["ai-talent"] }),
      "article",
    );
    const names = (node.about ?? []).map((a) => a.name);
    expect(names).toContain("SAP");
    expect(names).toContain("AI Talent");
  });

  test("about is omitted entirely when the row carries no taxonomy", () => {
    expect(contentArticleJsonLd(row(), "article").about).toBeUndefined();
  });

  test("the breadcrumb is home, hub, piece, in that order", () => {
    const crumbs = breadcrumbJsonLd(breadcrumbFor("article", row()));
    expect(crumbs.itemListElement.map((i) => i.position)).toEqual([1, 2, 3]);
    expect(crumbs.itemListElement[1].item).toContain("/insights");
    expect(crumbs.itemListElement[2].item).toContain(
      "/insights/a-fixture-slug",
    );
  });

  test("FAQPage appears only where an FAQ block does", () => {
    /* The negative half is the one that matters: an empty FAQPage is a page
       claiming to be something it is not, and that is a manual action in
       Search Console rather than a missed opportunity. */
    expect(faqJsonLd(row().body, "/insights/a-fixture-slug")).toBeNull();

    const withFaq = {
      type: "doc",
      content: [
        {
          type: "faq",
          attrs: {
            items: [
              { question: "A fixture question?", answer: "A fixture answer." },
              { question: "", answer: "Half a pair." },
            ],
          },
        },
      ],
    };
    const node = faqJsonLd(withFaq, "/insights/a-fixture-slug");
    expect(node).not.toBeNull();
    /* The half-written pair is dropped, exactly as the renderer drops it, so
       the structured data cannot advertise a question the page does not draw. */
    expect(node?.mainEntity).toHaveLength(1);
    expect(node?.mainEntity[0].name).toBe("A fixture question?");
  });

  test("the graph carries two nodes without an FAQ and three with one", () => {
    const trail = breadcrumbFor("article", row());
    expect(contentGraph(row(), "article", trail)).toHaveLength(2);
  });
});

test.describe("design §6 — the automatic rails", () => {
  test("desk links come from the taxonomy and nothing else", () => {
    const desks = deskLinksFor(
      row({ industry: ["retail"], platform: ["sap"] }),
    );
    expect(desks.map((d) => d.href)).toEqual([
      "/industries/retail",
      "/platforms/sap",
    ]);
    expect(deskLinksFor(row())).toHaveLength(0);
  });

  test("AI Talent links to its canonical route, not through the 301", () => {
    /* `/capabilities/ai-talent` 301s to `/ai-talent`. Composing the href from
       the category alone put a redirect hop on the one discipline carrying paid
       marketing spend — `L1IndexEntry.href` exists to prevent exactly that. */
    const desks = deskLinksFor(row({ discipline: ["ai-talent"] }));
    expect(desks[0].href).toBe("/ai-talent");
  });

  test("the related rail is shared taxonomy, not recency", () => {
    const subject = row({ platform: ["sap"], industry: ["retail"] });
    const oneShared = row({
      id: "b",
      slug: "one-shared",
      platform: ["sap"],
      publishedAt: "2026-08-09T00:00:00.000Z",
    });
    const twoShared = row({
      id: "c",
      slug: "two-shared",
      platform: ["sap"],
      industry: ["retail"],
      publishedAt: "2026-01-01T00:00:00.000Z",
    });
    const unrelated = row({ id: "d", slug: "unrelated", platform: ["oracle"] });

    const rail = relatedByTaxonomy(subject, [oneShared, twoShared, unrelated]);
    /* The OLDER piece leads, because it shares more. Recency is the tiebreak
       and not the ranking; a rail sorted by date is a second index. */
    expect(rail.map((r) => r.slug)).toEqual(["two-shared", "one-shared"]);
  });

  test("a piece never appears in its own rail", () => {
    const subject = row({ platform: ["sap"] });
    expect(relatedByTaxonomy(subject, [subject])).toHaveLength(0);
  });
});

/**
 * The half a pure test cannot reach: whether the ROUTE spends any of it.
 *
 * Every assertion above is over a function, and a function can be correct while
 * the page that should call it does not — which is precisely the state round 25b
 * left behind. So this block loads a real published piece and reads what the
 * document actually carries. It uses a case study because nine are published and
 * no article is; publishing one to make a test pass is forbidden, and would be
 * the wrong instinct anyway.
 */
test.describe("design §6 — the rendered document", () => {
  test("a published piece carries canonical, OG, Twitter and the graph", async ({
    page,
    request,
  }) => {
    const sitemap = await (await request.get("/sitemap.xml")).text();
    const path = /\/case-studies\/[a-z0-9-]+/.exec(sitemap)?.[0];
    expect(
      path,
      "no published case study in the sitemap to measure",
    ).toBeTruthy();

    await page.goto(path as string);

    const canonical = await page
      .locator('link[rel="canonical"]')
      .getAttribute("href");
    expect(canonical).toContain(path);

    for (const property of [
      "og:title",
      "og:description",
      "og:image",
      "og:url",
    ]) {
      const content = await page
        .locator(`meta[property="${property}"]`)
        .first()
        .getAttribute("content");
      expect(content, `${property} is empty`).toBeTruthy();
    }
    expect(
      await page
        .locator('meta[name="twitter:card"]')
        .first()
        .getAttribute("content"),
    ).toBe("summary_large_image");

    /* The graph, read out of the document rather than rebuilt here. The last
       ld+json block is the page's own; the first is the root layout's
       organisation graph, which this must NOT be mistaken for. */
    const blocks = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    const parsed = blocks.flatMap(
      (b) => JSON.parse(b) as Record<string, unknown>[],
    );
    const types = parsed.map((n) => n["@type"]);
    expect(types).toContain("Article");
    expect(types).toContain("BreadcrumbList");

    const article = parsed.find((n) => n["@type"] === "Article");
    expect(JSON.stringify(article?.author)).toContain("#organisation");
    expect(article?.dateModified).toBeTruthy();
  });
});

test.describe("design §6 — the answer-first soft check", () => {
  test("a summary and an opening claim produce no note", () => {
    const clean = {
      summary:
        "Contract SAP finance roles in the UAE take longer to fill than the same roles in the UK, and the reason is visa lead time.",
      body: markdownToTiptap(
        "Visa lead time, not scarcity, is what separates a four-week fill from a nine-week one on UAE contract finance roles, and it is the part of the timeline a client can actually change.",
      ),
    };
    expect(answerFirstNotes(clean)).toHaveLength(0);
  });

  test("a scene-setting opener is named back to the writer", () => {
    const notes = answerFirstNotes({
      summary:
        "A summary long enough to clear the floor and say nothing at all in the process.",
      body: markdownToTiptap(
        "In today's market, organisations of every size are thinking hard about how they approach the question of hiring for enterprise platform programmes.",
      ),
    });
    expect(notes).toHaveLength(1);
    expect(notes[0].message).toContain("scene-setting");
  });

  test("a missing summary and a missing body are both reported", () => {
    const notes = answerFirstNotes({
      summary: "",
      body: { type: "doc", content: [] },
    });
    expect(notes).toHaveLength(2);
  });
});
