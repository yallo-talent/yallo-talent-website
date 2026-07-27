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
  | "blueyonder"
  | "workday"
  | "capabilities"
  | "insights"
  | "cases"
  | "about"
  | "why"
  | "leadership";

export interface NavItem {
  label: string;
  href: string;
  description?: string;
  icon?: IconKey;
  hue?: "blue" | "green" | "orange" | "teal" | "violet" | "rose";
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
  image: string;
  imageAlt: string;
}

export interface NavGroup {
  label: string;
  description?: string;
  columns: NavColumn[];
  featured?: NavFeatured;
}

export const primaryNav: NavGroup[] = [
  {
    label: "What we do",
    description: "Engagement models — how you hold the risk",
    columns: [
      {
        heading: "Engagement models",
        items: [
          {
            label: "Contract Workforce",
            href: "/contract",
            description: "72-hour shortlists · architect-screened",
            icon: "contract",
            hue: "orange",
          },
          {
            label: "Permanent Hiring",
            href: "/permanent",
            description: "Long-term fit, architect-vetted",
            icon: "permanent",
            hue: "blue",
          },
          {
            label: "EOR",
            href: "/eor",
            description: "UAE visa + India payroll cover",
            icon: "eor",
            hue: "teal",
          },
          {
            label: "Managed Delivery",
            href: "/managed-delivery",
            description: "Scope-defined, outcome-owned",
            icon: "managed",
            hue: "violet",
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
      image:
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=80",
      imageAlt: "Enterprise team calibrating a hiring brief",
    },
  },
  {
    label: "How we serve",
    description: "Six sectors, six enterprise platforms",
    columns: [
      {
        heading: "Industries",
        items: [
          {
            label: "Retail & Consumer",
            href: "/industries/retail",
            icon: "retail",
            hue: "orange",
          },
          {
            label: "Financial Services",
            href: "/industries/finance",
            icon: "finance",
            hue: "blue",
          },
          {
            label: "Manufacturing",
            href: "/industries/manufacturing",
            icon: "manufacturing",
            hue: "orange",
          },
          {
            label: "Healthcare",
            href: "/industries/healthcare",
            icon: "healthcare",
            hue: "teal",
          },
          {
            label: "Government",
            href: "/industries/government",
            icon: "government",
            hue: "green",
          },
          {
            label: "Telco",
            href: "/industries/telco",
            icon: "telco",
            hue: "violet",
          },
        ],
      },
      {
        heading: "Platforms",
        items: [
          { label: "SAP", href: "/platforms/sap", icon: "sap", hue: "blue" },
          {
            label: "Oracle",
            href: "/platforms/oracle",
            icon: "oracle",
            hue: "rose",
          },
          {
            label: "Microsoft",
            href: "/platforms/microsoft",
            icon: "microsoft",
            hue: "blue",
          },
          {
            label: "Salesforce",
            href: "/platforms/salesforce",
            icon: "salesforce",
            hue: "teal",
          },
          {
            label: "Blue Yonder",
            href: "/platforms/blueyonder",
            icon: "blueyonder",
            hue: "orange",
          },
          {
            label: "Workday",
            href: "/platforms/workday",
            icon: "workday",
            hue: "violet",
          },
        ],
      },
    ],
    featured: {
      eyebrow: "New research",
      title: "SAP talent in the GCC",
      copy: "What the market tells us about compensation and availability.",
      href: "/insights/sap-talent-gcc",
      ctaLabel: "Read research →",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
      imageAlt: "Analytics dashboard",
    },
  },
  {
    label: "Knowledge",
    description: "Insights, research, case studies",
    columns: [
      {
        heading: "Latest",
        items: [
          {
            label: "Insights",
            href: "/insights",
            description: "Articles, research and analysis",
            icon: "insights",
            hue: "blue",
          },
          {
            label: "Case studies",
            href: "/case-studies",
            description: "Programmes we've helped staff",
            icon: "cases",
            hue: "teal",
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
      image:
        "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=600&q=80",
      imageAlt: "Enterprise leadership meeting",
    },
  },
  {
    label: "About",
    description: "The team behind the shortlist",
    columns: [
      {
        heading: "Yallo Talent",
        items: [
          {
            label: "About Yallo",
            href: "/about",
            description: "The company, the philosophy",
            icon: "about",
            hue: "blue",
          },
          {
            label: "Why Yallo",
            href: "/why-yallo",
            description: "Architect-led, region-deep",
            icon: "why",
            hue: "orange",
          },
          {
            label: "Leadership",
            href: "/leadership",
            description: "Operators from Richemont, Landmark, Alshaya EMEA",
            icon: "leadership",
            hue: "rose",
          },
        ],
      },
    ],
    featured: {
      eyebrow: "Meet the operator",
      title: "Sumeet Goenka",
      copy: "Ex-Richemont, Landmark and Alshaya EMEA operator leading the architect team.",
      href: "/leadership",
      ctaLabel: "Meet the team →",
      image:
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80",
      imageAlt: "Business leader portrait",
    },
  },
];

export const jobSeekersHref = "/jobs";
export const primaryCTAHref = "/brief";
