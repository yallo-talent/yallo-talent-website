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
  /** The section's own markdown, rendered via MDXRemote. */
  body: string;
}

/**
 * The fixed labels for the four movements.
 *
 * The ruling that specified this template named the fourth "WHAT YALLO DID".
 * That string cannot ship: canon §2 bans "Yallo" from any slot this template
 * renders in caps (13px mono, tracking 0.12em, `text-transform: uppercase`),
 * and check-yallo-case reads exactly that computed style. "The approach"
 * keeps the fixed set parallel (all four now read "THE ___") and carries the
 * same meaning without reintroducing the defect this round exists to close.
 * Logged in the round's relay as a deliberate deviation from the ruling's
 * literal wording.
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
 * Case-fix only, applied to text this component re-publishes as a heading or
 * subhead outside the MDX body. The body itself is untouched — the sweep of
 * "YALLO" out of the rendered prose is B's, per the round's relay. This is
 * narrower: it only ever touches a string this file lifts out of the body and
 * re-renders as its own template element (a subhead), so the two never
 * overlap.
 */
function fixYalloCase(text: string): string {
  return text.replace(/\bYALLO\b/g, "Yallo");
}

/**
 * Split a case study's published MDX body into up to four movements.
 *
 * The published sources arrive in one of two shapes, both handled by the same
 * mechanism rather than by per-file special-casing:
 *
 * - `## Client Context` / `## Business Objectives & Challenges` /
 *   `## YALLO's Role` / `## Outcome` — no subhead beneath any H2, so those
 *   movements render label and body only.
 * - An unheaded lead paragraph (mapped to `context`) followed by
 *   `## The Challenge` / `## How YALLO Helped` / `## The Result`, each
 *   immediately followed by its own `### ` subhead. That H3 is lifted out
 *   verbatim as the movement's subhead — already-published words, not
 *   authored here.
 *
 * A movement with no matching, non-empty source section is omitted outright:
 * a label with nothing beneath it is the empty-slot pattern canon bans.
 */
export function parseMovements(body: string): Movement[] {
  const lines = body.split("\n");
  const sections: Array<{ heading?: string; content: string[] }> = [
    { content: [] },
  ];

  for (const line of lines) {
    const h2 = /^##\s+(.+?)\s*$/.exec(line);
    if (h2?.[1]) {
      sections.push({ heading: h2[1], content: [] });
    } else {
      sections[sections.length - 1]?.content.push(line);
    }
  }

  const byKey = new Map<MovementKey, string[]>();
  let assignedFirst = false;

  for (const section of sections) {
    const key = section.heading
      ? classify(section.heading)
      : sections[0] === section
        ? "context"
        : undefined;
    if (!key) continue;
    if (key === "context" && !section.heading) {
      // The unheaded lead block only counts as context if it carries real
      // content — an empty lead before "## Client Context" is not a second
      // context section.
      if (!section.content.join("").trim()) continue;
      assignedFirst = true;
    } else if (key === "context" && assignedFirst) {
      continue;
    }
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key)?.push(...section.content);
  }

  const movements: Movement[] = [];
  for (const key of ORDER) {
    const contentLines = byKey.get(key);
    if (!contentLines) continue;
    const raw = contentLines.join("\n").replace(/^\n+/, "");
    if (!raw.trim()) continue;

    const h3 = /^\s*###\s+(.+?)\s*\n+([\s\S]*)$/.exec(raw);
    const subhead = h3?.[1] ? fixYalloCase(h3[1]) : undefined;
    const restBody = h3 ? (h3[2] ?? "") : raw;

    movements.push({
      key,
      label: MOVEMENT_LABELS[key],
      subhead,
      body: restBody.trim(),
    });
  }

  return movements;
}
