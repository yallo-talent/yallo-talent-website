/**
 * Authored platform module sets — the second source of platform truth.
 *
 * The derived source (derive.ts) re-projects sector data onto the platform
 * axis and can only say what a sector page already says. This file holds the
 * module sets Sumeet ratified directly (Relay v2.1 rev 2 §5 and §5b, canon §3):
 * platform-level desks with scope lines, sourced from the legacy site's
 * platform areas and his confirmation of the workloads his desks staff.
 *
 * Scope lines follow the content rule: what Yallo places, never what the
 * platform does. The legacy outcome figures ("cut downtime by 40%", "90%
 * payroll errors") do NOT port — delivery outcomes without a client or record
 * attached fail the sourced-figures rule.
 */

export interface AuthoredModule {
  /** The product as published. */
  name: string;
  /** What Yallo places on it — one line, Talent-speak. */
  scope: string;
  /** Contractor roles Yallo places on this module. */
  roles: string[];
}

export interface AuthoredPlatform {
  slug: string;
  name: string;
  /** Ratification provenance, kept with the data. */
  ratified: string;
  modules: AuthoredModule[];
}

export const authoredPlatforms: Record<string, AuthoredPlatform> = {
  microsoft: {
    slug: "microsoft",
    name: "Microsoft",
    ratified: "Relay v2.1 rev 2 §5, ratified by Sumeet Goenka 30 Jul 2026",
    modules: [
      {
        name: "Azure Data & AI",
        scope:
          "Data platforms on Fabric, Synapse, Databricks and Power BI, from migration to reporting",
        roles: [
          "Azure Data Engineer",
          "Databricks Engineer",
          "Data Architect",
          "Power BI Developer",
          "Data Migration Lead",
          "Azure AI Engineer",
        ],
      },
      {
        name: "Azure Infrastructure",
        scope: "Landing zones, migrations and hybrid estates, built and run",
        roles: [
          "Azure Solution Architect",
          "Azure Cloud Engineer",
          "Platform Engineer",
          "Network Engineer",
          "Cloud Migration Lead",
        ],
      },
      {
        name: "Azure Security",
        scope: "Identity, access and compliance across the Azure estate",
        roles: [
          "Security Architect",
          "Cloud Security Engineer",
          "IAM Engineer",
          "GRC and Compliance Specialist",
        ],
      },
      {
        name: "Azure DevOps",
        scope: "Pipelines, containers and reliability after go-live",
        roles: [
          "DevOps Engineer",
          "Site Reliability Engineer",
          "Kubernetes Engineer",
          "Release Manager",
          "Automation Engineer",
        ],
      },
      {
        name: "D365 Finance & Operations",
        scope:
          "Finance and supply chain implementations, rollouts and localisations",
        roles: [
          "D365 F&O Functional Consultant",
          "X++ Developer",
          "D365 Technical Architect",
          "Data Migration Lead",
          "Integration Developer",
        ],
      },
      {
        name: "D365 Customer Engagement",
        scope:
          "Sales and Service implementations and the integrations around them",
        roles: [
          "D365 CE Functional Consultant",
          "CRM Solution Architect",
          "Power Platform Developer",
        ],
      },
      {
        name: "D365 Business Central",
        scope: "Mid-market ERP implementations and NAV-to-BC migrations",
        roles: [
          "BC Functional Consultant",
          "AL Developer",
          "Upgrade and Migration Consultant",
        ],
      },
      {
        name: "D365 Human Resources",
        scope: "HR implementations and payroll integrations",
        roles: [
          "D365 HR Functional Consultant",
          "HR Transformation Lead",
          "Integration Developer",
        ],
      },
      {
        name: "Power Platform",
        scope:
          "Apps, automation and governance on the platform the business already owns",
        roles: [
          "Power Platform Solution Architect",
          "Power Apps Developer",
          "Power Automate / RPA Developer",
          "Power BI Developer",
        ],
      },
      {
        name: "Microsoft 365 Copilot",
        scope: "Readiness, data governance and adoption for Copilot rollouts",
        roles: [
          "Information Governance (Purview) Specialist",
          "Adoption and Change Lead",
          "M365 Consultant",
        ],
      },
    ],
  },

  workday: {
    slug: "workday",
    name: "Workday",
    ratified:
      "Relay v2.1 rev 2 §5b, ratified by Sumeet Goenka 30 Jul 2026 (canon §3 amendment log)",
    modules: [
      {
        name: "Workday HCM",
        scope:
          "Core HR implementations, employee lifecycle and the integrations around them",
        roles: [
          "Workday HCM Functional Consultant",
          "Workday HCM Architect",
          "Workday Integration Developer",
          "Data Migration Lead",
        ],
      },
      {
        name: "Workday Payroll",
        scope:
          "Payroll builds, absence and time tracking, multi-country compliance",
        roles: [
          "Workday Payroll Consultant",
          "Absence & Time Consultant",
          "Payroll Integration Specialist",
        ],
      },
      {
        name: "Workday Financial Management",
        scope: "Record-to-report implementations and ERP coexistence",
        roles: [
          "Workday Financials Consultant",
          "Record-to-Report Lead",
          "Financial Data Migration Lead",
        ],
      },
      {
        name: "Workday Adaptive Planning",
        scope: "Budgeting, forecasting and workforce cost models",
        roles: [
          "Adaptive Planning Consultant",
          "FP&A Systems Analyst",
          "Model Builder",
        ],
      },
      {
        name: "Workday Recruiting",
        scope: "Recruiting and onboarding configuration",
        roles: [
          "Workday Recruiting Consultant",
          "Onboarding Configuration Specialist",
        ],
      },
      {
        name: "Workday Talent Management",
        scope: "Performance, career and succession configuration",
        roles: ["Workday Talent & Performance Consultant"],
      },
      {
        name: "Workday Learning",
        scope: "Learning rollouts and adoption",
        roles: ["Workday Learning Consultant", "Adoption and Change Lead"],
      },
      {
        name: "Workday Workforce Planning",
        scope: "Headcount planning, scenario modelling and forecasting",
        roles: ["Workforce Planning Consultant", "HR Data Analyst"],
      },
      {
        name: "Workday Prism Analytics",
        scope: "Reporting and data hub work across HR and finance",
        roles: ["Prism Analytics Consultant", "Workday Reporting Developer"],
      },
      {
        name: "Workday PSA",
        scope: "Resource scheduling, time tracking and project billing",
        roles: ["Workday PSA Consultant", "Resource Management Analyst"],
      },
    ],
  },
};
