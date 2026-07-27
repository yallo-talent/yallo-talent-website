import type { Metadata } from "next";
import { BriefForm } from "@/components/blocks/BriefForm";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  seo: {
    title: "Send us a brief · Yallo Talent",
    description:
      "Tell us what you're hiring for. Architect-led screening delivers a calibrated shortlist within 72 hours across UK, ME and India.",
  },
  path: "/brief",
});

export default function BriefPage() {
  return <BriefForm />;
}
