/**
 * Everything the publish action and the editor need to READ out of a TipTap
 * document: its prose, its links, its images, its figures and its length.
 *
 * One traversal per question rather than one clever traversal answering all of
 * them, because the callers want different things at different times and a
 * combined result is a thing every caller has to unpack.
 */

/**
 * The document's prose, with the block separation a browser would render.
 *
 * TIGHT LISTS PRODUCE ONE NEWLINE PER ITEM, LOOSE LISTS TWO, and that is not a
 * detail. Markdown's tight list renders `<li>text</li>` and its loose list
 * renders `<li><p>text</p></li>`; `innerText` reads the first as one newline
 * between items and the second as two. The round-25 import is verified by
 * comparing this output against what production serves today, so a renderer or
 * an importer that forgets tightness fails that comparison rather than passing
 * it quietly — which is the correct direction, and the reason the flag is
 * carried on the list node at all.
 *
 * @param {any} doc TipTap document JSON
 * @returns {string}
 */
export function docToText(doc) {
  const blocks = [];
  let listId = 0;
  const inline = (nodes) =>
    (nodes ?? [])
      .map((n) => (n.type === "hardBreak" ? "\n" : (n.text ?? "")))
      .join("");

  /* `list` is the identity of the enclosing tight list, or null. It is what
     decides the SEPARATOR, and only between two items of the SAME tight list —
     the gap between a paragraph and the list that follows it is a block gap
     like any other. Measured against production before this was written: the
     Al Tayer study reads "…Key challenges included\n\nUrgent demand for…" and
     then single newlines between the three items. A first version keyed the
     separator on the block alone and produced a single newline there too,
     which the round-trip caught on all nine studies. */
  const block = (n, list) => {
    switch (n.type) {
      case "paragraph":
      case "heading":
        blocks.push({ text: inline(n.content), list });
        break;
      case "bulletList":
      case "orderedList": {
        const id = n.attrs?.tight === false ? null : `l${++listId}`;
        for (const li of n.content ?? []) {
          for (const child of li.content ?? []) block(child, id);
        }
        break;
      }
      case "blockquote":
        for (const c of n.content ?? []) block(c, null);
        break;
      case "codeBlock":
      case "pullQuote":
      case "keyFigure":
        blocks.push({ text: inline(n.content), list: null });
        break;
      /* Rendered, but carrying no prose a reader reads as a sentence. */
      case "horizontalRule":
      case "petalDivider":
      case "image":
      case "chart":
      case "faq":
      case "relatedDesk":
        break;
      default:
        break;
    }
  };

  for (const n of doc?.content ?? []) block(n, null);

  let out = "";
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (i > 0) {
      const prev = blocks[i - 1];
      out += b.list !== null && b.list === prev.list ? "\n" : "\n\n";
    }
    out += b.text;
  }
  return out;
}

/** Words, counted the way a writer counts them. */
export function wordCount(doc) {
  const words = docToText(doc).trim().split(/\s+/).filter(Boolean);
  return words.length;
}

/**
 * Reading time, computed and never asserted by hand — canon and design §4.
 *
 * 220 words per minute, and one minute is the floor: "0 min read" on a real
 * article reads as a broken field rather than as a short piece.
 */
export function readingTimeMinutes(doc) {
  return Math.max(1, Math.round(wordCount(doc) / 220));
}

/** Every `link` mark's href, in document order, duplicates included. */
export function links(doc) {
  const out = [];
  const walk = (n) => {
    for (const m of n.marks ?? []) {
      if (m.type === "link" && typeof m.attrs?.href === "string") {
        out.push(m.attrs.href);
      }
    }
    for (const c of n.content ?? []) walk(c);
  };
  walk(doc ?? {});
  return out;
}

/** Every image node, so alt text can be required of each. */
export function images(doc) {
  const out = [];
  const walk = (n) => {
    if (n.type === "image") out.push(n.attrs ?? {});
    for (const c of n.content ?? []) walk(c);
  };
  walk(doc ?? {});
  return out;
}

/**
 * The document's H2 headings with their positions, so the case-study template
 * can split a body into its four movements without re-parsing markdown.
 */
export function headings(doc, level = 2) {
  const out = [];
  (doc?.content ?? []).forEach((n, i) => {
    if (n.type === "heading" && n.attrs?.level === level) {
      out.push({
        index: i,
        text: (n.content ?? []).map((c) => c.text ?? "").join(""),
      });
    }
  });
  return out;
}
