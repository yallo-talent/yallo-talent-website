import type { Metadata } from "next";
import { L1HubShell } from "@/components/blocks/l1/L1HubShell";
import { capabilityRegistry, PLANNED_CAPABILITIES } from "@/data/capabilities";
import { capabilitiesIndex } from "@/data/l1/index";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  seo: {
    title: "Capabilities · Yallo Talent",
    description:
      "AI, data and analytics, cloud, cybersecurity, integration, DevOps and testing specialists, screened by people who have built the thing for enterprise programmes.",
  },
  path: "/capabilities",
});

// Disciplines WITH a page are linked. Any without one is still shown — see the
// `planned` prop on L1HubShell — because the hub's own H1 states a count, and
// listing fewer cards than that contradicted the page and hid part of canon §3's
// taxonomy. A card that 404s is worse than an absent card; an honest inert card
// is better than both.
//
// A discipline is published when it has a page: an entry in the registry, or an
// explicit canonical href for the one discipline that lives outside
// /capabilities (AI Talent, at /ai-talent).
const publishedCapabilities = capabilitiesIndex.filter(
  (e) => e.slug in capabilityRegistry || e.href !== undefined,
);

const plannedCapabilities = capabilitiesIndex
  .filter((e) => (PLANNED_CAPABILITIES as readonly string[]).includes(e.slug))
  .map((e) => ({ slug: e.slug, label: e.label }));

/**
 * The count in the H1 is DERIVED, and that is the fix rather than a typo repair.
 *
 * It read "Six cross-cutting capabilities" as a literal while canon §3's
 * six-to-seven amendment made it seven, and a hardcoded count in a heading is
 * guaranteed to drift from the array beneath it the next time the taxonomy moves.
 * Now the heading cannot disagree with the cards it introduces.
 */
const COUNT_WORDS = [
  "Zero",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
] as const;
const disciplineCount =
  COUNT_WORDS[capabilitiesIndex.length] ?? String(capabilitiesIndex.length);

export default function CapabilitiesHub() {
  return (
    <L1HubShell
      eyebrow="Capabilities"
      title={`${disciplineCount} cross-cutting capabilities.`}
      emphasis="Ready for your programme."
      sub="From AI Talent to cybersecurity to testing, deep specialist benches that span your sector and platform choices."
      entries={publishedCapabilities}
      planned={plannedCapabilities}
    />
  );
}
