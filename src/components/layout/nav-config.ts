export interface NavItem {
  label: string;
  href: string;
  description?: string;
}

export interface NavGroup {
  label: string;
  columns: { heading: string; items: NavItem[] }[];
}

export const primaryNav: NavGroup[] = [
  {
    label: "What we do",
    columns: [
      {
        heading: "Engagement models",
        items: [
          {
            label: "Contract Workforce",
            href: "/contract",
            description: "72-hour shortlists · architect-screened",
          },
          {
            label: "Permanent Hiring",
            href: "/permanent",
            description: "Long-term fit, architect-vetted",
          },
          {
            label: "EOR",
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
  },
  {
    label: "How we serve",
    columns: [
      {
        heading: "Industries",
        items: [
          { label: "Retail & Consumer", href: "/industries/retail" },
          { label: "Financial Services", href: "/industries/finance" },
          { label: "Manufacturing", href: "/industries/manufacturing" },
          { label: "Healthcare", href: "/industries/healthcare" },
          { label: "Government", href: "/industries/government" },
          { label: "Telco", href: "/industries/telco" },
        ],
      },
      {
        heading: "Platforms",
        items: [
          { label: "SAP", href: "/platforms/sap" },
          { label: "Oracle", href: "/platforms/oracle" },
          { label: "Microsoft", href: "/platforms/microsoft" },
          { label: "Salesforce", href: "/platforms/salesforce" },
          { label: "Blue Yonder", href: "/platforms/blueyonder" },
          { label: "Workday", href: "/platforms/workday" },
        ],
      },
      {
        heading: "Capabilities",
        items: [{ label: "All capabilities", href: "/capabilities" }],
      },
    ],
  },
  {
    label: "Knowledge",
    columns: [
      {
        heading: "Insights",
        items: [
          { label: "Latest insights", href: "/insights" },
          { label: "Case studies", href: "/case-studies" },
        ],
      },
    ],
  },
  {
    label: "About",
    columns: [
      {
        heading: "Yallo Talent",
        items: [
          { label: "About Yallo", href: "/about" },
          { label: "Why Yallo", href: "/why-yallo" },
          { label: "Leadership", href: "/leadership" },
        ],
      },
    ],
  },
];

export const jobSeekersHref = "/jobs";
export const primaryCTAHref = "/brief";
