type IconKey =
  | "contract"
  | "permanent"
  | "eor"
  | "managed"
  | "retail"
  | "finance"
  | "manufacturing"
  | "healthcare"
  | "government"
  | "telco"
  | "sap"
  | "oracle"
  | "microsoft"
  | "salesforce"
  | "blue-yonder"
  | "workday"
  | "capabilities"
  | "insights"
  | "cases"
  | "about"
  | "why"
  | "leadership"
  | "dataAi"
  | "devops"
  | "cloud"
  | "security"
  | "integration"
  | "emerging"
  | "uploadCv"
  | "manageAccount"
  | "jobSearch";

export interface NavItem {
  label: string;
  href: string;
  description?: string;
  icon?: IconKey;
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
          { label: "SAP", href: "/platforms/sap", icon: "sap" },
          { label: "Oracle", href: "/platforms/oracle", icon: "oracle" },
          {
            label: "Microsoft",
            href: "/platforms/microsoft",
            icon: "microsoft",
          },
          {
            label: "Salesforce",
            href: "/platforms/salesforce",
            icon: "salesforce",
          },
          {
            label: "Blue Yonder",
            href: "/platforms/blue-yonder",
            icon: "blue-yonder",
          },
          {
            label: "Workday",
            href: "/platforms/workday",
            icon: "workday",
          },
        ],
      },
      {
        heading: "Disciplines",
        items: [
          {
            label: "AI talent",
            href: "/ai-talent",
            icon: "dataAi",
          },
          {
            label: "Data & Analytics",
            href: "/capabilities/data-analytics",
            icon: "dataAi",
            published: false,
          },
          {
            label: "Cloud & Infrastructure",
            href: "/capabilities/cloud-infrastructure",
            icon: "cloud",
            published: false,
          },
          {
            label: "Cybersecurity",
            href: "/capabilities/cybersecurity",
            icon: "security",
            published: false,
          },
          {
            label: "Integration & Middleware",
            href: "/capabilities/integration-middleware",
            icon: "integration",
            published: false,
          },
          {
            label: "DevOps & Platform Engineering",
            href: "/capabilities/devops-platform-engineering",
            icon: "devops",
            published: false,
          },
          {
            label: "Testing & Quality Engineering",
            href: "/capabilities/testing-quality-engineering",
            icon: "emerging",
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
            icon: "retail",
          },
          {
            label: "Manufacturing & Logistics",
            href: "/industries/manufacturing",
            icon: "manufacturing",
          },
          {
            label: "Banking & Financial Services",
            href: "/industries/finance",
            icon: "finance",
          },
          {
            label: "Government & Public Sector",
            href: "/industries/government",
            icon: "government",
          },
          {
            label: "Healthcare & Life Science",
            href: "/industries/healthcare",
            icon: "healthcare",
          },
          {
            label: "Telco & Media",
            href: "/industries/telco",
            icon: "telco",
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
            description: "72-hour shortlists · architect-screened",
            icon: "contract",
          },
          {
            label: "Permanent",
            href: "/permanent",
            description: "Long-term fit, architect-vetted",
            icon: "permanent",
          },
          {
            label: "Employer of Record",
            href: "/eor",
            description: "UAE visa + India payroll cover",
            icon: "eor",
          },
          {
            label: "Managed Delivery",
            href: "/managed-delivery",
            description: "Scope-defined, outcome-owned",
            icon: "managed",
          },
        ],
      },
    ],
    featured: {
      eyebrow: "Ready to hire?",
      title: "Shortlist in 72 hours.",
      copy: "Send a brief and we'll return an architect-screened list.",
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
            icon: "cases",
          },
          {
            label: "Clients",
            href: "/about#clients",
            description: "Who we've delivered for",
            icon: "about",
          },
          {
            label: "The team who screen",
            href: "/leadership",
            description: "Architects behind every shortlist",
            icon: "leadership",
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
            icon: "insights",
          },
          {
            label: "Programme Staffing Blueprint",
            href: "/intelligence",
            description: "The full staffing framework",
            icon: "capabilities",
            published: false,
          },
          {
            label: "AI Talent Atlas",
            href: "/ai-talent",
            description: "AI roles, scarcity and comp windows",
            icon: "dataAi",
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
