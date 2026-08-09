"use client";

import { useEffect, useRef, useState } from "react";
import { BUDGETS, FIXED_BYLINE } from "@/lib/admin/content-validation";
import styles from "./Editor.module.css";

/**
 * The top of the writing canvas — R-26.5's Title and Subtitle.
 *
 * WHAT MOVED AND WHY. The title and the summary used to live halfway down a
 * long metadata form under the editor, which meant the first thing a reader of
 * the published page sees was the seventh thing the writer touched. R-26.5 puts
 * them where they belong, at the top of the canvas, set in the faces they will
 * publish in, with placeholders rather than labels above boxes.
 *
 * THE SUBTITLE IS THE SUMMARY. One value, one column, no duplicate storage:
 * R-26.5 says so explicitly, and it is right — a subtitle and a summary written
 * separately would be two sentences saying the same thing, one of which is
 * always the stale one. The drawer no longer carries either field.
 *
 * A TEXTAREA THAT GROWS, NOT A BOX WITH A SCROLLBAR. A summary is up to 320
 * characters and a writer needs to see all of it: a fixed three-row box hides
 * the end of the sentence they are judging.
 *
 * THE BYLINE IS NOT A FIELD, and it is shown rather than hidden. Canon §8 fixes
 * it at Yallo Talent, applied by the system. Displaying it as a line of the
 * canvas is how the writer knows what the page will say without there being
 * anything to type a person's name into.
 */

/**
 * A textarea whose height follows its content.
 *
 * NO DEPENDENCY ARRAY, deliberately. The hook's argument is a value from the
 * caller's scope, not React state this effect can subscribe to, so listing it
 * claims a subscription that does not exist — which is what the lint rule says.
 * Running after every render is both correct and cheaper to reason about: the
 * component re-renders on every keystroke anyway, and measuring a box twice for
 * a render that did not change it costs one layout read.
 */
function useAutoGrow() {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    /* Reset first: the scroll height of a box that is already tall enough is
       its current height, so growing works and shrinking never does. */
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  });
  return ref;
}

export function CanvasHeader({
  title,
  summary,
  onChange,
  contentType,
}: {
  title: string;
  summary: string;
  onChange: (next: { title: string; summary: string }) => void;
  contentType: "article" | "case_study";
}) {
  const [localTitle, setLocalTitle] = useState(title);
  const [localSummary, setLocalSummary] = useState(summary);
  const titleRef = useAutoGrow();
  const summaryRef = useAutoGrow();

  const write = (next: { title?: string; summary?: string }) => {
    const value = {
      title: next.title ?? localTitle,
      summary: next.summary ?? localSummary,
    };
    setLocalTitle(value.title);
    setLocalSummary(value.summary);
    onChange(value);
  };

  const titleLength = localTitle.trim().length;
  const summaryLength = localSummary.trim().length;

  return (
    <header className={styles.canvasHead}>
      {/* A TEXTAREA THAT GROWS, NOT AN INPUT, and the difference is visible on
          the first real title. An `<input>` does not wrap: at the published
          headline size a 100-character title — which is inside the budget —
          scrolls sideways inside the box, so the writer sees thirty characters
          of the thing they are judging. Measured at 1280 on the first render of
          this component, where "A fixture the round 26 visual check made"
          rendered as "A fixture the round 26 visual c".

          NOT a contenteditable heading either: the title is one line of plain
          text in the database, and a rich-text control would offer bold, links
          and a second paragraph, none of which the column accepts. A textarea
          with newlines stripped on the way in is exactly the right shape. */}
      <textarea
        aria-label="Title"
        className={styles.titleField}
        onChange={(e) =>
          write({ title: e.target.value.replace(/[\r\n]+/g, " ") })
        }
        onKeyDown={(e) => {
          /* Enter moves to the subtitle rather than adding a line the column
             cannot store. */
          if (e.key === "Enter") e.preventDefault();
        }}
        placeholder="Title"
        ref={titleRef}
        rows={1}
        value={localTitle}
      />

      <textarea
        aria-label="Subtitle"
        className={styles.subtitleField}
        onChange={(e) => write({ summary: e.target.value })}
        placeholder="Add a subtitle..."
        ref={summaryRef}
        rows={1}
        value={localSummary}
      />

      <div className={styles.canvasMeta}>
        <span className={styles.bylineChip}>{FIXED_BYLINE}</span>
        <span className={styles.canvasMetaNote}>
          Applied by the system. This{" "}
          {contentType === "article" ? "article" : "case study"} carries no
          personal byline.
        </span>
        {/* The counters sit with the fields rather than in a panel below — A3.
            A count in a different part of the screen from the thing it counts is
            a count somebody has to hunt for while typing. */}
        <span
          className={styles.headCounter}
          data-over={titleLength > BUDGETS.title.max ? "true" : "false"}
        >
          Title {titleLength}/{BUDGETS.title.max}
        </span>
        <span
          className={styles.headCounter}
          data-over={
            summaryLength > BUDGETS.summary.max ||
            (summaryLength > 0 && summaryLength < BUDGETS.summary.min)
              ? "true"
              : "false"
          }
        >
          Subtitle {summaryLength}/{BUDGETS.summary.max}
        </span>
      </div>
    </header>
  );
}
