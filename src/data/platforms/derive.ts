import { allL1, type TaxonomyLabel, taxonomyLabels } from "@/data/l1/index";
import { sectorRegistry } from "@/data/l1/registry";
import { authoredPlatforms } from "@/data/platforms/authored";

/**
 * Union authored role titles with the derived ones, letting the authored title
 * win where the two name the same job at different levels of specificity.
 *
 * The union used to be a plain `new Set([...authored, ...derived])`, which
 * de-duplicates identical strings and nothing else. Blue Yonder showed what that
 * leaves behind: "MFP Specialist" sitting next to "Blue Yonder MFP Specialist",
 * and "WMS Solution Architect" next to "Blue Yonder WMS Solution Architect".
 * Both halves are real, and that is why neither side was wrong to write them.
 * The derived titles come from sector tool cards, where "MFP Specialist" is
 * unambiguous because the card already says Blue Yonder; the authored titles
 * carry the vendor because a platform page has no such context. Projected onto
 * one list they read as two different jobs, and a buyer counting the bench
 * counts each of them twice.
 *
 * The test is suffix containment: a derived title is dropped when some authored
 * title ends with it on a word boundary, which is exactly the "same role, vendor
 * prefix added" case and nothing looser. A derived title with no more specific
 * authored form survives untouched, because the generic is then the only name
 * that job has here.
 *
 * Deliberately not a hand-maintained suppression list: the pair that was
 * reported is one of several, and a list would have to grow every time a sector
 * tool card is edited.
 */
function mergeRoles(authored: string[], derived: string[]): string[] {
  const out = [...new Set(authored)];
  const lower = out.map((r) => r.toLowerCase());
  for (const d of derived) {
    const dl = d.toLowerCase();
    if (lower.includes(dl)) continue;
    if (lower.some((a) => a.endsWith(` ${dl}`))) continue;
    out.push(d);
    lower.push(dl);
  }
  return out;
}

/** Index of a module in its platform's authored list; unauthored sort last. */
function authoredOrder(platformSlug: string, moduleSlug?: string): number {
  const mods = authoredPlatforms[platformSlug]?.modules;
  if (!mods || !moduleSlug) return Number.MAX_SAFE_INTEGER;
  const i = mods.findIndex((m) => m.slug === moduleSlug);
  return i === -1 ? Number.MAX_SAFE_INTEGER : i;
}

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
  /** Vendor application family (SAP IA round 3). Grouping key only. */
  family?: string;
  /**
   * Route segment for the module's own page, where one exists.
   *
   * Only AUTHORED modules carry a slug: a derived module is a re-projection of
   * a sector's tool entry and has no depth of its own to justify a page. So the
   * presence of a slug IS the "does this drill down" test, and a card links only
   * when there is something behind the link.
   */
  slug?: string;
  /** The product as published — "SAP Customer Experience", not "SAP CX". */
  name: string;
  /** Chip label where the published name is too long for an index. */
  shortName?: string;
  /** What Yallo places on it — authored scope line, Talent-speak. */
  scope?: string;
  /** Contractor roles Yallo places on this product. */
  roles: string[];
  /** Deployment variants inside one product — ORDER 1. */
  variants?: string[];
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

/**
 * Vendor name -> platform slug. The canon platform set, in canon order.
 *
 * Informatica is the seventh and last (R-INF1/R-INF2, 1 Aug 2026). Adding it
 * here is what lets the sector data reach the platform axis: retail already
 * carries an "Informatica MDM" tool with real roles, so the desk inherits a
 * genuine sector without anything being authored twice.
 */
const VENDOR_SLUGS: Record<string, string> = {
  SAP: "sap",
  Oracle: "oracle",
  Microsoft: "microsoft",
  Salesforce: "salesforce",
  "Blue Yonder": "blue-yonder",
  Workday: "workday",
  Informatica: "informatica",
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

  // Merge the authored sets.
  //
  // An authored set REPLACES the derived module list rather than joining it, and
  // that is the fix for a structural skew rather than a preference. Derivation
  // re-projects sector data onto the platform axis, so a platform inherited
  // whichever sectors happened to be seeded with its tools — SAP inherited
  // twelve RETAIL modules (Customer Checkout, Merchandise Management, Space
  // Optimisation, Promotion Management, Forecasting & Replenishment) purely
  // because retail was the only sector carrying SAP tools. Correct mechanism,
  // wrong level: a platform page presents the SUITE FAMILY, and a buyer landing
  // on /platforms/sap to ask about SuccessFactors met a retail merchandising
  // bench. Unioning the two would have published 26 modules at two different
  // levels of abstraction, which is worse than either.
  //
  // What survives from derivation: the appearsIn cross-links wherever a module
  // name matches, and the whole `sectors` list, which is how the platform page
  // still says which sectors it is staffed into. The retail-flavoured modules
  // themselves are untouched and stay on the retail L1 and its L2s, where they
  // are the right level.
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
    const derived = cov.modules;
    cov.modules = authored.modules.map((am) => {
      const match = derived.find((m) => m.name === am.name);
      return {
        slug: am.slug,
        name: am.name,
        shortName: am.shortName,
        scope: am.scope,
        variants: am.variants,
        family: am.family,
        roles: mergeRoles(am.roles, match?.roles ?? []),
        appearsIn: match?.appearsIn ?? [],
      };
    });
  }

  for (const cov of out.values()) {
    /* AUTHORED order, not role count. Sorting by roles.length looked like
       "most-staffed first" and was not: line 164 unions the authored roles with a
       matched retail sector tool's roles, so the count is inflated by whatever
       unrelated seed data happened to collide by name. Blue Yonder's Luminate
       Planning — the module the ratified homepage line names FIRST — got no match
       and rendered 7th of 8, below Space Planning. The suite's spine was an
       accident of retail.ts. Authored order is a decision; role count is a
       side effect. */
    cov.modules.sort(
      (a, b) =>
        authoredOrder(cov.slug, a.slug) - authoredOrder(cov.slug, b.slug),
    );
    /* The same collapse again, one level up, and it is needed because
       `mergeRoles` runs per module. A generic can survive inside module A while
       the specific form of it lives in module B, and this flat list is where the
       two finally meet: Blue Yonder rendered a bare "Solution Architect" beside
       "Blue Yonder WMS Solution Architect", "Assortment Solution Architect" and
       "Space Solution Architect". Same suffix test, so a generic with no more
       specific sibling anywhere on the platform still survives: "TMS Consultant"
       stays, because "Blue Yonder TMS Functional Consultant" is a different job
       rather than the same one with a prefix. */
    const flat = [...new Set(cov.modules.flatMap((m) => m.roles))];
    const flatLower = flat.map((r) => r.toLowerCase());
    cov.roles = flat
      .filter(
        (r, i) =>
          !flatLower.some(
            (other, j) => j !== i && other.endsWith(` ${flatLower[i]}`),
          ),
      )
      .sort();
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

/**
 * One module's page data, or null where the module has no page.
 *
 * A module earns a page only if it is AUTHORED — a derived module is a
 * re-projection of a sector's tool entry, so a page for it would restate the
 * sector page it came from at a shallower depth. `slug` is the test.
 */
export function getPlatformModule(
  platformSlug: string,
  moduleSlug: string,
): { platform: PlatformCoverage; module: PlatformModule } | null {
  const platform = getPlatformCoverage(platformSlug);
  if (!platform) return null;
  const module = platform.modules.find((m) => m.slug === moduleSlug);
  return module ? { platform, module } : null;
}

/** Every platform/module pair with a page, for generateStaticParams. */
export function publishedModuleParams(): Array<{
  platform: string;
  module: string;
}> {
  const out: Array<{ platform: string; module: string }> = [];
  for (const slug of publishedPlatformSlugs()) {
    const cov = getPlatformCoverage(slug);
    if (!cov) continue;
    for (const m of cov.modules) {
      if (m.slug) out.push({ platform: slug, module: m.slug });
    }
  }
  return out;
}
