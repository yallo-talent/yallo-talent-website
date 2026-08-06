import type { Metadata } from "next";
import { LegalPageShell } from "@/components/blocks/editorial/LegalPageShell";
import { termsData } from "@/data/legal/terms";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  seo: {
    title: "Terms of use · Yallo Talent",
    description:
      "Terms governing your use of yallo.co. Commercial engagements are governed by a separate written agreement.",
  },
  path: "/terms",
});

export default function TermsPage() {
  return <LegalPageShell data={termsData} />;
}
