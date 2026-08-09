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
  /**
   * The rendition set, carried on the node rather than looked up at render
   * time.
   *
   * WHY IT IS DENORMALISED. The public renderer draws a body with no database
   * of its own to consult, and a per-image lookup on every article render would
   * be a query per image for a value that cannot change: a rendition's key
   * carries its width, and a re-upload gets new keys. Empty for every image
   * inserted by hand or imported before the library existed, and the renderer
   * simply omits the attribute in that case.
   */
  srcset: string;
}

/**
 * The first embed, A2A.
 *
 * THE ID, NOT A URL, AND CERTAINLY NOT MARKUP. The renderer composes the frame
 * address from this value, so nothing an author types can produce a frame
 * pointing anywhere but YouTube's privacy-enhanced host. Storing a URL would
 * mean validating a URL at render time, in a renderer whose entire premise is
 * that it never has to trust what it is given.
 *
 * THE CAPTION IS THE TEXT ALTERNATIVE. A video with no words beside it is a
 * hole in the page for anybody who cannot or will not play it, and for every
 * crawler. It is required in the sense everything is required after R-26.1: the
 * rules say so, in the editor, while the block is being filled in.
 */
export interface YoutubeAttrs {
  videoId: string;
  caption: string;
}

/** YouTube's own id shape: eleven characters of URL-safe base64. */
const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

/**
 * The video id out of whatever an author pasted.
 *
 * WHY IT ACCEPTS URLS WHEN THE ATTRIBUTE IS AN ID. Because an author will paste
 * a URL: that is what the browser's address bar gives them, and refusing it
 * would be a field that rejects the only thing anybody has to hand. The parsing
 * happens once, on the way IN, and what is stored is the id. Anything that is
 * not recognisably one of YouTube's four address shapes returns null and the
 * block stays empty rather than storing a value the renderer would then have to
 * think about.
 *
 * Returns null rather than throwing: the author is mid-paste, not in error.
 */
export function youtubeId(input: string): string | null {
  const raw = input.trim();
  if (raw === "") return null;
  if (YOUTUBE_ID.test(raw)) return raw;
  let url: URL;
  try {
    url = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\./, "");
  const candidates: (string | null)[] = [];
  if (host === "youtu.be") {
    candidates.push(url.pathname.slice(1));
  } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    candidates.push(url.searchParams.get("v"));
    const path = url.pathname.split("/").filter(Boolean);
    /* /embed/ID, /shorts/ID and /live/ID all put the id in the same place. */
    if (path.length === 2 && ["embed", "shorts", "live"].includes(path[0])) {
      candidates.push(path[1]);
    }
  }
  for (const candidate of candidates) {
    if (candidate && YOUTUBE_ID.test(candidate)) return candidate;
  }
  return null;
}

/**
 * The frame address, composed rather than stored.
 *
 * `youtube-nocookie.com` per A2A: the privacy-enhanced host sets no tracking
 * cookie until a visitor actually plays the video, which is the difference
 * between embedding a video and embedding a tracker. `rel=0` keeps the
 * end-of-video suggestions to the same channel rather than offering a reader
 * somebody else's content on a Yallo Talent page.
 */
export function youtubeEmbedSrc(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`;
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
    /* `entry.href` FIRST, and this is not a nicety. One index entry carries a
       canonical route that is not `/{category}/{slug}`: AI Talent lives at
       `/ai-talent`, and `/capabilities/ai-talent` 301s to it. Composing the
       route from the category alone put a redirect hop on the one discipline
       carrying paid marketing spend — the exact defect `L1IndexEntry.href`
       exists to prevent, honoured by the nav and the hub and not by this. */
    href: entry.href ?? `${DESK_ROUTE[kind]}/${entry.slug}`,
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
