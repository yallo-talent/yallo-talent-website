export interface SEOMeta {
  title: string;
  description: string;
  ogImage?: string;
  canonical?: string;
  keywords?: string[];
}

export interface VendorCard {
  slug: string;
  name: string;
  vendorName: string;
  vendorLogo: string;
  contractorRoles: string[];
  benchNote: string;
}

export interface FunctionCategory {
  slug: string;
  title: string;
  sidebarTitle: string;
  intro: string;
  contractorRoles: string[];
  vendors: VendorCard[];
  seo: SEOMeta;
}

export interface IndustrySector {
  slug: string;
  title: string;
  heroImage: string;
  intro: string;
  functions: FunctionCategory[];
  seo: SEOMeta;
}

export interface PlatformModule {
  slug: string;
  title: string;
  intro: string;
  contractorRoles: string[];
  seo: SEOMeta;
}

export interface PlatformPage {
  slug: string;
  title: string;
  vendorLogo: string;
  heroImage: string;
  intro: string;
  modules: PlatformModule[];
  seo: SEOMeta;
}

export interface CapabilitySub {
  slug: string;
  title: string;
  intro: string;
  contractorRoles: string[];
  seo: SEOMeta;
}

export interface CapabilityPage {
  slug: string;
  title: string;
  heroImage: string;
  intro: string;
  subs: CapabilitySub[];
  seo: SEOMeta;
}

export type Region = "uk" | "me" | "india";

export type EngagementType =
  | "contract"
  | "permanent"
  | "eor"
  | "managed-delivery";
