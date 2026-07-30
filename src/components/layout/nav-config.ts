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
    description: "What we can find for you",
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
        ],
      },
      {
        heading: "Disciplines",
        items: [
          {
            label: "AI talent",
            href: "/ai-talent",
          },
          {
            label: "Data & Analytics",
            href: "/capabilities/data-analytics",
            published: false,
          },
          {
            label: "Cloud & Infrastructure",
            href: "/capabilities/cloud-infrastructure",
            published: false,
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
            description: "Long-term fit, specialist-vetted",
          },
          {
            label: "Employer of Record",
            href: "/eor",
            description: "UAE visa + India payroll cover",
          },
          {
            label: "Managed Delivery",
            href: "/managed-delivery",
            description: "Scope-defined, outcome-owned",
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
            label: "The team who screen",
            href: "/leadership",
            description: "Specialists behind every shortlist",
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
            label: "Programme Staffing Blueprint",
            href: "/intelligence",
            description: "The full staffing framework",
            published: false,
          },
          {
            label: "AI Talent Atlas",
            href: "/ai-talent",
            description: "AI roles, scarcity and comp windows",
            published: false,
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
