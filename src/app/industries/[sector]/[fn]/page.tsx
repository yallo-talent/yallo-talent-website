import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { L2PageShell } from "@/components/blocks/l2/L2PageShell";
import { retailData } from "@/data/l1/retail";
import type { L1PageData } from "@/data/l1/types";
import { buildMetadata } from "@/lib/seo";

/**
 * Sector data registry — extend as more industries get L2 tools.
 * A sector is only listed here when its expertise items carry `tools`.
 */
const sectorRegistry: Record<string, L1PageData> = {
  retail: retailData,
};

interface RouteParams {
  sector: string;
  fn: string;
}

export function generateStaticParams(): RouteParams[] {
  const params: RouteParams[] = [];
  for (const [sector, data] of Object.entries(sectorRegistry)) {
    for (const fn of data.expertise) {
      if (fn.tools && fn.tools.length > 0) {
        params.push({ sector, fn: fn.slug });
      }
    }
  }
  return params;
}

interface PageProps {
  params: Promise<RouteParams>;
}

function resolve(sectorSlug: string, fnSlug: string) {
  const sector = sectorRegistry[sectorSlug];
  if (!sector) return null;
  const fn = sector.expertise.find((e) => e.slug === fnSlug);
  if (!fn || !fn.tools || fn.tools.length === 0) return null;
  return { sector, fn };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const p = await params;
  const resolved = resolve(p.sector, p.fn);
  if (!resolved) {
    return { title: "Function not found" };
  }
  const { sector, fn } = resolved;
  const roles = fn.roles.slice(0, 3).join(", ");
  return buildMetadata({
    seo: {
      title: `${fn.title} Contractors · ${sector.title.replace(/&.*/, "").trim()} | Yallo Talent`,
      description: `${roles} and more. Architect-screened contractor shortlists in 72 hours. UK · ME · India.`,
    },
    path: `/industries/${p.sector}/${p.fn}`,
  });
}

export default async function L2FunctionPage({ params }: PageProps) {
  const p = await params;
  const resolved = resolve(p.sector, p.fn);
  if (!resolved) notFound();
  return <L2PageShell sector={resolved.sector} fn={resolved.fn} />;
}
