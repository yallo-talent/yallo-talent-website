"use client";

import type { Editor as TiptapEditor } from "@tiptap/react";
import { useEffect, useId, useRef, useState } from "react";
import { ACCEPT_ATTRIBUTE, MAX_UPLOAD_BYTES } from "@/lib/media/config";
import styles from "./Editor.module.css";

/**
 * Placing an image without leaving the piece — A5.
 *
 * WHAT WAS WRONG BEFORE. The image block existed and could pick from the
 * library, but uploading meant going to the Media pane, which means leaving the
 * article. In practice that made the library the long way round and a pasted URL
 * the short one, and a pasted URL carries no rendition set and no alt text: the
 * resizing pipeline is spent and the accessibility requirement becomes a thing
 * somebody types twice. Both halves belong here, at the moment of insertion.
 *
 * ALT TEXT IS REQUIRED AT INSERT, and A5 says why in one line: an empty alt is a
 * rendering defect, not an editorial judgement. This is the one place in the
 * cockpit where something is still refused, and it is not a validation rule — it
 * is a form that will not submit without a field, in the same way the upload
 * route has always required it. R-26.1 governs what stops a save or a publish;
 * nothing here does either.
 *
 * THE LIBRARY'S ALT TEXT IS OFFERED, NOT IMPOSED. Somebody wrote it while
 * looking at the image, so it is the best starting point; the placement in THIS
 * article may still want different words, so it lands in an editable field
 * rather than going straight onto the node.
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

type Source = { kind: "library"; asset: LibraryAsset } | { kind: "none" };

export function ImageInsertDialog({
  editor,
  onClose,
}: {
  editor: TiptapEditor;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const headingId = useId();
  const altId = useId();
  const captionId = useId();

  const [assets, setAssets] = useState<LibraryAsset[] | null>(null);
  const [source, setSource] = useState<Source>({ kind: "none" });
  const [alt, setAlt] = useState("");
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  /* `showModal`, not the `open` attribute. Only the modal form gives the
     inertness, the focus trap and the Escape handling that a hand-rolled
     overlay has to reimplement and usually gets wrong on the third one. */
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    const onCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };
    dialog.addEventListener("cancel", onCancel);
    return () => dialog.removeEventListener("cancel", onCancel);
  }, [onClose]);

  /* The library is fetched when the dialog opens rather than when the editor
     mounts: most edits never place an image, and a request per editor load for
     a list nobody opens is a request nobody asked for. */
  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const response = await fetch("/api/admin/media");
        const payload = (await response.json()) as {
          assets?: LibraryAsset[];
          error?: string;
        };
        if (!live) return;
        if (!response.ok) {
          setFailed(true);
          setMessage(
            payload.error ??
              `The library did not load: HTTP ${response.status}.`,
          );
          setAssets([]);
          return;
        }
        setAssets(payload.assets ?? []);
      } catch (err) {
        if (!live) return;
        setFailed(true);
        setMessage((err as Error).message);
        setAssets([]);
      }
    })();
    return () => {
      live = false;
    };
  }, []);

  function choose(asset: LibraryAsset) {
    setSource({ kind: "library", asset });
    setAlt((current) => (current.trim() === "" ? asset.alt : current));
    setCaption((current) =>
      current.trim() === "" ? (asset.caption ?? "") : current,
    );
    setFailed(false);
    setMessage(null);
  }

  async function upload() {
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setFailed(true);
      setMessage("Choose a file first.");
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setFailed(true);
      setMessage(
        `That file is ${(file.size / 1024 / 1024).toFixed(1)} MB, over the ${MAX_UPLOAD_BYTES / 1024 / 1024} MB limit.`,
      );
      return;
    }
    if (alt.trim() === "") {
      /* The upload route requires it too. Saying so before the wait rather than
         after is the whole reason this check is duplicated. */
      setFailed(true);
      setMessage(
        "Write the alt text first: the library stores it with the file.",
      );
      return;
    }
    setBusy(true);
    setFailed(false);
    setMessage("Uploading and resizing.");
    const data = new FormData();
    data.set("file", file);
    data.set("alt", alt.trim());
    data.set("caption", caption.trim());
    try {
      const response = await fetch("/api/admin/media", {
        method: "POST",
        body: data,
      });
      const payload = (await response.json()) as {
        error?: string;
        asset?: LibraryAsset;
      };
      if (!response.ok || !payload.asset) {
        setFailed(true);
        setMessage(payload.error ?? `Upload failed: HTTP ${response.status}.`);
        return;
      }
      setAssets((current) => [
        payload.asset as LibraryAsset,
        ...(current ?? []),
      ]);
      setSource({ kind: "library", asset: payload.asset });
      setFailed(false);
      setMessage("Stored in the library and ready to place.");
    } catch (err) {
      setFailed(true);
      setMessage((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function insert() {
    if (source.kind !== "library") return;
    const asset = source.asset;
    editor
      .chain()
      .focus()
      .insertContent({
        type: "image",
        attrs: {
          src: asset.url,
          srcset: asset.srcSet,
          alt: alt.trim(),
          caption: caption.trim(),
          width: asset.width,
          height: asset.height,
        },
      })
      .run();
    onClose();
  }

  const ready = source.kind === "library" && alt.trim() !== "";

  return (
    <dialog aria-labelledby={headingId} className={styles.dialog} ref={ref}>
      <div className={styles.dialogHead}>
        <h2 className={styles.dialogTitle} id={headingId}>
          Place an image
        </h2>
        <button className={styles.barButton} onClick={onClose} type="button">
          Close
        </button>
      </div>

      <div className={styles.dialogBody}>
        <section className={styles.dialogSection}>
          <h3 className={styles.dialogSectionTitle}>From the library</h3>
          {assets === null ? (
            <p className={styles.dialogNote}>Loading the library.</p>
          ) : assets.length === 0 ? (
            <p className={styles.dialogNote}>
              Nothing in the library yet. Upload below and it lands here.
            </p>
          ) : (
            <ul className={styles.assetGrid}>
              {assets.map((asset) => {
                const chosen =
                  source.kind === "library" && source.asset.id === asset.id;
                return (
                  <li key={asset.id}>
                    <button
                      aria-pressed={chosen}
                      className={styles.assetButton}
                      onClick={() => choose(asset)}
                      type="button"
                    >
                      {/* biome-ignore lint/performance/noImgElement: a library thumbnail at its stored address, same reasoning as the public renderer */}
                      <img
                        alt=""
                        className={styles.assetThumb}
                        loading="lazy"
                        src={asset.url}
                      />
                      <span className={styles.assetName}>
                        {asset.objectKey}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className={styles.dialogSection}>
          <h3 className={styles.dialogSectionTitle}>Or upload one</h3>
          <input
            accept={ACCEPT_ATTRIBUTE}
            aria-label="Image file"
            className={styles.dialogInput}
            ref={fileRef}
            type="file"
          />
          <button
            className={styles.barButton}
            disabled={busy}
            onClick={upload}
            type="button"
          >
            {busy ? "Uploading" : "Upload to the library"}
          </button>
        </section>

        <section className={styles.dialogSection}>
          <label className={styles.dialogField} htmlFor={altId}>
            <span className={styles.dialogLabel}>
              Alt text <span className={styles.blockRequired}>required</span>
            </span>
            <input
              className={styles.dialogInput}
              id={altId}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="What the image shows, for somebody who cannot see it"
              type="text"
              value={alt}
            />
          </label>
          <label className={styles.dialogField} htmlFor={captionId}>
            <span className={styles.dialogLabel}>Caption</span>
            <input
              className={styles.dialogInput}
              id={captionId}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Optional. Where the image carries meaning rather than atmosphere"
              type="text"
              value={caption}
            />
          </label>
        </section>

        {/* The region exists before there is anything to announce, so a screen
            reader is watching it when the first message arrives. */}
        <p
          aria-live="polite"
          className={failed ? styles.dialogError : styles.dialogNote}
        >
          {message ?? ""}
        </p>
      </div>

      <div className={styles.dialogFoot}>
        <button
          className={styles.primaryAction}
          disabled={!ready}
          onClick={insert}
          type="button"
        >
          Place the image
        </button>
        <span className={styles.dialogNote}>
          {source.kind === "none"
            ? "Choose or upload an image first."
            : alt.trim() === ""
              ? "Alt text is what makes this image readable to everybody."
              : "Ready."}
        </span>
      </div>
    </dialog>
  );
}
