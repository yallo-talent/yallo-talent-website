import type { Metadata } from "next";
import { BriefForm } from "@/components/blocks/BriefForm";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  seo: {
    title: "Send us a brief · Yallo Talent",
    description:
      "Tell us what you're hiring for. Specialist-led screening delivers a calibrated shortlist within 72 hours across the Middle East and Europe.",
  },
  path: "/brief",
});

export default function BriefPage() {
  return <BriefForm />;
}
