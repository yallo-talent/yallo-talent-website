"use client";

import type { Editor, Range } from "@tiptap/core";
import { Extension } from "@tiptap/core";
import type { SuggestionProps } from "@tiptap/suggestion";
import Suggestion from "@tiptap/suggestion";

/**
 * The slash command, design §4.
 *
 * WHAT IT IS FOR. Every block this editor can make is reachable from the
 * keyboard without leaving the line you are writing. A writer who has to move
 * to a toolbar to insert a pull quote is a writer who drafts somewhere else.
 *
 * WHY THE COMMAND LIST IS DATA. The same list drives the menu and the search,
 * and a second copy for the search would be a block that exists but cannot be
 * found. Adding a block means adding one row here.
 *
 * THE MENU IS RENDERED BY REACT, not by this file. `Suggestion` owns the
 * matching, the keyboard handling and the caret position; the component owns
 * what it looks like. Keeping the popup markup out of here is what lets the
 * menu obey `DESIGN.md` rather than TipTap's defaults.
 */

export interface SlashItem {
  title: string;
  hint: string;
  /** Everything the item does, including removing the typed `/query`. */
  run: (editor: Editor, range: Range) => void;
}

export const SLASH_ITEMS: SlashItem[] = [
  {
    title: "Heading 2",
    hint: "A section heading. H1 is the title field.",
    run: (editor, range) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 2 })
        .run(),
  },
  {
    title: "Heading 3",
    hint: "A subheading inside a section.",
    run: (editor, range) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 3 })
        .run(),
  },
  {
    title: "Bulleted list",
    hint: "An unordered list.",
    run: (editor, range) =>
      editor.chain().focus().deleteRange(range).toggleBulletList().run(),
  },
  {
    title: "Numbered list",
    hint: "An ordered list.",
    run: (editor, range) =>
      editor.chain().focus().deleteRange(range).toggleOrderedList().run(),
  },
  {
    title: "Quote",
    hint: "An indented quotation.",
    run: (editor, range) =>
      editor.chain().focus().deleteRange(range).toggleBlockquote().run(),
  },
  {
    title: "Code block",
    hint: "Preformatted text.",
    run: (editor, range) =>
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
  },
  {
    title: "Divider",
    hint: "A horizontal rule.",
    run: (editor, range) =>
      editor.chain().focus().deleteRange(range).setHorizontalRule().run(),
  },
  {
    title: "Pull quote",
    hint: "A quotation set large, with an optional attribution.",
    run: (editor, range) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({ type: "pullQuote", content: [] })
        .run(),
  },
  {
    title: "Key figure",
    hint: "One number with its label and its source.",
    run: (editor, range) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({ type: "keyFigure", content: [] })
        .run(),
  },
  {
    title: "FAQ",
    hint: "Question and answer pairs. Emits FAQPage schema.",
    run: (editor, range) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({
          type: "faq",
          attrs: { items: [{ question: "", answer: "" }] },
        })
        .run(),
  },
  {
    title: "Related desk",
    hint: "A card linking to an industry, platform or discipline desk.",
    run: (editor, range) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({ type: "relatedDesk" })
        .run(),
  },
  {
    title: "PetalPlate divider",
    hint: "The house mark as a section break.",
    run: (editor, range) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({ type: "petalDivider" })
        .run(),
  },
  {
    title: "Image",
    hint: "An image with a caption and required alt text.",
    run: (editor, range) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({ type: "image" })
        .run(),
  },
  {
    title: "Chart",
    hint: "A bar or line chart from typed rows, with its source.",
    run: (editor, range) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({
          type: "chart",
          attrs: { rows: [{ label: "", value: 0 }] },
        })
        .run(),
  },
];

/** Case-insensitive prefix and substring match over title and hint. */
export function filterSlashItems(query: string): SlashItem[] {
  const q = query.trim().toLowerCase();
  if (q === "") return SLASH_ITEMS;
  return SLASH_ITEMS.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.hint.toLowerCase().includes(q),
  );
}

export interface SlashRenderer {
  onStart: (props: SlashState) => void;
  onUpdate: (props: SlashState) => void;
  onKeyDown: (event: KeyboardEvent) => boolean;
  onExit: () => void;
}

export interface SlashState {
  items: SlashItem[];
  rect: DOMRect | null;
  select: (index: number) => void;
}

/**
 * `/` opens the menu, and only at the start of a block.
 *
 * `startOfLine: true` is deliberate: a forward slash mid-sentence is a forward
 * slash — "S/4HANA" is written on this site constantly — and a menu that
 * opened there would fight the writer on the estate's most common product
 * name.
 */
export function slashCommand(makeRenderer: () => SlashRenderer) {
  return Extension.create({
    name: "slashCommand",
    addProseMirrorPlugins() {
      return [
        Suggestion({
          editor: this.editor,
          char: "/",
          startOfLine: true,
          allowSpaces: false,
          items: ({ query }: { query: string }) => filterSlashItems(query),
          command: ({
            editor,
            range,
            props,
          }: {
            editor: Editor;
            range: Range;
            props: SlashItem;
          }) => props.run(editor, range),
          /* THE ADAPTER, and it earns its place. `Suggestion` hands its
             renderer `clientRect`, `command` and an `onKeyDown({ event })`
             wrapper; the popup wants a rectangle, a `select(index)` and a
             plain `KeyboardEvent`. Translating here rather than in the
             component is what keeps the component ignorant of the plugin, so
             replacing the suggestion mechanism later touches one file. */
          render: () => {
            const renderer = makeRenderer();
            /* The plugin's own props type, imported rather than restated.
               An earlier draft used `any` here and then a hand-written shape;
               both were claims about a contract the package already publishes,
               and the hand-written one was wrong about `clientRect` being
               nullable. */
            type Props = SuggestionProps<SlashItem, SlashItem>;
            const adapt = (props: Props): SlashState => ({
              items: (props.items ?? []) as SlashItem[],
              rect: props.clientRect ? props.clientRect() : null,
              select: (index: number) => {
                const item = (props.items ?? [])[index];
                if (item) props.command(item);
              },
            });
            return {
              onStart: (props: Props) => renderer.onStart(adapt(props)),
              onUpdate: (props: Props) => renderer.onUpdate(adapt(props)),
              onKeyDown: ({ event }: { event: KeyboardEvent }) =>
                renderer.onKeyDown(event),
              onExit: () => renderer.onExit(),
            };
          },
        }),
      ];
    },
  });
}
