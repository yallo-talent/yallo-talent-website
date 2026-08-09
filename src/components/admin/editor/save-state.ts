"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * One saved state for a surface that has more than one writer.
 *
 * WHY THIS IS SHARED AND NOT PER FIELD. R-26.5 puts a live Saved pill in the
 * rail, singular, and the canvas now autosaves three separate things: the body,
 * the title and the subtitle. Three indicators would answer "did that save?"
 * three times and leave the writer to work out which one applies to what they
 * just typed. One pill, showing the WORST of the states, answers it once: if
 * anything is unsaved the pill says unsaved, and it says Saved only when there
 * is nothing outstanding anywhere.
 *
 * "WORST" IS ORDERED BY WHAT A WRITER STANDS TO LOSE, not by how recent the
 * event was. An error outranks everything, because work is at risk. Saving
 * outranks dirty, because the request is already in flight. Dirty outranks
 * saved, because a pill reading Saved over an unsaved keystroke is the one
 * failure mode this indicator exists to rule out.
 */
export type SaveState = "idle" | "dirty" | "saving" | "saved" | "error";

const RANK: Record<SaveState, number> = {
  error: 4,
  dirty: 3,
  saving: 2,
  saved: 1,
  idle: 0,
};

export function worstOf(...states: SaveState[]): SaveState {
  return states.reduce(
    (worst, s) => (RANK[s] > RANK[worst] ? s : worst),
    "idle",
  );
}

/**
 * The words the pill says.
 *
 * PLAIN SENTENCES, NOT STATUS CODES. "Saved" is what Substack's own composer
 * says and it is what R-26.5 names; the others say what is true rather than
 * what the state is called, because "dirty" is a word from this file and not
 * from the person writing.
 */
export const SAVE_LABEL: Record<SaveState, string> = {
  idle: "No unsaved changes",
  dirty: "Unsaved changes",
  saving: "Saving",
  saved: "Saved",
  error: "Not saved",
};

export const AUTOSAVE_MS = 1500;

/**
 * Autosave on a debounce, reporting its state outward.
 *
 * WHY THE PENDING VALUE IS A REF. The timer fires after the last keystroke, and
 * a value closed over at scheduling time would be the value as it was when the
 * timer was armed rather than as it is when it fires. Holding the latest in a
 * ref means the request always carries what is on screen.
 *
 * THE TIMER IS CLEARED ON UNMOUNT, and `flush` exists so a deliberate act — a
 * publish, a Save now — does not have to wait out the debounce. A publish that
 * raced its own autosave would publish the paragraph before last.
 */
export function useDebouncedSave<T>(
  save: (value: T) => Promise<void>,
  onState: (state: SaveState, error: string | null) => void,
  delayMs: number = AUTOSAVE_MS,
): {
  schedule: (value: T) => void;
  flush: () => Promise<void>;
} {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef<{ value: T } | null>(null);
  /* The callers are recreated on most renders; holding them in refs keeps
     `schedule` and `flush` stable, so nothing downstream re-renders because a
     parent did.
     WRITTEN IN AN EFFECT, not during render. A ref assigned during render is
     a write to shared state in a phase React may replay, and the lint rule
     that says so is right: the only readers here are timers and event
     handlers, all of which run after commit, so an effect is both legal and
     sufficient. */
  const saveRef = useRef(save);
  const stateRef = useRef(onState);
  useEffect(() => {
    saveRef.current = save;
    stateRef.current = onState;
  });

  const run = useCallback(async () => {
    if (pending.current === null) return;
    const { value } = pending.current;
    stateRef.current("saving", null);
    try {
      await saveRef.current(value);
      pending.current = null;
      stateRef.current("saved", null);
    } catch (err) {
      stateRef.current("error", (err as Error).message);
    }
  }, []);

  const schedule = useCallback(
    (value: T) => {
      pending.current = { value };
      stateRef.current("dirty", null);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(run, delayMs);
    },
    [delayMs, run],
  );

  const flush = useCallback(async () => {
    if (timer.current) clearTimeout(timer.current);
    await run();
  }, [run]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  return { schedule, flush };
}

/**
 * The warning a closed tab gets while anything is outstanding.
 *
 * A BEST EFFORT AND SAID SO. The browser will not wait for a promise here, so
 * this cannot flush; it can only make the remaining risk the person's own
 * choice. "No work is ever lost to a closed tab" is carried by the 1.5-second
 * debounce, and this is what covers the 1.5 seconds.
 */
export function useUnloadWarning(unsaved: boolean): void {
  useEffect(() => {
    if (!unsaved) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [unsaved]);
}

/** Two states, one for each writer on the canvas, reduced to one pill. */
export function useSaveStates(): {
  state: SaveState;
  error: string | null;
  report: (which: "body" | "front") => (s: SaveState, e: string | null) => void;
} {
  const [body, setBody] = useState<SaveState>("idle");
  const [front, setFront] = useState<SaveState>("idle");
  const [error, setError] = useState<string | null>(null);

  const report = useCallback(
    (which: "body" | "front") => (s: SaveState, e: string | null) => {
      (which === "body" ? setBody : setFront)(s);
      /* An error is kept until something saves successfully, rather than
         cleared by the next keystroke: a message that disappears as soon as the
         writer reacts to it is a message they cannot read. */
      setError((current) =>
        s === "error" ? e : s === "saved" ? null : current,
      );
    },
    [],
  );

  return { state: worstOf(body, front), error, report };
}
