"use client";

import dynamic from "next/dynamic";

/**
 * The client-boundary wrapper the deferred mount actually needs. Next 16
 * hard-errors on `dynamic(..., { ssr: false })` written directly inside a
 * Server Component (layout.tsx is one) — it has to originate inside a
 * Client Component. This is that one line of indirection, kept in this
 * session's own territory so `layout.tsx` (session A's, context-round13-
 * scope.md §3.2 item 2) only ever needs a plain, ordinary import of a
 * client component — no dynamic-import ceremony on that side of the seam.
 */
const AssistantLauncher = dynamic(
  () => import("@/components/assistant/AssistantLauncher"),
  { ssr: false },
);

export function AssistantMount() {
  return <AssistantLauncher />;
}

export default AssistantMount;
