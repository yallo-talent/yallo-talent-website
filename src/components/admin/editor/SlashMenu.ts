"use client";

import type { Editor, Range } from "@tiptap/core";
import { Extension } from "@tiptap/core";
import type { SuggestionProps } from "@tiptap/suggestion";
import Suggestion from "@tiptap/suggestion";
import { BLOCK_INSERTS } from "./block-inserts";

/**
 * The slash command, design §4.
 *
 * WHAT IT IS FOR. Every block this editor can make is reachable from the
 * keyboard without leaving the line you are writing. A writer who has to move
 * to a toolbar to insert a pull quote is a writer who drafts somewhere else.
 *
 * THE LIST IS NO LONGER HERE — it is `block-inserts.ts`, and this derives from
 * it. R-26.5 adds a permanent Blocks menu to the toolbar, so there are two
 * surfaces offering the same set; two copies of the list would be a block
 * reachable one way and not the other, which is the exact defect this file's
 * own comment warned about when it was the only surface.
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

/**
 * The slash menu's items, projected from the registry.
 *
 * The slash menu offers EVERY block including the ones the toolbar shows as
 * their own controls, because a person typing `/head` is not looking at the
 * toolbar. `inBlocksMenu` narrows the toolbar's menu, never this.
 */
export const SLASH_ITEMS: SlashItem[] = BLOCK_INSERTS.map((block) => ({
  title: block.label,
  hint: block.note,
  run: (editor: Editor, range: Range) => block.insert(editor, range),
}));

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
