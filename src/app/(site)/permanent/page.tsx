import type { Metadata } from "next";
import { ServicePageShell } from "@/components/blocks/service/ServicePageShell";
import { permanentData } from "@/data/services/permanent";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  seo: permanentData.seo,
  path: "/permanent",
});

export default function PermanentPage() {
  return <ServicePageShell data={permanentData} />;
}
