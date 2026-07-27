import type { Metadata } from "next";
import { L1HubShell } from "@/components/blocks/l1/L1HubShell";
import { platformsIndex } from "@/data/l1/index";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  seo: {
    title: "Platforms · Yallo Talent",
    description:
      "SAP, Oracle, Microsoft, Salesforce, Blue Yonder and Workday specialists. Active benches across UK, ME and India.",
  },
  path: "/platforms",
});

export default function PlatformsHub() {
  return (
    <L1HubShell
      eyebrow="Platforms"
      title="Six enterprise platforms."
      emphasis="Deep architect-screened benches."
      sub="Every platform we staff has a lead architect with implementation depth in it. We don't send you people who list a certification — we send people who've shipped the module."
      entries={platformsIndex}
    />
  );
}
