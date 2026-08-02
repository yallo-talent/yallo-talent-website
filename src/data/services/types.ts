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

export interface ServiceProofItem {
  title: string;
  client: string;
  href: string;
  excerpt: string;
}

export interface ServicePageData {
  slug: string;
  eyebrow: string;
  title: string;
  emphasis: string;
  lede: string;
  heroStat: { n: string; l: string };
  primaryCta: ServiceCta;
  secondaryCta: ServiceCta;
  trustLine: string;
  /**
   * Canon §3 Q1: the buyer role, named. Optional because a page renders
   * without it rather than fall back to placeholder text — omit until the
   * line is written, don't stub it.
   */
  audienceLabel?: string;
  audience?: string[];
  benefitsHeading: string;
  benefits: ServiceBenefit[];
  processHeading: string;
  processLede: string;
  process: ServiceStep[];
  rolesHeading: string;
  roles: string[];
  /**
   * Canon §3 Q6: where this pillar ends and the next begins. Optional for
   * the same reason as audience — an absent boundary is a gap to close, not
   * a section to render empty.
   */
  boundaryHeading?: string;
  boundary?: string;
  /**
   * Canon §3 Q7: real case studies filtered to this pillar, from the
   * existing verified set of ten. Absent where the pillar has none tagged
   * to it — never populated with an unrelated study to fill the section.
   */
  proofHeading?: string;
  proof?: ServiceProofItem[];
  faqHeading: string;
  faqs: ServiceFaq[];
  seo: {
    title: string;
    description: string;
  };
}
