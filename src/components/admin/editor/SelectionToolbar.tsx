"use client";

import type { Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { useState } from "react";
import styles from "./Editor.module.css";

/**
 * The floating toolbar on selection, design §4.
 *
 * ONLY WHAT APPLIES TO A SELECTION. Bold, italic, code, a link, and the two
 * heading levels. Inserting a block is the slash command's job — a control that
 * inserts a pull quote while text is selected has to decide what happens to the
 * selection, and every answer to that is a surprise.
 *
 * THE LINK CONTROL IS A FIELD, NOT A `prompt()`. A browser prompt cannot be
 * styled, cannot be reached consistently by a screen reader and vanishes on a
 * focus change. It is also the one control here that can produce a publish
 * refusal (rule 3, an internal link that resolves nowhere), so it is worth the
 * few extra lines to make it a real form.
 */
export function SelectionToolbar({ editor }: { editor: Editor }) {
  const [linkOpen, setLinkOpen] = useState(false);
  const [href, setHref] = useState("");

  const applyLink = () => {
    const value = href.trim();
    if (value === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: value })
        .run();
    }
    setLinkOpen(false);
    setHref("");
  };

  return (
    <BubbleMenu
      className={styles.bubble}
      editor={editor}
      options={{ placement: "top" }}
    >
      {linkOpen ? (
        <div className={styles.bubbleLink}>
          <label className={styles.bubbleLinkLabel} htmlFor="bubble-href">
            Link
          </label>
          <input
            className={styles.bubbleLinkInput}
            id="bubble-href"
            onChange={(e) => setHref(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                applyLink();
              }
              if (e.key === "Escape") setLinkOpen(false);
            }}
            placeholder="/insights or https://"
            // biome-ignore lint/a11y/noAutofocus: the control was just opened by a deliberate click, and the field is its only purpose
            autoFocus
            type="text"
            value={href}
          />
          <button
            className={styles.bubbleButton}
            onClick={applyLink}
            type="button"
          >
            Apply
          </button>
        </div>
      ) : (
        <>
          <button
            aria-pressed={editor.isActive("bold")}
            className={styles.bubbleButton}
            onClick={() => editor.chain().focus().toggleBold().run()}
            type="button"
          >
            Bold
          </button>
          <button
            aria-pressed={editor.isActive("italic")}
            className={styles.bubbleButton}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            type="button"
          >
            Italic
          </button>
          <button
            aria-pressed={editor.isActive("code")}
            className={styles.bubbleButton}
            onClick={() => editor.chain().focus().toggleCode().run()}
            type="button"
          >
            Code
          </button>
          <button
            aria-pressed={editor.isActive("heading", { level: 2 })}
            className={styles.bubbleButton}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            type="button"
          >
            H2
          </button>
          <button
            aria-pressed={editor.isActive("heading", { level: 3 })}
            className={styles.bubbleButton}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            type="button"
          >
            H3
          </button>
          <button
            aria-pressed={editor.isActive("link")}
            className={styles.bubbleButton}
            onClick={() => {
              setHref(String(editor.getAttributes("link").href ?? ""));
              setLinkOpen(true);
            }}
            type="button"
          >
            Link
          </button>
        </>
      )}
    </BubbleMenu>
  );
}
