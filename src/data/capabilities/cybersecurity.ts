import { taxonomyLabels } from "@/data/l1/index";
import type { L1PageData } from "@/data/l1/types";

/**
 * Cybersecurity & Risk, seeded 1 Aug 2026, renamed 2 Aug 2026.
 *
 * The label gained "& Risk" to match the taxonomy's X & Y shape; the slug stays
 * `cybersecurity` because that is the search term and a short slug under a fuller
 * label is already the pattern (`finance` renders "Banking & Financial Services").
 * See src/data/l1/index.ts for the full reasoning.
 *
 * One of four disciplines that carried the canon §3 `PLANNED_CAPABILITIES` state
 * and rendered as an inert "Desk in build" card. Sumeet's ruling is that all four
 * are real desks Yallo staffs today and all four are built to the same depth as
 * Data & Analytics: no hedging language, no coming-soon state, and no thinner
 * treatment for being newer.
 *
 * Sub-desks, role titles and screened stacks come from the ratified content in
 * docs/design/context-capabilities-parity-round.md §4.1. Nothing is invented.
 *
 * THE REGIONAL FRAMEWORKS, and this is the one thing to be careful with. Middle
 * East security programmes are governed by real regional frameworks, and naming
 * the ones a role is screened against is both legitimate and a genuine advantage
 * over a firm staffing from outside the region. What this file must never do is
 * summarise what any framework obliges, state a compliance date, or imply that
 * Yallo or a candidate is certified against one. Name, do not interpret. The same
 * rule already governs the AI governance band in src/data/ai-talent/index.ts.
 */
export const cybersecurityData: L1PageData = {
  slug: "cybersecurity",
  category: "capabilities",
  breadcrumb: [
    { label: "Capabilities", href: "/capabilities" },
    { label: "Cybersecurity & Risk" },
  ],

  eyebrow: "Cybersecurity & Risk · Contract-first",
  title: "Cybersecurity and risk contractors,",
  sectorNoun: "cybersecurity and risk",
  emphasis: "shortlisted in 72 hours.",
  sub: "Security architects, identity engineers, GRC consultants and SOC specialists for enterprise programmes across the Middle East, Europe and India. Screened by people who have run the function, and against the regional frameworks your programme is actually governed by.",
  primaryCta: { label: "Send us a brief", href: "/brief" },
  secondaryCta: { label: "View expertise", href: "#expertise" },
  statusDots: [
    "72h brief to shortlist",
    "Active contractor bench",
    "Middle East · Europe · India",
    "Contract · EOR · Managed Delivery",
  ],

  introEyebrow: "Why us for Cybersecurity & Risk",
  introTitle:
    "Security roles are the ones a programme cannot fake its way through.",
  introCopy: [
    "A security hire is unusual in that the cost of getting it wrong is not a slow delivery, it is an incident. The market knows this, which is why security CVs are the most credential-heavy and the least informative of any discipline we place. A certification says someone passed an exam. It does not say whether they have written a detection that fired on a real intrusion, or told a programme board that a go-live date was not safe.",
    "We screen for the operating context rather than the badge. Whether an identity engineer has migrated a directory with privileged accounts still in it, whether a SOC analyst has worked a genuine incident to closure rather than triaged alerts, and whether a GRC consultant can hold a control conversation with an auditor and an engineering lead in the same room.",
  ],
  /* The one sourced figure in the repo, in the wording ratified in
     src/data/home/personas.ts. Deliberately not narrowed to security: the
     ManpowerGroup finding is about skilled talent generally with IT among the
     hardest categories, and narrowing it to a per-discipline claim is exactly the
     miscitation that had to be corrected on the Data & Analytics page. */
  introStatCards: [
    {
      n: "72%",
      l: "of employers can't find the skilled talent they need — with AI, IT and data roles now the hardest to fill.",
      source: "ManpowerGroup Talent Shortage Survey, 2026",
    },
  ],

  scarceEyebrow: "Scarce talent · high demand",
  scarceTitle:
    "The security and risk roles every enterprise programme fights over.",
  scarceCopy:
    "These are the specialists that appear on every security and risk brief and disappear from the market fastest. Yallo maintains an active bench in each of these areas across the Middle East, Europe and India.",
  scarceCta: { label: "Brief us on a scarce role", href: "/brief" },
  scarceRoles: [
    {
      name: "Cloud Security Architect",
      scarcity: "high",
      engagement: "contract",
    },
    { name: "IAM Architect", scarcity: "high", engagement: "contract-perm" },
    { name: "Detection Engineer", scarcity: "high", engagement: "contract" },
    {
      name: "Incident Response Lead",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "OT Security Specialist",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "ISO 27001 Lead Implementer",
      scarcity: "med",
      engagement: "contract",
    },
    {
      name: "Privileged Access Engineer",
      scarcity: "med",
      engagement: "contract",
    },
    {
      name: "Application Security Engineer",
      scarcity: "med",
      engagement: "contract-perm",
    },
  ],

  expertiseEyebrow: "Our expertise",
  expertiseTitle:
    "Every security and risk discipline, with a contractor bench behind it.",
  expertiseSub:
    "From board-level risk to the detection that fires at 03:00, specialists we place into every function a security and risk programme depends on.",
  expertise: [
    {
      slug: "security-architecture",
      num: "01",
      title: "Security Architecture",
      icon: "security",
      blurb: "Enterprise, cloud and solution-level security design.",
      overview:
        "The architect is the role that decides whether security is designed in or bolted on, and the difference shows up two years later as either a control that works or a compensating control nobody maintains. We screen for people who have made the trade-off calls in a live programme: where segmentation actually lands, which controls are enforced by platform rather than by policy, and how they handled the design review where the delivery date and the security position disagreed.",
      roles: [
        "Security Architect",
        "Enterprise Security Architect",
        "Cloud Security Architect",
      ],
      tools: [
        {
          slug: "microsoft-security",
          vendor: "Microsoft",
          name: "Microsoft Entra and Defender",
          roles: [
            "Security Architect",
            "Cloud Security Architect",
            "Enterprise Security Architect",
          ],
        },
        {
          slug: "prisma-cloud",
          vendor: "Palo Alto Networks",
          name: "Prisma Cloud",
          roles: ["Cloud Security Architect", "Security Architect"],
        },
      ],
    },
    {
      slug: "identity-access-management",
      num: "02",
      title: "Identity & Access Management",
      icon: "workforce",
      blurb: "Directory, joiner-mover-leaver, privileged access.",
      overview:
        "Identity is the control plane, and it is also the programme most likely to run over, because the technology is the easy half. The hard half is the joiner-mover-leaver process nobody owns, the four hundred accounts with no named user, and the service account that turns out to run payroll. We screen identity engineers on migration experience rather than product knowledge: what they did with the accounts that could not be cleanly mapped, and how they staged a cutover that could not take the directory offline.",
      roles: ["IAM Architect", "IAM Engineer", "Privileged Access Engineer"],
      tools: [
        {
          slug: "sailpoint",
          vendor: "SailPoint",
          name: "SailPoint",
          roles: [
            "IAM Architect",
            "IAM Engineer",
            "Identity Governance Consultant",
          ],
        },
        {
          slug: "okta",
          vendor: "Okta",
          name: "Okta",
          roles: ["IAM Engineer", "IAM Architect", "SSO Specialist"],
        },
        {
          slug: "cyberark",
          vendor: "CyberArk",
          name: "CyberArk",
          roles: ["Privileged Access Engineer", "IAM Engineer"],
        },
        {
          slug: "saviynt",
          vendor: "Saviynt",
          name: "Saviynt",
          roles: ["IAM Engineer", "Identity Governance Consultant"],
        },
      ],
    },
    {
      slug: "governance-risk-compliance",
      num: "03",
      title: "Governance, Risk & Compliance",
      icon: "cases",
      blurb: "Control frameworks, risk registers, audit readiness.",
      overview:
        "GRC is where the regional difference is sharpest. A programme in Riyadh or Dubai is governed by frameworks a consultant staffed from outside the region has usually never worked against, and the gap does not show up until an assessment. We screen GRC consultants on which frameworks they have actually delivered against and in which market. What any of those frameworks obliges is your counsel's determination and not ours: we name what a candidate is screened against, and we stop there.",
      roles: [
        "GRC Consultant",
        "ISO 27001 Lead Implementer",
        "Risk and Compliance Analyst",
      ],
      tools: [
        {
          slug: "nca-eccc",
          vendor: "Saudi Arabia",
          name: "NCA Essential Cybersecurity Controls",
          roles: [
            "GRC Consultant",
            "Risk and Compliance Analyst",
            "Security Programme Manager",
          ],
          benchNote:
            "Named as a framework candidates are screened against. Yallo does not interpret its obligations or assert certification.",
        },
        {
          slug: "uae-ia",
          vendor: "UAE",
          name: "UAE Information Assurance standards",
          roles: ["GRC Consultant", "Risk and Compliance Analyst"],
          benchNote:
            "Named as a framework candidates are screened against. Yallo does not interpret its obligations or assert certification.",
        },
        {
          slug: "iso-27001",
          vendor: "ISO/IEC",
          name: "ISO/IEC 27001",
          roles: ["ISO 27001 Lead Implementer", "GRC Consultant"],
        },
      ],
    },
    {
      slug: "security-operations",
      num: "04",
      title: "Security Operations & Incident Response",
      icon: "spark",
      blurb: "SOC, detection engineering, threat hunting, IR.",
      overview:
        "Every SOC brief asks for analysts and most of them actually need a detection engineer. Alert volume is a symptom of tuning, and adding people to an untuned queue produces a more expensive queue. We screen for the difference: whether someone has written and tuned detections against a real telemetry set, whether they have run an incident through to a post-incident review, and whether they can tell you which of their detections were noisy and what they did about it.",
      roles: [
        "SOC Analyst",
        "Detection Engineer",
        "SIEM Engineer",
        "Incident Response Lead",
        "Threat Hunter",
      ],
      tools: [
        {
          slug: "sentinel",
          vendor: "Microsoft",
          name: "Microsoft Sentinel",
          roles: ["SIEM Engineer", "Detection Engineer", "SOC Analyst"],
        },
        {
          slug: "splunk",
          vendor: "Splunk",
          name: "Splunk",
          roles: ["SIEM Engineer", "Detection Engineer", "SOC Analyst"],
        },
        {
          slug: "qradar",
          vendor: "IBM",
          name: "QRadar",
          roles: ["SIEM Engineer", "SOC Analyst"],
        },
        {
          slug: "crowdstrike",
          vendor: "CrowdStrike",
          name: "CrowdStrike",
          roles: ["Threat Hunter", "Incident Response Lead", "SOC Analyst"],
        },
      ],
    },
    {
      slug: "application-product-security",
      num: "05",
      title: "Application & Product Security",
      icon: "dataAi",
      blurb: "AppSec, penetration testing, secure pipelines.",
      overview:
        "Application security fails in the same way on most programmes: a scanner is bought, it produces several thousand findings, and nobody triages them. The roles that change that outcome are engineers who can fix as well as find, and who can put a gate in a pipeline that developers do not immediately route around. We screen for exploitability judgement rather than tool output, and for penetration testers who can write a finding a development team will act on.",
      roles: [
        "Application Security Engineer",
        "Penetration Tester",
        "DevSecOps Engineer",
      ],
      tools: [
        {
          slug: "burp-suite",
          vendor: "PortSwigger",
          name: "Burp Suite",
          roles: ["Penetration Tester", "Application Security Engineer"],
        },
        {
          slug: "qualys",
          vendor: "Qualys",
          name: "Qualys",
          roles: [
            "Vulnerability Management Analyst",
            "Application Security Engineer",
          ],
        },
        {
          slug: "tenable",
          vendor: "Tenable",
          name: "Tenable",
          roles: ["Vulnerability Management Analyst", "Security Engineer"],
        },
      ],
    },
    {
      slug: "cloud-security",
      num: "06",
      title: "Cloud Security",
      icon: "cloud",
      blurb: "Posture, workload protection, landing-zone controls.",
      overview:
        "Cloud security is mostly a configuration and identity problem wearing a network security costume, which is why hires from a traditional infrastructure security background often struggle with it. We screen for people who work in the control plane: posture management that produces a fixable backlog rather than a dashboard, guardrails written as policy-as-code, and a landing zone whose controls hold when a delivery team is under pressure to ship.",
      roles: [
        "Cloud Security Architect",
        "DevSecOps Engineer",
        "Security Engineer",
      ],
      tools: [
        {
          slug: "wiz",
          vendor: "Wiz",
          name: "Wiz",
          roles: ["Cloud Security Architect", "DevSecOps Engineer"],
        },
        {
          slug: "defender-cloud",
          vendor: "Microsoft",
          name: "Microsoft Defender for Cloud",
          roles: ["Cloud Security Architect", "Security Engineer"],
        },
      ],
    },
    {
      slug: "data-protection-privacy",
      num: "07",
      title: "Data Protection & Privacy",
      icon: "mdm",
      blurb: "Classification, data-protection engineering, privacy roles.",
      overview:
        "Privacy work sits between legal and engineering and is usually staffed from only one of them, which is how a programme ends up with a policy nobody can implement or a technical control that answers the wrong question. We screen privacy consultants on whether they have delivered a classification scheme a business actually applied, and worked a real data subject request against a live estate rather than a documented process. Both markets we operate in have their own data-protection law; we name which laws a candidate has worked under and leave interpretation to your counsel.",
      roles: [
        "Privacy Consultant",
        "Data Protection Specialist",
        "GRC Consultant",
      ],
      tools: [
        {
          slug: "purview",
          vendor: "Microsoft",
          name: "Microsoft Purview",
          roles: ["Data Protection Specialist", "Privacy Consultant"],
        },
      ],
    },
    {
      slug: "ot-security",
      num: "08",
      title: "Operational Technology Security",
      icon: "supply",
      blurb: "Plant, utilities and industrial control environments.",
      overview:
        "OT security is a different discipline from IT security and staffing it as though it were the same is the most common and most serious mis-hire in this desk. Availability outranks confidentiality, a patch window may be annual, and an engineer who scans an industrial network the way they would scan a corporate one can stop a line. We screen for people who have worked inside a plant or utility environment and understand why the usual playbook does not apply.",
      roles: [
        "OT Security Specialist",
        "Security Architect",
        "Security Programme Manager",
      ],
      tools: [
        {
          slug: "iec-62443",
          vendor: "IEC",
          name: "IEC 62443",
          roles: ["OT Security Specialist", "Security Architect"],
        },
      ],
    },
  ],

  segmentsEyebrow: "Where we deploy",
  segmentsTitle: "Every sector runs a security programme — we staff them all.",
  segmentsSub:
    "A bank's regulatory position, a hospital's clinical availability constraint or a plant's patch window changes which security specialist you need. Same screened bench, calibrated to the operating context.",
  segments: [
    {
      id: "retail",
      name: taxonomyLabels("retail").label,
      intro:
        "Payment card environments, store estate exposure and e-commerce application security for retail programmes.",
      roles: [
        "Application Security Engineer",
        "Penetration Tester",
        "GRC Consultant",
      ],
    },
    {
      id: "manufacturing",
      name: taxonomyLabels("manufacturing").label,
      intro:
        "Plant and industrial control security, IT and OT convergence and supply chain exposure for manufacturing programmes.",
      roles: [
        "OT Security Specialist",
        "Security Architect",
        "Incident Response Lead",
      ],
    },
    {
      id: "finance",
      name: taxonomyLabels("finance").label,
      intro:
        "Regulatory supervision, payment security, fraud controls and third-party risk for banking and financial services programmes.",
      roles: ["Security Architect", "GRC Consultant", "IAM Architect"],
    },
    {
      id: "government",
      name: taxonomyLabels("government").label,
      intro:
        "National framework alignment, citizen data protection and security operations for central and local government programmes.",
      roles: ["GRC Consultant", "SOC Analyst", "Enterprise Security Architect"],
    },
    {
      id: "healthcare",
      name: taxonomyLabels("healthcare").label,
      intro:
        "Clinical system availability, medical device exposure and patient data protection for healthcare and life sciences programmes.",
      roles: [
        "Security Architect",
        "Privacy Consultant",
        "Vulnerability Management Analyst",
      ],
    },
    {
      id: "telco",
      name: taxonomyLabels("telco").label,
      intro:
        "Network and subscriber data protection, fraud and large-scale security operations for telco and media programmes.",
      roles: ["Detection Engineer", "SIEM Engineer", "Security Architect"],
    },
    {
      id: "education",
      name: taxonomyLabels("education").label,
      intro:
        "Student and staff identity at cohort scale, research data protection and campus network segmentation for institutional programmes.",
      roles: [
        "Identity and Access Engineer, education",
        "Security Architect",
        "GRC Consultant",
      ],
    },
  ],

  relatedTitle: "Related pages",
  related: [
    {
      href: "/capabilities/cloud-infrastructure",
      label: "Cloud & Infrastructure",
      category: "Capability",
    },
    {
      href: "/capabilities/devops-platform-engineering",
      label: "DevOps & Platform Engineering",
      category: "Capability",
    },
    {
      href: "/capabilities/integration-middleware",
      label: "Integration & Middleware",
      category: "Capability",
    },
    { href: "/ai-talent", label: "AI Talent", category: "Capability" },
    { href: "/platforms/microsoft", label: "Microsoft", category: "Platform" },
    {
      href: "/industries/finance",
      label: taxonomyLabels("finance").label,
      category: "Industry",
    },
    {
      href: "/industries/government",
      label: taxonomyLabels("government").label,
      category: "Industry",
    },
  ],

  seo: {
    title: "Cybersecurity & Risk Contractors · Yallo Talent",
    description:
      "Specialist-screened cybersecurity and risk contractors: security architecture, IAM, GRC, SOC and cloud security. 72h shortlist across the Middle East, Europe and India.",
  },
};
