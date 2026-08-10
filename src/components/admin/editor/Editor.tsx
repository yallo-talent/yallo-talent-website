"use client";

import Heading from "@tiptap/extension-heading";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import type { Editor as TiptapEditor } from "@tiptap/react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { ReactNode, RefObject } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toPlainDoc } from "@/lib/tiptap/schema.mjs";
import { readingTimeMinutes, wordCount } from "@/lib/tiptap/text.mjs";
import styles from "./Editor.module.css";
import { SelectionToolbar } from "./SelectionToolbar";
import { SlashPopup, useSlashRenderer } from "./SlashPopup";
import { type SaveState, useDebouncedSave } from "./save-state";
import { TopToolbar } from "./TopToolbar";
import { YALLO_NODES } from "./YalloNodes";

/**
 * The writing surface, design §4, at the bar R-26.5 sets: Substack's composer.
 *
 * THE BAR IS A WRITER NEVER WANTING TO DRAFT SOMEWHERE ELSE FIRST, and that is
 * a bar about loss and about looks in equal measure. Loss: autosave runs on a
 * short debounce and the saved state is visible at all times, so a closed tab
 * costs nothing and nobody has to wonder. Looks: the column is the publication
 * column, the title is set in the display face and the body in the body face,
 * because a surface that looks like a form produces writing that reads like a
 * form.
 *
 * THREE WAYS TO REACH EVERY BLOCK, AND THAT IS DELIBERATE. R-26.5 adds a
 * persistent top toolbar IN ADDITION to the floating selection toolbar and the
 * slash menu. The first is the one a person finds; the other two are the ones
 * they graduate to. All three read one registry, so none of them can offer a
 * block the others do not.
 *
 * THE SAVED STATE IS REPORTED OUTWARD, NOT HELD HERE. The rail shows one pill
 * for the whole canvas, and the canvas has three writers since R-26.5 moved the
 * title and the subtitle onto it. Two indicators for one question is one too
 * many, so this reports and `EditorSurface` reduces.
 *
 * THE NODE SET IS THE ALLOW-LIST AND NOTHING MORE. StarterKit is configured
 * DOWN to what `src/lib/tiptap/schema.mjs` permits rather than accepted whole:
 * its defaults include H1 through H6, and H1 is the title field on this site,
 * so a body H1 would publish a second first-level heading on every article. A
 * node the editor can produce and the renderer cannot draw is a trap laid for
 * the writer, so the two sets are the same set.
 *
 * AUTOSAVE NEVER VALIDATES. R-26.1: nothing in this cockpit refuses a save.
 * Every rule runs beside the writing, naming the exact text, and the decision
 * stays theirs.
 *
 * WHY THE PREVIEW IS AN IFRAME AND NOT A SECOND RENDERER. Design §4 asks for
 * the preview to be "the real article template". A React copy of that template
 * inside the cockpit would be a second implementation that drifts, and the
 * whole estate has been bitten by second copies. The iframe loads the same
 * server route a reader would get, so it cannot disagree with the page.
 */

/**
 * The heading `level` default, moved from 1 to 2 — a data-loss fix, not a
 * tidy-up.
 *
 * TipTap's Heading declares `level` with a default of 1, and
 * `configure({ levels: [2, 3] })` narrows only what the COMMANDS offer, not the
 * attribute. `getJSON()` omits any attribute equal to its default, so the
 * instant a heading in this editor sat at level 1 it serialised with no `level`
 * key at all. The stored body then carried a heading the publish action refused
 * ("heading level undefined") and the case-study template cannot split on,
 * because `Movements` looks for level 2. Three published studies on yallo.co
 * lost their section structure that way before it was found.
 *
 * `addGlobalAttributes` was tried first and DOES NOT WORK: a global attribute
 * loses to the attribute the node already declares, so the composed schema kept
 * the default of 1. That is in the spec as a control. The node is therefore
 * extended and StarterKit's own is withheld, because two heading nodes in one
 * schema is a crash.
 *
 * The resulting schema default is asserted in `e2e/editor-schema.spec.ts`
 * rather than assumed, because "configure narrows the attribute too" is
 * precisely the assumption that produced the defect.
 *
 * IT IS NOT THE ONLY GUARD. `normaliseHeadings` coerces on the way into the
 * database, because the editor is one writer of that column and the import is
 * another; and TiptapBody falls back to 2 rather than 3, so the writer and the
 * renderer agree about what a level-less heading is.
 */
const HeadingDefaultTwo = Heading.extend({
  addAttributes() {
    return { ...this.parent?.(), level: { default: 2 } };
  },
}).configure({ levels: [2, 3] });

export type { SaveState };

export interface EditorProps {
  /** The stored body. TipTap owns it after mount; this is the starting point. */
  initialBody: unknown;
  /** Writes the body and resolves when the row is durable. */
  onSave: (body: unknown) => Promise<void>;
  /** The server route that renders this piece in its real template. */
  previewPath: string;
  /** Blocked when the row has never been saved, so there is nothing to preview. */
  previewReady: boolean;
  /**
   * Told the current document on every change, so the live checks can run
   * against what is on screen rather than what was last saved.
   *
   * A CALLBACK RATHER THAN LIFTED STATE. ProseMirror owns the document, and
   * making React the owner would mean a controlled editor: a re-render per
   * keystroke and a caret that jumps. This reports outward and keeps ownership
   * where it is.
   */
  onDocChange?: (body: unknown) => void;
  /** The rail owns the pill; this feeds it. */
  onSaveState: (state: SaveState, error: string | null) => void;
  showPreview: boolean;
  fullScreen: boolean;
  /** The title, subtitle and byline, rendered between the toolbar and the body. */
  header?: ReactNode;
  /**
   * Filled with a function that saves immediately.
   *
   * A REF RATHER THAN A PROP CALLBACK. The rail's Save now and the publish
   * sheet's confirm both need to flush this editor's debounce, and both live
   * above it; passing a signal down and watching it change would re-render the
   * editor on every flush. Assigning into a ref is the same capability with no
   * render.
   */
  saveNowRef?: RefObject<(() => Promise<void>) | null>;
}

export function Editor({
  initialBody,
  onSave,
  previewPath,
  previewReady,
  onDocChange,
  onSaveState,
  showPreview,
  fullScreen,
  header,
  saveNowRef,
}: EditorProps) {
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
  /* Bumped on every transaction so the toolbar's pressed states describe where
     the caret actually is. ProseMirror's state is not React's, and a toolbar
     that only re-rendered when something else did would show the marks of
     wherever the caret was last time the parent happened to render. */
  const [selectionRevision, setSelectionRevision] = useState(0);

  const slash = useSlashRenderer();

  const report = useCallback(
    (state: SaveState, error: string | null) => {
      onSaveState(state, error);
      /* The preview is a separate document; it does not know the row changed.
         Bumping the nonce reloads it, so "side by side" means the two panes
         agree rather than merely sit together. */
      if (state === "saved") setPreviewNonce((n) => n + 1);
    },
    [onSaveState],
  );

  const { schedule, flush } = useDebouncedSave<unknown>(onSave, report);

  const extensions = useMemo(
    () => [
      StarterKit.configure({
        /* Down to the allow-list. H1 is the title field; strike, and the
           blocks StarterKit does not carry, are added or withheld here rather
           than left to its defaults. */
        /* Withheld: replaced by HeadingDefaultTwo above, whose only difference
           is the attribute default. Two heading nodes in one schema is a
           crash, so this cannot simply be configured alongside it. */
        heading: false,
        link: false,
        /* The Yallo image node replaces StarterKit's, because alt text is a
           required field on this site and StarterKit's image does not know
           that. Two `image` nodes in one schema is a crash, not a conflict.
           Typed as the option record rather than `any`: the key exists at
           runtime and the published types lag it across minor versions, which
           is a narrower claim than "this object may be anything". */
        ...({ image: false } as Record<string, false>),
      }),
      HeadingDefaultTwo,
      Link.configure({ openOnClick: false, autolink: false }),
      Placeholder.configure({
        placeholder: "Write, or press / for a block.",
      }),
      ...YALLO_NODES,
      slash.extension,
    ],
    [slash.extension],
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
      /* `role` and `aria-multiline` because a contenteditable div is in the
         focus order with no role of its own, which axe reports as
         focus-order-semantics and a screen reader reports as nothing at all.
         The label names which of the page's several text fields it is. */
      attributes: {
        class: styles.prose,
        "aria-label": "Article body",
        "aria-multiline": "true",
        role: "textbox",
      },
    },
    onUpdate: ({ editor: e }) => {
      /* `toPlainDoc` HERE AND NOT ONLY ON THE SAVE PATH — R-27.5. This value
         reaches a server action through `schedule`, and a null-prototype
         `attrs` crossing that boundary is the 500 the helper documents. Doing
         it once, where the document leaves ProseMirror, means no later reader
         of this callback has to know. */
      const body = toPlainDoc(e.getJSON());
      onDocChange?.(body);
      setCounts({ words: wordCount(body), minutes: readingTimeMinutes(body) });
      schedule(body);
    },
    onSelectionUpdate: () => setSelectionRevision((n) => n + 1),
    onTransaction: () => setSelectionRevision((n) => n + 1),
  });

  /* Assigned in an effect rather than during render: a ref written during
     render is a write to shared state in a phase React may replay. The only
     reader is the flush below, which runs from a click. */
  const editorRef = useRef<TiptapEditor | null>(null);
  useEffect(() => {
    editorRef.current = editor ?? null;
  }, [editor]);

  /* The flush the rail and the publish sheet reach for. It takes the CURRENT
     document rather than whatever was last scheduled, because a deliberate save
     immediately after a keystroke must not lose that keystroke to a debounce
     that had not fired yet. */
  useEffect(() => {
    if (!saveNowRef) return;
    saveNowRef.current = async () => {
      const current = editorRef.current;
      if (current) schedule(toPlainDoc(current.getJSON()));
      await flush();
    };
    return () => {
      saveNowRef.current = null;
    };
  }, [saveNowRef, schedule, flush]);

  /* `fullScreen` is not a class on this element any more. The fixed layer is
     `EditorSurface`'s, wrapping the RAIL as well as the canvas: with the layer
     here, full screen covered the rail, which took the Saved pill and the
     Leave full screen button off screen and left Escape as the only way out.
     It is read here only to widen the writing column when there is no cockpit
     chrome beside it. */
  return (
    <div
      className={styles.shell}
      data-full-screen={fullScreen ? "true" : "false"}
    >
      <TopToolbar editor={editor} revision={selectionRevision} />

      <div className={showPreview ? styles.panesSplit : styles.panes}>
        <div className={styles.writing}>
          {header}
          {editor ? <SelectionToolbar editor={editor} /> : null}
          <EditorContent editor={editor} />
          <SlashPopup state={slash.state} />
          <p className={styles.counts}>
            {counts.words} word{counts.words === 1 ? "" : "s"} ·{" "}
            {counts.minutes} min read
          </p>
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
