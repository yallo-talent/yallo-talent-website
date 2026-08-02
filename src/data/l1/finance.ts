import type { L1PageData } from "./types";

export const financeData: L1PageData = {
  slug: "finance",
  category: "industries",
  breadcrumb: [
    { label: "Industries", href: "/industries" },
    { label: "Banking & Financial Services" },
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
  sub: "Temenos, Oracle FLEXCUBE, Infosys Finacle, Guidewire and Murex specialists for core banking, Islamic banking, payments and insurance programmes across the Middle East, Europe and India. Specialist-screened for regulated-industry depth.",
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
    {
      name: "nCino Loan Origination Specialist",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "PSD2 / Open Banking Integration Architect",
      scarcity: "high",
      engagement: "contract",
    },
    {
      name: "AML / Actimize Transaction Monitoring Lead",
      scarcity: "high",
      engagement: "contract",
    },
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
  segments: [
    {
      id: "retail-banking",
      name: "Retail Banking",
      intro:
        "Deposits, cards, mortgages and digital channels at consumer scale. Core migrations, digital onboarding and channel modernisation dominate the brief pipeline.",
      roles: [
        "Temenos Transact Consultant",
        "Oracle FLEXCUBE Specialist",
        "Digital Onboarding Architect",
        "Backbase Consultant",
        "Salesforce FSC Lead",
        "Payments Integration Specialist",
        "Card Management Consultant",
        "AML Systems Lead",
        "PSD2 / Open Banking Architect",
      ],
    },
    {
      id: "corporate-banking",
      name: "Corporate Banking",
      intro:
        "Cash management, trade finance and lending for corporates. Client portals, KYC-refresh and lending workflows are constant pain points.",
      roles: [
        "Finastra Loan IQ Consultant",
        "nCino Corporate Banking Specialist",
        "Corporate Onboarding Architect",
        "SWIFT Integration Lead",
        "Trade Finance Systems Consultant",
        "Cash Management Systems Specialist",
        "SAP Treasury Consultant",
        "Kyriba Specialist",
        "Corporate Client Portal Architect",
      ],
    },
    {
      id: "wealth-asset",
      name: "Wealth & Asset Management",
      intro:
        "Portfolio management, advisor productivity and client reporting. Cross-border regulation and household-level views are the recurring differentiators.",
      roles: [
        "FIS Wealth Management Consultant",
        "Temenos WealthSuite Specialist",
        "Oracle Wealth Management Lead",
        "Advisor Portal Architect",
        "Portfolio Analytics Consultant",
        "Cross-Border Compliance Specialist",
        "Salesforce FSC Wealth Lead",
        "Reporting & Reg Consultant",
        "Alternative Assets Systems Lead",
      ],
    },
    {
      id: "insurance",
      name: "Insurance Services",
      intro:
        "P&C, life and health carriers. Policy admin migrations, claims automation and IFRS 17 reporting drive the platform selection.",
      roles: [
        "Guidewire ClaimCenter Consultant",
        "Duck Creek Policy Specialist",
        "SAP FS-PM Lead",
        "IFRS 17 Reporting Consultant",
        "Actuarial Modelling Specialist",
        "Claims Automation Architect",
        "Underwriting Systems Consultant",
        "Insurance Analytics Lead",
        "Salesforce for Insurance Specialist",
      ],
    },
    {
      id: "investment-banking",
      name: "Investment Banking",
      intro:
        "Front, middle and back-office trading. Murex/Calypso migrations, XVA and FRTB delivery need specialists with capital-markets muscle memory.",
      roles: [
        "Murex Front-Office Consultant",
        "ION Trading Specialist",
        "Calypso Software Lead",
        "FRTB / Market Risk Consultant",
        "XVA / CVA Systems Specialist",
        "Post-Trade Processing Architect",
        "Reconciliation Systems Consultant",
        "Reg Reporting for IB Lead",
        "Fixed Income Systems Specialist",
      ],
    },
    {
      id: "digital-payments-seg",
      name: "Digital Payments",
      intro:
        "Card issuing, real-time rails and merchant acquiring. Regulatory rails (ISO 20022, SEPA Inst, FedNow) demand tight programme discipline.",
      roles: [
        "Fiserv Payments Consultant",
        "ACI Worldwide Specialist",
        "Mastercard Payment Gateway Lead",
        "ISO 20022 Migration Consultant",
        "Marqeta Platform Specialist",
        "Card Management Architect",
        "Real-Time Payments Consultant",
        "PSD2 / Open Banking Specialist",
        "Merchant Acquiring Systems Lead",
      ],
    },
    {
      id: "risk-compliance-seg",
      name: "Risk & Compliance",
      intro:
        "Credit, market, operational and financial-crime risk. Regulator-driven programme cadence and end-of-cycle audit demands.",
      roles: [
        "SAS Risk Consultant",
        "Oracle FSAA Specialist",
        "Wolters Kluwer OneSumX Lead",
        "Credit Risk Modelling Consultant",
        "Market Risk Systems Specialist",
        "Operational Risk Analyst",
        "Basel III / IV Reporting Lead",
        "NICE Actimize AML Consultant",
        "GRC Programme Manager",
      ],
    },
    {
      id: "treasury-cash",
      name: "Treasury & Cash Management",
      intro:
        "Liquidity, FX and cash-flow forecasting. Corporate treasury and bank treasury programmes both live and die on integration quality.",
      roles: [
        "SAP TRM Consultant",
        "Kyriba Specialist",
        "Oracle Treasury Cloud Lead",
        "FX Systems Consultant",
        "Cash-Flow Forecasting Analyst",
        "Payments Integration Architect",
        "Bank Connectivity Specialist",
        "SWIFT Integration Consultant",
        "In-House Bank Systems Lead",
      ],
    },
    {
      id: "lending-loans",
      name: "Lending & Loan Management",
      intro:
        "Origination, servicing and collections across retail, SME and corporate. Digital onboarding and credit-decisioning are the two consistent hotspots.",
      roles: [
        "nCino Loan Origination Specialist",
        "Finastra Loan IQ Consultant",
        "Temenos Lending Lead",
        "Credit Decisioning Architect",
        "Collections Systems Specialist",
        "Servicing Platform Consultant",
        "Mortgage Origination Consultant",
        "SME Lending Systems Lead",
        "Open Banking Data Consultant",
      ],
    },
    {
      id: "cybersecurity-seg",
      name: "Cybersecurity for Banking",
      intro:
        "SOC, IAM, DLP and threat detection for regulated banks. Zero-trust programmes and payment-security uplift are the biggest bench draws.",
      roles: [
        "Palo Alto Networks Consultant",
        "IBM Security for FS Specialist",
        "Fortinet Financial Security Lead",
        "IAM / SailPoint Consultant",
        "SIEM / Splunk Architect",
        "Zero Trust Programme Consultant",
        "DLP Systems Specialist",
        "Cloud Security Consultant",
        "Threat Detection Analyst",
      ],
    },
    {
      id: "fpna-seg",
      name: "Financial Planning & Analytics",
      intro:
        "Group FP&A, product-level P&L and scenario modelling. Modernisation from Excel-heavy stacks to Anaplan/EPM is the recurring theme.",
      roles: [
        "Anaplan FS Model Builder",
        "Oracle EPM / PBCS Specialist",
        "SAP Analytics Cloud Lead",
        "Group Consolidation Consultant",
        "Scenario Modelling Analyst",
        "Product Control Systems Lead",
        "Cost Allocation Specialist",
        "Board Reporting Consultant",
        "Tableau for Finance Lead",
      ],
    },
    {
      id: "reg-compliance-seg",
      name: "Regulatory Compliance & Governance",
      intro:
        "Multi-jurisdiction reporting under FCA, PRA, DFSA, RBI and more. Wolters Kluwer and Axiom migrations continue to dominate the pipeline.",
      roles: [
        "Wolters Kluwer Reg Reporting Consultant",
        "Thomson Reuters ONESOURCE Specialist",
        "MetricStream GRC Lead",
        "AxiomSL Reporting Consultant",
        "SFTR / EMIR Reporting Specialist",
        "COREP / FINREP Consultant",
        "SEC Reporting Lead",
        "Model Governance Consultant",
        "Reg Change Programme Manager",
      ],
    },
    {
      id: "it-infra-seg",
      name: "IT Infrastructure & Operations",
      intro:
        "Cloud landing zones, ITSM and DR programmes for regulated environments. Legacy midrange to cloud rehost/replatform is the busiest track.",
      roles: [
        "ServiceNow ITSM Consultant",
        "BMC Helix Specialist",
        "Microsoft Endpoint Manager Lead",
        "AWS / Azure Landing Zone Architect",
        "Mainframe Modernisation Consultant",
        "DR / BCM Consultant",
        "Kubernetes Platform Engineer",
        "Observability / Splunk Specialist",
        "Network Modernisation Lead",
      ],
    },
    {
      id: "procurement-seg",
      name: "Procurement & Vendor Management",
      intro:
        "Third-party risk, contracts and sourcing in a regulator-watched environment. Ariba/Coupa migrations run hot every year.",
      roles: [
        "SAP Ariba Consultant",
        "Coupa Procurement Specialist",
        "Oracle Procurement Cloud Lead",
        "Third-Party Risk Consultant",
        "Contracts Systems Specialist",
        "Vendor Master Data Consultant",
        "S2P Programme Manager",
        "Category Management Analyst",
        "Sourcing Optimisation Lead",
      ],
    },
    {
      id: "data-ai-seg",
      name: "Data & AI in Financial Services",
      intro:
        "Data platform, ML models and MLOps at bank scale. Fraud, credit and personalisation use-cases dominate the specialist demand.",
      roles: [
        "Snowflake for Finance Consultant",
        "Google Cloud AI for FS Specialist",
        "Azure AI for Banking Lead",
        "Databricks Consultant",
        "Fraud ML Model Consultant",
        "Credit Risk Model Specialist",
        "MLOps Architect",
        "Data Governance Consultant",
        "Personalisation ML Lead",
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
      label: "Retail & Consumer",
      category: "Industry",
    },
    {
      href: "/industries/manufacturing",
      label: "Manufacturing & Logistics",
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
