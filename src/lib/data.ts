import type {
  CapabilityPage,
  FunctionCategory,
  IndustrySector,
  PlatformPage,
} from "@/types";

const sectorRegistry: Record<string, IndustrySector> = {};
const platformRegistry: Record<string, PlatformPage> = {};
const capabilityRegistry: Record<string, CapabilityPage> = {};

export function getAllSectors(): IndustrySector[] {
  return Object.values(sectorRegistry);
}

export function getSector(slug: string): IndustrySector | undefined {
  return sectorRegistry[slug];
}

export function getFunctions(sectorSlug: string): FunctionCategory[] {
  return sectorRegistry[sectorSlug]?.functions ?? [];
}

export function getFunction(
  sectorSlug: string,
  fnSlug: string,
): FunctionCategory | undefined {
  return sectorRegistry[sectorSlug]?.functions.find((f) => f.slug === fnSlug);
}

export function getAllPlatforms(): PlatformPage[] {
  return Object.values(platformRegistry);
}

export function getPlatform(slug: string): PlatformPage | undefined {
  return platformRegistry[slug];
}

export function getAllCapabilities(): CapabilityPage[] {
  return Object.values(capabilityRegistry);
}

export function getCapability(slug: string): CapabilityPage | undefined {
  return capabilityRegistry[slug];
}
