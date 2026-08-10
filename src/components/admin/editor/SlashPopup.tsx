"use client";

import { useState } from "react";
import styles from "./Editor.module.css";
import { type SlashItem, type SlashState, slashCommand } from "./SlashMenu";

/**
 * The slash menu's appearance and its keyboard, kept apart from its matching.
 *
 * `Suggestion` decides WHAT matches and WHERE the caret is; this decides what
 * the list looks like and how the arrow keys move through it. The split is why
 * the popup can obey `DESIGN.md` instead of a plugin's default markup.
 *
 * THE KEYBOARD IS THE POINT. A slash menu you have to reach for with a mouse
 * has not saved anybody anything. Up, down, Enter and Escape all work, the
 * active row is marked with `aria-selected`, and the list is a real
 * `listbox` so a screen reader announces the count and the position.
 */
/**
 * The listbox and its options need stable ids, because the element that OWNS the
 * keyboard is not this list — it is the editor, which keeps focus throughout.
 *
 * The impeccable pass measured the gap: arrow keys moved `aria-selected` between
 * options, and nothing told a screen reader that the focused textbox had a popup
 * open or which row was current, because `aria-activedescendant` was null and the
 * selected option never receives focus. Editor.tsx writes the three attributes
 * onto the ProseMirror node from these ids.
 */
export const SLASH_LIST_ID = "slash-menu-list";
export const slashOptionId = (index: number) => `slash-menu-option-${index}`;

export function useSlashRenderer() {
  /**
   * The open menu, or null, WITH its highlighted row.
   *
   * ONE PIECE OF STATE, NOT STATE PLUS TWO REFS. The first version kept the
   * items in state and both the selected index and a mirror of the items in
   * refs, so that `onKeyDown` — which must answer synchronously, outside
   * React's cycle — could read the current values. That works and it reads a
   * ref during render to draw the highlight, which is a render whose output
   * depends on something React does not track. The compiler said so.
   *
   * A ProseMirror plugin's callbacks genuinely do live outside the render
   * cycle, and the honest way to serve them is a functional update: every
   * handler below computes the next state FROM the previous one, so nothing
   * has to read the current value during render to stay correct.
   */
  const [state, setState] = useState<(SlashState & { active: number }) | null>(
    null,
  );

  /* Created once. The plugin is installed into the editor's schema at mount
     and must not be rebuilt on a re-render — a new extension identity would
     tear down and reinstall the suggestion plugin on every keystroke. */
  const [extension] = useState(() =>
    slashCommand(() => ({
      onStart: (props) => setState({ ...props, active: 0 }),
      onUpdate: (props) => setState({ ...props, active: 0 }),
      onKeyDown: (event) => {
        if (event.key === "Escape") {
          setState(null);
          return true;
        }
        if (
          event.key !== "ArrowDown" &&
          event.key !== "ArrowUp" &&
          event.key !== "Enter"
        ) {
          return false;
        }
        /* Enter has to act on the CURRENT selection, and the only place that
           is reliably known is inside the updater. Selecting from there and
           returning the state unchanged keeps one source of truth. */
        setState((current) => {
          if (!current || current.items.length === 0) return current;
          const n = current.items.length;
          if (event.key === "ArrowDown") {
            return { ...current, active: (current.active + 1) % n };
          }
          if (event.key === "ArrowUp") {
            return { ...current, active: (current.active - 1 + n) % n };
          }
          current.select(current.active);
          return current;
        });
        return true;
      },
      onExit: () => setState(null),
    })),
  );

  return { extension, state };
}

export function SlashPopup({
  state,
}: {
  state: (SlashState & { active: number }) | null;
}) {
  if (!state || state.items.length === 0) return null;
  const rect = state.rect;
  return (
    <div
      className={styles.slash}
      style={
        rect
          ? { top: `${rect.bottom + 6}px`, left: `${rect.left}px` }
          : undefined
      }
    >
      {/* A listbox of options, and NOT a list containing buttons. An `option`
          may not contain a control: a button inside it is a second tab stop
          inside a thing that is selected rather than focused, and a screen
          reader then announces a button where the pattern promises an option.
          The keyboard is handled in `useSlashRenderer` (Up, Down, Enter,
          Escape) and each option is programmatically focusable without joining
          the tab order, which is what the listbox pattern asks for. */}
      <div
        aria-label="Insert a block"
        className={styles.slashList}
        id={SLASH_LIST_ID}
        role="listbox"
        tabIndex={-1}
      >
        {state.items.map((item: SlashItem, i: number) => (
          <div
            aria-selected={i === state.active}
            className={
              i === state.active ? styles.slashItemActive : styles.slashItem
            }
            id={slashOptionId(i)}
            key={item.title}
            onClick={() => state.select(i)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                state.select(i);
              }
            }}
            role="option"
            tabIndex={-1}
          >
            <span className={styles.slashTitle}>{item.title}</span>
            <span className={styles.slashHint}>{item.hint}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
