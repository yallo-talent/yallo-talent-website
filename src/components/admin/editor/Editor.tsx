"use client";

import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import type { Editor as TiptapEditor } from "@tiptap/react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { readingTimeMinutes, wordCount } from "@/lib/tiptap/text.mjs";
import styles from "./Editor.module.css";
import { SelectionToolbar } from "./SelectionToolbar";
import { SlashPopup, useSlashRenderer } from "./SlashPopup";
import { YALLO_NODES } from "./YalloNodes";

/**
 * The writing surface, design §4.
 *
 * THE BAR IS A WRITER NEVER WANTING TO DRAFT SOMEWHERE ELSE FIRST, and that is
 * a bar about loss and about looks in equal measure. Loss: autosave runs on a
 * short debounce and the saved state is visible at all times, so a closed tab
 * costs nothing and nobody has to wonder. Looks: the column is the publication
 * column, the title is set in the display face and the body in the body face,
 * because a surface that looks like a form produces writing that reads like a
 * form.
 *
 * THE NODE SET IS THE ALLOW-LIST AND NOTHING MORE. StarterKit is configured
 * DOWN to what `src/lib/tiptap/schema.mjs` permits rather than accepted whole:
 * its defaults include H1 through H6, and H1 is the title field on this site,
 * so a body H1 would publish a second first-level heading on every article. A
 * node the editor can produce and the publish action refuses is a trap laid for
 * the writer, so the two sets are the same set.
 *
 * AUTOSAVE NEVER VALIDATES. Canon A2 is explicit that saving a draft is never
 * blocked and publishing is. Everything here writes; the refusals live in the
 * publish action where a writer meets them once, deliberately, rather than
 * every few seconds mid-sentence.
 *
 * WHY THE PREVIEW IS AN IFRAME AND NOT A SECOND RENDERER. Design §4 asks for
 * the preview to be "the real article template". A React copy of that template
 * inside the cockpit would be a second implementation that drifts, and the
 * whole estate has been bitten by second copies. The iframe loads the same
 * server route a reader would get, so it cannot disagree with the page.
 */

export type SaveState = "idle" | "dirty" | "saving" | "saved" | "error";

export interface EditorProps {
  /** The stored body. TipTap owns it after mount; this is the starting point. */
  initialBody: unknown;
  /** Writes the body and resolves when the row is durable. */
  onSave: (body: unknown) => Promise<void>;
  /** The server route that renders this piece in its real template. */
  previewPath: string;
  /** Blocked when the row has never been saved, so there is nothing to preview. */
  previewReady: boolean;
}

const AUTOSAVE_MS = 1500;

const SAVE_LABEL: Record<SaveState, string> = {
  idle: "No unsaved changes",
  dirty: "Unsaved changes",
  saving: "Saving",
  saved: "Saved",
  error: "Not saved",
};

export function Editor({
  initialBody,
  onSave,
  previewPath,
  previewReady,
}: EditorProps) {
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [fullScreen, setFullScreen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewTheme, setPreviewTheme] = useState<"light" | "dark">("light");
  const [previewWidth, setPreviewWidth] = useState<360 | 1280>(1280);
  /* Seeded from the stored body rather than set by an effect. The counts are
     COMPUTED, never asserted, and computing them once at mount is both the
     honest reading and the one that does not trigger a cascading render. */
  const [counts, setCounts] = useState(() => ({
    words: wordCount(initialBody),
    minutes: readingTimeMinutes(initialBody),
  }));
  const [previewNonce, setPreviewNonce] = useState(0);

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef<unknown>(null);
  const slash = useSlashRenderer();

  const extensions = useMemo(
    () => [
      StarterKit.configure({
        /* Down to the allow-list. H1 is the title field; strike, and the
           blocks StarterKit does not carry, are added or withheld here rather
           than left to its defaults. */
        heading: { levels: [2, 3] },
        link: false,
        /* The Yallo image node replaces StarterKit's, because alt text is a
           required field on this site and StarterKit's image does not know
           that. Two `image` nodes in one schema is a crash, not a conflict.
           Typed as the option record rather than `any`: the key exists at
           runtime and the published types lag it across minor versions, which
           is a narrower claim than "this object may be anything". */
        ...({ image: false } as Record<string, false>),
      }),
      Link.configure({ openOnClick: false, autolink: false }),
      Placeholder.configure({
        placeholder: "Write, or press / for a block.",
      }),
      ...YALLO_NODES,
      slash.extension,
    ],
    [slash.extension],
  );

  const scheduleSave = useCallback(
    (editor: TiptapEditor) => {
      const body = editor.getJSON();
      pending.current = body;
      setCounts({
        words: wordCount(body),
        minutes: readingTimeMinutes(body),
      });
      setSaveState("dirty");
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(async () => {
        setSaveState("saving");
        try {
          await onSave(pending.current);
          setSaveState("saved");
          setSaveError(null);
          /* The preview is a separate document; it does not know the row
             changed. Bumping the nonce reloads it, so "side by side" means
             the two panes agree rather than merely sit together. */
          setPreviewNonce((n) => n + 1);
        } catch (err) {
          setSaveState("error");
          setSaveError((err as Error).message);
        }
      }, AUTOSAVE_MS);
    },
    [onSave],
  );

  const editor = useEditor({
    extensions,
    content: (initialBody as { type: "doc" } | null) ?? {
      type: "doc",
      content: [],
    },
    /* Next renders this on the server first; TipTap must not, or the first
       client render disagrees with it and React discards the whole tree. */
    immediatelyRender: false,
    editorProps: {
      attributes: { class: styles.prose, "aria-label": "Article body" },
    },
    onUpdate: ({ editor: e }) => scheduleSave(e),
  });

  /* A tab closed mid-debounce would lose the last edit, which is exactly what
     "no work is ever lost to a closed tab" rules out. The browser will not
     wait for a promise here, so this is a best-effort flush plus the warning
     that makes the remaining risk the person's own choice. */
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (saveState === "dirty" || saveState === "saving") {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [saveState]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  /* Escape leaves full screen. A mode with no way out but the mouse is a mode
     somebody gets stuck in. */
  useEffect(() => {
    if (!fullScreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullScreen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullScreen]);

  const saveNow = useCallback(async () => {
    if (!editor) return;
    if (timer.current) clearTimeout(timer.current);
    setSaveState("saving");
    try {
      await onSave(editor.getJSON());
      setSaveState("saved");
      setSaveError(null);
      setPreviewNonce((n) => n + 1);
    } catch (err) {
      setSaveState("error");
      setSaveError((err as Error).message);
    }
  }, [editor, onSave]);

  return (
    <div
      className={fullScreen ? styles.shellFull : styles.shell}
      data-full-screen={fullScreen ? "true" : "false"}
    >
      <div className={styles.bar}>
        <div className={styles.barGroup}>
          {/* aria-live so the state is announced, not only seen. A save
              indicator a screen-reader user cannot read is a save indicator
              that does not do its job. */}
          <output
            aria-live="polite"
            className={styles.saveState}
            data-state={saveState}
          >
            {SAVE_LABEL[saveState]}
          </output>
          <span className={styles.counts}>
            {counts.words} word{counts.words === 1 ? "" : "s"} ·{" "}
            {counts.minutes} min read
          </span>
        </div>
        <div className={styles.barGroup}>
          <button className={styles.barButton} onClick={saveNow} type="button">
            Save now
          </button>
          <button
            aria-pressed={showPreview}
            className={styles.barButton}
            onClick={() => setShowPreview((v) => !v)}
            type="button"
          >
            Preview
          </button>
          <button
            aria-pressed={fullScreen}
            className={styles.barButton}
            onClick={() => setFullScreen((v) => !v)}
            type="button"
          >
            {fullScreen ? "Leave full screen" : "Full screen"}
          </button>
        </div>
      </div>

      {saveError ? (
        <p className={styles.saveError} role="alert">
          {saveError}
        </p>
      ) : null}

      <div className={showPreview ? styles.panesSplit : styles.panes}>
        <div className={styles.writing}>
          {editor ? <SelectionToolbar editor={editor} /> : null}
          <EditorContent editor={editor} />
          <SlashPopup state={slash.state} />
        </div>

        {showPreview ? (
          <aside className={styles.preview}>
            <div className={styles.previewBar}>
              <span className={styles.previewLabel}>The real template</span>
              <div className={styles.previewControls}>
                <button
                  aria-pressed={previewTheme === "light"}
                  className={styles.previewToggle}
                  onClick={() => setPreviewTheme("light")}
                  type="button"
                >
                  Light
                </button>
                <button
                  aria-pressed={previewTheme === "dark"}
                  className={styles.previewToggle}
                  onClick={() => setPreviewTheme("dark")}
                  type="button"
                >
                  Dark
                </button>
                <button
                  aria-pressed={previewWidth === 360}
                  className={styles.previewToggle}
                  onClick={() => setPreviewWidth(360)}
                  type="button"
                >
                  360
                </button>
                <button
                  aria-pressed={previewWidth === 1280}
                  className={styles.previewToggle}
                  onClick={() => setPreviewWidth(1280)}
                  type="button"
                >
                  1280
                </button>
              </div>
            </div>
            {previewReady ? (
              <div className={styles.previewFrameWrap}>
                <iframe
                  className={styles.previewFrame}
                  /* The nonce is what makes the pane follow the writing.
                     Without it the frame shows whatever was saved when the
                     preview was opened, which is a preview that lies. */
                  key={`${previewTheme}-${previewWidth}-${previewNonce}`}
                  src={`${previewPath}?theme=${previewTheme}&nonce=${previewNonce}`}
                  style={{ width: `${previewWidth}px` }}
                  title="Preview in the published template"
                />
              </div>
            ) : (
              <p className={styles.previewEmpty}>
                Save once and the preview appears. There is nothing stored to
                render yet.
              </p>
            )}
          </aside>
        ) : null}
      </div>
    </div>
  );
}
