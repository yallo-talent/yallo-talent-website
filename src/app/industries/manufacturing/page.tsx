import type { Metadata } from "next";
import { L1PageShell } from "@/components/blocks/l1/L1PageShell";
import { manufacturingData } from "@/data/l1/manufacturing";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  seo: manufacturingData.seo,
  path: "/industries/manufacturing",
});

export default function ManufacturingPage() {
  return <L1PageShell data={manufacturingData} />;
}
