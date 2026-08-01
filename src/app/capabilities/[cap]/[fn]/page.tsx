import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { L2PageShell } from "@/components/blocks/l2/L2PageShell";
import { capabilityRegistry } from "@/data/capabilities/index";
import { taxonomyLabels } from "@/data/l1/index";
import { buildMetadata } from "@/lib/seo";

/**
 * Capability L2 — the discipline detail page, D3.
 *
 * The SAME L2PageShell the sector L2s use. Capabilities had no L2 route at all,
 * so /capabilities/data-analytics rendered zero drill-downs against retail's 21
 * and the capability pattern could not be judged.
 *
 * I nearly parked this. Retail's expertise cards carry `overview` and `tools`;
 * the capability cards carry neither, and authoring seven overviews and seven
 * tool lists is exactly the invention the standing rule forbids — the only
 * source for the tool names is a three-year-old workbook that D4 says is never
 * truth, and a `tools` array asserts that we staff that tool on that discipline.
 *
 * It turned out none of that is required. The shell already degrades:
 * `L2Tools` returns null when `fn.tools` is empty, and `L2Overview` falls back
 * to `fn.blurb`, which every capability card has. So the L2s ship from data that
 * already exists — roles, blurb, title, icon — and the tools section simply does
 * not render. Nothing is authored and nothing is claimed. The missing sections
 * stay missing and named, per canon §9, rather than being filled in.
 *
 * The gate is therefore ROLES, not tools: a discipline earns a page when we can
 * say who we place on it. That is the capability equivalent of the sector
 * route's tools gate, and it is the same test R13 applies to platform modules.
 */

interface RouteParams {
  cap: string;
  fn: string;
}

export function generateStaticParams(): RouteParams[] {
  const params: RouteParams[] = [];
  for (const [cap, data] of Object.entries(capabilityRegistry)) {
    for (const fn of data.expertise) {
      if (fn.roles && fn.roles.length > 0) {
        params.push({ cap, fn: fn.slug });
      }
    }
  }
  return params;
}

interface PageProps {
  params: Promise<RouteParams>;
}

function resolve(capSlug: string, fnSlug: string) {
  const capability = capabilityRegistry[capSlug];
  if (!capability) return null;
  const fn = capability.expertise.find((e) => e.slug === fnSlug);
  /* Roles are the evidence. A discipline with none has nothing to say about who
     we place, so it gets no page rather than an empty one. */
  if (!fn?.roles || fn.roles.length === 0) return null;
  return { capability, fn };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const p = await params;
  const resolved = resolve(p.cap, p.fn);
  if (!resolved) {
    return { title: "Discipline not found" };
  }
  const { capability, fn } = resolved;
  const roles = fn.roles.slice(0, 3).join(", ");
  return buildMetadata({
    seo: {
      title: `${fn.title} Contractors · ${taxonomyLabels(capability.slug).short} | Yallo Talent`,
      description: `${roles} and more. Specialist-screened contractor shortlists in 72 hours. Middle East · Europe · India.`,
    },
    path: `/capabilities/${p.cap}/${p.fn}`,
  });
}

export default async function L2DisciplinePage({ params }: PageProps) {
  const p = await params;
  const resolved = resolve(p.cap, p.fn);
  if (!resolved) notFound();
  /* `sector` is the shell's prop name for "the L1 this page hangs under". A
     capability L1 is the same L1PageData shape, so the shell needs no change —
     which is the whole point of reusing it rather than forking a capability
     variant. */
  return <L2PageShell sector={resolved.capability} fn={resolved.fn} />;
}
