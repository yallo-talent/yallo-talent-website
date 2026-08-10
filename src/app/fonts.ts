import { IBM_Plex_Mono, Inter, Newsreader } from "next/font/google";

/**
 * The three faces, declared once and shared by both root layouts.
 *
 * WHY THIS FILE EXISTS — R-27.2. `/admin` has its own root layout now, and a
 * root layout owns `<html>`, which is where the font variables live. Two root
 * layouts each calling `next/font` would be two declarations of the same faces
 * with the same options: `next/font` would resolve them to the same files, but
 * the reasoning for each face — why mono is not preloaded, why italic is split
 * to one weight — would exist in two places and drift the first time one was
 * edited. Declared at module scope here, which is what `next/font` requires,
 * and imported by both.
 *
 * Three faces, divided strictly by job: serif asserts, sans is read, mono was
 * measured. Newsreader carries optical sizing, so it holds at 72px without the
 * brittleness a display serif would show.
 */
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal"],
  display: "swap",
});

/* round13-scope.md §4.5. `[MEASURED]` twice, independently: italic renders at
   weight 600 only, 3 nodes, on exactly two routes (Hero.tsx and Close.tsx on
   /, the platform hero's <em> on every /platforms/[platform] page) — a
   third of the whole preload budget (63.0 KiB) to carry a variable font's
   full 400-600 x normal-and-italic range for two short phrases. Split to a
   second declaration at exactly the weight and style actually used. Still
   preloaded, deliberately: both known instances are above the fold, so
   `preload: false` would trade a flash of fallback italic for bytes this
   split already recovers without one. */
const newsreaderItalic = Newsreader({
  variable: "--font-newsreader-italic",
  subsets: ["latin"],
  weight: ["600"],
  style: ["italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

/* NOT preloaded, and the reason is measurable. The LCP element is a text node on
   all eight measured routes — hero lede, hero sub or hero title — so LCP waits
   on font and CSS delivery, and every byte preloaded ahead of it competes with
   the byte that actually paints. Mono renders only small data labels: eyebrows,
   metric units, table column heads. None of them is ever the LCP element, and
   none is above the fold on any route measured. `display: swap` means the label
   paints immediately in the fallback and reflows to Plex when it arrives, and
   these labels are short enough that the swap is not a visible jolt — CLS
   measured 0.000 on eight of eight routes before and after this change.
   Two static faces, 19.6 KiB of the 186 KiB preload budget. */
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  preload: false,
});

/** Every font variable plus `antialiased`, for an `<html>` className. */
export const FONT_CLASSNAMES = `${newsreader.variable} ${newsreaderItalic.variable} ${inter.variable} ${plexMono.variable} antialiased`;
