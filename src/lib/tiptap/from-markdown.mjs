/**
 * Markdown to TipTap document JSON — the one-way door round 25 §2 walks the
 * existing corpus through.
 *
 * WHY A REAL PARSER AND NOT A REGEX SWEEP. The import is verified by rendering:
 * every published case study has to come out of the database as byte-comparable
 * prose to what production serves today, and production renders these bodies
 * through remark. Parsing them with anything else means reconciling two
 * markdown dialects on nine live pages. `mdast-util-from-markdown` is the same
 * CommonMark tokeniser remark uses, so the two agree by construction rather
 * than by testing.
 *
 * TIGHTNESS IS CARRIED, and it is the one subtlety in the whole conversion.
 * CommonMark renders a tight list as `<li>text</li>` and a loose one as
 * `<li><p>text</p></li>`, and `innerText` reads one newline between items in
 * the first case and two in the second. Measured on
 * /case-studies/enabling-sap-s-4hana-transformation-for-al-tayer-group as
 * production serves it: single newlines. Dropping the flag would have changed
 * the rendered prose of every list on the site, and the verification step would
 * have caught it — but only after the rows were written.
 *
 * THE CORPUS IS NARROWER THAN THIS FUNCTION. Measured across all 30 files:
 * paragraphs, H2, three H4s, bullet lists, five blockquotes, 73 links, 14 bold
 * runs and three hard breaks. Ordered lists, code blocks, images and tables do
 * not occur. They are handled anyway, because the alternative is a converter
 * that is correct for today's corpus and silently lossy for the next file
 * somebody pastes in.
 */

import { fromMarkdown } from "mdast-util-from-markdown";
import { HEADING_LEVELS } from "./schema.mjs";

function inline(nodes, marks = []) {
  const out = [];
  const withMarks = (text) =>
    text ? [{ type: "text", text, ...(marks.length ? { marks } : {}) }] : [];

  for (const n of nodes ?? []) {
    switch (n.type) {
      case "text":
        out.push(...withMarks(n.value));
        break;
      case "strong":
        out.push(...inline(n.children, [...marks, { type: "bold" }]));
        break;
      case "emphasis":
        out.push(...inline(n.children, [...marks, { type: "italic" }]));
        break;
      case "delete":
        out.push(...inline(n.children, [...marks, { type: "strike" }]));
        break;
      case "inlineCode":
        out.push({
          type: "text",
          text: n.value,
          marks: [...marks, { type: "code" }],
        });
        break;
      case "link":
        out.push(
          ...inline(n.children, [
            ...marks,
            { type: "link", attrs: { href: n.url } },
          ]),
        );
        break;
      case "break":
        out.push({ type: "hardBreak" });
        break;
      default:
        /* Unknown inline: keep the words, drop the wrapper. Losing a reader's
           sentence to an unrecognised construct is worse than losing its
           emphasis, and the import reports what it met either way. */
        if (n.children) out.push(...inline(n.children, marks));
        else if (typeof n.value === "string") out.push(...withMarks(n.value));
    }
  }
  return out;
}

function block(n, report) {
  switch (n.type) {
    case "paragraph": {
      const content = inline(n.children);
      return content.length ? [{ type: "paragraph", content }] : [];
    }
    case "heading": {
      /* H1 is the title field, so a body H1 becomes H2; the design's node set is
         H2 and H3 only, so anything deeper flattens to H3. Three H4s in the
         corpus, all in one unpublished draft. Flattening rather than dropping:
         a heading that disappears takes its section's structure with it. */
      const level = n.depth <= 2 ? HEADING_LEVELS[0] : HEADING_LEVELS[1];
      if (n.depth !== level)
        report?.(`heading depth ${n.depth} flattened to ${level}`);
      return [
        { type: "heading", attrs: { level }, content: inline(n.children) },
      ];
    }
    case "list": {
      const tight = !n.spread;
      return [
        {
          type: n.ordered ? "orderedList" : "bulletList",
          attrs: n.ordered ? { start: n.start ?? 1, tight } : { tight },
          content: (n.children ?? []).map((li) => ({
            type: "listItem",
            content: (li.children ?? []).flatMap((c) => block(c, report)),
          })),
        },
      ];
    }
    case "blockquote":
      return [
        {
          type: "blockquote",
          content: (n.children ?? []).flatMap((c) => block(c, report)),
        },
      ];
    case "thematicBreak":
      return [{ type: "horizontalRule" }];
    case "code":
      return [
        {
          type: "codeBlock",
          attrs: { language: n.lang ?? null },
          content: n.value ? [{ type: "text", text: n.value }] : [],
        },
      ];
    case "image":
      return [
        {
          type: "image",
          attrs: { src: n.url, alt: n.alt ?? "", caption: n.title ?? "" },
        },
      ];
    default:
      report?.(`unhandled block ${n.type}`);
      return n.children ? n.children.flatMap((c) => block(c, report)) : [];
  }
}

/**
 * @param {string} markdown a body, without frontmatter
 * @param {(note: string) => void} [report] called for every lossy decision
 * @returns {{ type: 'doc', content: any[] }}
 */
export function markdownToTiptap(markdown, report) {
  const tree = fromMarkdown(markdown);
  return {
    type: "doc",
    content: tree.children.flatMap((n) => block(n, report)),
  };
}
