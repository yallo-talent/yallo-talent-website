import type { Metadata } from "next";
import { L1HubShell } from "@/components/blocks/l1/L1HubShell";
import { capabilityRegistry, PLANNED_CAPABILITIES } from "@/data/capabilities";
import { capabilitiesIndex } from "@/data/l1/index";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  seo: {
    title: "Capabilities · Yallo Talent",
    description:
      "Data & AI, DevOps, Cloud, Cybersecurity, Integration and Emerging Tech specialists — specialist-screened for enterprise programmes.",
  },
  path: "/capabilities",
});

// Disciplines WITH a page are linked. The four without one are still shown —
// see the `planned` prop on L1HubShell — because the hub's own H1 says six, and
// listing two under that heading contradicted the page and hid two thirds of
// canon §3's taxonomy. A card that 404s is worse than an absent card; an honest
// inert card is better than both.
const publishedCapabilities = capabilitiesIndex.filter(
  (e) => e.slug in capabilityRegistry,
);

const plannedCapabilities = capabilitiesIndex
  .filter((e) => (PLANNED_CAPABILITIES as readonly string[]).includes(e.slug))
  .map((e) => ({ slug: e.slug, label: e.label }));

export default function CapabilitiesHub() {
  return (
    <L1HubShell
      eyebrow="Capabilities"
      title="Six cross-cutting capabilities."
      emphasis="Ready for your programme."
      sub="From Data & AI to Cybersecurity to Emerging Tech — deep specialist benches that span your sector and platform choices."
      entries={publishedCapabilities}
      planned={plannedCapabilities}
    />
  );
}
