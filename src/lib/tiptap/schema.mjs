/**
 * The TipTap document allow-list — one declaration, read by the editor, the
 * server renderer, the import and the publish action.
 *
 * WHY AN ALLOW-LIST AT ALL. Design §3: the body is rendered server-side through
 * a closed set of node types, so an editor cannot inject arbitrary markup and a
 * published article always obeys `DESIGN.md`. A renderer that falls back to
 * "render whatever this node says" is not an allow-list, it is a default-open
 * policy with extra steps, so `renderNode` has no default branch and this file
 * is the only place the set is written down.
 *
 * WHY .mjs IN src/. The same arrangement as `src/lib/unsourced-figures.mjs` and
 * `src/data/redirects.mjs`, and for the same reason: three consumers, one of
 * which is a plain Node script outside the path-aliased build. A set maintained
 * in two places is a set that is wrong in one of them, and here the two would
 * drift silently — the importer accepting a node the renderer drops.
 */

/** Block nodes. Nothing else may appear as a child of `doc`. */
export const BLOCK_NODES = [
  "paragraph",
  "heading",
  "bulletList",
  "orderedList",
  "blockquote",
  "horizontalRule",
  "codeBlock",
  /* Yallo blocks, design §4. */
  "pullQuote",
  "keyFigure",
  "faq",
  "relatedDesk",
  "petalDivider",
  "image",
  "chart",
];

/** Nodes that may appear inside a block. */
export const INLINE_NODES = ["text", "hardBreak"];

/** Marks a text node may carry. */
export const MARKS = ["bold", "italic", "code", "link", "strike"];

/** Headings the editor offers. H1 is the title field and never a body node. */
export const HEADING_LEVELS = [2, 3];

const ALL = new Set(["doc", "listItem", ...BLOCK_NODES, ...INLINE_NODES]);

const MARK_SET = new Set(MARKS);

/**
 * Every node type and mark in the document that this schema does not allow.
 *
 * Returns the offenders rather than a boolean, because a publish refusal has to
 * name what it refused — "the body carries a node this template cannot render"
 * with no name is a message an author cannot act on.
 *
 * @param {unknown} doc TipTap document JSON
 * @returns {string[]} unique offending type names, in document order
 */
export function disallowedNodes(doc) {
  const found = [];
  const seen = new Set();
  const note = (what) => {
    if (!seen.has(what)) {
      seen.add(what);
      found.push(what);
    }
  };
  const walk = (n) => {
    if (!n || typeof n !== "object") return;
    const type = n.type;
    if (typeof type !== "string" || !ALL.has(type)) {
      note(`node:${typeof type === "string" ? type : "(untyped)"}`);
    }
    if (type === "heading") {
      const level = n.attrs?.level;
      if (!HEADING_LEVELS.includes(level)) note(`heading level ${level}`);
    }
    for (const m of n.marks ?? []) {
      if (!MARK_SET.has(m?.type)) note(`mark:${m?.type ?? "(untyped)"}`);
    }
    for (const c of n.content ?? []) walk(c);
  };
  walk(doc);
  return found;
}

/** An empty document, the shape a new draft starts from. */
export const EMPTY_DOC = { type: "doc", content: [] };

/** Whether the value is shaped like a TipTap document at all. */
export function isDoc(value) {
  return (
    value != null &&
    typeof value === "object" &&
    value.type === "doc" &&
    Array.isArray(value.content)
  );
}
