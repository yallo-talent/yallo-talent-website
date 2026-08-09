"use client";

import { mergeAttributes, Node } from "@tiptap/core";
import type { NodeViewProps } from "@tiptap/react";
import {
  NodeViewContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import { useId, useState } from "react";
import {
  capabilitiesIndex,
  industriesIndex,
  platformsIndex,
} from "@/data/l1/index";
import styles from "./Editor.module.css";

/** `renderHTML` is called with more than this; this is the part we use. */
type RenderArgs = { HTMLAttributes: Record<string, unknown> };

/**
 * The seven Yallo blocks as TipTap nodes, design §4.
 *
 * THE ATTRIBUTE SHAPES ARE NOT INVENTED HERE. `src/lib/tiptap/blocks.ts` holds
 * them and the server renderer reads the same file, because an editor that
 * writes `{value}` into a block whose renderer reads `{figure}` produces a
 * draft that looks finished and publishes as a gap. The types are imported for
 * exactly that reason; the defaults below are the only thing this file decides.
 *
 * EVERY BLOCK IS EDITED IN PLACE, not in a modal. A modal makes the block a
 * form you fill in and dismiss; editing in place makes it a thing on the page
 * that you change, which is what "it should look like the publication it
 * produces" means when the block carries fields rather than sentences.
 *
 * TWO OF THEM CARRY PROSE AND FIVE DO NOT, and that split is a contract with
 * `docToText`: the pull quote and the key figure contribute their inline
 * content to the word count, the reading time and every publish rule that reads
 * the prose. So those two use `NodeViewContent` and the other five hold
 * everything in attributes.
 *
 * `draggable: false` throughout. A drag handle on a block inside a text editor
 * competes with selecting text across it, and the estate has no drag affordance
 * that survives a keyboard.
 */

/** A field that writes straight back into the node's attributes. */
function AttrInput({
  label,
  value,
  onChange,
  placeholder,
  multiline,
  required,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  multiline?: boolean;
  required?: boolean;
}) {
  /* `useId`, not `Math.random()`. A random id generated during render is an
     impure render and a different id on the server and the client, which
     detaches every label from its control on the first hydration. */
  const id = useId();
  return (
    <label className={styles.blockField} htmlFor={id}>
      <span className={styles.blockFieldLabel}>
        {label}
        {required ? (
          <span className={styles.blockRequired}> required</span>
        ) : null}
      </span>
      {multiline ? (
        <textarea
          className={styles.blockTextarea}
          id={id}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          value={value}
        />
      ) : (
        <input
          className={styles.blockInput}
          id={id}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          type="text"
          value={value}
        />
      )}
    </label>
  );
}

/** The frame every block view shares: a named, removable region. */
function BlockShell({
  name,
  note,
  onRemove,
  children,
}: {
  name: string;
  note?: string;
  onRemove: () => void;
  children: React.ReactNode;
}) {
  return (
    <NodeViewWrapper className={styles.block}>
      <div className={styles.blockHead} contentEditable={false}>
        <span className={styles.blockName}>{name}</span>
        {note ? <span className={styles.blockNote}>{note}</span> : null}
        <button className={styles.blockRemove} onClick={onRemove} type="button">
          Remove
        </button>
      </div>
      {children}
    </NodeViewWrapper>
  );
}

/* ── Pull quote ─────────────────────────────────────────────────────────── */

function PullQuoteView({ node, updateAttributes, deleteNode }: NodeViewProps) {
  return (
    <BlockShell name="Pull quote" onRemove={deleteNode}>
      <NodeViewContent className={styles.blockQuoteText} />
      <div contentEditable={false}>
        <AttrInput
          label="Attribution"
          onChange={(attribution) => updateAttributes({ attribution })}
          placeholder="Leave empty and no attribution line renders"
          value={String(node.attrs.attribution ?? "")}
        />
      </div>
    </BlockShell>
  );
}

export const PullQuote = Node.create({
  name: "pullQuote",
  group: "block",
  content: "inline*",
  draggable: false,
  addAttributes: () => ({ attribution: { default: "" } }),
  parseHTML: () => [{ tag: 'figure[data-type="pull-quote"]' }],
  renderHTML: ({ HTMLAttributes }: RenderArgs) => [
    "figure",
    mergeAttributes(HTMLAttributes, { "data-type": "pull-quote" }),
    0,
  ],
  addNodeView: () => ReactNodeViewRenderer(PullQuoteView),
});

/* ── Key figure ─────────────────────────────────────────────────────────── */

function KeyFigureView({ node, updateAttributes, deleteNode }: NodeViewProps) {
  return (
    <BlockShell
      name="Key figure"
      note="Renders nothing until the source is filled in"
      onRemove={deleteNode}
    >
      <div contentEditable={false}>
        <AttrInput
          label="Figure"
          onChange={(figure) => updateAttributes({ figure })}
          placeholder="e.g. 62%"
          required
          value={String(node.attrs.figure ?? "")}
        />
      </div>
      <span className={styles.blockFieldLabel}>Label</span>
      <NodeViewContent className={styles.blockFigureLabel} />
      <div contentEditable={false}>
        <AttrInput
          label="Source"
          onChange={(source) => updateAttributes({ source })}
          placeholder="Publication, title, date"
          required
          value={String(node.attrs.source ?? "")}
        />
      </div>
    </BlockShell>
  );
}

export const KeyFigure = Node.create({
  name: "keyFigure",
  group: "block",
  content: "inline*",
  draggable: false,
  addAttributes: () => ({ figure: { default: "" }, source: { default: "" } }),
  parseHTML: () => [{ tag: 'aside[data-type="key-figure"]' }],
  renderHTML: ({ HTMLAttributes }: RenderArgs) => [
    "aside",
    mergeAttributes(HTMLAttributes, { "data-type": "key-figure" }),
    0,
  ],
  addNodeView: () => ReactNodeViewRenderer(KeyFigureView),
});

/* ── FAQ ────────────────────────────────────────────────────────────────── */

interface FaqItemAttr {
  question: string;
  answer: string;
}

function FaqView({ node, updateAttributes, deleteNode }: NodeViewProps) {
  const items = (node.attrs.items ?? []) as FaqItemAttr[];
  const write = (next: FaqItemAttr[]) => updateAttributes({ items: next });
  return (
    <BlockShell
      name="FAQ"
      note="Emits FAQPage schema; a pair with an empty half is dropped"
      onRemove={deleteNode}
    >
      <div contentEditable={false}>
        {items.map((item, i) => (
          /* Position is the identity. Two questions with the same words are two
             questions, and there is nothing else to key on. */
          // biome-ignore lint/suspicious/noArrayIndexKey: position is the identity
          <div className={styles.faqPair} key={i}>
            <AttrInput
              label={`Question ${i + 1}`}
              onChange={(question) =>
                write(
                  items.map((it, j) => (j === i ? { ...it, question } : it)),
                )
              }
              value={item.question ?? ""}
            />
            <AttrInput
              label={`Answer ${i + 1}`}
              multiline
              onChange={(answer) =>
                write(items.map((it, j) => (j === i ? { ...it, answer } : it)))
              }
              value={item.answer ?? ""}
            />
            <button
              className={styles.blockRemove}
              onClick={() => write(items.filter((_, j) => j !== i))}
              type="button"
            >
              Remove pair {i + 1}
            </button>
          </div>
        ))}
        <button
          className={styles.blockAdd}
          onClick={() => write([...items, { question: "", answer: "" }])}
          type="button"
        >
          Add a question
        </button>
      </div>
    </BlockShell>
  );
}

export const Faq = Node.create({
  name: "faq",
  group: "block",
  atom: true,
  draggable: false,
  addAttributes: () => ({ items: { default: [] as FaqItemAttr[] } }),
  parseHTML: () => [{ tag: 'div[data-type="faq"]' }],
  renderHTML: ({ HTMLAttributes }: RenderArgs) => [
    "div",
    mergeAttributes(HTMLAttributes, { "data-type": "faq" }),
  ],
  addNodeView: () => ReactNodeViewRenderer(FaqView),
});

/* ── Related desk ───────────────────────────────────────────────────────── */

const DESK_OPTIONS = [
  { kind: "industry" as const, index: industriesIndex },
  { kind: "platform" as const, index: platformsIndex },
  { kind: "discipline" as const, index: capabilitiesIndex },
];

function RelatedDeskView({
  node,
  updateAttributes,
  deleteNode,
}: NodeViewProps) {
  const kind = String(node.attrs.kind ?? "");
  const slug = String(node.attrs.slug ?? "");
  return (
    <BlockShell
      name="Related desk"
      note="The label comes from the live taxonomy index, never typed"
      onRemove={deleteNode}
    >
      <div className={styles.blockField} contentEditable={false}>
        <span className={styles.blockFieldLabel}>Desk</span>
        {/* One select, not two. A kind without a slug is not a desk, and two
            controls let a person leave it in that state. */}
        <select
          className={styles.blockInput}
          onChange={(e) => {
            const [nextKind, nextSlug] = e.target.value.split(":");
            updateAttributes({ kind: nextKind, slug: nextSlug });
          }}
          value={kind && slug ? `${kind}:${slug}` : ""}
        >
          <option value="">Choose a desk</option>
          {DESK_OPTIONS.map((group) => (
            <optgroup key={group.kind} label={group.kind}>
              {group.index.map((entry) => (
                <option
                  key={`${group.kind}:${entry.slug}`}
                  value={`${group.kind}:${entry.slug}`}
                >
                  {entry.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
    </BlockShell>
  );
}

export const RelatedDesk = Node.create({
  name: "relatedDesk",
  group: "block",
  atom: true,
  draggable: false,
  addAttributes: () => ({ kind: { default: "" }, slug: { default: "" } }),
  parseHTML: () => [{ tag: 'a[data-type="related-desk"]' }],
  renderHTML: ({ HTMLAttributes }: RenderArgs) => [
    "a",
    mergeAttributes(HTMLAttributes, { "data-type": "related-desk" }),
  ],
  addNodeView: () => ReactNodeViewRenderer(RelatedDeskView),
});

/* ── PetalPlate divider ─────────────────────────────────────────────────── */

function PetalDividerView({ deleteNode }: NodeViewProps) {
  return (
    <BlockShell name="PetalPlate divider" onRemove={deleteNode}>
      <div
        aria-hidden="true"
        className={styles.petalPreview}
        contentEditable={false}
      >
        <span className={styles.petalMark} />
      </div>
    </BlockShell>
  );
}

export const PetalDivider = Node.create({
  name: "petalDivider",
  group: "block",
  atom: true,
  draggable: false,
  parseHTML: () => [{ tag: 'div[data-type="petal-divider"]' }],
  renderHTML: ({ HTMLAttributes }: RenderArgs) => [
    "div",
    mergeAttributes(HTMLAttributes, { "data-type": "petal-divider" }),
  ],
  addNodeView: () => ReactNodeViewRenderer(PetalDividerView),
});

/* ── Image ──────────────────────────────────────────────────────────────── */

/**
 * The media library, offered inside the image block.
 *
 * WHY IT IS HERE RATHER THAN ONLY IN THE PANE. Without it the only way to place
 * an uploaded image is to copy a URL from one screen and retype the alt text on
 * another, so the alt text the library made mandatory becomes optional again in
 * practice and nobody ever writes a `srcset` by hand. Choosing here carries the
 * URL, the rendition set, the alt text, the caption and the intrinsic size
 * across in one act.
 *
 * FETCHED ON DEMAND, not on mount. Most edits do not touch an image, and a
 * request per editor load for a list nobody opens is a request nobody asked
 * for.
 */
interface LibraryAsset {
  id: string;
  url: string;
  alt: string;
  caption: string | null;
  width: number | null;
  height: number | null;
  objectKey: string;
  srcSet: string;
}

function MediaPicker({ onPick }: { onPick: (asset: LibraryAsset) => void }) {
  const [assets, setAssets] = useState<LibraryAsset[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    try {
      const response = await fetch("/api/admin/media");
      const payload = (await response.json()) as {
        assets?: LibraryAsset[];
        error?: string;
      };
      if (!response.ok) {
        setError(payload.error ?? `HTTP ${response.status}`);
        return;
      }
      setAssets(payload.assets ?? []);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  if (assets === null) {
    return (
      <div className={styles.blockField}>
        <button className={styles.blockAdd} onClick={load} type="button">
          Choose from the media library
        </button>
        {error ? <span className={styles.blockNote}>{error}</span> : null}
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <span className={styles.blockNote}>
        The library is empty. Upload in the Media pane first.
      </span>
    );
  }

  return (
    <div className={styles.blockField}>
      <span className={styles.blockFieldLabel}>Media library</span>
      <select
        className={styles.blockInput}
        defaultValue=""
        onChange={(event) => {
          const chosen = assets.find((a) => a.id === event.target.value);
          if (chosen) onPick(chosen);
        }}
      >
        <option value="">Choose an asset</option>
        {assets.map((asset) => (
          <option key={asset.id} value={asset.id}>
            {asset.objectKey}
          </option>
        ))}
      </select>
    </div>
  );
}

function ImageView({ node, updateAttributes, deleteNode }: NodeViewProps) {
  const src = String(node.attrs.src ?? "");
  const alt = String(node.attrs.alt ?? "");
  return (
    <BlockShell
      name="Image"
      note="Alt text blocks publishing when empty (canon A2 rule 7)"
      onRemove={deleteNode}
    >
      <div contentEditable={false}>
        {src ? (
          // biome-ignore lint/performance/noImgElement: an uploaded asset at its intrinsic size, same reasoning as the public renderer
          <img alt={alt} className={styles.blockImage} src={src} />
        ) : null}
        <MediaPicker
          onPick={(asset) =>
            updateAttributes({
              src: asset.url,
              srcset: asset.srcSet,
              /* The alt text the library holds is the one somebody wrote while
                 looking at the image. It is offered, not imposed: an author who
                 has already written one for this placement keeps it. */
              alt: alt.trim() === "" ? asset.alt : alt,
              caption:
                String(node.attrs.caption ?? "") || (asset.caption ?? ""),
              width: asset.width,
              height: asset.height,
            })
          }
        />
        <AttrInput
          label="Image URL"
          onChange={(next) => updateAttributes({ src: next, srcset: "" })}
          placeholder="Chosen from the library above, or pasted"
          required
          value={src}
        />
        <AttrInput
          label="Alt text"
          onChange={(next) => updateAttributes({ alt: next })}
          placeholder="What the image shows, for somebody who cannot see it"
          required
          value={alt}
        />
        <AttrInput
          label="Caption"
          onChange={(caption) => updateAttributes({ caption })}
          value={String(node.attrs.caption ?? "")}
        />
      </div>
    </BlockShell>
  );
}

export const YalloImage = Node.create({
  name: "image",
  group: "block",
  atom: true,
  draggable: false,
  addAttributes: () => ({
    src: { default: "" },
    alt: { default: "" },
    caption: { default: "" },
    width: { default: null },
    height: { default: null },
    /* The rendition set the library supplies. Empty for a hand-pasted URL and
       for every image imported before the library existed, and the public
       renderer omits both `srcset` and `sizes` in that case rather than
       emitting an empty attribute. */
    srcset: { default: "" },
  }),
  parseHTML: () => [{ tag: "img[src]" }],
  renderHTML: ({ HTMLAttributes }: RenderArgs) => [
    "img",
    mergeAttributes(HTMLAttributes),
  ],
  addNodeView: () => ReactNodeViewRenderer(ImageView),
});

/* ── Chart ──────────────────────────────────────────────────────────────── */

interface ChartRowAttr {
  label: string;
  value: number;
}

function ChartView({ node, updateAttributes, deleteNode }: NodeViewProps) {
  const rows = (node.attrs.rows ?? []) as ChartRowAttr[];
  const write = (next: ChartRowAttr[]) => updateAttributes({ rows: next });
  return (
    <BlockShell
      name="Chart"
      note="Renders nothing until the source is filled in"
      onRemove={deleteNode}
    >
      <div contentEditable={false}>
        <AttrInput
          label="Title"
          onChange={(title) => updateAttributes({ title })}
          value={String(node.attrs.title ?? "")}
        />
        <div className={styles.blockField}>
          <span className={styles.blockFieldLabel}>Shape</span>
          <select
            className={styles.blockInput}
            onChange={(e) => updateAttributes({ kind: e.target.value })}
            value={String(node.attrs.kind ?? "bar")}
          >
            <option value="bar">Bar</option>
            <option value="line">Line</option>
          </select>
        </div>
        {rows.map((row, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: position is the identity
          <div className={styles.chartRowFields} key={i}>
            <AttrInput
              label={`Row ${i + 1} label`}
              onChange={(label) =>
                write(rows.map((r, j) => (j === i ? { ...r, label } : r)))
              }
              value={row.label ?? ""}
            />
            <AttrInput
              label={`Row ${i + 1} value`}
              onChange={(v) =>
                write(
                  rows.map((r, j) =>
                    j === i ? { ...r, value: Number(v) } : r,
                  ),
                )
              }
              value={String(row.value ?? "")}
            />
            <button
              className={styles.blockRemove}
              onClick={() => write(rows.filter((_, j) => j !== i))}
              type="button"
            >
              Remove row {i + 1}
            </button>
          </div>
        ))}
        <button
          className={styles.blockAdd}
          onClick={() => write([...rows, { label: "", value: 0 }])}
          type="button"
        >
          Add a row
        </button>
        <AttrInput
          label="Source"
          onChange={(source) => updateAttributes({ source })}
          placeholder="Publication, title, date"
          required
          value={String(node.attrs.source ?? "")}
        />
      </div>
    </BlockShell>
  );
}

export const Chart = Node.create({
  name: "chart",
  group: "block",
  atom: true,
  draggable: false,
  addAttributes: () => ({
    kind: { default: "bar" },
    title: { default: "" },
    rows: { default: [] as ChartRowAttr[] },
    source: { default: "" },
  }),
  parseHTML: () => [{ tag: 'figure[data-type="chart"]' }],
  renderHTML: ({ HTMLAttributes }: RenderArgs) => [
    "figure",
    mergeAttributes(HTMLAttributes, { "data-type": "chart" }),
  ],
  addNodeView: () => ReactNodeViewRenderer(ChartView),
});

/** Every Yallo block, in the order the slash menu offers them. */
export const YALLO_NODES = [
  PullQuote,
  KeyFigure,
  Faq,
  RelatedDesk,
  PetalDivider,
  YalloImage,
  Chart,
];
