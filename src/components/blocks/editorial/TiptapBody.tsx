import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { HEADING_LEVELS } from "@/lib/tiptap/schema.mjs";

/**
 * The server-side renderer for a TipTap body, and the reason canon A1 is safe.
 *
 * CLOSED SET, NO DEFAULT BRANCH. Design §3: the body renders through an
 * allow-list of node types so an editor cannot inject arbitrary markup and the
 * rendered article always obeys `DESIGN.md`. A renderer with a fallback branch
 * is not an allow-list — it is a default-open policy — so an unknown node
 * renders NOTHING here and `disallowedNodes` refuses the publish that would
 * have produced it. Two mechanisms, deliberately: one keeps the page clean, the
 * other tells the author why.
 *
 * TIGHTNESS DECIDES THE `<p>` INSIDE `<li>`. CommonMark renders a tight list
 * item as `<li>text</li>` and a loose one as `<li><p>text</p></li>`, and the
 * difference is one newline against two in the prose a reader copies. The
 * imported corpus carries the flag from the markdown it came from, so a page
 * that rendered with single newlines yesterday renders with single newlines
 * today. This is the half of the import verification that lives in the
 * renderer rather than in the converter.
 *
 * NO `dangerouslySetInnerHTML` ANYWHERE IN THIS FILE. Every string reaches the
 * DOM as a React text child.
 */

type Attrs = Record<string, unknown>;
export interface TiptapNode {
  type: string;
  attrs?: Attrs;
  content?: TiptapNode[];
  marks?: { type: string; attrs?: Attrs }[];
  text?: string;
}

const str = (v: unknown): string => (typeof v === "string" ? v : "");

/**
 * Internal links go through `next/link`, external ones do not.
 *
 * The estate's link gates (`check:yallo-case` resolution, `check:no-redirects`)
 * judge the rendered href, so both forms are judged the same way. The
 * distinction is prefetching and client navigation, not correctness.
 */
function Anchor({ href, children }: { href: string; children: ReactNode }) {
  const internal = href.startsWith("/");
  if (internal) return <Link href={href}>{children}</Link>;
  return (
    <a href={href} rel="noopener noreferrer" target="_blank">
      {children}
    </a>
  );
}

function renderInline(
  nodes: TiptapNode[] | undefined,
  keyPrefix: string,
): ReactNode[] {
  return (nodes ?? []).map((n, i) => {
    const key = `${keyPrefix}-${i}`;
    if (n.type === "hardBreak") return <br key={key} />;
    if (n.type !== "text") return null;

    let el: ReactNode = n.text ?? "";
    /* Marks apply outward-in, so the LAST mark in the array becomes the
       outermost element. Reversing here means a link carrying bold renders
       <a><strong>…</strong></a> rather than the other way round, which is what
       the corpus's markdown means and what a screen reader announces as one
       link rather than as a link inside emphasis. */
    for (const m of n.marks ?? []) {
      switch (m.type) {
        case "bold":
          el = <strong key={key}>{el}</strong>;
          break;
        case "italic":
          el = <em key={key}>{el}</em>;
          break;
        case "strike":
          el = <s key={key}>{el}</s>;
          break;
        case "code":
          el = <code key={key}>{el}</code>;
          break;
        case "link":
          el = (
            <Anchor key={key} href={str(m.attrs?.href)}>
              {el}
            </Anchor>
          );
          break;
        default:
          /* Not in the allow-list: the words stay, the mark does not. */
          break;
      }
    }
    /* A Fragment, not a span. React needs the key; the DOM does not need the
       element, and a span around every text run would put a node between `p`
       and `strong` that no existing selector expects. */
    return <Fragment key={key}>{el}</Fragment>;
  });
}

function ListItem({
  node,
  tight,
  keyPrefix,
}: {
  node: TiptapNode;
  tight: boolean;
  keyPrefix: string;
}) {
  const children = node.content ?? [];
  const onlyParagraph =
    tight && children.length === 1 && children[0]?.type === "paragraph";
  return (
    <li>
      {onlyParagraph
        ? renderInline(children[0]?.content, `${keyPrefix}-p`)
        : children.map((c, i) => renderBlock(c, `${keyPrefix}-${i}`))}
    </li>
  );
}

export function renderBlock(node: TiptapNode, key: string): ReactNode {
  switch (node.type) {
    case "paragraph":
      return <p key={key}>{renderInline(node.content, key)}</p>;

    case "heading": {
      const level = HEADING_LEVELS.includes(node.attrs?.level as number)
        ? (node.attrs?.level as number)
        : HEADING_LEVELS[1];
      const Tag = (level === 2 ? "h2" : "h3") as "h2" | "h3";
      return <Tag key={key}>{renderInline(node.content, key)}</Tag>;
    }

    case "bulletList": {
      const tight = node.attrs?.tight !== false;
      return (
        <ul key={key}>
          {/* biome-ignore-start lint/suspicious/noArrayIndexKey: a ProseMirror
              list item has no identity beyond its position — the document IS an
              ordered tree — so the index is not a stand-in for a key, it is the
              key. React's warning is about reordering a list of entities; these
              are not entities. */}
          {(node.content ?? []).map((li, i) => (
            <ListItem
              key={`${key}-${i}`}
              keyPrefix={`${key}-${i}`}
              node={li}
              tight={tight}
            />
          ))}
        </ul>
      );
    }

    case "orderedList": {
      const tight = node.attrs?.tight !== false;
      const start =
        typeof node.attrs?.start === "number" ? node.attrs.start : 1;
      return (
        <ol key={key} start={start === 1 ? undefined : start}>
          {/* biome-ignore-start lint/suspicious/noArrayIndexKey: a ProseMirror
              list item has no identity beyond its position — the document IS an
              ordered tree — so the index is not a stand-in for a key, it is the
              key. React's warning is about reordering a list of entities; these
              are not entities. */}
          {(node.content ?? []).map((li, i) => (
            <ListItem
              key={`${key}-${i}`}
              keyPrefix={`${key}-${i}`}
              node={li}
              tight={tight}
            />
          ))}
        </ol>
      );
    }

    case "blockquote":
      return (
        <blockquote key={key}>
          {(node.content ?? []).map((c, i) => renderBlock(c, `${key}-${i}`))}
        </blockquote>
      );

    case "horizontalRule":
      return <hr key={key} />;

    case "codeBlock":
      return (
        <pre key={key}>
          <code>{(node.content ?? []).map((c) => c.text ?? "").join("")}</code>
        </pre>
      );

    /* Deliberately unhandled here and handled with the editor that produces
       them: pullQuote, keyFigure, faq, relatedDesk, petalDivider, image, chart.
       Rendering nothing is the closed-set behaviour; the publish action refuses
       a body carrying a node this file cannot render, so an author is told
       rather than left with a gap. */
    default:
      return null;
  }
}

export function TiptapBody({
  doc,
}: {
  doc: { content?: TiptapNode[] } | null;
}) {
  if (!doc?.content?.length) return null;
  return <>{doc.content.map((n, i) => renderBlock(n, `b${i}`))}</>;
}
