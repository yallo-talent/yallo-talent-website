import type { Metadata } from "next";
import { LegalPageShell } from "@/components/blocks/editorial/LegalPageShell";
import { privacyData } from "@/data/legal/privacy";
import { ASSISTANT_ENABLED } from "@/lib/assistant/flag";
import { assistantRetentionSentence } from "@/lib/assistant/retention";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  seo: {
    title: "Privacy notice · Yallo Talent",
    description:
      "How Yallo Talent collects, uses and protects personal data for candidates, clients and visitors.",
  },
  path: "/privacy",
});

/**
 * The assistant's privacy line, composed onto `privacyData` at render time
 * rather than added to `src/data/legal/privacy.ts` — that file sits under
 * `src/data/**`, outside this session's territory (context-round13-scope.md
 * §3). Required before the assistant ships, per context-round13-chatbot.md
 * §6: name the assistant, state what it stores and for how long.
 */
const assistantSection = {
  heading: "The site assistant",
  body: [
    /* ROUND 15, §2.1. The retention half of this sentence is no longer
       written here. Round 14's two sessions each held one true half — one
       corrected this line to "not saved", the other built the store that
       made it false — and the merge is what put a denial of a real
       transcript store in front of a visitor. `assistantRetentionSentence`
       derives from the same number the purge enforces, so this page and
       `src/lib/db/transcripts.ts` cannot drift apart again. */
    `yallo.co offers an in-page assistant that answers questions from this site's own published content and can help put together a brief. ${assistantRetentionSentence} If a conversation results in a brief, the brief itself persists as a commercial record in the same way a brief sent through our contact form does.`,
    "The assistant serves prospective clients only. It does not collect anything beyond what our brief form already collects, and it never asks for payment details, passwords or identity documents.",
  ],
};

export default function PrivacyPage() {
  /* Gated on the same flag as the assistant itself, so the section appears
     only when the surface it describes does — §2.1. Unconditional before,
     which meant the shipped site described an in-page assistant that renders
     on no page: accurate about a thing that is not there is still a privacy
     notice that does not match the product. Nothing is recorded while the
     flag is off, because nothing can reach the chat route to record. */
  const data = {
    ...privacyData,
    sections: ASSISTANT_ENABLED
      ? [...privacyData.sections, assistantSection]
      : privacyData.sections,
  };
  return <LegalPageShell data={data} />;
}
