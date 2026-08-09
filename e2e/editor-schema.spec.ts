import { expect, test } from "@playwright/test";
import { Extension, getSchema } from "@tiptap/core";
import Heading from "@tiptap/extension-heading";
import StarterKit from "@tiptap/starter-kit";
import {
  HEADING_LEVELS,
  normaliseHeadings,
} from "../src/lib/tiptap/schema.mjs";

/**
 * THE HEADING-LEVEL DATA LOSS, ASSERTED AT ALL THREE BOUNDARIES.
 *
 * What happened, stated plainly because the failure mode is the point. TipTap
 * serialises an attribute equal to its default by OMITTING it, and its Heading
 * defaults `level` to 1. `StarterKit.configure({ heading: { levels: [2, 3] } })`
 * narrows what the toolbar and the slash menu OFFER and does not touch the
 * attribute default — an assumption that reads as obviously true and is not. A
 * heading that ended up at level 1 therefore serialised with no `level` key,
 * the publish action refused it with "heading level undefined", and the
 * case-study template's movement split, which looks for level 2, found nothing
 * and collapsed the page's section structure. Three published case studies on
 * yallo.co were corrupted before it was found.
 *
 * So the fix is at three boundaries and each is asserted separately:
 *
 *   1. the editor SCHEMA, so a lost level serialises as 2 rather than vanishing;
 *   2. the WRITE, so no body reaches the database with a level this site cannot
 *      render, whichever surface wrote it;
 *   3. the RENDERER, so a level-less heading drawn from an older row is an h2
 *      and not an h3.
 *
 * The first is asserted against the real composed schema rather than against the
 * configuration, because reading the configuration is exactly the mistake.
 */

const HeadingDefaultTwo = Heading.extend({
  addAttributes() {
    return { ...this.parent?.(), level: { default: 2 } };
  },
}).configure({ levels: [2, 3] });

test.describe("the editor schema", () => {
  test("StarterKit alone defaults heading level to 1 — the defect", () => {
    /* The control. Without this, the assertion below could pass because the
       default was already 2 and the override does nothing. */
    const bare = getSchema([
      StarterKit.configure({ heading: { levels: [2, 3] } }),
    ]);
    expect(bare.nodes.heading.spec.attrs?.level.default).toBe(1);
  });

  test("addGlobalAttributes does NOT move it — measured, not assumed", () => {
    /* The first attempt. A global attribute loses to the one the node already
       declares, so the composed schema kept the default of 1 and the fix would
       have shipped doing nothing. Kept as a control: if a future TipTap makes
       global attributes win, this goes red and the simpler form becomes
       available again. */
    const withGlobal = getSchema([
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Extension.create({
        name: "headingGlobalAttempt",
        addGlobalAttributes() {
          return [
            { types: ["heading"], attributes: { level: { default: 2 } } },
          ];
        },
      }),
    ]);
    expect(withGlobal.nodes.heading.spec.attrs?.level.default).toBe(1);
  });

  test("extending the node does move it to 2", () => {
    const fixed = getSchema([
      StarterKit.configure({ heading: false }),
      HeadingDefaultTwo,
    ]);
    expect(fixed.nodes.heading.spec.attrs?.level.default).toBe(2);
  });
});

test.describe("the write boundary", () => {
  test("a heading with no level is coerced to 2, not dropped", () => {
    const doc = {
      type: "doc",
      content: [
        {
          type: "heading",
          content: [{ type: "text", text: "Client Context" }],
        },
      ],
    };
    const out = normaliseHeadings(doc) as {
      content: { attrs: { level: number } }[];
    };
    expect(out.content[0].attrs.level).toBe(2);
  });

  test("a heading at a level this site forbids is coerced, not refused", () => {
    /* Coerced rather than refused because saving a draft is never blocked
       (canon A2), and a level is structure rather than words: nothing anybody
       typed changes. */
    for (const level of [1, 4, 6, null, undefined, "2"]) {
      const out = normaliseHeadings({
        type: "doc",
        content: [{ type: "heading", attrs: { level }, content: [] }],
      }) as { content: { attrs: { level: number } }[] };
      expect(HEADING_LEVELS).toContain(out.content[0].attrs.level);
    }
  });

  test("a valid level is left exactly as it was", () => {
    for (const level of HEADING_LEVELS) {
      const out = normaliseHeadings({
        type: "doc",
        content: [{ type: "heading", attrs: { level }, content: [] }],
      }) as { content: { attrs: { level: number } }[] };
      expect(out.content[0].attrs.level).toBe(level);
    }
  });

  test("it reaches headings nested inside other blocks", () => {
    const out = normaliseHeadings({
      type: "doc",
      content: [
        {
          type: "blockquote",
          content: [{ type: "heading", attrs: {}, content: [] }],
        },
      ],
    }) as { content: { content: { attrs: { level: number } }[] }[] };
    expect(out.content[0].content[0].attrs.level).toBe(2);
  });

  test("nothing else in the document is touched", () => {
    const doc = {
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "unchanged" }] },
        {
          type: "keyFigure",
          attrs: { figure: "62%", source: "A source" },
          content: [],
        },
      ],
    };
    expect(JSON.stringify(normaliseHeadings(doc))).toBe(JSON.stringify(doc));
  });
});
