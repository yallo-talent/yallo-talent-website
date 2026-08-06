"use client";

import dynamic from "next/dynamic";

/* Deferred island: fetched on first render of this component, never in the
   initial bundle. A client wrapper because `ssr: false` is not allowed on
   next/dynamic inside a Server Component, and layout.tsx is one.

   The flag now defaults ON (R-A1, context-round16-scope.md §1), so deferral is
   the only thing keeping the assistant out of the initial payload — it can no
   longer be satisfied by the flag tree-shaking the import away.
   check-assistant-bundle asserts exactly that.

   The flag is imported, not re-derived. This file used to carry its own copy
   of the `process.env` comparison, so flipping the default meant editing the
   rule in two places and the second copy is this build's signature defect. */
import { ASSISTANT_ENABLED } from "@/lib/assistant/flag";

const AssistantLauncher = dynamic(
  () =>
    import("@/components/assistant/AssistantLauncher").then(
      (m) => m.AssistantLauncher,
    ),
  { ssr: false },
);

export function AssistantLauncherMount() {
  if (!ASSISTANT_ENABLED) return null;
  return <AssistantLauncher />;
}
