import { educationData } from "./education";
import { financeData } from "./finance";
import { governmentData } from "./government";
import { healthcareData } from "./healthcare";
import { manufacturingData } from "./manufacturing";
import { retailData } from "./retail";
import { telcoData } from "./telco";
import type { L1PageData } from "./types";

/**
 * The seven sectors, as one registry.
 *
 * Previously declared inline inside the L2 route file, which meant the platform
 * derivation would have needed a second copy — and two registries is how the
 * sitemap ended up omitting every deep page in the first place.
 *
 * All seven are listed. Route generation is gated on data presence at the point
 * of use, not by omission here: `expertiseWithTools` is the honest filter, so
 * adding `tools` to a sector automatically lights up its L2 and platform
 * coverage without anyone remembering to edit a registry.
 *
 * ORDER IS THE CANONICAL SECTOR ORDER, not insertion order, and that is now
 * load-bearing rather than tidy: the "where we deploy" rail and every other
 * surface that enumerates sectors derives its order from the index, and this
 * registry is iterated in `platforms/derive.ts` to build each platform's sector
 * list. Two orders in one taxonomy is the fault that produced the rail defect in
 * the first place. See `industriesIndex` in ./index.ts for the ruling.
 */
export const sectorRegistry: Record<string, L1PageData> = {
  retail: retailData,
  manufacturing: manufacturingData,
  finance: financeData,
  government: governmentData,
  healthcare: healthcareData,
  telco: telcoData,
  education: educationData,
};

/** Expertise cards that carry real vendor/module data, so a page can be built. */
export function expertiseWithTools(sector: L1PageData) {
  return sector.expertise.filter((fn) => (fn.tools?.length ?? 0) > 0);
}

/** Sectors that have at least one function with module data. */
export function sectorsWithTools(): Array<[string, L1PageData]> {
  return Object.entries(sectorRegistry).filter(
    ([, data]) => expertiseWithTools(data).length > 0,
  );
}
