import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter, Newsreader } from "next/font/google";
import { AssistantLauncherMount } from "@/components/layout/AssistantLauncherMount";
import { Footer } from "@/components/layout/Footer";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { NavBar } from "@/components/layout/NavBar";
import { StickyBriefCTA } from "@/components/layout/StickyBriefCTA";
import { AMBIENT_SCHEME, DEFAULT_THEME, themeInitScript } from "@/config/theme";
import { organisationJsonLd, websiteJsonLd } from "@/lib/jsonld";
import "./globals.css";

/* Three faces, divided strictly by job: serif asserts, sans is read, mono was
   measured. Newsreader carries optical sizing, so it holds at 72px without the
   brittleness a display serif would show. */
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

/**
 * The description does NOT enumerate the platform set, per
 * context-round6-rulings.md §6.4, and the reason is the reason the derivation
 * exists in code.
 *
 * It read "Enterprise platforms: SAP, Oracle, Microsoft, Salesforce, Blue
 * Yonder, Workday" — six of the seven, missing Informatica, ratified on 1
 * August. That is the same defect round 5 closed across six live copies of the
 * platform list, sitting in the one string every crawler reads first. A meta
 * description that enumerates a taxonomy goes stale the moment canon amends it,
 * and the fix is not to add the seventh name: it is to stop counting.
 */
export const metadata: Metadata = {
  title: "Yallo Talent: Contract, Permanent, EOR, Managed Delivery",
  description:
    "Specialist-screened shortlists in 72 hours. Middle East · Europe. Enterprise platform programmes staffed at module level, not at vendor level.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GB"
      data-theme={DEFAULT_THEME}
      data-ambient={AMBIENT_SCHEME}
      /* No `h-full` on <html>, and this is the sticky-header fix rather than
          tidying. `h-full` sets html to height:100% — measured at 800px against
          7740px of content — so the header's sticky containing block was one
          viewport tall and it unstuck after the first screen, leaving the L1
          sub-nav pinned at 68px with nothing above it. That is the "floats
          mid-way on scroll-up" bug: the sub-nav was correct all along and the
          header was not. body keeps min-h-full, which is what the full-height
          layout actually needed. */
      className={`${newsreader.variable} ${newsreaderItalic.variable} ${inter.variable} ${plexMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: pre-hydration theme script — trusted static string built in src/config/theme.ts, sets data-theme on <html> before first paint to prevent a flash of the wrong register
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        {/* Organisation and the four legal entities. Deliberately carries no
            street address or telephone: those facts are not established, and
            fabricated LocalBusiness detail is exactly the wrong thing to feed
            a search engine. */}
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD built from typed data in src/lib/jsonld.ts, serialised with JSON.stringify
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organisationJsonLd(), websiteJsonLd()]),
          }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <MotionProvider>
          <NavBar />
          {/* round14-scope.md §2.3: mounted here, right after the nav, rather
              than after Footer and StickyBriefCTA where it sat before. The
              launcher is fixed-position, so DOM order carries no screen
              position — moving it costs nothing visually and collapses the
              keyboard distance from 77-84 Tab stops (measured from a fresh
              homepage load, after the nav and every piece of page content)
              to a handful, right after the nav's own stops. Renders null
              when the flag is off, so this is a no-op on the shipped site
              until cutover. */}
          <AssistantLauncherMount />
          {/* tabIndex -1 so the skip link MOVES FOCUS rather than only scrolling.
              Measured before: activeElement stayed on <body>, and Chromium's
              sequential-focus starting point happened to rescue traversal — which
              is luck, not conformance. scroll-margin-top clears the sticky header,
              which had been burying the hero eyebrow by its full 40px height. */}
          <main
            id="main"
            className="flex-1"
            tabIndex={-1}
            style={{ scrollMarginTop: "96px" }}
          >
            {children}
          </main>
          <Footer />
          <StickyBriefCTA />
        </MotionProvider>
      </body>
    </html>
  );
}
