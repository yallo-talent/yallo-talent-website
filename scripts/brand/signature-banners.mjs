import { Resvg } from "@resvg/resvg-js";
import { writeFileSync, mkdirSync } from "node:fs";
import { pathToFileURL } from "node:url";

/* Tokens measured from src/app/globals.css Layer 1. Geometry from
   public/logos/yallo-flower.svg. Copy ratified by Sumeet, 8 Aug 2026. */
export const T = {
  paper2: "#f3f3f2", rule: "#cdcbc3", ink: "#171718", ink2: "#3b3b3d", ink3: "#5d5d60",
  gold: "#d4a843", goldDeep: "#906e16", goldInk: "#725612", goldWash: "#f2e9d2",
  dk2: "#16171a", dkLine: "#2b2b2b", dkTxt: "#e5e5e5", dkTxt2: "#afafaf", dkTxt3: "#939393",
  mulberry: "#8e62ad", indigoD: "#5677b3",
};
const F = { disp: "Newsreader Display SemiBold", bodyMed: "Inter Text Medium", mono: "IBM Plex Mono", monoMed: "IBM Plex Mono Medium" };
const FLOWER = `<path d="M19.6,214.3c0-32.4,26.1-58.7,58.3-58.7h58.3v58.7c0,32.4-26.1,58.7-58.3,58.7s-58.3-26.3-58.3-58.7Z"/>
<path d="M272.5,78.9c0,32.4-26.1,58.7-58.3,58.7h-58.3v-58.7c0-32.4,26.1-58.7,58.3-58.7s58.3,26.3,58.3,58.7Z"/>
<path d="M19.6,78.9c0,32.4,26.1,58.7,58.3,58.7h58.3v-58.7c0-32.4-26.1-58.7-58.3-58.7s-58.3,26.3-58.3,58.7Z"/>
<path d="M272.5,214.3c0-32.4-26.1-58.7-58.3-58.7h-58.3v58.7c0,32.4,26.1,58.7,58.3,58.7s58.3-26.3,58.3-58.7Z"/>`;
const flower = (x, y, size, fill, op = 1) =>
  `<g transform="translate(${x},${y}) scale(${size / 300})" fill="${fill}" fill-opacity="${op}" fill-rule="evenodd">${FLOWER}</g>`;
const petalChip = (cx, cy, size, fill, op = 1) =>
  `<g transform="rotate(180 ${cx} ${cy})"><path transform="translate(${cx - size / 2},${cy - size / 2}) scale(${size / 117})" fill="${fill}" fill-opacity="${op}" fill-rule="evenodd" d="M0,58.7C0,26.3,26.1,0,58.3,0h58.3v58.7c0,32.4-26.1,58.7-58.3,58.7S0,91.1,0,58.7Z"/></g>`;
const mono = (x, y, s, t, fill, ls, anchor = "start", fam = F.mono) =>
  `<text x="${x}" y="${y}" font-family="${fam}" font-size="${s}" fill="${fill}" letter-spacing="${ls}" text-anchor="${anchor}">${t}</text>`;

export const W = 600, H = 170;
const r = 44;
const card = (bg, border) =>
  `<path d="M0.5,0.5 H${W - 0.5} V${H - r - 0.5} Q${W - 0.5},${H - 0.5} ${W - r - 0.5},${H - 0.5} H0.5 Z" fill="${bg}" stroke="${border}" stroke-width="1"/>`;
const lockup = (dark) => `
  ${flower(28, 30, 30, T.gold, 1)}
  <text x="68" y="54" font-family="${F.disp}" font-size="27" fill="${dark ? T.gold : T.goldInk}" letter-spacing="-0.4">Yallo</text>
  <rect x="142" y="34" width="1.3" height="21" fill="${dark ? T.gold : T.goldDeep}"/>
  ${mono(154, 50, 13, "TALENT", dark ? T.dkTxt2 : T.ink3, 1.8, "start", F.monoMed)}`;

export function make({ dark, line1, line2, url, meta, chipKind, accent, twoLine }) {
  const txt = dark ? T.dkTxt : T.ink2, sub = dark ? T.dkTxt3 : T.ink3;
  const urlFill = dark ? T.gold : T.goldInk;
  const cx = W - 66, cy = H - 68;
  let chipArt = "";
  if (chipKind === "72h-light")
    chipArt = `${petalChip(cx, cy, 96, T.goldWash)}${petalChip(cx, cy, 96, T.gold, 0.12)}
      <text x="${cx}" y="86" font-family="${F.disp}" font-size="30" fill="${T.ink}" text-anchor="middle">72h</text>
      ${mono(cx, 107, 11, "BRIEF TO", T.goldInk, 1.2, "middle", F.monoMed)}
      ${mono(cx, 123, 11, "SHORTLIST", T.goldInk, 1.2, "middle", F.monoMed)}`;
  if (chipKind === "72h-dark")
    chipArt = `${petalChip(cx, cy, 96, T.gold)}
      <text x="${cx}" y="86" font-family="${F.disp}" font-size="30" fill="${T.ink}" text-anchor="middle">72h</text>
      ${mono(cx, 107, 11, "BRIEF TO", T.ink, 1.2, "middle", F.monoMed)}
      ${mono(cx, 123, 11, "SHORTLIST", T.ink, 1.2, "middle", F.monoMed)}`;
  if (chipKind === "flower")
    chipArt = `${petalChip(cx, cy, 96, accent, dark ? 0.28 : 0.16)}
      ${flower(cx - 17, cy - 27, 34, T.gold, 1)}
      ${mono(cx, cy + 26, 11, dark ? "IN-REGION" : "AI TALENT", dark ? T.dkTxt2 : T.goldInk, 1.2, "middle", F.monoMed)}`;
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  ${card(dark ? T.dk2 : T.paper2, dark ? T.dkLine : T.rule)}
  ${chipArt}
  ${lockup(dark)}
  <text x="28" y="${twoLine ? 92 : 97}" font-family="${F.bodyMed}" font-size="16" fill="${txt}">${line1}</text>
  <text x="28" y="${twoLine ? 114 : 119}" font-family="${F.bodyMed}" font-size="16" fill="${dark ? T.gold : T.goldDeep}">${line2}</text>
  ${twoLine
    ? mono(28, 138, 13, url, urlFill, 0.3, "start", F.monoMed) + mono(28, 158, 11.5, meta, sub, 0.8)
    : mono(28, 148, 13, url, urlFill, 0.3, "start", F.monoMed) + mono(28 + url.length * 8.2 + 18, 148, 12.5, meta, sub, 1.0)}
</svg>`;
}

export const variants = {
  "light-72h-shortlist": { dark: false, line1: "Get contract specialists", line2: "shortlisted in 72 hours.", url: "yallo.co", meta: "MIDDLE EAST \u00b7 EUROPE \u00b7 INDIA", chipKind: "72h-light" },
  "light-ai-talent": { dark: false, line1: "The AI talent nobody", line2: "else can find.", url: "yallo.co/ai-talent", meta: "AGENTIC AI \u00b7 LLM \u00b7 MLOPS", chipKind: "flower", accent: T.mulberry },
  "dark-measured": { dark: true, line1: "Three screened candidates", line2: "from a complete brief.", url: "yallo.co", meta: "SAP \u00b7 ORACLE \u00b7 MICROSOFT \u00b7 SALESFORCE \u00b7 AWS \u00b7 AZURE \u00b7 GCP", chipKind: "72h-dark", twoLine: true },
  "dark-corridor": { dark: true, line1: "Enterprise platform programmes,", line2: "staffed in-region.", url: "yallo.co", meta: "LONDON \u00b7 DUBAI \u00b7 RIYADH \u00b7 BENGALURU", chipKind: "flower", accent: T.indigoD },
};
/* Resolved against this file, not the shell's cwd: the sibling GIF generator
   imports these and must render the same faces from wherever it is run. A
   substituted system font is a different brand, not a fallback, so the list
   stays explicit and loadSystemFonts stays off. */
export const fontFiles = ["Newsreader-600.ttf", "Newsreader-500.ttf", "Inter-450.ttf", "Inter-550.ttf", "PlexMono-Regular.ttf", "PlexMono-Medium.ttf"]
  .map((f) => new URL(`fonts/${f}`, import.meta.url).pathname);

/* One render path for the PNGs and every GIF frame. Two would drift. */
export const renderVariant = (cfg, zoom) =>
  new Resvg(make(cfg), { fitTo: { mode: "zoom", value: zoom }, font: { fontFiles, loadSystemFonts: false, defaultFontFamily: "Inter Text" } }).render();

const outDir = new URL("../../public/images/email/", import.meta.url).pathname;

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  mkdirSync(outDir, { recursive: true });
  for (const [name, cfg] of Object.entries(variants)) {
    writeFileSync(`${outDir}signature-${name}.png`, renderVariant(cfg, 2).asPng());
    console.log("wrote", `${outDir}signature-${name}.png`);
  }
}
