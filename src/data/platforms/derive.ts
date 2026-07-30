import { allL1, type TaxonomyLabel, taxonomyLabels } from "@/data/l1/index";
import { sectorRegistry } from "@/data/l1/registry";
import { authoredPlatforms } from "@/data/platforms/authored";

/**
 * Platform coverage, from two sources that are never invented:
 *
 * 1. DERIVED — re-projected from the sector files' L2Tool entries: real
 *    products with the real roles Yallo places into them. A derived platform
 *    page can only say what a sector page already says.
 * 2. AUTHORED — the module sets Sumeet ratified directly (canon §3: Microsoft
 *    and Workday, Relay v2.1 rev 2 §5/§5b), platform-level desks with scope
 *    lines. These merge on module name with anything derived, and an authored
 *    platform always publishes: nothing renders empty where real capability
 *    exists (his explicit instruction).
 *
 * Consequence, deliberately: a platform with neither source gets no page.
 * `generateStaticParams` is gated on presence, exactly as L2 function pages
 * are, so real pages exist rather than thin ones.
 */

export interface PlatformModule {
  /** The product as published — "SAP Customer Experience", not "SAP CX". */
  name: string;
  /** What Yallo places on it — authored scope line, Talent-speak. */
  scope?: string;
  /** Contractor roles Yallo places on this product. */
  roles: string[];
  /** Where this module appears, so the reader can reach the detail. */
  appearsIn: Array<{
    sectorSlug: string;
    sectorLabel: TaxonomyLabel;
    fnSlug: string;
    fnTitle: string;
  }>;
}

export interface PlatformCoverage {
  slug: string;
  /** Vendor name as published. */
  name: string;
  modules: PlatformModule[];
  /** Every distinct role across the platform, de-duplicated. */
  roles: string[];
  sectors: Array<{ slug: string; label: TaxonomyLabel }>;
  moduleCount: number;
  roleCount: number;
}

/** Vendor name -> platform slug. Only the six in the canon platform set. */
const VENDOR_SLUGS: Record<string, string> = {
  SAP: "sap",
  Oracle: "oracle",
  Microsoft: "microsoft",
  Salesforce: "salesforce",
  "Blue Yonder": "blue-yonder",
  Workday: "workday",
};

/**
 * A platform page needs enough module coverage to be worth a visit. Below this
 * the honest answer is no page — the nav renders the label non-interactive.
 */
const MIN_MODULES = 3;

function collect(): Map<string, PlatformCoverage> {
  const out = new Map<string, PlatformCoverage>();

  for (const sector of Object.values(sectorRegistry)) {
    const { label: sectorLabel } = taxonomyLabels(sector.slug);

    for (const fn of sector.expertise) {
      for (const tool of fn.tools ?? []) {
        const slug = VENDOR_SLUGS[tool.vendor];
        if (!slug) continue; // not in the canon platform set

        let cov = out.get(slug);
        if (!cov) {
          cov = {
            slug,
            name: tool.vendor,
            modules: [],
            roles: [],
            sectors: [],
            moduleCount: 0,
            roleCount: 0,
          };
          out.set(slug, cov);
        }

        let mod = cov.modules.find((m) => m.name === tool.name);
        if (!mod) {
          mod = { name: tool.name, roles: [], appearsIn: [] };
          cov.modules.push(mod);
        }
        for (const r of tool.roles)
          if (!mod.roles.includes(r)) mod.roles.push(r);
        mod.appearsIn.push({
          sectorSlug: sector.slug,
          sectorLabel,
          fnSlug: fn.slug,
          fnTitle: fn.title,
        });

        if (!cov.sectors.some((s) => s.slug === sector.slug)) {
          cov.sectors.push({ slug: sector.slug, label: sectorLabel });
        }
      }
    }
  }

  // Merge the authored sets. Authored scope and roles lead; derived
  // appearsIn cross-links attach where the module names match.
  for (const authored of Object.values(authoredPlatforms)) {
    let cov = out.get(authored.slug);
    if (!cov) {
      cov = {
        slug: authored.slug,
        name: authored.name,
        modules: [],
        roles: [],
        sectors: [],
        moduleCount: 0,
        roleCount: 0,
      };
      out.set(authored.slug, cov);
    }
    for (const am of authored.modules) {
      let mod = cov.modules.find((m) => m.name === am.name);
      if (!mod) {
        mod = { name: am.name, roles: [], appearsIn: [] };
        cov.modules.push(mod);
      }
      mod.scope = am.scope;
      for (const r of am.roles) if (!mod.roles.includes(r)) mod.roles.push(r);
    }
  }

  for (const cov of out.values()) {
    cov.modules.sort((a, b) => b.roles.length - a.roles.length);
    cov.roles = [...new Set(cov.modules.flatMap((m) => m.roles))].sort();
    cov.moduleCount = cov.modules.length;
    cov.roleCount = cov.roles.length;
  }
  return out;
}

let cache: Map<string, PlatformCoverage> | null = null;
function coverage() {
  if (!cache) cache = collect();
  return cache;
}

/** Platforms with enough real module data to justify a page. */
export function publishedPlatformSlugs(): string[] {
  return [...coverage().values()]
    .filter((c) => c.moduleCount >= MIN_MODULES)
    .map((c) => c.slug);
}

export function getPlatformCoverage(slug: string): PlatformCoverage | null {
  const c = coverage().get(slug);
  return c && c.moduleCount >= MIN_MODULES ? c : null;
}

/** Every canon platform with whether it currently has a page. */
export function platformIndex(): Array<{
  slug: string;
  name: string;
  published: boolean;
  moduleCount: number;
  roleCount: number;
}> {
  const cov = coverage();
  return Object.entries(VENDOR_SLUGS).map(([name, slug]) => {
    const c = cov.get(slug);
    const moduleCount = c?.moduleCount ?? 0;
    return {
      slug,
      name,
      published: moduleCount >= MIN_MODULES,
      moduleCount,
      roleCount: c?.roleCount ?? 0,
    };
  });
}

/** Kept for the sector cross-links, so /platforms can point back. */
export function sectorsForPlatform(slug: string) {
  return coverage().get(slug)?.sectors ?? [];
}

/** Referenced so the index stays the single source of taxonomy labels. */
export const L1_GROUPS = allL1;
