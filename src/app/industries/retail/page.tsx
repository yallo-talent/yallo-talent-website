import type { Metadata } from "next";
import { L1PageShell } from "@/components/blocks/l1/L1PageShell";
import { retailData } from "@/data/l1/retail";
import { homeMetrics } from "@/data/metrics";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  seo: retailData.seo,
  path: "/industries/retail",
});

export default function RetailPage() {
  return <L1PageShell data={retailData} metrics={homeMetrics} />;
}
