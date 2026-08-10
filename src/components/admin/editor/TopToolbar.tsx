"use client";

import type { Editor as TiptapEditor } from "@tiptap/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { BLOCK_INSERTS } from "./block-inserts";
import styles from "./Editor.module.css";
import { ImageInsertDialog } from "./ImageInsertDialog";

/**
 * The persistent formatting toolbar, R-26.5.
 *
 * WHY IT EXISTS WHEN A FLOATING TOOLBAR AND SLASH COMMANDS ALREADY DID. Because
 * both of those are recall interfaces: they show you what you can do only once
 * you already know to ask. Sumeet's verdict on the old surface was that he could
 * not work out what it offered, and R-26.5 rules the bar as Substack's composer,
 * which puts the whole set on screen permanently and keeps the floating toolbar
 * and the slash menu as the fast paths for people who have learned them. All
 * three, deliberately: this is the one a person finds, the other two are the
 * ones they graduate to.
 *
 * IT IS THE SAME SET AS THE SCHEMA ALLOWS AND NOTHING MORE. A control that
 * produced a node `src/lib/tiptap/schema.mjs` disallows would be a trap laid for
 * the writer, so the block menu is generated from one declaration that the slash
 * menu reads too.
 *
 * STICKY, NOT FIXED. Fixed would sit over the cockpit's own header when the page
 * scrolls; sticky keeps it under the rail where it belongs and lets full-screen
 * mode reuse it unchanged.
 */

interface ToolbarProps {
  editor: TiptapEditor | null;
  /** Bumped whenever the selection or the document changes, to re-read state. */
  revision: number;
}

/**
 * A control that toggles a mark or a node, and reports whether it is on.
 *
 * THE ACCESSIBLE NAME MUST CONTAIN THE VISIBLE TEXT. WCAG 2.5.3 Label in Name,
 * and axe's `label-content-name-mismatch` is the check that says so: a button
 * reading "1. List" whose `aria-label` said "Numbered list" is a button a voice
 * user cannot activate by reading it aloud. check:admin-render caught exactly
 * that in both themes at both widths. So every visible label below is a
 * substring of its title, and the title is the aria-label.
 */
function ToolButton({
  label,
  title,
  active,
  disabled,
  onClick,
  wide,
}: {
  label: string;
  title: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  wide?: boolean;
}) {
  return (
    <button
      aria-label={title}
      aria-pressed={active ?? false}
      className={wide ? styles.toolButtonWide : styles.toolButton}
      disabled={disabled}
      onClick={onClick}
      title={title}
      type="button"
    >
      {label}
    </button>
  );
}

/**
 * The link control.
 *
 * A PROMPT RATHER THAN A POPOVER, and this is a deliberate limit rather than an
 * oversight: a link editor worth building is a small form with validation, a
 * remove action and a preview, and it belongs in the round that can measure it.
 * What is here is honest — it asks for the address, it offers the current one
 * when there is one, and clearing it removes the link.
 */
function useLinkCommand(editor: TiptapEditor | null) {
  return useCallback(() => {
    if (!editor) return;
    const current = String(editor.getAttributes("link").href ?? "");
    const next = window.prompt(
      "Address for this link. Leave it empty to remove the link.",
      current,
    );
    if (next === null) return;
    const href = next.trim();
    if (href === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
  }, [editor]);
}

export function TopToolbar({ editor, revision }: ToolbarProps) {
  const [blocksOpen, setBlocksOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const blocksRef = useRef<HTMLDivElement>(null);
  const link = useLinkCommand(editor);

  /* `revision` is read so the component re-renders when the selection moves;
     without it the pressed states describe wherever the caret was when this
     last rendered for some other reason. */
  void revision;

  useEffect(() => {
    if (!blocksOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!blocksRef.current?.contains(e.target as Node)) setBlocksOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setBlocksOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [blocksOpen]);

  const disabled = editor === null;
  const is = (name: string, attrs?: Record<string, unknown>) =>
    editor?.isActive(name, attrs) ?? false;

  return (
    <div className={styles.toolbar} role="toolbar" aria-label="Formatting">
      <div className={styles.toolGroup}>
        {/* The style control is a select rather than three buttons: it is the
            one place where the options are mutually exclusive, and a radio
            group of three buttons occupies the width of the whole toolbar on a
            360px screen. */}
        <label className={styles.toolSelectWrap}>
          <span className={styles.visuallyHidden}>Paragraph style</span>
          <select
            className={styles.toolSelect}
            disabled={disabled}
            onChange={(e) => {
              const value = e.target.value;
              if (!editor) return;
              if (value === "p") {
                editor.chain().focus().setParagraph().run();
              } else {
                editor
                  .chain()
                  .focus()
                  .setHeading({ level: Number(value) as 2 | 3 })
                  .run();
              }
            }}
            value={
              is("heading", { level: 2 })
                ? "2"
                : is("heading", { level: 3 })
                  ? "3"
                  : "p"
            }
          >
            <option value="p">Body text</option>
            <option value="2">Heading</option>
            <option value="3">Subheading</option>
          </select>
        </label>
      </div>

      <div className={styles.toolGroup}>
        <ToolButton
          active={is("bold")}
          disabled={disabled}
          label="B"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          title="Bold"
        />
        <ToolButton
          active={is("italic")}
          disabled={disabled}
          label="I"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          title="Italic"
        />
        <ToolButton
          active={is("strike")}
          disabled={disabled}
          label="S"
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          title="Strikethrough"
        />
        <ToolButton
          active={is("code")}
          disabled={disabled}
          label="Code"
          onClick={() => editor?.chain().focus().toggleCode().run()}
          title="Inline code"
        />
        <ToolButton
          active={is("link")}
          disabled={disabled}
          label="Link"
          onClick={link}
          title="Link"
        />
      </div>

      <div className={styles.toolGroup}>
        <ToolButton
          active={is("bulletList")}
          disabled={disabled}
          label="List"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          title="Bulleted list"
        />
        <ToolButton
          active={is("orderedList")}
          disabled={disabled}
          label="Numbered"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          title="Numbered list"
        />
        <ToolButton
          active={is("blockquote")}
          disabled={disabled}
          label="Quote"
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          title="Quote a passage"
        />
      </div>

      <div className={styles.toolGroup}>
        {/* A5: the writer never leaves the piece to place an image. The dialog
            carries the library, the upload and the alt text in one act. */}
        <ToolButton
          disabled={disabled}
          label="Image"
          onClick={() => setImageOpen(true)}
          title="Image, from the library or a new upload"
          wide
        />

        <div className={styles.toolMenuWrap} ref={blocksRef}>
          <button
            aria-expanded={blocksOpen}
            aria-haspopup="true"
            className={styles.toolButtonWide}
            disabled={disabled}
            onClick={() => setBlocksOpen((v) => !v)}
            type="button"
          >
            Blocks
          </button>
          {blocksOpen ? (
            <div className={styles.toolMenu} role="menu">
              {BLOCK_INSERTS.map((block) => (
                <button
                  className={styles.toolMenuItem}
                  key={block.name}
                  onClick={() => {
                    if (editor) block.insert(editor);
                    setBlocksOpen(false);
                  }}
                  role="menuitem"
                  type="button"
                >
                  <span className={styles.toolMenuLabel}>{block.label}</span>
                  <span className={styles.toolMenuNote}>{block.note}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {imageOpen && editor ? (
        <ImageInsertDialog
          editor={editor}
          onClose={() => {
            setImageOpen(false);
            editor.chain().focus().run();
          }}
        />
      ) : null}
    </div>
  );
}
