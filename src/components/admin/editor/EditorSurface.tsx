"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  type PublishError,
  validateForPublish,
} from "@/lib/admin/content-validation";
import { answerFirstNotes } from "@/lib/content-seo";
import type { ContentStatus } from "@/lib/db/content";
import type { ContentType } from "@/lib/db/content-write";
import { CanvasHeader } from "./CanvasHeader";
import { Editor } from "./Editor";
import styles from "./Editor.module.css";
import { LifecycleRail } from "./LifecycleRail";
import { LiveChecks } from "./LiveChecks";
import { PublishSheet } from "./PublishSheet";
import {
  useDebouncedSave,
  useSaveStates,
  useUnloadWarning,
} from "./save-state";

/**
 * The whole editor surface: rail, canvas, drawer, publish sheet.
 *
 * WHY ONE OWNER. Three things on this page need the same facts and used to have
 * none of them: the rail's Saved pill needs every writer's state, the publish
 * sheet needs the live findings, and the findings need the live title, subtitle
 * and body at once. Before this round the title lived in a form, the body lived
 * in ProseMirror, and the checks ran over a mixture of one live value and two
 * stored ones — so a warning could name a summary the writer had already fixed.
 * One owner, one set of values, and every surface reads the same ones.
 *
 * THE DRAWER'S CONTENT IS SERVER-RENDERED and arrives as a prop. Taxonomy, SEO
 * and history are server concerns: the taxonomy indexes, the revision list and
 * the server actions all live on that side, and marking this component's parent
 * client would pull every one of them into the browser bundle. React lets a
 * server subtree be passed through a client boundary as a child, which is
 * exactly what this is for.
 *
 * NOTHING HERE REFUSES ANYTHING — R-26.1. The checks are shown, the sheet lists
 * them, and the confirm is always live.
 */

export interface EditorSurfaceProps {
  type: ContentType;
  id: string;
  slug: string;
  status: ContentStatus;
  frozen: boolean;
  publicRoute: string;
  backRoute: string;
  previewPath: string;
  initialTitle: string;
  initialSummary: string;
  initialBody: unknown;
  /** Everything the rules need that the drawer owns, as stored. */
  checks: {
    category: string;
    metaTitle: string | null;
    metaDescription: string | null;
    industry: string[];
    platform: string[];
    discipline: string[];
    sources: { claim?: string; source?: string }[];
    knownPaths: string[];
  };
  saveBody: (body: unknown) => Promise<void>;
  saveFront: (front: { title: string; summary: string }) => Promise<void>;
  setStatusAction: (formData: FormData) => Promise<void>;
  drawer: ReactNode;
  /** Shown once, above the canvas, after an action redirects back here. */
  notice?: ReactNode;
}

export function EditorSurface(props: EditorSurfaceProps) {
  const {
    type,
    id,
    slug,
    status,
    frozen,
    publicRoute,
    backRoute,
    previewPath,
    initialTitle,
    initialSummary,
    initialBody,
    checks,
    saveBody,
    saveFront,
    setStatusAction,
    drawer,
    notice,
  } = props;

  const [body, setBody] = useState<unknown>(initialBody);
  const [front, setFront] = useState({
    title: initialTitle,
    summary: initialSummary,
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const save = useSaveStates();
  const saveBodyNow = useRef<(() => Promise<void>) | null>(null);

  /**
   * The rail's real height, published as `--rail-h` for the toolbar to stick
   * below.
   *
   * THE IMPECCABLE PASS ON THIS ROUND FOUND THE SAME DEFECT ONE LEVEL DOWN from
   * the one R-27.2 closed. The rail is sticky at 0 and the toolbar was sticky at
   * a literal `top: 52px`, guessed against the rail's height. The rail wraps:
   * measured, it is 67px at 1280 and 107px at 800, so the toolbar sat 15px over
   * it at 1280 and 55px over it at 800. A hardcoded offset against a wrapping
   * element is right at one width and wrong at every other.
   *
   * Measured on the ROOT rather than by wrapping the rail. A wrapper would
   * become the rail's containing block and a sticky element cannot travel past
   * its containing block, so the wrapper that made it measurable would be the
   * thing that stopped it sticking. The ref callback runs after children mount,
   * which is why querying down works here.
   */
  const [railHeight, setRailHeight] = useState(0);
  const measureRail = useCallback((root: HTMLDivElement) => {
    const rail = root.querySelector<HTMLElement>(`.${styles.rail}`);
    if (!rail) return;
    setRailHeight(Math.round(rail.getBoundingClientRect().height));
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries)
        setRailHeight(Math.round(entry.target.getBoundingClientRect().height));
    });
    observer.observe(rail);
    return () => observer.disconnect();
  }, []);

  const frontSaver = useDebouncedSave<{ title: string; summary: string }>(
    saveFront,
    save.report("front"),
  );

  useUnloadWarning(save.state === "dirty" || save.state === "saving");

  /* Escape leaves full screen. A mode with no way out but the mouse is a mode
     somebody gets stuck in. */
  useEffect(() => {
    if (!fullScreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullScreen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullScreen]);

  /* And Escape closes the drawer. The impeccable pass measured that full screen,
     the rail's More menu and the slash popup all closed on Escape and the drawer
     did not — one surface out of four behaving differently is the inconsistency,
     not the missing feature. It stays non-modal: focus is not trapped and the
     Close button remains, so this only adds the exit everything else already
     had. */
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  const flushAll = useCallback(async () => {
    await Promise.all([saveBodyNow.current?.(), frontSaver.flush()]);
  }, [frontSaver]);

  /* Every rule, over the values as they are on screen. The same
     `validateForPublish` the publish action calls and the nightly sweep calls,
     so no two of the three can disagree about what is wrong with a piece. */
  const findings = useMemo<PublishError[]>(() => {
    const known = new Set(checks.knownPaths);
    const rules = validateForPublish(
      {
        contentType: type,
        title: front.title,
        category: checks.category,
        summary: front.summary,
        metaTitle: checks.metaTitle,
        metaDescription: checks.metaDescription,
        body,
        sources: checks.sources,
        industry: checks.industry,
        platform: checks.platform,
        discipline: checks.discipline,
      },
      known,
    );
    /* The answer-first notes join the same list rather than sitting in their
       own box. To a writer they are one question — "is anything wrong with
       this piece" — and two panels answering it separately is two places to
       look. They are advisory by construction and carry no rule number. */
    const answerFirst = answerFirstNotes({
      summary: front.summary,
      body,
    }).map((note) => ({
      rule: -1,
      field: "answer-first",
      message: note.message,
      severity: "warn" as const,
    }));
    return [...rules, ...answerFirst];
  }, [body, front, checks, type]);

  return (
    /* The full-screen layer wraps the RAIL as well as the canvas. A layer over
       the canvas alone hid the Saved pill and the way out, which is the failure
       full screen exists to avoid rather than to cause. */
    <div
      className={fullScreen ? styles.fullScreenLayer : undefined}
      ref={measureRail}
      style={{ "--rail-h": `${railHeight}px` } as React.CSSProperties}
    >
      <LifecycleRail
        backRoute={backRoute}
        drawerOpen={drawerOpen}
        frozen={frozen}
        fullScreen={fullScreen}
        id={id}
        onPublish={() => {
          /* Flushed BEFORE the sheet opens, not on confirm alone: the sheet
             lists what is outstanding, and a sheet listing findings from a
             document the server has not been told about yet is a sheet about
             the wrong piece. */
          void flushAll();
          setSheetOpen(true);
        }}
        onSaveNow={() => void flushAll()}
        onToggleDrawer={() => setDrawerOpen((v) => !v)}
        onToggleFullScreen={() => setFullScreen((v) => !v)}
        onTogglePreview={() => setPreviewOpen((v) => !v)}
        previewOpen={previewOpen}
        publicRoute={publicRoute}
        saveError={save.error}
        saveState={save.state}
        setStatusAction={setStatusAction}
        slug={slug}
        status={status}
        type={type}
      />

      {notice}

      <div className={styles.surface} data-drawer-open={drawerOpen}>
        <div className={styles.surfaceMain}>
          <Editor
            fullScreen={fullScreen}
            header={
              <CanvasHeader
                contentType={type}
                onChange={(next) => {
                  setFront(next);
                  frontSaver.schedule(next);
                }}
                summary={initialSummary}
                title={initialTitle}
              />
            }
            initialBody={initialBody}
            onDocChange={setBody}
            onSave={saveBody}
            onSaveState={save.report("body")}
            previewPath={previewPath}
            previewReady
            saveNowRef={saveBodyNow}
            showPreview={previewOpen}
          />

          <LiveChecks findings={findings} />
        </div>

        {/* The drawer is in the DOM whether or not it is open, and hidden with
            `hidden` rather than unmounted. A drawer that unmounts loses a
            half-typed meta description every time somebody closes it to look at
            the paragraph they are describing. */}
        <aside
          aria-label="Details"
          className={styles.drawer}
          hidden={!drawerOpen}
        >
          <div className={styles.drawerHead}>
            <h2 className={styles.drawerTitle}>Details</h2>
            <button
              className={styles.barButton}
              onClick={() => setDrawerOpen(false)}
              type="button"
            >
              Close
            </button>
          </div>
          {drawer}
        </aside>
      </div>

      {sheetOpen ? (
        <PublishSheet
          findings={findings}
          id={id}
          onBeforeConfirm={() => void flushAll()}
          onClose={() => setSheetOpen(false)}
          publicRoute={publicRoute}
          setStatusAction={setStatusAction}
          slug={slug}
          type={type}
        />
      ) : null}
    </div>
  );
}
