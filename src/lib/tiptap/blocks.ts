import {
  capabilitiesIndex,
  industriesIndex,
  platformsIndex,
} from "@/data/l1/index";
import type { TaxonomyKind } from "@/lib/db/content";

/**
 * The attribute shapes of the seven Yallo blocks, read the same way by the
 * editor that writes them, the renderer that draws them and the schema builder
 * that describes them to a crawler.
 *
 * WHY THE SHAPES ARE THESE. `src/lib/tiptap/text.mjs` already decided, in round
 * 25, which blocks carry prose and which do not: `pullQuote` and `keyFigure`
 * contribute their inline content to `docToText`, and `image`, `chart`, `faq`,
 * `relatedDesk` and `petalDivider` contribute nothing. That is a contract, not
 * a preference — the word count, the reading time and every publish rule that
 * reads the prose are computed from it. So everything a reader reads inside
 * those five lives in attributes, and the two that carry sentences carry them
 * as content.
 *
 * NOTHING HERE IS A SECRET AND NOTHING TOUCHES THE DATABASE, so both the client
 * editor and the server renderer import it. That is the point: two definitions
 * of what a `keyFigure` holds would be two chances for the editor to write a
 * block the template cannot draw.
 */

export interface PullQuoteAttrs {
  attribution: string;
}

export interface KeyFigureAttrs {
  figure: string;
  source: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqAttrs {
  items: FaqItem[];
}

export interface RelatedDeskAttrs {
  kind: TaxonomyKind;
  slug: string;
}

export interface ImageAttrs {
  src: string;
  alt: string;
  caption: string;
  width: number | null;
  height: number | null;
}

export interface ChartRow {
  label: string;
  value: number;
}

export interface ChartAttrs {
  kind: "bar" | "line";
  title: string;
  rows: ChartRow[];
  source: string;
}

const INDEX: Record<TaxonomyKind, typeof industriesIndex> = {
  industry: industriesIndex,
  platform: platformsIndex,
  discipline: capabilitiesIndex,
};

/** Where a desk of each kind lives. One declaration, two consumers. */
const DESK_ROUTE: Record<TaxonomyKind, string> = {
  industry: "/industries",
  platform: "/platforms",
  discipline: "/capabilities",
};

export interface Desk {
  href: string;
  label: string;
  tagline: string;
}

/**
 * Resolve a related-desk block against the LIVE taxonomy index.
 *
 * NEVER A TYPED LABEL. `check:taxonomy` fails on a taxonomy label written into
 * rendering code, and it is right to: the labels move, and a card that carried
 * its own copy would keep saying what a desk used to be called. The block
 * stores a kind and a slug; the words come from the index at render time.
 *
 * Returns null for a slug the index does not know, and the renderer draws
 * nothing — the same closed-set behaviour as an unknown node type, with the
 * publish action being what tells the author.
 */
export function resolveDesk(attrs: Partial<RelatedDeskAttrs>): Desk | null {
  const kind = attrs.kind;
  if (kind !== "industry" && kind !== "platform" && kind !== "discipline") {
    return null;
  }
  const entry = INDEX[kind].find((e) => e.slug === attrs.slug);
  if (!entry) return null;
  return {
    href: `${DESK_ROUTE[kind]}/${entry.slug}`,
    label: entry.label,
    tagline: entry.tagline,
  };
}

/** Every desk a body links to through a related-desk block, deduplicated. */
export function deskSlugs(doc: unknown): RelatedDeskAttrs[] {
  const out: RelatedDeskAttrs[] = [];
  const seen = new Set<string>();
  const walk = (n: unknown) => {
    if (!n || typeof n !== "object") return;
    const node = n as {
      type?: string;
      attrs?: Partial<RelatedDeskAttrs>;
      content?: unknown[];
    };
    if (node.type === "relatedDesk") {
      const desk = resolveDesk(node.attrs ?? {});
      const key = `${node.attrs?.kind}:${node.attrs?.slug}`;
      if (desk && !seen.has(key)) {
        seen.add(key);
        out.push({
          kind: node.attrs?.kind as TaxonomyKind,
          slug: String(node.attrs?.slug),
        });
      }
    }
    for (const c of node.content ?? []) walk(c);
  };
  walk(doc);
  return out;
}

/**
 * Every FAQ pair in a body, in document order, with both halves non-empty.
 *
 * Design §6 emits `FAQPage` schema when an FAQ block is present, and a schema
 * entry with an empty answer is a rich result that says nothing. Half-filled
 * pairs are dropped here rather than in the schema builder, so the renderer and
 * the crawler are shown the same set.
 */
export function faqPairs(doc: unknown): FaqItem[] {
  const out: FaqItem[] = [];
  const walk = (n: unknown) => {
    if (!n || typeof n !== "object") return;
    const node = n as {
      type?: string;
      attrs?: Partial<FaqAttrs>;
      content?: unknown[];
    };
    if (node.type === "faq") {
      for (const item of node.attrs?.items ?? []) {
        const question = String(item?.question ?? "").trim();
        const answer = String(item?.answer ?? "").trim();
        if (question && answer) out.push({ question, answer });
      }
    }
    for (const c of node.content ?? []) walk(c);
  };
  walk(doc);
  return out;
}

/**
 * A chart's rows, coerced and bounded.
 *
 * The editor types rows by hand, so a half-typed row exists on the way to a
 * finished one. A non-finite value is dropped rather than rendered as a bar of
 * NaN width, and the maximum is what every bar is drawn against.
 */
export function chartRows(attrs: Partial<ChartAttrs>): {
  rows: ChartRow[];
  max: number;
} {
  const rows = (attrs.rows ?? [])
    .map((r) => ({
      label: String(r?.label ?? "").trim(),
      value: Number(r?.value),
    }))
    .filter((r) => r.label !== "" && Number.isFinite(r.value));
  const max = rows.reduce((m, r) => Math.max(m, Math.abs(r.value)), 0);
  return { rows, max };
}
