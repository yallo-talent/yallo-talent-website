/**
 * redirects — the legacy URL map, in one file, with two derived views.
 *
 * WHY THIS FILE EXISTS. Game plan §7 is the migration's redirect table:
 * every URL the WordPress yallo.co published, and where it lands on the new
 * tree. Until round 21 that table lived in two states — a third of it hand
 * written into `next.config.ts`, the rest only in the plan document — and
 * nothing compared the two. A map maintained in two places is a map that is
 * wrong in one of them, and the cost of being wrong is paid once, publicly,
 * at cutover.
 *
 * So the table lives here, and both consumers derive from it:
 *
 *   - `legacyLookup()` / `resolveWith()`  -> src/middleware.ts, which answers
 *   - `redirectProbes()`                  -> scripts/check-redirects.mjs, the gate
 *
 * The gate walks the probes against the running server and asserts each one
 * answers 301 to its mapped target in EXACTLY ONE HOP. Because both views come
 * from these same entries, the gate cannot drift from what the server does:
 * adding a rule adds its probe, and a rule that does not actually work fails.
 *
 * WHY THE MIDDLEWARE AND NOT `next.config.ts` `redirects()`. That is where the
 * map used to live, and measured on 7 Aug 2026 it could not do the job: Next
 * normalises a trailing slash with its own 308 before consulting `redirects()`,
 * so every legacy URL in its published form — WordPress served them all with a
 * trailing slash — took two hops. The middleware, with
 * `skipTrailingSlashRedirect` set, canonicalises first and answers once.
 *
 * PLAIN .mjs, DELIBERATELY. The middleware bundle and a `node scripts/*.mjs`
 * gate have no build step in common. A `.ts` module would need a loader in the
 * gate or a parsed second copy of the table, and a parsed copy is the exact
 * defect this file removes. `allowJs` is on, so TypeScript still type-checks
 * the call site in the middleware.
 *
 * ONE HOP IS THE WHOLE POINT. Where a legacy URL points at something that has
 * itself since moved (`/platforms/blueyonder/expertise/` -> the platform page,
 * which is now `blue-yonder`), the entry names the FINAL destination. Resolving
 * to the intermediate would be two hops, and a chain costs retrieval
 * eligibility with the real-time crawlers, per the discoverability scope §8.
 */

import {
  PUBLISHED_CASE_STUDIES,
  PUBLISHED_INSIGHTS,
} from "./published.generated.mjs";

/* ---------------------------------------------------------------------------
   0. Destinations that only exist if the content does.

   A 301 into a 404 is worse than the 404 alone: it hands the legacy URL's
   authority to a dead page. Measured on 7 Aug 2026, ten of this map's
   destinations did exactly that — every article-level `/insights/{slug}` target
   (none of the 21 insight articles is published) and five `/case-studies/{slug}`
   targets with no file behind them.

   Rather than hand-edit those rows, which would rot the moment an article is
   published, every article-level destination is resolved through these two
   helpers: the article when it resolves, the hub when it does not. Publishing
   an article is then the whole action; the map follows on the next build.
   --------------------------------------------------------------------------- */

const PUBLISHED_INSIGHT_SET = new Set(PUBLISHED_INSIGHTS);
const PUBLISHED_CASE_STUDY_SET = new Set(PUBLISHED_CASE_STUDIES);

/** The article if it is published, otherwise the knowledge hub. */
export function insightTarget(slug) {
  return PUBLISHED_INSIGHT_SET.has(slug) ? `/insights/${slug}` : "/insights";
}

/** The study if it is published, otherwise the case-studies hub. */
export function caseStudyTarget(slug) {
  return PUBLISHED_CASE_STUDY_SET.has(slug)
    ? `/case-studies/${slug}`
    : "/case-studies";
}

/* ---------------------------------------------------------------------------
   1. Live route slugs. These are the destinations, not the legacy forms.
   --------------------------------------------------------------------------- */

/**
 * The sectors the legacy site published. Education is a new desk on the new
 * tree and has no legacy URL, so it is deliberately absent: a redirect for a
 * URL that never existed is a guess, not a migration.
 */
const LEGACY_SECTORS = [
  "retail",
  "finance",
  "manufacturing",
  "government",
  "healthcare",
  "telco",
];

/** Platform slugs as the LEGACY site wrote them, including ones since moved. */
const LEGACY_PLATFORMS = [
  "sap",
  "oracle",
  "microsoft",
  "salesforce",
  "blueyonder",
  "workday",
  "servicenow",
  "aws",
];

/** Capability slugs as the LEGACY site wrote them. */
const LEGACY_CAPABILITIES = [
  "data",
  "data-ai",
  "digital",
  "digital-devops",
  "cloud",
  "integration",
  "innovation",
  "emerging-technologies",
  "cybersecurity",
];

/* ---------------------------------------------------------------------------
   2. Taxonomy moves. Canon §5 renames three disciplines, retires a fourth, and
   tidies one platform slug. Every old URL is a published one, so all of them
   301 — and every `/expertise/` child of one resolves to the same final page.
   --------------------------------------------------------------------------- */

/** Old capability slug -> the final canonical URL. */
const CAPABILITY_MOVES = {
  "data-ai": "/capabilities/data-analytics",
  data: "/capabilities/data-analytics",
  "digital-devops": "/capabilities/devops-platform-engineering",
  digital: "/capabilities/devops-platform-engineering",
  cloud: "/capabilities/cloud-infrastructure",
  integration: "/capabilities/integration-middleware",
  // AI is a named specialism, not a discipline route.
  "emerging-technologies": "/ai-talent",
  innovation: "/ai-talent",
  /* AI Talent is the seventh discipline (canon §3 amendment, 1 Aug 2026) but its
     canonical URL stays /ai-talent: it is the campaign landing path and was
     already the redirect target above. Both capability-shaped forms 301 to it, so
     a link written either way lands on the page rather than a 404, and the
     discipline has exactly one indexable URL. */
  "ai-talent": "/ai-talent",
  "artificial-intelligence": "/ai-talent",
};

/**
 * ServiceNow and AWS leave the platform set (§5). ServiceNow remains a tool
 * Yallo staffs inside sector pages — that is real capability — but it is not a
 * platform destination, and AWS folds into cloud-infrastructure.
 */
const PLATFORM_MOVES = {
  blueyonder: "/platforms/blue-yonder",
  servicenow: "/platforms",
  aws: "/capabilities/cloud-infrastructure",
};

/** Where does a legacy capability slug finally land? */
function capabilityTarget(slug) {
  return CAPABILITY_MOVES[slug] ?? `/capabilities/${slug}`;
}

/** Where does a legacy platform slug finally land? */
function platformTarget(slug) {
  return PLATFORM_MOVES[slug] ?? `/platforms/${slug}`;
}

/* ---------------------------------------------------------------------------
   3. Insights. yallo.co served articles at three nested prefixes:
   /insights/news/*, /insights/industries/retail/*, /insights/category/*.
   Every article on the new site lives at /insights/{slug}; the catch-alls at
   the end map any surviving legacy prefix to the flat form, and the explicit
   entries above them take precedence for slugs that merged, moved or retired.
   --------------------------------------------------------------------------- */

const LEGACY_INSIGHT_PREFIXES = [
  "/insights",
  "/insights/news",
  "/insights/industries/retail",
  "/insights/category",
];

const RETIRED_TO_RETAIL = [
  "septembers-biggest-shifts",
  "from-store-closures-to-ai-led-innovation-august",
  "global-retail-pulse-july-2025-highlights",
  "mid-year-momentum-shaping-the-future-of-ratail-tech",
  "17-big-moves-redefining-global-mena-ecommerce-may",
  "middle-east-retail-boom-2025-trends",
];

/**
 * Insights removed because they were not real: written in an earlier pass with
 * invented figures and an unauthorised byline. Retired to the hub rather than
 * rewritten, so no URL 404s.
 */
const INSIGHTS_WITHDRAWN = [
  "sap-talent-gcc",
  "gcc-ai-skills-gap",
  "gcc-engineering-centre-90-days",
  "sap-vs-oracle-migration",
];

const RENAMED = [
  // Merge (2a): both variants collapse into enterprise-architect-middle-east.
  {
    from: "enterprise-architect-uae-hiring",
    to: "enterprise-architect-middle-east",
  },
  {
    from: "enterprise-architect-uae-hiring-challenges",
    to: "enterprise-architect-middle-east",
  },
  // Merge (2b): duplicate title with critical-technology-roles-uae-vacancy-cost.
  {
    from: "gcc-engineering-team-scaling",
    to: "critical-technology-roles-uae-vacancy-cost",
  },
  // Slug renames: GCC -> Middle East.
  {
    from: "gcc-it-hiring-trends-2026-cio-guide",
    to: "middle-east-it-hiring-trends-2026",
  },
  {
    from: "me-india-blended-it-teams-gcc-delivery",
    to: "me-india-blended-delivery-teams",
  },
  // Legacy WordPress slug for the same article on the new tree.
  {
    from: "contract-hiring",
    to: "the-best-way-to-use-contract-hiring-during-high-demand-enterprise-projects",
  },
];

/* ---------------------------------------------------------------------------
   4. Case studies. The legacy site served most case studies as
   `?case-study=<slug>` query strings, which cannot be redirected by path alone.
   Of the 29 published entries, the ported ones keep their study; the rest fall
   into aliases and retirements, all redirected so no published URL breaks.
   --------------------------------------------------------------------------- */

/** Duplicate or stale URLs -> the canonical study. */
const CASE_STUDY_ALIASES = {
  // Same MAF Hyperion engagement, published twice.
  "implementing-hyperion-financial-management-for-majid-al-futtaim-dubai-2":
    "oracle-hyperion-financial-management-hfm-implementation",
  // Same Alshaya planning engagement, published twice.
  "decommissioning-by-planning-licenses-with-custom-built-software-for-alshaya-group-dubai":
    "engineering-a-custom-planning-platform",
  // Earlier, shorter version of the MAF time-and-materials study. Its own
  // headings name MAF, so the "unnamed enterprise" framing was cosmetic.
  "reducing-costs-and-improving-quality-with-yallo":
    "reducing-time-and-materials-cost-for-majid-al-futtaim",
  // Listed in the index but 404s on the live site.
  "reducing-tm-cost-and-improving-quality-with-yallo-for-alshaya-group-dubai":
    "reducing-time-and-materials-cost-for-majid-al-futtaim",
  // Slug tidied for readability.
  "reducing-tm-cost-and-improving-quality-for-majid-al-futtaim-with-yallo":
    "reducing-time-and-materials-cost-for-majid-al-futtaim",
  "rapid-recruitment-for-critical-supply-chain-roles-with-yallo":
    "rapid-recruitment-for-critical-supply-chain-roles",
};

/**
 * Not Yallo's work: a GDPR and incident-response teaching series about
 * Facebook, Google, Uber, Maersk, Equifax, Capital One, Target and Sony. It has
 * no place in an evidence surface for enterprise staffing, so it is retired to
 * the insights hub rather than ported.
 */
const CASE_STUDY_RETIRED = [
  "privacy-violations-and-class-action-lawsuit-facebook-2018",
  "financial-penalties-for-non-compliance-google-2019",
  "data-leaks-and-customer-trust-erosion-uber-2016",
  "operational-meltdown-from-cyber-attack-maersk-2017",
  "mega-breach-with-eye-watering-costs-equifax-2017",
  "insider-data-theft-capital-one-2019",
  "target-2013-data-breach-enterprise-governance-lessons",
  "sony-data-breach-2014-cybersecurity-ip-lessons",
];

/** Every ported study, so the legacy query-string URL reaches it. */
const CASE_STUDY_PORTED = [
  "enabling-sap-s-4hana-transformation-for-al-tayer-group",
  "rapidly-building-a-high-performing-azure-data-engineering-team",
  "enabling-azure-data-platform-delivery-at-enterprise-scale",
  "enabling-supply-chain-transformation-through-targeted-delivery-expertise",
  "oracle-hyperion-financial-management-hfm-implementation",
  "building-a-scalable-arabic-speaking-offshore-it-hub-for-al-othaim-markets",
  "defining-a-target-operating-model-for-sephora-middle-easts-digital-carve-out",
  "ensuring-reliable-oracle-ebs-integrations-for-mission-critical-enterprise-systems",
  "engineering-a-custom-planning-platform",
  "optimising-enterprise-it-delivery-through-a-unified-partner-model",
  "unlocking-cost-efficiency-across-multi-platform-enterprise-it-landscape",
  "driving-consistent-it-delivery-across-a-complex-retail-technology-landscape",
  "enabling-accurate-asset-governance-through-oracle-fusion-fixed-assets",
];

/* ---------------------------------------------------------------------------
   5. The entry list.

   Each entry is `{ source, destination, probe? , has? , why }`.

   `probe` is the concrete URL the gate requests when `source` carries a
   path parameter and so is not itself requestable. Everything else is probed
   at its own source, which is what makes the gate a test of the real config
   rather than a restatement of it.
   --------------------------------------------------------------------------- */

/** @typedef {{source: string, destination: string, probe?: string, has?: Array<{type: "query", key: string, value: string}>, why: string}} RedirectEntry */

/** @returns {RedirectEntry[]} */
function standaloneEntries() {
  /** @type {RedirectEntry[]} */
  const out = [];
  const add = (source, destination, why, extra = {}) =>
    out.push({ source, destination, why, ...extra });

  /* --- Game plan §7: consolidations and renames of standalone pages. ------ */
  add(
    "/managed-it-coe",
    "/managed-delivery",
    "The cleanest retarget on the site: the category the enterprise buyer bought under.",
  );
  add(
    "/talent-in-a-box",
    "/contract",
    "The product name dies; the URL authority is retained on contract staffing.",
  );
  add("/talent-ina-box", "/contract", "Typo variant published live.");
  add(
    "/tsea-as-a-service",
    "/managed-delivery",
    "Nearest talent equivalent. TS/EA consulting is out of scope for Yallo Talent.",
  );
  add("/tsa-as-a-service", "/managed-delivery", "Typo variant published live.");
  /* Round 22 §1 reverses round 21 §5. Game plan §8 row 7 names /intelligence
     explicitly; the §7 table row saying /insights was the contradicting entry,
     and the wrong one was propagated. Editorially the same answer: legacy white
     papers are documents, the live document family sits under /intelligence,
     and /insights is an empty hub at cutover. */
  add(
    "/white-papers",
    "/intelligence",
    "The legacy document family lands on the live one, per game plan §8 row 7.",
  );
  add(
    "/leadership-team",
    "/leadership",
    "Route already exists under a shorter slug.",
  );
  add("/about-us", "/about", "Slug tidied.");
  add(
    "/contact-us",
    "/brief",
    "Conversion becomes programme-shaped: a brief, not a contact form.",
  );
  add("/join-us", "/jobs", "One quiet punchout to the candidate side.");
  add("/join-yallo", "/jobs", "Second published form of the same page.");
  /* The one deliberate exception to "never 301 to the homepage" (game plan §7,
     ruled): /home-4/ IS a homepage, an indexable work-in-progress draft
     competing with the real one in search. Sending it anywhere else would be
     the wrong answer to a duplicate-homepage problem. */
  add(
    "/home-4",
    "/",
    "Ruled exception to the never-301-to-home rule: this page IS a draft homepage.",
  );
  add(
    "/technologies/sap",
    "/platforms/sap",
    "Two legacy paths served one page.",
  );

  /* The double-slash retail defect is NOT an entry here, and cannot be: see
     DOUBLE_SLASH_DEFECT below. Its canonical form `/industries/retail` is a
     live route, so nothing in this table needs to claim it. */

  /* --- Consumer retail, a duplicate of the retail sector. ----------------- */
  add(
    "/industries/consumer-retail",
    "/industries/retail",
    "Duplicate of retail.",
  );
  add(
    "/industries/consumer-retail/expertise",
    "/industries/retail",
    "Duplicate of retail, and the thin overview/expertise split besides.",
  );
  add(
    "/consumer-retail",
    "/industries/retail",
    "Top-level duplicate of retail.",
  );
  add(
    "/consumer-retail/expertise",
    "/industries/retail",
    "Top-level duplicate of retail, expertise split.",
  );

  /* --- The overview/expertise split, retired across all three taxonomies.
     Thin duplicate content: the expertise child said what the parent said. --- */
  for (const sector of LEGACY_SECTORS) {
    add(
      `/industries/${sector}/expertise`,
      `/industries/${sector}`,
      "Overview/expertise split is thin duplicate content.",
    );
  }
  for (const platform of LEGACY_PLATFORMS) {
    add(
      `/platforms/${platform}/expertise`,
      platformTarget(platform),
      "Expertise split, resolved straight to the platform's final URL.",
    );
  }
  for (const cap of LEGACY_CAPABILITIES) {
    add(
      `/capabilities/${cap}/expertise`,
      capabilityTarget(cap),
      "Expertise split, resolved straight to the discipline's final URL.",
    );
  }

  /* --- Taxonomy slug moves (canon §5). ----------------------------------- */
  for (const [from, to] of Object.entries(CAPABILITY_MOVES)) {
    add(
      `/capabilities/${from}`,
      to,
      "Canon §5 discipline rename or retirement.",
    );
  }
  for (const [from, to] of Object.entries(PLATFORM_MOVES)) {
    add(`/platforms/${from}`, to, "Canon §5 platform rename or retirement.");
  }

  /* --- Insights: retired, withdrawn and renamed, at every legacy prefix. -- */
  for (const slug of RETIRED_TO_RETAIL) {
    for (const prefix of LEGACY_INSIGHT_PREFIXES) {
      add(
        `${prefix}/${slug}`,
        "/industries/retail",
        "Retail commentary retired to the sector page.",
      );
    }
  }
  for (const slug of INSIGHTS_WITHDRAWN) {
    for (const prefix of LEGACY_INSIGHT_PREFIXES) {
      add(
        `${prefix}/${slug}`,
        "/insights",
        "Withdrawn insight retired to the hub.",
      );
    }
  }
  for (const { from, to } of RENAMED) {
    for (const prefix of LEGACY_INSIGHT_PREFIXES) {
      add(
        `${prefix}/${from}`,
        insightTarget(to),
        "Merged or renamed article, resolved to its canonical URL where published.",
      );
    }
  }

  return out;
}

/**
 * Case studies, in both published forms.
 *
 * `alsoPath` adds the `/case-studies/<from>` form. It must stay off for a
 * ported slug, whose path IS the destination — adding it there produces a
 * self-redirect and the real page becomes unreachable.
 *
 * @returns {RedirectEntry[]}
 */
function caseStudyEntries() {
  /** @type {RedirectEntry[]} */
  const out = [];

  const add = (from, to, why, alsoPath = true) => {
    out.push({
      source: "/",
      has: [{ type: "query", key: "case-study", value: from }],
      destination: to,
      probe: `/?case-study=${from}`,
      why,
    });
    if (alsoPath) {
      out.push({ source: `/case-studies/${from}`, destination: to, why });
    }
  };

  for (const slug of CASE_STUDY_PORTED) {
    const to = caseStudyTarget(slug);
    /* `alsoPath` stays off only while the study IS its own destination. Three of
       these slugs have no file behind them and resolve to the hub instead, and
       for those the `/case-studies/<slug>` path form needs the entry too — it is
       no longer a self-redirect, it is a real 404 that should reach the hub. */
    add(
      slug,
      to,
      "Ported study: the legacy query-string form reaches its new path.",
      to !== `/case-studies/${slug}`,
    );
  }
  for (const [from, to] of Object.entries(CASE_STUDY_ALIASES)) {
    add(
      from,
      caseStudyTarget(to),
      "Duplicate or stale URL for a canonical study.",
    );
  }
  for (const slug of CASE_STUDY_RETIRED) {
    add(slug, "/insights", "Not Yallo's work; retired to the insights hub.");
  }

  return out;
}

/**
 * Catch-alls: any surviving legacy prefix flattens to the article's own URL.
 * Applied last, so every slug-scoped entry above wins first.
 *
 * The slug is not known until the request arrives, so the published check runs
 * then, in `resolveWith`, through the same `insightTarget` the table uses. The
 * probe below carries a slug that is genuinely on the legacy site, so the gate
 * exercises the rule rather than a hypothetical.
 */
export const CATCH_ALL_PREFIXES = [
  {
    prefix: "/insights/news/",
    probe: "/insights/news/retail-technology-investment-2025",
    why: "Any surviving legacy prefix flattens to the article, or the hub.",
  },
  {
    prefix: "/insights/industries/retail/",
    probe: "/insights/industries/retail/retail-technology-investment-2025",
    why: "Any surviving legacy prefix flattens to the article, or the hub.",
  },
  {
    prefix: "/insights/category/",
    probe: "/insights/category/retail-technology-investment-2025",
    why: "Any surviving legacy prefix flattens to the article, or the hub.",
  },
];

/** @returns {RedirectEntry[]} */
function catchAllEntries() {
  return CATCH_ALL_PREFIXES.map(({ prefix, probe, why }) => ({
    source: `${prefix}:slug`,
    destination: insightTarget(probe.slice(probe.lastIndexOf("/") + 1)),
    probe,
    why,
  }));
}

/**
 * Every entry, in the order the config must apply them: specific first,
 * catch-alls last.
 *
 * @returns {RedirectEntry[]}
 */
export function redirectEntries() {
  return [...standaloneEntries(), ...caseStudyEntries(), ...catchAllEntries()];
}

/* ---------------------------------------------------------------------------
   6. The two derived views.
   --------------------------------------------------------------------------- */

/**
 * Canonicalise a raw request path the way the legacy site's URLs need reading.
 *
 * WordPress published every URL with a trailing slash, and yallo.co has a live
 * double-slash defect on the retail sector page. Both forms must reach their
 * destination in the SAME single hop as the bare form, which means normalising
 * before the lookup rather than redirecting to the normalised form first.
 */
export function canonicalPath(pathname) {
  const collapsed = pathname.replace(/\/{2,}/g, "/");
  const trimmed = collapsed.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

/**
 * The middleware view: everything needed to answer "where does this legacy URL
 * go?" in one lookup, with no scan of the table per request.
 */
export function legacyLookup() {
  /** Exact path -> final destination. */
  const exact = new Map();
  /** `?case-study=<slug>` value -> final destination. */
  const caseStudy = new Map();

  for (const entry of redirectEntries()) {
    if (entry.has) {
      const param = entry.has.find((h) => h.key === "case-study");
      if (param) caseStudy.set(param.value, entry.destination);
      continue;
    }
    if (entry.source.includes(":slug")) continue;
    exact.set(canonicalPath(entry.source), entry.destination);
  }

  return { exact, caseStudy, prefixes: CATCH_ALL_PREFIXES };
}

/**
 * Resolve a request to its final destination, or null if it is not a legacy
 * URL. `search` is the raw query string, including the leading `?`.
 */
export function resolveLegacy(pathname, search = "") {
  const { exact, caseStudy, prefixes } = legacyLookup();
  return resolveWith({ exact, caseStudy, prefixes }, pathname, search);
}

/** The per-request half of `resolveLegacy`, given a prebuilt lookup. */
export function resolveWith(lookup, pathname, search = "") {
  const path = canonicalPath(pathname);

  if (lookup.caseStudy.size > 0 && search) {
    const slug = new URLSearchParams(search).get("case-study");
    if (slug && lookup.caseStudy.has(slug)) return lookup.caseStudy.get(slug);
  }

  const hit = lookup.exact.get(path);
  if (hit) return hit;

  for (const { prefix } of lookup.prefixes) {
    if (path.startsWith(prefix)) {
      const rest = path.slice(prefix.length);
      /* The slug arrives with the request, so the published check happens here
         rather than in the table: an unpublished article's legacy URL reaches
         the hub, not a 404 carrying the old page's authority. */
      if (rest && !rest.includes("/")) return insightTarget(rest);
    }
  }

  return null;
}

/**
 * The gate view: concrete URL -> the single response it must produce.
 *
 * Every path-shaped entry is probed TWICE, bare and with the trailing slash the
 * legacy site actually published. Both must answer in one hop. That second
 * probe is the round 21 finding written down as a test: before this round every
 * trailing-slash legacy URL took two hops, because Next normalised the slash
 * with its own 308 before any redirect in the map was consulted.
 */
export function redirectProbes() {
  /** @type {Array<{from: string, to: string, why: string}>} */
  const probes = [];

  for (const entry of redirectEntries()) {
    const from = entry.probe ?? entry.source;
    let to = entry.destination;
    if (to.includes(":slug")) {
      to = to.replace(":slug", from.slice(from.lastIndexOf("/") + 1));
    }
    probes.push({ from, to, why: entry.why });

    // The published legacy form: same target, still one hop.
    if (!from.includes("?") && from !== "/") {
      probes.push({
        from: `${from}/`,
        to,
        why: `${entry.why} (trailing-slash form)`,
      });
    }
  }

  return probes;
}

/**
 * The one legacy URL that cannot be answered in a single hop, stated here
 * rather than quietly omitted from the gate.
 *
 * `/industries/retail//` is a real defect on the live WordPress site. Next
 * collapses a duplicate slash with its own 308 BEFORE the middleware or any
 * `redirects()` entry runs, and unlike the trailing slash there is no config
 * switch that defers it — `skipTrailingSlashRedirect` does not cover it and
 * `skipMiddlewareUrlNormalize` was measured on 7 Aug 2026 and changes nothing
 * here. So the URL arrives at the right page, in two hops:
 *
 *     /industries/retail//  308 ->  /industries/retail/  308 ->  /industries/retail
 *
 * The gate below asserts that chain terminates where it should, and names it as
 * the exception it is. Collapsing it to one hop needs a rule in front of the
 * app — the edge redirect at cutover — which is Sumeet's to place with the DNS
 * change, not the app's to fix.
 */
export const DOUBLE_SLASH_DEFECT = {
  from: "/industries/retail//",
  to: "/industries/retail",
  maxHops: 2,
  why: "Live double-slash defect. Next collapses duplicate slashes before any app code runs.",
};
