import type { Metadata } from "next";
import { ServicePageShell } from "@/components/blocks/service/ServicePageShell";
import { managedDeliveryData } from "@/data/services/managed-delivery";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  seo: managedDeliveryData.seo,
  path: "/managed-delivery",
});

export default function ManagedDeliveryPage() {
  return <ServicePageShell data={managedDeliveryData} />;
}
