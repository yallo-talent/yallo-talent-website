import type { Metadata } from "next";
import { L1PageShell } from "@/components/blocks/l1/L1PageShell";
import { educationData } from "@/data/l1/education";
import { homeMetrics } from "@/data/metrics";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  seo: educationData.seo,
  path: "/industries/education",
});

export default function EducationPage() {
  return <L1PageShell data={educationData} metrics={homeMetrics} />;
}
