/**
 * GENERATED FILE — DO NOT EDIT.
 *
 * Produced by scripts/build-research-dataset.mjs from
 * docs/lti-reports/lti-combined-2026-08-02.csv.
 * Regenerate with `pnpm research:dataset`; `pnpm check:research-dataset`
 * fails if this file and the extract have drifted apart.
 *
 * Every figure the research family publishes resolves through this module.
 * Nothing downstream types a number.
 */

/** The extract date, ISO. For machine-readable contexts only. */
export const LTI_AS_AT = "2026-08-02";

/** The extract date as prose. Use this anywhere a reader sees it. */
export const LTI_AS_AT_DISPLAY = "2 August 2026";

/** The extract date to the month. The attribution line a reader sees. */
export const LTI_AS_AT_MONTH = "August 2026";

/** How the source is attributed wherever a figure appears. */
export const LTI_SOURCE = "LinkedIn Talent Insights";

export interface ResearchSkill {
  label: string;
  uk: number;
  saudi: number;
  uae: number;
  combined: number;
  /** Share of the family baseline declaring this skill, all three markets. */
  ratioCombined: number;
  ratioUk: number;
  ratioSaudi: number;
  ratioUae: number;
  /** Unweighted mean of the Saudi and UAE ratios. See the generator's note. */
  gulfMean: number;
  /** (Saudi + UAE counts) / (Saudi + UAE baselines). */
  gulfPooled: number;
  /** gulfMean minus the UK ratio, in percentage points. */
  gulfVsUkMean: number;
  gulfVsUkPooled: number;
}

export interface ResearchFamily {
  family: string;
  baseline: { uk: number; saudi: number; uae: number; combined: number };
  /** Share of the family's professionals located in the Gulf. Pooled. */
  gulfShareOfPool: number;
  skills: ResearchSkill[];
}

export const ltiFamilies: ResearchFamily[] = [
  {
    family: "SAP",
    baseline: {
      uk: 4955,
      saudi: 1649,
      uae: 1318,
      combined: 7922,
    },
    gulfShareOfPool: 37.5,
    skills: [
      {
        label: "Data migration",
        uk: 1363,
        saudi: 383,
        uae: 423,
        combined: 2169,
        ratioCombined: 27.38,
        ratioUk: 27.51,
        ratioSaudi: 23.23,
        ratioUae: 32.09,
        gulfMean: 27.66,
        gulfPooled: 27.17,
        gulfVsUkMean: 0.1,
        gulfVsUkPooled: -0.3,
      },
      {
        label: "Security (Security+Auth+GRC)",
        uk: 546,
        saudi: 185,
        uae: 138,
        combined: 869,
        ratioCombined: 10.97,
        ratioUk: 11.02,
        ratioSaudi: 11.22,
        ratioUae: 10.47,
        gulfMean: 10.85,
        gulfPooled: 10.89,
        gulfVsUkMean: -0.2,
        gulfVsUkPooled: -0.1,
      },
      {
        label: "Integration (Cloud Platform)",
        uk: 574,
        saudi: 236,
        uae: 229,
        combined: 1039,
        ratioCombined: 13.12,
        ratioUk: 11.58,
        ratioSaudi: 14.31,
        ratioUae: 17.37,
        gulfMean: 15.84,
        gulfPooled: 15.67,
        gulfVsUkMean: 4.3,
        gulfVsUkPooled: 4.1,
      },
    ],
  },
  {
    family: "Oracle",
    baseline: {
      uk: 2816,
      saudi: 1367,
      uae: 964,
      combined: 5147,
    },
    gulfShareOfPool: 45.3,
    skills: [
      {
        label: "Fusion (OFA+HCM)",
        uk: 386,
        saudi: 242,
        uae: 219,
        combined: 847,
        ratioCombined: 16.46,
        ratioUk: 13.71,
        ratioSaudi: 17.7,
        ratioUae: 22.72,
        gulfMean: 20.21,
        gulfPooled: 19.78,
        gulfVsUkMean: 6.5,
        gulfVsUkPooled: 6.1,
      },
      {
        label: "Payroll",
        uk: 46,
        saudi: 29,
        uae: 28,
        combined: 103,
        ratioCombined: 2,
        ratioUk: 1.63,
        ratioSaudi: 2.12,
        ratioUae: 2.9,
        gulfMean: 2.51,
        gulfPooled: 2.45,
        gulfVsUkMean: 0.9,
        gulfVsUkPooled: 0.8,
      },
      {
        label: "Financials",
        uk: 1130,
        saudi: 667,
        uae: 465,
        combined: 2262,
        ratioCombined: 43.95,
        ratioUk: 40.13,
        ratioSaudi: 48.79,
        ratioUae: 48.24,
        gulfMean: 48.52,
        gulfPooled: 48.56,
        gulfVsUkMean: 8.4,
        gulfVsUkPooled: 8.4,
      },
      {
        label: "E-Business Suite",
        uk: 1625,
        saudi: 830,
        uae: 563,
        combined: 3018,
        ratioCombined: 58.64,
        ratioUk: 57.71,
        ratioSaudi: 60.72,
        ratioUae: 58.4,
        gulfMean: 59.56,
        gulfPooled: 59.76,
        gulfVsUkMean: 1.9,
        gulfVsUkPooled: 2,
      },
    ],
  },
  {
    family: "Salesforce",
    baseline: {
      uk: 4326,
      saudi: 65,
      uae: 598,
      combined: 4989,
    },
    gulfShareOfPool: 13.3,
    skills: [
      {
        label: "Marketing Cloud+AMPscript",
        uk: 2600,
        saudi: 18,
        uae: 389,
        combined: 3007,
        ratioCombined: 60.27,
        ratioUk: 60.1,
        ratioSaudi: 27.69,
        ratioUae: 65.05,
        gulfMean: 46.37,
        gulfPooled: 61.39,
        gulfVsUkMean: -13.7,
        gulfVsUkPooled: 1.3,
      },
      {
        label: "DX (release engineering)",
        uk: 108,
        saudi: 1,
        uae: 18,
        combined: 127,
        ratioCombined: 2.55,
        ratioUk: 2.5,
        ratioSaudi: 1.54,
        ratioUae: 3.01,
        gulfMean: 2.28,
        gulfPooled: 2.87,
        gulfVsUkMean: -0.2,
        gulfVsUkPooled: 0.4,
      },
      {
        label: "Data migration",
        uk: 629,
        saudi: 2,
        uae: 99,
        combined: 730,
        ratioCombined: 14.63,
        ratioUk: 14.54,
        ratioSaudi: 3.08,
        ratioUae: 16.56,
        gulfMean: 9.82,
        gulfPooled: 15.23,
        gulfVsUkMean: -4.7,
        gulfVsUkPooled: 0.7,
      },
      {
        label: "Service Cloud",
        uk: 790,
        saudi: 6,
        uae: 113,
        combined: 909,
        ratioCombined: 18.22,
        ratioUk: 18.26,
        ratioSaudi: 9.23,
        ratioUae: 18.9,
        gulfMean: 14.07,
        gulfPooled: 17.95,
        gulfVsUkMean: -4.2,
        gulfVsUkPooled: -0.3,
      },
      {
        label: "Commerce Cloud (SFCC+B2B+B2C)",
        uk: 105,
        saudi: 0,
        uae: 26,
        combined: 131,
        ratioCombined: 2.63,
        ratioUk: 2.43,
        ratioSaudi: 0,
        ratioUae: 4.35,
        gulfMean: 2.17,
        gulfPooled: 3.92,
        gulfVsUkMean: -0.3,
        gulfVsUkPooled: 1.5,
      },
    ],
  },
  {
    family: "Cloud (Cloud+DevOps titles)",
    baseline: {
      uk: 21401,
      saudi: 1479,
      uae: 2382,
      combined: 25262,
    },
    gulfShareOfPool: 15.3,
    skills: [
      {
        label: "AWS",
        uk: 9696,
        saudi: 553,
        uae: 1235,
        combined: 11484,
        ratioCombined: 45.46,
        ratioUk: 45.31,
        ratioSaudi: 37.39,
        ratioUae: 51.85,
        gulfMean: 44.62,
        gulfPooled: 46.31,
        gulfVsUkMean: -0.7,
        gulfVsUkPooled: 1,
      },
      {
        label: "Azure",
        uk: 6639,
        saudi: 353,
        uae: 906,
        combined: 7898,
        ratioCombined: 31.26,
        ratioUk: 31.02,
        ratioSaudi: 23.87,
        ratioUae: 38.04,
        gulfMean: 30.96,
        gulfPooled: 32.61,
        gulfVsUkMean: -0.1,
        gulfVsUkPooled: 1.6,
      },
      {
        label: "GCP",
        uk: 2220,
        saudi: 282,
        uae: 369,
        combined: 2871,
        ratioCombined: 11.36,
        ratioUk: 10.37,
        ratioSaudi: 19.07,
        ratioUae: 15.49,
        gulfMean: 17.28,
        gulfPooled: 16.86,
        gulfVsUkMean: 6.9,
        gulfVsUkPooled: 6.5,
      },
      {
        label: "DevOps (skill)",
        uk: 7145,
        saudi: 486,
        uae: 1047,
        combined: 8678,
        ratioCombined: 34.35,
        ratioUk: 33.39,
        ratioSaudi: 32.86,
        ratioUae: 43.95,
        gulfMean: 38.41,
        gulfPooled: 39.7,
        gulfVsUkMean: 5,
        gulfVsUkPooled: 6.3,
      },
      {
        label: "Azure DevOps Services",
        uk: 10338,
        saudi: 595,
        uae: 1360,
        combined: 12293,
        ratioCombined: 48.66,
        ratioUk: 48.31,
        ratioSaudi: 40.23,
        ratioUae: 57.09,
        gulfMean: 48.66,
        gulfPooled: 50.63,
        gulfVsUkMean: 0.3,
        gulfVsUkPooled: 2.3,
      },
    ],
  },
  {
    family: "Data",
    baseline: {
      uk: 86877,
      saudi: 20062,
      uae: 21874,
      combined: 128813,
    },
    gulfShareOfPool: 32.6,
    skills: [
      {
        label: "AWS",
        uk: 4716,
        saudi: 389,
        uae: 648,
        combined: 5753,
        ratioCombined: 4.47,
        ratioUk: 5.43,
        ratioSaudi: 1.94,
        ratioUae: 2.96,
        gulfMean: 2.45,
        gulfPooled: 2.47,
        gulfVsUkMean: -3,
        gulfVsUkPooled: -3,
      },
      {
        label: "Azure",
        uk: 4109,
        saudi: 265,
        uae: 712,
        combined: 5086,
        ratioCombined: 3.95,
        ratioUk: 4.73,
        ratioSaudi: 1.32,
        ratioUae: 3.26,
        gulfMean: 2.29,
        gulfPooled: 2.33,
        gulfVsUkMean: -2.4,
        gulfVsUkPooled: -2.4,
      },
      {
        label: "GCP",
        uk: 2539,
        saudi: 193,
        uae: 266,
        combined: 2998,
        ratioCombined: 2.33,
        ratioUk: 2.92,
        ratioSaudi: 0.96,
        ratioUae: 1.22,
        gulfMean: 1.09,
        gulfPooled: 1.09,
        gulfVsUkMean: -1.8,
        gulfVsUkPooled: -1.8,
      },
      {
        label: "Databricks",
        uk: 3901,
        saudi: 153,
        uae: 598,
        combined: 4652,
        ratioCombined: 3.61,
        ratioUk: 4.49,
        ratioSaudi: 0.76,
        ratioUae: 2.73,
        gulfMean: 1.75,
        gulfPooled: 1.79,
        gulfVsUkMean: -2.7,
        gulfVsUkPooled: -2.7,
      },
      {
        label: "Snowflake",
        uk: 3424,
        saudi: 209,
        uae: 523,
        combined: 4156,
        ratioCombined: 3.23,
        ratioUk: 3.94,
        ratioSaudi: 1.04,
        ratioUae: 2.39,
        gulfMean: 1.72,
        gulfPooled: 1.75,
        gulfVsUkMean: -2.2,
        gulfVsUkPooled: -2.2,
      },
    ],
  },
  {
    family: "AI/ML",
    baseline: {
      uk: 17190,
      saudi: 2192,
      uae: 3471,
      combined: 22853,
    },
    gulfShareOfPool: 24.8,
    skills: [
      {
        label: "Amazon Bedrock",
        uk: 130,
        saudi: 10,
        uae: 38,
        combined: 178,
        ratioCombined: 0.78,
        ratioUk: 0.76,
        ratioSaudi: 0.46,
        ratioUae: 1.09,
        gulfMean: 0.78,
        gulfPooled: 0.85,
        gulfVsUkMean: 0,
        gulfVsUkPooled: 0.1,
      },
      {
        label: "Vertex AI",
        uk: 154,
        saudi: 19,
        uae: 33,
        combined: 206,
        ratioCombined: 0.9,
        ratioUk: 0.9,
        ratioSaudi: 0.87,
        ratioUae: 0.95,
        gulfMean: 0.91,
        gulfPooled: 0.92,
        gulfVsUkMean: 0,
        gulfVsUkPooled: 0,
      },
      {
        label: "Azure AI Foundry",
        uk: 132,
        saudi: 6,
        uae: 51,
        combined: 189,
        ratioCombined: 0.83,
        ratioUk: 0.77,
        ratioSaudi: 0.27,
        ratioUae: 1.47,
        gulfMean: 0.87,
        gulfPooled: 1.01,
        gulfVsUkMean: 0.1,
        gulfVsUkPooled: 0.2,
      },
    ],
  },
];

/** Lookup by the extract's own family name. */
export function ltiFamily(name: string): ResearchFamily {
  const found = ltiFamilies.find((f) => f.family === name);
  if (!found) throw new Error(`No LTI family named ${name}`);
  return found;
}

/** A named skill inside a family, by the extract's own label. */
export function ltiSkill(family: string, label: string): ResearchSkill {
  const found = ltiFamily(family).skills.find((s) => s.label === label);
  if (!found) throw new Error(`No skill ${label} in ${family}`);
  return found;
}

/**
 * Derived superlatives. A page that wants to say "the highest" asks for it
 * rather than asserting it: the drafted conclusion called Azure DevOps
 * Services at 48.7% "the highest ratio in the dataset" when Salesforce
 * Marketing Cloud+AMPscript is 60.27%.
 */
export const ltiHighestRatio = {
  family: "Salesforce",
  label: "Marketing Cloud+AMPscript",
  ratio: 60.27,
};

/** The smallest named skill anywhere in the extract, by combined headcount. */
export const ltiSmallestNamedSkill = {
  family: "Oracle",
  label: "Payroll",
  combined: 103,
};
