"use client";

import { useState } from "react";
import { Editor } from "./Editor";
import { LiveChecks, type LiveChecksProps } from "./LiveChecks";

/**
 * The client boundary, and the live checks that need to sit on this side of it.
 *
 * `EditorPane` is a server component: it reads the row, renders the fields and
 * the revision list, and holds the server actions. `Editor` is a client
 * component holding ProseMirror. Something has to be the seam, and putting it
 * in its own file keeps `"use client"` off the pane — which matters, because
 * marking the pane client would pull the taxonomy indexes, the validation
 * budgets and every field default into the browser bundle for no reason.
 *
 * THE CHECKS LIVE HERE BECAUSE THE LIVE DOCUMENT DOES. They have to run against
 * what is on screen rather than what was last saved, or they are a report on
 * the past. The document is reported outward from the editor on every change
 * and held here; ProseMirror still owns it, so nothing is controlled and the
 * caret never jumps.
 */
export function EditorClient({
  initialBody,
  saveBody,
  previewPath,
  previewReady,
  checks,
}: {
  initialBody: unknown;
  saveBody: (body: unknown) => Promise<void>;
  previewPath: string;
  previewReady: boolean;
  /** Everything the checks need except the body, which arrives from the editor. */
  checks: Omit<LiveChecksProps, "body">;
}) {
  const [body, setBody] = useState<unknown>(initialBody);

  return (
    <>
      <Editor
        initialBody={initialBody}
        onDocChange={setBody}
        onSave={saveBody}
        previewPath={previewPath}
        previewReady={previewReady}
      />
      <LiveChecks {...checks} body={body} />
    </>
  );
}
