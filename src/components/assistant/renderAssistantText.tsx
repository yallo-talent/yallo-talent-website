import type { ReactNode } from "react";

/**
 * The model's replies are ordinary markdown (bold, bullet and numbered
 * lists, blank-line paragraphs) — nothing in the system prompt tells it
 * otherwise, and nothing should: that formatting is what makes a platform
 * breakdown or a list of qualifying questions readable. The bug was never
 * the model's output, it was rendering that raw string inside a single
 * `<p>`, where HTML collapses every newline to a space and "**bold**"
 * shows as literal asterisks.
 *
 * No markdown dependency added — `package.json` is A's territory this
 * round, and the subset an assistant reply actually needs (paragraphs,
 * `**bold**`, `-`/numbered lists) doesn't need a real parser. Citations are
 * plain text by design (system-prompt.ts: "cite... e.g. see /industries/
 * retail"), not markdown links, so there is no `[text](url)` case to cover.
 */

const LIST_ITEM = /^\s*(?:[-•]|\d+[.)])\s+(.+)$/;
const ORDERED_MARKER = /^\s*\d+[.)]/;
const BOLD = /(\*\*[^*]+\*\*)/g;

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  return text.split(BOLD).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      // biome-ignore lint/suspicious/noArrayIndexKey: parsed fresh from one fixed, already-received message string every render — the split never reorders or re-inserts.
      return <strong key={`${keyPrefix}-${i}`}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export function renderAssistantText(text: string): ReactNode {
  const blocks = text.trim().split(/\n\s*\n/);

  return blocks.map((block, bi) => {
    const lines = block
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const isList = lines.length > 0 && lines.every((l) => LIST_ITEM.test(l));

    if (isList) {
      const ListTag = ORDERED_MARKER.test(lines[0]) ? "ol" : "ul";
      return (
        // biome-ignore lint/suspicious/noArrayIndexKey: block order is fixed once the message arrives; this list is never reordered or mutated in place.
        <ListTag key={bi}>
          {lines.map((line, li) => {
            const match = line.match(LIST_ITEM);
            return (
              // biome-ignore lint/suspicious/noArrayIndexKey: same fixed-content list as the block above — line order never changes after the message is received.
              <li key={li}>
                {renderInline(match ? match[1] : line, `${bi}-${li}`)}
              </li>
            );
          })}
        </ListTag>
      );
    }

    // biome-ignore lint/suspicious/noArrayIndexKey: block order is fixed once the message arrives; this list is never reordered or mutated in place.
    return <p key={bi}>{renderInline(lines.join(" "), `${bi}`)}</p>;
  });
}
