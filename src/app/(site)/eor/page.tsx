import type { Metadata } from "next";
import { ServicePageShell } from "@/components/blocks/service/ServicePageShell";
import { eorData } from "@/data/services/eor";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  seo: eorData.seo,
  path: "/eor",
});

export default function EorPage() {
  return <ServicePageShell data={eorData} />;
}
