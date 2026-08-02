import type { L1PageData } from "./types";

/**
 * Education & Universities — the seventh industry.
 *
 * Authored from docs/design/context-education-universities.md v1.0 and built to
 * FINANCE's shape rather than retail's: eight populated functions, not twenty
 * empty ones. Retail and finance are the only two sectors whose expertise cards
 * carry `tools`, and a card with no tools is a dead end on the exact page a
 * university CIO opens to test whether the depth claim is real. Every card here
 * carries tools except 2.5, and that one is a deliberate cross-link rather than
 * an omission — see its comment.
 *
 * THREE THINGS ARE DELIBERATELY ABSENT, and each is a forbidden item in §5 of
 * the authored source rather than an oversight:
 *
 *   - No scarce-talent rail. "Any scarcity flag or rate" is forbidden here. The
 *     other six sectors publish one; this one may not, so `scarceRoles` and its
 *     four sibling fields are omitted entirely rather than filled with
 *     unevidenced `high` flags.
 *   - No insights row. Every insight card on the other sectors is an unpublished
 *     placeholder title. A seventh set would be seven more things that do not
 *     exist.
 *   - No figure anywhere, in the intro stat rail or the copy. The single stat
 *     card states the engagement model, which is a fact about Yallo, not a
 *     market statistic needing a `source`.
 *
 * The platform rails derive from the `vendor` field on tool cards
 * (platforms/derive.ts VENDOR_SLUGS), so Oracle, Microsoft, Salesforce, Workday
 * and Informatica each inherit Education from real products named below. Nothing
 * is hand-added to a platform rail, and SAP inherits nothing because no SAP
 * education product is named here — there is no evidence in the repo for one.
 */
export const educationData: L1PageData = {
  slug: "education",
  category: "industries",
  breadcrumb: [
    { label: "Industries", href: "/industries" },
    { label: "Education & Universities" },
  ],

  eyebrow: "Education & Universities · Contract-first",
  title: "University systems contractors,",
  sectorNoun: "education",
  /* The first of the three things that stop this page reading generic. A
     university programme is screened against a date it cannot move, which is a
     different test from "regulated delivery" or "high transaction volumes". */
  screeningContext:
    "a fixed academic calendar, live student records and multi-campus rollout",
  emphasis: "shortlisted in 72 hours.",
  sub: "Ellucian, Oracle PeopleSoft Campus Solutions, Workday Student, Salesforce Education Cloud and Anthology Blackboard specialists for universities, school groups and branch campuses across the Middle East, Europe and India. Specialist-screened for institutional systems depth.",
  primaryCta: { label: "Send us a brief", href: "/brief" },
  secondaryCta: { label: "View expertise", href: "#expertise" },
  statusDots: [
    "72h brief to shortlist",
    "Active contractor bench",
    "Middle East · Europe · India",
    "Contract · EOR · Managed Delivery",
  ],

  introEyebrow: "Why us for education & universities",
  introTitle:
    "A university cannot move go-live. Registration opens on the day it opens.",
  /* All three of the authored source's §3 differentiators are here as copy
     rather than assertion: the fixed calendar (paragraph one), the migration
     with no acceptable error rate (paragraph two), and the region standing up
     new institutions rather than only upgrading old ones (paragraph three).
     None of them needs a figure and none is given one. */
  introCopy: [
    "Every other sector can slip a go-live by a fortnight and absorb it. An institution cannot: term start and the registration window are fixed years ahead, published to applicants, and the systems have to be standing when they arrive. That single constraint changes how a programme is staffed, because it removes the option of finding the missing specialist late.",
    "Student records are the most exacting migration in the sector. A historical transcript is the record of what somebody earned, and there is no error rate an institution can accept on it. That is why migration and cutover is a function on this page rather than a line inside one, and why we screen migration leads on the reconciliation work rather than the extract.",
    "The region is also building institutions, not only upgrading them. A new campus or a new programme needs a student information system, a learning platform, an identity estate and a reporting line standing up from nothing, and that is a different staffing shape from a replacement: more architecture and integration early, less legacy-side knowledge, and a first cohort as the deadline.",
  ],
  introStatCards: [
    {
      n: "Contract-first",
      l: "Primary focus is interim and contract deployment. Also available in Permanent, EOR and Managed Delivery models.",
    },
  ],

  /* NO SCARCE RAIL. See the file header: forbidden by the authored source. */

  expertiseEyebrow: "Our expertise",
  expertiseTitle: "The institutional systems functions we staff.",
  expertiseSub:
    "Eight functions, weighted to what universities and school groups in the Middle East actually run: the student record at the centre, the learning and admissions systems either side of it, and the migration work that decides whether a replacement lands before term.",
  expertise: [
    {
      slug: "student-information-systems",
      num: "01",
      title: "Student Information Systems",
      icon: "cases",
      blurb: "The student record, admissions to transcript",
      roles: [
        "Ellucian Banner Functional Consultant",
        "PeopleSoft Campus Solutions Functional Consultant",
        "Student Information Systems Solution Architect",
      ],
      overview:
        "The student information system is the record of who a student is, what they enrolled on and what they were awarded, and replacing one is a multi-year programme that every other institutional workstream waits on. The seat that decides it has configured the modules before rather than read the implementation guide. We place functional consultants, technical developers, business analysts and architects across Ellucian Banner and Colleague, Oracle PeopleSoft Campus Solutions, Workday Student and Tribal SITS, screened on the modules they have configured and the cohorts they have taken live.",
      screening:
        "Screened on modules configured and go-lives taken through a registration window, not on product familiarity. An SIS consultant who has never sat through enrolment has not met the constraint this function is defined by.",
      tools: [
        {
          slug: "ellucian-banner",
          vendor: "Ellucian",
          name: "Ellucian Banner",
          roles: [
            "Ellucian Banner Functional Consultant",
            "Banner Technical Developer",
            "SIS Business Analyst",
            "Student Information Systems Solution Architect",
          ],
        },
        {
          slug: "ellucian-colleague",
          vendor: "Ellucian",
          name: "Ellucian Colleague",
          roles: [
            "Ellucian Colleague Consultant",
            "SIS Business Analyst",
            "Student Information Systems Solution Architect",
            "Banner Technical Developer",
          ],
        },
        {
          slug: "peoplesoft-campus-solutions",
          vendor: "Oracle",
          vendorSlug: "oracle",
          name: "Oracle PeopleSoft Campus Solutions",
          roles: [
            "PeopleSoft Campus Solutions Functional Consultant",
            "PeopleSoft Campus Solutions Technical Developer",
            "SIS Business Analyst",
            "Student Information Systems Solution Architect",
          ],
        },
        {
          slug: "workday-student",
          vendor: "Workday",
          vendorSlug: "workday",
          name: "Workday Student",
          roles: [
            "Workday Student Consultant",
            "SIS Business Analyst",
            "Student Information Systems Solution Architect",
          ],
        },
        {
          slug: "tribal-sits",
          vendor: "Tribal",
          name: "Tribal SITS",
          roles: [
            "SIS Business Analyst",
            "Student Information Systems Solution Architect",
            "Ellucian Colleague Consultant",
          ],
        },
      ],
    },
    {
      slug: "learning-management",
      num: "02",
      title: "Learning Management & Digital Learning",
      icon: "spark",
      blurb: "Course delivery, content and the learning platform",
      roles: [
        "Learning Management System Administrator",
        "Canvas Consultant",
        "Learning Technologist",
      ],
      overview:
        "The learning platform is the system academics touch every day, which makes adoption rather than configuration the thing that decides it. We place learning management administrators and consultants, Moodle developers, learning technologists, instructional designers and business analysts across Anthology Blackboard, Instructure Canvas, Moodle and D2L Brightspace, including the migrations between them that follow most SIS replacements.",
      screening:
        "Screened on platform migrations completed and on work alongside academic staff, because a learning platform is adopted by teaching faculty or it is not adopted at all.",
      tools: [
        {
          slug: "anthology-blackboard",
          vendor: "Anthology",
          name: "Anthology Blackboard",
          roles: [
            "Blackboard Consultant",
            "Learning Management System Administrator",
            "Learning Technologist",
            "Digital Learning Business Analyst",
          ],
        },
        {
          slug: "instructure-canvas",
          vendor: "Instructure",
          name: "Instructure Canvas",
          roles: [
            "Canvas Consultant",
            "Learning Management System Administrator",
            "Instructional Designer",
            "Digital Learning Business Analyst",
          ],
        },
        {
          slug: "moodle",
          vendor: "Moodle",
          name: "Moodle",
          roles: [
            "Moodle Developer",
            "Learning Management System Administrator",
            "Learning Technologist",
            "Instructional Designer",
          ],
        },
        {
          slug: "d2l-brightspace",
          vendor: "D2L",
          name: "D2L Brightspace",
          roles: [
            "Learning Management System Administrator",
            "Learning Technologist",
            "Instructional Designer",
            "Digital Learning Business Analyst",
          ],
        },
      ],
    },
    {
      slug: "admissions-student-crm",
      num: "03",
      title: "Admissions, Recruitment & Student CRM",
      icon: "crm",
      blurb: "Enquiry to enrolment, and the CRM behind it",
      roles: [
        "Salesforce Education Cloud Consultant",
        "Admissions Systems Analyst",
        "Education CRM Developer",
      ],
      overview:
        "Recruitment and admissions is the one institutional system with a seasonal peak, and it is the joins that fail under it: the enquiry that never reaches the admissions officer, the offer that does not reach the student record. We place Education Cloud consultants, CRM developers, admissions systems analysts, recruitment systems consultants and solution architects across Salesforce Education Cloud, Ellucian CRM Recruit and Microsoft Dynamics 365.",
      screening:
        "Screened on integration into the student record rather than on CRM configuration alone. An admissions build that does not reach the SIS moves work to the registry rather than removing it.",
      tools: [
        {
          slug: "salesforce-education-cloud",
          vendor: "Salesforce",
          vendorSlug: "salesforce",
          name: "Salesforce Education Cloud",
          roles: [
            "Salesforce Education Cloud Consultant",
            "Education CRM Developer",
            "CRM Solution Architect, education",
            "Admissions Systems Analyst",
          ],
        },
        {
          slug: "ellucian-crm-recruit",
          vendor: "Ellucian",
          name: "Ellucian CRM Recruit",
          roles: [
            "Student Recruitment Systems Consultant",
            "Admissions Systems Analyst",
            "Education CRM Developer",
            "CRM Solution Architect, education",
          ],
        },
        {
          slug: "dynamics-365-education",
          vendor: "Microsoft",
          vendorSlug: "microsoft",
          name: "Microsoft Dynamics 365",
          roles: [
            "Education CRM Developer",
            "Student Recruitment Systems Consultant",
            "CRM Solution Architect, education",
            "Admissions Systems Analyst",
          ],
        },
      ],
    },
    {
      /* NAMED GENERICALLY ON PURPOSE, per the authored source §2.4. The research
         administration vendor set is fragmented and regionally variable, and
         naming a product here without evidence in the repo would be the
         invention rule broken to fill a badge. `vendor` renders as a text badge
         so a category reads correctly; `vendorSlug` is omitted because no logo
         is claimed. Same discipline finance already applies to its financial
         crime and regulatory reporting cards. */
      slug: "research-administration",
      num: "04",
      title: "Research Administration & Grants",
      icon: "mdm",
      blurb: "Grants, research data and the institutional repository",
      roles: [
        "Research Administration Systems Consultant",
        "Grants Management Analyst",
        "Research Data Manager",
      ],
      overview:
        "Research operations in the region are scaling faster than the systems behind them, and the administration seats are staffed thinly enough that a single departure stalls a funding round. We place research administration systems consultants, grants management analysts, research data managers and business analysts across grants management platforms, institutional repositories and research data management.",
      screening:
        "Screened on the grant lifecycle end to end, from award through to reporting, because the systems are usually briefed as one and staffed as three.",
      tools: [
        {
          slug: "grants-management",
          vendor: "Research administration",
          name: "Research administration and grants management platforms",
          roles: [
            "Research Administration Systems Consultant",
            "Grants Management Analyst",
            "Research Systems Business Analyst",
          ],
        },
        {
          slug: "institutional-repositories",
          vendor: "Repositories",
          name: "Institutional repositories",
          roles: [
            "Research Data Manager",
            "Research Systems Business Analyst",
            "Research Administration Systems Consultant",
          ],
        },
        {
          slug: "research-data-management",
          vendor: "Research data",
          name: "Research data management",
          roles: [
            "Research Data Manager",
            "Grants Management Analyst",
            "Research Systems Business Analyst",
          ],
        },
      ],
    },
    {
      /* THE ONE CARD WITH NO TOOLS, AND IT IS DELIBERATE.
         The authored source §2.5 rules this function a CROSS-LINK rather than a
         restatement: the roles are the platform desks' own roles applied to an
         institutional context, and those lists already live on /platforms/oracle,
         /platforms/workday and /platforms/microsoft.

         `href` sends the card straight to the Oracle desk rather than to an L2
         that would republish that desk one level shallower, and the other two
         routes sit in `related` below. Tool cards here would also have pulled
         Education onto a platform rail by restatement rather than by real
         product coverage, which is exactly what §4.2 of the round 4 rulings
         forbids on Blue Yonder and SAP. */
      slug: "institutional-back-office",
      num: "05",
      title: "Institutional Finance, HR & Procurement",
      icon: "finance",
      blurb: "The enterprise back office of an institution",
      href: "/platforms/oracle",
      /* Three titles, taken VERBATIM from the three platform desks this card
         routes to (platforms/authored.ts: Oracle Fusion ERP, Workday HCM, D365
         Finance & Operations). Naming them in an institutional register would
         have meant minting three job titles that exist nowhere, which is the
         invention rule, and re-typing them in a new form is how a taxonomy
         drifts from its source. */
      roles: [
        "Oracle Fusion Financials Consultant",
        "Workday HCM Functional Consultant",
        "D365 F&O Finance Consultant",
      ],
      overview:
        "An institution runs the same enterprise back office as any other large employer, on Oracle Fusion, Workday and Microsoft Dynamics 365, and the roles are the platform desks' roles in an institutional context. They are published in one place rather than two: the Oracle, Workday and Microsoft desks carry them in full.",
    },
    {
      slug: "campus-it-identity",
      num: "06",
      title: "Campus IT, Identity & Endpoint",
      icon: "security",
      blurb: "Identity, devices and the campus network",
      roles: [
        "Identity and Access Engineer, education",
        "Microsoft 365 Consultant",
        "Campus Network Engineer",
      ],
      overview:
        "Campus IT carries a user population that turns over by a third every year and reaches its peak load in the first week of term. We place identity and access engineers, Microsoft 365 consultants, campus network engineers, endpoint management specialists and IT service managers across Microsoft 365 Education, Microsoft Entra ID, campus network and wireless estates and device management.",
      screening:
        "Screened on joiner and leaver volume at cohort scale rather than at corporate scale, and on the first week of term as the load test that matters.",
      tools: [
        {
          slug: "microsoft-365-education",
          vendor: "Microsoft",
          vendorSlug: "microsoft",
          name: "Microsoft 365 Education",
          roles: [
            "Microsoft 365 Consultant",
            "Endpoint Management Specialist",
            "IT Service Manager, education",
            "Identity and Access Engineer, education",
          ],
        },
        {
          slug: "microsoft-entra-id",
          vendor: "Microsoft",
          vendorSlug: "microsoft",
          name: "Microsoft Entra ID",
          roles: [
            "Identity and Access Engineer, education",
            "Microsoft 365 Consultant",
            "Endpoint Management Specialist",
          ],
        },
        {
          slug: "campus-network",
          vendor: "Campus network",
          name: "Campus network and wireless",
          roles: [
            "Campus Network Engineer",
            "IT Service Manager, education",
            "Endpoint Management Specialist",
          ],
        },
        {
          slug: "endpoint-management",
          vendor: "Endpoint",
          name: "Device and endpoint management",
          roles: [
            "Endpoint Management Specialist",
            "Microsoft 365 Consultant",
            "IT Service Manager, education",
          ],
        },
      ],
    },
    {
      /* NAMING DISCIPLINE, and it is load-bearing on this card. Ministries,
         commissions and accreditation bodies are named ONLY as things a role is
         screened against. No obligation is described, no deadline given, and no
         compliance or accreditation is implied or claimed. Identical to the
         discipline already applied to the regional security frameworks on the
         Cybersecurity & Risk desk and to the payment schemes on finance. */
      slug: "data-reporting-accreditation",
      num: "07",
      title: "Data, Reporting & Accreditation",
      icon: "analytics",
      blurb: "Institutional research, returns and the data estate",
      roles: [
        "Institutional Research Analyst",
        "Accreditation Reporting Analyst",
        "Data Engineer, education",
      ],
      overview:
        "Institutional reporting is assembled from the student record, the finance ledger and the learning platform, and it is the assembly that is understaffed rather than the analysis. We place institutional research analysts, student data analysts, accreditation reporting analysts, data engineers and reporting consultants across institutional data warehouses, reporting and analytics platforms and the Informatica estate underneath them. Ministries, commissions and accreditation bodies are what we screen a candidate against. Yallo does not interpret them and certifies no one against them.",
      screening:
        "Screened on reporting assembled across the student record, the ledger and the learning platform together, because a reporting analyst who has only ever queried one of the three has not done this job.",
      tools: [
        {
          slug: "institutional-data-warehouse",
          vendor: "Institutional data",
          name: "Institutional data warehouses",
          roles: [
            "Data Engineer, education",
            "Institutional Research Analyst",
            "Student Data Analyst",
            "Reporting and Analytics Consultant",
          ],
        },
        {
          slug: "informatica-education-estate",
          vendor: "Informatica",
          vendorSlug: "informatica",
          name: "Informatica",
          roles: [
            "Data Engineer, education",
            "Reporting and Analytics Consultant",
            "Student Data Analyst",
          ],
        },
        {
          slug: "reporting-analytics-platforms",
          vendor: "Reporting",
          name: "Reporting and analytics platforms",
          roles: [
            "Reporting and Analytics Consultant",
            "Institutional Research Analyst",
            "Student Data Analyst",
            "Accreditation Reporting Analyst",
          ],
        },
        {
          slug: "ministry-commission-reporting",
          vendor: "Statutory returns",
          name: "Ministry and commission reporting",
          roles: [
            "Accreditation Reporting Analyst",
            "Institutional Research Analyst",
            "Student Data Analyst",
          ],
        },
      ],
    },
    {
      slug: "migration-cutover",
      num: "08",
      title: "Programme Delivery, Migration & Cutover",
      icon: "integration",
      blurb: "Student-records migration, parallel run and hypercare",
      roles: [
        "Data Migration Lead, student records",
        "Test Manager, education systems",
        "Cutover Manager",
      ],
      overview:
        "The function institutions under-scope, and the one that decides whether an SIS replacement lands before registration opens. Migration, parallel run, cutover and hypercare are separate seats needed in a fixed order rather than all at once, and a historical transcript has no error rate anybody can sign off. We place migration leads and developers, test managers and integration developers, cutover and hypercare leads, and change and adoption leads.",
      screening:
        "Screened on reconciliation and parallel run rather than on extract and load, because student-records migration is judged on the records that did not change.",
      tools: [
        {
          slug: "student-records-migration",
          vendor: "Data migration",
          name: "Student-records migration tooling",
          roles: [
            "Data Migration Lead, student records",
            "Migration Developer",
            "Integration Developer",
          ],
        },
        {
          slug: "education-test-automation",
          vendor: "Test automation",
          name: "Test automation for institutional systems",
          roles: [
            "Test Manager, education systems",
            "Integration Developer",
            "Migration Developer",
          ],
        },
        {
          slug: "parallel-run-reconciliation",
          vendor: "Cutover",
          name: "Parallel-run and reconciliation",
          roles: [
            "Cutover Manager",
            "Hypercare Lead",
            "Change and Adoption Lead, education",
            "Test Manager, education systems",
          ],
        },
      ],
    },
  ],

  segmentsEyebrow: "Segments we support",
  segmentsTitle: "Every kind of institution. Specialists who know the context.",
  segmentsSub:
    "A federal university runs different programmes from a school group or a branch campus. Our contractors understand the institutional context, not just the platform.",
  /* CUSTOMER-SHAPED, every one of them. A segment is a kind of buyer; a function
     belongs in the expertise grid. That is the same rule the round 4 rulings
     applied to finance, where five function-shaped segments were removed as a
     category error, and it is applied here from the start rather than
     retrospectively. */
  segments: [
    {
      id: "universities",
      name: "Universities",
      intro:
        "Public and private universities running a full student lifecycle. Student information system replacement, learning platform migration and institutional reporting dominate the brief pipeline.",
      roles: [
        "Ellucian Banner Functional Consultant",
        "PeopleSoft Campus Solutions Functional Consultant",
        "Student Information Systems Solution Architect",
        "Institutional Research Analyst",
        "Data Migration Lead, student records",
      ],
    },
    {
      id: "school-groups",
      name: "School Groups",
      intro:
        "Multi-school operators running one estate across many sites. Consolidation onto shared admissions, learning and identity platforms is the constant theme.",
      roles: [
        "Learning Management System Administrator",
        "Microsoft 365 Consultant",
        "Endpoint Management Specialist",
        "Admissions Systems Analyst",
        "IT Service Manager, education",
      ],
    },
    {
      id: "branch-campuses",
      name: "International Branch Campuses",
      intro:
        "Campuses operating a home institution's systems in a second country. Integration back to the parent estate and local reporting are the two recurring hotspots.",
      roles: [
        "Integration Developer",
        "SIS Business Analyst",
        "Identity and Access Engineer, education",
        "Reporting and Analytics Consultant",
        "Student Information Systems Solution Architect",
      ],
    },
    {
      id: "new-institutions",
      name: "New Institutions and Campuses",
      intro:
        "Institutions standing systems up from nothing rather than replacing them. Architecture and integration are needed early, and the first cohort is the deadline.",
      roles: [
        "Student Information Systems Solution Architect",
        "CRM Solution Architect, education",
        "Identity and Access Engineer, education",
        "Integration Developer",
        "Cutover Manager",
      ],
    },
    {
      id: "vocational",
      name: "Technical and Vocational Institutes",
      intro:
        "Applied and vocational providers with shorter course cycles and heavier employer reporting. Learning platforms and enrolment throughput carry the load.",
      roles: [
        "Canvas Consultant",
        "Moodle Developer",
        "Learning Technologist",
        "Student Data Analyst",
        "Digital Learning Business Analyst",
      ],
    },
    {
      id: "research-institutes",
      name: "Research Institutes",
      intro:
        "Research-intensive institutes and university research offices. Grants administration, research data management and the repository estate are the specialist draws.",
      roles: [
        "Research Administration Systems Consultant",
        "Grants Management Analyst",
        "Research Data Manager",
        "Research Systems Business Analyst",
        "Data Engineer, education",
      ],
    },
  ],

  relatedTitle:
    "Adjacent industries, platforms and capabilities we place into education.",
  related: [
    {
      href: "/industries/government",
      label: "Government & Public Sector",
      category: "Industry",
    },
    {
      href: "/industries/healthcare",
      label: "Healthcare & Life Sciences",
      category: "Industry",
    },
    { href: "/platforms/oracle", label: "Oracle", category: "Platform" },
    { href: "/platforms/workday", label: "Workday", category: "Platform" },
    { href: "/platforms/microsoft", label: "Microsoft", category: "Platform" },
    {
      href: "/platforms/salesforce",
      label: "Salesforce",
      category: "Platform",
    },
    {
      href: "/platforms/informatica",
      label: "Informatica",
      category: "Platform",
    },
    /* The under-scoped-roles argument function 08 makes in one paragraph is the
       blueprint's whole subject, and student-records migration and cutover are
       the textbook case of streams funded as tasks. */
    {
      href: "/intelligence/programme-staffing-blueprint/oracle-fusion",
      label: "Programme Staffing Blueprint",
      category: "Intelligence",
    },
    {
      href: "/capabilities/data-analytics",
      label: "Data & Analytics",
      category: "Capability",
    },
    {
      href: "/capabilities/integration-middleware",
      label: "Integration & Middleware",
      category: "Capability",
    },
    {
      href: "/capabilities/cybersecurity",
      label: "Cybersecurity & Risk",
      category: "Capability",
    },
  ],

  seo: {
    title:
      "Education & University Tech Contractors · Middle East · Europe · India | Yallo Talent",
    description:
      "Ellucian, PeopleSoft Campus Solutions, Workday Student, Salesforce Education Cloud and Blackboard contractors for university and school-group programmes. 72h specialist-screened shortlists across the Middle East, Europe and India.",
  },
};
