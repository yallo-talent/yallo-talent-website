import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { L2PageShell } from "@/components/blocks/l2/L2PageShell";
import { taxonomyLabels } from "@/data/l1/index";
import {
  expertiseWithTools,
  sectorRegistry,
  sectorsWithTools,
} from "@/data/l1/registry";
import { buildMetadata } from "@/lib/seo";

interface RouteParams {
  sector: string;
  fn: string;
}

export function generateStaticParams(): RouteParams[] {
  const params: RouteParams[] = [];
  for (const [sector, data] of sectorsWithTools()) {
    for (const fn of expertiseWithTools(data)) {
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
  if (!fn?.tools || fn.tools.length === 0) return null;
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
      title: `${fn.title} Contractors · ${taxonomyLabels(sector.slug).short} | Yallo Talent`,
      description: `${roles} and more. Specialist-screened contractor shortlists in 72 hours. Middle East · Europe · India.`,
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
