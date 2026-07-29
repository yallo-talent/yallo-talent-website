import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";
import TurndownService from "turndown";

const SRC_DIR = process.env.INSIGHTS_SRC_DIR || "/tmp/yallo-fetch";
const OUT_DIR = process.env.INSIGHTS_OUT_DIR || join(SRC_DIR, "extracted");
mkdirSync(OUT_DIR, { recursive: true });

const authorMap = {
  tanzilulahmed: "Tanzil Ul Ahmed",
  yxpress: "Yallo Editorial",
  interns: "Yallo Interns",
  raphy: "Raphy Varghese",
};

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
  emDelimiter: "_",
});

// Strip WordPress/Elementor cruft that turns into noise in markdown.
turndown.remove(["script", "style", "noscript", "iframe", "form"]);

const KNOWN_SLUGS = new Set(
  readFileSync(join(SRC_DIR, "slugs.txt"), "utf8")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .concat(["the-best-way-to-use-contract-hiring-during-high-demand-enterprise-projects"]),
);
const files = readdirSync(SRC_DIR).filter(
  (f) => f.endsWith(".html") && KNOWN_SLUGS.has(f.replace(/\.html$/, "")),
);

const results = [];
for (const filename of files) {
  const slug = filename.replace(/\.html$/, "");
  const html = readFileSync(join(SRC_DIR, filename), "utf8");
  const $ = cheerio.load(html);

  const htmlTitle = ($("title").first().text() || "")
    .replace(/\s*[-|]\s*Yallo\s*$/i, "")
    .trim();
  const rawTitle =
    $("h1.elementor-heading-title").first().text().trim() ||
    $("h1").first().text().trim() ||
    htmlTitle;
  const description = $('meta[name="description"]').attr("content") || "";
  const publishedIso =
    $('meta[property="article:published_time"]').attr("content") || "";
  const date = publishedIso.slice(0, 10);

  const authorRaw = /\"author\":\{[^}]*\"name\":\"([^\"]+)\"/.exec(html)?.[1] || "";
  const author = authorMap[authorRaw] || authorRaw;

  // Elementor content lives in .elementor-widget-container inside the main
  // page column. Take every text-editor widget's inner HTML.
  const bodyParts = [];
  $(".elementor-widget-text-editor .elementor-widget-container").each(
    (_, el) => {
      const chunk = $(el).html();
      if (chunk) bodyParts.push(chunk);
    },
  );
  const bodyHtml = bodyParts.join("\n");
  const bodyMd = turndown.turndown(bodyHtml).trim();

  const readingTimeMinutes = Math.max(
    3,
    Math.round(bodyMd.split(/\s+/).length / 220),
  );

  const payload = {
    slug,
    title: rawTitle,
    description,
    date,
    author,
    readingTimeMinutes,
    bodyMd,
  };
  writeFileSync(
    join(OUT_DIR, `${slug}.json`),
    JSON.stringify(payload, null, 2),
  );
  results.push({ slug, title: rawTitle, author, readingTimeMinutes, wordCount: bodyMd.split(/\s+/).length });
}

console.log(JSON.stringify(results, null, 2));
