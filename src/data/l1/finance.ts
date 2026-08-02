import { taxonomyLabels } from "./index";
import type { L1PageData } from "./types";

export const financeData: L1PageData = {
  slug: "finance",
  category: "industries",
  breadcrumb: [
    { label: "Industries", href: "/industries" },
    { label: taxonomyLabels("finance").label },
  ],

  eyebrow: "Banking & Financial Services · Contract-first",
  title: "Banking & FS contractors,",
  sectorNoun: "financial services",
  screeningContext: "regulated delivery, audit trails and change control",
  emphasis: "shortlisted in 72 hours.",
  /* Hero copy rewritten with the expertise grid, 2 Aug 2026, per
     docs/design/context-finance-depth.md §1. It promised "wealth" and the grid
     no longer carries a wealth function, which is the same defect as promising
     twenty functions and shipping nine. What the five named platforms actually
     cover is core banking, Islamic banking, payments and insurance. */
  /* SIX PLATFORMS, NOT FIVE, and the hero moved with the grid rather than after
     it. Backbase was ratified on 2 Aug 2026 (context-round4-rulings.md §6.4) on
     Sumeet's own criterion, what most Middle East banks actually run, and it is
     one entry under digital channels. Leaving the hero at five while function 03
     carried a sixth would have recreated the exact defect this round's sweep
     exists to remove: a hero that argues one surface and a screen down that
     argues a wider one. Digital channels joins the programme list for the same
     reason. */
  sub: "Temenos, Oracle FLEXCUBE, Infosys Finacle, Backbase, Guidewire and Murex specialists for core banking, Islamic banking, digital channels, payments and insurance programmes across the Middle East, Europe and India. Specialist-screened for regulated-industry depth.",
  primaryCta: { label: "Send us a brief", href: "/brief" },
  secondaryCta: { label: "View expertise", href: "#expertise" },
  statusDots: [
    "72h brief to shortlist",
    "Active contractor bench",
    "Middle East · Europe · India",
    "Contract · EOR · Managed Delivery",
  ],

  introEyebrow: "Why us for banking & financial services",
  introTitle:
    "Finance programmes stall when regulated-industry depth isn't in the room.",
  introCopy: [
    "Every Temenos core migration, every Guidewire policy admin rollout, every Murex trading platform build shares the same failure mode — the implementation depends on the depth of the contractor in the room. Generic recruiters place platform names. We place implementation track records inside regulated environments.",
    "Our bench is assessed by specialists who have run banking, insurance and capital markets delivery. We screen for the specific operating context — KYC/AML, PCI, PRA/FCA, DFSA, RBI — not just certification badges.",
  ],
  /* TWO FIGURES REMOVED, 2 Aug 2026, and the precedent decided it rather than
     my judgement. "71% of banking CIOs..." and "5-8 wks average time lost" both
     shipped with no `source`, which PRODUCT.md bans outright: only the four
     metrics in content/metrics.yaml are publishable, and neither of these is
     among them. L1IntroStatCard.source exists precisely so an omission is
     visible, and it was omitted here.

     Retail carried the identical pattern, had it caught, and was fixed by
     REMOVAL rather than substitution — its rail is one card for that reason.
     Finance was not swept at the same time. Same fault, same fix; a plausible
     replacement figure would have been the worse outcome. */
  introStatCards: [
    {
      n: "Contract-first",
      l: "Primary focus is interim and contract deployment. Also available in Permanent, EOR and Managed Delivery models.",
    },
  ],

  scarceEyebrow: "Scarce talent",
  scarceIcon: "scarce",
  scarceTitle:
    "The roles every banking programme needs — and struggles to find.",
  scarceCopy:
    "These are the specialists that appear on every finance brief and disappear from the market fastest. Yallo maintains an active bench in each of these areas across the Middle East, Europe and India. When you need one, you don't have six weeks.",
  scarceCta: { label: "Brief us on a scarce role", href: "/brief" },
  scarceRoles: [
    {
      name: "Temenos Transact Technical Architect",
      scarcity: "high",
      engagement: "contract",
    },
    {
      /* THE BADGE MOVED HERE, 2 Aug 2026, per context-round3-rulings.md §5.4.
         The pattern is ratified: `contract-perm` marks architect- and lead-grade
         roles, where a genuine permanent alternative exists. Finance was the one
         desk of six applying it to neither: the badge sat on "nCino Loan
         Origination Specialist", a Specialist-grade title. Verification found
         the other five desks already correct (healthcare, manufacturing and
         telco on Architect; government and retail on Lead), so this is the only
         move. */
      name: "Oracle FLEXCUBE Solution Architect",
      scarcity: "high",
      engagement: "contract-perm",
    },
    {
      name: "Finacle Core Banking Consultant",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "Murex Front-Office Consultant",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "Guidewire ClaimCenter Configuration Lead",
      scarcity: "high",
      engagement: "contract",
    },
    /* THREE ROLES REMOVED, 2 Aug 2026, per context-round4-rulings.md §6.5.
       The rule is not a platform list. It is that every entry on this rail must
       map to one of the nine functions the grid publishes, and to a tool inside
       one of them:

         nCino Loan Origination Specialist       Lending is function 07, but its
                                                 tools are Temenos Loan
                                                 Origination, FLEXCUBE Lending
                                                 and Finacle Lending and
                                                 Collections. nCino is a seventh
                                                 platform the desk does not staff.
         PSD2 / Open Banking Integration         Open banking is inside function
         Architect                               03, but PSD2 is a European
                                                 regulation rather than a product,
                                                 and the desk is weighted to the
                                                 Middle East.
         AML / Actimize Transaction              Financial crime is inside
         Monitoring Lead                         function 06, but its card is a
                                                 category on purpose and names no
                                                 product. Actimize is not one of
                                                 the platforms behind it.

       Nothing is added to backfill the count. A scarce rail of five that is true
       beats one of eight that argues a bench the grid does not show, and each of
       the five below maps to a named tool on a published function. Onfido and
       Jumio are named in the ruling and appear nowhere in this repository, so
       there was nothing to remove. */
  ],

  expertiseEyebrow: "Our expertise",
  /* THE GRID WAS REBUILT, 2 Aug 2026, from
     docs/design/context-finance-depth.md v1.0 (ratified by Sumeet, 2 Aug 2026).

     Was: twenty functions, every one of them carrying zero `tools`. Because the
     L2 route, the card href and `routeExists` all derive from `tools`, that
     meant no finance L2 existed and all twenty cards were dead ends — on the
     page a banking buyer opens to test whether module depth is a retail-only
     claim. Retail had twenty of twenty.

     Now: nine functions, each populated, deliberately shallower than retail and
     restricted to the five platforms already named in the hero (Temenos, Oracle
     FLEXCUBE, Infosys Finacle, Guidewire, Murex), weighted to what Middle East
     banks actually run. Islamic banking is its own function rather than a note
     under core banking, because it is a distinct configuration hire.

     Thirteen of the twenty are gone. Seven mapped onto functions here; the rest
     were either folded in (cards-issuing into payments, investment-banking into
     capital markets, kyc-aml and reg-compliance into risk) or removed as
     out-of-domain for the five platforms (wealth, fs-crm, fpna, finance-ops,
     data-ai-fs, cybersecurity-fs, procurement, hcm-fs, it-infra-fs). The last
     two of those live on the capability desks and are cross-linked from
     `related` rather than restated here. Nothing was invented to reach a count.

     The old titles are NOT retained as empty cards: a card with no tools is the
     dead end this change exists to remove. */
  expertiseTitle: "The banking and insurance functions we staff.",
  expertiseSub:
    "Weighted to what Middle East banks actually run: core banking and the Islamic products beside it, the payment rails around both, and the migration and cutover work that decides whether either lands.",
  expertise: [
    {
      slug: "core-banking",
      num: "01",
      title: "Core Banking Platform",
      icon: "finance",
      blurb: "Ledger, deposits and account services",
      roles: [
        "Temenos Transact Consultant",
        "FLEXCUBE Functional Consultant",
        "Core Banking Solution Architect",
      ],
      overview:
        "Core banking is the programme every other bank workstream waits on, and the seat that decides it is the one that has done the configuration before rather than read the release notes. We place consultants, developers and architects across Temenos Transact, Oracle FLEXCUBE Universal Banking and Infosys Finacle Core Banking, screened on the modules they have configured and the migrations they have sat through.",
      tools: [
        {
          slug: "temenos-transact",
          vendor: "Temenos",
          name: "Temenos Transact",
          roles: [
            "Temenos Transact Consultant",
            "T24 Technical Developer",
            "Temenos Solution Architect",
            "Core Banking Business Analyst",
          ],
        },
        {
          slug: "oracle-flexcube-universal-banking",
          vendor: "Oracle",
          vendorSlug: "oracle",
          name: "Oracle FLEXCUBE Universal Banking",
          roles: [
            "FLEXCUBE Functional Consultant",
            "FLEXCUBE Technical Consultant",
            "Core Banking Solution Architect",
            "Core Banking Business Analyst",
          ],
        },
        {
          slug: "infosys-finacle-core-banking",
          vendor: "Infosys Finacle",
          name: "Infosys Finacle Core Banking",
          roles: [
            "Finacle Functional Consultant",
            "Finacle Technical Developer",
            "Core Banking Solution Architect",
            "Core Banking Business Analyst",
          ],
        },
      ],
    },
    {
      /* First among equals in this domain even though core banking is the larger
         desk: every major Middle East market has both fully Islamic banks and
         conventional banks running Islamic windows, and it is the function a
         UK-origin competitor cannot staff credibly.

         Copy discipline per context-finance-depth.md §2.2: describe what Yallo
         places and screens for. Do not explain Sharia compliance, do not
         characterise any ruling or standard, do not imply Yallo certifies
         anything. */
      slug: "islamic-banking",
      num: "02",
      title: "Islamic Banking",
      icon: "cases",
      blurb: "Islamic windows and fully Islamic banks",
      roles: [
        "Islamic Banking Functional Consultant",
        "Sharia-compliant Product Configuration Specialist",
        "Islamic Treasury Consultant",
      ],
      overview:
        "Every major Middle East market has both fully Islamic banks and conventional banks running Islamic windows, and the seat that configures those products is a different hire from a conventional core consultant. That difference is what we screen for: consultants who have configured Islamic products on Temenos, FLEXCUBE and Finacle, and the analysts and product owners who specify them. Yallo places and screens these specialists. We do not certify products and we do not advise on compliance.",
      tools: [
        {
          slug: "temenos-islamic-banking",
          vendor: "Temenos",
          name: "Temenos Islamic Banking",
          roles: [
            "Islamic Banking Functional Consultant",
            "Sharia-compliant Product Configuration Specialist",
            "Islamic Banking Business Analyst",
            "Islamic Finance Product Owner",
          ],
        },
        {
          slug: "flexcube-islamic-banking",
          vendor: "Oracle",
          vendorSlug: "oracle",
          name: "FLEXCUBE Islamic Banking",
          roles: [
            "Islamic Banking Functional Consultant",
            "Sharia-compliant Product Configuration Specialist",
            "Islamic Treasury Consultant",
            "Islamic Banking Business Analyst",
          ],
        },
        {
          slug: "finacle-islamic-banking",
          vendor: "Infosys Finacle",
          name: "Finacle Islamic Banking",
          roles: [
            "Islamic Banking Functional Consultant",
            "Sharia-compliant Product Configuration Specialist",
            "Islamic Finance Product Owner",
            "Islamic Banking Business Analyst",
          ],
        },
      ],
    },
    {
      slug: "digital-channels",
      num: "03",
      title: "Digital Channels & Onboarding",
      icon: "omnichannel",
      blurb: "Mobile, internet banking and eKYC onboarding",
      roles: [
        "Digital Banking Consultant",
        "Customer Onboarding and eKYC Consultant",
        "Open Banking and API Consultant",
      ],
      overview:
        "Channel programmes fail at the joins rather than the front end: the onboarding flow that stalls at identity verification, the API layer that cannot serve the app and the branch from one contract. We place digital banking consultants, onboarding and eKYC specialists, mobile product owners and front-end engineers who have shipped banking channels on Temenos Infinity, Oracle Banking Digital Experience and the Finacle Digital Engagement Suite.",
      tools: [
        {
          slug: "temenos-infinity",
          vendor: "Temenos",
          name: "Temenos Infinity",
          roles: [
            "Digital Banking Consultant",
            "Mobile Banking Product Owner",
            "Front-end Engineer, banking channels",
            "Digital Channels Business Analyst",
          ],
        },
        {
          slug: "oracle-banking-digital-experience",
          vendor: "Oracle",
          vendorSlug: "oracle",
          name: "Oracle Banking Digital Experience",
          roles: [
            "Digital Banking Consultant",
            "Open Banking and API Consultant",
            "Customer Onboarding and eKYC Consultant",
            "Digital Channels Business Analyst",
          ],
        },
        {
          slug: "finacle-digital-engagement-suite",
          vendor: "Infosys Finacle",
          name: "Finacle Digital Engagement Suite",
          roles: [
            "Digital Banking Consultant",
            "Customer Onboarding and eKYC Consultant",
            "Mobile Banking Product Owner",
            "Front-end Engineer, banking channels",
          ],
        },
        {
          /* RATIFIED 2 Aug 2026, context-round4-rulings.md §6.4. One entry, on
             this function only. Backbase is a channel layer rather than a core,
             so it belongs here and nowhere else on the desk; the roles are the
             four this function already publishes, so the card adds a platform
             and invents no job title. */
          slug: "backbase-engagement-banking",
          vendor: "Backbase",
          name: "Backbase Engagement Banking Platform",
          roles: [
            "Backbase Consultant",
            "Digital Banking Consultant",
            "Front-end Engineer, banking channels",
            "Digital Channels Business Analyst",
          ],
        },
      ],
    },
    {
      slug: "payments",
      num: "04",
      title: "Payments & ISO 20022",
      icon: "pricing",
      blurb: "Payment hubs, SWIFT and instant-payment schemes",
      /* The regional schemes are NAMED in the overview and given no tool card of
         their own, deliberately. A card implies a product with a bench behind
         it; these are schemes. Per context-finance-depth.md §2.4 they are named
         and never interpreted: no mandate dates, no deadlines, no statement of
         what any scheme obliges a bank to do. Same discipline already applied to
         the regional frameworks on the Cybersecurity & Risk desk. */
      roles: [
        "Payments Solution Architect",
        "ISO 20022 Migration Consultant",
        "SWIFT Consultant",
      ],
      overview:
        "Payments hiring splits into the hub itself and the message layer around it, and it is the second that briefs routinely under-scope. We place payments architects, ISO 20022 migration and SWIFT consultants, integration developers and testing specialists across Temenos Payments, Oracle Banking Payments and Finacle Payments, including work on the regional instant-payment schemes: Aani in the UAE, sarie in Saudi Arabia and Buna regionally.",
      tools: [
        {
          slug: "temenos-payments",
          vendor: "Temenos",
          name: "Temenos Payments",
          roles: [
            "Payments Solution Architect",
            "Payments Integration Developer",
            "Payments Business Analyst",
            "Payments Testing Specialist",
          ],
        },
        {
          slug: "oracle-banking-payments",
          vendor: "Oracle",
          vendorSlug: "oracle",
          name: "Oracle Banking Payments",
          roles: [
            "Payments Solution Architect",
            "ISO 20022 Migration Consultant",
            "Payments Integration Developer",
            "Payments Business Analyst",
          ],
        },
        {
          slug: "finacle-payments",
          vendor: "Infosys Finacle",
          name: "Finacle Payments",
          roles: [
            "Payments Solution Architect",
            "Instant Payments Scheme Consultant",
            "Payments Integration Developer",
            "Payments Testing Specialist",
          ],
        },
        {
          slug: "swift-iso-20022",
          vendor: "SWIFT",
          name: "SWIFT and ISO 20022 message standards",
          roles: [
            "SWIFT Consultant",
            "ISO 20022 Migration Consultant",
            "Payments Integration Developer",
            "Instant Payments Scheme Consultant",
          ],
        },
      ],
    },
    {
      slug: "treasury-capital-markets",
      num: "05",
      title: "Treasury & Capital Markets",
      icon: "analytics",
      blurb: "Front office, market risk, collateral and XVA",
      roles: [
        "Murex Front Office Consultant",
        "Murex MxML Developer",
        "Murex Market Risk Consultant",
      ],
      overview:
        "Murex is not one skill. The front-office consultant, the MxML developer and the market-risk specialist are three different hires, and a brief that asks for a Murex resource gets whichever of the three is nearest. We place each separately across MX.3 front office, market risk, collateral and XVA, and on Oracle Banking Treasury Management for the bank treasury side.",
      tools: [
        {
          slug: "murex-mx3-front-office",
          vendor: "Murex",
          name: "Murex MX.3 Front Office",
          roles: [
            "Murex Front Office Consultant",
            "Murex Back Office Consultant",
            "Murex MxML Developer",
            "Treasury Business Analyst",
          ],
        },
        {
          slug: "murex-mx3-risk-collateral-xva",
          vendor: "Murex",
          name: "Murex MX.3 Market Risk, Collateral and XVA",
          roles: [
            "Murex Market Risk Consultant",
            "Collateral and XVA Consultant",
            "Murex Datamart Developer",
            "Murex MxML Developer",
          ],
        },
        {
          /* Two roles rather than four. The authored source gives seven role
             titles for this function and five of them are Murex-specific; the
             two here are the ones that genuinely sit on this product. Padding it
             to four would have meant inventing a title. */
          slug: "oracle-banking-treasury-management",
          vendor: "Oracle",
          vendorSlug: "oracle",
          name: "Oracle Banking Treasury Management",
          roles: ["Treasury Business Analyst", "Collateral and XVA Consultant"],
        },
      ],
    },
    {
      slug: "risk-regulatory-financial-crime",
      num: "06",
      title: "Risk, Regulatory Reporting & Financial Crime",
      icon: "security",
      blurb: "Risk engines, reporting and financial crime",
      roles: [
        "OFSAA Consultant",
        "IFRS 9 Consultant",
        "AML and Sanctions Screening Consultant",
      ],
      overview:
        "Three things banks often brief as one: the risk and finance engine, the reporting that comes out of it, and the financial-crime stack beside it. We place OFSAA consultants, IFRS 9 and Basel reporting specialists, AML and sanctions screening consultants, financial crime analysts and model validation specialists. Regulators and frameworks are what we screen a candidate against. Yallo does not interpret them and certifies no one against them.",
      tools: [
        {
          slug: "oracle-fsaa",
          vendor: "Oracle",
          vendorSlug: "oracle",
          name: "Oracle Financial Services Analytical Applications",
          roles: [
            "OFSAA Consultant",
            "IFRS 9 Consultant",
            "Basel Reporting Consultant",
            "Model Validation Specialist",
          ],
        },
        {
          /* Category cards, not vendors, and that is deliberate. The authored
             source names no AML or reporting product, because every candidate
             product sits outside the five platforms this desk is built on.
             Naming one to fill the badge would have widened the surface the
             ruling narrowed. `vendor` renders as a text badge, so a category
             reads correctly; `vendorSlug` is omitted because no logo is claimed. */
          slug: "aml-sanctions-screening",
          vendor: "Financial crime",
          name: "AML and sanctions screening platforms",
          roles: [
            "AML and Sanctions Screening Consultant",
            "Financial Crime Analyst",
            "Model Validation Specialist",
            "Regulatory Reporting Business Analyst",
          ],
        },
        {
          slug: "regulatory-reporting",
          vendor: "Regulatory reporting",
          name: "Reporting to the region's central banks, Basel and IFRS 9",
          roles: [
            "Basel Reporting Consultant",
            "IFRS 9 Consultant",
            "Regulatory Reporting Business Analyst",
            "Model Validation Specialist",
          ],
        },
      ],
    },
    {
      slug: "lending",
      num: "07",
      title: "Lending & Credit",
      icon: "returns",
      blurb: "Origination, servicing and collections",
      roles: [
        "Lending Functional Consultant",
        "Loan Origination Consultant",
        "Lending Solution Architect",
      ],
      overview:
        "Origination gets the attention on the business case and collections gets the contractor shortage. We place lending functional consultants, origination and collections specialists, credit risk analysts and lending architects across Temenos Loan Origination, FLEXCUBE Lending and Finacle Lending and Collections.",
      tools: [
        {
          slug: "temenos-loan-origination",
          vendor: "Temenos",
          name: "Temenos Loan Origination",
          roles: [
            "Lending Functional Consultant",
            "Loan Origination Consultant",
            "Lending Solution Architect",
            "Credit Risk Business Analyst",
          ],
        },
        {
          slug: "flexcube-lending",
          vendor: "Oracle",
          vendorSlug: "oracle",
          name: "FLEXCUBE Lending",
          roles: [
            "Lending Functional Consultant",
            "Loan Origination Consultant",
            "Credit Risk Business Analyst",
            "Lending Solution Architect",
          ],
        },
        {
          slug: "finacle-lending-collections",
          vendor: "Infosys Finacle",
          name: "Finacle Lending and Collections",
          roles: [
            "Lending Functional Consultant",
            "Collections Consultant",
            "Loan Origination Consultant",
            "Credit Risk Business Analyst",
          ],
        },
      ],
    },
    {
      /* Insurance sits inside this L1 because canon §3 renders `finance` as
         Banking & Financial Services and Guidewire is one of the five platforms
         named in the hero. Kept visibly distinct from the banking functions
         rather than blurred into them. */
      slug: "insurance-platforms",
      num: "08",
      title: "Insurance Platforms",
      icon: "eor",
      blurb: "Policy, claims and billing on Guidewire",
      roles: [
        "Guidewire PolicyCenter Developer",
        "Guidewire Configuration Consultant",
        "Guidewire Solution Architect",
      ],
      overview:
        "Guidewire hiring is configuration-led, and the distinctions matter more than the platform name: the PolicyCenter developer who has done rating, the ClaimCenter developer who has done the integrations, the test automation engineer who has kept a suite alive through an upgrade. We place all of them, and the architects who hold the InsuranceSuite design together.",
      tools: [
        {
          slug: "guidewire-policycenter",
          vendor: "Guidewire",
          name: "Guidewire PolicyCenter",
          roles: [
            "Guidewire PolicyCenter Developer",
            "Guidewire Configuration Consultant",
            "Guidewire Integration Developer",
            "Guidewire Solution Architect",
          ],
        },
        {
          slug: "guidewire-claimcenter",
          vendor: "Guidewire",
          name: "Guidewire ClaimCenter",
          roles: [
            "ClaimCenter Developer",
            "Guidewire Configuration Consultant",
            "Guidewire Integration Developer",
            "Guidewire Test Automation Engineer",
          ],
        },
        {
          slug: "guidewire-billingcenter",
          vendor: "Guidewire",
          name: "Guidewire BillingCenter",
          roles: [
            "BillingCenter Developer",
            "Guidewire Configuration Consultant",
            "Guidewire Integration Developer",
            "Guidewire Solution Architect",
          ],
        },
        {
          slug: "guidewire-insurancesuite-cloud",
          vendor: "Guidewire",
          name: "Guidewire InsuranceSuite Cloud",
          roles: [
            "Guidewire Solution Architect",
            "Guidewire Configuration Consultant",
            "Guidewire Integration Developer",
            "Guidewire Test Automation Engineer",
          ],
        },
        {
          slug: "guidewire-datahub-infocenter",
          vendor: "Guidewire",
          name: "Guidewire DataHub and InfoCenter",
          roles: [
            "Guidewire Integration Developer",
            "Guidewire Solution Architect",
            "Guidewire Configuration Consultant",
            "Guidewire Test Automation Engineer",
          ],
        },
      ],
    },
    {
      slug: "migration-testing-cutover",
      num: "09",
      title: "Core Banking Migration, Testing & Cutover",
      icon: "integration",
      blurb: "Data migration, parallel run, cutover and hypercare",
      roles: [
        "Core Banking Data Migration Lead",
        "Test Manager, core banking",
        "Cutover Manager",
      ],
      overview:
        "The function banks under-scope, and the one that decides whether a core programme lands on the weekend it promised. Migration, parallel run, cutover and hypercare are separate seats with separate screening, and they are needed in a fixed order rather than all at once. We place migration leads and developers, test managers and automation engineers, cutover and hypercare leads, reconciliation analysts and environment managers.",
      tools: [
        {
          /* Categories rather than vendors throughout, as the authored source
             gives them. A named migration or test product here would be a
             platform outside the ratified five. */
          slug: "core-banking-data-migration",
          vendor: "Data migration",
          name: "Core banking data migration tooling",
          roles: [
            "Core Banking Data Migration Lead",
            "Migration Developer",
            "Reconciliation Analyst",
            "Environment Manager",
          ],
        },
        {
          slug: "core-banking-test-automation",
          vendor: "Test automation",
          name: "Test automation for core banking",
          roles: [
            "Test Manager, core banking",
            "Test Automation Engineer",
            "Environment Manager",
            "Migration Developer",
          ],
        },
        {
          slug: "reconciliation-parallel-run",
          vendor: "Cutover",
          name: "Reconciliation and parallel-run tooling",
          roles: [
            "Cutover Manager",
            "Hypercare Lead",
            "Reconciliation Analyst",
            "Test Manager, core banking",
          ],
        },
      ],
    },
  ],

  segmentsEyebrow: "Segments we support",
  segmentsTitle:
    "Every financial-services segment. Specialists who know the context.",
  segmentsSub:
    "Retail banking runs different programmes from insurance or capital markets. Our contractors understand the specific operating context — not just the platform.",
  /* SIX SEGMENTS REMOVED, 2 Aug 2026, per context-round4-rulings.md §6.5, and
     the rule that removed them is the same one that rebuilt the grid.

     A SEGMENT IS CUSTOMER-SHAPED. Procurement, IT Infrastructure, Financial
     Planning & Analytics, Data & AI and Cybersecurity for Banking are functions
     wearing a segment's clothes: none of them names a kind of bank. They were
     also, exactly, the segments that mirrored functions this desk REMOVED from
     its grid on 2 Aug (procurement, it-infra-fs, fpna, data-ai-fs,
     cybersecurity-fs), which is why a rail claiming to cover them argued a bench
     the grid does not show. Wealth & Asset Management goes with them on the same
     test and nothing else: `wealth` is on that removed list, and the hero copy
     had already been rewritten because it promised wealth the grid no longer
     carries.

     WHAT SURVIVES, and why the four function-shaped names below are NOT the same
     fault: each maps onto a function this desk publishes and staffs. Digital
     Payments is function 04, Risk & Compliance and Regulatory Compliance &
     Governance are the two halves of function 06, Treasury & Cash Management is
     05 and Lending & Loan Management is 07. The test the ruling sets is whether
     a segment maps to one of the nine published functions, and these do.

     EVERY ROLE PILL WAS SWEPT IN THE SAME PASS, which is the half that is easy
     to miss. This rail named roughly thirty vendors that appear nowhere in the
     grid: Finastra Loan IQ, nCino, Kyriba, Duck Creek, Fiserv, ACI, Marqeta,
     SAS, Wolters Kluwer, AxiomSL, MetricStream, ION, Calypso, Salesforce FSC,
     SAP TRM and more. A hero that names six platforms and a rail a screen down
     that names thirty-six is the defect, not the pill. Every title below is
     published verbatim on one of the nine functions above, so nothing here is
     invented and nothing claims a platform the desk does not staff. */
  segments: [
    {
      id: "retail-banking",
      name: "Retail Banking",
      intro:
        "Deposits, cards, mortgages and digital channels at consumer scale. Core migrations, digital onboarding and channel modernisation dominate the brief pipeline.",
      roles: [
        "Temenos Transact Consultant",
        "FLEXCUBE Functional Consultant",
        "Digital Banking Consultant",
        "Customer Onboarding and eKYC Consultant",
        "Backbase Consultant",
        "Loan Origination Consultant",
      ],
    },
    {
      id: "corporate-banking",
      name: "Corporate Banking",
      intro:
        "Cash management, trade finance and lending for corporates. Client portals, onboarding refresh and lending workflows are the constant pain points.",
      roles: [
        "Core Banking Solution Architect",
        "Lending Functional Consultant",
        "Payments Solution Architect",
        "Open Banking and API Consultant",
        "Customer Onboarding and eKYC Consultant",
        "Credit Risk Business Analyst",
      ],
    },
    {
      id: "insurance",
      name: "Insurance Services",
      intro:
        "Property and casualty, life and health carriers. Policy administration, claims and billing on Guidewire, and the configuration depth those programmes turn on.",
      roles: [
        "Guidewire PolicyCenter Developer",
        "ClaimCenter Developer",
        "BillingCenter Developer",
        "Guidewire Configuration Consultant",
        "Guidewire Integration Developer",
        "Guidewire Solution Architect",
      ],
    },
    {
      id: "investment-banking",
      name: "Investment Banking",
      intro:
        "Front, middle and back office on MX.3. Market risk, collateral and XVA are three separate hires, and a brief that asks for a Murex resource gets whichever of them is nearest.",
      roles: [
        "Murex Front Office Consultant",
        "Murex Back Office Consultant",
        "Murex Market Risk Consultant",
        "Collateral and XVA Consultant",
        "Murex MxML Developer",
        "Murex Datamart Developer",
      ],
    },
    {
      id: "digital-payments-seg",
      name: "Digital Payments",
      intro:
        "Payment hubs, the message layer around them and the regional instant-payment schemes. The message layer is the half that briefs routinely under-scope.",
      roles: [
        "Payments Solution Architect",
        "ISO 20022 Migration Consultant",
        "SWIFT Consultant",
        "Open Banking and API Consultant",
        "Digital Banking Consultant",
      ],
    },
    {
      id: "risk-compliance-seg",
      name: "Risk & Compliance",
      intro:
        "Credit, market, operational and financial-crime risk. Regulator-driven timelines and end-of-cycle audit demands. Frameworks are what a candidate is screened against and nothing here interprets one.",
      roles: [
        "OFSAA Consultant",
        "AML and Sanctions Screening Consultant",
        "Financial Crime Analyst",
        "Model Validation Specialist",
      ],
    },
    {
      id: "treasury-cash",
      name: "Treasury & Cash Management",
      intro:
        "Liquidity, collateral and bank treasury. Both the trading side and the bank side live or die on integration quality.",
      roles: [
        "Treasury Business Analyst",
        "Collateral and XVA Consultant",
        "Murex Back Office Consultant",
        "Islamic Treasury Consultant",
        "SWIFT Consultant",
      ],
    },
    {
      id: "lending-loans",
      name: "Lending & Loan Management",
      intro:
        "Origination, servicing and collections across retail, small business and corporate. Origination gets the business case and collections gets the contractor shortage.",
      roles: [
        "Lending Functional Consultant",
        "Loan Origination Consultant",
        "Collections Consultant",
        "Lending Solution Architect",
        "Credit Risk Business Analyst",
      ],
    },
    {
      id: "reg-compliance-seg",
      name: "Regulatory Compliance & Governance",
      intro:
        "Reporting to the region's central banks, Basel and IFRS 9, and the governance around the models behind it. Regulators are named and never interpreted.",
      roles: [
        "Regulatory Reporting Business Analyst",
        "Basel Reporting Consultant",
        "IFRS 9 Consultant",
        "OFSAA Consultant",
      ],
    },
  ],

  insightsEyebrow: "Insights",
  insightsTitle: "What's happening in banking & FS talent right now.",
  insightsSub:
    "Written by Sumeet Goenka and the Yallo team. Opinionated, specific, useful.",
  insights: [
    {
      href: "/insights/temenos-transact-migration-talent",
      published: false,
      category: "Core Banking",
      title:
        "Temenos Transact migrations: why the specialist bench in the Gulf has thinned in 2025.",
      excerpt:
        "Every Gulf tier-1 that moved off legacy core in the last 18 months chased the same Transact architects. What that scarcity means for your 2026 timeline.",
      author: "Yallo Talent",
      minutes: 6,
    },
    {
      href: "/insights/guidewire-claimcenter-talent",
      published: false,
      category: "Insurance",
      title:
        "Guidewire ClaimCenter contractors: the roles insurers are hiring six months too late.",
      excerpt:
        "The insurers that delivered on time last year confirmed the ClaimCenter tech lead before the vendor was even signed. The fix isn't faster hiring — it's earlier briefing.",
      author: "Yallo Talent",
      minutes: 5,
    },
    {
      href: "/insights/psd3-open-banking-2025",
      published: false,
      category: "Digital Payments",
      title:
        "PSD3 and open banking: the API and integration talent that European banks now need on the bench.",
      excerpt:
        "The rules are moving from consent to true portability. Where the integration and API architects that can actually deliver this are, and what they cost.",
      author: "Yallo Talent",
      minutes: 7,
    },
    {
      href: "/insights/aml-actimize-scarcity-2025",
      published: false,
      category: "Fin Crime",
      title:
        "AML analytics: why NICE Actimize modellers are the hardest hire in FS this year.",
      excerpt:
        "Every large bank now runs its financial-crime programme through Actimize or a Snowflake-native equivalent. What we're seeing in placement demand across the Middle East, Europe and India.",
      author: "Yallo Talent",
      minutes: 6,
    },
  ],

  relatedTitle:
    "Adjacent industries, platforms and capabilities we place into financial services.",
  related: [
    {
      href: "/industries/retail",
      label: taxonomyLabels("retail").label,
      category: "Industry",
    },
    {
      href: "/industries/manufacturing",
      label: taxonomyLabels("manufacturing").label,
      category: "Industry",
    },
    { href: "/platforms/sap", label: "SAP", category: "Platform" },
    { href: "/platforms/oracle", label: "Oracle", category: "Platform" },
    {
      href: "/platforms/salesforce",
      label: "Salesforce",
      category: "Platform",
    },
    { href: "/platforms/microsoft", label: "Microsoft", category: "Platform" },
    /* Added per context-finance-depth.md §3, which asks for these two links once
       each and in both directions. Informatica carries the migration and data
       quality work behind function 09; the blueprint carries the phase-by-phase
       staffing argument that function 09 makes in one paragraph. Neither is
       expressible through the L2 cross-link maps, which derive platform links
       from tool vendors and this function's tools are categories by design. */
    {
      href: "/platforms/informatica",
      label: "Informatica",
      category: "Platform",
    },
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
      href: "/capabilities/cybersecurity",
      label: "Cybersecurity & Risk",
      category: "Capability",
    },
  ],

  seo: {
    title:
      "Banking & Financial Services Tech Contractors · Middle East · Europe · India | Yallo Talent",
    description:
      "Temenos, FLEXCUBE, Finacle, Guidewire and Murex contractors for banking, insurance and capital-markets programmes. 72h specialist-screened shortlists across UK, Middle East and India.",
  },
};
