import type { TiptapNode } from "@/components/blocks/editorial/TiptapBody";

export type MovementKey = "context" | "challenge" | "approach" | "outcome";

export interface Movement {
  key: MovementKey;
  /** Fixed mono label, template — never authored per case study. */
  label: string;
  /**
   * Authored subhead, verbatim from the published source's own H3 beneath
   * this section — absent where the source carries none. Never written here.
   */
  subhead?: string;
  /** The section's own blocks, rendered through the TipTap allow-list. */
  body: TiptapNode[];
}

/**
 * The fixed labels for the four movements.
 *
 * The ruling that specified this template named the fourth "WHAT YALLO DID".
 * That string cannot ship: canon §2 bans "Yallo" from any slot this template
 * renders in caps (13px mono, tracking 0.12em, `text-transform: uppercase`),
 * and check-yallo-case reads exactly that computed style. "The approach"
 * keeps the fixed set parallel (all four now read "THE ___") and carries the
 * same meaning without reintroducing the defect that round existed to close.
 */
export const MOVEMENT_LABELS: Record<MovementKey, string> = {
  context: "The context",
  challenge: "The challenge",
  approach: "The approach",
  outcome: "The outcome",
};

const ORDER: MovementKey[] = ["context", "challenge", "approach", "outcome"];

function classify(heading: string): MovementKey | undefined {
  if (/challenge|objective/i.test(heading)) return "challenge";
  if (/yallo.?s?\s*role|how\s+yallo\s+helped/i.test(heading)) return "approach";
  if (/outcome|result/i.test(heading)) return "outcome";
  if (/client context/i.test(heading)) return "context";
  return undefined;
}

/**
 * Case-fix only, applied to text this component re-publishes as a subhead
 * outside the body. The body itself is untouched.
 */
function fixYalloCase(text: string): string {
  return text.replace(/\bYALLO\b/g, "Yallo");
}

const textOf = (n: TiptapNode): string =>
  (n.content ?? []).map((c) => c.text ?? "").join("");

/**
 * Split a case study's body into up to four movements.
 *
 * ROUND 25: THE INPUT IS A TIPTAP DOCUMENT, NOT MARKDOWN. Canon A1 moved these
 * bodies into the database, and the previous version of this file split a
 * markdown string on `^## `. The classification, the order, the subhead lift
 * and the omit-an-empty-movement rule are all unchanged — only what is being
 * walked changed, from lines to nodes. That was deliberate: the nine published
 * studies had to come out of the database rendering byte-identical prose, and
 * the surest way to that was to keep every rule and change only the substrate.
 *
 * The published sources arrive in one of two shapes, both handled by the same
 * mechanism rather than by per-file special-casing:
 *
 * - `## Client Context` / `## Business Objectives & Challenges` /
 *   `## Yallo's Role` / `## Outcome` — no subhead beneath any H2, so those
 *   movements render label and body only.
 * - An unheaded lead paragraph (mapped to `context`) followed by
 *   `## The Challenge` / `## How YALLO Helped` / `## The Result`, each
 *   immediately followed by its own H3. That heading is lifted out verbatim as
 *   the movement's subhead — already-published words, not authored here.
 *
 * A movement with no matching, non-empty source section is omitted outright: a
 * label with nothing beneath it is the empty-slot pattern canon bans.
 */
export function parseMovements(
  doc: { content?: TiptapNode[] } | null,
): Movement[] {
  const nodes = doc?.content ?? [];
  const byKey = new Map<MovementKey, TiptapNode[]>();

  let current: MovementKey | null = "context";
  let seenHeading = false;
  let leadHasContent = false;

  for (const n of nodes) {
    if (n.type === "heading" && n.attrs?.level === 2) {
      seenHeading = true;
      current = classify(textOf(n)) ?? null;
      /* A `## Client Context` after an empty lead is the context section, not a
         second one. After a lead that carried real prose, the lead wins and this
         appends to it — which is what the markdown version did by concatenating
         both into the same bucket. */
      continue;
    }
    if (!current) continue;
    if (!seenHeading) leadHasContent = true;
    const list = byKey.get(current) ?? [];
    list.push(n);
    byKey.set(current, list);
  }
  void leadHasContent;

  const movements: Movement[] = [];
  for (const key of ORDER) {
    const blocks = byKey.get(key);
    if (!blocks || blocks.length === 0) continue;

    /* The source's own H3, immediately beneath its H2, is the subhead. Lifted
       out of the body so the template can set it rather than the prose
       renderer, exactly as before. */
    let subhead: string | undefined;
    let body = blocks;
    const first = blocks[0];
    if (first?.type === "heading" && first.attrs?.level === 3) {
      subhead = fixYalloCase(textOf(first));
      body = blocks.slice(1);
    }
    if (body.length === 0) continue;

    movements.push({ key, label: MOVEMENT_LABELS[key], subhead, body });
  }

  return movements;
}
