import type { Metadata } from "next";
import { L1HubShell } from "@/components/blocks/l1/L1HubShell";
import { platformsIndex } from "@/data/l1/index";
import { publishedPlatformSlugs } from "@/data/platforms/derive";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  seo: {
    title: "Platforms · Yallo Talent",
    description:
      "SAP, Oracle, Microsoft, Salesforce, Blue Yonder and Workday specialists. Active benches across the Middle East, Europe and India.",
  },
  path: "/platforms",
});

// Only platforms with real module coverage get a card. Microsoft and Workday
// are in the canon set and named in the nav, but a card that 404s is worse than
// an absent one — and canon wants Microsoft deepest, not thinnest.
const publishedPlatforms = platformsIndex.filter((e) =>
  publishedPlatformSlugs().includes(e.slug),
);

export default function PlatformsHub() {
  return (
    <L1HubShell
      eyebrow="Platforms"
      title="Six enterprise platforms."
      emphasis="Deep architect-screened benches."
      sub="Every platform we staff has a lead architect with implementation depth in it. We don't send you people who list a certification — we send people who've shipped the module."
      entries={publishedPlatforms}
    />
  );
}
