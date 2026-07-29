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
          { label: "Workday", href: "/platforms/workday", icon: "workday" },
          { label: "ServiceNow", href: "/platforms/servicenow" },
        ],
      },
      {
        heading: "Disciplines",
        items: [
          {
            label: "Data & AI",
            href: "/capabilities/data-ai",
            icon: "dataAi",
          },
          {
            label: "Digital & DevOps",
            href: "/capabilities/digital-devops",
            icon: "devops",
          },
          {
            label: "Cloud & Infrastructure",
            href: "/capabilities/cloud-infrastructure",
            icon: "cloud",
          },
          {
            label: "Cybersecurity",
            href: "/capabilities/cybersecurity",
            icon: "security",
          },
          {
            label: "Integration & Middleware",
            href: "/capabilities/integration-middleware",
            icon: "integration",
          },
          {
            label: "Emerging Technologies",
            href: "/capabilities/emerging-technologies",
            icon: "emerging",
          },
        ],
      },
      {
        heading: "Roles",
        items: [
          {
            label: "AI talent",
            href: "/ai-talent",
            icon: "dataAi",
            published: false,
          },
        ],
      },
    ],
    featured: {
      eyebrow: "New capability",
      title: "AI talent, on demand",
      copy: "Applied AI engineers, prompt architects and data scientists — screened for delivery, not certifications.",
      href: "/ai-talent",
      ctaLabel: "Explore AI talent →",
    },
  },
  {
    label: "Industries",
    columns: [
      {
        heading: "Sectors",
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
      eyebrow: "New research",
      title: "SAP talent in the Middle East",
      copy: "What the market tells us about compensation and availability.",
      href: "/insights/sap-talent-middle-east",
      ctaLabel: "Coming soon",
      published: false,
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
      title: "72 hours, 3 SAP hires",
      copy: "A GCC bank moved two candidates to offer within a week.",
      href: "/case-studies/gcc-bank-sap-72h",
      ctaLabel: "Read the story →",
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
            description: "AI role landscape and comp windows",
            icon: "dataAi",
            published: false,
          },
        ],
      },
    ],
    featured: {
      eyebrow: "Latest research",
      title: "Talent research briefings",
      copy: "Compensation windows, availability signals and hiring notes across UK, ME and India.",
      href: "/insights",
      ctaLabel: "Read the briefings →",
    },
  },
];

export const jobSeekersHref = "/jobs";
export const primaryCTAHref = "/brief";
