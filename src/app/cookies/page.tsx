import type { Metadata } from "next";
import { LegalPageShell } from "@/components/blocks/editorial/LegalPageShell";
import { cookiesData } from "@/data/legal/cookies";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  seo: {
    title: "Cookies notice · Yallo Talent",
    description:
      "How Yallo Talent uses cookies and browser storage on yallo.co. Short version: we keep it minimal.",
  },
  path: "/cookies",
});

export default function CookiesPage() {
  return <LegalPageShell data={cookiesData} />;
}
