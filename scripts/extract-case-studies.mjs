#!/usr/bin/env node
/**
 * Extracts the published case studies from saved yallo.co HTML into MDX.
 *
 * The bodies are Yallo's own published words. Nothing here rewrites,
 * paraphrases or "tightens" them. Three transformations are applied, and each
 * one is counted and reported per file so it stays reviewable:
 *
 *   1. Structural — Elementor markup to markdown, preserving the page's own
 *      heading hierarchy rather than forcing a fixed section list. The source
 *      uses at least two different templates.
 *   2. Terminology — the canon §7 banned geography terms only.
 *   3. Contamination removal — the live site has copy-paste bleed between
 *      studies (a whole "Why HFM Is Mission-Critical" section sits inside a
 *      time-and-materials staffing study). Blocks matching DROP are excluded
 *      and reported. Nothing is silently rewritten to cover it up.
 *
 * Usage:
 *   CS_SRC_DIR=/tmp/yallo-cs node scripts/extract-case-studies.mjs [--dry]
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import * as cheerio from "cheerio";

const SRC = process.env.CS_SRC_DIR || "/tmp/yallo-cs";
const OUT =
  process.env.CS_OUT_DIR || join(process.cwd(), "content", "case-studies");
const DRY = process.argv.includes("--dry");

/**
 * STOP marks the end of the case study: everything at or below it is the
 * page template's own marketing furniture.
 */
const STOP = [
  "Let YALLO Solve Your Talent Challenges",
  "How We Serve",
  "Struggling with complex IT needs",
  "©2026 YALLO",
  "YALLO’s collaboration with a leading Middle Eastern enterprise delivered",
];

/**
 * SKIP drops a single block and keeps going. These are navigation and CTA
 * widgets that Elementor interleaves with content, so treating them as a STOP
 * silently truncated whole case studies — "About Us" in a nav column was
 * ending the parse three paragraphs in.
 */
const SKIP = [
  "Contact us",
  "Contact Us",
  "About Us",
  "About us",
  "Book Now",
  "Get Started",
  "Read More",
  "TS/EA as a Service",
  "Talent in a Box",
  "Managed IT COE",
  "Managed IT CoE",
  "Strategy & Talent Unified",
  "Delivering Seamless IT Operations at Scale",
  "Empowering Business Transformation with Expert Technology Strategy",
  "Scaling Innovation with World-Class Talent",
];

/**
 * Section headings the source uses, normalised. Anything not listed is kept as
 * a sub-heading at its published level — the point is to preserve the author's
 * structure, not to impose one.
 */
const TOP_LEVEL = new Set(
  [
    "Client Context",
    "Business Objectives & Challenges",
    "YALLO's Role",
    "Outcome",
    "The Challenge",
    "How YALLO Helped",
    "The Result",
  ].map((s) => key(s)),
);

/** Canon §7. Every substitution is counted and reported. */
const TERMS = [
  [/\bGCC\b/g, "Middle East"],
  [/\bKSA\b/g, "Saudi Arabia"],
  [/\bBangalore\b/g, "Bengaluru"],
];

/**
 * Known cross-study contamination on the live site. Matched against a heading;
 * the heading and everything under it until the next heading is dropped.
 */
const DROP = [
  {
    onSlug: "reducing-time-and-materials-cost-for-majid-al-futtaim",
    heading: "Industry Context: Why HFM Is Mission-Critical",
    why: "Oracle Hyperion content pasted into a time-and-materials staffing study",
  },
];

/**
 * Language that indicates content from the Hyperion study has bled onto a page
 * about something else. Deliberately narrow: a page listing Hyperion among the
 * platforms Yallo staffs is legitimate, so the bare product name is not a flag.
 */
const BLEED = [/\bHFM\b/, /financial consolidation/i];

/**
 * Paragraphs from unrelated articles that are physically present in a case
 * study's markup on the live site. Dropped wherever they appear and reported —
 * these are not this page's content and must not be republished as if they were.
 */
const FOREIGN = [
  /Use cases of AI in retail/i,
  /smart shopping carts/i,
  /AI retail automation/i,
  /reduce checkout friction/i,
];

function key(s) {
  return s
    .replace(/​/g, "")
    .replace(/[’']/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/[^a-z& ']/g, "")
    .trim();
}

const norm = (s) => s.replace(/​/g, "").replace(/\s+/g, " ").trim();

/** Rough check that a meta description belongs to the page it sits on. */
function sharesVocabulary(a, b) {
  const words = (x) =>
    new Set(
      x
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter((w) => w.length > 4),
    );
  const wa = words(a);
  const wb = words(b);
  for (const w of wb) if (wa.has(w)) return true;
  return false;
}

const MONTHS = {
  january: "01", february: "02", march: "03", april: "04", may: "05",
  june: "06", july: "07", august: "08", september: "09", october: "10",
  november: "11", december: "12",
};

/**
 * The real publication date, from JSON-LD where present and otherwise from the
 * visible `datePublished` span. Never guessed: a page with no date is reported
 * and gets no date rather than a plausible-looking one.
 */
function publishedDate(html, $) {
  // The visible span first, and only then JSON-LD. Order matters: a
  // `?case-study=` URL renders through the homepage template, so the first
  // JSON-LD datePublished on those pages is the *site's*, not the study's —
  // reading it first stamped thirteen studies with one identical wrong date.
  const visible = norm(
    $("[itemprop=datePublished], .datePublished, [class*=datePublished]")
      .first()
      .text(),
  );
  const m = /(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/.exec(visible);
  if (m) {
    const mm = MONTHS[m[2].toLowerCase()];
    if (mm) return `${m[3]}-${mm}-${m[1].padStart(2, "0")}`;
  }

  // Path-form permalinks carry no visible span but do carry their own JSON-LD.
  const ld = /"datePublished":"(\d{4}-\d{2}-\d{2})/.exec(html);
  return ld ? ld[1] : null;
}

function extract(html, entry) {
  const $ = cheerio.load(html);

  // Read the date BEFORE stripping chrome: the visible datePublished span lives
  // inside the page hero, which the cleanup below removes.
  const date = publishedDate(html, $);

  $(
    "script,style,noscript,iframe,form,nav,header,footer," +
      ".elementskit-menu-container,.elementskit-megamenu-panel," +
      ".elementor-location-header,.elementor-location-footer",
  ).remove();

  const metaSummary = norm($('meta[name="description"]').attr("content") || "");

  // The source uses at least two Elementor templates and neither maps cleanly
  // onto HTML tags: body copy appears as bare text in a widget container on one
  // and as <p> on the other. So walk the document once and emit every *leaf*
  // block — an element that matches BLOCKISH and contains no descendant that
  // also matches. That is template-agnostic and cannot lose a section.
  const BLOCKISH =
    "h1,h2,h3,h4,h5,h6,p,li,.elementor-widget-container,.elementor-text-editor";
  const blocks = [];
  const seen = new Set();

  $(BLOCKISH).each((_, el) => {
    const $el = $(el);
    if ($el.find(BLOCKISH).length) return; // not a leaf
    const text = norm($el.text());
    if (!text || text.length < 3 || seen.has(text)) return;
    seen.add(text);
    const heading = /^h[1-6]$/.test(el.tagName.toLowerCase())
      ? el.tagName.toLowerCase()
      : $el.closest("h1,h2,h3,h4,h5,h6").length
        ? $el.closest("h1,h2,h3,h4,h5,h6").get(0).tagName.toLowerCase()
        : el.tagName.toLowerCase() === "li"
          ? "li"
          : "p";
    blocks.push({ tag: heading, text });
  });

  const title = norm(
    $("h1").first().text() ||
      // Two pages have an empty H1; their real title is the H2 after
      // "Case Study".
      blocks.find((b) => /^h[12]$/.test(b.tag) && b.text !== "Case Study")
        ?.text ||
      $("title")
        .first()
        .text()
        .replace(/\s*[-|]\s*Yallo\s*$/i, ""),
  );

  const out = [];
  let deck = "";
  let stopped = false;
  let dropping = null;
  const dropped = [];
  const bleed = [];
  const foreign = [];

  for (const b of blocks) {
    if (STOP.some((p) => b.text.startsWith(p))) {
      stopped = true;
      continue;
    }
    if (stopped) continue;
    if (SKIP.some((p) => b.text === p)) continue;
    if (FOREIGN.some((re) => re.test(b.text))) {
      foreign.push(b.text.slice(0, 70));
      continue;
    }
    if (b.text === "Case Study" || b.text === title) continue;

    const isLabel = TOP_LEVEL.has(key(b.text));
    // Template A styles its section labels as paragraphs rather than headings,
    // so a label has to be recognised by its text, not its tag.
    const isHeading = /^h[1-6]$/.test(b.tag) || isLabel;

    if (isHeading) {
      // Close an active drop when the next heading arrives.
      if (dropping) dropping = null;
      const hit = DROP.find(
        (d) => d.onSlug === entry.slug && b.text.startsWith(d.heading),
      );
      if (hit) {
        dropping = hit;
        dropped.push(`${b.text} (${hit.why})`);
        continue;
      }
    }
    if (dropping) continue;

    // The first heading before any top-level section is the page's deck.
    if (isHeading && !deck && !isLabel && !out.length) {
      deck = b.text;
      continue;
    }

    if (BLEED.some((re) => re.test(b.text)) && !/hyperion/i.test(entry.platform)) {
      bleed.push(b.text.slice(0, 90));
    }

    out.push(isHeading ? { tag: isLabel ? "h2" : "h3", text: b.text } : b);
  }

  // Prefer the page's own opening paragraph over the meta description: the
  // published descriptions are unreliable (one belongs to an unrelated article
  // about smart shopping carts). The first paragraph IS the client context,
  // which is what a summary should say anyway.
  const firstPara = out.find((b) => b.tag === "p" && b.text.length > 80)?.text;
  const summary = firstPara || metaSummary;
  const metaDiscarded =
    firstPara && metaSummary && !sharesVocabulary(metaSummary, title)
      ? metaSummary.slice(0, 70)
      : null;

  return {
    title,
    deck,
    summary,
    date,
    blocks: out,
    dropped,
    bleed,
    foreign,
    metaDiscarded,
  };
}

function wrap(s, n) {
  const lines = [];
  let line = "";
  for (const w of s.split(/\s+/)) {
    if (`${line} ${w}`.trim().length > n) {
      lines.push(line.trim());
      line = w;
    } else line += ` ${w}`;
  }
  if (line.trim()) lines.push(line.trim());
  return lines;
}

function toMdx(parsed, meta) {
  const swaps = [];
  const sweep = (s) =>
    TERMS.reduce(
      (acc, [re, to]) =>
        acc.replace(re, (m) => {
          swaps.push(`${m} -> ${to}`);
          return to;
        }),
      s,
    );

  const body = [];
  for (const b of parsed.blocks) {
    if (b.tag === "h2") body.push(`## ${sweep(b.text)}`, "");
    else if (b.tag === "h3") body.push(`### ${sweep(b.text)}`, "");
    else if (b.tag === "li") body.push(`- ${sweep(b.text)}`);
    else body.push("", sweep(b.text), "");
  }

  const words = body.join(" ").split(/\s+/).length;

  const fm = [
    "---",
    `title: ${JSON.stringify(sweep(parsed.title))}`,
    `slug: ${meta.slug}`,
    ...(parsed.deck ? [`deck: ${JSON.stringify(sweep(parsed.deck))}`] : []),
    "summary: >-",
    ...wrap(sweep(parsed.summary), 74).map((l) => `  ${l}`),
    `client: ${JSON.stringify(meta.client)}`,
    `clientPublic: ${meta.client.startsWith("Undisclosed") ? "false" : "true"}`,
    `platform: ${JSON.stringify(meta.platform)}`,
    `region: ${JSON.stringify(meta.region)}`,
    `engagement: ${JSON.stringify(meta.engagement)}`,
    // The schema's display category; the engagement model is the truthful one.
    `category: ${JSON.stringify(meta.engagement)}`,
    // House byline, confirmed 30 July 2026. No individual attribution.
    "author: Yallo Talent",
    `date: ${meta.date}`,
    ...(meta.featured ? [`featured: ${meta.featured}`] : []),
    `readingTimeMinutes: ${Math.max(2, Math.round(words / 200))}`,
    "published: true",
    `sourceUrl: ${JSON.stringify(meta.sourceUrl)}`,
    "---",
    "",
  ];

  return {
    mdx: `${fm.join("\n")}${body.join("\n").replace(/\n{3,}/g, "\n\n").trim()}\n`,
    swaps,
    words,
  };
}

// ---------------------------------------------------------------------------
// The register. Duplicates, the 404, and the non-Yallo teaching series are
// excluded here rather than filtered later, so the decision is visible in one
// place and every excluded URL can be given a 301.
//
// There is no `date` here on purpose — it is read from the published page.
// `featured` is canon's homepage rail order (relay §8); everything else appears
// on the hub in date order.
// ---------------------------------------------------------------------------
const REGISTER = [
  { source: "enabling-sap-s-4hana-transformation-for-al-tayer-group", slug: "enabling-sap-s-4hana-transformation-for-al-tayer-group", client: "Al Tayer Group", platform: "SAP S/4HANA", region: "UAE", engagement: "Contract", featured: 1 },
  { source: "rapidly-building-a-high-performing-azure-data-engineering-team", slug: "rapidly-building-a-high-performing-azure-data-engineering-team", client: "Alshaya Group", platform: "Microsoft Azure", region: "Middle East", engagement: "Contract", featured: 2 },
  { source: "enabling-azure-data-platform-delivery-at-enterprise-scale", slug: "enabling-azure-data-platform-delivery-at-enterprise-scale", client: "Alshaya Group", platform: "Microsoft Azure", region: "Middle East", engagement: "Contract" },
  { source: "rapid-recruitment-for-critical-supply-chain-roles-with-yallo", slug: "rapid-recruitment-for-critical-supply-chain-roles", client: "Chalhoub Group", platform: "Supply chain", region: "Middle East", engagement: "Contract", featured: 3 },
  { source: "enabling-supply-chain-transformation-through-targeted-delivery-expertise", slug: "enabling-supply-chain-transformation-through-targeted-delivery-expertise", client: "Chalhoub Group", platform: "Supply chain", region: "Middle East", engagement: "Managed Delivery" },
  { source: "oracle-hyperion-financial-management-hfm-implementation", slug: "oracle-hyperion-financial-management-hfm-implementation", client: "Majid Al Futtaim", platform: "Oracle Hyperion", region: "UAE", engagement: "Managed Delivery", featured: 4 },
  { source: "building-a-scalable-arabic-speaking-offshore-it-hub-for-al-othaim-markets", slug: "building-a-scalable-arabic-speaking-offshore-it-hub-for-al-othaim-markets", client: "Al Othaim Markets", platform: "Offshore delivery centre", region: "Saudi Arabia", engagement: "Managed Delivery", featured: 5 },
  { source: "defining-a-target-operating-model-for-sephora-middle-easts-digital-carve-out", slug: "defining-a-target-operating-model-for-sephora-middle-easts-digital-carve-out", client: "Sephora Middle East", platform: "Target operating model", region: "UAE", engagement: "Advisory", featured: 6 },
  { source: "ensuring-reliable-oracle-ebs-integrations-for-mission-critical-enterprise-systems", slug: "ensuring-reliable-oracle-ebs-integrations-for-mission-critical-enterprise-systems", client: "Tata Consultancy Services", platform: "Oracle E-Business Suite", region: "Saudi Arabia", engagement: "Contract", featured: 7 },
  { source: "engineering-a-custom-planning-platform", slug: "engineering-a-custom-planning-platform", client: "Alshaya Group", platform: "Custom planning platform", region: "Kuwait, UAE", engagement: "Managed Delivery", featured: 8 },
  { source: "optimising-enterprise-it-delivery-through-a-unified-partner-model", slug: "optimising-enterprise-it-delivery-through-a-unified-partner-model", client: "Majid Al Futtaim", platform: "Multi-platform", region: "UAE", engagement: "Managed Delivery" },
  { source: "unlocking-cost-efficiency-across-multi-platform-enterprise-it-landscape", slug: "unlocking-cost-efficiency-across-multi-platform-enterprise-it-landscape", client: "Majid Al Futtaim", platform: "Multi-platform", region: "UAE", engagement: "Managed Delivery" },
  { source: "reducing-tm-cost-and-improving-quality-for-majid-al-futtaim-with-yallo", slug: "reducing-time-and-materials-cost-for-majid-al-futtaim", client: "Majid Al Futtaim", platform: "Multi-platform", region: "UAE", engagement: "Managed Delivery" },
  { source: "driving-consistent-it-delivery-across-a-complex-retail-technology-landscape", slug: "driving-consistent-it-delivery-across-a-complex-retail-technology-landscape", client: "Alshaya Group", platform: "Multi-platform", region: "Middle East", engagement: "Managed Delivery" },
  // The published page does not name the client. It must not be guessed.
  { source: "enabling-accurate-asset-governance-through-oracle-fusion-fixed-assets", slug: "enabling-accurate-asset-governance-through-oracle-fusion-fixed-assets", client: "Undisclosed enterprise", platform: "Oracle Fusion", region: "Middle East", engagement: "Managed Delivery" },
];

/** source slug -> canonical slug. Every one gets a 301. */
export const REDIRECTS = {
  // Same MAF Hyperion engagement, published twice.
  "implementing-hyperion-financial-management-for-majid-al-futtaim-dubai-2":
    "oracle-hyperion-financial-management-hfm-implementation",
  // Same Alshaya planning engagement, published twice.
  "decommissioning-by-planning-licenses-with-custom-built-software-for-alshaya-group-dubai":
    "engineering-a-custom-planning-platform",
  // Shorter earlier version of the MAF time-and-materials study; its own
  // headings name MAF, so the "unnamed enterprise" framing was cosmetic.
  "reducing-costs-and-improving-quality-with-yallo":
    "reducing-time-and-materials-cost-for-majid-al-futtaim",
  "reducing-tm-cost-and-improving-quality-with-yallo-for-alshaya-group-dubai":
    "reducing-time-and-materials-cost-for-majid-al-futtaim",
};

/** Not Yallo's work — a GDPR/incident teaching series. Retired, not ported. */
export const NOT_OUR_WORK = [
  "privacy-violations-and-class-action-lawsuit-facebook-2018",
  "financial-penalties-for-non-compliance-google-2019",
  "data-leaks-and-customer-trust-erosion-uber-2016",
  "operational-meltdown-from-cyber-attack-maersk-2017",
  "mega-breach-with-eye-watering-costs-equifax-2017",
  "insider-data-theft-capital-one-2019",
  "target-2013-data-breach-enterprise-governance-lessons",
  "sony-data-breach-2014-cybersecurity-ip-lessons",
];

if (!DRY) mkdirSync(OUT, { recursive: true });

/** Used only where the source genuinely carries no date. Reported, not hidden. */
const PORT_DATE = "2026-07-30";
const missingDate = [];
const report = [];
for (const entry of REGISTER) {
  const html = readFileSync(join(SRC, `${entry.source}.html`), "utf8");
  const parsed = extract(html, entry);
  const { mdx, swaps, words } = toMdx(parsed, {
    ...entry,
    // The real published date, never a plausible substitute.
    date: parsed.date ?? PORT_DATE,
    sourceUrl: `https://www.yallo.co/?case-study=${entry.source}`,
  });
  if (!parsed.date) missingDate.push(entry.slug);
  if (!DRY) writeFileSync(join(OUT, `${entry.slug}.mdx`), mdx);
  report.push({ ...entry, words, swaps: swaps.length, ...parsed });
}

console.log(`${report.length} case studies ${DRY ? "parsed" : "written"}\n`);
let flags = 0;
for (const r of report) {
  const h2 = r.blocks.filter((b) => b.tag === "h2").length;
  console.log(
    `${String(r.words).padStart(4)}w  ${String(h2).padStart(2)} sections  ${r.swaps ? `${r.swaps} swap  ` : "        "}${r.slug}`,
  );
  if (!r.deck) console.log("      · no deck");
  if (r.words < 120) {
    console.log(`      ! very short (${r.words}w) — check the parse`);
    flags++;
  }
  for (const d of r.dropped) console.log(`      ✂ dropped: ${d}`);
  for (const f of r.foreign) {
    console.log(`      ✂ dropped foreign paragraph: "${f}…"`);
    flags++;
  }
  if (r.metaDiscarded) {
    console.log(`      ! meta description does not match this page, discarded: "${r.metaDiscarded}…"`);
    flags++;
  }
  for (const b of r.bleed) {
    console.log(`      ! possible cross-study bleed: "${b}"`);
    flags++;
  }
}
if (missingDate.length) {
  console.log(
    `\n! no publication date in the source for ${missingDate.length} page(s); ` +
      `they carry the port date ${PORT_DATE}:\n  ${missingDate.join("\n  ")}`,
  );
}
console.log(
  `\n${Object.keys(REDIRECTS).length} duplicate/stale URLs to 301, ${NOT_OUR_WORK.length} non-Yallo pages to retire.`,
);
console.log(flags ? `${flags} item(s) need a human decision.` : "No open flags.");
