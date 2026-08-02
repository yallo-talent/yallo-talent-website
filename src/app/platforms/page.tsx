import type { Metadata } from "next";
import { L1HubShell } from "@/components/blocks/l1/L1HubShell";
import { platformsIndex } from "@/data/l1/index";
import { publishedPlatformSlugs } from "@/data/platforms/derive";
import { buildMetadata } from "@/lib/seo";

/**
 * Non-enumerating, per context-round6-rulings.md §6.4. It read "SAP, Oracle,
 * Microsoft, Salesforce, Blue Yonder and Workday specialists" — six of seven,
 * missing Informatica, on the hub page that renders the set correctly from
 * `platformsIndex` directly below. The page derived and its own description did
 * not, which is the whole class in one file.
 *
 * The list is not extended to seven. A description that names the taxonomy
 * dates every time canon amends it, and the second sentence's duplicate
 * "Specialists ... Specialists" goes with it.
 */
export const metadata: Metadata = buildMetadata({
  seo: {
    title: "Platforms · Yallo Talent",
    description:
      "Enterprise platform specialists, screened at module level rather than by vendor name. Contract, permanent and EOR across the Middle East and Europe.",
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
      emphasis="Deep specialist-screened benches."
      sub="Every platform we staff has a lead specialist with implementation depth in it. We don't send you people who list a certification — we send people who've shipped the product."
      entries={publishedPlatforms}
    />
  );
}
