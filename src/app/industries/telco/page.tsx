import type { Metadata } from "next";
import { L1PageShell } from "@/components/blocks/l1/L1PageShell";
import { telcoData } from "@/data/l1/telco";
import { homeMetrics } from "@/data/metrics";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  seo: telcoData.seo,
  path: "/industries/telco",
});

export default function TelcoPage() {
  return <L1PageShell data={telcoData} metrics={homeMetrics} />;
}
