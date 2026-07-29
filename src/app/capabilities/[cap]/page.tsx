import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { L1PageShell } from "@/components/blocks/l1/L1PageShell";
import { capabilityRegistry } from "@/data/capabilities";
import { buildMetadata } from "@/lib/seo";

interface RouteParams {
  cap: string;
}

export function generateStaticParams(): RouteParams[] {
  return Object.keys(capabilityRegistry).map((cap) => ({ cap }));
}

interface PageProps {
  params: Promise<RouteParams>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { cap } = await params;
  const data = capabilityRegistry[cap];
  if (!data) return { title: "Capability not found" };
  return buildMetadata({ seo: data.seo, path: `/capabilities/${cap}` });
}

export default async function CapabilityPage({ params }: PageProps) {
  const { cap } = await params;
  const data = capabilityRegistry[cap];
  if (!data) notFound();
  return <L1PageShell data={data} />;
}
