"use client";

import { Editor } from "./Editor";

/**
 * The client boundary, and nothing else.
 *
 * `EditorPane` is a server component: it reads the row, renders the fields and
 * the revision list, and holds the server actions. `Editor` is a client
 * component holding ProseMirror. Something has to be the seam, and putting it
 * in its own file keeps `"use client"` off the pane — which matters, because
 * marking the pane client would pull the taxonomy indexes, the validation
 * budgets and every field default into the browser bundle for no reason.
 */
export function EditorClient({
  initialBody,
  saveBody,
  previewPath,
  previewReady,
}: {
  initialBody: unknown;
  saveBody: (body: unknown) => Promise<void>;
  previewPath: string;
  previewReady: boolean;
}) {
  return (
    <Editor
      initialBody={initialBody}
      onSave={saveBody}
      previewPath={previewPath}
      previewReady={previewReady}
    />
  );
}
