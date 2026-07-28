import type { Metadata } from "next";
import { L1PageShell } from "@/components/blocks/l1/L1PageShell";
import { governmentData } from "@/data/l1/government";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  seo: governmentData.seo,
  path: "/industries/government",
});

export default function GovernmentPage() {
  return <L1PageShell data={governmentData} />;
}
