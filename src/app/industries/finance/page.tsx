import type { Metadata } from "next";
import { L1PageShell } from "@/components/blocks/l1/L1PageShell";
import { financeData } from "@/data/l1/finance";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  seo: financeData.seo,
  path: "/industries/finance",
});

export default function FinancePage() {
  return <L1PageShell data={financeData} />;
}
