"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ContentStatus } from "@/lib/db/content";
import type { ContentType } from "@/lib/db/content-write";
import styles from "./Editor.module.css";
import { SAVE_LABEL, type SaveState } from "./save-state";

/**
 * The lifecycle rail — A1, and the fix for the complaint that opened this round.
 *
 * THE COMPLAINT, VERBATIM IN SUBSTANCE: Sumeet could not work out the draft,
 * update, publish, unpublish workflow from the surface. That is not a taste
 * problem, it is a legibility one, and A1 states the bar as a screenshot test —
 * if the state and the next action are not obvious in a picture of this rail,
 * it is not done.
 *
 * SO THE RAIL ANSWERS THREE QUESTIONS AND NOTHING ELSE:
 *
 *   What is this?      the status pill, always present, never a colour alone.
 *   Is my work safe?   the Saved pill, live, from every writer on the canvas.
 *   What do I do next? exactly ONE primary action, chosen by the status.
 *
 * ONE PRIMARY ACTION, NOT A ROW OF EQUALS. The old surface offered Publish and
 * Take back to draft side by side with the same weight, so the surface said "you
 * may do either" when what a person needs to be told is "this is a draft; the
 * next thing is to publish it". Everything else that is legal in this state is
 * still reachable, one click away, under More. Reachable and prominent are
 * different things and conflating them is what made the old pane a wall.
 *
 * THE ACTIONS THAT ARE NOT LEGAL ARE NOT SHOWN. There is no Unpublish on a
 * draft and no View live on a piece that has never published, because a control
 * that exists and does nothing teaches a person that controls here may do
 * nothing.
 */

export interface RailProps {
  type: ContentType;
  id: string;
  slug: string;
  status: ContentStatus;
  /** Whether this piece has ever been live, which is what freezes its URL. */
  frozen: boolean;
  publicRoute: string;
  backRoute: string;
  saveState: SaveState;
  saveError: string | null;
  previewOpen: boolean;
  onTogglePreview: () => void;
  fullScreen: boolean;
  onToggleFullScreen: () => void;
  drawerOpen: boolean;
  onToggleDrawer: () => void;
  onSaveNow: () => void;
  onPublish: () => void;
  setStatusAction: (formData: FormData) => Promise<void>;
}

const STATUS_LABEL: Record<string, string> = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
};

/**
 * What each state says the next act is.
 *
 * A DRAFT'S PRIMARY IS "CONTINUE", per R-26.5, and it opens the publish sheet
 * rather than publishing. Substack's composer names it that way because the
 * button is a door into a decision, not the decision; naming it Publish and then
 * showing a sheet would be a button that lies about what pressing it does.
 */
function primaryFor(status: ContentStatus): { label: string; hint: string } {
  if (status === "published") {
    return {
      label: "Update",
      hint: "Save everything outstanding. The live page follows within seconds.",
    };
  }
  if (status === "archived") {
    return {
      label: "Return to draft",
      hint: "Archived pieces are not served. This puts it back in the working set.",
    };
  }
  return {
    label: "Continue",
    hint: "Opens the publish sheet: what is outstanding, then one confirm.",
  };
}

export function LifecycleRail(props: RailProps) {
  const {
    type,
    id,
    slug,
    status,
    frozen,
    publicRoute,
    backRoute,
    saveState,
    saveError,
    previewOpen,
    onTogglePreview,
    fullScreen,
    onToggleFullScreen,
    drawerOpen,
    onToggleDrawer,
    onSaveNow,
    onPublish,
    setStatusAction,
  } = props;

  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const primary = primaryFor(status);

  useEffect(() => {
    if (!moreOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!moreRef.current?.contains(e.target as Node)) setMoreOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMoreOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [moreOpen]);

  /* One form per status change, rendered inside the menu. A single form with a
     changing hidden value would be one control that means different things
     depending on state, which is the pattern this rail exists to remove. */
  const statusForm = (next: string, label: string, note: string) => (
    <form action={setStatusAction} className={styles.menuForm}>
      <input name="type" type="hidden" value={type} />
      <input name="id" type="hidden" value={id} />
      <input name="next" type="hidden" value={next} />
      <input name="returnTo" type="hidden" value="editor" />
      <button
        className={styles.menuItem}
        onClick={() => setMoreOpen(false)}
        type="submit"
      >
        <span className={styles.menuLabel}>{label}</span>
        <span className={styles.menuNote}>{note}</span>
      </button>
    </form>
  );

  return (
    <div className={styles.rail}>
      <div className={styles.railLeft}>
        <Link className={styles.railBack} href={backRoute}>
          <span aria-hidden="true">←</span>{" "}
          {type === "article" ? "Articles" : "Case studies"}
        </Link>

        {/* Never a colour alone: the word IS the state. A dot that means
            published to whoever built it means nothing to whoever inherits it,
            and it means nothing at all to a screen reader. */}
        <span className={styles.statusPill} data-status={status}>
          {STATUS_LABEL[status] ?? status}
        </span>

        {/* aria-live so the state is announced, not only seen. `data-state` is
            what check:editor waits on; it has been the contract since round 25b
            and moving the pill into the rail does not change it. */}
        <output
          aria-live="polite"
          className={styles.savePill}
          data-state={saveState}
        >
          {SAVE_LABEL[saveState]}
        </output>
      </div>

      <div className={styles.railRight}>
        {/* Hidden below 720px by the stylesheet: full screen is a desktop
            idea, and on a phone the browser already is one. */}
        <button
          aria-pressed={fullScreen}
          className={`${styles.barButton} ${styles.railFullScreen}`}
          onClick={onToggleFullScreen}
          type="button"
        >
          {fullScreen ? "Leave full screen" : "Full screen"}
        </button>

        <button
          aria-pressed={previewOpen}
          className={styles.barButton}
          onClick={onTogglePreview}
          type="button"
        >
          Preview
        </button>

        <button
          aria-expanded={drawerOpen}
          className={styles.barButton}
          onClick={onToggleDrawer}
          type="button"
        >
          Details
        </button>

        <div className={styles.menuWrap} ref={moreRef}>
          <button
            aria-expanded={moreOpen}
            aria-haspopup="true"
            className={styles.barButton}
            onClick={() => setMoreOpen((v) => !v)}
            type="button"
          >
            More
          </button>
          {moreOpen ? (
            <div className={styles.menu} role="menu">
              <button
                className={styles.menuItem}
                onClick={() => {
                  onSaveNow();
                  setMoreOpen(false);
                }}
                role="menuitem"
                type="button"
              >
                <span className={styles.menuLabel}>Save now</span>
                <span className={styles.menuNote}>
                  Autosave runs every second and a half; this does not wait.
                </span>
              </button>

              {status === "published"
                ? statusForm(
                    "draft",
                    "Unpublish",
                    "Takes the page off the site. The draft and its history stay.",
                  )
                : null}

              {status === "archived"
                ? null
                : statusForm(
                    "archived",
                    "Archive",
                    "Out of the working set and off the site. Nothing is deleted.",
                  )}

              {status === "published" ? (
                <a
                  className={styles.menuItem}
                  href={`${publicRoute}/${slug}`}
                  rel="noreferrer"
                  role="menuitem"
                  target="_blank"
                >
                  <span className={styles.menuLabel}>View live</span>
                  <span className={styles.menuNote}>
                    The page as a reader sees it, in a new tab.
                  </span>
                </a>
              ) : null}

              <button
                className={styles.menuItem}
                onClick={() => {
                  setMoreOpen(false);
                  onToggleDrawer();
                }}
                role="menuitem"
                type="button"
              >
                <span className={styles.menuLabel}>
                  {frozen ? "Move the URL" : "Set the URL"}
                </span>
                <span className={styles.menuNote}>
                  {frozen
                    ? "In Details. Moving a live URL writes its redirect with it."
                    : "In Details. The slug is free until this first publishes."}
                </span>
              </button>
            </div>
          ) : null}
        </div>

        {/* THE ONE PRIMARY ACTION. Published pieces update through the same
            autosave everything else uses, so this flushes rather than posting:
            a second write path for "the same thing, deliberately" is a second
            place for the two to disagree. */}
        {status === "draft" ? (
          <button
            className={styles.primaryAction}
            onClick={onPublish}
            title={primary.hint}
            type="button"
          >
            {primary.label}
          </button>
        ) : status === "published" ? (
          <button
            className={styles.primaryAction}
            onClick={onSaveNow}
            title={primary.hint}
            type="button"
          >
            {primary.label}
          </button>
        ) : (
          <form action={setStatusAction}>
            <input name="type" type="hidden" value={type} />
            <input name="id" type="hidden" value={id} />
            <input name="next" type="hidden" value="draft" />
            <input name="returnTo" type="hidden" value="editor" />
            <button
              className={styles.primaryAction}
              title={primary.hint}
              type="submit"
            >
              {primary.label}
            </button>
          </form>
        )}
      </div>

      {saveError ? (
        <p className={styles.saveError} role="alert">
          {saveError}
        </p>
      ) : null}
    </div>
  );
}
