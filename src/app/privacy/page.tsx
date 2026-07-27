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

export default function PrivacyPage() {
  return <LegalPageShell data={privacyData} />;
}
