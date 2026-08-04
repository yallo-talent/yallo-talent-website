"use client";

import dynamic from "next/dynamic";

/* Deferred island: fetched on first render of this component, never in the
   initial bundle. A client wrapper because `ssr: false` is not allowed on
   next/dynamic inside a Server Component, and layout.tsx is one. Flag
   defaults off — talent.yallo.co is noindex pre-cutover, so there is no
   traffic to pilot an answer surface against. See
   context-round13-chatbot.md §3, §6 (pilot gate). */
const AssistantLauncher = dynamic(
  () =>
    import("@/components/assistant/AssistantLauncher").then(
      (m) => m.AssistantLauncher,
    ),
  { ssr: false },
);

const ASSISTANT_ENABLED = process.env.NEXT_PUBLIC_ASSISTANT_ENABLED === "true";

export function AssistantLauncherMount() {
  if (!ASSISTANT_ENABLED) return null;
  return <AssistantLauncher />;
}
