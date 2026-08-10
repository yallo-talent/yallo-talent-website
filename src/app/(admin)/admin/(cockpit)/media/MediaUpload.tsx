"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import styles from "@/components/admin/Admin.module.css";
import { ACCEPT_ATTRIBUTE, MAX_UPLOAD_BYTES } from "@/lib/media/config";

/**
 * The upload control.
 *
 * A CLIENT COMPONENT BECAUSE THE UPLOAD IS A FETCH, not because the form needs
 * state. A twenty megabyte binary does not belong in a server action's
 * serialised payload, so the file goes to `/api/admin/media` as multipart and
 * this reports what came back. Everything the route enforces is enforced there;
 * the two checks below are so a person is told before they wait rather than
 * after.
 *
 * ALT TEXT IS REQUIRED BY THE INPUT AND BY THE ROUTE. The attribute is the
 * courtesy and the route is the rule, in that order, and neither is a substitute
 * for the other.
 */
export function MediaUpload() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const file = data.get("file");
    if (!(file instanceof File) || file.size === 0) {
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

    setBusy(true);
    setFailed(false);
    setMessage("Uploading and resizing.");
    try {
      const response = await fetch("/api/admin/media", {
        method: "POST",
        body: data,
      });
      const payload = (await response.json()) as {
        error?: string;
        /* The editor's shape since A5, because the editor now inserts straight
           from an upload. `srcSet` carries one entry per rendition, so the
           count that used to come from `renditions` is read off it — the same
           fact, from the field that exists. */
        asset?: { objectKey?: string; srcSet?: string };
      };
      if (!response.ok) {
        setFailed(true);
        setMessage(payload.error ?? `Upload failed: HTTP ${response.status}.`);
        return;
      }
      const renditions = (payload.asset?.srcSet ?? "")
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean).length;
      setFailed(false);
      setMessage(`Stored, with ${renditions} rendition(s).`);
      formRef.current?.reset();
      /* The library is a server component reading the table this just wrote to,
         so it has to be asked again. */
      router.refresh();
    } catch (err) {
      setFailed(true);
      setMessage((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className={styles.filters} onSubmit={onSubmit} ref={formRef}>
      <label className={styles.field} htmlFor="m-file">
        <span className={styles.fieldLabel}>Image</span>
        <input
          accept={ACCEPT_ATTRIBUTE}
          className={styles.input}
          id="m-file"
          name="file"
          required
          type="file"
        />
      </label>

      <label className={styles.field} htmlFor="m-alt">
        <span className={styles.fieldLabel}>Alt text</span>
        <input
          className={styles.input}
          id="m-alt"
          name="alt"
          placeholder="What the image shows, for somebody who cannot see it"
          required
          type="text"
        />
      </label>

      <label className={styles.field} htmlFor="m-caption">
        <span className={styles.fieldLabel}>Caption</span>
        <input
          className={styles.input}
          id="m-caption"
          name="caption"
          placeholder="Optional. Where the image carries meaning rather than atmosphere"
          type="text"
        />
      </label>

      <button className={styles.submit} disabled={busy} type="submit">
        {busy ? "Uploading" : "Upload"}
      </button>

      {message ? (
        <p aria-live="polite" className={failed ? styles.error : styles.ok}>
          {message}
        </p>
      ) : (
        /* The region exists before there is anything to announce, so a screen
           reader is watching it when the first message arrives. */
        <p aria-live="polite" className={styles.meta} />
      )}
    </form>
  );
}
