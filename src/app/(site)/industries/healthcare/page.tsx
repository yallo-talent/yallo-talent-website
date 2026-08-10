import type { Metadata } from "next";
import { L1PageShell } from "@/components/blocks/l1/L1PageShell";
import { healthcareData } from "@/data/l1/healthcare";
import { homeMetrics, metricsAttribution } from "@/data/metrics";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  seo: healthcareData.seo,
  path: "/industries/healthcare",
});

export default function HealthcarePage() {
  return (
    <L1PageShell
      data={healthcareData}
      metrics={homeMetrics}
      metricsAttribution={metricsAttribution}
    />
  );
}
