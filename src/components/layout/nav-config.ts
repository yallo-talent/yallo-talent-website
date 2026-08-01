export interface NavItem {
  label: string;
  href: string;
  description?: string;
  external?: boolean;
  /**
   * When false the label is rendered as non-interactive text (aria-disabled)
   * rather than a link. Use for nav targets whose route does not yet exist.
   */
  published?: boolean;
}

export interface NavColumn {
  heading: string;
  items: NavItem[];
}

export interface NavFeatured {
  eyebrow: string;
  title: string;
  copy: string;
  href: string;
  ctaLabel: string;
  /**
   * When false the card renders as a non-interactive tile rather than a
   * link — used where the target route has not shipped yet.
   */
  published?: boolean;
}

export interface NavGroup {
  label: string;
  description?: string;
  columns: NavColumn[];
  featured?: NavFeatured;
}

export const primaryNav: NavGroup[] = [
  {
    label: "Specialisms",
    description: "Platforms, capabilities and industries",
    columns: [
      {
        heading: "Platforms",
        items: [
          { label: "SAP", href: "/platforms/sap" },
          { label: "Oracle", href: "/platforms/oracle" },
          {
            label: "Microsoft",
            href: "/platforms/microsoft",
          },
          {
            label: "Salesforce",
            href: "/platforms/salesforce",
          },
          {
            label: "Blue Yonder",
            href: "/platforms/blue-yonder",
          },
          {
            label: "Workday",
            href: "/platforms/workday",
          },
          {
            /* 7th platform, and LAST in the order everywhere the order is
               expressed (R-INF2): a real desk, not a co-equal of the ERP
               suites. The route now exists with nine authored desks, so the
               published flag is gone and this is a link again. */
            label: "Informatica",
            href: "/platforms/informatica",
          },
        ],
      },
      {
        heading: "Capabilities",
        items: [
          {
            label: "Artificial Intelligence",
            href: "/ai-talent",
          },
          {
            label: "Data & Analytics",
            href: "/capabilities/data-analytics",
          },
          {
            label: "Cloud & Infrastructure",
            href: "/capabilities/cloud-infrastructure",
          },
          {
            label: "Cybersecurity",
            href: "/capabilities/cybersecurity",
            published: false,
          },
          {
            label: "Integration & Middleware",
            href: "/capabilities/integration-middleware",
            published: false,
          },
          {
            label: "DevOps & Platform Engineering",
            href: "/capabilities/devops-platform-engineering",
            published: false,
          },
          {
            label: "Testing & Quality Engineering",
            href: "/capabilities/testing-quality-engineering",
            published: false,
          },
        ],
      },
      /* Industries merged in as the third column, canon §4 (ratified 30 Jul):
         Specialisms and Industries are ONE item. Two top-level entries made the
         reader hold the taxonomy model in their head to guess which axis a
         sector lived on; the axes are siblings, so they belong side by side.
         The retired Industries group's featured card pointed at an insight that
         is now unpublished, so the merge also removes a would-be dead link. */
      {
        heading: "Industries",
        items: [
          {
            label: "Retail & Consumer",
            href: "/industries/retail",
          },
          {
            label: "Manufacturing & Logistics",
            href: "/industries/manufacturing",
          },
          {
            label: "Banking & Financial Services",
            href: "/industries/finance",
          },
          {
            label: "Government & Public Sector",
            href: "/industries/government",
          },
          {
            label: "Healthcare & Life Science",
            href: "/industries/healthcare",
          },
          {
            label: "Telco & Media",
            href: "/industries/telco",
          },
          {
            /* 7th industry, behind the Yallo AI Academy push into education.
               No route yet. */
            label: "Education & Universities",
            href: "/industries/education",
            published: false,
          },
        ],
      },
    ],
    featured: {
      eyebrow: "Named specialism",
      title: "AI talent, on demand",
      copy: "Applied AI engineers, prompt architects and data scientists — screened for delivery, not certifications.",
      href: "/ai-talent",
      ctaLabel: "Explore AI talent →",
    },
  },
  {
    label: "How we work",
    columns: [
      {
        heading: "Engagement",
        items: [
          {
            label: "Contract",
            href: "/contract",
            description: "72-hour shortlists · specialist-screened",
          },
          {
            label: "Permanent",
            href: "/permanent",
            description: "Permanent hires, screened by specialists",
          },
          {
            label: "Employer of Record",
            href: "/eor",
            description: "UAE visa + India payroll cover",
          },
          {
            label: "Managed Delivery",
            href: "/managed-delivery",
            description: "A scoped workstream, delivered by our pod",
          },
        ],
      },
    ],
    featured: {
      eyebrow: "Ready to hire?",
      title: "Shortlist in 72 hours.",
      copy: "Send a brief and we'll return an specialist-screened list.",
      href: "/brief",
      ctaLabel: "Send a brief →",
    },
  },
  {
    label: "Evidence",
    columns: [
      {
        heading: "Explore",
        items: [
          {
            label: "Case studies",
            href: "/case-studies",
            description: "Programmes we've helped staff",
          },
          {
            label: "Clients",
            href: "/about#clients",
            description: "Who we've delivered for",
          },
          {
            label: "The specialists who screen",
            href: "/leadership",
            description: "The six desks that screen your shortlist",
          },
        ],
      },
    ],
    featured: {
      eyebrow: "Featured case",
      title: "S/4HANA for Al Tayer Group",
      copy: "Wipro was appointed strategic system integrator and came to us for the SAP specialists.",
      href: "/case-studies/enabling-sap-s-4hana-transformation-for-al-tayer-group",
      ctaLabel: "Read the case study →",
    },
  },
  {
    label: "Intelligence",
    columns: [
      {
        heading: "Explore",
        items: [
          {
            label: "Insights",
            href: "/insights",
            description: "Articles, research and analysis",
          },
          {
            /* Now built, and pointed at the asset rather than at the hub. The
               href was /intelligence, which is the column's own destination and
               not this item's. */
            label: "Programme Staffing Blueprint",
            href: "/intelligence/programme-staffing-blueprint",
            description: "Streams, phases and the roles scoped too late",
          },
          {
            /* Relabelled, and the description was the reason. "AI Talent Atlas
               — AI roles, scarcity and comp windows" promised two things the
               page is forbidden to publish: R-AI3 bans a scarcity figure and a
               rate outright. A nav description is a claim like any other, and
               this one could never have been met by the page behind it. */
            label: "AI talent",
            href: "/ai-talent",
            description: "Nine role families, and the stacks we screen against",
          },
        ],
      },
    ],
    featured: {
      eyebrow: "Latest research",
      title: "Talent research briefings",
      copy: "Compensation windows, availability signals and hiring notes across the Middle East, Europe and India.",
      href: "/insights",
      ctaLabel: "Read the briefings →",
    },
  },
];

export const jobSeekersHref = "/jobs";
export const primaryCTAHref = "/brief";
