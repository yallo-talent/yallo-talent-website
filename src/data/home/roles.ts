/**
 * Eight role families, from the pitch-deck role wheel — rendered as an
 * accessible grid rather than a radial.
 *
 * Deliberately carries no platform or sector axis: those live in WherePlace, so
 * the discipline axis is absent there and present only here.
 */

export type RoleIcon =
  | "arch"
  | "app"
  | "dev"
  | "data"
  | "cloud"
  | "test"
  | "biz"
  | "prod";

export interface RoleFamily {
  icon: RoleIcon;
  name: string;
  /** Short qualifier shown under the family name. */
  note: string;
  roles: string[];
}

export const roleFamilies: RoleFamily[] = [
  {
    icon: "arch",
    name: "Architects",
    note: "Seven disciplines",
    roles: [
      "Enterprise Architect",
      "Solution Architect",
      "Data Architect",
      "Digital Architect",
      "Cloud Architect",
      "Security Architect",
      "Functional Architect",
    ],
  },
  {
    icon: "app",
    name: "Application Consultants",
    note: "Functional and technical",
    roles: [
      "Functional Consultant",
      "Technical Consultant",
      "Techno-Functional Consultant",
      "Module Lead",
      "Rollout Consultant",
      "Configuration Specialist",
    ],
  },
  {
    icon: "dev",
    name: "Developers",
    note: "Full stack and platform",
    roles: [
      "Frontend Developer",
      "Backend Developer",
      "Full-stack Developer",
      "Mobile Developer",
      "Integration Developer",
      "RPA Developer",
      "Extension Developer",
    ],
  },
  {
    icon: "data",
    name: "Data specialists",
    note: "Pipeline to insight",
    roles: [
      "Data Engineer",
      "Data Scientist",
      "Data Analyst",
      "BI Developer",
      "Data Steward",
      "Data Migration Lead",
      "Analytics Lead",
    ],
  },
  {
    icon: "cloud",
    name: "Cloud and platform",
    note: "Run and reliability",
    roles: [
      "Cloud Engineer",
      "Site Reliability Engineer",
      "Platform Engineer",
      "DevOps Engineer",
      "IAM Engineer",
      "Network Engineer",
      "Security Engineer",
    ],
  },
  {
    icon: "test",
    name: "Test and quality",
    note: "The under-scoped ones",
    roles: [
      "Test Lead",
      "Test Manager",
      "Automation Engineer",
      "Functional Tester",
      "Performance Tester",
      "UAT Coordinator",
    ],
  },
  {
    icon: "biz",
    name: "Business and functional",
    note: "Where the process lives",
    roles: [
      "Programme Manager",
      "Project Manager",
      "Business Analyst",
      "Supply Chain Lead",
      "Finance Functional Lead",
      "HR Functional Lead",
      "Change and Adoption Lead",
    ],
  },
  {
    icon: "prod",
    name: "Product and agile",
    note: "Delivery cadence",
    roles: [
      "Product Owner",
      "Product Manager",
      "Scrum Master",
      "Agile Coach",
      "Release Manager",
      "Delivery Lead",
    ],
  },
];

export const rolesCopy = {
  eyebrow: "Role coverage",
  heading: "Every seat on the programme, not just the easy ones.",
  lede: "Eight role families. Select one to see what sits inside it.",
} as const;
