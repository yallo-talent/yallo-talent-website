import type { Metadata } from "next";
import { LegalPageShell } from "@/components/blocks/editorial/LegalPageShell";
import { privacyData } from "@/data/legal/privacy";
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
    "talent.yallo.co offers an in-page assistant that answers questions from this site's own published content and can help put together a brief. Conversations are recorded and kept for 12 months, then deleted. If a conversation results in a brief, the brief itself persists as a commercial record in the same way a brief sent through our contact form does.",
    "The assistant serves prospective clients only. It does not collect anything beyond what our brief form already collects, and it never asks for payment details, passwords or identity documents.",
  ],
};

export default function PrivacyPage() {
  const data = {
    ...privacyData,
    sections: [...privacyData.sections, assistantSection],
  };
  return <LegalPageShell data={data} />;
}
