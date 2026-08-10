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
  /* A2A, round 26. The first EMBED node, and the seam the content engine grows
     on: audio, native video and a carousel are each a name here, an attribute
     interface in blocks.ts, a case in renderBlock and a node in YalloNodes —
     four additions, no migration of any stored body. Recorded in
     spec/block-registry.md and in src/components/admin/editor/block-inserts.ts.

     ONLY THE VIDEO ID IS STORED, never a URL and never markup. An allow-list
     that accepted an embed URL would be an allow-list with a hole in it: the
     renderer composes the address from the id, so there is no value an author
     can type that reaches a reader as a frame pointing anywhere else. */
  "youtube",
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

/**
 * Coerce every heading to a level this schema allows, in place of nothing.
 *
 * WHY A WRITE-TIME NORMALISER EXISTS AT ALL. TipTap serialises an attribute
 * equal to its default by OMITTING it, and its Heading defaults `level` to 1 —
 * which this site does not allow in a body, because H1 is the title. So a
 * heading that ended up at level 1 in the editor arrived here with no `level`
 * key, `disallowedNodes` refused the publish with "heading level undefined",
 * and the case-study template's movement split — which looks for level 2 —
 * found nothing and collapsed the page's structure. Three published studies
 * were corrupted this way before it was found.
 *
 * THE EDITOR'S DEFAULT IS ALSO FIXED, and this is still not redundant. The
 * editor is one writer of this column; the import is another, and a third will
 * arrive. A rule enforced only in the surface that happens to be open today is
 * a rule that holds until somebody writes a script.
 *
 * IT COERCES RATHER THAN REFUSES, because saving a draft is never blocked
 * (canon A2) and a level is structure rather than words: nothing a writer typed
 * is changed, and the alternative is storing a body no template can draw.
 *
 * @param {unknown} doc
 * @returns {unknown} the same document with every heading level in HEADING_LEVELS
 */
export function normaliseHeadings(doc) {
  const walk = (n) => {
    if (!n || typeof n !== "object") return n;
    const node = /** @type {any} */ (n);
    const next = { ...node };
    if (node.type === "heading") {
      const level = node.attrs?.level;
      next.attrs = {
        ...node.attrs,
        level: HEADING_LEVELS.includes(level) ? level : HEADING_LEVELS[0],
      };
    }
    if (Array.isArray(node.content)) next.content = node.content.map(walk);
    return next;
  };
  return walk(doc);
}

/**
 * The document as plain JSON objects, for the crossing into a server action.
 *
 * R-27.5, AND IT WAS A LIVE 500 ON EVERY PUBLISHED STUDY. ProseMirror builds a
 * node's `attrs` with `Object.create(null)`, and `getJSON()` hands that same
 * null-prototype object straight out. React's server-action reply serialiser
 * only encodes a plain object: anything whose prototype is not
 * `Object.prototype` becomes a TEMPORARY REFERENCE — the wire carried
 * `"attrs":"$T"` — and the first server-side read of `attrs.level`, which is
 * `normaliseHeadings` two lines into the save, threw "Cannot access level on
 * the server. You cannot dot into a temporary client reference." Digest
 * 2280395671 on the production host, and the banner Sumeet saw over the
 * cockpit.
 *
 * WHY EVERY HEADING AND NOT SOME OF THEM. `Node.toJSON` emits `attrs` only when
 * the node HAS attributes, so a document of bare paragraphs crosses cleanly and
 * one with a single heading does not. Every imported study opens with an H2,
 * which is why the defect looked like "published case studies are broken" — and
 * why no fixture caught it: an empty draft is exactly the shape that works. It
 * is not headings alone. `image`, `chart`, `youtube`, `keyFigure`, `faq` and a
 * `link` mark all carry attributes, so the whole editor was one attribute away
 * from this on every body.
 *
 * WHY A JSON ROUND-TRIP RATHER THAN A PROTOTYPE FIX PER NODE. The destination
 * of this value is `JSON.stringify(body)` into a jsonb column, so JSON is
 * already the contract and nothing survives the trip that the column would have
 * kept. A per-node fix would be an allow-list of which attributes to rebuild,
 * maintained beside the node registry, and wrong the first time a block is
 * added — which is the failure mode this repository keeps paying for.
 *
 * @param {unknown} doc TipTap document JSON, straight from `getJSON()`
 * @returns {unknown} the same document as plain objects and arrays
 */
export function toPlainDoc(doc) {
  return JSON.parse(JSON.stringify(doc));
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
