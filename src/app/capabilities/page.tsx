import type { Metadata } from "next";
import { L1HubShell } from "@/components/blocks/l1/L1HubShell";
import { capabilitiesIndex } from "@/data/l1/index";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  seo: {
    title: "Capabilities · Yallo Talent",
    description:
      "Data & AI, DevOps, Cloud, Cybersecurity, Integration and Emerging Tech specialists — architect-screened for enterprise programmes.",
  },
  path: "/capabilities",
});

export default function CapabilitiesHub() {
  return (
    <L1HubShell
      eyebrow="Capabilities"
      title="Six cross-cutting capabilities."
      emphasis="Ready for your programme."
      sub="From Data & AI to Cybersecurity to Emerging Tech — deep specialist benches that span your sector and platform choices."
      entries={capabilitiesIndex}
    />
  );
}
