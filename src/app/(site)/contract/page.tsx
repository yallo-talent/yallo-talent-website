import type { Metadata } from "next";
import { ServicePageShell } from "@/components/blocks/service/ServicePageShell";
import { contractData } from "@/data/services/contract";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  seo: contractData.seo,
  path: "/contract",
});

export default function ContractPage() {
  return <ServicePageShell data={contractData} />;
}
