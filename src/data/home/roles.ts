/**
 * Eight role families — the ratified platform-specific set from Chat Relay
 * v2.0 §3.4, replacing lists any agency in any market could publish. Canon §3:
 * this file is the truth for role families.
 *
 * Every family carries ten to twelve entries so the block renders two stable
 * rows and the panel height never changes between selections. Notes are
 * qualifiers, not counts.
 *
 * Deliberately carries no sector axis: that lives in WherePlace, so the
 * discipline axis is absent there and present only here.
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
    note: "Where the screen starts",
    roles: [
      "Enterprise Architect",
      "Solution Architect",
      "Integration Architect",
      "Data Architect",
      "Cloud Architect",
      "Security Architect",
      "Functional Architect",
      "SAP S/4HANA Architect",
      "Oracle Fusion Architect",
      "Azure Solution Architect",
      "Salesforce Technical Architect",
      "Technical Architect",
    ],
  },
  {
    icon: "app",
    name: "Functional consultants",
    note: "Module-deep, not tool-aware",
    roles: [
      "SAP FI/CO Consultant",
      "SAP MM/SD Consultant",
      "SAP SuccessFactors Consultant",
      "Oracle Fusion Financials Consultant",
      "Oracle SCM Consultant",
      "D365 Finance & Operations Consultant",
      "D365 Customer Engagement Consultant",
      "Salesforce Service Cloud Consultant",
      "Blue Yonder WMS Consultant",
      "Workday HCM Consultant",
      "Techno-Functional Consultant",
      "Rollout and Localisation Consultant",
    ],
  },
  {
    icon: "dev",
    name: "Developers and engineers",
    note: "Build, extend, integrate",
    roles: [
      "ABAP Developer",
      "SAP CPI Integration Developer",
      "Oracle PL/SQL Developer",
      "Oracle Integration Cloud Developer",
      ".NET Developer",
      "Power Platform Developer",
      "Salesforce Apex Developer",
      "Frontend Engineer",
      "Backend Engineer",
      "Mobile Engineer",
      "RPA Developer",
      "API and Middleware Engineer",
    ],
  },
  {
    icon: "data",
    name: "Data and analytics",
    note: "Migration through to reporting",
    roles: [
      "Data Architect",
      "Data Engineer",
      "Azure Data Engineer",
      "Databricks Engineer",
      "ETL Developer",
      "Data Migration Lead",
      "Power BI Developer",
      "SAP Analytics Cloud Consultant",
      "Data Scientist",
      "Master Data Manager",
      "Reporting Analyst",
      "Analytics Lead",
    ],
  },
  {
    icon: "cloud",
    name: "Cloud, platform and security",
    note: "Runs after go-live",
    roles: [
      "Azure Cloud Engineer",
      "AWS Cloud Engineer",
      "Platform Engineer",
      "DevOps Engineer",
      "Site Reliability Engineer",
      "Kubernetes Engineer",
      "Network Engineer",
      "IAM Engineer",
      "Cloud Security Engineer",
      "GRC and Compliance Specialist",
      "SAP Basis Administrator",
      "Database Administrator",
    ],
  },
  {
    icon: "test",
    name: "Test and quality",
    note: "The seats cut first, missed most",
    roles: [
      "Test Manager",
      "Test Lead",
      "Functional Test Analyst",
      "Automation Engineer",
      "Performance Test Engineer",
      "SAP Test Lead",
      "Integration Test Analyst",
      "Data Migration Test Analyst",
      "UAT Coordinator",
      "Defect Manager",
      "Cutover Test Lead",
      "Quality Engineer",
    ],
  },
  {
    icon: "biz",
    name: "Programme and business",
    note: "Who runs it",
    roles: [
      "Programme Director",
      "Programme Manager",
      "Project Manager",
      "PMO Lead",
      "Business Analyst",
      "Process Lead",
      "Supply Chain Lead",
      "Finance Transformation Lead",
      "HR Transformation Lead",
      "Ecommerce Manager",
      "Change and Adoption Lead",
      "Training Lead",
    ],
  },
  {
    icon: "prod",
    name: "Product and delivery",
    note: "Release and hypercare",
    roles: [
      "Product Owner",
      "Product Manager",
      "Scrum Master",
      "Agile Coach",
      "Delivery Lead",
      "Release Manager",
      "Cutover Manager",
      "Hypercare Lead",
      "Service Delivery Manager",
      "Vendor Manager",
      "Incident Manager",
      "Transition Manager",
    ],
  },
];

export const rolesCopy = {
  eyebrow: "Role coverage",
  heading: "Every seat on the programme, not just the easy ones.",
  lede: "Architects through to hypercare. If it sits on the programme plan, we staff it.",
} as const;
