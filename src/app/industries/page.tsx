import type { Metadata } from "next";
import {
  HubArchitects,
  HubCrossConnected,
  HubHowWeWork,
  HubWhatWeDeliver,
} from "@/components/blocks/hub/HubLandingSections";
import { L1HubShell } from "@/components/blocks/l1/L1HubShell";
import { industriesIndex } from "@/data/l1/index";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  seo: {
    title: "Industries · Yallo Talent",
    description:
      "Talent for retail, banking, government, manufacturing, healthcare and telco enterprise programmes. Architect-screened across the Middle East, Europe and India.",
  },
  path: "/industries",
});

export default function IndustriesHub() {
  return (
    <>
      <L1HubShell
        eyebrow="Industries"
        title="Six sectors."
        emphasis="One architect-led bench."
        sub="Enterprise technology talent calibrated to your sector — from retail transformation to public-sector digital and telco OSS/BSS."
        entries={industriesIndex}
      />
      <HubWhatWeDeliver label="enterprise" />
      <HubHowWeWork />
      <HubArchitects />
      <HubCrossConnected />
    </>
  );
}
