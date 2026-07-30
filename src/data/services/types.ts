import type { ReactNode } from "react";

export type ServiceHue =
  | "orange"
  | "blue"
  | "teal"
  | "violet"
  | "rose"
  | "green";

export interface ServiceBenefit {
  title: string;
  copy: string;
  icon: ReactNode;
}

export interface ServiceStep {
  title: string;
  copy: string;
  tag?: string;
}

export interface ServiceFaq {
  q: string;
  a: string;
}

export interface ServiceCta {
  label: string;
  href: string;
}

export interface ServicePageData {
  slug: string;
  hue: ServiceHue;
  eyebrow: string;
  title: string;
  emphasis: string;
  lede: string;
  heroStat: { n: string; l: string };
  primaryCta: ServiceCta;
  secondaryCta: ServiceCta;
  trustLine: string;
  benefitsHeading: string;
  benefits: ServiceBenefit[];
  processHeading: string;
  processLede: string;
  process: ServiceStep[];
  rolesHeading: string;
  roles: string[];
  faqHeading: string;
  faqs: ServiceFaq[];
  seo: {
    title: string;
    description: string;
  };
}
