import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import {
  type ChartAttrs,
  chartRows,
  type FaqAttrs,
  type ImageAttrs,
  type KeyFigureAttrs,
  type PullQuoteAttrs,
  resolveDesk,
} from "@/lib/tiptap/blocks";
import { HEADING_LEVELS } from "@/lib/tiptap/schema.mjs";
import styles from "./YalloBlocks.module.css";

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
      /* HEADING_LEVELS[0], which is 2, not [1] which is 3. A level-less
         heading is a heading that lost its level, and the level it lost is
         overwhelmingly 2: that is what the import wrote, what the editor now
         defaults to and what `Movements` splits a case study on. Falling back
         to 3 made the renderer disagree with the writer about the same node. */
      const level = HEADING_LEVELS.includes(node.attrs?.level as number)
        ? (node.attrs?.level as number)
        : HEADING_LEVELS[0];
      const Tag = (level === 2 ? "h2" : "h3") as "h2" | "h3";
      return <Tag key={key}>{renderInline(node.content, key)}</Tag>;
    }

    case "bulletList": {
      const tight = node.attrs?.tight !== false;
      return (
        <ul key={key}>
          {(node.content ?? []).map((li, i) => {
            /* A ProseMirror list item has no identity beyond where it sits: the
               document IS an ordered tree, and two items with the same text are
               two items. So the position is the key rather than a stand-in for
               one, and there is nothing else to derive it from. */
            const itemKey = `${key}-${i}`;
            return (
              <ListItem
                key={itemKey}
                keyPrefix={itemKey}
                node={li}
                tight={tight}
              />
            );
          })}
        </ul>
      );
    }

    case "orderedList": {
      const tight = node.attrs?.tight !== false;
      const start =
        typeof node.attrs?.start === "number" ? node.attrs.start : 1;
      return (
        <ol key={key} start={start === 1 ? undefined : start}>
          {(node.content ?? []).map((li, i) => {
            /* A ProseMirror list item has no identity beyond where it sits: the
               document IS an ordered tree, and two items with the same text are
               two items. So the position is the key rather than a stand-in for
               one, and there is nothing else to derive it from. */
            const itemKey = `${key}-${i}`;
            return (
              <ListItem
                key={itemKey}
                keyPrefix={itemKey}
                node={li}
                tight={tight}
              />
            );
          })}
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

    /* ── The seven Yallo blocks, design §4 ──────────────────────────────────
       Round 25 left these returning null and said so, because the editor that
       produces them had not been built. That was a real hole rather than a
       tidy deferral: `schema.mjs` ALLOWS all seven, so `disallowedNodes`
       accepted a body carrying one and this file drew nothing — a published
       page with a gap and no refusal anywhere. Round 25b closes it by drawing
       them, which is the half that had to exist before the editor could offer
       them. */

    case "pullQuote": {
      const attrs = (node.attrs ?? {}) as Partial<PullQuoteAttrs>;
      const attribution = str(attrs.attribution).trim();
      return (
        <figure className={styles.pullQuote} key={key}>
          <blockquote className={styles.pullQuoteText}>
            {renderInline(node.content, key)}
          </blockquote>
          {/* Renders nothing until it is real, which is the same rule the
              case-study quotation block follows: an empty attribution line is
              a dash and a gap where a person's name should be. */}
          {attribution === "" ? null : (
            <figcaption className={styles.pullQuoteBy}>
              {attribution}
            </figcaption>
          )}
        </figure>
      );
    }

    case "keyFigure": {
      const attrs = (node.attrs ?? {}) as Partial<KeyFigureAttrs>;
      const figure = str(attrs.figure).trim();
      const source = str(attrs.source).trim();
      /* A figure with no source does not render as a figure. Canon §6 is the
         one rule this site does not bend, and publish rule 1 refuses the
         publish — but a DRAFT preview must not show the author a finished
         callout that will not survive publishing. */
      if (figure === "" || source === "") return null;
      return (
        <aside className={styles.keyFigure} key={key}>
          <p className={styles.keyFigureNumber}>{figure}</p>
          <p className={styles.keyFigureLabel}>
            {renderInline(node.content, key)}
          </p>
          <p className={styles.keyFigureSource}>{source}</p>
        </aside>
      );
    }

    case "faq": {
      const attrs = (node.attrs ?? {}) as Partial<FaqAttrs>;
      const items = (attrs.items ?? []).filter(
        (i) => str(i?.question).trim() !== "" && str(i?.answer).trim() !== "",
      );
      if (items.length === 0) return null;
      return (
        <div className={styles.faq} key={key}>
          {items.map((item, i) => (
            <details
              className={styles.faqItem}
              /* Position is the identity: two questions with the same words
                 are two questions, and the document is an ordered tree. */
              // biome-ignore lint/suspicious/noArrayIndexKey: see above — there is nothing else to key on
              key={`${key}-${i}`}
            >
              <summary className={styles.faqQuestion}>
                {str(item.question).trim()}
              </summary>
              <p className={styles.faqAnswer}>{str(item.answer).trim()}</p>
            </details>
          ))}
        </div>
      );
    }

    case "relatedDesk": {
      const desk = resolveDesk(node.attrs ?? {});
      /* Unknown slug, nothing drawn — the closed-set behaviour again. The
         labels come from the live index rather than from the block, because
         `check:taxonomy` fails on a taxonomy label written into rendering
         code and a card carrying its own copy would keep saying what a desk
         used to be called. */
      if (!desk) return null;
      return (
        <Link className={styles.desk} href={desk.href} key={key}>
          <span className={styles.deskLabel}>{desk.label}</span>
          <span className={styles.deskTagline}>{desk.tagline}</span>
        </Link>
      );
    }

    case "petalDivider":
      return (
        <div aria-hidden="true" className={styles.petal} key={key}>
          <span className={styles.petalMark} />
        </div>
      );

    case "image": {
      const attrs = (node.attrs ?? {}) as Partial<ImageAttrs>;
      const src = str(attrs.src).trim();
      const alt = str(attrs.alt);
      const caption = str(attrs.caption).trim();
      if (src === "") return null;
      return (
        <figure className={styles.figure} key={key}>
          {/* Not `next/image`. The width and height of an uploaded asset are
              whatever the upload recorded, and a rounded pair drives the
              painted box when width is auto — the estate has met that one.
              A plain img with the intrinsic pair reserves the right space and
              distorts nothing. */}
          {/* biome-ignore lint/performance/noImgElement: intrinsic dimensions, see above */}
          <img
            alt={alt}
            className={styles.figureImg}
            height={attrs.height ?? undefined}
            loading="lazy"
            /* `sizes` is the measure, not a guess: `.prose` is 72ch, which
               resolves to roughly 780px, and below that the figure is the
               viewport. Without it a browser assumes 100vw and downloads the
               widest rendition on a phone, which is the resizing spent
               backwards. Both attributes are omitted together when a body
               carries an image inserted before the library existed. */
            sizes={attrs.srcset ? "(max-width: 820px) 100vw, 780px" : undefined}
            src={src}
            srcSet={attrs.srcset || undefined}
            width={attrs.width ?? undefined}
          />
          {caption === "" ? null : (
            <figcaption className={styles.figureCaption}>{caption}</figcaption>
          )}
        </figure>
      );
    }

    case "chart": {
      const attrs = (node.attrs ?? {}) as Partial<ChartAttrs>;
      const { rows, max } = chartRows(attrs);
      const source = str(attrs.source).trim();
      /* Same rule as the key figure, and for the same reason: a chart is a
         wall of figures, so it does not draw without its source. */
      if (rows.length === 0 || max === 0 || source === "") return null;
      const title = str(attrs.title).trim();
      return (
        <figure className={styles.chart} key={key}>
          {title === "" ? null : (
            <figcaption className={styles.chartTitle}>{title}</figcaption>
          )}
          {/* A table, with the bars drawn on top of it. A bar chart that is
              only bars is a picture a screen reader reads as nothing, and the
              numbers are the content — so the numbers ARE the markup and the
              width is decoration over them. */}
          <table className={styles.chartTable}>
            <tbody>
              {rows.map((row, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: a chart row's identity is its position in the typed table
                <tr className={styles.chartRow} key={`${key}-${i}`}>
                  <th className={styles.chartLabel} scope="row">
                    {row.label}
                  </th>
                  <td className={styles.chartCell}>
                    <span
                      className={styles.chartBar}
                      style={{
                        width: `${Math.round((Math.abs(row.value) / max) * 100)}%`,
                      }}
                    />
                    <span className={styles.chartValue}>{row.value}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className={styles.chartSource}>{source}</p>
        </figure>
      );
    }

    /* No default branch that draws. An unknown node renders nothing and the
       publish action refuses the body that carries it, so an author is told
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
