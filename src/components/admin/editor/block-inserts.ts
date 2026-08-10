"use client";

import type { Editor, Range } from "@tiptap/core";

/**
 * THE BLOCK REGISTRY — the seam A2A asks for, and the only list of what this
 * editor can insert.
 *
 * WHY IT IS ONE FILE. Before this round the slash menu held the list and the
 * toolbar did not exist; R-26.5 adds a permanent Blocks menu, and a second copy
 * of the list would be a block reachable one way and not the other. The slash
 * menu now derives its items from here, so adding a block is adding one row.
 *
 * WHAT "ADDITIVE" MEANS, precisely, because it is the claim the next round will
 * rely on. A new block type is four additions and no migration:
 *
 *   1. a name in `BLOCK_NODES` in `src/lib/tiptap/schema.mjs`, which is the
 *      allow-list the publish action, the importer and the renderer all read;
 *   2. an attribute interface in `src/lib/tiptap/blocks.ts`, imported by both
 *      the node view that writes it and the renderer that draws it, so the two
 *      cannot disagree about what the block holds;
 *   3. a `case` in `renderBlock` in
 *      `src/components/blocks/editorial/TiptapBody.tsx`, which has no default
 *      branch — an unknown node draws nothing rather than drawing anything;
 *   4. a TipTap node in `YalloNodes.tsx` and one row here.
 *
 * Every existing body stays valid throughout, because a document that does not
 * carry the new node is unaffected by its existence. That is the whole property:
 * audio, native video and a carousel are each one pass of those four steps, and
 * none of them touches a stored body. `spec/block-registry.md` records it
 * outside the code as well.
 *
 * THE ORDER IS THE ORDER BOTH SURFACES SHOW. Structural blocks first, because a
 * heading is what most people came for; the house blocks after, because they are
 * what makes an article look like this publication and not like a text file.
 */

export interface BlockInsert {
  /** Stable id: the node type where there is one, the command name otherwise. */
  name: string;
  label: string;
  note: string;
  /**
   * Insert it. The slash menu passes the range of the typed `/query` so it can
   * be removed in the same transaction; the toolbar passes nothing.
   */
  insert: (editor: Editor, range?: Range) => void;
  /**
   * Whether the toolbar's Blocks menu offers it. Headings, lists and quotes are
   * on the toolbar as their own controls, so repeating them inside the menu
   * would be the same command in two places a centimetre apart.
   */
  inBlocksMenu: boolean;
}

/** Removes the slash query when there is one, and focuses either way. */
function start(editor: Editor, range?: Range) {
  const chain = editor.chain().focus();
  return range ? chain.deleteRange(range) : chain;
}

export const BLOCK_INSERTS: BlockInsert[] = [
  {
    name: "heading2",
    label: "Heading",
    note: "A section heading. H1 is the title field.",
    inBlocksMenu: false,
    insert: (editor, range) =>
      start(editor, range).setNode("heading", { level: 2 }).run(),
  },
  {
    name: "heading3",
    label: "Subheading",
    note: "A subheading inside a section.",
    inBlocksMenu: false,
    insert: (editor, range) =>
      start(editor, range).setNode("heading", { level: 3 }).run(),
  },
  {
    name: "bulletList",
    label: "Bulleted list",
    note: "An unordered list.",
    inBlocksMenu: false,
    insert: (editor, range) => start(editor, range).toggleBulletList().run(),
  },
  {
    name: "orderedList",
    label: "Numbered list",
    note: "An ordered list.",
    inBlocksMenu: false,
    insert: (editor, range) => start(editor, range).toggleOrderedList().run(),
  },
  {
    name: "blockquote",
    label: "Quote",
    note: "An indented quotation.",
    inBlocksMenu: false,
    insert: (editor, range) => start(editor, range).toggleBlockquote().run(),
  },
  {
    name: "codeBlock",
    label: "Code block",
    note: "Preformatted text.",
    inBlocksMenu: true,
    insert: (editor, range) => start(editor, range).toggleCodeBlock().run(),
  },
  {
    name: "horizontalRule",
    label: "Divider",
    note: "A horizontal rule.",
    inBlocksMenu: true,
    insert: (editor, range) => start(editor, range).setHorizontalRule().run(),
  },
  {
    name: "pullQuote",
    label: "Pull quote",
    note: "A quotation set large, with an optional attribution.",
    inBlocksMenu: true,
    insert: (editor, range) =>
      start(editor, range)
        .insertContent({ type: "pullQuote", content: [] })
        .run(),
  },
  {
    name: "keyFigure",
    label: "Key figure",
    note: "One number with its label and its source.",
    inBlocksMenu: true,
    insert: (editor, range) =>
      start(editor, range)
        .insertContent({ type: "keyFigure", content: [] })
        .run(),
  },
  {
    name: "faq",
    label: "FAQ",
    note: "Question and answer pairs. Emits FAQPage schema.",
    inBlocksMenu: true,
    insert: (editor, range) =>
      start(editor, range)
        .insertContent({
          type: "faq",
          attrs: { items: [{ question: "", answer: "" }] },
        })
        .run(),
  },
  {
    name: "relatedDesk",
    label: "Related desk",
    note: "A card linking to an industry, platform or capability desk.",
    inBlocksMenu: true,
    insert: (editor, range) =>
      start(editor, range).insertContent({ type: "relatedDesk" }).run(),
  },
  {
    name: "petalDivider",
    label: "PetalPlate divider",
    note: "The house mark as a section break.",
    inBlocksMenu: true,
    insert: (editor, range) =>
      start(editor, range).insertContent({ type: "petalDivider" }).run(),
  },
  {
    name: "image",
    label: "Image",
    note: "An image with a caption and required alt text.",
    inBlocksMenu: true,
    insert: (editor, range) =>
      start(editor, range).insertContent({ type: "image" }).run(),
  },
  {
    /* A2A's one new node this round. Audio, native video and a carousel are the
       same four steps and none of them is built here: R-26.5 scopes hosting and
       transcoding out by name, and an embed of somebody else's player needs
       neither. */
    name: "youtube",
    label: "YouTube video",
    note: "A reshared video, embedded without cookies until it is played.",
    inBlocksMenu: true,
    insert: (editor, range) =>
      start(editor, range).insertContent({ type: "youtube" }).run(),
  },
  {
    name: "chart",
    label: "Chart",
    note: "A bar or line chart from typed rows, with its source.",
    inBlocksMenu: true,
    insert: (editor, range) =>
      start(editor, range)
        .insertContent({
          type: "chart",
          attrs: { rows: [{ label: "", value: 0 }] },
        })
        .run(),
  },
];
